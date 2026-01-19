/**
 * TBadgeLit Component Tests
 * CORE profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TBadgeLit.js';

describe('TBadgeLit', () => {
	let badge;

	beforeEach(async () => {
		badge = await fixture(html`<t-bdg></t-bdg>`);
	});

	afterEach(() => {
		badge?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(badge.constructor.tagName).toBe('t-bdg');
		});

		it('should have correct version', () => {
			expect(badge.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(badge.constructor.category).toBe('Core');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			expect(badge.count).toBe(null);
			expect(badge.max).toBe(99);
			expect(badge.dot).toBe(false);
			expect(badge.variant).toBe('default');
			expect(badge.size).toBe('md');
			expect(badge.pulse).toBe(false);
			expect(badge.position).toBe(null);
			expect(badge.hidden).toBe(false);
			expect(badge.clickable).toBe(false);
		});

		it('should update count property', async () => {
			badge.count = 5;
			await badge.updateComplete;
			expect(badge.count).toBe(5);
			expect(badge.getAttribute('count')).toBe('5');
		});

		it('should update max property', async () => {
			badge.max = 50;
			await badge.updateComplete;
			expect(badge.max).toBe(50);
			expect(badge.getAttribute('max')).toBe('50');
		});

		it('should update dot property', async () => {
			badge.dot = true;
			await badge.updateComplete;
			expect(badge.dot).toBe(true);
			expect(badge.hasAttribute('dot')).toBe(true);
		});

		it('should update variant property', async () => {
			badge.variant = 'error';
			await badge.updateComplete;
			expect(badge.variant).toBe('error');
			expect(badge.getAttribute('variant')).toBe('error');
		});

		it('should update size property', async () => {
			badge.size = 'lg';
			await badge.updateComplete;
			expect(badge.size).toBe('lg');
			expect(badge.getAttribute('size')).toBe('lg');
		});

		it('should update pulse property', async () => {
			badge.pulse = true;
			await badge.updateComplete;
			expect(badge.pulse).toBe(true);
			expect(badge.hasAttribute('pulse')).toBe(true);
		});

		it('should update position property', async () => {
			badge.position = 'top-right';
			await badge.updateComplete;
			expect(badge.position).toBe('top-right');
			expect(badge.getAttribute('position')).toBe('top-right');
		});

		it('should update hidden property', async () => {
			badge.hidden = true;
			await badge.updateComplete;
			expect(badge.hidden).toBe(true);
			expect(badge.hasAttribute('hidden')).toBe(true);
		});

		it('should update clickable property', async () => {
			badge.clickable = true;
			await badge.updateComplete;
			expect(badge.clickable).toBe(true);
			expect(badge.hasAttribute('clickable')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-bdg
					count="10"
					max="50"
					dot
					variant="warning"
					size="sm"
					pulse
					position="top-left"
					clickable
				></t-bdg>
			`);

			expect(withAttrs.count).toBe(10);
			expect(withAttrs.max).toBe(50);
			expect(withAttrs.dot).toBe(true);
			expect(withAttrs.variant).toBe('warning');
			expect(withAttrs.size).toBe('sm');
			expect(withAttrs.pulse).toBe(true);
			expect(withAttrs.position).toBe('top-left');
			expect(withAttrs.clickable).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('show() should set hidden to false', async () => {
			badge.hidden = true;
			await badge.updateComplete;

			badge.show();
			await badge.updateComplete;

			expect(badge.hidden).toBe(false);
		});

		it('hide() should set hidden to true', async () => {
			badge.hidden = false;
			await badge.updateComplete;

			badge.hide();
			await badge.updateComplete;

			expect(badge.hidden).toBe(true);
		});

		it('setCount() should update count', async () => {
			badge.setCount(42);
			await badge.updateComplete;

			expect(badge.count).toBe(42);
		});

		it('increment() should increase count by 1 by default', async () => {
			badge.count = 5;
			await badge.updateComplete;

			badge.increment();
			await badge.updateComplete;

			expect(badge.count).toBe(6);
		});

		it('increment() should increase count by specified amount', async () => {
			badge.count = 5;
			await badge.updateComplete;

			badge.increment(3);
			await badge.updateComplete;

			expect(badge.count).toBe(8);
		});

		it('increment() should handle null count', async () => {
			badge.count = null;
			await badge.updateComplete;

			badge.increment();
			await badge.updateComplete;

			expect(badge.count).toBe(1);
		});

		it('decrement() should decrease count by 1 by default', async () => {
			badge.count = 5;
			await badge.updateComplete;

			badge.decrement();
			await badge.updateComplete;

			expect(badge.count).toBe(4);
		});

		it('decrement() should decrease count by specified amount', async () => {
			badge.count = 10;
			await badge.updateComplete;

			badge.decrement(3);
			await badge.updateComplete;

			expect(badge.count).toBe(7);
		});

		it('decrement() should not go below 0', async () => {
			badge.count = 2;
			await badge.updateComplete;

			badge.decrement(5);
			await badge.updateComplete;

			expect(badge.count).toBe(0);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire badge-click when clicked and clickable', async () => {
			badge.clickable = true;
			badge.count = 5;
			badge.variant = 'error';
			await badge.updateComplete;

			const handler = vi.fn();
			badge.addEventListener('badge-click', handler);

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			badgeEl.click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.count).toBe(5);
			expect(handler.mock.calls[0][0].detail.variant).toBe('error');
		});

		it('should not fire badge-click when not clickable', async () => {
			badge.clickable = false;
			badge.count = 5;
			await badge.updateComplete;

			const handler = vi.fn();
			badge.addEventListener('badge-click', handler);

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			badgeEl.click();

			expect(handler).not.toHaveBeenCalled();
		});

		it('badge-click should bubble', async () => {
			badge.clickable = true;
			await badge.updateComplete;

			const handler = vi.fn();
			document.body.addEventListener('badge-click', handler);

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			badgeEl.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('badge-click', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await badge.updateComplete;
			expect(badge.shadowRoot).toBeTruthy();
		});

		it('should render badge element', async () => {
			await badge.updateComplete;
			const badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl).toBeTruthy();
		});

		it('should display count value', async () => {
			badge.count = 42;
			await badge.updateComplete;

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.textContent).toBe('42');
		});

		it('should display max+ when count exceeds max', async () => {
			badge.count = 150;
			badge.max = 99;
			await badge.updateComplete;

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.textContent).toBe('99+');
		});

		it('should render dot variant without text', async () => {
			badge.dot = true;
			badge.count = 5;
			await badge.updateComplete;

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.classList.contains('dot')).toBe(true);
			expect(badgeEl.textContent).toBe('');
		});

		it('should apply pulse class when pulse is true', async () => {
			badge.pulse = true;
			await badge.updateComplete;

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.classList.contains('pulse')).toBe(true);
		});

		it('should apply hidden class when hidden is true', async () => {
			badge.hidden = true;
			await badge.updateComplete;

			const badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.classList.contains('hidden')).toBe(true);
		});

		it('should render slot for wrapped content', async () => {
			const withSlot = await fixture(html`
				<t-bdg count="3" position="top-right">
					<button>Click me</button>
				</t-bdg>
			`);

			const slot = withSlot.shadowRoot.querySelector('slot');
			expect(slot).toBeTruthy();

			withSlot.remove();
		});

		it('should have correct role based on clickable', async () => {
			badge.clickable = false;
			await badge.updateComplete;
			let badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.getAttribute('role')).toBe('status');

			badge.clickable = true;
			await badge.updateComplete;
			badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.getAttribute('role')).toBe('button');
		});

		it('should have correct tabindex based on clickable', async () => {
			badge.clickable = false;
			await badge.updateComplete;
			let badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.getAttribute('tabindex')).toBe('-1');

			badge.clickable = true;
			await badge.updateComplete;
			badgeEl = badge.shadowRoot.querySelector('.badge');
			expect(badgeEl.getAttribute('tabindex')).toBe('0');
		});
	});

	// ======================================================
	// SUITE 6: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(badge._logger).toBeTruthy();
		});
	});
});
