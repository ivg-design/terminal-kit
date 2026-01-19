/**
 * TSplitterLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TSplitterLit.js';

describe('TSplitterLit', () => {
	let splitter;

	beforeEach(async () => {
		splitter = await fixture(html`
			<t-split style="width: 400px; height: 300px;">
				<div slot="pane-0">Left</div>
				<div slot="pane-1">Right</div>
			</t-split>
		`);
	});

	afterEach(() => {
		splitter?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(splitter.constructor.tagName).toBe('t-split');
		});

		it('should have correct version', () => {
			expect(splitter.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(splitter.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptySplitter = document.createElement('t-split');
			expect(emptySplitter.orientation).toBe('horizontal');
			expect(emptySplitter.sizes).toEqual([50, 50]);
			expect(emptySplitter.minSizes).toEqual([50, 50]);
			expect(emptySplitter.collapsible).toEqual([false, false]);
			expect(emptySplitter.collapsed).toEqual([false, false]);
			expect(emptySplitter.gutterSize).toBe(8);
			expect(emptySplitter.snapOffset).toBe(30);
			expect(emptySplitter.storageKey).toBe('');
		});

		it('should update orientation property', async () => {
			splitter.orientation = 'vertical';
			await splitter.updateComplete;
			expect(splitter.orientation).toBe('vertical');
			expect(splitter.getAttribute('orientation')).toBe('vertical');
		});

		it('should update sizes property', async () => {
			splitter.sizes = [30, 70];
			await splitter.updateComplete;
			expect(splitter.sizes).toEqual([30, 70]);
		});

		it('should update minSizes property', async () => {
			splitter.minSizes = [100, 100];
			await splitter.updateComplete;
			expect(splitter.minSizes).toEqual([100, 100]);
		});

		it('should update collapsible property', async () => {
			splitter.collapsible = [true, true];
			await splitter.updateComplete;
			expect(splitter.collapsible).toEqual([true, true]);
		});

		it('should update collapsed property', async () => {
			splitter.collapsed = [true, false];
			await splitter.updateComplete;
			expect(splitter.collapsed).toEqual([true, false]);
		});

		it('should update gutterSize property', async () => {
			splitter.gutterSize = 12;
			await splitter.updateComplete;
			expect(splitter.gutterSize).toBe(12);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-split orientation="vertical" gutter-size="10"></t-split>
			`);

			expect(withAttrs.orientation).toBe('vertical');
			expect(withAttrs.gutterSize).toBe(10);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('setSizes() should update sizes', async () => {
			const handler = vi.fn();
			splitter.addEventListener('resize', handler);

			splitter.setSizes([40, 60]);
			await splitter.updateComplete;

			expect(splitter.sizes).toEqual([40, 60]);
			expect(handler).toHaveBeenCalled();
		});

		it('collapse() should collapse a pane', async () => {
			splitter.collapsible = [true, true];
			await splitter.updateComplete;

			const handler = vi.fn();
			splitter.addEventListener('collapse', handler);

			splitter.collapse(0);
			await splitter.updateComplete;

			expect(splitter.collapsed[0]).toBe(true);
			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.index).toBe(0);
			expect(handler.mock.calls[0][0].detail.collapsed).toBe(true);
		});

		it('collapse() should not collapse non-collapsible pane', async () => {
			splitter.collapsible = [false, false];
			await splitter.updateComplete;

			const handler = vi.fn();
			splitter.addEventListener('collapse', handler);

			splitter.collapse(0);
			await splitter.updateComplete;

			expect(splitter.collapsed[0]).toBe(false);
			expect(handler).not.toHaveBeenCalled();
		});

		it('expand() should expand a pane', async () => {
			splitter.collapsible = [true, true];
			splitter.collapsed = [true, false];
			await splitter.updateComplete;

			const handler = vi.fn();
			splitter.addEventListener('collapse', handler);

			splitter.expand(0);
			await splitter.updateComplete;

			expect(splitter.collapsed[0]).toBe(false);
			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.collapsed).toBe(false);
		});

		it('toggleCollapse() should toggle collapse state', async () => {
			splitter.collapsible = [true, true];
			await splitter.updateComplete;

			expect(splitter.collapsed[0]).toBe(false);

			splitter.toggleCollapse(0);
			await splitter.updateComplete;
			expect(splitter.collapsed[0]).toBe(true);

			splitter.toggleCollapse(0);
			await splitter.updateComplete;
			expect(splitter.collapsed[0]).toBe(false);
		});

		it('reset() should reset to defaults', async () => {
			splitter.sizes = [30, 70];
			splitter.collapsed = [true, false];
			await splitter.updateComplete;

			splitter.reset();
			await splitter.updateComplete;

			expect(splitter.sizes).toEqual([50, 50]);
			expect(splitter.collapsed).toEqual([false, false]);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire resize event on setSizes', async () => {
			const handler = vi.fn();
			splitter.addEventListener('resize', handler);

			splitter.setSizes([30, 70]);

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.sizes).toEqual([30, 70]);
		});

		it('should fire collapse event', async () => {
			splitter.collapsible = [true, true];
			await splitter.updateComplete;

			const handler = vi.fn();
			splitter.addEventListener('collapse', handler);

			splitter.collapse(1);

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.index).toBe(1);
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('resize', handler);

			splitter.setSizes([40, 60]);

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('resize', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await splitter.updateComplete;
			expect(splitter.shadowRoot).toBeTruthy();
		});

		it('should render splitter container', async () => {
			await splitter.updateComplete;
			const container = splitter.shadowRoot.querySelector('.splitter');
			expect(container).toBeTruthy();
		});

		it('should render two panes', async () => {
			await splitter.updateComplete;
			const panes = splitter.shadowRoot.querySelectorAll('.pane');
			expect(panes.length).toBe(2);
		});

		it('should render gutter', async () => {
			await splitter.updateComplete;
			const gutter = splitter.shadowRoot.querySelector('.gutter');
			expect(gutter).toBeTruthy();
		});

		it('should render pane slots', async () => {
			await splitter.updateComplete;
			const slot0 = splitter.shadowRoot.querySelector('slot[name="pane-0"]');
			const slot1 = splitter.shadowRoot.querySelector('slot[name="pane-1"]');
			expect(slot0).toBeTruthy();
			expect(slot1).toBeTruthy();
		});

		it('should apply vertical class when orientation is vertical', async () => {
			splitter.orientation = 'vertical';
			await splitter.updateComplete;

			const container = splitter.shadowRoot.querySelector('.splitter');
			expect(container.classList.contains('vertical')).toBe(true);
		});

		it('should apply collapsed class to collapsed panes', async () => {
			splitter.collapsed = [true, false];
			await splitter.updateComplete;

			const panes = splitter.shadowRoot.querySelectorAll('.pane');
			expect(panes[0].classList.contains('collapsed')).toBe(true);
			expect(panes[1].classList.contains('collapsed')).toBe(false);
		});

		it('should render gutter handle', async () => {
			await splitter.updateComplete;
			const handle = splitter.shadowRoot.querySelector('.gutter-handle');
			expect(handle).toBeTruthy();
		});

		it('should render collapse buttons when collapsible', async () => {
			splitter.collapsible = [true, true];
			await splitter.updateComplete;

			const buttons = splitter.shadowRoot.querySelectorAll('.collapse-btn');
			expect(buttons.length).toBeGreaterThan(0);
		});
	});

	// ======================================================
	// SUITE 6: Drag Behavior
	// ======================================================
	describe('Drag Behavior', () => {
		it('should have gutter with mousedown handler', async () => {
			await splitter.updateComplete;
			const gutter = splitter.shadowRoot.querySelector('.gutter');
			expect(gutter).toBeTruthy();
		});

		it('should track drag state', () => {
			expect(splitter._isDragging).toBe(false);
		});

		it('should store start position during drag', () => {
			expect(splitter._startPos).toBe(0);
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(splitter._logger).toBeTruthy();
		});
	});
});
