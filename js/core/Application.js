/**
 * Application Coordinator
 * Main application class that initializes and coordinates all systems
 */
import logger from '../utils/logger.js';
import { stateManager } from './StateManager.js';
import { panelSystem } from '../panels/PanelSystem.js';
import { modalSystem } from '../modals/ModalSystem.js';
import { clerkAuth } from '../auth/ClerkAuth.js';

export class Application {
	constructor() {
		this.initialized = false;
		this.systems = new Map();
		this.startTime = Date.now();
	}

	/**
	 * Initialize the application
	 */
	async init() {
		if (this.initialized) return;

		logger.info('[Application] Starting initialization...');

		try {
			// Show loading screen
			this.showLoadingScreen();

			// Initialize state manager (already initialized in main.js)
			logger.debug('[Application] State manager ready');

			// Initialize authentication
			await this.initAuth();

			// Initialize UI systems
			this.initUISystems();

			// Create initial UI
			this.createUI();

			// Hide loading screen and show app
			this.hideLoadingScreen();

			// Mark as initialized
			this.initialized = true;

			const loadTime = Date.now() - this.startTime;
			logger.info(`[Application] Initialization complete in ${loadTime}ms`);

			// Set app ready state
			stateManager.set('app.isLoading', false);
			stateManager.set('app.isReady', true);
		} catch (error) {
			logger.error('[Application] Initialization failed:', error);
			this.showError('Failed to initialize application: ' + error.message);
		}
	}

	/**
	 * Initialize authentication
	 */
	async initAuth() {
		logger.debug('[Application] Initializing authentication...');

		await clerkAuth.init();

		// Listen for auth changes
		clerkAuth.onAuthStateChange((event, data) => {
			logger.debug('[Application] Auth state changed:', event, data);

			if (event === 'signOut') {
				// Handle sign out
				this.handleSignOut();
			}
		});

		// Register auth system
		this.systems.set('auth', clerkAuth);
	}

	/**
	 * Initialize UI systems
	 */
	initUISystems() {
		logger.debug('[Application] Initializing UI systems...');

		// Initialize panel system - panels should go in main, not app-content
		const mainElement = document.querySelector('.app-main');
		panelSystem.init(mainElement);
		this.systems.set('panels', panelSystem);

		// Initialize modal system
		modalSystem.init();
		this.systems.set('modals', modalSystem);

		logger.debug('[Application] UI systems initialized');
	}

	/**
	 * Create initial UI
	 */
	createUI() {
		logger.debug('[Application] Creating UI...');

		// Update header with user info
		this.updateUserBadge();

		// Add event listeners
		this.attachEventListeners();
	}

	/**
	 * Update user badge in header
	 */
	updateUserBadge() {
		const userAvatar = document.getElementById('user-avatar');
		const userName = document.getElementById('user-name');
		const userBadge = document.querySelector('.user-badge');

		if (clerkAuth.isAuthenticated()) {
			const user = clerkAuth.getUser();

			if (userAvatar) {
				userAvatar.src =
					user.profileImageUrl || user.imageUrl || '/images/default-avatar.png';
			}

			if (userName) {
				userName.textContent = clerkAuth.getUserDisplayName();
			}

			if (userBadge) {
				userBadge.style.display = 'flex';
				userBadge.onclick = () => clerkAuth.openUserProfile();
			}
		} else {
			if (userBadge) {
				userBadge.style.display = 'flex';
				userName.textContent = 'Sign In';
				userBadge.onclick = () => clerkAuth.signIn();
			}
		}
	}

	/**
	 * Attach event listeners
	 */
	attachEventListeners() {
		// Test modal button for Phase 2
		const testModalBtn = document.getElementById('test-modal-btn');
		if (testModalBtn) {
			testModalBtn.addEventListener('click', () => {
				modalSystem.alert({
					title: 'Modal System Test',
					message:
						'This is a test of the modal system. If you see this, the modal system is working!',
				});
			});
		}
	}

	/**
	 * Handle sign out
	 */
	handleSignOut() {
		// Reset user state
		stateManager.batch(() => {
			stateManager.set('user.id', null);
			stateManager.set('user.email', null);
			stateManager.set('user.name', null);
			stateManager.set('app.isAuthenticated', false);
		});

		// Update UI
		this.updateUserBadge();

		// Close any open modals
		modalSystem.closeAll();

		logger.info('[Application] User signed out');
	}

	/**
	 * Show loading screen
	 */
	showLoadingScreen() {
		const loadingScreen = document.getElementById('loading-screen');
		if (loadingScreen) {
			loadingScreen.style.display = 'flex';
		}
	}

	/**
	 * Hide loading screen
	 */
	hideLoadingScreen() {
		const loadingScreen = document.getElementById('loading-screen');
		const appContent = document.getElementById('app-content');

		if (loadingScreen) {
			loadingScreen.style.display = 'none';
		}

		if (appContent) {
			appContent.classList.remove('hidden');
		}
	}

	/**
	 * Show error
	 */
	showError(message) {
		const loadingScreen = document.getElementById('loading-screen');
		if (loadingScreen) {
			loadingScreen.innerHTML = `
				<div class="error-container">
					<div class="error-icon">⚠</div>
					<div class="error-title">SYSTEM ERROR</div>
					<div class="error-message">${message}</div>
					<button class="btn" onclick="location.reload()">Reload</button>
				</div>
			`;
		}
	}

	/**
	 * Get system
	 */
	getSystem(name) {
		return this.systems.get(name);
	}

	/**
	 * Destroy application
	 */
	destroy() {
		// Destroy all systems
		this.systems.forEach((system) => {
			if (typeof system.destroy === 'function') {
				system.destroy();
			}
		});

		this.systems.clear();
		this.initialized = false;

		logger.info('[Application] Destroyed');
	}
}

// Create singleton instance
export const app = new Application();

// Expose to window for testing
if (import.meta.env.DEV) {
	window.app = app;
	window.panelSystem = panelSystem;
	window.modalSystem = modalSystem;
	logger.debug('[DEV] Application exposed to window for testing');
}
