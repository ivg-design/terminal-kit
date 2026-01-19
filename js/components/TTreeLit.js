/**
 * @fileoverview TTreeLit - Hierarchical tree structure component
 * @module components/TTreeLit
 * @version 3.0.0
 *
 * A FULL profile tree component with expand/collapse, selection,
 * checkboxes, drag-and-drop, and lazy loading.
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { scrollbarStyles, scrollbarProperties, scrollbarDefaults } from '../utils/scrollbar-styles.js';
import {
	caretRightIcon,
	caretDownIcon,
	folderIcon,
	folderOpenIcon,
	fileIcon,
	checkIcon,
	spinnerIcon
} from '../utils/phosphor-icons.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================

/**
 * @component TTreeLit
 * @tagname t-tree
 * @description Hierarchical tree structure with expand/collapse, selection, and drag-and-drop
 * @category Container
 * @since 3.0.0
 *
 * TTreeLit - Hierarchical tree structure component
 *
 * @element t-tree
 *
 * @fires node-click - Fired when a node is clicked
 * @fires node-expand - Fired when a node is expanded/collapsed
 * @fires selection-change - Fired when selection changes
 * @fires node-drop - Fired when a node is dropped (drag-and-drop)
 * @fires lazy-load - Fired when a lazy node needs to load children
 *
 * @slot icon-{id} - Custom icon for a specific node
 *
 * @csspart tree - The tree container
 * @csspart node - Individual tree node
 * @csspart node-selected - Selected tree node
 * @csspart node-content - Node content wrapper
 * @csspart expand-icon - Expand/collapse icon
 * @csspart checkbox - Node checkbox
 * @csspart node-icon - Node icon
 * @csspart node-label - Node label text
 */
class TTreeLit extends LitElement {
	/** @static @readonly */
	static tagName = 't-tree';

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
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			background: var(--t-tree-bg, var(--terminal-gray-darkest, #1a1a1a));
			color: var(--t-tree-color, var(--terminal-green, #00ff41));
			font-size: clamp(11px, 2vw, 13px);
			line-height: 1.4;
			overflow: auto;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
		}

		.tree {
			padding: 6px;
			flex: 1;
			min-height: 0;
		}

		.tree-node {
			user-select: none;
		}

		.node-row {
			display: flex;
			align-items: center;
			padding: 4px 8px;
			border-radius: 3px;
			cursor: pointer;
			transition: all 0.15s ease;
			margin: 1px 0;
		}

		.node-row:hover {
			background: var(--t-tree-hover, rgba(0, 255, 65, 0.1));
		}

		.node-row.selected {
			background: var(--t-tree-selected, rgba(0, 255, 65, 0.2));
		}

		.node-row.focused {
			outline: 1px solid var(--terminal-green, #00ff41);
			outline-offset: -1px;
		}

		.node-row.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
		}

		.node-row.dragging {
			opacity: 0.5;
		}

		.node-row.drag-over {
			border-bottom: 2px solid var(--terminal-green, #00ff41);
		}

		/* Indent levels - same width as expand icon for alignment */
		.node-indent {
			display: inline-block;
			width: 16px;
			flex-shrink: 0;
			margin-right: 4px;
		}

		/* Expand icon */
		.expand-icon {
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			margin-right: 4px;
			color: var(--terminal-gray, #666);
			transition: transform 0.15s ease;
			cursor: pointer;
		}

		.expand-icon svg {
			width: 12px;
			height: 12px;
		}

		.expand-icon:hover {
			color: var(--terminal-green, #00ff41);
		}

		.expand-icon.loading {
			animation: spin 0.8s linear infinite;
		}

		@keyframes spin {
			to { transform: rotate(360deg); }
		}

		/* Checkbox */
		.node-checkbox {
			width: 14px;
			height: 14px;
			border: 1px solid var(--terminal-green, #00ff41);
			background: transparent;
			margin-right: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			transition: all 0.15s ease;
			cursor: pointer;
		}

		.node-checkbox svg {
			width: 10px;
			height: 10px;
		}

		.node-checkbox.checked {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
		}

		.node-checkbox.indeterminate {
			background: transparent;
		}

		.node-checkbox.indeterminate::after {
			content: '';
			width: 8px;
			height: 2px;
			background: var(--terminal-green, #00ff41);
		}

		/* Node icon */
		.node-icon {
			width: 14px;
			height: 14px;
			margin-right: 8px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			color: var(--terminal-gray, #666);
		}

		.node-icon svg {
			width: 100%;
			height: 100%;
			fill: currentColor;
		}

		.node-icon.folder {
			color: var(--terminal-green, #00ff41);
		}

		/* Node label */
		.node-label {
			flex: 1;
			min-width: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		/* Node meta/badge */
		.node-meta {
			margin-left: 8px;
			font-size: 10px;
			color: var(--terminal-gray, #666);
			flex-shrink: 0;
		}

		/* Children container */
		.node-children {
			display: none;
		}

		.node-children.expanded {
			display: block;
		}

		/* Empty tree */
		.empty-tree {
			padding: 20px;
			text-align: center;
			color: var(--terminal-gray, #666);
		}

		/* Loading indicator */
		.loading-children {
			padding: 8px 8px 8px 40px;
			color: var(--terminal-gray, #666);
			font-size: 11px;
		}

		/* Search highlight */
		.highlight {
			background: var(--terminal-amber, #ffb000);
			color: var(--terminal-black, #0a0a0a);
			padding: 0 2px;
		}

		/* Drag handle */
		.drag-handle {
			cursor: grab;
			margin-right: 4px;
			color: var(--terminal-gray, #666);
		}

		.drag-handle:active {
			cursor: grabbing;
		}

		/* Search input */
		.search-container {
			padding: 8px;
			border-bottom: 1px solid var(--terminal-gray-dark, #333);
		}

		.search-input {
			width: 100%;
			box-sizing: border-box;
			padding: 6px 10px;
			background: var(--terminal-black, #0a0a0a);
			border: 1px solid var(--terminal-gray-dark, #333);
			color: var(--terminal-green, #00ff41);
			font-family: inherit;
			font-size: 12px;
		}

		.search-input:focus {
			outline: none;
			border-color: var(--terminal-green, #00ff41);
		}

		.search-input::placeholder {
			color: var(--terminal-gray, #666);
		}
	`];

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		...scrollbarProperties,

		/**
		 * Array of tree nodes
		 * @property {Array} nodes
		 * @default []
		 */
		nodes: { type: Array },

		/**
		 * Selection mode: 'none', 'single', 'multiple'
		 * @property {String} selectable
		 * @default 'none'
		 * @reflects
		 */
		selectable: { type: String, reflect: true },

		/**
		 * Array of selected node IDs
		 * @property {Array} selected
		 * @default []
		 */
		selected: { type: Array },

		/**
		 * Array of expanded node IDs
		 * @property {Array} expanded
		 * @default []
		 */
		expanded: { type: Array },

		/**
		 * Expand node on click (vs only on expand icon)
		 * @property {Boolean} expandOnClick
		 * @default true
		 * @reflects
		 */
		expandOnClick: { type: Boolean, reflect: true, attribute: 'expand-on-click' },

		/**
		 * Show checkboxes for selection
		 * @property {Boolean} showCheckboxes
		 * @default false
		 * @reflects
		 */
		showCheckboxes: { type: Boolean, reflect: true, attribute: 'show-checkboxes' },

		/**
		 * Cascade selection to children/parents
		 * @property {Boolean} cascadeSelection
		 * @default true
		 * @reflects
		 */
		cascadeSelection: { type: Boolean, reflect: true, attribute: 'cascade-selection' },

		/**
		 * Enable drag-and-drop reordering
		 * @property {Boolean} draggable
		 * @default false
		 * @reflects
		 */
		draggable: { type: Boolean, reflect: true },

		/**
		 * Enable search functionality
		 * @property {Boolean} searchable
		 * @default false
		 * @reflects
		 */
		searchable: { type: Boolean, reflect: true },

		/**
		 * Current search query
		 * @property {String} searchQuery
		 * @default ''
		 */
		searchQuery: { type: String, attribute: 'search-query' },

		/**
		 * Property key to use as node ID
		 * @property {String} nodeKey
		 * @default 'id'
		 */
		nodeKey: { type: String, attribute: 'node-key' }
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/** @private */
	_focusedId = null;

	/** @private */
	_draggedId = null;

	/** @private */
	_dragOverId = null;

	/** @private */
	_loadingNodes = new Set();

	/** @private */
	_nodeMap = new Map();

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
		this._logger = componentLogger.for('TTreeLit');

		// Set defaults
		this.nodes = [];
		this.selectable = 'none';
		this.selected = [];
		this.expanded = [];
		this.expandOnClick = true;
		this.showCheckboxes = false;
		this.cascadeSelection = true;
		this.draggable = false;
		this.searchable = false;
		this.searchQuery = '';
		this.nodeKey = 'id';

		// Scrollbar defaults
		this.scrollbar = scrollbarDefaults.scrollbar;
		this.scrollbarStyle = scrollbarDefaults.scrollbarStyle;

		// Bind methods
		this._handleKeydown = this._handleKeydown.bind(this);

		this._logger.debug('Component constructed');
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');

		this.addEventListener('keydown', this._handleKeydown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');

		this.removeEventListener('keydown', this._handleKeydown);
	}

	firstUpdated() {
		this._logger.debug('First update complete');
		this._buildNodeMap();
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.keys(changedProperties));

		if (changedProperties.has('nodes')) {
			this._buildNodeMap();
		}
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Expand a node by ID
	 * @public
	 * @param {string} id - Node ID to expand
	 */
	expandNode(id) {
		this._logger.debug('expandNode() called', { id });

		if (!this.expanded.includes(id)) {
			this.expanded = [...this.expanded, id];
			this._emitNodeExpand(id, true);
		}
	}

	/**
	 * Collapse a node by ID
	 * @public
	 * @param {string} id - Node ID to collapse
	 */
	collapseNode(id) {
		this._logger.debug('collapseNode() called', { id });

		if (this.expanded.includes(id)) {
			this.expanded = this.expanded.filter(i => i !== id);
			this._emitNodeExpand(id, false);
		}
	}

	/**
	 * Toggle expansion of a node
	 * @public
	 * @param {string} id - Node ID to toggle
	 */
	toggleExpand(id) {
		this._logger.debug('toggleExpand() called', { id });

		if (this.expanded.includes(id)) {
			this.collapseNode(id);
		} else {
			this.expandNode(id);
		}
	}

	/**
	 * Expand all nodes
	 * @public
	 */
	expandAll() {
		this._logger.debug('expandAll() called');

		const allIds = this._getAllNodeIds(this.nodes);
		this.expanded = allIds;
	}

	/**
	 * Collapse all nodes
	 * @public
	 */
	collapseAll() {
		this._logger.debug('collapseAll() called');
		this.expanded = [];
	}

	/**
	 * Select a node by ID
	 * @public
	 * @param {string} id - Node ID to select
	 */
	selectNode(id) {
		this._logger.debug('selectNode() called', { id });

		if (this.selectable === 'none') return;

		let newSelected;
		if (this.selectable === 'single') {
			newSelected = [id];
		} else {
			if (this.cascadeSelection && this.showCheckboxes) {
				newSelected = this._getCascadedSelection(id, true);
			} else {
				newSelected = this.selected.includes(id)
					? this.selected
					: [...this.selected, id];
			}
		}

		this.selected = newSelected;
		this._emitSelectionChange();
	}

	/**
	 * Deselect a node by ID
	 * @public
	 * @param {string} id - Node ID to deselect
	 */
	deselectNode(id) {
		this._logger.debug('deselectNode() called', { id });

		if (this.cascadeSelection && this.showCheckboxes) {
			this.selected = this._getCascadedSelection(id, false);
		} else {
			this.selected = this.selected.filter(s => s !== id);
		}
		this._emitSelectionChange();
	}

	/**
	 * Toggle selection of a node
	 * @public
	 * @param {string} id - Node ID to toggle
	 */
	toggleSelection(id) {
		this._logger.debug('toggleSelection() called', { id });

		if (this.selected.includes(id)) {
			this.deselectNode(id);
		} else {
			this.selectNode(id);
		}
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
	 * Find a node by ID
	 * @public
	 * @param {string} id - Node ID to find
	 * @returns {Object|null} Node object or null
	 */
	findNode(id) {
		return this._nodeMap.get(id) || null;
	}

	/**
	 * Set loading state for a node (for lazy loading)
	 * @public
	 * @param {string} id - Node ID
	 * @param {boolean} loading - Loading state
	 */
	setNodeLoading(id, loading) {
		this._logger.debug('setNodeLoading() called', { id, loading });

		if (loading) {
			this._loadingNodes.add(id);
		} else {
			this._loadingNodes.delete(id);
		}
		this.requestUpdate();
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * Emit a custom event
	 * @private
	 */
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Emit node-click event
	 * @private
	 */
	_emitNodeClick(node) {
		this._emitEvent('node-click', { node, id: this._getNodeId(node) });
	}

	/**
	 * Emit node-expand event
	 * @private
	 */
	_emitNodeExpand(id, expanded) {
		const node = this.findNode(id);
		this._emitEvent('node-expand', { node, id, expanded });
	}

	/**
	 * Emit selection-change event
	 * @private
	 */
	_emitSelectionChange() {
		const selectedNodes = this.selected.map(id => this.findNode(id)).filter(Boolean);
		this._emitEvent('selection-change', {
			selected: this.selected,
			nodes: selectedNodes
		});
	}

	/**
	 * Emit lazy-load event
	 * @private
	 */
	_emitLazyLoad(node) {
		this._emitEvent('lazy-load', { node, id: this._getNodeId(node) });
	}

	/**
	 * Emit node-drop event
	 * @private
	 */
	_emitNodeDrop(draggedId, targetId, position) {
		const draggedNode = this.findNode(draggedId);
		const targetNode = this.findNode(targetId);
		this._emitEvent('node-drop', {
			draggedNode,
			targetNode,
			draggedId,
			targetId,
			position
		});
	}

	// ============================================================
	// BLOCK 10: Nesting Support (N/A - tree is self-contained)
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
			selectable: ['none', 'single', 'multiple']
		};

		const validation = validations[name];
		if (Array.isArray(validation)) {
			return validation.includes(value);
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

		const filteredNodes = this.searchQuery
			? this._filterNodes(this.nodes, this.searchQuery.toLowerCase())
			: this.nodes;

		return html`
			${this.searchable ? html`
				<div class="search-container">
					<input
						type="text"
						class="search-input"
						placeholder="Search..."
						.value=${this.searchQuery}
						@input=${this._handleSearch}
					>
				</div>
			` : ''}
			<div class="tree" part="tree" role="tree" tabindex="0">
				${filteredNodes.length === 0
					? html`<div class="empty-tree">No items</div>`
					: this._renderNodes(filteredNodes, 0)
				}
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Get node ID from node object
	 * @private
	 */
	_getNodeId(node) {
		return node[this.nodeKey] ?? node.id;
	}

	/**
	 * Build flat map of all nodes by ID
	 * @private
	 */
	_buildNodeMap() {
		this._nodeMap.clear();
		this._traverseNodes(this.nodes, (node, parent) => {
			const id = this._getNodeId(node);
			this._nodeMap.set(id, { ...node, _parent: parent ? this._getNodeId(parent) : null });
		});
	}

	/**
	 * Traverse nodes recursively
	 * @private
	 */
	_traverseNodes(nodes, callback, parent = null) {
		nodes.forEach(node => {
			callback(node, parent);
			if (node.children && node.children.length > 0) {
				this._traverseNodes(node.children, callback, node);
			}
		});
	}

	/**
	 * Get all node IDs recursively
	 * @private
	 */
	_getAllNodeIds(nodes) {
		const ids = [];
		this._traverseNodes(nodes, node => {
			if (node.children && node.children.length > 0) {
				ids.push(this._getNodeId(node));
			}
		});
		return ids;
	}

	/**
	 * Get cascaded selection (children and parents)
	 * @private
	 */
	_getCascadedSelection(id, selecting) {
		const node = this.findNode(id);
		if (!node) return this.selected;

		let newSelected = new Set(this.selected);

		if (selecting) {
			// Add this node
			newSelected.add(id);
			// Add all descendants
			if (node.children) {
				this._traverseNodes(node.children, child => {
					newSelected.add(this._getNodeId(child));
				});
			}
		} else {
			// Remove this node
			newSelected.delete(id);
			// Remove all descendants
			if (node.children) {
				this._traverseNodes(node.children, child => {
					newSelected.delete(this._getNodeId(child));
				});
			}
		}

		return Array.from(newSelected);
	}

	/**
	 * Check if node has any selected descendants
	 * @private
	 */
	_hasSelectedDescendants(node) {
		if (!node.children) return false;

		for (const child of node.children) {
			if (this.selected.includes(this._getNodeId(child))) return true;
			if (this._hasSelectedDescendants(child)) return true;
		}
		return false;
	}

	/**
	 * Check if all descendants are selected
	 * @private
	 */
	_allDescendantsSelected(node) {
		if (!node.children || node.children.length === 0) return true;

		return node.children.every(child => {
			const childId = this._getNodeId(child);
			return this.selected.includes(childId) && this._allDescendantsSelected(child);
		});
	}

	/**
	 * Filter nodes by search query
	 * @private
	 */
	_filterNodes(nodes, query) {
		return nodes.reduce((result, node) => {
			const label = (node.label || node.name || '').toLowerCase();
			const matches = label.includes(query);

			const filteredChildren = node.children
				? this._filterNodes(node.children, query)
				: [];

			if (matches || filteredChildren.length > 0) {
				result.push({
					...node,
					children: filteredChildren,
					_matchesSearch: matches
				});
			}

			return result;
		}, []);
	}

	/**
	 * Render nodes recursively
	 * @private
	 */
	_renderNodes(nodes, level) {
		return nodes.map(node => this._renderNode(node, level));
	}

	/**
	 * Render a single node
	 * @private
	 */
	_renderNode(node, level) {
		const id = this._getNodeId(node);
		const hasChildren = node.children && node.children.length > 0;
		const isLazy = node.lazy && !node.children;
		const isExpanded = this.expanded.includes(id);
		const isSelected = this.selected.includes(id);
		const isFocused = this._focusedId === id;
		const isDragging = this._draggedId === id;
		const isDragOver = this._dragOverId === id;
		const isLoading = this._loadingNodes.has(id);

		// Checkbox state
		let checkboxState = 'unchecked';
		if (this.showCheckboxes && this.selectable === 'multiple') {
			if (isSelected) {
				if (hasChildren && !this._allDescendantsSelected(node)) {
					checkboxState = 'indeterminate';
				} else {
					checkboxState = 'checked';
				}
			} else if (hasChildren && this._hasSelectedDescendants(node)) {
				checkboxState = 'indeterminate';
			}
		}

		const rowClasses = [
			'node-row',
			isSelected ? 'selected' : '',
			isFocused ? 'focused' : '',
			node.disabled ? 'disabled' : '',
			isDragging ? 'dragging' : '',
			isDragOver ? 'drag-over' : ''
		].filter(Boolean).join(' ');

		return html`
			<div class="tree-node" role="treeitem" aria-expanded=${hasChildren || isLazy ? isExpanded : null}>
				<div
					class=${rowClasses}
					part="node ${isSelected ? 'node-selected' : ''}"
					style="padding-left: ${level * 16 + 8}px"
					draggable=${this.draggable && !node.disabled}
					@click=${(e) => this._handleNodeClick(e, node)}
					@dragstart=${(e) => this._handleDragStart(e, id)}
					@dragover=${(e) => this._handleDragOver(e, id)}
					@dragleave=${() => this._handleDragLeave()}
					@drop=${(e) => this._handleDrop(e, id)}
					@dragend=${() => this._handleDragEnd()}
				>
					${this.draggable ? html`<span class="drag-handle">⋮⋮</span>` : ''}

					${hasChildren || isLazy ? html`
						<span
							class="expand-icon ${isLoading ? 'loading' : ''} ${isExpanded ? 'expanded' : ''}"
							part="expand-icon"
							@click=${(e) => this._handleExpandClick(e, node)}
						>
							${isLoading ? unsafeHTML(spinnerIcon) : (isExpanded ? unsafeHTML(caretDownIcon) : unsafeHTML(caretRightIcon))}
						</span>
					` : html`
						<span class="node-indent"></span>
					`}

					${this.showCheckboxes && this.selectable === 'multiple' ? html`
						<span
							class="node-checkbox ${checkboxState}"
							part="checkbox"
							@click=${(e) => this._handleCheckboxClick(e, node)}
						>
							${checkboxState === 'checked' ? unsafeHTML(checkIcon) : ''}
						</span>
					` : ''}

					<span class="node-icon ${hasChildren || isLazy ? 'folder' : ''}" part="node-icon">
						${node.icon ? unsafeHTML(node.icon) : (hasChildren || isLazy ? (isExpanded ? unsafeHTML(folderOpenIcon) : unsafeHTML(folderIcon)) : unsafeHTML(fileIcon))}
					</span>

					<span class="node-label" part="node-label">
						${this._renderLabel(node)}
					</span>

					${node.meta || node.badge ? html`
						<span class="node-meta">${node.meta || node.badge}</span>
					` : ''}
				</div>

				${(hasChildren || isLazy) ? html`
					<div class="node-children ${isExpanded ? 'expanded' : ''}" role="group">
						${isLoading ? html`
							<div class="loading-children">Loading...</div>
						` : ''}
						${hasChildren ? this._renderNodes(node.children, level + 1) : ''}
					</div>
				` : ''}
			</div>
		`;
	}

	/**
	 * Render node label with search highlighting
	 * @private
	 */
	_renderLabel(node) {
		const label = node.label || node.name || this._getNodeId(node);

		if (!this.searchQuery || !node._matchesSearch) {
			return label;
		}

		const query = this.searchQuery.toLowerCase();
		const index = label.toLowerCase().indexOf(query);
		if (index === -1) return label;

		const before = label.substring(0, index);
		const match = label.substring(index, index + query.length);
		const after = label.substring(index + query.length);

		return html`${before}<span class="highlight">${match}</span>${after}`;
	}

	/**
	 * Handle node click
	 * @private
	 */
	_handleNodeClick(e, node) {
		if (node.disabled) return;

		const id = this._getNodeId(node);
		this._focusedId = id;
		this._emitNodeClick(node);

		if (this.expandOnClick && (node.children?.length > 0 || node.lazy)) {
			this._handleExpandToggle(node);
		}

		if (this.selectable !== 'none' && !this.showCheckboxes) {
			this.toggleSelection(id);
		}
	}

	/**
	 * Handle expand icon click
	 * @private
	 */
	_handleExpandClick(e, node) {
		e.stopPropagation();
		this._handleExpandToggle(node);
	}

	/**
	 * Handle expand toggle
	 * @private
	 */
	_handleExpandToggle(node) {
		const id = this._getNodeId(node);

		if (node.lazy && !node.children && !this._loadingNodes.has(id)) {
			this._loadingNodes.add(id);
			this.expandNode(id);
			this._emitLazyLoad(node);
			this.requestUpdate();
		} else {
			this.toggleExpand(id);
		}
	}

	/**
	 * Handle checkbox click
	 * @private
	 */
	_handleCheckboxClick(e, node) {
		e.stopPropagation();
		if (node.disabled) return;

		this.toggleSelection(this._getNodeId(node));
	}

	/**
	 * Handle search input
	 * @private
	 */
	_handleSearch(e) {
		this.searchQuery = e.target.value;

		// Auto-expand matching nodes
		if (this.searchQuery) {
			this._traverseNodes(this.nodes, node => {
				const label = (node.label || node.name || '').toLowerCase();
				if (label.includes(this.searchQuery.toLowerCase()) && node.children?.length > 0) {
					this.expandNode(this._getNodeId(node));
				}
			});
		}
	}

	/**
	 * Handle keyboard navigation
	 * @private
	 */
	_handleKeydown(e) {
		const visibleNodes = this._getVisibleNodes();
		if (visibleNodes.length === 0) return;

		const currentIndex = visibleNodes.findIndex(n => this._getNodeId(n) === this._focusedId);

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (currentIndex < visibleNodes.length - 1) {
					this._focusedId = this._getNodeId(visibleNodes[currentIndex + 1]);
					this.requestUpdate();
				}
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (currentIndex > 0) {
					this._focusedId = this._getNodeId(visibleNodes[currentIndex - 1]);
					this.requestUpdate();
				}
				break;
			case 'ArrowRight':
				e.preventDefault();
				if (this._focusedId) {
					const node = this.findNode(this._focusedId);
					if (node && (node.children?.length > 0 || node.lazy)) {
						this.expandNode(this._focusedId);
					}
				}
				break;
			case 'ArrowLeft':
				e.preventDefault();
				if (this._focusedId) {
					this.collapseNode(this._focusedId);
				}
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (this._focusedId) {
					const node = this.findNode(this._focusedId);
					if (node) {
						this._handleNodeClick(e, node);
					}
				}
				break;
			case 'Home':
				e.preventDefault();
				this._focusedId = this._getNodeId(visibleNodes[0]);
				this.requestUpdate();
				break;
			case 'End':
				e.preventDefault();
				this._focusedId = this._getNodeId(visibleNodes[visibleNodes.length - 1]);
				this.requestUpdate();
				break;
		}
	}

	/**
	 * Get list of visible (expanded) nodes
	 * @private
	 */
	_getVisibleNodes() {
		const visible = [];
		const addVisible = (nodes) => {
			nodes.forEach(node => {
				visible.push(node);
				const id = this._getNodeId(node);
				if (node.children && this.expanded.includes(id)) {
					addVisible(node.children);
				}
			});
		};
		addVisible(this.nodes);
		return visible;
	}

	/**
	 * Handle drag start
	 * @private
	 */
	_handleDragStart(e, id) {
		if (!this.draggable) return;
		this._draggedId = id;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', id);
		this.requestUpdate();
	}

	/**
	 * Handle drag over
	 * @private
	 */
	_handleDragOver(e, id) {
		if (!this.draggable || !this._draggedId || this._draggedId === id) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';

		if (this._dragOverId !== id) {
			this._dragOverId = id;
			this.requestUpdate();
		}
	}

	/**
	 * Handle drag leave
	 * @private
	 */
	_handleDragLeave() {
		this._dragOverId = null;
		this.requestUpdate();
	}

	/**
	 * Handle drop
	 * @private
	 */
	_handleDrop(e, targetId) {
		if (!this.draggable || !this._draggedId || this._draggedId === targetId) return;
		e.preventDefault();

		this._emitNodeDrop(this._draggedId, targetId, 'after');
		this._handleDragEnd();
	}

	/**
	 * Handle drag end
	 * @private
	 */
	_handleDragEnd() {
		this._draggedId = null;
		this._dragOverId = null;
		this.requestUpdate();
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TTreeLit.tagName)) {
	customElements.define(TTreeLit.tagName, TTreeLit);
}

export default TTreeLit;
