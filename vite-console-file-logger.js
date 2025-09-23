/**
 * Vite plugin for console file logging
 */
import fs from 'node:fs';
import path from 'node:path';

function ensureDir(p) {
	if (!fs.existsSync(p)) {
		fs.mkdirSync(p, { recursive: true });
	}
}

function attachMiddleware(server, outPath, echo) {
	const stream = fs.createWriteStream(outPath, { flags: 'a' });

	// Minimal JSON body reader
	server.middlewares.use('/__logs', (req, res) => {
		if (req.method !== 'POST') {
			res.statusCode = 405;
			res.end('Method Not Allowed');
			return;
		}

		let body = '';
		req.on('data', (chunk) => {
			body += chunk;
			if (body.length > 5_000_000) req.destroy(); // Prevent huge payloads
		});

		req.on('end', () => {
			try {
				// Allow single event objects or arrays of events
				const data = JSON.parse(body);
				const items = Array.isArray(data) ? data : [data];

				for (let i = 0; i < items.length; i++) {
					const line = JSON.stringify(items[i]) + '\n';
					stream.write(line);

					if (echo) {
						const lvl = items[i]?.level || 'log';
						const msg = items[i]?.args ? JSON.stringify(items[i].args) : '';
						server.config.logger.info(`[console->file][${lvl}] ${msg}`);
					}
				}

				res.statusCode = 204;
				res.end();
			} catch (_e) {
				res.statusCode = 400;
				res.end('Bad JSON');
			}
		});
	});

	// Close stream on server shutdown
	const close = () => {
		try {
			stream.end();
		} catch {
			/* ignore */
		}
	};
	process.on('exit', close);
	process.on('SIGINT', () => {
		close();
		process.exit(0);
	});
}

export default function consoleFileLogger(opts = {}) {
	return {
		name: 'vite-console-file-logger',
		apply: 'serve',
		configureServer(server) {
			const dir = opts.dir || 'logs';
			// Create local timestamp in YY-MM-DDTHH-MM-SS format
			const now = new Date();
			const year = String(now.getFullYear()).slice(-2);
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const timestamp = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
			const file = opts.file || `dev-console-${timestamp}.jsonl`;
			const outDir = path.isAbsolute(dir) ? dir : path.join(server.config.root, dir);

			ensureDir(outDir);
			const outPath = path.join(outDir, file);

			attachMiddleware(server, outPath, !!opts.echoToTerminal);
			server.config.logger.info(`[vite-console-file-logger] writing to ${outPath}`);
		},
	};
}
