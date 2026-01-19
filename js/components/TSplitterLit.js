/**
 * @fileoverview TSplitterLit - Resizable panel divider component
 * @module components/TSplitterLit
 * @version 3.0.0
 *
 * A splitter component for creating resizable panels with drag-to-resize
 * and collapsible functionality.
 *
 * @example
 * <t-split>
 *   <div slot="pane-0">Left Panel</div>
 *   <div slot="pane-1">Right Panel</div>
 * </t-split>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import componentLogger from '../utils/ComponentLogger.js';
import { scrollbarStyles, scrollbarProperties, scrollbarDefaults } from '../utils/scrollbar-styles.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================
const tagName = 't-split';
const version = '3.0.0';
const category = 'Container';

// ============================================================
// BLOCK 2: Static Styles
// ============================================================
const styles = [
	scrollbarStyles,
	css`
	:host {
		--splitter-bg: var(--terminal-gray-darkest, #1a1a1a);
		--splitter-border: var(--terminal-gray-dark, #333);
		--splitter-green: var(--terminal-green, #00ff41);
		--splitter-gutter-size: 8px;
		--splitter-min-pane-size: 50px;

		display: block;
		width: 100%;
		height: 100%;
		font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
	}

	.splitter {
		display: flex;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.splitter.vertical {
		flex-direction: column;
	}

	/* Panes */
	.pane {
		overflow: auto;
		position: relative;
		background: var(--splitter-bg);
		transition: none;
	}

	.pane.snapping {
		transition: flex 150ms ease-out;
	}

	.pane.collapsed {
		flex: 0 0 0 !important;
		overflow: hidden;
	}

	/* Gutter */
	.gutter {
		flex: 0 0 var(--splitter-gutter-size);
		background: var(--splitter-border);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.15s ease;
		position: relative;
	}

	.gutter:hover {
		background: var(--splitter-green);
	}

	.gutter.dragging {
		background: var(--splitter-green);
	}

	/* Horizontal gutter */
	.splitter:not(.vertical) .gutter {
		cursor: col-resize;
		width: var(--splitter-gutter-size);
	}

	/* Vertical gutter */
	.splitter.vertical .gutter {
		cursor: row-resize;
		height: var(--splitter-gutter-size);
	}

	/* Gutter handle */
	.gutter-handle {
		display: flex;
		gap: 2px;
		pointer-events: none;
	}

	/* Collapse buttons in gutter */
	.gutter .collapse-btn {
		position: absolute;
		background: transparent;
		border: none;
		color: var(--splitter-green);
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.15s ease;
		padding: 0;
		z-index: 1;
	}

	.gutter:hover .collapse-btn {
		opacity: 1;
	}

	.gutter .collapse-btn:hover {
		background: var(--splitter-green);
		color: var(--splitter-bg);
	}

	.gutter .collapse-btn svg {
		width: 10px;
		height: 10px;
		fill: currentColor;
	}

	/* Horizontal gutter collapse buttons */
	.splitter:not(.vertical) .gutter .collapse-pane-0 {
		top: 4px;
	}

	.splitter:not(.vertical) .gutter .collapse-pane-1 {
		bottom: 4px;
	}

	/* Vertical gutter collapse buttons */
	.splitter.vertical .gutter .collapse-pane-0 {
		left: 4px;
	}

	.splitter.vertical .gutter .collapse-pane-1 {
		right: 4px;
	}

	.splitter:not(.vertical) .gutter-handle {
		flex-direction: column;
	}

	.gutter-handle-dot {
		width: 3px;
		height: 3px;
		background: var(--splitter-bg);
		border-radius: 50%;
	}

	/* Expand buttons in collapsed panes */
	.pane .expand-btn {
		position: absolute;
		z-index: 10;
		background: var(--splitter-border);
		border: none;
		color: var(--splitter-green);
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.15s ease;
		padding: 0;
	}

	.pane .expand-btn:hover {
		background: var(--splitter-green);
		color: var(--splitter-bg);
	}

	.pane .expand-btn svg {
		width: 12px;
		height: 12px;
		fill: currentColor;
	}

	/* Horizontal expand buttons */
	.splitter:not(.vertical) .pane .expand-btn {
		top: 50%;
		transform: translateY(-50%);
	}

	.splitter:not(.vertical) .pane:first-child .expand-btn {
		right: 0;
		border-radius: 4px 0 0 4px;
	}

	.splitter:not(.vertical) .pane:last-child .expand-btn {
		left: 0;
		border-radius: 0 4px 4px 0;
	}

	/* Vertical expand buttons */
	.splitter.vertical .pane .expand-btn {
		left: 50%;
		transform: translateX(-50%);
	}

	.splitter.vertical .pane:first-child .expand-btn {
		bottom: 0;
		border-radius: 4px 4px 0 0;
	}

	.splitter.vertical .pane:last-child .expand-btn {
		top: 0;
		border-radius: 0 0 4px 4px;
	}

	/* User-select during drag */
	.dragging * {
		user-select: none;
	}
`];

/**
 * @component TSplitterLit
 * @tagname t-split
 * @description Resizable panel divider component with drag-to-resize and collapsible panes
 * @category Container
 * @since 3.0.0
 *
 * TSplitterLit - Resizable panel divider component
 *
 * @slot pane-0 - First pane content
 * @slot pane-1 - Second pane content
 *
 * @fires resize - Fired during resize with new sizes
 * @fires resize-start - Fired when resize starts
 * @fires resize-end - Fired when resize ends
 * @fires collapse - Fired when a pane is collapsed/expanded
 *
 * @cssprop [--splitter-bg] - Background color
 * @cssprop [--splitter-border] - Border/gutter color
 * @cssprop [--splitter-gutter-size] - Size of the gutter
 * @cssprop [--splitter-min-pane-size] - Minimum pane size
 */
class TSplitterLit extends LitElement {
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
		...scrollbarProperties,

		/**
		 * Splitter orientation
		 * @property orientation
		 * @type {'horizontal'|'vertical'}
		 * @default 'horizontal'
		 * @attribute orientation
		 * @reflects true
		 */
		orientation: {
			type: String,
			reflect: true
		},

		/**
		 * Pane sizes as percentages [left/top, right/bottom]
		 * @property sizes
		 * @type {Array<number>}
		 * @default [50, 50]
		 */
		sizes: {
			type: Array
		},

		/**
		 * Minimum sizes for panes in pixels
		 * @property minSizes
		 * @type {Array<number>}
		 * @default [50, 50]
		 */
		minSizes: {
			type: Array,
			attribute: 'min-sizes'
		},

		/**
		 * Whether panes can be collapsed (all panes collapsible by default unless minSizes > 0)
		 * @property collapsible
		 * @type {Array<boolean>}
		 * @default [true, true]
		 */
		collapsible: {
			type: Array
		},

		/**
		 * Currently collapsed panes
		 * @property collapsed
		 * @type {Array<boolean>}
		 * @default [false, false]
		 */
		collapsed: {
			type: Array
		},

		/**
		 * Gutter size in pixels
		 * @property gutterSize
		 * @type {number}
		 * @default 8
		 * @attribute gutter-size
		 */
		gutterSize: {
			type: Number,
			attribute: 'gutter-size'
		},

		/**
		 * Snap offset for collapsing
		 * @property snapOffset
		 * @type {number}
		 * @default 30
		 * @attribute snap-offset
		 */
		snapOffset: {
			type: Number,
			attribute: 'snap-offset'
		},

		/**
		 * Storage key for persisting sizes
		 * @property storageKey
		 * @type {string}
		 * @default ''
		 * @attribute storage-key
		 */
		storageKey: {
			type: String,
			attribute: 'storage-key'
		}
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/**
	 * Whether currently dragging
	 * @type {boolean}
	 * @private
	 */
	_isDragging = false;

	/**
	 * Starting position for drag
	 * @type {number}
	 * @private
	 */
	_startPos = 0;

	/**
	 * Starting sizes for drag
	 * @type {Array<number>}
	 * @private
	 */
	_startSizes = [50, 50];

	/**
	 * Container size
	 * @type {number}
	 * @private
	 */
	_containerSize = 0;

	/**
	 * Bound event handlers
	 * @type {Object}
	 * @private
	 */
	_handlers = {};

	/**
	 * Whether currently in snap animation
	 * @type {boolean}
	 * @private
	 */
	_isSnapping = false;

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
		this.orientation = 'horizontal';
		this.sizes = [50, 50];
		this.minSizes = [0, 0]; // 0 means fully collapsible
		this.collapsible = [true, true]; // All panes collapsible by default
		this.collapsed = [false, false];
		this.gutterSize = 8;
		this.snapOffset = 30;
		this.storageKey = '';

		// Default sizes to restore on uncollapse
		this._defaultSizes = [50, 50];

		// Scrollbar defaults
		this.scrollbar = scrollbarDefaults.scrollbar;
		this.scrollbarStyle = scrollbarDefaults.scrollbarStyle;

		// Track sizes before collapse for restore
		this._sizesBeforeCollapse = [50, 50];

		this._logger = componentLogger.for('TSplitterLit');
		this._logger.debug('Component constructed');

		// Bind methods
		this._handlers.mouseMove = this._handleMouseMove.bind(this);
		this._handlers.mouseUp = this._handleMouseUp.bind(this);
		this._handlers.touchMove = this._handleTouchMove.bind(this);
		this._handlers.touchEnd = this._handleTouchEnd.bind(this);
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');
		this._loadSavedSizes();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
		this._removeGlobalListeners();
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', { changedProperties: [...changedProperties.keys()] });

		if (changedProperties.has('sizes') && this.storageKey) {
			this._saveSizes();
		}
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Set the sizes of the panes
	 * @public
	 * @param {Array<number>} sizes - Array of percentages
	 * @returns {void}
	 * @fires resize
	 */
	setSizes(sizes) {
		this._logger.debug('setSizes called', { sizes });
		this.sizes = sizes;
		this._emitEvent('resize', { sizes: this.sizes });
	}

	/**
	 * Collapse a pane
	 * @public
	 * @param {number} index - Pane index (0 or 1)
	 * @returns {void}
	 * @fires collapse
	 */
	collapse(index) {
		this._logger.debug('collapse called', { index });
		if (!this._canCollapse(index)) return;

		// Save current sizes before collapsing for restore
		this._sizesBeforeCollapse = [...this.sizes];

		const newCollapsed = [...this.collapsed];
		newCollapsed[index] = true;
		this.collapsed = newCollapsed;

		this._emitEvent('collapse', { index, collapsed: true });
	}

	/**
	 * Expand a pane
	 * @public
	 * @param {number} index - Pane index (0 or 1)
	 * @returns {void}
	 * @fires collapse
	 */
	expand(index) {
		this._logger.debug('expand called', { index });

		const newCollapsed = [...this.collapsed];
		newCollapsed[index] = false;
		this.collapsed = newCollapsed;

		// Restore sizes from before collapse if available
		if (this._sizesBeforeCollapse && this._sizesBeforeCollapse[0] > 0 && this._sizesBeforeCollapse[1] > 0) {
			this.sizes = [...this._sizesBeforeCollapse];
		}

		this._emitEvent('collapse', { index, collapsed: false });
	}

	/**
	 * Toggle collapse state of a pane
	 * @public
	 * @param {number} index - Pane index (0 or 1)
	 * @returns {void}
	 * @fires collapse
	 */
	toggleCollapse(index) {
		this._logger.debug('toggleCollapse called', { index });
		if (this.collapsed[index]) {
			this.expand(index);
		} else {
			this.collapse(index);
		}
	}

	/**
	 * Reset to default sizes
	 * @public
	 * @returns {void}
	 * @fires resize
	 */
	reset() {
		this._logger.debug('reset called');
		this.sizes = [50, 50];
		this.collapsed = [false, false];
		this._emitEvent('resize', { sizes: this.sizes });
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

		const splitterClasses = {
			splitter: true,
			vertical: this.orientation === 'vertical',
			dragging: this._isDragging,
		};

		const pane0Classes = {
			pane: true,
			collapsed: this.collapsed[0],
			snapping: this._isSnapping,
		};

		const pane1Classes = {
			pane: true,
			collapsed: this.collapsed[1],
			snapping: this._isSnapping,
		};

		const gutterClasses = {
			gutter: true,
			dragging: this._isDragging,
		};

		return html`
			<div
				class=${classMap(splitterClasses)}
				style="--splitter-gutter-size: ${this.gutterSize}px"
			>
				<div
					class=${classMap(pane0Classes)}
					style="flex: ${this.collapsed[0] ? '0' : this.sizes[0]} 1 0%"
				>
					<slot name="pane-0"></slot>
					${this.collapsed[0] && this._canCollapse(0)
						? this._renderExpandButton(0)
						: ''}
				</div>

				<div
					class=${classMap(gutterClasses)}
					@mousedown=${this._handleMouseDown}
					@touchstart=${this._handleTouchStart}
					@dblclick=${this._handleDoubleClick}
					title="Double-click to collapse/restore, drag to resize or uncollapse"
				>
					<div class="gutter-handle">
						<span class="gutter-handle-dot"></span>
						<span class="gutter-handle-dot"></span>
						<span class="gutter-handle-dot"></span>
					</div>
				</div>

				<div
					class=${classMap(pane1Classes)}
					style="flex: ${this.collapsed[1] ? '0' : this.sizes[1]} 1 0%"
				>
					<slot name="pane-1"></slot>
					${this.collapsed[1] && this._canCollapse(1)
						? this._renderExpandButton(1)
						: ''}
				</div>
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Render an expand button for collapsed panes
	 * @private
	 * @param {number} index - Pane index
	 * @returns {import('lit').TemplateResult}
	 */
	_renderExpandButton(index) {
		const isHorizontal = this.orientation === 'horizontal';

		// Arrow direction pointing toward expansion
		let arrowRotation = 0;
		if (isHorizontal) {
			arrowRotation = index === 0 ? 0 : 180; // Right for pane 0, left for pane 1
		} else {
			arrowRotation = index === 0 ? 90 : 270; // Down for pane 0, up for pane 1
		}

		return html`
			<button
				class="expand-btn"
				@click=${(e) => { e.stopPropagation(); this._restoreToDefault(); }}
				title="Click or drag to expand"
			>
				<svg viewBox="0 0 24 24" style="transform: rotate(${arrowRotation}deg)">
					<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
				</svg>
			</button>
		`;
	}

	/**
	 * Handle double-click on gutter to collapse/expand
	 * Double-click on expanded splitter: collapse the pane nearest to click
	 * Double-click on collapsed splitter: restore to default position
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleDoubleClick(e) {
		e.preventDefault();
		this._logger.debug('Double-click on gutter');

		// If either pane is collapsed, restore to default
		if (this.collapsed[0] || this.collapsed[1]) {
			this._restoreToDefault();
			return;
		}

		// Determine which pane to collapse based on click position
		const gutter = e.currentTarget;
		const rect = gutter.getBoundingClientRect();
		const isHorizontal = this.orientation === 'horizontal';

		// Calculate click position relative to gutter center
		const clickPos = isHorizontal ? e.clientX : e.clientY;
		const gutterStart = isHorizontal ? rect.left : rect.top;
		const gutterSize = isHorizontal ? rect.width : rect.height;
		const gutterCenter = gutterStart + gutterSize / 2;

		// Collapse the pane on the side of the click
		// Click before center = collapse pane 0, click after = collapse pane 1
		const paneToCollapse = clickPos < gutterCenter ? 0 : 1;

		// Check if pane is collapsible (minSize must be 0)
		if (this._canCollapse(paneToCollapse)) {
			this._sizesBeforeCollapse = [...this.sizes];
			this.collapse(paneToCollapse);
		}
	}

	/**
	 * Restore splitter to default position
	 * @private
	 */
	_restoreToDefault() {
		this._logger.debug('Restoring to default position');
		this.collapsed = [false, false];
		this.sizes = [...this._defaultSizes];
		this._emitEvent('resize', { sizes: this.sizes });
		this._emitEvent('collapse', { index: -1, collapsed: false, restored: true });
	}

	/**
	 * Check if a pane can be collapsed (minSize must be 0)
	 * @private
	 * @param {number} index - Pane index
	 * @returns {boolean}
	 */
	_canCollapse(index) {
		// Can collapse if minSize is 0 or collapsible is explicitly true
		return this.minSizes[index] === 0 || this.collapsible[index];
	}

	/**
	 * Handle mouse down on gutter
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleMouseDown(e) {
		e.preventDefault();
		this._startDrag(this.orientation === 'horizontal' ? e.clientX : e.clientY);
		document.addEventListener('mousemove', this._handlers.mouseMove);
		document.addEventListener('mouseup', this._handlers.mouseUp);
	}

	/**
	 * Handle mouse move during drag
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleMouseMove(e) {
		this._updateDrag(this.orientation === 'horizontal' ? e.clientX : e.clientY);
	}

	/**
	 * Handle mouse up
	 * @private
	 */
	_handleMouseUp() {
		this._endDrag();
		document.removeEventListener('mousemove', this._handlers.mouseMove);
		document.removeEventListener('mouseup', this._handlers.mouseUp);
	}

	/**
	 * Handle touch start on gutter
	 * @private
	 * @param {TouchEvent} e
	 */
	_handleTouchStart(e) {
		e.preventDefault();
		const touch = e.touches[0];
		this._startDrag(this.orientation === 'horizontal' ? touch.clientX : touch.clientY);
		document.addEventListener('touchmove', this._handlers.touchMove, { passive: false });
		document.addEventListener('touchend', this._handlers.touchEnd);
	}

	/**
	 * Handle touch move during drag
	 * @private
	 * @param {TouchEvent} e
	 */
	_handleTouchMove(e) {
		e.preventDefault();
		const touch = e.touches[0];
		this._updateDrag(this.orientation === 'horizontal' ? touch.clientX : touch.clientY);
	}

	/**
	 * Handle touch end
	 * @private
	 */
	_handleTouchEnd() {
		this._endDrag();
		document.removeEventListener('touchmove', this._handlers.touchMove);
		document.removeEventListener('touchend', this._handlers.touchEnd);
	}

	/**
	 * Start drag operation
	 * @private
	 * @param {number} pos - Starting position
	 */
	_startDrag(pos) {
		this._isDragging = true;
		this._startPos = pos;
		this._startSizes = [...this.sizes];
		this._startCollapsed = [...this.collapsed];

		const container = this.shadowRoot.querySelector('.splitter');
		this._containerSize = this.orientation === 'horizontal'
			? container.offsetWidth
			: container.offsetHeight;

		this._emitEvent('resize-start', { sizes: this.sizes });
		this.requestUpdate();
	}

	/**
	 * Update sizes during drag
	 * @private
	 * @param {number} pos - Current position
	 */
	_updateDrag(pos) {
		if (!this._isDragging) return;

		const delta = pos - this._startPos;
		const dragThreshold = 20; // pixels needed to trigger uncollapse

		// Handle drag-to-uncollapse - calculate size from mouse position, not from saved values
		if (this._startCollapsed[0] && delta > dragThreshold) {
			// Dragging right/down from collapsed pane 0 - uncollapse and follow mouse
			this._logger.debug('Drag-to-uncollapse: pane 0');
			this.collapsed = [false, false];
			this._startCollapsed = [false, false];

			// Calculate position from container start (gutter was at edge when collapsed)
			const container = this.shadowRoot.querySelector('.splitter');
			const containerRect = container.getBoundingClientRect();
			const containerStart = this.orientation === 'horizontal' ? containerRect.left : containerRect.top;
			const posFromStart = pos - containerStart - (this.gutterSize / 2);
			const newSize0 = Math.max(5, (posFromStart / this._containerSize) * 100);
			const newSize1 = 100 - newSize0;

			this.sizes = [newSize0, newSize1];
			this._startSizes = [...this.sizes];
			this._startPos = pos;
			this._emitEvent('collapse', { index: 0, collapsed: false });
			this._emitEvent('resize', { sizes: this.sizes });
			return;
		}
		if (this._startCollapsed[1] && delta < -dragThreshold) {
			// Dragging left/up from collapsed pane 1 - uncollapse and follow mouse
			this._logger.debug('Drag-to-uncollapse: pane 1');
			this.collapsed = [false, false];
			this._startCollapsed = [false, false];

			// Calculate position from container start (gutter was at far edge when collapsed)
			const container = this.shadowRoot.querySelector('.splitter');
			const containerRect = container.getBoundingClientRect();
			const containerStart = this.orientation === 'horizontal' ? containerRect.left : containerRect.top;
			const posFromStart = pos - containerStart - (this.gutterSize / 2);
			const newSize0 = Math.max(5, (posFromStart / this._containerSize) * 100);
			const newSize1 = 100 - newSize0;

			this.sizes = [newSize0, newSize1];
			this._startSizes = [...this.sizes];
			this._startPos = pos;
			this._emitEvent('collapse', { index: 1, collapsed: false });
			this._emitEvent('resize', { sizes: this.sizes });
			return;
		}

		// Don't allow resize if collapsed
		if (this.collapsed[0] || this.collapsed[1]) return;

		const deltaPercent = (delta / this._containerSize) * 100;
		let newSize0 = this._startSizes[0] + deltaPercent;
		let newSize1 = this._startSizes[1] - deltaPercent;

		// Apply min sizes
		const minPercent0 = (this.minSizes[0] / this._containerSize) * 100;
		const minPercent1 = (this.minSizes[1] / this._containerSize) * 100;

		if (newSize0 < minPercent0) {
			newSize0 = minPercent0;
			newSize1 = 100 - newSize0;
		} else if (newSize1 < minPercent1) {
			newSize1 = minPercent1;
			newSize0 = 100 - newSize1;
		}

		this.sizes = [newSize0, newSize1];
		this._emitEvent('resize', { sizes: this.sizes });
	}

	/**
	 * End drag operation
	 * @private
	 */
	_endDrag() {
		this._isDragging = false;

		// Skip collapse check if already collapsed
		if (this.collapsed[0] || this.collapsed[1]) {
			this._emitEvent('resize-end', { sizes: this.sizes });
			this.requestUpdate();
			return;
		}

		// Check for drag-to-edge collapse with snap animation
		// Using 50px as the snap threshold as requested
		const snapThreshold = 50;
		const snapPercent = (snapThreshold / this._containerSize) * 100;

		// If dragged pane 0 to edge and it can be collapsed
		if (this.sizes[0] <= snapPercent && this._canCollapse(0)) {
			this._logger.debug('Snap-to-edge collapse: pane 0');
			this._sizesBeforeCollapse = [...this._startSizes];
			this._snapCollapse(0);
		}
		// If dragged pane 1 to edge and it can be collapsed
		else if (this.sizes[1] <= snapPercent && this._canCollapse(1)) {
			this._logger.debug('Snap-to-edge collapse: pane 1');
			this._sizesBeforeCollapse = [...this._startSizes];
			this._snapCollapse(1);
		}

		this._emitEvent('resize-end', { sizes: this.sizes });
		this.requestUpdate();
	}

	/**
	 * Collapse a pane with snap animation
	 * @private
	 * @param {number} index - Pane index
	 */
	_snapCollapse(index) {
		// Add snapping class for animation
		this._isSnapping = true;
		this.requestUpdate();

		// Let the class be applied, then collapse
		requestAnimationFrame(() => {
			this.collapse(index);

			// Remove snapping class after animation
			setTimeout(() => {
				this._isSnapping = false;
				this.requestUpdate();
			}, 160);
		});
	}

	/**
	 * Remove global event listeners
	 * @private
	 */
	_removeGlobalListeners() {
		document.removeEventListener('mousemove', this._handlers.mouseMove);
		document.removeEventListener('mouseup', this._handlers.mouseUp);
		document.removeEventListener('touchmove', this._handlers.touchMove);
		document.removeEventListener('touchend', this._handlers.touchEnd);
	}

	/**
	 * Load saved sizes from storage
	 * @private
	 */
	_loadSavedSizes() {
		if (!this.storageKey) return;

		try {
			const saved = localStorage.getItem(`splitter-${this.storageKey}`);
			if (saved) {
				const data = JSON.parse(saved);
				if (data.sizes) this.sizes = data.sizes;
				if (data.collapsed) this.collapsed = data.collapsed;
			}
		} catch (e) {
			this._logger.warn('Failed to load saved sizes', e);
		}
	}

	/**
	 * Save sizes to storage
	 * @private
	 */
	_saveSizes() {
		if (!this.storageKey) return;

		try {
			localStorage.setItem(`splitter-${this.storageKey}`, JSON.stringify({
				sizes: this.sizes,
				collapsed: this.collapsed
			}));
		} catch (e) {
			this._logger.warn('Failed to save sizes', e);
		}
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(tagName)) {
	customElements.define(tagName, TSplitterLit);
}

export default TSplitterLit;
