// ============================================
// SECTION 1: IMPORTS
// ============================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import {
  userCircleIcon,
  gearSixIcon,
  signOutIcon,
  folderUserIcon,
  caretDownIcon,
  tableIcon
} from '../utils/phosphor-icons.js';

// ============================================
// SECTION 2: COMPONENT CLASS
// ============================================

/**
 * Terminal User Menu Component
 *
 * @component TUserMenuLit
 * @tagname t-usr
 * @description Dropdown menu triggered by user badge click with avatar, user info, and customizable menu items
 * @category Navigation
 * @since 1.0.0
 * @example
 * <t-usr user-name="John Doe" user-email="john@example.com">
 * </t-usr>
 */
export class TUserMenuLit extends LitElement {

  // ============================================
  // BLOCK 1: Static Metadata (REQUIRED)
  // ============================================
  static tagName = 't-usr';
  static version = '1.0.0';
  static category = 'Navigation';

  // ============================================
  // BLOCK 2: Static Styles (REQUIRED)
  // ============================================
  static styles = css`
    :host {
      --terminal-bg: var(--tk-bg, #0a0a0a);
      --terminal-black: var(--tk-black, #0a0a0a);
      --terminal-green: var(--tk-green, #00ff41);
      --terminal-green-bright: var(--tk-green-bright, #33ff66);
      --terminal-green-dim: var(--tk-green-dim, #00cc33);
      --terminal-green-dark: var(--tk-green-dark, #008820);
      --terminal-gray: var(--tk-gray, #808080);
      --terminal-gray-dark: var(--tk-gray-dark, #242424);
      --terminal-gray-darkest: var(--tk-gray-darkest, #1a1a1a);
      --terminal-gray-light: var(--tk-gray-light, #333333);
      --font-mono: var(--tk-font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
      --font-size-xs: var(--tk-font-size-xs, 10px);
      --font-size-sm: var(--tk-font-size-sm, 11px);
      --font-size-md: var(--tk-font-size-md, 14px);
      --spacing-xs: var(--tk-spacing-xs, 4px);
      --spacing-sm: var(--tk-spacing-sm, 8px);
      --spacing-md: var(--tk-spacing-md, 12px);

      position: relative;
      display: inline-block;
      font-family: var(--font-mono);
    }

    .user-menu-container {
      position: relative;
    }

    /* User Badge Button */
    .user-badge {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--terminal-gray-dark);
      border: 1px solid var(--terminal-green-dim);
      color: var(--terminal-green);
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 4px;
      min-height: 36px;
    }

    .user-badge:hover:not(:disabled) {
      background: var(--terminal-gray);
      border-color: var(--terminal-green-dark);
    }

    .user-badge:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Avatar and Initials */
    .user-avatar,
    .user-initials {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .user-avatar {
      object-fit: cover;
      border: 1px solid var(--terminal-green-dark);
    }

    .user-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--terminal-green-dark);
      color: var(--terminal-black);
      font-weight: bold;
      font-size: var(--font-size-xs);
    }

    /* User Info in Badge */
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
    }

    .user-name {
      font-weight: 500;
      color: var(--terminal-green);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-name-initials {
      display: none;
    }

    /* Chevron Icon */
    .chevron-icon {
      margin-left: auto;
      transition: transform 0.2s ease;
      color: var(--terminal-green-dim);
      width: 12px;
      height: 12px;
    }

    .chevron-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    :host([open]) .chevron-icon {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .menu-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      min-width: 240px;
      background: var(--terminal-gray-darkest);
      border: 1px solid var(--terminal-green-dark);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1000;
      border-radius: 4px;
      overflow: hidden;
    }

    :host([open]) .menu-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Menu Header */
    .menu-header {
      padding: var(--spacing-md);
      background: var(--terminal-gray-dark);
      border-bottom: 1px solid var(--terminal-gray-light);
    }

    .menu-user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .menu-avatar,
    .menu-initials {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .menu-avatar {
      object-fit: cover;
      border: 2px solid var(--terminal-green-dark);
    }

    .menu-initials {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--terminal-green-dark);
      color: var(--terminal-black);
      font-weight: bold;
      font-size: var(--font-size-md);
    }

    .menu-user-details {
      flex: 1;
      min-width: 0;
    }

    .menu-user-name {
      font-weight: 500;
      color: var(--terminal-green);
      font-size: var(--font-size-sm);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .menu-user-email {
      font-size: var(--font-size-xs);
      color: var(--terminal-green-dim);
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Menu Content */
    .menu-content {
      padding: var(--spacing-xs) 0;
      background: var(--terminal-gray-dark);
    }

    /* Menu Items */
    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--terminal-green);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }

    .menu-item:hover {
      background: var(--terminal-gray);
      color: var(--terminal-green-bright);
    }

    .menu-item:active {
      background: var(--terminal-gray-light);
    }

    .menu-item-icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .menu-item-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .menu-item-label {
      flex: 1;
    }

    /* Menu Separator */
    .menu-separator {
      height: 1px;
      background: var(--terminal-gray-light);
      margin: var(--spacing-xs) 0;
    }

    /* Compact mode */
    :host([compact]) .user-name-full {
      display: none;
    }

    :host([compact]) .user-name-initials {
      display: inline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .user-name-full {
        display: none;
      }
      .user-name-initials {
        display: inline;
      }
    }

    @media (max-width: 480px) {
      .menu-dropdown {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        min-width: 100%;
        border-radius: 8px 8px 0 0;
        transform: translateY(100%);
      }

      :host([open]) .menu-dropdown {
        transform: translateY(0);
      }
    }

    /* Animation for menu items */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host([open]) .menu-item {
      animation: fadeInUp 0.3s ease forwards;
    }

    :host([open]) .menu-item:nth-child(1) { animation-delay: 0.05s; }
    :host([open]) .menu-item:nth-child(2) { animation-delay: 0.1s; }
    :host([open]) .menu-item:nth-child(3) { animation-delay: 0.15s; }
    :host([open]) .menu-item:nth-child(4) { animation-delay: 0.2s; }
    :host([open]) .menu-item:nth-child(5) { animation-delay: 0.25s; }
  `;

  // ============================================
  // BLOCK 3: Reactive Properties (REQUIRED)
  // ============================================

  /**
   * @property {string} userName - User's display name
   * @default 'User'
   * @attribute user-name
   * @reflects true
   */
  static properties = {
    userName: {
      type: String,
      reflect: true,
      attribute: 'user-name'
    },

    /**
     * @property {string} userEmail - User's email address
     * @default ''
     * @attribute user-email
     * @reflects true
     */
    userEmail: {
      type: String,
      reflect: true,
      attribute: 'user-email'
    },

    /**
     * @property {string} userAvatar - URL to user's avatar image
     * @default ''
     * @attribute user-avatar
     * @reflects false
     */
    userAvatar: {
      type: String,
      attribute: 'user-avatar'
    },

    /**
     * @property {boolean} disabled - Whether the menu is disabled
     * @default false
     * @attribute disabled
     * @reflects true
     */
    disabled: {
      type: Boolean,
      reflect: true
    },

    /**
     * @property {boolean} open - Whether the menu is open
     * @default false
     * @attribute open
     * @reflects true
     */
    open: {
      type: Boolean,
      reflect: true
    },

    /**
     * @property {Array} menuItems - Custom menu items array
     * @default []
     */
    menuItems: {
      type: Array
    },

    /**
     * @property {boolean} compact - Whether to show in compact/mobile mode (initials only)
     * @default false
     * @attribute compact
     * @reflects true
     */
    compact: {
      type: Boolean,
      reflect: true
    }
  };

  // ============================================
  // BLOCK 4: Internal State (REQUIRED)
  // ============================================

  /** @private */
  _documentListeners = new Map();

  /** @private */
  _defaultMenuItems = [
    { id: 'profile', label: 'Profile', icon: userCircleIcon },
    { id: 'files', label: 'User Files', icon: folderUserIcon },
    { id: 'settings', label: 'Settings', icon: gearSixIcon },
    { type: 'separator' },
    { id: 'logout', label: 'Sign Out', icon: signOutIcon }
  ];

  /** @private */
  _iconMap = {
    'user': userCircleIcon,
    'userCircle': userCircleIcon,
    'gear': gearSixIcon,
    'settings': gearSixIcon,
    'signOut': signOutIcon,
    'logout': signOutIcon,
    'folder': folderUserIcon,
    'files': folderUserIcon,
    'grid': tableIcon,
    'dashboard': tableIcon,
    'users': userCircleIcon  // Using userCircle as fallback for users
  };

  // ============================================
  // BLOCK 5: Logger Instance (REQUIRED)
  // ============================================

  /** @private */
  _logger = null;

  // ============================================
  // BLOCK 6: Constructor (REQUIRED)
  // ============================================

  constructor() {
    super();

    // Initialize logger
    this._logger = new componentLogger(TUserMenuLit.tagName, this);
    this._logger.debug('Component constructed');

    // Initialize properties
    this.userName = 'User';
    this.userEmail = '';
    this.userAvatar = '';
    this.disabled = false;
    this.open = false;
    this.menuItems = [];
    this.compact = false;

    // Bind event handlers
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleEscape = this._handleEscape.bind(this);
  }

  // ============================================
  // BLOCK 7: Lifecycle Methods (REQUIRED - in order)
  // ============================================

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

    // Cleanup document listeners
    this._removeDocumentListeners();
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });
  }

  /**
   * Called after every render
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', { changedProperties });

    // Handle open state changes
    if (changedProperties.has('open')) {
      if (this.open) {
        this._addDocumentListeners();
      } else {
        this._removeDocumentListeners();
      }
    }
  }

  // ============================================
  // BLOCK 8: Public API Methods (REQUIRED SECTION)
  // ============================================

  /**
   * Open the menu dropdown
   * @public
   * @fires TUserMenuLit#menu-open
   */
  openMenu() {
    this._logger.debug('openMenu() called');

    if (this.disabled) {
      this._logger.warn('Cannot open menu - component is disabled');
      return;
    }

    this.open = true;
    this._emitEvent('menu-open');
  }

  /**
   * Close the menu dropdown
   * @public
   * @fires TUserMenuLit#menu-close
   */
  closeMenu() {
    this._logger.debug('closeMenu() called');

    this.open = false;
    this._emitEvent('menu-close');
  }

  /**
   * Toggle menu open/close state
   * @public
   */
  toggleMenu() {
    this._logger.debug('toggleMenu() called');

    if (this.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Set custom menu items
   * @public
   * @param {Array} items - Array of menu item objects
   */
  setMenuItems(items) {
    this._logger.debug('setMenuItems() called', { items });

    if (!Array.isArray(items)) {
      this._logger.error('setMenuItems requires an array', { items });
      throw new Error('Menu items must be an array');
    }

    // Map string icon names to actual SVG icons
    this.menuItems = items.map(item => {
      if (item.icon && typeof item.icon === 'string') {
        // If icon is a string name, look it up in the icon map
        const mappedIcon = this._iconMap[item.icon];
        if (mappedIcon) {
          return { ...item, icon: mappedIcon };
        } else if (!item.icon.includes('<svg')) {
          // If it's not an SVG string and not in the map, remove the icon
          this._logger.warn(`Unknown icon name: ${item.icon}`);
          const { icon, ...itemWithoutIcon } = item;
          return itemWithoutIcon;
        }
      }
      return item;
    });
  }

  /**
   * Update user information
   * @public
   * @param {Object} info - User info object with name, email, and/or avatar
   */
  setUserInfo(info) {
    this._logger.debug('setUserInfo() called', { info });

    if (info.name !== undefined) {
      this.userName = info.name;
    }
    if (info.email !== undefined) {
      this.userEmail = info.email;
    }
    if (info.avatar !== undefined) {
      this.userAvatar = info.avatar;
    }
  }

  // ============================================
  // BLOCK 9: Event Emitters (REQUIRED SECTION)
  // ============================================

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
   * @event TUserMenuLit#menu-select
   * @type {CustomEvent<{itemId: string}>}
   * @description Fired when a menu item is selected
   * @property {string} detail.itemId - ID of the selected menu item
   * @bubbles true
   * @composed true
   */

  /**
   * @event TUserMenuLit#menu-open
   * @type {CustomEvent}
   * @description Fired when the menu opens
   * @bubbles true
   * @composed true
   */

  /**
   * @event TUserMenuLit#menu-close
   * @type {CustomEvent}
   * @description Fired when the menu closes
   * @bubbles true
   * @composed true
   */

  // ============================================
  // BLOCK 10: Nesting Support - NOT NEEDED
  // ============================================
  // Component does not support nesting

  // ============================================
  // BLOCK 11: Validation - NOT NEEDED
  // ============================================
  // No validation required per spec

  // ============================================
  // BLOCK 12: Render Method (REQUIRED)
  // ============================================

  /**
   * Render component template
   * @returns {TemplateResult}
   */
  render() {
    this._logger.trace('Rendering');

    const initials = this._generateInitials(this.userName);
    const displayMenuItems = this.menuItems.length > 0 ? this.menuItems : this._defaultMenuItems;

    return html`
      <div class="user-menu-container">
        <button
          class="user-badge"
          ?disabled=${this.disabled}
          @click=${this._handleBadgeClick}
          aria-expanded=${this.open}
          aria-haspopup="true"
        >
          ${this.userAvatar ?
            html`<img src=${this.userAvatar} alt=${this.userName} class="user-avatar">` :
            html`<div class="user-initials">${initials}</div>`
          }
          <div class="user-info">
            <span class="user-name user-name-full">${this.userName}</span>
            <span class="user-name user-name-initials">${initials}</span>
          </div>
          <span class="chevron-icon">${unsafeHTML(caretDownIcon)}</span>
        </button>

        <div class="menu-dropdown" role="menu">
          <div class="menu-header">
            <div class="menu-user-info">
              ${this.userAvatar ?
                html`<img src=${this.userAvatar} alt=${this.userName} class="menu-avatar">` :
                html`<div class="menu-initials">${initials}</div>`
              }
              <div class="menu-user-details">
                <div class="menu-user-name">${this.userName}</div>
                ${this.userEmail ? html`<div class="menu-user-email">${this.userEmail}</div>` : ''}
              </div>
            </div>
          </div>
          <div class="menu-content">
            ${displayMenuItems.map(item => this._renderMenuItem(item))}
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // BLOCK 13: Private Helpers (LAST)
  // ============================================

  /** @private */
  _renderMenuItem(item) {
    if (item.type === 'separator') {
      return html`<div class="menu-separator"></div>`;
    }

    return html`
      <div
        class="menu-item"
        role="menuitem"
        @click=${() => this._handleMenuItemClick(item.id)}
      >
        ${item.icon ? html`<span class="menu-item-icon">${unsafeHTML(item.icon)}</span>` : ''}
        <span class="menu-item-label">${item.label}</span>
      </div>
    `;
  }

  /** @private */
  _generateInitials(name) {
    if (!name) return 'U';

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /** @private */
  _handleBadgeClick(e) {
    e.stopPropagation();
    this._logger.debug('Badge clicked');

    if (!this.disabled) {
      this.toggleMenu();
    }
  }

  /** @private */
  _handleMenuItemClick(itemId) {
    this._logger.debug('Menu item clicked', { itemId });

    this._emitEvent('menu-select', { itemId });
    this.closeMenu();
  }

  /** @private */
  _handleClickOutside(e) {
    if (!this.contains(e.target)) {
      this._logger.debug('Click outside detected');
      this.closeMenu();
    }
  }

  /** @private */
  _handleEscape(e) {
    if (e.key === 'Escape') {
      this._logger.debug('Escape key pressed');
      this.closeMenu();
    }
  }

  /** @private */
  _addDocumentListeners() {
    if (!this._documentListeners.has('click')) {
      document.addEventListener('click', this._handleClickOutside);
      this._documentListeners.set('click', this._handleClickOutside);
      this._logger.trace('Added click outside listener');
    }

    if (!this._documentListeners.has('keydown')) {
      document.addEventListener('keydown', this._handleEscape);
      this._documentListeners.set('keydown', this._handleEscape);
      this._logger.trace('Added escape key listener');
    }
  }

  /** @private */
  _removeDocumentListeners() {
    this._documentListeners.forEach((handler, event) => {
      document.removeEventListener(event, handler);
      this._logger.trace('Removed document listener', { event });
    });
    this._documentListeners.clear();
  }
}

// ============================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================
if (!customElements.get(TUserMenuLit.tagName)) {
  customElements.define(TUserMenuLit.tagName, TUserMenuLit);
}

// ============================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================
export const TUserMenuManifest = generateManifest(TUserMenuLit, {
  tagName: 't-usr',
  displayName: 'User Menu',
  description: 'Dropdown menu triggered by user badge click with avatar, user info, and customizable menu items',
  methods: {
    openMenu: {
      description: 'Open the menu dropdown',
      params: [],
      returns: 'void'
    },
    closeMenu: {
      description: 'Close the menu dropdown',
      params: [],
      returns: 'void'
    },
    toggleMenu: {
      description: 'Toggle menu open/close state',
      params: [],
      returns: 'void'
    },
    setMenuItems: {
      description: 'Set custom menu items',
      params: [
        { name: 'items', type: 'Array', description: 'Array of menu item objects' }
      ],
      returns: 'void'
    },
    setUserInfo: {
      description: 'Update user information',
      params: [
        { name: 'info', type: 'Object', description: 'User info object with name, email, and/or avatar' }
      ],
      returns: 'void'
    }
  },
  events: {
    'menu-select': {
      description: 'Fired when a menu item is selected',
      detail: {
        itemId: {
          type: 'string',
          description: 'ID of the selected menu item'
        }
      }
    },
    'menu-open': {
      description: 'Fired when the menu opens',
      detail: {}
    },
    'menu-close': {
      description: 'Fired when the menu closes',
      detail: {}
    }
  }
});

// ============================================
// SECTION 5: EXPORTS
// ============================================
export default TUserMenuLit;