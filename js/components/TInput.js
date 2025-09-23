/**
 * TerminalInput Web Component
 * Uses existing form.css styles
 */

import { TComponent } from './TComponent.js';
import {
	eyeIcon,
	eyeClosedIcon,
	plusSquareIcon,
	minusSquareIcon,
	xIcon,
} from '../utils/phosphor-icons.js';

export class TInput extends TComponent {
	static get observedAttributes() {
		return [
			'type', 'placeholder', 'value', 'disabled', 'readonly', 'error', 'icon',
			'label', 'name', 'required', 'pattern', 'minlength', 'maxlength',
			'min', 'max', 'step', 'autocomplete', 'helper-text', 'success', 'validate-on'
		];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			type: 'text',
			placeholder: '',
			value: '',
			disabled: false,
			readonly: false,
			error: false,
			success: false,
			icon: null,
			label: '',
			helperText: '',
			name: '',
			required: false,
			pattern: '',
			minlength: '',
			maxlength: '',
			min: '',
			max: '',
			step: '',
			autocomplete: 'off',
			showPassword: false,
			validateOn: '', // validation triggers: comma-separated (blur,enter,input,none) - empty means auto
		});

		// Store validation state
		this._errorState = false;
		this._errorMessage = '';
		this._validationTimer = null;

		// Bind methods
		this.handleInput = this.handleInput.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleSearchClear = this.handleSearchClear.bind(this);
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'type':
				this.setProp('type', newValue || 'text');
				break;
			case 'placeholder':
				this.setProp('placeholder', newValue || '');
				break;
			case 'value':
				this.setProp('value', newValue || '');
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'readonly':
				this.setProp('readonly', newValue !== null);
				break;
			case 'error':
				this.setProp('error', newValue !== null);
				break;
			case 'success':
				this.setProp('success', newValue !== null);
				break;
			case 'icon':
				this.setProp('icon', newValue);
				break;
			case 'label':
				this.setProp('label', newValue || '');
				break;
			case 'helper-text':
				this.setProp('helperText', newValue || '');
				break;
			case 'name':
				this.setProp('name', newValue || '');
				break;
			case 'required':
				this.setProp('required', newValue !== null);
				break;
			case 'pattern':
				this.setProp('pattern', newValue || '');
				break;
			case 'minlength':
				this.setProp('minlength', newValue || '');
				break;
			case 'maxlength':
				this.setProp('maxlength', newValue || '');
				break;
			case 'min':
				this.setProp('min', newValue || '');
				break;
			case 'max':
				this.setProp('max', newValue || '');
				break;
			case 'step':
				this.setProp('step', newValue || '');
				break;
			case 'autocomplete':
				this.setProp('autocomplete', newValue || 'off');
				break;
			case 'validate-on':
				this.setProp('validateOn', (newValue || '').toLowerCase());
				break;
		}
	}

	template() {
		const {
			type, placeholder, value, disabled, readonly, error, success, icon, label,
			helperText, name, required, pattern, minlength, maxlength, min, max, step,
			autocomplete, showPassword
		} = this._props;

		const wrapperClasses = ['form-group'];
		if (error) wrapperClasses.push('error');
		if (success) wrapperClasses.push('success');

		const inputClasses = ['form-control'];
		if (icon) inputClasses.push('has-icon');
		if (type === 'password') inputClasses.push('has-toggle');
		if (type === 'number') inputClasses.push('has-number-controls');
		if (type === 'search' && value) inputClasses.push('has-clear');

		// Determine actual input type rendered (avoid native URL tooltip; custom validation used)
		let inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
		if (type === 'url') {
			inputType = 'text';
		}

		// Check if we're already inside a form element
		const isInForm = this.closest('form') !== null;
		const wrapperTag = isInForm ? 'div' : 'form';
		const wrapperAttrs = isInForm ? '' : ' autocomplete="off" onsubmit="return false;"';

		return `
      <${wrapperTag} class="${wrapperClasses.join(' ')} terminal-input-container"${wrapperAttrs}>
        ${label ? `<label class="form-label">${label}</label>` : ''}
        <div class="input-wrapper">
          ${icon ? `<span class="input-icon">${icon}</span>` : ''}
          <input
            type="${inputType}"
            class="${inputClasses.join(' ')}"
            placeholder="${placeholder}"
            value="${value}"
            ${name ? `name="${name}"` : ''}
            ${required ? 'required' : ''}
            ${pattern !== '' ? `pattern="${pattern}"` : ''}
            ${minlength !== '' ? `minlength="${minlength}"` : ''}
            ${min !== '' ? `min="${min}"` : ''}
            ${max !== '' ? `max="${max}"` : ''}
            ${step !== '' ? `step="${step}"` : ''}
            ${disabled ? 'disabled' : ''}
            ${readonly ? 'readonly' : ''}
            autocomplete="${autocomplete}"
            ${type === 'url' ? 'inputmode="url"' : ''}
          />
          ${
				type === 'password'
					? `
            <button type="button" class="password-toggle" aria-label="Toggle password visibility">
              ${showPassword ? eyeIcon : eyeClosedIcon}
            </button>
          `
					: ''
			}
          ${
				type === 'number'
					? `
            <div class="number-controls">
              <button type="button" class="number-increment" aria-label="Increment">
                ${plusSquareIcon}
              </button>
              <button type="button" class="number-decrement" aria-label="Decrement">
                ${minusSquareIcon}
              </button>
            </div>
          `
					: ''
			}
          ${
				type === 'search' && value
					? `
            <button type="button" class="search-clear" aria-label="Clear search">
              ${xIcon}
            </button>
          `
					: ''
			}
        </div>
        ${helperText ? `<div class="helper-text">${helperText}</div>` : ''}
      </${wrapperTag}>
    `;
	}

	afterRender() {
		const input = this.$('input');
		const wrapper = this.$('.input-wrapper');

		if (input) {
			// Bind events
			this.addListener(input, 'input', this.handleInput);
			this.addListener(input, 'focus', this.handleFocus);
			this.addListener(input, 'blur', this.handleBlur);
			this.addListener(input, 'keydown', this.handleKeyDown);
			this.addListener(input, 'change', (e) => {
				this.emit('input-change', { value: e.target.value });
			});

			// Reapply error state if it was set before render
			if (this.getProp('error') || this._errorState) {
				const container = this.$('form.terminal-input-container') || this.$('div.terminal-input-container');
				if (container) {
					container.classList.add('error');
					input.classList.add('error');
					input.style.setProperty('border-color', '#ff3333', 'important');
					input.style.setProperty('color', '#ff3333', 'important');
				}
			}
		}

		// Handle password toggle if type is password
		if (this.getProp('type') === 'password') {
			const toggleBtn = this.$('.password-toggle');
			if (toggleBtn) {
				this.addListener(toggleBtn, 'click', () => {
					this.togglePasswordVisibility();
				});
			}
		}

		// Handle search clear button
		if (this.getProp('type') === 'search') {
			const clearBtn = this.$('.search-clear');
			if (clearBtn) {
				this.addListener(clearBtn, 'click', this.handleSearchClear);
			}
		}

		// Handle number input controls
		if (this.getProp('type') === 'number') {
			const incrementBtn = this.$('.number-increment');
			const decrementBtn = this.$('.number-decrement');

			if (incrementBtn) {
				this.addListener(incrementBtn, 'click', () => {
					const currentValue = parseFloat(input.value) || 0;
					const step = parseFloat(input.step) || 1;
					const max = this.getProp('max');
					let newValue = currentValue + step;

					// Respect max limit
					if (max !== '' && newValue > parseFloat(max)) {
						newValue = parseFloat(max);
					}

					input.value = newValue;
					this.handleInput({ target: input });
					// Always validate after increment
					this.validate();
				});
			}

			if (decrementBtn) {
				this.addListener(decrementBtn, 'click', () => {
					const currentValue = parseFloat(input.value) || 0;
					const step = parseFloat(input.step) || 1;
					const min = this.getProp('min');
					let newValue = currentValue - step;

					// Respect min limit
					if (min !== '' && newValue < parseFloat(min)) {
						newValue = parseFloat(min);
					}

					input.value = newValue;
					this.handleInput({ target: input });
					// Always validate after decrement
					this.validate();
				});
			}
		}
	}

	handleInput(e) {
		const value = e.target.value;
		// Update internal prop without triggering attributeChangedCallback/render
		this._props.value = value;
		this.emit('input-value', { value });

		// Determine if we should validate live
		const type = this.getProp('type');
		const pattern = this.getProp('pattern');
		const maxlength = this.getProp('maxlength');

		// For maxlength, validate immediately (soft validation)
		if (maxlength && value.length > parseInt(maxlength)) {
			this.setError(true, `Maximum ${maxlength} characters allowed`);
			return;
		} else if (maxlength && this._errorState && this._errorMessage && this._errorMessage.includes('Maximum')) {
			// Clear maxlength error if we're under the limit now
			this.setError(false);
		}

		// Always validate live for: patterns, numbers, or if explicitly configured
		const shouldLiveValidate =
			this._hasValidateOn('input') ||
			type === 'number' ||
			!!pattern;

		// Only clear error for email/url on input (they validate on blur/enter)
		const shouldClearError = (type === 'email' || type === 'url') && this._errorState;

		if (shouldLiveValidate) {
			this.validate();
		} else if (shouldClearError) {
			this.setError(false);
		}
	}

	handleFocus(e) {
		const wrapper = this.$('.input-wrapper');
		if (wrapper) wrapper.classList.add('focused');
		this.emit('input-focus', { value: e.target.value });
	}

	handleBlur(e) {
		const wrapper = this.$('.input-wrapper');
		if (wrapper) wrapper.classList.remove('focused');
		const value = e.target.value;
		this.emit('input-blur', { value });

		// Validate on blur for certain types
		const type = this.getProp('type');
		const required = this.getProp('required');

		// Special handling for password - only validate if not empty or if required
		if (type === 'password') {
			if (value !== '' || required) {
				this.validate();
			}
		} else if (this._hasValidateOn('blur') ||
		           ['email', 'url'].includes(type) ||
		           (required && value === '')) {
			this.validate();
		}
	}

	handleKeyDown(e) {
		if (e.key === 'Enter') {
			this.emit('input-enter', { value: e.target.value });
			if (this._hasValidateOn('enter')) {
				this.validate();
			}
		}
	}

	_hasValidateOn(trigger) {
		const mode = (this.getProp('validateOn') || '').split(',').map(s => s.trim());
		if (mode.includes('none')) return false;

		// If validateOn is not explicitly set, use smart defaults
		if (!this.getProp('validateOn')) {
			const type = this.getProp('type');
			const pattern = this.getProp('pattern');
			const required = this.getProp('required');

			// Pattern fields, numbers, and maxlength validate on input
			if (trigger === 'input' && (pattern || type === 'number' || this.getProp('maxlength'))) {
				return true;
			}

			// Email/URL validate on blur/enter
			if ((trigger === 'blur' || trigger === 'enter') &&
			    (type === 'email' || type === 'url' || required)) {
				return true;
			}

			return false;
		}

		return mode.includes(trigger);
	}

	handleSearchClear() {
		this.setValue('');
		const input = this.$('input');
		if (input) {
			input.focus();
		}
		this.emit('input-clear', { value: '' });
	}

	togglePasswordVisibility() {
		const showPassword = !this.getProp('showPassword');
		this._props.showPassword = showPassword;

		// Update the input type and icon without re-rendering
		const input = this.$('input');
		const toggleBtn = this.$('.password-toggle');

		if (input) {
			input.type = showPassword ? 'text' : 'password';
		}

		if (toggleBtn) {
			// Import icons at the top of the file
			toggleBtn.innerHTML = showPassword ? eyeIcon : eyeClosedIcon;
		}
	}

	// Public API
	getValue() {
		return this.getProp('value');
	}

	setValue(value) {
		this.setProp('value', value);
		const input = this.$('input');
		if (input) input.value = value;
	}

	setPlaceholder(placeholder) {
		this.setProp('placeholder', placeholder);
		const input = this.$('input');
		if (input) input.placeholder = placeholder;
	}

	setError(hasError, message) {
		// Store error state internally
		this._errorState = hasError;
		this._errorMessage = message || '';
		// Update internal flags without re-rendering
		this._props.error = hasError;
		if (hasError) this._props.success = false;

		// Container could be either form or div with .terminal-input-container class
		const container = this.$('form.terminal-input-container') || this.$('div.terminal-input-container');
		const inputEl = this.$('input');
		const wrapper = this.$('.input-wrapper');

		if (container) {
			if (hasError) {
				container.classList.add('error');
				container.classList.remove('success');
				if (wrapper) wrapper.classList.add('error');
				if (inputEl) {
					inputEl.classList.add('error');
					inputEl.classList.remove('success');
					// Force the browser to recognize the change with important
					inputEl.style.setProperty('border-color', '#ff3333', 'important');
					inputEl.style.setProperty('color', '#ff3333', 'important');
				}
				if (message) {
					// Ensure an error message element exists and update its text
					let errorEl = this.$('.error-message');
					if (!errorEl) {
						errorEl = document.createElement('div');
						errorEl.className = 'error-message';
						container.appendChild(errorEl);
					}
					errorEl.textContent = message;
				}
				// Emit error event
				this.emit('input-error', { message: message || 'Invalid input' });
			} else {
				container.classList.remove('error');
				container.classList.remove('success');
				if (wrapper) wrapper.classList.remove('error');
				if (inputEl) {
					inputEl.classList.remove('error');
					inputEl.classList.remove('success');
					// Clear inline style
					inputEl.style.removeProperty('border-color');
					inputEl.style.removeProperty('color');
				}
				const errorEl = this.$('.error-message');
				if (errorEl) errorEl.remove();
				// Emit valid event
				this.emit('input-valid', { value: this.getProp('value') });
			}
		}
	}

	setSuccess(hasSuccess, message) {
		this._props.success = hasSuccess;
		if (hasSuccess) this._props.error = false;
		// Container could be either form or div with .terminal-input-container class
		const container = this.$('form.terminal-input-container') || this.$('div.terminal-input-container');

		if (container) {
			if (hasSuccess) {
				container.classList.add('success');
				container.classList.remove('error');
				if (message) {
					// Update helper text
					this.setProp('helperText', message);
				}
			} else {
				container.classList.remove('success');
			}
		}
	}

	focus() {
		const input = this.$('input');
		if (input) input.focus();
	}

	blur() {
		const input = this.$('input');
		if (input) input.blur();
	}

	clear() {
		this.setValue('');
	}

	disable() {
		this.setProp('disabled', true);
		const input = this.$('input');
		if (input) input.disabled = true;
	}

	enable() {
		this.setProp('disabled', false);
		const input = this.$('input');
		if (input) input.disabled = false;
	}

	setReadonly(readonly) {
		this.setProp('readonly', readonly);
		const input = this.$('input');
		if (input) input.readOnly = readonly;
	}

	setLabel(label) {
		this.setProp('label', label);
	}

	setIcon(iconSvg) {
		this.setProp('icon', iconSvg);
	}

	setHelperText(text) {
		this.setProp('helperText', text);
	}

	validate() {
		const input = this.$('input');
		if (!input) return true;

		const value = this.getValue();
		const type = this.getProp('type');
		const required = this.getProp('required');
		const maxlength = this.getProp('maxlength');

		// Check maxlength first
		if (maxlength && value && value.length > parseInt(maxlength)) {
			this.setError(true, `Maximum ${maxlength} characters allowed`);
			return false;
		}

		// Check required
		if (required && (!value || value.trim() === '')) {
			this.setError(true, 'This field is required');
			return false;
		}

		// For password type, handle special validation logic
		if (type === 'password') {
			// If empty and not required, it's valid
			if (!value && !required) {
				this.setError(false);
				return true;
			}
			// If required and empty, show error
			if (required && !value) {
				this.setError(true, 'This field is required');
				return false;
			}
			// If has value, check minlength
			if (value) {
				const minlength = this.getProp('minlength');
				if (minlength && value.length < parseInt(minlength)) {
					this.setError(true, `Password must be at least ${minlength} characters`);
					return false;
				}
			}
		}

		// URL: custom validation first (allows bare domains)
		if (type === 'url') {
			const v = (value || '').trim();
			if (!v) {
				if (required) {
					this.setError(true, 'This field is required');
					return false;
				}
				this.setError(false);
				return true;
			}
			const normalized = /^https?:\/\//i.test(v) ? v : `https://${v}`;
			let parsed;
			try {
				parsed = new URL(normalized);
			} catch {
				this.setError(true, 'Invalid URL');
				return false;
			}
			const hostname = parsed.hostname.toLowerCase();
			const ipv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;
			if (ipv4.test(hostname)) {
				const ok = hostname.split('.').every(o => {
					const n = Number(o);
					return Number.isInteger(n) && n >= 0 && n <= 255;
				});
				if (!ok) {
					this.setError(true, 'Invalid URL');
					return false;
				}
			} else if (hostname !== 'localhost') {
				const labels = hostname.split('.');
				if (labels.length < 2) {
					this.setError(true, 'Invalid URL');
					return false;
				}
				const tld = labels.pop();
				const tldOk = /^[a-z]{2,63}$/.test(tld);
				const labelsOk = labels.every(l => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(l));
				if (!tldOk || !labelsOk) {
					this.setError(true, 'Invalid URL');
					return false;
				}
			}
			this.setError(false);
			return true;
		}

		// Additional validation based on type
		if (type === 'email') {
			if (!value && required) {
				this.setError(true, 'This field is required');
				return false;
			}
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (value && !emailRegex.test(value)) {
				this.setError(true, 'Invalid email address');
				return false;
			}
		}

		// Use native HTML5 validation for other validation attributes
		if (!input.checkValidity()) {
			this.setError(true, input.validationMessage);
			return false;
		}

		if (type === 'number') {
			if (value && isNaN(value)) {
				this.setError(true, 'Must be a number');
				return false;
			}
			const min = this.getProp('min');
			const max = this.getProp('max');
			if (min !== '' && parseFloat(value) < parseFloat(min)) {
				this.setError(true, `Value must be at least ${min}`);
				return false;
			}
			if (max !== '' && parseFloat(value) > parseFloat(max)) {
				this.setError(true, `Value must be at most ${max}`);
				return false;
			}
		}

		this.setError(false);
		return true;
	}
}

// Register the component
customElements.define('t-inp', TInput);
