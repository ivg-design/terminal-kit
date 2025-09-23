#!/usr/bin/env node
/*
  CDP Console Mirror (ESM)
  Launches a Chromium instance and mirrors ALL browser console/Log domain entries,
  network failures, page errors, and unhandled rejections to local log files.

  Requirements: npm i -D puppeteer

  Usage:
    DEV_URL=http://localhost:3007 npm run dev:cdp   (see package.json script)
*/
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

async function main() {

  const url = process.env.DEV_URL || 'http://localhost:3007';
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  // Local timestamp
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${String(now.getFullYear()).slice(-2)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  const cleanPath = path.join(logsDir, `cdp-console-${ts}.log`);
  const clean = fs.createWriteStream(cleanPath, { flags: 'a' });

  const time = () => new Date().toTimeString().substring(0, 8);
  const writeClean = (lvl, msg) => clean.write(`${time()} [${lvl.padEnd(5)}] ${msg}\n`);

  writeClean('INFO', `CDP session started -> ${url}`);

  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--auto-open-devtools-for-tabs'] });
  const page = await browser.newPage();

  // Attach CDP session to capture Log domain (browser-level messages: security, network)
  const client = await page.target().createCDPSession();
  await client.send('Log.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');

  client.on('Log.entryAdded', ({ entry }) => {
    const record = { ts: new Date().toISOString(), src: entry.source, level: entry.level, text: entry.text, url: entry.url, line: entry.lineNumber, stack: entry.stackTrace };
    writeClean((entry.level || 'log').toUpperCase(), `${entry.source || 'log'}: ${entry.text}`);
    if (entry.stackTrace && entry.stackTrace.callFrames) {
      entry.stackTrace.callFrames.slice(0, 10).forEach((f) => clean.write(`         at ${f.functionName || '<anonymous>'} (${f.url}:${f.lineNumber}:${f.columnNumber})\n`));
    }
  });

  page.on('console', (msg) => {
    const rec = { ts: new Date().toISOString(), type: msg.type(), text: msg.text(), location: msg.location() };
    writeClean(msg.type().toUpperCase(), msg.text());
  });

  page.on('pageerror', (err) => {
    writeClean('ERROR', `${err.name}: ${err.message}`);
    if (err.stack) err.stack.split('\n').slice(1, 15).forEach((l) => clean.write(`         ${l.trim()}\n`));
  });

  page.on('requestfailed', (req) => {
    const failure = req.failure();
    const url = req.url();
    const errText = failure?.errorText || '';
    // Ignore our own log POSTs and benign aborts
    if (url.endsWith('/__logs')) return;
    if (errText === 'net::ERR_ABORTED') return; // navigations/canceled fetches
    const f = { url, method: req.method(), failure, resourceType: req.resourceType() };
    writeClean('ERROR', `requestfailed ${req.method()} ${url} ${errText}`);
  });

  // Unhandled rejections (Runtime domain)
  client.on('Runtime.exceptionThrown', (evt) => {
    const details = evt.exceptionDetails || {};
    writeClean('ERROR', `Runtime exception: ${details.text || details.exception?.description || ''}`);
  });

  // Navigate with retries until the dev server is up
  async function gotoWithRetry(target, max = 40, delayMs = 500) {
    for (let i = 0; i < max; i++) {
      try {
        await target.goto(url, { waitUntil: 'domcontentloaded' });
        return;
      } catch (e) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
    throw new Error(`Unable to reach ${url} after ${max} attempts`);
  }

  await gotoWithRetry(page);

  // Keep process alive
  process.on('SIGINT', async () => {
    writeClean('INFO', 'CDP session ending');
    await browser.close();
    clean.end();
    process.exit(0);
  });
}
main().catch((err) => {
  console.error('[cdp-console-mirror] fatal:', err);
  process.exit(1);
});
