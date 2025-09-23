/**
 * Main Application Entry Point
 */
import logger from './utils/logger.js';
import { stateManager } from './core/StateManager.js';
import { app } from './core/Application.js';

// Import console capture only if explicitly enabled (CDP mirror is default)
if (import.meta.env.DEV && import.meta.env.VITE_PAGE_LOGS === 'true') {
	await import('./console-capture.js');
}

// Initialize the application
async function initializeApp() {
	logger.info('[SYSTEM] Initializing Rive Preview V2...');

	try {
		// Initialize state FIRST before any other operations
		stateManager.loadFromStorage();

		// Initialize the main application
		await app.init();

		logger.info('[SYSTEM] Initialization complete');
	} catch (error) {
		logger.error('[ERROR] Failed to initialize:', error);
		const loadingScreen = document.getElementById('loading-screen');
		if (loadingScreen) {
			loadingScreen.innerHTML =
				'<div class="text-error">SYSTEM ERROR: ' + error.message + '</div>';
		}
	}
}

// Expose stateManager globally for debugging in development
if (import.meta.env.DEV) {
	window.stateManager = stateManager;
	logger.debug('[DEV] stateManager exposed to window for testing');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeApp);
} else {
	initializeApp();
}
