/**
 * TTooltipLit Component Tests
 * CORE profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TTooltipLit.js';

describe('TTooltipLit', () => {
	let tooltip;

	beforeEach(async () => {
		tooltip = await fixture(html`<t-tip content="Test tooltip"><button>Hover me</button></t-tip>`);
	});

	afterEach(() => {
		tooltip?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(tooltip.constructor.tagName).toBe('t-tip');
		});

		it('should have correct version', () => {
			expect(tooltip.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(tooltip.constructor.category).toBe('Core');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyTooltip = document.createElement('t-tip');
			expect(emptyTooltip.content).toBe('');
			expect(emptyTooltip.html).toBe(false);
			expect(emptyTooltip.position).toBe('top');
			expect(emptyTooltip.trigger).toBe('hover');
			expect(emptyTooltip.delay).toBe(200);
			expect(emptyTooltip.hideDelay).toBe(0);
			expect(emptyTooltip.arrow).toBe(true);
			expect(emptyTooltip.maxWidth).toBe('250px');
			expect(emptyTooltip.variant).toBe('default');
			expect(emptyTooltip.disabled).toBe(false);
			expect(emptyTooltip.open).toBe(false);
		});

		it('should update content property', async () => {
			tooltip.content = 'New content';
			await tooltip.updateComplete;
			expect(tooltip.content).toBe('New content');
		});

		it('should update html property', async () => {
			tooltip.html = true;
			await tooltip.updateComplete;
			expect(tooltip.html).toBe(true);
			expect(tooltip.hasAttribute('html')).toBe(true);
		});

		it('should update position property', async () => {
			tooltip.position = 'bottom';
			await tooltip.updateComplete;
			expect(tooltip.position).toBe('bottom');
			expect(tooltip.getAttribute('position')).toBe('bottom');
		});

		it('should update trigger property', async () => {
			tooltip.trigger = 'click';
			await tooltip.updateComplete;
			expect(tooltip.trigger).toBe('click');
			expect(tooltip.getAttribute('trigger')).toBe('click');
		});

		it('should update delay property', async () => {
			tooltip.delay = 500;
			await tooltip.updateComplete;
			expect(tooltip.delay).toBe(500);
		});

		it('should update arrow property', async () => {
			tooltip.arrow = false;
			await tooltip.updateComplete;
			expect(tooltip.arrow).toBe(false);
		});

		it('should update variant property', async () => {
			tooltip.variant = 'warning';
			await tooltip.updateComplete;
			expect(tooltip.variant).toBe('warning');
			expect(tooltip.getAttribute('variant')).toBe('warning');
		});

		it('should update disabled property', async () => {
			tooltip.disabled = true;
			await tooltip.updateComplete;
			expect(tooltip.disabled).toBe(true);
			expect(tooltip.hasAttribute('disabled')).toBe(true);
		});

		it('should update open property', async () => {
			tooltip.open = true;
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(true);
			expect(tooltip.hasAttribute('open')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-tip
					content="Attr content"
					position="right"
					trigger="click"
					variant="error"
					disabled
				><span>Target</span></t-tip>
			`);

			expect(withAttrs.content).toBe('Attr content');
			expect(withAttrs.position).toBe('right');
			expect(withAttrs.trigger).toBe('click');
			expect(withAttrs.variant).toBe('error');
			expect(withAttrs.disabled).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('show() should set open to true', async () => {
			tooltip.show();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(true);
		});

		it('show() should not work when disabled', async () => {
			tooltip.disabled = true;
			await tooltip.updateComplete;

			tooltip.show();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(false);
		});

		it('hide() should set open to false', async () => {
			tooltip.open = true;
			await tooltip.updateComplete;

			tooltip.hide();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(false);
		});

		it('toggle() should toggle open state', async () => {
			expect(tooltip.open).toBe(false);

			tooltip.toggle();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(true);

			tooltip.toggle();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(false);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire tooltip-show when shown', async () => {
			const handler = vi.fn();
			tooltip.addEventListener('tooltip-show', handler);

			tooltip.show();
			await tooltip.updateComplete;

			expect(handler).toHaveBeenCalled();
		});

		it('should fire tooltip-hide when hidden', async () => {
			tooltip.open = true;
			await tooltip.updateComplete;

			const handler = vi.fn();
			tooltip.addEventListener('tooltip-hide', handler);

			tooltip.hide();
			await tooltip.updateComplete;

			expect(handler).toHaveBeenCalled();
		});

		it('tooltip-show should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('tooltip-show', handler);

			tooltip.show();
			await tooltip.updateComplete;

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('tooltip-show', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await tooltip.updateComplete;
			expect(tooltip.shadowRoot).toBeTruthy();
		});

		it('should render trigger slot', async () => {
			await tooltip.updateComplete;
			const slot = tooltip.shadowRoot.querySelector('slot');
			expect(slot).toBeTruthy();
		});

		it('should render tooltip content', async () => {
			await tooltip.updateComplete;
			const tooltipEl = tooltip.shadowRoot.querySelector('.tooltip');
			expect(tooltipEl).toBeTruthy();
			expect(tooltipEl.textContent).toContain('Test tooltip');
		});

		it('should render arrow by default', async () => {
			await tooltip.updateComplete;
			const arrow = tooltip.shadowRoot.querySelector('.tooltip-arrow');
			expect(arrow).toBeTruthy();
		});

		it('should not render arrow when arrow is false', async () => {
			tooltip.arrow = false;
			await tooltip.updateComplete;
			const arrow = tooltip.shadowRoot.querySelector('.tooltip-arrow');
			expect(arrow).toBeFalsy();
		});

		it('should apply position class', async () => {
			tooltip.position = 'bottom';
			await tooltip.updateComplete;

			const tooltipEl = tooltip.shadowRoot.querySelector('.tooltip');
			expect(tooltipEl.classList.contains('position-bottom')).toBe(true);
		});

		it('should apply visible class when open', async () => {
			tooltip.open = true;
			await tooltip.updateComplete;

			const tooltipEl = tooltip.shadowRoot.querySelector('.tooltip');
			expect(tooltipEl.classList.contains('visible')).toBe(true);
		});

		it('should not have visible class when closed', async () => {
			tooltip.open = false;
			await tooltip.updateComplete;

			const tooltipEl = tooltip.shadowRoot.querySelector('.tooltip');
			expect(tooltipEl.classList.contains('visible')).toBe(false);
		});

		it('should have correct ARIA attributes', async () => {
			await tooltip.updateComplete;
			const tooltipEl = tooltip.shadowRoot.querySelector('.tooltip');
			expect(tooltipEl.getAttribute('role')).toBe('tooltip');
		});

		it('should render HTML content when html is true', async () => {
			tooltip.content = '<strong>Bold</strong>';
			tooltip.html = true;
			await tooltip.updateComplete;

			const tooltipEl = tooltip.shadowRoot.querySelector('.tooltip');
			expect(tooltipEl.innerHTML).toContain('<strong>Bold</strong>');
		});
	});

	// ======================================================
	// SUITE 6: Trigger Behavior
	// ======================================================
	describe('Trigger Behavior', () => {
		it('should show on click when trigger is click', async () => {
			tooltip.trigger = 'click';
			await tooltip.updateComplete;

			const trigger = tooltip.shadowRoot.querySelector('.tooltip-trigger');
			trigger.click();
			await tooltip.updateComplete;

			expect(tooltip.open).toBe(true);
		});

		it('should toggle on multiple clicks when trigger is click', async () => {
			tooltip.trigger = 'click';
			await tooltip.updateComplete;

			const trigger = tooltip.shadowRoot.querySelector('.tooltip-trigger');

			trigger.click();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(true);

			trigger.click();
			await tooltip.updateComplete;
			expect(tooltip.open).toBe(false);
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(tooltip._logger).toBeTruthy();
		});
	});
});
