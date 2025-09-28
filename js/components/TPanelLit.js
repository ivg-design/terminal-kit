// ============================================
// SECTION 1: IMPORTS
// ============================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { caretRightIcon, caretDownIcon } from '../utils/phosphor-icons.js';
import { generateManifest } from '../utils/manifest-generator.js';

// ============================================
// SECTION 2: COMPONENT CLASS
// ============================================

/**
 * Terminal Panel Component - Full Schema Implementation
 *
 * @component
 * @tagname t-pnl
 * @description Collapsible panel with header, footer, and nested content support. Follows FULL profile with all 13 blocks.
 * @category Layout
 * @since 1.0.0
 * @example
 * <t-pnl title="Settings" collapsible>
 *   <t-inp slot="default" label="Name"></t-inp>
 *   <t-btn slot="actions" icon="save">Save</t-btn>
 *   <t-sta slot="footer">Status: Ready</t-sta>
 * </t-pnl>
 */
export class TPanelLit extends LitElement {

  // ============================================
  // BLOCK 1: Static Metadata
  // ============================================
  static tagName = 't-pnl';
  static version = '1.0.0';
  static category = 'Layout';

  // ============================================
  // BLOCK 2: Static Styles
  // ============================================
  static styles = css`
    :host {
      --terminal-black: #0a0a0a;
      --terminal-black-light: #1a1a1a;
      --terminal-green: #00ff41;
      --terminal-green-bright: #33ff66;
      --terminal-green-dim: #00cc33;
      --terminal-green-dark: #008820;
      --terminal-gray: #808080;
      --terminal-gray-dark: #242424;
      --terminal-gray-light: #333333;
      --terminal-gray-medium: #2a2a2a;
      --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
      --font-size-sm: 11px;
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 12px;
      --spacing-lg: 16px;

      position: relative;
      display: block;
      width: 100%;
    }

    .t-pnl {
      background-color: var(--terminal-black-light);
      border: 1px solid var(--terminal-green-dark);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
      min-height: 40px;
      transition: min-height 0.3s ease-out, border 0.3s ease-out;
    }

    .t-pnl__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px var(--spacing-md);
      background-color: var(--terminal-gray-dark);
      border-bottom: 1px solid var(--terminal-gray-light);
      height: 28px;
      box-sizing: border-box;
      color: var(--terminal-green);
    }

    .t-pnl__title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: normal;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--terminal-green);
      line-height: 1;
    }

    .t-pnl__actions {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-left: auto;
    }

    .t-pnl__collapse-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: color 0.2s;
      margin-right: var(--spacing-sm);
      color: var(--terminal-green);
    }

    .t-pnl__collapse-btn:hover {
      color: var(--terminal-green-bright);
    }

    .t-pnl__collapse-icon {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .t-pnl__collapse-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .t-pnl__body {
      flex: 1;
      padding: var(--spacing-md);
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 60px;
      color: var(--terminal-green);
      flex-shrink: 1;
    }

    .t-pnl--collapsed .t-pnl__body {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .t-pnl--collapsed {
      min-height: 0;
    }

    .t-pnl--collapsed .t-pnl__header {
      border-bottom: none;
    }

    .t-pnl--collapsed:not(.t-pnl--compact):not(.t-pnl--large) {
      min-height: 28px;
      max-height: 28px;
    }

    .t-pnl--collapsed.t-pnl--compact {
      min-height: 20px;
      max-height: 20px;
    }

    .t-pnl--collapsed.t-pnl--large {
      min-height: 36px;
      max-height: 36px;
    }

    .t-pnl--compact .t-pnl__header {
      padding: 3px 8px;
      height: 20px;
      box-sizing: border-box;
    }

    .t-pnl--compact .t-pnl__title {
      font-size: 10px;
    }

    .t-pnl--compact .t-pnl__body {
      padding: 8px;
      min-height: 40px;
    }

    .t-pnl--large .t-pnl__header {
      padding: 9px 12px;
      height: 36px;
      box-sizing: border-box;
    }

    .t-pnl--large .t-pnl__title {
      font-size: 14px;
    }

    .t-pnl--large .t-pnl__body {
      padding: 16px;
      min-height: 80px;
    }

    .t-pnl__footer {
      padding: 6px var(--spacing-md);
      background-color: var(--terminal-gray-dark);
      border-top: 1px solid var(--terminal-gray-light);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      height: 28px;
      box-sizing: border-box;
      position: relative;
      transition: transform 0.3s ease-out;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--terminal-gray);
      flex-shrink: 0;
      transform: translateY(0);
    }

    .t-pnl__footer--collapsed {
      transform: translateY(100%);
    }

    .t-pnl--compact .t-pnl__footer {
      padding: 3px 8px;
      height: 20px;
      gap: 4px;
    }

    .t-pnl--large .t-pnl__footer {
      padding: 9px 12px;
      height: 36px;
      gap: 12px;
    }

    .t-pnl__footer-collapse {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      margin-left: auto;
      flex-shrink: 0;
      color: var(--terminal-green);
    }

    .t-pnl__footer-collapse:hover {
      color: var(--terminal-green-bright);
    }

    .t-pnl__footer-collapse svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .t-pnl__footer-reopen {
      position: absolute;
      bottom: 100%;
      right: 8px;
      width: 32px;
      height: 16px;
      background-color: var(--terminal-gray-dark);
      border: 1px solid var(--terminal-gray-light);
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      display: flex !important;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 1;
      transition: opacity 0.2s;
      z-index: 10;
    }

    .t-pnl__footer-reopen svg {
      width: 14px;
      height: 14px;
      fill: var(--terminal-green);
    }

    .t-pnl--standard .t-pnl__title::before {
      content: '[ ';
      color: var(--terminal-green-dim);
    }

    .t-pnl--standard .t-pnl__title::after {
      content: ' ]';
      color: var(--terminal-green-dim);
    }

    .t-pnl--collapsible .t-pnl__header {
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: background-color 0.15s ease;
    }

    .t-pnl--collapsible .t-pnl__header:hover {
      background-color: var(--terminal-gray-medium);
    }

    .t-pnl--collapsible .t-pnl__header:focus {
      outline: 1px solid var(--terminal-green);
      outline-offset: -1px;
    }

    .t-pnl--loading .t-pnl__body {
      position: relative;
      pointer-events: none;
      opacity: 0.5;
    }

    .t-pnl--loading .t-pnl__body::after {
      content: 'LOADING...';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--terminal-green);
      font-size: var(--font-size-sm);
      letter-spacing: 0.1em;
      animation: pulse 1s infinite;
    }

    :host([variant="headless"]) .t-pnl__header {
      display: none !important;
    }

    :host([variant="headless"]) .t-pnl__body {
      border: none;
      background: transparent;
    }

    .t-pnl__title-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      margin-right: var(--spacing-xs);
    }

    :host([resizable]) {
      resize: both;
      overflow: auto;
      min-width: 200px;
      min-height: 100px;
    }

    :host([resizable]) .t-pnl {
      height: 100%;
    }

    :host([draggable]) .t-pnl__header {
      cursor: move;
    }

    :host([draggable][dragging]) {
      opacity: 0.8;
      z-index: 1000;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .t-pnl__body::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .t-pnl__body::-webkit-scrollbar-track {
      background: var(--terminal-black);
    }

    .t-pnl__body::-webkit-scrollbar-thumb {
      background: var(--terminal-green-dark);
      border: 1px solid var(--terminal-black);
    }

    .t-pnl__body::-webkit-scrollbar-thumb:hover {
      background: var(--terminal-green);
    }

    .t-pnl__body {
      scrollbar-width: thin;
      scrollbar-color: var(--terminal-green-dark) var(--terminal-black);
    }
  `;

  // ============================================
  // BLOCK 3: Reactive Properties
  // ============================================

  static properties = {
    /**
     * @property {string} title - Panel title displayed in header
     * @default ''
     * @attribute title
     * @reflects
     */
    title: { type: String, reflect: true },

    /**
     * @property {string} variant - Panel variant (standard | headless)
     * @default 'standard'
     * @attribute variant
     * @reflects
     * @validation enum(['standard', 'headless'])
     */
    variant: { type: String, reflect: true },

    /**
     * @property {boolean} collapsible - Enable collapse/expand functionality
     * @default false
     * @attribute collapsible
     * @reflects
     */
    collapsible: { type: Boolean, reflect: true },

    /**
     * @property {boolean} collapsed - Current collapsed state
     * @default false
     * @attribute collapsed
     * @reflects
     */
    collapsed: { type: Boolean, reflect: true },

    /**
     * @property {boolean} compact - Compact size variant (20px header)
     * @default false
     * @attribute compact
     * @reflects
     */
    compact: { type: Boolean, reflect: true },

    /**
     * @property {boolean} large - Large size variant (36px header)
     * @default false
     * @attribute large
     * @reflects
     */
    large: { type: Boolean, reflect: true },

    /**
     * @property {boolean} loading - Show loading state
     * @default false
     * @attribute loading
     * @reflects
     */
    loading: { type: Boolean, reflect: true },

    /**
     * @property {boolean} resizable - Enable panel resizing
     * @default false
     * @attribute resizable
     * @reflects
     */
    resizable: { type: Boolean, reflect: true },

    /**
     * @property {boolean} draggable - Enable panel dragging
     * @default false
     * @attribute draggable
     * @reflects
     */
    draggable: { type: Boolean, reflect: true },

    /**
     * @property {string} icon - SVG icon string to display in header
     * @default ''
     * @attribute icon
     */
    icon: { type: String },

    /**
     * @property {boolean} footerCollapsed - Footer collapsed state
     * @default false
     * @attribute footer-collapsed
     * @reflects
     */
    footerCollapsed: { type: Boolean, reflect: true, attribute: 'footer-collapsed' }
  };

  // ============================================
  // BLOCK 4: Internal State
  // ============================================

  /**
   * @private
   * @type {number}
   */
  _dragStartX = 0;

  /**
   * @private
   * @type {number}
   */
  _dragStartY = 0;

  /**
   * @private
   * @type {boolean}
   */
  _dragging = false;

  /**
   * @private
   * @type {Set<number>}
   */
  _timers = new Set();

  /**
   * @private
   * @type {number|null}
   */
  _loadingTimeout = null;

  /**
   * @private
   * @type {Array<HTMLElement>}
   */
  _nestedComponents = [];

  // ============================================
  // BLOCK 5: Logger Instance
  // ============================================

  /**
   * @private
   * @type {Object}
   */
  _logger = null;

  // ============================================
  // BLOCK 6: Constructor
  // ============================================

  constructor() {
    super();

    this._logger = componentLogger.for('TPanelLit');
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.title = '';
    this.variant = 'standard';
    this.collapsible = false;
    this.collapsed = false;
    this.compact = false;
    this.large = false;
    this.loading = false;
    this.resizable = false;
    this.draggable = false;
    this.icon = '';
    this.footerCollapsed = false;

    this._handleHeaderClick = this._handleHeaderClick.bind(this);
    this._handleHeaderKeydown = this._handleHeaderKeydown.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
  }

  // ============================================
  // BLOCK 7: Lifecycle Methods
  // ============================================

  /**
   * @lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected to DOM');

    if (this.draggable) {
      this.addEventListener('mousedown', this._handleMouseDown);
    }
  }

  /**
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');

    this._clearAllTimers();

    if (this.draggable) {
      this.removeEventListener('mousedown', this._handleMouseDown);
      document.removeEventListener('mousemove', this._handleMouseMove);
      document.removeEventListener('mouseup', this._handleMouseUp);
    }
  }

  /**
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties: Array.from(changedProperties.keys()) });

    const actionsSlot = this.shadowRoot?.querySelector('slot[name="actions"]');
    if (actionsSlot) {
      actionsSlot.addEventListener('slotchange', () => {
        this._updateActionButtonSizes();
      });
    }

    this._discoverNestedComponents();
  }

  /**
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.debug('Updated', { changedProperties: Array.from(changedProperties.keys()) });

    if (changedProperties.has('collapsed')) {
      this._updateSlotVisibility();
    }

    if (changedProperties.has('compact') || changedProperties.has('large')) {
      this._updateActionButtonSizes();
      this._propagateContextToChildren();
    }

    if (changedProperties.has('footerCollapsed')) {
      this._updateSlotVisibility();
    }

    if (changedProperties.has('loading')) {
      if (this.loading) {
        this._emitEvent('panel-loading-start', {});
        this._setLoadingTimeout();
      } else {
        this._emitEvent('panel-loading-end', {});
        this._clearLoadingTimeout();
      }
    }
  }

  // ============================================
  // BLOCK 8: Public API Methods
  // ============================================

  /**
   * Toggle panel collapse state
   *
   * @public
   * @returns {boolean} New collapsed state
   * @fires panel-collapsed
   * @example
   * const panel = document.querySelector('t-pnl');
   * const isCollapsed = panel.toggleCollapse();
   */
  toggleCollapse() {
    this._logger.debug('toggleCollapse called');

    if (!this.collapsible) {
      this._logger.warn('toggleCollapse called but panel is not collapsible');
      return this.collapsed;
    }

    this.collapsed = !this.collapsed;
    this._emitEvent('panel-collapsed', { collapsed: this.collapsed });

    return this.collapsed;
  }

  /**
   * Collapse panel
   *
   * @public
   * @fires panel-collapsed
   */
  collapse() {
    this._logger.debug('collapse called');

    if (!this.collapsible) {
      this._logger.warn('collapse called but panel is not collapsible');
      return;
    }

    if (!this.collapsed) {
      this.collapsed = true;
      this._emitEvent('panel-collapsed', { collapsed: true });
    }
  }

  /**
   * Expand panel
   *
   * @public
   * @fires panel-collapsed
   */
  expand() {
    this._logger.debug('expand called');

    if (!this.collapsed) {
      return;
    }

    this.collapsed = false;
    this._emitEvent('panel-collapsed', { collapsed: false });
  }

  /**
   * Toggle footer collapse state
   *
   * @public
   * @returns {boolean} New footer collapsed state
   * @fires panel-footer-collapsed
   */
  toggleFooterCollapse() {
    this._logger.debug('toggleFooterCollapse called');

    this.footerCollapsed = !this.footerCollapsed;
    this._emitEvent('panel-footer-collapsed', { footerCollapsed: this.footerCollapsed });

    return this.footerCollapsed;
  }

  /**
   * Show loading state
   *
   * @public
   * @fires panel-loading-start
   */
  startLoading() {
    this._logger.debug('startLoading called');
    this.loading = true;
  }

  /**
   * Hide loading state
   *
   * @public
   * @fires panel-loading-end
   */
  stopLoading() {
    this._logger.debug('stopLoading called');
    this.loading = false;
  }

  /**
   * Receive context from parent component (nesting support)
   *
   * @public
   * @param {Object} context - Context object from parent
   * @param {string} context.size - Parent size (compact, large, default)
   * @param {string} context.theme - Parent theme variant
   */
  receiveContext(context) {
    this._logger.debug('Received context from parent', { context });

    if (context.size) {
      if (context.size === 'compact' && !this.compact) {
        this.compact = true;
      } else if (context.size === 'large' && !this.large) {
        this.large = true;
      }
    }
  }

  // ============================================
  // BLOCK 9: Event Emitters
  // ============================================

  /**
   * Emit custom event
   *
   * @event
   * @private
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail payload
   * @property {*} detail - Event-specific data
   * @bubbles
   * @composed
   */
  _emitEvent(eventName, detail) {
    this._logger.debug('Emitting event', { eventName, detail });

    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  // ============================================
  // BLOCK 10: Nesting Support
  // ============================================

  /**
   * Discover nested components in default slot
   *
   * @private
   */
  _discoverNestedComponents() {
    const defaultSlot = this.shadowRoot?.querySelector('slot:not([name])');
    if (!defaultSlot) return;

    const assignedElements = defaultSlot.assignedElements();
    this._nestedComponents = assignedElements.filter(el =>
      el.tagName && el.tagName.startsWith('T-')
    );

    this._logger.debug('Discovered nested components', {
      count: this._nestedComponents.length,
      tags: this._nestedComponents.map(c => c.tagName)
    });

    this._propagateContextToChildren();
  }

  /**
   * Propagate context to nested child components
   *
   * @private
   */
  _propagateContextToChildren() {
    const context = {
      size: this.compact ? 'compact' : this.large ? 'large' : 'default',
      variant: this.variant
    };

    this._nestedComponents.forEach(child => {
      if (typeof child.receiveContext === 'function') {
        child.receiveContext(context);
        this._logger.debug('Propagated context to child', { tag: child.tagName, context });
      }
    });
  }

  // ============================================
  // BLOCK 11: Validation
  // ============================================

  /**
   * Validate property value
   *
   * @private
   * @param {string} propName - Property name
   * @param {*} value - Property value
   * @returns {{valid: boolean, errors: string[]}}
   */
  _validateProperty(propName, value) {
    const validation = TPanelLit.getPropertyValidation(propName);
    if (!validation) {
      return { valid: true, errors: [] };
    }

    const result = validation.validate(value);
    if (!result.valid) {
      this._logger.warn('Property validation failed', {
        propName,
        value,
        errors: result.errors
      });
    }

    return result;
  }

  /**
   * Get validation rules for property
   *
   * @static
   * @param {string} propName - Property name
   * @returns {Object|null} Validation configuration
   */
  static getPropertyValidation(propName) {
    const validations = {
      variant: {
        validate: (value) => {
          const allowed = ['standard', 'headless'];
          const valid = allowed.includes(value);
          return {
            valid,
            errors: valid ? [] : [`variant must be one of: ${allowed.join(', ')}`]
          };
        }
      }
    };

    return validations[propName] || null;
  }

  /**
   * Validate slot content
   *
   * @private
   * @param {string} slotName - Slot name
   * @param {Array<HTMLElement>} elements - Assigned elements
   * @returns {{valid: boolean, errors: string[]}}
   */
  _validateSlotContent(slotName, elements) {
    const validation = TPanelLit.getSlotValidation(slotName);
    if (!validation) {
      return { valid: true, errors: [] };
    }

    const errors = [];

    if (validation.maxElements && elements.length > validation.maxElements) {
      errors.push(`${slotName} slot accepts max ${validation.maxElements} elements, got ${elements.length}`);
    }

    if (validation.accepts && !validation.accepts.includes('*')) {
      elements.forEach((el, i) => {
        const tagName = el.tagName.toLowerCase();
        if (!validation.accepts.includes(tagName)) {
          errors.push(`${slotName} slot only accepts ${validation.accepts.join(', ')}, found ${tagName} at index ${i}`);
        }
      });
    }

    if (errors.length > 0) {
      this._logger.warn('Invalid slot content', { slotName, errors });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get validation rules for slot
   *
   * @static
   * @param {string} slotName - Slot name
   * @returns {Object|null} Validation configuration
   */
  static getSlotValidation(slotName) {
    const validations = {
      actions: {
        accepts: ['t-btn'],
        maxElements: 10
      },
      footer: {
        accepts: ['*']
      },
      default: {
        accepts: ['*']
      }
    };

    return validations[slotName] || null;
  }

  // ============================================
  // BLOCK 12: Render Method
  // ============================================

  /**
   * Render component template
   *
   * @returns {TemplateResult}
   * @slot default - Main panel content (can nest panels)
   * @slot actions - Action buttons (auto-sized, max 10)
   * @slot footer - Footer content (collapsible independently)
   */
  render() {
    this._logger.debug('Rendering');

    const panelClasses = this._getPanelClasses();

    return html`
      <div class=${panelClasses}>
        ${this._renderHeader()}
        ${this._renderBody()}
        ${this._renderFooter()}
      </div>
    `;
  }

  // ============================================
  // BLOCK 13: Private Helpers
  // ============================================

  /**
   * Get CSS classes for panel container
   *
   * @private
   * @returns {string}
   */
  _getPanelClasses() {
    const classes = ['t-pnl'];

    if (this.variant) {
      classes.push(`t-pnl--${this.variant}`);
    }

    if (this.collapsible) {
      classes.push('t-pnl--collapsible');
    }

    if (this.collapsed) {
      classes.push('t-pnl--collapsed');
    }

    if (this.compact) {
      classes.push('t-pnl--compact');
    } else if (this.large) {
      classes.push('t-pnl--large');
    }

    if (this.loading) {
      classes.push('t-pnl--loading');
    }

    return classes.join(' ');
  }

  /**
   * Render panel header
   *
   * @private
   * @returns {TemplateResult|string}
   */
  _renderHeader() {
    if (this.variant === 'headless') {
      return '';
    }

    return html`
      <div
        class="t-pnl__header"
        @click=${this._handleHeaderClick}
        @keydown=${this._handleHeaderKeydown}
        tabindex=${this.collapsible ? '0' : '-1'}
      >
        ${this.collapsible ? this._renderCollapseButton() : ''}
        <div class="t-pnl__title">
          ${this.icon ? html`<span class="t-pnl__title-icon" .innerHTML=${this.icon}></span>` : ''}
          ${this.title}
        </div>
        <div class="t-pnl__actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Render collapse button
   *
   * @private
   * @returns {TemplateResult}
   */
  _renderCollapseButton() {
    const icon = this.collapsed ? caretRightIcon : caretDownIcon;
    return html`
      <button
        class="t-pnl__collapse-btn"
        @click=${this._handleCollapseClick}
        tabindex="-1"
        aria-label=${this.collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <span class="t-pnl__collapse-icon" .innerHTML=${icon}></span>
      </button>
    `;
  }

  /**
   * Render panel body
   *
   * @private
   * @returns {TemplateResult|string}
   */
  _renderBody() {
    if (this.collapsed) {
      return '';
    }

    const bodyClasses = ['t-pnl__body'];
    if (this.variant === 'headless') {
      bodyClasses.push('t-pnl__body--headless');
    }

    return html`
      <div class=${bodyClasses.join(' ')}>
        <slot></slot>
      </div>
    `;
  }

  /**
   * Render panel footer
   *
   * @private
   * @returns {TemplateResult|string}
   */
  _renderFooter() {
    if (this.collapsed) {
      return '';
    }

    const footerClasses = ['t-pnl__footer'];
    if (this.footerCollapsed) {
      footerClasses.push('t-pnl__footer--collapsed');
    }

    return html`
      <div class="${footerClasses.join(' ')}" style="display: none;">
        <slot name="footer"></slot>
        ${!this.footerCollapsed ? this._renderFooterCollapseBtn() : ''}
        ${this.footerCollapsed ? this._renderFooterReopenTab() : ''}
      </div>
    `;
  }

  /**
   * Render footer collapse button
   *
   * @private
   * @returns {TemplateResult}
   */
  _renderFooterCollapseBtn() {
    return html`
      <button
        class="t-pnl__footer-collapse"
        @click=${this._handleFooterCollapseClick}
        aria-label="Collapse footer"
      >
        <span .innerHTML=${caretDownIcon}></span>
      </button>
    `;
  }

  /**
   * Render footer reopen tab
   *
   * @private
   * @returns {TemplateResult}
   */
  _renderFooterReopenTab() {
    return html`
      <button
        class="t-pnl__footer-reopen"
        @click=${this._handleFooterReopenClick}
        aria-label="Expand footer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
      </button>
    `;
  }

  /**
   * Handle header click
   *
   * @private
   * @param {MouseEvent} e
   */
  _handleHeaderClick(e) {
    if (!this.collapsible) {
      return;
    }

    const path = e.composedPath();
    const clickedActions = path.some(el => el.classList && el.classList.contains('t-pnl__actions'));
    const clickedCollapseBtn = path.some(el => el.classList && el.classList.contains('t-pnl__collapse-btn'));

    if (clickedActions || clickedCollapseBtn) {
      return;
    }

    this.toggleCollapse();
  }

  /**
   * Handle header keydown
   *
   * @private
   * @param {KeyboardEvent} e
   */
  _handleHeaderKeydown(e) {
    if (!this.collapsible) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleCollapse();
    }
  }

  /**
   * Handle collapse button click
   *
   * @private
   * @param {MouseEvent} e
   */
  _handleCollapseClick(e) {
    e.stopPropagation();
    this.toggleCollapse();
  }

  /**
   * Handle footer collapse button click
   *
   * @private
   * @param {MouseEvent} e
   */
  _handleFooterCollapseClick(e) {
    e.stopPropagation();
    this.footerCollapsed = true;
    this._emitEvent('panel-footer-collapsed', { footerCollapsed: true });
  }

  /**
   * Handle footer reopen tab click
   *
   * @private
   * @param {MouseEvent} e
   */
  _handleFooterReopenClick(e) {
    e.stopPropagation();
    this.footerCollapsed = false;
    this._emitEvent('panel-footer-collapsed', { footerCollapsed: false });
  }

  /**
   * Handle mouse down for drag
   *
   * @private
   * @param {MouseEvent} e
   */
  _handleMouseDown(e) {
    if (!this.draggable || !e.target.closest('.t-pnl__header')) {
      return;
    }

    this._dragging = true;
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;

    this.style.position = 'fixed';
    this.style.zIndex = '1000';
    this.toggleAttribute('dragging', true);

    document.addEventListener('mousemove', this._handleMouseMove);
    document.addEventListener('mouseup', this._handleMouseUp);

    e.preventDefault();

    this._logger.debug('Drag started', { x: this._dragStartX, y: this._dragStartY });
  }

  /**
   * Handle mouse move during drag
   *
   * @private
   * @param {MouseEvent} e
   */
  _handleMouseMove(e) {
    if (!this._dragging) return;

    const deltaX = e.clientX - this._dragStartX;
    const deltaY = e.clientY - this._dragStartY;

    const rect = this.getBoundingClientRect();
    this.style.left = `${rect.left + deltaX}px`;
    this.style.top = `${rect.top + deltaY}px`;

    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
  }

  /**
   * Handle mouse up to end drag
   *
   * @private
   */
  _handleMouseUp() {
    this._dragging = false;
    this.toggleAttribute('dragging', false);

    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);

    this._logger.debug('Drag ended', { left: this.style.left, top: this.style.top });
  }

  /**
   * Update slot visibility based on content
   *
   * @private
   */
  _updateSlotVisibility() {
    const footerSlot = this.shadowRoot?.querySelector('slot[name="footer"]');
    const footerContainer = this.shadowRoot?.querySelector('.t-pnl__footer');

    if (footerSlot && footerContainer) {
      const hasFooterContent = footerSlot.assignedElements().length > 0;
      footerContainer.style.display = hasFooterContent ? 'flex' : 'none';

      this._logger.debug('Updated footer visibility', { hasContent: hasFooterContent });
    }
  }

  /**
   * Update action button sizes based on panel variant
   *
   * @private
   */
  async _updateActionButtonSizes() {
    await customElements.whenDefined('t-btn');

    const actionsSlot = this.shadowRoot?.querySelector('slot[name="actions"]');
    if (!actionsSlot) return;

    const allElements = actionsSlot.assignedElements();
    let buttons = [];

    allElements.forEach(el => {
      if (el.tagName === 'T-BTN') {
        buttons.push(el);
      } else {
        const nestedButtons = el.querySelectorAll('t-btn');
        buttons.push(...nestedButtons);
      }
    });

    if (buttons.length === 0) return;

    this._validateSlotContent('actions', buttons);

    let buttonSize = 'small';
    if (this.compact) {
      buttonSize = 'xs';
    } else if (this.large) {
      buttonSize = '';
    }

    buttons.forEach(btn => {
      if (buttonSize === '') {
        btn.removeAttribute('size');
      } else {
        btn.setAttribute('size', buttonSize);
      }
    });

    this._logger.debug('Updated action button sizes', {
      count: buttons.length,
      size: buttonSize || 'default',
      compact: this.compact,
      large: this.large
    });
  }

  /**
   * Set loading timeout to auto-dismiss after 30 seconds
   *
   * @private
   */
  _setLoadingTimeout() {
    this._clearLoadingTimeout();

    this._loadingTimeout = this._setTimeout(() => {
      this._logger.warn('Loading timeout reached (30s), auto-stopping');
      this.stopLoading();
    }, 30000);
  }

  /**
   * Clear loading timeout
   *
   * @private
   */
  _clearLoadingTimeout() {
    if (this._loadingTimeout !== null) {
      this._clearTimeout(this._loadingTimeout);
      this._loadingTimeout = null;
    }
  }

  /**
   * Managed setTimeout (tracked for cleanup)
   *
   * @private
   * @param {Function} callback
   * @param {number} delay
   * @returns {number} Timer ID
   */
  _setTimeout(callback, delay) {
    const id = setTimeout(() => {
      this._timers.delete(id);
      callback();
    }, delay);

    this._timers.add(id);
    return id;
  }

  /**
   * Managed clearTimeout
   *
   * @private
   * @param {number} id - Timer ID
   */
  _clearTimeout(id) {
    clearTimeout(id);
    this._timers.delete(id);
  }

  /**
   * Clear all timers
   *
   * @private
   */
  _clearAllTimers() {
    this._timers.forEach(id => clearTimeout(id));
    this._timers.clear();
    this._logger.debug('Cleared all timers', { count: this._timers.size });
  }
}

// ============================================
// SECTION 3: Custom Element Registration
// ============================================
if (!customElements.get('t-pnl')) {
  customElements.define('t-pnl', TPanelLit);
}

// ============================================
// SECTION 4: Export
// ============================================
export default TPanelLit;

/**
 * Component Manifest - Auto-generated + Manual Annotations
 */
export const TPanelManifest = generateManifest(TPanelLit, {
  tagName: 't-pnl',
  displayName: 'Terminal Panel',
  description: 'Collapsible panel with header, footer, and nested content support',
  version: '1.0.0',

  properties: {
    title: { description: 'Panel title displayed in header' },
    variant: {
      enum: ['standard', 'headless'],
      description: 'Panel variant: standard (with header) or headless (no header)'
    },
    collapsible: { description: 'Enable collapse/expand functionality' },
    collapsed: { description: 'Current collapsed state' },
    compact: { description: 'Compact size variant (20px header)' },
    large: { description: 'Large size variant (36px header)' },
    loading: { description: 'Show loading state' },
    resizable: { description: 'Enable panel resizing' },
    draggable: { description: 'Enable panel dragging' },
    icon: { description: 'SVG icon string to display in header' },
    footerCollapsed: { description: 'Footer collapsed state' }
  },

  methods: {
    toggleCollapse: {
      description: 'Toggle panel collapse state',
      parameters: [],
      returns: { type: 'boolean', description: 'New collapsed state' }
    },
    collapse: {
      description: 'Collapse panel',
      parameters: [],
      returns: { type: 'void' }
    },
    expand: {
      description: 'Expand panel',
      parameters: [],
      returns: { type: 'void' }
    },
    toggleFooterCollapse: {
      description: 'Toggle footer collapse state',
      parameters: [],
      returns: { type: 'boolean', description: 'New footer collapsed state' }
    },
    startLoading: {
      description: 'Show loading state',
      parameters: [],
      returns: { type: 'void' }
    },
    stopLoading: {
      description: 'Hide loading state',
      parameters: [],
      returns: { type: 'void' }
    },
    receiveContext: {
      description: 'Receive context from parent component',
      parameters: [
        { name: 'context', type: 'Object', description: 'Context from parent' }
      ],
      returns: { type: 'void' }
    }
  },

  events: {
    'panel-collapsed': {
      description: 'Fired when panel collapse state changes',
      detail: { collapsed: 'boolean' },
      bubbles: true,
      composed: true
    },
    'panel-footer-collapsed': {
      description: 'Fired when footer collapse state changes',
      detail: { footerCollapsed: 'boolean' },
      bubbles: true,
      composed: true
    },
    'panel-loading-start': {
      description: 'Fired when loading state starts',
      detail: {},
      bubbles: true,
      composed: true
    },
    'panel-loading-end': {
      description: 'Fired when loading state ends',
      detail: {},
      bubbles: true,
      composed: true
    }
  },

  slots: {
    default: {
      description: 'Main panel content - supports nesting other panels',
      multiple: true,
      accepts: ['*']
    },
    actions: {
      description: 'Action buttons (auto-sized, max 10)',
      multiple: true,
      accepts: ['t-btn']
    },
    footer: {
      description: 'Footer content (collapsible independently)',
      multiple: true,
      accepts: ['*']
    }
  }
});

if (typeof window !== 'undefined' && window.__TERMINAL_KIT_REGISTRY__) {
  window.__TERMINAL_KIT_REGISTRY__.register(TPanelManifest);
}