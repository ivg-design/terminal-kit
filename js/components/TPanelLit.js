// ============================================
// SECTION 1: IMPORTS
// ============================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { caretRightIcon, caretDownIcon } from '../utils/phosphor-icons.js';
import { generateManifest } from '../utils/manifest-generator.js';
import { debounce } from '../utils/debounce.js';

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
  static LOADING_TIMEOUT_MS = 30000;  // 30 seconds auto-timeout for loading state

  // ============================================
  // BLOCK 2: Static Styles
  // ============================================
  static styles = css`
    :host {
      /* CSS Variables with fallbacks - allows global theming while preventing FOUC */
      --terminal-black: var(--tk-black, #0a0a0a);
      --terminal-black-light: var(--tk-black-light, #1a1a1a);
      --terminal-green: var(--tk-green, #00ff41);
      --terminal-green-bright: var(--tk-green-bright, #33ff66);
      --terminal-green-dim: var(--tk-green-dim, #00cc33);
      --terminal-green-dark: var(--tk-green-dark, #008820);
      --terminal-gray: var(--tk-gray, #808080);
      --terminal-gray-dark: var(--tk-gray-dark, #242424);
      --terminal-gray-light: var(--tk-gray-light, #333333);
      --terminal-gray-medium: var(--tk-gray-medium, #2a2a2a);
      --font-mono: var(--tk-font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace);
      --font-size-sm: var(--tk-font-size-sm, 11px);
      --spacing-xs: var(--tk-spacing-xs, 4px);
      --spacing-sm: var(--tk-spacing-sm, 8px);
      --spacing-md: var(--tk-spacing-md, 12px);
      --spacing-lg: var(--tk-spacing-lg, 16px);

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

    /* Size Toggle */
    .t-pnl__size-toggle {
      display: flex;
      gap: 0;
      border: 1px solid var(--terminal-green-dark);
      border-radius: 2px;
      margin-right: 8px;
    }

    .t-pnl__size-btn {
      background: transparent;
      color: var(--terminal-green);
      border: none;
      padding: 2px 6px;
      font-size: 9px;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      cursor: pointer;
      position: relative;
      transition: background 0.15s, color 0.15s;
    }

    .t-pnl__size-btn:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: var(--terminal-green-dark);
    }

    .t-pnl__size-btn:hover {
      background: rgba(0, 255, 65, 0.1);
    }

    .t-pnl__size-btn.active {
      background: var(--terminal-green);
      color: var(--terminal-black);
    }

    .t-pnl--compact .t-pnl__size-btn {
      padding: 1px 4px;
      font-size: 8px;
    }

    .t-pnl--large .t-pnl__size-btn {
      padding: 3px 8px;
      font-size: 10px;
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
    footerCollapsed: { type: Boolean, reflect: true, attribute: 'footer-collapsed' },

    /**
     * @property {boolean} showSizeToggle - Show size toggle in header
     * @default false
     * @attribute show-size-toggle
     * @reflects
     */
    showSizeToggle: { type: Boolean, reflect: true, attribute: 'show-size-toggle' }
  };

  // ============================================
  // BLOCK 4: Internal State
  // ============================================

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

    if (this.title === undefined) this.title = '';
    if (this.variant === undefined) this.variant = 'standard';
    if (this.collapsible === undefined) this.collapsible = false;
    if (this.collapsed === undefined) this.collapsed = false;
    if (this.compact === undefined) this.compact = false;
    if (this.large === undefined) this.large = false;
    if (this.loading === undefined) this.loading = false;
    if (this.icon === undefined) this.icon = '';
    if (this.footerCollapsed === undefined) this.footerCollapsed = false;
    if (this.showSizeToggle === undefined) this.showSizeToggle = false;

    this._handleHeaderClick = this._handleHeaderClick.bind(this);
    this._handleSizeChange = this._handleSizeChange.bind(this);
    this._handleHeaderKeydown = this._handleHeaderKeydown.bind(this);
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
  }

  /**
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');

    this._clearAllTimers();
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
      // Debounce to handle rapid slot changes (e.g., dynamic content updates)
      actionsSlot.addEventListener('slotchange', debounce(() => {
        this._updateActionButtonSizes();
      }, 50));
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
   * @param {string} context.variant - Parent variant
   */
  receiveContext(context) {
    if (!context || typeof context !== 'object') {
      this._logger.warn('Invalid context received', { context });
      return;
    }

    this._logger.debug('Received context from parent', { context });

    const validSizes = ['compact', 'large', 'default'];
    if (context.size && validSizes.includes(context.size)) {
      if (context.size === 'compact' && !this.compact) {
        this.compact = true;
      } else if (context.size === 'large' && !this.large) {
        this.large = true;
      }
    } else if (context.size) {
      this._logger.warn('Invalid context size', { size: context.size, valid: validSizes });
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
    const headerId = `panel-header-${this.id || Math.random().toString(36).substr(2, 9)}`;
    const bodyId = `panel-body-${this.id || Math.random().toString(36).substr(2, 9)}`;

    return html`
      <div class=${panelClasses}
           role="region"
           aria-labelledby=${this.variant !== 'headless' ? headerId : null}>
        ${this._renderHeader(headerId, bodyId)}
        ${this._renderBody(bodyId)}
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
   * @param {string} headerId - Unique ID for header
   * @param {string} bodyId - Unique ID for body (for aria-controls)
   * @returns {TemplateResult|string}
   */
  _renderHeader(headerId, bodyId) {
    if (this.variant === 'headless') {
      return '';
    }

    return html`
      <div
        id=${headerId}
        class="t-pnl__header"
        @click=${this._handleHeaderClick}
        @keydown=${this._handleHeaderKeydown}
        tabindex=${this.collapsible ? '0' : '-1'}
        role=${this.collapsible ? 'button' : null}
        aria-expanded=${this.collapsible ? String(!this.collapsed) : null}
        aria-controls=${this.collapsible ? bodyId : null}
      >
        ${this.collapsible ? this._renderCollapseButton(bodyId) : ''}
        <div class="t-pnl__title">
          ${this.icon ? html`<span class="t-pnl__title-icon" .innerHTML=${this.icon}></span>` : ''}
          ${this.title}
        </div>
        ${this.showSizeToggle ? this._renderSizeToggle() : ''}
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
   * @param {string} bodyId - ID of body element for aria-controls
   * @returns {TemplateResult}
   */
  _renderCollapseButton(bodyId) {
    const icon = this.collapsed ? caretRightIcon : caretDownIcon;
    return html`
      <button
        class="t-pnl__collapse-btn"
        @click=${this._handleCollapseClick}
        tabindex="-1"
        aria-label=${this.collapsed ? 'Expand panel' : 'Collapse panel'}
        aria-controls=${bodyId}
        aria-expanded=${String(!this.collapsed)}
      >
        <span class="t-pnl__collapse-icon" .innerHTML=${icon}></span>
      </button>
    `;
  }

  /**
   * Render size toggle
   *
   * @private
   * @returns {TemplateResult}
   */
  _renderSizeToggle() {
    const currentSize = this.large ? 'large' : this.compact ? 'compact' : 'standard';

    return html`
      <div class="t-pnl__size-toggle" @click=${(e) => e.stopPropagation()}>
        <button
          class="t-pnl__size-btn ${currentSize === 'large' ? 'active' : ''}"
          @click=${() => this._handleSizeChange('large')}
          title="Large size"
        >L</button>
        <button
          class="t-pnl__size-btn ${currentSize === 'standard' ? 'active' : ''}"
          @click=${() => this._handleSizeChange('standard')}
          title="Standard size"
        >M</button>
        <button
          class="t-pnl__size-btn ${currentSize === 'compact' ? 'active' : ''}"
          @click=${() => this._handleSizeChange('compact')}
          title="Compact size"
        >S</button>
      </div>
    `;
  }

  /**
   * Handle size change from toggle
   *
   * @private
   * @param {string} size - New size (large, standard, compact)
   */
  _handleSizeChange(size) {
    this._logger.debug('Size change requested', { size });

    // Update panel size
    this.large = size === 'large';
    this.compact = size === 'compact';

    // Emit event for parent components to react
    this._emitEvent('panel-size-changed', { size });
  }

  /**
   * Render panel body
   *
   * @private
   * @param {string} bodyId - Unique ID for body element
   * @returns {TemplateResult|string}
   */
  _renderBody(bodyId) {
    if (this.collapsed) {
      return '';
    }

    const bodyClasses = ['t-pnl__body'];
    if (this.variant === 'headless') {
      bodyClasses.push('t-pnl__body--headless');
    }

    return html`
      <div id=${bodyId} class=${bodyClasses.join(' ')}>
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

    // Wait for all nested buttons to be upgraded and ready
    await Promise.all(
      buttons.map(btn => btn.updateComplete || Promise.resolve())
    );

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
      this._logger.warn(`Loading timeout reached (${TPanelLit.LOADING_TIMEOUT_MS}ms), auto-stopping`);
      this.stopLoading();
    }, TPanelLit.LOADING_TIMEOUT_MS);
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
    icon: { description: 'SVG icon string to display in header' },
    footerCollapsed: { description: 'Footer collapsed state' },
    showSizeToggle: { description: 'Show size toggle (L/M/S) in header' }
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
    },
    'panel-size-changed': {
      description: 'Fired when size toggle is clicked',
      detail: { size: 'string' },
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