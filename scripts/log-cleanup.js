#!/usr/bin/env node
/*
  Log Cleanup Utility

  Safely manages log files by:
  - Removing oversized log filso ies
  - Archiving old logs (compresses to .tar.gz)
  - Providing statistics
  - Auto-cleanup of old archives
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../logs');
const archiveDir = path.join(logsDir, 'archives');

const CONFIG = {
  MAX_FILE_SIZE_MB: 50,
  MAX_TOTAL_SIZE_MB: 200,
  OLD_LOG_DAYS: 1,  // Archive logs older than 1 day
  ARCHIVE_OLD_LOGS: true,
  ARCHIVE_COMPRESS: true,              // Compress archives with gzip
  DELETE_OLD_ARCHIVES: false,          // Set to true to auto-delete old archives
  MAX_ARCHIVE_DAYS: 30,                // Only used if DELETE_OLD_ARCHIVES is true
  MIN_SIZE_TO_ARCHIVE_KB: 10           // Don't archive tiny files
};

function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${mb.toFixed(2)} MB`;
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
        modified: stat.mtime
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
  if (!CONFIG.ARCHIVE_OLD_LOGS) return [];

  // Ensure archive directory exists
  if (!dryRun && !fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const stats = getLogStats();
  if (!stats) return [];

  const now = Date.now();
  const oldLogThreshold = CONFIG.OLD_LOG_DAYS * 24 * 60 * 60 * 1000;
  const archived = [];

  for (const file of stats.stats) {
    const age = now - file.modified;
    const ageInDays = Math.floor(age / (24 * 60 * 60 * 1000));

    // Check if file is old enough and large enough to archive
    if (age > oldLogThreshold && file.size > CONFIG.MIN_SIZE_TO_ARCHIVE_KB * 1024) {
      const sourcePath = path.join(logsDir, file.name);
      const dateStr = file.modified.toISOString().split('T')[0];
      const archiveName = `${dateStr}_${file.name}${CONFIG.ARCHIVE_COMPRESS ? '.gz' : ''}`;
      const archivePath = path.join(archiveDir, archiveName);

      if (verbose) {
        console.log(`  Archiving ${file.name} (${ageInDays} days old, ${formatBytes(file.size)})`);
      }

      if (!dryRun) {
        try {
          if (CONFIG.ARCHIVE_COMPRESS) {
            // Compress and archive
            const readStream = fs.createReadStream(sourcePath);
            const writeStream = fs.createWriteStream(archivePath);
            const gzip = createGzip({ level: 9 });

            await pipeline(readStream, gzip, writeStream);
            fs.unlinkSync(sourcePath);

            if (verbose) {
              const compressedSize = fs.statSync(archivePath).size;
              const ratio = ((1 - compressedSize / file.size) * 100).toFixed(1);
              console.log(`    ✓ Compressed to ${formatBytes(compressedSize)} (${ratio}% reduction)`);
            }
          } else {
            // Just move to archive
            fs.renameSync(sourcePath, archivePath);
            if (verbose) {
              console.log(`    ✓ Moved to archives/`);
            }
          }

          archived.push({
            original: file.name,
            archived: archiveName,
            size: file.size,
            age: ageInDays
          });
        } catch (e) {
          console.error(`    ✗ Failed to archive: ${e.message}`);
        }
      } else {
        archived.push({
          original: file.name,
          archived: archiveName,
          size: file.size,
          age: ageInDays
        });
      }
    }
  }

  // Clean up old archives (only if configured to do so)
  if (CONFIG.DELETE_OLD_ARCHIVES && fs.existsSync(archiveDir)) {
    const archives = fs.readdirSync(archiveDir);
    const maxArchiveAge = CONFIG.MAX_ARCHIVE_DAYS * 24 * 60 * 60 * 1000;
    let removedCount = 0;

    for (const archive of archives) {
      const archivePath = path.join(archiveDir, archive);
      try {
        const stat = fs.statSync(archivePath);
        const age = now - stat.mtime;

        if (age > maxArchiveAge) {
          if (!dryRun) {
            fs.unlinkSync(archivePath);
          }
          removedCount++;
          if (verbose) {
            const ageInDays = Math.floor(age / (24 * 60 * 60 * 1000));
            console.log(`  Removed old archive: ${archive} (${ageInDays} days old)`);
          }
        }
      } catch (e) {
        // Skip files we can't stat
      }
    }

    if (removedCount > 0 && !verbose) {
      console.log(`  Removed ${removedCount} old archive(s) (>${CONFIG.MAX_ARCHIVE_DAYS} days)`);
    }
  } else if (verbose && fs.existsSync(archiveDir)) {
    // Report archive stats when not deleting
    const archives = fs.readdirSync(archiveDir);
    if (archives.length > 0) {
      let totalArchiveSize = 0;
      archives.forEach(a => {
        try {
          const stat = fs.statSync(path.join(archiveDir, a));
          totalArchiveSize += stat.size;
        } catch (e) {}
      });
      console.log(`  Archive stats: ${archives.length} files, ${formatBytes(totalArchiveSize)} total`);
    }
  }

  return archived;
}

async function cleanupLogs(options = {}) {
  const { dryRun = false, verbose = false } = options;
  const stats = getLogStats();

  if (!stats) return;

  console.log('=== Log Cleanup Utility ===\n');
  console.log(`Total log files: ${stats.count}`);
  console.log(`Total size: ${formatBytes(stats.totalSize)}`);

  if (stats.largestFile) {
    console.log(`Largest file: ${stats.largestFile} (${formatBytes(stats.largestSize)})`);
  }

  console.log(`\nConfiguration:`);
  console.log(`  Max file size: ${CONFIG.MAX_FILE_SIZE_MB} MB`);
  console.log(`  Max total size: ${CONFIG.MAX_TOTAL_SIZE_MB} MB`);
  console.log(`  Archive old logs: ${CONFIG.ARCHIVE_OLD_LOGS ? `Yes (>${CONFIG.OLD_LOG_DAYS} days)` : 'No'}`);
  console.log(`  Compress archives: ${CONFIG.ARCHIVE_COMPRESS ? 'Yes (.gz)' : 'No'}`);
  console.log(`  Delete old archives: ${CONFIG.DELETE_OLD_ARCHIVES ? `Yes (>${CONFIG.MAX_ARCHIVE_DAYS} days)` : 'No (keep forever)'}`);

  // Archive old logs first
  console.log('\n📦 Archiving old logs...');
  const archived = await archiveOldLogs(dryRun, verbose);
  if (archived.length > 0) {
    console.log(`  Archived ${archived.length} file(s):`);
    if (verbose) {
      archived.forEach(a => {
        console.log(`    - ${a.original} -> archives/${a.archived}`);
      });
    }
  } else {
    console.log('  No logs old enough to archive');
  }

  // Check for oversized files
  if (stats.oversized.length > 0) {
    console.log(`\n⚠️  Found ${stats.oversized.length} oversized files:`);

    for (const { file, sizeMB } of stats.oversized) {
      console.log(`  - ${file}: ${sizeMB.toFixed(2)} MB`);

      if (!dryRun) {
        const filePath = path.join(logsDir, file);

        // Truncate instead of delete - keep last 1000 lines
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');

          if (lines.length > 1000) {
            const truncated = [
              '=== LOG TRUNCATED DUE TO SIZE ===',
              `Original size: ${sizeMB.toFixed(2)} MB`,
              `Kept last 1000 lines`,
              `Truncated at: ${new Date().toISOString()}`,
              '==================================',
              '',
              ...lines.slice(-1000)
            ].join('\n');

            fs.writeFileSync(filePath, truncated);
            console.log(`    ✓ Truncated ${file}`);
          }
        } catch (e) {
          console.error(`    ✗ Failed to truncate ${file}: ${e.message}`);
        }
      }
    }

    if (dryRun) {
      console.log('\n(Dry run - no files modified)');
    }
  } else {
    console.log('\n✓ No oversized files found');
  }

  // Check total size
  if (stats.totalSizeMB > CONFIG.MAX_TOTAL_SIZE_MB) {
    console.log(`\n⚠️  Total log size (${stats.totalSizeMB.toFixed(2)} MB) exceeds limit (${CONFIG.MAX_TOTAL_SIZE_MB} MB)`);

    // Remove oldest files until under limit
    const sorted = stats.stats.sort((a, b) => a.modified - b.modified);
    let currentTotal = stats.totalSize;
    const toDelete = [];

    for (const file of sorted) {
      if (currentTotal / (1024 * 1024) <= CONFIG.MAX_TOTAL_SIZE_MB) break;

      toDelete.push(file);
      currentTotal -= file.size;
    }

    if (toDelete.length > 0) {
      console.log(`  Need to remove ${toDelete.length} old files:`);
      for (const file of toDelete) {
        console.log(`    - ${file.name} (${formatBytes(file.size)})`);

        if (!dryRun) {
          try {
            fs.unlinkSync(path.join(logsDir, file.name));
            console.log(`      ✓ Deleted`);
          } catch (e) {
            console.error(`      ✗ Failed: ${e.message}`);
          }
        }
      }

      if (dryRun) {
        console.log('\n(Dry run - no files deleted)');
      }
    }
  }

  // Show top 5 largest files
  if (verbose && stats.stats.length > 0) {
    console.log('\n📊 Top 5 largest log files:');
    stats.stats.slice(0, 5).forEach((file, i) => {
      const age = Math.floor((Date.now() - file.modified) / (1000 * 60 * 60 * 24));
      console.log(`  ${i + 1}. ${file.name}: ${formatBytes(file.size)} (${age} days old)`);
    });
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
Log Cleanup Utility

Usage: node scripts/log-cleanup.js [options]

Options:
  -d, --dry-run   Preview what would be done without making changes
  -v, --verbose   Show detailed statistics
  -h, --help      Show this help message

Configuration:
  Old logs are archived after ${CONFIG.OLD_LOG_DAYS} days
  Archives are compressed: ${CONFIG.ARCHIVE_COMPRESS ? 'Yes (.gz)' : 'No'}
  Delete old archives: ${CONFIG.DELETE_OLD_ARCHIVES ? `Yes (after ${CONFIG.MAX_ARCHIVE_DAYS} days)` : 'No (keep forever)'}

Examples:
  node scripts/log-cleanup.js           # Clean up and archive logs
  node scripts/log-cleanup.js -d        # Preview cleanup/archiving
  node scripts/log-cleanup.js -v        # Clean with detailed output
`);
    process.exit(0);
  }

  cleanupLogs({ dryRun, verbose }).catch(err => {
    console.error('Error during cleanup:', err);
    process.exit(1);
  });
}

export { cleanupLogs, getLogStats };