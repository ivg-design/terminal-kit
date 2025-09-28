// ============================================
// SECTION 1: IMPORTS
// ============================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import {
  caretDownIcon,
  caretRightIcon,
  folderIcon,
  folderOpenIcon,
  fileIcon,
  infoIcon,
  magnifyingGlassIcon
} from '../utils/phosphor-icons.js';

// ============================================
// SECTION 2: COMPONENT CLASS
// ============================================
/**
 * @component TDropdownLit
 * @tagname t-drp
 * @description Nested dropdown with tree structure, search, and folder navigation
 * @category Form Controls
 * @since 1.0.0
 * @example
 * <t-drp
 *   placeholder="Select..."
 *   search="true"
 *   icons="true"
 *   @change="${(e) => console.log(e.detail.value)}"
 * ></t-drp>
 */
export class TDropdownLit extends LitElement {
  // ============================================
  // BLOCK 1: Static Metadata
  // ============================================
  static tagName = 't-drp';
  static version = '1.0.0';
  static category = 'Form Controls';

  // ============================================
  // BLOCK 2: Static Styles
  // ============================================
  static styles = css`
    :host {
      display: inline-block;
      --dropdown-width: 300px;
      --dropdown-bg: var(--terminal-gray-dark, #242424);
      --dropdown-border: var(--terminal-gray-light, #333333);
      --dropdown-text: var(--terminal-green, #00ff41);
      --dropdown-text-dim: var(--terminal-green-dim, #00cc33);
      --dropdown-bg-hover: var(--terminal-gray-medium, #2a2a2a);
      --dropdown-shadow: rgba(0, 255, 65, 0.2);
      --dropdown-panel-bg: var(--terminal-black, #0a0a0a);
      --dropdown-search-bg: var(--terminal-gray-darkest, #1a1a1a);
      --dropdown-scrollbar-bg: var(--terminal-gray-darkest, #1a1a1a);
    }

    /* Container */
    .nested-dropdown-container {
      position: relative;
      display: inline-block;
      width: var(--dropdown-width);
      max-width: 100%;
    }

    /* Button */
    .nested-dropdown-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      min-width: 200px;
      height: 32px;
      padding: 4px 12px;
      background-color: var(--dropdown-bg);
      border: 1px solid var(--dropdown-border);
      color: var(--dropdown-text);
      font-family: var(--font-mono, 'SF Mono', Monaco, monospace);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 2px;
    }

    /* Compact variant */
    :host([compact]) .nested-dropdown-button {
      height: 24px;
      padding: 2px 8px;
      font-size: 11px;
      min-width: 150px;
    }

    :host([compact]) .nested-dropdown-button .dropdown-arrow {
      width: 10px;
      height: 10px;
    }

    .nested-dropdown-button:hover {
      border-color: var(--dropdown-text);
      background-color: var(--dropdown-bg-hover);
    }

    .nested-dropdown-button:focus {
      outline: none;
      border-color: var(--dropdown-text);
      box-shadow: 0 0 10px var(--dropdown-shadow);
    }

    .nested-dropdown-button.active {
      border-color: var(--dropdown-text);
      box-shadow: 0 0 10px var(--dropdown-shadow);
    }

    .nested-dropdown-button .dropdown-arrow {
      transition: transform 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--dropdown-text-dim);
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    .nested-dropdown-button .dropdown-arrow svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .nested-dropdown-button.active .dropdown-arrow {
      transform: rotate(180deg);
    }

    /* Label */
    .dropdown-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      text-transform: none;
    }

    /* Panel */
    .nested-dropdown-panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      min-width: 100%;
      width: max-content;
      max-width: max(400px, 100%);
      max-height: 400px;
      background-color: var(--dropdown-panel-bg);
      border: 1px solid var(--dropdown-text);
      box-shadow: 0 4px 12px var(--dropdown-shadow);
      z-index: 1000;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 2px;
    }

    .nested-dropdown-panel.hidden {
      display: none;
    }

    /* Search */
    .dropdown-search-wrapper {
      position: relative;
      padding: 8px;
      background-color: var(--dropdown-search-bg);
      border-bottom: 1px solid var(--dropdown-border);
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      width: 100%;
      box-sizing: border-box;
    }

    :host([compact]) .dropdown-search-wrapper {
      padding: 4px;
      gap: 4px;
    }

    .dropdown-search-wrapper .search-icon {
      color: var(--dropdown-text-dim);
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .dropdown-search-wrapper .search-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .dropdown-search-wrapper .dropdown-search {
      flex: 1;
      min-width: 0;
      padding: 4px 8px;
      background-color: var(--dropdown-bg);
      border: 1px solid var(--dropdown-border);
      color: var(--dropdown-text);
      font-family: var(--font-mono, 'SF Mono', Monaco, monospace);
      font-size: 13px;
      border-radius: 2px;
      box-sizing: border-box;
    }

    :host([compact]) .dropdown-search-wrapper .dropdown-search {
      padding: 2px 4px;
      font-size: 11px;
    }

    :host([compact]) .dropdown-search-wrapper .search-icon {
      width: 12px;
      height: 12px;
    }

    .dropdown-search-wrapper .dropdown-search:focus {
      outline: none;
      border-color: var(--dropdown-text);
      box-shadow: 0 0 5px var(--dropdown-shadow);
    }

    /* Tree with scrollbar */
    .dropdown-tree {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;
      padding: 4px;
      scrollbar-width: thin;
      scrollbar-color: var(--dropdown-text) var(--dropdown-scrollbar-bg);
      min-width: 0;
    }

    .dropdown-tree::-webkit-scrollbar {
      width: 8px;
    }

    .dropdown-tree::-webkit-scrollbar-track {
      background: var(--dropdown-scrollbar-bg);
      border-radius: 4px;
    }

    .dropdown-tree::-webkit-scrollbar-thumb {
      background: var(--dropdown-text);
      border-radius: 4px;
      opacity: 0.5;
    }

    .dropdown-tree::-webkit-scrollbar-thumb:hover {
      background: var(--dropdown-text);
      opacity: 0.8;
    }

    /* Tree items */
    .tree-item {
      user-select: none;
    }

    .tree-folder {
      margin: 2px 0;
    }

    .folder-header,
    .tree-file {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-radius: 2px;
      font-size: 13px;
      color: var(--dropdown-text);
      line-height: 1.2;
      min-height: 24px;
    }

    :host([compact]) .folder-header,
    :host([compact]) .tree-file {
      padding: 2px 6px;
      font-size: 11px;
      min-height: 20px;
      gap: 4px;
    }

    :host([compact]) .folder-arrow,
    :host([compact]) .folder-icon,
    :host([compact]) .file-icon,
    :host([compact]) .info-icon {
      width: 12px;
      height: 12px;
    }

    :host([compact]) .folder-count {
      font-size: 10px;
    }

    .folder-header:hover,
    .tree-file:hover {
      background-color: var(--dropdown-bg);
    }

    .folder-header.selected,
    .tree-file.selected {
      background-color: var(--dropdown-bg-hover);
      color: var(--terminal-green-bright, #00ff65);
    }

    .folder-arrow,
    .folder-icon,
    .file-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .folder-arrow svg,
    .folder-icon svg,
    .file-icon svg,
    .info-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
    }

    .folder-arrow {
      color: var(--dropdown-text-dim);
    }

    .folder-icon {
      color: var(--dropdown-text);
    }

    .file-icon {
      color: var(--dropdown-text-dim);
    }

    .folder-name,
    .file-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .folder-count {
      font-size: 11px;
      color: var(--dropdown-text-dim);
      margin-left: auto;
      padding: 0 4px;
    }

    .folder-content {
      padding-left: 16px;
      overflow: hidden;
      transition: max-height 0.3s ease;
      max-height: 500px;
    }

    .folder-content.collapsed {
      max-height: 0;
    }

    .info-icon {
      width: 14px;
      height: 14px;
      color: var(--dropdown-text-dim);
      opacity: 0.6;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
    }

    .info-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .tree-file:hover .info-icon {
      opacity: 1;
    }

    .no-results {
      padding: 20px;
      text-align: center;
      color: var(--dropdown-text-dim);
      font-size: 13px;
    }

    /* Disabled state */
    .nested-dropdown-container.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .nested-dropdown-container.disabled .nested-dropdown-button {
      cursor: not-allowed;
      background-color: var(--dropdown-search-bg);
    }
  `;

  // ============================================
  // BLOCK 3: Reactive Properties
  // ============================================

  /**
   * @property {string} placeholder - Placeholder text
   * @default 'Select...'
   * @attribute placeholder
   * @reflects true
   */
  static properties = {
    placeholder: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    value: { type: String },
    width: { type: String },
    searchable: { type: Boolean, reflect: true },
    showIcons: { type: Boolean, reflect: true },
    options: { type: Array },
    compact: { type: Boolean, reflect: true },
    data: { type: Object },
    metadata: { type: Object },

    // Internal state
    _isOpen: { type: Boolean, state: true },
    _searchTerm: { type: String, state: true },
    _folderStates: { type: Object, state: true },
    _selectedValue: { type: String, state: true }
  };

  // ============================================
  // BLOCK 4: Internal State
  // ============================================

  /** @private */
  _searchDebounceTimer = null;

  /** @private */
  _initialized = false;

  /** @private */
  _timers = new Set();

  /** @private */
  _documentListeners = new Map();

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
    this._logger = componentLogger.for(TDropdownLit.tagName);
    this._logger.debug('Component constructed');

    // Initialize public properties
    this.placeholder = 'Select...';
    this.disabled = false;
    this.value = '';
    this.width = '300px';
    this.searchable = true;
    this.showIcons = true;
    this.options = [];
    this.compact = false;
    this.data = null;
    this.metadata = {};

    // Initialize internal state
    this._isOpen = false;
    this._searchTerm = '';
    this._folderStates = {};
    this._selectedValue = '';
    this._searchDebounceTimer = null;
    this._initialized = false;
    this._timers = new Set();
    this._documentListeners = new Map();

    // Bind event handlers
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._handleContainerClick = this._handleContainerClick.bind(this);
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

    this.addEventListener('click', this._handleContainerClick);

    // Setup document listener with cleanup pattern
    this._addDocumentListener('click', this._handleOutsideClick);

    // Handle string "false" values from HTML attributes
    if (this.getAttribute('showIcons') === 'false' || this.getAttribute('icons') === 'false') {
      this.showIcons = false;
    }
    if (this.getAttribute('searchable') === 'false' || this.getAttribute('search') === 'false') {
      this.searchable = false;
    }
    if (this.getAttribute('compact') === 'true') {
      this.compact = true;
    }

    // Initialize selected value from attribute
    if (this.value) {
      this._selectedValue = this.value;
    }

    // Mark as initialized after first render
    this.updateComplete.then(() => {
      this._initialized = true;
    });
  }

  /**
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');

    // Clean up timers
    this._timers.forEach(timer => clearTimeout(timer));
    this._timers.clear();

    // Clean up document listeners
    this._documentListeners.forEach((handler, event) => {
      document.removeEventListener(event, handler);
    });
    this._documentListeners.clear();

    // Clean up search timer
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  }

  /**
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);
    this._logger.debug('First update complete', {
      properties: Array.from(changedProperties.keys())
    });
  }

  /**
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated?.(changedProperties);
    this._logger.trace('Updated', {
      properties: Array.from(changedProperties.keys())
    });
  }

  /**
   * @lifecycle
   * @param {Map} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('width')) {
      this.style.setProperty('--dropdown-width', this.width);
    }
    if (changedProperties.has('value')) {
      this._selectedValue = this.value;
    }
    if (changedProperties.has('compact')) {
      if (this.compact) {
        this.setAttribute('compact', '');
      } else {
        this.removeAttribute('compact');
      }
    }
  }

  // ============================================
  // BLOCK 8: Public API Methods
  // ============================================
  /**
   * Load data into dropdown
   * @public
   * @param {Object} data - Tree structure data
   */
  loadData(data) {
    this._logger.debug('loadData called', { data });
    this.data = data;
    this.requestUpdate();
  }

  /**
   * Set metadata for files
   * @public
   * @param {Object} metadata - Metadata object
   */
  setMetadata(metadata) {
    this._logger.debug('setMetadata called', { metadata });
    this.metadata = metadata;
    this.requestUpdate();
  }

  /**
   * Set dropdown value programmatically
   * @public
   * @param {string} value - Value to set
   */
  setValue(value) {
    this._logger.debug('setValue called', { value });
    this._selectedValue = value;
    this.value = value;
    this.requestUpdate();
  }

  /**
   * Get current value
   * @public
   * @returns {string} Current value
   */
  getValue() {
    this._logger.debug('getValue called');
    return this._selectedValue;
  }

  /**
   * Open dropdown
   * @public
   * @fires dropdown-open
   */
  open() {
    this._logger.debug('open called');
    if (!this.disabled && !this._isOpen) {
      this._isOpen = true;
      this._emitEvent('dropdown-open', {});

      // Focus search input when opened
      this.updateComplete.then(() => {
        const searchInput = this.shadowRoot?.querySelector('.dropdown-search');
        if (searchInput) {
          searchInput.focus();
        }
      });
    }
  }

  /**
   * Close dropdown
   * @public
   * @fires dropdown-close
   */
  close() {
    this._logger.debug('close called');
    if (this._isOpen) {
      this._isOpen = false;
      this._searchTerm = '';
      this._emitEvent('dropdown-close', {});
    }
  }

  /**
   * Toggle dropdown state
   * @public
   */
  toggle() {
    this._logger.debug('toggle called');
    this._isOpen ? this.close() : this.open();
  }

  /**
   * Reset dropdown state
   * @public
   */
  reset() {
    this._logger.debug('reset called');
    this._selectedValue = '';
    this.value = '';
    this._searchTerm = '';
    this._folderStates = {};
    this._isOpen = false;
    this.requestUpdate();
  }

  /**
   * Set dropdown options
   * @public
   * @param {Array} options - Array of options
   */
  setOptions(options) {
    this._logger.debug('setOptions called', { options });
    this.options = options;
    // Convert options array to tree structure for compatibility
    if (Array.isArray(options) && options.length > 0) {
      this.data = {
        files: options.map(opt =>
          typeof opt === 'string' ? opt : (opt.label || opt.value)
        )
      };
    }
    this.requestUpdate();
  }

  // ============================================
  // BLOCK 9: Event Emitters
  // ============================================
  /**
   * Emit custom event
   * @private
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   * @fires {eventName}
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
  // BLOCK 10: Nesting Support (not applicable - not a container)
  // ============================================

  // ============================================
  // BLOCK 11: Validation
  // ============================================
  /**
   * Get validation for property
   * @public
   * @param {string} propertyName - Property to validate
   * @returns {Object} Validation configuration
   */
  static getPropertyValidation(propertyName) {
    const validations = {
      data: {
        required: false,
        validate: (value) => {
          if (!value) return { valid: true, errors: [] };

          const errors = [];

          if (typeof value !== 'object') {
            errors.push('Data must be an object');
          }

          if (value.folders && typeof value.folders !== 'object') {
            errors.push('Folders must be an object');
          }

          if (value.files && !Array.isArray(value.files)) {
            errors.push('Files must be an array');
          }

          return {
            valid: errors.length === 0,
            errors
          };
        }
      },
      width: {
        required: false,
        validate: (value) => {
          const errors = [];

          if (value && !/^\d+(?:px|%|em|rem)?$/.test(value)) {
            errors.push('Width must be a valid CSS unit');
          }

          return {
            valid: errors.length === 0,
            errors
          };
        }
      }
    };

    return validations[propertyName];
  }

  // ============================================
  // BLOCK 12: Render Method
  // ============================================
  /**
   * Render component
   * @returns {TemplateResult}
   */
  render() {
    this._logger.trace('Rendering');

    const displayText = this._selectedValue ?
      this._getDisplayName(this._selectedValue) :
      this.placeholder;

    return html`
      <div class="nested-dropdown-container ${this.disabled ? 'disabled' : ''}">
        <button
          class="nested-dropdown-button ${this._isOpen ? 'active' : ''}"
          @click="${this._toggleDropdown}"
          ?disabled="${this.disabled}"
          aria-expanded="${this._isOpen}"
          aria-haspopup="listbox"
        >
          <span class="dropdown-label">${displayText}</span>
          <span class="dropdown-arrow">
            ${unsafeHTML(caretDownIcon)}
          </span>
        </button>

        <div class="nested-dropdown-panel ${this._isOpen ? '' : 'hidden'}">
          ${this.searchable ? html`
            <div class="dropdown-search-wrapper">
              <span class="search-icon">
                ${unsafeHTML(magnifyingGlassIcon)}
              </span>
              <input
                type="text"
                class="dropdown-search"
                placeholder="Search..."
                .value="${this._searchTerm}"
                @input="${this._handleSearch}"
                @click="${(e) => e.stopPropagation()}"
              />
            </div>
          ` : ''}
          <div class="dropdown-tree">
            ${this._renderTree()}
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // BLOCK 13: Private Helpers
  // ============================================
  /**
   * Render tree structure
   * @private
   * @returns {TemplateResult}
   */
  _renderTree() {
    const data = this._getFilteredData();

    if (!data) {
      return html`<div class="no-results">No data available</div>`;
    }

    if (this._searchTerm && !this._hasResults(data)) {
      return html`<div class="no-results">No matching results found</div>`;
    }

    return html`${this._renderNode(data, '')}`;
  }

  /**
   * Render tree node
   * @private
   * @param {Object} node - Node data
   * @param {string} path - Current path
   * @returns {Array<TemplateResult>}
   */
  _renderNode(node, path) {
    if (!node) return '';

    const templates = [];

    // Render folders
    if (node.folders) {
      Object.entries(node.folders).forEach(([folderName, folderData]) => {
        const folderPath = path ? `${path}/${folderName}` : folderName;
        // Default to collapsed unless explicitly set or initialized
        const isExpanded = this._initialized && this._folderStates[folderPath] === true;
        const fileCount = this._countFiles(folderData);

        templates.push(html`
          <div class="tree-folder">
            <div
              class="folder-header"
              @click="${() => this._toggleFolder(folderPath)}"
            >
              <span class="folder-arrow">
                ${unsafeHTML(isExpanded ? caretDownIcon : caretRightIcon)}
              </span>
              ${this.showIcons ? html`
                <span class="folder-icon">
                  ${unsafeHTML(isExpanded ? folderOpenIcon : folderIcon)}
                </span>
              ` : ''}
              <span class="folder-name">${folderName}</span>
              <span class="folder-count">${fileCount}</span>
            </div>
            <div class="folder-content ${isExpanded ? '' : 'collapsed'}">
              ${this._renderNode(folderData, folderPath)}
            </div>
          </div>
        `);
      });
    }

    // Render files
    if (node.files) {
      node.files.forEach(fileName => {
        const filePath = path ? `${path}/${fileName}` : fileName;
        const isSelected = this._selectedValue === filePath;
        const meta = this.metadata?.[filePath];

        templates.push(html`
          <div
            class="tree-file ${isSelected ? 'selected' : ''}"
            @click="${() => this._selectFile(filePath)}"
            title="${meta ? this._formatMetadata(meta) : fileName}"
          >
            ${this.showIcons ? html`
              <span class="file-icon">
                ${unsafeHTML(fileIcon)}
              </span>
            ` : ''}
            <span class="file-name">${fileName}</span>
            ${meta ? html`
              <span class="info-icon">
                ${unsafeHTML(infoIcon)}
              </span>
            ` : ''}
          </div>
        `);
      });
    }

    return templates;
  }

  /**
   * Get filtered data based on search
   * @private
   * @returns {Object} Filtered data
   */
  _getFilteredData() {
    if (!this.data || !this._searchTerm) {
      return this.data;
    }

    const searchLower = this._searchTerm.toLowerCase();
    return this._filterNode(this.data, searchLower);
  }

  /**
   * Filter node by search term
   * @private
   * @param {Object} node - Node to filter
   * @param {string} searchTerm - Search term
   * @returns {Object} Filtered node
   */
  _filterNode(node, searchTerm) {
    if (!node) return null;

    const filtered = {};
    let hasContent = false;

    // Filter folders
    if (node.folders) {
      filtered.folders = {};
      Object.entries(node.folders).forEach(([folderName, folderData]) => {
        const filteredFolder = this._filterNode(folderData, searchTerm);
        if (filteredFolder || folderName.toLowerCase().includes(searchTerm)) {
          filtered.folders[folderName] = filteredFolder || folderData;
          hasContent = true;
          // Auto-expand folders with search results
          const folderPath = this._getFolderPath(folderName);
          this._folderStates[folderPath] = true;
        }
      });
    }

    // Filter files
    if (node.files) {
      const filteredFiles = node.files.filter(file =>
        file.toLowerCase().includes(searchTerm)
      );
      if (filteredFiles.length > 0) {
        filtered.files = filteredFiles;
        hasContent = true;
      }
    }

    return hasContent ? filtered : null;
  }

  /**
   * Check if results exist
   * @private
   * @param {Object} data - Data to check
   * @returns {boolean} Has results
   */
  _hasResults(data) {
    if (!data) return false;

    if (data.files && data.files.length > 0) return true;

    if (data.folders) {
      return Object.values(data.folders).some(folder => this._hasResults(folder));
    }

    return false;
  }

  /**
   * Count files recursively
   * @private
   * @param {Object} node - Node to count
   * @returns {number} File count
   */
  _countFiles(node) {
    if (!node) return 0;

    let count = 0;

    if (node.files) {
      count += node.files.length;
    }

    if (node.folders) {
      Object.values(node.folders).forEach(folder => {
        count += this._countFiles(folder);
      });
    }

    return count;
  }

  /**
   * Get folder path
   * @private
   * @param {string} folderName - Folder name
   * @returns {string} Folder path
   */
  _getFolderPath(folderName) {
    return folderName;
  }

  /**
   * Toggle dropdown state
   * @private
   * @param {Event} e - Click event
   */
  _toggleDropdown(e) {
    e.stopPropagation();
    if (!this.disabled) {
      this.toggle();
    }
  }

  /**
   * Toggle folder state
   * @private
   * @param {string} folderPath - Folder path
   */
  _toggleFolder(folderPath) {
    this._folderStates = {
      ...this._folderStates,
      [folderPath]: !this._folderStates[folderPath]
    };
    this.requestUpdate();
  }

  /**
   * Select file
   * @private
   * @param {string} filePath - File path
   * @fires change
   */
  _selectFile(filePath) {
    this._selectedValue = filePath;
    this.value = filePath;
    this._isOpen = false;

    this._emitEvent('dropdown-change', {
      value: filePath,
      option: { value: filePath, metadata: this.metadata?.[filePath] }
    });
  }

  /**
   * Handle search input
   * @private
   * @param {Event} e - Input event
   */
  _handleSearch(e) {
    const value = e.target.value;

    // Debounce search
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
    }

    this._searchDebounceTimer = this._setTimeout(() => {
      this._searchTerm = value;
      this.requestUpdate();
    }, 200);
  }

  /**
   * Handle container click
   * @private
   * @param {Event} e - Click event
   */
  _handleContainerClick(e) {
    e.stopPropagation();
  }

  /**
   * Handle outside click
   * @private
   * @param {Event} e - Click event
   */
  _handleOutsideClick(e) {
    if (!this.contains(e.target)) {
      this.close();
    }
  }

  /**
   * Get display name from path
   * @private
   * @param {string} filePath - File path
   * @returns {string} Display name
   */
  _getDisplayName(filePath) {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  }

  /**
   * Format metadata for tooltip
   * @private
   * @param {Object} meta - Metadata
   * @returns {string} Formatted metadata
   */
  _formatMetadata(meta) {
    if (!meta) return '';
    return Object.entries(meta)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  /**
   * Add document listener with cleanup
   * @private
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  _addDocumentListener(event, handler) {
    if (!this._documentListeners.has(event)) {
      document.addEventListener(event, handler);
      this._documentListeners.set(event, handler);
    }
  }

  /**
   * Set timeout with cleanup
   * @private
   * @param {Function} callback - Callback
   * @param {number} delay - Delay in ms
   * @returns {number} Timer ID
   */
  _setTimeout(callback, delay) {
    const timerId = setTimeout(() => {
      this._timers.delete(timerId);
      callback();
    }, delay);
    this._timers.add(timerId);
    return timerId;
  }
}

// ============================================
// SECTION 3: REGISTRATION
// ============================================
if (!customElements.get('t-drp')) {
  customElements.define('t-drp', TDropdownLit);
}

// ============================================
// SECTION 4: EXPORTS
// ============================================
export default TDropdownLit;

/**
 * @event dropdown-change
 * @type {CustomEvent}
 * @property {Object} detail
 * @property {string} detail.value - Selected value
 * @property {Object} detail.option - Selected option with metadata
 * @bubbles
 * @composed
 */

/**
 * @event dropdown-open
 * @type {CustomEvent}
 * @property {Object} detail - Empty object
 * @bubbles
 * @composed
 */

/**
 * @event dropdown-close
 * @type {CustomEvent}
 * @property {Object} detail - Empty object
 * @bubbles
 * @composed
 */