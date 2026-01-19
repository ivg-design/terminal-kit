// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TTooltipLit
 * @tagname t-tip
 * @description Hover/focus information tooltip component with positioning and animation.
 * @category Core
 * @since 3.0.0
 * @example
 * <t-tip content="This is a tooltip">
 *   <button>Hover me</button>
 * </t-tip>
 * <t-tip content="Click triggered" trigger="click">
 *   <span>Click me</span>
 * </t-tip>
 */
export class TTooltipLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-tip';
	static version = '3.0.0';
	static category = 'Core';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TTooltipLit Component Styles
		 * Information tooltips with terminal styling
		 */

		/* Host styles */
		:host {
			display: inline-block;
			position: relative;
			--tooltip-bg: var(--terminal-gray-darkest, #1a1a1a);
			--tooltip-color: var(--terminal-green, #00ff41);
			--tooltip-border: var(--terminal-green, #00ff41);
			--tooltip-glow: rgba(0, 255, 65, 0.3);
			--tooltip-arrow-size: 6px;
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Trigger wrapper */
		.tooltip-trigger {
			display: inline-block;
		}

		/* Tooltip container */
		.tooltip {
			position: absolute;
			z-index: 1000;
			padding: 8px 12px;
			background: var(--tooltip-bg);
			color: var(--tooltip-color);
			border: 1px solid var(--tooltip-border);
			border-radius: 4px;
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: 12px;
			line-height: 1.4;
			white-space: nowrap;
			box-shadow: 0 0 10px var(--tooltip-glow);
			opacity: 0;
			visibility: hidden;
			transition: opacity 0.2s ease, visibility 0.2s ease;
			pointer-events: none;
		}

		.tooltip.visible {
			opacity: 1;
			visibility: visible;
		}

		.tooltip.multiline {
			white-space: normal;
			max-width: var(--tooltip-max-width, 250px);
		}

		/* Arrow */
		.tooltip-arrow {
			position: absolute;
			width: 0;
			height: 0;
			border: var(--tooltip-arrow-size) solid transparent;
		}

		/* Position: top (default) */
		.tooltip.position-top {
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
			margin-bottom: 8px;
		}

		.tooltip.position-top .tooltip-arrow {
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			border-top-color: var(--tooltip-border);
			border-bottom: none;
		}

		/* Position: bottom */
		.tooltip.position-bottom {
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			margin-top: 8px;
		}

		.tooltip.position-bottom .tooltip-arrow {
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
			border-bottom-color: var(--tooltip-border);
			border-top: none;
		}

		/* Position: left */
		.tooltip.position-left {
			right: 100%;
			top: 50%;
			transform: translateY(-50%);
			margin-right: 8px;
		}

		.tooltip.position-left .tooltip-arrow {
			left: 100%;
			top: 50%;
			transform: translateY(-50%);
			border-left-color: var(--tooltip-border);
			border-right: none;
		}

		/* Position: right */
		.tooltip.position-right {
			left: 100%;
			top: 50%;
			transform: translateY(-50%);
			margin-left: 8px;
		}

		.tooltip.position-right .tooltip-arrow {
			right: 100%;
			top: 50%;
			transform: translateY(-50%);
			border-right-color: var(--tooltip-border);
			border-left: none;
		}

		/* Variant colors */
		:host([variant="warning"]) {
			--tooltip-border: var(--terminal-amber, #ffb000);
			--tooltip-color: var(--terminal-amber, #ffb000);
			--tooltip-glow: rgba(255, 176, 0, 0.3);
		}

		:host([variant="error"]) {
			--tooltip-border: var(--terminal-red, #ff003c);
			--tooltip-color: var(--terminal-red, #ff003c);
			--tooltip-glow: rgba(255, 0, 60, 0.3);
		}

		:host([variant="info"]) {
			--tooltip-border: var(--terminal-cyan, #00ffff);
			--tooltip-color: var(--terminal-cyan, #00ffff);
			--tooltip-glow: rgba(0, 255, 255, 0.3);
		}

		/* Disabled state */
		:host([disabled]) .tooltip {
			display: none;
		}

		/* Size variants */
		:host([size="xs"]) .tooltip {
			font-size: 10px;
			padding: 4px 8px;
		}

		:host([size="sm"]) .tooltip {
			font-size: 11px;
			padding: 6px 10px;
		}

		:host([size="md"]) .tooltip {
			font-size: 12px;
			padding: 8px 12px;
		}

		:host([size="lg"]) .tooltip {
			font-size: 14px;
			padding: 10px 16px;
		}

		:host([size="xl"]) .tooltip {
			font-size: 16px;
			padding: 12px 18px;
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.tooltip {
				transition: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Tooltip content text
		 * @property content
		 * @type {String}
		 * @default ''
		 * @attribute content
		 */
		content: {
			type: String
		},

		/**
		 * Allow HTML in content
		 * @property html
		 * @type {Boolean}
		 * @default false
		 * @attribute html
		 * @reflects true
		 */
		html: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Tooltip position
		 * @property position
		 * @type {String}
		 * @default 'top'
		 * @attribute position
		 * @reflects true
		 */
		position: {
			type: String,
			reflect: true
		},

		/**
		 * Trigger type
		 * @property trigger
		 * @type {String}
		 * @default 'hover'
		 * @attribute trigger
		 * @reflects true
		 */
		trigger: {
			type: String,
			reflect: true
		},

		/**
		 * Show delay in ms
		 * @property delay
		 * @type {Number}
		 * @default 200
		 * @attribute delay
		 */
		delay: {
			type: Number
		},

		/**
		 * Hide delay in ms
		 * @property hideDelay
		 * @type {Number}
		 * @default 0
		 * @attribute hide-delay
		 */
		hideDelay: {
			type: Number,
			attribute: 'hide-delay'
		},

		/**
		 * Show arrow
		 * @property arrow
		 * @type {Boolean}
		 * @default true
		 * @attribute arrow
		 * @reflects true
		 */
		arrow: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Hide arrow (convenience attribute for HTML usage)
		 * @property noArrow
		 * @type {Boolean}
		 * @default false
		 * @attribute no-arrow
		 * @reflects true
		 */
		noArrow: {
			type: Boolean,
			attribute: 'no-arrow',
			reflect: true
		},

		/**
		 * Max width for multiline
		 * @property maxWidth
		 * @type {String}
		 * @default '250px'
		 * @attribute max-width
		 */
		maxWidth: {
			type: String,
			attribute: 'max-width'
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
		 * Disabled state
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 * @attribute disabled
		 * @reflects true
		 */
		disabled: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Open state
		 * @property open
		 * @type {Boolean}
		 * @default false
		 * @attribute open
		 * @reflects true
		 */
		open: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Size variant (affects font size)
		 * @property size
		 * @type {String}
		 * @default 'md'
		 * @attribute size
		 * @reflects true
		 */
		size: {
			type: String,
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

	/**
	 * @private
	 */
	_showTimeout = null;

	/**
	 * @private
	 */
	_hideTimeout = null;

	/**
	 * @private
	 */
	_boundHandleClickOutside = null;

	// ----------------------------------------------------------
	// BLOCK 5: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TTooltipLit');

		// Set default property values
		this.content = '';
		this.html = false;
		this.position = 'top';
		this.trigger = 'hover';
		this.delay = 200;
		this.hideDelay = 0;
		this.arrow = true;
		this.noArrow = false;
		this.maxWidth = '250px';
		this.variant = 'default';
		this.disabled = false;
		this.open = false;
		this.size = 'md';

		// Bind methods
		this._boundHandleClickOutside = this._handleClickOutside.bind(this);

		this._logger.debug('Component constructed with defaults');
	}

	// ----------------------------------------------------------
	// BLOCK 6: LIFECYCLE CALLBACKS (REQUIRED)
	// ----------------------------------------------------------
	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');

		// Add click outside listener for click trigger
		if (this.trigger === 'click') {
			document.addEventListener('click', this._boundHandleClickOutside);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');

		// Cleanup timeouts
		this._clearTimeouts();

		// Remove listeners
		document.removeEventListener('click', this._boundHandleClickOutside);
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.fromEntries(changedProperties));

		// Update click outside listener when trigger changes
		if (changedProperties.has('trigger')) {
			document.removeEventListener('click', this._boundHandleClickOutside);
			if (this.trigger === 'click') {
				document.addEventListener('click', this._boundHandleClickOutside);
			}
		}
	}

	// ----------------------------------------------------------
	// BLOCK 7: PUBLIC API METHODS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Show the tooltip
	 * @public
	 */
	show() {
		if (this.disabled) return;
		this._logger.debug('Showing tooltip');
		this.open = true;
		this._emitEvent('tooltip-show');
	}

	/**
	 * Hide the tooltip
	 * @public
	 */
	hide() {
		this._logger.debug('Hiding tooltip');
		this.open = false;
		this._emitEvent('tooltip-hide');
	}

	/**
	 * Toggle tooltip visibility
	 * @public
	 */
	toggle() {
		if (this.open) {
			this.hide();
		} else {
			this.show();
		}
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

	// ----------------------------------------------------------
	// BLOCK 9: PRIVATE HELPERS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Clear all timeouts
	 * @private
	 */
	_clearTimeouts() {
		if (this._showTimeout) {
			clearTimeout(this._showTimeout);
			this._showTimeout = null;
		}
		if (this._hideTimeout) {
			clearTimeout(this._hideTimeout);
			this._hideTimeout = null;
		}
	}

	/**
	 * Handle mouse enter
	 * @private
	 */
	_handleMouseEnter() {
		if (this.trigger !== 'hover' || this.disabled) return;

		this._clearTimeouts();
		this._showTimeout = setTimeout(() => this.show(), this.delay);
	}

	/**
	 * Handle mouse leave
	 * @private
	 */
	_handleMouseLeave() {
		if (this.trigger !== 'hover') return;

		this._clearTimeouts();
		this._hideTimeout = setTimeout(() => this.hide(), this.hideDelay);
	}

	/**
	 * Handle focus
	 * @private
	 */
	_handleFocus() {
		if (this.trigger !== 'focus' || this.disabled) return;
		this.show();
	}

	/**
	 * Handle blur
	 * @private
	 */
	_handleBlur() {
		if (this.trigger !== 'focus') return;
		this.hide();
	}

	/**
	 * Handle click
	 * @private
	 * @param {Event} e
	 */
	_handleClick(e) {
		if (this.trigger !== 'click' || this.disabled) return;
		e.stopPropagation();
		this.toggle();
	}

	/**
	 * Handle click outside
	 * @private
	 * @param {Event} e
	 */
	_handleClickOutside(e) {
		if (this.trigger !== 'click' || !this.open) return;
		if (!this.contains(e.target)) {
			this.hide();
		}
	}

	// ----------------------------------------------------------
	// BLOCK 10: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering', {
			content: this.content,
			position: this.position,
			open: this.open
		});

		const isMultiline = this.content.length > 50;

		const tooltipClasses = [
			'tooltip',
			`position-${this.position}`,
			this.open ? 'visible' : '',
			isMultiline ? 'multiline' : ''
		].filter(Boolean).join(' ');

		const tooltipStyle = `--tooltip-max-width: ${this.maxWidth}`;

		return html`
			<div
				class="tooltip-trigger"
				@mouseenter="${this._handleMouseEnter}"
				@mouseleave="${this._handleMouseLeave}"
				@focus="${this._handleFocus}"
				@blur="${this._handleBlur}"
				@click="${this._handleClick}"
			>
				<slot></slot>
			</div>
			<div
				class="${tooltipClasses}"
				style="${tooltipStyle}"
				role="tooltip"
				aria-hidden="${!this.open}"
			>
				${this.html ? unsafeHTML(this.content) : this.content}
				${this.arrow && !this.noArrow ? html`<div class="tooltip-arrow"></div>` : ''}
			</div>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 11: STATIC REGISTRATION (REQUIRED)
	// ----------------------------------------------------------
	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ----------------------------------------------------------
// BLOCK 12: EXPORTS (REQUIRED)
// ----------------------------------------------------------
export default TTooltipLit;

// Terminal-specific re-export
export const TerminalTooltip = TTooltipLit;
