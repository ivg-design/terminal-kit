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
 * @component TStatusBarLit
 * @tagname t-sta
 * @description Flexible status bar with dynamic fields, alignment zones, and marquee support
 * @category Display
 * @since 1.0.0
 * @example
 * <t-sta id="statusBar"></t-sta>
 * <script>
 *   statusBar.setFields([
 *     { label: 'File', value: 'main.js', width: '30%', align: 'left' },
 *     { label: 'Mode', value: 'INSERT', width: 'auto', align: 'center' },
 *     { label: 'Line', value: '42:10', width: '15%', align: 'right' }
 *   ]);
 * </script>
 */
export class TStatusBarLit extends LitElement {

  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-sta';
  static version = '1.0.0';
  static category = 'Display';
  static profile = 'CONTAINER';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: var(--terminal-black-light, #1a1a1a);
      color: var(--terminal-green, #00ff41);
      font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
      font-size: var(--font-size-xs, 10px);
      border-top: 1px solid var(--terminal-gray-light, #333333);
      padding: var(--spacing-sm, 8px) var(--spacing-md, 12px);
      box-sizing: border-box;
    }

    .status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0;
      width: 100%;
      min-height: 20px;
    }

    .status-field {
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      overflow: hidden;
      flex-shrink: 0;
    }

    .status-field.has-width {
      flex-shrink: 1;
    }

    /* Alignment classes using margin-based positioning */
    .status-field.push-right {
      margin-left: auto;
    }

    .status-field.push-center {
      margin-left: auto;
      margin-right: auto;
    }

    .status-field.push-left {
      margin-right: auto;
    }

    .field-icon {
      display: inline-flex;
      align-items: center;
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    .field-icon svg {
      width: 12px !important;
      height: 12px !important;
      max-width: 12px !important;
      max-height: 12px !important;
      fill: currentColor;
    }

    .field-label {
      color: var(--terminal-green-dim, #00cc33);
      flex-shrink: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: var(--font-size-xs, 10px);
    }

    .field-value-wrapper {
      overflow: hidden;
      position: relative;
      display: inline-block;
    }

    .field-value {
      display: inline-block;
      color: var(--terminal-green, #00ff41);
    }

    /* Marquee styles */
    .status-field.marquee-active .field-value-wrapper {
      mask-image: linear-gradient(
        to right,
        transparent,
        black 10px,
        black calc(100% - 10px),
        transparent
      );
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        black 10px,
        black calc(100% - 10px),
        transparent
      );
    }

    .status-field.marquee-active,
    .status-field.marquee-active * {
      font-size: var(--font-size-xs, 10px) !important;
      line-height: normal !important;
    }

    .status-field.marquee-active .marquee-text {
      display: inline-block;
      padding-right: 30px;
      animation: marquee 10s linear infinite;
    }

    @keyframes marquee {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(-50%, 0, 0);
      }
    }

    .status-separator {
      color: var(--terminal-gray-light, #333333);
      user-select: none;
      flex-shrink: 0;
      margin: 0 var(--spacing-xs, 4px);
    }

    /* Hover disabled - prevent all interaction */
    .status-field:not(.hover-enabled) {
      pointer-events: none;
      user-select: none;
      cursor: default;
    }

    /* Hover effects - only when enabled */
    .status-field.hover-enabled:hover {
      background: rgba(0, 255, 65, 0.1);
      cursor: pointer;
    }

    .status-field.hover-enabled:hover .field-label,
    .status-field.hover-enabled:hover .field-icon {
      color: var(--terminal-green, #00ff41);
    }

    .status-field.hover-enabled:hover .field-value {
      color: var(--terminal-green-bright, #00ff66);
    }

    /* Disabled field styles - hide completely instead of graying out */
    .status-field.disabled {
      display: none !important;
    }

    /* Slotted field styles */
    ::slotted(t-sta-field) {
      display: inline-flex;
      align-items: center;
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  /**
   * @property {Array} fields - Array of field configurations
   * @default []
   * @validation Total width must not exceed 95%
   */
  static properties = {
    /**
     * @property {Array} fields - Array of field configurations
     * @default []
     * @validation Total width must not exceed 95%
     */
    fields: { type: Array }
  };

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE)
  // ----------------------------------------------------------
  /** @private */
  _timers = new Set();

  /** @private */
  _marqueeElements = new Map();

  /** @private */
  _nestedFields = new Set();

  /** @private */
  _context = null;

  // ----------------------------------------------------------
  // BLOCK 5: LOGGER INSTANCE (REQUIRED)
  // ----------------------------------------------------------
  /** @private */
  _logger = componentLogger.for('TStatusBarLit');

  // ----------------------------------------------------------
  // BLOCK 6: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  constructor() {
    super();

    // Log construction
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.fields = [];

    // Initialize nested component registry
    this._nestedFields = new Set();

    // Bind event handlers
    this._handleFieldClick = this._handleFieldClick.bind(this);
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

    // Register with parent if nested
    this._registerWithParent();
  }

  /**
   * Called when component is disconnected from DOM
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');

    // Cleanup
    this._cleanup();

    // Unregister from parent
    this._unregisterFromParent();
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    // Discover nested t-sta-field components
    this._discoverNestedFields();

    // Setup marquee for fields that need it
    this._setupMarquees();
  }

  /**
   * Called after every render
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', {
      changed: Array.from(changedProperties.keys())
    });

    // React to property changes
    if (changedProperties.has('fields')) {
      this._handleFieldsChange();
    }
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Set all fields at once
   * @public
   * @param {Array<Object>} fields - Array of field configurations
   * @returns {void}
   * @fires TStatusBarLit#field-click
   * @example
   * statusBar.setFields([
   *   { label: 'CPU', value: '42%', width: '20%', align: 'left' },
   *   { label: 'RAM', value: '8GB', width: '20%', align: 'right' }
   * ]);
   */
  setFields(fields) {
    this._logger.debug('setFields called', { fields });

    // Validate fields
    if (!Array.isArray(fields)) {
      const error = new Error('Fields must be an array');
      this._logger.error('Invalid fields', { fields, error });
      throw error;
    }

    // Enhance and validate field configurations
    const validatedFields = this._validateFields(fields);

    this.fields = validatedFields;
  }

  /**
   * Update a single field by index
   * @public
   * @param {number} index - Field index
   * @param {Object} field - Field configuration
   * @returns {void}
   * @example
   * statusBar.updateField(0, { value: '55%', marquee: true });
   */
  updateField(index, field) {
    this._logger.debug('updateField called', { index, field });

    if (index < 0 || index >= this.fields.length) {
      const error = new Error(`Invalid field index: ${index}`);
      this._logger.error('Invalid index', { index, error });
      throw error;
    }

    const fields = [...this.fields];
    fields[index] = { ...fields[index], ...field };

    this.fields = this._validateFields(fields);
  }

  /**
   * Update only the value of a field
   * @public
   * @param {number} index - Field index
   * @param {string} value - New value
   * @returns {void}
   * @example
   * statusBar.updateFieldValue(0, getCPUUsage() + '%');
   */
  updateFieldValue(index, value) {
    this._logger.debug('updateFieldValue called', { index, value });
    this.updateField(index, { value });
  }

  /**
   * Enable or disable a field
   * @public
   * @param {number} index - Field index
   * @param {boolean} disabled - Whether the field should be disabled
   * @returns {void}
   * @example
   * statusBar.setFieldDisabled(0, true);  // Disable first field
   * statusBar.setFieldDisabled(0, false); // Enable first field
   */
  setFieldDisabled(index, disabled) {
    this._logger.debug('setFieldDisabled called', { index, disabled });
    this.updateField(index, { disabled });
  }

  /**
   * Show or hide a field
   * @public
   * @param {number} index - Field index
   * @param {boolean} hidden - Whether the field should be hidden
   * @returns {void}
   * @example
   * statusBar.setFieldHidden(0, true);  // Hide first field
   * statusBar.setFieldHidden(0, false); // Show first field
   */
  setFieldHidden(index, hidden) {
    this._logger.debug('setFieldHidden called', { index, hidden });
    this.updateField(index, { hidden });
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
   * @event TStatusBarLit#field-click
   * @type {CustomEvent<{field: Object, index: number}>}
   * @description Fired when a field is clicked
   * @property {Object} detail.field - The field configuration
   * @property {number} detail.index - The field index
   * @bubbles true
   * @composed true
   */

  // ----------------------------------------------------------
  // BLOCK 10: NESTING SUPPORT (REQUIRED FOR CONTAINER)
  // ----------------------------------------------------------

  /**
   * Register nested t-sta-field component
   * @private
   * @param {LitElement} field
   */
  _registerNestedField(field) {
    this._logger.debug('Registering nested field', {
      tag: field.tagName
    });

    this._nestedFields.add(field);

    // Propagate context
    this._propagateContext(field);
  }

  /**
   * Discover nested t-sta-field components
   * @private
   */
  _discoverNestedFields() {
    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      const assigned = slot.assignedElements();
      assigned.forEach(el => {
        if (el.tagName === 'T-STA-FIELD') {
          this._registerNestedField(el);
        }
      });
    }

    this._logger.debug('Discovered nested fields', {
      count: this._nestedFields.size
    });
  }

  /**
   * Propagate context to nested field
   * @private
   */
  _propagateContext(field) {
    if (typeof field.receiveContext === 'function') {
      field.receiveContext({
        parent: this,
        depth: (this._context?.depth || 0) + 1,
        logger: this._logger
      });
    }
  }

  /**
   * Receive context from parent
   * @public
   * @param {Object} context
   */
  receiveContext(context) {
    // Validate depth
    if (context.depth >= 10) {
      throw new Error('Maximum nesting depth exceeded');
    }

    this._context = context;
    this._logger.debug('Received context from parent', { context });
  }

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Validate fields array
   * @private
   * @param {Array} fields
   * @returns {Array} Validated fields
   */
  _validateFields(fields) {
    if (!Array.isArray(fields)) {
      this._logger.warn('Fields must be an array', { fields });
      return [];
    }

    // Calculate total width percentage
    let totalPercentage = 0;
    const maxAllowedTotal = 95; // Leave 5% for margins/separators

    const enhancedFields = fields.map(field => ({
      label: field.label || '',
      value: field.value || '',
      icon: field.icon || null,
      width: field.width || 'auto',
      align: field.align || 'left',
      marquee: field.marquee || false,
      marqueeSpeed: field.marqueeSpeed || 30,
      disabled: field.disabled || false,
      hidden: field.hidden || false,
      ...field
    }));

    // Validate widths
    enhancedFields.forEach(field => {
      if (field.width && field.width !== 'auto') {
        const match = field.width.match(/(\d+(?:\.\d+)?)%/);
        if (match) {
          totalPercentage += parseFloat(match[1]);
        }
      }
    });

    // Scale down if total exceeds max
    if (totalPercentage > maxAllowedTotal) {
      this._logger.warn('Total width exceeds maximum, scaling down', {
        total: totalPercentage,
        max: maxAllowedTotal
      });

      const scale = (maxAllowedTotal - 0.1) / totalPercentage; // Slightly under to ensure we don't exceed
      enhancedFields.forEach(field => {
        if (field.width && field.width !== 'auto') {
          const match = field.width.match(/(\d+(?:\.\d+)?)%/);
          if (match) {
            const newWidth = Math.floor(parseFloat(match[1]) * scale * 10) / 10; // Round down to 1 decimal
            field.width = `${newWidth}%`;
          }
        }
      });
    }

    return enhancedFields;
  }

  /**
   * Get property validation rules
   * @static
   * @param {string} propName
   * @returns {Object|null}
   */
  static getPropertyValidation(propName) {
    if (propName === 'fields') {
      return {
        validate: (value) => {
          const valid = Array.isArray(value);
          return {
            valid,
            errors: valid ? [] : ['fields must be an array']
          };
        }
      };
    }
    return null;
  }

  /**
   * Get slot validation rules
   * @static
   * @param {string} slotName
   * @returns {Object|null}
   */
  static getSlotValidation(slotName) {
    if (slotName === 'default') {
      return {
        allowedElements: ['t-sta-field'],
        validate: (elements) => {
          const valid = elements.every(el => el.tagName?.toLowerCase() === 't-sta-field');
          return {
            valid,
            errors: valid ? [] : ['Only t-sta-field elements allowed in default slot']
          };
        }
      };
    }
    return null;
  }

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Render component template
   * @returns {TemplateResult}
   * @slot - Default slot for t-sta-field components
   */
  render() {
    this._logger.trace('Rendering');

    return html`
      <div class="status-bar">
        ${this._renderFields()}
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  /** @private */
  _renderFields() {
    if (!this.fields || this.fields.length === 0) {
      return null;
    }

    return this.fields.map((field, index) => {
      const classes = ['status-field'];

      // Add disabled class
      if (field.disabled) {
        classes.push('disabled');
      }

      // Add hidden class
      if (field.hidden) {
        classes.push('hidden');
      }

      // Add width class
      if (field.width && field.width !== 'auto') {
        classes.push('has-width');
      }

      // Add marquee class
      if (field.marquee) {
        classes.push('marquee-enabled');
      }

      // Add hover class if enabled (default is true) and not disabled
      if (field.hover !== false && !field.disabled) {
        classes.push('hover-enabled');
      }

      // Add alignment class
      const marginClass = this._getMarginClass(field, index, this.fields);
      if (marginClass) {
        classes.push(marginClass);
      }

      // Build styles
      const styles = [];
      if (field.width && field.width !== 'auto') {
        styles.push(`width: ${field.width}`);
        styles.push(`flex: 0 1 ${field.width}`);
      }

      // Determine what to show based on displayMode
      // Options: 'text' (label + value), 'icon' (icon + value),
      //          'icon-text' (icon + label + value), 'value' (value only)
      const displayMode = field.displayMode || 'text';
      const showIcon = displayMode === 'icon' || displayMode === 'icon-text';
      const showLabel = displayMode === 'text' || displayMode === 'icon-text';
      const showValue = true; // Always show value

      return html`
        ${index > 0 ? html`<span class="status-separator">|</span>` : ''}
        <div
          class=${classes.join(' ')}
          style=${styles.join('; ')}
          data-field-index=${index}
          @click=${() => this._handleFieldClick(field, index)}
          @mouseenter=${field.hover !== false ? () => this._handleFieldHover(field, index, true) : null}
          @mouseleave=${field.hover !== false ? () => this._handleFieldHover(field, index, false) : null}
        >
          ${showIcon && field.icon ? html`
            <span class="field-icon">${this._unsafeHTML(field.icon)}</span>
          ` : ''}
          ${showLabel && field.label ? html`
            <span class="field-label">${field.label}:</span>
          ` : ''}
          ${showValue ? html`
            <div class="field-value-wrapper">
              <span class="field-value">${field.value || ''}</span>
            </div>
          ` : ''}
        </div>
      `;
    });
  }

  /** @private */
  _unsafeHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  }

  /** @private */
  _getMarginClass(field, index, allFields) {
    const align = field.align || 'left';
    const prevAlign = index > 0 ? (allFields[index - 1].align || 'left') : null;

    // Detect alignment transitions
    if (align === 'right' && prevAlign !== 'right') {
      return 'push-right';
    }

    if (align === 'center') {
      if (prevAlign === 'left' || prevAlign === null) {
        const nextAlign = index < allFields.length - 1 ?
          (allFields[index + 1].align || 'left') : null;
        if (nextAlign !== 'right') {
          return 'push-center';
        }
      }
    }

    if (align === 'left' && prevAlign === 'right') {
      return 'push-left';
    }

    return null;
  }

  /**
   * @private
   * @param {Object} field - The field configuration object
   * @param {number} index - The field index
   * @description Handles click events on fields and emits field-click event
   */
  _handleFieldClick(field, index) {
    this._emitEvent('field-click', { field, index });
  }

  /** @private */
  _handleSlotChange(e) {
    this._discoverNestedFields();
  }

  /** @private */
  _handleFieldsChange() {
    // Clean up old marquees
    this._cleanupMarquees();

    // Setup new marquees after render
    requestAnimationFrame(() => {
      this._setupMarquees();
    });
  }

  /** @private */
  _setupMarquees() {
    if (!this.fields) return;

    this.fields.forEach((field, index) => {
      if (field.marquee) {
        this._setupMarqueeForField(index);
      }
    });
  }

  /** @private */
  _setupMarqueeForField(index) {
    const fieldElement = this.shadowRoot.querySelector(
      `.status-field[data-field-index="${index}"]`
    );

    if (!fieldElement) return;

    const valueWrapper = fieldElement.querySelector('.field-value-wrapper');
    const valueElement = fieldElement.querySelector('.field-value');

    if (!valueWrapper || !valueElement) return;

    // Check if text overflows
    const containerWidth = valueWrapper.offsetWidth;
    const textWidth = valueElement.scrollWidth;

    if (textWidth > containerWidth) {
      // Enable marquee
      fieldElement.classList.add('marquee-active');

      // Create marquee structure
      const field = this.fields[index];
      const marqueeHtml = `
        <span class="marquee-text">${field.value}</span>
        <span class="marquee-text">${field.value}</span>
      `;
      valueWrapper.innerHTML = marqueeHtml;

      // Store reference for cleanup
      this._marqueeElements.set(index, fieldElement);
    }
  }

  /** @private */
  _cleanupMarquees() {
    this._marqueeElements.forEach((element, index) => {
      element.classList.remove('marquee-active');
      const wrapper = element.querySelector('.field-value-wrapper');
      if (wrapper && this.fields[index]) {
        wrapper.innerHTML = `<span class="field-value">${this.fields[index].value || ''}</span>`;
      }
    });
    this._marqueeElements.clear();
  }

  /**
   * @private
   * @param {Object} field - The field configuration object
   * @param {number} index - The field index
   * @param {boolean} isEntering - True if mouse is entering, false if leaving
   * @description Handles mouse hover events on fields
   */
  _handleFieldHover(field, index, isEntering) {
    // Call onHover or onHoverEnd callback if provided
    if (isEntering && field.onHover) {
      field.onHover(field, index, this);
    } else if (!isEntering && field.onHoverEnd) {
      field.onHoverEnd(field, index, this);
    }

    // Emit custom events
    const eventName = isEntering ? 'field-hover' : 'field-hover-end';
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: { field, index },
      bubbles: true,
      composed: true
    }));
  }

  /** @private */
  _cleanup() {
    // Clear all timers
    this._timers.forEach(id => clearTimeout(id));
    this._timers.clear();

    // Clean up marquees
    this._cleanupMarquees();

    // Clear nested fields
    this._nestedFields.clear();

    this._logger.debug('Cleanup completed');
  }

  /** @private */
  _registerWithParent() {
    const parent = this.parentElement;
    if (parent && typeof parent._registerNestedComponent === 'function') {
      parent._registerNestedComponent(this);
    }
  }

  /** @private */
  _unregisterFromParent() {
    const parent = this.parentElement;
    if (parent && typeof parent._unregisterNestedComponent === 'function') {
      parent._unregisterNestedComponent(this);
    }
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TStatusBarLit.tagName)) {
  customElements.define(TStatusBarLit.tagName, TStatusBarLit);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================
export const TStatusBarManifest = generateManifest(TStatusBarLit);

// ============================================================
// SECTION 5: EXPORTS
// ============================================================
// TStatusBarLit is already exported in the class declaration