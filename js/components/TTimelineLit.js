/**
 * @fileoverview TTimelineLit - Timeline display component (vertical & horizontal)
 * @module components/TTimelineLit
 * @version 3.1.0
 *
 * A timeline component for displaying chronological events with configurable
 * orientation, dot styling, and line positioning.
 *
 * ARCHITECTURE:
 * - Vertical: Uses CSS Grid with a dedicated track column for dots/line
 * - Horizontal: Uses CSS Grid with a dedicated row for dots/line
 * - Line is pure CSS, positioned in the gutter track
 * - No JS positioning required - all CSS-based for reliability
 *
 * @example
 * <t-tmln></t-tmln>
 * <t-tmln orientation="horizontal"></t-tmln>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================
const tagName = 't-tmln';
const version = '3.1.0';
const category = 'Container';

// ============================================================
// BLOCK 2: Static Styles
// ============================================================
const styles = css`
	/* ============================ */
	/* HOST & CSS VARIABLES         */
	/* ============================ */
	:host {
		--tl-bg: var(--terminal-gray-darkest, #1a1a1a);
		--tl-border: var(--terminal-gray-dark, #333);
		--tl-green: var(--terminal-green, #00ff41);
		--tl-green-dim: var(--terminal-green-dim, #00cc33);
		--tl-amber: var(--terminal-amber, #ffb000);
		--tl-red: var(--terminal-red, #ff003c);
		--tl-cyan: var(--terminal-cyan, #00ffff);
		--tl-gray: var(--terminal-gray, #666);

		/* Configurable via properties */
		--tl-line-width: 2px;
		--tl-dot-size: 12px;
		--tl-gap: 16px;
		--tl-item-gap: 24px;

		display: block;
		font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
		width: 100%;
		box-sizing: border-box;
	}

	:host([hidden]) {
		display: none !important;
	}

	/* Dot size presets */
	:host([dot-size="sm"]) { --tl-dot-size: 8px; }
	:host([dot-size="lg"]) { --tl-dot-size: 16px; }
	:host([dot-size="xl"]) { --tl-dot-size: 20px; }

	/* Dense mode */
	:host([dense]) {
		--tl-dot-size: 8px;
		--tl-gap: 10px;
		--tl-item-gap: 12px;
	}

	/* ============================ */
	/* VERTICAL TIMELINE            */
	/* ============================ */
	.timeline-vertical {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	/* The vertical line - positioned relative to first/last dots via JS */
	.timeline-vertical .tl-line {
		position: absolute;
		width: var(--tl-line-width);
		background: var(--tl-green-dim);
		opacity: 0.5;
		z-index: 0;
		/* Top/bottom set dynamically to align with dot centers */
	}

	/* Line position: left (default) */
	.timeline-vertical.line-left .tl-line {
		left: calc(var(--tl-dot-size) / 2 - var(--tl-line-width) / 2);
	}

	/* Line position: right */
	.timeline-vertical.line-right .tl-line {
		right: calc(var(--tl-dot-size) / 2 - var(--tl-line-width) / 2);
		left: auto;
	}

	/* Vertical item wrapper */
	.timeline-vertical .tl-item {
		display: grid;
		position: relative;
		margin-bottom: var(--tl-item-gap);
	}

	.timeline-vertical .tl-item:last-child {
		margin-bottom: 0;
	}

	/* Grid layout: [dot] [gap] [content] */
	.timeline-vertical.line-left .tl-item {
		grid-template-columns: var(--tl-dot-size) var(--tl-gap) 1fr;
	}

	/* Grid layout: [content] [gap] [dot] */
	.timeline-vertical.line-right .tl-item {
		grid-template-columns: 1fr var(--tl-gap) var(--tl-dot-size);
	}

	/* Dot container - centers the dot with the content box */
	.timeline-vertical .tl-dot-container {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	.timeline-vertical.line-left .tl-dot-container {
		grid-column: 1;
	}

	.timeline-vertical.line-right .tl-dot-container {
		grid-column: 3;
	}

	/* Content positioning */
	.timeline-vertical.line-left .tl-content {
		grid-column: 3;
	}

	.timeline-vertical.line-right .tl-content {
		grid-column: 1;
		text-align: right;
	}

	.timeline-vertical.line-right .tl-header {
		flex-direction: row-reverse;
	}

	/* ============================ */
	/* HORIZONTAL TIMELINE          */
	/* ============================ */
	.timeline-horizontal {
		display: flex;
		flex-direction: column;
		overflow-x: auto;
		overflow-y: visible;
		padding-bottom: 8px; /* Space for scrollbar */

		/* Terminal-style scrollbar */
		scrollbar-width: thin;
		scrollbar-color: var(--tl-green-dim) var(--tl-bg);
	}

	.timeline-horizontal::-webkit-scrollbar {
		height: 8px;
	}

	.timeline-horizontal::-webkit-scrollbar-track {
		background: var(--tl-bg);
		border: 1px solid var(--tl-border);
	}

	.timeline-horizontal::-webkit-scrollbar-thumb {
		background: var(--tl-green-dim);
		border-radius: 0;
	}

	.timeline-horizontal::-webkit-scrollbar-thumb:hover {
		background: var(--tl-green);
	}

	/* Horizontal inner grid - 3 rows, columns set dynamically */
	.tl-horizontal-grid {
		display: grid;
		width: fit-content;
		min-width: 100%;
		column-gap: var(--tl-item-gap);
		position: relative;
	}

	/* Line position: top (dots above content) */
	.timeline-horizontal.line-top .tl-horizontal-grid {
		grid-template-rows: var(--tl-dot-size) var(--tl-gap) auto;
	}

	/* Line position: bottom (dots below content) */
	.timeline-horizontal.line-bottom .tl-horizontal-grid {
		grid-template-rows: auto var(--tl-gap) var(--tl-dot-size);
	}

	/* Horizontal line - positioned absolutely to span from first to last dot */
	.timeline-horizontal .tl-line {
		position: absolute;
		height: var(--tl-line-width);
		background: var(--tl-green-dim);
		opacity: 0.5;
		z-index: 0;
		left: 0;
		right: 0;
	}

	.timeline-horizontal.line-top .tl-line {
		top: calc(var(--tl-dot-size) / 2 - var(--tl-line-width) / 2);
	}

	.timeline-horizontal.line-bottom .tl-line {
		bottom: calc(var(--tl-dot-size) / 2 - var(--tl-line-width) / 2);
	}

	/* Horizontal dot wrapper - each in its own grid cell */
	.tl-dot-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		min-width: 100px;
	}

	.timeline-horizontal.line-top .tl-dot-wrapper {
		grid-row: 1;
	}

	.timeline-horizontal.line-bottom .tl-dot-wrapper {
		grid-row: 3;
	}

	/* Horizontal content item - each in its own grid cell */
	.tl-horizontal-item {
		min-width: 100px;
		max-width: 160px;
	}

	/* Dense horizontal items - smaller widths */
	:host([dense]) .tl-horizontal-item {
		min-width: 70px;
		max-width: 120px;
	}

	:host([dense]) .tl-dot-wrapper {
		min-width: 70px;
	}

	.timeline-horizontal.line-top .tl-horizontal-item {
		grid-row: 3;
	}

	.timeline-horizontal.line-bottom .tl-horizontal-item {
		grid-row: 1;
	}

	/* Content alignment for horizontal */
	.timeline-horizontal .tl-content {
		text-align: center;
	}

	.timeline-horizontal .tl-header {
		flex-direction: column;
		align-items: center;
	}

	.timeline-horizontal.content-left .tl-content {
		text-align: left;
	}
	.timeline-horizontal.content-left .tl-header {
		align-items: flex-start;
	}

	.timeline-horizontal.content-right .tl-content {
		text-align: right;
	}
	.timeline-horizontal.content-right .tl-header {
		align-items: flex-end;
	}

	/* ============================ */
	/* DOT STYLES                   */
	/* ============================ */
	.tl-dot {
		width: var(--tl-dot-size);
		height: var(--tl-dot-size);
		border-radius: 50%;
		background: var(--tl-green);
		box-shadow: 0 0 6px rgba(0, 255, 65, 0.3);
		flex-shrink: 0;
		box-sizing: border-box;
	}

	/* Dot shapes */
	:host([dot-shape="square"]) .tl-dot {
		border-radius: 2px;
	}

	:host([dot-shape="diamond"]) .tl-dot {
		border-radius: 0;
		transform: rotate(45deg);
	}

	/* Dot variants */
	.tl-dot.success {
		background: var(--tl-green);
		box-shadow: 0 0 6px rgba(0, 255, 65, 0.3);
	}

	.tl-dot.warning {
		background: var(--tl-amber);
		box-shadow: 0 0 6px rgba(255, 176, 0, 0.3);
	}

	.tl-dot.error {
		background: var(--tl-red);
		box-shadow: 0 0 6px rgba(255, 0, 60, 0.3);
	}

	.tl-dot.info {
		background: var(--tl-cyan);
		box-shadow: 0 0 6px rgba(0, 255, 255, 0.3);
	}

	.tl-dot.pending {
		background: var(--tl-gray);
		box-shadow: none;
	}

	/* ============================ */
	/* CONTENT STYLES               */
	/* ============================ */
	.tl-content {
		background: var(--tl-bg);
		border: 1px solid var(--tl-border);
		border-radius: 4px;
		padding: 12px 16px;
		transition: border-color 0.2s ease;
	}

	.tl-content:hover {
		border-color: var(--tl-green);
	}

	.tl-item.clickable .tl-content {
		cursor: pointer;
	}

	.tl-item.clickable .tl-content:hover {
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
	}

	/* Dense content */
	:host([dense]) .tl-content {
		padding: 8px 12px;
	}

	.tl-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 8px;
		gap: 8px;
	}

	:host([dense]) .tl-header {
		margin-bottom: 4px;
		gap: 4px;
	}

	.tl-title {
		color: var(--tl-green);
		font-weight: 600;
		font-size: 13px;
		line-height: 1.4;
		margin: 0;
	}

	:host([dense]) .tl-title {
		font-size: 11px;
		line-height: 1.2;
	}

	.tl-date {
		color: var(--tl-gray);
		font-size: 11px;
		line-height: 1.4;
		white-space: nowrap;
	}

	:host([dense]) .tl-date {
		font-size: 10px;
		line-height: 1.2;
	}

	.tl-description {
		color: var(--tl-green-dim);
		font-size: 12px;
		line-height: 1.5;
		margin: 0;
	}

	:host([dense]) .tl-description {
		font-size: 10px;
		line-height: 1.3;
	}

	/* ============================ */
	/* EXPANDABLE CONTENT           */
	/* ============================ */
	.tl-expand {
		margin-top: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--tl-border);
		overflow: hidden;
		max-height: 0;
		opacity: 0;
		transition: max-height 0.3s ease, opacity 0.3s ease;
	}

	.tl-item.expanded .tl-expand {
		max-height: 500px;
		opacity: 1;
	}

	.tl-expand-content {
		color: var(--tl-green-dim);
		font-size: 12px;
		line-height: 1.5;
	}

	/* ============================ */
	/* STATES                       */
	/* ============================ */
	.timeline-loading .tl-item {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.tl-loading-more {
		text-align: center;
		padding: 16px;
		color: var(--tl-gray);
		font-size: 12px;
	}

	.tl-empty {
		text-align: center;
		padding: 32px 16px;
		color: var(--tl-gray);
		font-size: 13px;
	}

	/* Slot styling */
	::slotted(*) {
		color: var(--tl-green-dim);
		font-size: 12px;
	}
`;

/**
 * @component TTimelineLit
 * @tagname t-tmln
 * @description Timeline display with chronological events (vertical & horizontal)
 * @category Container
 * @since 3.1.0
 *
 * @slot item-{id} - Custom content for specific timeline items
 * @slot icon-{id} - Custom icon for specific timeline items
 * @slot expand-{id} - Expandable content for specific items
 *
 * @fires item-click - Fired when a timeline item is clicked
 * @fires item-expand - Fired when a timeline item is expanded/collapsed
 * @fires load-more - Fired when more items should be loaded
 *
 * @cssprop [--tl-bg] - Timeline background color
 * @cssprop [--tl-border] - Timeline border color
 * @cssprop [--tl-line-width] - Width of the timeline line
 * @cssprop [--tl-dot-size] - Size of the timeline dots
 * @cssprop [--tl-gap] - Gap between dot track and content
 * @cssprop [--tl-item-gap] - Gap between timeline items
 */
class TTimelineLit extends LitElement {
	// ============================================================
	// BLOCK 1: Static Metadata
	// ============================================================

	static get tagName() { return tagName; }
	static get version() { return version; }
	static get category() { return category; }

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
		 * @type {Array<{id: string, title: string, date?: string, description?: string, variant?: string, expandable?: boolean, clickable?: boolean}>}
		 */
		items: { type: Array },

		/**
		 * Timeline orientation
		 * @type {'vertical'|'horizontal'}
		 * @default 'vertical'
		 */
		orientation: { type: String, reflect: true },

		/**
		 * Dense mode with reduced spacing
		 * @type {boolean}
		 */
		dense: { type: Boolean, reflect: true },

		/**
		 * Loading state
		 * @type {boolean}
		 */
		loading: { type: Boolean, reflect: true },

		/**
		 * Loading more state
		 * @type {boolean}
		 */
		loadingMore: { type: Boolean, reflect: true, attribute: 'loading-more' },

		/**
		 * Line/dot position
		 * Vertical: 'left' | 'right' (default: 'left')
		 * Horizontal: 'top' | 'bottom' (default: 'top')
		 * @type {string}
		 */
		linePosition: { type: String, reflect: true, attribute: 'line-position' },

		/**
		 * Content alignment for horizontal mode
		 * @type {'left'|'center'|'right'}
		 * @default 'center'
		 */
		contentAlign: { type: String, reflect: true, attribute: 'content-align' },

		/**
		 * Dot size preset
		 * @type {'sm'|'md'|'lg'|'xl'}
		 * @default 'md'
		 */
		dotSize: { type: String, reflect: true, attribute: 'dot-size' },

		/**
		 * Dot shape
		 * @type {'circle'|'square'|'diamond'}
		 * @default 'circle'
		 */
		dotShape: { type: String, reflect: true, attribute: 'dot-shape' },

		/**
		 * Dot color mode
		 * @type {'variant'|'uniform'|'gradient'}
		 * @default 'variant'
		 */
		dotColorMode: { type: String, reflect: true, attribute: 'dot-color-mode' },

		/**
		 * Uniform dot color (when dotColorMode='uniform')
		 * @type {string}
		 */
		dotColor: { type: String, attribute: 'dot-color' },

		/**
		 * Gradient start color (when dotColorMode='gradient')
		 * @type {string}
		 */
		dotColorStart: { type: String, attribute: 'dot-color-start' },

		/**
		 * Gradient end color (when dotColorMode='gradient')
		 * @type {string}
		 */
		dotColorEnd: { type: String, attribute: 'dot-color-end' }
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/** @type {Set<string>} */
	_expandedItems = new Set();

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/** @type {Object|null} */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();
		this.items = [];
		this.orientation = 'vertical';
		this.dense = false;
		this.loading = false;
		this.loadingMore = false;
		this.linePosition = null; // Auto-detect based on orientation
		this.contentAlign = 'center';
		this.dotSize = 'md';
		this.dotShape = 'circle';
		this.dotColorMode = 'variant';
		this.dotColor = '#00ff41';
		this.dotColorStart = '#00ff41';
		this.dotColorEnd = '#00ffff';

		this._logger = componentLogger.for('TTimelineLit');
		this._handleItemClick = this._handleItemClick.bind(this);
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.debug('Connected to DOM');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.debug('Disconnected from DOM');
	}

	firstUpdated() {
		this._updateLinePosition();
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('items') || changedProperties.has('orientation') ||
			changedProperties.has('dense') || changedProperties.has('dotSize')) {
			// Use requestAnimationFrame to ensure DOM is fully rendered
			requestAnimationFrame(() => this._updateLinePosition());
		}
	}

	/**
	 * Update vertical line position based on actual dot positions
	 * @private
	 */
	_updateLinePosition() {
		if (this.orientation === 'horizontal') {
			this._updateHorizontalLinePosition();
			return;
		}

		const line = this.shadowRoot?.querySelector('.tl-line');
		const dots = this.shadowRoot?.querySelectorAll('.tl-dot-container');

		if (!line || !dots || dots.length < 2) return;

		const container = this.shadowRoot.querySelector('.timeline-vertical');
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const firstDot = dots[0];
		const lastDot = dots[dots.length - 1];

		const firstDotRect = firstDot.getBoundingClientRect();
		const lastDotRect = lastDot.getBoundingClientRect();

		// Line goes from center of first dot to center of last dot
		const firstCenter = firstDotRect.top - containerRect.top + firstDotRect.height / 2;
		const lastCenter = lastDotRect.top - containerRect.top + lastDotRect.height / 2;
		const height = Math.max(0, lastCenter - firstCenter);

		line.style.top = `${firstCenter}px`;
		line.style.height = `${height}px`;
		line.style.bottom = 'auto';
	}

	/**
	 * Update horizontal line position based on actual dot positions
	 * @private
	 */
	_updateHorizontalLinePosition() {
		const line = this.shadowRoot?.querySelector('.tl-line');
		const dotWrappers = this.shadowRoot?.querySelectorAll('.tl-dot-wrapper');

		if (!line || !dotWrappers || dotWrappers.length < 2) return;

		const grid = this.shadowRoot.querySelector('.tl-horizontal-grid');
		if (!grid) return;

		const gridRect = grid.getBoundingClientRect();
		const firstWrapper = dotWrappers[0];
		const lastWrapper = dotWrappers[dotWrappers.length - 1];

		const firstRect = firstWrapper.getBoundingClientRect();
		const lastRect = lastWrapper.getBoundingClientRect();

		// Line goes from center of first dot to center of last dot horizontally
		const firstCenter = firstRect.left - gridRect.left + firstRect.width / 2;
		const lastCenter = lastRect.left - gridRect.left + lastRect.width / 2;
		const width = Math.max(0, lastCenter - firstCenter);

		line.style.left = `${firstCenter}px`;
		line.style.width = `${width}px`;
		line.style.right = 'auto';
		line.style.marginLeft = '0';
		line.style.marginRight = '0';
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Expand a timeline item
	 * @param {string} id
	 */
	expandItem(id) {
		const item = this.items.find(i => i.id === id);
		if (item?.expandable) {
			this._expandedItems.add(id);
			this._emitEvent('item-expand', { id, expanded: true });
			this.requestUpdate();
		}
	}

	/**
	 * Collapse a timeline item
	 * @param {string} id
	 */
	collapseItem(id) {
		if (this._expandedItems.has(id)) {
			this._expandedItems.delete(id);
			this._emitEvent('item-expand', { id, expanded: false });
			this.requestUpdate();
		}
	}

	/**
	 * Toggle a timeline item's expanded state
	 * @param {string} id
	 */
	toggleItem(id) {
		if (this._expandedItems.has(id)) {
			this.collapseItem(id);
		} else {
			this.expandItem(id);
		}
	}

	/**
	 * Check if an item is expanded
	 * @param {string} id
	 * @returns {boolean}
	 */
	isExpanded(id) {
		return this._expandedItems.has(id);
	}

	/**
	 * Trigger load more event
	 */
	loadMore() {
		if (!this.loadingMore) {
			this._emitEvent('load-more');
		}
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * @private
	 */
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	render() {
		if (this.items.length === 0 && !this.loading) {
			return html`<div class="tl-empty">No timeline items</div>`;
		}

		const isHorizontal = this.orientation === 'horizontal';
		return isHorizontal ? this._renderHorizontal() : this._renderVertical();
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Get the effective line position
	 * @private
	 */
	_getLinePosition() {
		if (this.linePosition) return this.linePosition;
		return this.orientation === 'horizontal' ? 'top' : 'left';
	}

	/**
	 * Render vertical timeline
	 * @private
	 */
	_renderVertical() {
		const linePos = this._getLinePosition();
		const classes = {
			'timeline-vertical': true,
			'timeline-loading': this.loading,
			[`line-${linePos}`]: true
		};

		return html`
			<div class=${classMap(classes)}>
				${this.items.length > 1 ? html`<div class="tl-line"></div>` : ''}
				${this.items.map((item, index) => this._renderVerticalItem(item, index))}
				${this.loadingMore ? html`<div class="tl-loading-more">Loading more...</div>` : ''}
			</div>
		`;
	}

	/**
	 * Render a vertical timeline item
	 * @private
	 */
	_renderVerticalItem(item, index) {
		const isExpanded = this._expandedItems.has(item.id);
		const itemClasses = {
			'tl-item': true,
			'clickable': item.clickable || item.expandable,
			'expanded': isExpanded
		};

		const dotStyle = this._getDotStyle(index);

		return html`
			<div class=${classMap(itemClasses)} @click=${() => this._handleItemClick(item)}>
				<div class="tl-dot-container">
					<div class="tl-dot ${item.variant || 'default'}" style=${styleMap(dotStyle)}>
						<slot name="icon-${item.id}"></slot>
					</div>
				</div>
				<div></div><!-- Gap spacer -->
				<div class="tl-content">
					<div class="tl-header">
						<h4 class="tl-title">${item.title}</h4>
						${item.date ? html`<span class="tl-date">${item.date}</span>` : ''}
					</div>
					${item.description ? html`<p class="tl-description">${item.description}</p>` : ''}
					<slot name="item-${item.id}"></slot>
					${item.expandable ? html`
						<div class="tl-expand">
							<div class="tl-expand-content">
								<slot name="expand-${item.id}"></slot>
							</div>
						</div>
					` : ''}
				</div>
			</div>
		`;
	}

	/**
	 * Render horizontal timeline
	 * @private
	 */
	_renderHorizontal() {
		const linePos = this._getLinePosition();
		const classes = {
			'timeline-horizontal': true,
			'timeline-loading': this.loading,
			[`line-${linePos}`]: true,
			[`content-${this.contentAlign}`]: this.contentAlign !== 'center'
		};

		// Create grid-template-columns based on item count (smaller for dense mode)
		const minWidth = this.dense ? '70px' : '100px';
		const maxWidth = this.dense ? '120px' : '160px';
		const gridColumns = `repeat(${this.items.length}, minmax(${minWidth}, ${maxWidth}))`;

		return html`
			<div class=${classMap(classes)}>
				<div class="tl-horizontal-grid" style="grid-template-columns: ${gridColumns}">
					<!-- Line -->
					${this.items.length > 1 ? html`<div class="tl-line"></div>` : ''}
					<!-- Dots - each in its own column -->
					${this.items.map((item, index) => html`
						<div class="tl-dot-wrapper" style="grid-column: ${index + 1}">
							<div class="tl-dot ${item.variant || 'default'}" style=${styleMap(this._getDotStyle(index))}></div>
						</div>
					`)}
					<!-- Content - each in its own column, same column as its dot -->
					${this.items.map((item, index) => this._renderHorizontalItem(item, index))}
				</div>
				${this.loadingMore ? html`<div class="tl-loading-more">Loading more...</div>` : ''}
			</div>
		`;
	}

	/**
	 * Render a horizontal timeline item
	 * @private
	 */
	_renderHorizontalItem(item, index) {
		const isExpanded = this._expandedItems.has(item.id);
		const itemClasses = {
			'tl-item': true,
			'tl-horizontal-item': true,
			'clickable': item.clickable || item.expandable,
			'expanded': isExpanded
		};

		return html`
			<div class=${classMap(itemClasses)} style="grid-column: ${index + 1}" @click=${() => this._handleItemClick(item)}>
				<div class="tl-content">
					<div class="tl-header">
						<h4 class="tl-title">${item.title}</h4>
						${item.date ? html`<span class="tl-date">${item.date}</span>` : ''}
					</div>
					${item.description ? html`<p class="tl-description">${item.description}</p>` : ''}
					<slot name="item-${item.id}"></slot>
					${item.expandable ? html`
						<div class="tl-expand">
							<div class="tl-expand-content">
								<slot name="expand-${item.id}"></slot>
							</div>
						</div>
					` : ''}
				</div>
			</div>
		`;
	}

	/**
	 * Get dot style based on color mode
	 * @private
	 */
	_getDotStyle(index) {
		if (this.dotColorMode === 'uniform' && this.dotColor) {
			return {
				background: this.dotColor,
				boxShadow: `0 0 6px ${this.dotColor}40`
			};
		}

		if (this.dotColorMode === 'gradient' && this.items.length > 1) {
			const t = index / (this.items.length - 1);
			const color = this._interpolateColor(this.dotColorStart, this.dotColorEnd, t);
			return {
				background: color,
				boxShadow: `0 0 6px ${color}40`
			};
		}

		// Default: use variant colors (handled by CSS classes)
		return {};
	}

	/**
	 * Interpolate between two colors
	 * @private
	 */
	_interpolateColor(color1, color2, t) {
		const c1 = this._parseColor(color1);
		const c2 = this._parseColor(color2);
		if (!c1 || !c2) return color1;

		const r = Math.round(c1.r + (c2.r - c1.r) * t);
		const g = Math.round(c1.g + (c2.g - c1.g) * t);
		const b = Math.round(c1.b + (c2.b - c1.b) * t);

		return `rgb(${r}, ${g}, ${b})`;
	}

	/**
	 * Parse hex color to RGB
	 * @private
	 */
	_parseColor(color) {
		const hex = color.replace('#', '');
		if (hex.length !== 6) return null;
		return {
			r: parseInt(hex.slice(0, 2), 16),
			g: parseInt(hex.slice(2, 4), 16),
			b: parseInt(hex.slice(4, 6), 16)
		};
	}

	/**
	 * Handle item click
	 * @private
	 */
	_handleItemClick(item) {
		if (item.expandable) {
			this.toggleItem(item.id);
		}
		if (item.clickable) {
			this._emitEvent('item-click', { id: item.id, title: item.title, item });
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
