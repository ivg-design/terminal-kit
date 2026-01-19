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
 * @component TStatusFieldLit
 * @tagname t-sta-field
 * @description Simple status field component for use within status bars
 * @category Display
 * @since 1.0.0
 * @example
 * <t-sta-field label="CPU" value="42%" width="20%" align="left"></t-sta-field>
 */
export class TStatusFieldLit extends LitElement {

  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-sta-field';
  static version = '1.0.0';
  static category = 'Display';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--terminal-green, #00ff41);
      font-family: var(--terminal-font, 'IBM Plex Mono', monospace);
      font-size: var(--terminal-font-size, 14px);
      white-space: nowrap;
      overflow: hidden;
    }

    :host([align="center"]) {
      justify-content: center;
    }

    :host([align="right"]) {
      justify-content: flex-end;
    }

    .field-icon {
      display: inline-flex;
      align-items: center;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .field-icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .field-label {
      color: var(--terminal-green-dim, #00ff4180);
      flex-shrink: 0;
    }

    .field-value {
      color: var(--terminal-green, #00ff41);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  /**
   * @property {string} label - Field label text
   * @default ''
   * @attribute label
   * @reflects true
   */
  static properties = {
    /**
     * @property {string} label - Field label text
     * @default ''
     * @attribute label
     * @reflects true
     */
    label: { type: String, reflect: true },

    /**
     * @property {string} value - Field value text
     * @default ''
     * @attribute value
     * @reflects true
     */
    value: { type: String, reflect: true },

    /**
     * @property {string} icon - Optional icon SVG string
     * @default ''
     * @attribute icon
     */
    icon: { type: String },

    /**
     * @property {string} width - CSS width value
     * @default 'auto'
     * @attribute width
     * @reflects true
     */
    width: { type: String, reflect: true },

    /**
     * @property {('left'|'center'|'right')} align - Text alignment
     * @default 'left'
     * @attribute align
     * @reflects true
     */
    align: { type: String, reflect: true }
  };

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE)
  // ----------------------------------------------------------
  /** @private */
  _context = null;

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
    this._logger = componentLogger.for('TStatusFieldLit');

    // Log construction
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.label = '';
    this.value = '';
    this.icon = '';
    this.width = 'auto';
    this.align = 'left';
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

    // Set width style if specified
    if (this.width && this.width !== 'auto') {
      this.style.width = this.width;
    }
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

    // Update width style if changed
    if (changedProperties.has('width')) {
      if (this.width && this.width !== 'auto') {
        this.style.width = this.width;
      } else {
        this.style.width = '';
      }
    }
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (NONE FOR DISPLAY PROFILE)
  // ----------------------------------------------------------
  // No public methods for DISPLAY profile

  // ----------------------------------------------------------
  // BLOCK 9: EVENT EMITTERS (NONE FOR DISPLAY PROFILE)
  // ----------------------------------------------------------
  // No events for DISPLAY profile

  // ----------------------------------------------------------
  // BLOCK 10: NESTING SUPPORT (NOT NEEDED)
  // ----------------------------------------------------------
  // Not a container component

  /**
   * Receive context from parent
   * @public
   * @param {Object} context
   */
  receiveContext(context) {
    this._context = context;
    this._logger.debug('Received context from parent', { context });
  }

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION (NOT NEEDED)
  // ----------------------------------------------------------
  // No validation needed for DISPLAY profile

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Render component template
   * @returns {TemplateResult}
   */
  render() {
    this._logger.trace('Rendering');

    return html`
      ${this.icon ? html`
        <span class="field-icon">${this._unsafeHTML(this.icon)}</span>
      ` : ''}
      ${this.label ? html`
        <span class="field-label">${this.label}:</span>
      ` : ''}
      <span class="field-value">${this.value || ''}</span>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  /** @private */
  _unsafeHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TStatusFieldLit.tagName)) {
  customElements.define(TStatusFieldLit.tagName, TStatusFieldLit);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================
export const TStatusFieldManifest = generateManifest(TStatusFieldLit);

// ============================================================
// SECTION 5: EXPORTS (class already exported via declaration)
// ============================================================
// TStatusFieldLit exported via 'export class' declaration