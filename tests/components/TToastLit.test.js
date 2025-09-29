import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../js/components/TToastLit.js';

// Test utilities
async function fixture(template) {
  const div = document.createElement('div');
  div.innerHTML = typeof template === 'string' ? template : template.strings.join('');
  const element = div.firstElementChild;
  document.body.appendChild(element);
  await element.updateComplete;
  return element;
}

const html = (strings, ...values) => ({
  strings,
  values
});

describe('TToastLit', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`<t-tst></t-tst>`);
  });

  afterEach(() => {
    component?.remove();
  });

  // ======================================
  // SUITE 1: Manifest Completeness
  // ======================================
  describe('Manifest Completeness', () => {
    it('should have complete manifest structure', async () => {
      const { TToastManifest } = await import('../../js/components/TToastLit.js');

      expect(TToastManifest).toBeDefined();
      expect(TToastManifest.tagName).toBe('t-tst');
      expect(TToastManifest.version).toBe('1.0.0');
      expect(TToastManifest.category).toBe('Display');
    });

    it('should document all properties', async () => {
      const { TToastManifest } = await import('../../js/components/TToastLit.js');

      expect(TToastManifest.properties).toBeDefined();

      const expectedProperties = ['message', 'type', 'duration', 'visible', 'position'];
      expectedProperties.forEach(prop => {
        expect(TToastManifest.properties[prop]).toBeDefined();
      });
    });

    it('should document all methods', async () => {
      const { TToastManifest } = await import('../../js/components/TToastLit.js');

      expect(TToastManifest.methods).toBeDefined();

      const expectedMethods = ['show', 'dismiss'];
      expectedMethods.forEach(method => {
        expect(TToastManifest.methods[method]).toBeDefined();
      });
    });

    it('should document all events', async () => {
      const { TToastManifest } = await import('../../js/components/TToastLit.js');

      expect(TToastManifest.events).toBeDefined();

      const expectedEvents = ['toast-show', 'toast-hide', 'toast-click', 'toast-dismiss'];
      expectedEvents.forEach(event => {
        expect(TToastManifest.events[event]).toBeDefined();
      });
    });

    it('should have no slots (CORE profile)', async () => {
      const { TToastManifest } = await import('../../js/components/TToastLit.js');

      expect(TToastManifest.slots).toEqual({});
    });
  });

  // ======================================
  // SUITE 2: Property Functionality
  // ======================================
  describe('Property Functionality', () => {
    it('should have correct default values', () => {
      expect(component.message).toBe('');
      expect(component.type).toBe('info');
      expect(component.duration).toBe(3000);
      expect(component.visible).toBe(false);
      expect(component.position).toBe('top-right');
    });

    it('should update message property', async () => {
      component.message = 'Test message';
      await component.updateComplete;

      expect(component.message).toBe('Test message');
      expect(component.getAttribute('message')).toBe('Test message');
    });

    it('should update type property', async () => {
      component.type = 'success';
      await component.updateComplete;

      expect(component.type).toBe('success');
      expect(component.getAttribute('type')).toBe('success');
    });

    it('should accept all valid type values', async () => {
      const types = ['success', 'error', 'warning', 'info'];

      for (const type of types) {
        component.type = type;
        await component.updateComplete;
        expect(component.type).toBe(type);
      }
    });

    it('should update duration property', async () => {
      component.duration = 5000;
      await component.updateComplete;

      expect(component.duration).toBe(5000);
      expect(component.getAttribute('duration')).toBe('5000');
    });

    it('should update visible property', async () => {
      component.visible = true;
      await component.updateComplete;

      expect(component.visible).toBe(true);
      expect(component.hasAttribute('visible')).toBe(true);
    });

    it('should update position property', async () => {
      component.position = 'bottom-left';
      await component.updateComplete;

      expect(component.position).toBe('bottom-left');
      expect(component.getAttribute('position')).toBe('bottom-left');
    });

    it('should accept all valid position values', async () => {
      const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

      for (const position of positions) {
        component.position = position;
        await component.updateComplete;
        expect(component.position).toBe(position);
      }
    });
  });

  // ======================================
  // SUITE 3: Method Functionality
  // ======================================
  describe('Method Functionality', () => {
    it('should expose documented public methods', () => {
      expect(typeof component.show).toBe('function');
      expect(typeof component.dismiss).toBe('function');
    });

    it('should show toast when show() is called', async () => {
      component.message = 'Test message';
      await component.updateComplete;

      expect(component.visible).toBe(false);

      component.show();
      await component.updateComplete;

      expect(component.visible).toBe(true);
    });

    it('should hide toast when dismiss() is called', async () => {
      component.message = 'Test message';
      component.visible = true;
      await component.updateComplete;

      component.dismiss();

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 350));
      await component.updateComplete;

      expect(component.visible).toBe(false);
    });

    it('should not show again if already visible', async () => {
      component.message = 'Test message';
      component.visible = true;
      await component.updateComplete;

      const spy = vi.spyOn(component, '_emitEvent');

      component.show();
      await component.updateComplete;

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not dismiss if not visible', async () => {
      component.message = 'Test message';
      component.visible = false;
      await component.updateComplete;

      const spy = vi.spyOn(component, '_emitEvent');

      component.dismiss();
      await component.updateComplete;

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  // ======================================
  // SUITE 4: Event Functionality
  // ======================================
  describe('Event Functionality', () => {
    it('should emit toast-show event when shown', () => {
      component.message = 'Test message';

      return new Promise((resolve) => {
        component.addEventListener('toast-show', (e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
          expect(e.detail).toBeDefined();
          resolve();
        });

        component.show();
      });
    });

    it('should emit toast-dismiss and toast-hide events when dismissed', () => {
      component.message = 'Test message';
      component.visible = true;

      return new Promise((resolve) => {
        let dismissFired = false;
        let hideFired = false;

        const checkComplete = () => {
          if (dismissFired && hideFired) {
            resolve();
          }
        };

        component.addEventListener('toast-dismiss', (e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
          dismissFired = true;
          checkComplete();
        });

        component.addEventListener('toast-hide', (e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
          hideFired = true;
          checkComplete();
        });

        component.dismiss();
      });
    });

    it('should emit toast-click event when toast is clicked', async () => {
      component.message = 'Test message';
      component.visible = true;
      await component.updateComplete;

      return new Promise((resolve) => {
        component.addEventListener('toast-click', (e) => {
          expect(e.bubbles).toBe(true);
          expect(e.composed).toBe(true);
          resolve();
        });

        const toastEl = component.shadowRoot.querySelector('.t-tst');
        toastEl.click();
      });
    });

    it('should not emit toast-click when close button is clicked', async () => {
      component.message = 'Test message';
      component.visible = true;
      await component.updateComplete;

      const spy = vi.fn();
      component.addEventListener('toast-click', spy);

      const closeBtn = component.shadowRoot.querySelector('.t-tst__close');
      closeBtn.click();

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(spy).not.toHaveBeenCalled();
    });

    it('should auto-dismiss after duration', async () => {
      vi.useFakeTimers();

      component.message = 'Test message';
      component.duration = 1000;
      await component.updateComplete;

      const dismissSpy = vi.fn();
      component.addEventListener('toast-dismiss', dismissSpy);

      component.show();
      await component.updateComplete;

      expect(component.visible).toBe(true);
      expect(dismissSpy).not.toHaveBeenCalled();

      // Advance time
      vi.advanceTimersByTime(1000);

      // Wait for dismiss animation
      vi.advanceTimersByTime(350);
      await component.updateComplete;

      expect(dismissSpy).toHaveBeenCalled();
      expect(component.visible).toBe(false);

      vi.useRealTimers();
    });

    it('should not auto-dismiss when duration is 0', async () => {
      vi.useFakeTimers();

      component.message = 'Test message';
      component.duration = 0;
      await component.updateComplete;

      const dismissSpy = vi.fn();
      component.addEventListener('toast-dismiss', dismissSpy);

      component.show();
      await component.updateComplete;

      expect(component.visible).toBe(true);

      // Advance time significantly
      vi.advanceTimersByTime(10000);
      await component.updateComplete;

      expect(dismissSpy).not.toHaveBeenCalled();
      expect(component.visible).toBe(true);

      vi.useRealTimers();
    });

    it('should clear timer when manually dismissed', async () => {
      vi.useFakeTimers();

      component.message = 'Test message';
      component.duration = 5000;
      await component.updateComplete;

      component.show();
      await component.updateComplete;

      // Manually dismiss before auto-dismiss
      component.dismiss();

      // Clear should prevent auto-dismiss
      vi.advanceTimersByTime(5000);
      await component.updateComplete;

      // Timer should have been cleared
      expect(component._dismissTimer).toBe(null);

      vi.useRealTimers();
    });
  });

  // ======================================
  // SUITE 5: Rendering
  // ======================================
  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(component.shadowRoot).toBeDefined();
    });

    it('should not render content when message is empty', async () => {
      component.message = '';
      await component.updateComplete;

      const toastEl = component.shadowRoot.querySelector('.t-tst');
      expect(toastEl).toBeNull();
    });

    it('should render toast when message is set', async () => {
      component.message = 'Test message';
      await component.updateComplete;

      const toastEl = component.shadowRoot.querySelector('.t-tst');
      expect(toastEl).toBeDefined();

      const messageEl = component.shadowRoot.querySelector('.t-tst__message');
      expect(messageEl.textContent.trim()).toBe('Test message');
    });

    it('should apply correct type class', async () => {
      component.message = 'Test message';

      const types = ['success', 'error', 'warning', 'info'];

      for (const type of types) {
        component.type = type;
        await component.updateComplete;

        const toastEl = component.shadowRoot.querySelector('.t-tst');
        expect(toastEl.classList.contains(`t-tst--${type}`)).toBe(true);
      }
    });

    it('should render correct icon for each type', async () => {
      component.message = 'Test message';
      await component.updateComplete;

      const types = ['success', 'error', 'warning', 'info'];

      for (const type of types) {
        component.type = type;
        await component.updateComplete;

        const iconEl = component.shadowRoot.querySelector('.t-tst__icon svg');
        expect(iconEl).toBeDefined();
      }
    });

    it('should render close button', async () => {
      component.message = 'Test message';
      await component.updateComplete;

      const closeBtn = component.shadowRoot.querySelector('.t-tst__close');
      expect(closeBtn).toBeDefined();
      expect(closeBtn.getAttribute('aria-label')).toBe('Close toast');
    });

    it('should apply position styles', async () => {
      const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

      for (const position of positions) {
        component.position = position;
        await component.updateComplete;

        expect(component.getAttribute('position')).toBe(position);
      }
    });
  });

  // ======================================
  // SUITE 6: Logging
  // ======================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(component._logger).toBeDefined();
      expect(typeof component._logger.debug).toBe('function');
      expect(typeof component._logger.error).toBe('function');
      expect(typeof component._logger.warn).toBe('function');
      expect(typeof component._logger.info).toBe('function');
    });

    it('should log lifecycle events', () => {
      const debugSpy = vi.spyOn(component._logger, 'debug');

      component.connectedCallback();
      expect(debugSpy).toHaveBeenCalledWith('Connected to DOM');

      component.disconnectedCallback();
      expect(debugSpy).toHaveBeenCalledWith('Disconnected from DOM');

      debugSpy.mockRestore();
    });

    it('should log method calls', () => {
      const debugSpy = vi.spyOn(component._logger, 'debug');

      component.show();
      expect(debugSpy).toHaveBeenCalledWith('show called');

      component.dismiss();
      expect(debugSpy).toHaveBeenCalledWith('dismiss called');

      debugSpy.mockRestore();
    });

    it('should log event emissions', () => {
      const debugSpy = vi.spyOn(component._logger, 'debug');

      component._emitEvent('test-event', { test: true });

      expect(debugSpy).toHaveBeenCalledWith('Emitting event', {
        eventName: 'test-event',
        detail: { test: true }
      });

      debugSpy.mockRestore();
    });
  });

  // ======================================
  // SUITE 7: Timer Cleanup (Memory Leak Prevention)
  // ======================================
  describe('Timer Cleanup', () => {
    it('should clear timer on disconnect', async () => {
      vi.useFakeTimers();

      component.message = 'Test message';
      component.duration = 5000;
      component.show();
      await component.updateComplete;

      expect(component._dismissTimer).toBeDefined();

      component.disconnectedCallback();

      expect(component._dismissTimer).toBe(null);

      vi.useRealTimers();
    });

    it('should clear old timer when duration changes', async () => {
      vi.useFakeTimers();

      component.message = 'Test message';
      component.duration = 5000;
      component.visible = true;
      await component.updateComplete;

      const firstTimer = component._dismissTimer;
      expect(firstTimer).toBeDefined();

      component.duration = 3000;
      await component.updateComplete;

      const secondTimer = component._dismissTimer;
      expect(secondTimer).toBeDefined();
      expect(secondTimer).not.toBe(firstTimer);

      vi.useRealTimers();
    });

    it('should clear timer when manually dismissed', async () => {
      vi.useFakeTimers();

      component.message = 'Test message';
      component.duration = 5000;
      component.show();
      await component.updateComplete;

      expect(component._dismissTimer).toBeDefined();

      component.dismiss();

      expect(component._dismissTimer).toBe(null);

      vi.useRealTimers();
    });
  });
});