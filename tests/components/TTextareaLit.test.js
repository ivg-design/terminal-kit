import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TTextareaLit, TTextareaManifest } from '../../js/components/TTextareaLit.js';

describe('TTextareaLit', () => {
  let textarea;

  beforeEach(() => {
    textarea = document.createElement('t-textarea');
    document.body.appendChild(textarea);
  });

  afterEach(() => {
    textarea.remove();
  });

  // ============================================
  // TEST SUITE 1: Manifest Completeness
  // ============================================
  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TTextareaManifest).toBeDefined();
      expect(TTextareaManifest.tagName).toBe('t-textarea');
      expect(TTextareaManifest.displayName).toBe('Textarea');
      expect(TTextareaManifest.version).toBe('1.0.0');
    });

    it('should document all 9 properties', () => {
      const { properties } = TTextareaManifest;

      expect(properties.placeholder).toBeDefined();
      expect(properties.value).toBeDefined();
      expect(properties.rows).toBeDefined();
      expect(properties.disabled).toBeDefined();
      expect(properties.readonly).toBeDefined();
      expect(properties.required).toBeDefined();
      expect(properties.maxlength).toBeDefined();
      expect(properties.codeMode).toBeDefined();
      expect(properties.showLineNumbers).toBeDefined();
    });

    it('should document all 4 methods', () => {
      const { methods } = TTextareaManifest;

      expect(methods.setValue).toBeDefined();
      expect(methods.getValue).toBeDefined();
      expect(methods.focus).toBeDefined();
      expect(methods.blur).toBeDefined();
    });

    it('should document all 4 events', () => {
      const { events } = TTextareaManifest;

      expect(events['textarea-input']).toBeDefined();
      expect(events['textarea-change']).toBeDefined();
      expect(events['textarea-focus']).toBeDefined();
      expect(events['textarea-blur']).toBeDefined();
    });

    it('should have no slots', () => {
      const { slots } = TTextareaManifest;
      expect(Object.keys(slots).length).toBe(0);
    });
  });

  // ============================================
  // TEST SUITE 2: Property Functionality
  // ============================================
  describe('Property Functionality', () => {
    it('should have correct default property values', () => {
      expect(textarea.placeholder).toBe('');
      expect(textarea.value).toBe('');
      expect(textarea.rows).toBe(4);
      expect(textarea.disabled).toBe(false);
      expect(textarea.readonly).toBe(false);
      expect(textarea.required).toBe(false);
      expect(textarea.maxlength).toBe(null);
      expect(textarea.codeMode).toBe(false);
      expect(textarea.showLineNumbers).toBe(false);
    });

    it('placeholder property should work', async () => {
      textarea.placeholder = 'Enter text...';
      await textarea.updateComplete;
      expect(textarea.placeholder).toBe('Enter text...');
      expect(textarea.getAttribute('placeholder')).toBe('Enter text...');
    });

    it('value property should work', async () => {
      textarea.value = 'Test value';
      await textarea.updateComplete;
      expect(textarea.value).toBe('Test value');
    });

    it('rows property should work', async () => {
      textarea.rows = 10;
      await textarea.updateComplete;
      expect(textarea.rows).toBe(10);
      expect(textarea.getAttribute('rows')).toBe('10');
    });

    it('disabled property should work', async () => {
      textarea.disabled = true;
      await textarea.updateComplete;
      expect(textarea.disabled).toBe(true);
      expect(textarea.hasAttribute('disabled')).toBe(true);
    });

    it('readonly property should work', async () => {
      textarea.readonly = true;
      await textarea.updateComplete;
      expect(textarea.readonly).toBe(true);
      expect(textarea.hasAttribute('readonly')).toBe(true);
    });

    it('required property should work', async () => {
      textarea.required = true;
      await textarea.updateComplete;
      expect(textarea.required).toBe(true);
      expect(textarea.hasAttribute('required')).toBe(true);
    });

    it('maxlength property should work', async () => {
      textarea.maxlength = 100;
      await textarea.updateComplete;
      expect(textarea.maxlength).toBe(100);
      expect(textarea.getAttribute('maxlength')).toBe('100');
    });

    it('codeMode property should work', async () => {
      textarea.codeMode = true;
      await textarea.updateComplete;
      expect(textarea.codeMode).toBe(true);
      expect(textarea.hasAttribute('code-mode')).toBe(true);
    });

    it('showLineNumbers property should work', async () => {
      textarea.showLineNumbers = true;
      await textarea.updateComplete;
      expect(textarea.showLineNumbers).toBe(true);
      expect(textarea.hasAttribute('show-line-numbers')).toBe(true);
    });
  });

  // ============================================
  // TEST SUITE 3: Method Functionality
  // ============================================
  describe('Method Functionality', () => {
    it('all 4 public methods should exist', () => {
      expect(typeof textarea.setValue).toBe('function');
      expect(typeof textarea.getValue).toBe('function');
      expect(typeof textarea.focus).toBe('function');
      expect(typeof textarea.blur).toBe('function');
    });

    it('setValue() should set the value', async () => {
      textarea.setValue('New value');
      await textarea.updateComplete;
      expect(textarea.value).toBe('New value');
    });

    it('getValue() should return the value', async () => {
      textarea.value = 'Test value';
      await textarea.updateComplete;
      expect(textarea.getValue()).toBe('Test value');
    });

    it('focus() should focus the textarea', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');
      const focusSpy = vi.spyOn(textareaElement, 'focus');

      textarea.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('blur() should blur the textarea', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');
      const blurSpy = vi.spyOn(textareaElement, 'blur');

      textarea.blur();
      expect(blurSpy).toHaveBeenCalled();
    });
  });

  // ============================================
  // TEST SUITE 4: Event Functionality
  // ============================================
  describe('Event Functionality', () => {
    describe('textarea-input event', () => {
      it('should fire on input', async () => {
        await textarea.updateComplete;

        const inputHandler = vi.fn();
        textarea.addEventListener('textarea-input', inputHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.value = 'Test';
        textareaElement.dispatchEvent(new Event('input', { bubbles: true }));

        expect(inputHandler).toHaveBeenCalled();
        expect(inputHandler.mock.calls[0][0].detail.value).toBe('Test');
      });

      it('should bubble and be composed', async () => {
        await textarea.updateComplete;

        const inputHandler = vi.fn((e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
        });

        textarea.addEventListener('textarea-input', inputHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.value = 'Test';
        textareaElement.dispatchEvent(new Event('input', { bubbles: true }));

        expect(inputHandler).toHaveBeenCalled();
      });

      it('should include correct detail structure', async () => {
        await textarea.updateComplete;

        const inputHandler = vi.fn((e) => {
          expect(e.detail).toHaveProperty('value');
          expect(typeof e.detail.value).toBe('string');
        });

        textarea.addEventListener('textarea-input', inputHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.value = 'Test';
        textareaElement.dispatchEvent(new Event('input', { bubbles: true }));

        expect(inputHandler).toHaveBeenCalled();
      });
    });

    describe('textarea-change event', () => {
      it('should fire on change', async () => {
        await textarea.updateComplete;

        const changeHandler = vi.fn();
        textarea.addEventListener('textarea-change', changeHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.value = 'Changed';
        textareaElement.dispatchEvent(new Event('change', { bubbles: true }));

        expect(changeHandler).toHaveBeenCalled();
        expect(changeHandler.mock.calls[0][0].detail.value).toBe('Changed');
      });

      it('should bubble and be composed', async () => {
        await textarea.updateComplete;

        const changeHandler = vi.fn((e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
        });

        textarea.addEventListener('textarea-change', changeHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.value = 'Test';
        textareaElement.dispatchEvent(new Event('change', { bubbles: true }));

        expect(changeHandler).toHaveBeenCalled();
      });
    });

    describe('textarea-focus event', () => {
      it('should fire on focus', async () => {
        await textarea.updateComplete;

        const focusHandler = vi.fn();
        textarea.addEventListener('textarea-focus', focusHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.dispatchEvent(new Event('focus', { bubbles: true }));

        expect(focusHandler).toHaveBeenCalled();
      });

      it('should bubble and be composed', async () => {
        await textarea.updateComplete;

        const focusHandler = vi.fn((e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
        });

        textarea.addEventListener('textarea-focus', focusHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.dispatchEvent(new Event('focus', { bubbles: true }));

        expect(focusHandler).toHaveBeenCalled();
      });
    });

    describe('textarea-blur event', () => {
      it('should fire on blur', async () => {
        await textarea.updateComplete;

        const blurHandler = vi.fn();
        textarea.addEventListener('textarea-blur', blurHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.dispatchEvent(new Event('blur', { bubbles: true }));

        expect(blurHandler).toHaveBeenCalled();
      });

      it('should bubble and be composed', async () => {
        await textarea.updateComplete;

        const blurHandler = vi.fn((e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
        });

        textarea.addEventListener('textarea-blur', blurHandler);

        const textareaElement = textarea.shadowRoot.querySelector('textarea');
        textareaElement.dispatchEvent(new Event('blur', { bubbles: true }));

        expect(blurHandler).toHaveBeenCalled();
      });
    });

    it('all manifest events are tested', () => {
      const manifestEvents = Object.keys(TTextareaManifest.events);
      const testedEvents = ['textarea-input', 'textarea-change', 'textarea-focus', 'textarea-blur'];

      manifestEvents.forEach(event => {
        expect(testedEvents).toContain(event);
      });
    });
  });

  // ============================================
  // TEST SUITE 5: Form Participation
  // ============================================
  describe('Form Participation', () => {
    it('should have formAssociated set to true', () => {
      expect(TTextareaLit.formAssociated).toBe(true);
    });

    it('should initialize ElementInternals', () => {
      expect(textarea._internals).toBeDefined();
    });

    it('getValue() should return form value', async () => {
      textarea.value = 'Form value';
      await textarea.updateComplete;
      expect(textarea.getValue()).toBe('Form value');
    });

    it('setValue() should update form value', async () => {
      textarea.setValue('New form value');
      await textarea.updateComplete;
      expect(textarea.value).toBe('New form value');
    });

    it('should update internals when value changes', async () => {
      if (textarea._internals) {
        const setFormValueSpy = vi.spyOn(textarea._internals, 'setFormValue');

        textarea.value = 'Updated';
        await textarea.updateComplete;

        expect(setFormValueSpy).toHaveBeenCalledWith('Updated');
      }
    });
  });

  // ============================================
  // TEST SUITE 6: Validation
  // ============================================
  describe('Validation', () => {
    it('should validate maxlength property', () => {
      const validation = TTextareaLit.getPropertyValidation('maxlength');
      expect(validation).toBeDefined();

      const validResult = validation.validate(100);
      expect(validResult.valid).toBe(true);
      expect(validResult.errors.length).toBe(0);
    });

    it('should reject negative maxlength', () => {
      const validation = TTextareaLit.getPropertyValidation('maxlength');

      const invalidResult = validation.validate(-1);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should accept null maxlength', () => {
      const validation = TTextareaLit.getPropertyValidation('maxlength');

      const nullResult = validation.validate(null);
      expect(nullResult.valid).toBe(true);
    });

    it('should reject zero maxlength', () => {
      const validation = TTextareaLit.getPropertyValidation('maxlength');

      const zeroResult = validation.validate(0);
      expect(zeroResult.valid).toBe(false);
    });
  });

  // ============================================
  // TEST SUITE 7: Rendering
  // ============================================
  describe('Rendering', () => {
    it('should render with shadow DOM', async () => {
      await textarea.updateComplete;
      expect(textarea.shadowRoot).toBeDefined();
    });

    it('should render textarea element', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');
      expect(textareaElement).toBeDefined();
    });

    it('should render without line numbers by default', async () => {
      await textarea.updateComplete;
      const lineNumbers = textarea.shadowRoot.querySelector('.line-numbers');
      expect(lineNumbers).toBeNull();
    });

    it('should render with line numbers when enabled', async () => {
      textarea.showLineNumbers = true;
      await textarea.updateComplete;
      const lineNumbers = textarea.shadowRoot.querySelector('.line-numbers');
      expect(lineNumbers).not.toBeNull();
    });

    it('should apply correct container class with line numbers', async () => {
      textarea.showLineNumbers = true;
      await textarea.updateComplete;
      const container = textarea.shadowRoot.querySelector('.textarea-container');
      expect(container.classList.contains('with-line-numbers')).toBe(true);
    });

    it('should update line numbers count based on content', async () => {
      textarea.showLineNumbers = true;
      await textarea.updateComplete;

      textarea.value = 'Line 1\nLine 2\nLine 3';
      await textarea.updateComplete;
      // Wait for second update triggered by _updateLineNumbers
      await textarea.updateComplete;

      const lineNumbers = textarea.shadowRoot.querySelectorAll('.line-number');
      expect(lineNumbers.length).toBe(3);
    });

    it('should disable textarea when disabled', async () => {
      textarea.disabled = true;
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');
      expect(textareaElement.disabled).toBe(true);
    });

    it('should make textarea readonly when readonly', async () => {
      textarea.readonly = true;
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');
      expect(textareaElement.readOnly).toBe(true);
    });
  });

  // ============================================
  // TEST SUITE 8: Code Editor Mode
  // ============================================
  describe('Code Editor Mode', () => {
    beforeEach(async () => {
      textarea.codeMode = true;
      await textarea.updateComplete;
    });

    it('should enable code mode', () => {
      expect(textarea.codeMode).toBe(true);
      expect(textarea.hasAttribute('code-mode')).toBe(true);
    });

    it('should handle Tab key for indentation', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');

      textareaElement.value = '';
      textareaElement.selectionStart = 0;
      textareaElement.selectionEnd = 0;

      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true
      });

      textareaElement.dispatchEvent(tabEvent);

      expect(textarea.value).toContain('\t');
    });

    it('should handle Shift+Tab for outdent', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');

      textareaElement.value = '\tIndented line';
      textareaElement.selectionStart = 1;
      textareaElement.selectionEnd = 1;

      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true
      });

      textareaElement.dispatchEvent(shiftTabEvent);

      expect(textarea.value).toBe('Indented line');
    });

    it('should handle Enter for auto-indent', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');

      textareaElement.value = '\tIndented line';
      textareaElement.selectionStart = '\tIndented line'.length;
      textareaElement.selectionEnd = '\tIndented line'.length;

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true
      });

      textareaElement.dispatchEvent(enterEvent);

      expect(textarea.value).toContain('\n\t');
    });

    it('should handle Ctrl+/ or Cmd+/ for toggle comment', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');

      textareaElement.value = 'const x = 1;';
      textareaElement.selectionStart = 0;
      textareaElement.selectionEnd = 0;

      const commentEvent = new KeyboardEvent('keydown', {
        key: '/',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });

      textareaElement.dispatchEvent(commentEvent);

      expect(textarea.value).toContain('//');
    });

    it('should handle Ctrl+D or Cmd+D for duplicate line', async () => {
      await textarea.updateComplete;
      const textareaElement = textarea.shadowRoot.querySelector('textarea');

      textareaElement.value = 'Line to duplicate';
      textareaElement.selectionStart = 0;
      textareaElement.selectionEnd = 0;

      const duplicateEvent = new KeyboardEvent('keydown', {
        key: 'd',
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });

      textareaElement.dispatchEvent(duplicateEvent);

      const lines = textarea.value.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });
  });

  // ============================================
  // TEST SUITE 9: Logging
  // ============================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(textarea._logger).toBeDefined();
    });

    it('should have all logger methods', () => {
      expect(typeof textarea._logger.error).toBe('function');
      expect(typeof textarea._logger.warn).toBe('function');
      expect(typeof textarea._logger.info).toBe('function');
      expect(typeof textarea._logger.debug).toBe('function');
      expect(typeof textarea._logger.trace).toBe('function');
    });
  });
});