/**
 * TTreeLit Component Tests
 * FULL profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TTreeLit.js';

describe('TTreeLit', () => {
	let tree;
	const sampleNodes = [
		{
			id: 'root1',
			label: 'Root 1',
			children: [
				{ id: 'child1', label: 'Child 1' },
				{ id: 'child2', label: 'Child 2' },
				{
					id: 'child3',
					label: 'Child 3',
					children: [
						{ id: 'grandchild1', label: 'Grandchild 1' }
					]
				}
			]
		},
		{
			id: 'root2',
			label: 'Root 2',
			children: [
				{ id: 'child4', label: 'Child 4' }
			]
		},
		{ id: 'root3', label: 'Root 3' }
	];

	beforeEach(async () => {
		tree = await fixture(html`<t-tree></t-tree>`);
	});

	afterEach(() => {
		tree?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(tree.constructor.tagName).toBe('t-tree');
		});

		it('should have correct version', () => {
			expect(tree.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(tree.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyTree = document.createElement('t-tree');
			expect(emptyTree.nodes).toEqual([]);
			expect(emptyTree.selectable).toBe('none');
			expect(emptyTree.selected).toEqual([]);
			expect(emptyTree.expanded).toEqual([]);
			expect(emptyTree.expandOnClick).toBe(true);
			expect(emptyTree.showCheckboxes).toBe(false);
			expect(emptyTree.cascadeSelection).toBe(true);
			expect(emptyTree.draggable).toBe(false);
			expect(emptyTree.searchable).toBe(false);
			expect(emptyTree.searchQuery).toBe('');
			expect(emptyTree.nodeKey).toBe('id');
		});

		it('should update nodes property', async () => {
			tree.nodes = sampleNodes;
			await tree.updateComplete;
			expect(tree.nodes).toEqual(sampleNodes);
		});

		it('should update selectable property', async () => {
			tree.selectable = 'single';
			await tree.updateComplete;
			expect(tree.selectable).toBe('single');
			expect(tree.getAttribute('selectable')).toBe('single');
		});

		it('should update selected property', async () => {
			tree.nodes = sampleNodes;
			tree.selected = ['root1', 'child1'];
			await tree.updateComplete;
			expect(tree.selected).toEqual(['root1', 'child1']);
		});

		it('should update expanded property', async () => {
			tree.nodes = sampleNodes;
			tree.expanded = ['root1'];
			await tree.updateComplete;
			expect(tree.expanded).toEqual(['root1']);
		});

		it('should update showCheckboxes property', async () => {
			tree.showCheckboxes = true;
			await tree.updateComplete;
			expect(tree.showCheckboxes).toBe(true);
			expect(tree.hasAttribute('show-checkboxes')).toBe(true);
		});

		it('should update draggable property', async () => {
			tree.draggable = true;
			await tree.updateComplete;
			expect(tree.draggable).toBe(true);
			expect(tree.hasAttribute('draggable')).toBe(true);
		});

		it('should update searchable property', async () => {
			tree.searchable = true;
			await tree.updateComplete;
			expect(tree.searchable).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-tree
					selectable="multiple"
					show-checkboxes
					cascade-selection
					searchable
				></t-tree>
			`);

			expect(withAttrs.selectable).toBe('multiple');
			expect(withAttrs.showCheckboxes).toBe(true);
			expect(withAttrs.cascadeSelection).toBe(true);
			expect(withAttrs.searchable).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		beforeEach(async () => {
			tree.nodes = sampleNodes;
			tree.selectable = 'multiple';
			await tree.updateComplete;
		});

		it('expandNode() should add node to expanded', async () => {
			tree.expandNode('root1');
			await tree.updateComplete;
			expect(tree.expanded).toContain('root1');
		});

		it('collapseNode() should remove node from expanded', async () => {
			tree.expanded = ['root1', 'root2'];
			await tree.updateComplete;

			tree.collapseNode('root1');
			await tree.updateComplete;

			expect(tree.expanded).not.toContain('root1');
			expect(tree.expanded).toContain('root2');
		});

		it('toggleExpand() should toggle expansion', async () => {
			tree.toggleExpand('root1');
			await tree.updateComplete;
			expect(tree.expanded).toContain('root1');

			tree.toggleExpand('root1');
			await tree.updateComplete;
			expect(tree.expanded).not.toContain('root1');
		});

		it('expandAll() should expand all nodes with children', async () => {
			tree.expandAll();
			await tree.updateComplete;

			expect(tree.expanded).toContain('root1');
			expect(tree.expanded).toContain('root2');
			expect(tree.expanded).toContain('child3');
		});

		it('collapseAll() should collapse all nodes', async () => {
			tree.expanded = ['root1', 'root2', 'child3'];
			await tree.updateComplete;

			tree.collapseAll();
			await tree.updateComplete;

			expect(tree.expanded).toEqual([]);
		});

		it('selectNode() should add node to selection', async () => {
			tree.selectNode('root1');
			await tree.updateComplete;
			expect(tree.selected).toContain('root1');
		});

		it('selectNode() should replace selection in single mode', async () => {
			tree.selectable = 'single';
			await tree.updateComplete;

			tree.selectNode('root1');
			tree.selectNode('root2');
			await tree.updateComplete;

			expect(tree.selected).toEqual(['root2']);
		});

		it('deselectNode() should remove node from selection', async () => {
			tree.selected = ['root1', 'root2'];
			await tree.updateComplete;

			tree.deselectNode('root1');
			await tree.updateComplete;

			expect(tree.selected).toEqual(['root2']);
		});

		it('toggleSelection() should toggle selection', async () => {
			tree.toggleSelection('root1');
			await tree.updateComplete;
			expect(tree.selected).toContain('root1');

			tree.toggleSelection('root1');
			await tree.updateComplete;
			expect(tree.selected).not.toContain('root1');
		});

		it('clearSelection() should clear all selections', async () => {
			tree.selected = ['root1', 'root2'];
			await tree.updateComplete;

			tree.clearSelection();
			await tree.updateComplete;

			expect(tree.selected).toEqual([]);
		});

		it('findNode() should return node by ID', async () => {
			const node = tree.findNode('child1');
			expect(node).toBeTruthy();
			expect(node.label).toBe('Child 1');
		});

		it('findNode() should return null for invalid ID', async () => {
			const node = tree.findNode('nonexistent');
			expect(node).toBeNull();
		});

		it('setNodeLoading() should track loading state', async () => {
			tree.setNodeLoading('root1', true);
			expect(tree._loadingNodes.has('root1')).toBe(true);

			tree.setNodeLoading('root1', false);
			expect(tree._loadingNodes.has('root1')).toBe(false);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		beforeEach(async () => {
			tree.nodes = sampleNodes;
			tree.selectable = 'multiple';
			tree.expanded = ['root1'];
			await tree.updateComplete;
		});

		it('should fire node-click event', async () => {
			const handler = vi.fn();
			tree.addEventListener('node-click', handler);

			const nodeRow = tree.shadowRoot.querySelector('.node-row');
			nodeRow.click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('root1');
		});

		it('should fire node-expand event', async () => {
			const handler = vi.fn();
			tree.addEventListener('node-expand', handler);

			tree.expandNode('root2');

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('root2');
			expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
		});

		it('should fire selection-change event', async () => {
			const handler = vi.fn();
			tree.addEventListener('selection-change', handler);

			tree.selectNode('root1');

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.selected).toContain('root1');
		});

		it('should fire lazy-load event for lazy nodes', async () => {
			tree.nodes = [{ id: 'lazy1', label: 'Lazy Node', lazy: true }];
			await tree.updateComplete;

			const handler = vi.fn();
			tree.addEventListener('lazy-load', handler);

			const expandIcon = tree.shadowRoot.querySelector('.expand-icon');
			expandIcon.click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('lazy1');
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('node-click', handler);

			const nodeRow = tree.shadowRoot.querySelector('.node-row');
			nodeRow.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('node-click', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await tree.updateComplete;
			expect(tree.shadowRoot).toBeTruthy();
		});

		it('should render empty state when no nodes', async () => {
			await tree.updateComplete;
			const empty = tree.shadowRoot.querySelector('.empty-tree');
			expect(empty).toBeTruthy();
		});

		it('should render tree nodes', async () => {
			tree.nodes = sampleNodes;
			await tree.updateComplete;

			const nodes = tree.shadowRoot.querySelectorAll('.tree-node');
			expect(nodes.length).toBeGreaterThan(0);
		});

		it('should render expand icon for nodes with children', async () => {
			tree.nodes = sampleNodes;
			await tree.updateComplete;

			const expandIcon = tree.shadowRoot.querySelector('.expand-icon');
			expect(expandIcon).toBeTruthy();
		});

		it('should render children when expanded', async () => {
			tree.nodes = sampleNodes;
			tree.expanded = ['root1'];
			await tree.updateComplete;

			const childNodes = tree.shadowRoot.querySelectorAll('.node-children.expanded');
			expect(childNodes.length).toBeGreaterThan(0);
		});

		it('should render checkboxes when showCheckboxes is true', async () => {
			tree.nodes = sampleNodes;
			tree.selectable = 'multiple';
			tree.showCheckboxes = true;
			await tree.updateComplete;

			const checkbox = tree.shadowRoot.querySelector('.node-checkbox');
			expect(checkbox).toBeTruthy();
		});

		it('should render drag handles when draggable', async () => {
			tree.nodes = sampleNodes;
			tree.draggable = true;
			await tree.updateComplete;

			const handle = tree.shadowRoot.querySelector('.drag-handle');
			expect(handle).toBeTruthy();
		});

		it('should render search input when searchable', async () => {
			tree.nodes = sampleNodes;
			tree.searchable = true;
			await tree.updateComplete;

			const input = tree.shadowRoot.querySelector('.search-input');
			expect(input).toBeTruthy();
		});

		it('should render selected state', async () => {
			tree.nodes = sampleNodes;
			tree.selectable = 'single';
			tree.selected = ['root1'];
			await tree.updateComplete;

			const selected = tree.shadowRoot.querySelector('.node-row.selected');
			expect(selected).toBeTruthy();
		});

		it('should render expanded icon correctly', async () => {
			tree.nodes = sampleNodes;
			tree.expanded = ['root1'];
			await tree.updateComplete;

			const expandedIcon = tree.shadowRoot.querySelector('.expand-icon.expanded');
			expect(expandedIcon).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 6: Search Functionality
	// ======================================================
	describe('Search Functionality', () => {
		beforeEach(async () => {
			tree.nodes = sampleNodes;
			tree.searchable = true;
			await tree.updateComplete;
		});

		it('should filter nodes by search query', async () => {
			tree.searchQuery = 'Child 1';
			await tree.updateComplete;

			const visibleLabels = Array.from(tree.shadowRoot.querySelectorAll('.node-label'))
				.map(el => el.textContent.trim());

			expect(visibleLabels.some(l => l.includes('Child 1'))).toBe(true);
		});

		it('should highlight search matches', async () => {
			tree.searchQuery = 'Child';
			await tree.updateComplete;

			const highlight = tree.shadowRoot.querySelector('.highlight');
			expect(highlight).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 7: Keyboard Navigation
	// ======================================================
	describe('Keyboard Navigation', () => {
		beforeEach(async () => {
			tree.nodes = sampleNodes;
			tree.selectable = 'single';
			await tree.updateComplete;
		});

		it('should navigate down with ArrowDown', async () => {
			tree._focusedId = 'root1';
			await tree.updateComplete;

			tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
			await tree.updateComplete;

			expect(tree._focusedId).toBe('root2');
		});

		it('should navigate up with ArrowUp', async () => {
			tree._focusedId = 'root2';
			await tree.updateComplete;

			tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
			await tree.updateComplete;

			expect(tree._focusedId).toBe('root1');
		});

		it('should expand node with ArrowRight', async () => {
			tree._focusedId = 'root1';
			await tree.updateComplete;

			tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
			await tree.updateComplete;

			expect(tree.expanded).toContain('root1');
		});

		it('should collapse node with ArrowLeft', async () => {
			tree.expanded = ['root1'];
			tree._focusedId = 'root1';
			await tree.updateComplete;

			tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
			await tree.updateComplete;

			expect(tree.expanded).not.toContain('root1');
		});

		it('should go to first with Home', async () => {
			tree._focusedId = 'root3';
			await tree.updateComplete;

			tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
			await tree.updateComplete;

			expect(tree._focusedId).toBe('root1');
		});

		it('should go to last with End', async () => {
			tree._focusedId = 'root1';
			await tree.updateComplete;

			tree.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
			await tree.updateComplete;

			expect(tree._focusedId).toBe('root3');
		});
	});

	// ======================================================
	// SUITE 8: Cascade Selection
	// ======================================================
	describe('Cascade Selection', () => {
		beforeEach(async () => {
			tree.nodes = sampleNodes;
			tree.selectable = 'multiple';
			tree.showCheckboxes = true;
			tree.cascadeSelection = true;
			await tree.updateComplete;
		});

		it('should select children when parent is selected', async () => {
			tree.selectNode('root1');
			await tree.updateComplete;

			expect(tree.selected).toContain('root1');
			expect(tree.selected).toContain('child1');
			expect(tree.selected).toContain('child2');
			expect(tree.selected).toContain('child3');
			expect(tree.selected).toContain('grandchild1');
		});

		it('should deselect children when parent is deselected', async () => {
			tree.selected = ['root1', 'child1', 'child2', 'child3', 'grandchild1'];
			await tree.updateComplete;

			tree.deselectNode('root1');
			await tree.updateComplete;

			expect(tree.selected).not.toContain('root1');
			expect(tree.selected).not.toContain('child1');
			expect(tree.selected).not.toContain('child2');
		});
	});

	// ======================================================
	// SUITE 9: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(tree._logger).toBeTruthy();
		});
	});
});
