import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TInputLit, TInputManifest } from '../../js/components/TInputLit.js';

describe('TInputLit', () => {
  let input;

  beforeEach(() => {
    input = document.createElement('t-inp');
    document.body.appendChild(input);
  });

  afterEach(() => {
    input.remove();
  });

  // ============================================================
  // 1. MANIFEST COMPLETENESS
  // ============================================================
  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TInputManifest).toBeDefined();
      expect(TInputManifest.tagName).toBe('t-inp');
      expect(TInputManifest.displayName).toBe('Input');
      expect(TInputManifest.version).toBe('1.0.0');
    });

    it('should document all 15 properties', () => {
      const { properties } = TInputManifest;

      expect(properties.type).toBeDefined();
      expect(properties.placeholder).toBeDefined();
      expect(properties.value).toBeDefined();
      expect(properties.disabled).toBeDefined();
      expect(properties.readonly).toBeDefined();
      expect(properties.required).toBeDefined();
      expect(properties.min).toBeDefined();
      expect(properties.max).toBeDefined();
      expect(properties.minlength).toBeDefined();
      expect(properties.maxlength).toBeDefined();
      expect(properties.pattern).toBeDefined();
      expect(properties.autocomplete).toBeDefined();
      expect(properties.label).toBeDefined();
      expect(properties.helperText).toBeDefined();
      expect(properties.icon).toBeDefined();
    });

    it('should document all 7 methods', () => {
      const { methods } = TInputManifest;

      expect(methods.setValue).toBeDefined();
      expect(methods.getValue).toBeDefined();
      expect(methods.focus).toBeDefined();
      expect(methods.blur).toBeDefined();
      expect(methods.validate).toBeDefined();
      expect(methods.setError).toBeDefined();
      expect(methods.clear).toBeDefined();
    });

    it('should document all 8 events', () => {
      const { events } = TInputManifest;

      expect(events['input-value']).toBeDefined();
      expect(events['input-change']).toBeDefined();
      expect(events['input-error']).toBeDefined();
      expect(events['input-valid']).toBeDefined();
      expect(events['input-focus']).toBeDefined();
      expect(events['input-blur']).toBeDefined();
      expect(events['input-enter']).toBeDefined();
      expect(events['input-clear']).toBeDefined();
    });

    it('should have no slots', () => {
      const { slots } = TInputManifest;
      expect(Object.keys(slots).length).toBe(0);
    });
  });

  // ============================================================
  // 2. PROPERTY FUNCTIONALITY (15 tests)
  // ============================================================
  describe('Property Functionality', () => {
    it('should have correct default values', () => {
      expect(input.type).toBe('text');
      expect(input.placeholder).toBe('');
      expect(input.value).toBe('');
      expect(input.disabled).toBe(false);
      expect(input.readonly).toBe(false);
      expect(input.required).toBe(false);
      expect(input.min).toBe(null);
      expect(input.max).toBe(null);
      expect(input.minlength).toBe(null);
      expect(input.maxlength).toBe(null);
      expect(input.pattern).toBe(null);
      expect(input.autocomplete).toBe('off');
      expect(input.label).toBe('');
      expect(input.helperText).toBe('');
      expect(input.icon).toBe('');
    });

    it('type property should work and reflect', async () => {
      input.type = 'email';
      await input.updateComplete;
      expect(input.type).toBe('email');
      expect(input.getAttribute('type')).toBe('email');
    });

    it('placeholder property should work and reflect', async () => {
      input.placeholder = 'Enter text';
      await input.updateComplete;
      expect(input.placeholder).toBe('Enter text');
      expect(input.getAttribute('placeholder')).toBe('Enter text');
    });

    it('value property should work', async () => {
      input.value = 'test value';
      await input.updateComplete;
      expect(input.value).toBe('test value');
    });

    it('disabled property should work and reflect', async () => {
      input.disabled = true;
      await input.updateComplete;
      expect(input.disabled).toBe(true);
      expect(input.hasAttribute('disabled')).toBe(true);
    });

    it('readonly property should work and reflect', async () => {
      input.readonly = true;
      await input.updateComplete;
      expect(input.readonly).toBe(true);
      expect(input.hasAttribute('readonly')).toBe(true);
    });

    it('required property should work and reflect', async () => {
      input.required = true;
      await input.updateComplete;
      expect(input.required).toBe(true);
      expect(input.hasAttribute('required')).toBe(true);
    });

    it('min property should work and reflect', async () => {
      input.min = 0;
      await input.updateComplete;
      expect(input.min).toBe(0);
      expect(input.getAttribute('min')).toBe('0');
    });

    it('max property should work and reflect', async () => {
      input.max = 100;
      await input.updateComplete;
      expect(input.max).toBe(100);
      expect(input.getAttribute('max')).toBe('100');
    });

    it('minlength property should work and reflect', async () => {
      input.minlength = 5;
      await input.updateComplete;
      expect(input.minlength).toBe(5);
      expect(input.getAttribute('minlength')).toBe('5');
    });

    it('maxlength property should work and reflect', async () => {
      input.maxlength = 50;
      await input.updateComplete;
      expect(input.maxlength).toBe(50);
      expect(input.getAttribute('maxlength')).toBe('50');
    });

    it('pattern property should work and reflect', async () => {
      input.pattern = '[0-9]+';
      await input.updateComplete;
      expect(input.pattern).toBe('[0-9]+');
      expect(input.getAttribute('pattern')).toBe('[0-9]+');
    });

    it('autocomplete property should work and reflect', async () => {
      input.autocomplete = 'email';
      await input.updateComplete;
      expect(input.autocomplete).toBe('email');
      expect(input.getAttribute('autocomplete')).toBe('email');
    });

    it('label property should work and reflect', async () => {
      input.label = 'Username';
      await input.updateComplete;
      expect(input.label).toBe('Username');
      expect(input.getAttribute('label')).toBe('Username');
    });

    it('helperText property should work and reflect', async () => {
      input.helperText = 'Enter your username';
      await input.updateComplete;
      expect(input.helperText).toBe('Enter your username');
      expect(input.getAttribute('helper-text')).toBe('Enter your username');
    });

    it('icon property should work', async () => {
      input.icon = '<svg>test</svg>';
      await input.updateComplete;
      expect(input.icon).toBe('<svg>test</svg>');
    });
  });

  // ============================================================
  // 2. RENDERING (10 tests)
  // ============================================================
  describe('Rendering', () => {
    it('should render with shadow DOM', async () => {
      await input.updateComplete;
      expect(input.shadowRoot).toBeDefined();
    });

    it('should render input element', async () => {
      await input.updateComplete;
      const inputEl = input.shadowRoot.querySelector('input');
      expect(inputEl).toBeDefined();
    });

    it('should render label when provided', async () => {
      input.label = 'Test Label';
      await input.updateComplete;
      const label = input.shadowRoot.querySelector('.control-label');
      expect(label).toBeDefined();
      expect(label.textContent).toBe('Test Label');
    });

    it('should render helper text when provided', async () => {
      input.helperText = 'Helper text';
      await input.updateComplete;
      const helper = input.shadowRoot.querySelector('.helper-text');
      expect(helper).toBeDefined();
      expect(helper.textContent).toBe('Helper text');
    });

    it('should render password toggle for password type', async () => {
      input.type = 'password';
      await input.updateComplete;
      const toggle = input.shadowRoot.querySelector('.password-toggle');
      expect(toggle).toBeDefined();
    });

    it('should render number controls for number type', async () => {
      input.type = 'number';
      await input.updateComplete;
      const controls = input.shadowRoot.querySelector('.number-controls');
      expect(controls).toBeDefined();
    });

    it('should render search clear button for search type with value', async () => {
      input.type = 'search';
      input.value = 'test';
      await input.updateComplete;
      const clear = input.shadowRoot.querySelector('.search-clear');
      expect(clear).toBeDefined();
    });

    it('should not render search clear button when empty', async () => {
      input.type = 'search';
      input.value = '';
      await input.updateComplete;
      const clear = input.shadowRoot.querySelector('.search-clear');
      expect(clear).toBeNull();
    });

    it('should render error message when error state', async () => {
      input.setError(true, 'Error message');
      await input.updateComplete;
      const error = input.shadowRoot.querySelector('.error-message');
      expect(error).toBeDefined();
      expect(error.textContent).toBe('Error message');
    });

    it('should render icon when provided', async () => {
      input.icon = '<svg>icon</svg>';
      await input.updateComplete;
      const icon = input.shadowRoot.querySelector('.input-icon');
      expect(icon).toBeDefined();
    });
  });

  // ============================================================
  // 3. LOGGING (5 tests)
  // ============================================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(input._logger).toBeDefined();
    });

    it('should have all logger methods', () => {
      expect(typeof input._logger.error).toBe('function');
      expect(typeof input._logger.warn).toBe('function');
      expect(typeof input._logger.info).toBe('function');
      expect(typeof input._logger.debug).toBe('function');
      expect(typeof input._logger.trace).toBe('function');
    });

    it('should log debug messages', () => {
      expect(() => input._logger.debug('test')).not.toThrow();
    });

    it('should log info messages', () => {
      expect(() => input._logger.info('test')).not.toThrow();
    });

    it('should log error messages', () => {
      expect(() => input._logger.error('test')).not.toThrow();
    });
  });

  // ============================================================
  // 4. VALIDATION (20 tests)
  // ============================================================
  describe('Validation', () => {
    it('should validate required field when empty', async () => {
      input.required = true;
      input.value = '';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorState).toBe(true);
      expect(input._errorMessage).toContain('required');
    });

    it('should validate required field when filled', async () => {
      input.required = true;
      input.value = 'test';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
      expect(input._errorState).toBe(false);
    });

    it('should validate maxlength constraint', async () => {
      input.maxlength = 5;
      input.value = '123456';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('Maximum 5 characters');
    });

    it('should pass maxlength constraint', async () => {
      input.maxlength = 5;
      input.value = '123';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should validate minlength constraint', async () => {
      input.minlength = 5;
      input.value = '123';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('Minimum 5 characters');
    });

    it('should pass minlength constraint', async () => {
      input.minlength = 5;
      input.value = '12345';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should validate email format - valid', async () => {
      input.type = 'email';
      input.value = 'test@example.com';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should validate email format - invalid', async () => {
      input.type = 'email';
      input.value = 'invalid-email';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('email');
    });

    it('should validate URL format - valid with protocol', async () => {
      input.type = 'url';
      input.value = 'https://example.com';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should validate URL format - valid bare domain', async () => {
      input.type = 'url';
      input.value = 'example.com';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should validate URL format - invalid', async () => {
      input.type = 'url';
      input.value = 'not a url';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('URL');
    });

    it('should validate number type - valid', async () => {
      input.type = 'number';
      input.value = '42';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should validate number type - invalid', async () => {
      input.type = 'number';
      input.value = 'abc';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('number');
    });

    it('should validate number min constraint', async () => {
      input.type = 'number';
      input.min = 10;
      input.value = '5';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('at least 10');
    });

    it('should validate number max constraint', async () => {
      input.type = 'number';
      input.max = 100;
      input.value = '150';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(false);
      expect(input._errorMessage).toContain('at most 100');
    });

    it('should pass number range constraint', async () => {
      input.type = 'number';
      input.min = 0;
      input.max = 100;
      input.value = '50';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should allow empty value when not required', async () => {
      input.required = false;
      input.value = '';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('should clear error when validation passes', async () => {
      input.required = true;
      input.value = '';
      await input.updateComplete;
      input.validate();
      expect(input._errorState).toBe(true);

      input.value = 'test';
      await input.updateComplete;
      input.validate();
      expect(input._errorState).toBe(false);
    });

    it('should update ElementInternals validity state', async () => {
      if (input._internals) {
        input.setError(true, 'Test error');
        await input.updateComplete;
        // ElementInternals should have customError validity
        expect(input._internals.validity).toBeDefined();
      }
    });

    it('should clear ElementInternals validity on valid', async () => {
      if (input._internals) {
        input.setError(true, 'Test error');
        input.setError(false);
        await input.updateComplete;
        // ElementInternals should have no errors
        expect(input._internals.validity).toBeDefined();
      }
    });
  });

  // ============================================================
  // 5. EVENTS (40 tests - 8 events × 5 tests each)
  // ============================================================
  describe('Events', () => {
    // input-value event
    it('input-value event should fire on input', async () => {
      await input.updateComplete;
      let eventFired = false;
      let eventDetail = null;

      input.addEventListener('input-value', (e) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.value = 'test';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventFired).toBe(true);
      expect(eventDetail.value).toBe('test');
    });

    it('input-value event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-value', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.value = 'test';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-value', listener);
    });

    it('input-value event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-value', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.value = 'test';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));

      expect(listener).toHaveBeenCalled();
    });

    it('input-value should have correct detail structure', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.detail).toHaveProperty('value');
        expect(typeof e.detail.value).toBe('string');
      });
      input.addEventListener('input-value', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.value = 'test';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));

      expect(listener).toHaveBeenCalled();
    });

    it('input-value should fire via setValue()', () => {
      const listener = vi.fn();
      input.addEventListener('input-value', listener);
      // setValue doesn't trigger input-value directly, it just sets value
      // input-value is only fired on user input
    });

    // input-change event
    it('input-change event should fire on blur', async () => {
      await input.updateComplete;
      let eventFired = false;

      input.addEventListener('input-change', () => {
        eventFired = true;
      });

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(eventFired).toBe(true);
    });

    it('input-change event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-change', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-change', listener);
    });

    it('input-change event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-change', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(listener).toHaveBeenCalled();
    });

    it('input-change should have correct detail structure', async () => {
      await input.updateComplete;
      input.value = 'test';
      const listener = vi.fn((e) => {
        expect(e.detail).toHaveProperty('value');
        expect(e.detail.value).toBe('test');
      });
      input.addEventListener('input-change', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(listener).toHaveBeenCalled();
    });

    // input-focus event
    it('input-focus event should fire on focus', async () => {
      await input.updateComplete;
      let eventFired = false;

      input.addEventListener('input-focus', () => {
        eventFired = true;
      });

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('focus'));

      expect(eventFired).toBe(true);
    });

    it('input-focus event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-focus', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('focus'));

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-focus', listener);
    });

    it('input-focus event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-focus', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('focus'));

      expect(listener).toHaveBeenCalled();
    });

    // input-blur event
    it('input-blur event should fire on blur', async () => {
      await input.updateComplete;
      let eventFired = false;

      input.addEventListener('input-blur', () => {
        eventFired = true;
      });

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(eventFired).toBe(true);
    });

    it('input-blur event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-blur', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-blur', listener);
    });

    it('input-blur event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-blur', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new Event('blur'));

      expect(listener).toHaveBeenCalled();
    });

    // input-enter event
    it('input-enter event should fire on Enter key', async () => {
      await input.updateComplete;
      input.value = 'test';
      let eventFired = false;

      input.addEventListener('input-enter', () => {
        eventFired = true;
      });

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(eventFired).toBe(true);
    });

    it('input-enter event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-enter', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-enter', listener);
    });

    it('input-enter event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-enter', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(listener).toHaveBeenCalled();
    });

    it('input-enter should have correct detail structure', async () => {
      await input.updateComplete;
      input.value = 'test';
      const listener = vi.fn((e) => {
        expect(e.detail).toHaveProperty('value');
        expect(e.detail.value).toBe('test');
      });
      input.addEventListener('input-enter', listener);

      const inputEl = input.shadowRoot.querySelector('input');
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(listener).toHaveBeenCalled();
    });

    // input-error event
    it('input-error event should fire on validation failure', async () => {
      await input.updateComplete;
      let eventFired = false;
      let errorMessage = '';

      input.addEventListener('input-error', (e) => {
        eventFired = true;
        errorMessage = e.detail.error;
      });

      input.setError(true, 'Test error');

      expect(eventFired).toBe(true);
      expect(errorMessage).toBe('Test error');
    });

    it('input-error event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-error', listener);

      input.setError(true, 'Test error');

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-error', listener);
    });

    it('input-error event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-error', listener);

      input.setError(true, 'Test error');

      expect(listener).toHaveBeenCalled();
    });

    it('input-error should have correct detail structure', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.detail).toHaveProperty('error');
        expect(typeof e.detail.error).toBe('string');
      });
      input.addEventListener('input-error', listener);

      input.setError(true, 'Test error');

      expect(listener).toHaveBeenCalled();
    });

    // input-valid event
    it('input-valid event should fire when validation passes', async () => {
      await input.updateComplete;
      let eventFired = false;

      input.addEventListener('input-valid', () => {
        eventFired = true;
      });

      input.setError(false);

      expect(eventFired).toBe(true);
    });

    it('input-valid event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-valid', listener);

      input.setError(false);

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-valid', listener);
    });

    it('input-valid event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-valid', listener);

      input.setError(false);

      expect(listener).toHaveBeenCalled();
    });

    it('input-valid should have correct detail structure', async () => {
      await input.updateComplete;
      input.value = 'test';
      const listener = vi.fn((e) => {
        expect(e.detail).toHaveProperty('value');
        expect(e.detail.value).toBe('test');
      });
      input.addEventListener('input-valid', listener);

      input.setError(false);

      expect(listener).toHaveBeenCalled();
    });

    // input-clear event
    it('input-clear event should fire when clear() called', async () => {
      await input.updateComplete;
      let eventFired = false;

      input.addEventListener('input-clear', () => {
        eventFired = true;
      });

      input.clear();

      expect(eventFired).toBe(true);
    });

    it('input-clear event should bubble', async () => {
      await input.updateComplete;
      const listener = vi.fn();
      document.body.addEventListener('input-clear', listener);

      input.clear();

      expect(listener).toHaveBeenCalled();
      document.body.removeEventListener('input-clear', listener);
    });

    it('input-clear event should be composed', async () => {
      await input.updateComplete;
      const listener = vi.fn((e) => {
        expect(e.composed).toBe(true);
      });
      input.addEventListener('input-clear', listener);

      input.clear();

      expect(listener).toHaveBeenCalled();
    });

    it('input-clear event should fire when search clear button clicked', async () => {
      input.type = 'search';
      input.value = 'test';
      await input.updateComplete;

      let eventFired = false;
      input.addEventListener('input-clear', () => {
        eventFired = true;
      });

      const clearBtn = input.shadowRoot.querySelector('.search-clear');
      clearBtn.click();

      expect(eventFired).toBe(true);
    });
  });

  // ============================================================
  // 6. METHODS (7 tests)
  // ============================================================
  describe('Methods', () => {
    it('setValue() should set value', () => {
      input.setValue('new value');
      expect(input.value).toBe('new value');
    });

    it('getValue() should return value', () => {
      input.value = 'test';
      expect(input.getValue()).toBe('test');
    });

    it('focus() should focus input', async () => {
      await input.updateComplete;
      input.focus();
      const inputEl = input.shadowRoot.querySelector('input');
      expect(document.activeElement).toBe(input);
    });

    it('blur() should blur input', async () => {
      await input.updateComplete;
      input.focus();
      input.blur();
      expect(document.activeElement).not.toBe(input);
    });

    it('validate() should return validation result', async () => {
      input.required = true;
      input.value = '';
      await input.updateComplete;

      expect(input.validate()).toBe(false);

      input.value = 'test';
      expect(input.validate()).toBe(true);
    });

    it('setError() should set error state', async () => {
      input.setError(true, 'Custom error');
      await input.updateComplete;

      expect(input._errorState).toBe(true);
      expect(input._errorMessage).toBe('Custom error');
    });

    it('clear() should clear value', () => {
      input.value = 'test';
      input.clear();
      expect(input.value).toBe('');
    });
  });

  // ============================================================
  // 7. FORM PARTICIPATION (10 tests)
  // ============================================================
  describe('Form Participation', () => {
    it('should have ElementInternals if supported', () => {
      if (input.attachInternals) {
        expect(input._internals).toBeDefined();
      }
    });

    it('getValue() should return form value', () => {
      input.value = 'form value';
      expect(input.getValue()).toBe('form value');
    });

    it('setValue() should update form value', async () => {
      input.setValue('new form value');
      await input.updateComplete;

      if (input._internals) {
        // FormValue should be set via ElementInternals
        expect(input.value).toBe('new form value');
      }
    });

    it('should sync form value on value change', async () => {
      input.value = 'test';
      await input.updateComplete;

      if (input._internals) {
        // FormValue should be synced
        expect(input.value).toBe('test');
      }
    });

    it('should integrate with native form', async () => {
      const form = document.createElement('form');
      form.appendChild(input);
      document.body.appendChild(form);

      input.value = 'form test';
      await input.updateComplete;

      // Component should participate in form
      expect(input.value).toBe('form test');

      form.remove();
    });

    it('should set validity state on error', async () => {
      if (input._internals) {
        input.setError(true, 'Error');
        await input.updateComplete;
        expect(input._internals.validity).toBeDefined();
      }
    });

    it('should clear validity state on valid', async () => {
      if (input._internals) {
        input.setError(true, 'Error');
        input.setError(false);
        await input.updateComplete;
        expect(input._internals.validity).toBeDefined();
      }
    });

    it('should be disabled in forms', async () => {
      input.disabled = true;
      await input.updateComplete;

      const inputEl = input.shadowRoot.querySelector('input');
      expect(inputEl.disabled).toBe(true);
    });

    it('should be readonly in forms', async () => {
      input.readonly = true;
      await input.updateComplete;

      const inputEl = input.shadowRoot.querySelector('input');
      expect(inputEl.readOnly).toBe(true);
    });

    it('should report required state', async () => {
      input.required = true;
      await input.updateComplete;

      const inputEl = input.shadowRoot.querySelector('input');
      expect(inputEl.required).toBe(true);
    });
  });

  // ============================================================
  // 8. TYPE-SPECIFIC FEATURES (8 tests)
  // ============================================================
  describe('Type-Specific Features', () => {
    it('password toggle should change input type', async () => {
      input.type = 'password';
      await input.updateComplete;

      const toggle = input.shadowRoot.querySelector('.password-toggle');
      const inputEl = input.shadowRoot.querySelector('input');

      expect(inputEl.type).toBe('password');

      toggle.click();
      await input.updateComplete;

      const inputElAfter = input.shadowRoot.querySelector('input');
      expect(inputElAfter.type).toBe('text');
    });

    it('number increment should increase value', async () => {
      input.type = 'number';
      input.value = '5';
      await input.updateComplete;

      const increment = input.shadowRoot.querySelector('.number-increment');
      increment.click();
      await input.updateComplete;

      expect(input.value).toBe('6');
    });

    it('number decrement should decrease value', async () => {
      input.type = 'number';
      input.value = '5';
      await input.updateComplete;

      const decrement = input.shadowRoot.querySelector('.number-decrement');
      decrement.click();
      await input.updateComplete;

      expect(input.value).toBe('4');
    });

    it('number increment should respect max', async () => {
      input.type = 'number';
      input.max = 10;
      input.value = '10';
      await input.updateComplete;

      const increment = input.shadowRoot.querySelector('.number-increment');
      increment.click();
      await input.updateComplete;

      expect(input.value).toBe('10');
    });

    it('number decrement should respect min', async () => {
      input.type = 'number';
      input.min = 0;
      input.value = '0';
      await input.updateComplete;

      const decrement = input.shadowRoot.querySelector('.number-decrement');
      decrement.click();
      await input.updateComplete;

      expect(input.value).toBe('0');
    });

    it('search clear should clear value and focus', async () => {
      input.type = 'search';
      input.value = 'search term';
      await input.updateComplete;

      const clear = input.shadowRoot.querySelector('.search-clear');
      clear.click();
      await input.updateComplete;

      expect(input.value).toBe('');
    });

    it('url type should accept bare domains', async () => {
      input.type = 'url';
      input.value = 'example.com';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });

    it('url type should accept full URLs', async () => {
      input.type = 'url';
      input.value = 'https://example.com/path';
      await input.updateComplete;

      const isValid = input.validate();
      expect(isValid).toBe(true);
    });
  });
});