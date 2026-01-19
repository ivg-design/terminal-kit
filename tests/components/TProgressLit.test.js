/**
 * TProgressLit Component Tests
 * DISPLAY profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TProgressLit.js';

describe('TProgressLit', () => {
	let progress;

	beforeEach(async () => {
		progress = await fixture(html`<t-prg></t-prg>`);
	});

	afterEach(() => {
		progress?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(progress.constructor.tagName).toBe('t-prg');
		});

		it('should have correct version', () => {
			expect(progress.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(progress.constructor.category).toBe('Display');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			expect(progress.value).toBe(0);
			expect(progress.max).toBe(100);
			expect(progress.type).toBe('bar');
			expect(progress.variant).toBe('default');
			expect(progress.size).toBe('md');
			expect(progress.indeterminate).toBe(false);
			expect(progress.showLabel).toBe(false);
			expect(progress.labelPosition).toBe('outside');
			expect(progress.striped).toBe(false);
			expect(progress.animated).toBe(false);
			expect(progress.buffer).toBe(0);
			expect(progress.segments).toBe(0);
		});

		it('should update value property', async () => {
			progress.value = 50;
			await progress.updateComplete;
			expect(progress.value).toBe(50);
			expect(progress.getAttribute('value')).toBe('50');
		});

		it('should update max property', async () => {
			progress.max = 200;
			await progress.updateComplete;
			expect(progress.max).toBe(200);
			expect(progress.getAttribute('max')).toBe('200');
		});

		it('should update type property', async () => {
			progress.type = 'ring';
			await progress.updateComplete;
			expect(progress.type).toBe('ring');
			expect(progress.getAttribute('type')).toBe('ring');
		});

		it('should update variant property', async () => {
			progress.variant = 'warning';
			await progress.updateComplete;
			expect(progress.variant).toBe('warning');
			expect(progress.getAttribute('variant')).toBe('warning');
		});

		it('should update size property', async () => {
			progress.size = 'lg';
			await progress.updateComplete;
			expect(progress.size).toBe('lg');
			expect(progress.getAttribute('size')).toBe('lg');
		});

		it('should update indeterminate property', async () => {
			progress.indeterminate = true;
			await progress.updateComplete;
			expect(progress.indeterminate).toBe(true);
			expect(progress.hasAttribute('indeterminate')).toBe(true);
		});

		it('should update showLabel property', async () => {
			progress.showLabel = true;
			await progress.updateComplete;
			expect(progress.showLabel).toBe(true);
			expect(progress.hasAttribute('show-label')).toBe(true);
		});

		it('should update striped property', async () => {
			progress.striped = true;
			await progress.updateComplete;
			expect(progress.striped).toBe(true);
			expect(progress.hasAttribute('striped')).toBe(true);
		});

		it('should update animated property', async () => {
			progress.animated = true;
			await progress.updateComplete;
			expect(progress.animated).toBe(true);
			expect(progress.hasAttribute('animated')).toBe(true);
		});

		it('should update buffer property', async () => {
			progress.buffer = 75;
			await progress.updateComplete;
			expect(progress.buffer).toBe(75);
		});

		it('should update segments property', async () => {
			progress.segments = 5;
			await progress.updateComplete;
			expect(progress.segments).toBe(5);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-prg
					value="75"
					max="100"
					type="ring"
					variant="success"
					size="lg"
					show-label
					striped
				></t-prg>
			`);

			expect(withAttrs.value).toBe(75);
			expect(withAttrs.max).toBe(100);
			expect(withAttrs.type).toBe('ring');
			expect(withAttrs.variant).toBe('success');
			expect(withAttrs.size).toBe('lg');
			expect(withAttrs.showLabel).toBe(true);
			expect(withAttrs.striped).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('setValue() should set value within bounds', async () => {
			progress.setValue(50);
			await progress.updateComplete;
			expect(progress.value).toBe(50);
		});

		it('setValue() should clamp to max', async () => {
			progress.setValue(150);
			await progress.updateComplete;
			expect(progress.value).toBe(100);
		});

		it('setValue() should clamp to 0', async () => {
			progress.setValue(-10);
			await progress.updateComplete;
			expect(progress.value).toBe(0);
		});

		it('increment() should increase value by 1', async () => {
			progress.value = 50;
			await progress.updateComplete;

			progress.increment();
			await progress.updateComplete;
			expect(progress.value).toBe(51);
		});

		it('increment() should increase by specified amount', async () => {
			progress.value = 50;
			await progress.updateComplete;

			progress.increment(10);
			await progress.updateComplete;
			expect(progress.value).toBe(60);
		});

		it('decrement() should decrease value by 1', async () => {
			progress.value = 50;
			await progress.updateComplete;

			progress.decrement();
			await progress.updateComplete;
			expect(progress.value).toBe(49);
		});

		it('decrement() should decrease by specified amount', async () => {
			progress.value = 50;
			await progress.updateComplete;

			progress.decrement(10);
			await progress.updateComplete;
			expect(progress.value).toBe(40);
		});

		it('reset() should set value to 0', async () => {
			progress.value = 50;
			await progress.updateComplete;

			progress.reset();
			await progress.updateComplete;
			expect(progress.value).toBe(0);
		});

		it('getPercentage() should return correct percentage', async () => {
			progress.value = 75;
			progress.max = 100;
			await progress.updateComplete;

			expect(progress.getPercentage()).toBe(75);
		});

		it('getPercentage() should handle custom max', async () => {
			progress.value = 50;
			progress.max = 200;
			await progress.updateComplete;

			expect(progress.getPercentage()).toBe(25);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire progress-complete when value reaches max', async () => {
			const handler = vi.fn();
			progress.addEventListener('progress-complete', handler);

			progress.value = 100;
			await progress.updateComplete;

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.value).toBe(100);
			expect(handler.mock.calls[0][0].detail.max).toBe(100);
		});

		it('progress-complete should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('progress-complete', handler);

			progress.value = 100;
			await progress.updateComplete;

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('progress-complete', handler);
		});

		it('should not fire progress-complete when indeterminate', async () => {
			progress.indeterminate = true;
			await progress.updateComplete;

			const handler = vi.fn();
			progress.addEventListener('progress-complete', handler);

			progress.value = 100;
			await progress.updateComplete;

			expect(handler).not.toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await progress.updateComplete;
			expect(progress.shadowRoot).toBeTruthy();
		});

		it('should render bar by default', async () => {
			await progress.updateComplete;
			const bar = progress.shadowRoot.querySelector('.progress-bar');
			expect(bar).toBeTruthy();
		});

		it('should render progress fill with correct width', async () => {
			progress.value = 75;
			await progress.updateComplete;

			const fill = progress.shadowRoot.querySelector('.progress-fill');
			expect(fill.style.width).toBe('75%');
		});

		it('should render ring when type is ring', async () => {
			progress.type = 'ring';
			await progress.updateComplete;

			const ring = progress.shadowRoot.querySelector('.progress-ring');
			expect(ring).toBeTruthy();
			expect(progress.shadowRoot.querySelector('svg')).toBeTruthy();
		});

		it('should render segments when segments > 0', async () => {
			progress.segments = 5;
			await progress.updateComplete;

			const segments = progress.shadowRoot.querySelectorAll('.progress-segment');
			expect(segments.length).toBe(5);
		});

		it('should render label when showLabel is true', async () => {
			progress.showLabel = true;
			progress.value = 50;
			await progress.updateComplete;

			const label = progress.shadowRoot.querySelector('.progress-label');
			expect(label).toBeTruthy();
			expect(label.textContent).toBe('50%');
		});

		it('should render buffer when buffer > 0', async () => {
			progress.buffer = 75;
			await progress.updateComplete;

			const buffer = progress.shadowRoot.querySelector('.progress-buffer');
			expect(buffer).toBeTruthy();
			expect(buffer.style.width).toBe('75%');
		});

		it('should apply striped class when striped is true', async () => {
			progress.striped = true;
			await progress.updateComplete;

			const fill = progress.shadowRoot.querySelector('.progress-fill');
			expect(fill.classList.contains('striped')).toBe(true);
		});

		it('should apply animated class when animated is true', async () => {
			progress.striped = true;
			progress.animated = true;
			await progress.updateComplete;

			const fill = progress.shadowRoot.querySelector('.progress-fill');
			expect(fill.classList.contains('animated')).toBe(true);
		});

		it('should apply indeterminate class when indeterminate is true', async () => {
			progress.indeterminate = true;
			await progress.updateComplete;

			const fill = progress.shadowRoot.querySelector('.progress-fill');
			expect(fill.classList.contains('indeterminate')).toBe(true);
		});

		it('should have correct ARIA attributes', async () => {
			progress.value = 50;
			progress.max = 100;
			await progress.updateComplete;

			const bar = progress.shadowRoot.querySelector('[role="progressbar"]');
			expect(bar.getAttribute('aria-valuenow')).toBe('50');
			expect(bar.getAttribute('aria-valuemin')).toBe('0');
			expect(bar.getAttribute('aria-valuemax')).toBe('100');
		});

		it('should render ring label when showLabel is true for ring type', async () => {
			progress.type = 'ring';
			progress.showLabel = true;
			progress.value = 75;
			await progress.updateComplete;

			const label = progress.shadowRoot.querySelector('.progress-ring-label');
			expect(label).toBeTruthy();
			expect(label.textContent).toBe('75%');
		});
	});

	// ======================================================
	// SUITE 6: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(progress._logger).toBeTruthy();
		});
	});
});
