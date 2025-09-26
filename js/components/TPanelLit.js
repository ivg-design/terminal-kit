import { LitElement, html, css } from 'lit';

/**
 * Terminal Panel Component - Built with Lit
 * Zero FOUC, fully encapsulated styles, reactive properties
 * Supports collapsible/expandable states, variants, and resizable/draggable options
 */
export class TPanelLit extends LitElement {
  static styles = css`
    /* ========================================
       HOST ELEMENT STYLES WITH CSS VARIABLES
       ======================================== */
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
      --terminal-font: 'Courier New', monospace;
      --font-mono: 'Courier New', monospace;
      --font-size-sm: 11px;
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 12px;
      --spacing-lg: 16px;
      --spacing-xl: 24px;

      position: relative;
      display: block;
    }

    /* ========================================
       BASE PANEL STYLES
       ======================================== */
    .t-pnl {
      background-color: var(--terminal-black-light);
      border: 1px solid var(--terminal-green-dark);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
      transition: min-height 0.3s ease-out, height 0.3s ease-out, border 0.3s ease-out;
    }

    .t-pnl__header {
      display: flex;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--terminal-gray-dark);
      border-bottom: 1px solid var(--terminal-gray-light);
      min-height: 36px;
      gap: var(--spacing-xs);
    }

    .t-pnl__title {
      font-size: var(--font-size-sm);
      font-weight: normal;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--terminal-green);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      flex: 1;
    }

    .t-pnl__actions {
      display: flex;
      gap: var(--spacing-xs);
      align-items: center;
      margin-left: auto;
    }

    .t-pnl__body {
      flex: 1;
      padding: var(--spacing-md);
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 40px;
    }

    .t-pnl__footer {
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--terminal-gray-dark);
      border-top: 1px solid var(--terminal-gray-light);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
    }

    /* ========================================
       PANEL VARIANTS
       ======================================== */
    /* Standard panels */
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

    /* Control Panel variant */
    .t-pnl--control {
      background: var(--terminal-black-light);
      border-bottom: 1px solid var(--terminal-gray-light);
      padding: var(--spacing-md);
      flex-shrink: 0;
    }

    /* Slide Panel variant */
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

    /* ========================================
       COLLAPSIBLE STATES
       ======================================== */
    .t-pnl--collapsed .t-pnl__body {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .t-pnl--collapsed .t-pnl__footer,
    .t-pnl--collapsed .t-pnl__status-bar {
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
    }

    .t-pnl--collapsed {
      min-height: 0;
      height: auto;
    }

    .t-pnl--collapsed .t-pnl__header {
      border-bottom: none;
    }

    /* Expanded state */
    .t-pnl--expanded {
      min-height: 60px;
    }

    .t-pnl--expanded .t-pnl__body {
      display: block;
      visibility: visible;
      height: auto;
    }

    /* Loading state */
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

    /* ========================================
       COLLAPSIBLE FUNCTIONALITY
       ======================================== */
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

    .t-pnl__collapse-btn {
      margin-right: var(--spacing-sm);
      flex-shrink: 0;
      background: transparent;
      border: none;
      color: var(--terminal-green);
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .t-pnl__collapse-btn:hover {
      color: var(--terminal-green-bright);
    }

    .t-pnl__collapse-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .t-pnl--collapsed .t-pnl__collapse-icon {
      transform: rotate(-90deg);
    }

    /* Brackets around collapsible title */
    .t-pnl--collapsible .t-pnl__title::before {
      content: '[ ';
      color: var(--terminal-green-dim);
    }

    .t-pnl--collapsible .t-pnl__title::after {
      content: ' ]';
      color: var(--terminal-green-dim);
    }

    /* ========================================
       COMPACT MODE
       ======================================== */
    .t-pnl--compact .t-pnl__header {
      min-height: 20px;
      height: 20px;
      padding: 2px var(--spacing-sm);
      font-size: 11px;
      line-height: 16px;
    }

    .t-pnl--compact .t-pnl__collapse-btn {
      width: 16px;
      height: 16px;
      min-width: 16px;
      min-height: 16px;
      padding: 0;
      margin-right: 4px;
      border: none;
      background: transparent;
    }

    .t-pnl--compact .t-pnl__collapse-icon {
      width: 12px;
      height: 12px;
    }

    .t-pnl--compact .t-pnl__title {
      font-size: 11px;
      line-height: 16px;
    }

    .t-pnl--compact .t-pnl__actions {
      display: flex;
      align-items: center;
    }

    /* ========================================
       STATUS BAR
       ======================================== */
    .t-pnl__status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--terminal-gray-dark);
      border-top: 1px solid var(--terminal-green-dark);
      min-height: 32px;
      gap: var(--spacing-sm);
      flex-shrink: 0;
    }

    .t-pnl__status-content {
      width: 100%;
    }

    /* ========================================
       HEADLESS MODE
       ======================================== */
    .t-pnl__body--headless {
      border: none;
      padding: var(--spacing-md);
      background: transparent;
      min-height: 40px;
    }

    .t-pnl__body--with-status {
      border-bottom: none;
    }

    /* ========================================
       PANEL ICONS
       ======================================== */
    .t-pnl__title-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      margin-right: var(--spacing-xs);
    }

    /* ========================================
       ERROR AND EMPTY STATES
       ======================================== */
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

    /* ========================================
       SCROLLBAR STYLING
       ======================================== */
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

    /* Firefox scrollbar styling */
    .t-pnl__body,
    .t-pnl__content {
      scrollbar-width: thin;
      scrollbar-color: var(--terminal-green-dark) var(--terminal-black);
    }

    /* ========================================
       RESIZABLE STYLING
       ======================================== */
    :host([resizable]) {
      resize: both;
      overflow: auto;
      min-width: 200px;
      min-height: 100px;
    }

    :host([resizable]) .t-pnl {
      height: 100%;
    }

    /* ========================================
       DRAGGABLE STYLING
       ======================================== */
    :host([draggable]) .t-pnl__header {
      cursor: move;
    }

    :host([draggable][dragging]) {
      opacity: 0.8;
      z-index: 1000;
    }

    /* ========================================
       RESPONSIVE DESIGN
       ======================================== */
    @media (max-width: 768px) {
      .t-pnl__status-bar {
        flex-wrap: wrap;
        min-height: auto;
        padding: var(--spacing-sm);
      }

      .t-pnl__error,
      .t-pnl__empty {
        min-height: 80px;
        padding: var(--spacing-md);
      }

      .t-pnl--slide {
        width: 100vw;
        right: -100vw;
      }

      .t-pnl--slide.is-active {
        right: 0;
      }
    }

    /* ========================================
       ANIMATIONS
       ======================================== */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* ========================================
       SLOT STYLING
       ======================================== */
    .t-pnl__slot {
      display: contents;
    }

    /* Hide content when no slots are provided */
    :host(:not([title])) .t-pnl__header {
      display: none;
    }

    :host([variant="headless"]) .t-pnl__header {
      display: none !important;
    }

    :host([variant="headless"]) .t-pnl__body {
      border: none;
      background: transparent;
    }
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
    loading: { type: Boolean },
    resizable: { type: Boolean },
    draggable: { type: Boolean },
    icon: { type: String }
  };

  /* ========================================
     LIFECYCLE METHODS
     ======================================== */
  constructor() {
    super();

    // Initialize properties
    this.title = '';
    this.variant = 'standard'; // standard, control, slide, headless
    this.collapsible = false;
    this.collapsed = false;
    this.compact = false;
    this.loading = false;
    this.resizable = false;
    this.draggable = false;
    this.icon = '';

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
        ${this._renderStatusBar()}
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
    const chevronIcon = `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12 8.72 6.28a.75.75 0 1 1 1.06-1.06l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z"/>
    </svg>`;

    return html`
      <button
        class="t-pnl__collapse-btn"
        @click=${this._handleCollapseClick}
        tabindex="-1"
        aria-label=${this.collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <span class="t-pnl__collapse-icon" .innerHTML=${chevronIcon}></span>
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

    return html`
      <div class="t-pnl__footer" style="display: none;">
        <slot name="footer"></slot>
      </div>
    `;
  }

  _renderStatusBar() {
    if (this.collapsed) {
      return '';
    }

    return html`
      <div class="t-pnl__status-bar" style="display: none;">
        <div class="t-pnl__status-content">
          <slot name="status"></slot>
        </div>
      </div>
    `;
  }

  /* ========================================
     EVENT HANDLERS
     ======================================== */
  _handleHeaderClick(e) {
    if (!this.collapsible || e.target.closest('.t-pnl__actions') || e.target.closest('.t-pnl__collapse-btn')) {
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

  /* ========================================
     UPDATED LIFECYCLE
     ======================================== */
  updated(changedProperties) {
    super.updated(changedProperties);

    // Show/hide footer and status bar based on slot content
    if (changedProperties.has('collapsed') || this.hasUpdated) {
      this._updateSlotVisibility();
    }
  }

  _updateSlotVisibility() {
    const footerSlot = this.shadowRoot?.querySelector('slot[name="footer"]');
    const statusSlot = this.shadowRoot?.querySelector('slot[name="status"]');
    const footerContainer = this.shadowRoot?.querySelector('.t-pnl__footer');
    const statusContainer = this.shadowRoot?.querySelector('.t-pnl__status-bar');

    if (footerSlot && footerContainer) {
      const hasFooterContent = footerSlot.assignedElements().length > 0;
      footerContainer.style.display = hasFooterContent ? 'flex' : 'none';
    }

    if (statusSlot && statusContainer) {
      const hasStatusContent = statusSlot.assignedElements().length > 0;
      statusContainer.style.display = hasStatusContent ? 'flex' : 'none';
    }
  }
}

// Register the custom element
customElements.define('t-panel', TPanelLit);
// Register the second alias
customElements.define('t-pnl', TPanelLit);

// Export for use
export default TPanelLit;