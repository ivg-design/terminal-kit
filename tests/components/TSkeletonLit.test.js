/**
 * TSkeletonLit Component Tests
 * DISPLAY profile component
 * Testing pattern: Properties, Methods, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TSkeletonLit.js';

describe('TSkeletonLit', () => {
	let skeleton;

	beforeEach(async () => {
		skeleton = await fixture(html`<t-skel></t-skel>`);
	});

	afterEach(() => {
		skeleton?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(skeleton.constructor.tagName).toBe('t-skel');
		});

		it('should have correct version', () => {
			expect(skeleton.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(skeleton.constructor.category).toBe('Display');
		});

		it('should have list of available types', () => {
			expect(skeleton.constructor.types).toContain('text');
			expect(skeleton.constructor.types).toContain('avatar');
			expect(skeleton.constructor.types).toContain('card');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			expect(skeleton.type).toBe('text');
			expect(skeleton.width).toBe('100%');
			expect(skeleton.height).toBe('auto');
			expect(skeleton.lines).toBe(1);
			expect(skeleton.animated).toBe(true);
			expect(skeleton.radius).toBe('4px');
			expect(skeleton.size).toBe('md');
			expect(skeleton.glow).toBe(false);
		});

		it('should update type property', async () => {
			skeleton.type = 'avatar';
			await skeleton.updateComplete;
			expect(skeleton.type).toBe('avatar');
			expect(skeleton.getAttribute('type')).toBe('avatar');
		});

		it('should update lines property', async () => {
			skeleton.lines = 5;
			await skeleton.updateComplete;
			expect(skeleton.lines).toBe(5);
			expect(skeleton.getAttribute('lines')).toBe('5');
		});

		it('should update animated property', async () => {
			skeleton.animated = false;
			await skeleton.updateComplete;
			expect(skeleton.animated).toBe(false);
			expect(skeleton.hasAttribute('animated')).toBe(false);
		});

		it('should update size property', async () => {
			skeleton.size = 'lg';
			await skeleton.updateComplete;
			expect(skeleton.size).toBe('lg');
			expect(skeleton.getAttribute('size')).toBe('lg');
		});

		it('should update glow property', async () => {
			skeleton.glow = true;
			await skeleton.updateComplete;
			expect(skeleton.glow).toBe(true);
			expect(skeleton.hasAttribute('glow')).toBe(true);
		});

		it('should update width property', async () => {
			skeleton.width = '200px';
			await skeleton.updateComplete;
			expect(skeleton.width).toBe('200px');
		});

		it('should update height property', async () => {
			skeleton.height = '50px';
			await skeleton.updateComplete;
			expect(skeleton.height).toBe('50px');
		});

		it('should update radius property', async () => {
			skeleton.radius = '8px';
			await skeleton.updateComplete;
			expect(skeleton.radius).toBe('8px');
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-skel
					type="avatar"
					lines="3"
					animated
					size="lg"
					glow
				></t-skel>
			`);

			expect(withAttrs.type).toBe('avatar');
			expect(withAttrs.lines).toBe(3);
			expect(withAttrs.animated).toBe(true);
			expect(withAttrs.size).toBe('lg');
			expect(withAttrs.glow).toBe(true);

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('getAvailableTypes() should return array of types', () => {
			const types = skeleton.getAvailableTypes();
			expect(Array.isArray(types)).toBe(true);
			expect(types).toContain('text');
			expect(types).toContain('heading');
			expect(types).toContain('avatar');
			expect(types).toContain('button');
			expect(types).toContain('card');
			expect(types).toContain('rect');
			expect(types).toContain('circle');
		});
	});

	// ======================================================
	// SUITE 4: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await skeleton.updateComplete;
			expect(skeleton.shadowRoot).toBeTruthy();
		});

		it('should render text skeleton by default', async () => {
			await skeleton.updateComplete;
			const textEl = skeleton.shadowRoot.querySelector('.skeleton-text');
			expect(textEl).toBeTruthy();
		});

		it('should render multiple text lines', async () => {
			skeleton.lines = 3;
			await skeleton.updateComplete;

			const lines = skeleton.shadowRoot.querySelectorAll('.skeleton-text');
			expect(lines.length).toBe(3);
		});

		it('should render heading skeleton', async () => {
			skeleton.type = 'heading';
			await skeleton.updateComplete;

			const heading = skeleton.shadowRoot.querySelector('.skeleton-heading');
			expect(heading).toBeTruthy();
		});

		it('should render avatar skeleton', async () => {
			skeleton.type = 'avatar';
			await skeleton.updateComplete;

			const avatar = skeleton.shadowRoot.querySelector('.skeleton-avatar');
			expect(avatar).toBeTruthy();
		});

		it('should render avatar with size class', async () => {
			skeleton.type = 'avatar';
			skeleton.size = 'lg';
			await skeleton.updateComplete;

			const avatar = skeleton.shadowRoot.querySelector('.skeleton-avatar');
			expect(avatar.classList.contains('size-lg')).toBe(true);
		});

		it('should render button skeleton', async () => {
			skeleton.type = 'button';
			await skeleton.updateComplete;

			const button = skeleton.shadowRoot.querySelector('.skeleton-button');
			expect(button).toBeTruthy();
		});

		it('should render card skeleton', async () => {
			skeleton.type = 'card';
			await skeleton.updateComplete;

			const card = skeleton.shadowRoot.querySelector('.skeleton-card');
			expect(card).toBeTruthy();
			expect(skeleton.shadowRoot.querySelector('.card-header')).toBeTruthy();
			expect(skeleton.shadowRoot.querySelector('.card-avatar')).toBeTruthy();
		});

		it('should render rect skeleton', async () => {
			skeleton.type = 'rect';
			await skeleton.updateComplete;

			const rect = skeleton.shadowRoot.querySelector('.skeleton-rect');
			expect(rect).toBeTruthy();
		});

		it('should render circle skeleton', async () => {
			skeleton.type = 'circle';
			await skeleton.updateComplete;

			const circle = skeleton.shadowRoot.querySelector('.skeleton-circle');
			expect(circle).toBeTruthy();
		});

		it('should apply animated class when animated is true', async () => {
			skeleton.animated = true;
			await skeleton.updateComplete;

			const el = skeleton.shadowRoot.querySelector('.skeleton');
			expect(el.classList.contains('animated')).toBe(true);
		});

		it('should not apply animated class when animated is false', async () => {
			skeleton.animated = false;
			await skeleton.updateComplete;

			const el = skeleton.shadowRoot.querySelector('.skeleton');
			expect(el.classList.contains('animated')).toBe(false);
		});

		it('should render fallback rect for unknown type', async () => {
			skeleton.type = 'unknown';
			await skeleton.updateComplete;

			const rect = skeleton.shadowRoot.querySelector('.skeleton-rect');
			expect(rect).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 5: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(skeleton._logger).toBeTruthy();
		});
	});
});
