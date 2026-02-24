import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import { TGridLit, TGridItemLit } from '../../js/components/TGridLit.js';

describe('TGridLit', () => {
	let grid;

	beforeEach(async () => {
		grid = await fixture(html`<t-grid></t-grid>`);
	});

	afterEach(() => {
		grid?.remove();
	});

	it('registers custom elements', () => {
		expect(customElements.get('t-grid')).toBeTruthy();
		expect(customElements.get('t-grid-item')).toBeTruthy();
	});

	it('exposes static metadata', () => {
		expect(TGridLit.tagName).toBe('t-grid');
		expect(TGridLit.version).toBe('3.0.0');
		expect(TGridLit.category).toBe('Container');
		expect(TGridItemLit.tagName).toBe('t-grid-item');
	});

	it('has expected default properties', async () => {
		await grid.updateComplete;
		expect(grid.columns).toBe(12);
		expect(grid.cellHeight).toBe(80);
		expect(grid.margin).toBe(10);
		expect(grid.draggable).toBe(true);
		expect(grid.resizable).toBe(true);
		expect(grid.lockSize).toBe(true);
	});

	it('uses light DOM render root', () => {
		expect(grid.createRenderRoot()).toBe(grid);
	});

	it('injects grid styles only once', async () => {
		const second = document.createElement('t-grid');
		document.body.appendChild(second);
		await second.updateComplete;

		expect(document.querySelectorAll('#t-grid-styles').length).toBe(1);

		second.remove();
	});

	it('fails gracefully when GridStack is unavailable', async () => {
		await grid.updateComplete;
		expect(grid._grid).toBeNull();
		expect(grid.addWidget({ id: 'a' })).toBeNull();
		expect(grid.getLayout()).toEqual([]);

		expect(() => {
			grid.removeWidget('.missing');
			grid.updateWidget(document.createElement('div'), { x: 1, y: 1 });
			grid.loadLayout([]);
			grid.compactGrid();
			grid.enable(false);
			grid.setStatic(true);
		}).not.toThrow();
	});
});

describe('TGridItemLit', () => {
	let item;

	beforeEach(async () => {
		item = await fixture(html`<t-grid-item item-id="item-1"></t-grid-item>`);
	});

	afterEach(() => {
		item?.remove();
	});

	it('has expected defaults', async () => {
		await item.updateComplete;
		expect(item.x).toBe(0);
		expect(item.y).toBe(0);
		expect(item.w).toBe(2);
		expect(item.h).toBe(2);
		expect(item.minW).toBe(2);
		expect(item.minH).toBe(1);
	});

	it('syncs grid attributes from properties', async () => {
		item.x = 3;
		item.y = 4;
		item.w = 5;
		item.h = 6;
		await item.updateComplete;

		expect(item.getAttribute('gs-x')).toBe('3');
		expect(item.getAttribute('gs-y')).toBe('4');
		expect(item.getAttribute('gs-w')).toBe('5');
		expect(item.getAttribute('gs-h')).toBe('6');
	});
});
