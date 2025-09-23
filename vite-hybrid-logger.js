/**
 * Hybrid logging plugin that combines:
 * - vite-console-forward-plugin for terminal output
 * - JSONL logging for full data
 * - Clean formatted log file for human reading
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { consoleForwardPlugin } from 'vite-console-forward-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI color codes for terminal
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

const levelColors = {
	log: colors.green,
	info: colors.blue,
	warn: colors.yellow,
	error: colors.red,
	debug: colors.dim,
	command: colors.cyan,  // Add color for console commands
};

class LogFileWriter {
	constructor(logPath) {
		this.logPath = logPath;
		this.stream = fs.createWriteStream(logPath, { flags: 'a' });
		this.sessions = new Map();
		
		// Write header
		const now = new Date();
		this.stream.write(`\n${'='.repeat(60)}\n`);
		this.stream.write(`Session started: ${now.toLocaleString()}\n`);
		this.stream.write(`${'='.repeat(60)}\n\n`);
	}
	
	formatTime(timestamp) {
		if (typeof timestamp === 'string' && timestamp.includes('T')) {
			// ISO string - extract time part and remove Z
			const timePart = timestamp.split('T')[1] || timestamp;
			return timePart.replace('Z', '').substring(0, 8);
		}
		return new Date(timestamp).toTimeString().substring(0, 8);
	}
	
	formatArgs(args) {
		if (!args || !Array.isArray(args)) return '';
		
		return args.map(arg => {
			if (arg && arg._type === 'Error') {
				return `${arg.name}: ${arg.message}`;
			}
			if (typeof arg === 'object') {
				try {
					// Format objects/arrays as single line for cleaner logs
					return JSON.stringify(arg);
				} catch {
					return '[Object]';
				}
			}
			return String(arg);
		}).join(' ');
	}
	
	write(entry) {
		// Skip pure session messages
		if (entry.session && !entry.level && !entry.args) {
			if (!this.sessions.has(entry.session)) {
				this.sessions.set(entry.session, true);
				this.stream.write(`[NEW SESSION ${entry.session}]\n`);
			}
			return;
		}
		
		const time = this.formatTime(entry.ts || entry.t);
		const level = (entry.level || entry.l || 'log').toUpperCase().padEnd(5);
		const message = this.formatArgs(entry.args || entry.m);
		
		// Special formatting for console commands
		if (entry.level === 'command') {
			this.stream.write(`${time} [CMD  ] ${message}\n`);
			return;
		}
		
		// Write main log line
		this.stream.write(`${time} [${level}] ${message}\n`);
		
		// Write stack trace for errors or if stack exists
		const stack = entry.stack || entry.st;
		if (stack && (entry.level === 'error' || entry.level === 'warn')) {
			const lines = stack.split('\n');
			let inAsyncSection = false;
			
			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed) continue;
				
				if (trimmed.includes('[async scheduled at]')) {
					this.stream.write('         ── async ancestry ──\n');
					inAsyncSection = true;
				} else {
					// Indent stack trace lines
					this.stream.write(`         ${trimmed}\n`);
				}
			}
			this.stream.write('\n');
		}
	}
	
	close() {
		this.stream.write(`\nSession ended: ${new Date().toLocaleString()}\n`);
		this.stream.write(`${'='.repeat(60)}\n`);
		this.stream.end();
	}
}

export default function hybridLogger(options = {}) {
	// Create local timestamp in YY-MM-DDTHH-MM-SS format
	const now = new Date();
	const year = String(now.getFullYear()).slice(-2);
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	const timestamp = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
	
	const jsonlFile = `dev-console-${timestamp}.jsonl`;
	const cleanFile = `dev-console-${timestamp}.log`;
	
	let jsonlStream;
	let logWriter;
	
	return [
		// Use vite-console-forward-plugin for terminal output
		consoleForwardPlugin({
			// Format for terminal with colors
			format: (data) => {
				const level = data.level || 'log';
				const levelColor = levelColors[level];
				const time = new Date().toTimeString().substring(0, 8);
				const args = data.args || [];
				
				// Format message
				const message = args.map(arg => {
					if (typeof arg === 'object') {
						return JSON.stringify(arg, null, 2);
					}
					return String(arg);
				}).join(' ');
				
				// Return colored output for terminal
				return `${colors.dim}${time}${colors.reset} ${levelColor}[${level.toUpperCase()}]${colors.reset} ${message}`;
			}
		}),
		
		// Our custom plugin for file logging
		{
			name: 'vite-hybrid-file-logger',
			apply: 'serve',
			
			configureServer(server) {
				// Ensure logs directory exists
				const logsDir = path.join(__dirname, 'logs');
				if (!fs.existsSync(logsDir)) {
					fs.mkdirSync(logsDir, { recursive: true });
				}
				
				// Create streams
				const jsonlPath = path.join(logsDir, jsonlFile);
				const cleanPath = path.join(logsDir, cleanFile);
				
				jsonlStream = fs.createWriteStream(jsonlPath, { flags: 'a' });
				logWriter = new LogFileWriter(cleanPath);
				
				// Add middleware to handle log posts from browser
				server.middlewares.use('/__logs', (req, res) => {
					if (req.method !== 'POST') {
						res.statusCode = 405;
						res.end('Method Not Allowed');
						return;
					}
					
					let body = '';
					req.on('data', chunk => {
						body += chunk;
						if (body.length > 5_000_000) {
							req.destroy();
						}
					});
					
					req.on('end', () => {
						try {
							const data = JSON.parse(body);
							const items = Array.isArray(data) ? data : [data];
							
							for (const item of items) {
								// Write to JSONL
								jsonlStream.write(JSON.stringify(item) + '\n');
								
								// Write to clean log
								logWriter.write(item);
								
								// Also forward to terminal via console
								if (options.echoToTerminal !== false) {
									const level = item.level || 'log';
									const levelColor = levelColors[level];
									const time = logWriter.formatTime(item.ts);
									const message = logWriter.formatArgs(item.args);
									
									(
										`${colors.dim}[browser]${colors.reset} ${colors.dim}${time}${colors.reset} ${levelColor}[${level.toUpperCase()}]${colors.reset} ${message}`
									);
									
									// Show stack for errors
									if (item.stack && (level === 'error' || level === 'warn')) {
										const lines = item.stack.split('\n').slice(0, 3);
										for (const line of lines) {
											if (line.trim()) {
												(`${colors.dim}         ${line.trim()}${colors.reset}`);
											}
										}
									}
								}
							}
							
							res.statusCode = 204;
							res.end();
						} catch (error) {
							console.error('[hybrid-logger] Parse error:', error);
							res.statusCode = 400;
							res.end('Bad Request');
						}
					});
				});
				
				// Close streams when server shuts down
				server.httpServer?.once('close', () => {
					jsonlStream.end();
					logWriter.close();
				});
				
				// Log where we're writing
				(`${colors.cyan}[hybrid-logger] Logging to:${colors.reset}`);
				(`  JSONL: ${path.resolve(jsonlPath)}`);
				(`  Clean: ${path.resolve(cleanPath)}`);
			}
		}
	];
}