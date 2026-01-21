// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import {
  eyeIcon,
  eyeClosedIcon,
  plusIcon,
  minusIcon,
  caretUpIcon,
  caretDownIcon,
  arrowUpIcon,
  arrowDownIcon,
  xIcon,
} from '../utils/phosphor-icons.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TInputLit
 * @tagname t-inp
 * @description Form input control with validation, type-specific features (password toggle, number controls, search clear), and native form participation via ElementInternals API
 * @category Form Controls
 * @since 1.0.0
 * @example
 * <t-inp type="text" placeholder="Enter text" label="Username"></t-inp>
 * <t-inp type="password" required minlength="8"></t-inp>
 * <t-inp type="email" placeholder="email@example.com"></t-inp>
 */
export class TInputLit extends LitElement {

  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-inp';
  static version = '1.0.0';
  static category = 'Form Controls';
  static formAssociated = true; // Enable ElementInternals API

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    :host {
      display: block;
      width: 100%;
      --t-stepper-bg: var(--terminal-gray-dark, #242424);
      --t-stepper-border: var(--terminal-gray-light, #333333);
      --t-stepper-color: var(--terminal-green-dim, #00cc33);
      --t-stepper-hover-bg: rgba(0, 255, 65, 0.1);
      --t-stepper-active-bg: rgba(0, 255, 65, 0.15);
      --t-stepper-active-color: var(--terminal-black, #0a0a0a);
      --t-stepper-size: 24px;
      --t-stepper-height: 24px;
      --t-stepper-icon-size: 14px;
    }

    /* Control Label */
    .control-label {
      display: block;
      margin-bottom: var(--spacing-xs, 4px);
      font-size: var(--font-size-xs, 10px);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--terminal-green-dim, #00cc33);
    }

    /* Base Input Styles */
    input[type="text"],
    input[type="url"],
    input[type="number"],
    input[type="email"],
    input[type="password"],
    input[type="search"],
    input[type="tel"] {
      width: 100%;
      height: var(--control-height, 28px);
      padding: 0 var(--spacing-sm, 8px);
      background: var(--terminal-gray-dark, #242424);
      color: var(--terminal-green, #00ff41);
      border: 1px solid var(--terminal-gray-light, #333333);
      font-family: var(--font-mono, monospace);
      font-size: var(--font-size-sm, 11px);
      cursor: text;
      transition: all 0.2s ease;
      border-radius: 0;
      box-sizing: border-box;
    }

    /* Focus states */
    input:focus {
      outline: none;
      border-color: var(--terminal-green, #00ff41);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
    }

    /* Hover states */
    input:hover:not(:focus) {
      border-color: var(--terminal-green-dim, #00cc33);
    }

    /* Placeholder */
    input::placeholder {
      color: #555555;
      opacity: 1;
    }

    /* Input wrapper for icons and toggles */
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .input-wrapper input {
      flex: 1;
    }

    /* Icon */
    .input-icon {
      position: absolute;
      left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--terminal-green-dim, #00cc33);
      pointer-events: none;
    }

    .input-icon svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    input.has-icon {
      padding-left: 32px;
    }

    /* Password toggle button */
    .password-toggle {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--terminal-green-dim, #00cc33);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: var(--terminal-green, #00ff41);
    }

    .password-toggle svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    /* Adjust input padding when has toggle */
    input.has-toggle {
      padding-right: 36px;
    }

    /* Search clear button */
    .search-clear {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--terminal-green-dim, #00cc33);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }

    .search-clear:hover {
      color: var(--terminal-green, #00ff41);
    }

    .search-clear svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    input.has-clear {
      padding-right: 36px;
    }

    /* Number input controls */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }

    input.has-number-controls {
      padding-right: calc((var(--t-stepper-size) * 2) + 14px);
    }

    .number-controls {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 4px;
      z-index: 2;
    }

    .number-increment,
    .number-decrement {
      background: var(--t-stepper-bg);
      border: 1px solid var(--t-stepper-border);
      color: var(--t-stepper-color);
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      width: var(--t-stepper-size);
      height: var(--t-stepper-height);
      border-radius: 2px;
    }

    .number-increment:hover,
    .number-decrement:hover {
      background: var(--t-stepper-hover-bg);
      border-color: var(--terminal-green-dim, #00cc33);
      color: var(--terminal-green, #00ff41);
    }

    .number-increment:active,
    .number-decrement:active {
      background: var(--t-stepper-active-bg);
      color: var(--t-stepper-active-color);
      transform: scale(0.92);
      transform-origin: center;
    }

    .number-increment svg,
    .number-decrement svg {
      width: var(--t-stepper-icon-size);
      height: var(--t-stepper-icon-size);
      fill: currentColor;
    }

    .number-increment:disabled,
    .number-decrement:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Disabled State */
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--terminal-gray-dark, #242424);
    }

    /* Readonly State */
    input:read-only {
      opacity: 0.8;
      cursor: default;
    }

    /* Error State */
    input.error {
      border-color: #ff3333 !important;
      color: #ff3333 !important;
    }

    input.error:hover {
      border-color: #ff5555 !important;
      box-shadow: 0 0 5px rgba(255, 51, 51, 0.3);
    }

    input.error:focus {
      border-color: #ff3333 !important;
      box-shadow: 0 0 10px rgba(255, 51, 51, 0.4) !important;
    }

    /* Error message text */
    .error-message {
      font-size: var(--font-size-xs, 10px);
      color: #ff3333;
      margin-top: var(--spacing-xs, 4px);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Helper text */
    .helper-text {
      font-size: var(--font-size-xs, 10px);
      color: var(--terminal-green-dim, #00cc33);
      margin-top: var(--spacing-xs, 4px);
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  static properties = {
    /**
     * @property {('text'|'password'|'email'|'number'|'search'|'tel'|'url')} type - Input type
     * @default 'text'
     * @attribute type
     * @reflects true
     */
    type: { type: String, reflect: true },

    /**
     * @property {string} placeholder - Placeholder text
     * @default ''
     * @attribute placeholder
     * @reflects true
     */
    placeholder: { type: String, reflect: true },

    /**
     * @property {string} value - Input value
     * @default ''
     * @attribute value
     */
    value: { type: String },

    /**
     * @property {('plusminus'|'chevron'|'arrows')} stepperStyle - Stepper icon style
     * @default 'plusminus'
     * @attribute stepper-style
     */
    stepperStyle: { type: String, attribute: 'stepper-style' },

    /**
     * @property {('sm'|'md'|'lg')} stepperSize - Stepper size preset
     * @default 'md'
     * @attribute stepper-size
     */
    stepperSize: { type: String, attribute: 'stepper-size' },

    /**
     * @property {boolean} disabled - Disabled state
     * @default false
     * @attribute disabled
     * @reflects true
     */
    disabled: { type: Boolean, reflect: true },

    /**
     * @property {boolean} readonly - Readonly state
     * @default false
     * @attribute readonly
     * @reflects true
     */
    readonly: { type: Boolean, reflect: true },

    /**
     * @property {boolean} required - Required field
     * @default false
     * @attribute required
     * @reflects true
     */
    required: { type: Boolean, reflect: true },

    /**
     * @property {number} min - Minimum value (number type only)
     * @default null
     * @attribute min
     * @reflects true
     */
    min: { type: Number, reflect: true },

    /**
     * @property {number} max - Maximum value (number type only)
     * @default null
     * @attribute max
     * @reflects true
     */
    max: { type: Number, reflect: true },

    /**
     * @property {number} minlength - Minimum length
     * @default null
     * @attribute minlength
     * @reflects true
     */
    minlength: { type: Number, reflect: true },

    /**
     * @property {number} maxlength - Maximum length
     * @default null
     * @attribute maxlength
     * @reflects true
     */
    maxlength: { type: Number, reflect: true },

    /**
     * @property {string} pattern - Regex validation pattern
     * @default null
     * @attribute pattern
     * @reflects true
     */
    pattern: { type: String, reflect: true },

    /**
     * @property {string} autocomplete - Autocomplete attribute
     * @default 'off'
     * @attribute autocomplete
     * @reflects true
     */
    autocomplete: { type: String, reflect: true },

    /**
     * @property {string} label - Optional label above input
     * @default ''
     * @attribute label
     * @reflects true
     */
    label: { type: String, reflect: true },

    /**
     * @property {string} helperText - Optional helper text below input
     * @default ''
     * @attribute helper-text
     * @reflects true
     */
    helperText: { type: String, reflect: true, attribute: 'helper-text' },

    /**
     * @property {string} icon - Optional icon (SVG string)
     * @default ''
     * @attribute icon
     */
    icon: { type: String }
  };


  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE - underscore prefix)
  // ----------------------------------------------------------
  /** @private */
  _showPassword = false;

  /** @private */
  _errorState = false;

  /** @private */
  _errorMessage = '';

  /** @private */
  _internals = null;

  // ----------------------------------------------------------
  // BLOCK 5: LOGGER INSTANCE (REQUIRED)
  // ----------------------------------------------------------
  /** @private */
  _logger = null;

  // ----------------------------------------------------------
  // BLOCK 6: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  constructor() {
    super();

    // Initialize default property values
    this.type = 'text';
    this.placeholder = '';
    this.value = '';
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.min = null;
    this.max = null;
    this.minlength = null;
    this.maxlength = null;
    this.pattern = null;
    this.autocomplete = 'off';
    this.label = '';
    this.helperText = '';
    this.icon = '';
    this.stepperStyle = 'plusminus';
    this.stepperSize = 'md';

    // Initialize logger
    this._logger = componentLogger.for(TInputLit.tagName);
    this._logger.debug('Component constructed');

    // Initialize ElementInternals for form participation
    if (this.attachInternals) {
      this._internals = this.attachInternals();
      this._logger.debug('ElementInternals attached');
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
    this._logger.info('Connected to DOM');
  }

  /**
   * Called when component is disconnected from DOM
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    this._applyStepperSize();

    // Sync form value
    if (this._internals) {
      this._internals.setFormValue(this.value);
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

    // Sync form value when value changes
    if (changedProperties.has('value') && this._internals) {
      this._internals.setFormValue(this.value);
    }

    if (changedProperties.has('stepperSize')) {
      this._applyStepperSize();
    }
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Set input value programmatically
   * @public
   * @param {string} value - New value
   * @fires TInputLit#input-value
   * @example
   * input.setValue('Hello');
   */
  setValue(value) {
    this._logger.debug('setValue called', { value });
    this.value = value;
    if (this._internals) {
      this._internals.setFormValue(value);
    }
  }

  /**
   * Get current input value
   * @public
   * @returns {string} Current value
   * @example
   * const value = input.getValue();
   */
  getValue() {
    this._logger.debug('getValue called');
    return this.value;
  }

  /**
   * Focus the input
   * @public
   * @example
   * input.focus();
   */
  focus() {
    this._logger.debug('focus called');
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.focus();
  }

  /**
   * Blur the input
   * @public
   * @example
   * input.blur();
   */
  blur() {
    this._logger.debug('blur called');
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.blur();
  }

  /**
   * Validate the input value
   * @public
   * @returns {boolean} True if valid, false otherwise
   * @fires TInputLit#input-error
   * @fires TInputLit#input-valid
   * @example
   * const isValid = input.validate();
   */
  validate() {
    this._logger.debug('validate called', { value: this.value });

    const input = this.shadowRoot?.querySelector('input');
    if (!input) return true;

    // Check required
    if (this.required && (!this.value || this.value.trim() === '')) {
      this.setError(true, 'This field is required');
      return false;
    }

    // Check maxlength
    if (this.maxlength && this.value && this.value.length > this.maxlength) {
      this.setError(true, `Maximum ${this.maxlength} characters allowed`);
      return false;
    }

    // Check minlength
    if (this.minlength && this.value && this.value.length < this.minlength) {
      this.setError(true, `Minimum ${this.minlength} characters required`);
      return false;
    }

    // Type-specific validation
    if (this.type === 'email') {
      if (this.value && !this._validateEmail(this.value)) {
        this.setError(true, 'Invalid email address');
        return false;
      }
    }

    if (this.type === 'url') {
      if (this.value && !this._validateUrl(this.value)) {
        this.setError(true, 'Invalid URL');
        return false;
      }
    }

    if (this.type === 'number') {
      const numValue = parseFloat(this.value);
      if (this.value && isNaN(numValue)) {
        this.setError(true, 'Must be a number');
        return false;
      }
      if (this.min !== null && numValue < this.min) {
        this.setError(true, `Value must be at least ${this.min}`);
        return false;
      }
      if (this.max !== null && numValue > this.max) {
        this.setError(true, `Value must be at most ${this.max}`);
        return false;
      }
    }

    // Use native HTML5 validation for pattern if provided
    if (this.pattern && this.value) {
      try {
        const regex = new RegExp(this.pattern);
        if (!regex.test(this.value)) {
          this.setError(true, 'Value does not match required pattern');
          return false;
        }
      } catch (e) {
        // Invalid regex pattern, skip
      }
    }

    this.setError(false);
    return true;
  }

  /**
   * Set error state manually
   * @public
   * @param {boolean} hasError - Whether component has error
   * @param {string} message - Error message
   * @fires TInputLit#input-error
   * @fires TInputLit#input-valid
   * @example
   * input.setError(true, 'Custom error message');
   */
  setError(hasError, message = '') {
    this._logger.debug('setError called', { hasError, message });
    this._errorState = hasError;
    this._errorMessage = message;

    if (this._internals) {
      if (hasError) {
        this._internals.setValidity({ customError: true }, message);
      } else {
        this._internals.setValidity({});
      }
    }

    if (hasError) {
      this._emitEvent('input-error', { error: message });
    } else {
      this._emitEvent('input-valid', { value: this.value });
    }

    this.requestUpdate();
  }

  /**
   * Clear the input value
   * @public
   * @fires TInputLit#input-value
   * @fires TInputLit#input-clear
   * @example
   * input.clear();
   */
  clear() {
    this._logger.debug('clear called');
    this.setValue('');
    this._emitEvent('input-clear', {});
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
      composed: true,
    });

    this.dispatchEvent(event);
  }

  /**
   * @event TInputLit#input-value
   * @type {CustomEvent<{value: string}>}
   * @description Fired on every keystroke
   * @property {string} detail.value - Current input value
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-change
   * @type {CustomEvent<{value: string}>}
   * @description Fired on blur or Enter key
   * @property {string} detail.value - Current input value
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-error
   * @type {CustomEvent<{error: string}>}
   * @description Fired when validation fails
   * @property {string} detail.error - Error message
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-valid
   * @type {CustomEvent<{value: string}>}
   * @description Fired when validation passes
   * @property {string} detail.value - Current input value
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-focus
   * @type {CustomEvent<{}>}
   * @description Fired when input receives focus
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-blur
   * @type {CustomEvent<{}>}
   * @description Fired when input loses focus
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-enter
   * @type {CustomEvent<{value: string}>}
   * @description Fired when Enter key is pressed
   * @property {string} detail.value - Current input value
   * @bubbles true
   * @composed true
   */

  /**
   * @event TInputLit#input-clear
   * @type {CustomEvent<{}>}
   * @description Fired when search input is cleared
   * @bubbles true
   * @composed true
   */

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Get property validation for a given property name
   * @static
   * @param {string} propName - Property name to validate
   * @returns {Object|undefined} Validation configuration
   */
  static getPropertyValidation(propName) {
    const validators = {
      type: {
        validate: (value) => {
          const validTypes = ['text', 'password', 'email', 'number', 'search', 'tel', 'url'];
          const valid = validTypes.includes(value);
          return {
            valid,
            errors: valid ? [] : [`Invalid input type: ${value}. Must be one of: ${validTypes.join(', ')}`]
          };
        }
      },
      min: {
        validate: (value, context) => {
          if (context.type !== 'number') return { valid: true, errors: [] };
          if (context.max !== null && value > context.max) {
            return { valid: false, errors: ['Min value must be less than max'] };
          }
          return { valid: true, errors: [] };
        }
      },
      max: {
        validate: (value, context) => {
          if (context.type !== 'number') return { valid: true, errors: [] };
          if (context.min !== null && value < context.min) {
            return { valid: false, errors: ['Max value must be greater than min'] };
          }
          return { valid: true, errors: [] };
        }
      },
      pattern: {
        validate: (value) => {
          if (!value) return { valid: true, errors: [] };
          try {
            new RegExp(value);
            return { valid: true, errors: [] };
          } catch (e) {
            return { valid: false, errors: ['Invalid regular expression pattern'] };
          }
        }
      }
    };
    return validators[propName];
  }

  /**
   * Validate a property value
   * @private
   * @param {string} propName - Property name
   * @param {*} value - Property value
   * @returns {Object} Validation result
   */
  _validateProperty(propName, value) {
    const validation = TInputLit.getPropertyValidation(propName);
    if (!validation) return { valid: true, errors: [] };
    return validation.validate(value, this);
  }

  /**
   * Validate email format
   * @private
   * @param {string} email
   * @returns {boolean}
   */
  _validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format (accepts bare domains)
   * @private
   * @param {string} url
   * @returns {boolean}
   */
  _validateUrl(url) {
    const v = (url || '').trim();
    if (!v) return true;

    const normalized = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    let parsed;
    try {
      parsed = new URL(normalized);
    } catch {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    const ipv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;

    if (ipv4.test(hostname)) {
      const ok = hostname.split('.').every((o) => {
        const n = Number(o);
        return Number.isInteger(n) && n >= 0 && n <= 255;
      });
      return ok;
    } else if (hostname !== 'localhost') {
      const labels = hostname.split('.');
      if (labels.length < 2) return false;
      const tld = labels.pop();
      const tldOk = /^[a-z]{2,63}$/.test(tld);
      const labelsOk = labels.every((l) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(l));
      return tldOk && labelsOk;
    }

    return true;
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

    const inputClasses = [];
    if (this.type === 'password') inputClasses.push('has-toggle');
    if (this.type === 'number') inputClasses.push('has-number-controls');
    if (this.type === 'search' && this.value) inputClasses.push('has-clear');
    if (this.icon) inputClasses.push('has-icon');
    if (this._errorState) inputClasses.push('error');

    const inputType = this.type === 'password' ? (this._showPassword ? 'text' : 'password') :
                      this.type === 'url' ? 'text' : this.type;
    const numberWidth = this.type === 'number' ? this._getNumberWidth() : '';
    const wrapperStyle = numberWidth ? `min-width: ${numberWidth};` : '';

    return html`
      ${this.label ? html`<label class="control-label">${this.label}</label>` : ''}

      <div class="input-wrapper" style=${wrapperStyle}>
        ${this.icon ? html`<span class="input-icon" .innerHTML=${this.icon}></span>` : ''}

        <input
          type=${inputType}
          class=${inputClasses.join(' ')}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          min=${this.min ?? ''}
          max=${this.max ?? ''}
          minlength=${this.minlength ?? ''}
          maxlength=${this.maxlength ?? ''}
          pattern=${this.pattern ?? ''}
          autocomplete=${this.autocomplete}
          @input=${this._handleInput}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @keydown=${this._handleKeyDown}
        />

        ${this.type === 'password' ? this._renderPasswordToggle() : ''}
        ${this.type === 'number' ? this._renderNumberControls() : ''}
        ${this.type === 'search' && this.value ? this._renderSearchClear() : ''}
      </div>

      ${this._errorState && this._errorMessage ?
        html`<div class="error-message">${this._errorMessage}</div>` : ''}

      ${this.helperText && !this._errorState ?
        html`<div class="helper-text">${this.helperText}</div>` : ''}
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  /**
   * Apply stepper size presets
   * @private
   */
  _applyStepperSize() {
    const sizes = {
      sm: { size: 20, height: 20, icon: 12 },
      md: { size: 24, height: 24, icon: 14 },
      lg: { size: 28, height: 28, icon: 16 }
    };

    const preset = sizes[this.stepperSize] || sizes.md;
    this.style.setProperty('--t-stepper-size', `${preset.size}px`);
    this.style.setProperty('--t-stepper-height', `${preset.height}px`);
    this.style.setProperty('--t-stepper-icon-size', `${preset.icon}px`);
  }

  /**
   * Resolve stepper icons based on style
   * @private
   */
  _getStepperIcons() {
    switch (this.stepperStyle) {
      case 'chevron':
        return { inc: caretUpIcon, dec: caretDownIcon };
      case 'arrows':
        return { inc: arrowUpIcon, dec: arrowDownIcon };
      default:
        return { inc: plusIcon, dec: minusIcon };
    }
  }

  /**
   * Calculate number input width based on range digits and stepper buttons
   * @private
   */
  _getNumberWidth() {
    const min = Number.isFinite(this.min) ? this.min : 0;
    const max = Number.isFinite(this.max) ? this.max : 0;
    const step = Number.isFinite(this.step) ? this.step : 1;

    const minDigits = Math.abs(min).toString().length;
    const maxDigits = Math.abs(max).toString().length;
    const hasNegative = min < 0;
    const hasDecimals = step < 1;
    const decimalPlaces = hasDecimals ? (String(step).split('.')[1]?.length || 0) : 0;

    let digits = Math.max(minDigits, maxDigits);
    if (hasDecimals) digits += decimalPlaces + 1;
    if (hasNegative) digits += 1;

    const safeDigits = Math.max(3, digits);

    // Account for stepper buttons: (size * 2) + gap + margins
    // sm: 20*2=40, md: 24*2=48, lg: 28*2=56, plus ~18px for gap/margins
    const stepperSizes = { sm: 58, md: 66, lg: 74 };
    const stepperWidth = stepperSizes[this.stepperSize] || stepperSizes.md;

    return `calc(${safeDigits}ch + ${stepperWidth + 16}px)`;
  }

  /**
   * Handle input event
   * @private
   */
  _handleInput(e) {
    this.value = e.target.value;
    this._emitEvent('input-value', { value: this.value });

    // Live validation for certain types
    if (this.type === 'number' || this.pattern || this.maxlength) {
      this.validate();
    } else if (this._errorState) {
      // Clear error on input for email/url
      if (this.type === 'email' || this.type === 'url') {
        this.setError(false);
      }
    }
  }

  /**
   * Handle focus event
   * @private
   */
  _handleFocus(e) {
    this._emitEvent('input-focus', {});
  }

  /**
   * Handle blur event
   * @private
   */
  _handleBlur(e) {
    this._emitEvent('input-blur', {});
    this._emitEvent('input-change', { value: this.value });

    // Validate on blur for certain types
    if (this.type === 'email' || this.type === 'url' || this.required) {
      this.validate();
    }
  }

  /**
   * Handle keydown event
   * @private
   */
  _handleKeyDown(e) {
    if (e.key === 'Enter') {
      this._emitEvent('input-enter', { value: this.value });
      this.validate();
    }
  }

  /**
   * Toggle password visibility
   * @private
   */
  _togglePassword() {
    this._showPassword = !this._showPassword;
    this._logger.debug('Password visibility toggled', { showPassword: this._showPassword });
    this.requestUpdate();
  }

  /**
   * Increment number value
   * @private
   */
  _incrementNumber() {
    const currentValue = parseFloat(this.value) || 0;
    const step = 1;
    let newValue = currentValue + step;

    if (this.max !== null && newValue > this.max) {
      newValue = this.max;
    }

    this.setValue(String(newValue));
    this._emitEvent('input-value', { value: this.value });
    this.validate();
  }

  /**
   * Decrement number value
   * @private
   */
  _decrementNumber() {
    const currentValue = parseFloat(this.value) || 0;
    const step = 1;
    let newValue = currentValue - step;

    if (this.min !== null && newValue < this.min) {
      newValue = this.min;
    }

    this.setValue(String(newValue));
    this._emitEvent('input-value', { value: this.value });
    this.validate();
  }

  /**
   * Clear search input
   * @private
   */
  _clearSearch() {
    this.clear();
    this.focus();
  }

  /**
   * Render password toggle button
   * @private
   * @returns {TemplateResult}
   */
  _renderPasswordToggle() {
    return html`
      <button
        type="button"
        class="password-toggle"
        @click=${this._togglePassword}
        aria-label="Toggle password visibility"
        .innerHTML=${this._showPassword ? eyeIcon : eyeClosedIcon}
      ></button>
    `;
  }

  /**
   * Render number increment/decrement controls
   * @private
   * @returns {TemplateResult}
   */
  _renderNumberControls() {
    const icons = this._getStepperIcons();
    return html`
      <div class="number-controls">
        <button
          type="button"
          class="number-increment"
          @click=${this._incrementNumber}
          ?disabled=${this.disabled || this.readonly}
          aria-label="Increment"
          .innerHTML=${icons.inc}
        ></button>
        <button
          type="button"
          class="number-decrement"
          @click=${this._decrementNumber}
          ?disabled=${this.disabled || this.readonly}
          aria-label="Decrement"
          .innerHTML=${icons.dec}
        ></button>
      </div>
    `;
  }

  /**
   * Render search clear button
   * @private
   * @returns {TemplateResult}
   */
  _renderSearchClear() {
    return html`
      <button
        type="button"
        class="search-clear"
        @click=${this._clearSearch}
        aria-label="Clear search"
        .innerHTML=${xIcon}
      ></button>
    `;
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TInputLit.tagName)) {
  customElements.define(TInputLit.tagName, TInputLit);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================

/**
 * Component manifest for TInputLit
 * @type {Object}
 */
export const TInputManifest = generateManifest(TInputLit, {
  tagName: 't-inp',
  displayName: 'Input',
  description: 'Form input control with validation, type-specific features, and native form participation',
  version: '1.0.0',
  category: 'Form Controls',
  profile: 'FORM-ADVANCED',
  methods: {
    setValue: { params: ['value'], returns: 'void' },
    getValue: { params: [], returns: 'string' },
    focus: { params: [], returns: 'void' },
    blur: { params: [], returns: 'void' },
    validate: { params: [], returns: 'boolean' },
    setError: { params: ['hasError', 'message'], returns: 'void' },
    clear: { params: [], returns: 'void' }
  },
  events: {
    'input-value': { detail: '{value: string}', description: 'Fired on every keystroke' },
    'input-change': { detail: '{value: string}', description: 'Fired on blur or Enter key' },
    'input-error': { detail: '{error: string}', description: 'Fired when validation fails' },
    'input-valid': { detail: '{value: string}', description: 'Fired when validation passes' },
    'input-focus': { detail: '{}', description: 'Fired when input receives focus' },
    'input-blur': { detail: '{}', description: 'Fired when input loses focus' },
    'input-enter': { detail: '{value: string}', description: 'Fired when Enter key is pressed' },
    'input-clear': { detail: '{}', description: 'Fired when search input is cleared' }
  },
  slots: {}
});

// ============================================================
// SECTION 5: EXPORT (REQUIRED)
// ============================================================
export default TInputLit;
