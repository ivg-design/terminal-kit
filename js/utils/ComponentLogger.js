/**
 * Lightweight Component Logger
 * Simple, efficient logging for Terminal components
 * with environment-aware levels and component filtering
 */

class ComponentLogger {
	constructor() {
		// Log levels
		this.LEVELS = {
			OFF: 0,
			ERROR: 1,
			WARN: 2,
			INFO: 3,
			DEBUG: 4,
		};

		// Set initial level based on environment
		this.level = this.getInitialLevel();

		// Component filters (disable specific components)
		this.disabled = new Set();

		// Load saved settings
		this.loadSettings();
	}

	getInitialLevel() {
		// Check if we're in a browser environment
		if (typeof window === 'undefined') {
			return this.LEVELS.ERROR; // Default for Node.js
		}

		// Check URL param first
		const params = new URLSearchParams(window.location.search);
		const urlLevel = params.get('log');
		if (urlLevel && this.LEVELS[urlLevel.toUpperCase()]) {
			return this.LEVELS[urlLevel.toUpperCase()];
		}

		// Check localStorage
		const saved = localStorage.getItem('t_log_level');
		if (saved && this.LEVELS[saved]) {
			return this.LEVELS[saved];
		}

		// Default based on environment
		const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.TERMINAL_DEBUG === true;

		return isDev ? this.LEVELS.INFO : this.LEVELS.ERROR;
	}

	loadSettings() {
		// Skip if not in browser environment
		if (typeof localStorage === 'undefined') return;

		// Load disabled components
		const disabled = localStorage.getItem('t_log_disabled');
		if (disabled) {
			try {
				this.disabled = new Set(JSON.parse(disabled));
			} catch {}
		}
	}

	saveSettings() {
		// Skip if not in browser environment
		if (typeof localStorage === 'undefined') return;

		localStorage.setItem('t_log_disabled', JSON.stringify([...this.disabled]));
	}

	/**
	 * Create a logger for a specific component
	 */
	for(name) {
		return {
			error: (...args) => this._log(name, 'ERROR', ...args),
			warn: (...args) => this._log(name, 'WARN', ...args),
			info: (...args) => this._log(name, 'INFO', ...args),
			debug: (...args) => this._log(name, 'DEBUG', ...args),
			trace: (...args) => this._log(name, 'DEBUG', ...args), // Alias for debug

			// Performance helpers
			time: (label) => this._time(name, label),
			timeEnd: (label) => this._timeEnd(name, label),

			// Grouping
			group: (label) => this._group(name, label),
			groupEnd: () => console.groupEnd(),
		};
	}

	_log(component, level, ...args) {
		// Skip if component is disabled
		if (this.disabled.has(component)) return;

		// Skip if level is too high
		if (this.LEVELS[level] > this.level) return;

		// Format and log
		const prefix = `[${component}]`;
		const method = level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : level === 'INFO' ? 'info' : 'log';

		// In dev, add color
		if (this.level >= this.LEVELS.DEBUG) {
			const color = {
				ERROR: '#ff3333',
				WARN: '#ffcc00',
				INFO: '#00ff41',
				DEBUG: '#00aaff',
			}[level];

			console[method](`%c${prefix}`, `color: ${color}; font-weight: bold`, ...args);
		} else {
			console[method](prefix, ...args);
		}
	}

	// Performance tracking
	_timers = new Map();

	_time(component, label) {
		if (this.level < this.LEVELS.DEBUG) return;
		const key = `${component}:${label}`;
		this._timers.set(key, performance.now());
	}

	_timeEnd(component, label) {
		if (this.level < this.LEVELS.DEBUG) return;
		const key = `${component}:${label}`;
		const start = this._timers.get(key);
		if (start) {
			const duration = performance.now() - start;
			this._timers.delete(key);
			this._log(component, 'DEBUG', `${label}: ${duration.toFixed(2)}ms`);
		}
	}

	_group(component, label) {
		if (this.level >= this.LEVELS.DEBUG) {
			console.group(`[${component}] ${label}`);
		}
	}

	// Configuration methods
	setLevel(level) {
		if (typeof level === 'string') {
			level = level.toUpperCase();
			if (this.LEVELS[level] !== undefined) {
				this.level = this.LEVELS[level];
				localStorage.setItem('t_log_level', level);
				console.info(`Log level set to ${level}`);
			}
		}
	}

	disable(component) {
		this.disabled.add(component);
		this.saveSettings();
	}

	enable(component) {
		this.disabled.delete(component);
		this.saveSettings();
	}

	// Show current configuration
	config() {
		const levelName = Object.keys(this.LEVELS).find((k) => this.LEVELS[k] === this.level);
		console.group('📋 Component Logger Config');
		console.log('Level:', levelName);
		console.log('Disabled:', [...this.disabled]);
		console.groupEnd();
	}
}

// Create singleton
const componentLogger = new ComponentLogger();

// Expose for debugging in dev
if (componentLogger.level >= componentLogger.LEVELS.INFO) {
	window.TLog = componentLogger;
	console.info('Component logger ready. Use TLog.config() to view settings.');
}

export default componentLogger;
