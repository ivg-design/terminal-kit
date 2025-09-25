/**
 * TButton Web Component
 * Terminal-styled button with variants and states
 */

import { TComponent } from './TComponent.js';

export class TButton extends TComponent {
	static get observedAttributes() {
		return ['variant', 'type', 'size', 'disabled', 'icon', 'loading', 'toggle-state', 'icon-on', 'icon-off', 'color-on', 'color-off', 'loader-type', 'loader-color'];
	}

	constructor() {
		super();

		// Capture initial text content before any rendering
		this._initialText = this.textContent || '';

		// Initialize props
		this.setProps({
			variant: 'primary', // primary, secondary, danger, toggle
			type: 'text', // text, icon-text, icon
			size: 'default', // xs, small, default, large
			disabled: false,
			icon: null,
			loading: false,
			text: '',
			toggleState: false,
			iconOn: null,
			iconOff: null,
			colorOn: null,
			colorOff: null,
			loaderType: 'spinner', // spinner, dots, bars
			loaderColor: null, // custom color for loader
		});
	}

	/**
	 * Generate a generic template for DSD that works for all variants
	 * This template should NOT include variant-specific classes
	 */
	getGenericTemplate() {
		// Return a minimal template that can work with any variant
		// The actual variant classes will be added during hydration
		return `
			<style>
				/* Include all variant styles using :host() selectors */
				:host([variant="primary"]) button {
					background: var(--color-primary, #00ff00);
					color: var(--color-black, #000000);
				}
				:host([variant="secondary"]) button {
					background: var(--color-secondary, #00ffff);
					color: var(--color-black, #000000);
				}
				:host([variant="success"]) button {
					background: var(--color-success, #00ff00);
					color: var(--color-black, #000000);
				}
				:host([variant="danger"]) button {
					background: var(--color-danger, #ff0000);
					color: var(--color-white, #ffffff);
				}
				:host([variant="warning"]) button {
					background: var(--color-warning, #ffff00);
					color: var(--color-black, #000000);
				}
				:host([variant="info"]) button {
					background: var(--color-info, #00ffff);
					color: var(--color-black, #000000);
				}

				/* Base button styles */
				button {
					padding: 0.5em 1em;
					border: 1px solid currentColor;
					cursor: pointer;
					font-family: inherit;
					transition: all 0.2s;
				}

				:host([disabled]) button {
					opacity: 0.5;
					cursor: not-allowed;
				}
			</style>
			<button class="t-btn" type="button">
				<slot></slot>
			</button>
		`;
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'variant':
				this.setProp('variant', newValue || 'primary');
				break;
			case 'type':
				this.setProp('type', newValue || 'text');
				break;
			case 'size':
				this.setProp('size', newValue || 'default');
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'icon':
				this.setProp('icon', newValue);
				break;
			case 'loading':
				this.setProp('loading', newValue !== null);
				break;
			case 'toggle-state':
				this.setProp('toggleState', newValue === 'true');
				break;
			case 'icon-on':
				this.setProp('iconOn', newValue);
				break;
			case 'icon-off':
				this.setProp('iconOff', newValue);
				break;
			case 'color-on':
				this.setProp('colorOn', newValue);
				break;
			case 'color-off':
				this.setProp('colorOff', newValue);
				break;
			case 'loader-type':
				this.setProp('loaderType', newValue || 'spinner');
				break;
			case 'loader-color':
				this.setProp('loaderColor', newValue);
				break;
		}
	}

	template() {
		const { variant, type, size, disabled, icon, loading, text, toggleState, iconOn, iconOff, colorOn, colorOff, loaderType, loaderColor } = this._props;

		// Get button text - from prop first, then initial text captured in constructor
		const buttonText = text || this._initialText || '';

		// Build class list
		const classes = ['t-btn'];

		// Add variant class
		if (variant === 'toggle') {
			classes.push('t-btn--toggle');
			if (toggleState) {
				classes.push('is-on');
			} else {
				classes.push('is-off');
			}
		} else if (variant && variant !== 'default') {
			classes.push(`t-btn--${variant}`);
		}

		// Add type class
		if (type === 'icon') {
			classes.push('t-btn--icon');
		} else if (type === 'icon-text') {
			classes.push('t-btn--icon-text');
		} else {
			classes.push('t-btn--text');
		}

		// Add size class with proper mapping
		if (size && size !== 'default') {
			// Map size names to CSS class names
			const sizeMap = {
				small: 'sm',
				large: 'lg',
				xs: 'xs',
				sm: 'sm',
				lg: 'lg',
				xl: 'xl',
				xxs: 'xxs',
				xxl: 'xxl',
			};
			const mappedSize = sizeMap[size] || size;
			classes.push(`t-btn--${mappedSize}`);
		}

		if (loading) {
			classes.push('is-loading');
			// Remove loader type class, not needed
		}

		// Build button content
		let content = '';
		let currentIcon = icon;

		// Handle toggle icon
		if (variant === 'toggle' && (iconOn || iconOff)) {
			currentIcon = toggleState ? iconOn || icon : iconOff || icon;
		}

		// Scale icon based on button size
		if (currentIcon) {
			currentIcon = this._scaleIcon(currentIcon, size);
		}

		if (loading) {
			// ONLY show loader when loading - no text at all
			// Render loader HTML directly (can't use web components inside shadow DOM)
			const loaderColor = this.getProp('loaderColor') || 'var(--terminal-green)';

			// Build loader HTML based on type - use classes for animations!
			if (loaderType === 'dots') {
				content = `
					<div class="btn-loader-dots" style="--loader-color: ${loaderColor};">
						<div class="btn-dot btn-dot-1"></div>
						<div class="btn-dot btn-dot-2"></div>
						<div class="btn-dot btn-dot-3"></div>
					</div>
				`;
			} else if (loaderType === 'bars') {
				content = `
					<div class="btn-loader-bars" style="--loader-color: ${loaderColor};">
						<div class="btn-bar btn-bar-1"></div>
						<div class="btn-bar btn-bar-2"></div>
						<div class="btn-bar btn-bar-3"></div>
						<div class="btn-bar btn-bar-4"></div>
						<div class="btn-bar btn-bar-5"></div>
					</div>
				`;
			} else {
				// spinner (default)
				content = `
					<div class="btn-loader-spinner" style="--loader-color: ${loaderColor};"></div>
				`;
			}
		} else if (size === 'xs' && type === 'icon') {
			// XS icon buttons are ICON ONLY - no span wrapper!
			content = currentIcon || '<i></i>';
		} else if (type === 'icon') {
			// Icon-only button - no span wrapper!
			content = currentIcon || (buttonText ? `<span class="t-btn__text">${buttonText}</span>` : '');
		} else if (type === 'icon-text' && currentIcon && buttonText) {
			// Icon + text button - icon direct, text in span
			content = `${currentIcon}<span class="t-btn__text">${buttonText}</span>`;
		} else if (type === 'text' || !currentIcon) {
			// Text-only button
			content = buttonText ? `<span class="t-btn__text">${buttonText}</span>` : '';
		} else if (currentIcon) {
			// Fallback if just icon is provided - no span wrapper!
			content = currentIcon;
		}

		// Handle custom colors for toggle and loader
		let style = '';
		const styles = [];

		if (variant === 'toggle') {
			if (colorOff) {
				styles.push(`--toggle-color-off: ${colorOff}`);
			}
			if (colorOn) {
				styles.push(`--toggle-color-on: ${colorOn}`);
				// Calculate darker version for hover
				styles.push(`--toggle-color-on-dark: ${colorOn}cc`); // Add transparency for darker effect
			}
		}

		// Add loader color if specified
		if (loaderColor) {
			styles.push(`--loader-color: ${loaderColor}`);
		}

		if (styles.length > 0) {
			style = `style="${styles.join('; ')}"`;
		}

		return `
      <button 
        class="${classes.join(' ')}" 
        ${disabled ? 'disabled' : ''}
        type="button"
        ${style}
      >
        ${content}
      </button>
    `;
	}

	_scaleIcon(iconSvg, size) {
		if (!iconSvg) return iconSvg;

		// Determine icon dimensions based on button size
		let iconSize;
		switch (size) {
			case 'xs':
				iconSize = 12;
				break;
			case 'small':
				iconSize = 16; // Small uses same icon size as default
				break;
			case 'large':
				iconSize = 20;
				break;
			default: // 'default'
				iconSize = 16;
				break;
		}

		// Replace width and height attributes in the SVG
		let scaledIcon = iconSvg;
		scaledIcon = scaledIcon.replace(/width="[^"]*"/i, `width="${iconSize}"`);
		scaledIcon = scaledIcon.replace(/height="[^"]*"/i, `height="${iconSize}"`);

		// If no width/height attributes exist, add them
		if (!scaledIcon.includes('width=')) {
			scaledIcon = scaledIcon.replace('<svg', `<svg width="${iconSize}" height="${iconSize}"`);
		}

		return scaledIcon;
	}

	afterRender() {
		this._setupButtonInteractivity();
	}

	/**
	 * DSD Hydration: Cache DOM elements
	 */
	hydrateElements() {
		this._button = this.$('button');
	}

	/**
	 * DSD Hydration: Bind event listeners
	 */
	hydrateEventListeners() {
		this._setupButtonInteractivity();
	}

	/**
	 * Setup button interactivity (shared between render and hydrate)
	 */
	_setupButtonInteractivity() {
		const button = this._button || this.$('button');

		if (button) {
			// Cache button reference for future use
			this._button = button;

			// Restore captured width if it exists
			if (this._capturedWidth) {
				button.style.minWidth = this._capturedWidth;
			}

			// Handle click events
			this.addListener(button, 'click', (e) => {
				if (!this.getProp('disabled') && !this.getProp('loading')) {
					// Handle toggle
					if (this.getProp('variant') === 'toggle') {
						const newState = !this.getProp('toggleState');
						this.setProp('toggleState', newState);
						this.setAttribute('toggle-state', newState.toString());
						this.emit('toggle-change', { state: newState });
					}
					this.emit('button-click', { originalEvent: e });
				}
			});

			// Handle hover effects
			this.addListener(button, 'mouseenter', () => {
				if (!this.getProp('disabled')) {
					button.classList.add('hover');
				}
			});

			this.addListener(button, 'mouseleave', () => {
				button.classList.remove('hover');
			});
		}
	}

	// Public API
	click() {
		const button = this.$('button');
		if (button && !this.getProp('disabled') && !this.getProp('loading')) {
			button.click();
		}
	}

	disable() {
		this.setProp('disabled', true);
		const button = this.$('button');
		if (button) button.disabled = true;
	}

	enable() {
		this.setProp('disabled', false);
		const button = this.$('button');
		if (button) button.disabled = false;
	}

	setLoading(loading) {
		const button = this.$('button');

		// Capture the button width before changing state
		if (button && loading && !this._capturedWidth) {
			this._capturedWidth = button.offsetWidth + 'px';
			button.style.minWidth = this._capturedWidth;
		}

		this.setProp('loading', loading);
		if (loading) {
			this.setAttribute('loading', '');
		} else {
			this.removeAttribute('loading');
		}

		// Maintain the width after render
		if (button && this._capturedWidth) {
			button.style.minWidth = this._capturedWidth;
		}
	}

	setText(text) {
		this.setProp('text', text);
		// Force re-render to update the text
		this.render();
	}

	setIcon(iconSvg) {
		this.setProp('icon', iconSvg);
	}

	setVariant(variant) {
		this.setProp('variant', variant);
	}

	setType(type) {
		this.setProp('type', type);
	}

	setSize(size) {
		this.setProp('size', size);
	}

	// Toggle-specific methods
	toggle() {
		if (this.getProp('variant') === 'toggle') {
			const newState = !this.getProp('toggleState');
			this.setProp('toggleState', newState);
			this.setAttribute('toggle-state', newState.toString());
			this.emit('toggle-change', { state: newState });
			return newState;
		}
		return false;
	}

	setToggleState(state) {
		this.setProp('toggleState', state);
		this.setAttribute('toggle-state', state.toString());
	}

	getToggleState() {
		return this.getProp('toggleState');
	}
}

// Register the component
customElements.define('t-btn', TButton);
