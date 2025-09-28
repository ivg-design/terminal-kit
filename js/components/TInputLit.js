import { LitElement, html, css } from 'lit';

export class TInputLit extends LitElement {
  static styles = css`
/**
 * Form Component - EXACT from original
 * All form controls with precise styling
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

/* Select Dropdown - EXACT from original */
.select-control,
select {
  height: var(--control-height);
  padding: 0 var(--spacing-md);
  background: var(--terminal-gray-dark);
  color: var(--terminal-green);
  border: 1px solid var(--terminal-gray-light);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: 0;
  width: 280px; /* Fixed width to prevent layout shifts */
  text-transform: uppercase;
  letter-spacing: 0.5px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300ff41' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right var(--spacing-sm) center;
  background-size: 16px;
  padding-right: calc(var(--spacing-sm) * 4);
}

.select-control:hover {
  border-color: var(--terminal-green);
}

.select-control:focus {
  outline: none;
  border-color: var(--terminal-green);
}

/* File Input */
input[type="file"] {
  display: none;
}

.file-upload-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  height: var(--control-height);
  background: var(--terminal-gray-dark);
  color: var(--terminal-green);
  border: 1px solid var(--terminal-gray-light);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.file-upload-label:hover {
  background: var(--terminal-gray);
  border-color: var(--terminal-green);
}

/* Checkbox & Radio */
input[type="checkbox"],
input[type="radio"] {
  width: 16px;
  height: 16px;
  margin: 0;
  margin-right: var(--spacing-sm);
  accent-color: var(--terminal-green);
  cursor: pointer;
  vertical-align: middle;
}

/* Custom checkbox style */
.checkbox-container,
.radio-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.checkbox-container:hover input[type="checkbox"],
.radio-container:hover input[type="radio"] {
  border-color: var(--terminal-green);
}

/* Range Slider */
input[type="range"] {
  width: 100%;
  height: 20px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  width: 100%;
  height: 4px;
  background: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--terminal-green);
  border: 1px solid var(--terminal-green-dark);
  cursor: pointer;
  margin-top: -7px;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 4px;
  background: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--terminal-green);
  border: 1px solid var(--terminal-green-dark);
  cursor: pointer;
  border-radius: 0;
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

/* Zoom Slider Group - EXACT from original */
.zoom-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

#zoom-slider {
  flex: 1;
}

#zoom-value {
  min-width: 45px;
  text-align: right;
  font-size: var(--font-size-sm);
  color: var(--terminal-green);
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

/* Form wrapper for Web Components */
form.form-group {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
}

/* Input wrapper for icons and toggles */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
}

/* Password toggle button */
.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--terminal-green-dim);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--terminal-green);
}

.password-toggle svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Adjust input padding when has toggle */
input.has-toggle {
  padding-right: 36px;
}

/* Number input controls */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input.has-number-controls {
  padding-right: 70px;
}

.number-controls {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 2px;
}

.number-increment,
.number-decrement {
  background: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  color: var(--terminal-green-dim);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 28px;
  height: 24px;
}

.number-increment:hover,
.number-decrement:hover {
  background: rgba(0, 255, 65, 0.1);
  border-color: var(--terminal-green-dim);
  color: var(--terminal-green);
}

.number-increment:active,
.number-decrement:active {
  background: rgba(0, 255, 65, 0.15);
  transform: scale(0.95);
}

.number-increment svg,
.number-decrement svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.number-increment:disabled,
.number-decrement:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .select-control,
  select {
    width: 100%;
  }

  input[type="text"],
  input[type="number"],
  textarea {
    font-size: var(--font-size-xs);
  }
}
  `;

  static properties = {
    placeholder: { type: String },
    value: { type: String },
    size: { type: String }
  };

  constructor() {
    super();
    this.placeholder = '';
    this.value = '';
    this.size = '';
  }

  render() {
    return html`
      <input
        type="text"
        .placeholder=${this.placeholder}
        .value=${this.value}
        @input=${this._handleInput}
      />
    `;
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('t-inp')) {
  customElements.define('t-inp', TInputLit);
}

export default TInputLit;
