/**
 * TChipLit Component Tests
 * CORE profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TChipLit.js';

describe('TChipLit', () => {
	let chip;

	beforeEach(async () => {
		chip = await fixture(html`<t-chip label="Test Chip"></t-chip>`);
	});

	afterEach(() => {
		chip?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(chip.constructor.tagName).toBe('t-chip');
		});

		it('should have correct version', () => {
			expect(chip.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(chip.constructor.category).toBe('Core');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyChip = document.createElement('t-chip');
			expect(emptyChip.label).toBe('');
			expect(emptyChip.variant).toBe('default');
			expect(emptyChip.size).toBe('md');
			expect(emptyChip.removable).toBe(false);
			expect(emptyChip.selectable).toBe(false);
			expect(emptyChip.selected).toBe(false);
			expect(emptyChip.disabled).toBe(false);
			expect(emptyChip.icon).toBe('');
			expect(emptyChip.avatar).toBe('');
		});

		it('should update label property', async () => {
			chip.label = 'New Label';
			await chip.updateComplete;
			expect(chip.label).toBe('New Label');
			expect(chip.getAttribute('label')).toBe('New Label');
		});

		it('should update variant property', async () => {
			chip.variant = 'warning';
			await chip.updateComplete;
			expect(chip.variant).toBe('warning');
			expect(chip.getAttribute('variant')).toBe('warning');
		});

		it('should update size property', async () => {
			chip.size = 'lg';
			await chip.updateComplete;
			expect(chip.size).toBe('lg');
			expect(chip.getAttribute('size')).toBe('lg');
		});

		it('should update removable property', async () => {
			chip.removable = true;
			await chip.updateComplete;
			expect(chip.removable).toBe(true);
			expect(chip.hasAttribute('removable')).toBe(true);
		});

		it('should update selectable property', async () => {
			chip.selectable = true;
			await chip.updateComplete;
			expect(chip.selectable).toBe(true);
			expect(chip.hasAttribute('selectable')).toBe(true);
		});

		it('should update selected property', async () => {
			chip.selected = true;
			await chip.updateComplete;
			expect(chip.selected).toBe(true);
			expect(chip.hasAttribute('selected')).toBe(true);
		});

		it('should update disabled property', async () => {
			chip.disabled = true;
			await chip.updateComplete;
			expect(chip.disabled).toBe(true);
			expect(chip.hasAttribute('disabled')).toBe(true);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-chip
					label="Attr Chip"
					variant="error"
					size="sm"
					removable
					selectable
					selected
				></t-chip>
			`);

			expect(withAttrs.label).toBe('Attr Chip');
			expect(withAttrs.variant).toBe('error');
			expect(withAttrs.size).toBe('sm');
			expect(withAttrs.removable).toBe(true);
			expect(withAttrs.selectable).toBe(true);
			expect(withAttrs.selected).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('select() should set selected to true when selectable', async () => {
			chip.selectable = true;
			await chip.updateComplete;

			chip.select();
			await chip.updateComplete;
			expect(chip.selected).toBe(true);
		});

		it('select() should not work when disabled', async () => {
			chip.selectable = true;
			chip.disabled = true;
			await chip.updateComplete;

			chip.select();
			await chip.updateComplete;
			expect(chip.selected).toBe(false);
		});

		it('select() should not work when not selectable', async () => {
			chip.selectable = false;
			await chip.updateComplete;

			chip.select();
			await chip.updateComplete;
			expect(chip.selected).toBe(false);
		});

		it('deselect() should set selected to false', async () => {
			chip.selectable = true;
			chip.selected = true;
			await chip.updateComplete;

			chip.deselect();
			await chip.updateComplete;
			expect(chip.selected).toBe(false);
		});

		it('toggle() should toggle selection', async () => {
			chip.selectable = true;
			await chip.updateComplete;

			chip.toggle();
			await chip.updateComplete;
			expect(chip.selected).toBe(true);

			chip.toggle();
			await chip.updateComplete;
			expect(chip.selected).toBe(false);
		});

		it('requestRemove() should emit chip-remove event', async () => {
			chip.removable = true;
			await chip.updateComplete;

			const handler = vi.fn();
			chip.addEventListener('chip-remove', handler);

			chip.requestRemove();
			expect(handler).toHaveBeenCalled();
		});

		it('requestRemove() should not work when disabled', async () => {
			chip.removable = true;
			chip.disabled = true;
			await chip.updateComplete;

			const handler = vi.fn();
			chip.addEventListener('chip-remove', handler);

			chip.requestRemove();
			expect(handler).not.toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire chip-click on click', async () => {
			const handler = vi.fn();
			chip.addEventListener('chip-click', handler);

			const chipEl = chip.shadowRoot.querySelector('.chip');
			chipEl.click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.label).toBe('Test Chip');
		});

		it('should fire chip-select when selection changes', async () => {
			chip.selectable = true;
			await chip.updateComplete;

			const handler = vi.fn();
			chip.addEventListener('chip-select', handler);

			chip.select();
			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.selected).toBe(true);
		});

		it('should fire chip-remove when removed', async () => {
			chip.removable = true;
			await chip.updateComplete;

			const handler = vi.fn();
			chip.addEventListener('chip-remove', handler);

			const removeBtn = chip.shadowRoot.querySelector('.chip-remove');
			removeBtn.click();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.label).toBe('Test Chip');
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('chip-click', handler);

			const chipEl = chip.shadowRoot.querySelector('.chip');
			chipEl.click();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('chip-click', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await chip.updateComplete;
			expect(chip.shadowRoot).toBeTruthy();
		});

		it('should render chip element', async () => {
			await chip.updateComplete;
			const chipEl = chip.shadowRoot.querySelector('.chip');
			expect(chipEl).toBeTruthy();
		});

		it('should render label', async () => {
			await chip.updateComplete;
			const label = chip.shadowRoot.querySelector('.chip-label');
			expect(label.textContent).toBe('Test Chip');
		});

		it('should render remove button when removable', async () => {
			chip.removable = true;
			await chip.updateComplete;

			const removeBtn = chip.shadowRoot.querySelector('.chip-remove');
			expect(removeBtn).toBeTruthy();
		});

		it('should not render remove button when not removable', async () => {
			chip.removable = false;
			await chip.updateComplete;

			const removeBtn = chip.shadowRoot.querySelector('.chip-remove');
			expect(removeBtn).toBeFalsy();
		});

		it('should render avatar when provided', async () => {
			chip.avatar = 'https://example.com/avatar.jpg';
			await chip.updateComplete;

			const avatar = chip.shadowRoot.querySelector('.chip-avatar img');
			expect(avatar).toBeTruthy();
			expect(avatar.src).toContain('avatar.jpg');
		});

		it('should have correct role for selectable chip', async () => {
			chip.selectable = true;
			await chip.updateComplete;

			const chipEl = chip.shadowRoot.querySelector('.chip');
			expect(chipEl.getAttribute('role')).toBe('checkbox');
		});

		it('should have correct role for non-selectable chip', async () => {
			chip.selectable = false;
			await chip.updateComplete;

			const chipEl = chip.shadowRoot.querySelector('.chip');
			expect(chipEl.getAttribute('role')).toBe('status');
		});
	});

	// ======================================================
	// SUITE 6: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(chip._logger).toBeTruthy();
		});
	});
});
