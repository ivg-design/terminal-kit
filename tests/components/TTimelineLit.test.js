/**
 * TTimelineLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TTimelineLit.js';

describe('TTimelineLit', () => {
	let timeline;
	const testItems = [
		{ id: 'item1', title: 'Event 1', date: '2024-01-15', description: 'First event' },
		{ id: 'item2', title: 'Event 2', date: '2024-01-16', description: 'Second event', expandable: true },
		{ id: 'item3', title: 'Event 3', date: '2024-01-17', variant: 'success', clickable: true }
	];

	beforeEach(async () => {
		timeline = await fixture(html`<t-tmln></t-tmln>`);
		timeline.items = testItems;
		await timeline.updateComplete;
	});

	afterEach(() => {
		timeline?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(timeline.constructor.tagName).toBe('t-tmln');
		});

		it('should have correct version', () => {
			expect(timeline.constructor.version).toBe('3.1.0');
		});

		it('should have correct category', () => {
			expect(timeline.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyTimeline = document.createElement('t-tmln');
			expect(emptyTimeline.items).toEqual([]);
			expect(emptyTimeline.orientation).toBe('vertical');
			expect(emptyTimeline.linePosition).toBe(null); // Auto-detect based on orientation
			expect(emptyTimeline.contentAlign).toBe('center');
			expect(emptyTimeline.dense).toBe(false);
			expect(emptyTimeline.loading).toBe(false);
			expect(emptyTimeline.loadingMore).toBe(false);
			expect(emptyTimeline.dotSize).toBe('md');
			expect(emptyTimeline.dotShape).toBe('circle');
			expect(emptyTimeline.dotColorMode).toBe('variant');
		});

		it('should update items property', async () => {
			const newItems = [{ id: 'new', title: 'New Event' }];
			timeline.items = newItems;
			await timeline.updateComplete;
			expect(timeline.items).toEqual(newItems);
		});

		it('should update linePosition property', async () => {
			timeline.linePosition = 'right';
			await timeline.updateComplete;
			expect(timeline.linePosition).toBe('right');
			expect(timeline.getAttribute('line-position')).toBe('right');
		});

		it('should update dense property', async () => {
			timeline.dense = true;
			await timeline.updateComplete;
			expect(timeline.dense).toBe(true);
			expect(timeline.hasAttribute('dense')).toBe(true);
		});

		it('should update loading property', async () => {
			timeline.loading = true;
			await timeline.updateComplete;
			expect(timeline.loading).toBe(true);
			expect(timeline.hasAttribute('loading')).toBe(true);
		});

		it('should update loadingMore property', async () => {
			timeline.loadingMore = true;
			await timeline.updateComplete;
			expect(timeline.loadingMore).toBe(true);
			expect(timeline.hasAttribute('loading-more')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-tmln orientation="horizontal" line-position="bottom" dense loading></t-tmln>
			`);

			expect(withAttrs.orientation).toBe('horizontal');
			expect(withAttrs.linePosition).toBe('bottom');
			expect(withAttrs.dense).toBe(true);
			expect(withAttrs.loading).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('expandItem() should expand an expandable item', async () => {
			timeline.expandItem('item2');
			await timeline.updateComplete;
			expect(timeline.isExpanded('item2')).toBe(true);
		});

		it('expandItem() should not expand non-expandable item', async () => {
			timeline.expandItem('item1');
			await timeline.updateComplete;
			expect(timeline.isExpanded('item1')).toBe(false);
		});

		it('collapseItem() should collapse an expanded item', async () => {
			timeline.expandItem('item2');
			await timeline.updateComplete;
			expect(timeline.isExpanded('item2')).toBe(true);

			timeline.collapseItem('item2');
			await timeline.updateComplete;
			expect(timeline.isExpanded('item2')).toBe(false);
		});

		it('toggleItem() should toggle item state', async () => {
			expect(timeline.isExpanded('item2')).toBe(false);

			timeline.toggleItem('item2');
			await timeline.updateComplete;
			expect(timeline.isExpanded('item2')).toBe(true);

			timeline.toggleItem('item2');
			await timeline.updateComplete;
			expect(timeline.isExpanded('item2')).toBe(false);
		});

		it('isExpanded() should return correct state', () => {
			expect(timeline.isExpanded('item2')).toBe(false);
			timeline._expandedItems.add('item2');
			expect(timeline.isExpanded('item2')).toBe(true);
		});

		it('loadMore() should emit load-more event', async () => {
			const handler = vi.fn();
			timeline.addEventListener('load-more', handler);

			timeline.loadMore();

			expect(handler).toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire item-expand when item is expanded', async () => {
			const handler = vi.fn();
			timeline.addEventListener('item-expand', handler);

			timeline.expandItem('item2');
			await timeline.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('item2');
			expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
		});

		it('should fire item-expand when item is collapsed', async () => {
			timeline.expandItem('item2');
			await timeline.updateComplete;

			const handler = vi.fn();
			timeline.addEventListener('item-expand', handler);

			timeline.collapseItem('item2');
			await timeline.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.expanded).toBe(false);
		});

		it('should fire item-click when clickable item is clicked', async () => {
			const handler = vi.fn();
			timeline.addEventListener('item-click', handler);

			const items = timeline.shadowRoot.querySelectorAll('.tl-item');
			items[2].click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.id).toBe('item3');
		});

		it('should fire load-more event', async () => {
			const handler = vi.fn();
			timeline.addEventListener('load-more', handler);

			timeline.loadMore();

			expect(handler).toHaveBeenCalled();
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('item-expand', handler);

			timeline.expandItem('item2');

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('item-expand', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await timeline.updateComplete;
			expect(timeline.shadowRoot).toBeTruthy();
		});

		it('should render timeline container', async () => {
			await timeline.updateComplete;
			const container = timeline.shadowRoot.querySelector('.timeline-vertical');
			expect(container).toBeTruthy();
		});

		it('should render timeline items', async () => {
			await timeline.updateComplete;
			const items = timeline.shadowRoot.querySelectorAll('.tl-item');
			expect(items.length).toBe(3);
		});

		it('should render item titles', async () => {
			await timeline.updateComplete;
			const titles = timeline.shadowRoot.querySelectorAll('.tl-title');
			expect(titles[0].textContent).toBe('Event 1');
			expect(titles[1].textContent).toBe('Event 2');
			expect(titles[2].textContent).toBe('Event 3');
		});

		it('should render item dates', async () => {
			await timeline.updateComplete;
			const dates = timeline.shadowRoot.querySelectorAll('.tl-date');
			expect(dates.length).toBe(3);
		});

		it('should render item descriptions', async () => {
			await timeline.updateComplete;
			const descriptions = timeline.shadowRoot.querySelectorAll('.tl-description');
			expect(descriptions.length).toBeGreaterThan(0);
		});

		it('should apply line-right class', async () => {
			timeline.linePosition = 'right';
			await timeline.updateComplete;

			const container = timeline.shadowRoot.querySelector('.timeline-vertical');
			expect(container.classList.contains('line-right')).toBe(true);
		});

		it('should apply timeline-loading class', async () => {
			timeline.loading = true;
			await timeline.updateComplete;

			const container = timeline.shadowRoot.querySelector('.timeline-vertical');
			expect(container.classList.contains('timeline-loading')).toBe(true);
		});

		it('should render loading more indicator', async () => {
			timeline.loadingMore = true;
			await timeline.updateComplete;

			const loadingMore = timeline.shadowRoot.querySelector('.tl-loading-more');
			expect(loadingMore).toBeTruthy();
		});

		it('should render empty state when no items', async () => {
			timeline.items = [];
			await timeline.updateComplete;

			const empty = timeline.shadowRoot.querySelector('.tl-empty');
			expect(empty).toBeTruthy();
		});

		it('should apply variant class to dot', async () => {
			await timeline.updateComplete;

			const dots = timeline.shadowRoot.querySelectorAll('.tl-dot');
			expect(dots[2].classList.contains('success')).toBe(true);
		});

		it('should apply expanded class when item is expanded', async () => {
			timeline.expandItem('item2');
			await timeline.updateComplete;

			const items = timeline.shadowRoot.querySelectorAll('.tl-item');
			expect(items[1].classList.contains('expanded')).toBe(true);
		});

		it('should apply clickable class to clickable items', async () => {
			await timeline.updateComplete;

			const items = timeline.shadowRoot.querySelectorAll('.tl-item');
			expect(items[2].classList.contains('clickable')).toBe(true);
		});
	});

	// ======================================================
	// SUITE 6: Expand Content
	// ======================================================
	describe('Expand Content', () => {
		it('should render expand container for expandable items', async () => {
			await timeline.updateComplete;

			const expandContainers = timeline.shadowRoot.querySelectorAll('.tl-expand');
			expect(expandContainers.length).toBe(1);
		});

		it('should have expand slot for expandable items', async () => {
			await timeline.updateComplete;

			const slot = timeline.shadowRoot.querySelector('slot[name="expand-item2"]');
			expect(slot).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 7: Horizontal Orientation
	// ======================================================
	describe('Horizontal Orientation', () => {
		it('should render horizontal timeline', async () => {
			timeline.orientation = 'horizontal';
			await timeline.updateComplete;

			const container = timeline.shadowRoot.querySelector('.timeline-horizontal');
			expect(container).toBeTruthy();
		});

		it('should place dots above content with line-position=top', async () => {
			timeline.orientation = 'horizontal';
			timeline.linePosition = 'top';
			await timeline.updateComplete;

			const container = timeline.shadowRoot.querySelector('.timeline-horizontal');
			expect(container.classList.contains('line-top')).toBe(true);
		});

		it('should place dots below content with line-position=bottom', async () => {
			timeline.orientation = 'horizontal';
			timeline.linePosition = 'bottom';
			await timeline.updateComplete;

			const container = timeline.shadowRoot.querySelector('.timeline-horizontal');
			expect(container.classList.contains('line-bottom')).toBe(true);
		});
	});

	// ======================================================
	// SUITE 8: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(timeline._logger).toBeTruthy();
		});
	});
});
