/**
 * TListLit Component Tests
 * FULL profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TListLit.js';

describe('TListLit', () => {
	let list;
	const sampleItems = [
		{ id: '1', label: 'Item 1', secondary: 'Description 1' },
		{ id: '2', label: 'Item 2', secondary: 'Description 2' },
		{ id: '3', label: 'Item 3', secondary: 'Description 3' },
		{ id: '4', label: 'Item 4', disabled: true },
		{ id: '5', label: 'Item 5' }
	];

	beforeEach(async () => {
		list = await fixture(html`<t-list></t-list>`);
	});

	afterEach(() => {
		list?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(list.constructor.tagName).toBe('t-list');
		});

		it('should have correct version', () => {
			expect(list.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(list.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyList = document.createElement('t-list');
			expect(emptyList.items).toEqual([]);
			expect(emptyList.itemHeight).toBe(48);
			expect(emptyList.selectable).toBe('none');
			expect(emptyList.selected).toEqual([]);
			expect(emptyList.dividers).toBe(false);
			expect(emptyList.dense).toBe(false);
			expect(emptyList.loading).toBe(false);
			expect(emptyList.loadingMore).toBe(false);
			expect(emptyList.emptyText).toBe('No items');
			expect(emptyList.groupBy).toBe('');
			expect(emptyList.draggable).toBe(false);
			expect(emptyList.virtual).toBe(false);
			expect(emptyList.overscan).toBe(5);
			expect(emptyList.itemKey).toBe('id');
		});

		it('should update items property', async () => {
			list.items = sampleItems;
			await list.updateComplete;
			expect(list.items).toEqual(sampleItems);
		});

		it('should update selectable property', async () => {
			list.selectable = 'single';
			await list.updateComplete;
			expect(list.selectable).toBe('single');
			expect(list.getAttribute('selectable')).toBe('single');
		});

		it('should update selected property', async () => {
			list.items = sampleItems;
			list.selected = ['1', '2'];
			await list.updateComplete;
			expect(list.selected).toEqual(['1', '2']);
		});

		it('should update dividers property', async () => {
			list.dividers = true;
			await list.updateComplete;
			expect(list.dividers).toBe(true);
			expect(list.hasAttribute('dividers')).toBe(true);
		});

		it('should update dense property', async () => {
			list.dense = true;
			await list.updateComplete;
			expect(list.dense).toBe(true);
			expect(list.hasAttribute('dense')).toBe(true);
		});

		it('should update loading property', async () => {
			list.loading = true;
			await list.updateComplete;
			expect(list.loading).toBe(true);
		});

		it('should update draggable property', async () => {
			list.draggable = true;
			await list.updateComplete;
			expect(list.draggable).toBe(true);
			expect(list.hasAttribute('draggable')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-list
					selectable="multiple"
					dividers
					dense
					item-height="60"
					empty-text="Nothing here"
				></t-list>
			`);

			expect(withAttrs.selectable).toBe('multiple');
			expect(withAttrs.dividers).toBe(true);
			expect(withAttrs.dense).toBe(true);
			expect(withAttrs.itemHeight).toBe(60);
			expect(withAttrs.emptyText).toBe('Nothing here');

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		beforeEach(async () => {
			list.items = sampleItems;
			list.selectable = 'multiple';
			await list.updateComplete;
		});

		it('select() should add item to selection', async () => {
			list.select('1');
			await list.updateComplete;
			expect(list.selected).toContain('1');
		});

		it('select() should replace selection in single mode', async () => {
			list.selectable = 'single';
			await list.updateComplete;

			list.select('1');
			list.select('2');
			await list.updateComplete;

			expect(list.selected).toEqual(['2']);
		});

		it('select() should do nothing in none mode', async () => {
			list.selectable = 'none';
			await list.updateComplete;

			list.select('1');
			expect(list.selected).toEqual([]);
		});

		it('deselect() should remove item from selection', async () => {
			list.selected = ['1', '2', '3'];
			await list.updateComplete;

			list.deselect('2');
			await list.updateComplete;

			expect(list.selected).toEqual(['1', '3']);
		});

		it('toggleSelection() should toggle item selection', async () => {
			list.toggleSelection('1');
			await list.updateComplete;
			expect(list.selected).toContain('1');

			list.toggleSelection('1');
			await list.updateComplete;
			expect(list.selected).not.toContain('1');
		});

		it('selectAll() should select all items', async () => {
			list.selectAll();
			await list.updateComplete;

			expect(list.selected.length).toBe(sampleItems.length);
			sampleItems.forEach(item => {
				expect(list.selected).toContain(item.id);
			});
		});

		it('selectAll() should do nothing in single mode', async () => {
			list.selectable = 'single';
			await list.updateComplete;

			list.selectAll();
			expect(list.selected).toEqual([]);
		});

		it('clearSelection() should clear all selections', async () => {
			list.selected = ['1', '2', '3'];
			await list.updateComplete;

			list.clearSelection();
			await list.updateComplete;

			expect(list.selected).toEqual([]);
		});

		it('focusItem() should focus an item by index', async () => {
			list.focusItem(2);
			await list.updateComplete;

			expect(list._focusedIndex).toBe(2);
		});

		it('focusItem() should not focus invalid index', async () => {
			list.focusItem(-1);
			expect(list._focusedIndex).toBe(-1);

			list.focusItem(100);
			expect(list._focusedIndex).toBe(-1);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		beforeEach(async () => {
			list.items = sampleItems;
			list.selectable = 'multiple';
			await list.updateComplete;
		});

		it('should fire item-click event', async () => {
			const handler = vi.fn();
			list.addEventListener('item-click', handler);

			const item = list.shadowRoot.querySelector('.list-item');
			item.click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('1');
			expect(handler.mock.calls[0][0].detail.index).toBe(0);
		});

		it('should fire selection-change event', async () => {
			const handler = vi.fn();
			list.addEventListener('selection-change', handler);

			list.select('1');

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.selected).toContain('1');
		});

		it('should fire load-more event when scrolling to bottom', async () => {
			list.style.height = '100px';
			list.items = Array.from({ length: 50 }, (_, i) => ({ id: `${i}`, label: `Item ${i}` }));
			await list.updateComplete;

			const handler = vi.fn();
			list.addEventListener('load-more', handler);

			const viewport = list.shadowRoot.querySelector('.list-viewport');
			if (viewport) {
				// Simulate scroll to bottom
				Object.defineProperty(viewport, 'scrollHeight', { value: 2400 });
				Object.defineProperty(viewport, 'clientHeight', { value: 100 });
				viewport.scrollTop = 2250;
				viewport.dispatchEvent(new Event('scroll'));
			}

			expect(handler).toHaveBeenCalled();
		});

		it('should fire reorder event on drag drop', async () => {
			list.draggable = true;
			await list.updateComplete;

			const handler = vi.fn();
			list.addEventListener('reorder', handler);

			// Simulate drag
			list._draggedIndex = 0;
			list._handleDrop({ preventDefault: vi.fn() }, 2);

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.fromIndex).toBe(0);
			expect(handler.mock.calls[0][0].detail.toIndex).toBe(2);
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('item-click', handler);

			const item = list.shadowRoot.querySelector('.list-item');
			item.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('item-click', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await list.updateComplete;
			expect(list.shadowRoot).toBeTruthy();
		});

		it('should render empty state when no items', async () => {
			await list.updateComplete;
			const empty = list.shadowRoot.querySelector('.empty-state');
			expect(empty).toBeTruthy();
		});

		it('should render custom empty text', async () => {
			list.emptyText = 'Nothing here';
			await list.updateComplete;

			const emptyText = list.shadowRoot.querySelector('.empty-text');
			expect(emptyText.textContent).toBe('Nothing here');
		});

		it('should render loading state', async () => {
			list.loading = true;
			await list.updateComplete;

			const loading = list.shadowRoot.querySelector('.loading-container');
			expect(loading).toBeTruthy();
		});

		it('should render list items', async () => {
			list.items = sampleItems;
			await list.updateComplete;

			const items = list.shadowRoot.querySelectorAll('.list-item');
			expect(items.length).toBe(sampleItems.length);
		});

		it('should render item labels', async () => {
			list.items = sampleItems;
			await list.updateComplete;

			const primary = list.shadowRoot.querySelector('.item-primary');
			expect(primary.textContent).toBe('Item 1');
		});

		it('should render secondary text', async () => {
			list.items = sampleItems;
			await list.updateComplete;

			const secondary = list.shadowRoot.querySelector('.item-secondary');
			expect(secondary.textContent).toBe('Description 1');
		});

		it('should render selected state', async () => {
			list.items = sampleItems;
			list.selectable = 'single';
			list.selected = ['1'];
			await list.updateComplete;

			const selected = list.shadowRoot.querySelector('.list-item.selected');
			expect(selected).toBeTruthy();
		});

		it('should render checkboxes in multiple mode', async () => {
			list.items = sampleItems;
			list.selectable = 'multiple';
			await list.updateComplete;

			const checkbox = list.shadowRoot.querySelector('.item-checkbox');
			expect(checkbox).toBeTruthy();
		});

		it('should render drag handles when draggable', async () => {
			list.items = sampleItems;
			list.draggable = true;
			await list.updateComplete;

			const handle = list.shadowRoot.querySelector('.drag-handle');
			expect(handle).toBeTruthy();
		});

		it('should render disabled items', async () => {
			list.items = sampleItems;
			await list.updateComplete;

			const disabled = list.shadowRoot.querySelector('.list-item.disabled');
			expect(disabled).toBeTruthy();
		});

		it('should render loading more indicator', async () => {
			list.items = sampleItems;
			list.loadingMore = true;
			await list.updateComplete;

			const loadingMore = list.shadowRoot.querySelector('.loading-more');
			expect(loadingMore).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 6: Grouping
	// ======================================================
	describe('Grouping', () => {
		const groupedItems = [
			{ id: '1', label: 'Apple', category: 'Fruits' },
			{ id: '2', label: 'Banana', category: 'Fruits' },
			{ id: '3', label: 'Carrot', category: 'Vegetables' },
			{ id: '4', label: 'Potato', category: 'Vegetables' }
		];

		it('should render group headers', async () => {
			list.items = groupedItems;
			list.groupBy = 'category';
			await list.updateComplete;

			const headers = list.shadowRoot.querySelectorAll('.group-header');
			expect(headers.length).toBe(2);
		});

		it('should render correct group names', async () => {
			list.items = groupedItems;
			list.groupBy = 'category';
			await list.updateComplete;

			const headers = list.shadowRoot.querySelectorAll('.group-header');
			const groupNames = Array.from(headers).map(h => h.textContent.trim());
			expect(groupNames).toContain('Fruits');
			expect(groupNames).toContain('Vegetables');
		});
	});

	// ======================================================
	// SUITE 7: Keyboard Navigation
	// ======================================================
	describe('Keyboard Navigation', () => {
		beforeEach(async () => {
			list.items = sampleItems;
			list.selectable = 'single';
			await list.updateComplete;
		});

		it('should navigate down with ArrowDown', async () => {
			list.focusItem(0);
			await list.updateComplete;

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
			await list.updateComplete;

			expect(list._focusedIndex).toBe(1);
		});

		it('should navigate up with ArrowUp', async () => {
			list.focusItem(2);
			await list.updateComplete;

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
			await list.updateComplete;

			expect(list._focusedIndex).toBe(1);
		});

		it('should go to first with Home', async () => {
			list.focusItem(3);
			await list.updateComplete;

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
			await list.updateComplete;

			expect(list._focusedIndex).toBe(0);
		});

		it('should go to last with End', async () => {
			list.focusItem(0);
			await list.updateComplete;

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
			await list.updateComplete;

			expect(list._focusedIndex).toBe(sampleItems.length - 1);
		});

		it('should select with Enter', async () => {
			list.focusItem(0);
			await list.updateComplete;

			const handler = vi.fn();
			list.addEventListener('item-click', handler);

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(handler).toHaveBeenCalled();
		});

		it('should select all with Ctrl+A in multiple mode', async () => {
			list.selectable = 'multiple';
			await list.updateComplete;

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
			await list.updateComplete;

			expect(list.selected.length).toBe(sampleItems.length);
		});

		it('should clear selection with Escape', async () => {
			list.selected = ['1', '2'];
			await list.updateComplete;

			list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
			await list.updateComplete;

			expect(list.selected).toEqual([]);
		});
	});

	// ======================================================
	// SUITE 8: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(list._logger).toBeTruthy();
		});
	});
});
