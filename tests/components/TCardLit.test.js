/**
 * TCardLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TCardLit.js';

describe('TCardLit', () => {
	let card;

	beforeEach(async () => {
		card = await fixture(html`<t-card>Card content</t-card>`);
	});

	afterEach(() => {
		card?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(card.constructor.tagName).toBe('t-card');
		});

		it('should have correct version', () => {
			expect(card.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(card.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyCard = document.createElement('t-card');
			expect(emptyCard.variant).toBe('default');
			expect(emptyCard.clickable).toBe(false);
			expect(emptyCard.selected).toBe(false);
			expect(emptyCard.disabled).toBe(false);
			expect(emptyCard.loading).toBe(false);
			expect(emptyCard.expandable).toBe(false);
			expect(emptyCard.expanded).toBe(true);
			expect(emptyCard.padding).toBe('md');
		});

		it('should update variant property', async () => {
			card.variant = 'elevated';
			await card.updateComplete;
			expect(card.variant).toBe('elevated');
			expect(card.getAttribute('variant')).toBe('elevated');
		});

		it('should update clickable property', async () => {
			card.clickable = true;
			await card.updateComplete;
			expect(card.clickable).toBe(true);
			expect(card.hasAttribute('clickable')).toBe(true);
		});

		it('should update selected property', async () => {
			card.selected = true;
			await card.updateComplete;
			expect(card.selected).toBe(true);
			expect(card.hasAttribute('selected')).toBe(true);
		});

		it('should update disabled property', async () => {
			card.disabled = true;
			await card.updateComplete;
			expect(card.disabled).toBe(true);
			expect(card.hasAttribute('disabled')).toBe(true);
		});

		it('should update loading property', async () => {
			card.loading = true;
			await card.updateComplete;
			expect(card.loading).toBe(true);
			expect(card.hasAttribute('loading')).toBe(true);
		});

		it('should update expandable property', async () => {
			card.expandable = true;
			await card.updateComplete;
			expect(card.expandable).toBe(true);
			expect(card.hasAttribute('expandable')).toBe(true);
		});

		it('should update expanded property', async () => {
			card.expanded = false;
			await card.updateComplete;
			expect(card.expanded).toBe(false);
		});

		it('should update padding property', async () => {
			card.padding = 'lg';
			await card.updateComplete;
			expect(card.padding).toBe('lg');
			expect(card.getAttribute('padding')).toBe('lg');
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-card
					variant="terminal"
					clickable
					selected
					expandable
					padding="sm"
				></t-card>
			`);

			expect(withAttrs.variant).toBe('terminal');
			expect(withAttrs.clickable).toBe(true);
			expect(withAttrs.selected).toBe(true);
			expect(withAttrs.expandable).toBe(true);
			expect(withAttrs.padding).toBe('sm');

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('toggleExpand() should toggle expanded state', async () => {
			card.expandable = true;
			card.expanded = true;
			await card.updateComplete;

			card.toggleExpand();
			await card.updateComplete;
			expect(card.expanded).toBe(false);

			card.toggleExpand();
			await card.updateComplete;
			expect(card.expanded).toBe(true);
		});

		it('toggleExpand() should not work when not expandable', async () => {
			card.expandable = false;
			card.expanded = true;
			await card.updateComplete;

			card.toggleExpand();
			await card.updateComplete;
			expect(card.expanded).toBe(true);
		});

		it('expand() should set expanded to true', async () => {
			card.expandable = true;
			card.expanded = false;
			await card.updateComplete;

			card.expand();
			await card.updateComplete;
			expect(card.expanded).toBe(true);
		});

		it('collapse() should set expanded to false', async () => {
			card.expandable = true;
			card.expanded = true;
			await card.updateComplete;

			card.collapse();
			await card.updateComplete;
			expect(card.expanded).toBe(false);
		});

		it('select() should set selected to true', async () => {
			card.select();
			await card.updateComplete;
			expect(card.selected).toBe(true);
		});

		it('deselect() should set selected to false', async () => {
			card.selected = true;
			await card.updateComplete;

			card.deselect();
			await card.updateComplete;
			expect(card.selected).toBe(false);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire card-click when clicked and clickable', async () => {
			card.clickable = true;
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.click();

			expect(handler).toHaveBeenCalled();
		});

		it('should not fire card-click when not clickable', async () => {
			card.clickable = false;
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.click();

			expect(handler).not.toHaveBeenCalled();
		});

		it('should not fire card-click when disabled', async () => {
			card.clickable = true;
			card.disabled = true;
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.click();

			expect(handler).not.toHaveBeenCalled();
		});

		it('card-click should include correct detail', async () => {
			card.clickable = true;
			card.variant = 'elevated';
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.click();

			const event = handler.mock.calls[0][0];
			expect(event.detail.variant).toBe('elevated');
			expect(event.detail.selected).toBe(false);
		});

		it('should fire card-expand when expand state changes', async () => {
			card.expandable = true;
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-expand', handler);

			card.toggleExpand();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.expanded).toBe(false);
		});

		it('card-click should bubble', async () => {
			card.clickable = true;
			await card.updateComplete;

			const handler = vi.fn();
			document.body.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('card-click', handler);
		});

		it('should fire card-click on Enter key', async () => {
			card.clickable = true;
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(handler).toHaveBeenCalled();
		});

		it('should fire card-click on Space key', async () => {
			card.clickable = true;
			await card.updateComplete;

			const handler = vi.fn();
			card.addEventListener('card-click', handler);

			const cardEl = card.shadowRoot.querySelector('.card');
			cardEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

			expect(handler).toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await card.updateComplete;
			expect(card.shadowRoot).toBeTruthy();
		});

		it('should render card element', async () => {
			await card.updateComplete;
			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl).toBeTruthy();
		});

		it('should render default slot', async () => {
			await card.updateComplete;
			const slot = card.shadowRoot.querySelector('slot:not([name])');
			expect(slot).toBeTruthy();
		});

		it('should render header slot', async () => {
			await card.updateComplete;
			const slot = card.shadowRoot.querySelector('slot[name="header"]');
			expect(slot).toBeTruthy();
		});

		it('should render media slot', async () => {
			await card.updateComplete;
			const slot = card.shadowRoot.querySelector('slot[name="media"]');
			expect(slot).toBeTruthy();
		});

		it('should render actions slot', async () => {
			await card.updateComplete;
			const slot = card.shadowRoot.querySelector('slot[name="actions"]');
			expect(slot).toBeTruthy();
		});

		it('should apply variant class', async () => {
			card.variant = 'terminal';
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.classList.contains('terminal')).toBe(true);
		});

		it('should apply clickable class', async () => {
			card.clickable = true;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.classList.contains('clickable')).toBe(true);
		});

		it('should apply selected class', async () => {
			card.selected = true;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.classList.contains('selected')).toBe(true);
		});

		it('should apply disabled class', async () => {
			card.disabled = true;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.classList.contains('disabled')).toBe(true);
		});

		it('should apply loading class', async () => {
			card.loading = true;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.classList.contains('loading')).toBe(true);
		});

		it('should apply padding class', async () => {
			card.padding = 'lg';
			await card.updateComplete;

			const content = card.shadowRoot.querySelector('.card-content');
			expect(content.classList.contains('padding-lg')).toBe(true);
		});

		it('should render expand toggle when expandable', async () => {
			const withHeader = await fixture(html`
				<t-card expandable>
					<div slot="header">Header</div>
					Content
				</t-card>
			`);
			await withHeader.updateComplete;

			const toggle = withHeader.shadowRoot.querySelector('.expand-toggle');
			expect(toggle).toBeTruthy();

			withHeader.remove();
		});

		it('should apply collapsed class when not expanded', async () => {
			card.expandable = true;
			card.expanded = false;
			await card.updateComplete;

			const content = card.shadowRoot.querySelector('.card-content');
			expect(content.classList.contains('collapsed')).toBe(true);
		});

		it('should have correct role for clickable card', async () => {
			card.clickable = true;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.getAttribute('role')).toBe('button');
		});

		it('should have correct role for non-clickable card', async () => {
			card.clickable = false;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.getAttribute('role')).toBe('article');
		});

		it('should have tabindex for clickable card', async () => {
			card.clickable = true;
			await card.updateComplete;

			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl.getAttribute('tabindex')).toBe('0');
		});
	});

	// ======================================================
	// SUITE 6: Slot Content Detection
	// ======================================================
	describe('Slot Content Detection', () => {
		it('should have header slot', async () => {
			await card.updateComplete;
			const headerSlot = card.shadowRoot.querySelector('slot[name="header"]');
			expect(headerSlot).toBeTruthy();
		});

		it('should have media slot', async () => {
			await card.updateComplete;
			const mediaSlot = card.shadowRoot.querySelector('slot[name="media"]');
			expect(mediaSlot).toBeTruthy();
		});

		it('should have actions slot', async () => {
			await card.updateComplete;
			const actionsSlot = card.shadowRoot.querySelector('slot[name="actions"]');
			expect(actionsSlot).toBeTruthy();
		});

		it('should track _hasHeader internal state', () => {
			expect(card._hasHeader).toBe(false);
		});

		it('should track _hasMedia internal state', () => {
			expect(card._hasMedia).toBe(false);
		});

		it('should track _hasActions internal state', () => {
			expect(card._hasActions).toBe(false);
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(card._logger).toBeTruthy();
		});
	});
});
