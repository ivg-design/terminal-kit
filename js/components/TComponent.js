/**
 * Base class for all Terminal UI Web Components
 * Now uses Shadow DOM with adoptedStyleSheets for proper encapsulation
 * without memory duplication
 */

import componentLogger from '../utils/ComponentLogger.js';
import { styleSheetManager, stylesReady } from '../utils/StyleSheetManager.js';

export class TComponent extends HTMLElement {
	constructor() {
		super();

		// Create Shadow DOM for proper encapsulation
		this.attachShadow({ mode: 'open' });

		this._props = {};
		this._listeners = new Map();
		this._initialized = false;
		this._stylesAdopted = false;

		// Set up component logger
		this.log = componentLogger.for(this.constructor.name);

		// Adopt styles - will happen immediately if ready, or async if not
		this.adoptComponentStyles();
	}

	/**
	 * Adopt stylesheets for this component
	 * Uses shared CSSStyleSheet objects - NO duplication!
	 */
	adoptComponentStyles() {
		// If styles are already initialized, adopt immediately
		if (styleSheetManager && styleSheetManager.initialized) {
			this._adoptStyles();
		} else {
			// Otherwise wait for styles to be ready
			stylesReady.then(() => {
				this._adoptStyles();
			});
		}
	}

	_adoptStyles() {
		if (this._stylesAdopted) return; // Don't adopt twice

		const sheets = styleSheetManager.getComponentStyleSheets(this.constructor.name);
		if (sheets.length > 0 && this.shadowRoot) {
			this.shadowRoot.adoptedStyleSheets = sheets;
			this._stylesAdopted = true;
			this.log.debug(`Adopted ${sheets.length} stylesheets`);
		}
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
		this.log.debug('Connected to DOM');
		this.render();
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
