/**
 * @fileoverview TTimelineLit - Vertical timeline display component
 * @module components/TTimelineLit
 * @version 3.0.0
 *
 * A timeline component for displaying chronological events with icons,
 * dates, and expandable content.
 *
 * @example
 * <t-tmln></t-tmln>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================
const tagName = 't-tmln';
const version = '3.0.0';
const category = 'Container';

// ============================================================
// BLOCK 2: Static Styles
// ============================================================
const styles = css`
	:host {
		--timeline-bg: var(--terminal-gray-darkest, #1a1a1a);
		--timeline-border: var(--terminal-gray-dark, #333);
		--timeline-green: var(--terminal-green, #00ff41);
		--timeline-green-dim: var(--terminal-green-dim, #00cc33);
		--timeline-amber: var(--terminal-amber, #ffb000);
		--timeline-red: var(--terminal-red, #ff003c);
		--timeline-cyan: var(--terminal-cyan, #00ffff);
		--timeline-gray: var(--terminal-gray, #666);
		--timeline-line-width: 2px;
		--timeline-dot-size: 12px;

		display: block;
		font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
	}

	.timeline {
		position: relative;
		padding-left: 30px;
	}

	/* Vertical line */
	.timeline::before {
		content: '';
		position: absolute;
		left: 5px;
		top: 0;
		bottom: 0;
		width: var(--timeline-line-width);
		background: var(--timeline-border);
	}

	/* Dense mode */
	.timeline.dense .timeline-item {
		padding-bottom: 16px;
	}

	.timeline.dense .timeline-item-content {
		padding: 8px 12px;
	}

	/* Alignment */
	.timeline.align-left {
		padding-left: 30px;
		padding-right: 0;
	}

	.timeline.align-right {
		padding-left: 0;
		padding-right: 30px;
	}

	.timeline.align-right::before {
		left: auto;
		right: 5px;
	}

	.timeline.align-alternate .timeline-item:nth-child(even) {
		padding-left: 0;
		padding-right: 30px;
		text-align: right;
	}

	.timeline.align-alternate .timeline-item:nth-child(even) .timeline-item-dot {
		left: auto;
		right: -24px;
		transform: translateX(50%);
	}

	/* Timeline item */
	.timeline-item {
		position: relative;
		padding-bottom: 24px;
	}

	.timeline-item:last-child {
		padding-bottom: 0;
	}

	/* Dot */
	.timeline-item-dot {
		position: absolute;
		left: -24px;
		top: 12px;
		width: var(--timeline-dot-size);
		height: var(--timeline-dot-size);
		border-radius: 50%;
		background: var(--timeline-border);
		border: 2px solid var(--timeline-bg);
		z-index: 1;
		transform: translateX(-50%);
	}

	/* Dot variants */
	.timeline-item-dot.default {
		background: var(--timeline-green);
		box-shadow: 0 0 6px rgba(0, 255, 65, 0.3);
	}

	.timeline-item-dot.success {
		background: var(--timeline-green);
		box-shadow: 0 0 6px rgba(0, 255, 65, 0.3);
	}

	.timeline-item-dot.warning {
		background: var(--timeline-amber);
		box-shadow: 0 0 6px rgba(255, 176, 0, 0.3);
	}

	.timeline-item-dot.error {
		background: var(--timeline-red);
		box-shadow: 0 0 6px rgba(255, 0, 60, 0.3);
	}

	.timeline-item-dot.info {
		background: var(--timeline-cyan);
		box-shadow: 0 0 6px rgba(0, 255, 255, 0.3);
	}

	.timeline-item-dot.pending {
		background: var(--timeline-gray);
		box-shadow: none;
	}

	/* Icon in dot */
	.timeline-item-dot svg {
		width: 8px;
		height: 8px;
		fill: var(--timeline-bg);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	/* Content */
	.timeline-item-content {
		background: var(--timeline-bg);
		border: 1px solid var(--timeline-border);
		border-radius: 4px;
		padding: 12px 16px;
		transition: all 0.2s ease;
	}

	.timeline-item-content:hover {
		border-color: var(--timeline-green);
	}

	.timeline-item.clickable .timeline-item-content {
		cursor: pointer;
	}

	.timeline-item.clickable .timeline-item-content:hover {
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
	}

	/* Header */
	.timeline-item-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 8px;
	}

	.timeline-item-title {
		color: var(--timeline-green);
		font-weight: 600;
		font-size: 13px;
		margin: 0;
	}

	.timeline-item-date {
		color: var(--timeline-gray);
		font-size: 11px;
		white-space: nowrap;
	}

	/* Description */
	.timeline-item-description {
		color: var(--timeline-green-dim);
		font-size: 12px;
		line-height: 1.5;
		margin: 0;
	}

	/* Expandable */
	.timeline-item-expand {
		margin-top: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--timeline-border);
		overflow: hidden;
		max-height: 0;
		opacity: 0;
		transition: max-height 0.3s ease, opacity 0.3s ease;
	}

	.timeline-item.expanded .timeline-item-expand {
		max-height: 500px;
		opacity: 1;
	}

	.timeline-item-expand-content {
		color: var(--timeline-green-dim);
		font-size: 12px;
		line-height: 1.5;
	}

	/* Loading state */
	.timeline.loading .timeline-item {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	/* Loading more */
	.timeline-loading-more {
		text-align: center;
		padding: 16px;
		color: var(--timeline-gray);
		font-size: 12px;
	}

	/* Empty state */
	.timeline-empty {
		text-align: center;
		padding: 32px 16px;
		color: var(--timeline-gray);
		font-size: 13px;
	}

	/* Slot styling */
	::slotted(*) {
		color: var(--timeline-green-dim);
		font-size: 12px;
	}
`;

/**
 * TTimelineLit - Vertical timeline display component
 *
 * @element t-tmln
 * @slot item-{id} - Custom content for specific timeline items
 * @slot icon-{id} - Custom icon for specific timeline items
 *
 * @fires item-click - Fired when a timeline item is clicked
 * @fires item-expand - Fired when a timeline item is expanded
 * @fires load-more - Fired when more items should be loaded
 *
 * @cssprop [--timeline-bg] - Timeline background color
 * @cssprop [--timeline-border] - Timeline border color
 * @cssprop [--timeline-line-width] - Width of the timeline line
 * @cssprop [--timeline-dot-size] - Size of the timeline dots
 */
class TTimelineLit extends LitElement {
	// ============================================================
	// BLOCK 1: Static Metadata (getters)
	// ============================================================

	static get tagName() {
		return tagName;
	}

	static get version() {
		return version;
	}

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
		 * Timeline items array
		 * @property items
		 * @type {Array<{id: string, title: string, date?: string, description?: string, variant?: string, expandable?: boolean, expanded?: boolean, clickable?: boolean}>}
		 * @default []
		 */
		items: {
			type: Array
		},

		/**
		 * Timeline alignment
		 * @property align
		 * @type {'left'|'right'|'alternate'}
		 * @default 'left'
		 * @attribute align
		 * @reflects true
		 */
		align: {
			type: String,
			reflect: true
		},

		/**
		 * Dense mode with less spacing
		 * @property dense
		 * @type {boolean}
		 * @default false
		 * @attribute dense
		 * @reflects true
		 */
		dense: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Loading state
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
		 * Loading more state
		 * @property loadingMore
		 * @type {boolean}
		 * @default false
		 * @attribute loading-more
		 * @reflects true
		 */
		loadingMore: {
			type: Boolean,
			reflect: true,
			attribute: 'loading-more'
		}
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/**
	 * Set of expanded item IDs
	 * @type {Set<string>}
	 * @private
	 */
	_expandedItems = new Set();

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/**
	 * Component logger instance
	 * @type {Object|null}
	 * @private
	 */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Default values
		this.items = [];
		this.align = 'left';
		this.dense = false;
		this.loading = false;
		this.loadingMore = false;

		this._logger = componentLogger.for('TTimelineLit');
		this._logger.debug('Component constructed');

		// Bind methods
		this._handleItemClick = this._handleItemClick.bind(this);
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
	 * Expand a timeline item
	 * @public
	 * @param {string} id - Item ID to expand
	 * @returns {void}
	 * @fires item-expand
	 */
	expandItem(id) {
		this._logger.debug('expandItem called', { id });
		const item = this.items.find(i => i.id === id);
		if (item && item.expandable) {
			this._expandedItems.add(id);
			this._emitEvent('item-expand', { id, expanded: true });
			this.requestUpdate();
		}
	}

	/**
	 * Collapse a timeline item
	 * @public
	 * @param {string} id - Item ID to collapse
	 * @returns {void}
	 * @fires item-expand
	 */
	collapseItem(id) {
		this._logger.debug('collapseItem called', { id });
		if (this._expandedItems.has(id)) {
			this._expandedItems.delete(id);
			this._emitEvent('item-expand', { id, expanded: false });
			this.requestUpdate();
		}
	}

	/**
	 * Toggle a timeline item's expanded state
	 * @public
	 * @param {string} id - Item ID to toggle
	 * @returns {void}
	 * @fires item-expand
	 */
	toggleItem(id) {
		this._logger.debug('toggleItem called', { id });
		if (this._expandedItems.has(id)) {
			this.collapseItem(id);
		} else {
			this.expandItem(id);
		}
	}

	/**
	 * Check if an item is expanded
	 * @public
	 * @param {string} id - Item ID to check
	 * @returns {boolean}
	 */
	isExpanded(id) {
		return this._expandedItems.has(id);
	}

	/**
	 * Load more items
	 * @public
	 * @returns {void}
	 * @fires load-more
	 */
	loadMore() {
		this._logger.debug('loadMore called');
		if (!this.loadingMore) {
			this._emitEvent('load-more');
		}
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

		const timelineClasses = {
			timeline: true,
			dense: this.dense,
			loading: this.loading,
			[`align-${this.align}`]: true,
		};

		if (this.items.length === 0 && !this.loading) {
			return html`
				<div class="timeline-empty">
					No timeline items
				</div>
			`;
		}

		return html`
			<div class=${classMap(timelineClasses)}>
				${this.items.map(item => this._renderItem(item))}
				${this.loadingMore
					? html`<div class="timeline-loading-more">Loading more...</div>`
					: ''}
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Render a timeline item
	 * @private
	 * @param {Object} item - Item to render
	 * @returns {import('lit').TemplateResult}
	 */
	_renderItem(item) {
		const isExpanded = this._expandedItems.has(item.id);
		const itemClasses = {
			'timeline-item': true,
			expanded: isExpanded,
			clickable: item.clickable || item.expandable,
		};

		const dotClasses = {
			'timeline-item-dot': true,
			[item.variant || 'default']: true,
		};

		return html`
			<div
				class=${classMap(itemClasses)}
				@click=${() => this._handleItemClick(item)}
			>
				<div class=${classMap(dotClasses)}>
					<slot name="icon-${item.id}"></slot>
				</div>
				<div class="timeline-item-content">
					<div class="timeline-item-header">
						<h4 class="timeline-item-title">${item.title}</h4>
						${item.date
							? html`<span class="timeline-item-date">${item.date}</span>`
							: ''}
					</div>
					${item.description
						? html`<p class="timeline-item-description">${item.description}</p>`
						: ''}
					<slot name="item-${item.id}"></slot>
					${item.expandable
						? html`
								<div class="timeline-item-expand">
									<div class="timeline-item-expand-content">
										<slot name="expand-${item.id}"></slot>
									</div>
								</div>
							`
						: ''}
				</div>
			</div>
		`;
	}

	/**
	 * Handle item click
	 * @private
	 * @param {Object} item
	 */
	_handleItemClick(item) {
		if (item.expandable) {
			this.toggleItem(item.id);
		}

		if (item.clickable) {
			this._emitEvent('item-click', {
				id: item.id,
				title: item.title,
				item
			});
		}
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(tagName)) {
	customElements.define(tagName, TTimelineLit);
}

export default TTimelineLit;
