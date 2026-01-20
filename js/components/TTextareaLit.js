// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';

// Prism.js - loaded globally from HTML page
// Expected to be available at window.Prism

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================

/**
 * @component TTextareaLit
 * @tagname t-textarea
 * @description Multiline text input with code editor features including line numbers, IDE keyboard shortcuts, syntax highlighting, and advanced text manipulation
 * @category Form Controls
 * @since 1.0.0
 * @profile FORM-ADVANCED
 * @example
 * <t-textarea placeholder="Enter text..." rows="5"></t-textarea>
 * @example
 * <t-textarea code-mode show-line-numbers rows="15" language="javascript"></t-textarea>
 * @example
 * <t-textarea readonly value="Read-only content"></t-textarea>
 */
export class TTextareaLit extends LitElement {

  // ============================================
  // BLOCK 1: Static Metadata
  // ============================================
  static tagName = 't-textarea';
  static version = '1.0.0';
  static category = 'Form Controls';
  static formAssociated = true;

  // ============================================
  // BLOCK 2: Static Styles
  // ============================================
  static styles = css`
    :host {
      --terminal-black: var(--tk-black, #0a0a0a);
      --terminal-gray-darkest: var(--tk-gray-darkest, #1a1a1a);
      --terminal-gray-dark: var(--tk-gray-dark, #242424);
      --terminal-gray-light: var(--tk-gray-light, #333333);
      --terminal-green: var(--tk-green, #00ff41);
      --terminal-green-dim: var(--tk-green-dim, #00cc33);
      --terminal-green-dark: var(--tk-green-dark, #008820);
      --font-mono: var(--tk-font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace);
      --font-size-sm: var(--tk-font-size-sm, 11px);
      --spacing-xs: var(--tk-spacing-xs, 4px);
      --spacing-sm: var(--tk-spacing-sm, 8px);

      display: block;
      width: 100%;
    }

    .textarea-container {
      position: relative;
      display: flex;
      width: 100%;
      min-height: 28px;
      overflow: hidden;
    }

    :host([code-mode]) .textarea-container {
      border: 1px solid var(--terminal-gray-light);
      background: var(--terminal-black);
      resize: both;
      overflow: hidden;
      max-width: 100%;
    }

    .textarea-container.with-line-numbers {
      /* Line numbers specific styles handled separately */
    }

    .line-numbers {
      display: none;
      background: var(--terminal-gray-darkest);
      border-right: 1px solid var(--terminal-gray-light);
      padding: 10px 8px;
      text-align: right;
      user-select: none;
      overflow-y: auto;
      overflow-x: hidden;
      min-width: 40px;
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.5;
      color: var(--terminal-gray-light);
      scrollbar-width: none;
    }

    .line-numbers::-webkit-scrollbar {
      display: none;
    }

    .textarea-container.with-line-numbers .line-numbers {
      display: block;
    }

    .line-number {
      height: 1.5em;
      padding-right: 8px;
    }

    textarea {
      width: 100%;
      min-width: var(--textarea-min-width, auto);
      max-width: var(--textarea-max-width, 100%);
      min-height: var(--textarea-min-height, 28px);
      max-height: var(--textarea-max-height, none);
      padding: var(--spacing-sm);
      background: var(--terminal-gray-dark);
      color: var(--terminal-green);
      border: 1px solid var(--terminal-gray-light);
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.5;
      cursor: text;
      transition: all 0.2s ease;
      border-radius: 0;
      box-sizing: border-box;
    }

    :host([resize="both"]) textarea {
      resize: both;
    }

    :host([resize="vertical"]) textarea {
      resize: vertical;
    }

    :host([resize="horizontal"]) textarea {
      resize: horizontal;
    }

    :host([resize="none"]) textarea {
      resize: none;
    }

    :host([code-mode]) textarea {
      background: var(--terminal-black);
      resize: none;
    }

    .textarea-container.with-line-numbers textarea {
      border: none;
      flex: 1;
      padding: 10px 12px;
      margin: 0;
      outline: none;
      background: transparent;
      resize: none;
      min-height: 100%;
    }

    textarea:focus {
      outline: none;
      border-color: var(--terminal-green);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
    }

    textarea:hover:not(:focus) {
      border-color: var(--terminal-green-dim);
    }

    textarea::placeholder {
      color: #555555;
      opacity: 1;
    }

    textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--terminal-gray-dark);
      resize: none !important;
    }

    textarea[readonly] {
      background: var(--terminal-gray-darkest);
      cursor: default;
      resize: none !important;
    }

    :host([disabled]) textarea,
    :host([readonly]) textarea {
      resize: none !important;
    }

    /* Scrollbar styling */
    textarea::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: var(--terminal-black);
    }

    textarea::-webkit-scrollbar-track {
      background: var(--terminal-gray-dark);
      border: 1px solid var(--terminal-gray-light);
    }

    textarea::-webkit-scrollbar-thumb {
      background: var(--terminal-green-dim);
      border: 1px solid var(--terminal-green-dark);
    }

    textarea::-webkit-scrollbar-thumb:hover {
      background: var(--terminal-green);
    }

    textarea::-webkit-resizer {
      background: linear-gradient(135deg, transparent 0%, transparent 50%, var(--terminal-green-dim) 50%, var(--terminal-green-dim) 100%);
      background-size: 50% 50%;
      background-position: 100% 100%;
      background-repeat: no-repeat;
    }

    textarea {
      scrollbar-width: thin;
      scrollbar-color: var(--terminal-green-dim) var(--terminal-gray-dark);
    }

    :host([code-mode]) textarea {
      font-family: var(--font-mono);
      tab-size: 4;
    }

    /* Syntax highlighting overlay */
    .textarea-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      min-width: 0;
      overflow: hidden;
    }

    .syntax-highlight-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: auto;
      z-index: 1;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .syntax-highlight-layer::-webkit-scrollbar {
      display: none;
    }

    .syntax-highlight-layer pre {
      margin: 0;
      padding: var(--spacing-sm);
      background: transparent;
      overflow: visible;
      min-height: 100%;
      box-sizing: border-box;
    }

    .syntax-highlight-layer code {
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      display: block;
    }

    .textarea-container.with-line-numbers .syntax-highlight-layer pre {
      padding: 10px 12px;
    }

    textarea[data-highlight="true"] {
      position: relative;
      z-index: 2;
      background: transparent !important;
      color: transparent !important;
      caret-color: var(--terminal-green);
      -webkit-text-fill-color: transparent !important;
    }

    :host([language]) .textarea-container {
      background: var(--terminal-black);
    }

    :host([language]) .textarea-wrapper {
      background: var(--terminal-black);
    }

    /* Prism.js Terminal Kit Theme - Token Colors */
    .syntax-highlight-layer .token.comment,
    .syntax-highlight-layer .token.block-comment,
    .syntax-highlight-layer .token.prolog,
    .syntax-highlight-layer .token.doctype,
    .syntax-highlight-layer .token.cdata {
      color: #00cc33;
      font-style: italic;
    }

    .syntax-highlight-layer .token.punctuation {
      color: #00ff41;
    }

    .syntax-highlight-layer .token.keyword,
    .syntax-highlight-layer .token.control,
    .syntax-highlight-layer .token.directive,
    .syntax-highlight-layer .token.unit,
    .syntax-highlight-layer .token.statement {
      color: #00d4ff;
    }

    .syntax-highlight-layer .token.string,
    .syntax-highlight-layer .token.char,
    .syntax-highlight-layer .token.attr-value,
    .syntax-highlight-layer .token.template-string {
      color: #ffcc00;
    }

    .syntax-highlight-layer .token.function,
    .syntax-highlight-layer .token.function-name,
    .syntax-highlight-layer .token.method {
      color: #00ff88;
    }

    .syntax-highlight-layer .token.boolean,
    .syntax-highlight-layer .token.number,
    .syntax-highlight-layer .token.constant {
      color: #ff9933;
    }

    .syntax-highlight-layer .token.class-name,
    .syntax-highlight-layer .token.type-annotation,
    .syntax-highlight-layer .token.maybe-class-name {
      color: #cc99ff;
    }

    .syntax-highlight-layer .token.property,
    .syntax-highlight-layer .token.attr-name {
      color: #66ffcc;
    }

    .syntax-highlight-layer .token.tag,
    .syntax-highlight-layer .token.selector,
    .syntax-highlight-layer .token.selector .class,
    .syntax-highlight-layer .token.selector.class,
    .syntax-highlight-layer .token.function-variable {
      color: #ff3366;
    }

    .syntax-highlight-layer .token.operator,
    .syntax-highlight-layer .token.arrow,
    .syntax-highlight-layer .token.assignment {
      color: #00ff41;
    }

    .syntax-highlight-layer .token.variable,
    .syntax-highlight-layer .token.parameter {
      color: #00ff41;
    }

    .syntax-highlight-layer .token.regex,
    .syntax-highlight-layer .token.important {
      color: #ff00ff;
    }

    .syntax-highlight-layer .token.url,
    .syntax-highlight-layer .token.entity {
      color: #00ffff;
    }

    .syntax-highlight-layer .token.builtin,
    .syntax-highlight-layer .token.symbol {
      color: #66ccff;
    }

    .syntax-highlight-layer .token.namespace {
      color: #00aa33;
      opacity: 0.8;
    }

    .syntax-highlight-layer .token.deleted {
      color: #ff3333;
    }

    .syntax-highlight-layer .token.inserted {
      color: #00ff41;
    }

    .syntax-highlight-layer .token.important,
    .syntax-highlight-layer .token.bold {
      font-weight: bold;
    }

    .syntax-highlight-layer .token.italic {
      font-style: italic;
    }
  `;

  // ============================================
  // BLOCK 3: Reactive Properties
  // ============================================

  /**
   * @property {string} placeholder - Placeholder text displayed when textarea is empty
   * @default ''
   * @attribute placeholder
   * @reflects true
   * @example
   * <t-textarea placeholder="Enter your message..."></t-textarea>
   */

  /**
   * @property {string} value - The current value of the textarea
   * @default ''
   * @attribute value
   * @reflects false
   * @fires textarea-input
   * @example
   * <t-textarea value="Initial text"></t-textarea>
   */

  /**
   * @property {number} rows - Number of visible text lines
   * @default 4
   * @attribute rows
   * @reflects true
   * @validation Must be between 1 and 50
   * @example
   * <t-textarea rows="10"></t-textarea>
   */

  /**
   * @property {boolean} disabled - Whether the textarea is disabled
   * @default false
   * @attribute disabled
   * @reflects true
   * @example
   * <t-textarea disabled></t-textarea>
   */

  /**
   * @property {boolean} readonly - Whether the textarea is read-only
   * @default false
   * @attribute readonly
   * @reflects true
   * @example
   * <t-textarea readonly value="Read-only content"></t-textarea>
   */

  /**
   * @property {boolean} required - Whether the field is required for form submission
   * @default false
   * @attribute required
   * @reflects true
   * @example
   * <t-textarea required></t-textarea>
   */

  /**
   * @property {number} maxlength - Maximum number of characters allowed
   * @default null
   * @attribute maxlength
   * @reflects true
   * @validation Must be positive integer
   * @example
   * <t-textarea maxlength="500"></t-textarea>
   */

  /**
   * @property {boolean} codeMode - Enable code editor features with IDE shortcuts
   * @default false
   * @attribute code-mode
   * @reflects true
   * @example
   * <t-textarea code-mode></t-textarea>
   */

  /**
   * @property {boolean} showLineNumbers - Display line numbers in code mode
   * @default false
   * @attribute show-line-numbers
   * @reflects true
   * @example
   * <t-textarea code-mode show-line-numbers></t-textarea>
   */

  /**
   * @property {string} resize - CSS resize behavior (both|horizontal|vertical|none)
   * @default 'vertical'
   * @attribute resize
   * @reflects true
   * @validation Must be one of: both, horizontal, vertical, none
   * @example
   * <t-textarea resize="both"></t-textarea>
   */

  /**
   * @property {string} language - Programming language for syntax highlighting
   * @default null
   * @attribute language
   * @reflects true
   * @validation Must be supported Prism.js language or null
   * @example
   * <t-textarea language="javascript" code-mode></t-textarea>
   */

  /**
   * @property {number} _lineCount - Internal state for line count
   * @private
   * @state true
   */

  static properties = {
    placeholder: { type: String, reflect: true },
    value: { type: String },
    rows: { type: Number, reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    maxlength: { type: Number, reflect: true },
    codeMode: { type: Boolean, reflect: true, attribute: 'code-mode' },
    showLineNumbers: { type: Boolean, reflect: true, attribute: 'show-line-numbers' },
    resize: { type: String, reflect: true },
    language: { type: String, reflect: true },
    _lineCount: { type: Number, state: true }
  };

  // ============================================
  // BLOCK 4: Internal State
  // ============================================

  /**
   * @private
   * @description ElementInternals instance for form participation
   */
  _internals = null;

  /**
   * @private
   * @description Tracks if component is animating
   */
  _isAnimating = false;

  /**
   * @private
   * @description Stores context from parent components
   */
  _context = null;

  // ============================================
  // BLOCK 5: Logger Instance
  // ============================================
  _logger = componentLogger.for('t-textarea');

  // ============================================
  // BLOCK 6: Constructor
  // ============================================
  constructor() {
    super();

    // Initialize properties
    this.placeholder = '';
    this.value = '';
    this.rows = 4;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.maxlength = null;
    this.codeMode = false;
    this.showLineNumbers = false;
    this.resize = 'both';
    this.language = null;
    this._lineCount = 1;

    // Initialize ElementInternals for form participation
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }

    this._logger.debug('Component constructed');
  }

  // ============================================
  // BLOCK 7: Lifecycle Methods
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected to DOM');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);

    // Update line count before render if value changed
    if (changedProperties.has('value')) {
      const lineCount = this.value.split('\n').length;
      if (lineCount !== this._lineCount) {
        this._lineCount = lineCount;
      }
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', { changedProperties });

    if (changedProperties.has('value')) {
      if (this._internals) {
        this._internals.setFormValue(this.value);
      }
    }

    if (changedProperties.has('maxlength')) {
      this._validateProperty('maxlength', this.maxlength);
    }
  }

  // ============================================
  // BLOCK 8: Public API Methods
  // ============================================

  /**
   * Set the textarea value programmatically
   * @public
   * @param {string} value - New value to set
   * @returns {void}
   * @fires TTextareaLit#textarea-input
   * @example
   * const textarea = document.querySelector('t-textarea');
   * textarea.setValue('Hello world');
   */
  setValue(value) {
    this._logger.debug('setValue called', { value });
    this.value = value;
    if (this._internals) {
      this._internals.setFormValue(value);
    }
    this._emitEvent('textarea-input', { value });
  }

  /**
   * Get the current textarea value
   * @public
   * @returns {string} Current value of the textarea
   * @example
   * const textarea = document.querySelector('t-textarea');
   * const currentValue = textarea.getValue();
   */
  getValue() {
    this._logger.debug('getValue called');
    return this.value;
  }

  /**
   * Focus the textarea element
   * @public
   * @returns {void}
   * @example
   * const textarea = document.querySelector('t-textarea');
   * textarea.focus();
   */
  focus() {
    this._logger.debug('focus called');
    const textarea = this.shadowRoot.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  }

  /**
   * Blur the textarea element
   * @public
   * @returns {void}
   * @example
   * const textarea = document.querySelector('t-textarea');
   * textarea.blur();
   */
  blur() {
    this._logger.debug('blur called');
    const textarea = this.shadowRoot.querySelector('textarea');
    if (textarea) {
      textarea.blur();
    }
  }

  /**
   * Select all text in the textarea
   * @public
   * @returns {void}
   * @example
   * const textarea = document.querySelector('t-textarea');
   * textarea.selectAll();
   */
  selectAll() {
    this._logger.debug('selectAll called');
    const textarea = this.shadowRoot.querySelector('textarea');
    if (textarea) {
      textarea.select();
    }
  }

  /**
   * Clear the textarea value
   * @public
   * @returns {void}
   * @fires TTextareaLit#textarea-input
   * @example
   * const textarea = document.querySelector('t-textarea');
   * textarea.clear();
   */
  clear() {
    this._logger.debug('clear called');
    this.setValue('');
  }

  // ============================================
  // BLOCK 9: Event Emitters
  // ============================================

  /**
   * @event TTextareaLit#textarea-input
   * @type {CustomEvent<{value: string}>}
   * @description Fired when the textarea value changes
   * @property {string} detail.value - Current textarea value
   * @bubbles true
   * @composed true
   */

  /**
   * @event TTextareaLit#textarea-change
   * @type {CustomEvent<{value: string}>}
   * @description Fired when the textarea loses focus after value change
   * @property {string} detail.value - Current textarea value
   * @bubbles true
   * @composed true
   */

  /**
   * @event TTextareaLit#textarea-focus
   * @type {CustomEvent<{}>}
   * @description Fired when the textarea receives focus
   * @bubbles true
   * @composed true
   */

  /**
   * @event TTextareaLit#textarea-blur
   * @type {CustomEvent<{}>}
   * @description Fired when the textarea loses focus
   * @bubbles true
   * @composed true
   */

  /**
   * Emit a custom event with the given name and detail
   * @private
   * @param {string} name - Event name
   * @param {Object} detail - Event detail object
   */
  _emitEvent(name, detail = {}) {
    this._logger.debug('Emitting event', { name, detail });

    const event = new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  // ============================================
  // BLOCK 10: Nesting Support
  // ============================================

  /**
   * Receive context from parent component
   * @public
   * @param {Object} context - Context object from parent
   * @returns {void}
   */
  receiveContext(context) {
    this._context = context;
    this._logger.debug('Received context from parent', { context });
  }

  /**
   * Get the current context
   * @public
   * @returns {Object} Current context
   */
  getContext() {
    return this._context;
  }

  // ============================================
  // BLOCK 11: Validation
  // ============================================

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
   * Get validation rules for a property
   * @static
   * @param {string} propName - Property name
   * @returns {Object} Validation rules
   */
  static getPropertyValidation(propName) {
    const validations = {
      maxlength: {
        validate: (value) => {
          if (value === null || value === undefined) return { valid: true, errors: [] };
          const isValid = typeof value === 'number' && value > 0;
          return {
            valid: isValid,
            errors: isValid ? [] : ['maxlength must be a positive number']
          };
        }
      },
      rows: {
        validate: (value) => {
          if (value === null || value === undefined) return { valid: true, errors: [] };
          const isValid = typeof value === 'number' && value > 0 && value <= 50;
          return {
            valid: isValid,
            errors: isValid ? [] : ['rows must be between 1 and 50']
          };
        }
      },
      language: {
        validate: (value) => {
          if (!value) return { valid: true, errors: [] };
          const validLanguages = ['javascript', 'typescript', 'css', 'html', 'json', 'markup', 'plaintext', 'none'];
          const isValid = validLanguages.includes(value);
          return {
            valid: isValid,
            errors: isValid ? [] : [`language must be one of: ${validLanguages.join(', ')}`]
          };
        }
      },
      resize: {
        validate: (value) => {
          if (!value) return { valid: true, errors: [] };
          const validValues = ['both', 'horizontal', 'vertical', 'none'];
          const isValid = validValues.includes(value);
          return {
            valid: isValid,
            errors: isValid ? [] : [`resize must be one of: ${validValues.join(', ')}`]
          };
        }
      }
    };

    return validations[propName];
  }

  // ============================================
  // BLOCK 12: Render Method
  // ============================================

  render() {
    this._logger.trace('Rendering');

    const containerClass = this.showLineNumbers ? 'textarea-container with-line-numbers' : 'textarea-container';
    const highlightEnabled = Boolean(this.language && window.Prism);

    return html`
      <div class="${containerClass}">
        ${this.showLineNumbers ? this._renderLineNumbers() : ''}
        <div class="textarea-wrapper">
          ${this.language ? this._renderSyntaxHighlight() : ''}
          <textarea
            data-highlight="${highlightEnabled ? 'true' : 'false'}"
            .value=${this.value}
            .placeholder=${this.placeholder}
            .rows=${this.rows}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            maxlength=${this.maxlength || ''}
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            @input=${this._handleInput}
            @change=${this._handleChange}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @keydown=${this.codeMode ? this._handleKeyDown : null}
            @scroll=${this.language ? this._handleScroll : null}
          ></textarea>
        </div>
      </div>
    `;
  }

  // ============================================
  // BLOCK 13: Private Helpers
  // ============================================

  _renderLineNumbers() {
    const lines = [];
    for (let i = 1; i <= this._lineCount; i++) {
      lines.push(html`<div class="line-number">${i}</div>`);
    }
    return html`<div class="line-numbers">${lines}</div>`;
  }

  _renderSyntaxHighlight() {
    if (!this.language || !window.Prism) {
      return '';
    }

    const code = this.value || '';
    let highlighted = '';

    if (this.language === 'none' || this.language === 'plaintext') {
      const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      highlighted = escaped;
    } else {
      const grammar = window.Prism.languages[this.language];
      if (grammar) {
        try {
          highlighted = window.Prism.highlight(code, grammar, this.language);
        } catch (e) {
          this._logger.warn(`Prism highlighting failed for language ${this.language}:`, e);
          const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          highlighted = escaped;
        }
      } else {
        this._logger.warn(`Prism grammar not found for language: ${this.language}`);
        const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        highlighted = escaped;
      }
    }

    return html`
      <div class="syntax-highlight-layer">
        <pre><code class="language-${this.language}">${unsafeHTML(highlighted)}</code></pre>
      </div>
    `;
  }

  _handleScroll(e) {
    const textarea = e.target;
    const highlightLayer = this.shadowRoot.querySelector('.syntax-highlight-layer');
    if (highlightLayer) {
      highlightLayer.scrollTop = textarea.scrollTop;
      highlightLayer.scrollLeft = textarea.scrollLeft;
    }
  }

  _handleInput(e) {
    this.value = e.target.value;
    this._emitEvent('textarea-input', { value: this.value });
  }

  _handleChange(e) {
    this.value = e.target.value;
    this._emitEvent('textarea-change', { value: this.value });
  }

  _handleFocus() {
    this._emitEvent('textarea-focus', {});
  }

  _handleBlur() {
    this._emitEvent('textarea-blur', {});
  }

  _handleKeyDown(e) {
    const textarea = e.target;

    // Tab key - insert tab or indent selection
    if (e.key === 'Tab') {
      e.preventDefault();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Shift+Tab: Outdent
        this._outdent(textarea, start, end);
      } else {
        // Tab: Indent
        this._indent(textarea, start, end);
      }
      return;
    }

    // Enter key - auto-indent
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      this._autoIndent(textarea);
      return;
    }

    // Ctrl/Cmd + D - Duplicate line
    if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this._duplicateLine(textarea);
      return;
    }
  }

  _indent(textarea, start, end) {
    const value = textarea.value;

    if (start === end) {
      // No selection - insert tab
      const newValue = value.substring(0, start) + '\t' + value.substring(end);
      textarea.value = newValue;
      this.value = newValue;
      textarea.setSelectionRange(start + 1, start + 1);
    } else {
      // Selection - indent all lines
      const lines = value.split('\n');
      let currentPos = 0;
      let newStart = start;
      let newEnd = end;

      const newLines = lines.map((line, i) => {
        const lineStart = currentPos;
        const lineEnd = currentPos + line.length;
        currentPos = lineEnd + 1;

        if (lineStart < end && lineEnd >= start) {
          if (lineStart <= start) newStart++;
          newEnd++;
          return '\t' + line;
        }
        return line;
      });

      const newValue = newLines.join('\n');
      textarea.value = newValue;
      this.value = newValue;
      textarea.setSelectionRange(newStart, newEnd);
    }
  }

  _outdent(textarea, start, end) {
    const value = textarea.value;
    const lines = value.split('\n');
    let currentPos = 0;
    let newStart = start;
    let newEnd = end;

    const newLines = lines.map((line, i) => {
      const lineStart = currentPos;
      const lineEnd = currentPos + line.length;
      currentPos = lineEnd + 1;

      if (lineStart < end && lineEnd >= start) {
        if (line.startsWith('\t')) {
          if (lineStart <= start) newStart--;
          newEnd--;
          return line.substring(1);
        } else if (line.startsWith('  ')) {
          if (lineStart <= start) newStart -= 2;
          newEnd -= 2;
          return line.substring(2);
        }
      }
      return line;
    });

    const newValue = newLines.join('\n');
    textarea.value = newValue;
    this.value = newValue;
    textarea.setSelectionRange(Math.max(0, newStart), Math.max(0, newEnd));
  }

  _autoIndent(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.substring(lineStart, start);
    const indent = currentLine.match(/^[\t ]*/)[0];

    const newValue = value.substring(0, start) + '\n' + indent + value.substring(start);
    textarea.value = newValue;
    this.value = newValue;
    textarea.setSelectionRange(start + 1 + indent.length, start + 1 + indent.length);
  }

  _duplicateLine(textarea) {
    const start = textarea.selectionStart;
    const value = textarea.value;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;

    const line = value.substring(lineStart, actualLineEnd);
    const newValue = value.substring(0, actualLineEnd) + '\n' + line + value.substring(actualLineEnd);

    textarea.value = newValue;
    this.value = newValue;
    textarea.setSelectionRange(actualLineEnd + 1, actualLineEnd + 1 + line.length);
  }
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TTextareaLit.tagName)) {
  customElements.define(TTextareaLit.tagName, TTextareaLit);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================
export const TTextareaManifest = generateManifest(TTextareaLit, {
  tagName: 't-textarea',
  displayName: 'Textarea',
  description: 'Multiline text input with code editor features',
  version: '1.0.0',
  properties: {
    placeholder: { description: 'Placeholder text' },
    value: { description: 'Current value' },
    rows: { description: 'Number of visible rows' },
    disabled: { description: 'Disabled state' },
    readonly: { description: 'Read-only state' },
    required: { description: 'Required for form validation' },
    maxlength: { description: 'Maximum character length' },
    codeMode: { description: 'Enable code editor mode with IDE shortcuts' },
    showLineNumbers: { description: 'Show line numbers' }
  },
  methods: {
    setValue: {
      description: 'Set the textarea value',
      parameters: [{ name: 'value', type: 'string' }],
      returns: 'void'
    },
    getValue: {
      description: 'Get the current value',
      parameters: [],
      returns: 'string'
    },
    focus: {
      description: 'Focus the textarea',
      parameters: [],
      returns: 'void'
    },
    blur: {
      description: 'Blur the textarea',
      parameters: [],
      returns: 'void'
    }
  },
  events: {
    'textarea-input': {
      description: 'Fires on every keystroke',
      detail: { value: 'string' }
    },
    'textarea-change': {
      description: 'Fires on blur',
      detail: { value: 'string' }
    },
    'textarea-focus': {
      description: 'Fires on focus',
      detail: {}
    },
    'textarea-blur': {
      description: 'Fires on blur',
      detail: {}
    }
  },
  slots: {}
});

// ============================================================
// SECTION 4: MANIFEST EXPORT
// ============================================================
// Manifest is already generated at line 1140 using generateManifest()

// ============================================================
// SECTION 5: EXPORTS
// ============================================================
export default TTextareaLit;
