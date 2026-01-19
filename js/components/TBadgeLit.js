// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TBadgeLit
 * @tagname t-bdg
 * @description Count/status indicator badge component with variants, sizes, and positioning options.
 * @category Core
 * @since 3.0.0
 * @example
 * <t-bdg count="5"></t-bdg>
 * <t-bdg count="99" max="99" variant="error"></t-bdg>
 * <t-bdg dot pulse variant="success"></t-bdg>
 */
export class TBadgeLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-bdg';
	static version = '3.0.0';
	static category = 'Core';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TBadgeLit Component Styles
		 * Count/status indicator badges with terminal styling
		 */

		/* Host styles */
		:host {
			display: inline-flex;
			position: relative;
			--badge-bg: var(--terminal-green, #00ff41);
			--badge-color: var(--terminal-black, #0a0a0a);
			--badge-size: 20px;
			--badge-font-size: 11px;
			--badge-glow: rgba(0, 255, 65, 0.4);
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Slot container for wrapped content */
		.badge-wrapper {
			display: inline-flex;
			position: relative;
		}

		/* Badge element */
		.badge {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: var(--badge-size);
			height: var(--badge-size);
			padding: 0 6px;
			border-radius: calc(var(--badge-size) / 2);
			background: var(--badge-bg);
			color: var(--badge-color);
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: var(--badge-font-size);
			font-weight: 700;
			line-height: 1;
			text-transform: uppercase;
			letter-spacing: 0.02em;
			box-shadow: 0 0 8px var(--badge-glow);
			transition: all 0.2s ease;
			box-sizing: border-box;
		}

		/* Standalone badge (no slot content) */
		:host(:not([position])) .badge {
			position: relative;
		}

		/* Positioned badge (overlays slot content) */
		:host([position]) .badge {
			position: absolute;
			z-index: 1;
		}

		/* Position variants */
		:host([position="top-right"]) .badge {
			top: 0;
			right: 0;
			transform: translate(50%, -50%);
		}

		:host([position="top-left"]) .badge {
			top: 0;
			left: 0;
			transform: translate(-50%, -50%);
		}

		:host([position="bottom-right"]) .badge {
			bottom: 0;
			right: 0;
			transform: translate(50%, 50%);
		}

		:host([position="bottom-left"]) .badge {
			bottom: 0;
			left: 0;
			transform: translate(-50%, 50%);
		}

		/* Dot variant */
		.badge.dot {
			min-width: 10px;
			width: 10px;
			height: 10px;
			padding: 0;
		}

		/* Size variants */
		:host([size="sm"]) {
			--badge-size: 16px;
			--badge-font-size: 9px;
		}

		:host([size="sm"]) .badge.dot {
			min-width: 8px;
			width: 8px;
			height: 8px;
		}

		:host([size="lg"]) {
			--badge-size: 24px;
			--badge-font-size: 13px;
		}

		:host([size="lg"]) .badge.dot {
			min-width: 12px;
			width: 12px;
			height: 12px;
		}

		/* Variant colors */
		:host([variant="default"]) {
			--badge-bg: var(--terminal-green, #00ff41);
			--badge-color: var(--terminal-black, #0a0a0a);
			--badge-glow: rgba(0, 255, 65, 0.4);
		}

		:host([variant="success"]) {
			--badge-bg: var(--terminal-green, #00ff41);
			--badge-color: var(--terminal-black, #0a0a0a);
			--badge-glow: rgba(0, 255, 65, 0.4);
		}

		:host([variant="warning"]) {
			--badge-bg: var(--terminal-amber, #ffb000);
			--badge-color: var(--terminal-black, #0a0a0a);
			--badge-glow: rgba(255, 176, 0, 0.4);
		}

		:host([variant="error"]) {
			--badge-bg: var(--terminal-red, #ff003c);
			--badge-color: var(--terminal-white, #ffffff);
			--badge-glow: rgba(255, 0, 60, 0.4);
		}

		:host([variant="info"]) {
			--badge-bg: var(--terminal-cyan, #00ffff);
			--badge-color: var(--terminal-black, #0a0a0a);
			--badge-glow: rgba(0, 255, 255, 0.4);
		}

		/* Pulse animation */
		.badge.pulse {
			animation: badge-pulse 2s ease-in-out infinite;
		}

		@keyframes badge-pulse {
			0%, 100% {
				opacity: 1;
				box-shadow: 0 0 8px var(--badge-glow);
			}
			50% {
				opacity: 0.7;
				box-shadow: 0 0 16px var(--badge-glow);
			}
		}

		/* Hidden state */
		.badge.hidden {
			display: none;
		}

		/* Clickable state */
		:host([clickable]) .badge {
			cursor: pointer;
		}

		:host([clickable]) .badge:hover {
			filter: brightness(1.2);
			box-shadow: 0 0 12px var(--badge-glow);
		}

		:host([clickable]) .badge:active {
			transform: scale(0.95);
		}

		:host([position][clickable]) .badge:active {
			/* Maintain position transform on active */
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.badge.pulse {
				animation: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Count value to display
		 * @property count
		 * @type {Number}
		 * @default null
		 * @attribute count
		 * @reflects true
		 */
		count: {
			type: Number,
			reflect: true
		},

		/**
		 * Maximum count before showing "max+"
		 * @property max
		 * @type {Number}
		 * @default 99
		 * @attribute max
		 * @reflects true
		 */
		max: {
			type: Number,
			reflect: true
		},

		/**
		 * Show as dot instead of count
		 * @property dot
		 * @type {Boolean}
		 * @default false
		 * @attribute dot
		 * @reflects true
		 */
		dot: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Visual variant
		 * @property variant
		 * @type {String}
		 * @default 'default'
		 * @attribute variant
		 * @reflects true
		 */
		variant: {
			type: String,
			reflect: true
		},

		/**
		 * Size variant
		 * @property size
		 * @type {String}
		 * @default 'md'
		 * @attribute size
		 * @reflects true
		 */
		size: {
			type: String,
			reflect: true
		},

		/**
		 * Enable pulse animation
		 * @property pulse
		 * @type {Boolean}
		 * @default false
		 * @attribute pulse
		 * @reflects true
		 */
		pulse: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Position relative to slot content
		 * @property position
		 * @type {String}
		 * @default null
		 * @attribute position
		 * @reflects true
		 */
		position: {
			type: String,
			reflect: true
		},

		/**
		 * Hide the badge
		 * @property hidden
		 * @type {Boolean}
		 * @default false
		 * @attribute hidden
		 * @reflects true
		 */
		hidden: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Make badge clickable
		 * @property clickable
		 * @type {Boolean}
		 * @default false
		 * @attribute clickable
		 * @reflects true
		 */
		clickable: {
			type: Boolean,
			reflect: true
		}
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (REQUIRED)
	// ----------------------------------------------------------
	/**
	 * @private
	 */
	_logger = null;

	// ----------------------------------------------------------
	// BLOCK 5: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TBadgeLit');

		// Set default property values
		this.count = null;
		this.max = 99;
		this.dot = false;
		this.variant = 'default';
		this.size = 'md';
		this.pulse = false;
		this.position = null;
		this.hidden = false;
		this.clickable = false;

		this._logger.debug('Component constructed with defaults');
	}

	// ----------------------------------------------------------
	// BLOCK 6: LIFECYCLE CALLBACKS (REQUIRED)
	// ----------------------------------------------------------
	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.fromEntries(changedProperties));
	}

	// ----------------------------------------------------------
	// BLOCK 7: PUBLIC API METHODS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Show the badge
	 * @public
	 */
	show() {
		this._logger.debug('Showing badge');
		this.hidden = false;
	}

	/**
	 * Hide the badge
	 * @public
	 */
	hide() {
		this._logger.debug('Hiding badge');
		this.hidden = true;
	}

	/**
	 * Set the count value
	 * @public
	 * @param {number} value - The count to display
	 */
	setCount(value) {
		this._logger.debug('Setting count', { value });
		this.count = value;
	}

	/**
	 * Increment the count
	 * @public
	 * @param {number} [amount=1] - Amount to increment by
	 */
	increment(amount = 1) {
		const newCount = (this.count ?? 0) + amount;
		this._logger.debug('Incrementing count', { from: this.count, to: newCount });
		this.count = newCount;
	}

	/**
	 * Decrement the count
	 * @public
	 * @param {number} [amount=1] - Amount to decrement by
	 */
	decrement(amount = 1) {
		const newCount = Math.max(0, (this.count ?? 0) - amount);
		this._logger.debug('Decrementing count', { from: this.count, to: newCount });
		this.count = newCount;
	}

	// ----------------------------------------------------------
	// BLOCK 8: EVENT EMITTERS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Emit a custom event
	 * @private
	 * @param {string} eventName - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(eventName, detail = {}) {
		this.dispatchEvent(new CustomEvent(eventName, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Handle badge click
	 * @private
	 */
	_handleClick() {
		if (!this.clickable) return;

		this._logger.debug('Badge clicked', { count: this.count });
		/**
		 * @event badge-click
		 * @type {CustomEvent}
		 * @property {Object} detail
		 * @property {number|null} detail.count - Current count value
		 * @property {string} detail.variant - Current variant
		 */
		this._emitEvent('badge-click', {
			count: this.count,
			variant: this.variant
		});
	}

	// ----------------------------------------------------------
	// BLOCK 9: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Get the display value for the badge
	 * @private
	 * @returns {string}
	 */
	_getDisplayValue() {
		if (this.dot) return '';
		if (this.count === null || this.count === undefined) return '';
		if (this.count > this.max) return `${this.max}+`;
		return String(this.count);
	}

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering', {
			count: this.count,
			dot: this.dot,
			variant: this.variant,
			hidden: this.hidden
		});

		const badgeClasses = [
			'badge',
			this.dot ? 'dot' : '',
			this.pulse ? 'pulse' : '',
			this.hidden ? 'hidden' : ''
		].filter(Boolean).join(' ');

		const displayValue = this._getDisplayValue();

		return html`
			<div class="badge-wrapper">
				<slot></slot>
				<span
					class="${badgeClasses}"
					@click="${this._handleClick}"
					role="${this.clickable ? 'button' : 'status'}"
					aria-label="${this.dot ? 'Status indicator' : `Count: ${displayValue}`}"
					tabindex="${this.clickable ? '0' : '-1'}"
				>${displayValue}</span>
			</div>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 10: STATIC REGISTRATION (REQUIRED)
	// ----------------------------------------------------------
	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ----------------------------------------------------------
// BLOCK 11: EXPORTS (REQUIRED)
// ----------------------------------------------------------
export default TBadgeLit;

// Terminal-specific re-export
export const TerminalBadge = TBadgeLit;
