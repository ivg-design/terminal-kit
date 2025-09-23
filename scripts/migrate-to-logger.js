#!/usr/bin/env node

/**
 * Script to migrate console.* statements to logger
 * Run this to update all files at once
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_UPDATE = [
	'../js/auth/ClerkAuth.js',
	'../js/modals/ModalSystem.js',
	'../js/panels/PanelSystem.js',
	'../js/core/StateManager.js',
	'../js/repositories/BaseRepository.js',
];

function updateFile(filePath) {
	const fullPath = path.join(__dirname, filePath);

	if (!fs.existsSync(fullPath)) {
		console.log(`Skipping ${filePath} - file not found`);
		return;
	}

	let content = fs.readFileSync(fullPath, 'utf8');
	const originalContent = content;

	// Check if logger is already imported
	const hasLoggerImport = content.includes('import logger from');

	// Add import at the top if not present
	if (!hasLoggerImport && content.includes('console.')) {
		// Find the first import statement or the start of the file
		const importMatch = content.match(/^import\s+.+from\s+['"].+['"];?$/m);
		if (importMatch) {
			// Add after the first import
			const insertPos = content.indexOf(importMatch[0]) + importMatch[0].length;
			const relPath = path
				.relative(path.dirname(fullPath), path.join(__dirname, '../js/utils'))
				.replace(/\\/g, '/');
			content =
				content.slice(0, insertPos) +
				`\nimport logger from '${relPath}/logger.js';` +
				content.slice(insertPos);
		} else {
			// Add at the beginning
			const relPath = path
				.relative(path.dirname(fullPath), path.join(__dirname, '../js/utils'))
				.replace(/\\/g, '/');
			content = `import logger from '${relPath}/logger.js';\n\n` + content;
		}
	}

	// Replace console statements
	content = content
		.replace(/console\.log\(/g, 'logger.info(')
		.replace(/console\.error\(/g, 'logger.error(')
		.replace(/console\.warn\(/g, 'logger.warn(')
		.replace(/console\.info\(/g, 'logger.info(')
		.replace(/console\.debug\(/g, 'logger.debug(')
		.replace(/console\.trace\(/g, 'logger.trace(');

	// Write back if changed
	if (content !== originalContent) {
		fs.writeFileSync(fullPath, content, 'utf8');
		console.log(`✅ Updated ${filePath}`);
	} else {
		console.log(`⏭️  No changes needed for ${filePath}`);
	}
}

console.log('🔄 Migrating console statements to logger...\n');

FILES_TO_UPDATE.forEach(updateFile);

console.log('\n✨ Migration complete!');
console.log('Note: You may need to adjust import paths manually if needed.');
