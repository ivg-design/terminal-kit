/**
 * @fileoverview TCardLit - Standardized content card container
 * @module components/TCardLit
 * @version 3.0.0
 *
 * A flexible card component with slots for header, media, content, and actions.
 * Supports clickable states, selection, loading, and expandable content.
 *
 * @example
 * <t-card>
 *   <div slot="header">Card Title</div>
 *   <p>Card content goes here</p>
 *   <div slot="actions">
 *     <button>Action</button>
 *   </div>
 * </t-card>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================
const tagName = 't-card';
const version = '3.0.0';
const category = 'Container';

// ============================================================
// BLOCK 2: Static Styles
// ============================================================
const styles = css`
	:host {
		--card-bg: var(--terminal-gray-darkest, #1a1a1a);
		--card-border: var(--terminal-gray-dark, #333);
		--card-radius: 4px;
		--card-green: var(--terminal-green, #00ff41);
		--card-green-dim: var(--terminal-green-dim, #00cc33);
		--card-amber: var(--terminal-amber, #ffb000);
		--card-red: var(--terminal-red, #ff003c);
		--card-cyan: var(--terminal-cyan, #00ffff);

		display: block;
		font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
	}

	.card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--card-radius);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	/* Variants */
	.card.default {
		border-color: var(--card-border);
	}

	.card.outlined {
		background: transparent;
		border-color: var(--card-green);
	}

	.card.elevated {
		border-color: var(--card-border);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}

	.card.terminal {
		border-color: var(--card-green);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
	}

	/* Clickable state */
	.card.clickable {
		cursor: pointer;
	}

	.card.clickable:hover {
		border-color: var(--card-green);
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
	}

	.card.clickable:focus {
		outline: none;
		border-color: var(--card-green);
		box-shadow: 0 0 0 2px rgba(0, 255, 65, 0.3);
	}

	.card.clickable:active {
		transform: scale(0.99);
	}

	/* Selected state */
	.card.selected {
		border-color: var(--card-green);
		background: rgba(0, 255, 65, 0.05);
	}

	/* Disabled state */
	.card.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	/* Loading state */
	.card.loading {
		position: relative;
		overflow: hidden;
	}

	/* Subtle green perimeter border animation */
	.card.loading::before {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid transparent;
		background: linear-gradient(90deg,
			transparent 0%,
			var(--card-green) 50%,
			transparent 100%
		) border-box;
		-webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0.6;
		animation: border-glint 2.5s ease-in-out infinite;
		pointer-events: none;
		z-index: 10;
	}

	/* Synced horizontal glint sweep */
	.card.loading::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 60px;
		height: 100%;
		background: linear-gradient(90deg,
			transparent 0%,
			rgba(0, 255, 65, 0.03) 30%,
			rgba(0, 255, 65, 0.08) 50%,
			rgba(0, 255, 65, 0.03) 70%,
			transparent 100%
		);
		animation: glint-sweep 2.5s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes border-glint {
		0%, 100% {
			opacity: 0.3;
			background-position: -200% 0;
		}
		50% {
			opacity: 0.7;
			background-position: 200% 0;
		}
	}

	@keyframes glint-sweep {
		0% {
			left: -60px;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			left: calc(100% + 60px);
			opacity: 0;
		}
	}

	/* Header slot */
	.card-header {
		padding: 16px;
		border-bottom: 1px solid var(--card-border);
		color: var(--card-green);
		font-weight: 600;
		text-transform: uppercase;
		font-size: 12px;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card-header ::slotted(*) {
		margin: 0;
	}

	.card-header.hidden {
		display: none;
	}

	/* Expand toggle */
	.expand-toggle {
		background: none;
		border: none;
		color: var(--card-green);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.expand-toggle:hover {
		color: var(--card-green-dim);
	}

	.expand-toggle.expanded {
		transform: rotate(180deg);
	}

	.expand-icon {
		width: 16px;
		height: 16px;
	}

	/* Media slot */
	.card-media {
		position: relative;
		overflow: hidden;
	}

	.card-media ::slotted(img),
	.card-media ::slotted(video) {
		width: 100%;
		display: block;
	}

	.card-media.hidden {
		display: none;
	}

	/* Content */
	.card-content {
		color: var(--card-green-dim);
		font-size: 13px;
		line-height: 1.6;
		overflow: hidden;
		transition: max-height 0.3s ease, padding 0.3s ease;
	}

	/* Padding sizes - use !important to override base padding */
	.card-content.padding-none {
		padding: 0 !important;
	}

	.card-content.padding-sm {
		padding: 8px !important;
	}

	.card-content.padding-md {
		padding: 16px !important;
	}

	.card-content.padding-lg {
		padding: 24px !important;
	}

	.card-content.collapsed {
		max-height: 0 !important;
		height: 0 !important;
		min-height: 0 !important;
		padding-top: 0 !important;
		padding-bottom: 0 !important;
		padding: 0 !important;
		margin: 0 !important;
		overflow: hidden !important;
		pointer-events: none;
		visibility: hidden;
		opacity: 0;
	}

	.card-content ::slotted(*) {
		margin: 0;
	}

	.card-content ::slotted(* + *) {
		margin-top: 12px;
	}

	/* Actions slot */
	.card-actions {
		padding: 12px 16px;
		border-top: 1px solid var(--card-border);
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.card-actions.hidden {
		display: none;
	}

	/* Style buttons slotted directly */
	.card-actions ::slotted(button) {
		background: transparent;
		border: 1px solid var(--card-green);
		color: var(--card-green);
		padding: 6px 12px;
		font-family: inherit;
		font-size: 11px;
		cursor: pointer;
		text-transform: uppercase;
		transition: all 0.2s;
	}

	.card-actions ::slotted(button:hover) {
		background: var(--card-green);
		color: var(--card-bg);
	}

	/* Slotted containers display flex */
	.card-actions ::slotted(div),
	.card-actions ::slotted(span) {
		display: flex;
		gap: 8px;
		align-items: center;
	}
`;

/**
 * @component TCardLit
 * @tagname t-card
 * @description Standardized content card container with slots for header, media, content, and actions
 * @category Container
 * @since 3.0.0
 *
 * TCardLit - Standardized content card container
 *
 * @slot - Default slot for card content
 * @slot header - Card header content
 * @slot media - Card media (images, videos)
 * @slot actions - Card action buttons
 *
 * @fires card-click - Fired when a clickable card is clicked
 * @fires card-expand - Fired when card expand state changes
 *
 * @csspart card - The card container
 * @csspart header - The header section
 * @csspart media - The media section
 * @csspart content - The content section
 * @csspart actions - The actions section
 *
 * @cssprop [--card-bg] - Card background color
 * @cssprop [--card-border] - Card border color
 * @cssprop [--card-radius] - Card border radius
 */
class TCardLit extends LitElement {
	// ============================================================
	// BLOCK 1: Static Metadata (getters)
	// ============================================================

	/**
	 * Component tag name
	 * @type {string}
	 * @readonly
	 */
	static get tagName() {
		return tagName;
	}

	/**
	 * Component version
	 * @type {string}
	 * @readonly
	 */
	static get version() {
		return version;
	}

	/**
	 * Component category
	 * @type {string}
	 * @readonly
	 */
	static get category() {
		return category;
	}

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = styles;

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		/**
		 * Card variant style
		 * @property variant
		 * @type {'default'|'outlined'|'elevated'|'terminal'}
		 * @default 'default'
		 * @attribute variant
		 * @reflects true
		 */
		variant: {
			type: String,
			reflect: true
		},

		/**
		 * Whether the card is clickable
		 * @property clickable
		 * @type {boolean}
		 * @default false
		 * @attribute clickable
		 * @reflects true
		 */
		clickable: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether the card is selected
		 * @property selected
		 * @type {boolean}
		 * @default false
		 * @attribute selected
		 * @reflects true
		 */
		selected: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether the card is disabled
		 * @property disabled
		 * @type {boolean}
		 * @default false
		 * @attribute disabled
		 * @reflects true
		 */
		disabled: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether the card shows loading state
		 * @property loading
		 * @type {boolean}
		 * @default false
		 * @attribute loading
		 * @reflects true
		 */
		loading: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether the card content is expandable
		 * @property expandable
		 * @type {boolean}
		 * @default false
		 * @attribute expandable
		 * @reflects true
		 */
		expandable: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether the card content is expanded
		 * @property expanded
		 * @type {boolean}
		 * @default true
		 * @attribute expanded
		 * @reflects true
		 */
		expanded: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Content padding size
		 * @property padding
		 * @type {'none'|'sm'|'md'|'lg'}
		 * @default 'md'
		 * @attribute padding
		 * @reflects true
		 */
		padding: {
			type: String,
			reflect: true
		}
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/**
	 * Whether header slot has content
	 * @type {boolean}
	 * @private
	 */
	_hasHeader = false;

	/**
	 * Whether media slot has content
	 * @type {boolean}
	 * @private
	 */
	_hasMedia = false;

	/**
	 * Whether actions slot has content
	 * @type {boolean}
	 * @private
	 */
	_hasActions = false;

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/**
	 * Component logger instance
	 * @type {ComponentLogger|null}
	 * @private
	 */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Default values
		this.variant = 'default';
		this.clickable = false;
		this.selected = false;
		this.disabled = false;
		this.loading = false;
		this.expandable = false;
		this.expanded = true;
		this.padding = 'md';

		this._logger = componentLogger.for('TCardLit');
		this._logger.debug('Component constructed');

		// Bind methods
		this._handleClick = this._handleClick.bind(this);
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this._handleSlotChange = this._handleSlotChange.bind(this);
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

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
		this._logger.trace('Updated', { changedProperties: [...changedProperties.keys()] });
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Toggle the expanded state
	 * @public
	 * @returns {void}
	 * @fires card-expand
	 */
	toggleExpand() {
		this._logger.debug('toggleExpand called');
		if (!this.expandable) return;

		this.expanded = !this.expanded;
		this._emitExpandEvent();
	}

	/**
	 * Expand the card content
	 * @public
	 * @returns {void}
	 * @fires card-expand
	 */
	expand() {
		this._logger.debug('expand called');
		if (!this.expandable || this.expanded) return;

		this.expanded = true;
		this._emitExpandEvent();
	}

	/**
	 * Collapse the card content
	 * @public
	 * @returns {void}
	 * @fires card-expand
	 */
	collapse() {
		this._logger.debug('collapse called');
		if (!this.expandable || !this.expanded) return;

		this.expanded = false;
		this._emitExpandEvent();
	}

	/**
	 * Select the card
	 * @public
	 * @returns {void}
	 */
	select() {
		this._logger.debug('select called');
		this.selected = true;
	}

	/**
	 * Deselect the card
	 * @public
	 * @returns {void}
	 */
	deselect() {
		this._logger.debug('deselect called');
		this.selected = false;
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * Emit a custom event
	 * @private
	 * @param {string} eventName - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(eventName, detail = {}) {
		this.dispatchEvent(
			new CustomEvent(eventName, {
				detail,
				bubbles: true,
				composed: true,
			})
		);
	}

	/**
	 * Emit card-click event
	 * @private
	 * @fires card-click
	 */
	_emitClickEvent() {
		this._emitEvent('card-click', {
			selected: this.selected,
			variant: this.variant,
		});
	}

	/**
	 * Emit card-expand event
	 * @private
	 * @fires card-expand
	 */
	_emitExpandEvent() {
		this._emitEvent('card-expand', {
			expanded: this.expanded,
		});
	}

	// ============================================================
	// BLOCK 10: Nesting Support
	// ============================================================

	// No nesting support needed for this component

	// ============================================================
	// BLOCK 11: Validation
	// ============================================================

	// No validation needed for this component

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		const cardClasses = {
			card: true,
			[this.variant]: true,
			clickable: this.clickable,
			selected: this.selected,
			disabled: this.disabled,
			loading: this.loading,
		};

		const contentClasses = {
			'card-content': true,
			[`padding-${this.padding}`]: true,
			collapsed: this.expandable && !this.expanded,
		};

		return html`
			<div
				class=${classMap(cardClasses)}
				part="card"
				role=${this.clickable ? 'button' : 'article'}
				tabindex=${this.clickable && !this.disabled ? '0' : '-1'}
				aria-disabled=${this.disabled}
				aria-selected=${this.selected}
				aria-expanded=${this.expandable ? this.expanded : undefined}
				@click=${this._handleClick}
				@keydown=${this._handleKeyDown}
			>
				<div
					class="card-header ${this._hasHeader ? '' : 'hidden'}"
					part="header"
				>
					<slot name="header" @slotchange=${this._handleSlotChange}></slot>
					${this.expandable
						? html`
								<button
									class="expand-toggle ${this.expanded ? 'expanded' : ''}"
									@click=${this._handleExpandClick}
									aria-label=${this.expanded ? 'Collapse' : 'Expand'}
								>
									<svg class="expand-icon" viewBox="0 0 24 24" fill="currentColor">
										<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
									</svg>
								</button>
							`
						: ''}
				</div>

				<div
					class="card-media ${this._hasMedia ? '' : 'hidden'}"
					part="media"
				>
					<slot name="media" @slotchange=${this._handleSlotChange}></slot>
				</div>

				<div
					class=${classMap(contentClasses)}
					part="content"
				>
					<slot></slot>
				</div>

				<div
					class="card-actions ${this._hasActions ? '' : 'hidden'}"
					part="actions"
				>
					<slot name="actions" @slotchange=${this._handleSlotChange}></slot>
				</div>
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Handle click on card
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleClick(e) {
		if (!this.clickable || this.disabled) return;

		// Don't trigger card click if clicking expand button
		if (e.target.closest('.expand-toggle')) return;

		this._emitClickEvent();
	}

	/**
	 * Handle keyboard navigation
	 * @private
	 * @param {KeyboardEvent} e
	 */
	_handleKeyDown(e) {
		if (!this.clickable || this.disabled) return;

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			this._emitClickEvent();
		}
	}

	/**
	 * Handle expand button click
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleExpandClick(e) {
		e.stopPropagation();
		this.toggleExpand();
	}

	/**
	 * Handle slot content changes
	 * @private
	 * @param {Event} e
	 */
	_handleSlotChange(e) {
		const slot = e.target;
		const slotName = slot.name;
		const hasContent = slot.assignedNodes().length > 0;

		switch (slotName) {
			case 'header':
				this._hasHeader = hasContent;
				break;
			case 'media':
				this._hasMedia = hasContent;
				break;
			case 'actions':
				this._hasActions = hasContent;
				break;
		}

		this.requestUpdate();
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(tagName)) {
	customElements.define(tagName, TCardLit);
}

export default TCardLit;
