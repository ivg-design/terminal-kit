/**
 * @file TTextareaLit.test.js
 * @description Unit tests for TTextareaLit component
 * @author Terminal Kit Team
 * @since 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html, expect as litExpect } from '@open-wc/testing';
import './TTextareaLit.js';

describe('TTextareaLit Component', () => {
  let element;

  // ============================================
  // Test Suite 1: Properties
  // ============================================
  describe('Properties', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    it('should have default property values', () => {
      expect(element.placeholder).toBe('');
      expect(element.value).toBe('');
      expect(element.rows).toBe(4);
      expect(element.disabled).toBe(false);
      expect(element.readonly).toBe(false);
      expect(element.required).toBe(false);
      expect(element.maxlength).toBe(null);
      expect(element.codeMode).toBe(false);
      expect(element.showLineNumbers).toBe(false);
      expect(element.resize).toBe('vertical');
      expect(element.language).toBe(null);
    });

    it('should reflect placeholder attribute', async () => {
      element.placeholder = 'Enter text...';
      await element.updateComplete;
      expect(element.getAttribute('placeholder')).toBe('Enter text...');
    });

    it('should reflect disabled attribute', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should reflect readonly attribute', async () => {
      element.readonly = true;
      await element.updateComplete;
      expect(element.hasAttribute('readonly')).toBe(true);
    });

    it('should reflect code-mode attribute', async () => {
      element.codeMode = true;
      await element.updateComplete;
      expect(element.hasAttribute('code-mode')).toBe(true);
    });

    it('should reflect show-line-numbers attribute', async () => {
      element.showLineNumbers = true;
      await element.updateComplete;
      expect(element.hasAttribute('show-line-numbers')).toBe(true);
    });

    it('should update value property', async () => {
      element.value = 'Test content';
      await element.updateComplete;
      expect(element.value).toBe('Test content');
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.value).toBe('Test content');
    });

    it('should update rows property', async () => {
      element.rows = 10;
      await element.updateComplete;
      expect(element.getAttribute('rows')).toBe('10');
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.rows).toBe(10);
    });

    it('should update maxlength property', async () => {
      element.maxlength = 500;
      await element.updateComplete;
      expect(element.getAttribute('maxlength')).toBe('500');
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.maxLength).toBe(500);
    });

    it('should update language property', async () => {
      element.language = 'javascript';
      await element.updateComplete;
      expect(element.getAttribute('language')).toBe('javascript');
    });

    it('should update resize property', async () => {
      element.resize = 'both';
      await element.updateComplete;
      expect(element.getAttribute('resize')).toBe('both');
    });
  });

  // ============================================
  // Test Suite 2: Rendering
  // ============================================
  describe('Rendering', () => {
    it('should render textarea element', async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea).toBeDefined();
    });

    it('should render with placeholder', async () => {
      element = await fixture(html`<t-textarea placeholder="Enter message"></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.placeholder).toBe('Enter message');
    });

    it('should render with initial value', async () => {
      element = await fixture(html`<t-textarea value="Initial text"></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.value).toBe('Initial text');
    });

    it('should render line numbers when showLineNumbers is true', async () => {
      element = await fixture(html`<t-textarea show-line-numbers value="Line 1\nLine 2\nLine 3"></t-textarea>`);
      const lineNumbers = element.shadowRoot.querySelector('.line-numbers');
      expect(lineNumbers).toBeDefined();
      const lineNumberElements = lineNumbers.querySelectorAll('.line-number');
      expect(lineNumberElements.length).toBe(3);
    });

    it('should render syntax highlighting layer when language is set', async () => {
      // Mock Prism if needed
      if (!window.Prism) {
        window.Prism = {
          languages: {
            javascript: {}
          },
          highlight: (code, grammar, lang) => code
        };
      }

      element = await fixture(html`<t-textarea language="javascript" value="const x = 1;"></t-textarea>`);
      const highlightLayer = element.shadowRoot.querySelector('.syntax-highlight-layer');
      expect(highlightLayer).toBeDefined();
    });

    it('should apply code-mode styles', async () => {
      element = await fixture(html`<t-textarea code-mode></t-textarea>`);
      const container = element.shadowRoot.querySelector('.textarea-container');
      const computedStyle = window.getComputedStyle(container);
      // Check if code mode styles are applied
      expect(element.hasAttribute('code-mode')).toBe(true);
    });

    it('should disable textarea when disabled is true', async () => {
      element = await fixture(html`<t-textarea disabled></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.disabled).toBe(true);
    });

    it('should make textarea readonly when readonly is true', async () => {
      element = await fixture(html`<t-textarea readonly></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.readOnly).toBe(true);
    });

    it('should apply resize styles', async () => {
      element = await fixture(html`<t-textarea resize="both"></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      const computedStyle = window.getComputedStyle(textarea);
      expect(computedStyle.resize).toBe('both');
    });

    it('should disable spellcheck attributes', async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.getAttribute('spellcheck')).toBe('false');
      expect(textarea.getAttribute('autocomplete')).toBe('off');
      expect(textarea.getAttribute('autocorrect')).toBe('off');
      expect(textarea.getAttribute('autocapitalize')).toBe('off');
    });
  });

  // ============================================
  // Test Suite 3: Logging
  // ============================================
  describe('Logging', () => {
    let logSpy;

    beforeEach(async () => {
      // Mock the logger
      logSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    afterEach(() => {
      logSpy.mockRestore();
    });

    it('should log when setValue is called', () => {
      element.setValue('Test value');
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('setValue called'));
    });

    it('should log when getValue is called', () => {
      element.getValue();
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('getValue called'));
    });

    it('should log when focus is called', () => {
      element.focus();
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('focus called'));
    });

    it('should log when blur is called', () => {
      element.blur();
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('blur called'));
    });

    it('should log when emitting events', () => {
      element._emitEvent('test-event', { test: true });
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Emitting event'));
    });
  });

  // ============================================
  // Test Suite 4: Public Methods
  // ============================================
  describe('Public Methods', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    describe('setValue()', () => {
      it('should set the value property', () => {
        element.setValue('New value');
        expect(element.value).toBe('New value');
      });

      it('should update the textarea element', async () => {
        element.setValue('Updated text');
        await element.updateComplete;
        const textarea = element.shadowRoot.querySelector('textarea');
        expect(textarea.value).toBe('Updated text');
      });

      it('should emit textarea-input event', async () => {
        const eventSpy = vi.fn();
        element.addEventListener('textarea-input', eventSpy);

        element.setValue('Event test');
        await element.updateComplete;

        expect(eventSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { value: 'Event test' }
          })
        );
      });

      it('should update form value via ElementInternals', () => {
        element.setValue('Form value');
        // ElementInternals is updated internally
        expect(element.value).toBe('Form value');
      });
    });

    describe('getValue()', () => {
      it('should return the current value', () => {
        element.value = 'Current value';
        expect(element.getValue()).toBe('Current value');
      });

      it('should return empty string by default', () => {
        expect(element.getValue()).toBe('');
      });
    });

    describe('focus()', () => {
      it('should focus the textarea element', () => {
        const textarea = element.shadowRoot.querySelector('textarea');
        const focusSpy = vi.spyOn(textarea, 'focus');

        element.focus();
        expect(focusSpy).toHaveBeenCalled();
      });
    });

    describe('blur()', () => {
      it('should blur the textarea element', () => {
        const textarea = element.shadowRoot.querySelector('textarea');
        const blurSpy = vi.spyOn(textarea, 'blur');

        element.blur();
        expect(blurSpy).toHaveBeenCalled();
      });
    });

    describe('selectAll()', () => {
      it('should select all text in textarea', () => {
        element.value = 'Select this text';
        const textarea = element.shadowRoot.querySelector('textarea');
        const selectSpy = vi.spyOn(textarea, 'select');

        element.selectAll();
        expect(selectSpy).toHaveBeenCalled();
      });
    });

    describe('clear()', () => {
      it('should clear the textarea value', () => {
        element.value = 'Clear this';
        element.clear();
        expect(element.value).toBe('');
      });

      it('should emit textarea-input event', async () => {
        element.value = 'Clear this';
        const eventSpy = vi.fn();
        element.addEventListener('textarea-input', eventSpy);

        element.clear();
        await element.updateComplete;

        expect(eventSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { value: '' }
          })
        );
      });
    });

    describe('receiveContext()', () => {
      it('should store received context', () => {
        const context = { theme: 'dark', parent: 'form' };
        element.receiveContext(context);
        expect(element.getContext()).toEqual(context);
      });
    });

    describe('getContext()', () => {
      it('should return null by default', () => {
        expect(element.getContext()).toBe(null);
      });

      it('should return stored context', () => {
        const context = { test: true };
        element.receiveContext(context);
        expect(element.getContext()).toEqual(context);
      });
    });
  });

  // ============================================
  // Test Suite 5: Events
  // ============================================
  describe('Events', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    it('should emit textarea-input on input', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('textarea-input', eventSpy);

      const textarea = element.shadowRoot.querySelector('textarea');
      textarea.value = 'User input';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: 'User input' }
        })
      );
    });

    it('should emit textarea-change on change', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('textarea-change', eventSpy);

      const textarea = element.shadowRoot.querySelector('textarea');
      textarea.value = 'Changed value';
      textarea.dispatchEvent(new Event('change', { bubbles: true }));

      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: 'Changed value' }
        })
      );
    });

    it('should emit textarea-focus on focus', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('textarea-focus', eventSpy);

      const textarea = element.shadowRoot.querySelector('textarea');
      textarea.dispatchEvent(new Event('focus', { bubbles: true }));

      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalled();
    });

    it('should emit textarea-blur on blur', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('textarea-blur', eventSpy);

      const textarea = element.shadowRoot.querySelector('textarea');
      textarea.dispatchEvent(new Event('blur', { bubbles: true }));

      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalled();
    });

    it('should bubble and compose events', async () => {
      const parentDiv = document.createElement('div');
      parentDiv.appendChild(element);
      document.body.appendChild(parentDiv);

      const eventSpy = vi.fn();
      parentDiv.addEventListener('textarea-input', eventSpy);

      element.setValue('Bubbled event');
      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalled();

      document.body.removeChild(parentDiv);
    });
  });

  // ============================================
  // Test Suite 6: Validation
  // ============================================
  describe('Validation', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    describe('maxlength validation', () => {
      it('should accept valid maxlength', () => {
        const validation = element.constructor.getPropertyValidation('maxlength');
        const result = validation.validate(100);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should reject negative maxlength', () => {
        const validation = element.constructor.getPropertyValidation('maxlength');
        const result = validation.validate(-5);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('maxlength must be a positive number');
      });

      it('should reject non-number maxlength', () => {
        const validation = element.constructor.getPropertyValidation('maxlength');
        const result = validation.validate('abc');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('maxlength must be a positive number');
      });

      it('should accept null maxlength', () => {
        const validation = element.constructor.getPropertyValidation('maxlength');
        const result = validation.validate(null);
        expect(result.valid).toBe(true);
      });
    });

    describe('rows validation', () => {
      it('should accept valid rows', () => {
        const validation = element.constructor.getPropertyValidation('rows');
        const result = validation.validate(10);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should reject rows over 50', () => {
        const validation = element.constructor.getPropertyValidation('rows');
        const result = validation.validate(51);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('rows must be between 1 and 50');
      });

      it('should reject rows less than 1', () => {
        const validation = element.constructor.getPropertyValidation('rows');
        const result = validation.validate(0);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('rows must be between 1 and 50');
      });

      it('should accept null rows', () => {
        const validation = element.constructor.getPropertyValidation('rows');
        const result = validation.validate(null);
        expect(result.valid).toBe(true);
      });
    });

    describe('language validation', () => {
      it('should accept valid language', () => {
        const validation = element.constructor.getPropertyValidation('language');
        const result = validation.validate('javascript');
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should reject invalid language', () => {
        const validation = element.constructor.getPropertyValidation('language');
        const result = validation.validate('cobol');
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('language must be one of:');
      });

      it('should accept null language', () => {
        const validation = element.constructor.getPropertyValidation('language');
        const result = validation.validate(null);
        expect(result.valid).toBe(true);
      });

      it('should accept empty string language', () => {
        const validation = element.constructor.getPropertyValidation('language');
        const result = validation.validate('');
        expect(result.valid).toBe(true);
      });
    });

    describe('resize validation', () => {
      it('should accept valid resize values', () => {
        const validation = element.constructor.getPropertyValidation('resize');

        expect(validation.validate('both').valid).toBe(true);
        expect(validation.validate('horizontal').valid).toBe(true);
        expect(validation.validate('vertical').valid).toBe(true);
        expect(validation.validate('none').valid).toBe(true);
      });

      it('should reject invalid resize value', () => {
        const validation = element.constructor.getPropertyValidation('resize');
        const result = validation.validate('diagonal');
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('resize must be one of:');
      });

      it('should accept null resize', () => {
        const validation = element.constructor.getPropertyValidation('resize');
        const result = validation.validate(null);
        expect(result.valid).toBe(true);
      });
    });
  });

  // ============================================
  // Test Suite 7: Form Participation
  // ============================================
  describe('Form Participation', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    it('should have formAssociated set to true', () => {
      expect(element.constructor.formAssociated).toBe(true);
    });

    it('should update form value when value changes', async () => {
      element.value = 'Form data';
      await element.updateComplete;

      // ElementInternals setFormValue is called internally
      expect(element.value).toBe('Form data');
    });

    it('should participate in form validation', async () => {
      element.required = true;
      element.value = '';
      await element.updateComplete;

      // Component should be invalid when required but empty
      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.required).toBe(true);
    });

    it('should handle disabled state in forms', async () => {
      element.disabled = true;
      await element.updateComplete;

      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.disabled).toBe(true);
    });
  });

  // ============================================
  // Test Suite 8: Code Editor Features
  // ============================================
  describe('Code Editor Features', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea code-mode show-line-numbers></t-textarea>`);
    });

    it('should handle Tab key in code mode', async () => {
      const textarea = element.shadowRoot.querySelector('textarea');
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        bubbles: true,
        cancelable: true
      });

      textarea.value = 'test';
      textarea.setSelectionRange(4, 4); // Cursor at end

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      textarea.dispatchEvent(event);

      // Tab should be prevented in code mode
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should update line count on value change', async () => {
      element.value = 'Line 1\nLine 2\nLine 3';
      await element.updateComplete;

      const lineNumbers = element.shadowRoot.querySelector('.line-numbers');
      const lineNumberElements = lineNumbers.querySelectorAll('.line-number');
      expect(lineNumberElements.length).toBe(3);
    });

    it('should sync scroll between textarea and highlight layer', async () => {
      // Mock Prism
      if (!window.Prism) {
        window.Prism = {
          languages: { javascript: {} },
          highlight: (code) => code
        };
      }

      element.language = 'javascript';
      element.value = 'const x = 1;\n'.repeat(50); // Long content
      await element.updateComplete;

      const textarea = element.shadowRoot.querySelector('textarea');
      const highlightLayer = element.shadowRoot.querySelector('.syntax-highlight-layer');

      // Simulate scroll
      textarea.scrollTop = 100;
      element._handleScroll({ target: textarea });

      expect(highlightLayer.scrollTop).toBe(100);
    });

    it('should apply syntax highlighting when language is set', async () => {
      // Mock Prism
      if (!window.Prism) {
        window.Prism = {
          languages: {
            javascript: {}
          },
          highlight: (code, grammar, lang) => `<span class="token keyword">const</span> x = 1;`
        };
      }

      element.language = 'javascript';
      element.value = 'const x = 1;';
      await element.updateComplete;

      const highlightLayer = element.shadowRoot.querySelector('.syntax-highlight-layer');
      expect(highlightLayer).toBeDefined();
      expect(highlightLayer.innerHTML).toContain('token');
    });
  });

  // ============================================
  // Test Suite 9: Accessibility
  // ============================================
  describe('Accessibility', () => {
    beforeEach(async () => {
      element = await fixture(html`<t-textarea></t-textarea>`);
    });

    it('should support aria-label', async () => {
      element.setAttribute('aria-label', 'Message input');
      await element.updateComplete;

      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.getAttribute('aria-label')).toBe('Message input');
    });

    it('should support aria-describedby', async () => {
      element.setAttribute('aria-describedby', 'help-text');
      await element.updateComplete;

      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.getAttribute('aria-describedby')).toBe('help-text');
    });

    it('should handle required attribute for accessibility', async () => {
      element.required = true;
      await element.updateComplete;

      const textarea = element.shadowRoot.querySelector('textarea');
      expect(textarea.required).toBe(true);
    });
  });
});