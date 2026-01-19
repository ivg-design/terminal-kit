// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TAvatarLit
 * @tagname t-avt
 * @description User/entity avatar display component with image, initials, icon fallback, and status indicator.
 * @category Display
 * @since 3.0.0
 * @example
 * <t-avt src="/avatar.jpg" alt="User Name"></t-avt>
 * <t-avt initials="JD" size="lg"></t-avt>
 * <t-avt initials="AB" status="online"></t-avt>
 */
export class TAvatarLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-avt';
	static version = '3.0.0';
	static category = 'Display';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TAvatarLit Component Styles
		 * User/entity avatars with terminal styling
		 */

		/* Host styles */
		:host {
			display: inline-flex;
			--avatar-size: 40px;
			--avatar-bg: var(--terminal-gray-dark, #2a2a2a);
			--avatar-color: var(--terminal-green, #00ff41);
			--avatar-border: var(--terminal-gray, #444);
			--avatar-glow: rgba(0, 255, 65, 0.3);
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Avatar container */
		.avatar {
			position: relative;
			width: var(--avatar-size);
			height: var(--avatar-size);
			border-radius: 50%;
			background: var(--avatar-bg);
			color: var(--avatar-color);
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			font-family: var(--font-mono, 'Courier New', monospace);
			font-weight: 700;
			text-transform: uppercase;
			transition: all 0.2s ease;
		}

		/* Square shape */
		:host([shape="square"]) .avatar {
			border-radius: 4px;
		}

		/* Rounded square */
		:host([shape="rounded"]) .avatar {
			border-radius: 8px;
		}

		/* Border */
		:host([border]) .avatar {
			border: 2px solid var(--avatar-border);
		}

		/* Clickable */
		:host([clickable]) .avatar {
			cursor: pointer;
		}

		:host([clickable]) .avatar:hover {
			box-shadow: 0 0 12px var(--avatar-glow);
			border-color: var(--avatar-color);
		}

		:host([clickable]) .avatar:active {
			transform: scale(0.95);
		}

		/* Size variants */
		:host([size="xs"]) {
			--avatar-size: 24px;
			font-size: 10px;
		}

		:host([size="sm"]) {
			--avatar-size: 32px;
			font-size: 12px;
		}

		:host([size="md"]) {
			--avatar-size: 40px;
			font-size: 14px;
		}

		:host([size="lg"]) {
			--avatar-size: 56px;
			font-size: 18px;
		}

		:host([size="xl"]) {
			--avatar-size: 72px;
			font-size: 24px;
		}

		/* Image */
		.avatar-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		/* Initials */
		.avatar-initials {
			font-size: inherit;
			line-height: 1;
			letter-spacing: 0.05em;
		}

		/* Icon fallback */
		.avatar-icon svg {
			width: 60%;
			height: 60%;
			fill: currentColor;
		}

		/* Status indicator */
		.avatar-status {
			position: absolute;
			width: 25%;
			height: 25%;
			min-width: 8px;
			min-height: 8px;
			border-radius: 50%;
			border: 2px solid var(--terminal-bg, #0a0a0a);
			box-sizing: border-box;
		}

		/* Status positions */
		.avatar-status.bottom-right {
			bottom: 0;
			right: 0;
		}

		.avatar-status.bottom-left {
			bottom: 0;
			left: 0;
		}

		.avatar-status.top-right {
			top: 0;
			right: 0;
		}

		.avatar-status.top-left {
			top: 0;
			left: 0;
		}

		/* Status colors */
		.avatar-status.online {
			background: var(--terminal-green, #00ff41);
			box-shadow: 0 0 6px rgba(0, 255, 65, 0.5);
		}

		.avatar-status.offline {
			background: var(--terminal-gray, #666);
		}

		.avatar-status.busy {
			background: var(--terminal-red, #ff003c);
			box-shadow: 0 0 6px rgba(255, 0, 60, 0.5);
		}

		.avatar-status.away {
			background: var(--terminal-amber, #ffb000);
			box-shadow: 0 0 6px rgba(255, 176, 0, 0.5);
		}

		/* Error state for failed image */
		.avatar.error {
			background: var(--terminal-gray-dark, #2a2a2a);
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.avatar {
				transition: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Image source URL
		 * @property src
		 * @type {String}
		 * @default ''
		 * @attribute src
		 */
		src: {
			type: String
		},

		/**
		 * Alt text for image
		 * @property alt
		 * @type {String}
		 * @default ''
		 * @attribute alt
		 * @reflects true
		 */
		alt: {
			type: String,
			reflect: true
		},

		/**
		 * Initials to display (fallback)
		 * @property initials
		 * @type {String}
		 * @default ''
		 * @attribute initials
		 * @reflects true
		 */
		initials: {
			type: String,
			reflect: true
		},

		/**
		 * Icon SVG string (fallback)
		 * @property icon
		 * @type {String}
		 * @default ''
		 * @attribute icon
		 */
		icon: {
			type: String
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
		 * Shape variant
		 * @property shape
		 * @type {String}
		 * @default 'circle'
		 * @attribute shape
		 * @reflects true
		 */
		shape: {
			type: String,
			reflect: true
		},

		/**
		 * Status indicator
		 * @property status
		 * @type {String}
		 * @default null
		 * @attribute status
		 * @reflects true
		 */
		status: {
			type: String,
			reflect: true
		},

		/**
		 * Status position
		 * @property statusPosition
		 * @type {String}
		 * @default 'bottom-right'
		 * @attribute status-position
		 * @reflects true
		 */
		statusPosition: {
			type: String,
			attribute: 'status-position',
			reflect: true
		},

		/**
		 * Make clickable
		 * @property clickable
		 * @type {Boolean}
		 * @default false
		 * @attribute clickable
		 * @reflects true
		 */
		clickable: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Show border
		 * @property border
		 * @type {Boolean}
		 * @default false
		 * @attribute border
		 * @reflects true
		 */
		border: {
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

	/**
	 * Track image load error
	 * @private
	 */
	_imageError = false;

	// ----------------------------------------------------------
	// BLOCK 5: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TAvatarLit');

		// Set default property values
		this.src = '';
		this.alt = '';
		this.initials = '';
		this.icon = '';
		this.size = 'md';
		this.shape = 'circle';
		this.status = null;
		this.statusPosition = 'bottom-right';
		this.clickable = false;
		this.border = false;

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

		// Reset image error when src changes
		if (changedProperties.has('src')) {
			this._imageError = false;
		}
	}

	// ----------------------------------------------------------
	// BLOCK 7: PUBLIC API METHODS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Set status
	 * @public
	 * @param {string} status - Status value (online, offline, busy, away)
	 */
	setStatus(status) {
		this._logger.debug('Setting status', { status });
		this.status = status;
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
	 * Handle avatar click
	 * @private
	 */
	_handleClick() {
		if (!this.clickable) return;
		this._logger.debug('Avatar clicked');
		this._emitEvent('avatar-click', { src: this.src, alt: this.alt });
	}

	/**
	 * Handle image error
	 * @private
	 */
	_handleImageError() {
		this._logger.warn('Image failed to load', { src: this.src });
		this._imageError = true;
		this._emitEvent('avatar-error', { src: this.src });
		this.requestUpdate();
	}

	/**
	 * Get default icon SVG
	 * @private
	 * @returns {string}
	 */
	_getDefaultIcon() {
		return `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
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
			src: this.src,
			initials: this.initials,
			status: this.status
		});

		const showImage = this.src && !this._imageError;
		const showInitials = !showImage && this.initials;
		const showIcon = !showImage && !showInitials;

		return html`
			<div
				class="avatar ${this._imageError ? 'error' : ''}"
				role="${this.clickable ? 'button' : 'img'}"
				aria-label="${this.alt || this.initials || 'Avatar'}"
				tabindex="${this.clickable ? '0' : '-1'}"
				@click="${this._handleClick}"
				@keydown="${(e) => e.key === 'Enter' && this._handleClick()}"
			>
				${showImage ? html`
					<img
						class="avatar-image"
						src="${this.src}"
						alt="${this.alt}"
						@error="${this._handleImageError}"
					/>
				` : ''}
				${showInitials ? html`
					<span class="avatar-initials">${this.initials.slice(0, 2)}</span>
				` : ''}
				${showIcon ? html`
					<span class="avatar-icon">${this.icon ? html`${this.icon}` : html`<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}</span>
				` : ''}
				${this.status ? html`
					<span class="avatar-status ${this.status} ${this.statusPosition}"></span>
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
export default TAvatarLit;

// Terminal-specific re-export
export const TerminalAvatar = TAvatarLit;
