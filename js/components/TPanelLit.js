import { LitElement, html, css } from 'lit';
import { caretRightIcon, caretDownIcon } from '../utils/phosphor-icons.js';
import { generateManifest } from '../utils/manifest-generator.js';

/**
 * Terminal Panel Component - Built with Lit
 * Zero FOUC, fully encapsulated styles, reactive properties
 * Supports collapsible/expandable states, variants, and resizable/draggable options
 */
export class TPanelLit extends LitElement {
  static styles = css`
    :host {
      --terminal-black: #0a0a0a;
      --terminal-black-light: #1a1a1a;
      --terminal-green: #00ff41;
      --terminal-green-bright: #33ff66;
      --terminal-green-dim: #00cc33;
      --terminal-green-dark: #008820;
      --terminal-amber: #ffbf00;
      --terminal-red: #ff4141;
      --terminal-blue: #0080ff;
      --terminal-purple: #bf00ff;
      --terminal-cyan: #00ffff;
      --terminal-white: #f0f0f0;
      --terminal-gray: #808080;
      --terminal-gray-dark: #242424;
      --terminal-gray-light: #333333;
      --terminal-gray-medium: #2a2a2a;
      --terminal-bg: #0a0a0a;
      --terminal-fg: #00ff41;
      --terminal-font: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
      --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
      --font-size-sm: 11px;
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 12px;
      --spacing-lg: 16px;
      --spacing-xl: 24px;

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

    /* Size slotted action buttons based on panel variant */
    :host(:not(.t-pnl--compact):not(.t-pnl--large)) ::slotted(t-btn) {
      --btn-size: small;
    }

    :host(.t-pnl--compact) ::slotted(t-btn) {
      --btn-size: xs;
    }

    :host(.t-pnl--large) ::slotted(t-btn) {
      --btn-size: default;
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

    /* Collapsed panel heights match header only */
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

    .t-pnl--large .t-pnl__header {
      padding: 9px 12px;
      height: 36px;
      box-sizing: border-box;
    }

    .t-pnl--large .t-pnl__title {
      font-size: 14px;
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






    /* Panel Variants */
    .t-pnl--standard {
      min-height: 60px;
    }

    .t-pnl--standard .t-pnl__title::before {
      content: '[ ';
      color: var(--terminal-green-dim);
    }

    .t-pnl--standard .t-pnl__title::after {
      content: ' ]';
      color: var(--terminal-green-dim);
    }

    .t-pnl--control {
      background: var(--terminal-black-light);
      border-bottom: 1px solid var(--terminal-gray-light);
      padding: var(--spacing-md);
      flex-shrink: 0;
    }

    .t-pnl--slide {
      position: fixed;
      top: 0;
      right: -400px;
      width: 400px;
      height: 100vh;
      background: var(--terminal-black-light);
      border-left: 1px solid var(--terminal-green);
      transition: right 0.3s ease;
      z-index: 100;
      display: flex;
      flex-direction: column;
    }

    .t-pnl--slide.is-active {
      right: 0;
    }

    .t-pnl--slide.is-pinned {
      position: relative;
      right: 0;
      width: 100%;
      height: 100%;
      border-left: none;
      border: 1px solid var(--terminal-gray-light);
    }

    /* Enhanced Collapsible States */
    .t-pnl--collapsed .t-pnl__body {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .t-pnl--collapsed .t-pnl__footer {
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
    }


    .t-pnl--expanded {
      min-height: 60px;
    }

    .t-pnl--expanded .t-pnl__body {
      display: block;
      visibility: visible;
      height: auto;
    }

    /* Collapsible Functionality */
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

    .t-pnl--collapsible .t-pnl__title::before {
      content: '[ ';
      color: var(--terminal-green-dim);
    }

    .t-pnl--collapsible .t-pnl__title::after {
      content: ' ]';
      color: var(--terminal-green-dim);
    }

    /* Compact Mode Additions */
    .t-pnl--compact .t-pnl__body {
      padding: 8px;
      min-height: 40px;
    }

    .t-pnl--compact .t-pnl__actions {
      gap: 4px;
    }

    .t-pnl--compact .t-pnl__footer {
      padding: 4px 8px;
      gap: 4px;
    }


    .t-pnl--compact .t-pnl__collapse-btn {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .t-pnl--large .t-pnl__collapse-btn {
      width: 20px;
      height: 20px;
    }

    /* Large Mode Additions */
    .t-pnl--large .t-pnl__body {
      padding: 16px;
      min-height: 80px;
    }

    .t-pnl--large .t-pnl__actions {
      gap: 8px;
    }

    .t-pnl--large .t-pnl__footer {
      padding: 12px 16px;
      gap: 12px;
    }


    /* Loading State */
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

    /* Headless Mode */
    .t-pnl__body--headless {
      border: none;
      padding: var(--spacing-md);
      background: transparent;
      min-height: 40px;
    }

    .t-pnl__body--with-status {
      border-bottom: none;
    }

    :host([variant="headless"]) .t-pnl__header {
      display: none !important;
    }

    :host([variant="headless"]) .t-pnl__body {
      border: none;
      background: transparent;
    }

    :host(:not([title])) .t-pnl__header {
      display: none;
    }

    /* Panel Icons */
    .t-pnl__title-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      margin-right: var(--spacing-xs);
    }

    /* Scale buttons in actions slot */
    .t-pnl--compact .t-pnl__actions ::slotted(t-btn) {
      --btn-size: xs;
    }

    .t-pnl__actions ::slotted(t-btn) {
      --btn-size: small;
    }

    .t-pnl--large .t-pnl__actions ::slotted(t-btn) {
      --btn-size: default;
    }

    /* Error and Empty States */
    .t-pnl__error,
    .t-pnl__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      text-align: center;
      min-height: 120px;
      color: var(--terminal-green-dim);
    }

    .t-pnl__error {
      color: var(--terminal-red);
    }

    .t-pnl__error-icon,
    .t-pnl__empty-icon {
      font-size: 24px;
      margin-bottom: var(--spacing-sm);
      opacity: 0.7;
    }

    .t-pnl__error-msg,
    .t-pnl__empty-msg {
      font-size: var(--font-size-sm);
      line-height: 1.4;
    }

    /* Scrollbar Styling */
    .t-pnl__body::-webkit-scrollbar,
    .t-pnl__content::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .t-pnl__body::-webkit-scrollbar-track,
    .t-pnl__content::-webkit-scrollbar-track {
      background: var(--terminal-black);
    }

    .t-pnl__body::-webkit-scrollbar-thumb,
    .t-pnl__content::-webkit-scrollbar-thumb {
      background: var(--terminal-green-dark);
      border: 1px solid var(--terminal-black);
    }

    .t-pnl__body::-webkit-scrollbar-thumb:hover,
    .t-pnl__content::-webkit-scrollbar-thumb:hover {
      background: var(--terminal-green);
    }

    .t-pnl__body,
    .t-pnl__content {
      scrollbar-width: thin;
      scrollbar-color: var(--terminal-green-dark) var(--terminal-black);
    }

    /* Resizable & Draggable */
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

    /* Slot Styling */
    .t-pnl__slot {
      display: contents;
    }


    /* Animations */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
  `;

  /* ========================================
     REACTIVE PROPERTIES
     ======================================== */
  static properties = {
    title: { type: String },
    variant: { type: String },
    collapsible: { type: Boolean },
    collapsed: { type: Boolean },
    compact: { type: Boolean },
    large: { type: Boolean },
    loading: { type: Boolean },
    resizable: { type: Boolean },
    draggable: { type: Boolean },
    icon: { type: String },
    footerCollapsed: { type: Boolean }
  };

  /* ========================================
     LIFECYCLE METHODS
     ======================================== */

  constructor() {
    super();

    // Initialize properties
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

    // Internal state
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._dragging = false;

    this._handleHeaderClick = this._handleHeaderClick.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.draggable) {
      this.addEventListener('mousedown', this._handleMouseDown);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.draggable) {
      this.removeEventListener('mousedown', this._handleMouseDown);
      document.removeEventListener('mousemove', this._handleMouseMove);
      document.removeEventListener('mouseup', this._handleMouseUp);
    }
  }

  firstUpdated() {
    // Lit handles style adoption automatically
    // No manual intervention needed for zero FOUC

    // Listen for slot changes to update button sizes
    const actionsSlot = this.shadowRoot?.querySelector('slot[name="actions"]');
    if (actionsSlot) {
      actionsSlot.addEventListener('slotchange', () => {
        this._updateActionButtonSizes();
      });
    }
  }

  /* ========================================
     RENDER METHOD
     ======================================== */
  render() {
    const panelClasses = this._getPanelClasses();

    return html`
      <div class=${panelClasses}>
        ${this._renderHeader()}
        ${this._renderBody()}
        ${this._renderFooter()}
      </div>
    `;
  }

  /* ========================================
     PRIVATE RENDER METHODS
     ======================================== */
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
    } else {
      classes.push('t-pnl--expanded');
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
          ${this.title || html`<slot name="title"></slot>`}
        </div>
        <div class="t-pnl__actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

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


  /* ========================================
     EVENT HANDLERS
     ======================================== */
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

    this._toggleCollapse();
  }

  _handleHeaderKeydown(e) {
    if (!this.collapsible) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggleCollapse();
    }
  }

  _handleCollapseClick(e) {
    e.stopPropagation();
    this._toggleCollapse();
  }

  _toggleCollapse() {
    this.collapsed = !this.collapsed;

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('panel-toggle', {
      detail: { collapsed: this.collapsed },
      bubbles: true,
      composed: true
    }));
  }

  /* ========================================
     DRAG AND DROP FUNCTIONALITY
     ======================================== */
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
  }

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

  _handleMouseUp() {
    this._dragging = false;
    this.toggleAttribute('dragging', false);

    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);

    // Dispatch drag end event
    this.dispatchEvent(new CustomEvent('panel-drag-end', {
      detail: {
        left: this.style.left,
        top: this.style.top
      },
      bubbles: true,
      composed: true
    }));
  }

  /* ========================================
     PUBLIC API METHODS
     ======================================== */
  expand() {
    this.collapsed = false;
  }

  collapse() {
    this.collapsed = true;
  }

  toggle() {
    this._toggleCollapse();
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setTitle(title) {
    this.title = title;
  }

  collapseFooter() {
    this.footerCollapsed = true;
  }

  expandFooter() {
    this.footerCollapsed = false;
  }

  _handleFooterCollapseClick(e) {
    e.stopPropagation();
    this.collapseFooter();
  }

  _handleFooterReopenClick(e) {
    e.stopPropagation();
    this.expandFooter();
  }

  /* ========================================
     UPDATED LIFECYCLE
     ======================================== */
  updated(changedProperties) {
    super.updated(changedProperties);

    // Show/hide footer and status bar based on slot content
    if (changedProperties.has('collapsed') || this.hasUpdated) {
      this._updateSlotVisibility();
    }

    // Update action button sizes based on panel variant
    if (changedProperties.has('compact') || changedProperties.has('large') || this.hasUpdated) {
      this._updateActionButtonSizes();
    }

    // Update footer visibility
    if (changedProperties.has('footerCollapsed')) {
      this._updateSlotVisibility();
    }
  }

  _updateSlotVisibility() {
    const footerSlot = this.shadowRoot?.querySelector('slot[name="footer"]');
    const footerContainer = this.shadowRoot?.querySelector('.t-pnl__footer');

    if (footerSlot && footerContainer) {
      const hasFooterContent = footerSlot.assignedElements().length > 0;
      footerContainer.style.display = hasFooterContent ? 'flex' : 'none';
    }
  }

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

    console.log(`[TPanelLit] Sizing ${buttons.length} action buttons. compact=${this.compact}, large=${this.large}`);

    if (buttons.length === 0) return;

    let buttonSize = 'small';
    if (this.compact) {
      buttonSize = 'xs';
    } else if (this.large) {
      buttonSize = '';
    }

    buttons.forEach((btn, i) => {
      const oldSize = btn.getAttribute('size');
      if (buttonSize === '') {
        btn.removeAttribute('size');
      } else {
        btn.setAttribute('size', buttonSize);
      }
      const newSize = btn.getAttribute('size') || 'default';
      console.log(`[TPanelLit]   Button ${i}: ${oldSize || 'default'} → ${newSize}`);
    });
  }
}

/**
 * Component Manifest - Auto-generated + Manual Annotations
 * Properties auto-extracted from static properties
 * Methods, events, slots manually documented
 * @type {import('../types/component-manifest').ComponentManifest}
 */
export const TPanelManifest = generateManifest(TPanelLit, {
  tagName: 't-pnl',
  displayName: 'Terminal Panel',
  description: 'Collapsible panel with header, footer, and nested content support. Supports nesting other panels and components.',
  version: '1.0.0',

  // Property descriptions and enums (auto-generated types from static properties)
  properties: {
    title: {
      description: 'Panel title displayed in header'
    },
    variant: {
      enum: ['standard', 'headless'],
      description: 'Panel variant: standard (with header) or headless (no header)'
    },
    collapsible: {
      description: 'Enable collapse/expand functionality'
    },
    collapsed: {
      description: 'Current collapsed state'
    },
    compact: {
      description: 'Compact size variant (20px header)'
    },
    large: {
      description: 'Large size variant (36px header)'
    },
    loading: {
      description: 'Show loading state'
    },
    resizable: {
      description: 'Enable panel resizing'
    },
    draggable: {
      description: 'Enable panel dragging'
    },
    icon: {
      description: 'SVG icon string to display in header'
    },
    footerCollapsed: {
      description: 'Footer collapsed state'
    }
  },

  // Methods documentation
  methods: {
    toggleCollapse: {
      description: 'Toggle panel collapse state',
      parameters: [],
      returns: { type: 'boolean', description: 'New collapsed state' }
    },
    toggleFooter: {
      description: 'Toggle footer visibility',
      parameters: [],
      returns: { type: 'boolean', description: 'New footer collapsed state' }
    }
  },

  // Events documentation
  events: {
    'panel-collapsed': {
      description: 'Fired when panel collapse state changes',
      detail: {
        collapsed: 'boolean'
      },
      bubbles: true,
      composed: true
    },
    'panel-footer-collapsed': {
      description: 'Fired when footer collapse state changes',
      detail: {
        collapsed: 'boolean'
      },
      bubbles: true,
      composed: true
    }
  },

  // Slots documentation
  slots: {
    default: {
      description: 'Main panel content - supports nesting other panels and any components',
      multiple: true,
      accepts: ['*']
    },
    actions: {
      description: 'Action buttons in panel header (auto-sized based on panel size)',
      multiple: true,
      accepts: ['t-btn']
    },
    footer: {
      description: 'Footer content (can be collapsed with slide animation)',
      multiple: true,
      accepts: ['*']
    }
  },

  // Shadow parts for external styling
  parts: {
    panel: 'Main panel container',
    header: 'Panel header',
    title: 'Panel title',
    actions: 'Actions container',
    body: 'Panel body',
    footer: 'Panel footer'
  },

  // CSS custom properties
  cssProperties: {
    '--terminal-green': {
      description: 'Primary color',
      syntax: '<color>',
      default: '#00ff41'
    },
    '--terminal-gray-dark': {
      description: 'Header background color',
      syntax: '<color>',
      default: '#242424'
    },
    '--spacing-md': {
      description: 'Standard spacing',
      syntax: '<length>',
      default: '12px'
    }
  }
});

// Register the custom element - only t-pnl since that's what the HTML uses
if (!customElements.get('t-pnl')) {
	customElements.define('t-pnl', TPanelLit);
}

// Auto-register manifest if registry available
if (typeof window !== 'undefined' && window.__TERMINAL_KIT_REGISTRY__) {
  window.__TERMINAL_KIT_REGISTRY__.register(TPanelManifest);
}

// Export for use
export default TPanelLit;