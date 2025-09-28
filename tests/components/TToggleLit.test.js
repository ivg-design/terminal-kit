import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TToggleLit, TToggleManifest } from '../../js/components/TToggleLit.js';

describe('TToggleLit', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('t-tog');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component?.remove();
  });

  // ========================================
  // SUITE 1: Component Initialization
  // ========================================
  describe('Component Initialization', () => {
    it('should have correct static metadata', () => {
      expect(component.constructor.tagName).toBe('t-tog');
      expect(component.constructor.version).toBe('1.0.0');
      expect(component.constructor.category).toBe('Form Controls');
    });

    it('should set formAssociated to true', () => {
      expect(component.constructor.formAssociated).toBe(true);
    });

    it('should register with custom elements', () => {
      expect(customElements.get('t-tog')).toBeDefined();
    });
  });

  // ========================================
  // SUITE 2: Properties
  // ========================================
  describe('Properties', () => {
    it('should have correct default values', () => {
      expect(component.label).toBe('');
      expect(component.checked).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.variant).toBe('switch');
      expect(component.labelPosition).toBe('right');
      expect(component.iconOn).toBe('');
      expect(component.iconOff).toBe('');
      expect(component.size).toBe('medium');
      expect(component.loading).toBe(false);
      expect(component.required).toBe(false);
    });

    it('should update label property', async () => {
      component.label = 'Test Label';
      await component.updateComplete;
      expect(component.label).toBe('Test Label');
      expect(component.getAttribute('label')).toBe('Test Label');
    });

    it('should update checked property', async () => {
      component.checked = true;
      await component.updateComplete;
      expect(component.checked).toBe(true);
      expect(component.hasAttribute('checked')).toBe(true);
    });

    it('should update disabled property', async () => {
      component.disabled = true;
      await component.updateComplete;
      expect(component.disabled).toBe(true);
      expect(component.hasAttribute('disabled')).toBe(true);
    });

    it('should update variant property', async () => {
      component.variant = 'checkbox';
      await component.updateComplete;
      expect(component.variant).toBe('checkbox');
      expect(component.getAttribute('variant')).toBe('checkbox');
    });

    it('should update labelPosition property', async () => {
      component.labelPosition = 'left';
      await component.updateComplete;
      expect(component.labelPosition).toBe('left');
      expect(component.getAttribute('label-position')).toBe('left');
    });

    it('should update size property', async () => {
      component.size = 'small';
      await component.updateComplete;
      expect(component.size).toBe('small');
      expect(component.getAttribute('size')).toBe('small');
    });

    it('should update loading property', async () => {
      component.loading = true;
      await component.updateComplete;
      expect(component.loading).toBe(true);
      expect(component.hasAttribute('loading')).toBe(true);
    });

    it('should update required property', async () => {
      component.required = true;
      await component.updateComplete;
      expect(component.required).toBe(true);
      expect(component.hasAttribute('required')).toBe(true);
    });

    it('should update icon properties', async () => {
      component.iconOn = '<svg>✓</svg>';
      component.iconOff = '<svg>✗</svg>';
      await component.updateComplete;
      expect(component.iconOn).toBe('<svg>✓</svg>');
      expect(component.iconOff).toBe('<svg>✗</svg>');
    });
  });

  // ========================================
  // SUITE 3: Methods
  // ========================================
  describe('Methods', () => {
    it('should have all public methods', () => {
      expect(typeof component.toggle).toBe('function');
      expect(typeof component.check).toBe('function');
      expect(typeof component.uncheck).toBe('function');
      expect(typeof component.setValue).toBe('function');
      expect(typeof component.getValue).toBe('function');
      expect(typeof component.focus).toBe('function');
      expect(typeof component.blur).toBe('function');
    });

    it('should toggle checked state', () => {
      expect(component.checked).toBe(false);
      const result = component.toggle();
      expect(result).toBe(true);
      expect(component.checked).toBe(true);

      const result2 = component.toggle();
      expect(result2).toBe(false);
      expect(component.checked).toBe(false);
    });

    it('should check the toggle', () => {
      expect(component.checked).toBe(false);
      component.check();
      expect(component.checked).toBe(true);

      // Calling check again should not change state
      component.check();
      expect(component.checked).toBe(true);
    });

    it('should uncheck the toggle', () => {
      component.checked = true;
      component.uncheck();
      expect(component.checked).toBe(false);

      // Calling uncheck again should not change state
      component.uncheck();
      expect(component.checked).toBe(false);
    });

    it('should block toggle when disabled', () => {
      component.disabled = true;
      const result = component.toggle();
      expect(result).toBe(false);
      expect(component.checked).toBe(false);
    });

    it('should block toggle when loading', () => {
      component.loading = true;
      const result = component.toggle();
      expect(result).toBe(false);
      expect(component.checked).toBe(false);
    });

    it('should setValue with boolean', () => {
      component.setValue(true);
      expect(component.checked).toBe(true);

      component.setValue(false);
      expect(component.checked).toBe(false);
    });

    it('should setValue with string', () => {
      component.setValue('on');
      expect(component.checked).toBe(true);

      component.setValue('off');
      expect(component.checked).toBe(false);

      component.setValue('true');
      expect(component.checked).toBe(true);
    });

    it('should getValue correctly', () => {
      component.checked = false;
      expect(component.getValue()).toBe('off');

      component.checked = true;
      expect(component.getValue()).toBe('on');
    });

    it('should focus the input element', async () => {
      await component.updateComplete;
      const input = component.shadowRoot.querySelector('.native-input');
      const focusSpy = vi.spyOn(input, 'focus');

      component.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur the input element', async () => {
      await component.updateComplete;
      const input = component.shadowRoot.querySelector('.native-input');
      const blurSpy = vi.spyOn(input, 'blur');

      component.blur();
      expect(blurSpy).toHaveBeenCalled();
    });
  });

  // ========================================
  // SUITE 4: Events
  // ========================================
  describe('Events', () => {
    it('should emit toggle-change event when toggled', async () => {
      let eventFired = false;
      let eventDetail;

      component.addEventListener('toggle-change', (e) => {
        eventFired = true;
        eventDetail = e.detail;
        expect(e.detail).toBeDefined();
        expect(e.detail.checked).toBe(true);
        expect(e.bubbles).toBe(true);
        expect(e.composed).toBe(true);
      });

      component.toggle();
      await component.updateComplete;

      expect(eventFired).toBe(true);
      expect(eventDetail.checked).toBe(true);
    });

    it('should emit toggle-change event when checked', async () => {
      let eventFired = false;

      component.addEventListener('toggle-change', (e) => {
        eventFired = true;
        expect(e.detail.checked).toBe(true);
      });

      component.check();
      await component.updateComplete;

      expect(eventFired).toBe(true);
    });

    it('should emit toggle-change event when unchecked', async () => {
      component.checked = true;
      let eventFired = false;

      component.addEventListener('toggle-change', (e) => {
        eventFired = true;
        expect(e.detail.checked).toBe(false);
      });

      component.uncheck();
      await component.updateComplete;

      expect(eventFired).toBe(true);
    });

    it('should emit toggle-change event when setValue changes state', async () => {
      let eventFired = false;

      component.addEventListener('toggle-change', (e) => {
        eventFired = true;
        expect(e.detail.checked).toBe(true);
      });

      component.setValue(true);
      await component.updateComplete;

      expect(eventFired).toBe(true);
    });

    it('should not emit event when setValue does not change state', () => {
      component.checked = true;
      let eventFired = false;

      component.addEventListener('toggle-change', () => {
        eventFired = true;
      });

      component.setValue(true);
      expect(eventFired).toBe(false);
    });

    it('should handle native input change event', async () => {
      await component.updateComplete;
      const input = component.shadowRoot.querySelector('.native-input');
      let eventFired = false;

      component.addEventListener('toggle-change', (e) => {
        eventFired = true;
        expect(e.detail.checked).toBe(true);
      });

      input.checked = true;
      input.dispatchEvent(new Event('change'));

      await component.updateComplete;
      expect(eventFired).toBe(true);
      expect(component.checked).toBe(true);
    });
  });

  // ========================================
  // SUITE 5: Rendering
  // ========================================
  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(component.shadowRoot).toBeDefined();
    });

    it('should render label when provided', async () => {
      component.label = 'Test Label';
      await component.updateComplete;

      const label = component.shadowRoot.querySelector('.toggle-label');
      expect(label).toBeDefined();
      expect(label.textContent).toBe('Test Label');
    });

    it('should not render label when empty', async () => {
      component.label = '';
      await component.updateComplete;

      const label = component.shadowRoot.querySelector('.toggle-label');
      expect(label).toBeNull();
    });

    it('should render switch variant by default', async () => {
      await component.updateComplete;

      const switchEl = component.shadowRoot.querySelector('.toggle-switch');
      const checkbox = component.shadowRoot.querySelector('.toggle-checkbox');

      expect(switchEl).toBeDefined();
      expect(checkbox).toBeNull();
    });

    it('should render checkbox variant when specified', async () => {
      component.variant = 'checkbox';
      await component.updateComplete;

      const switchEl = component.shadowRoot.querySelector('.toggle-switch');
      const checkbox = component.shadowRoot.querySelector('.toggle-checkbox');

      expect(switchEl).toBeNull();
      expect(checkbox).toBeDefined();
    });

    it('should apply checked class when checked', async () => {
      component.checked = true;
      await component.updateComplete;

      const container = component.shadowRoot.querySelector('.terminal-toggle');
      expect(container.classList.contains('checked')).toBe(true);
    });

    it('should apply label-left class when labelPosition is left', async () => {
      component.labelPosition = 'left';
      await component.updateComplete;

      const container = component.shadowRoot.querySelector('.terminal-toggle');
      expect(container.classList.contains('label-left')).toBe(true);
    });

    it('should render icon when provided', async () => {
      component.iconOff = '<svg>✗</svg>';
      component.checked = false;
      await component.updateComplete;

      const icon = component.shadowRoot.querySelector('.toggle-icon');
      expect(icon).toBeDefined();
      expect(icon.innerHTML).toBe('<svg>✗</svg>');
    });

    it('should switch icons based on checked state', async () => {
      component.iconOn = '<svg>✓</svg>';
      component.iconOff = '<svg>✗</svg>';
      component.checked = false;
      await component.updateComplete;

      let icon = component.shadowRoot.querySelector('.toggle-icon');
      expect(icon.innerHTML).toBe('<svg>✗</svg>');

      component.checked = true;
      await component.updateComplete;

      icon = component.shadowRoot.querySelector('.toggle-icon');
      expect(icon.innerHTML).toBe('<svg>✓</svg>');
    });

    it('should render native input with correct attributes', async () => {
      component.disabled = true;
      component.required = true;
      component.checked = true;
      component.label = 'Test';
      await component.updateComplete;

      const input = component.shadowRoot.querySelector('.native-input');
      expect(input).toBeDefined();
      expect(input.type).toBe('checkbox');
      expect(input.checked).toBe(true);
      expect(input.disabled).toBe(true);
      expect(input.required).toBe(true);
      expect(input.getAttribute('aria-label')).toBe('Test');
    });
  });

  // ========================================
  // SUITE 6: Form Participation
  // ========================================
  describe('Form Participation', () => {
    it('should initialize ElementInternals if supported', () => {
      if (component.attachInternals) {
        expect(component._internals).toBeDefined();
      }
    });

    it('should set form value on initialization', async () => {
      if (component._internals) {
        const newToggle = document.createElement('t-tog');
        newToggle.setAttribute('checked', '');
        document.body.appendChild(newToggle);
        expect(newToggle._internals).toBeDefined();
        // ElementInternals setFormValue is called in connectedCallback
      }
    });

    it('should update form value when checked changes', async () => {
      if (component._internals) {
        const setFormValueSpy = vi.spyOn(component._internals, 'setFormValue');

        component.checked = true;
        await component.updateComplete;

        expect(setFormValueSpy).toHaveBeenCalledWith('on');

        component.checked = false;
        await component.updateComplete;

        expect(setFormValueSpy).toHaveBeenCalledWith('off');
      }
    });

    it('should update ARIA attributes', async () => {
      if (component._internals) {
        component.checked = true;
        component.disabled = true;
        component.required = true;
        await component.updateComplete;

        expect(component._internals.ariaChecked).toBe('true');
        expect(component._internals.ariaDisabled).toBe('true');
        expect(component._internals.ariaRequired).toBe('true');
      }
    });

    it('should validate required field', async () => {
      if (component._internals) {
        const setValiditySpy = vi.spyOn(component._internals, 'setValidity');

        component.required = true;
        component.checked = false;
        await component.updateComplete;

        // Should set valueMissing validity
        const lastCall = setValiditySpy.mock.calls[setValiditySpy.mock.calls.length - 1];
        expect(lastCall[0]).toEqual({ valueMissing: true });

        component.checked = true;
        await component.updateComplete;

        // Should clear validity
        const lastCall2 = setValiditySpy.mock.calls[setValiditySpy.mock.calls.length - 1];
        expect(lastCall2[0]).toEqual({});
      }
    });
  });

  // ========================================
  // SUITE 7: Keyboard Interaction
  // ========================================
  describe('Keyboard Interaction', () => {
    it('should toggle on space key', async () => {
      await component.updateComplete;
      const container = component.shadowRoot.querySelector('.terminal-toggle');

      const event = new KeyboardEvent('keydown', { key: ' ' });
      container.dispatchEvent(event);

      expect(component.checked).toBe(true);
    });

    it('should toggle on Enter key', async () => {
      await component.updateComplete;
      const container = component.shadowRoot.querySelector('.terminal-toggle');

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      container.dispatchEvent(event);

      expect(component.checked).toBe(true);
    });

    it('should not toggle when disabled', async () => {
      component.disabled = true;
      await component.updateComplete;
      const container = component.shadowRoot.querySelector('.terminal-toggle');

      const event = new KeyboardEvent('keydown', { key: ' ' });
      container.dispatchEvent(event);

      expect(component.checked).toBe(false);
    });

    it('should not toggle when loading', async () => {
      component.loading = true;
      await component.updateComplete;
      const container = component.shadowRoot.querySelector('.terminal-toggle');

      const event = new KeyboardEvent('keydown', { key: ' ' });
      container.dispatchEvent(event);

      expect(component.checked).toBe(false);
    });
  });

  // ========================================
  // SUITE 8: Logging
  // ========================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(component._logger).toBeDefined();
    });

    it('should have all logger methods', () => {
      expect(typeof component._logger.error).toBe('function');
      expect(typeof component._logger.warn).toBe('function');
      expect(typeof component._logger.info).toBe('function');
      expect(typeof component._logger.debug).toBe('function');
      expect(typeof component._logger.trace).toBe('function');
    });

    it('should log debug messages without error', () => {
      expect(() => {
        component._logger.debug('Test debug message');
      }).not.toThrow();
    });

    it('should log lifecycle events', () => {
      const debugSpy = vi.spyOn(component._logger, 'debug');

      component.connectedCallback();
      expect(debugSpy).toHaveBeenCalledWith('Connected to DOM');

      component.disconnectedCallback();
      expect(debugSpy).toHaveBeenCalledWith('Disconnected from DOM');
    });
  });

  // ========================================
  // SUITE 9: Accessibility
  // ========================================
  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      if (component._internals) {
        expect(component._internals.ariaRole).toBe('switch');
      }
    });

    it('should have proper tabindex on native input', async () => {
      await component.updateComplete;
      const input = component.shadowRoot.querySelector('.native-input');
      expect(input.getAttribute('tabindex')).toBe('0');
    });

    it('should have aria-label on native input', async () => {
      component.label = 'Toggle Option';
      await component.updateComplete;

      const input = component.shadowRoot.querySelector('.native-input');
      expect(input.getAttribute('aria-label')).toBe('Toggle Option');
    });

    it('should have default aria-label when no label provided', async () => {
      component.label = '';
      await component.updateComplete;

      const input = component.shadowRoot.querySelector('.native-input');
      expect(input.getAttribute('aria-label')).toBe('Toggle');
    });
  });

  // ========================================
  // SUITE 10: Edge Cases
  // ========================================
  describe('Edge Cases', () => {
    it('should handle rapid toggling', async () => {
      for (let i = 0; i < 10; i++) {
        component.toggle();
      }

      await component.updateComplete;
      expect(component.checked).toBe(false); // Even number of toggles
    });

    it('should handle property changes during disabled state', async () => {
      component.disabled = true;
      component.checked = true;
      await component.updateComplete;

      expect(component.checked).toBe(true);
      // Should still update visually even when disabled
      const container = component.shadowRoot.querySelector('.terminal-toggle');
      expect(container.classList.contains('checked')).toBe(true);
    });

    it('should handle invalid setValue inputs', () => {
      component.setValue('invalid');
      expect(component.checked).toBe(false);

      component.setValue(null);
      expect(component.checked).toBe(false);

      component.setValue(undefined);
      expect(component.checked).toBe(false);

      component.setValue(1);
      expect(component.checked).toBe(false);
    });

    it('should prevent default on change event when disabled', async () => {
      component.disabled = true;
      await component.updateComplete;

      const input = component.shadowRoot.querySelector('.native-input');
      const event = new Event('change');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      input.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.checked).toBe(false);
    });
  });

  describe('Advanced Features', () => {
    it('should handle equalStates property', async () => {
      const el = document.createElement('t-tog');
      el.setAttribute('equal-states', '');
      document.body.appendChild(el);
      expect(el.equalStates).toBe(true);

      // Wait for render
      await el.updateComplete;

      // Both states should appear as "on"
      const toggle = el.shadowRoot.querySelector('.toggle-switch');
      expect(toggle).toBeTruthy();

      // Check CSS class is applied
      const label = el.shadowRoot.querySelector('.terminal-toggle');
      expect(label.classList.contains('equal-states')).toBe(true);
    });

    it('should handle colorScheme property', async () => {
      const el = document.createElement('t-tog');
      el.setAttribute('variant', 'checkbox');
      el.setAttribute('color-scheme', 'error');
      document.body.appendChild(el);
      expect(el.colorScheme).toBe('error');

      el.colorScheme = 'warning';
      await el.updateComplete;
      expect(el.colorScheme).toBe('warning');

      el.colorScheme = 'success';
      await el.updateComplete;
      expect(el.colorScheme).toBe('success');
    });

    it('should handle alignment property for checkboxes', async () => {
      const el = document.createElement('t-tog');
      el.setAttribute('variant', 'checkbox');
      el.setAttribute('alignment', 'right');
      el.setAttribute('label', 'Test');
      document.body.appendChild(el);
      expect(el.alignment).toBe('right');

      await el.updateComplete;
      const label = el.shadowRoot.querySelector('.toggle-label');
      const checkbox = el.shadowRoot.querySelector('.toggle-checkbox');
      expect(label).toBeTruthy();
      expect(checkbox).toBeTruthy();

      // Test left alignment
      el.alignment = 'left';
      await el.updateComplete;
      expect(el.alignment).toBe('left');
    });

    it('should validate enum properties', async () => {
      const el = document.createElement('t-tog');
      document.body.appendChild(el);

      // Test valid variant
      el.variant = 'checkbox';
      expect(el.variant).toBe('checkbox');

      // Test valid size
      el.size = 'large';
      expect(el.size).toBe('large');

      // Test valid alignment
      el.alignment = 'right';
      expect(el.alignment).toBe('right');

      // Test valid colorScheme
      el.colorScheme = 'error';
      expect(el.colorScheme).toBe('error');
    });

    it('should handle labelOn and labelOff properties', async () => {
      const el = document.createElement('t-tog');
      el.setAttribute('label-on', 'Active');
      el.setAttribute('label-off', 'Inactive');
      document.body.appendChild(el);

      expect(el.labelOn).toBe('Active');
      expect(el.labelOff).toBe('Inactive');

      // Label should show 'Inactive' when unchecked
      await el.updateComplete;
      let label = el.shadowRoot.querySelector('.toggle-label');
      expect(label.textContent).toBe('Inactive');

      // Toggle to checked
      el.checked = true;
      await el.updateComplete;
      label = el.shadowRoot.querySelector('.toggle-label');
      expect(label.textContent).toBe('Active');
    });

    it('should handle iconOn and iconOff properties', async () => {
      const el = document.createElement('t-tog');
      el.setAttribute('icon-on', '✓');
      el.setAttribute('icon-off', '✗');
      document.body.appendChild(el);

      expect(el.iconOn).toBe('✓');
      expect(el.iconOff).toBe('✗');

      // Icon should show '✗' when unchecked
      await el.updateComplete;
      let icon = el.shadowRoot.querySelector('.toggle-icon');
      expect(icon.innerHTML).toBe('✗');

      // Toggle to checked
      el.checked = true;
      await el.updateComplete;
      icon = el.shadowRoot.querySelector('.toggle-icon');
      expect(icon.innerHTML).toBe('✓');
    });

    it('should handle loading property', async () => {
      const el = document.createElement('t-tog');
      el.setAttribute('loading', '');
      document.body.appendChild(el);
      expect(el.loading).toBe(true);

      // Should block toggle when loading
      el.toggle();
      await el.updateComplete;
      expect(el.checked).toBe(false);

      // Should allow toggle when not loading
      el.loading = false;
      el.toggle();
      await el.updateComplete;
      expect(el.checked).toBe(true);
    });

    it('should handle all size variants', async () => {
      const el = document.createElement('t-tog');
      document.body.appendChild(el);

      // Test small size
      el.size = 'small';
      await el.updateComplete;
      expect(el.size).toBe('small');

      // Test medium size (default)
      el.size = 'medium';
      await el.updateComplete;
      expect(el.size).toBe('medium');

      // Test large size
      el.size = 'large';
      await el.updateComplete;
      expect(el.size).toBe('large');
    });
  });
});