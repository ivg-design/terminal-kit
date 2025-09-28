// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TToggleLit
 * @tagname t-tog
 * @description Terminal-themed toggle switch/checkbox with label and icon support. Supports both switch and checkbox variants with form participation.
 * @category Form Controls
 * @since 1.0.0
 * @example
 * <t-tog label="Enable notifications" checked></t-tog>
 * <t-tog variant="checkbox" label="I agree to terms"></t-tog>
 */
export class TToggleLit extends LitElement {
  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-tog';
  static version = '1.0.0';
  static category = 'Form Controls';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    /* Host Styles */
    :host {
      display: inline-block;
      --t-tog-bg: var(--terminal-gray-dark, #1a1a1a);
      --t-tog-border: var(--terminal-gray-light, #666666);
      --t-tog-checked-bg: var(--terminal-green-dark, #005520);
      --t-tog-checked-border: var(--terminal-green, #00ff41);
      --t-tog-thumb: var(--terminal-gray-light, #666666);
      --t-tog-thumb-checked: var(--terminal-green, #00ff41);
      --t-tog-label: var(--terminal-green-dim, #00ff4180);
      --t-tog-label-checked: var(--terminal-green, #00ff41);
      --t-tog-glow: var(--terminal-green-glow, #00ff4133);
      --t-tog-disabled-opacity: 0.5;
    }

    /* Container */
    .terminal-toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      padding: 4px;
      transition: opacity 0.2s ease;
      position: relative;
      min-width: 200px;
    }

    .terminal-toggle:hover .toggle-switch,
    .terminal-toggle:hover .toggle-checkbox {
      box-shadow: 0 0 8px var(--t-tog-glow);
    }

    .terminal-toggle:hover .toggle-icon {
      filter: brightness(1.2);
    }

    /* Hidden native input for accessibility */
    .native-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
    }

    /* Switch Variant */
    .toggle-switch {
      position: relative;
      width: 48px;
      height: 24px;
      background: var(--t-tog-bg);
      border: 1px solid var(--t-tog-border);
      cursor: pointer;
      border-radius: 24px;
      transition: all 0.3s ease;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .toggle-switch::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--t-tog-thumb);
      transform: translateY(-50%);
      transition: all 0.3s ease;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    /* Checkbox Variant */
    .toggle-checkbox {
      position: relative;
      width: 18px;
      height: 18px;
      background: var(--t-tog-bg);
      border: 1px solid var(--t-tog-border);
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .toggle-checkbox::after {
      content: '';
      position: absolute;
      display: none;
      left: 50%;
      top: 50%;
      width: 4px;
      height: 8px;
      border: solid var(--t-tog-thumb-checked);
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -60%) rotate(45deg);
    }

    /* Checked States */
    .terminal-toggle.checked .toggle-switch {
      background: var(--t-tog-checked-bg);
      border-color: var(--t-tog-checked-border);
    }

    .terminal-toggle.checked .toggle-switch::before {
      transform: translateY(-50%) translateX(24px);
      background: var(--t-tog-thumb-checked);
      box-shadow: 0 0 10px var(--t-tog-glow);
    }

    .terminal-toggle.checked .toggle-checkbox {
      background: var(--t-tog-checked-bg);
      border-color: var(--t-tog-checked-border);
    }

    .terminal-toggle.checked .toggle-checkbox::after {
      display: block;
    }

    /* Label */
    .toggle-label {
      font-size: 14px;
      color: var(--t-tog-label);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: color 0.2s ease, opacity 0.2s ease;
      opacity: 0.6;
      flex: 1 0 auto;
      white-space: nowrap;
    }

    .terminal-toggle.checked .toggle-label {
      color: var(--t-tog-label-checked);
      opacity: 1;
    }

    /* Off state should be dimmer */
    .terminal-toggle:not(.checked):not(.equal-states) .toggle-switch {
      opacity: 0.8;
    }

    .terminal-toggle:not(.checked):not(.equal-states) .toggle-icon {
      opacity: 0.6;
    }

    /* Label Position */
    .terminal-toggle.label-left {
      flex-direction: row-reverse;
    }

    /* Icons */
    .toggle-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--t-tog-label);
      transition: all 0.2s ease;
      opacity: 0.6;
    }

    .toggle-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .terminal-toggle.checked .toggle-icon {
      color: var(--t-tog-label-checked);
      transform: scale(1.1);
      opacity: 1;
    }

    /* Equal States Mode - Both states should appear 'on' */
    :host([equal-states]) .toggle-switch {
      opacity: 1 !important;
      background: var(--t-tog-checked-bg);
      border-color: var(--t-tog-checked-border);
    }

    :host([equal-states]) .toggle-icon,
    :host([equal-states]) .toggle-label {
      opacity: 1 !important;
      color: var(--t-tog-label-checked);
    }

    :host([equal-states]) .toggle-switch::before {
      background: var(--t-tog-thumb-checked);
      transform: translateY(-50%) translateX(0);
    }

    :host([equal-states]) .terminal-toggle.checked .toggle-switch {
      background: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
    }

    :host([equal-states]) .terminal-toggle.checked .toggle-switch::before {
      background: var(--terminal-bg, #0a0e27);
      box-shadow: none;
      transform: translateY(-50%) translateX(22px);
    }

    /* Color Schemes */
    :host([color-scheme="error"]) {
      --t-tog-checked-bg: #5c1a1a;
      --t-tog-checked-border: #ff4136;
      --t-tog-thumb-checked: #ff4136;
      --t-tog-label-checked: #ff4136;
      --t-tog-glow: rgba(255, 65, 54, 0.3);
    }

    :host([color-scheme="warning"]) {
      --t-tog-checked-bg: #5c4a1a;
      --t-tog-checked-border: #ffaa00;
      --t-tog-thumb-checked: #ffaa00;
      --t-tog-label-checked: #ffaa00;
      --t-tog-glow: rgba(255, 170, 0, 0.3);
    }

    :host([color-scheme="success"]) {
      --t-tog-checked-bg: var(--terminal-green-dark, #005520);
      --t-tog-checked-border: var(--terminal-green, #00ff41);
      --t-tog-thumb-checked: var(--terminal-green, #00ff41);
      --t-tog-label-checked: var(--terminal-green, #00ff41);
      --t-tog-glow: var(--terminal-green-glow, #00ff4133);
    }

    /* Checkbox Color Schemes */
    :host([variant="checkbox"][color-scheme="error"]) .toggle-checkbox {
      border-color: #ff4136;
    }

    :host([variant="checkbox"][color-scheme="error"]) .terminal-toggle.checked .toggle-checkbox {
      background: #5c1a1a;
      border-color: #ff4136;
    }

    :host([variant="checkbox"][color-scheme="error"]) .toggle-checkbox::after {
      border-color: #ff4136;
    }

    :host([variant="checkbox"][color-scheme="warning"]) .toggle-checkbox {
      border-color: #ffaa00;
    }

    :host([variant="checkbox"][color-scheme="warning"]) .terminal-toggle.checked .toggle-checkbox {
      background: #5c4a1a;
      border-color: #ffaa00;
    }

    :host([variant="checkbox"][color-scheme="warning"]) .toggle-checkbox::after {
      border-color: #ffaa00;
    }

    /* Alignment Styles for Checkboxes */
    :host([variant="checkbox"][alignment="left"]) .terminal-toggle {
      justify-content: flex-start;
      flex-direction: row;
    }

    :host([variant="checkbox"][alignment="right"]) .terminal-toggle {
      justify-content: flex-end;
      flex-direction: row;
    }

    :host([variant="checkbox"][alignment="right"]) .toggle-label {
      text-align: right;
      margin-right: 8px;
      margin-left: 0;
      order: 1;
    }

    :host([variant="checkbox"][alignment="right"]) .toggle-checkbox {
      order: 2;
      flex-shrink: 0;
    }

    /* Size Variants */
    :host([size="small"]) .toggle-switch {
      width: 36px;
      height: 18px;
    }

    :host([size="small"]) .toggle-switch::before {
      width: 14px;
      height: 14px;
      left: 2px;
    }

    :host([size="small"]) .terminal-toggle.checked .toggle-switch::before {
      transform: translateY(-50%) translateX(18px);
    }

    :host([size="small"]) .toggle-checkbox {
      width: 14px;
      height: 14px;
    }

    :host([size="small"]) .toggle-checkbox::after {
      width: 3px;
      height: 6px;
    }

    :host([size="small"]) .toggle-label {
      font-size: 12px;
    }

    :host([size="large"]) .toggle-switch {
      width: 60px;
      height: 30px;
    }

    :host([size="large"]) .toggle-switch::before {
      width: 24px;
      height: 24px;
      left: 3px;
    }

    :host([size="large"]) .terminal-toggle.checked .toggle-switch::before {
      transform: translateY(-50%) translateX(30px);
    }

    :host([size="large"]) .toggle-checkbox {
      width: 24px;
      height: 24px;
    }

    :host([size="large"]) .toggle-checkbox::after {
      width: 6px;
      height: 12px;
      border-width: 0 3px 3px 0;
    }

    :host([size="large"]) .toggle-label {
      font-size: 16px;
    }

    /* Disabled State */
    :host([disabled]) .terminal-toggle {
      opacity: var(--t-tog-disabled-opacity);
      cursor: not-allowed;
      pointer-events: none;
    }

    :host([disabled]) .toggle-switch,
    :host([disabled]) .toggle-checkbox {
      background: var(--terminal-gray-darkest, #0a0a0a);
      border-color: var(--terminal-gray-dark, #1a1a1a);
    }

    :host([disabled]) .toggle-label {
      color: var(--terminal-gray-text, #808080);
    }

    /* Loading State */
    :host([loading]) .toggle-switch::before,
    :host([loading]) .toggle-checkbox::after {
      animation: togglePulse 1s ease-in-out infinite;
    }

    @keyframes togglePulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Focus State */
    .terminal-toggle:focus-visible {
      outline: 1px solid var(--t-tog-checked-border);
      outline-offset: 2px;
    }

    /* Required State */
    :host([required]) .toggle-label::after {
      content: ' *';
      color: var(--terminal-red, #ff4136);
    }

    /* Responsive */
    @media (max-width: 480px) {
      .terminal-toggle {
        gap: 6px;
        padding: 2px;
      }

      .toggle-label {
        font-size: 12px;
      }
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  /**
   * @property {string} label - Toggle label text
   * @default ''
   * @attribute label
   * @reflects true
   */
  static properties = {
    /**
     * @property {string} label - Toggle label text
     * @default ''
     * @attribute label
     * @reflects true
     */
    label: { type: String, reflect: true },

    /**
     * @property {string} labelOn - Label text for checked state
     * @default ''
     * @attribute label-on
     */
    labelOn: { type: String, attribute: 'label-on' },

    /**
     * @property {string} labelOff - Label text for unchecked state
     * @default ''
     * @attribute label-off
     */
    labelOff: { type: String, attribute: 'label-off' },

    /**
     * @property {boolean} checked - Toggle checked state
     * @default false
     * @attribute checked
     * @reflects true
     */
    checked: { type: Boolean, reflect: true },

    /**
     * @property {boolean} disabled - Toggle disabled state
     * @default false
     * @attribute disabled
     * @reflects true
     */
    disabled: { type: Boolean, reflect: true },

    /**
     * @property {('switch'|'checkbox')} variant - Toggle variant style
     * @default 'switch'
     * @attribute variant
     * @reflects true
     */
    variant: { type: String, reflect: true },

    /**
     * @property {('left'|'right')} labelPosition - Label position relative to toggle
     * @default 'right'
     * @attribute label-position
     * @reflects true
     */
    labelPosition: { type: String, reflect: true, attribute: 'label-position' },

    /**
     * @property {('left'|'right')} alignment - Checkbox group alignment
     * @default 'left'
     * @attribute alignment
     * @reflects true
     */
    alignment: { type: String, reflect: true },

    /**
     * @property {string} iconOn - Icon HTML/SVG for checked state
     * @default ''
     * @attribute icon-on
     */
    iconOn: { type: String, attribute: 'icon-on' },

    /**
     * @property {string} iconOff - Icon HTML/SVG for unchecked state
     * @default ''
     * @attribute icon-off
     */
    iconOff: { type: String, attribute: 'icon-off' },

    /**
     * @property {('small'|'medium'|'large')} size - Toggle size
     * @default 'medium'
     * @attribute size
     * @reflects true
     */
    size: { type: String, reflect: true },

    /**
     * @property {boolean} loading - Toggle loading state
     * @default false
     * @attribute loading
     * @reflects true
     */
    loading: { type: Boolean, reflect: true },

    /**
     * @property {boolean} required - Toggle required field state
     * @default false
     * @attribute required
     * @reflects true
     */
    required: { type: Boolean, reflect: true },

    /**
     * @property {boolean} equalStates - Both states equally prominent
     * @default false
     * @attribute equal-states
     * @reflects true
     */
    equalStates: { type: Boolean, reflect: true, attribute: 'equal-states' },

    /**
     * @property {('error'|'warning'|'success')} colorScheme - Color variant
     * @default ''
     * @attribute color-scheme
     * @reflects true
     */
    colorScheme: { type: String, reflect: true, attribute: 'color-scheme' }
  };

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE)
  // ----------------------------------------------------------
  /** @private */
  _internals = null;

  /** @private */
  _isAnimating = false;

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
    this._logger = componentLogger.for(TToggleLit.tagName);
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.label = '';
    this.labelOn = '';
    this.labelOff = '';
    this.checked = false;
    this.disabled = false;
    this.variant = 'switch';
    this.labelPosition = 'right';
    this.alignment = 'left';
    this.iconOn = '';
    this.iconOff = '';
    this.size = 'medium';
    this.loading = false;
    this.required = false;
    this.equalStates = false;
    this.colorScheme = '';

    // Initialize ElementInternals for form participation
    if (this.attachInternals) {
      this._internals = this.attachInternals();
      this._internals.ariaRole = 'switch';
    }
  }

  // ----------------------------------------------------------
  // BLOCK 7: LIFECYCLE METHODS (REQUIRED - in order)
  // ----------------------------------------------------------
  /**
   * Called when component is connected to DOM
   * @lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this._logger.debug('Connected to DOM');

    // Set initial form value
    if (this._internals) {
      this._internals.setFormValue(this.checked ? 'on' : 'off');
      this._updateValidity();
    }
  }

  /**
   * Called when component is disconnected from DOM
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.debug('Disconnected from DOM');

    // Component doesn't have timers or document listeners to clean up
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    // Set ARIA attributes
    if (this._internals) {
      this._internals.ariaChecked = String(this.checked);
      this._internals.ariaDisabled = String(this.disabled);
      this._internals.ariaRequired = String(this.required);
    }
  }

  /**
   * Called after every render
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', { changedProperties });

    // Validate enum properties
    for (const [name, oldValue] of changedProperties) {
      if (TToggleLit.getPropertyValidation(name)) {
        this._validateProperty(name, this[name]);
      }
    }

    // Update form value when checked changes
    if (changedProperties.has('checked') && this._internals) {
      this._internals.setFormValue(this.checked ? 'on' : 'off');
      this._internals.ariaChecked = String(this.checked);
      this._updateValidity();
    }

    // Update ARIA attributes
    if (changedProperties.has('disabled') && this._internals) {
      this._internals.ariaDisabled = String(this.disabled);
    }

    if (changedProperties.has('required') && this._internals) {
      this._internals.ariaRequired = String(this.required);
      this._updateValidity();
    }
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
  // ----------------------------------------------------------
  /**
   * Toggle the checked state
   * @public
   * @returns {boolean} New checked state
   * @fires TToggleLit#toggle-change
   * @example
   * const newState = toggle.toggle();
   */
  toggle() {
    this._logger.debug('toggle() called');

    if (this.disabled || this.loading) {
      this._logger.warn('Toggle blocked', { disabled: this.disabled, loading: this.loading });
      return this.checked;
    }

    this.checked = !this.checked;
    this._emitEvent('toggle-change', { checked: this.checked });

    return this.checked;
  }

  /**
   * Set toggle to checked state
   * @public
   * @fires TToggleLit#toggle-change
   * @example
   * toggle.check();
   */
  check() {
    this._logger.debug('check() called');

    if (this.disabled || this.loading) {
      this._logger.warn('Check blocked', { disabled: this.disabled, loading: this.loading });
      return;
    }

    if (!this.checked) {
      this.checked = true;
      this._emitEvent('toggle-change', { checked: this.checked });
    }
  }

  /**
   * Set toggle to unchecked state
   * @public
   * @fires TToggleLit#toggle-change
   * @example
   * toggle.uncheck();
   */
  uncheck() {
    this._logger.debug('uncheck() called');

    if (this.disabled || this.loading) {
      this._logger.warn('Uncheck blocked', { disabled: this.disabled, loading: this.loading });
      return;
    }

    if (this.checked) {
      this.checked = false;
      this._emitEvent('toggle-change', { checked: this.checked });
    }
  }

  /**
   * Set the value (for form participation)
   * @public
   * @param {boolean|string} value - The value to set ('on', 'off', true, false)
   * @example
   * toggle.setValue(true);
   * toggle.setValue('on');
   */
  setValue(value) {
    this._logger.debug('setValue() called', { value });

    const newChecked = value === true || value === 'on' || value === 'true';
    if (this.checked !== newChecked) {
      this.checked = newChecked;
      this._emitEvent('toggle-change', { checked: this.checked });
    }
  }

  /**
   * Get the current value (for form participation)
   * @public
   * @returns {string} 'on' if checked, 'off' if unchecked
   * @example
   * const value = toggle.getValue(); // 'on' or 'off'
   */
  getValue() {
    const value = this.checked ? 'on' : 'off';
    this._logger.debug('getValue() called', { value });
    return value;
  }

  /**
   * Focus the toggle element
   * @public
   * @example
   * toggle.focus();
   */
  focus() {
    this._logger.debug('focus() called');
    const input = this.shadowRoot.querySelector('.native-input');
    if (input) {
      input.focus();
    }
  }

  /**
   * Blur the toggle element
   * @public
   * @example
   * toggle.blur();
   */
  blur() {
    this._logger.debug('blur() called');
    const input = this.shadowRoot.querySelector('.native-input');
    if (input) {
      input.blur();
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

  /**
   * @event TToggleLit#toggle-change
   * @type {CustomEvent<{checked: boolean}>}
   * @description Fired when toggle state changes
   * @property {boolean} detail.checked - New checked state
   * @bubbles true
   * @composed true
   * @example
   * toggle.addEventListener('toggle-change', (e) => {
   *   console.log('Toggle changed:', e.detail.checked);
   * });
   */

  // ----------------------------------------------------------
  // BLOCK 10: NESTING SUPPORT (NOT REQUIRED - Not a container)
  // ----------------------------------------------------------
  // Not applicable for toggle component

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION (OPTIONAL - For enum properties)
  // ----------------------------------------------------------
  /**
   * Get validation rules for a property
   * @private
   * @param {string} propName - Property name to validate
   * @returns {Array<string>|null} - Valid values for enum properties
   */
  static getPropertyValidation(propName) {
    const validations = {
      variant: ['switch', 'checkbox'],
      size: ['small', 'medium', 'large'],
      alignment: ['left', 'right'],
      labelPosition: ['left', 'right'],
      colorScheme: ['', 'error', 'warning', 'success']
    };
    return validations[propName] || null;
  }

  /**
   * Validate property value
   * @private
   * @param {string} name - Property name
   * @param {*} value - Property value
   * @returns {boolean} - Whether the value is valid
   */
  _validateProperty(name, value) {
    const validValues = TToggleLit.getPropertyValidation(name);
    if (!validValues) return true;

    const isValid = validValues.includes(value);
    if (!isValid) {
      this._logger.warn(`Invalid value for ${name}:`, { value, validValues });
    }
    return isValid;
  }

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------
  /**
   * Render component template
   * @returns {TemplateResult}
   */
  render() {
    this._logger.trace('Rendering');

    const classes = [
      'terminal-toggle',
      this.checked ? 'checked' : '',
      this.labelPosition === 'left' ? 'label-left' : '',
      this.equalStates ? 'equal-states' : ''
    ].filter(Boolean).join(' ');

    const currentIcon = this.checked ? this.iconOn : this.iconOff;

    // Determine which label to show
    let currentLabel = this.label;
    if (this.labelOn && this.labelOff) {
      currentLabel = this.checked ? this.labelOn : this.labelOff;
    }

    // For right-aligned checkboxes: render order is label, then checkbox
    if (this.variant === 'checkbox' && this.alignment === 'right') {
      return html`
        <label class="${classes}" @keydown=${this._handleKeyDown}>
          <input
            type="checkbox"
            class="native-input"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @change=${this._handleChange}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            tabindex="0"
            aria-label=${currentLabel || 'Toggle'}
          />

          ${currentIcon ? html`
            <span class="toggle-icon" .innerHTML=${currentIcon}></span>
          ` : ''}

          ${currentLabel ? html`
            <span class="toggle-label">${currentLabel}</span>
          ` : ''}

          <span class="toggle-checkbox"></span>
        </label>
      `;
    }

    // Default layout
    return html`
      <label class="${classes}" @keydown=${this._handleKeyDown}>
        <input
          type="checkbox"
          class="native-input"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          tabindex="0"
          aria-label=${currentLabel || 'Toggle'}
        />

        ${currentIcon ? html`
          <span class="toggle-icon" .innerHTML=${currentIcon}></span>
        ` : ''}

        ${this.variant === 'checkbox' ? html`
          <span class="toggle-checkbox"></span>
        ` : html`
          <span class="toggle-switch"></span>
        `}

        ${currentLabel ? html`
          <span class="toggle-label">${currentLabel}</span>
        ` : ''}
      </label>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------
  /** @private */
  _handleChange(e) {
    this._logger.debug('Handle change', { checked: e.target.checked });

    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    this.checked = e.target.checked;
    this._emitEvent('toggle-change', { checked: this.checked });
  }

  /** @private */
  _handleKeyDown(e) {
    if (this.disabled || this.loading) {
      return;
    }

    // Handle space key
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  }

  /** @private */
  _handleFocus() {
    this._logger.trace('Focus received');
  }

  /** @private */
  _handleBlur() {
    this._logger.trace('Focus lost');
  }

  /** @private */
  _updateValidity() {
    if (!this._internals) return;

    // For toggle, we might validate required state
    if (this.required && !this.checked) {
      this._internals.setValidity(
        { valueMissing: true },
        'Please check this box to continue'
      );
    } else {
      this._internals.setValidity({});
    }
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TToggleLit.tagName)) {
  customElements.define(TToggleLit.tagName, TToggleLit);
}

// ============================================================
// SECTION 4: EXPORTS (REQUIRED)
// ============================================================
export default TToggleLit;

// ============================================================
// SECTION 5: MANIFEST GENERATION (REQUIRED)
// ============================================================
/**
 * Component manifest for external tools and documentation
 * @type {Object}
 */
export const TToggleManifest = generateManifest(TToggleLit, {
  tagName: 't-tog',
  displayName: 'Toggle',
  category: 'Form Controls',
  description: 'A versatile toggle component supporting switch and checkbox variants with form participation',
  properties: [
    { name: 'label', type: 'string', default: "''", description: 'Toggle label text' },
    { name: 'labelOn', type: 'string', default: "''", description: 'Label text for checked state' },
    { name: 'labelOff', type: 'string', default: "''", description: 'Label text for unchecked state' },
    { name: 'checked', type: 'boolean', default: 'false', description: 'Toggle checked state' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Toggle disabled state' },
    { name: 'variant', type: 'string', default: "'switch'", enum: ['switch', 'checkbox'], description: 'Toggle variant style' },
    { name: 'labelPosition', type: 'string', default: "'right'", enum: ['left', 'right'], description: 'Label position relative to toggle' },
    { name: 'alignment', type: 'string', default: "'left'", enum: ['left', 'right'], description: 'Checkbox group alignment' },
    { name: 'iconOn', type: 'string', default: "''", description: 'Icon HTML/SVG for checked state' },
    { name: 'iconOff', type: 'string', default: "''", description: 'Icon HTML/SVG for unchecked state' },
    { name: 'size', type: 'string', default: "'medium'", enum: ['small', 'medium', 'large'], description: 'Toggle size' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Toggle loading state' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Toggle required field state' },
    { name: 'equalStates', type: 'boolean', default: 'false', description: 'Both states equally prominent' },
    { name: 'colorScheme', type: 'string', default: "''", enum: ['', 'error', 'warning', 'success'], description: 'Color variant' }
  ],
  methods: [
    { name: 'toggle', description: 'Toggle the checked state', returns: 'boolean' },
    { name: 'check', description: 'Set toggle to checked state' },
    { name: 'uncheck', description: 'Set toggle to unchecked state' },
    { name: 'setValue', description: 'Set the value for form participation', params: ['value'] },
    { name: 'getValue', description: 'Get the current value', returns: 'string' },
    { name: 'focus', description: 'Focus the toggle element' },
    { name: 'blur', description: 'Blur the toggle element' }
  ],
  events: [
    { name: 'toggle-change', description: 'Fired when toggle state changes', detail: '{ checked: boolean }' }
  ],
  examples: [
    {
      title: 'Basic Switch',
      code: `<t-tog label="Enable notifications"></t-tog>`
    },
    {
      title: 'Checkbox Variant',
      code: `<t-tog variant="checkbox" label="I agree to terms"></t-tog>`
    },
    {
      title: 'Dual Labels',
      code: `<t-tog label-on="ON" label-off="OFF" equal-states></t-tog>`
    },
    {
      title: 'With Color Scheme',
      code: `<t-tog color-scheme="success" label="Feature enabled"></t-tog>`
    }
  ]
});