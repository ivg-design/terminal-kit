import logger from '../utils/logger.js';

/**
 * Central State Manager
 * Manages application state with reactive updates
 */
export class StateManager {
	constructor() {
		this.state = new Map();
		this.subscribers = new Map();
		this.history = [];
		this.maxHistorySize = 50;
		// Don't initialize state in constructor - let loadFromStorage handle it
	}

	/**
	 * Initialize default state
	 */
	initializeState() {
		this.initializeDefaults();
		// Save the initial state
		this.saveToStorage();
	}

	/**
	 * Initialize default values without saving
	 */
	initializeDefaults() {
		// Only set defaults if they don't already exist
		if (!this.state.has('app')) {
			this.state.set(
				'app',
				new Map([
					['isLoading', false],
					['isAuthenticated', false],
					['mode', 'work'], // 'work' or 'personal'
					['version', '2.0.0'],
				])
			);
		}

		if (!this.state.has('user')) {
			this.state.set(
				'user',
				new Map([
					['id', null],
					['email', null],
					['name', null],
					['isAdmin', false],
					['organizations', []],
				])
			);
		}

		if (!this.state.has('animation')) {
			this.state.set(
				'animation',
				new Map([
					['currentFile', null],
					['currentFileId', null],
					['isPlaying', false],
					['isPaused', false],
					['currentStateMachine', null],
					['availableStateMachines', []],
					['inputs', {}],
					['fps', 0],
					['artboardName', null],
				])
			);
		}

		if (!this.state.has('ui')) {
			this.state.set(
				'ui',
				new Map([
					[
						'panels',
						new Map([
							['controls', { visible: true, collapsed: false }],
							['style', { visible: true, collapsed: false }],
							['cssEditor', { visible: true, collapsed: false }],
							['riveControls', { visible: true, collapsed: false }],
							['codeExport', { visible: false, collapsed: false }],
						]),
					],
					[
						'modals',
						new Map([
							['animationManager', { visible: false }],
							['tagManager', { visible: false }],
							['metadataEditor', { visible: false }],
						]),
					],
					['theme', 'terminal'], // Only theme for now
				])
			);
		}

		if (!this.state.has('style')) {
			this.state.set(
				'style',
				new Map([
					['canvasBackground', '#000000'],
					['wrapperBackground', '#0a0a0a'],
					['zoom', 100],
					['customCSS', ''],
				])
			);
		}

		if (!this.state.has('library')) {
			this.state.set(
				'library',
				new Map([
					['animations', []],
					['folders', []],
					['tags', []],
					['categories', []],
					['selectedFolder', null],
					['searchQuery', ''],
					['sortBy', 'name'],
					['sortOrder', 'asc'],
				])
			);
		}

		if (!this.state.has('settings')) {
			this.state.set(
				'settings',
				new Map([
					['autoSave', true],
					['autoSaveInterval', 1000], // ms
					['showFPS', true],
					['debugMode', false],
				])
			);
		}
	}

	/**
	 * Get state value by path
	 */
	get(path) {
		const keys = path.split('.');
		let value = this.state;

		for (const key of keys) {
			if (value instanceof Map) {
				value = value.get(key);
			} else if (typeof value === 'object' && value !== null) {
				value = value[key];
			} else {
				return undefined;
			}
		}

		return value;
	}

	/**
	 * Set state value by path
	 */
	set(path, value) {
		const keys = path.split('.');
		const lastKey = keys.pop();
		let target = this.state;

		// Navigate to the target object, creating Maps as needed
		for (const key of keys) {
			if (target instanceof Map) {
				if (!target.has(key)) {
					target.set(key, new Map());
				}
				target = target.get(key);
			} else {
				// Handle non-Map objects
				if (!target[key]) {
					target[key] = {};
				}
				target = target[key];
			}
		}

		// Store previous value for history
		const previousValue = target instanceof Map ? target.get(lastKey) : target[lastKey];

		// Set the new value
		if (target instanceof Map) {
			target.set(lastKey, value);
		} else {
			target[lastKey] = value;
		}

		// Add to history
		this.addToHistory({
			path,
			previousValue,
			newValue: value,
			timestamp: Date.now(),
		});

		// Notify subscribers
		this.notifySubscribers(path, value, previousValue);

		// Auto-save to localStorage
		this.saveToStorage();
	}

	/**
	 * Set multiple state values
	 */
	setState(updates) {
		Object.entries(updates).forEach(([key, value]) => {
			if (typeof value === 'object' && !Array.isArray(value)) {
				// Handle nested objects
				Object.entries(value).forEach(([nestedKey, nestedValue]) => {
					this.set(`${key}.${nestedKey}`, nestedValue);
				});
			} else {
				this.set(key, value);
			}
		});
	}

	/**
	 * Subscribe to state changes
	 */
	subscribe(path, callback) {
		if (!this.subscribers.has(path)) {
			this.subscribers.set(path, new Set());
		}
		this.subscribers.get(path).add(callback);

		// Return unsubscribe function
		return () => {
			const callbacks = this.subscribers.get(path);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					this.subscribers.delete(path);
				}
			}
		};
	}

	/**
	 * Notify subscribers of state changes
	 */
	notifySubscribers(path, newValue, previousValue) {
		// Notify exact path subscribers
		const exactSubscribers = this.subscribers.get(path);
		if (exactSubscribers) {
			exactSubscribers.forEach((callback) => {
				callback(newValue, previousValue, path);
			});
		}

		// Notify parent path subscribers
		const pathParts = path.split('.');
		for (let i = pathParts.length - 1; i > 0; i--) {
			const parentPath = pathParts.slice(0, i).join('.');
			const parentSubscribers = this.subscribers.get(parentPath);
			if (parentSubscribers) {
				const parentValue = this.get(parentPath);
				parentSubscribers.forEach((callback) => {
					callback(parentValue, null, parentPath);
				});
			}
		}

		// Notify wildcard subscribers
		const wildcardSubscribers = this.subscribers.get('*');
		if (wildcardSubscribers) {
			wildcardSubscribers.forEach((callback) => {
				callback(newValue, previousValue, path);
			});
		}
	}

	/**
	 * Add to history
	 */
	addToHistory(entry) {
		this.history.push(entry);
		if (this.history.length > this.maxHistorySize) {
			this.history.shift();
		}
	}

	/**
	 * Get state history
	 */
	getHistory() {
		return [...this.history];
	}

	/**
	 * Clear history
	 */
	clearHistory() {
		this.history = [];
	}

	/**
	 * Get complete state
	 */
	getState() {
		const plainState = {};
		this.state.forEach((value, key) => {
			plainState[key] = this.mapToObject(value);
		});
		return plainState;
	}

	/**
	 * Convert Map to plain object
	 */
	mapToObject(value) {
		if (value instanceof Map) {
			const obj = {};
			value.forEach((v, k) => {
				obj[k] = this.mapToObject(v);
			});
			return obj;
		}
		return value;
	}

	/**
	 * Load state from storage
	 */
	loadFromStorage(key = 'rivePreviewState') {
		try {
			const stored = localStorage.getItem(key);
			if (stored) {
				const parsedState = JSON.parse(stored);
				logger.info(
					'[StateManager] Loading state from storage, keys:',
					Object.keys(parsedState)
				);
				// First, initialize defaults to ensure all required keys exist
				this.initializeDefaults();
				// Then overlay the stored state on top
				Object.entries(parsedState).forEach(([key, value]) => {
					// Simply convert all objects to Maps - the structure is preserved in storage
					this.state.set(key, this.smartObjectToMap(value));
				});
				logger.info(
					'[StateManager] Loaded state from storage, state keys:',
					Array.from(this.state.keys())
				);
				return true;
			} else {
				// No stored state, initialize defaults
				logger.info('[StateManager] No stored state, initializing defaults');
				this.initializeState();
				return false;
			}
		} catch (error) {
			logger.error('[StateManager] Error loading state from storage:', error);
			// On error, initialize defaults
			this.initializeState();
			this.isInitializing = false;
			return false;
		}
	}

	/**
	 * Smart conversion that creates Maps for objects at the top level only
	 */
	smartObjectToMap(obj) {
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			return obj;
		}
		// Create a Map and convert nested objects to Maps only if they're plain objects
		const map = new Map();
		Object.entries(obj).forEach(([key, value]) => {
			// Recursively convert nested plain objects to Maps
			if (
				typeof value === 'object' &&
				value !== null &&
				!Array.isArray(value) &&
				value.constructor === Object
			) {
				map.set(key, this.smartObjectToMap(value));
			} else {
				map.set(key, value);
			}
		});
		return map;
	}

	/**
	 * Convert plain object to Map structure
	 */
	objectToMap(obj) {
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			return obj;
		}
		const map = new Map();
		Object.entries(obj).forEach(([key, value]) => {
			map.set(key, this.objectToMap(value));
		});
		return map;
	}

	/**
	 * Save state to storage
	 */
	saveToStorage(key = 'rivePreviewState') {
		try {
			const state = this.getState();
			logger.info('[StateManager] Saving state to storage, keys:', Object.keys(state));
			localStorage.setItem(key, JSON.stringify(state));
			return true;
		} catch (error) {
			logger.error('[StateManager] Error saving state to storage:', error);
		}
		return false;
	}

	/**
	 * Reset state to defaults
	 */
	reset() {
		this.state.clear();
		this.history = [];
		this.initializeState();
	}

	/**
	 * Create a computed value that updates when dependencies change
	 */
	computed(dependencies, computeFn) {
		let cachedValue = computeFn();

		dependencies.forEach((dep) => {
			this.subscribe(dep, () => {
				cachedValue = computeFn();
			});
		});

		return () => cachedValue;
	}

	/**
	 * Batch updates to prevent multiple notifications
	 */
	batch(updateFn) {
		const originalNotify = this.notifySubscribers;
		const pendingNotifications = [];

		this.notifySubscribers = (path, newValue, previousValue) => {
			pendingNotifications.push({ path, newValue, previousValue });
		};

		updateFn();

		this.notifySubscribers = originalNotify;

		// Send all notifications at once
		pendingNotifications.forEach(({ path, newValue, previousValue }) => {
			this.notifySubscribers(path, newValue, previousValue);
		});
	}
}

// Create singleton instance
export const stateManager = new StateManager();
