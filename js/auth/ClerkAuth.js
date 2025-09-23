/**
 * Clerk Authentication Wrapper
 * Handles authentication with Clerk and Supabase integration
 */
import { stateManager } from '../core/StateManager.js';
import logger from '../utils/logger.js';

export class ClerkAuth {
	constructor() {
		this.clerk = null;
		this.user = null;
		this.session = null;
		this.initialized = false;
		this.listeners = new Set();
	}

	/**
	 * Initialize Clerk authentication
	 */
	async init() {
		if (this.initialized) return;

		try {
			// Wait for Clerk to be available
			await this.waitForClerk();

			// Clerk v5 is already initialized by the script tag
			if (window.Clerk) {
				this.clerk = window.Clerk;

				// Load Clerk
				await this.clerk.load();

				// Check authentication status
				await this.checkAuth();

				// Set up listeners for auth changes
				this.setupListeners();

				this.initialized = true;
				logger.info('[ClerkAuth] Initialized');
			}
		} catch (error) {
			logger.error('[ClerkAuth] Initialization error:', error);
			stateManager.set('app.isAuthenticated', false);
		}
	}

	/**
	 * Wait for Clerk to be available
	 */
	async waitForClerk() {
		if (typeof window.Clerk !== 'undefined') return;

		return new Promise((resolve) => {
			const checkInterval = setInterval(() => {
				if (typeof window.Clerk !== 'undefined') {
					clearInterval(checkInterval);
					resolve();
				}
			}, 100);

			// Timeout after 10 seconds
			setTimeout(() => {
				clearInterval(checkInterval);
				logger.warn('[ClerkAuth] Clerk not loaded after 10 seconds');
				resolve();
			}, 10000);
		});
	}

	/**
	 * Check authentication status
	 */
	async checkAuth() {
		if (!this.clerk) return false;

		try {
			this.user = this.clerk.user;
			this.session = this.clerk.session;

			if (this.user) {
				// Update state with user info
				stateManager.batch(() => {
					stateManager.set('user.id', this.user.id);
					stateManager.set('user.email', this.user.primaryEmailAddress?.emailAddress);
					stateManager.set('user.name', this.getUserDisplayName());
					stateManager.set(
						'user.imageUrl',
						this.user.profileImageUrl || this.user.imageUrl
					);
					stateManager.set('app.isAuthenticated', true);
				});

				logger.info(
					'[ClerkAuth] User authenticated:',
					this.user.primaryEmailAddress?.emailAddress
				);
				return true;
			} else {
				// No user signed in
				stateManager.batch(() => {
					stateManager.set('user.id', null);
					stateManager.set('user.email', null);
					stateManager.set('user.name', null);
					stateManager.set('user.imageUrl', null);
					stateManager.set('app.isAuthenticated', false);
				});

				logger.info('[ClerkAuth] No user signed in');
				return false;
			}
		} catch (error) {
			logger.error('[ClerkAuth] Auth check error:', error);
			return false;
		}
	}

	/**
	 * Get user display name
	 */
	getUserDisplayName() {
		if (!this.user) return 'User';

		return (
			this.user.fullName ||
			this.user.firstName ||
			this.user.username ||
			this.user.primaryEmailAddress?.emailAddress?.split('@')[0] ||
			'User'
		);
	}

	/**
	 * Setup listeners for auth changes
	 */
	setupListeners() {
		if (!this.clerk) return;

		// Listen for user changes
		const checkInterval = setInterval(async () => {
			const currentUser = this.clerk.user;

			if (currentUser?.id !== this.user?.id) {
				this.user = currentUser;
				await this.checkAuth();
				this.notifyListeners('authStateChanged', { user: this.user });
			}
		}, 1000);

		// Store interval for cleanup
		this.authCheckInterval = checkInterval;
	}

	/**
	 * Get Supabase JWT token
	 */
	async getSupabaseToken() {
		if (!this.session) {
			logger.warn('[ClerkAuth] No active session for Supabase token');
			return null;
		}

		try {
			// IMPORTANT: 'supabase' template must be configured in Clerk Dashboard
			const token = await this.session.getToken({ template: 'supabase' });
			return token;
		} catch (error) {
			logger.error('[ClerkAuth] Error getting Supabase token:', error);
			return null;
		}
	}

	/**
	 * Sign in
	 */
	async signIn() {
		if (!this.clerk) {
			logger.error('[ClerkAuth] Clerk not initialized');
			return;
		}

		try {
			// Open Clerk's sign-in UI
			await this.clerk.openSignIn({
				afterSignInUrl: window.location.href,
				afterSignUpUrl: window.location.href,
			});
		} catch (error) {
			logger.error('[ClerkAuth] Sign in error:', error);
		}
	}

	/**
	 * Sign out
	 */
	async signOut() {
		if (!this.clerk) {
			logger.error('[ClerkAuth] Clerk not initialized');
			return;
		}

		try {
			await this.clerk.signOut();
			await this.checkAuth();
			this.notifyListeners('signOut');
		} catch (error) {
			logger.error('[ClerkAuth] Sign out error:', error);
		}
	}

	/**
	 * Open user profile
	 */
	async openUserProfile() {
		if (!this.clerk || !this.user) {
			logger.error('[ClerkAuth] Cannot open profile - not authenticated');
			return;
		}

		try {
			await this.clerk.openUserProfile();
		} catch (error) {
			logger.error('[ClerkAuth] Error opening user profile:', error);
		}
	}

	/**
	 * Check if user is admin
	 */
	isAdmin() {
		if (!this.user) return false;

		// Check for admin role in public metadata
		const publicMetadata = this.user.publicMetadata;
		return publicMetadata?.role === 'admin' || publicMetadata?.isAdmin === true;
	}

	/**
	 * Add auth state listener
	 */
	onAuthStateChange(callback) {
		this.listeners.add(callback);

		// Return unsubscribe function
		return () => {
			this.listeners.delete(callback);
		};
	}

	/**
	 * Notify listeners
	 */
	notifyListeners(event, data = {}) {
		this.listeners.forEach((callback) => {
			try {
				callback(event, data);
			} catch (error) {
				logger.error('[ClerkAuth] Listener error:', error);
			}
		});
	}

	/**
	 * Get current user
	 */
	getUser() {
		return this.user;
	}

	/**
	 * Get current session
	 */
	getSession() {
		return this.session;
	}

	/**
	 * Check if authenticated
	 */
	isAuthenticated() {
		return !!this.user;
	}

	/**
	 * Destroy
	 */
	destroy() {
		if (this.authCheckInterval) {
			clearInterval(this.authCheckInterval);
		}

		this.listeners.clear();
		this.initialized = false;
	}
}

// Create singleton instance
export const clerkAuth = new ClerkAuth();
