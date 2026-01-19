// ============================================
// SECTION 1: IMPORTS
// ============================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';

// ============================================
// SECTION 2: COMPONENT CLASS
// ============================================

/**
 * Terminal Modal Component - Full Schema Implementation
 *
 * @component
 * @tagname t-mdl
 * @description Modal dialog with multiple layout modes and customizable size. Supports Escape key and backdrop closing. Follows FULL profile with all 13 blocks.
 * @category Layout
 * @since 1.0.0
 * @example
 * <t-mdl visible layout="single" size="medium" title="Settings">
 *   <t-pnl slot="default">Main Content</t-pnl>
 * </t-mdl>
 */
export class TModalLit extends LitElement {

  // ============================================
  // BLOCK 1: Static Metadata
  // ============================================
  static tagName = 't-mdl';
  static version = '1.0.0';
  static category = 'Layout';

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
      --font-mono: var(--tk-font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace);
      --font-size-lg: var(--tk-font-size-lg, 14px);
      --spacing-xs: var(--tk-spacing-xs, 4px);
      --spacing-sm: var(--tk-spacing-sm, 8px);
      --spacing-md: var(--tk-spacing-md, 12px);
      --spacing-lg: var(--tk-spacing-lg, 16px);
      --spacing-xl: var(--tk-spacing-xl, 24px);
      --spacing-2xl: var(--tk-spacing-2xl, 32px);

      --panel-spacing: var(--spacing-md);
      --panel-border: 1px solid var(--terminal-gray-light);
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      transition: backdrop-filter 0.3s ease;
    }

    .modal-backdrop.open {
      display: flex;
    }

    /* Base Modal */
    .modal {
      background-color: var(--terminal-black);
      border: 1px solid var(--terminal-green);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.9);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1001;
      min-height: 400px;
      outline: none;
    }

    .modal:focus {
      box-shadow: 0 0 0 2px var(--terminal-green);
    }

    .modal-backdrop.open .modal {
      animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-backdrop.closing .modal {
      animation: modalSlideOut 0.25s cubic-bezier(0.7, 0, 0.84, 0);
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes modalSlideOut {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(-10px) scale(0.98);
      }
    }

    /* Modal Header */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-lg);
      background-color: var(--terminal-gray-dark);
      border-bottom: 1px solid var(--terminal-gray-light);
      position: relative;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--terminal-green);
      font-family: var(--font-mono);
    }

    .modal-title::before {
      content: '// ';
      color: var(--terminal-green-dim);
    }

    .modal-close {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: 1px solid var(--terminal-gray-light);
      color: var(--terminal-green);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-mono);
      font-size: 24px;
      line-height: 1;
      padding: 0;
    }

    .modal-close:hover {
      background-color: #ff3333;
      border-color: #ff3333;
      color: var(--terminal-black);
    }

    /* Modal Body */
    .modal-body {
      flex: 1;
      padding: 0;
      overflow-y: auto;
      overflow-x: hidden;
      color: var(--terminal-green);
      display: flex;
    }

    /* Modal Sizes - full names */
    :host([size="small"]) .modal,
    :host([size="sm"]) .modal {
      width: 400px;
    }

    :host([size="medium"]) .modal,
    :host([size="md"]) .modal {
      width: 600px;
    }

    :host([size="large"]) .modal,
    :host([size="lg"]) .modal {
      width: 800px;
    }

    :host([size="xlarge"]) .modal,
    :host([size="xl"]) .modal {
      width: 1200px;
    }

    :host([size="full"]) .modal {
      width: calc(100vw - var(--spacing-2xl));
      height: calc(100vh - var(--spacing-2xl));
    }

    /* Layout Systems */
    .modal-layout {
      display: flex;
      width: 100%;
      gap: var(--panel-spacing);
      padding: var(--spacing-lg);
    }

    /* Single Layout */
    .layout-single {
      flex-direction: column;
    }

    .layout-single .modal-panel {
      flex: 1;
    }

    /* 2-Column Layout */
    .layout-2-column {
      flex-direction: row;
    }

    .layout-2-column .panel-left,
    .layout-2-column .panel-right {
      flex: 1;
    }

    /* 2x2 Grid Layout */
    .layout-2x2 {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      grid-template-rows: repeat(2, 1fr) !important;
      gap: var(--spacing-lg) !important;
      padding: var(--spacing-lg) !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    .layout-2x2 .modal-panel {
      width: 100%;
      height: 100%;
      margin: 0 !important;
      box-sizing: border-box;
    }

    /* 1-2-1 Layout */
    .layout-1-2-1 {
      flex-direction: column;
    }

    .layout-1-2-1 .panel-top,
    .layout-1-2-1 .panel-bottom {
      flex: 0 0 auto;
      height: 120px;
    }

    .layout-1-2-1 .modal-row {
      display: flex;
      flex: 1;
      gap: var(--panel-spacing);
    }

    .layout-1-2-1 .panel-middle-left,
    .layout-1-2-1 .panel-middle-right {
      flex: 1;
    }

    /* 2-1 Layout */
    .layout-2-1 {
      flex-direction: column;
    }

    .layout-2-1 .modal-row {
      display: flex;
      flex: 1;
      gap: var(--panel-spacing);
    }

    .layout-2-1 .panel-top-left,
    .layout-2-1 .panel-top-right {
      flex: 1;
    }

    .layout-2-1 .panel-bottom {
      flex: 0 0 auto;
      height: 150px;
    }

    /* Panel Styling */
    .modal-panel {
      background-color: var(--terminal-gray-dark);
      border: var(--panel-border);
      border-radius: 4px;
      padding: var(--spacing-md);
      overflow: auto;
      position: relative;
      min-height: 100px;
    }

    .modal-panel:empty::before {
      content: 'Panel content...';
      color: var(--terminal-green-dim);
      font-style: italic;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
    }

    /* Loading State */
    :host([loading]) .modal::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    :host([loading]) .modal::before {
      content: '';
      width: 40px;
      height: 40px;
      border: 3px solid var(--terminal-gray-light);
      border-top-color: var(--terminal-green);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-backdrop {
        padding: var(--spacing-md);
      }

      .modal {
        width: 100% !important;
        max-width: 100%;
      }

      .modal-layout {
        flex-direction: column;
        padding: var(--spacing-md);
      }

      .layout-2x2 {
        display: grid !important;
        grid-template-columns: 1fr !important;
        grid-template-rows: auto !important;
      }

      .layout-2-column,
      .layout-1-2-1 .modal-row,
      .layout-2-1 .modal-row {
        flex-direction: column;
      }

      .layout-1-2-1 .panel-top,
      .layout-1-2-1 .panel-bottom,
      .layout-2-1 .panel-bottom {
        height: auto;
        min-height: 80px;
      }
    }
  `;

  // ============================================
  // BLOCK 3: Reactive Properties
  // ============================================

  /**
   * @property {boolean} visible - Modal visibility state
   * @default false
   * @attribute visible
   * @reflects true
   */
  static properties = {
    visible: { type: Boolean, reflect: true },

    /**
     * @property {string} layout - Modal layout mode
     * @default 'single'
     * @attribute layout
     * @reflects true
     * @validation Must be one of: single, 2-column, 2x2, 1-2-1, 2-1
     */
    layout: { type: String, reflect: true },

    /**
     * @property {string} size - Modal size
     * @default 'medium'
     * @attribute size
     * @reflects true
     * @validation Must be one of: small, medium, large, xlarge, full
     */
    size: { type: String, reflect: true },

    /**
     * @property {string} title - Modal title displayed in header
     * @default ''
     * @attribute title
     * @reflects true
     */
    title: { type: String, reflect: true },

    /**
     * @property {boolean} escapeClose - Enable closing modal with Escape key
     * @default true
     * @attribute escape-close
     * @reflects true
     */
    escapeClose: { type: Boolean, reflect: true, attribute: 'escape-close' },

    /**
     * @property {boolean} backdropClose - Enable closing modal by clicking backdrop
     * @default true
     * @attribute backdrop-close
     * @reflects true
     */
    backdropClose: { type: Boolean, reflect: true, attribute: 'backdrop-close' },

    /**
     * @property {boolean} loading - Loading state
     * @default false
     * @attribute loading
     * @reflects true
     */
    loading: { type: Boolean, reflect: true }
  };

  // ============================================
  // BLOCK 4: Internal State
  // ============================================

  /** @private */
  _documentListeners = new Map();

  /** @private */
  _originalBodyOverflow = '';

  /** @private */
  _nestedComponents = new Set();

  /** @private */
  _context = null;

  // ============================================
  // BLOCK 5: Logger Instance
  // ============================================

  /** @private */
  _logger = null;

  // ============================================
  // BLOCK 6: Constructor
  // ============================================

  constructor() {
    super();

    // Initialize logger
    this._logger = componentLogger.for(TModalLit.tagName);
    this._logger.debug('Component constructed');

    // Initialize properties
    this.visible = false;
    this.layout = 'single';
    this.size = 'medium';
    this.title = '';
    this.escapeClose = true;
    this.backdropClose = true;
    this.loading = false;

    // Bind event handlers
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleBackdropClick = this._handleBackdropClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  // ============================================
  // BLOCK 7: Lifecycle Methods
  // ============================================

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

    // Restore body scroll
    if (this._originalBodyOverflow !== undefined) {
      document.body.style.overflow = this._originalBodyOverflow;
    }

    // Remove all document listeners
    this._documentListeners.forEach((listeners, event) => {
      listeners.forEach(({ handler }) => {
        document.removeEventListener(event, handler);
      });
    });
    this._documentListeners.clear();

    // Clear nested component registry
    this._nestedComponents.clear();

    this._logger.debug('All resources cleaned up');
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    // Discover nested components
    this._discoverNestedComponents();
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

    // Handle visibility changes
    if (changedProperties.has('visible')) {
      if (this.visible) {
        this._setupEventListeners();
        this._lockBodyScroll();
        this._focusModal();
      } else {
        this._removeEventListeners();
        this._unlockBodyScroll();
      }
    }

    // Validate changed properties
    this._handlePropertyChanges(changedProperties);
  }

  // ============================================
  // BLOCK 8: Public API Methods
  // ============================================

  /**
   * Show the modal
   * @public
   * @fires TModalLit#modal-show
   * @example
   * modal.show();
   */
  show() {
    this._logger.debug('show() called');
    this.visible = true;
    this._emitEvent('modal-show', {});
  }

  /**
   * Hide the modal
   * @public
   * @fires TModalLit#modal-hide
   * @example
   * modal.hide();
   */
  hide() {
    this._logger.debug('hide() called');
    this.visible = false;
    this._emitEvent('modal-hide', {});
  }

  /**
   * Toggle modal visibility
   * @public
   * @example
   * modal.toggle();
   */
  toggle() {
    this._logger.debug('toggle() called');
    if (this.visible) {
      this.close();
    } else {
      this.show();
    }
  }

  /**
   * Close the modal (with preventable event)
   * @public
   * @fires TModalLit#modal-before-close
   * @fires TModalLit#modal-close
   * @example
   * modal.close();
   */
  close() {
    this._logger.debug('close() called');

    // Emit preventable before-close event
    const event = this._emitEvent('modal-before-close', {}, true);

    if (!event.defaultPrevented) {
      this.hide();
      this._emitEvent('modal-close', {});
    } else {
      this._logger.debug('Modal close prevented by event handler');
    }
  }

  /**
   * Show loading state
   * @public
   * @example
   * modal.showLoading();
   */
  showLoading() {
    this._logger.debug('showLoading() called');
    this.loading = true;
  }

  /**
   * Hide loading state
   * @public
   * @example
   * modal.hideLoading();
   */
  hideLoading() {
    this._logger.debug('hideLoading() called');
    this.loading = false;
  }

  // ============================================
  // BLOCK 9: Event Emitters
  // ============================================

  /**
   * Emit custom event
   * @private
   * @param {string} eventName
   * @param {Object} detail
   * @param {boolean} cancelable
   * @fires TModalLit#*
   */
  _emitEvent(eventName, detail = {}, cancelable = false) {
    this._logger.debug('Emitting event', { eventName, detail });

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
      cancelable
    });

    this.dispatchEvent(event);
    return event;
  }

  /**
   * @event TModalLit#modal-show
   * @type {CustomEvent<{}>}
   * @description Fired when modal is shown
   * @bubbles true
   * @composed true
   */

  /**
   * @event TModalLit#modal-hide
   * @type {CustomEvent<{}>}
   * @description Fired when modal is hidden
   * @bubbles true
   * @composed true
   */

  /**
   * @event TModalLit#modal-before-close
   * @type {CustomEvent<{}>}
   * @description Fired before modal closes (preventable)
   * @bubbles true
   * @composed true
   * @cancelable true
   */

  /**
   * @event TModalLit#modal-close
   * @type {CustomEvent<{}>}
   * @description Fired after modal closes
   * @bubbles true
   * @composed true
   */

  // ============================================
  // BLOCK 10: Nesting Support
  // ============================================

  /**
   * Register nested component
   * @private
   * @param {LitElement} component
   */
  _registerNestedComponent(component) {
    this._logger.debug('Registering nested component', {
      tag: component.tagName
    });

    this._nestedComponents.add(component);

    // Propagate parent context
    this._propagateContext(component);
  }

  /**
   * Discover nested components
   * @private
   */
  _discoverNestedComponents() {
    // Query all slots
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      const assigned = slot.assignedElements();
      assigned.forEach(el => {
        if (el.tagName && el.tagName.startsWith('T-')) {
          this._registerNestedComponent(el);
        }
      });
    });
  }

  /**
   * Propagate context to nested component
   * @private
   */
  _propagateContext(component) {
    if (typeof component.receiveContext === 'function') {
      component.receiveContext({
        parent: this,
        depth: (this._context?.depth || 0) + 1,
        logger: this._logger,
        modalSize: this.size,
        modalLayout: this.layout
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
      this._logger.error('Maximum nesting depth exceeded');
      throw new Error('Maximum nesting depth exceeded');
    }

    this._context = context;
    this._logger.debug('Received context from parent', { context });
  }

  // ============================================
  // BLOCK 11: Validation
  // ============================================

  /**
   * Validate property value
   * @private
   * @param {string} propName
   * @param {*} value
   * @returns {boolean}
   */
  _validateProperty(propName, value) {
    const validation = this.constructor.getPropertyValidation(propName);
    if (!validation) return true;

    const result = validation.validate(value);
    if (!result.valid) {
      this._logger.warn('Property validation failed', {
        propName,
        value,
        errors: result.errors
      });
    }

    return result.valid;
  }

  /**
   * Get property validation rules
   * @static
   * @param {string} propName
   * @returns {Object|null}
   */
  static getPropertyValidation(propName) {
    const validations = {
      layout: {
        validate: (value) => {
          const valid = ['single', '2-column', '2x2', '1-2-1', '2-1'].includes(value);
          return {
            valid,
            errors: valid ? [] : [`layout must be one of: single, 2-column, 2x2, 1-2-1, 2-1. Got: ${value}`]
          };
        }
      },
      size: {
        validate: (value) => {
          // Allow short aliases: sm, md, lg, xl + full names
          const valid = ['sm', 'small', 'md', 'medium', 'lg', 'large', 'xl', 'xlarge', 'full'].includes(value);
          return {
            valid,
            errors: valid ? [] : [`size must be one of: sm, small, md, medium, lg, large, xl, xlarge, full. Got: ${value}`]
          };
        }
      }
    };

    return validations[propName] || null;
  }

  // ============================================
  // BLOCK 12: Render Method
  // ============================================

  /**
   * Render component template
   * @returns {TemplateResult}
   * @slot default - Main modal content (single layout)
   * @slot left - Left panel (2-column, 2-1 layouts)
   * @slot right - Right panel (2-column, 2-1 layouts)
   * @slot top-left - Top left panel (2x2, 2-1 layouts)
   * @slot top-right - Top right panel (2x2, 2-1 layouts)
   * @slot bottom-left - Bottom left panel (2x2 layout)
   * @slot bottom-right - Bottom right panel (2x2 layout)
   * @slot top - Top panel (1-2-1 layout)
   * @slot middle-left - Middle left panel (1-2-1 layout)
   * @slot middle-right - Middle right panel (1-2-1 layout)
   * @slot bottom - Bottom panel (1-2-1, 2-1 layouts)
   */
  render() {
    this._logger.trace('Rendering');

    return html`
      <div class="modal-backdrop ${this.visible ? 'open' : ''}"
           @click="${this._handleBackdropClick}">
        <div class="modal"
             role="dialog"
             aria-modal="true"
             aria-labelledby="modal-title"
             tabindex="-1"
             @click="${(e) => e.stopPropagation()}">

          ${this._renderHeader()}

          <div class="modal-body">
            ${this._renderLayout()}
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // BLOCK 13: Private Helpers
  // ============================================

  /**
   * Render modal header
   * @private
   * @returns {TemplateResult}
   */
  _renderHeader() {
    return html`
      <div class="modal-header">
        <div class="modal-title" id="modal-title">
          ${this.title || 'Modal'}
        </div>
        <button class="modal-close"
                @click="${this._handleCloseClick}"
                aria-label="Close modal">
          ${this._renderCloseIcon()}
        </button>
      </div>
    `;
  }

  /**
   * Render close icon (X)
   * @private
   * @returns {TemplateResult}
   */
  _renderCloseIcon() {
    return html`
      <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
      </svg>
    `;
  }

  /**
   * Render layout based on layout property
   * @private
   * @returns {TemplateResult}
   */
  _renderLayout() {
    switch (this.layout) {
      case 'single':
        return this._renderSingleLayout();
      case '2-column':
        return this._renderTwoColumnLayout();
      case '2x2':
        return this._render2x2Layout();
      case '1-2-1':
        return this._render121Layout();
      case '2-1':
        return this._render21Layout();
      default:
        this._logger.warn('Invalid layout, falling back to single', { layout: this.layout });
        return this._renderSingleLayout();
    }
  }

  /**
   * Render single layout
   * @private
   * @returns {TemplateResult}
   */
  _renderSingleLayout() {
    return html`
      <div class="modal-layout layout-single">
        <div class="modal-panel panel-main">
          <slot name="default"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Render two-column layout
   * @private
   * @returns {TemplateResult}
   */
  _renderTwoColumnLayout() {
    return html`
      <div class="modal-layout layout-2-column">
        <div class="modal-panel panel-left">
          <slot name="left"></slot>
        </div>
        <div class="modal-panel panel-right">
          <slot name="right"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Render 2x2 grid layout
   * @private
   * @returns {TemplateResult}
   */
  _render2x2Layout() {
    return html`
      <div class="modal-layout layout-2x2">
        <div class="modal-panel panel-top-left">
          <slot name="top-left"></slot>
        </div>
        <div class="modal-panel panel-top-right">
          <slot name="top-right"></slot>
        </div>
        <div class="modal-panel panel-bottom-left">
          <slot name="bottom-left"></slot>
        </div>
        <div class="modal-panel panel-bottom-right">
          <slot name="bottom-right"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Render 1-2-1 layout
   * @private
   * @returns {TemplateResult}
   */
  _render121Layout() {
    return html`
      <div class="modal-layout layout-1-2-1">
        <div class="modal-panel panel-top">
          <slot name="top"></slot>
        </div>
        <div class="modal-row">
          <div class="modal-panel panel-middle-left">
            <slot name="middle-left"></slot>
          </div>
          <div class="modal-panel panel-middle-right">
            <slot name="middle-right"></slot>
          </div>
        </div>
        <div class="modal-panel panel-bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Render 2-1 layout
   * @private
   * @returns {TemplateResult}
   */
  _render21Layout() {
    return html`
      <div class="modal-layout layout-2-1">
        <div class="modal-row">
          <div class="modal-panel panel-top-left">
            <slot name="top-left"></slot>
          </div>
          <div class="modal-panel panel-top-right">
            <slot name="top-right"></slot>
          </div>
        </div>
        <div class="modal-panel panel-bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Add document event listener (tracked for cleanup)
   * @private
   */
  _addDocumentListener(event, handler, options = {}) {
    document.addEventListener(event, handler, options);

    if (!this._documentListeners.has(event)) {
      this._documentListeners.set(event, []);
    }
    this._documentListeners.get(event).push({ handler, options });

    this._logger.trace('Document listener added', { event });
  }

  /**
   * Remove all document listeners
   * @private
   */
  _removeEventListeners() {
    this._documentListeners.forEach((listeners, event) => {
      listeners.forEach(({ handler }) => {
        document.removeEventListener(event, handler);
      });
    });
    this._documentListeners.clear();
    this._logger.trace('All document listeners removed');
  }

  /**
   * Setup event listeners when modal becomes visible
   * @private
   */
  _setupEventListeners() {
    if (this.escapeClose) {
      this._addDocumentListener('keydown', this._handleKeyPress);
    }
  }

  /**
   * Handle Escape key press
   * @private
   */
  _handleKeyPress(e) {
    if (e.key === 'Escape' && this.visible) {
      this._logger.debug('Escape key pressed');
      this.close();
    }
  }

  /**
   * Handle backdrop click
   * @private
   */
  _handleBackdropClick(e) {
    if (e.target.classList.contains('modal-backdrop') && this.backdropClose) {
      this._logger.debug('Backdrop clicked');
      this.close();
    }
  }

  /**
   * Handle close button click
   * @private
   */
  _handleCloseClick(e) {
    e.preventDefault();
    this._logger.debug('Close button clicked');
    this.close();
  }

  /**
   * Lock body scroll
   * @private
   */
  _lockBodyScroll() {
    this._originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this._logger.trace('Body scroll locked');
  }

  /**
   * Unlock body scroll
   * @private
   */
  _unlockBodyScroll() {
    document.body.style.overflow = this._originalBodyOverflow || '';
    this._logger.trace('Body scroll unlocked');
  }

  /**
   * Focus modal for accessibility
   * @private
   */
  _focusModal() {
    requestAnimationFrame(() => {
      const modal = this.shadowRoot.querySelector('.modal');
      if (modal) {
        modal.focus();
        this._logger.trace('Modal focused');
      }
    });
  }

  /**
   * Register with parent component
   * @private
   */
  _registerWithParent() {
    const parent = this.parentElement;
    if (parent && typeof parent._registerNestedComponent === 'function') {
      parent._registerNestedComponent(this);
    }
  }

  /**
   * Handle property changes and validate
   * @private
   */
  _handlePropertyChanges(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      const newValue = this[propName];
      // Skip if new value is valid
      if (this._validateProperty(propName, newValue)) {
        return;
      }
      // Only revert if old value is also valid (prevents infinite loop)
      if (this._validateProperty(propName, oldValue)) {
        this[propName] = oldValue;
        this._logger.warn('Property reverted due to validation failure', {
          propName,
          attempted: newValue,
          reverted: oldValue
        });
      }
      // If both are invalid, just log warning but don't revert (prevents loop)
    });
  }
}

// ============================================
// SECTION 3: Custom Element Registration
// ============================================
if (!customElements.get(TModalLit.tagName)) {
  customElements.define(TModalLit.tagName, TModalLit);
}

// ============================================
// SECTION 4: Manifest Generation
// ============================================
export const TModalManifest = generateManifest(TModalLit, {
  tagName: 't-mdl',
  displayName: 'Terminal Modal',
  description: 'Modal dialog with multiple layout modes and customizable size',
  version: '1.0.0',
  properties: {
    layout: {
      description: 'Modal layout mode',
      enum: ['single', '2-column', '2x2', '1-2-1', '2-1']
    },
    size: {
      description: 'Modal size',
      enum: ['small', 'medium', 'large', 'xlarge', 'full']
    },
    visible: {
      description: 'Modal visibility state'
    },
    title: {
      description: 'Modal title displayed in header'
    },
    escapeClose: {
      description: 'Enable closing modal with Escape key'
    },
    backdropClose: {
      description: 'Enable closing modal by clicking backdrop'
    },
    loading: {
      description: 'Loading state'
    }
  },
  methods: {
    show: {
      description: 'Show the modal',
      parameters: [],
      returns: 'void'
    },
    hide: {
      description: 'Hide the modal',
      parameters: [],
      returns: 'void'
    },
    toggle: {
      description: 'Toggle modal visibility',
      parameters: [],
      returns: 'void'
    },
    close: {
      description: 'Close the modal (with preventable event)',
      parameters: [],
      returns: 'void'
    },
    showLoading: {
      description: 'Show loading state',
      parameters: [],
      returns: 'void'
    },
    hideLoading: {
      description: 'Hide loading state',
      parameters: [],
      returns: 'void'
    }
  },
  events: {
    'modal-show': {
      description: 'Fired when modal is shown',
      detail: {}
    },
    'modal-hide': {
      description: 'Fired when modal is hidden',
      detail: {}
    },
    'modal-before-close': {
      description: 'Fired before modal closes (preventable)',
      detail: {},
      cancelable: true
    },
    'modal-close': {
      description: 'Fired after modal closes',
      detail: {}
    }
  },
  slots: {
    default: {
      description: 'Main modal content (single layout)'
    },
    left: {
      description: 'Left panel (2-column, 2-1 layouts)'
    },
    right: {
      description: 'Right panel (2-column, 2-1 layouts)'
    },
    'top-left': {
      description: 'Top left panel (2x2, 2-1 layouts)'
    },
    'top-right': {
      description: 'Top right panel (2x2, 2-1 layouts)'
    },
    'bottom-left': {
      description: 'Bottom left panel (2x2 layout)'
    },
    'bottom-right': {
      description: 'Bottom right panel (2x2 layout)'
    },
    top: {
      description: 'Top panel (1-2-1 layout)'
    },
    'middle-left': {
      description: 'Middle left panel (1-2-1 layout)'
    },
    'middle-right': {
      description: 'Middle right panel (1-2-1 layout)'
    },
    bottom: {
      description: 'Bottom panel (1-2-1, 2-1 layouts)'
    }
  }
});

// ============================================
// SECTION 5: Exports
// ============================================
export default TModalLit;