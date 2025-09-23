/**
 * TerminalColorPicker Web Component
 * Complete rewrite to fix all critical issues
 */

import { TComponent } from './TComponent.js';
import { paletteIcon, xIcon, minusSquareIcon } from '../utils/phosphor-icons.js';

// Debug mode - set to false in production
const DEBUG_MODE = window.TERMINAL_DEBUG || false;
const log = (...args) => DEBUG_MODE && console.log('[ColorPicker]', ...args);
const warn = (...args) => console.warn('[ColorPicker]', ...args);
const error = (...args) => console.error('[ColorPicker]', ...args);

export class TColorPicker extends TComponent {
	static get observedAttributes() {
		return ['value', 'label1', 'label2', 'disabled', 'compact', 'variant'];
	}

	constructor() {
		super();
		log('Constructor called');

		// Initialize props
		this.setProps({
			value: '#00ff41',
			label1: 'Color',
			label2: 'Picker',
			disabled: false,
			compact: false,
			variant: 'default', // default | minimal
			icon: paletteIcon,
			icon_disabled: xIcon,
		});

		// Bind methods properly
		this.handleHexInput = this.debounce(this.handleHexInput.bind(this), 300);

		// Initialize state
		this.pickr = null;
		this.customSwatches = [];
		this._initTimeout = null;
		this._pickrId = null; // Store consistent ID for this instance
		this._pendingColorUpdate = null;

		// Load custom swatches safely
		this.loadCustomSwatches();
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'value':
				this.setProp('value', this.formatHex(newValue));
				break;
			case 'label1':
				this.setProp('label1', newValue);
				break;
			case 'label2':
				this.setProp('label2', newValue);
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'compact':
				this.setProp('compact', newValue !== null);
				break;
			case 'variant':
				this.setProp('variant', newValue || 'default');
				break;
		}
	}

	template() {
		const { value, label1, label2, icon, icon_disabled, compact, variant } = this._props;

		// Minimal variant - simple swatch and hex input
		if (variant === 'minimal') {
			return `
				<div class="color-picker-wrapper minimal ${compact ? 'compact' : ''}">
					<div class="color-picker-swatch-minimal" data-color="${value}">
						<div class="color-picker-swatch-color" style="background: ${value}"></div>
					</div>
					<input
						type="text"
						class="color-picker-hex"
						value="${value}"
						placeholder="#000000"
						maxlength="7"
					/>
				</div>
			`;
		}

		// Default variant
		return `
			<div class="color-picker-wrapper ${compact ? 'compact' : ''}">
				<div class="color-picker-icon">
					${icon}
				</div>
				<div class="color-picker-label">
					<span class="color-picker-label-line1">${label1}</span>
					<span class="color-picker-label-line2">${label2}</span>
				</div>
				<div class="color-picker-swatch" data-color="${value}">
					<div class="color-picker-swatch-color" style="background: ${value}">
						${icon_disabled}
					</div>
				</div>
				<div class="colorIO">
					<input
						type="text"
						class="color-picker-hex"
						value="${value}"
						placeholder="#000000"
						maxlength="7"
					/>
				</div>
			</div>
		`;
	}

	// Override shouldRender to prevent unnecessary re-renders when Pickr is initialized
	shouldRender(propName, oldValue, newValue) {
		// If Pickr is already initialized, don't re-render the entire component
		// Just update Pickr's value if needed
		if (this.pickr && propName === 'value') {
			log('Updating color directly without re-render');
			if (newValue && newValue !== this.pickr.getColor().toHEXA().toString()) {
				this.pickr.setColor(newValue);
			}
			return false; // Don't re-render
		}

		// Don't re-render if Pickr is initialized for other prop changes either
		if (this.pickr) {
			log(`Skipping re-render for prop: ${propName}`);
			return false;
		}

		// Allow initial render
		return true;
	}

	beforeRender() {
		// Clean up Pickr before re-rendering to avoid orphaned instances
		if (this.pickr) {
			log('Cleaning up Pickr for re-render');
			this.cleanupPickr();
		}
	}

	afterRender() {
		log('After render');

		// Apply disabled state
		if (this.getProp('disabled')) {
			this.$('.color-picker-wrapper').classList.add('disabled');
		}

		// Bind hex input events
		const hexInput = this.$('.color-picker-hex');
		if (hexInput) {
			this.addListener(hexInput, 'input', (e) => this.handleHexInput(e.target.value));
			this.addListener(hexInput, 'blur', () => this.validateHex());
		}

		// If we're using native fallback, set it up
		if (this._useNativeFallback) {
			log('Using native fallback');
			this.setupNativeFallback();
		} else {
			// DO NOT add click handler to swatch - Pickr handles it with useAsButton:true!
			// Initialize Pickr only when needed and library is available
			this.initializePickrIfNeeded();
		}
	}


	initializePickrIfNeeded() {
		// Clear any existing timeout
		if (this._initTimeout) {
			clearTimeout(this._initTimeout);
			this._initTimeout = null;
		}

		// Don't initialize if already initialized
		if (this.pickr) {
			return;
		}

		// Check if Pickr is available
		if (!window.Pickr) {
			// Try to load Pickr after a short delay
			this._initTimeout = setTimeout(() => {
				this._initTimeout = null;
				this.loadPickrLibrary();
			}, 100);
			return;
		}

		// Pickr is already available, initialize it now!
		this.initPickr();
	}

	loadPickrLibrary() {
		if (!window.Pickr && !this._loadingPickr) {
			this._loadingPickr = true;

			// Get base path - more robust detection
			const getBasePath = () => {
				// Check if we have a data attribute for base path
				if (this.dataset.pickrBasePath) {
					return this.dataset.pickrBasePath;
				}
				// Check for global configuration
				if (window.TERMINAL_CONFIG && window.TERMINAL_CONFIG.pickrPath) {
					return window.TERMINAL_CONFIG.pickrPath;
				}
				// Default based on location
				const pathSegments = window.location.pathname.split('/');
				if (pathSegments.includes('demos')) {
					return '..';
				}
				return '';
			};

			const basePath = getBasePath();

			// Check if CSS is loaded
			if (!document.querySelector('link[href*="pickr"]')) {
				const pickrCSS = document.createElement('link');
				pickrCSS.rel = 'stylesheet';
				pickrCSS.href = `${basePath}/css/libs/pickr.min.css`.replace(/\/+/g, '/');
				document.head.appendChild(pickrCSS);
			}

			// Load JS
			const pickrScript = document.createElement('script');
			pickrScript.src = `${basePath}/public/js/libs/pickr.min.js`.replace(/\/+/g, '/');
			pickrScript.onload = () => {
				this._loadingPickr = false;
				this.initPickr();
			};
			pickrScript.onerror = () => {
				warn('Failed to load Pickr library, using native fallback');
				this._loadingPickr = false;
				// Set up fallback click handler for native color picker
				this._useNativeFallback = true;
				this.setupNativeFallback();
			};
			document.head.appendChild(pickrScript);
		}
	}

	initPickr() {
		// Prevent multiple initializations
		if (this.pickr) {
			return;
		}

		// Ensure Pickr is available
		if (!window.Pickr) {
			warn('Pickr library not available');
			return;
		}

		const variant = this.getProp('variant');
		const swatch = variant === 'minimal'
			? this.$('.color-picker-swatch-minimal')
			: this.$('.color-picker-swatch');

		if (!swatch) {
			warn('Swatch element not found');
			return;
		}

		log('Initializing Pickr');

		// Generate ID once and reuse it
		if (!this._pickrId) {
			this._pickrId = this.generateId();
		}

		try {
			// Ensure customSwatches is a valid array
			if (!Array.isArray(this.customSwatches)) {
				this.customSwatches = [];
			}

			// Build swatches array - ALWAYS set swatches (array or null, never undefined)
			let swatches;
			if (variant === 'minimal') {
				// Explicitly set to null for minimal variant
				swatches = null;
			} else {
				// Include swatches for non-minimal variant
				swatches = [
					'#00ff41', // Terminal green
					'#ff0041', // Terminal red
					'#0041ff', // Terminal blue
					'#ffcc00', // Terminal yellow
					'#ff00ff', // Terminal magenta
					'#00ffff', // Terminal cyan
					'#ffffff', // White
					'#cccccc', // Light gray
					'#666666', // Medium gray
					'#333333', // Dark gray
					'#000000', // Black
				];

				// Add custom swatches if available
				if (this.customSwatches.length > 0) {
					swatches.push(...this.customSwatches);
				}
			}

			// Create Pickr configuration
			const config = {
				el: swatch,
				theme: 'classic',
				default: this.getProp('value'),
				useAsButton: true, // This makes Pickr handle all clicks!
				appClass: `pickr-${this._pickrId}`, // Use consistent ID
				comparison: false,
				defaultRepresentation: 'HEXA', // Show HEXA format (with alpha) by default
				position: 'bottom-middle',
				adjustableNumbers: true,
				container: 'body',
				swatches: swatches, // ALWAYS set swatches (array or null)

				components: {
					preview: true,
					opacity: true, // Enable opacity/transparency slider
					hue: true,

					interaction: {
						hex: false, // Disable HEX (no alpha)
						hexa: true, // Enable HEXA (with alpha)
						rgba: true,
						hsla: true,
						hsva: false,
						cmyk: false,
						input: true,
						clear: false,
						save: variant !== 'minimal', // No save button for minimal
					},
				},
			};

			// Create Pickr instance
			this.pickr = Pickr.create(config);


			// Bind events
			this.setupPickrEvents();

			// If we have a pending color update, apply it now
			if (this._pendingColorUpdate) {
				this.pickr.setColor(this._pendingColorUpdate);
				this._pendingColorUpdate = null;
			}

		} catch (err) {
			error('Error initializing Pickr:', err);
			this.pickr = null;
		}
	}

	setupPickrEvents() {
		if (!this.pickr) return;

		// Handle save event - ONLY when save button is explicitly clicked
		this.pickr.on('save', (color, instance) => {
			if (color) {
				const hex = color.toHEXA().toString();
				this.updateColor(hex);

				// Add to custom swatches only for non-minimal AND only on explicit save
				if (this.getProp('variant') !== 'minimal') {
					this.addColorToSwatches(hex);
				}

				// Emit save event with proper target
				this.emit('color-save', {
					color: hex,
					timestamp: Date.now()
				});
			}
			this.pickr.hide();
		});

		// Handle change event (live updates)
		this.pickr.on('change', (color) => {
			if (color) {
				// Always store as HEXA internally for consistency
				const hex = color.toHEXA().toString();
				this.updateColor(hex);
			}
		});

		// Handle initialization
		this.pickr.on('init', (instance) => {
			// Update swatches display after init for non-minimal
			if (this.getProp('variant') !== 'minimal') {
				setTimeout(() => {
					this.updateSwatchesDisplay();
					this.addSwatchRemovalHandlers();
				}, 50);
			}
		});

		// Handle show event to re-add handlers
		this.pickr.on('show', () => {
			if (this.getProp('variant') !== 'minimal') {
				setTimeout(() => {
					this.addSwatchRemovalHandlers();
				}, 100);
			}
		});
	}

	handleHexInput(value) {
		const formatted = this.formatHex(value);

		if (this.isValidHex(formatted)) {
			this.updateColor(formatted, false); // Don't update input
			this.$('.color-picker-wrapper').classList.remove('error');
		} else {
			this.$('.color-picker-wrapper').classList.add('error');
		}
	}

	validateHex() {
		const input = this.$('.color-picker-hex');
		const value = this.formatHex(input.value);

		if (this.isValidHex(value)) {
			this.updateColor(value);
			this.$('.color-picker-wrapper').classList.remove('error');
		} else {
			// Revert to last valid color
			input.value = this.getProp('value');
			this.$('.color-picker-wrapper').classList.remove('error');
		}
	}

	setupNativeFallback() {
		const variant = this.getProp('variant');
		const swatch = variant === 'minimal'
			? this.$('.color-picker-swatch-minimal')
			: this.$('.color-picker-swatch');

		if (swatch && !this._nativeFallbackSetup) {
			this._nativeFallbackSetup = true;
			this.addListener(swatch, 'click', () => this.showNativeColorPicker());
		}
	}

	showNativeColorPicker() {
		if (this.getProp('disabled')) return;

		if (!this._nativeInput) {
			this._nativeInput = document.createElement('input');
			this._nativeInput.type = 'color';
			this._nativeInput.style.display = 'none';
			document.body.appendChild(this._nativeInput);

			this._nativeInput.addEventListener('change', (e) => {
				this.updateColor(e.target.value);
			});
		}

		this._nativeInput.value = this.getProp('value');
		this._nativeInput.click();
	}

	updateColor(color, updateInput = true) {
		const formatted = this.formatHex(color);

		// Update internal state properly through setProp
		this.setProp('value', formatted);

		// Update UI elements directly
		const swatchColor = this.$('.color-picker-swatch-color');
		const hexInput = this.$('.color-picker-hex');

		if (swatchColor) {
			swatchColor.style.background = formatted;
		}

		if (updateInput && hexInput && hexInput.value !== formatted) {
			hexInput.value = formatted;
		}

		// Update attribute is now done before event emission

		// Update Pickr if it exists
		if (this.pickr) {
			try {
				const currentColor = this.pickr.getColor();
				// Compare 6-digit hex only (no alpha)
				const currentHex = currentColor ? currentColor.toHEXA().toString().substring(0, 7) : null;
				if (currentHex !== formatted) {
					this.pickr.setColor(formatted, true); // Silent update
				}
			} catch (e) {
				// Pickr might not be ready yet, store for later
				this._pendingColorUpdate = formatted;
			}
		}

		// Create a proper event that works with e.target.value
		// First update our own value property so e.target.value works
		if (this.getAttribute('value') !== formatted) {
			this.setAttribute('value', formatted);
		}

		// Create event with detail and dispatch it
		const changeEvent = new CustomEvent('change', {
			bubbles: true,
			composed: true,
			detail: {
				color: formatted,
				value: formatted
			}
		});

		// The event.target will be 'this' when dispatched
		this.dispatchEvent(changeEvent);

		// Also emit color-change for backwards compatibility
		this.emit('color-change', {
			color: formatted,
			value: formatted
		});
	}

	addColorToSwatches(hex) {
		// Only for non-minimal variants
		if (this.getProp('variant') === 'minimal') {
			return;
		}

		// Ensure we have a valid array
		if (!Array.isArray(this.customSwatches)) {
			this.customSwatches = [];
		}

		// Check if color already exists
		if (this.customSwatches.includes(hex)) {
			return;
		}

		// Add to custom swatches
		this.customSwatches.unshift(hex);

		// Limit to 20 custom swatches
		if (this.customSwatches.length > 20) {
			this.customSwatches = this.customSwatches.slice(0, 20);
		}


		// Save to localStorage
		this.saveCustomSwatches();

		// Update display
		this.updateSwatchesDisplay();

		// IMPORTANT: Pickr doesn't dynamically update swatches after creation
		// We need to add the swatch to Pickr's internal state
		if (this.pickr && this.pickr.addSwatch) {
			this.pickr.addSwatch(hex);
		}
	}

	updateSwatchesDisplay() {
		if (!this.pickr || this.getProp('variant') === 'minimal') {
			return;
		}

		// Cache DOM queries
		if (!this._swatchContainerCache || !this._swatchContainerCache.isConnected) {
			const pickrApp = document.querySelector(`.pickr-${this._pickrId}`);
			if (!pickrApp) return;
			this._swatchContainerCache = pickrApp.querySelector('.pcr-swatches');
		}

		const swatchContainer = this._swatchContainerCache;
		if (!swatchContainer) return;

		// Clear existing custom swatch indicators
		swatchContainer.querySelectorAll('.pcr-button.custom-swatch').forEach(btn => {
			btn.classList.remove('custom-swatch');
		});

		// Mark custom swatches
		this.customSwatches.forEach(customColor => {
			const buttons = swatchContainer.querySelectorAll('.pcr-button');
			buttons.forEach(btn => {
				const btnColor = btn.style.getPropertyValue('--pcr-color');
				if (btnColor && this.colorsMatch(btnColor, customColor)) {
					btn.classList.add('custom-swatch');
					btn.title = 'Custom swatch - Cmd+Click to remove';
				}
			});
		});
	}

	addSwatchRemovalHandlers() {
		if (!this.pickr || this.getProp('variant') === 'minimal') return;

		const pickrApp = document.querySelector(`.pickr-${this._pickrId}`);
		if (!pickrApp) return;

		const swatchContainer = pickrApp.querySelector('.pcr-swatches');
		if (!swatchContainer) return;


		// Track state
		let cmdPressed = false;
		let hoveredButton = null;

		// Clean up old handlers first
		if (this._swatchKeyHandlers) {
			this._swatchKeyHandlers.forEach(([event, handler]) => {
				document.removeEventListener(event, handler);
			});
			this._swatchKeyHandlers = [];
		}

		// Clean up old mouse handlers
		if (this._swatchMouseHandlers) {
			Object.entries(this._swatchMouseHandlers).forEach(([event, handler]) => {
				swatchContainer.removeEventListener(event, handler);
			});
		}

		// Get the index where custom swatches start
		// Default swatches: 11 colors (0-10), custom swatches start at index 11
		const CUSTOM_SWATCH_START_INDEX = 11;

		// Helper to check if a button is custom based on its position
		const isCustomSwatch = (btn) => {
			// Get all buttons in the swatch container
			const allButtons = Array.from(swatchContainer.querySelectorAll('button'));
			const btnIndex = allButtons.indexOf(btn);

			// Custom swatches are added after the default ones
			return btnIndex >= CUSTOM_SWATCH_START_INDEX;
		};

		// Mark custom swatches (but NO removable class)
		const markCustomSwatches = () => {
			const buttons = Array.from(swatchContainer.querySelectorAll('button'));
			buttons.forEach((btn, index) => {
				// Clear any previous state
				btn.classList.remove('custom-swatch', 'removable');
				btn.style.cursor = '';

				// Mark custom swatches based on index
				if (index >= CUSTOM_SWATCH_START_INDEX) {
					btn.classList.add('custom-swatch');
					btn.setAttribute('data-custom', 'true');
					btn.setAttribute('data-index', index.toString());
				} else {
					btn.removeAttribute('data-custom');
					btn.removeAttribute('data-index');
				}
			});
		};

		// Update removable state for hovered button only
		const updateHoverState = () => {
			// Remove all removable classes first
			swatchContainer.querySelectorAll('button').forEach(btn => {
				btn.classList.remove('removable');
				btn.style.cursor = '';
			});

			// Add removable ONLY to hovered custom swatch when CMD pressed
			if (cmdPressed && hoveredButton && hoveredButton.classList.contains('custom-swatch')) {
				hoveredButton.classList.add('removable');
				hoveredButton.style.cursor = 'crosshair';
			}
		};

		// Mouse enter/leave handlers for individual buttons
		const handleButtonEnter = (e) => {
			if (e.target.tagName === 'BUTTON') {
				hoveredButton = e.target;
				updateHoverState();
			}
		};

		const handleButtonLeave = (e) => {
			if (e.target === hoveredButton) {
				hoveredButton = null;
				updateHoverState();
			}
		};

		// Key handlers
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && !cmdPressed) {
				cmdPressed = true;
				updateHoverState();
			}
		};

		const handleKeyUp = (e) => {
			if (!e.metaKey && !e.ctrlKey && cmdPressed) {
				cmdPressed = false;
				updateHoverState();
			}
		};

		const handleBlur = () => {
			cmdPressed = false;
			hoveredButton = null;
			updateHoverState();
		};

		// Use event delegation on container
		swatchContainer.addEventListener('mouseenter', handleButtonEnter, true);
		swatchContainer.addEventListener('mouseleave', handleButtonLeave, true);
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		window.addEventListener('blur', handleBlur);

		// Store handlers for cleanup
		this._swatchKeyHandlers = [
			['keydown', handleKeyDown],
			['keyup', handleKeyUp]
		];
		this._swatchMouseHandlers = {
			mouseenter: handleButtonEnter,
			mouseleave: handleButtonLeave
		};

		// Click handler for removing swatches
		const handleSwatchClick = (e) => {
			if (e.target.tagName !== 'BUTTON') return;

			const btn = e.target;

			// Check if this is a custom swatch based on its position
			if (cmdPressed && btn.classList.contains('custom-swatch')) {
				const btnColor = btn.style.getPropertyValue('--pcr-color');
				if (!btnColor) return;
				const normalizedBtnColor = this.formatHex(btnColor);
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				// Find and remove the matching color from custom swatches
				const colorIndex = this.customSwatches.findIndex(c =>
					this.formatHex(c).toLowerCase() === normalizedBtnColor.toLowerCase()
				);

				if (colorIndex !== -1) {
					this.customSwatches.splice(colorIndex, 1);
				} else {
					// Color not found in custom swatches, don't remove
					return;
				}

				// Save to localStorage
				this.saveCustomSwatches();

				// Remove the button from DOM
				btn.remove();

				// Reset hover state
				hoveredButton = null;

				// Re-mark remaining swatches and re-attach handlers
				setTimeout(() => {
					markCustomSwatches();
					// Re-attach handlers in case Pickr re-created elements
					this.addSwatchRemovalHandlers();
				}, 100);

				return false;
			}
		};

		// Use mousedown to intercept before Pickr
		swatchContainer.addEventListener('mousedown', handleSwatchClick, true);
		this._swatchClickHandler = handleSwatchClick;

		// Initial marking
		markCustomSwatches();
	}

	removeColorFromSwatches(color) {
		const index = this.customSwatches.findIndex(c => this.colorsMatch(c, color));
		if (index > -1) {
			this.customSwatches.splice(index, 1);
			this.saveCustomSwatches();
		}
	}

	recreatePickr() {
		// Store current color
		const currentColor = this.pickr.getColor().toHEXA().toString();

		// Destroy old instance
		if (this.pickr) {
			this.pickr.destroy();
			this.pickr = null;
		}

		// Recreate with updated swatches
		this.initPickr();

		// Restore color
		if (this.pickr) {
			this.pickr.setColor(currentColor);
		}
	}

	loadCustomSwatches() {
		try {
			const saved = localStorage.getItem('terminal-color-swatches');
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					this.customSwatches = parsed.filter(c => this.isValidHex(c));
				} else {
					this.customSwatches = [];
				}
			} else {
				this.customSwatches = [];
			}
		} catch (e) {
			warn('Error loading custom swatches:', e);
			this.customSwatches = [];
		}
	}

	saveCustomSwatches() {
		try {
			if (Array.isArray(this.customSwatches)) {
				localStorage.setItem('terminal-color-swatches', JSON.stringify(this.customSwatches));
				this.emit('swatches-updated', { swatches: [...this.customSwatches] });
			}
		} catch (e) {
			warn('Error saving custom swatches:', e);
		}
	}

	// Clear all custom swatches - useful for debugging
	// To use from console: document.querySelector('terminal-color-picker').clearAllCustomSwatches()
	// Or from your app: colorPicker.clearAllCustomSwatches()
	clearAllCustomSwatches() {
		this.customSwatches = [];
		localStorage.removeItem('terminal-color-swatches');
		if (this.pickr) {
			this.recreatePickr();
		}
		log('All custom swatches cleared');
		this.emit('swatches-cleared', {});
	}

	cleanupPickr() {
		if (this.pickr) {
			try {
				// Hide first if it's open
				if (this.pickr.isOpen && this.pickr.isOpen()) {
					this.pickr.hide();
				}
				// Destroy the instance
				this.pickr.destroyAndRemove();
			} catch (e) {
				warn('Error cleaning up Pickr:', e);
			}
			this.pickr = null;
		}
	}

	onUnmount() {
		// Clear any pending timeouts
		if (this._initTimeout) {
			clearTimeout(this._initTimeout);
			this._initTimeout = null;
		}

		// Clean up swatch handlers
		if (this._swatchKeyHandlers) {
			this._swatchKeyHandlers.forEach(([event, handler]) => {
				document.removeEventListener(event, handler);
			});
			this._swatchKeyHandlers = null;
		}

		if (this._swatchClickHandler || this._swatchMouseHandlers) {
			const pickrApp = document.querySelector(`.pickr-${this._pickrId}`);
			if (pickrApp) {
				const swatchContainer = pickrApp.querySelector('.pcr-swatches');
				if (swatchContainer) {
					if (this._swatchClickHandler) {
						swatchContainer.removeEventListener('mousedown', this._swatchClickHandler, true);
					}
					if (this._swatchMouseHandlers) {
						Object.entries(this._swatchMouseHandlers).forEach(([event, handler]) => {
							swatchContainer.removeEventListener(event, handler);
						});
					}
				}
			}
			this._swatchClickHandler = null;
			this._swatchMouseHandlers = null;
		}

		// Clean up Pickr
		this.cleanupPickr();

		// Clean up native input if exists
		if (this._nativeInput && this._nativeInput.parentNode) {
			this._nativeInput.removeEventListener('change', this._nativeInputHandler);
			this._nativeInput.parentNode.removeChild(this._nativeInput);
			this._nativeInput = null;
		}

		// Reset state
		this._pendingColorUpdate = null;
		this._pickrId = null;
		this._loadingPickr = false;
		this._useNativeFallback = false;
		this._nativeFallbackSetup = false;
	}

	disconnectedCallback() {
		this.onUnmount();
		super.disconnectedCallback && super.disconnectedCallback();
	}

	// Override formatHex to use current value as fallback
	formatHex(color) {
		const fallback = this.getProp('value') || '#00ff41';
		return super.formatHex(color, fallback);
	}

	// Helper to compare colors
	colorsMatch(color1, color2) {
		// Normalize both colors to hex format for comparison
		const hex1 = this.formatHex(color1);
		const hex2 = this.formatHex(color2);
		return hex1.toLowerCase() === hex2.toLowerCase();
	}

	// Public API
	getValue() {
		return this.getProp('value');
	}

	// Getter for value property to support e.target.value
	get value() {
		return this.getProp('value');
	}

	// Setter for value property
	set value(val) {
		this.setValue(val);
	}

	setValue(color) {
		const formatted = this.formatHex(color);
		if (this.isValidHex(formatted)) {
			this.updateColor(formatted);
		}
	}

	setLabels(label1, label2) {
		this.setProps({ label1, label2 });
	}

	setIcon(iconSvg) {
		this.setProp('icon', iconSvg);
	}

	reset() {
		this.setValue('#00ff41');
	}

	disable() {
		this.setProp('disabled', true);
		this.$('.color-picker-wrapper')?.classList.add('disabled');
		if (this.pickr) {
			this.pickr.disable();
		}
	}

	enable() {
		this.setProp('disabled', false);
		this.$('.color-picker-wrapper')?.classList.remove('disabled');
		if (this.pickr) {
			this.pickr.enable();
		}
	}
}

// Register the component
customElements.define('t-clr', TColorPicker);