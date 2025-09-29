// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import * as phosphorIcons from '../utils/phosphor-icons.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TSliderLit
 * @tagname t-sld
 * @description Terminal-themed range slider with drag support, validation, and form participation
 * @category Form Controls
 * @since 1.0.0
 * @example
 * <t-sld min="0" max="100" value="50" label="Volume"></t-sld>
 */
export class TSliderLit extends LitElement {
  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-sld';
  static version = '1.0.0';
  static category = 'Form Controls';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED - even if empty)
  // ----------------------------------------------------------
  static styles = css`
    /* Host Element */
    :host {
      display: block;
      width: 100%;
      --t-sld-track-height: 14px;
      --t-sld-thumb-size: 14px;
      --t-sld-track-bg: #1a1a1a;
      --t-sld-track-border: #333;
      --t-sld-fill-bg: var(--terminal-green, #00ff41);
      --t-sld-fill-glow: rgba(0, 255, 65, 0.3);
      --t-sld-thumb-bg: #005520;
      --t-sld-thumb-border: #00aa40;
      --t-sld-value-bg: #1a1a1a;
      --t-sld-value-border: #333;
      --t-sld-value-color: #00ff41;
      --t-sld-label-color: rgba(0, 255, 65, 0.8);
      --t-sld-tick-color: #333;
      --t-sld-tick-major-color: #555; /* Darker gray for visibility */
      --t-sld-icon-size: 14px;
      font-family: 'Courier New', monospace;
    }

    :host([size="compact"]) {
      --t-sld-track-height: 10px;
      --t-sld-thumb-size: 10px;
      --t-sld-icon-size: 12px;
    }

    :host([size="compact"]) .slider-label,
    :host([size="compact"]) .slider-value,
    :host([size="compact"]) .slider-input,
    :host([size="compact"]) .slider-min,
    :host([size="compact"]) .slider-max {
      font-size: 9px;
    }

    :host([size="large"]) {
      --t-sld-track-height: 18px;
      --t-sld-thumb-size: 18px;
      --t-sld-icon-size: 18px;
    }

    :host([size="large"]) .slider-label,
    :host([size="large"]) .slider-value,
    :host([size="large"]) .slider-input,
    :host([size="large"]) .slider-min,
    :host([size="large"]) .slider-max {
      font-size: 12px;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    :host([vertical]) {
      min-width: auto;
      min-height: 250px;
      display: flex;
      justify-content: center;
    }

    /* Container */
    .slider-container {
      display: grid;
      grid-template-columns: max-content 1fr auto;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-height: 24px;
    }

    :host(:not([label]):not([icon])) .slider-container {
      grid-template-columns: 1fr auto;
    }

    :host(:not([label]):not([icon]):not([show-input]):not([show-value])) .slider-container {
      grid-template-columns: 1fr;
    }

    /* Only icon, no label */
    :host([icon]:not([label])) .slider-container {
      grid-template-columns: auto 1fr auto;
    }

    :host([icon]:not([label])) .slider-label {
      padding-right: 4px;
    }

    /* Fill color variants */
    :host([fill-color="bright"]) .slider-fill {
      background: #40ff40 !important;
      box-shadow: none;
    }

    :host([fill-color="dim"]) .slider-fill {
      background: rgba(0, 255, 65, 0.5) !important;
      box-shadow: none;
    }

    :host([fill-color="dark"]) .slider-fill {
      background: #006622 !important;
      box-shadow: none;
    }

    /* Minimal variant - subtle track with value display */
    :host([minimal]) .slider-track {
      background: rgba(0, 255, 65, 0.05);
      border-color: rgba(0, 255, 65, 0.2);
      box-shadow: none;
    }

    :host([minimal]) .slider-fill {
      display: none;
    }

    :host([minimal]) .slider-thumb {
      background: var(--terminal-green);
      border-color: var(--terminal-green-dark);
    }

    :host([vertical]) .slider-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* Label */
    .slider-label {
      font-size: 10px;
      font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', monospace);
      text-transform: uppercase;
      color: var(--t-sld-label-color);
      letter-spacing: 0.1em;
      user-select: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      padding-right: 8px;
    }

    :host([vertical]) .slider-label {
      text-align: center;
      justify-content: center;
      padding: 0;
    }

    /* Icon */
    .slider-icon {
      width: var(--t-sld-icon-size, 14px);
      height: var(--t-sld-icon-size, 14px);
      color: var(--t-sld-label-color);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .slider-icon svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Input field */
    .slider-input {
      width: 50px;
      padding: 2px 4px;
      background: var(--t-sld-value-bg);
      border: 1px solid var(--t-sld-value-border);
      color: var(--t-sld-value-color);
      font-size: 11px;
      font-family: var(--font-mono, monospace);
      text-align: center;
      outline: none;
      height: 20px;
    }

    /* Output field (read-only value display) */
    .slider-output {
      width: 50px;
      padding: 2px 4px;
      background: var(--t-sld-value-bg);
      border: 1px solid var(--t-sld-value-border);
      color: var(--t-sld-value-color);
      font-size: 11px;
      font-family: var(--font-mono, monospace);
      text-align: center;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    .slider-input:focus {
      border-color: var(--terminal-green);
      box-shadow: 0 0 4px var(--t-sld-fill-glow);
    }

    :host([disabled]) .slider-input {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Track Wrapper */
    .slider-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      height: var(--t-sld-track-height);
    }

    :host([vertical]) .slider-wrapper {
      width: var(--t-sld-track-height);
      min-height: 200px;
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Track */
    .slider-track {
      position: relative;
      width: 100%;
      height: var(--t-sld-track-height);
      background: var(--t-sld-track-bg);
      border: 1px solid var(--t-sld-track-border);
      cursor: pointer;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
      margin: 0;
    }

    :host([vertical]) .slider-track {
      width: var(--t-sld-track-height);
      height: 100%;
      margin: 0 auto;
    }

    /* Fill */
    .slider-fill {
      position: absolute;
      height: 100%;
      background: var(--t-sld-fill-bg);
      box-shadow: none;
      transition: none; /* No animation - follows thumb immediately */
      border-right: 1px solid var(--t-sld-thumb-border);
    }

    :host([vertical]) .slider-fill {
      width: 100%;
      bottom: 0;
      border-right: none;
      border-top: 1px solid var(--t-sld-thumb-border);
      transition: none;
    }

    /* Thumb */
    .slider-thumb {
      position: absolute;
      width: var(--t-sld-thumb-size);
      height: var(--t-sld-thumb-size);
      background: var(--t-sld-thumb-bg);
      border: 2px solid var(--t-sld-thumb-border);
      cursor: grab;
      transform: translate(-50%, -50%);
      transition: box-shadow 0.2s ease;
      z-index: 3;
      top: 50%;
      box-shadow: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: #00ff41;
      font-weight: bold;
    }

    /* Value in thumb - larger size */
    :host([show-value-in-thumb]) .slider-thumb {
      width: var(--thumb-value-width, 32px);
      height: calc(var(--t-sld-thumb-size) * 1.5);
      font-size: 10px;
      border-radius: 2px;
      padding: 0 2px;
    }

    /* Vertical value in thumb - wider but not taller */
    :host([vertical][show-value-in-thumb]) .slider-thumb {
      width: var(--thumb-value-width, 32px);
      height: var(--t-sld-thumb-size);
    }

    /* Show value in thumb */
    :host([show-value-in-thumb]) .slider-thumb::after {
      content: attr(data-value);
    }

    /* Size variant adjustments for value in thumb */
    :host([show-value-in-thumb][size="compact"]) .slider-thumb {
      font-size: 9px;
      height: 16px;
    }

    :host([show-value-in-thumb][size="large"]) .slider-thumb {
      font-size: 11px;
      height: 24px;
    }

    :host([vertical]) .slider-thumb {
      left: 50%;
      transform: translate(-50%, 50%);
      top: auto;
    }

    .slider-thumb:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    :host([vertical]) .slider-thumb:hover {
      transform: translate(-50%, 50%) scale(1.1);
    }

    /* Vertical value in thumb adjustments */
    :host([vertical][show-value-in-thumb]) .slider-thumb {
      transform: translate(-50%, 50%);
    }

    .slider-thumb.dragging {
      cursor: grabbing;
    }

    /* Ticks */
    .slider-ticks {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .slider-tick {
      position: absolute;
      width: 1px;
      height: 8px;
      background: var(--t-sld-tick-color);
      top: 50%;
      transform: translateY(-50%);
    }

    :host([vertical]) .slider-tick {
      width: 8px;
      height: 1px;
      left: 50%;
      transform: translateX(-50%);
      top: auto;
    }

    .slider-tick.major {
      height: 16px;
      width: 3px;
      background: var(--t-sld-tick-major-color);
      opacity: 1;
    }

    :host([vertical]) .slider-tick.major {
      width: 16px;
      height: 3px;
    }

    /* Value Display */
    .slider-value {
      width: 50px;
      padding: 2px 4px;
      background: var(--t-sld-value-bg);
      border: 1px solid var(--t-sld-value-border);
      color: var(--t-sld-value-color);
      font-size: 11px;
      text-align: center;
      user-select: none;
      font-variant-numeric: tabular-nums;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([vertical]) .slider-value {
      margin-top: 8px;
    }

    /* Min/Max Labels */
    .slider-min,
    .slider-max {
      position: absolute;
      font-size: 10px;
      font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', monospace);
      color: var(--t-sld-label-color);
      opacity: 0.8;
      user-select: none;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .slider-min {
      left: 0;
      bottom: -20px;
    }

    .slider-max {
      right: 0;
      bottom: -20px;
    }

    :host([vertical]) .slider-min {
      left: auto;
      bottom: -8px;
      right: -20px;
    }

    :host([vertical]) .slider-max {
      right: -20px;
      top: -8px;
      bottom: auto;
    }

    /* Hide value display when showValue is false */
    :host(:not([showValue])) .slider-value {
      display: none;
    }

    /* Accessibility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  static properties = {
    label: { type: String, reflect: true },
    min: { type: Number, reflect: true },
    max: { type: Number, reflect: true },
    value: { type: Number },
    step: { type: Number, reflect: true },
    disabled: { type: Boolean, reflect: true },
    showTicks: { type: Boolean, reflect: true, attribute: 'show-ticks' },
    showValue: { type: Boolean, reflect: true, attribute: 'show-value' },
    vertical: { type: Boolean, reflect: true },
    smooth: { type: Boolean, reflect: true },
    showInput: { type: Boolean, reflect: true, attribute: 'show-input' },
    showOutput: { type: Boolean, reflect: true, attribute: 'show-output' },
    showValueInThumb: { type: Boolean, reflect: true, attribute: 'show-value-in-thumb' },
    icon: { type: String, reflect: true },
    size: { type: String, reflect: true },
    fillColor: { type: String, reflect: true, attribute: 'fill-color' },
    minimal: { type: Boolean, reflect: true }
  };

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE - underscore prefix)
  // ----------------------------------------------------------
  _isDragging = false;
  _documentListeners = new Map();
  _trackRect = null;
  _internals = null;

  // ----------------------------------------------------------
  // BLOCK 5: LOGGER INSTANCE (REQUIRED)
  // ----------------------------------------------------------
  /** @private */
  _logger = null;

  // ----------------------------------------------------------
  // BLOCK 6: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  static formAssociated = true;

  constructor() {
    super();

    // Initialize logger first
    this._logger = componentLogger.for(TSliderLit.tagName);
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.label = '';
    this.min = 0;
    this.max = 100;
    this.value = 50;
    this.step = 1;
    this.disabled = false;
    this.showTicks = false;
    this.showValue = true;
    this.vertical = false;
    this.smooth = false;
    this.showInput = false;
    this.showOutput = false;
    this.showValueInThumb = false;
    this.icon = '';
    this.size = 'default';
    this.fillColor = 'default';
    this.minimal = false;

    // Initialize ElementInternals for form participation
    if (this.attachInternals) {
      this._internals = this.attachInternals();
      this._internals.role = 'slider';
    }
  }

  // ----------------------------------------------------------
  // BLOCK 7: LIFECYCLE METHODS (REQUIRED - in order)
  // ----------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    this._logger.debug('Connected to DOM');

    // Set initial form value
    if (this._internals) {
      this._internals.setFormValue(String(this.value));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.debug('Disconnected from DOM');

    // CRITICAL: Cleanup all document listeners
    this._removeDocumentListeners();
    this._isDragging = false;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    // Update ARIA attributes
    this._updateAriaAttributes();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', {
      changed: Array.from(changedProperties.keys())
    });

    // Validate property changes
    if (changedProperties.has('min') || changedProperties.has('max')) {
      this._validateRange();
    }

    if (changedProperties.has('value')) {
      this._validateValue();
      // Update form value
      if (this._internals) {
        this._internals.setFormValue(String(this.value));
      }
      // Update ARIA
      this._updateAriaAttributes();
    }
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Set the slider value programmatically
   * @public
   * @param {number} value - The value to set
   * @returns {void}
   */
  setValue(value) {
    this._logger.debug('setValue called', { value });

    const numValue = Number(value);
    if (!isNaN(numValue)) {
      this.value = this._clampValue(numValue);
      this._emitEvent('slider-change', { value: this.value });
    }
  }

  /**
   * Get the current slider value
   * @public
   * @returns {number} The current value
   */
  getValue() {
    return this.value;
  }

  /**
   * Increment the value by step
   * @public
   * @returns {void}
   */
  increment() {
    this._logger.debug('increment called');
    this.setValue(this.value + this.step);
  }

  /**
   * Decrement the value by step
   * @public
   * @returns {void}
   */
  decrement() {
    this._logger.debug('decrement called');
    this.setValue(this.value - this.step);
  }

  /**
   * Set the min and max range
   * @public
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {void}
   */
  setRange(min, max) {
    this._logger.debug('setRange called', { min, max });

    if (max > min) {
      this.min = min;
      this.max = max;
      this._validateValue(); // Revalidate current value
    } else {
      this._logger.warn('Invalid range: max must be greater than min', { min, max });
    }
  }

  // ----------------------------------------------------------
  // BLOCK 9: EVENT EMITTERS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Emit custom event
   * @private
   * @param {string} eventName
   * @param {Object} detail
   */
  _emitEvent(eventName, detail = {}) {
    this._logger.debug('Emitting event', { eventName, detail });

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  // ----------------------------------------------------------
  // BLOCK 10: NESTING SUPPORT (SKIPPED - not a container)
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Validate range (min < max)
   * @private
   */
  _validateRange() {
    if (this.min >= this.max) {
      this._logger.warn('Invalid range: min must be less than max', {
        min: this.min,
        max: this.max
      });
      // Reset to defaults
      this.min = 0;
      this.max = 100;
    }
  }

  /**
   * Validate and clamp value
   * @private
   */
  _validateValue() {
    const oldValue = this.value;
    this.value = this._clampValue(this.value);

    if (oldValue !== this.value) {
      this._logger.debug('Value clamped', {
        oldValue,
        newValue: this.value,
        min: this.min,
        max: this.max
      });
    }
  }

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------
  render() {
    this._logger.trace('Rendering');

    const percentage = this._getPercentage();
    const fillStyle = this.vertical
      ? `height: ${percentage}%`
      : `width: ${percentage}%`;

    // Calculate thumb width for value-in-thumb based on actual range
    let thumbWidthVar = '';
    if (this.showValueInThumb) {
      // Consider both min and max values for width calculation
      const minDigits = Math.abs(this.min).toString().length;
      const maxDigits = Math.abs(this.max).toString().length;
      const hasNegative = this.min < 0;
      const hasDecimals = this.step < 1;
      const decimalPlaces = hasDecimals ? this.step.toString().split('.')[1]?.length || 0 : 0;

      // Calculate total digits needed (including negative sign if present)
      let totalDigits = Math.max(minDigits, maxDigits);
      if (hasDecimals) totalDigits += decimalPlaces + 1; // +1 for decimal point
      if (hasNegative) totalDigits += 1; // +1 for minus sign

      // More conservative width calculation for better fit
      const charWidth = this.vertical ? 7 : 6;
      const thumbWidth = 8 + (totalDigits * charWidth);
      thumbWidthVar = `--thumb-value-width: ${thumbWidth}px;`;
    }

    const thumbStyle = this.vertical
      ? `bottom: ${percentage}%; ${thumbWidthVar}`
      : `left: ${percentage}%; ${thumbWidthVar}`;

    return html`
      <div class="slider-container">
        ${this.label || this.icon ? html`
          <label class="slider-label" for="slider-input">
            ${this.icon ? html`<span class="slider-icon">${unsafeHTML(this._getIcon())}</span>` : ''}
            ${this.label}
          </label>
        ` : ''}

        <div class="slider-wrapper">
          <div
            class="slider-track"
            @click=${this._handleTrackClick}
            @touchstart=${this._handleTouchStart}
          >
            <div class="slider-fill" style=${fillStyle}></div>

            ${this.showTicks ? this._renderTicks() : ''}

            <div
              class="slider-thumb ${this._isDragging ? 'dragging' : ''}"
              style=${thumbStyle}
              data-value=${this.value}
              @mousedown=${this._handleMouseDown}
              @touchstart=${this._handleThumbTouchStart}
              tabindex="0"
              @keydown=${this._handleKeyDown}
              role="slider"
              aria-valuemin=${this.min}
              aria-valuemax=${this.max}
              aria-valuenow=${this.value}
              aria-label=${this.label || 'Slider'}
            ></div>

            <span class="slider-min">${this.min}</span>
            <span class="slider-max">${this.max}</span>
          </div>
        </div>

        ${this.showValue && !this.showValueInThumb && !this.showInput && !this.showOutput ? html`
          <div class="slider-value">${this.value}</div>
        ` : ''}

        ${this.showInput ? html`
          <input
            type="number"
            class="slider-input"
            .min=${this.min}
            .max=${this.max}
            .step=${this.step}
            .value=${this.value}
            ?disabled=${this.disabled}
            @input=${this._handleDirectInput}
            @change=${this._handleDirectInputChange}
          />
        ` : ''}

        ${this.showOutput ? html`
          <div class="slider-output">${this.value}</div>
        ` : ''}

        <!-- Screen reader only input for accessibility -->
        <input
          type="range"
          id="slider-input"
          class="sr-only"
          .min=${this.min}
          .max=${this.max}
          .step=${this.step}
          .value=${this.value}
          ?disabled=${this.disabled}
          @input=${this._handleInputChange}
        />
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  /**
   * Render tick marks
   * @private
   */
  _renderTicks() {
    const ticks = [];
    const range = this.max - this.min;
    const steps = Math.floor(range / this.step);

    // Determine major tick interval based on range
    let majorInterval = 10;
    if (steps <= 10) majorInterval = 2;
    else if (steps <= 20) majorInterval = 5;
    else if (steps <= 50) majorInterval = 10;
    else majorInterval = Math.floor(steps / 10);

    for (let i = 0; i <= steps; i++) {
      const value = this.min + (i * this.step);
      const percentage = ((value - this.min) / range) * 100;
      const isMajor = i % majorInterval === 0;
      const style = this.vertical
        ? `bottom: ${percentage}%`
        : `left: ${percentage}%`;

      ticks.push(html`
        <div
          class="slider-tick ${isMajor ? 'major' : ''}"
          style=${style}
        ></div>
      `);
    }

    return html`<div class="slider-ticks">${ticks}</div>`;
  }

  /**
   * Get percentage of current value
   * @private
   */
  _getPercentage() {
    const range = this.max - this.min;
    return ((this.value - this.min) / range) * 100;
  }

  /**
   * Clamp value to min/max range and step
   * @private
   */
  _clampValue(value) {
    // Clamp to range
    let clamped = Math.min(Math.max(value, this.min), this.max);

    // Snap to step
    if (!this.smooth) {
      const steps = Math.round((clamped - this.min) / this.step);
      clamped = this.min + (steps * this.step);
    }

    // Round to avoid floating point issues
    return Math.round(clamped * 100) / 100;
  }

  /**
   * Calculate value from position
   * @private
   */
  _calculateValueFromPosition(clientX, clientY) {
    const track = this.shadowRoot.querySelector('.slider-track');
    if (!track) return this.value;

    const rect = track.getBoundingClientRect();
    let percentage;

    if (this.vertical) {
      percentage = 1 - ((clientY - rect.top) / rect.height);
    } else {
      percentage = (clientX - rect.left) / rect.width;
    }

    percentage = Math.min(Math.max(percentage, 0), 1);
    const range = this.max - this.min;
    const rawValue = this.min + (percentage * range);

    return this._clampValue(rawValue);
  }

  /**
   * Handle track click
   * @private
   */
  _handleTrackClick(e) {
    if (this.disabled || this._isDragging) return;

    this._logger.debug('Track clicked');
    const newValue = this._calculateValueFromPosition(e.clientX, e.clientY);

    if (newValue !== this.value) {
      this.value = newValue;
      this._emitEvent('slider-change', { value: this.value });
    }
  }

  /**
   * Handle mouse down on thumb
   * @private
   */
  _handleMouseDown(e) {
    if (this.disabled) return;

    e.preventDefault();
    e.stopPropagation();

    this._startDragging();
    this._addDocumentListeners();
  }

  /**
   * Handle touch start
   * @private
   */
  _handleTouchStart(e) {
    if (this.disabled) return;

    const touch = e.touches[0];
    this._handleTrackClick({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }

  /**
   * Handle thumb touch start
   * @private
   */
  _handleThumbTouchStart(e) {
    if (this.disabled) return;

    e.preventDefault();
    e.stopPropagation();

    this._startDragging();
    this._addDocumentListeners();
  }

  /**
   * Start dragging
   * @private
   */
  _startDragging() {
    this._isDragging = true;
    this._logger.debug('Started dragging');
    this.requestUpdate(); // Update thumb class
  }

  /**
   * Stop dragging
   * @private
   */
  _stopDragging() {
    if (this._isDragging) {
      this._isDragging = false;
      this._logger.debug('Stopped dragging');
      this._emitEvent('slider-change', { value: this.value });
      this.requestUpdate(); // Update thumb class
    }
  }

  /**
   * Add document listeners for dragging
   * @private
   */
  _addDocumentListeners() {
    // Mouse events
    const handleMouseMove = (e) => this._handleDocumentMouseMove(e);
    const handleMouseUp = () => this._handleDocumentMouseUp();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    this._documentListeners.set('mousemove', handleMouseMove);
    this._documentListeners.set('mouseup', handleMouseUp);

    // Touch events
    const handleTouchMove = (e) => this._handleDocumentTouchMove(e);
    const handleTouchEnd = () => this._handleDocumentTouchEnd();

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    this._documentListeners.set('touchmove', handleTouchMove);
    this._documentListeners.set('touchend', handleTouchEnd);

    this._logger.debug('Added document listeners');
  }

  /**
   * Remove document listeners
   * @private
   */
  _removeDocumentListeners() {
    this._documentListeners.forEach((handler, event) => {
      document.removeEventListener(event, handler);
    });
    this._documentListeners.clear();

    this._logger.debug('Removed document listeners');
  }

  /**
   * Handle document mouse move
   * @private
   */
  _handleDocumentMouseMove(e) {
    if (!this._isDragging) return;

    e.preventDefault();
    const newValue = this._calculateValueFromPosition(e.clientX, e.clientY);

    if (newValue !== this.value) {
      this.value = newValue;
      this._emitEvent('slider-input', { value: this.value });
    }
  }

  /**
   * Handle document mouse up
   * @private
   */
  _handleDocumentMouseUp() {
    this._removeDocumentListeners();
    this._stopDragging();
  }

  /**
   * Handle document touch move
   * @private
   */
  _handleDocumentTouchMove(e) {
    if (!this._isDragging) return;

    e.preventDefault();
    const touch = e.touches[0];
    const newValue = this._calculateValueFromPosition(touch.clientX, touch.clientY);

    if (newValue !== this.value) {
      this.value = newValue;
      this._emitEvent('slider-input', { value: this.value });
    }
  }

  /**
   * Handle document touch end
   * @private
   */
  _handleDocumentTouchEnd() {
    this._removeDocumentListeners();
    this._stopDragging();
  }

  /**
   * Handle keyboard navigation
   * @private
   */
  _handleKeyDown(e) {
    if (this.disabled) return;

    let handled = true;
    const bigStep = this.step * 10;

    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.decrement();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        this.increment();
        break;
      case 'PageDown':
        this.setValue(this.value - bigStep);
        break;
      case 'PageUp':
        this.setValue(this.value + bigStep);
        break;
      case 'Home':
        this.setValue(this.min);
        break;
      case 'End':
        this.setValue(this.max);
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      this._emitEvent('slider-change', { value: this.value });
    }
  }

  /**
   * Handle input change from SR-only input
   * @private
   */
  _handleInputChange(e) {
    const value = Number(e.target.value);
    if (value !== this.value) {
      this.value = value;
      this._emitEvent('slider-change', { value: this.value });
    }
  }

  /**
   * Handle direct input from number field
   * @private
   */
  _handleDirectInput(e) {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      this.value = this._clampValue(value);
      this._emitEvent('slider-input', { value: this.value });
    }
  }

  /**
   * Handle direct input change event
   * @private
   */
  _handleDirectInputChange(e) {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      this.value = this._clampValue(value);
      this._emitEvent('slider-change', { value: this.value });
      // Update input to show clamped value
      e.target.value = this.value;
    }
  }

  /**
   * Update ARIA attributes
   * @private
   */
  _updateAriaAttributes() {
    const thumb = this.shadowRoot?.querySelector('.slider-thumb');
    if (thumb) {
      thumb.setAttribute('aria-valuenow', this.value);
      thumb.setAttribute('aria-valuemin', this.min);
      thumb.setAttribute('aria-valuemax', this.max);
    }
  }

  /**
   * Get the appropriate icon based on icon property
   * @private
   */
  _getIcon() {
    if (!this.icon) return '';

    // Use the exact Phosphor icon name
    return phosphorIcons[this.icon] || '';
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TSliderLit.tagName)) {
  customElements.define(TSliderLit.tagName, TSliderLit);
}

// ============================================================
// SECTION 4: MANIFEST GENERATION (REQUIRED)
// ============================================================
export const TSliderManifest = generateManifest(TSliderLit, {
  tagName: 't-sld',
  displayName: 'Slider',
  description: 'Terminal-themed range slider with drag support, validation, and form participation',
  version: '1.0.0',
  properties: {
    label: {
      description: 'Label text displayed next to the slider'
    },
    min: {
      description: 'Minimum value for the slider range'
    },
    max: {
      description: 'Maximum value for the slider range'
    },
    value: {
      description: 'Current value of the slider'
    },
    step: {
      description: 'Step increment for the slider'
    },
    disabled: {
      description: 'Whether the slider is disabled'
    },
    showTicks: {
      description: 'Whether to display tick marks on the slider track'
    },
    showValue: {
      description: 'Whether to display the current value'
    },
    vertical: {
      description: 'Whether the slider is displayed vertically'
    },
    smooth: {
      description: 'Whether the slider updates smoothly or snaps to steps'
    },
    showInput: {
      description: 'Whether to display a number input field'
    },
    showOutput: {
      description: 'Whether to display a read-only output value'
    },
    showValueInThumb: {
      description: 'Whether to display the value inside the thumb'
    },
    icon: {
      description: 'Icon name to display (volume, gauge, chart, faders)'
    },
    size: {
      description: 'Size variant (compact, default, large)'
    },
    fillColor: {
      description: 'Fill color variant (default, bright, dim, dark)'
    },
    minimal: {
      description: 'Minimal style with no visible track fill'
    }
  },
  methods: {
    setValue: {
      description: 'Set the slider value programmatically',
      params: [{ name: 'value', type: 'number', description: 'The value to set' }],
      returns: { type: 'void' }
    },
    getValue: {
      description: 'Get the current slider value',
      params: [],
      returns: { type: 'number', description: 'The current value' }
    },
    increment: {
      description: 'Increment the value by step',
      params: [],
      returns: { type: 'void' }
    },
    decrement: {
      description: 'Decrement the value by step',
      params: [],
      returns: { type: 'void' }
    },
    setRange: {
      description: 'Set the min and max range',
      params: [
        { name: 'min', type: 'number', description: 'Minimum value' },
        { name: 'max', type: 'number', description: 'Maximum value' }
      ],
      returns: { type: 'void' }
    }
  },
  events: {
    'slider-input': {
      description: 'Fires continuously during drag',
      detail: { value: 'number' }
    },
    'slider-change': {
      description: 'Fires when the value is finalized after drag or interaction',
      detail: { value: 'number' }
    }
  },
  slots: {},
  cssProperties: {
    '--t-sld-track-height': 'Height of the slider track',
    '--t-sld-thumb-size': 'Size of the slider thumb',
    '--t-sld-track-bg': 'Background color of the slider track',
    '--t-sld-track-border': 'Border color of the slider track',
    '--t-sld-fill-bg': 'Background of the filled portion',
    '--t-sld-fill-glow': 'Glow effect for the filled portion',
    '--t-sld-thumb-bg': 'Background color of the thumb',
    '--t-sld-thumb-border': 'Border color of the thumb',
    '--t-sld-value-bg': 'Background color of the value display',
    '--t-sld-value-border': 'Border color of the value display',
    '--t-sld-value-color': 'Text color of the value display',
    '--t-sld-label-color': 'Color of the slider label',
    '--t-sld-tick-color': 'Color of minor tick marks',
    '--t-sld-tick-major-color': 'Color of major tick marks'
  }
});

// ============================================================
// SECTION 5: EXPORTS (REQUIRED)
// ============================================================
export default TSliderLit;