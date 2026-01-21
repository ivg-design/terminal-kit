/**
 * TChartLit Component Tests
 * DISPLAY profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TChartLit.js';

describe('TChartLit', () => {
	let chart;
	const sampleData = [
		{ label: 'Jan', value: 100 },
		{ label: 'Feb', value: 150 },
		{ label: 'Mar', value: 80 },
		{ label: 'Apr', value: 200 },
		{ label: 'May', value: 120 }
	];

	beforeEach(async () => {
		chart = await fixture(html`<t-chart></t-chart>`);
	});

	afterEach(() => {
		chart?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(chart.constructor.tagName).toBe('t-chart');
		});

		it('should have correct version', () => {
			expect(chart.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(chart.constructor.category).toBe('Display');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyChart = document.createElement('t-chart');
			expect(emptyChart.type).toBe('bar');
			expect(emptyChart.data).toEqual([]);
			expect(emptyChart.orientation).toBe('vertical');
			expect(emptyChart.showLegend).toBe(false);
			expect(emptyChart.showLabels).toBe(true);
			expect(emptyChart.showTooltips).toBe(true);
			expect(emptyChart.showGrid).toBe(true);
			expect(emptyChart.animated).toBe(true);
			expect(emptyChart.height).toBe('200px');
			expect(emptyChart.colors).toEqual([]);
			expect(emptyChart.title).toBe('');
		});

		it('should update type property', async () => {
			chart.type = 'line';
			await chart.updateComplete;
			expect(chart.type).toBe('line');
			expect(chart.getAttribute('type')).toBe('line');
		});

		it('should update data property', async () => {
			chart.data = sampleData;
			await chart.updateComplete;
			expect(chart.data).toEqual(sampleData);
		});

		it('should update orientation property', async () => {
			chart.orientation = 'horizontal';
			await chart.updateComplete;
			expect(chart.orientation).toBe('horizontal');
		});

		it('should update showLegend property', async () => {
			chart.showLegend = true;
			await chart.updateComplete;
			expect(chart.showLegend).toBe(true);
			expect(chart.hasAttribute('show-legend')).toBe(true);
		});

		it('should update showLabels property', async () => {
			chart.showLabels = false;
			await chart.updateComplete;
			expect(chart.showLabels).toBe(false);
		});

		it('should update showGrid property', async () => {
			chart.showGrid = false;
			await chart.updateComplete;
			expect(chart.showGrid).toBe(false);
		});

		it('should update height property', async () => {
			chart.height = '300px';
			await chart.updateComplete;
			expect(chart.height).toBe('300px');
		});

		it('should update title property', async () => {
			chart.title = 'Monthly Sales';
			await chart.updateComplete;
			expect(chart.title).toBe('Monthly Sales');
		});

		it('should update colors property', async () => {
			chart.colors = ['#ff0000', '#00ff00', '#0000ff'];
			await chart.updateComplete;
			expect(chart.colors).toEqual(['#ff0000', '#00ff00', '#0000ff']);
		});

		it('should set properties from attributes', async () => {
			const withAttrs = await fixture(html`
				<t-chart
					type="pie"
					show-legend
					height="250px"
					title="Test Chart"
				></t-chart>
			`);

			expect(withAttrs.type).toBe('pie');
			expect(withAttrs.showLegend).toBe(true);
			expect(withAttrs.height).toBe('250px');
			expect(withAttrs.title).toBe('Test Chart');

			withAttrs.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('setData() should update chart data', async () => {
			chart.setData(sampleData);
			await chart.updateComplete;
			expect(chart.data).toEqual(sampleData);
		});

		it('getColor() should return default colors', () => {
			// Terminal color scheme: #00ff41, #00cc33, #00ffff, #00b8b8, ...
			expect(chart.getColor(0)).toBe('#00ff41');
			expect(chart.getColor(1)).toBe('#00cc33');
		});

		it('getColor() should return custom colors when set', async () => {
			chart.colors = ['#red', '#blue'];
			await chart.updateComplete;

			expect(chart.getColor(0)).toBe('#red');
			expect(chart.getColor(1)).toBe('#blue');
		});

		it('getColor() should cycle through colors', () => {
			const color0 = chart.getColor(0);
			const color8 = chart.getColor(8); // Should cycle back
			expect(color8).toBe(color0);
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		beforeEach(async () => {
			chart.data = sampleData;
			await chart.updateComplete;
		});

		it('should fire segment-click event', async () => {
			const handler = vi.fn();
			chart.addEventListener('segment-click', handler);

			const bar = chart.shadowRoot.querySelector('.bar');
			if (bar) bar.dispatchEvent(new Event('click'));

			expect(handler).toHaveBeenCalled();
		});

		it('should fire segment-hover event on enter', async () => {
			const handler = vi.fn();
			chart.addEventListener('segment-hover', handler);

			const bar = chart.shadowRoot.querySelector('.bar');
			if (bar) bar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.entering).toBe(true);
		});

		it('should fire segment-hover event on leave', async () => {
			const handler = vi.fn();
			chart.addEventListener('segment-hover', handler);

			const bar = chart.shadowRoot.querySelector('.bar');
			if (bar) bar.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.entering).toBe(false);
		});

		it('events should bubble', async () => {
			const handler = vi.fn();
			document.body.addEventListener('segment-click', handler);

			const bar = chart.shadowRoot.querySelector('.bar');
			if (bar) bar.dispatchEvent(new Event('click'));

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('segment-click', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await chart.updateComplete;
			expect(chart.shadowRoot).toBeTruthy();
		});

		it('should render empty state when no data', async () => {
			await chart.updateComplete;
			const empty = chart.shadowRoot.querySelector('.empty-state');
			expect(empty).toBeTruthy();
		});

		it('should render chart container with data', async () => {
			chart.data = sampleData;
			await chart.updateComplete;
			const container = chart.shadowRoot.querySelector('.chart-container');
			expect(container).toBeTruthy();
		});

		it('should render title when set', async () => {
			chart.data = sampleData;
			chart.title = 'Test Chart';
			await chart.updateComplete;

			const title = chart.shadowRoot.querySelector('.chart-title');
			expect(title).toBeTruthy();
			expect(title.textContent).toBe('Test Chart');
		});

		it('should render SVG element', async () => {
			chart.data = sampleData;
			await chart.updateComplete;

			const svg = chart.shadowRoot.querySelector('svg');
			expect(svg).toBeTruthy();
		});

		it('should render bars for bar chart', async () => {
			chart.type = 'bar';
			chart.data = sampleData;
			await chart.updateComplete;

			const bars = chart.shadowRoot.querySelectorAll('.bar');
			expect(bars.length).toBe(sampleData.length);
		});

		it('should render line and points for line chart', async () => {
			chart.type = 'line';
			chart.data = sampleData;
			await chart.updateComplete;

			const line = chart.shadowRoot.querySelector('.line');
			const points = chart.shadowRoot.querySelectorAll('.point');
			expect(line).toBeTruthy();
			expect(points.length).toBe(sampleData.length);
		});

		it('should render slices for pie chart', async () => {
			chart.type = 'pie';
			chart.data = sampleData;
			await chart.updateComplete;

			const slices = chart.shadowRoot.querySelectorAll('.slice');
			expect(slices.length).toBe(sampleData.length);
		});

		it('should render slices for donut chart', async () => {
			chart.type = 'donut';
			chart.data = sampleData;
			await chart.updateComplete;

			const slices = chart.shadowRoot.querySelectorAll('.slice');
			expect(slices.length).toBe(sampleData.length);
		});

		it('should render legend when showLegend is true', async () => {
			chart.data = sampleData;
			chart.showLegend = true;
			await chart.updateComplete;

			const legend = chart.shadowRoot.querySelector('.legend');
			expect(legend).toBeTruthy();

			const items = legend.querySelectorAll('.legend-item');
			expect(items.length).toBe(sampleData.length);
		});

		it('should render grid when showGrid is true', async () => {
			chart.data = sampleData;
			chart.showGrid = true;
			await chart.updateComplete;

			const gridLines = chart.shadowRoot.querySelectorAll('.grid-line');
			expect(gridLines.length).toBeGreaterThan(0);
		});

		it('should not render grid when showGrid is false', async () => {
			chart.data = sampleData;
			chart.showGrid = false;
			await chart.updateComplete;

			const gridLines = chart.shadowRoot.querySelectorAll('.grid-line');
			expect(gridLines.length).toBe(0);
		});

		it('should render data labels when showLabels is true', async () => {
			chart.data = sampleData;
			chart.showLabels = true;
			await chart.updateComplete;

			const labels = chart.shadowRoot.querySelectorAll('.data-label');
			expect(labels.length).toBeGreaterThan(0);
		});

		it('should not render data labels when showLabels is false', async () => {
			chart.data = sampleData;
			chart.showLabels = false;
			await chart.updateComplete;

			const labels = chart.shadowRoot.querySelectorAll('.data-label');
			expect(labels.length).toBe(0);
		});

		it('should render tooltip element', async () => {
			chart.data = sampleData;
			chart.showTooltips = true;
			await chart.updateComplete;

			const tooltip = chart.shadowRoot.querySelector('.tooltip');
			expect(tooltip).toBeTruthy();
		});

		it('should apply custom colors', async () => {
			chart.data = [
				{ label: 'A', value: 10, color: '#ff0000' },
				{ label: 'B', value: 20, color: '#00ff00' }
			];
			await chart.updateComplete;

			const bars = chart.shadowRoot.querySelectorAll('.bar');
			expect(bars[0].getAttribute('fill')).toBe('#ff0000');
			expect(bars[1].getAttribute('fill')).toBe('#00ff00');
		});
	});

	// ======================================================
	// SUITE 6: Chart Types
	// ======================================================
	describe('Chart Types', () => {
		it('should render bar chart by default', async () => {
			chart.data = sampleData;
			await chart.updateComplete;

			expect(chart.shadowRoot.querySelector('.bar')).toBeTruthy();
		});

		it('should switch to line chart', async () => {
			chart.data = sampleData;
			chart.type = 'line';
			await chart.updateComplete;

			expect(chart.shadowRoot.querySelector('.line')).toBeTruthy();
			expect(chart.shadowRoot.querySelector('.bar')).toBeFalsy();
		});

		it('should switch to pie chart', async () => {
			chart.data = sampleData;
			chart.type = 'pie';
			await chart.updateComplete;

			expect(chart.shadowRoot.querySelector('.slice')).toBeTruthy();
			expect(chart.shadowRoot.querySelector('.bar')).toBeFalsy();
		});

		it('should switch to donut chart', async () => {
			chart.data = sampleData;
			chart.type = 'donut';
			await chart.updateComplete;

			expect(chart.shadowRoot.querySelector('.slice')).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(chart._logger).toBeTruthy();
		});
	});
});
