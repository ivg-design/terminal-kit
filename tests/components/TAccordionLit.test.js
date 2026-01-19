/**
 * TAccordionLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TAccordionLit.js';

// ============================================================
// SECTION 1: TAccordionItemLit Tests
// ============================================================

describe('TAccordionItemLit', () => {
	let item;

	beforeEach(async () => {
		item = await fixture(html`
			<t-accordion-item item-id="item1" title="Test Item">
				<p>Item content goes here</p>
			</t-accordion-item>
		`);
	});

	afterEach(() => {
		item?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(item.constructor.tagName).toBe('t-accordion-item');
		});

		it('should have correct version', () => {
			expect(item.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(item.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyItem = document.createElement('t-accordion-item');
			expect(emptyItem.itemId).toBe('');
			expect(emptyItem.title).toBe('');
			expect(emptyItem.subtitle).toBe('');
			expect(emptyItem.badge).toBe('');
			expect(emptyItem.expanded).toBe(false);
			expect(emptyItem.disabled).toBe(false);
			expect(emptyItem.animated).toBe(false);
			expect(emptyItem.variant).toBe('default');
			expect(emptyItem.size).toBe('md');
			expect(emptyItem.iconPosition).toBe('left');
			expect(emptyItem.orientation).toBe('vertical');
		});

		it('should set itemId from attribute', () => {
			expect(item.itemId).toBe('item1');
			expect(item.getAttribute('item-id')).toBe('item1');
		});

		it('should set title from attribute', () => {
			expect(item.title).toBe('Test Item');
			expect(item.getAttribute('title')).toBe('Test Item');
		});

		it('should update subtitle property', async () => {
			item.subtitle = 'A subtitle';
			await item.updateComplete;
			expect(item.subtitle).toBe('A subtitle');
		});

		it('should update badge property', async () => {
			item.badge = 'NEW';
			await item.updateComplete;
			expect(item.badge).toBe('NEW');
		});

		it('should update expanded property', async () => {
			item.expanded = true;
			await item.updateComplete;
			expect(item.expanded).toBe(true);
			expect(item.hasAttribute('expanded')).toBe(true);
		});

		it('should update disabled property', async () => {
			item.disabled = true;
			await item.updateComplete;
			expect(item.disabled).toBe(true);
			expect(item.hasAttribute('disabled')).toBe(true);
		});

		it('should update animated property', async () => {
			item.animated = true;
			await item.updateComplete;
			expect(item.animated).toBe(true);
			expect(item.hasAttribute('animated')).toBe(true);
		});

		it('should update variant property', async () => {
			item.variant = 'bordered';
			await item.updateComplete;
			expect(item.variant).toBe('bordered');
			expect(item.getAttribute('variant')).toBe('bordered');
		});

		it('should update size property', async () => {
			item.size = 'lg';
			await item.updateComplete;
			expect(item.size).toBe('lg');
			expect(item.getAttribute('size')).toBe('lg');
		});

		it('should update iconPosition property', async () => {
			item.iconPosition = 'right';
			await item.updateComplete;
			expect(item.iconPosition).toBe('right');
			expect(item.getAttribute('icon-position')).toBe('right');
		});

		it('should update orientation property', async () => {
			item.orientation = 'horizontal';
			await item.updateComplete;
			expect(item.orientation).toBe('horizontal');
			expect(item.getAttribute('orientation')).toBe('horizontal');
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('toggle() should toggle expanded state', async () => {
			expect(item.expanded).toBe(false);
			item.toggle();
			await item.updateComplete;
			expect(item.expanded).toBe(true);
			item.toggle();
			await item.updateComplete;
			expect(item.expanded).toBe(false);
		});

		it('toggle() should not work when disabled', async () => {
			item.disabled = true;
			await item.updateComplete;
			item.toggle();
			await item.updateComplete;
			expect(item.expanded).toBe(false);
		});

		it('expand() should expand the item', async () => {
			expect(item.expanded).toBe(false);
			item.expand();
			await item.updateComplete;
			expect(item.expanded).toBe(true);
		});

		it('expand() should not expand when already expanded', async () => {
			item.expanded = true;
			await item.updateComplete;
			const handler = vi.fn();
			item.addEventListener('item-toggle', handler);
			item.expand();
			await item.updateComplete;
			expect(handler).not.toHaveBeenCalled();
		});

		it('expand() should not work when disabled', async () => {
			item.disabled = true;
			await item.updateComplete;
			item.expand();
			await item.updateComplete;
			expect(item.expanded).toBe(false);
		});

		it('collapse() should collapse the item', async () => {
			item.expanded = true;
			await item.updateComplete;
			item.collapse();
			await item.updateComplete;
			expect(item.expanded).toBe(false);
		});

		it('collapse() should not collapse when already collapsed', async () => {
			const handler = vi.fn();
			item.addEventListener('item-toggle', handler);
			item.collapse();
			await item.updateComplete;
			expect(handler).not.toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire item-toggle when toggled', async () => {
			const handler = vi.fn();
			item.addEventListener('item-toggle', handler);

			item.toggle();
			await item.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.itemId).toBe('item1');
			expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
		});

		it('should fire item-toggle when expanded', async () => {
			const handler = vi.fn();
			item.addEventListener('item-toggle', handler);

			item.expand();
			await item.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
		});

		it('should fire item-toggle when collapsed', async () => {
			item.expanded = true;
			await item.updateComplete;

			const handler = vi.fn();
			item.addEventListener('item-toggle', handler);

			item.collapse();
			await item.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.expanded).toBe(false);
		});

		it('item-toggle should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('item-toggle', handler);

			item.toggle();
			await item.updateComplete;

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('item-toggle', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await item.updateComplete;
			expect(item.shadowRoot).toBeTruthy();
		});

		it('should render item container', async () => {
			await item.updateComplete;
			const itemDiv = item.shadowRoot.querySelector('.item');
			expect(itemDiv).toBeTruthy();
		});

		it('should render header', async () => {
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');
			expect(header).toBeTruthy();
			expect(header.getAttribute('role')).toBe('button');
		});

		it('should render title', async () => {
			await item.updateComplete;
			const title = item.shadowRoot.querySelector('.title');
			expect(title).toBeTruthy();
			expect(title.textContent).toBe('Test Item');
		});

		it('should render subtitle when provided', async () => {
			item.subtitle = 'Subtitle text';
			await item.updateComplete;
			const subtitle = item.shadowRoot.querySelector('.subtitle');
			expect(subtitle).toBeTruthy();
			expect(subtitle.textContent).toBe('Subtitle text');
		});

		it('should not render subtitle when empty', async () => {
			await item.updateComplete;
			const subtitle = item.shadowRoot.querySelector('.subtitle');
			expect(subtitle).toBeFalsy();
		});

		it('should render badge when provided', async () => {
			item.badge = 'NEW';
			await item.updateComplete;
			const badge = item.shadowRoot.querySelector('.badge');
			expect(badge).toBeTruthy();
			expect(badge.textContent).toBe('NEW');
		});

		it('should not render badge when empty', async () => {
			await item.updateComplete;
			const badge = item.shadowRoot.querySelector('.badge');
			expect(badge).toBeFalsy();
		});

		it('should render icon', async () => {
			await item.updateComplete;
			const icon = item.shadowRoot.querySelector('.icon');
			expect(icon).toBeTruthy();
		});

		it('should render content area', async () => {
			await item.updateComplete;
			const content = item.shadowRoot.querySelector('.content');
			expect(content).toBeTruthy();
			expect(content.getAttribute('role')).toBe('region');
		});

		it('should have correct ARIA attributes on header', async () => {
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');

			expect(header.getAttribute('role')).toBe('button');
			expect(header.getAttribute('tabindex')).toBe('0');
			expect(header.getAttribute('aria-expanded')).toBe('false');
		});

		it('should update aria-expanded when expanded', async () => {
			item.expanded = true;
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');
			expect(header.getAttribute('aria-expanded')).toBe('true');
		});

		it('should set tabindex to -1 when disabled', async () => {
			item.disabled = true;
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');
			expect(header.getAttribute('tabindex')).toBe('-1');
		});
	});

	// ======================================================
	// SUITE 6: Click Behavior
	// ======================================================
	describe('Click Behavior', () => {
		it('should toggle on header click', async () => {
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');

			header.click();
			await item.updateComplete;

			expect(item.expanded).toBe(true);
		});

		it('should not toggle when disabled on click', async () => {
			item.disabled = true;
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');

			header.click();
			await item.updateComplete;

			expect(item.expanded).toBe(false);
		});
	});

	// ======================================================
	// SUITE 7: Keyboard Navigation
	// ======================================================
	describe('Keyboard Navigation', () => {
		it('should toggle on Enter key', async () => {
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');

			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			header.dispatchEvent(event);
			await item.updateComplete;

			expect(item.expanded).toBe(true);
		});

		it('should toggle on Space key', async () => {
			await item.updateComplete;
			const header = item.shadowRoot.querySelector('.header');

			const event = new KeyboardEvent('keydown', { key: ' ' });
			header.dispatchEvent(event);
			await item.updateComplete;

			expect(item.expanded).toBe(true);
		});
	});

	// ======================================================
	// SUITE 8: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(item._logger).toBeTruthy();
		});
	});
});

// ============================================================
// SECTION 2: TAccordionLit Tests
// ============================================================

describe('TAccordionLit', () => {
	let accordion;

	beforeEach(async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="item1" title="Item 1">Content 1</t-accordion-item>
				<t-accordion-item item-id="item2" title="Item 2">Content 2</t-accordion-item>
				<t-accordion-item item-id="item3" title="Item 3" disabled>Content 3</t-accordion-item>
			</t-accordion>
		`);
	});

	afterEach(() => {
		accordion?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(accordion.constructor.tagName).toBe('t-accordion');
		});

		it('should have correct version', () => {
			expect(accordion.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(accordion.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyAccordion = document.createElement('t-accordion');
			expect(emptyAccordion.multiple).toBe(false);
			expect(emptyAccordion.bordered).toBe(false);
			expect(emptyAccordion.expandedItems).toEqual([]);
			expect(emptyAccordion.orientation).toBe('vertical');
		});

		it('should update multiple property', async () => {
			accordion.multiple = true;
			await accordion.updateComplete;
			expect(accordion.multiple).toBe(true);
			expect(accordion.hasAttribute('multiple')).toBe(true);
		});

		it('should update bordered property', async () => {
			accordion.bordered = true;
			await accordion.updateComplete;
			expect(accordion.bordered).toBe(true);
			expect(accordion.hasAttribute('bordered')).toBe(true);
		});

		it('should update orientation property', async () => {
			accordion.orientation = 'horizontal';
			await accordion.updateComplete;
			expect(accordion.orientation).toBe('horizontal');
			expect(accordion.getAttribute('orientation')).toBe('horizontal');
		});

		it('should propagate orientation to child items', async () => {
			accordion.orientation = 'horizontal';
			await accordion.updateComplete;

			const items = accordion.querySelectorAll('t-accordion-item');
			items.forEach(item => {
				expect(item.orientation).toBe('horizontal');
			});
		});

		it('should sync expandedItems on firstUpdated', async () => {
			const withExpanded = await fixture(html`
				<t-accordion .expandedItems=${['item1', 'item2']} multiple>
					<t-accordion-item item-id="item1" title="Item 1">Content 1</t-accordion-item>
					<t-accordion-item item-id="item2" title="Item 2">Content 2</t-accordion-item>
				</t-accordion>
			`);

			await withExpanded.updateComplete;

			const items = withExpanded.querySelectorAll('t-accordion-item');
			expect(items[0].expanded).toBe(true);
			expect(items[1].expanded).toBe(true);

			withExpanded.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('getItems() should return all accordion items', () => {
			const items = accordion.getItems();
			expect(items.length).toBe(3);
			expect(items[0].itemId).toBe('item1');
			expect(items[1].itemId).toBe('item2');
			expect(items[2].itemId).toBe('item3');
		});

		it('getExpandedItems() should return expanded items', async () => {
			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].expanded = true;
			items[1].expanded = true;
			await accordion.updateComplete;

			const expanded = accordion.getExpandedItems();
			expect(expanded.length).toBe(2);
		});

		it('expandAll() should expand all items when multiple=true', async () => {
			accordion.multiple = true;
			await accordion.updateComplete;

			accordion.expandAll();
			await accordion.updateComplete;

			// Wait for child updates
			await new Promise(resolve => setTimeout(resolve, 0));

			const items = accordion.querySelectorAll('t-accordion-item:not([disabled])');
			items.forEach(item => {
				expect(item.expanded).toBe(true);
			});
		});

		it('expandAll() should not expand when multiple=false', async () => {
			accordion.expandAll();
			await accordion.updateComplete;

			const expanded = accordion.getExpandedItems();
			expect(expanded.length).toBe(0);
		});

		it('collapseAll() should collapse all items', async () => {
			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].expanded = true;
			items[1].expanded = true;
			await accordion.updateComplete;

			accordion.collapseAll();
			await accordion.updateComplete;

			const expanded = accordion.getExpandedItems();
			expect(expanded.length).toBe(0);
			expect(accordion.expandedItems).toEqual([]);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire accordion-change when item is toggled', async () => {
			const handler = vi.fn();
			accordion.addEventListener('accordion-change', handler);

			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].toggle();
			await accordion.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.itemId).toBe('item1');
			expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
			expect(handler.mock.calls[0][0].detail.expandedItems).toContain('item1');
		});

		it('should update expandedItems when item expands', async () => {
			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].toggle();
			await accordion.updateComplete;

			expect(accordion.expandedItems).toContain('item1');
		});

		it('should update expandedItems when item collapses', async () => {
			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].toggle(); // expand
			await accordion.updateComplete;
			items[0].toggle(); // collapse
			await accordion.updateComplete;

			expect(accordion.expandedItems).not.toContain('item1');
		});

		it('accordion-change should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('accordion-change', handler);

			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].toggle();
			await accordion.updateComplete;

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('accordion-change', handler);
		});

		it('should fire accordion-change on collapseAll()', async () => {
			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].expanded = true;
			await accordion.updateComplete;

			const handler = vi.fn();
			accordion.addEventListener('accordion-change', handler);

			accordion.collapseAll();
			await accordion.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.expandedItems).toEqual([]);
		});
	});

	// ======================================================
	// SUITE 5: Single vs Multiple Mode
	// ======================================================
	describe('Single vs Multiple Mode', () => {
		it('should collapse other items in single mode', async () => {
			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].toggle();
			await accordion.updateComplete;

			expect(items[0].expanded).toBe(true);

			items[1].toggle();
			await accordion.updateComplete;

			// In single mode, only one should be expanded
			expect(items[0].expanded).toBe(false);
			expect(items[1].expanded).toBe(true);
		});

		it('should allow multiple items in multiple mode', async () => {
			accordion.multiple = true;
			await accordion.updateComplete;

			const items = accordion.querySelectorAll('t-accordion-item');
			items[0].toggle();
			await accordion.updateComplete;
			items[1].toggle();
			await accordion.updateComplete;

			expect(items[0].expanded).toBe(true);
			expect(items[1].expanded).toBe(true);
			expect(accordion.expandedItems).toContain('item1');
			expect(accordion.expandedItems).toContain('item2');
		});
	});

	// ======================================================
	// SUITE 6: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await accordion.updateComplete;
			expect(accordion.shadowRoot).toBeTruthy();
		});

		it('should render accordion container', async () => {
			await accordion.updateComplete;
			const container = accordion.shadowRoot.querySelector('.accordion');
			expect(container).toBeTruthy();
		});

		it('should have correct ARIA role on container', async () => {
			await accordion.updateComplete;
			const container = accordion.shadowRoot.querySelector('.accordion');
			expect(container.getAttribute('role')).toBe('tablist');
		});

		it('should render slot for items', async () => {
			await accordion.updateComplete;
			const slot = accordion.shadowRoot.querySelector('slot');
			expect(slot).toBeTruthy();
		});

		it('should render all child items', async () => {
			await accordion.updateComplete;
			const items = accordion.querySelectorAll('t-accordion-item');
			expect(items.length).toBe(3);
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(accordion._logger).toBeTruthy();
		});
	});
});

// ============================================================
// SECTION 3: Integration Tests
// ============================================================

describe('TAccordion Integration', () => {
	let accordion;

	afterEach(() => {
		accordion?.remove();
	});

	it('should work with nested content', async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="nested" title="Nested Content">
					<div class="nested-content">
						<h3>Header</h3>
						<p>Paragraph text</p>
					</div>
				</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		const item = accordion.querySelector('t-accordion-item');
		item.toggle();
		await item.updateComplete;

		expect(item.expanded).toBe(true);
	});

	it('should work with animated items', async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="anim1" title="Animated" animated>Content</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		const item = accordion.querySelector('t-accordion-item');
		expect(item.animated).toBe(true);
	});

	it('should work with different variants', async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="v1" title="Bordered" variant="bordered">Content</t-accordion-item>
				<t-accordion-item item-id="v2" title="Flush" variant="flush">Content</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		const items = accordion.querySelectorAll('t-accordion-item');
		expect(items[0].variant).toBe('bordered');
		expect(items[1].variant).toBe('flush');
	});

	it('should work with different sizes', async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="s1" title="Small" size="sm">Content</t-accordion-item>
				<t-accordion-item item-id="s2" title="Medium" size="md">Content</t-accordion-item>
				<t-accordion-item item-id="s3" title="Large" size="lg">Content</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		const items = accordion.querySelectorAll('t-accordion-item');
		expect(items[0].size).toBe('sm');
		expect(items[1].size).toBe('md');
		expect(items[2].size).toBe('lg');
	});

	it('should handle horizontal orientation', async () => {
		accordion = await fixture(html`
			<t-accordion orientation="horizontal">
				<t-accordion-item item-id="h1" title="Horizontal 1">Content</t-accordion-item>
				<t-accordion-item item-id="h2" title="Horizontal 2">Content</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		expect(accordion.orientation).toBe('horizontal');

		const items = accordion.querySelectorAll('t-accordion-item');
		items.forEach(item => {
			expect(item.orientation).toBe('horizontal');
		});
	});

	it('should handle icon position right', async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="r1" title="Icon Right" icon-position="right">Content</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		const item = accordion.querySelector('t-accordion-item');
		expect(item.iconPosition).toBe('right');
	});

	it('should handle disabled items correctly', async () => {
		accordion = await fixture(html`
			<t-accordion>
				<t-accordion-item item-id="d1" title="Disabled Item" disabled>Content</t-accordion-item>
			</t-accordion>
		`);

		await accordion.updateComplete;
		const item = accordion.querySelector('t-accordion-item');

		item.toggle();
		await item.updateComplete;

		expect(item.expanded).toBe(false);
	});
});
