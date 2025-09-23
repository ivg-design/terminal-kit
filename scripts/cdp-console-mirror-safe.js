#!/usr/bin/env node
/*
  CDP Console Mirror with Safety Features (ESM)

  Features:
  - Error throttling to prevent error storms
  - Deduplication of repeated errors
  - Maximum file size limits
  - Error rate limiting
  - Automatic log rotation
  - Memory-efficient circular buffer

  Requirements: npm i -D puppeteer

  Usage:
    DEV_URL=http://localhost:3007 npm run dev:cdp   (see package.json script)
*/
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import puppeteer from 'puppeteer';

// Safety configuration
const CONFIG = {
  MAX_FILE_SIZE_MB: 10,                    // Maximum log file size in MB
  MAX_FILE_SIZE: 10 * 1024 * 1024,        // In bytes
  ERROR_THROTTLE_MS: 100,                  // Minimum ms between identical errors
  ERROR_RATE_LIMIT: 100,                   // Max errors per window
  ERROR_RATE_WINDOW_MS: 1000,              // Rate limit window (1 second)
  DEDUP_CACHE_SIZE: 1000,                  // Max unique errors to track
  DEDUP_WINDOW_MS: 5000,                   // Time window for deduplication
  IDENTICAL_ERROR_THRESHOLD: 10,           // After this many identical errors, suppress
  STACK_TRACE_LIMIT: 5,                    // Max stack frames to log
  LOG_ROTATION_CHECK_INTERVAL: 10000,      // Check file size every 10 seconds
  SUMMARY_INTERVAL_MS: 30000,              // Report summary every 30 seconds
};

class SafeLogWriter {
  constructor(logPath) {
    this.logPath = logPath;
    this.stream = null;
    this.bytesWritten = 0;
    this.errorCount = 0;
    this.suppressedCount = 0;
    this.lastRotation = Date.now();
    this.rotationCount = 0;

    // Error deduplication
    this.errorCache = new Map(); // hash -> { count, firstSeen, lastSeen, text }
    this.recentErrors = [];      // Circular buffer for rate limiting

    // Throttling
    this.lastErrorTime = 0;
    this.errorRateWindow = [];

    // Initialize stream
    this.createNewStream();

    // Start periodic checks
    this.startPeriodicChecks();
  }

  createNewStream() {
    if (this.stream) {
      this.stream.end();
    }

    // Add rotation number if needed
    let finalPath = this.logPath;
    if (this.rotationCount > 0) {
      const ext = path.extname(this.logPath);
      const base = this.logPath.slice(0, -ext.length);
      finalPath = `${base}.${this.rotationCount}${ext}`;
    }

    this.stream = fs.createWriteStream(finalPath, { flags: 'a' });
    this.bytesWritten = 0;

    // Write rotation header
    if (this.rotationCount > 0) {
      this.writeRaw(`\n=== LOG ROTATED (${this.rotationCount}) at ${new Date().toISOString()} ===\n`);
      this.writeRaw(`Previous log exceeded ${CONFIG.MAX_FILE_SIZE_MB}MB limit\n\n`);
    }
  }

  hashError(level, message, stack = '') {
    // Create a hash of the error for deduplication
    const content = `${level}:${message}:${stack?.slice(0, 200) || ''}`;
    return crypto.createHash('md5').update(content).digest('hex');
  }

  shouldSuppress(level, message, stack) {
    // Check if we should suppress this error
    const now = Date.now();

    // 1. Rate limiting - too many errors in time window
    this.errorRateWindow = this.errorRateWindow.filter(
      t => now - t < CONFIG.ERROR_RATE_WINDOW_MS
    );

    // Don't add to window yet, just check if we're over limit
    if (this.errorRateWindow.length >= CONFIG.ERROR_RATE_LIMIT) {
      this.suppressedCount++;
      // Log a sample every 10 suppressions with full stack
      if (this.suppressedCount % 10 === 0) {
        this.writeRaw(`\n[SUPPRESSION SAMPLE] Suppressed ${this.suppressedCount} errors. Sample:\n`);
        this.writeRaw(`${message}\n`);
        if (stack) {
          const frames = typeof stack === 'string' ? stack.split('\n') : [];
          frames.forEach(line => this.writeRaw(`         ${line.trim()}\n`));
        }
      }
      return true;
    }

    // 2. Deduplication - same error too frequently
    const hash = this.hashError(level, message, stack);
    const cached = this.errorCache.get(hash);

    if (cached) {
      const timeSinceLastError = now - cached.lastSeen;

      // If identical error happened very recently, suppress
      if (timeSinceLastError < CONFIG.ERROR_THROTTLE_MS) {
        cached.count++;
        cached.lastSeen = now;
        this.suppressedCount++;
        return true;
      }

      // If we've seen this error too many times, start suppressing
      if (cached.count >= CONFIG.IDENTICAL_ERROR_THRESHOLD) {
        cached.count++;
        cached.lastSeen = now;

        // Only log every 10th occurrence after threshold
        if (cached.count % 10 !== 0) {
          this.suppressedCount++;
          return true;
        }

        // When we do log it, include the count
        message = `${message} [occurred ${cached.count} times]`;
      }

      cached.count++;
      cached.lastSeen = now;
    } else {
      // New error - add to cache
      this.errorCache.set(hash, {
        count: 1,
        firstSeen: now,
        lastSeen: now,
        text: message.slice(0, 100)
      });

      // Maintain cache size limit
      if (this.errorCache.size > CONFIG.DEDUP_CACHE_SIZE) {
        // Remove oldest entries
        const sortedEntries = Array.from(this.errorCache.entries())
          .sort((a, b) => a[1].lastSeen - b[1].lastSeen);

        for (let i = 0; i < 100; i++) {
          this.errorCache.delete(sortedEntries[i][0]);
        }
      }
    }

    // 3. Clean up old dedup entries
    for (const [hash, data] of this.errorCache.entries()) {
      if (now - data.lastSeen > CONFIG.DEDUP_WINDOW_MS) {
        this.errorCache.delete(hash);
      }
    }

    // Don't add to window here - it's added in write() method
    return false;
  }

  writeRaw(text) {
    if (!this.stream || this.stream.destroyed) return;

    const bytes = Buffer.byteLength(text, 'utf8');

    // Check if we need to rotate
    if (this.bytesWritten + bytes > CONFIG.MAX_FILE_SIZE) {
      this.rotate();
    }

    this.stream.write(text);
    this.bytesWritten += bytes;
  }

  write(level, message, stack = null) {
    // Check suppression for errors
    if (level === 'ERROR' || level === 'WARN') {
      const shouldSuppressThisError = this.shouldSuppress(level, message, stack);
      if (shouldSuppressThisError) {
        return;
      }
      this.errorCount++;

      // Add to rate window AFTER checking suppression
      const now = Date.now();
      this.errorRateWindow.push(now);
      this.lastErrorTime = now;
    }

    const time = new Date().toTimeString().substring(0, 8);
    this.writeRaw(`${time} [${level.padEnd(5)}] ${message}\n`);

    // Limited stack trace
    if (stack && typeof stack === 'string') {
      const frames = stack.split('\n').slice(0, CONFIG.STACK_TRACE_LIMIT);
      frames.forEach(line => this.writeRaw(`         ${line.trim()}\n`));
    } else if (stack && Array.isArray(stack)) {
      stack.slice(0, CONFIG.STACK_TRACE_LIMIT).forEach(frame => {
        this.writeRaw(`         at ${frame.functionName || '<anonymous>'} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})\n`);
      });
    }
  }

  rotate() {
    this.rotationCount++;
    this.writeSummary();
    this.createNewStream();
    this.lastRotation = Date.now();
  }

  writeSummary() {
    const now = new Date().toISOString();
    this.writeRaw(`\n=== ERROR SUMMARY at ${now} ===\n`);
    this.writeRaw(`Total errors logged: ${this.errorCount}\n`);
    this.writeRaw(`Errors suppressed: ${this.suppressedCount}\n`);
    this.writeRaw(`Unique error patterns: ${this.errorCache.size}\n`);

    // Top errors
    if (this.errorCache.size > 0) {
      const topErrors = Array.from(this.errorCache.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);

      this.writeRaw(`\nTop 5 errors:\n`);
      topErrors.forEach(([hash, data], i) => {
        this.writeRaw(`  ${i + 1}. "${data.text}" - ${data.count} occurrences\n`);
      });
    }

    this.writeRaw(`===========================\n\n`);
  }

  startPeriodicChecks() {
    // Periodic file size check
    setInterval(() => {
      try {
        const stats = fs.statSync(this.logPath);
        if (stats.size > CONFIG.MAX_FILE_SIZE) {
          this.rotate();
        }
      } catch (e) {
        // File might not exist yet
      }
    }, CONFIG.LOG_ROTATION_CHECK_INTERVAL);

    // Periodic summary
    setInterval(() => {
      if (this.errorCount > 0 || this.suppressedCount > 0) {
        this.writeSummary();

        // Reset counters
        this.suppressedCount = 0;
      }
    }, CONFIG.SUMMARY_INTERVAL_MS);
  }

  resetErrorTracking() {
    // Reset all error tracking stats for new page load
    this.errorCount = 0;
    this.suppressedCount = 0;
    this.errorCache.clear();
    this.recentErrors = [];
    this.errorRateWindow = [];
    this.lastErrorTime = 0;
    this.writeRaw('\n=== Error tracking reset (page navigation) ===\n\n');
  }

  close() {
    this.writeSummary();
    if (this.stream) {
      this.stream.end();
    }
  }
}

async function main() {
  const url = process.env.DEV_URL || 'http://localhost:3007';
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  // Local timestamp
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${String(now.getFullYear()).slice(-2)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  const logPath = path.join(logsDir, `cdp-console-${ts}.log`);
  const logger = new SafeLogWriter(logPath);

  console.log(`[CDP Console Mirror] Starting with safety features enabled`);
  console.log(`  Max file size: ${CONFIG.MAX_FILE_SIZE_MB}MB`);
  console.log(`  Error rate limit: ${CONFIG.ERROR_RATE_LIMIT} per ${CONFIG.ERROR_RATE_WINDOW_MS}ms`);
  console.log(`  Dedup threshold: ${CONFIG.IDENTICAL_ERROR_THRESHOLD} identical errors`);
  console.log(`  Log file: ${logPath}`);

  logger.write('INFO', `CDP session started -> ${url}`);
  logger.write('INFO', `Safety features: throttling=${CONFIG.ERROR_THROTTLE_MS}ms, rate_limit=${CONFIG.ERROR_RATE_LIMIT}/${CONFIG.ERROR_RATE_WINDOW_MS}ms, max_size=${CONFIG.MAX_FILE_SIZE_MB}MB`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--auto-open-devtools-for-tabs']
  });

  const page = await browser.newPage();

  // Attach CDP session
  const client = await page.target().createCDPSession();
  await client.send('Log.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');

  // Track vite reconnections to detect hot reload loops
  let viteReconnectCount = 0;
  let lastViteReconnect = 0;

  client.on('Log.entryAdded', ({ entry }) => {
    // Special handling for vite messages
    if (entry.text && entry.text.includes('[vite]')) {
      const now = Date.now();
      if (entry.text.includes('connecting') || entry.text.includes('connected')) {
        if (now - lastViteReconnect < 1000) {
          viteReconnectCount++;
          if (viteReconnectCount > 5) {
            logger.write('WARN', `Rapid Vite reconnections detected (${viteReconnectCount} times) - possible hot reload loop`);
          }
        } else {
          viteReconnectCount = 0;
        }
        lastViteReconnect = now;
      }
    }

    const level = (entry.level || 'log').toUpperCase();
    const message = `${entry.source || 'log'}: ${entry.text}`;
    logger.write(level, message, entry.stackTrace?.callFrames);
  });

  page.on('console', (msg) => {
    // Skip debug messages in production
    if (msg.type() === 'debug' && process.env.NODE_ENV === 'production') return;

    logger.write(msg.type().toUpperCase(), msg.text());
  });

  page.on('pageerror', (err) => {
    logger.write('ERROR', `${err.name}: ${err.message}`, err.stack);
  });

  // Track if server is ready
  let serverReady = false;

  page.on('requestfailed', (req) => {
    const failure = req.failure();
    const url = req.url();
    const errText = failure?.errorText || '';

    // Ignore our own log POSTs and benign aborts
    if (url.endsWith('/__logs')) return;
    if (errText === 'net::ERR_ABORTED') return;

    // Don't log connection failures during startup
    if (!serverReady && errText === 'net::ERR_CONNECTION_REFUSED') return;

    logger.write('ERROR', `requestfailed ${req.method()} ${url} ${errText}`);
  });

  // Unhandled rejections
  client.on('Runtime.exceptionThrown', (evt) => {
    const details = evt.exceptionDetails || {};
    logger.write('ERROR', `Runtime exception: ${details.text || details.exception?.description || ''}`);
  });

  // Reset error tracking on page navigation/reload
  client.on('Page.frameNavigated', async (evt) => {
    if (evt.frame.parentId === undefined) {
      // Main frame navigation - reset error stats
      logger.write('INFO', 'Page navigated, resetting error tracking and re-enabling CDP protocols');
      logger.resetErrorTracking();

      // Re-enable CDP protocols after navigation
      try {
        await client.send('Log.enable');
        await client.send('Runtime.enable');
        await client.send('Network.enable');
        logger.write('INFO', 'CDP protocols re-enabled after navigation');
      } catch (err) {
        logger.write('ERROR', `Failed to re-enable CDP protocols: ${err.message}`);
      }
    }
  });

  client.on('Runtime.executionContextsCleared', async () => {
    // Page is reloading - reset error stats
    logger.write('INFO', 'Page reloading, resetting error tracking');
    logger.resetErrorTracking();

    // Re-enable CDP protocols after context cleared
    // Wait a bit for the new context to be created
    setTimeout(async () => {
      try {
        await client.send('Log.enable');
        await client.send('Runtime.enable');
        await client.send('Network.enable');
        logger.write('INFO', 'CDP protocols re-enabled after reload');
      } catch (err) {
        logger.write('ERROR', `Failed to re-enable CDP protocols after reload: ${err.message}`);
      }
    }, 100);
  });

  // Navigate with retries and better startup handling
  async function gotoWithRetry(target, max = 60, delayMs = 1000) {
    logger.write('INFO', `Waiting for server at ${url}...`);

    for (let i = 0; i < max; i++) {
      try {
        await target.goto(url, { waitUntil: 'domcontentloaded' });
        serverReady = true;
        logger.write('INFO', 'Server is ready, page loaded successfully');
        return;
      } catch (e) {
        // Show progress every 5 seconds
        if (i > 0 && i % 5 === 0) {
          logger.write('INFO', `Still waiting for server... (${i}/${max})`);
        }
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    throw new Error(`Unable to reach ${url} after ${max} attempts`);
  }

  await gotoWithRetry(page);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    logger.write('INFO', 'CDP session ending');
    logger.close();
    await browser.close();
    process.exit(0);
  });

  // Emergency shutdown on uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('[CDP Console Mirror] Fatal error:', err);
    logger.write('FATAL', `Process error: ${err.message}`);
    logger.close();
    process.exit(1);
  });
}

main().catch((err) => {
  console.error('[cdp-console-mirror] fatal:', err);
  process.exit(1);
});