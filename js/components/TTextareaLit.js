import { LitElement, html, css } from 'lit';

export class TTextareaLit extends LitElement {
  static styles = css`
    /**
     * Textarea Component - EXACT from original t-inp.css
     * Textarea inherits form control styles with specific adaptations
     */

    /* Control Label */
    .control-label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-xs); /* 10px */
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--terminal-green-dim); /* #00cc33 */
    }

    /* Base Input Styles */
    input[type="text"],
    input[type="url"],
    input[type="number"],
    input[type="email"],
    input[type="password"],
    input[type="search"],
    textarea,
    select {
      width: 100%;
      height: var(--control-height); /* 28px */
      padding: 0 var(--spacing-sm);
      background: var(--terminal-gray-dark); /* #242424 */
      color: var(--terminal-green); /* #00ff41 */
      border: 1px solid var(--terminal-gray-light); /* #333333 */
      font-family: var(--font-mono);
      font-size: var(--font-size-sm); /* 11px */
      cursor: text;
      transition: all 0.2s ease;
      border-radius: 0;
    }

    /* Textarea specific */
    textarea {
      height: auto;
      min-height: 100px;
      padding: var(--spacing-sm);
      resize: vertical;
      line-height: 1.4;
    }

    /* Style scrollbar for webkit browsers */
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

    /* Style the resize handle corner */
    textarea::-webkit-resizer {
      background: linear-gradient(135deg, transparent 0%, transparent 50%, var(--terminal-green-dim) 50%, var(--terminal-green-dim) 100%);
      background-size: 50% 50%;
      background-position: 100% 100%;
      background-repeat: no-repeat;
    }

    /* Firefox scrollbar styling */
    textarea {
      scrollbar-width: thin;
      scrollbar-color: var(--terminal-green-dim) var(--terminal-gray-dark);
    }

    /* Focus states */
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: var(--terminal-green);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
    }

    /* Hover states */
    input:hover:not(:focus),
    textarea:hover:not(:focus),
    select:hover:not(:focus) {
      border-color: var(--terminal-green-dim);
    }

    /* Placeholder */
    input::placeholder,
    textarea::placeholder {
      color: #555555; /* Slightly brighter than gray-light (#333) for better visibility */
      opacity: 1;
    }

    /* Textarea with Line Numbers */
    .terminal-textarea .textarea-container {
      position: relative;
      display: flex;
      width: 100%;
    }

    .terminal-textarea .textarea-container.with-line-numbers,
    .terminal-textarea .textarea-container.code-editor-mode {
      border: 1px solid var(--terminal-gray-light);
      background: var(--terminal-black);
    }

    .terminal-textarea .line-numbers {
      display: none;
    }

    .terminal-textarea .textarea-container.with-line-numbers .line-numbers {
      display: block;
      background: var(--terminal-gray-darkest);
      border-right: 1px solid var(--terminal-gray-light);
      padding: 10px 8px;
      text-align: right;
      user-select: none;
      overflow-y: hidden;
      min-width: 40px;
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.5;
      color: var(--terminal-gray-light);
    }

    .terminal-textarea .line-number {
      height: 1.5em;
      padding-right: 8px;
    }

    .terminal-textarea .textarea-container.with-line-numbers .textarea {
      border: none;
      flex: 1;
      padding: 10px 12px;
      margin: 0;
      outline: none;
      background: transparent;
      line-height: 1.5;
    }

    .terminal-textarea .textarea-container.with-line-numbers .textarea-with-lines,
    .terminal-textarea .textarea-container.code-editor-mode .textarea-with-lines {
      font-family: var(--font-mono);
      tab-size: 4;
    }

    /* Code editor mode without line numbers - textarea takes full width */
    .terminal-textarea .textarea-container.code-editor-mode .textarea {
      border: none;
      flex: 1;
      padding: 10px 12px;
      margin: 0;
      outline: none;
      background: transparent;
      line-height: 1.5;
    }

    /* CSS Editor Textarea - EXACT from original */
    .css-textarea {
      width: 100%;
      min-height: 150px;
      padding: var(--spacing-sm);
      background: var(--terminal-black); /* #0a0a0a */
      color: var(--terminal-green);
      border: 1px solid var(--terminal-gray-light);
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.4;
      resize: vertical;
    }

    .css-textarea:focus {
      outline: none;
      border-color: var(--terminal-green);
      box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
    }

    /* Control Group */
    .control-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .control-group.inline {
      flex-direction: row;
      align-items: center;
    }

    /* Control Row */
    .control-row {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
      padding: var(--spacing-sm);
      background: transparent;
    }

    /* Disabled State */
    input:disabled,
    textarea:disabled,
    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--terminal-gray-dark);
    }

    /* Error State */
    input.error,
    textarea.error,
    select.error,
    form.error input,
    .error input {
      border-color: #ff3333 !important;
      color: #ff3333 !important;
    }

    /* Error state hover - stay red, just brighter */
    input.error:hover,
    textarea.error:hover,
    select.error:hover,
    form.error input:hover,
    .error input:hover {
      border-color: #ff5555 !important;
      box-shadow: 0 0 5px rgba(255, 51, 51, 0.3);
    }

    input.error:focus,
    textarea.error:focus,
    select.error:focus,
    form.error input:focus,
    .error input:focus {
      border-color: #ff3333 !important;
      box-shadow: 0 0 10px rgba(255, 51, 51, 0.4) !important;
    }

    /* Error message text */
    .error-message {
      font-size: var(--font-size-xs);
      color: #ff3333;
      margin-top: var(--spacing-xs);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Success State */
    input.success,
    textarea.success,
    select.success {
      border-color: var(--terminal-green);
    }

    /* Info text */
    .form-info {
      font-size: var(--font-size-xs);
      color: var(--terminal-green-dim);
      margin-top: var(--spacing-xs);
    }

    .form-error {
      font-size: var(--font-size-xs);
      color: #ff3333;
      margin-top: var(--spacing-xs);
    }

    /* Responsive */
    @media (max-width: 768px) {
      input[type="text"],
      input[type="number"],
      textarea {
        font-size: var(--font-size-xs);
      }
    }
  `;

  static properties = {
    placeholder: { type: String },
    rows: { type: Number },
    value: { type: String }
  };

  constructor() {
    super();
    this.placeholder = '';
    this.rows = 4;
    this.value = '';
  }

  render() {
    return html`
      <textarea
        .placeholder=${this.placeholder}
        .rows=${this.rows}
        .value=${this.value}
        @input=${this._handleInput}
      ></textarea>
    `;
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('textarea-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('t-textarea')) {
  customElements.define('t-textarea', TTextareaLit);
}

export default TTextareaLit;
