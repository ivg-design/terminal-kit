import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TSliderLit, TSliderManifest } from '../../js/components/TSliderLit.js';

describe('TSliderLit', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('t-sld');
    document.body.appendChild(component);
  });

  afterEach(() => {
    component?.remove();
  });

  // ==============================
  // SUITE 1: Manifest Completeness
  // ==============================
  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TSliderManifest).toBeDefined();
      expect(TSliderManifest.tagName).toBe('t-sld');
      expect(TSliderManifest.displayName).toBe('Slider');
      expect(TSliderManifest.version).toBe('1.0.0');
    });

    it('should document all 10 properties', () => {
      const { properties } = TSliderManifest;
      expect(properties.label).toBeDefined();
      expect(properties.min).toBeDefined();
      expect(properties.max).toBeDefined();
      expect(properties.value).toBeDefined();
      expect(properties.step).toBeDefined();
      expect(properties.disabled).toBeDefined();
      expect(properties.showTicks).toBeDefined();
      expect(properties.showValue).toBeDefined();
      expect(properties.vertical).toBeDefined();
      expect(properties.smooth).toBeDefined();
    });

    it('should document all 5 methods', () => {
      const { methods } = TSliderManifest;
      expect(methods.setValue).toBeDefined();
      expect(methods.getValue).toBeDefined();
      expect(methods.increment).toBeDefined();
      expect(methods.decrement).toBeDefined();
      expect(methods.setRange).toBeDefined();
    });

    it('should document all 2 events', () => {
      const { events } = TSliderManifest;
      expect(events['slider-input']).toBeDefined();
      expect(events['slider-change']).toBeDefined();
    });
  });

  // ==============================
  // SUITE 2: Static Metadata
  // ==============================
  describe('Static Metadata', () => {
    it('should have tagName', () => {
      expect(TSliderLit.tagName).toBe('t-sld');
    });

    it('should have version', () => {
      expect(TSliderLit.version).toBe('1.0.0');
    });

    it('should have category', () => {
      expect(TSliderLit.category).toBe('Form Controls');
    });

    it('should have formAssociated set to true', () => {
      expect(TSliderLit.formAssociated).toBe(true);
    });
  });

  // ==============================
  // SUITE 3: Properties (REQUIRED)
  // ==============================
  describe('Properties', () => {
    it('should have correct default values', () => {
      // NOTE: label is intentionally undefined to allow :not([label]) CSS selectors
      expect(component.label).toBeUndefined();
      expect(component.min).toBe(0);
      expect(component.max).toBe(100);
      expect(component.value).toBe(50);
      expect(component.step).toBe(1);
      expect(component.disabled).toBe(false);
      expect(component.showTicks).toBe(false);
      expect(component.showValue).toBe(true);
      expect(component.vertical).toBe(false);
      expect(component.smooth).toBe(false);
    });

    it('should update label property', async () => {
      component.label = 'Volume';
      await component.updateComplete;
      expect(component.label).toBe('Volume');
      expect(component.getAttribute('label')).toBe('Volume');
      const label = component.shadowRoot.querySelector('.slider-label');
      expect(label?.textContent.trim()).toBe('Volume');
    });

    it('should update min property and reflect to attribute', async () => {
      component.min = 10;
      await component.updateComplete;
      expect(component.min).toBe(10);
      expect(component.getAttribute('min')).toBe('10');
    });

    it('should update max property and reflect to attribute', async () => {
      component.max = 200;
      await component.updateComplete;
      expect(component.max).toBe(200);
      expect(component.getAttribute('max')).toBe('200');
    });

    it('should update value property', async () => {
      component.value = 75;
      await component.updateComplete;
      expect(component.value).toBe(75);
      // Value should not reflect to attribute
      expect(component.hasAttribute('value')).toBe(false);
    });

    it('should update step property and reflect to attribute', async () => {
      component.step = 5;
      await component.updateComplete;
      expect(component.step).toBe(5);
      expect(component.getAttribute('step')).toBe('5');
    });

    it('should update disabled property and reflect to attribute', async () => {
      component.disabled = true;
      await component.updateComplete;
      expect(component.disabled).toBe(true);
      expect(component.hasAttribute('disabled')).toBe(true);
    });

    it('should update showTicks property and reflect to attribute', async () => {
      component.showTicks = true;
      await component.updateComplete;
      expect(component.showTicks).toBe(true);
      expect(component.hasAttribute('show-ticks')).toBe(true);
      const ticks = component.shadowRoot.querySelector('.slider-ticks');
      expect(ticks).toBeTruthy();
    });

    it('should update showValue property and reflect to attribute', async () => {
      component.showValue = false;
      await component.updateComplete;
      expect(component.showValue).toBe(false);
      // showValue false doesn't reflect as 'false' string, just removes the attribute
      expect(component.hasAttribute('show-value')).toBe(false);
    });

    it('should update vertical property and reflect to attribute', async () => {
      component.vertical = true;
      await component.updateComplete;
      expect(component.vertical).toBe(true);
      expect(component.hasAttribute('vertical')).toBe(true);
    });

    it('should update smooth property and reflect to attribute', async () => {
      component.smooth = true;
      await component.updateComplete;
      expect(component.smooth).toBe(true);
      expect(component.hasAttribute('smooth')).toBe(true);
    });
  });

  // ==============================
  // SUITE 4: Rendering (REQUIRED)
  // ==============================
  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(component.shadowRoot).toBeDefined();
    });

    it('should render slider track', () => {
      const track = component.shadowRoot.querySelector('.slider-track');
      expect(track).toBeTruthy();
    });

    it('should render slider thumb', () => {
      const thumb = component.shadowRoot.querySelector('.slider-thumb');
      expect(thumb).toBeTruthy();
    });

    it('should render slider fill', () => {
      const fill = component.shadowRoot.querySelector('.slider-fill');
      expect(fill).toBeTruthy();
    });

    it('should render value display when showValue is true', async () => {
      component.showValue = true;
      await component.updateComplete;
      const valueDisplay = component.shadowRoot.querySelector('.slider-value');
      expect(valueDisplay).toBeTruthy();
      expect(valueDisplay.textContent).toBe('50');
    });

    it('should not render value display when showValue is false', async () => {
      component.showValue = false;
      await component.updateComplete;
      const valueDisplay = component.shadowRoot.querySelector('.slider-value');
      // Element exists but is hidden by CSS
      expect(valueDisplay).toBeFalsy();
    });

    it('should render label when provided', async () => {
      component.label = 'Brightness';
      await component.updateComplete;
      const label = component.shadowRoot.querySelector('.slider-label');
      expect(label).toBeTruthy();
      expect(label.textContent.trim()).toBe('Brightness');
    });

    it('should render min and max labels', () => {
      const minLabel = component.shadowRoot.querySelector('.slider-min');
      const maxLabel = component.shadowRoot.querySelector('.slider-max');
      expect(minLabel?.textContent).toBe('0');
      expect(maxLabel?.textContent).toBe('100');
    });

    it('should render tick marks when showTicks is true', async () => {
      component.showTicks = true;
      await component.updateComplete;
      const ticks = component.shadowRoot.querySelector('.slider-ticks');
      expect(ticks).toBeTruthy();
      const tickElements = ticks.querySelectorAll('.slider-tick');
      expect(tickElements.length).toBeGreaterThan(0);
    });

    it('should update fill width based on value', async () => {
      component.value = 75;
      await component.updateComplete;
      const fill = component.shadowRoot.querySelector('.slider-fill');
      expect(fill.style.width).toBe('75%');
    });

    it('should update thumb position based on value', async () => {
      component.value = 25;
      await component.updateComplete;
      const thumb = component.shadowRoot.querySelector('.slider-thumb');
      expect(thumb.style.left).toBe('25%');
    });
  });

  // ==============================
  // SUITE 5: Logging (REQUIRED)
  // ==============================
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

    it('should log without errors', () => {
      expect(() => {
        component._logger.debug('Test debug message');
        component._logger.info('Test info message');
        component._logger.warn('Test warn message');
      }).not.toThrow();
    });
  });

  // ==============================
  // SUITE 6: Validation (REQUIRED for FORM profile)
  // ==============================
  describe('Validation', () => {
    it('should validate min must be less than max', async () => {
      const spy = vi.spyOn(component._logger, 'warn');
      component.min = 100;
      component.max = 50;
      await component.updateComplete;
      expect(spy).toHaveBeenCalledWith(
        'Invalid range: min must be less than max',
        expect.any(Object)
      );
      // Should reset to defaults
      expect(component.min).toBe(0);
      expect(component.max).toBe(100);
      spy.mockRestore();
    });

    it('should clamp value to min', async () => {
      component.min = 10;
      component.value = 5;
      await component.updateComplete;
      expect(component.value).toBe(10);
    });

    it('should clamp value to max', async () => {
      component.max = 90;
      component.value = 95;
      await component.updateComplete;
      expect(component.value).toBe(90);
    });

    it('should snap value to step when not smooth', async () => {
      component.step = 10;
      component.smooth = false;
      component.value = 23;
      await component.updateComplete;
      expect(component.value).toBe(20); // Snapped to nearest step
    });

    it('should not snap value to step when smooth', async () => {
      component.step = 10;
      component.smooth = true;
      component.value = 23;
      await component.updateComplete;
      expect(component.value).toBe(23); // Not snapped
    });

    it('should validate range when using setRange method', () => {
      const spy = vi.spyOn(component._logger, 'warn');
      component.setRange(100, 50); // Invalid: max < min
      expect(spy).toHaveBeenCalledWith(
        'Invalid range: max must be greater than min',
        expect.any(Object)
      );
      // Values should not change
      expect(component.min).toBe(0);
      expect(component.max).toBe(100);
      spy.mockRestore();
    });

    it('should accept valid range with setRange method', () => {
      component.setRange(20, 80);
      expect(component.min).toBe(20);
      expect(component.max).toBe(80);
    });
  });

  // ==============================
  // SUITE 7: Events (REQUIRED for FORM profile)
  // ==============================
  describe('Events', () => {
    describe('slider-input event', () => {
      it('should fire during drag with correct detail', async () => {
        const spy = vi.fn();
        component.addEventListener('slider-input', spy);

        // Simulate dragging
        const thumb = component.shadowRoot.querySelector('.slider-thumb');
        const mouseDown = new MouseEvent('mousedown', { bubbles: true });
        thumb.dispatchEvent(mouseDown);

        // Simulate mouse move on document
        const mouseMove = new MouseEvent('mousemove', {
          clientX: 100,
          clientY: 50,
          bubbles: true
        });
        document.dispatchEvent(mouseMove);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(spy).toHaveBeenCalled();
        const event = spy.mock.calls[0][0];
        expect(event.detail).toHaveProperty('value');
        expect(typeof event.detail.value).toBe('number');

        // Cleanup
        const mouseUp = new MouseEvent('mouseup', { bubbles: true });
        document.dispatchEvent(mouseUp);
      });

      it('should bubble', async () => {
        const parent = document.createElement('div');
        parent.appendChild(component);

        const promise = new Promise(resolve => {
          parent.addEventListener('slider-input', (e) => {
            expect(e.bubbles).toBe(true);
            resolve();
          });
        });

        // Trigger drag
        const thumb = component.shadowRoot.querySelector('.slider-thumb');
        thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', {
          clientX: 100,
          clientY: 50,
          bubbles: true
        }));

        await promise;
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });

      it('should be composed', async () => {
        const promise = new Promise(resolve => {
          component.addEventListener('slider-input', (e) => {
            expect(e.composed).toBe(true);
            resolve();
          });
        });

        // Trigger drag
        const thumb = component.shadowRoot.querySelector('.slider-thumb');
        thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', {
          clientX: 100,
          clientY: 50,
          bubbles: true
        }));

        await promise;
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });
    });

    describe('slider-change event', () => {
      it('should fire on value change with correct detail', async () => {
        const promise = new Promise(resolve => {
          component.addEventListener('slider-change', (e) => {
            expect(e.detail).toEqual({ value: 75 });
            resolve();
          });
        });

        component.setValue(75);
        await promise;
      });

      it('should fire on track click', async () => {
        const spy = vi.fn();
        component.addEventListener('slider-change', spy);

        const track = component.shadowRoot.querySelector('.slider-track');
        const rect = track.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
          bubbles: true
        });

        track.dispatchEvent(clickEvent);
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(spy).toHaveBeenCalled();
      });

      it('should bubble', async () => {
        const parent = document.createElement('div');
        parent.appendChild(component);

        const promise = new Promise(resolve => {
          parent.addEventListener('slider-change', (e) => {
            expect(e.bubbles).toBe(true);
            resolve();
          });
        });

        component.setValue(80);
        await promise;
      });

      it('should be composed', async () => {
        const promise = new Promise(resolve => {
          component.addEventListener('slider-change', (e) => {
            expect(e.composed).toBe(true);
            resolve();
          });
        });

        component.setValue(80);
        await promise;
      });
    });
  });

  // ==============================
  // SUITE 8: Methods (REQUIRED)
  // ==============================
  describe('Methods', () => {
    describe('setValue()', () => {
      it('should set the value', () => {
        component.setValue(30);
        expect(component.value).toBe(30);
      });

      it('should clamp value to range', () => {
        component.setValue(150);
        expect(component.value).toBe(100); // Max is 100
      });

      it('should emit slider-change event', async () => {
        const promise = new Promise(resolve => {
          component.addEventListener('slider-change', (e) => {
            expect(e.detail.value).toBe(45);
            resolve();
          });
        });
        component.setValue(45);
        await promise;
      });

      it('should handle non-numeric values', () => {
        component.setValue('invalid');
        expect(component.value).toBe(50); // Should remain unchanged
      });
    });

    describe('getValue()', () => {
      it('should return the current value', () => {
        component.value = 65;
        expect(component.getValue()).toBe(65);
      });
    });

    describe('increment()', () => {
      it('should increase value by step', () => {
        component.value = 50;
        component.step = 5;
        component.increment();
        expect(component.value).toBe(55);
      });

      it('should not exceed max', () => {
        component.value = 98;
        component.step = 5;
        component.increment();
        expect(component.value).toBe(100); // Clamped to max
      });

      it('should emit slider-change event', async () => {
        const promise = new Promise(resolve => {
          component.addEventListener('slider-change', () => resolve());
        });
        component.increment();
        await promise;
      });
    });

    describe('decrement()', () => {
      it('should decrease value by step', () => {
        component.value = 50;
        component.step = 5;
        component.decrement();
        expect(component.value).toBe(45);
      });

      it('should not go below min', () => {
        component.value = 2;
        component.step = 5;
        component.decrement();
        expect(component.value).toBe(0); // Clamped to min
      });

      it('should emit slider-change event', async () => {
        const promise = new Promise(resolve => {
          component.addEventListener('slider-change', () => resolve());
        });
        component.decrement();
        await promise;
      });
    });

    describe('setRange()', () => {
      it('should set min and max', () => {
        component.setRange(10, 90);
        expect(component.min).toBe(10);
        expect(component.max).toBe(90);
      });

      it('should revalidate current value', () => {
        component.value = 95;
        component.setRange(0, 50);
        expect(component.value).toBe(50); // Clamped to new max
      });

      it('should reject invalid range', () => {
        const originalMin = component.min;
        const originalMax = component.max;
        component.setRange(100, 50); // max < min
        expect(component.min).toBe(originalMin);
        expect(component.max).toBe(originalMax);
      });
    });
  });

  // ==============================
  // SUITE 9: Form Participation (REQUIRED for FORM-ADVANCED)
  // ==============================
  describe('Form Participation', () => {
    it('should have ElementInternals if supported', () => {
      if (typeof ElementInternals !== 'undefined') {
        expect(component._internals).toBeDefined();
      }
    });

    it('should set initial form value', async () => {
      if (component._internals && component._internals.setFormValue) {
        const spy = vi.spyOn(component._internals, 'setFormValue');
        component.value = 85;
        await component.updateComplete;
        expect(spy).toHaveBeenCalledWith('85');
        spy.mockRestore();
      }
    });

    it('should have role attribute set to slider', () => {
      if (component._internals && component._internals.role) {
        expect(component._internals.role).toBe('slider');
      }
    });
  });

  // ==============================
  // SUITE 10: Keyboard Navigation
  // ==============================
  describe('Keyboard Navigation', () => {
    let thumb;

    beforeEach(() => {
      thumb = component.shadowRoot.querySelector('.slider-thumb');
    });

    it('should handle ArrowRight key', async () => {
      component.value = 50;
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      thumb.dispatchEvent(event);
      await component.updateComplete;
      expect(component.value).toBe(51);
    });

    it('should handle ArrowLeft key', async () => {
      component.value = 50;
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      thumb.dispatchEvent(event);
      await component.updateComplete;
      expect(component.value).toBe(49);
    });

    it('should handle Home key', async () => {
      component.value = 50;
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      thumb.dispatchEvent(event);
      await component.updateComplete;
      expect(component.value).toBe(0);
    });

    it('should handle End key', async () => {
      component.value = 50;
      const event = new KeyboardEvent('keydown', { key: 'End' });
      thumb.dispatchEvent(event);
      await component.updateComplete;
      expect(component.value).toBe(100);
    });

    it('should not respond to keys when disabled', async () => {
      component.disabled = true;
      component.value = 50;
      await component.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      thumb.dispatchEvent(event);
      await component.updateComplete;

      expect(component.value).toBe(50); // Unchanged
    });
  });

  // ==============================
  // SUITE 11: Cleanup Patterns (Memory leak prevention)
  // ==============================
  describe('Cleanup Patterns', () => {
    it('should remove document listeners on disconnect', async () => {
      const thumb = component.shadowRoot.querySelector('.slider-thumb');

      // Start dragging to add listeners
      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(component._documentListeners.size).toBeGreaterThan(0);

      // Disconnect component
      component.disconnectedCallback();

      // Listeners should be cleared
      expect(component._documentListeners.size).toBe(0);
      expect(component._isDragging).toBe(false);
    });

    it('should clean up on double disconnect', () => {
      expect(() => {
        component.disconnectedCallback();
        component.disconnectedCallback(); // Second disconnect
      }).not.toThrow();
    });

    it('should remove listeners after drag ends', async () => {
      const thumb = component.shadowRoot.querySelector('.slider-thumb');

      // Start dragging
      thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(component._documentListeners.size).toBeGreaterThan(0);

      // End dragging
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 10));

      // Listeners should be cleared
      expect(component._documentListeners.size).toBe(0);
    });
  });

  // ==============================
  // SUITE 12: Accessibility
  // ==============================
  describe('Accessibility', () => {
    it('should have ARIA attributes on thumb', () => {
      const thumb = component.shadowRoot.querySelector('.slider-thumb');
      expect(thumb.getAttribute('role')).toBe('slider');
      expect(thumb.getAttribute('aria-valuemin')).toBe('0');
      expect(thumb.getAttribute('aria-valuemax')).toBe('100');
      expect(thumb.getAttribute('aria-valuenow')).toBe('50');
      expect(thumb.getAttribute('tabindex')).toBe('0');
    });

    it('should update ARIA attributes when value changes', async () => {
      component.value = 75;
      await component.updateComplete;
      const thumb = component.shadowRoot.querySelector('.slider-thumb');
      expect(thumb.getAttribute('aria-valuenow')).toBe('75');
    });

    it('should have screen reader only input', () => {
      const srInput = component.shadowRoot.querySelector('.sr-only');
      expect(srInput).toBeTruthy();
      expect(srInput.type).toBe('range');
    });
  });
});