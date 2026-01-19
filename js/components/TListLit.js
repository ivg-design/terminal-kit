/**
 * @fileoverview TListLit - Virtualized scrollable list component
 * @module components/TListLit
 * @version 3.0.0
 *
 * A FULL profile list component with virtual scrolling for large datasets,
 * selection modes, grouping, and drag-and-drop reordering.
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { scrollbarStyles, scrollbarProperties, scrollbarDefaults } from '../utils/scrollbar-styles.js';
import { trayArrowDownIcon } from '../utils/phosphor-icons.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================

/**
 * @component TListLit
 * @tagname t-list
 * @description Virtualized scrollable list component with selection and grouping.
 * @category Container
 * @since 3.0.0
 *
 * @element t-list
 *
 * @fires item-click - Fired when an item is clicked
 * @fires selection-change - Fired when selection changes
 * @fires load-more - Fired when scrolling near bottom (infinite scroll)
 * @fires reorder - Fired when items are reordered via drag-and-drop
 *
 * @slot item - Custom item template (receives item data)
 * @slot empty - Content to show when list is empty
 * @slot loading - Custom loading indicator
 *
 * @csspart list - The list container
 * @csspart item - Individual list item
 * @csspart item-selected - Selected list item
 * @csspart divider - Item divider
 * @csspart group-header - Group header
 * @csspart empty - Empty state container
 * @csspart loading - Loading indicator
 */
class TListLit extends LitElement {
	/** @static @readonly */
	static tagName = 't-list';

	/** @static @readonly */
	static version = '3.0.0';

	/** @static @readonly */
	static category = 'Container';

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = [
		scrollbarStyles,
		css`
		:host {
			display: flex;
			flex-direction: column;
			position: relative;
			overflow: hidden;
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			background: var(--t-list-bg, var(--terminal-gray-darkest, #1a1a1a));
			border: 1px solid var(--t-list-border, var(--terminal-gray-dark, #333));
			color: var(--t-list-color, var(--terminal-green, #00ff41));
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}

		.list-viewport {
			flex: 1;
			min-height: 0;
			overflow-y: auto;
			overflow-x: hidden;
		}

		.list-content {
			position: relative;
		}

		.list-item {
			display: flex;
			align-items: center;
			padding: 12px 16px;
			cursor: pointer;
			transition: all 0.15s ease;
			border-bottom: 1px solid transparent;
			user-select: none;
		}

		.list-item:hover {
			background: var(--t-list-item-hover, rgba(0, 255, 65, 0.1));
		}

		.list-item.selected {
			background: var(--t-list-item-selected, rgba(0, 255, 65, 0.2));
			border-left: 3px solid var(--terminal-green, #00ff41);
		}

		.list-item.focused {
			outline: 1px solid var(--terminal-green, #00ff41);
			outline-offset: -1px;
		}

		.list-item.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		.list-item.dragging {
			opacity: 0.5;
			background: var(--terminal-gray-dark, #333);
		}

		.list-item.drag-over {
			border-top: 2px solid var(--terminal-green, #00ff41);
		}

		/* Dense mode */
		:host([dense]) .list-item {
			padding: 8px 12px;
			font-size: 12px;
		}

		/* Dividers */
		:host([dividers]) .list-item {
			border-bottom-color: var(--terminal-gray-dark, #333);
		}

		/* Item content */
		.item-content {
			flex: 1;
			min-width: 0;
			overflow: hidden;
		}

		.item-primary {
			font-size: 14px;
			line-height: 1.4;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.item-secondary {
			font-size: 11px;
			color: var(--terminal-gray, #666);
			margin-top: 2px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		/* Item leading/trailing */
		.item-leading {
			margin-right: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.item-trailing {
			margin-left: 12px;
			display: flex;
			align-items: center;
			flex-shrink: 0;
			color: var(--terminal-gray, #666);
			font-size: 12px;
		}

		/* Checkbox for multi-select */
		.item-checkbox {
			width: 16px;
			height: 16px;
			border: 1px solid var(--terminal-green, #00ff41);
			background: transparent;
			margin-right: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			transition: all 0.15s ease;
		}

		.item-checkbox.checked {
			background: var(--terminal-green, #00ff41);
		}

		.item-checkbox.checked::after {
			content: '';
			width: 10px;
			height: 10px;
			background-color: var(--terminal-black, #0a0a0a);
			-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'/%3E%3C/svg%3E");
			mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'/%3E%3C/svg%3E");
			-webkit-mask-size: contain;
			mask-size: contain;
			-webkit-mask-repeat: no-repeat;
			mask-repeat: no-repeat;
		}

		/* Group header */
		.group-header {
			padding: 8px 16px;
			font-size: 11px;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: var(--terminal-gray, #666);
			background: var(--terminal-gray-darkest, #1a1a1a);
			border-bottom: 1px solid var(--terminal-gray-dark, #333);
			position: sticky;
			top: 0;
			z-index: 1;
		}

		/* Empty state */
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 40px 20px;
			color: var(--terminal-gray, #666);
			text-align: center;
		}

		.empty-icon {
			width: 32px;
			height: 32px;
			margin-bottom: 12px;
			opacity: 0.5;
		}

		.empty-icon svg {
			width: 100%;
			height: 100%;
		}

		.empty-text {
			font-size: 14px;
		}

		/* Loading states */
		.loading-container {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
		}

		.loading-spinner {
			width: 24px;
			height: 24px;
			border: 2px solid var(--terminal-gray-dark, #333);
			border-top-color: var(--terminal-green, #00ff41);
			border-radius: 50%;
			animation: spin 0.8s linear infinite;
		}

		.loading-more {
			padding: 12px;
			text-align: center;
			color: var(--terminal-gray, #666);
			font-size: 12px;
		}

		@keyframes spin {
			to { transform: rotate(360deg); }
		}

		/* Virtual scroll spacer */
		.virtual-spacer {
			position: absolute;
			width: 1px;
			visibility: hidden;
		}

		/* Drag handle */
		.drag-handle {
			cursor: grab;
			padding: 4px;
			margin-right: 8px;
			color: var(--terminal-gray, #666);
			transition: color 0.15s ease;
		}

		.drag-handle:hover {
			color: var(--terminal-green, #00ff41);
		}

		.drag-handle:active {
			cursor: grabbing;
		}

		/* Icon slot */
		.item-icon {
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--terminal-green-dim, #00cc33);
		}
	`];

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		...scrollbarProperties,

		/**
		 * Array of items to display
		 * @property {Array} items
		 * @default []
		 */
		items: { type: Array },

		/**
		 * Height of each item in pixels for virtual scrolling
		 * @property {Number} itemHeight
		 * @default 48
		 */
		itemHeight: { type: Number, attribute: 'item-height' },

		/**
		 * Selection mode: 'none', 'single', 'multiple'
		 * @property {String} selectable
		 * @default 'none'
		 * @reflects
		 */
		selectable: { type: String, reflect: true },

		/**
		 * Array of selected item IDs
		 * @property {Array} selected
		 * @default []
		 */
		selected: { type: Array },

		/**
		 * Show dividers between items
		 * @property {Boolean} dividers
		 * @default false
		 * @reflects
		 */
		dividers: { type: Boolean, reflect: true },

		/**
		 * Use compact/dense styling
		 * @property {Boolean} dense
		 * @default false
		 * @reflects
		 */
		dense: { type: Boolean, reflect: true },

		/**
		 * Show loading state
		 * @property {Boolean} loading
		 * @default false
		 * @reflects
		 */
		loading: { type: Boolean, reflect: true },

		/**
		 * Show loading more indicator at bottom
		 * @property {Boolean} loadingMore
		 * @default false
		 * @reflects
		 */
		loadingMore: { type: Boolean, reflect: true, attribute: 'loading-more' },

		/**
		 * Text to show when list is empty
		 * @property {String} emptyText
		 * @default 'No items'
		 */
		emptyText: { type: String, attribute: 'empty-text' },

		/**
		 * Property key to group items by
		 * @property {String} groupBy
		 * @default ''
		 */
		groupBy: { type: String, attribute: 'group-by' },

		/**
		 * Enable drag-and-drop reordering
		 * @property {Boolean} draggable
		 * @default false
		 * @reflects
		 */
		draggable: { type: Boolean, reflect: true },

		/**
		 * Enable virtual scrolling for large lists
		 * @property {Boolean} virtual
		 * @default false
		 * @reflects
		 */
		virtual: { type: Boolean, reflect: true },

		/**
		 * Buffer size for virtual scrolling (items above/below viewport)
		 * @property {Number} overscan
		 * @default 5
		 */
		overscan: { type: Number },

		/**
		 * Property key to use as item ID
		 * @property {String} itemKey
		 * @default 'id'
		 */
		itemKey: { type: String, attribute: 'item-key' }
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/** @private */
	_scrollTop = 0;

	/** @private */
	_viewportHeight = 0;

	/** @private */
	_focusedIndex = -1;

	/** @private */
	_draggedIndex = -1;

	/** @private */
	_dragOverIndex = -1;

	/** @private */
	_resizeObserver = null;

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/** @private */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TListLit');

		// Set defaults
		this.items = [];
		this.itemHeight = 48;
		this.selectable = 'none';
		this.selected = [];
		this.dividers = false;
		this.dense = false;
		this.loading = false;
		this.loadingMore = false;
		this.emptyText = 'No items';
		this.groupBy = '';
		this.draggable = false;
		this.virtual = false;
		this.overscan = 5;
		this.itemKey = 'id';

		// Scrollbar defaults
		this.scrollbar = scrollbarDefaults.scrollbar;
		this.scrollbarStyle = scrollbarDefaults.scrollbarStyle;

		// Bind methods
		this._handleScroll = this._handleScroll.bind(this);
		this._handleKeydown = this._handleKeydown.bind(this);
		this._handleResize = this._handleResize.bind(this);

		this._logger.debug('Component constructed');
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');

		this.addEventListener('keydown', this._handleKeydown);

		// Set up resize observer
		this._resizeObserver = new ResizeObserver(this._handleResize);
		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');

		this.removeEventListener('keydown', this._handleKeydown);

		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
	}

	firstUpdated() {
		this._logger.debug('First update complete');

		// Get initial viewport height
		const viewport = this.shadowRoot?.querySelector('.list-viewport');
		if (viewport) {
			this._viewportHeight = viewport.clientHeight;
		}
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.keys(changedProperties));
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Select an item by ID
	 * @public
	 * @param {string|number} id - Item ID to select
	 */
	select(id) {
		this._logger.debug('select() called', { id });

		if (this.selectable === 'none') return;

		let newSelected;
		if (this.selectable === 'single') {
			newSelected = [id];
		} else {
			newSelected = this.selected.includes(id)
				? this.selected
				: [...this.selected, id];
		}

		this.selected = newSelected;
		this._emitSelectionChange();
	}

	/**
	 * Deselect an item by ID
	 * @public
	 * @param {string|number} id - Item ID to deselect
	 */
	deselect(id) {
		this._logger.debug('deselect() called', { id });

		this.selected = this.selected.filter(s => s !== id);
		this._emitSelectionChange();
	}

	/**
	 * Toggle selection of an item
	 * @public
	 * @param {string|number} id - Item ID to toggle
	 */
	toggleSelection(id) {
		this._logger.debug('toggleSelection() called', { id });

		if (this.selected.includes(id)) {
			this.deselect(id);
		} else {
			this.select(id);
		}
	}

	/**
	 * Select all items
	 * @public
	 */
	selectAll() {
		this._logger.debug('selectAll() called');

		if (this.selectable !== 'multiple') return;

		this.selected = this.items.map(item => this._getItemId(item));
		this._emitSelectionChange();
	}

	/**
	 * Clear all selections
	 * @public
	 */
	clearSelection() {
		this._logger.debug('clearSelection() called');

		this.selected = [];
		this._emitSelectionChange();
	}

	/**
	 * Scroll to an item by ID
	 * @public
	 * @param {string|number} id - Item ID to scroll to
	 * @param {string} position - Scroll position: 'start', 'center', 'end', 'nearest'
	 */
	scrollToItem(id, position = 'nearest') {
		this._logger.debug('scrollToItem() called', { id, position });

		const index = this.items.findIndex(item => this._getItemId(item) === id);
		if (index === -1) return;

		const viewport = this.shadowRoot?.querySelector('.list-viewport');
		if (!viewport) return;

		const itemTop = index * this.itemHeight;
		const itemBottom = itemTop + this.itemHeight;
		const viewportTop = viewport.scrollTop;
		const viewportBottom = viewportTop + viewport.clientHeight;

		let scrollTo;
		switch (position) {
			case 'start':
				scrollTo = itemTop;
				break;
			case 'center':
				scrollTo = itemTop - (viewport.clientHeight - this.itemHeight) / 2;
				break;
			case 'end':
				scrollTo = itemBottom - viewport.clientHeight;
				break;
			case 'nearest':
			default:
				if (itemTop < viewportTop) {
					scrollTo = itemTop;
				} else if (itemBottom > viewportBottom) {
					scrollTo = itemBottom - viewport.clientHeight;
				} else {
					return; // Already visible
				}
				break;
		}

		viewport.scrollTo({ top: Math.max(0, scrollTo), behavior: 'smooth' });
	}

	/**
	 * Focus an item by index
	 * @public
	 * @param {number} index - Item index to focus
	 */
	focusItem(index) {
		this._logger.debug('focusItem() called', { index });

		if (index < 0 || index >= this.items.length) return;

		this._focusedIndex = index;
		this.requestUpdate();

		// Scroll into view
		const id = this._getItemId(this.items[index]);
		this.scrollToItem(id, 'nearest');
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * Emit a custom event
	 * @private
	 * @param {string} name - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Emit item-click event
	 * @private
	 * @param {Object} item - Clicked item
	 * @param {number} index - Item index
	 */
	_emitItemClick(item, index) {
		this._emitEvent('item-click', { item, index, id: this._getItemId(item) });
	}

	/**
	 * Emit selection-change event
	 * @private
	 */
	_emitSelectionChange() {
		const selectedItems = this.items.filter(item =>
			this.selected.includes(this._getItemId(item))
		);
		this._emitEvent('selection-change', {
			selected: this.selected,
			items: selectedItems
		});
	}

	/**
	 * Emit load-more event
	 * @private
	 */
	_emitLoadMore() {
		this._emitEvent('load-more', {
			itemCount: this.items.length
		});
	}

	/**
	 * Emit reorder event
	 * @private
	 * @param {number} fromIndex - Original index
	 * @param {number} toIndex - New index
	 */
	_emitReorder(fromIndex, toIndex) {
		this._emitEvent('reorder', {
			fromIndex,
			toIndex,
			item: this.items[fromIndex]
		});
	}

	// ============================================================
	// BLOCK 10: Nesting Support (N/A for list)
	// ============================================================

	// ============================================================
	// BLOCK 11: Validation
	// ============================================================

	/**
	 * Validate property values
	 * @private
	 */
	_validateProperty(name, value) {
		const validations = {
			selectable: ['none', 'single', 'multiple'],
			itemHeight: (v) => typeof v === 'number' && v > 0
		};

		const validation = validations[name];
		if (Array.isArray(validation)) {
			return validation.includes(value);
		}
		if (typeof validation === 'function') {
			return validation(value);
		}
		return true;
	}

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		if (this.loading) {
			return this._renderLoading();
		}

		if (this.items.length === 0) {
			return this._renderEmpty();
		}

		const { visibleItems, startIndex, totalHeight, offsetY } = this._getVisibleItems();

		return html`
			<div
				class="list-viewport"
				@scroll=${this._handleScroll}
				role="listbox"
				aria-multiselectable=${this.selectable === 'multiple'}
				tabindex="0"
			>
				<div
					class="list-content"
					style="height: ${this.virtual ? totalHeight : 'auto'}px"
				>
					${this.virtual ? html`
						<div style="height: ${offsetY}px"></div>
					` : ''}
					${this._renderItems(visibleItems, startIndex)}
					${this.loadingMore ? this._renderLoadingMore() : ''}
				</div>
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Get item ID from item object
	 * @private
	 */
	_getItemId(item) {
		return item[this.itemKey] ?? item.id ?? this.items.indexOf(item);
	}

	/**
	 * Get visible items for virtual scrolling
	 * @private
	 */
	_getVisibleItems() {
		if (!this.virtual || this.items.length === 0) {
			return {
				visibleItems: this._getGroupedItems(),
				startIndex: 0,
				totalHeight: this.items.length * this.itemHeight,
				offsetY: 0
			};
		}

		const totalHeight = this.items.length * this.itemHeight;
		const startIndex = Math.max(0, Math.floor(this._scrollTop / this.itemHeight) - this.overscan);
		const visibleCount = Math.ceil(this._viewportHeight / this.itemHeight) + (this.overscan * 2);
		const endIndex = Math.min(this.items.length, startIndex + visibleCount);

		const visibleItems = this.items.slice(startIndex, endIndex);
		const offsetY = startIndex * this.itemHeight;

		return { visibleItems, startIndex, totalHeight, offsetY };
	}

	/**
	 * Get items grouped by groupBy property
	 * @private
	 */
	_getGroupedItems() {
		if (!this.groupBy) {
			return this.items;
		}

		const groups = new Map();
		this.items.forEach(item => {
			const groupKey = item[this.groupBy] || 'Other';
			if (!groups.has(groupKey)) {
				groups.set(groupKey, []);
			}
			groups.get(groupKey).push(item);
		});

		const result = [];
		groups.forEach((items, groupName) => {
			result.push({ _isGroup: true, name: groupName });
			result.push(...items);
		});

		return result;
	}

	/**
	 * Render items
	 * @private
	 */
	_renderItems(items, startIndex) {
		return items.map((item, i) => {
			if (item._isGroup) {
				return this._renderGroupHeader(item.name);
			}
			return this._renderItem(item, startIndex + i);
		});
	}

	/**
	 * Render a single item
	 * @private
	 */
	_renderItem(item, index) {
		const id = this._getItemId(item);
		const isSelected = this.selected.includes(id);
		const isFocused = this._focusedIndex === index;
		const isDragging = this._draggedIndex === index;
		const isDragOver = this._dragOverIndex === index;

		const classes = [
			'list-item',
			isSelected ? 'selected' : '',
			isFocused ? 'focused' : '',
			item.disabled ? 'disabled' : '',
			isDragging ? 'dragging' : '',
			isDragOver ? 'drag-over' : ''
		].filter(Boolean).join(' ');

		return html`
			<div
				class=${classes}
				part="item ${isSelected ? 'item-selected' : ''}"
				role="option"
				aria-selected=${isSelected}
				tabindex=${isFocused ? '0' : '-1'}
				draggable=${this.draggable && !item.disabled}
				data-index=${index}
				@click=${() => this._handleItemClick(item, index)}
				@dragstart=${(e) => this._handleDragStart(e, index)}
				@dragover=${(e) => this._handleDragOver(e, index)}
				@dragleave=${() => this._handleDragLeave()}
				@drop=${(e) => this._handleDrop(e, index)}
				@dragend=${() => this._handleDragEnd()}
			>
				${this.draggable ? html`
					<span class="drag-handle">⋮⋮</span>
				` : ''}
				${this.selectable === 'multiple' ? html`
					<div class="item-checkbox ${isSelected ? 'checked' : ''}"
						@click=${(e) => { e.stopPropagation(); this.toggleSelection(id); }}
					></div>
				` : ''}
				${item.icon ? html`
					<div class="item-leading item-icon">${item.icon}</div>
				` : ''}
				${item.avatar ? html`
					<div class="item-leading">
						<img src=${item.avatar} alt="" style="width: 32px; height: 32px; border-radius: 50%;">
					</div>
				` : ''}
				<div class="item-content">
					<div class="item-primary">${item.label || item.title || item.text || item.name || id}</div>
					${item.secondary || item.description ? html`
						<div class="item-secondary">${item.secondary || item.description}</div>
					` : ''}
				</div>
				${item.trailing || item.meta ? html`
					<div class="item-trailing">${item.trailing || item.meta}</div>
				` : ''}
			</div>
		`;
	}

	/**
	 * Render group header
	 * @private
	 */
	_renderGroupHeader(name) {
		return html`
			<div class="group-header" part="group-header">
				${name}
			</div>
		`;
	}

	/**
	 * Render empty state
	 * @private
	 */
	_renderEmpty() {
		return html`
			<div class="empty-state" part="empty">
				<slot name="empty">
					<div class="empty-icon">${unsafeHTML(trayArrowDownIcon)}</div>
					<div class="empty-text">${this.emptyText}</div>
				</slot>
			</div>
		`;
	}

	/**
	 * Render loading state
	 * @private
	 */
	_renderLoading() {
		return html`
			<div class="loading-container" part="loading">
				<slot name="loading">
					<div class="loading-spinner"></div>
				</slot>
			</div>
		`;
	}

	/**
	 * Render loading more indicator
	 * @private
	 */
	_renderLoadingMore() {
		return html`
			<div class="loading-more">
				<div class="loading-spinner" style="width: 16px; height: 16px; margin: 0 auto;"></div>
			</div>
		`;
	}

	/**
	 * Handle scroll event
	 * @private
	 */
	_handleScroll(e) {
		const viewport = e.target;
		this._scrollTop = viewport.scrollTop;

		// Check for infinite scroll
		const scrolledToBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 100;
		if (scrolledToBottom && !this.loadingMore && !this.loading) {
			this._emitLoadMore();
		}

		if (this.virtual) {
			this.requestUpdate();
		}
	}

	/**
	 * Handle resize
	 * @private
	 */
	_handleResize() {
		const viewport = this.shadowRoot?.querySelector('.list-viewport');
		if (viewport) {
			this._viewportHeight = viewport.clientHeight;
			if (this.virtual) {
				this.requestUpdate();
			}
		}
	}

	/**
	 * Handle keyboard navigation
	 * @private
	 */
	_handleKeydown(e) {
		if (this.items.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				this.focusItem(Math.min(this._focusedIndex + 1, this.items.length - 1));
				break;
			case 'ArrowUp':
				e.preventDefault();
				this.focusItem(Math.max(this._focusedIndex - 1, 0));
				break;
			case 'Home':
				e.preventDefault();
				this.focusItem(0);
				break;
			case 'End':
				e.preventDefault();
				this.focusItem(this.items.length - 1);
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (this._focusedIndex >= 0) {
					const item = this.items[this._focusedIndex];
					this._handleItemClick(item, this._focusedIndex);
				}
				break;
			case 'a':
				if (e.ctrlKey || e.metaKey) {
					e.preventDefault();
					if (this.selectable === 'multiple') {
						this.selectAll();
					}
				}
				break;
			case 'Escape':
				this.clearSelection();
				break;
		}
	}

	/**
	 * Handle item click
	 * @private
	 */
	_handleItemClick(item, index) {
		if (item.disabled) return;

		this._focusedIndex = index;
		this._emitItemClick(item, index);

		if (this.selectable !== 'none') {
			this.toggleSelection(this._getItemId(item));
		}
	}

	/**
	 * Handle drag start
	 * @private
	 */
	_handleDragStart(e, index) {
		if (!this.draggable) return;

		this._draggedIndex = index;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', index.toString());
		this.requestUpdate();
	}

	/**
	 * Handle drag over
	 * @private
	 */
	_handleDragOver(e, index) {
		if (!this.draggable || this._draggedIndex === -1) return;

		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';

		if (this._dragOverIndex !== index) {
			this._dragOverIndex = index;
			this.requestUpdate();
		}
	}

	/**
	 * Handle drag leave
	 * @private
	 */
	_handleDragLeave() {
		this._dragOverIndex = -1;
		this.requestUpdate();
	}

	/**
	 * Handle drop
	 * @private
	 */
	_handleDrop(e, toIndex) {
		if (!this.draggable || this._draggedIndex === -1) return;

		e.preventDefault();
		const fromIndex = this._draggedIndex;

		if (fromIndex !== toIndex) {
			this._emitReorder(fromIndex, toIndex);
		}

		this._handleDragEnd();
	}

	/**
	 * Handle drag end
	 * @private
	 */
	_handleDragEnd() {
		this._draggedIndex = -1;
		this._dragOverIndex = -1;
		this.requestUpdate();
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TListLit.tagName)) {
	customElements.define(TListLit.tagName, TListLit);
}

export default TListLit;
