// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TSkeletonLit
 * @tagname t-skel
 * @description Loading placeholder skeleton component with various shapes and animations.
 * @category Display
 * @since 3.0.0
 * @example
 * <t-skel type="text" lines="3"></t-skel>
 * <t-skel type="avatar" size="lg"></t-skel>
 * <t-skel type="card" animated></t-skel>
 */
export class TSkeletonLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-skel';
	static version = '3.0.0';
	static category = 'Display';

	// Available skeleton types
	static types = ['text', 'heading', 'avatar', 'button', 'card', 'rect', 'circle'];

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TSkeletonLit Component Styles
		 * Loading placeholder skeletons with terminal styling
		 */

		/* Host styles */
		:host {
			display: block;
			--skeleton-bg: var(--terminal-gray-dark, #1a1a1a);
			--skeleton-highlight: var(--terminal-gray, #2a2a2a);
			--skeleton-glow: rgba(0, 255, 65, 0.05);
			--skeleton-radius: 4px;
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Base skeleton element */
		.skeleton {
			background: var(--skeleton-bg);
			border-radius: var(--skeleton-radius);
			position: relative;
			overflow: hidden;
		}

		/* Shimmer animation */
		.skeleton.animated::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(
				90deg,
				transparent,
				var(--skeleton-highlight),
				transparent
			);
			animation: shimmer 1.5s infinite;
			transform: translateX(-100%);
		}

		@keyframes shimmer {
			100% {
				transform: translateX(100%);
			}
		}

		/* Pulse animation alternative */
		.skeleton.pulse {
			animation: pulse 1.5s ease-in-out infinite;
		}

		@keyframes pulse {
			0%, 100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		/* Text skeleton */
		.skeleton-text {
			height: 14px;
			margin-bottom: 8px;
		}

		.skeleton-text:last-child {
			margin-bottom: 0;
			width: 75%;
		}

		/* Heading skeleton */
		.skeleton-heading {
			height: 24px;
			width: 60%;
			margin-bottom: 16px;
		}

		/* Avatar skeleton */
		.skeleton-avatar {
			border-radius: 50%;
		}

		.skeleton-avatar.size-sm {
			width: 32px;
			height: 32px;
		}

		.skeleton-avatar.size-md {
			width: 48px;
			height: 48px;
		}

		.skeleton-avatar.size-lg {
			width: 64px;
			height: 64px;
		}

		/* Button skeleton */
		.skeleton-button {
			height: 36px;
			width: 120px;
			border-radius: 4px;
		}

		/* Card skeleton */
		.skeleton-card {
			padding: 16px;
			border: 1px solid var(--terminal-gray-dark, #2a2a2a);
		}

		.skeleton-card .card-header {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 16px;
		}

		.skeleton-card .card-avatar {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: var(--skeleton-bg);
			flex-shrink: 0;
		}

		.skeleton-card .card-meta {
			flex: 1;
		}

		.skeleton-card .card-title {
			height: 14px;
			width: 60%;
			background: var(--skeleton-bg);
			border-radius: var(--skeleton-radius);
			margin-bottom: 8px;
		}

		.skeleton-card .card-subtitle {
			height: 12px;
			width: 40%;
			background: var(--skeleton-bg);
			border-radius: var(--skeleton-radius);
		}

		.skeleton-card .card-body {
			height: 12px;
			background: var(--skeleton-bg);
			border-radius: var(--skeleton-radius);
			margin-bottom: 8px;
		}

		.skeleton-card .card-body:last-child {
			width: 80%;
			margin-bottom: 0;
		}

		/* Rect skeleton */
		.skeleton-rect {
			width: 100%;
			height: 100px;
		}

		/* Circle skeleton */
		.skeleton-circle {
			border-radius: 50%;
			width: 48px;
			height: 48px;
		}

		/* Custom dimensions */
		.skeleton[style*="--skel-width"] {
			width: var(--skel-width);
		}

		.skeleton[style*="--skel-height"] {
			height: var(--skel-height);
		}

		/* Container for multiple lines */
		.skeleton-container {
			display: flex;
			flex-direction: column;
		}

		/* Terminal glow effect */
		:host([glow]) .skeleton {
			box-shadow: 0 0 10px var(--skeleton-glow);
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.skeleton.animated::after,
			.skeleton.pulse {
				animation: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Skeleton type
		 * @property type
		 * @type {String}
		 * @default 'text'
		 * @attribute type
		 * @reflects true
		 */
		type: {
			type: String,
			reflect: true
		},

		/**
		 * Custom width
		 * @property width
		 * @type {String}
		 * @default '100%'
		 * @attribute width
		 */
		width: {
			type: String
		},

		/**
		 * Custom height
		 * @property height
		 * @type {String}
		 * @default 'auto'
		 * @attribute height
		 */
		height: {
			type: String
		},

		/**
		 * Number of lines (for text type)
		 * @property lines
		 * @type {Number}
		 * @default 1
		 * @attribute lines
		 * @reflects true
		 */
		lines: {
			type: Number,
			reflect: true
		},

		/**
		 * Enable shimmer animation
		 * @property animated
		 * @type {Boolean}
		 * @default true
		 * @attribute animated
		 * @reflects true
		 */
		animated: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Border radius
		 * @property radius
		 * @type {String}
		 * @default '4px'
		 * @attribute radius
		 */
		radius: {
			type: String
		},

		/**
		 * Size variant (for avatar, circle)
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
		 * Add terminal glow effect
		 * @property glow
		 * @type {Boolean}
		 * @default false
		 * @attribute glow
		 * @reflects true
		 */
		glow: {
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
		this._logger = componentLogger.for('TSkeletonLit');

		// Set default property values
		this.type = 'text';
		this.width = '100%';
		this.height = 'auto';
		this.lines = 1;
		this.animated = true;
		this.radius = '4px';
		this.size = 'md';
		this.glow = false;

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
	 * Get available skeleton types
	 * @public
	 * @returns {string[]}
	 */
	getAvailableTypes() {
		return [...TSkeletonLit.types];
	}

	// ----------------------------------------------------------
	// BLOCK 8: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Render text skeleton lines
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderTextLines() {
		const lines = [];
		for (let i = 0; i < this.lines; i++) {
			lines.push(html`
				<div
					class="skeleton skeleton-text ${this.animated ? 'animated' : ''}"
					style="--skel-width: ${i === this.lines - 1 ? '75%' : '100%'}"
				></div>
			`);
		}
		return html`<div class="skeleton-container">${lines}</div>`;
	}

	/**
	 * Render card skeleton
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderCard() {
		return html`
			<div class="skeleton skeleton-card ${this.animated ? 'animated' : ''}">
				<div class="card-header">
					<div class="card-avatar ${this.animated ? 'animated' : ''}"></div>
					<div class="card-meta">
						<div class="card-title ${this.animated ? 'animated' : ''}"></div>
						<div class="card-subtitle ${this.animated ? 'animated' : ''}"></div>
					</div>
				</div>
				<div class="card-body ${this.animated ? 'animated' : ''}"></div>
				<div class="card-body ${this.animated ? 'animated' : ''}"></div>
				<div class="card-body ${this.animated ? 'animated' : ''}"></div>
			</div>
		`;
	}

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering', {
			type: this.type,
			lines: this.lines,
			animated: this.animated
		});

		const customStyle = `
			${this.width !== '100%' ? `--skel-width: ${this.width};` : ''}
			${this.height !== 'auto' ? `--skel-height: ${this.height};` : ''}
			${this.radius !== '4px' ? `--skeleton-radius: ${this.radius};` : ''}
		`;

		switch (this.type) {
			case 'text':
				return this._renderTextLines();

			case 'heading':
				return html`
					<div
						class="skeleton skeleton-heading ${this.animated ? 'animated' : ''}"
						style="${customStyle}"
					></div>
				`;

			case 'avatar':
				return html`
					<div
						class="skeleton skeleton-avatar size-${this.size} ${this.animated ? 'animated' : ''}"
						style="${customStyle}"
					></div>
				`;

			case 'button':
				return html`
					<div
						class="skeleton skeleton-button ${this.animated ? 'animated' : ''}"
						style="${customStyle}"
					></div>
				`;

			case 'card':
				return this._renderCard();

			case 'rect':
				return html`
					<div
						class="skeleton skeleton-rect ${this.animated ? 'animated' : ''}"
						style="${customStyle}"
					></div>
				`;

			case 'circle':
				return html`
					<div
						class="skeleton skeleton-circle size-${this.size} ${this.animated ? 'animated' : ''}"
						style="${customStyle}"
					></div>
				`;

			default:
				return html`
					<div
						class="skeleton skeleton-rect ${this.animated ? 'animated' : ''}"
						style="${customStyle}"
					></div>
				`;
		}
	}

	// ----------------------------------------------------------
	// BLOCK 9: STATIC REGISTRATION (REQUIRED)
	// ----------------------------------------------------------
	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ----------------------------------------------------------
// BLOCK 10: EXPORTS (REQUIRED)
// ----------------------------------------------------------
export default TSkeletonLit;

// Terminal-specific re-export
export const TerminalSkeleton = TSkeletonLit;
