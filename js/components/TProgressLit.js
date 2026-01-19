// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css, svg } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TProgressLit
 * @tagname t-prg
 * @description Progress indicator component with bar and ring types, variants, and animations.
 * @category Display
 * @since 3.0.0
 * @example
 * <t-prg value="75" max="100"></t-prg>
 * <t-prg value="50" type="ring" show-label></t-prg>
 * <t-prg indeterminate variant="warning"></t-prg>
 */
export class TProgressLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-prg';
	static version = '3.0.0';
	static category = 'Display';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TProgressLit Component Styles
		 * Progress indicators with terminal styling
		 */

		/* Host styles */
		:host {
			display: inline-flex;
			align-items: center;
			--progress-bg: var(--terminal-gray-dark, #1a1a1a);
			--progress-fill: var(--terminal-green, #00ff41);
			--progress-glow: rgba(0, 255, 65, 0.4);
			--progress-height: 8px;
			--progress-radius: 0px;
			--progress-border: 1px solid var(--terminal-gray, #444);
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Bar container */
		.progress-bar {
			position: relative;
			width: 100%;
			height: var(--progress-height);
			background: var(--progress-bg);
			border-radius: var(--progress-radius);
			border: var(--progress-border);
			overflow: hidden;
		}

		/* Bar fill */
		.progress-fill {
			height: 100%;
			background: var(--progress-fill);
			border-radius: var(--progress-radius);
			transition: width 0.3s ease;
			box-shadow: 0 0 8px var(--progress-glow);
		}

		/* Buffer (secondary progress) */
		.progress-buffer {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			background: var(--progress-fill);
			opacity: 0.3;
			border-radius: var(--progress-radius);
			transition: width 0.3s ease;
		}

		/* Striped pattern */
		.progress-fill.striped {
			background-image: linear-gradient(
				45deg,
				rgba(255, 255, 255, 0.15) 25%,
				transparent 25%,
				transparent 50%,
				rgba(255, 255, 255, 0.15) 50%,
				rgba(255, 255, 255, 0.15) 75%,
				transparent 75%,
				transparent
			);
			background-size: 20px 20px;
		}

		/* Animated stripes */
		.progress-fill.striped.animated {
			animation: progress-stripes 1s linear infinite;
		}

		@keyframes progress-stripes {
			0% {
				background-position: 20px 0;
			}
			100% {
				background-position: 0 0;
			}
		}

		/* Indeterminate animation */
		.progress-fill.indeterminate {
			width: 30% !important;
			animation: indeterminate 1.5s ease-in-out infinite;
		}

		@keyframes indeterminate {
			0% {
				transform: translateX(-100%);
			}
			100% {
				transform: translateX(400%);
			}
		}

		/* Size variants */
		:host([size="sm"]) {
			--progress-height: 4px;
		}

		:host([size="lg"]) {
			--progress-height: 12px;
		}

		/* Variant colors */
		:host([variant="default"]),
		:host([variant="success"]) {
			--progress-fill: var(--terminal-green, #00ff41);
			--progress-glow: rgba(0, 255, 65, 0.4);
		}

		:host([variant="warning"]) {
			--progress-fill: var(--terminal-amber, #ffb000);
			--progress-glow: rgba(255, 176, 0, 0.4);
		}

		:host([variant="error"]) {
			--progress-fill: var(--terminal-red, #ff003c);
			--progress-glow: rgba(255, 0, 60, 0.4);
		}

		:host([variant="info"]) {
			--progress-fill: var(--terminal-cyan, #00ffff);
			--progress-glow: rgba(0, 255, 255, 0.4);
		}

		/* Squared corners (no border radius) */
		:host([squared]) .progress-bar,
		:host([squared]) .progress-fill,
		:host([squared]) .progress-buffer {
			border-radius: 0;
		}

		/* Vertical orientation */
		:host([vertical]) {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
		}

		:host([vertical]) .progress-bar-container {
			flex-direction: column;
			height: 100%;
			width: auto;
		}

		:host([vertical]) .progress-bar {
			width: var(--progress-height);
			height: 100%;
			min-height: 100px;
		}

		:host([vertical]) .progress-fill {
			width: 100%;
			height: 0;
			position: absolute;
			bottom: 0;
			left: 0;
			transition: height 0.3s ease;
		}

		:host([vertical]) .progress-buffer {
			width: 100%;
			height: 0;
			position: absolute;
			bottom: 0;
			left: 0;
		}

		:host([vertical]) .progress-fill.indeterminate {
			width: 100% !important;
			height: 30% !important;
			animation: indeterminate-vertical 1.5s ease-in-out infinite;
		}

		@keyframes indeterminate-vertical {
			0% {
				transform: translateY(100%);
			}
			100% {
				transform: translateY(-400%);
			}
		}

		/* Tick marks */
		.progress-ticks {
			position: absolute;
			width: 100%;
			height: 100%;
			pointer-events: none;
		}

		.progress-tick {
			position: absolute;
			width: 1px;
			height: 12px;
			background: var(--terminal-gray, #666);
			top: 50%;
			transform: translateY(-50%);
		}

		.progress-tick.major {
			height: 16px;
			width: 2px;
			background: var(--terminal-gray-light, #888);
		}

		:host([vertical]) .progress-tick {
			width: 12px;
			height: 1px;
			left: 50%;
			transform: translateX(-50%);
			top: auto;
		}

		:host([vertical]) .progress-tick.major {
			width: 16px;
			height: 2px;
		}

		/* Ring progress */
		.progress-ring {
			position: relative;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.progress-ring svg {
			transform: rotate(-90deg);
		}

		.progress-ring-bg {
			fill: none;
			stroke: var(--progress-bg);
		}

		.progress-ring-fill {
			fill: none;
			stroke: var(--progress-fill);
			stroke-linecap: round;
			transition: stroke-dashoffset 0.3s ease;
			filter: drop-shadow(0 0 4px var(--progress-glow));
		}

		.progress-ring.indeterminate .progress-ring-fill {
			animation: ring-indeterminate 1.5s ease-in-out infinite;
			stroke-dasharray: 60 200;
			transform-origin: center center;
		}

		.progress-ring.indeterminate svg {
			animation: ring-rotate 2s linear infinite;
		}

		@keyframes ring-indeterminate {
			0% {
				stroke-dashoffset: 0;
			}
			50% {
				stroke-dashoffset: -60;
			}
			100% {
				stroke-dashoffset: -120;
			}
		}

		@keyframes ring-rotate {
			0% {
				transform: rotate(-90deg);
			}
			100% {
				transform: rotate(270deg);
			}
		}

		/* Ring sizes */
		:host([size="sm"]) .progress-ring {
			--ring-size: 40px;
			--ring-stroke: 4px;
		}

		:host([size="md"]) .progress-ring,
		.progress-ring {
			--ring-size: 60px;
			--ring-stroke: 6px;
		}

		:host([size="lg"]) .progress-ring {
			--ring-size: 80px;
			--ring-stroke: 8px;
		}

		/* Label */
		.progress-label {
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: 12px;
			color: var(--progress-fill);
			font-weight: 700;
		}

		.progress-bar-container {
			display: flex;
			align-items: center;
			gap: 12px;
			width: 100%;
		}

		.progress-bar-wrapper {
			flex: 1;
		}

		.progress-ring-label {
			position: absolute;
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: 14px;
			font-weight: 700;
			color: var(--progress-fill);
		}

		/* Label positions */
		.label-outside {
			margin-left: 12px;
		}

		.label-inside {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			font-size: 10px;
			color: var(--terminal-black, #0a0a0a);
			text-shadow: none;
		}

		/* Segments */
		.progress-segments {
			display: flex;
			gap: 2px;
			width: 100%;
		}

		.progress-segment {
			flex: 1;
			height: var(--progress-height);
			background: var(--progress-bg);
			border-radius: 2px;
			overflow: hidden;
		}

		.progress-segment-fill {
			height: 100%;
			background: var(--progress-fill);
			transition: width 0.3s ease;
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.progress-fill.striped.animated,
			.progress-fill.indeterminate,
			.progress-ring.indeterminate .progress-ring-fill,
			.progress-ring.indeterminate svg {
				animation: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Current progress value
		 * @property value
		 * @type {Number}
		 * @default 0
		 * @attribute value
		 * @reflects true
		 */
		value: {
			type: Number,
			reflect: true
		},

		/**
		 * Maximum value
		 * @property max
		 * @type {Number}
		 * @default 100
		 * @attribute max
		 * @reflects true
		 */
		max: {
			type: Number,
			reflect: true
		},

		/**
		 * Progress type (bar or ring)
		 * @property type
		 * @type {String}
		 * @default 'bar'
		 * @attribute type
		 * @reflects true
		 */
		type: {
			type: String,
			reflect: true
		},

		/**
		 * Visual variant
		 * @property variant
		 * @type {String}
		 * @default 'default'
		 * @attribute variant
		 * @reflects true
		 */
		variant: {
			type: String,
			reflect: true
		},

		/**
		 * Size variant
		 * @property size
		 * @type {String}
		 * @default 'md'
		 * @attribute size
		 * @reflects true
		 */
		size: {
			type: String,
			reflect: true
		},

		/**
		 * Indeterminate mode
		 * @property indeterminate
		 * @type {Boolean}
		 * @default false
		 * @attribute indeterminate
		 * @reflects true
		 */
		indeterminate: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Show percentage label
		 * @property showLabel
		 * @type {Boolean}
		 * @default false
		 * @attribute show-label
		 * @reflects true
		 */
		showLabel: {
			type: Boolean,
			attribute: 'show-label',
			reflect: true
		},

		/**
		 * Label position
		 * @property labelPosition
		 * @type {String}
		 * @default 'outside'
		 * @attribute label-position
		 * @reflects true
		 */
		labelPosition: {
			type: String,
			attribute: 'label-position',
			reflect: true
		},

		/**
		 * Show striped pattern
		 * @property striped
		 * @type {Boolean}
		 * @default false
		 * @attribute striped
		 * @reflects true
		 */
		striped: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Animate stripes
		 * @property animated
		 * @type {Boolean}
		 * @default false
		 * @attribute animated
		 * @reflects true
		 */
		animated: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Buffer value (secondary progress)
		 * @property buffer
		 * @type {Number}
		 * @default 0
		 * @attribute buffer
		 */
		buffer: {
			type: Number
		},

		/**
		 * Number of segments (0 for continuous)
		 * @property segments
		 * @type {Number}
		 * @default 0
		 * @attribute segments
		 */
		segments: {
			type: Number
		},

		/**
		 * Vertical orientation
		 * @property vertical
		 * @type {Boolean}
		 * @default false
		 * @attribute vertical
		 * @reflects true
		 */
		vertical: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Show tick marks
		 * @property showTicks
		 * @type {Boolean}
		 * @default false
		 * @attribute show-ticks
		 * @reflects true
		 */
		showTicks: {
			type: Boolean,
			attribute: 'show-ticks',
			reflect: true
		},

		/**
		 * Tick interval (percentage)
		 * @property tickInterval
		 * @type {Number}
		 * @default 10
		 * @attribute tick-interval
		 */
		tickInterval: {
			type: Number,
			attribute: 'tick-interval'
		},

		/**
		 * Square corners (no border-radius)
		 * @property squared
		 * @type {Boolean}
		 * @default false
		 * @attribute squared
		 * @reflects true
		 */
		squared: {
			type: Boolean,
			reflect: true
		}
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (REQUIRED)
	// ----------------------------------------------------------
	/**
	 * @private
	 */
	_logger = null;

	// ----------------------------------------------------------
	// BLOCK 5: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TProgressLit');

		// Set default property values
		this.value = 0;
		this.max = 100;
		this.type = 'bar';
		this.variant = 'default';
		this.size = 'md';
		this.indeterminate = false;
		this.showLabel = false;
		this.labelPosition = 'outside';
		this.striped = false;
		this.animated = false;
		this.buffer = 0;
		this.segments = 0;
		this.vertical = false;
		this.showTicks = false;
		this.tickInterval = 10;
		this.squared = false;

		this._logger.debug('Component constructed with defaults');
	}

	// ----------------------------------------------------------
	// BLOCK 6: LIFECYCLE CALLBACKS (REQUIRED)
	// ----------------------------------------------------------
	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.fromEntries(changedProperties));

		// Fire complete event when value reaches max
		if (changedProperties.has('value') && this.value >= this.max && !this.indeterminate) {
			this._emitEvent('progress-complete', { value: this.value, max: this.max });
		}
	}

	// ----------------------------------------------------------
	// BLOCK 7: PUBLIC API METHODS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Set progress value
	 * @public
	 * @param {number} value - Progress value
	 */
	setValue(value) {
		this._logger.debug('Setting value', { value });
		this.value = Math.min(Math.max(0, value), this.max);
	}

	/**
	 * Increment progress
	 * @public
	 * @param {number} [amount=1] - Amount to increment
	 */
	increment(amount = 1) {
		this.setValue(this.value + amount);
	}

	/**
	 * Decrement progress
	 * @public
	 * @param {number} [amount=1] - Amount to decrement
	 */
	decrement(amount = 1) {
		this.setValue(this.value - amount);
	}

	/**
	 * Reset progress to 0
	 * @public
	 */
	reset() {
		this._logger.debug('Resetting progress');
		this.value = 0;
	}

	/**
	 * Get current percentage
	 * @public
	 * @returns {number}
	 */
	getPercentage() {
		return Math.round((this.value / this.max) * 100);
	}

	// ----------------------------------------------------------
	// BLOCK 8: EVENT EMITTERS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Emit a custom event
	 * @private
	 * @param {string} eventName - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(eventName, detail = {}) {
		this.dispatchEvent(new CustomEvent(eventName, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	// ----------------------------------------------------------
	// BLOCK 9: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Render bar progress
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderBar() {
		const percentage = this.getPercentage();
		const bufferPercentage = Math.round((this.buffer / this.max) * 100);

		const fillClasses = [
			'progress-fill',
			this.striped ? 'striped' : '',
			this.animated ? 'animated' : '',
			this.indeterminate ? 'indeterminate' : ''
		].filter(Boolean).join(' ');

		// Build fill style based on orientation
		const fillStyle = this.vertical
			? `height: ${this.indeterminate ? '30%' : `${percentage}%`}`
			: `width: ${this.indeterminate ? '30%' : `${percentage}%`}`;

		const bufferStyle = this.vertical
			? `height: ${bufferPercentage}%`
			: `width: ${bufferPercentage}%`;

		return html`
			<div class="progress-bar-container">
				<div class="progress-bar-wrapper">
					<div class="progress-bar" role="progressbar" aria-valuenow="${this.value}" aria-valuemin="0" aria-valuemax="${this.max}">
						${this.showTicks ? this._renderTicks() : ''}
						${this.buffer > 0 ? html`
							<div class="progress-buffer" style="${bufferStyle}"></div>
						` : ''}
						<div class="${fillClasses}" style="${fillStyle}"></div>
					</div>
				</div>
				${this.showLabel && this.labelPosition === 'outside' ? html`
					<span class="progress-label label-outside">${percentage}%</span>
				` : ''}
			</div>
		`;
	}

	/**
	 * Render tick marks
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderTicks() {
		const ticks = [];
		const interval = this.tickInterval || 10;
		const majorInterval = interval * 5;

		for (let i = 0; i <= 100; i += interval) {
			const isMajor = i % majorInterval === 0;
			const style = this.vertical
				? `bottom: ${i}%`
				: `left: ${i}%`;

			ticks.push(html`
				<div
					class="progress-tick ${isMajor ? 'major' : ''}"
					style="${style}"
				></div>
			`);
		}

		return html`<div class="progress-ticks">${ticks}</div>`;
	}

	/**
	 * Render segmented progress
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderSegments() {
		const percentage = this.getPercentage();
		const filledSegments = Math.round((this.value / this.max) * this.segments);

		const segmentElements = [];
		for (let i = 0; i < this.segments; i++) {
			segmentElements.push(html`
				<div class="progress-segment">
					<div class="progress-segment-fill" style="width: ${i < filledSegments ? '100%' : '0%'}"></div>
				</div>
			`);
		}

		return html`
			<div class="progress-bar-container">
				<div class="progress-segments" role="progressbar" aria-valuenow="${this.value}" aria-valuemin="0" aria-valuemax="${this.max}">
					${segmentElements}
				</div>
				${this.showLabel ? html`
					<span class="progress-label label-outside">${percentage}%</span>
				` : ''}
			</div>
		`;
	}

	/**
	 * Render ring progress
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderRing() {
		const percentage = this.getPercentage();
		const size = this.size === 'sm' ? 40 : this.size === 'lg' ? 80 : 60;
		const strokeWidth = this.size === 'sm' ? 4 : this.size === 'lg' ? 8 : 6;
		const radius = (size - strokeWidth) / 2;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (percentage / 100) * circumference;

		return html`
			<div class="progress-ring ${this.indeterminate ? 'indeterminate' : ''}">
				<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
					<circle
						class="progress-ring-bg"
						cx="${size / 2}"
						cy="${size / 2}"
						r="${radius}"
						stroke-width="${strokeWidth}"
					/>
					<circle
						class="progress-ring-fill"
						cx="${size / 2}"
						cy="${size / 2}"
						r="${radius}"
						stroke-width="${strokeWidth}"
						stroke-dasharray="${circumference}"
						stroke-dashoffset="${this.indeterminate ? 0 : offset}"
					/>
				</svg>
				${this.showLabel && !this.indeterminate ? html`
					<span class="progress-ring-label">${percentage}%</span>
				` : ''}
			</div>
		`;
	}

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering', {
			value: this.value,
			max: this.max,
			type: this.type,
			indeterminate: this.indeterminate
		});

		if (this.type === 'ring') {
			return this._renderRing();
		}

		if (this.segments > 0) {
			return this._renderSegments();
		}

		return this._renderBar();
	}

	// ----------------------------------------------------------
	// BLOCK 10: STATIC REGISTRATION (REQUIRED)
	// ----------------------------------------------------------
	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ----------------------------------------------------------
// BLOCK 11: EXPORTS (REQUIRED)
// ----------------------------------------------------------
export default TProgressLit;

// Terminal-specific re-export
export const TerminalProgress = TProgressLit;
