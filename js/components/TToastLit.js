// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import {
  checkCircleIconFill,
  xIconFill,
  warningCircleIconFill,
  infoIconFill,
  xIcon
} from '../utils/phosphor-icons.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TToastLit
 * @tagname t-tst
 * @description Toast notification component with auto-dismiss and animation support
 * @category Display
 * @since 1.0.0
 * @example
 * <t-tst message="Operation successful!" type="success"></t-tst>
 */
export class TToastLit extends LitElement {

  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-tst';
  static version = '1.0.0';
  static category = 'Display';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    :host {
      --t-tst-bg: var(--terminal-bg, #000);
      --t-tst-border: var(--terminal-green, #00ff41);
      --t-tst-text: var(--terminal-green, #00ff41);
      --t-tst-success: var(--terminal-green, #00ff41);
      --t-tst-error: var(--terminal-red, #ff4136);
      --t-tst-warning: var(--terminal-yellow, #ffdc00);
      --t-tst-info: var(--terminal-blue, #0074d9);
      --t-tst-shadow: rgba(0, 255, 65, 0.2);
      --t-tst-padding: var(--terminal-spacing-md, 16px);
      --t-tst-border-radius: var(--terminal-border-radius, 4px);
      --t-tst-transition: var(--terminal-transition, all 0.3s ease);
      --t-tst-font: var(--terminal-font, 'IBM Plex Mono', monospace);
      --t-tst-font-size: var(--terminal-font-size, 14px);

      display: block;
      position: fixed;
      z-index: 10000;
      pointer-events: none;
    }

    :host([position="top-right"]) {
      top: 20px;
      right: 20px;
    }

    :host([position="top-left"]) {
      top: 20px;
      left: 20px;
    }

    :host([position="bottom-right"]) {
      bottom: 20px;
      right: 20px;
    }

    :host([position="bottom-left"]) {
      bottom: 20px;
      left: 20px;
    }

    .t-tst {
      background: var(--t-tst-bg);
      border: 1px solid var(--t-tst-border);
      border-radius: var(--t-tst-border-radius);
      padding: var(--t-tst-padding);
      font-family: var(--t-tst-font);
      font-size: var(--t-tst-font-size);
      color: var(--t-tst-text);
      box-shadow: 0 4px 12px var(--t-tst-shadow);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 500px;
      opacity: 0;
      transform: translateX(100%);
      transition: var(--t-tst-transition);
      pointer-events: auto;
      cursor: pointer;
    }

    :host([position*="left"]) .t-tst {
      transform: translateX(-100%);
    }

    :host([visible]) .t-tst {
      opacity: 1;
      transform: translateX(0);
    }

    .t-tst--success {
      border-color: var(--t-tst-success);
      --t-tst-text: var(--t-tst-success);
      --t-tst-shadow: rgba(0, 255, 65, 0.3);
    }

    .t-tst--error {
      border-color: var(--t-tst-error);
      --t-tst-text: var(--t-tst-error);
      --t-tst-shadow: rgba(255, 65, 54, 0.3);
    }

    .t-tst--warning {
      border-color: var(--t-tst-warning);
      --t-tst-text: var(--t-tst-warning);
      --t-tst-shadow: rgba(255, 220, 0, 0.3);
    }

    .t-tst--info {
      border-color: var(--t-tst-info);
      --t-tst-text: var(--t-tst-info);
      --t-tst-shadow: rgba(0, 116, 217, 0.3);
    }

    .t-tst__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .t-tst__icon svg {
      width: 100%;
      height: 100%;
    }

    .t-tst__message {
      flex: 1;
      word-break: break-word;
    }

    .t-tst__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
      background: none;
      border: none;
      color: inherit;
      padding: 0;
      margin: 0;
      font: inherit;
    }

    .t-tst__close:hover {
      opacity: 1;
    }

    .t-tst__close svg {
      width: 16px;
      height: 16px;
    }

    /* Animation classes */
    .t-tst--entering {
      animation: slideIn 0.3s ease forwards;
    }

    .t-tst--leaving {
      animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    :host([position*="left"]) @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    :host([position*="left"]) @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-100%);
      }
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  /**
   * @property {string} message - Toast message to display
   * @default ''
   * @attribute message
   * @reflects true
   */
  static properties = {
    /**
     * @property {string} message - Toast message to display
     * @default ''
     * @attribute message
     * @reflects true
     */
    message: { type: String, reflect: true },

    /**
     * @property {('success'|'error'|'warning'|'info')} type - Toast type/variant
     * @default 'info'
     * @attribute type
     * @reflects true
     */
    type: { type: String, reflect: true },

    /**
     * @property {number} duration - Auto-dismiss time in milliseconds (0 = manual dismiss only)
     * @default 3000
     * @attribute duration
     * @reflects true
     */
    duration: { type: Number, reflect: true },

    /**
     * @property {boolean} visible - Whether toast is visible
     * @default false
     * @attribute visible
     * @reflects true
     */
    visible: { type: Boolean, reflect: true },

    /**
     * @property {('top-right'|'top-left'|'bottom-right'|'bottom-left')} position - Toast position on screen
     * @default 'top-right'
     * @attribute position
     * @reflects true
     */
    position: { type: String, reflect: true }
  };

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE - underscore prefix)
  // ----------------------------------------------------------
  /** @private */
  _dismissTimer = null;

  /** @private */
  _isAnimating = false;

  /** @private */
  _animationFrameId = null;

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

    // Initialize logger first
    this._logger = componentLogger.for(TToastLit.tagName);

    // Log construction
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.message = '';
    this.type = 'info';
    this.duration = 3000;
    this.visible = false;
    this.position = 'top-right';
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
  }

  /**
   * Called when component is disconnected from DOM
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.debug('Disconnected from DOM');

    // Cleanup timer
    this._clearDismissTimer();

    // Cleanup animation frame if exists
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    // Start auto-dismiss timer if visible
    if (this.visible && this.duration > 0) {
      this._startDismissTimer();
    }
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
        this._handleShow();
      } else {
        this._handleHide();
      }
    }

    // Handle duration changes
    if (changedProperties.has('duration') && this.visible) {
      this._startDismissTimer();
    }
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Show the toast notification
   * @public
   * @returns {void}
   * @fires TToastLit#toast-show
   * @example
   * const toast = document.querySelector('t-tst');
   * toast.show();
   */
  show() {
    this._logger.debug('show called');

    if (this.visible) {
      this._logger.debug('Toast already visible');
      return;
    }

    this.visible = true;
    this._emitEvent('toast-show');
  }

  /**
   * Dismiss the toast notification
   * @public
   * @returns {void}
   * @fires TToastLit#toast-dismiss
   * @fires TToastLit#toast-hide
   * @example
   * const toast = document.querySelector('t-tst');
   * toast.dismiss();
   */
  dismiss() {
    this._logger.debug('dismiss called');

    if (!this.visible || this._isAnimating) {
      this._logger.debug('Toast not visible or already animating');
      return;
    }

    this._isAnimating = true;
    this._clearDismissTimer();

    // Start exit animation
    const toastEl = this.shadowRoot?.querySelector('.t-tst');
    if (toastEl) {
      toastEl.classList.add('t-tst--leaving');

      // Wait for animation to complete
      setTimeout(() => {
        this.visible = false;
        this._isAnimating = false;
        this._emitEvent('toast-dismiss');
        this._emitEvent('toast-hide');
      }, 300);
    } else {
      // No animation, hide immediately
      this.visible = false;
      this._isAnimating = false;
      this._emitEvent('toast-dismiss');
      this._emitEvent('toast-hide');
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
   * @event TToastLit#toast-show
   * @type {CustomEvent<{}>}
   * @description Fired when toast is shown
   * @bubbles true
   * @composed true
   */

  /**
   * @event TToastLit#toast-hide
   * @type {CustomEvent<{}>}
   * @description Fired when toast is hidden
   * @bubbles true
   * @composed true
   */

  /**
   * @event TToastLit#toast-click
   * @type {CustomEvent<{}>}
   * @description Fired when toast is clicked
   * @bubbles true
   * @composed true
   */

  /**
   * @event TToastLit#toast-dismiss
   * @type {CustomEvent<{}>}
   * @description Fired when toast is manually dismissed
   * @bubbles true
   * @composed true
   */

  // ----------------------------------------------------------
  // BLOCK 10: NESTING SUPPORT - NOT NEEDED (CORE PROFILE)
  // ----------------------------------------------------------
  // Not a container component - skip Block 10

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION - NOT NEEDED (CORE PROFILE)
  // ----------------------------------------------------------
  // No validation needed - skip Block 11

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Render component template
   * @returns {TemplateResult}
   * @slot - No slots available for this component
   */
  render() {
    this._logger.debug('Rendering');

    if (!this.message) {
      return html``;
    }

    const icon = this._getTypeIcon();

    return html`
      <div
        class="t-tst t-tst--${this.type}"
        @click=${this._handleToastClick}>
        <div class="t-tst__icon">
          <span .innerHTML=${icon}></span>
        </div>
        <div class="t-tst__message">
          ${this.message}
        </div>
        <button
          class="t-tst__close"
          @click=${this._handleCloseClick}
          type="button"
          aria-label="Close toast">
          <span .innerHTML=${xIcon}></span>
        </button>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  /** @private */
  _getTypeIcon() {
    const icons = {
      success: checkCircleIconFill,
      error: xIconFill,
      warning: warningCircleIconFill,
      info: infoIconFill
    };

    return icons[this.type] || icons.info;
  }

  /** @private */
  _handleToastClick(e) {
    // Don't emit if clicking close button
    if (!e.target.closest('.t-tst__close')) {
      this._emitEvent('toast-click');
    }
  }

  /** @private */
  _handleCloseClick(e) {
    e.stopPropagation();
    this.dismiss();
  }

  /** @private */
  _handleShow() {
    this._logger.debug('Handling show');

    // Start entrance animation
    this._animationFrameId = requestAnimationFrame(() => {
      const toastEl = this.shadowRoot?.querySelector('.t-tst');
      if (toastEl) {
        toastEl.classList.add('t-tst--entering');
        setTimeout(() => {
          toastEl.classList.remove('t-tst--entering');
          this._animationFrameId = null;
        }, 300);
      }
    });

    // Start auto-dismiss timer
    if (this.duration > 0) {
      this._startDismissTimer();
    }
  }

  /** @private */
  _handleHide() {
    this._logger.debug('Handling hide');
    this._clearDismissTimer();
  }

  /** @private */
  _startDismissTimer() {
    this._clearDismissTimer();

    if (this.duration > 0 && this.visible) {
      this._logger.debug('Starting dismiss timer', { duration: this.duration });

      this._dismissTimer = setTimeout(() => {
        this._logger.debug('Auto-dismiss triggered');
        this.dismiss();
      }, this.duration);
    }
  }

  /** @private */
  _clearDismissTimer() {
    if (this._dismissTimer) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
      this._logger.debug('Dismiss timer cleared');
    }
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TToastLit.tagName)) {
  customElements.define(TToastLit.tagName, TToastLit);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================
export const TToastManifest = generateManifest(TToastLit, {
  description: 'Toast notification component with auto-dismiss and animation support',
  methods: {
    show: {
      description: 'Show the toast notification',
      params: [],
      returns: 'void'
    },
    dismiss: {
      description: 'Dismiss the toast notification',
      params: [],
      returns: 'void'
    }
  },
  events: {
    'toast-show': {
      description: 'Fired when toast is shown',
      detail: {}
    },
    'toast-hide': {
      description: 'Fired when toast is hidden',
      detail: {}
    },
    'toast-click': {
      description: 'Fired when toast is clicked',
      detail: {}
    },
    'toast-dismiss': {
      description: 'Fired when toast is manually dismissed',
      detail: {}
    }
  }
});

// ============================================================
// SECTION 5: DEFAULT EXPORT
// ============================================================
export default TToastLit;