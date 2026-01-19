// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TChipLit
 * @tagname t-chip
 * @description Tag/filter chip component with selection, removal, and variants.
 * @category Core
 * @since 3.0.0
 * @example
 * <t-chip label="JavaScript"></t-chip>
 * <t-chip label="Removable" removable></t-chip>
 * <t-chip label="Selectable" selectable selected></t-chip>
 */
export class TChipLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-chip';
	static version = '3.0.0';
	static category = 'Core';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TChipLit Component Styles
		 * Tag/filter chips with terminal styling
		 */

		/* Host styles */
		:host {
			display: inline-flex;
			--chip-bg: var(--terminal-gray-dark, #2a2a2a);
			--chip-color: var(--terminal-green, #00ff41);
			--chip-border: var(--terminal-gray, #444);
			--chip-glow: rgba(0, 255, 65, 0.2);
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Chip container */
		.chip {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			padding: 4px 10px;
			background: var(--chip-bg);
			color: var(--chip-color);
			border: 1px solid var(--chip-border);
			border-radius: 16px;
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: 12px;
			line-height: 1.4;
			transition: all 0.2s ease;
			cursor: default;
		}

		/* Selectable chip */
		:host([selectable]) .chip {
			cursor: pointer;
		}

		:host([selectable]) .chip:hover {
			border-color: var(--chip-color);
			box-shadow: 0 0 8px var(--chip-glow);
		}

		/* Selected state */
		:host([selected]) .chip {
			background: var(--chip-color);
			color: var(--terminal-black, #0a0a0a);
			border-color: var(--chip-color);
			box-shadow: 0 0 10px var(--chip-glow);
		}

		/* Disabled state */
		:host([disabled]) .chip {
			opacity: 0.5;
			cursor: not-allowed;
		}

		:host([disabled][selectable]) .chip:hover {
			border-color: var(--chip-border);
			box-shadow: none;
		}

		/* Size variants */
		:host([size="sm"]) .chip {
			padding: 2px 8px;
			font-size: 10px;
			gap: 4px;
		}

		:host([size="lg"]) .chip {
			padding: 6px 14px;
			font-size: 14px;
			gap: 8px;
		}

		/* Variant colors */
		:host([variant="default"]) {
			--chip-color: var(--terminal-green, #00ff41);
			--chip-glow: rgba(0, 255, 65, 0.2);
		}

		:host([variant="success"]) {
			--chip-color: var(--terminal-green, #00ff41);
			--chip-glow: rgba(0, 255, 65, 0.2);
		}

		:host([variant="warning"]) {
			--chip-color: var(--terminal-amber, #ffb000);
			--chip-glow: rgba(255, 176, 0, 0.2);
		}

		:host([variant="error"]) {
			--chip-color: var(--terminal-red, #ff003c);
			--chip-glow: rgba(255, 0, 60, 0.2);
		}

		:host([variant="info"]) {
			--chip-color: var(--terminal-cyan, #00ffff);
			--chip-glow: rgba(0, 255, 255, 0.2);
		}

		/* Shape variants - pill (default) vs tag */
		:host([shape="pill"]) .chip {
			border-radius: 16px;
		}

		:host([shape="tag"]) .chip {
			border-radius: 2px;
			padding: 3px 8px;
			position: relative;
		}

		:host([shape="tag"]) .chip::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 3px;
			background: var(--chip-color);
		}

		:host([shape="tag"][selected]) .chip::before {
			background: var(--terminal-black, #0a0a0a);
		}

		:host([shape="square"]) .chip {
			border-radius: 4px;
		}

		/* Icon/Avatar */
		.chip-icon,
		.chip-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.chip-icon svg {
			width: 14px;
			height: 14px;
			fill: currentColor;
		}

		.chip-avatar {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			overflow: hidden;
			margin-left: -4px;
		}

		.chip-avatar img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		/* Label */
		.chip-label {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 200px;
		}

		/* Remove button */
		.chip-remove {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 16px;
			height: 16px;
			padding: 0;
			background: transparent;
			border: none;
			color: currentColor;
			cursor: pointer;
			border-radius: 50%;
			opacity: 0.7;
			transition: all 0.2s ease;
			margin-right: -4px;
		}

		.chip-remove:hover {
			opacity: 1;
			background: rgba(255, 0, 60, 0.2);
			color: var(--terminal-red, #ff003c);
		}

		.chip-remove svg {
			width: 10px;
			height: 10px;
			fill: currentColor;
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.chip,
			.chip-remove {
				transition: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Chip label text
		 * @property label
		 * @type {String}
		 * @default ''
		 * @attribute label
		 * @reflects true
		 */
		label: {
			type: String,
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
		 * Allow removal
		 * @property removable
		 * @type {Boolean}
		 * @default false
		 * @attribute removable
		 * @reflects true
		 */
		removable: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Allow selection
		 * @property selectable
		 * @type {Boolean}
		 * @default false
		 * @attribute selectable
		 * @reflects true
		 */
		selectable: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Selected state
		 * @property selected
		 * @type {Boolean}
		 * @default false
		 * @attribute selected
		 * @reflects true
		 */
		selected: {
			type: Boolean,
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
		 * Icon SVG string
		 * @property icon
		 * @type {String}
		 * @default ''
		 * @attribute icon
		 */
		icon: {
			type: String
		},

		/**
		 * Avatar image URL
		 * @property avatar
		 * @type {String}
		 * @default ''
		 * @attribute avatar
		 */
		avatar: {
			type: String
		},

		/**
		 * Auto-remove from DOM when remove button clicked
		 * @property autoRemove
		 * @type {Boolean}
		 * @default false
		 * @attribute auto-remove
		 * @reflects true
		 */
		autoRemove: {
			type: Boolean,
			attribute: 'auto-remove',
			reflect: true
		},

		/**
		 * Shape variant: pill (rounded), tag (left accent), square
		 * @property shape
		 * @type {'pill'|'tag'|'square'}
		 * @default 'pill'
		 * @attribute shape
		 * @reflects true
		 */
		shape: {
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

	// ----------------------------------------------------------
	// BLOCK 5: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TChipLit');

		// Set default property values
		this.label = '';
		this.variant = 'default';
		this.size = 'md';
		this.removable = false;
		this.selectable = false;
		this.selected = false;
		this.disabled = false;
		this.icon = '';
		this.avatar = '';
		this.autoRemove = false;
		this.shape = 'pill';

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
	 * Select the chip
	 * @public
	 */
	select() {
		if (this.disabled || !this.selectable) return;
		this._logger.debug('Selecting chip');
		this.selected = true;
		this._emitEvent('chip-select', { selected: true, label: this.label });
	}

	/**
	 * Deselect the chip
	 * @public
	 */
	deselect() {
		if (this.disabled || !this.selectable) return;
		this._logger.debug('Deselecting chip');
		this.selected = false;
		this._emitEvent('chip-select', { selected: false, label: this.label });
	}

	/**
	 * Toggle selection
	 * @public
	 */
	toggle() {
		if (this.selected) {
			this.deselect();
		} else {
			this.select();
		}
	}

	/**
	 * Remove the chip (emits event, optionally removes from DOM)
	 * @public
	 */
	remove() {
		if (this.disabled || !this.removable) return;
		this._logger.debug('Removing chip');
		this._emitEvent('chip-remove', { label: this.label });

		// Auto-remove from DOM if property is set
		if (this.autoRemove) {
			this._logger.debug('Auto-removing from DOM');
			this.parentElement?.removeChild(this);
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
	 * Handle chip click
	 * @private
	 */
	_handleClick() {
		if (this.disabled) return;

		this._emitEvent('chip-click', { label: this.label, selected: this.selected });

		if (this.selectable) {
			this.toggle();
		}
	}

	/**
	 * Handle remove click
	 * @private
	 * @param {Event} e
	 */
	_handleRemoveClick(e) {
		e.stopPropagation();
		this.remove();
	}

	/**
	 * Render close icon
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderCloseIcon() {
		return html`
			<svg viewBox="0 0 24 24">
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
			</svg>
		`;
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
			label: this.label,
			selected: this.selected,
			variant: this.variant
		});

		return html`
			<div
				class="chip"
				role="${this.selectable ? 'checkbox' : 'status'}"
				aria-checked="${this.selectable ? this.selected : undefined}"
				aria-label="${this.label}"
				tabindex="${this.disabled ? '-1' : '0'}"
				@click="${this._handleClick}"
				@keydown="${(e) => e.key === 'Enter' && this._handleClick()}"
			>
				${this.avatar ? html`
					<span class="chip-avatar">
						<img src="${this.avatar}" alt="" />
					</span>
				` : ''}
				${this.icon ? html`
					<span class="chip-icon">${this.icon}</span>
				` : ''}
				<span class="chip-label">${this.label}</span>
				${this.removable ? html`
					<button
						class="chip-remove"
						aria-label="Remove ${this.label}"
						@click="${this._handleRemoveClick}"
					>
						${this._renderCloseIcon()}
					</button>
				` : ''}
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
export default TChipLit;

// Terminal-specific re-export
export const TerminalChip = TChipLit;
