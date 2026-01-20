/**
 * @fileoverview TGridLit - Dashboard grid layout component
 * @module components/TGridLit
 * @version 1.0.2
 *
 * A CONTAINER profile grid component wrapping gridstack.js for
 * drag-and-drop, resizable dashboard layouts.
 *
 * @example
 * <t-grid columns="12" cell-height="80">
 *   <t-grid-item x="0" y="0" w="4" h="2">Widget 1</t-grid-item>
 *   <t-grid-item x="4" y="0" w="8" h="2">Widget 2</t-grid-item>
 * </t-grid>
 */

import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { pushPinIcon, lockSimpleIcon, lockSimpleOpenIcon, xIcon } from '../utils/phosphor-icons.js';

// ============================================================
// Block 1: Static Metadata
// ============================================================
const tagName = 't-grid';
const version = '1.0.2';
const category = 'Container';

// ============================================================
// Light DOM Style Injection
// ============================================================
// Since TGridLit uses light DOM for GridStack compatibility,
// we must inject styles into the document head
const STYLE_ID = 't-grid-styles';

function injectGridStyles() {
	if (document.getElementById(STYLE_ID)) return;

	const styleSheet = document.createElement('style');
	styleSheet.id = STYLE_ID;
	styleSheet.textContent = `
		/* GridStack base styles (required for functionality) */
		.grid-stack {
			position: relative;
		}

		.grid-stack-placeholder > .placeholder-content {
			background-color: rgba(0, 0, 0, 0.1);
			margin: 0;
			position: absolute;
			width: auto;
			z-index: 0 !important;
		}

		.grid-stack > .grid-stack-item {
			position: absolute;
			padding: 0;
			top: 0;
			left: 0;
			width: var(--gs-column-width);
			height: var(--gs-cell-height);
		}

		.grid-stack > .grid-stack-item > .grid-stack-item-content {
			margin: 0;
			position: absolute;
			width: auto;
			overflow-x: hidden;
			overflow-y: auto;
			scrollbar-width: thin;
			scrollbar-color: rgba(0, 255, 65, 0.45) transparent;
		}

		.grid-stack > .grid-stack-item > .grid-stack-item-content,
		.grid-stack > .grid-stack-placeholder > .placeholder-content {
			top: var(--gs-item-margin-top);
			right: var(--gs-item-margin-right);
			bottom: var(--gs-item-margin-bottom);
			left: var(--gs-item-margin-left);
		}

		.grid-stack-item > .ui-resizable-handle {
			position: absolute;
			font-size: 0.1px;
			display: block;
			-ms-touch-action: none;
			touch-action: none;
		}

		.grid-stack-item.ui-resizable-disabled > .ui-resizable-handle {
			display: none;
		}

		.grid-stack-item.ui-draggable-dragging {
			will-change: left, top;
		}

		.grid-stack-item.ui-resizable-resizing {
			will-change: width, height;
		}

		.ui-draggable-dragging,
		.ui-resizable-resizing {
			z-index: 10000;
		}

		.grid-stack-animate,
		.grid-stack-animate .grid-stack-item {
			transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;
		}

		.grid-stack-animate .grid-stack-item.ui-draggable-dragging,
		.grid-stack-animate .grid-stack-item.ui-resizable-resizing {
			transition: left 0s, top 0s, height 0s, width 0s;
		}

		/* TGridLit - Light DOM Styles */
		t-grid {
			--grid-bg: var(--terminal-black, #0a0a0a);
			--grid-border: var(--terminal-gray-dark, #333);
			--grid-green: var(--terminal-green, #00ff41);
			--grid-placeholder-bg: rgba(0, 255, 65, 0.1);
			--grid-placeholder-border: var(--terminal-green, #00ff41);
			--grid-cell-height: 80px;

			display: block;
			position: relative;
			width: 100%;
			height: 100%;
			background: var(--grid-bg);
		}

		t-grid.grid-stack {
			background: var(--grid-bg);
			min-height: 100%;
		}

		/* Gridstack item styling */
		t-grid > .grid-stack-item > .grid-stack-item-content {
			background: var(--terminal-gray-darkest, #1a1a1a);
			border: 1px solid var(--grid-border);
			border-radius: 4px;
			overflow: hidden;
			display: flex;
			flex-direction: column;
		}

		/* Placeholder during drag */
		t-grid > .grid-stack-placeholder > .placeholder-content {
			background: var(--grid-placeholder-bg);
			border: 2px dashed var(--grid-placeholder-border);
			border-radius: 4px;
		}

		/* Resize handles - completely override GridStack defaults */
		/* Position inside the widget content area visually */
		t-grid > .grid-stack-item > .ui-resizable-se,
		t-grid > .grid-stack-item > .ui-resizable-handle {
			width: 24px !important;
			height: 24px !important;
			/* GridStack margin is ~10px, plus border ~1px, plus padding inside content ~8px */
			right: 18px !important;
			bottom: 18px !important;
			cursor: default !important;
			opacity: 0.4;
			transition: opacity 0.15s ease;
			/* arrowsOut icon - 4 corner arrows (18px = 14px * 1.3) */
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='%2300ff41'%3E%3Cpath d='M216 48v48c0 4.418-3.582 8-8 8-4.419 0-8-3.582-8-8V67.31l-42.34 42.35c-3.126 3.125-8.195 3.125-11.32 0-3.126-3.126-3.126-8.195 0-11.32L188.69 56H160c-4.419 0-8-3.582-8-8 0-4.419 3.581-8 8-8h48c4.418 0 8 3.581 8 8ZM98.34 146.34L56 188.69V160c0-4.419-3.582-8-8-8-4.419 0-8 3.581-8 8v48c0 4.418 3.581 8 8 8h48c4.418 0 8-3.582 8-8 0-4.419-3.582-8-8-8H67.31l42.35-42.34c3.125-3.126 3.125-8.195 0-11.32-3.126-3.126-8.195-3.126-11.32 0ZM208 152c-4.419 0-8 3.581-8 8v28.69l-42.34-42.35c-3.126-3.126-8.195-3.126-11.32-.001-3.126 3.125-3.126 8.194-.001 11.32l42.35 42.34h-28.69c-4.419 0-8 3.581-8 8 0 4.418 3.581 8 8 8h48c4.418 0 8-3.582 8-8v-48c0-4.419-3.582-8-8-8ZM67.31 56H96c4.418 0 8-3.582 8-8 0-4.419-3.582-8-8-8H48c-4.419 0-8 3.581-8 8v48c0 4.418 3.581 8 8 8 4.418 0 8-3.582 8-8V67.31l42.34 42.35c3.125 3.125 8.194 3.125 11.32 0 3.125-3.126 3.125-8.195 0-11.32Z'/%3E%3C/svg%3E") !important;
			background-repeat: no-repeat !important;
			background-position: center center !important;
			background-size: 18px 18px !important;
			background-color: transparent !important;
			border: none !important;
		}

		/* Hide ALL pseudo-elements that GridStack or jQuery UI might inject */
		t-grid > .grid-stack-item > .ui-resizable-se::before,
		t-grid > .grid-stack-item > .ui-resizable-se::after,
		t-grid > .grid-stack-item > .ui-resizable-handle::before,
		t-grid > .grid-stack-item > .ui-resizable-handle::after,
		t-grid > .grid-stack-item > .ui-resizable-se > *,
		t-grid > .grid-stack-item > .ui-resizable-handle > * {
			display: none !important;
			content: none !important;
			visibility: hidden !important;
		}

		/* Reset any text content in resize handles */
		t-grid > .grid-stack-item > .ui-resizable-se,
		t-grid > .grid-stack-item > .ui-resizable-handle {
			font-size: 0 !important;
			text-indent: -9999px !important;
			color: transparent !important;
		}

		t-grid > .grid-stack-item:hover > .ui-resizable-se,
		t-grid > .grid-stack-item:hover > .ui-resizable-handle,
		t-grid > .grid-stack-item.ui-resizable-resizing > .ui-resizable-se {
			opacity: 1;
		}

		/* Grid overlay during drag/resize */
		t-grid .grid-overlay {
			position: absolute;
			inset: 0;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.15s ease;
			z-index: 1000;
		}

		t-grid .grid-overlay.visible {
			opacity: 1;
		}

		t-grid .grid-overlay-cell {
			position: absolute;
			border: 1px dashed rgba(0, 255, 65, 0.2);
			box-sizing: border-box;
		}

		/* Drag state */
		t-grid.grid-stack-dragging .grid-stack-item-content {
			box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
		}

		/* Item hover effect */
		t-grid > .grid-stack-item > .grid-stack-item-content:hover {
			box-shadow: 0 0 0 1px var(--grid-green);
		}

		/* Locked items */
		t-grid > .grid-stack-item.locked > .grid-stack-item-content {
			opacity: 0.7;
		}

		/* Compact mode */
		t-grid[compact] {
			--bs-gutter-x: 8px;
			--bs-gutter-y: 8px;
		}

		/* t-grid-item Light DOM styles */
		t-grid-item {
			display: flex;
			flex-direction: column;
			height: 100%;
		}

		t-grid-item .grid-item-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 8px 12px;
			background: var(--terminal-black, #0a0a0a);
			border-bottom: 1px solid var(--terminal-gray-dark, #333);
			cursor: move;
			user-select: none;
			min-height: 36px;
		}

		t-grid-item .grid-item-title {
			font-size: 11px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			color: var(--terminal-green, #00ff41);
		}

		t-grid-item .grid-item-controls {
			display: flex;
			gap: 8px;
			align-items: center;
		}

		t-grid-item .grid-item-content {
			flex: 1;
			overflow: auto;
			padding: 12px;
			min-height: 0;
			scrollbar-width: thin;
			scrollbar-color: rgba(0, 255, 65, 0.45) transparent;
		}

		/* Scrollbar styling (WebKit) */
		t-grid > .grid-stack-item > .grid-stack-item-content::-webkit-scrollbar,
		t-grid-item .grid-item-content::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}

		t-grid > .grid-stack-item > .grid-stack-item-content::-webkit-scrollbar-track,
		t-grid-item .grid-item-content::-webkit-scrollbar-track {
			background: transparent;
		}

		t-grid > .grid-stack-item > .grid-stack-item-content::-webkit-scrollbar-thumb,
		t-grid-item .grid-item-content::-webkit-scrollbar-thumb {
			background: rgba(0, 255, 65, 0.35);
			border-radius: 6px;
			border: 1px solid rgba(0, 255, 65, 0.15);
		}

		t-grid > .grid-stack-item > .grid-stack-item-content::-webkit-scrollbar-thumb:hover,
		t-grid-item .grid-item-content::-webkit-scrollbar-thumb:hover {
			background: rgba(0, 255, 65, 0.6);
		}

		/* Widget header control buttons */
		.widget-header-controls {
			display: flex;
			gap: 4px;
			align-items: center;
		}

		.widget-control-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			height: 24px;
			padding: 0;
			background: transparent;
			border: none;
			color: var(--terminal-gray, #666);
			cursor: pointer;
			opacity: 0.6;
			transition: opacity 0.15s ease, color 0.15s ease;
		}

		.widget-control-btn:hover {
			opacity: 1;
			color: var(--terminal-green, #00ff41);
		}

		.widget-control-btn.active {
			color: var(--terminal-green, #00ff41);
			opacity: 1;
		}

		.widget-control-btn svg {
			width: 16px;
			height: 16px;
			fill: currentColor;
		}

		.widget-control-btn.remove:hover {
			color: var(--terminal-red, #ff4141);
		}
	`;
	document.head.appendChild(styleSheet);
}

// NOTE: Static styles are NOT used because this component uses light DOM
// (createRenderRoot returns this). All styles are injected via injectGridStyles().

/**
 * TGridLit - Dashboard grid layout component
 *
 * @element t-grid
 * @slot - Grid items (t-grid-item elements)
 *
 * @fires grid-change - Fired when grid layout changes
 * @fires grid-drag-start - Fired when dragging starts
 * @fires grid-drag-stop - Fired when dragging stops
 * @fires grid-resize-start - Fired when resizing starts
 * @fires grid-resize-stop - Fired when resizing stops
 * @fires grid-added - Fired when item is added
 * @fires grid-removed - Fired when item is removed
 *
 * @cssprop [--grid-bg] - Background color
 * @cssprop [--grid-border] - Border color
 * @cssprop [--grid-green] - Accent color
 * @cssprop [--grid-placeholder-bg] - Placeholder background
 * @cssprop [--grid-cell-height] - Cell height
 */
class TGridLit extends LitElement {
	// ============================================================
	// Block 1: Static Metadata (getters)
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
	// Block 2: Static Styles (N/A - light DOM)
	// ============================================================
	// Styles injected via injectGridStyles() since this component uses light DOM

	// ============================================================
	// Block 3: Reactive Properties
	// ============================================================

	static properties = {
		/**
		 * Number of columns
		 * @type {number}
		 * @default 12
		 */
		columns: { type: Number },

		/**
		 * Cell height in pixels or 'auto'
		 * @type {number|string}
		 * @default 80
		 * @attribute cell-height
		 */
		cellHeight: { type: Number, attribute: 'cell-height' },

		/**
		 * Margin between items in pixels
		 * @type {number}
		 * @default 10
		 */
		margin: { type: Number },

		/**
		 * Enable drag and drop
		 * @type {boolean}
		 * @default true
		 */
		draggable: { type: Boolean },

		/**
		 * Enable resizing
		 * @type {boolean}
		 * @default true
		 */
		resizable: { type: Boolean },

		/**
		 * Show grid overlay on drag/resize
		 * @type {boolean}
		 * @default true
		 * @attribute show-overlay
		 */
		showOverlay: { type: Boolean, attribute: 'show-overlay' },

		/**
		 * Animate transitions
		 * @type {boolean}
		 * @default true
		 */
		animate: { type: Boolean },

		/**
		 * Compact mode (smaller margins)
		 * @type {boolean}
		 * @default false
		 */
		compact: { type: Boolean, reflect: true },

		/**
		 * Float mode (items don't move up)
		 * @type {boolean}
		 * @default false
		 */
		float: { type: Boolean },

		/**
		 * Storage key for persisting layout
		 * @type {string}
		 * @default ''
		 * @attribute storage-key
		 */
		storageKey: { type: String, attribute: 'storage-key' },

		/**
		 * Minimum width for items
		 * @type {number}
		 * @default 1
		 * @attribute min-width
		 */
		minWidth: { type: Number, attribute: 'min-width' },

		/**
		 * Minimum height for items
		 * @type {number}
		 * @default 1
		 * @attribute min-height
		 */
		minHeight: { type: Number, attribute: 'min-height' },

		/**
		 * Lock grid dimensions to initial size
		 * @type {boolean}
		 * @default true
		 * @attribute lock-size
		 */
		lockSize: { type: Boolean, attribute: 'lock-size', reflect: true }
	};

	// ============================================================
	// Block 4: Internal State
	// ============================================================

	/**
	 * Gridstack instance
	 * @type {GridStack|null}
	 * @private
	 */
	_grid = null;

	/**
	 * Grid overlay visible state
	 * @type {boolean}
	 * @private
	 */
	_overlayVisible = false;

	/**
	 * Initialization complete
	 * @type {boolean}
	 * @private
	 */
	_initialized = false;

	/**
	 * Mutation observer for dynamic items
	 * @type {MutationObserver|null}
	 * @private
	 */
	_mutationObserver = null;

	/**
	 * Resize observer for responsive layout
	 * @type {ResizeObserver|null}
	 * @private
	 */
	_resizeObserver = null;

	/**
	 * Resize observer for lock-size initialization
	 * @type {ResizeObserver|null}
	 * @private
	 */
	_lockObserver = null;

	/**
	 * Cached fixed cell width for locked sizing
	 * @type {number|null}
	 * @private
	 */
	_lockedCellWidth = null;

	// ============================================================
	// Block 5: Logger Instance
	// ============================================================

	/**
	 * Component logger instance
	 * @type {Object|null}
	 * @private
	 */
	_logger = null;

	// ============================================================
	// Block 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Inject light DOM styles into document head (once)
		injectGridStyles();

		// Default values
		this.columns = 12;
		this.cellHeight = 80;
		this.margin = 10;
		this.draggable = true;
		this.resizable = true;
		this.showOverlay = true;
		this.animate = true;
		this.compact = false;
		this.float = false;
		this.storageKey = '';
		this.minWidth = 2;
		this.minHeight = 1;
		this.lockSize = true;

		this._logger = componentLogger.for('TGridLit');
		this._logger.debug('Component constructed');
	}

	/**
	 * Use light DOM for GridStack compatibility
	 * GridStack manipulates DOM directly and needs real DOM elements
	 */
	createRenderRoot() {
		return this;
	}

	// ============================================================
	// Block 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');

		if (!this.lockSize) {
			this._setupResponsiveObserver();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
		this._clearResponsiveObserver();
		this._clearLockObserver();
		this._destroyGrid();
	}

	firstUpdated() {
		this._logger.debug('First update complete');
		this._initGrid();
		this._loadLayout();
		requestAnimationFrame(() => this._applyFixedWidth());
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Array.from(changedProperties.keys()));

		if (this._grid) {
			if (changedProperties.has('columns')) {
				this._grid.column(this.columns);
				this._lockedCellWidth = null;
			}
			if (changedProperties.has('cellHeight')) {
				this._grid.cellHeight(this.cellHeight);
				this._refreshOverlayCells();
			}
			if (changedProperties.has('margin')) {
				this._grid.margin(this.margin);
			}
			if (changedProperties.has('draggable')) {
				this._grid.enableMove(this.draggable);
			}
			if (changedProperties.has('resizable')) {
				this._grid.enableResize(this.resizable);
			}
			if (changedProperties.has('float')) {
				this._grid.float(this.float);
			}
		}

		// Update overlay when showOverlay changes
		if (changedProperties.has('showOverlay')) {
			this._updateOverlay();
		}

		if (changedProperties.has('columns') || changedProperties.has('margin') || changedProperties.has('cellHeight')) {
			this._applyGridVars();
		}

		if (this.lockSize && (changedProperties.has('columns') || changedProperties.has('margin'))) {
			this._applyFixedWidth();
		}

		if (changedProperties.has('lockSize')) {
			if (this.lockSize) {
				this._clearResponsiveObserver();
				this._clearLockObserver();
				this._applyFixedWidth();
			} else {
				this._clearLockObserver();
				this._clearFixedWidth();
				this._setupResponsiveObserver();
			}
		}
	}

	// ============================================================
	// Block 8: Public API Methods
	// ============================================================

	/**
	 * Add a widget to the grid
	 * @public
	 * @param {Object} options - Widget options
	 * @param {number} options.x - X position
	 * @param {number} options.y - Y position
	 * @param {number} options.w - Width
	 * @param {number} options.h - Height
	 * @param {string} options.id - Widget ID
	 * @param {HTMLElement|string} options.content - Content element or HTML
	 * @returns {HTMLElement} The added widget element
	 */
	addWidget(options) {
		this._logger.debug('addWidget called', options);
		if (!this._grid) return null;

		const widget = this._grid.addWidget({
			x: options.x ?? 0,
			y: options.y ?? 0,
			w: options.w ?? 2,
			h: options.h ?? 2,
			id: options.id,
			minW: options.minW ?? this.minWidth,
			minH: options.minH ?? this.minHeight,
			content: options.content || ''
		});

		return widget;
	}

	/**
	 * Remove a widget from the grid
	 * @public
	 * @param {HTMLElement|string} el - Widget element or selector
	 * @param {boolean} removeDOM - Whether to remove from DOM
	 */
	removeWidget(el, removeDOM = true) {
		this._logger.debug('removeWidget called', { el, removeDOM });
		if (!this._grid) return;

		const element = typeof el === 'string'
			? this.querySelector(el)
			: el;

		if (element) {
			this._grid.removeWidget(element, removeDOM);
		}
	}

	/**
	 * Update a widget's position/size
	 * @public
	 * @param {HTMLElement} el - Widget element
	 * @param {Object} options - New options
	 */
	updateWidget(el, options) {
		this._logger.debug('updateWidget called', options);
		if (!this._grid) return;
		this._grid.update(el, options);
	}

	/**
	 * Get current layout data
	 * @public
	 * @returns {Array} Layout data
	 */
	getLayout() {
		this._logger.debug('getLayout called');
		if (!this._grid) return [];
		return this._grid.save(false);
	}

	/**
	 * Load a layout
	 * @public
	 * @param {Array} layout - Layout data
	 */
	loadLayout(layout) {
		this._logger.debug('loadLayout called', { itemCount: layout.length });
		if (!this._grid) return;
		this._grid.load(layout);
		this._saveLayout();
	}

	/**
	 * Compact the grid
	 * @public
	 */
	compactGrid() {
		this._logger.debug('compactGrid called');
		if (!this._grid) return;
		this._grid.compact();
	}

	/**
	 * Enable/disable the grid
	 * @public
	 * @param {boolean} enable - Enable state
	 */
	enable(enable = true) {
		this._logger.debug('enable called', { enable });
		if (!this._grid) return;
		if (enable) {
			this._grid.enable();
		} else {
			this._grid.disable();
		}
	}

	/**
	 * Reset to default layout
	 * @public
	 */
	reset() {
		this._logger.debug('reset called');
		if (this.storageKey) {
			localStorage.removeItem(this.storageKey);
		}
		this._initGrid();
	}

	/**
	 * Set static mode - locks all widgets from being moved or resized
	 * @public
	 * @param {boolean} staticMode - Whether to enable static mode
	 */
	setStatic(staticMode = true) {
		this._logger.debug('setStatic called', { staticMode });
		if (!this._grid) return;
		this._grid.setStatic(staticMode);
	}

	// ============================================================
	// Block 9: Event Emitters
	// ============================================================

	/**
	 * Emit custom event
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
	// Block 10: Nesting Support
	// ============================================================

	/**
	 * Register a nested grid item
	 * @private
	 */
	_registerNestedComponent(component) {
		this._logger.debug('Registering nested component', { id: component.itemId });
	}

	// ============================================================
	// Block 11: Validation (N/A for this component)
	// ============================================================

	// ============================================================
	// Block 12: Render Method
	// ============================================================

	render() {
		this._logger.trace('Rendering');
		// In light DOM mode, render() doesn't work - overlay is managed imperatively
		return html``;
	}

	/**
	 * Update overlay visibility (for light DOM)
	 * @private
	 */
	_updateOverlay() {
		if (!this.showOverlay) {
			// Remove overlay if it exists
			const existing = this.querySelector(':scope > .grid-overlay');
			if (existing) existing.remove();
			return;
		}

		// Create or get overlay
		let overlay = this.querySelector(':scope > .grid-overlay');
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.className = 'grid-overlay';
			this._populateOverlayCells(overlay);
			this.appendChild(overlay);
		}

		// Toggle visibility
		overlay.classList.toggle('visible', this._overlayVisible);
	}

	/**
	 * Populate overlay with grid cells
	 * @private
	 */
	_populateOverlayCells(overlay) {
		// Calculate rows based on container height or max item position
		const containerHeight = this.clientHeight || 600;
		let maxRow = Math.ceil(containerHeight / this.cellHeight);

		// Also check max item position
		if (this._grid) {
			const items = this._grid.getGridItems();
			items.forEach(item => {
				const node = item.gridstackNode;
				if (node) {
					const itemBottom = node.y + node.h;
					if (itemBottom > maxRow) {
						maxRow = itemBottom;
					}
				}
			});
		}

		// Add extra rows for drag targets
		const rows = Math.max(maxRow + 3, 10);
		overlay.innerHTML = '';

		// Set overlay height explicitly
		overlay.style.height = `calc(${rows} * var(--gs-cell-height))`;

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				const cell = document.createElement('div');
				cell.className = 'grid-overlay-cell';
				cell.style.cssText = `left: calc(${x} * var(--gs-column-width)); top: calc(${y} * var(--gs-cell-height)); width: var(--gs-column-width); height: var(--gs-cell-height);`;
				overlay.appendChild(cell);
			}
		}
	}

	/**
	 * Refresh overlay cells to match current grid state
	 * @private
	 */
	_refreshOverlayCells() {
		if (!this.showOverlay) return;
		const overlay = this.querySelector(':scope > .grid-overlay');
		if (overlay) {
			this._populateOverlayCells(overlay);
		}
	}

	_setupResponsiveObserver() {
		if (typeof ResizeObserver === 'undefined' || this._resizeObserver) return;
		this._resizeObserver = new ResizeObserver(() => {
			if (!this._grid) return;
			this._applyGridVars();
			this._grid.onResize();
			if (this._overlayVisible) {
				this._refreshOverlayCells();
			}
		});
		this._resizeObserver.observe(this);
	}

	_clearResponsiveObserver() {
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
	}

	_setupLockObserver() {
		if (typeof ResizeObserver === 'undefined' || this._lockObserver) return;
		this._lockObserver = new ResizeObserver(() => {
			if (!this.lockSize) return;
			const rect = this.getBoundingClientRect();
			if (!rect.width) return;
			this._applyFixedWidth();
			this._clearLockObserver();
		});
		this._lockObserver.observe(this);
	}

	_clearLockObserver() {
		if (this._lockObserver) {
			this._lockObserver.disconnect();
			this._lockObserver = null;
		}
	}

	_applyFixedWidth() {
		if (!this.lockSize) return;
		const rect = this.getBoundingClientRect();
		if (!rect.width) {
			this._setupLockObserver();
			return;
		}

		if (!this._lockedCellWidth) {
			const innerWidth = rect.width - (this.columns - 1) * this.margin;
			this._lockedCellWidth = innerWidth / this.columns;
		}

		const width = (this.columns * this._lockedCellWidth) + (this.columns - 1) * this.margin;
		this.style.width = `${width}px`;
		this.style.minWidth = `${width}px`;
		this.style.maxWidth = `${width}px`;

		this._applyGridVars();
		if (this._grid) {
			this._grid.onResize();
		}
		this._refreshOverlayCells();
	}

	_applyGridVars() {
		const rect = this.getBoundingClientRect();
		if (!rect.width) return false;
		let columnWidth = rect.width / this.columns;
		if (this._grid && typeof this._grid.cellWidth === 'function') {
			const gridWidth = this._grid.cellWidth();
			if (Number.isFinite(gridWidth) && gridWidth > 0) {
				columnWidth = gridWidth;
			}
		}
		this.style.setProperty('--gs-column-width', `${columnWidth}px`);
		this.style.setProperty('--gs-cell-height', `${this.cellHeight}px`);
		const margin = `${this.margin}px`;
		this.style.setProperty('--gs-item-margin-top', margin);
		this.style.setProperty('--gs-item-margin-right', margin);
		this.style.setProperty('--gs-item-margin-bottom', margin);
		this.style.setProperty('--gs-item-margin-left', margin);
		return true;
	}

	_clearFixedWidth() {
		this.style.width = '';
		this.style.minWidth = '';
		this.style.maxWidth = '';
		this._lockedCellWidth = null;
	}

	// ============================================================
	// Block 13: Private Helpers
	// ============================================================

	/**
	 * Initialize gridstack
	 * @private
	 */
	_initGrid() {
		this._logger.debug('Initializing grid');

		// In light DOM mode, the component itself is the grid container
		// Add the grid-stack class to self
		this.classList.add('grid-stack');

		// Destroy existing grid
		this._destroyGrid();

		// Initialize gridstack (loaded via CDN, access from window)
		const GridStack = window.GridStack;
		if (!GridStack) {
			this._logger.error('GridStack not loaded. Include gridstack CDN script before using t-grid.');
			return;
		}
		this._grid = GridStack.init({
			column: this.columns,
			cellHeight: this.cellHeight,
			margin: this.margin,
			float: this.float,
			animate: this.animate,
			draggable: {
				handle: '.widget-header, .grid-item-header, [data-drag-handle]',
				cancel: '.grid-item-controls, .widget-header-controls, .widget-control-btn, button'
			},
			resizable: {
				handles: 'se'
			},
			minRow: 1,
			disableOneColumnMode: true
		}, this);

		// Set up event listeners
		this._setupGridEvents();

		// Process child items
		this._processChildItems();

		// Set up mutation observer for dynamically added items
		this._setupMutationObserver();

		// Create overlay if enabled
		this._updateOverlay();

		this._initialized = true;
	}

	/**
	 * Set up mutation observer for dynamically added items
	 * @private
	 */
	_setupMutationObserver() {
		if (this._mutationObserver) {
			this._mutationObserver.disconnect();
		}

		this._mutationObserver = new MutationObserver((mutations) => {
			const newItems = [];
			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(node => {
					if (node.nodeType === 1 && node.tagName === 'T-GRID-ITEM') {
						newItems.push(node);
					}
				});
			});

			if (newItems.length > 0) {
				this._logger.debug('New grid items detected', { count: newItems.length });
				// Wait for items to initialize and wrap their content
				// Use requestAnimationFrame + setTimeout to ensure children are fully attached
				requestAnimationFrame(() => {
					setTimeout(() => {
						this._processChildItems();
					}, 50);
				});
			}
		});

		this._mutationObserver.observe(this, { childList: true });
	}

	/**
	 * Destroy gridstack instance
	 * @private
	 */
	_destroyGrid() {
		if (this._mutationObserver) {
			this._mutationObserver.disconnect();
			this._mutationObserver = null;
		}
		if (this._grid) {
			this._grid.destroy(false);
			this._grid = null;
		}
	}

	/**
	 * Set up grid event listeners
	 * @private
	 */
	_setupGridEvents() {
		if (!this._grid) return;

		this._grid.on('change', (event, items) => {
			this._logger.debug('Grid changed', { itemCount: items?.length });
			this._saveLayout();
			this._refreshOverlayCells();
			this._emitEvent('grid-change', { items: items || [] });
		});

		this._grid.on('dragstart', (event, el) => {
			this._logger.debug('Drag started');
			this._overlayVisible = true;
			this._updateOverlay();
			this._emitEvent('grid-drag-start', { element: el });
		});

		this._grid.on('dragstop', (event, el) => {
			this._logger.debug('Drag stopped');
			this._overlayVisible = false;
			this._updateOverlay();
			this._emitEvent('grid-drag-stop', { element: el });
		});

		this._grid.on('resizestart', (event, el) => {
			this._logger.debug('Resize started');
			this._overlayVisible = true;
			this._updateOverlay();
			this._emitEvent('grid-resize-start', { element: el });
		});

		this._grid.on('resizestop', (event, el) => {
			this._logger.debug('Resize stopped');
			this._overlayVisible = false;
			this._updateOverlay();
			this._emitEvent('grid-resize-stop', { element: el });
		});

		this._grid.on('added', (event, items) => {
			this._logger.debug('Items added', { count: items?.length });
			this._emitEvent('grid-added', { items: items || [] });
		});

		this._grid.on('removed', (event, items) => {
			this._logger.debug('Items removed', { count: items?.length });
			this._emitEvent('grid-removed', { items: items || [] });
		});
	}

	/**
	 * Process child t-grid-item elements
	 * @private
	 */
	_processChildItems() {
		if (!this._grid) return;

		const items = Array.from(this.querySelectorAll(':scope > t-grid-item'));
		this._logger.debug('Processing child items', { count: items.length });

		items.forEach(item => {
			// Check if already processed by GridStack (has gridstackNode)
			if (item.gridstackNode) return;

			// Ensure the item has wrapped its content before GridStack processes it
			if (typeof item._wrapContent === 'function') {
				item._wrapContent();
			}

			// Ensure item has grid-stack-item class
			item.classList.add('grid-stack-item');

			// Add to grid using makeWidget - this enables resize/drag
			this._grid.makeWidget(item);

			// Re-enable resize if no-resize not set (makeWidget should do this but ensure it)
			const noResize = item.hasAttribute('gs-no-resize');
			if (!noResize && item.gridstackNode) {
				this._grid.resizable(item, true);
			}

			// Re-enable move if no-move not set
			const noMove = item.hasAttribute('gs-no-move');
			if (!noMove && item.gridstackNode) {
				this._grid.movable(item, true);
			}
		});
	}

	/**
	 * Save layout to storage
	 * @private
	 */
	_saveLayout() {
		if (!this.storageKey || !this._grid) return;

		try {
			const layout = this._grid.save(false);
			localStorage.setItem(this.storageKey, JSON.stringify(layout));
			this._logger.debug('Layout saved', { key: this.storageKey });
		} catch (e) {
			this._logger.warn('Failed to save layout', e);
		}
	}

	/**
	 * Load layout from storage
	 * Note: This only repositions existing items - it does NOT create new items.
	 * If you need to recreate items from saved data, use the public loadLayout() method
	 * with your own item recreation logic.
	 * @private
	 */
	_loadLayout() {
		if (!this.storageKey || !this._grid) return;

		try {
			const saved = localStorage.getItem(this.storageKey);
			if (saved) {
				const layout = JSON.parse(saved);
				// Only apply layout to existing items, don't create new ones
				// This prevents blank boxes when layout has more items than DOM
				const existingItems = this.querySelectorAll(':scope > t-grid-item');
				if (existingItems.length > 0) {
					// Match items by id and update positions
					layout.forEach(savedItem => {
						const existingItem = Array.from(existingItems).find(
							el => el.getAttribute('item-id') === savedItem.id
						);
						if (existingItem) {
							this._grid.update(existingItem, {
								x: savedItem.x,
								y: savedItem.y,
								w: savedItem.w,
								h: savedItem.h
							});
						}
					});
					this._logger.debug('Layout applied to existing items', { key: this.storageKey });
				}
			}
		} catch (e) {
			this._logger.warn('Failed to load layout', e);
		}
	}
}

// ============================================================
// TGridItemLit - Grid item component
// ============================================================

/**
 * TGridItemLit - Individual grid item
 *
 * @element t-grid-item
 * @slot - Item content
 * @slot header - Item header (drag handle)
 */
class TGridItemLit extends LitElement {
	static get tagName() {
		return 't-grid-item';
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			height: 100%;
		}

		.grid-item-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 8px 12px;
			background: var(--terminal-black, #0a0a0a);
			border-bottom: 1px solid var(--terminal-gray-dark, #333);
			cursor: move;
			user-select: none;
			min-height: 36px;
		}

		.grid-item-title {
			font-size: 11px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			color: var(--terminal-green, #00ff41);
		}

		.grid-item-controls {
			display: flex;
			gap: 8px;
			align-items: center;
		}

		.grid-item-content {
			flex: 1;
			overflow: auto;
			padding: 12px;
			min-height: 0;
		}

		::slotted([slot="header"]) {
			display: flex;
			align-items: center;
			gap: 8px;
		}
	`;

	static properties = {
		/**
		 * Item ID
		 * @type {string}
		 * @attribute item-id
		 */
		itemId: { type: String, attribute: 'item-id', reflect: true },

		/**
		 * Item title (displayed in header)
		 * @type {string}
		 * @attribute widget-title
		 */
		title: { type: String, attribute: 'widget-title' },

		/**
		 * X position (column)
		 * @type {number}
		 * @attribute gs-x
		 */
		x: { type: Number, attribute: 'gs-x', reflect: true },

		/**
		 * Y position (row)
		 * @type {number}
		 * @attribute gs-y
		 */
		y: { type: Number, attribute: 'gs-y', reflect: true },

		/**
		 * Width in columns
		 * @type {number}
		 * @attribute gs-w
		 */
		w: { type: Number, attribute: 'gs-w', reflect: true },

		/**
		 * Height in rows
		 * @type {number}
		 * @attribute gs-h
		 */
		h: { type: Number, attribute: 'gs-h', reflect: true },

		/**
		 * Minimum width
		 * @type {number}
		 * @attribute gs-min-w
		 */
		minW: { type: Number, attribute: 'gs-min-w', reflect: true },

		/**
		 * Minimum height
		 * @type {number}
		 * @attribute gs-min-h
		 */
		minH: { type: Number, attribute: 'gs-min-h', reflect: true },

		/**
		 * Maximum width
		 * @type {number}
		 * @attribute gs-max-w
		 */
		maxW: { type: Number, attribute: 'gs-max-w', reflect: true },

		/**
		 * Maximum height
		 * @type {number}
		 * @attribute gs-max-h
		 */
		maxH: { type: Number, attribute: 'gs-max-h', reflect: true },

		/**
		 * Lock item (no drag/resize)
		 * @type {boolean}
		 * @attribute gs-locked
		 */
		locked: { type: Boolean, attribute: 'gs-locked', reflect: true },

		/**
		 * Disable move
		 * @type {boolean}
		 * @attribute gs-no-move
		 */
		noMove: { type: Boolean, attribute: 'gs-no-move', reflect: true },

		/**
		 * Disable resize
		 * @type {boolean}
		 * @attribute gs-no-resize
		 */
		noResize: { type: Boolean, attribute: 'gs-no-resize', reflect: true }
	};

	_logger = null;

	/**
	 * Whether content has been wrapped
	 * @type {boolean}
	 * @private
	 */
	_wrapped = false;

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.w = 2;
		this.h = 2;
		this.minW = 2;
		this.minH = 1;
		this.locked = false;
		this.noMove = false;
		this.noResize = false;

		this._logger = componentLogger.for('TGridItemLit');
	}

	/**
	 * Use light DOM for GridStack compatibility
	 */
	createRenderRoot() {
		return this;
	}

	updated(changedProperties) {
		// Sync attributes when properties change
		if (changedProperties.has('x') || changedProperties.has('y') ||
			changedProperties.has('w') || changedProperties.has('h')) {
			this._syncGridAttributes();
		}
	}

	_syncGridAttributes() {
		// These attributes are read by gridstack
		if (this.x !== undefined) this.setAttribute('gs-x', String(this.x));
		if (this.y !== undefined) this.setAttribute('gs-y', String(this.y));
		if (this.w !== undefined) this.setAttribute('gs-w', String(this.w));
		if (this.h !== undefined) this.setAttribute('gs-h', String(this.h));
		if (this.minW !== undefined) this.setAttribute('gs-min-w', String(this.minW));
		if (this.minH !== undefined) this.setAttribute('gs-min-h', String(this.minH));
		if (this.maxW !== undefined) this.setAttribute('gs-max-w', String(this.maxW));
		if (this.maxH !== undefined) this.setAttribute('gs-max-h', String(this.maxH));
		if (this.locked) this.setAttribute('gs-locked', '');
		if (this.noMove) this.setAttribute('gs-no-move', '');
		if (this.noResize) this.setAttribute('gs-no-resize', '');
	}

	render() {
		// In light DOM mode, we wrap existing children in the grid-stack-item-content structure
		// First render creates the wrapper, subsequent renders preserve content
		return html``;
	}

	connectedCallback() {
		super.connectedCallback();

		// Add gridstack classes
		this.classList.add('grid-stack-item');

		// Set gridstack attributes
		this._syncGridAttributes();

		// We'll wrap content when requested by the grid, or after a frame
		// to ensure children are attached
		requestAnimationFrame(() => {
			// Only wrap if grid hasn't already done it
			if (!this._wrapped) {
				this._wrapContent();
			}
		});
	}

	firstUpdated() {
		// Backup wrap in firstUpdated
		if (!this._wrapped) {
			this._wrapContent();
		}
	}

	/**
	 * Wrap existing content in grid-stack-item-content structure
	 * This must run BEFORE GridStack processes the item
	 * @public - Called by TGridLit before makeWidget
	 */
	_wrapContent() {
		// Check if already wrapped
		if (this._wrapped) return;
		if (this.querySelector(':scope > .grid-stack-item-content')) {
			this._wrapped = true;
			return;
		}

		// Get existing children (before we modify)
		const children = Array.from(this.childNodes);

		// If no children yet, create minimal wrapper
		if (children.length === 0) {
			const wrapper = document.createElement('div');
			wrapper.className = 'grid-stack-item-content';

			// Still try to create header from attribute
			const title = this.title || this.getAttribute('widget-title');
			if (title) {
				const header = this._createHeader(title, []);
				wrapper.appendChild(header);
			}

			const content = document.createElement('div');
			content.className = 'grid-item-content';
			wrapper.appendChild(content);
			this.appendChild(wrapper);
			this._wrapped = true;
			return;
		}

		// Create wrapper structure
		const wrapper = document.createElement('div');
		wrapper.className = 'grid-stack-item-content';

		// Get title - use property or fall back to attribute (Lit may not have synced yet)
		const title = this.title || this.getAttribute('widget-title');

		// Collect slot="controls" elements
		const controlElements = [];
		children.forEach(child => {
			if (child.nodeType === 1 && (child.getAttribute?.('slot') === 'controls' || child.slot === 'controls')) {
				controlElements.push(child);
			}
		});

		// Create header if title is set
		if (title) {
			const header = this._createHeader(title, controlElements);
			wrapper.appendChild(header);
		}

		// Create content area
		const content = document.createElement('div');
		content.className = 'grid-item-content';

		// Move remaining children to content
		children.forEach(child => {
			// Skip controls (already moved to header)
			if (child.nodeType === 1 && (child.getAttribute?.('slot') === 'controls' || child.slot === 'controls')) return;
			// Custom header slot - insert before content
			if (child.nodeType === 1 && (child.getAttribute?.('slot') === 'header' || child.slot === 'header')) {
				wrapper.insertBefore(child, content);
			} else if (child !== wrapper) {
				content.appendChild(child);
			}
		});

		wrapper.appendChild(content);
		this.appendChild(wrapper);
		this._wrapped = true;
	}

	/**
	 * Create header element with icon buttons
	 * @private
	 */
	_createHeader(title, controlElements) {
		const header = document.createElement('div');
		header.className = 'grid-item-header';
		header.setAttribute('data-drag-handle', '');

		const titleSpan = document.createElement('span');
		titleSpan.className = 'grid-item-title';
		titleSpan.textContent = title;

		const controls = document.createElement('div');
		controls.className = 'grid-item-controls widget-header-controls';

		// Move any user-provided control elements first
		controlElements.forEach(child => {
			controls.appendChild(child);
		});

		// Create lock-move button (pushpin icon)
		const lockMoveBtn = this._createControlButton('lock-move', pushPinIcon, 'Toggle move lock');
		if (this.noMove) lockMoveBtn.classList.add('active');
		lockMoveBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this._toggleMoveLock(lockMoveBtn);
		});
		controls.appendChild(lockMoveBtn);

		// Create lock-resize button (lock icon) - show locked icon if noResize is set
		const resizeIcon = this.noResize ? lockSimpleIcon : lockSimpleOpenIcon;
		const lockResizeBtn = this._createControlButton('lock-resize', resizeIcon, 'Toggle resize lock');
		if (this.noResize) lockResizeBtn.classList.add('active');
		lockResizeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this._toggleResizeLock(lockResizeBtn);
		});
		controls.appendChild(lockResizeBtn);

		// Create remove button (x icon)
		const removeBtn = this._createControlButton('remove', xIcon, 'Remove widget');
		removeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this._removeWidget();
		});
		controls.appendChild(removeBtn);

		header.appendChild(titleSpan);
		header.appendChild(controls);
		return header;
	}

	/**
	 * Create a control button with icon
	 * @private
	 */
	_createControlButton(action, iconSvg, title) {
		const btn = document.createElement('button');
		btn.className = `widget-control-btn ${action}`;
		btn.setAttribute('data-action', action);
		btn.setAttribute('title', title);
		btn.innerHTML = iconSvg;
		return btn;
	}

	/**
	 * Toggle move lock state
	 * @private
	 */
	_toggleMoveLock(btn) {
		this.noMove = !this.noMove;
		btn.classList.toggle('active', this.noMove);

		// Find parent grid and update GridStack
		const grid = this.closest('t-grid');
		if (grid && grid._grid) {
			grid._grid.movable(this, !this.noMove);
		}

		this.dispatchEvent(new CustomEvent('widget-lock-move', {
			detail: { locked: this.noMove },
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Toggle resize lock state
	 * @private
	 */
	_toggleResizeLock(btn) {
		this.noResize = !this.noResize;
		btn.classList.toggle('active', this.noResize);

		// Update icon based on state
		btn.innerHTML = this.noResize ? lockSimpleIcon : lockSimpleOpenIcon;

		// Find parent grid and update GridStack
		const grid = this.closest('t-grid');
		if (grid && grid._grid) {
			grid._grid.resizable(this, !this.noResize);
		}

		this.dispatchEvent(new CustomEvent('widget-lock-resize', {
			detail: { locked: this.noResize },
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Remove widget from grid
	 * @private
	 */
	_removeWidget() {
		const grid = this.closest('t-grid');
		if (grid) {
			this.dispatchEvent(new CustomEvent('widget-remove', {
				detail: { id: this.itemId },
				bubbles: true,
				composed: true
			}));
			grid.removeWidget(this);
		}
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TGridLit.tagName)) {
	customElements.define(TGridLit.tagName, TGridLit);
}

if (!customElements.get(TGridItemLit.tagName)) {
	customElements.define(TGridItemLit.tagName, TGridItemLit);
}

export { TGridLit, TGridItemLit };
export default TGridLit;
