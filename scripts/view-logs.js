#!/usr/bin/env node

/**
 * Log viewer for dev console JSONL logs with full stack support
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '..', 'logs');

// Colors for terminal output
const colors = {
	reset: '\x1b[0m',
	dim: '\x1b[2m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
};

// Level colors
const levelColors = {
	log: colors.green,
	info: colors.blue,
	warn: colors.yellow,
	error: colors.red,
	debug: colors.dim,
};

// Level names
const levelNames = {
	log: 'LOG',
	info: 'INFO',
	warn: 'WARN',
	error: 'ERROR',
	debug: 'DEBUG',
};

function formatTimestamp(ts) {
	// Handle both ISO format and our custom format
	if (typeof ts === 'string' && ts.includes('T')) {
		// Already formatted like "25-09-13T07:31:19"
		return ts.split('T')[1] || ts;
	}
	const date = new Date(ts);
	return date.toTimeString().substring(0, 8);
}

function formatArgs(args) {
	if (!args || !Array.isArray(args)) return '';

	return args
		.map((arg) => {
			if (arg && arg._type === 'Error') {
				return `${arg.name}: ${arg.message}`;
			}
			if (typeof arg === 'object') {
				try {
					return JSON.stringify(arg);
				} catch {
					return '[Object]';
				}
			}
			return String(arg);
		})
		.join(' ');
}

function viewLog(logFile, options = {}) {
	const sessions = new Map();
	const lines = fs
		.readFileSync(logFile, 'utf-8')
		.split('\n')
		.filter((l) => l.trim());

	console.log(`\n${colors.cyan}═══ Log: ${path.basename(logFile)} ═══${colors.reset}\n`);

	for (const line of lines) {
		try {
			const entry = JSON.parse(line);

			// Skip session-only messages or handle specially
			if (entry.session && !entry.level && !entry.args) {
				if (!sessions.has(entry.session)) {
					sessions.set(entry.session, true);
					console.log(
						`${colors.dim}[SESSION ${entry.session}] ${entry.url || 'started'}${colors.reset}`
					);
				}
				continue;
			}

			// Format log entry
			const time = formatTimestamp(entry.ts || entry.t);
			const level = entry.level || entry.l || 'log';
			const levelColor = levelColors[level];
			const levelName = levelNames[level];

			// Format message from args
			const message = formatArgs(entry.args || entry.m);

			// Basic log line
			let output = `${colors.dim}${time}${colors.reset} ${levelColor}[${levelName}]${colors.reset} ${message}`;

			// Add URL path if not root
			const url = entry.url || entry.p;
			if (url && url !== '/' && url !== location?.href) {
				const urlPath = url.includes('://') ? new URL(url).pathname : url;
				if (urlPath !== '/') {
					output += ` ${colors.dim}(${urlPath})${colors.reset}`;
				}
			}

			console.log(output);

			// Show stack trace if present and in verbose mode or for errors
			const stack = entry.stack || entry.st;
			if (stack && (options.verbose || level === 'error')) {
				const stackLines = stack.split('\n');
				for (const stackLine of stackLines) {
					if (stackLine.trim()) {
						// Highlight async ancestry markers
						if (stackLine.includes('[async scheduled at]')) {
							console.log(
								`${colors.cyan}    ── async scheduled at ──${colors.reset}`
							);
						} else {
							console.log(`${colors.dim}    ${stackLine.trim()}${colors.reset}`);
						}
					}
				}
			}
		} catch (e) {
			// Show raw line if parsing fails
			if (options.verbose) {
				console.log(`${colors.dim}[RAW] ${line}${colors.reset}`);
			}
		}
	}

	if (sessions.size > 0) {
		console.log(`\n${colors.dim}Total sessions: ${sessions.size}${colors.reset}`);
	}
}

// Get most recent log file
function getMostRecentLog() {
	if (!fs.existsSync(logsDir)) {
		return null;
	}

	const files = fs
		.readdirSync(logsDir)
		.filter((f) => f.endsWith('.jsonl'))
		.map((f) => ({
			name: f,
			path: path.join(logsDir, f),
			mtime: fs.statSync(path.join(logsDir, f)).mtime,
		}))
		.sort((a, b) => b.mtime - a.mtime);

	return files[0]?.path;
}

// Main
const args = process.argv.slice(2);
const options = {
	verbose: args.includes('-v') || args.includes('--verbose'),
	tail: args.includes('-f') || args.includes('--follow'),
};

// Get log file
let logFile;
if (args.length > 0 && !args[0].startsWith('-')) {
	logFile = path.resolve(args[0]);
} else {
	logFile = getMostRecentLog();
}

if (!logFile || !fs.existsSync(logFile)) {
	console.error('No log file found');
	console.error('Try running the dev server first: npm run dev');
	process.exit(1);
}

// View log
viewLog(logFile, options);

// Follow mode
if (options.tail) {
	console.log(`\n${colors.cyan}Watching for changes...${colors.reset}\n`);

	let lastSize = fs.statSync(logFile).size;
	setInterval(() => {
		const currentSize = fs.statSync(logFile).size;
		if (currentSize > lastSize) {
			// Read new content
			const fd = fs.openSync(logFile, 'r');
			const buffer = Buffer.alloc(currentSize - lastSize);
			fs.readSync(fd, buffer, 0, buffer.length, lastSize);
			fs.closeSync(fd);

			const newLines = buffer
				.toString()
				.split('\n')
				.filter((l) => l.trim());
			for (const line of newLines) {
				try {
					const entry = JSON.parse(line);

					// Skip pure session messages in tail mode
					if (entry.session && !entry.level && !entry.args) continue;

					const time = formatTimestamp(entry.ts || entry.t);
					const level = entry.level || entry.l || 'log';
					const levelColor = levelColors[level];
					const levelName = levelNames[level];
					const message = formatArgs(entry.args || entry.m);

					let output = `${colors.dim}${time}${colors.reset} ${levelColor}[${levelName}]${colors.reset} ${message}`;

					const url = entry.url || entry.p;
					if (url && url !== '/' && url !== location?.href) {
						const urlPath = url.includes('://') ? new URL(url).pathname : url;
						if (urlPath !== '/') {
							output += ` ${colors.dim}(${urlPath})${colors.reset}`;
						}
					}

					console.log(output);

					const stack = entry.stack || entry.st;
					if (stack && (options.verbose || level === 'error')) {
						const stackLines = stack.split('\n');
						for (const stackLine of stackLines) {
							if (stackLine.trim()) {
								if (stackLine.includes('[async scheduled at]')) {
									console.log(
										`${colors.cyan}    ── async scheduled at ──${colors.reset}`
									);
								} else {
									console.log(
										`${colors.dim}    ${stackLine.trim()}${colors.reset}`
									);
								}
							}
						}
					}
				} catch (e) {
					// Ignore parse errors in tail mode unless verbose
					if (options.verbose) {
						console.log(`${colors.dim}[PARSE ERROR] ${e.message}${colors.reset}`);
					}
				}
			}

			lastSize = currentSize;
		}
	}, 500);
}
