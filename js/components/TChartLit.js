/**
 * @fileoverview TChartLit - Simple data visualization component
 * @module components/TChartLit
 * @version 3.0.0
 *
 * A DISPLAY profile chart component with bar, line, pie, and donut chart types.
 * Uses SVG for rendering with terminal-themed colors.
 */

import { LitElement, html, css, svg } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================

/**
 * @component TChartLit
 * @tagname t-chart
 * @description Simple data visualization component (bar, line, pie, donut).
 * @category Display
 * @since 3.0.0
 *
 * @element t-chart
 *
 * @fires segment-click - Fired when a chart segment is clicked
 * @fires segment-hover - Fired when hovering over a segment
 *
 * @csspart chart - The chart container
 * @csspart svg - The SVG element
 * @csspart bar - Bar chart bars
 * @csspart line - Line chart line
 * @csspart point - Line chart points
 * @csspart slice - Pie/donut slices
 * @csspart legend - Chart legend
 * @csspart tooltip - Hover tooltip
 */
class TChartLit extends LitElement {
	/** @static @readonly */
	static tagName = 't-chart';

	/** @static @readonly */
	static version = '3.0.0';

	/** @static @readonly */
	static category = 'Display';

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			background: var(--t-chart-bg, var(--terminal-gray-darkest, #1a1a1a));
			border: 1px solid var(--t-chart-border, var(--terminal-gray-dark, #333));
			color: var(--t-chart-color, var(--terminal-green, #00ff41));
			padding: 8px;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: hidden;
		}

		.chart-container {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			min-height: 0;
		}

		.chart-title {
			font-size: clamp(10px, 2vw, 13px);
			font-weight: bold;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			margin-bottom: 6px;
			text-align: center;
			flex-shrink: 0;
		}

		svg {
			display: block;
			width: 100%;
			height: 100%;
			flex: 1;
			min-height: 0;
			overflow: visible;
		}

		/* Bar styles */
		.bar {
			transition: opacity 0.15s ease;
			cursor: pointer;
		}

		.bar:hover {
			opacity: 0.8;
		}

		/* Line styles */
		.line {
			fill: none;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		.point {
			cursor: pointer;
			transition: r 0.15s ease;
		}

		.point:hover {
			r: 6;
		}

		/* Pie/Donut styles */
		.slice {
			cursor: pointer;
			transition: opacity 0.15s ease, transform 0.15s ease;
			transform-origin: center;
		}

		.slice:hover {
			opacity: 0.85;
			transform: scale(1.02);
		}

		/* Grid lines */
		.grid-line {
			stroke: var(--terminal-gray, #444);
			stroke-width: 1;
			stroke-dasharray: 3, 3;
			opacity: 0.6;
		}

		/* Axis */
		.axis-line {
			stroke: var(--terminal-gray, #666);
			stroke-width: 1;
		}

		.axis-label {
			font-size: 10px;
			fill: var(--terminal-gray, #666);
		}

		.axis-value {
			font-size: 9px;
			fill: var(--terminal-gray, #666);
		}

		/* Legend */
		.legend {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			justify-content: center;
			margin-top: 16px;
			margin-bottom: 8px;
			padding-bottom: 8px;
			font-size: 11px;
			flex-shrink: 0;
		}

		.legend-item {
			display: flex;
			align-items: center;
			gap: 6px;
			cursor: pointer;
			transition: opacity 0.15s ease;
		}

		.legend-item:hover {
			opacity: 0.7;
		}

		.legend-color {
			width: 12px;
			height: 12px;
			flex-shrink: 0;
		}

		.legend-label {
			color: var(--terminal-gray, #666);
		}

		/* Tooltip */
		.tooltip {
			position: absolute;
			background: var(--terminal-black, #0a0a0a);
			border: 1px solid var(--terminal-green, #00ff41);
			padding: 8px 12px;
			font-size: 11px;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.15s ease;
			z-index: 100;
			white-space: nowrap;
		}

		.tooltip.visible {
			opacity: 1;
		}

		.tooltip-label {
			color: var(--terminal-gray, #666);
			margin-bottom: 4px;
		}

		.tooltip-value {
			color: var(--terminal-green, #00ff41);
			font-weight: bold;
		}

		/* Data label */
		.data-label {
			font-size: 10px;
			fill: var(--terminal-green, #00ff41);
			text-anchor: middle;
		}

		/* Data labels on pie/donut - need contrast */
		.data-label.on-slice {
			fill: var(--terminal-gray-darkest, #1a1a1a);
			font-weight: 600;
			font-size: 11px;
		}

		/* Monochrome mode - labels should be same green color */
		:host([monochrome]) .data-label.on-slice {
			fill: var(--chart-base-color, var(--terminal-green, #00ff41));
		}

		/* Empty state */
		.empty-state {
			text-align: center;
			padding: 40px 20px;
			color: var(--terminal-gray, #666);
		}
	`;

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================
	_lastMeasuredWidth = 400;
	_lastMeasuredHeight = 200;

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		/**
		 * Chart type: 'bar', 'line', 'pie', 'donut'
		 * @property {String} type
		 * @default 'bar'
		 * @reflects
		 */
		type: { type: String, reflect: true },

		/**
		 * Array of data points: [{ label, value, color? }]
		 * @property {Array} data
		 * @default []
		 */
		data: { type: Array },

		/**
		 * Chart orientation: 'vertical', 'horizontal' (bar chart only)
		 * @property {String} orientation
		 * @default 'vertical'
		 * @reflects
		 */
		orientation: { type: String, reflect: true },

		/**
		 * Show legend
		 * @property {Boolean} showLegend
		 * @default false
		 * @reflects
		 */
		showLegend: { type: Boolean, reflect: true, attribute: 'show-legend' },

		/**
		 * Show data labels on chart
		 * @property {Boolean} showLabels
		 * @default true
		 * @reflects
		 */
		showLabels: { type: Boolean, reflect: true, attribute: 'show-labels' },

		/**
		 * Show tooltips on hover
		 * @property {Boolean} showTooltips
		 * @default true
		 * @reflects
		 */
		showTooltips: { type: Boolean, reflect: true, attribute: 'show-tooltips' },

		/**
		 * Show grid lines
		 * @property {Boolean} showGrid
		 * @default true
		 * @reflects
		 */
		showGrid: { type: Boolean, reflect: true, attribute: 'show-grid' },

		/**
		 * Animate chart on load
		 * @property {Boolean} animated
		 * @default true
		 * @reflects
		 */
		animated: { type: Boolean, reflect: true },

		/**
		 * Chart height
		 * @property {String} height
		 * @default '200px'
		 */
		height: { type: String },

		/**
		 * Custom colors array
		 * @property {Array} colors
		 * @default []
		 */
		colors: { type: Array },

		/**
		 * Chart title
		 * @property {String} title
		 * @default ''
		 */
		title: { type: String },

		/**
		 * Monochrome mode - uses shades of a single color
		 * @property {Boolean} monochrome
		 * @default false
		 */
		monochrome: { type: Boolean, reflect: true },

		/**
		 * Base color for monochrome mode or custom theme
		 * @property {String} baseColor
		 * @default '#00ff41'
		 * @attribute base-color
		 */
		baseColor: { type: String, attribute: 'base-color' },

		/**
		 * Color scheme preset
		 * @property {String} colorScheme
		 * @default 'terminal'
		 * @attribute color-scheme
		 */
		colorScheme: { type: String, attribute: 'color-scheme', reflect: true },

		/**
		 * Outline-only mode (no fill, just strokes) - for bar charts
		 * @property {Boolean} outlineOnly
		 * @default false
		 * @attribute outline-only
		 */
		outlineOnly: { type: Boolean, attribute: 'outline-only', reflect: true }
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/** @private - Tooltip state */
	_tooltipVisible = false;
	_tooltipX = 0;
	_tooltipY = 0;
	_tooltipLabel = '';
	_tooltipValue = '';

	/** @private - Color scheme presets */
	static _colorSchemes = {
		terminal: [
			'#00ff41', // Terminal green (primary)
			'#00cc33', // Green dim
			'#00ffff', // Cyan
			'#00b8b8', // Cyan dim
			'#ffb000', // Amber
			'#cc8c00', // Amber dim
			'#ff5050', // Red light
			'#9966ff'  // Purple soft
		],
		neon: [
			'#ff00ff', // Magenta
			'#00ffff', // Cyan
			'#ff0080', // Pink
			'#00ff80', // Mint
			'#8000ff', // Purple
			'#ffff00', // Yellow
			'#ff8000', // Orange
			'#0080ff'  // Blue
		],
		cool: [
			'#00ff41', // Green
			'#00ffff', // Cyan
			'#0099ff', // Blue
			'#00cc33', // Green dim
			'#33cccc', // Teal
			'#66ff99', // Mint
			'#0066cc', // Dark blue
			'#00ff99'  // Aqua
		],
		warm: [
			'#ff5050', // Red light
			'#ffb000', // Amber
			'#ff9900', // Orange
			'#ff6600', // Dark orange
			'#ff6699', // Pink
			'#ffcc00', // Gold
			'#ff4400', // Red-orange
			'#cc6600'  // Brown
		],
		grayscale: [
			'#e0e0e0', // Light gray
			'#b0b0b0', // Medium light
			'#888888', // Gray
			'#666666', // Dark gray
			'#505050', // Darker
			'#404040', // Very dark
			'#303030', // Near black
			'#202020'  // Almost black
		],
		// Monochrome schemes
		'mono-green': [
			'#00ff41',
			'#00dd38',
			'#00bb2f',
			'#009926',
			'#00771d',
			'#005514',
			'#00330b',
			'#001102'
		],
		'mono-cyan': [
			'#00ffff',
			'#00dddd',
			'#00bbbb',
			'#009999',
			'#007777',
			'#005555',
			'#003333',
			'#001111'
		],
		'mono-amber': [
			'#ffb000',
			'#dd9a00',
			'#bb8400',
			'#996e00',
			'#775800',
			'#554200',
			'#332c00',
			'#111600'
		]
	};

	/** @private - Default terminal colors */
	_defaultColors = TChartLit._colorSchemes.terminal;

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/** @private */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TChartLit');

		// Set defaults
		this.type = 'bar';
		this.data = [];
		this.orientation = 'vertical';
		this.showLegend = false;
		this.showLabels = true;
		this.showTooltips = true;
		this.showGrid = true;
		this.animated = true;
		this.height = '200px';
		this.colors = [];
		this.title = '';
		this.monochrome = false;
		this.baseColor = '#00ff41';
		this.colorScheme = 'terminal';
		this.outlineOnly = false;

		this._logger.debug('Component constructed');
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');
		this._setupResizeObserver();
	}

	disconnectedCallback() {
		this._clearResizeObserver();
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
	}

	firstUpdated() {
		this._logger.debug('First update complete');
		this._measureSize();
		requestAnimationFrame(() => this.requestUpdate());
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.keys(changedProperties));
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Update chart data
	 * @public
	 * @param {Array} newData - New data array
	 */
	setData(newData) {
		this._logger.debug('setData() called', { count: newData?.length });
		this.data = newData;
	}

	/**
	 * Get color for data point
	 * @public
	 * @param {number} index - Data point index
	 * @returns {string} Color value
	 */
	getColor(index) {
		// If custom colors provided, use those
		if (this.colors.length > 0) {
			return this.colors[index % this.colors.length];
		}

		// If monochrome mode, generate shades from base color
		if (this.monochrome) {
			return this._getMonochromeColor(index);
		}

		// Use color scheme
		const schemeColors = TChartLit._colorSchemes[this.colorScheme] || TChartLit._colorSchemes.terminal;
		return schemeColors[index % schemeColors.length];
	}

	/**
	 * Generate monochrome color - returns same base color for all items
	 * @private
	 * @param {number} index - Data point index (unused - all same color)
	 * @returns {string} Color value
	 */
	_getMonochromeColor(index) {
		// True monochrome: ALL items use the SAME base color
		return this.baseColor || '#00ff41';
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * Emit a custom event
	 * @private
	 */
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	/**
	 * Emit segment-click event
	 * @private
	 */
	_emitSegmentClick(item, index) {
		this._emitEvent('segment-click', { item, index, label: item.label, value: item.value });
	}

	/**
	 * Emit segment-hover event
	 * @private
	 */
	_emitSegmentHover(item, index, entering) {
		this._emitEvent('segment-hover', { item, index, entering });
	}

	// ============================================================
	// BLOCK 10: Nesting Support (N/A)
	// ============================================================

	// ============================================================
	// BLOCK 11: Validation (N/A)
	// ============================================================

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		if (!this.data || this.data.length === 0) {
			return html`
				<div class="empty-state">No data to display</div>
			`;
		}

		// Set CSS variable for base color (used in monochrome mode)
		const containerStyle = this.monochrome ? `--chart-base-color: ${this.baseColor}` : '';

		return html`
			<div class="chart-container" style="${containerStyle}">
				${this.title ? html`<div class="chart-title">${this.title}</div>` : ''}
				${this._renderChart()}
				${this.showLegend ? this._renderLegend() : ''}
				${this.showTooltips ? this._renderTooltip() : ''}
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Render chart based on type
	 * @private
	 */
	_renderChart() {
		switch (this.type) {
			case 'bar':
				return this._renderBarChart();
			case 'line':
				return this._renderLineChart();
			case 'pie':
				return this._renderPieChart();
			case 'donut':
				return this._renderDonutChart();
			default:
				return this._renderBarChart();
		}
	}

	_getChartWidth() {
		if (this._lastMeasuredWidth) return this._lastMeasuredWidth;
		const rect = this.getBoundingClientRect();
		if (rect.width) {
			const width = Math.max(120, rect.width - 16);
			this._lastMeasuredWidth = width;
			return width;
		}
		return this._lastMeasuredWidth || 300;
	}

	_getChartHeight() {
		const raw = this.height;
		if (typeof raw === 'string' && (raw.includes('%') || raw === 'auto')) {
			if (this._lastMeasuredHeight) return this._lastMeasuredHeight;
			const rect = this.getBoundingClientRect();
			if (rect.height) {
				const height = Math.max(120, rect.height - 16);
				this._lastMeasuredHeight = height;
				return height;
			}
			return this._lastMeasuredHeight || 160;
		}

		const parsed = parseInt(raw, 10);
		if (Number.isFinite(parsed) && parsed > 0) {
			this._lastMeasuredHeight = parsed;
			return parsed;
		}

		return this._lastMeasuredHeight || 200;
	}

	_setupResizeObserver() {
		if (this._resizeObserver || typeof ResizeObserver === 'undefined') return;
		this._resizeObserver = new ResizeObserver(entries => {
			const entry = entries[0];
			if (!entry) return;
			const { width, height } = entry.contentRect || {};
			if (!width && !height) return;
			if (this._resizeRaf) cancelAnimationFrame(this._resizeRaf);
			this._resizeRaf = requestAnimationFrame(() => {
				this._resizeRaf = null;
				const changed = this._measureSize(width, height);
				if (changed) this.requestUpdate();
			});
		});
		this._resizeObserver.observe(this);
	}

	_clearResizeObserver() {
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
		if (this._resizeRaf) {
			cancelAnimationFrame(this._resizeRaf);
			this._resizeRaf = null;
		}
	}

	_measureSize(width, height) {
		const rectWidth = width || this.getBoundingClientRect().width;
		const rectHeight = height || this.getBoundingClientRect().height;
		let changed = false;
		if (rectWidth) {
			const nextWidth = Math.max(120, rectWidth - 16);
			if (nextWidth !== this._lastMeasuredWidth) {
				this._lastMeasuredWidth = nextWidth;
				changed = true;
			}
		}
		if (rectHeight && (typeof this.height === 'string' && (this.height.includes('%') || this.height === 'auto'))) {
			const nextHeight = Math.max(120, rectHeight - 16);
			if (nextHeight !== this._lastMeasuredHeight) {
				this._lastMeasuredHeight = nextHeight;
				changed = true;
			}
		}
		return changed;
	}

	_getHeightStyle() {
		if (typeof this.height === 'string' && (this.height.includes('%') || this.height === 'auto')) {
			return 'height: 100%;';
		}
		return `height: ${this.height}`;
	}

	/**
	 * Render bar chart
	 * @private
	 */
	_renderBarChart() {
		const height = this._getChartHeight();
		const width = this._getChartWidth();
		const padding = { top: 20, right: 20, bottom: 40, left: 50 };
		const chartWidth = width - padding.left - padding.right;
		const chartHeight = height - padding.top - padding.bottom;

		const maxValue = Math.max(...this.data.map(d => d.value));
		const barWidth = chartWidth / this.data.length * 0.7;
		const barGap = chartWidth / this.data.length * 0.3;

		const isVertical = this.orientation === 'vertical';

		return html`
			<svg viewBox="0 0 ${width} ${height}" style="${this._getHeightStyle()}" part="svg">
				<!-- Grid lines -->
				${this.showGrid ? this._renderGrid(padding, chartWidth, chartHeight, maxValue, isVertical) : ''}

				<!-- Bars -->
				<g transform="translate(${padding.left}, ${padding.top})">
					${this.data.map((item, i) => {
						const color = item.color || this.getColor(i);
						const barHeight = (item.value / maxValue) * chartHeight;
						const x = i * (barWidth + barGap) + barGap / 2;
						const y = chartHeight - barHeight;

						return svg`
							<rect
								class="bar"
								part="bar"
								x=${x}
								y=${y}
								width=${barWidth}
								height=${barHeight}
								fill=${this.outlineOnly ? 'transparent' : color}
								stroke=${this.outlineOnly ? color : 'none'}
								stroke-width=${this.outlineOnly ? '2' : '0'}
								@click=${() => this._handleSegmentClick(item, i)}
								@mouseenter=${(e) => this._handleSegmentHover(e, item, i, true)}
								@mouseleave=${(e) => this._handleSegmentHover(e, item, i, false)}
							/>
							${this.showLabels ? svg`
								<text
									class="data-label"
									x=${x + barWidth / 2}
									y=${y - 5}
								>
									${item.value}
								</text>
							` : ''}
						`;
					})}
				</g>

				<!-- X Axis Labels -->
				<g transform="translate(${padding.left}, ${height - padding.bottom + 15})">
					${this.data.map((item, i) => {
						const x = i * (barWidth + barGap) + barGap / 2 + barWidth / 2;
						return svg`
							<text class="axis-label" x=${x} text-anchor="middle">
								${item.label}
							</text>
						`;
					})}
				</g>

				<!-- Y Axis -->
				${this._renderYAxis(padding, chartHeight, maxValue)}
			</svg>
		`;
	}

	/**
	 * Render line chart
	 * @private
	 */
	_renderLineChart() {
		const height = this._getChartHeight();
		const width = this._getChartWidth();
		const padding = { top: 20, right: 20, bottom: 40, left: 50 };
		const chartWidth = width - padding.left - padding.right;
		const chartHeight = height - padding.top - padding.bottom;

		const maxValue = Math.max(...this.data.map(d => d.value));
		const stepX = chartWidth / (this.data.length - 1 || 1);

		const points = this.data.map((item, i) => {
			const x = i * stepX;
			const y = chartHeight - (item.value / maxValue) * chartHeight;
			return { x, y, item, index: i };
		});

		const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

		return html`
			<svg viewBox="0 0 ${width} ${height}" style="${this._getHeightStyle()}" part="svg">
				<!-- Grid lines -->
				${this.showGrid ? this._renderGrid(padding, chartWidth, chartHeight, maxValue, true) : ''}

				<g transform="translate(${padding.left}, ${padding.top})">
					<!-- Line -->
					<path
						class="line"
						part="line"
						d=${linePath}
						stroke=${this.getColor(0)}
					/>

					<!-- Points -->
					${points.map(p => svg`
						<circle
							class="point"
							part="point"
							cx=${p.x}
							cy=${p.y}
							r="4"
							fill=${this.getColor(p.index)}
							@click=${() => this._handleSegmentClick(p.item, p.index)}
							@mouseenter=${(e) => this._handleSegmentHover(e, p.item, p.index, true)}
							@mouseleave=${(e) => this._handleSegmentHover(e, p.item, p.index, false)}
						/>
						${this.showLabels ? svg`
							<text class="data-label" x=${p.x} y=${p.y - 10}>
								${p.item.value}
							</text>
						` : ''}
					`)}
				</g>

				<!-- X Axis Labels -->
				<g transform="translate(${padding.left}, ${height - padding.bottom + 15})">
					${this.data.map((item, i) => {
						const x = i * stepX;
						return svg`
							<text class="axis-label" x=${x} text-anchor="middle">
								${item.label}
							</text>
						`;
					})}
				</g>

				<!-- Y Axis -->
				${this._renderYAxis(padding, chartHeight, maxValue)}
			</svg>
		`;
	}

	/**
	 * Render pie chart
	 * @private
	 */
	_renderPieChart() {
		return this._renderCircularChart(false);
	}

	/**
	 * Render donut chart
	 * @private
	 */
	_renderDonutChart() {
		return this._renderCircularChart(true);
	}

	/**
	 * Render pie or donut chart
	 * @private
	 */
	_renderCircularChart(isDonut) {
		const size = Math.min(this._getChartWidth(), this._getChartHeight());
		const centerX = size / 2;
		const centerY = size / 2;
		const radius = size * 0.4;
		const innerRadius = isDonut ? radius * 0.6 : 0;

		const total = this.data.reduce((sum, d) => sum + d.value, 0);
		let currentAngle = -Math.PI / 2; // Start from top

		const slices = this.data.map((item, i) => {
			const angle = (item.value / total) * Math.PI * 2;
			const startAngle = currentAngle;
			const endAngle = currentAngle + angle;
			currentAngle = endAngle;

			const x1 = centerX + radius * Math.cos(startAngle);
			const y1 = centerY + radius * Math.sin(startAngle);
			const x2 = centerX + radius * Math.cos(endAngle);
			const y2 = centerY + radius * Math.sin(endAngle);

			const ix1 = centerX + innerRadius * Math.cos(startAngle);
			const iy1 = centerY + innerRadius * Math.sin(startAngle);
			const ix2 = centerX + innerRadius * Math.cos(endAngle);
			const iy2 = centerY + innerRadius * Math.sin(endAngle);

			const largeArc = angle > Math.PI ? 1 : 0;

			let path;
			if (isDonut) {
				path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
			} else {
				path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
			}

			// Label position
			const midAngle = startAngle + angle / 2;
			const labelRadius = radius * 0.7;
			const labelX = centerX + labelRadius * Math.cos(midAngle);
			const labelY = centerY + labelRadius * Math.sin(midAngle);

			return { path, item, index: i, labelX, labelY, percentage: ((item.value / total) * 100).toFixed(1) };
		});

		return html`
			<svg viewBox="0 0 ${size} ${size}" style="${this._getHeightStyle()}" part="svg">
				${slices.map(slice => svg`
					<path
						class="slice"
						part="slice"
						d=${slice.path}
						fill=${slice.item.color || this.getColor(slice.index)}
						@click=${() => this._handleSegmentClick(slice.item, slice.index)}
						@mouseenter=${(e) => this._handleSegmentHover(e, slice.item, slice.index, true)}
						@mouseleave=${(e) => this._handleSegmentHover(e, slice.item, slice.index, false)}
					/>
					${this.showLabels && parseFloat(slice.percentage) > 5 ? svg`
						<text
							class="data-label on-slice"
							x=${slice.labelX}
							y=${slice.labelY}
							dominant-baseline="middle"
						>
							${slice.percentage}%
						</text>
					` : ''}
				`)}
			</svg>
		`;
	}

	/**
	 * Render grid lines
	 * @private
	 */
	_renderGrid(padding, width, height, maxValue, isVertical) {
		const gridLines = 5;
		const lines = [];

		for (let i = 0; i <= gridLines; i++) {
			const y = padding.top + (height / gridLines) * i;
			lines.push(svg`
				<line
					class="grid-line"
					x1=${padding.left}
					y1=${y}
					x2=${padding.left + width}
					y2=${y}
				/>
			`);
		}

		return svg`${lines}`;
	}

	/**
	 * Render Y axis
	 * @private
	 */
	_renderYAxis(padding, chartHeight, maxValue) {
		const ticks = 5;
		const tickElements = [];

		for (let i = 0; i <= ticks; i++) {
			const value = Math.round((maxValue / ticks) * (ticks - i));
			const y = padding.top + (chartHeight / ticks) * i;

			tickElements.push(svg`
				<text class="axis-value" x=${padding.left - 8} y=${y + 3} text-anchor="end">
					${value}
				</text>
			`);
		}

		return svg`
			<line
				class="axis-line"
				x1=${padding.left}
				y1=${padding.top}
				x2=${padding.left}
				y2=${padding.top + chartHeight}
			/>
			${tickElements}
		`;
	}

	/**
	 * Render legend
	 * @private
	 */
	_renderLegend() {
		return html`
			<div class="legend" part="legend">
				${this.data.map((item, i) => html`
					<div
						class="legend-item"
						@click=${() => this._handleSegmentClick(item, i)}
					>
						<div class="legend-color" style="background: ${item.color || this.getColor(i)}"></div>
						<span class="legend-label">${item.label}</span>
					</div>
				`)}
			</div>
		`;
	}

	/**
	 * Render tooltip
	 * @private
	 */
	_renderTooltip() {
		return html`
			<div
				class="tooltip ${this._tooltipVisible ? 'visible' : ''}"
				part="tooltip"
				style="left: ${this._tooltipX}px; top: ${this._tooltipY}px"
			>
				<div class="tooltip-label">${this._tooltipLabel}</div>
				<div class="tooltip-value">${this._tooltipValue}</div>
			</div>
		`;
	}

	/**
	 * Handle segment click
	 * @private
	 */
	_handleSegmentClick(item, index) {
		this._emitSegmentClick(item, index);
	}

	/**
	 * Handle segment hover
	 * @private
	 */
	_handleSegmentHover(e, item, index, entering) {
		if (entering && this.showTooltips) {
			const rect = this.getBoundingClientRect();
			this._tooltipX = e.clientX - rect.left + 10;
			this._tooltipY = e.clientY - rect.top - 30;
			this._tooltipLabel = item.label;
			this._tooltipValue = item.value;
			this._tooltipVisible = true;
		} else {
			this._tooltipVisible = false;
		}

		this._emitSegmentHover(item, index, entering);
		this.requestUpdate();
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TChartLit.tagName)) {
	customElements.define(TChartLit.tagName, TChartLit);
}

export default TChartLit;
