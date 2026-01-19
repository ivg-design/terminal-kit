/**
 * TerminalTreeView Web Component
 * Hierarchical tree view with expand/collapse and selection management
 * Uses existing terminal CSS styles
 */

import { TComponent } from './TComponent.js';
import './TTreeNode.js';

export class TTreeView extends TComponent {
	static get observedAttributes() {
		return ['multi-select', 'expand-on-select', 'show-root', 'disabled'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			multiSelect: false,
			expandOnSelect: true,
			showRoot: true,
			disabled: false,
			selectedNodes: new Set(),
			data: null,
		});

		// Bind methods for event delegation
		this._handleNodeSelect = this._handleNodeSelect.bind(this);
		this._handleNodeExpand = this._handleNodeExpand.bind(this);
		this._handleNodeCollapse = this._handleNodeCollapse.bind(this);
	}

	get componentClass() {
		return 'terminal-tree-view';
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'multi-select':
				this.setProp('multiSelect', newValue !== null);
				break;
			case 'expand-on-select':
				this.setProp('expandOnSelect', newValue !== null);
				break;
			case 'show-root':
				this.setProp('showRoot', newValue !== null);
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
		}
	}

	template() {
		const { disabled, showRoot } = this._props;

		// Build class list
		const classes = ['tree-view'];

		if (disabled) classes.push('tree-view--disabled');
		if (!showRoot) classes.push('tree-view--no-root');

		return `
			<div 
				class="${classes.join(' ')}" 
				role="tree"
				aria-multiselectable="${this.getProp('multiSelect')}"
				tabindex="${disabled ? -1 : 0}"
			>
				<div class="tree-view__content">
					<slot></slot>
				</div>
			</div>
		`;
	}

	afterRender() {
		const treeView = this.$('.tree-view');

		if (treeView) {
			// Set up event delegation for node events
			this.addListener(this, 'node-select', this._handleNodeSelect);
			this.addListener(this, 'node-expand', this._handleNodeExpand);
			this.addListener(this, 'node-collapse', this._handleNodeCollapse);

			// Handle keyboard navigation
			this.addListener(treeView, 'keydown', (e) => {
				if (this.getProp('disabled')) return;

				const focusedNode = this.getFocusedNode();
				if (!focusedNode) return;

				switch (e.key) {
					case 'ArrowDown':
						e.preventDefault();
						this.focusNext(focusedNode);
						break;
					case 'ArrowUp':
						e.preventDefault();
						this.focusPrevious(focusedNode);
						break;
					case 'Home':
						e.preventDefault();
						this.focusFirst();
						break;
					case 'End':
						e.preventDefault();
						this.focusLast();
						break;
				}
			});
		}

		// Update node levels and children states
		this.updateNodeStates();
	}

	// Event Handlers

	_handleNodeSelect(e) {
		const { node } = e.detail;
		const { multiSelect, expandOnSelect } = this._props;

		if (!multiSelect) {
			// Clear all other selections
			this.clearSelection();
		}

		// Add to selected nodes
		this._props.selectedNodes.add(node);

		// Expand node if configured to do so
		if (expandOnSelect && node.getProp('hasChildren')) {
			node.expand();
		}

		this.emit('selection-change', {
			selectedNodes: Array.from(this._props.selectedNodes),
			node: node,
			action: 'select',
		});
	}

	_handleNodeExpand(e) {
		const { node } = e.detail;
		this.emit('node-expanded', e.detail);
	}

	_handleNodeCollapse(e) {
		const { node } = e.detail;
		this.emit('node-collapsed', e.detail);
	}

	// Public API

	/**
	 * Set tree data and render nodes
	 */
	setData(data) {
		this.setProp('data', data);
		this.innerHTML = '';
		if (data) {
			this.renderNodes(data);
		}
	}

	/**
	 * Render nodes from data structure
	 */
	renderNodes(nodes, level = 0, parent = null) {
		const container = parent || this;

		nodes.forEach((nodeData) => {
			const node = document.createElement('terminal-tree-node');

			// Set node properties
			if (nodeData.text) node.textContent = nodeData.text;
			if (nodeData.value !== undefined) node.setValue(nodeData.value);
			if (nodeData.icon) node.setIcon(nodeData.icon);
			if (nodeData.disabled) node.setDisabled(true);
			if (nodeData.selected) node.select();

			node.setLevel(level);
			node.setHasChildren(nodeData.children && nodeData.children.length > 0);

			if (nodeData.expanded && nodeData.children) {
				node.expand();
			}

			container.appendChild(node);

			// Recursively render children
			if (nodeData.children && nodeData.children.length > 0) {
				this.renderNodes(nodeData.children, level + 1, node);
			}
		});
	}

	/**
	 * Get all nodes
	 */
	getAllNodes() {
		return Array.from(this.querySelectorAll('terminal-tree-node'));
	}

	/**
	 * Get all visible nodes (expanded parents)
	 */
	getVisibleNodes() {
		const allNodes = this.getAllNodes();
		return allNodes.filter((node) => this.isNodeVisible(node));
	}

	/**
	 * Check if node is visible (all parents expanded)
	 */
	isNodeVisible(node) {
		let current = node.parentElement;
		while (current && current !== this) {
			if (current.tagName === 'TERMINAL-TREE-NODE' && !current.isExpanded()) {
				return false;
			}
			current = current.parentElement;
		}
		return true;
	}

	/**
	 * Get selected nodes
	 */
	getSelectedNodes() {
		return Array.from(this._props.selectedNodes);
	}

	/**
	 * Clear all selections
	 */
	clearSelection() {
		this._props.selectedNodes.forEach((node) => {
			node.deselect();
		});
		this._props.selectedNodes.clear();

		this.emit('selection-change', {
			selectedNodes: [],
			node: null,
			action: 'clear',
		});
	}

	/**
	 * Select node by value
	 */
	selectByValue(value) {
		const nodes = this.getAllNodes();
		const node = nodes.find((n) => n.getProp('value') === value);
		if (node) {
			node.select();
		}
	}

	/**
	 * Expand all nodes
	 */
	expandAll() {
		this.getAllNodes().forEach((node) => {
			if (node.getProp('hasChildren')) {
				node.expand();
			}
		});
	}

	/**
	 * Collapse all nodes
	 */
	collapseAll() {
		this.getAllNodes().forEach((node) => {
			if (node.getProp('hasChildren')) {
				node.collapse();
			}
		});
	}

	/**
	 * Get currently focused node
	 */
	getFocusedNode() {
		const nodes = this.getAllNodes();
		return nodes.find((node) => document.activeElement === node.$('.tree-node'));
	}

	/**
	 * Focus next visible node
	 */
	focusNext(currentNode) {
		const visibleNodes = this.getVisibleNodes();
		const currentIndex = visibleNodes.indexOf(currentNode);
		if (currentIndex >= 0 && currentIndex < visibleNodes.length - 1) {
			visibleNodes[currentIndex + 1].focus();
		}
	}

	/**
	 * Focus previous visible node
	 */
	focusPrevious(currentNode) {
		const visibleNodes = this.getVisibleNodes();
		const currentIndex = visibleNodes.indexOf(currentNode);
		if (currentIndex > 0) {
			visibleNodes[currentIndex - 1].focus();
		}
	}

	/**
	 * Focus first visible node
	 */
	focusFirst() {
		const visibleNodes = this.getVisibleNodes();
		if (visibleNodes.length > 0) {
			visibleNodes[0].focus();
		}
	}

	/**
	 * Focus last visible node
	 */
	focusLast() {
		const visibleNodes = this.getVisibleNodes();
		if (visibleNodes.length > 0) {
			visibleNodes[visibleNodes.length - 1].focus();
		}
	}

	/**
	 * Update all node states (levels, children flags)
	 */
	updateNodeStates() {
		this.updateNodeLevels();
		this.updateChildrenStates();
	}

	/**
	 * Update node indentation levels
	 */
	updateNodeLevels(parent = this, level = 0) {
		const directChildren = Array.from(parent.children).filter(
			(child) => child.tagName === 'TERMINAL-TREE-NODE'
		);

		directChildren.forEach((node) => {
			node.setLevel(level);
			this.updateNodeLevels(node, level + 1);
		});
	}

	/**
	 * Update has-children states for all nodes
	 */
	updateChildrenStates() {
		const allNodes = this.getAllNodes();

		allNodes.forEach((node) => {
			const hasChildren = Array.from(node.children).some(
				(child) => child.tagName === 'TERMINAL-TREE-NODE'
			);
			node.setHasChildren(hasChildren);
		});
	}

	/**
	 * Find node by text content
	 */
	findNodeByText(text) {
		const nodes = this.getAllNodes();
		return nodes.find(
			(node) => (node.getProp('text') || node.textContent || '').trim() === text
		);
	}

	/**
	 * Find nodes by value
	 */
	findNodesByValue(value) {
		const nodes = this.getAllNodes();
		return nodes.filter((node) => node.getProp('value') === value);
	}

	/**
	 * Get tree data as object
	 */
	getTreeData() {
		return this.nodeToData(this);
	}

	/**
	 * Convert node to data object (recursive)
	 */
	nodeToData(container) {
		const directChildren = Array.from(container.children).filter(
			(child) => child.tagName === 'TERMINAL-TREE-NODE'
		);

		return directChildren.map((node) => {
			const data = {
				text: node.getProp('text') || node.textContent || '',
				value: node.getProp('value'),
				icon: node.getProp('icon'),
				selected: node.isSelected(),
				expanded: node.isExpanded(),
				disabled: node.isDisabled(),
			};

			const nodeChildren = this.nodeToData(node);
			if (nodeChildren.length > 0) {
				data.children = nodeChildren;
			}

			return data;
		});
	}

	/**
	 * Disable tree view
	 */
	disable() {
		this.setProp('disabled', true);
		this.setAttribute('disabled', '');
		this.getAllNodes().forEach((node) => node.setDisabled(true));
	}

	/**
	 * Enable tree view
	 */
	enable() {
		this.setProp('disabled', false);
		this.removeAttribute('disabled');
		this.getAllNodes().forEach((node) => node.setDisabled(false));
	}
}

// Register the component
customElements.define('t-tre', TTreeView);
