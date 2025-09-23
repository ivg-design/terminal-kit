#!/usr/bin/env node
/*
  Log Cleanup Utility with Bundled Archives

  Features:
  - Archives multiple logs into single dated tar.gz file
  - Day setting: 1 = keep today only, 2 = keep today and yesterday, etc.
  - Automatic compression and bundling
  - Archive naming with date range
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import * as tar from 'tar';
import { promisify } from 'node:util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../logs');
const archiveDir = path.join(logsDir, 'archives');

const CONFIG = {
  MAX_FILE_SIZE_MB: 50,
  MAX_TOTAL_SIZE_MB: 200,
  KEEP_DAYS: 1,                        // 1 = keep today only, 2 = keep today and yesterday
  ARCHIVE_OLD_LOGS: true,
  BUNDLE_ARCHIVES: true,                // Bundle multiple logs into single archive
  COMPRESS_ARCHIVES: true,              // Compress archives with gzip
  DELETE_OLD_ARCHIVES: false,           // Set to true to auto-delete old archives
  MAX_ARCHIVE_DAYS: 30,                 // Only used if DELETE_OLD_ARCHIVES is true
  MIN_SIZE_TO_ARCHIVE_KB: 1             // Don't archive tiny files
};

function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${mb.toFixed(2)} MB`;
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getDateRange(files) {
  if (files.length === 0) return { start: null, end: null };

  const dates = files.map(f => f.modified).sort((a, b) => a - b);
  return {
    start: new Date(dates[0]),
    end: new Date(dates[dates.length - 1])
  };
}

function isOlderThanDays(date, days) {
  const now = new Date();
  // Set to start of today
  now.setHours(0, 0, 0, 0);

  const fileDate = new Date(date);
  fileDate.setHours(0, 0, 0, 0);

  const diffTime = now - fileDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If KEEP_DAYS is 1, archive everything that's not from today (diffDays >= 1)
  // If KEEP_DAYS is 2, archive everything older than yesterday (diffDays >= 2)
  return diffDays >= days;
}

function getLogStats() {
  if (!fs.existsSync(logsDir)) {
    console.log('No logs directory found');
    return null;
  }

  const files = fs.readdirSync(logsDir);
  const logFiles = files.filter(f => f.endsWith('.log'));

  let totalSize = 0;
  let largestFile = null;
  let largestSize = 0;
  const oversized = [];
  const stats = [];

  for (const file of logFiles) {
    const filePath = path.join(logsDir, file);
    try {
      const stat = fs.statSync(filePath);
      const sizeMB = stat.size / (1024 * 1024);

      stats.push({
        name: file,
        size: stat.size,
        sizeMB,
        created: stat.birthtime,
        modified: stat.mtime,
        path: filePath
      });

      totalSize += stat.size;

      if (stat.size > largestSize) {
        largestSize = stat.size;
        largestFile = file;
      }

      if (sizeMB > CONFIG.MAX_FILE_SIZE_MB) {
        oversized.push({ file, size: stat.size, sizeMB });
      }
    } catch (e) {
      // Skip files we can't stat
    }
  }

  return {
    count: logFiles.length,
    totalSize,
    totalSizeMB: totalSize / (1024 * 1024),
    largestFile,
    largestSize,
    oversized,
    stats: stats.sort((a, b) => b.size - a.size)
  };
}

async function archiveOldLogs(dryRun = false, verbose = false) {
  if (!CONFIG.ARCHIVE_OLD_LOGS) return null;

  // Ensure archive directory exists
  if (!dryRun && !fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const stats = getLogStats();
  if (!stats) return null;

  // Find logs to archive
  const toArchive = [];
  const toKeep = [];

  for (const file of stats.stats) {
    if (isOlderThanDays(file.modified, CONFIG.KEEP_DAYS) &&
        file.size > CONFIG.MIN_SIZE_TO_ARCHIVE_KB * 1024) {
      toArchive.push(file);
    } else {
      toKeep.push(file);
    }
  }

  if (toArchive.length === 0) {
    return { archived: [], kept: toKeep.length };
  }

  // Get date range for archive name
  const dateRange = getDateRange(toArchive);
  const startDate = formatDate(dateRange.start);
  const endDate = formatDate(dateRange.end);

  let archiveName;
  if (startDate === endDate) {
    archiveName = `logs_${startDate}.tar${CONFIG.COMPRESS_ARCHIVES ? '.gz' : ''}`;
  } else {
    archiveName = `logs_${startDate}_to_${endDate}.tar${CONFIG.COMPRESS_ARCHIVES ? '.gz' : ''}`;
  }

  const archivePath = path.join(archiveDir, archiveName);

  if (verbose) {
    console.log(`  Creating archive: ${archiveName}`);
    console.log(`  Files to archive: ${toArchive.length}`);
    const totalSize = toArchive.reduce((sum, f) => sum + f.size, 0);
    console.log(`  Total size: ${formatBytes(totalSize)}`);
  }

  if (!dryRun) {
    try {
      if (CONFIG.BUNDLE_ARCHIVES) {
        // Create tar archive with all files
        const filesToTar = toArchive.map(f => ({
          file: path.basename(f.path),
          cwd: logsDir
        }));

        await tar.c(
          {
            gzip: CONFIG.COMPRESS_ARCHIVES,
            file: archivePath,
            cwd: logsDir
          },
          toArchive.map(f => path.basename(f.path))
        );

        // Delete original files after successful archiving
        for (const file of toArchive) {
          fs.unlinkSync(file.path);
        }

        if (verbose) {
          const archiveSize = fs.statSync(archivePath).size;
          const originalSize = toArchive.reduce((sum, f) => sum + f.size, 0);
          const ratio = ((1 - archiveSize / originalSize) * 100).toFixed(1);
          console.log(`  ✓ Archive created: ${formatBytes(archiveSize)} (${ratio}% compression)`);
        }
      } else {
        // Old behavior - individual file compression
        for (const file of toArchive) {
          const dateStr = formatDate(file.modified);
          const individualArchiveName = `${dateStr}_${file.name}${CONFIG.COMPRESS_ARCHIVES ? '.gz' : ''}`;
          const individualArchivePath = path.join(archiveDir, individualArchiveName);

          if (CONFIG.COMPRESS_ARCHIVES) {
            const readStream = fs.createReadStream(file.path);
            const writeStream = fs.createWriteStream(individualArchivePath);
            const gzip = createGzip({ level: 9 });
            await pipeline(readStream, gzip, writeStream);
          } else {
            fs.renameSync(file.path, individualArchivePath);
          }
          fs.unlinkSync(file.path);
        }
      }

      return {
        archived: toArchive.map(f => f.name),
        archiveName,
        kept: toKeep.length,
        totalSize: toArchive.reduce((sum, f) => sum + f.size, 0)
      };
    } catch (e) {
      console.error(`  ✗ Failed to archive: ${e.message}`);
      return null;
    }
  } else {
    // Dry run
    return {
      archived: toArchive.map(f => f.name),
      archiveName,
      kept: toKeep.length,
      totalSize: toArchive.reduce((sum, f) => sum + f.size, 0)
    };
  }
}

async function cleanupOldArchives(dryRun = false, verbose = false) {
  if (!CONFIG.DELETE_OLD_ARCHIVES || !fs.existsSync(archiveDir)) return 0;

  const archives = fs.readdirSync(archiveDir);
  const now = Date.now();
  const maxAge = CONFIG.MAX_ARCHIVE_DAYS * 24 * 60 * 60 * 1000;
  let removedCount = 0;

  for (const archive of archives) {
    const archivePath = path.join(archiveDir, archive);
    try {
      const stat = fs.statSync(archivePath);
      if (now - stat.mtime > maxAge) {
        if (!dryRun) {
          fs.unlinkSync(archivePath);
        }
        removedCount++;
        if (verbose) {
          const ageInDays = Math.floor((now - stat.mtime) / (24 * 60 * 60 * 1000));
          console.log(`  Removed old archive: ${archive} (${ageInDays} days old)`);
        }
      }
    } catch (e) {
      // Skip
    }
  }

  return removedCount;
}

async function cleanupLogs(options = {}) {
  const { dryRun = false, verbose = false } = options;
  const stats = getLogStats();

  if (!stats) return;

  console.log('=== Log Cleanup Utility (Bundled Archives) ===\n');
  console.log(`Total log files: ${stats.count}`);
  console.log(`Total size: ${formatBytes(stats.totalSize)}`);

  if (stats.largestFile) {
    console.log(`Largest file: ${stats.largestFile} (${formatBytes(stats.largestSize)})`);
  }

  console.log(`\nConfiguration:`);
  console.log(`  Keep logs from: Last ${CONFIG.KEEP_DAYS} day(s) (today${CONFIG.KEEP_DAYS > 1 ? ' and ' + (CONFIG.KEEP_DAYS - 1) + ' previous day(s)' : ' only'})`);
  console.log(`  Bundle archives: ${CONFIG.BUNDLE_ARCHIVES ? 'Yes (single tar file)' : 'No (individual files)'}`);
  console.log(`  Compress archives: ${CONFIG.COMPRESS_ARCHIVES ? 'Yes (.gz)' : 'No'}`);
  console.log(`  Delete old archives: ${CONFIG.DELETE_OLD_ARCHIVES ? `Yes (>${CONFIG.MAX_ARCHIVE_DAYS} days)` : 'No (keep forever)'}`);

  // Archive old logs
  console.log('\n📦 Archiving old logs...');
  const archiveResult = await archiveOldLogs(dryRun, verbose);

  if (archiveResult) {
    if (archiveResult.archived.length > 0) {
      console.log(`  Archived ${archiveResult.archived.length} file(s) into: ${archiveResult.archiveName}`);
      console.log(`  Original size: ${formatBytes(archiveResult.totalSize)}`);
      console.log(`  Keeping ${archiveResult.kept} recent log(s)`);

      if (verbose) {
        console.log(`  Archived files:`);
        archiveResult.archived.forEach(f => console.log(`    - ${f}`));
      }
    } else {
      console.log(`  No logs old enough to archive (keeping last ${CONFIG.KEEP_DAYS} day(s))`);
    }
  } else {
    console.log(`  No logs to archive`);
  }

  // Clean up old archives
  if (CONFIG.DELETE_OLD_ARCHIVES) {
    const removedCount = await cleanupOldArchives(dryRun, verbose);
    if (removedCount > 0) {
      console.log(`  Removed ${removedCount} old archive(s)`);
    }
  }

  // Check for oversized files
  if (stats.oversized.length > 0) {
    console.log(`\n⚠️  Found ${stats.oversized.length} oversized file(s) exceeding ${CONFIG.MAX_FILE_SIZE_MB}MB`);
    for (const { file, sizeMB } of stats.oversized) {
      console.log(`  - ${file}: ${sizeMB.toFixed(2)} MB`);
    }
  }

  // Show archive directory stats
  if (fs.existsSync(archiveDir)) {
    const archives = fs.readdirSync(archiveDir);
    if (archives.length > 0) {
      let totalArchiveSize = 0;
      archives.forEach(a => {
        try {
          totalArchiveSize += fs.statSync(path.join(archiveDir, a)).size;
        } catch (e) {}
      });
      console.log(`\n📁 Archive stats: ${archives.length} file(s), ${formatBytes(totalArchiveSize)} total`);
    }
  }

  console.log('\n✓ Cleanup complete');
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const help = args.includes('--help') || args.includes('-h');

  if (help) {
    console.log(`
Log Cleanup Utility with Bundled Archives

Usage: node scripts/log-cleanup-bundled.js [options]

Options:
  -d, --dry-run   Preview what would be done without making changes
  -v, --verbose   Show detailed statistics
  -h, --help      Show this help message

Configuration:
  Keep logs: Last ${CONFIG.KEEP_DAYS} day(s)
    - 1 = Keep today only, archive everything else
    - 2 = Keep today and yesterday, archive older

  Archives are bundled: ${CONFIG.BUNDLE_ARCHIVES ? 'Yes (single tar file per date range)' : 'No'}
  Archives are compressed: ${CONFIG.COMPRESS_ARCHIVES ? 'Yes (.tar.gz)' : 'No (.tar)'}
  Delete old archives: ${CONFIG.DELETE_OLD_ARCHIVES ? `Yes (after ${CONFIG.MAX_ARCHIVE_DAYS} days)` : 'No (keep forever)'}

Archive naming:
  - Single day: logs_YYYY-MM-DD.tar.gz
  - Date range: logs_YYYY-MM-DD_to_YYYY-MM-DD.tar.gz

Examples:
  node scripts/log-cleanup-bundled.js           # Archive old logs
  node scripts/log-cleanup-bundled.js -d        # Preview what would be archived
  node scripts/log-cleanup-bundled.js -v        # Verbose output
`);
    process.exit(0);
  }

  // Check if tar module is available
  try {
    await import('tar');
  } catch (e) {
    console.error('Error: tar module not found. Please install it:');
    console.error('  npm install tar');
    process.exit(1);
  }

  cleanupLogs({ dryRun, verbose }).catch(err => {
    console.error('Error during cleanup:', err);
    process.exit(1);
  });
}

export { cleanupLogs, getLogStats };