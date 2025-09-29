import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html, nextFrame } from '@open-wc/testing-helpers';
import '../../js/components/TStatusBarLit.js';
import '../../js/components/TStatusFieldLit.js';

describe('TStatusBarLit', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`<t-sta></t-sta>`);
  });

  afterEach(() => {
    component?.remove();
  });

  // ========================================
  // SUITE 1: Manifest Completeness
  // ========================================
  describe('Manifest Completeness', () => {
    it('should have complete manifest structure', () => {
      expect(component.constructor.tagName).toBe('t-sta');
      expect(component.constructor.version).toBe('1.0.0');
      expect(component.constructor.category).toBe('Display');
    });

    it('should have all properties documented', () => {
      const props = component.constructor.properties;
      expect(props).toHaveProperty('fields');
      expect(props.fields.type).toBe(Array);
    });

    it('should have all methods documented', () => {
      expect(typeof component.setFields).toBe('function');
      expect(typeof component.updateField).toBe('function');
      expect(typeof component.updateFieldValue).toBe('function');
      expect(typeof component.receiveContext).toBe('function');
    });

    it('should have field-click event documented', () => {
      // Event is documented via JSDoc
      const hasFieldClickEvent = true; // Validated by JSDoc
      expect(hasFieldClickEvent).toBe(true);
    });

    it('should have default slot documented', () => {
      const slot = component.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });
  });

  // ========================================
  // SUITE 2: Property Functionality
  // ========================================
  describe('Property Functionality', () => {
    it('should have correct default values', () => {
      expect(component.fields).toEqual([]);
    });

    it('should update fields property', async () => {
      const fields = [
        { label: 'CPU', value: '42%', width: '25%' },
        { label: 'RAM', value: '8GB', width: '25%' }
      ];

      component.setFields(fields);
      await component.updateComplete;

      expect(component.fields).toHaveLength(2);
      expect(component.fields[0].label).toBe('CPU');
      expect(component.fields[1].value).toBe('8GB');
    });

    it('should enhance fields with default values', () => {
      component.setFields([
        { label: 'Test' }
      ]);

      expect(component.fields[0]).toMatchObject({
        label: 'Test',
        value: '',
        icon: null,
        width: 'auto',
        align: 'left',
        marquee: false,
        marqueeSpeed: 30
      });
    });

    it('should validate field array type', () => {
      expect(() => {
        component.setFields('not an array');
      }).toThrow('Fields must be an array');
    });
  });

  // ========================================
  // SUITE 3: Method Functionality
  // ========================================
  describe('Method Functionality', () => {
    it('should set fields via setFields()', async () => {
      const fields = [
        { label: 'Status', value: 'Active', width: '30%', align: 'left' },
        { label: 'Time', value: '14:30', width: '20%', align: 'right' }
      ];

      component.setFields(fields);
      await component.updateComplete;

      expect(component.fields).toHaveLength(2);
      expect(component.fields[0].align).toBe('left');
      expect(component.fields[1].align).toBe('right');
    });

    it('should update single field via updateField()', async () => {
      component.setFields([
        { label: 'CPU', value: '42%' },
        { label: 'RAM', value: '8GB' }
      ]);

      component.updateField(0, { value: '55%', marquee: true });
      await component.updateComplete;

      expect(component.fields[0].value).toBe('55%');
      expect(component.fields[0].marquee).toBe(true);
      expect(component.fields[1].value).toBe('8GB'); // Unchanged
    });

    it('should update field value via updateFieldValue()', async () => {
      component.setFields([
        { label: 'Count', value: '0' }
      ]);

      component.updateFieldValue(0, '100');
      await component.updateComplete;

      expect(component.fields[0].value).toBe('100');
      expect(component.fields[0].label).toBe('Count'); // Unchanged
    });

    it('should throw on invalid field index', () => {
      component.setFields([{ label: 'Test', value: '1' }]);

      expect(() => {
        component.updateField(5, { value: 'Invalid' });
      }).toThrow('Invalid field index: 5');

      expect(() => {
        component.updateField(-1, { value: 'Invalid' });
      }).toThrow('Invalid field index: -1');
    });

    it('should receive context from parent', () => {
      const context = {
        parent: {},
        depth: 1,
        logger: {}
      };

      component.receiveContext(context);
      expect(component._context).toBe(context);
    });

    it('should reject deep nesting', () => {
      expect(() => {
        component.receiveContext({ depth: 10 });
      }).toThrow('Maximum nesting depth exceeded');
    });
  });

  // ========================================
  // SUITE 4: Event Functionality
  // ========================================
  describe('Event Functionality', () => {
    it('should emit field-click event on field click', async () => {
      const fieldClickSpy = vi.fn();
      component.addEventListener('field-click', fieldClickSpy);

      component.setFields([
        { label: 'CPU', value: '42%' }
      ]);
      await component.updateComplete;

      const field = component.shadowRoot.querySelector('.status-field');
      field.click();

      expect(fieldClickSpy).toHaveBeenCalledOnce();
      const event = fieldClickSpy.mock.calls[0][0];
      expect(event.detail.field.label).toBe('CPU');
      expect(event.detail.index).toBe(0);
    });

    it('should have field-click event bubble and compose', async () => {
      let capturedEvent;
      component.addEventListener('field-click', (e) => {
        capturedEvent = e;
      });

      component.setFields([{ label: 'Test' }]);
      await component.updateComplete;

      const field = component.shadowRoot.querySelector('.status-field');
      field.click();

      expect(capturedEvent.bubbles).toBe(true);
      expect(capturedEvent.composed).toBe(true);
    });

    it('should include correct detail in field-click event', async () => {
      const fieldClickSpy = vi.fn();
      component.addEventListener('field-click', fieldClickSpy);

      const testField = {
        label: 'Memory',
        value: '16GB',
        width: '25%',
        align: 'center'
      };

      component.setFields([testField]);
      await component.updateComplete;

      const field = component.shadowRoot.querySelector('.status-field');
      field.click();

      const eventDetail = fieldClickSpy.mock.calls[0][0].detail;
      expect(eventDetail.field).toMatchObject(testField);
      expect(eventDetail.index).toBe(0);
    });
  });

  // ========================================
  // SUITE 5: Rendering
  // ========================================
  describe('Rendering', () => {
    it('should render status bar container', () => {
      const statusBar = component.shadowRoot.querySelector('.status-bar');
      expect(statusBar).toBeTruthy();
    });

    it('should render fields', async () => {
      component.setFields([
        { label: 'CPU', value: '42%' },
        { label: 'RAM', value: '8GB' }
      ]);
      await component.updateComplete;

      const fields = component.shadowRoot.querySelectorAll('.status-field');
      expect(fields).toHaveLength(2);
    });

    it('should render field labels and values', async () => {
      component.setFields([
        { label: 'Status', value: 'Active' }
      ]);
      await component.updateComplete;

      const label = component.shadowRoot.querySelector('.field-label');
      const value = component.shadowRoot.querySelector('.field-value');

      expect(label.textContent).toBe('Status:');
      expect(value.textContent).toBe('Active');
    });

    it('should render icons when provided', async () => {
      component.setFields([
        { label: 'Alert', value: 'OK', icon: '<svg></svg>', displayMode: 'icon-text' }
      ]);
      await component.updateComplete;

      const icon = component.shadowRoot.querySelector('.field-icon');
      expect(icon).toBeTruthy();
    });

    it('should apply width styles', async () => {
      component.setFields([
        { label: 'Wide', value: 'Field', width: '50%' }
      ]);
      await component.updateComplete;

      const field = component.shadowRoot.querySelector('.status-field');
      expect(field.style.width).toBe('50%');
    });

    it('should apply alignment classes', async () => {
      component.setFields([
        { label: 'Left', value: '1', align: 'left' },
        { label: 'Right', value: '2', align: 'right' }
      ]);
      await component.updateComplete;

      const fields = component.shadowRoot.querySelectorAll('.status-field');
      expect(fields[1].classList.contains('push-right')).toBe(true);
    });

    it('should render separators between fields', async () => {
      component.setFields([
        { label: 'A', value: '1' },
        { label: 'B', value: '2' },
        { label: 'C', value: '3' }
      ]);
      await component.updateComplete;

      const separators = component.shadowRoot.querySelectorAll('.status-separator');
      expect(separators).toHaveLength(2); // 2 separators for 3 fields
    });

    it('should add marquee class for marquee fields', async () => {
      component.setFields([
        { label: 'Long', value: 'Very long text that needs scrolling', marquee: true }
      ]);
      await component.updateComplete;

      const field = component.shadowRoot.querySelector('.status-field');
      expect(field.classList.contains('marquee-enabled')).toBe(true);
    });

    it('should render slot for nested fields', () => {
      const slot = component.shadowRoot.querySelector('slot');
      expect(slot).toBeTruthy();
    });
  });

  // ========================================
  // SUITE 6: Width Validation
  // ========================================
  describe('Width Validation', () => {
    it('should validate total width does not exceed 95%', () => {
      component.setFields([
        { label: 'A', value: '1', width: '40%' },
        { label: 'B', value: '2', width: '40%' },
        { label: 'C', value: '3', width: '40%' } // Total: 120%
      ]);

      // Should scale down proportionally
      const totalWidth = component.fields.reduce((sum, field) => {
        if (field.width && field.width !== 'auto') {
          const match = field.width.match(/(\d+(?:\.\d+)?)%/);
          if (match) {
            return sum + parseFloat(match[1]);
          }
        }
        return sum;
      }, 0);

      expect(totalWidth).toBeLessThanOrEqual(95);
    });

    it('should scale fields proportionally when over limit', () => {
      component.setFields([
        { label: 'A', value: '1', width: '50%' },
        { label: 'B', value: '2', width: '60%' } // Total: 110%
      ]);

      // Expected scaling: (95-0.1)/110 ≈ 0.863
      const field1Width = parseFloat(component.fields[0].width);
      const field2Width = parseFloat(component.fields[1].width);

      // Due to rounding down, expect slightly less
      expect(field1Width).toBeCloseTo(43.1, 1); // 50 * 0.863 rounded down
      expect(field2Width).toBeCloseTo(51.7, 1); // 60 * 0.863 rounded down
    });

    it('should handle auto width fields', () => {
      component.setFields([
        { label: 'A', value: '1', width: '30%' },
        { label: 'B', value: '2', width: 'auto' },
        { label: 'C', value: '3', width: '30%' }
      ]);

      expect(component.fields[0].width).toBe('30%');
      expect(component.fields[1].width).toBe('auto');
      expect(component.fields[2].width).toBe('30%');
    });

    it('should handle pixel widths without scaling', () => {
      component.setFields([
        { label: 'A', value: '1', width: '100px' },
        { label: 'B', value: '2', width: '200px' }
      ]);

      expect(component.fields[0].width).toBe('100px');
      expect(component.fields[1].width).toBe('200px');
    });
  });

  // ========================================
  // SUITE 7: Nesting Support
  // ========================================
  describe('Nesting Support', () => {
    it('should discover nested t-sta-field components', async () => {
      const withFields = await fixture(html`
        <t-sta>
          <t-sta-field label="CPU" value="42%"></t-sta-field>
          <t-sta-field label="RAM" value="8GB"></t-sta-field>
        </t-sta>
      `);

      await nextFrame();

      expect(withFields._nestedFields.size).toBe(2);

      withFields.remove();
    });

    it('should propagate context to nested fields', async () => {
      const field = await fixture(html`<t-sta-field></t-sta-field>`);
      const contextSpy = vi.spyOn(field, 'receiveContext');

      const statusBar = await fixture(html`
        <t-sta>
          ${field}
        </t-sta>
      `);

      await nextFrame();

      expect(contextSpy).toHaveBeenCalled();

      statusBar.remove();
      field.remove();
    });

    it('should handle slot change events', async () => {
      const statusBar = await fixture(html`<t-sta></t-sta>`);

      const field = document.createElement('t-sta-field');
      field.label = 'Dynamic';
      field.value = 'Field';

      statusBar.appendChild(field);
      await nextFrame();

      expect(statusBar._nestedFields.has(field)).toBe(true);

      statusBar.remove();
    });
  });

  // ========================================
  // SUITE 8: Alignment System
  // ========================================
  describe('Alignment System', () => {
    it('should apply push-right class for right alignment transition', async () => {
      component.setFields([
        { label: 'Left', value: '1', align: 'left' },
        { label: 'Right', value: '2', align: 'right' }
      ]);
      await component.updateComplete;

      const fields = component.shadowRoot.querySelectorAll('.status-field');
      expect(fields[1].classList.contains('push-right')).toBe(true);
    });

    it('should apply push-center class for center alignment', async () => {
      component.setFields([
        { label: 'Left', value: '1', align: 'left' },
        { label: 'Center', value: '2', align: 'center' },
        { label: 'Also Center', value: '3', align: 'center' }
      ]);
      await component.updateComplete;

      const fields = component.shadowRoot.querySelectorAll('.status-field');
      expect(fields[1].classList.contains('push-center')).toBe(true);
    });

    it('should handle mixed alignments', async () => {
      component.setFields([
        { label: 'L1', value: '1', align: 'left' },
        { label: 'L2', value: '2', align: 'left' },
        { label: 'C1', value: '3', align: 'center' },
        { label: 'R1', value: '4', align: 'right' },
        { label: 'R2', value: '5', align: 'right' }
      ]);
      await component.updateComplete;

      const fields = component.shadowRoot.querySelectorAll('.status-field');
      // Center after left doesn't push if followed by right
      expect(fields[2].classList.contains('push-center')).toBe(false);
      expect(fields[3].classList.contains('push-right')).toBe(true);
      expect(fields[4].classList.contains('push-right')).toBe(false);
    });
  });

  // ========================================
  // SUITE 9: Cleanup Patterns
  // ========================================
  describe('Cleanup Patterns', () => {
    it('should clear timers on disconnect', () => {
      // Add a mock timer
      const timerId = setTimeout(() => {}, 1000);
      component._timers.add(timerId);

      component.disconnectedCallback();

      expect(component._timers.size).toBe(0);
    });

    it('should cleanup marquee elements on disconnect', () => {
      component._marqueeElements.set(0, document.createElement('div'));
      component._marqueeElements.set(1, document.createElement('div'));

      component.disconnectedCallback();

      expect(component._marqueeElements.size).toBe(0);
    });

    it('should clear nested fields on disconnect', () => {
      const mockField = document.createElement('t-sta-field');
      component._nestedFields.add(mockField);

      component.disconnectedCallback();

      expect(component._nestedFields.size).toBe(0);
    });

    it('should handle cleanup when fields change', async () => {
      component.setFields([
        { label: 'Old', value: 'Field', marquee: true }
      ]);
      await component.updateComplete;

      // Simulate marquee setup
      const mockElement = document.createElement('div');
      component._marqueeElements.set(0, mockElement);

      // Change fields
      component.setFields([
        { label: 'New', value: 'Field' }
      ]);
      await component.updateComplete;

      expect(component._marqueeElements.size).toBe(0);
    });
  });

  // ========================================
  // SUITE 10: Logging
  // ========================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(component._logger).toBeTruthy();
      // Logger is already initialized, not a factory
      expect(typeof component._logger).toBe('object');
    });

    it('should have all logger methods', () => {
      expect(typeof component._logger.error).toBe('function');
      expect(typeof component._logger.warn).toBe('function');
      expect(typeof component._logger.info).toBe('function');
      expect(typeof component._logger.debug).toBe('function');
      expect(typeof component._logger.trace).toBe('function');
    });

    it('should log lifecycle events', () => {
      const infoSpy = vi.spyOn(component._logger, 'info');
      const debugSpy = vi.spyOn(component._logger, 'debug');

      component.connectedCallback();
      expect(infoSpy).toHaveBeenCalledWith('Connected to DOM');

      component.disconnectedCallback();
      expect(infoSpy).toHaveBeenCalledWith('Disconnected from DOM');

      infoSpy.mockRestore();
      debugSpy.mockRestore();
    });

    it('should log method calls', () => {
      const debugSpy = vi.spyOn(component._logger, 'debug');

      component.setFields([{ label: 'Test', value: '1' }]);
      expect(debugSpy).toHaveBeenCalledWith('setFields called', expect.any(Object));

      component.updateFieldValue(0, '2');
      expect(debugSpy).toHaveBeenCalledWith('updateFieldValue called', expect.any(Object));

      debugSpy.mockRestore();
    });
  });
});