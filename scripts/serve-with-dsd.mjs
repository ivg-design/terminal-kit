#!/usr/bin/env node
/**
 * Serve pages with proper DSD support using manifest-based generation
 * This script:
 * 1. Uses the DSD generator to process HTML files
 * 2. Serves processed files with embedded DSD templates
 * 3. Provides real-time verification of DSD functionality
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT, '.dsd-build');
const PORT = 12358;

// File extension to MIME type mapping
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

class DSDServer {
    constructor() {
        this.server = null;
    }

    async generateDSDFiles() {
        console.log('Generating DSD templates using manifest...\n');

        return new Promise((resolve, reject) => {
            const generator = spawn('node', [
                path.join(__dirname, 'dsd-generator.mjs')
            ], {
                stdio: 'inherit',
                cwd: ROOT
            });

            generator.on('close', (code) => {
                if (code === 0) {
                    console.log('\n✅ DSD generation complete!\n');
                    resolve();
                } else {
                    reject(new Error(`Generator exited with code ${code}`));
                }
            });

            generator.on('error', reject);
        });
    }

    async serveFile(req, res, filePath) {
        try {
            const content = await fs.readFile(filePath);
            const ext = path.extname(filePath);
            const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            res.end(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File not found</h1>');
            } else {
                console.error('Server error:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Server error</h1>');
            }
        }
    }

    async createVerificationEndpoint(res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        // Count DSD templates in all built files
        let stats = {
            files: [],
            totalTemplates: 0
        };

        try {
            const files = await fs.readdir(BUILD_DIR);
            for (const file of files) {
                if (file.endsWith('.html')) {
                    const content = await fs.readFile(path.join(BUILD_DIR, file), 'utf-8');
                    const templateCount = (content.match(/shadowrootmode/g) || []).length;
                    stats.files.push({
                        name: file,
                        templates: templateCount
                    });
                    stats.totalTemplates += templateCount;
                }
            }
        } catch (error) {
            console.error('Error checking DSD status:', error);
        }

        res.end(JSON.stringify(stats, null, 2));
    }

    async start() {
        // Generate DSD files first
        await this.generateDSDFiles();

        // Create HTTP server
        this.server = http.createServer(async (req, res) => {
            let urlPath = req.url.split('?')[0]; // Remove query params

            // API endpoints
            if (urlPath === '/api/dsd-status') {
                return this.createVerificationEndpoint(res);
            }

            // Default to index.html for root
            if (urlPath === '/') {
                // List available HTML files
                try {
                    const files = await fs.readdir(BUILD_DIR);
                    const htmlFiles = files.filter(f => f.endsWith('.html'));

                    const indexHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>DSD Preview Server</title>
    <style>
        body {
            background: #0a0a0a;
            color: #00ff41;
            font-family: 'Courier New', monospace;
            padding: 2em;
        }
        h1 {
            border-bottom: 2px solid #00ff41;
            padding-bottom: 0.5em;
        }
        a {
            color: #00ff41;
            text-decoration: none;
            display: block;
            padding: 0.5em;
            border: 1px solid transparent;
            margin: 0.2em 0;
        }
        a:hover {
            background: #00ff41;
            color: #0a0a0a;
            border-color: #00ff41;
        }
        .stats {
            margin-top: 2em;
            padding: 1em;
            border: 1px solid #00ff41;
            background: rgba(0, 255, 65, 0.1);
        }
        .badge {
            display: inline-block;
            padding: 0.2em 0.5em;
            background: #00ff41;
            color: #0a0a0a;
            margin-left: 1em;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <h1>🚀 DSD Preview Server</h1>
    <h2>Available Pages:</h2>
    ${await Promise.all(htmlFiles.map(async file => {
        const content = await fs.readFile(path.join(BUILD_DIR, file), 'utf-8');
        const templateCount = (content.match(/shadowrootmode/g) || []).length;
        return `<a href="/${file}">${file} <span class="badge">${templateCount} DSD templates</span></a>`;
    })).then(links => links.join('\n'))}

    <div class="stats">
        <h3>📊 DSD Status</h3>
        <p>Total files: ${htmlFiles.length}</p>
        <p><a href="/api/dsd-status" target="_blank">View detailed status →</a></p>
    </div>

    <script>
        // Verify DSD is working
        fetch('/api/dsd-status')
            .then(r => r.json())
            .then(data => {
                console.log('DSD Status:', data);
                if (data.totalTemplates > 0) {
                    console.log('✅ DSD templates are being served correctly!');
                }
            });
    </script>
</body>
</html>`;

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(indexHtml);
                    return;
                } catch (error) {
                    console.error('Error listing files:', error);
                }
            }

            // Remove leading slash for file path
            urlPath = urlPath.substring(1);

            // First try to serve from build directory
            let filePath = path.join(BUILD_DIR, urlPath);

            try {
                const stats = await fs.stat(filePath);
                if (!stats.isFile()) {
                    throw new Error('Not a file');
                }
            } catch {
                // If not in build dir, try serving from project root for assets
                filePath = path.join(ROOT, urlPath);
            }

            await this.serveFile(req, res, filePath);
        });

        this.server.listen(PORT, () => {
            console.log('='.repeat(60));
            console.log('🌟 DSD Preview Server Running');
            console.log('='.repeat(60));
            console.log(`\n📍 URL: http://localhost:${PORT}`);
            console.log('📁 Serving from:', BUILD_DIR);
            console.log('\n✨ Features:');
            console.log('  • Complete DSD templates with all styles');
            console.log('  • Manifest-based component generation');
            console.log('  • Real-time DSD verification');
            console.log('  • No Vite processing - raw HTML with DSD');
            console.log('\n🔍 API Endpoints:');
            console.log(`  • http://localhost:${PORT}/api/dsd-status - Check DSD status`);
            console.log('\n💡 Tips:');
            console.log('  • Open browser DevTools to see DSD verification');
            console.log('  • Check shadow roots in Elements panel');
            console.log('  • Update manifest.json to add new components');
            console.log('\nPress Ctrl+C to stop the server\n');
        });
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(resolve);
            });
        }
    }
}

// Handle graceful shutdown
async function shutdown(server) {
    console.log('\n\n👋 Shutting down server...');
    await server.stop();
    process.exit(0);
}

// Main execution
async function main() {
    const server = new DSDServer();

    process.on('SIGINT', () => shutdown(server));
    process.on('SIGTERM', () => shutdown(server));

    try {
        await server.start();
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

main();