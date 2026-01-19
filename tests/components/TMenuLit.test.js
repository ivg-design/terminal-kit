/**
 * TMenuLit Component Tests
 * FULL profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TMenuLit.js';

describe('TMenuLit', () => {
	let menu;
	const testItems = [
		{ id: 'item1', label: 'Item 1' },
		{ id: 'item2', label: 'Item 2' },
		{ id: 'item3', label: 'Item 3', disabled: true },
		{ id: 'divider1', divider: true },
		{ id: 'item4', label: 'Item 4' }
	];

	beforeEach(async () => {
		menu = await fixture(html`
			<t-menu>
				<button slot="trigger">Open Menu</button>
			</t-menu>
		`);
		menu.items = testItems;
		await menu.updateComplete;
	});

	afterEach(() => {
		menu?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(menu.constructor.tagName).toBe('t-menu');
		});

		it('should have correct version', () => {
			expect(menu.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(menu.constructor.category).toBe('Core');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyMenu = document.createElement('t-menu');
			expect(emptyMenu.items).toEqual([]);
			expect(emptyMenu.trigger).toBe('click');
			expect(emptyMenu.position).toBe('bottom-start');
			expect(emptyMenu.open).toBe(false);
			expect(emptyMenu.searchable).toBe(false);
			expect(emptyMenu.maxHeight).toBe('300px');
		});

		it('should update items property', async () => {
			const newItems = [{ id: 'new', label: 'New Item' }];
			menu.items = newItems;
			await menu.updateComplete;
			expect(menu.items).toEqual(newItems);
		});

		it('should update trigger property', async () => {
			menu.trigger = 'hover';
			await menu.updateComplete;
			expect(menu.trigger).toBe('hover');
			expect(menu.getAttribute('trigger')).toBe('hover');
		});

		it('should update position property', async () => {
			menu.position = 'top-end';
			await menu.updateComplete;
			expect(menu.position).toBe('top-end');
			expect(menu.getAttribute('position')).toBe('top-end');
		});

		it('should update open property', async () => {
			menu.open = true;
			await menu.updateComplete;
			expect(menu.open).toBe(true);
			expect(menu.hasAttribute('open')).toBe(true);
		});

		it('should update searchable property', async () => {
			menu.searchable = true;
			await menu.updateComplete;
			expect(menu.searchable).toBe(true);
			expect(menu.hasAttribute('searchable')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-menu
					trigger="hover"
					position="top-start"
					searchable
				>
					<button slot="trigger">Menu</button>
				</t-menu>
			`);

			expect(withAttrs.trigger).toBe('hover');
			expect(withAttrs.position).toBe('top-start');
			expect(withAttrs.searchable).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('show() should open the menu', async () => {
			menu.show();
			await menu.updateComplete;
			expect(menu.open).toBe(true);
		});

		it('hide() should close the menu', async () => {
			menu.open = true;
			await menu.updateComplete;

			menu.hide();
			await menu.updateComplete;
			expect(menu.open).toBe(false);
		});

		it('toggle() should toggle menu state', async () => {
			expect(menu.open).toBe(false);

			menu.toggle();
			await menu.updateComplete;
			expect(menu.open).toBe(true);

			menu.toggle();
			await menu.updateComplete;
			expect(menu.open).toBe(false);
		});

		it('selectItem() should select an item by ID', async () => {
			const handler = vi.fn();
			menu.addEventListener('menu-select', handler);

			menu.selectItem('item1');
			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('item1');
		});

		it('selectItem() should not select disabled item', async () => {
			const handler = vi.fn();
			menu.addEventListener('menu-select', handler);

			menu.selectItem('item3'); // disabled item
			expect(handler).not.toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire menu-open when opened', async () => {
			const handler = vi.fn();
			menu.addEventListener('menu-open', handler);

			menu.show();
			await menu.updateComplete;

			expect(handler).toHaveBeenCalled();
		});

		it('should fire menu-close when closed', async () => {
			menu.open = true;
			await menu.updateComplete;

			const handler = vi.fn();
			menu.addEventListener('menu-close', handler);

			menu.hide();
			await menu.updateComplete;

			expect(handler).toHaveBeenCalled();
		});

		it('should fire menu-select when item is clicked', async () => {
			menu.open = true;
			await menu.updateComplete;

			const handler = vi.fn();
			menu.addEventListener('menu-select', handler);

			const item = menu.shadowRoot.querySelector('.menu-item');
			item.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.detail.id).toBe('item1');
			expect(event.detail.label).toBe('Item 1');
		});

		it('menu-select should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('menu-select', handler);

			menu.selectItem('item1');

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('menu-select', handler);
		});

		it('should not fire menu-select for disabled items', async () => {
			menu.open = true;
			await menu.updateComplete;

			const handler = vi.fn();
			menu.addEventListener('menu-select', handler);

			const disabledItem = menu.shadowRoot.querySelectorAll('.menu-item')[2]; // item3 is disabled
			disabledItem.click();

			expect(handler).not.toHaveBeenCalled();
		});

		it('should close menu after item selection', async () => {
			menu.open = true;
			await menu.updateComplete;

			menu.selectItem('item1');
			await menu.updateComplete;

			expect(menu.open).toBe(false);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await menu.updateComplete;
			expect(menu.shadowRoot).toBeTruthy();
		});

		it('should render trigger slot', async () => {
			await menu.updateComplete;
			const slot = menu.shadowRoot.querySelector('slot[name="trigger"]');
			expect(slot).toBeTruthy();
		});

		it('should render menu container', async () => {
			await menu.updateComplete;
			const container = menu.shadowRoot.querySelector('.menu-container');
			expect(container).toBeTruthy();
		});

		it('should render menu items', async () => {
			menu.open = true;
			await menu.updateComplete;

			const items = menu.shadowRoot.querySelectorAll('.menu-item');
			expect(items.length).toBeGreaterThan(0);
		});

		it('should render dividers', async () => {
			menu.open = true;
			await menu.updateComplete;

			const dividers = menu.shadowRoot.querySelectorAll('.menu-divider');
			expect(dividers.length).toBe(1);
		});

		it('should apply position class', async () => {
			menu.position = 'top-end';
			await menu.updateComplete;

			const container = menu.shadowRoot.querySelector('.menu-container');
			expect(container.classList.contains('top-end')).toBe(true);
		});

		it('should apply open class when open', async () => {
			menu.open = true;
			await menu.updateComplete;

			const container = menu.shadowRoot.querySelector('.menu-container');
			expect(container.classList.contains('open')).toBe(true);
		});

		it('should render search input when searchable', async () => {
			menu.searchable = true;
			menu.open = true;
			await menu.updateComplete;

			const searchInput = menu.shadowRoot.querySelector('.menu-search input');
			expect(searchInput).toBeTruthy();
		});

		it('should not render search input when not searchable', async () => {
			menu.searchable = false;
			menu.open = true;
			await menu.updateComplete;

			const searchInput = menu.shadowRoot.querySelector('.menu-search input');
			expect(searchInput).toBeFalsy();
		});

		it('should apply disabled class to disabled items', async () => {
			menu.open = true;
			await menu.updateComplete;

			const disabledItem = menu.shadowRoot.querySelectorAll('.menu-item')[2];
			expect(disabledItem.classList.contains('disabled')).toBe(true);
		});

		it('should have correct ARIA attributes', async () => {
			menu.open = true;
			await menu.updateComplete;

			const container = menu.shadowRoot.querySelector('.menu-container');
			expect(container.getAttribute('role')).toBe('menu');
			expect(container.getAttribute('aria-hidden')).toBe('false');

			const item = menu.shadowRoot.querySelector('.menu-item');
			expect(item.getAttribute('role')).toBe('menuitem');
		});
	});

	// ======================================================
	// SUITE 6: Search Functionality
	// ======================================================
	describe('Search Functionality', () => {
		beforeEach(async () => {
			menu.searchable = true;
			menu.items = [
				{ id: 'apple', label: 'Apple' },
				{ id: 'banana', label: 'Banana' },
				{ id: 'cherry', label: 'Cherry' }
			];
			menu.open = true;
			await menu.updateComplete;
		});

		it('should filter items based on search query', async () => {
			const searchInput = menu.shadowRoot.querySelector('.menu-search input');
			searchInput.value = 'app';
			searchInput.dispatchEvent(new Event('input'));
			await menu.updateComplete;

			const items = menu.shadowRoot.querySelectorAll('.menu-item');
			expect(items.length).toBe(1);
			expect(items[0].textContent).toContain('Apple');
		});

		it('should show empty state when no matches', async () => {
			const searchInput = menu.shadowRoot.querySelector('.menu-search input');
			searchInput.value = 'xyz';
			searchInput.dispatchEvent(new Event('input'));
			await menu.updateComplete;

			const empty = menu.shadowRoot.querySelector('.menu-empty');
			expect(empty).toBeTruthy();
		});

		it('should be case insensitive', async () => {
			const searchInput = menu.shadowRoot.querySelector('.menu-search input');
			searchInput.value = 'APPLE';
			searchInput.dispatchEvent(new Event('input'));
			await menu.updateComplete;

			const items = menu.shadowRoot.querySelectorAll('.menu-item');
			expect(items.length).toBe(1);
		});
	});

	// ======================================================
	// SUITE 7: Keyboard Navigation
	// ======================================================
	describe('Keyboard Navigation', () => {
		beforeEach(async () => {
			menu.open = true;
			await menu.updateComplete;
		});

		it('should close on Escape key', async () => {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
			await menu.updateComplete;

			expect(menu.open).toBe(false);
		});

		it('should move focus on ArrowDown', async () => {
			// Focus first item
			menu._focusedIndex = 0;
			await menu.updateComplete;

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
			await menu.updateComplete;

			expect(menu._focusedIndex).toBe(1);
		});

		it('should move focus on ArrowUp', async () => {
			// Focus second item
			menu._focusedIndex = 1;
			await menu.updateComplete;

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
			await menu.updateComplete;

			expect(menu._focusedIndex).toBe(0);
		});

		it('should select item on Enter', async () => {
			const handler = vi.fn();
			menu.addEventListener('menu-select', handler);

			menu._focusedIndex = 0;
			await menu.updateComplete;

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
			await menu.updateComplete;

			expect(handler).toHaveBeenCalled();
		});

		it('should select item on Space', async () => {
			const handler = vi.fn();
			menu.addEventListener('menu-select', handler);

			menu._focusedIndex = 0;
			await menu.updateComplete;

			document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
			await menu.updateComplete;

			expect(handler).toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 8: Trigger Types
	// ======================================================
	describe('Trigger Types', () => {
		it('click trigger should toggle on click', async () => {
			menu.trigger = 'click';
			await menu.updateComplete;

			const trigger = menu.shadowRoot.querySelector('.trigger');
			trigger.click();
			await menu.updateComplete;

			expect(menu.open).toBe(true);
		});
	});

	// ======================================================
	// SUITE 9: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(menu._logger).toBeTruthy();
		});
	});
});
