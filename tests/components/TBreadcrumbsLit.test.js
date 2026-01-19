// ============================================================
// TBreadcrumbsLit Test Suite
// ============================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TBreadcrumbsLit.js';

describe('TBreadcrumbsLit', () => {
	let element;

	// Sample items for testing
	const sampleItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: 'Electronics', href: '/products/electronics' },
		{ label: 'Laptops' }
	];

	beforeEach(async () => {
		element = await fixture(html`<t-bread></t-bread>`);
	});

	afterEach(() => {
		if (element && element.parentNode) {
			element.parentNode.removeChild(element);
		}
	});

	// ============================================================
	// Manifest Tests
	// ============================================================
	describe('Manifest', () => {
		it('should have correct tagName', () => {
			expect(element.constructor.tagName).toBe('t-bread');
		});

		it('should have version', () => {
			expect(element.constructor.version).toBe('1.0.0');
		});

		it('should have category', () => {
			expect(element.constructor.category).toBe('Navigation');
		});

		it('should generate manifest', () => {
			const manifest = element.constructor.generateManifest();
			expect(manifest.tagName).toBe('t-bread');
			expect(manifest.properties).toBeDefined();
			expect(manifest.events).toBeDefined();
		});
	});

	// ============================================================
	// Properties Tests
	// ============================================================
	describe('Properties', () => {
		it('should have default items as empty array', () => {
			expect(element.items).toEqual([]);
		});

		it('should have default variant as default', () => {
			expect(element.variant).toBe('default');
		});

		it('should have default size as md', () => {
			expect(element.size).toBe('md');
		});

		it('should have default separator as empty string', () => {
			expect(element.separator).toBe('');
		});

		it('should have default maxItems as 0', () => {
			expect(element.maxItems).toBe(0);
		});

		it('should have default disabled as false', () => {
			expect(element.disabled).toBe(false);
		});

		it('should accept items array', async () => {
			element.items = sampleItems;
			await element.updateComplete;
			expect(element.items).toEqual(sampleItems);
		});

		it('should reflect variant attribute', async () => {
			element.variant = 'arrows';
			await element.updateComplete;
			expect(element.getAttribute('variant')).toBe('arrows');
		});

		it('should reflect size attribute', async () => {
			element.size = 'sm';
			await element.updateComplete;
			expect(element.getAttribute('size')).toBe('sm');
		});

		it('should reflect disabled attribute', async () => {
			element.disabled = true;
			await element.updateComplete;
			expect(element.hasAttribute('disabled')).toBe(true);
		});
	});

	// ============================================================
	// Rendering Tests
	// ============================================================
	describe('Rendering', () => {
		it('should render nav element', () => {
			const nav = element.shadowRoot.querySelector('nav');
			expect(nav).toBeTruthy();
			expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
		});

		it('should render breadcrumb items', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const items = element.shadowRoot.querySelectorAll('.breadcrumb-item');
			expect(items.length).toBe(4);
		});

		it('should render links for items with href (except last)', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const links = element.shadowRoot.querySelectorAll('a.breadcrumb-item');
			expect(links.length).toBe(3); // First 3 have href
		});

		it('should render last item as span', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const lastItem = element.shadowRoot.querySelectorAll('.breadcrumb-item')[3];
			expect(lastItem.tagName.toLowerCase()).toBe('span');
		});

		it('should add current class to last item', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const lastItem = element.shadowRoot.querySelectorAll('.breadcrumb-item')[3];
			expect(lastItem.classList.contains('current')).toBe(true);
		});

		it('should render separators between items', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const separators = element.shadowRoot.querySelectorAll('.separator');
			expect(separators.length).toBe(3); // n-1 separators
		});

		it('should render custom separator', async () => {
			element.items = sampleItems;
			element.separator = '→';
			await element.updateComplete;

			const separator = element.shadowRoot.querySelector('.separator');
			expect(separator.textContent).toBe('→');
		});

		it('should render SVG for arrows variant', async () => {
			element.items = sampleItems;
			element.variant = 'arrows';
			await element.updateComplete;

			const separatorSvg = element.shadowRoot.querySelector('.separator svg');
			expect(separatorSvg).toBeTruthy();
		});
	});

	// ============================================================
	// Variant Tests
	// ============================================================
	describe('Variants', () => {
		const variants = ['default', 'arrows', 'dots', 'dashes', 'brackets', 'pills', 'path', 'steps', 'underline'];

		variants.forEach(variant => {
			it(`should render ${variant} variant`, async () => {
				element.items = sampleItems;
				element.variant = variant;
				await element.updateComplete;

				expect(element.getAttribute('variant')).toBe(variant);
				const nav = element.shadowRoot.querySelector('.breadcrumbs');
				expect(nav).toBeTruthy();
			});
		});
	});

	// ============================================================
	// Size Tests
	// ============================================================
	describe('Sizes', () => {
		const sizes = ['sm', 'md', 'lg'];

		sizes.forEach(size => {
			it(`should apply ${size} size`, async () => {
				element.items = sampleItems;
				element.size = size;
				await element.updateComplete;

				expect(element.getAttribute('size')).toBe(size);
			});
		});
	});

	// ============================================================
	// Collapsing Tests
	// ============================================================
	describe('Collapsing', () => {
		it('should collapse when items exceed maxItems', async () => {
			element.items = sampleItems;
			element.maxItems = 3;
			await element.updateComplete;

			const ellipsis = element.shadowRoot.querySelector('.collapsed-indicator');
			expect(ellipsis).toBeTruthy();
		});

		it('should show ellipsis with hidden count', async () => {
			element.items = sampleItems;
			element.maxItems = 3;
			await element.updateComplete;

			const ellipsis = element.shadowRoot.querySelector('.collapsed-indicator');
			expect(ellipsis.getAttribute('title')).toContain('2 more items');
		});

		it('should expand when ellipsis is clicked', async () => {
			element.items = sampleItems;
			element.maxItems = 3;
			await element.updateComplete;

			const ellipsis = element.shadowRoot.querySelector('.collapsed-indicator');
			ellipsis.click();
			await element.updateComplete;

			const items = element.shadowRoot.querySelectorAll('.breadcrumb-item');
			expect(items.length).toBe(4);
		});

		it('should not collapse when maxItems is 0', async () => {
			element.items = sampleItems;
			element.maxItems = 0;
			await element.updateComplete;

			const ellipsis = element.shadowRoot.querySelector('.collapsed-indicator');
			expect(ellipsis).toBeNull();
		});
	});

	// ============================================================
	// Events Tests
	// ============================================================
	describe('Events', () => {
		it('should emit breadcrumb-click on item click', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const eventPromise = new Promise(resolve => {
				element.addEventListener('breadcrumb-click', resolve, { once: true });
			});
			const firstItem = element.shadowRoot.querySelector('.breadcrumb-item');
			firstItem.click();

			const event = await eventPromise;
			expect(event.detail.index).toBe(0);
			expect(event.detail.item.label).toBe('Home');
		});

		it('should emit breadcrumb-expand on ellipsis click', async () => {
			element.items = sampleItems;
			element.maxItems = 3;
			await element.updateComplete;

			const eventPromise = new Promise(resolve => {
				element.addEventListener('breadcrumb-expand', resolve, { once: true });
			});
			const ellipsis = element.shadowRoot.querySelector('.collapsed-indicator');
			ellipsis.click();

			const event = await eventPromise;
			expect(event).toBeTruthy();
		});

		it('should emit breadcrumb-navigate from navigateTo()', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const eventPromise = new Promise(resolve => {
				element.addEventListener('breadcrumb-navigate', resolve, { once: true });
			});
			element.navigateTo(1);

			const event = await eventPromise;
			expect(event.detail.index).toBe(1);
			expect(event.detail.item.label).toBe('Products');
		});

		it('events should bubble and be composed', async () => {
			element.items = sampleItems;
			await element.updateComplete;

			const eventPromise = new Promise(resolve => {
				element.addEventListener('breadcrumb-click', resolve, { once: true });
			});
			element.shadowRoot.querySelector('.breadcrumb-item').click();

			const event = await eventPromise;
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);
		});
	});

	// ============================================================
	// Methods Tests
	// ============================================================
	describe('Methods', () => {
		it('should expand collapsed breadcrumbs', async () => {
			element.items = sampleItems;
			element.maxItems = 3;
			await element.updateComplete;

			element.expand();
			await element.updateComplete;

			expect(element._expanded).toBe(true);
			const items = element.shadowRoot.querySelectorAll('.breadcrumb-item');
			expect(items.length).toBe(4);
		});

		it('should collapse expanded breadcrumbs', async () => {
			element.items = sampleItems;
			element.maxItems = 3;
			element._expanded = true;
			await element.updateComplete;

			element.collapse();
			await element.updateComplete;

			expect(element._expanded).toBe(false);
		});
	});

	// ============================================================
	// Icon Tests
	// ============================================================
	describe('Icons', () => {
		it('should render icon when provided as SVG', async () => {
			element.items = [
				{ label: 'Home', href: '/', icon: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>' },
				{ label: 'Products' }
			];
			await element.updateComplete;

			const icon = element.shadowRoot.querySelector('.breadcrumb-icon');
			expect(icon).toBeTruthy();
		});
	});

	// ============================================================
	// Accessibility Tests
	// ============================================================
	describe('Accessibility', () => {
		it('should have nav with aria-label', () => {
			const nav = element.shadowRoot.querySelector('nav');
			expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
		});
	});

	// ============================================================
	// Logging Tests
	// ============================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(element._logger).toBeTruthy();
		});

		it('should log on navigateTo', () => {
			const logSpy = vi.spyOn(element._logger, 'debug');
			element.items = sampleItems;
			element.navigateTo(0);
			expect(logSpy).toHaveBeenCalledWith('navigateTo called', expect.any(Object));
		});
	});
});
