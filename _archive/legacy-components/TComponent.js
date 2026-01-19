/**
 * Base class for all Terminal UI Web Components
 * DEPRECATED: Use Lit components instead (extend LitElement)
 * This is kept temporarily for backward compatibility during migration
 */

import componentLogger from '../utils/ComponentLogger.js';

export class TComponent extends HTMLElement {
	constructor() {
		super();

		// Set up component logger FIRST
		this.log = componentLogger.for(this.constructor.name);

		// Create shadow DOM
		this.attachShadow({ mode: 'open' });
		this.log.debug('Created shadow DOM');

		this._props = {};
		this._listeners = new Map();
		this._initialized = false;
		this._stylesAdopted = false;

		// MIGRATION NOTE: StyleSheetManager removed
		// Legacy TComponent classes should be converted to Lit
		this.log.warn(`${this.constructor.name} extends deprecated TComponent - migrate to Lit!`);
	}

	/**
	 * DEPRECATED: No-op during migration
	 * Lit components handle their own styles
	 */
	adoptComponentStyles() {
		// Intentionally empty - remove StyleSheetManager dependency
	}

	_adoptStyles() {
		// Intentionally empty - remove StyleSheetManager dependency
	}

	/**
	 * Set component property and trigger re-render
	 */
	setProp(name, value) {
		const oldValue = this._props[name];
		this._props[name] = value;

		if (oldValue !== value) {
			this.onPropChange(name, oldValue, value);
			// Only render if shouldRender returns true (default behavior)
			if (this.shouldRender(name, oldValue, value)) {
				this.render();
			}
		}
	}

	/**
	 * Get component property
	 */
	getProp(name) {
		return this._props[name];
	}

	/**
	 * Set multiple properties at once
	 */
	setProps(props) {
		let shouldRender = false;
		Object.entries(props).forEach(([name, value]) => {
			const oldValue = this._props[name];
			this._props[name] = value;
			if (oldValue !== value && this.shouldRender(name, oldValue, value)) {
				shouldRender = true;
			}
		});
		if (shouldRender) {
			this.render();
		}
	}

	/**
	 * Hook for property changes
	 */
	onPropChange(name, oldValue, newValue) {
		// Override in subclasses if needed
	}

	/**
	 * Emit custom event
	 */
	emit(eventName, detail = {}) {
		this.dispatchEvent(
			new CustomEvent(eventName, {
				detail,
				bubbles: true,
				composed: true,
			})
		);
	}

	/**
	 * Add event listener with cleanup
	 */
	addListener(element, event, handler, options = {}) {
		const key = `${event}-${Date.now()}`;
		this._listeners.set(key, { element, event, handler, options });
		element.addEventListener(event, handler, options);
		return key;
	}

	/**
	 * Remove event listener
	 */
	removeListener(key) {
		const listener = this._listeners.get(key);
		if (listener) {
			listener.element.removeEventListener(listener.event, listener.handler, listener.options);
			this._listeners.delete(key);
		}
	}

	/**
	 * Clean up all listeners
	 */
	cleanupListeners() {
		this._listeners.forEach((listener, key) => {
			this.removeListener(key);
		});
	}

	/**
	 * Lifecycle: Component connected to DOM
	 */
	connectedCallback() {
		this.log.debug('Connected to DOM', {
			isDSD: false,
			id: this.id || this.getAttribute('name') || 'unnamed'
		});

		if (false) {
			// Component was server-rendered with DSD, hydrate instead of render
			this.hydrate();
		} else {
			// Standard client-side rendering
			this.render();
		}

		this.onMount();
	}

	/**
	 * Lifecycle: Component removed from DOM
	 */
	disconnectedCallback() {
		this.cleanupListeners();
		this.onUnmount();
	}

	/**
	 * Lifecycle: Attribute changed
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		this.onAttributeChange(name, oldValue, newValue);
	}

	/**
	 * Hook: Component mounted
	 */
	onMount() {
		// Override in subclasses
	}

	/**
	 * Hook: Component unmounted
	 */
	onUnmount() {
		// Override in subclasses
	}

	/**
	 * Hook: Attribute changed
	 */
	onAttributeChange(name, oldValue, newValue) {
		// Override in subclasses
	}

	/**
	 * Hook: Should component re-render on prop change
	 */
	shouldRender(propName, oldValue, newValue) {
		// Default behavior - always render on change
		// Override in subclasses to prevent unnecessary renders
		return true;
	}

	/**
	 * Get template (must be overridden)
	 */
	template() {
		return '';
	}

	/**
	 * Component class name for styling
	 */
	get componentClass() {
		return '';
	}

	/**
	 * Render component
	 */
	render() {
		// Call beforeRender hook to allow cleanup
		if (this.beforeRender) {
			this.beforeRender();
		}

		// Render to Shadow DOM
		this.shadowRoot.innerHTML = this.template();

		// Add component-specific classes if needed
		if (this.componentClass) {
			this.classList.add(this.componentClass);
		}

		this.afterRender();
	}

	/**
	 * Hydrate component (for DSD components)
	 * Re-establishes interactivity without re-rendering
	 */
	hydrate() {
		this.log.info('Hydrating DSD component', {
			component: this.constructor.name,
			id: this.id || 'unnamed'
		});

		// Call beforeHydrate hook
		if (this.beforeHydrate) {
			this.beforeHydrate();
		}

		// Hydrate elements and event listeners
		this.hydrateElements();
		this.hydrateEventListeners();

		// Add component-specific classes if needed
		if (this.componentClass) {
			this.classList.add(this.componentClass);
		}

		// Call afterHydrate hook
		this.afterHydrate();

		this.log.debug('Hydration complete', {
			component: this.constructor.name
		});
	}

	/**
	 * Hook: Before hydration (override in subclasses)
	 */
	beforeHydrate() {
		// Override in subclasses if needed
	}

	/**
	 * Hook: Hydrate DOM elements (override in subclasses)
	 */
	hydrateElements() {
		// Override in subclasses to cache DOM references
	}

	/**
	 * Hook: Hydrate event listeners (override in subclasses)
	 */
	hydrateEventListeners() {
		// Override in subclasses to bind event handlers
	}

	/**
	 * Hook: After hydration (override in subclasses)
	 */
	afterHydrate() {
		// Default behavior: call afterRender for compatibility
		this.afterRender();
	}

	/**
	 * Hook: After render
	 */
	afterRender() {
		// Override in subclasses to bind events
	}

	/**
	 * Query selector
	 */
	$(selector) {
		return this.shadowRoot.querySelector(selector);
	}

	/**
	 * Query selector all
	 */
	$$(selector) {
		return this.shadowRoot.querySelectorAll(selector);
	}

	/**
	 * Utility: Debounce function
	 */
	debounce(func, wait) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	/**
	 * Utility: Throttle function
	 */
	throttle(func, limit) {
		let inThrottle;
		return (...args) => {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	/**
	 * Utility: Format hex color
	 */
	formatHex(color) {
		if (!color) return '';
		color = color.trim();
		if (!color.startsWith('#')) color = '#' + color;
		return color.toUpperCase();
	}

	/**
	 * Utility: Validate hex color
	 */
	/**
	 * Utility: Generate unique ID
	 */
	generateId(prefix = 'terminal') {
		return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Static method to get DSD statistics for all components on the page
	 * @returns {Object} Statistics about DSD usage
	 */
	static getDSDStatistics() {
		const allComponents = document.querySelectorAll('*');
		const stats = {
			total: 0,
			dsd: 0,
			regular: 0,
			byType: {}
		};

		allComponents.forEach(element => {
			// Check if it's a custom element (has a hyphen in tag name)
			if (element.tagName.includes('-')) {
				const tagName = element.tagName.toLowerCase();
				stats.total++;

				if (!stats.byType[tagName]) {
					stats.byType[tagName] = { total: 0, dsd: 0, regular: 0 };
				}

				stats.byType[tagName].total++;

				if (false) {
					stats.dsd++;
					stats.byType[tagName].dsd++;
				} else {
					stats.regular++;
					stats.byType[tagName].regular++;
				}
			}
		});

		return stats;
	}

	/**
	 * Static method to log DSD statistics using component logger
	 */
	static logDSDStatistics() {
		const logger = componentLogger.for('DSDStatistics');
		const stats = TComponent.getDSDStatistics();

		logger.info('=== DSD Usage Summary ===', {
			totalComponents: stats.total,
			usingDSD: stats.dsd,
			regularRendering: stats.regular,
			percentDSD: stats.total > 0 ? Math.round((stats.dsd / stats.total) * 100) : 0
		});

		// Log per-component-type statistics
		Object.entries(stats.byType).forEach(([tagName, typeStats]) => {
			logger.debug(`${tagName}:`, {
				total: typeStats.total,
				dsd: typeStats.dsd,
				regular: typeStats.regular
			});
		});

		return stats;
	}

	/**
	 * Color utility methods - shared across components
	 */
	formatHex(color, fallback = '#00ff41') {
		if (!color) return fallback;
		let hex = color.toString().toUpperCase();

		// Add # if missing
		if (!hex.startsWith('#')) {
			hex = '#' + hex;
		}

		// Convert 3-char to 6-char hex, 4-char to 8-char hex
		if (hex.length === 4) {
			hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
		} else if (hex.length === 5) {
			hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
		}

		// Only show alpha if it's NOT FF (100% opacity)
		// Strip FF alpha to show cleaner HEX when fully opaque
		if (hex.length === 9 && hex.substring(7, 9) === 'FF') {
			hex = hex.substring(0, 7);
		}

		// Validate and return (accept both 6-char and 8-char)
		return ((hex.length === 7 || hex.length === 9) && /^#[0-9A-F]{6}([0-9A-F]{2})?$/i.test(hex)) ? hex : fallback;
	}

	isValidHex(color) {
		// Accept 3, 6, or 8 character hex codes
		return /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color);
	}

	// Convert hex to RGBA values
	hexToRgba(hex) {
		const clean = this.formatHex(hex, '#000000').substring(1);
		const r = parseInt(clean.substring(0, 2), 16);
		const g = parseInt(clean.substring(2, 4), 16);
		const b = parseInt(clean.substring(4, 6), 16);
		const a = clean.length === 8 ? parseInt(clean.substring(6, 8), 16) / 255 : 1;
		return { r, g, b, a };
	}

	// Convert RGBA to hex
	rgbaToHex(r, g, b, a = 1) {
		const toHex = (n) => {
			const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};

		const hex = '#' + toHex(r) + toHex(g) + toHex(b);
		if (a < 1) {
			return hex + toHex(Math.round(a * 255));
		}
		return hex;
	}

	// ARGB format conversion (for Rive compatibility)
	hexToArgb(hex, defaultAlpha = 0xff) {
		const rgba = this.hexToRgba(hex);
		const alpha = Math.round(rgba.a * 255);
		return (alpha << 24) | (rgba.r << 16) | (rgba.g << 8) | rgba.b;
	}

	argbToHex(argb, includeAlpha = false) {
		if (typeof argb !== 'number') return '#00ff41';
		const a = (argb >> 24) & 0xff;
		const r = (argb >> 16) & 0xff;
		const g = (argb >> 8) & 0xff;
		const b = argb & 0xff;

		if (includeAlpha && a < 255) {
			return this.rgbaToHex(r, g, b, a / 255);
		}
		return this.rgbaToHex(r, g, b, 1);
	}
}

// CSS is now handled by StyleSheetManager with adoptedStyleSheets
// No need to load external CSS files into the document head

// Export backward compatibility
export { TComponent as TerminalComponent };
