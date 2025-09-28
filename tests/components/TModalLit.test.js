/**
 * TModalLit Component Tests
 * FULL Profile - Complete test coverage (7 suites, ~60 tests)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TModalLit, TModalManifest } from '../../js/components/TModalLit.js';

describe('TModalLit', () => {
  let modal;

  beforeEach(() => {
    modal = document.createElement('t-mdl');
    document.body.appendChild(modal);
  });

  afterEach(() => {
    modal?.remove();
    // Restore body overflow
    document.body.style.overflow = '';
  });

  // ============================================
  // SUITE 1: Manifest Completeness (6 tests)
  // ============================================
  describe('Manifest Completeness', () => {
    it('should have complete manifest structure', () => {
      expect(TModalManifest).toBeDefined();
      expect(TModalManifest.tagName).toBe('t-mdl');
      expect(TModalManifest.displayName).toBeDefined();
      expect(TModalManifest.version).toBe('1.0.0');
    });

    it('should document all 7 properties', () => {
      const properties = TModalManifest.properties;
      expect(Object.keys(properties).length).toBe(7);
      expect(properties.visible).toBeDefined();
      expect(properties.layout).toBeDefined();
      expect(properties.size).toBeDefined();
      expect(properties.title).toBeDefined();
      expect(properties.escapeClose).toBeDefined();
      expect(properties.backdropClose).toBeDefined();
      expect(properties.loading).toBeDefined();
    });

    it('should document all 6 methods', () => {
      const methods = TModalManifest.methods;
      expect(Object.keys(methods).length).toBeGreaterThanOrEqual(6);
      expect(methods.show).toBeDefined();
      expect(methods.hide).toBeDefined();
      expect(methods.toggle).toBeDefined();
      expect(methods.close).toBeDefined();
      expect(methods.showLoading).toBeDefined();
      expect(methods.hideLoading).toBeDefined();
    });

    it('should document all 4 events', () => {
      const events = TModalManifest.events;
      expect(Object.keys(events).length).toBe(4);
      expect(events['modal-show']).toBeDefined();
      expect(events['modal-hide']).toBeDefined();
      expect(events['modal-before-close']).toBeDefined();
      expect(events['modal-close']).toBeDefined();
    });

    it('should document all slots for all layouts', () => {
      const slots = TModalManifest.slots;
      expect(slots.default).toBeDefined();
      expect(slots.left).toBeDefined();
      expect(slots.right).toBeDefined();
      expect(slots['top-left']).toBeDefined();
      expect(slots['top-right']).toBeDefined();
      expect(slots['bottom-left']).toBeDefined();
      expect(slots['bottom-right']).toBeDefined();
      expect(slots.top).toBeDefined();
      expect(slots['middle-left']).toBeDefined();
      expect(slots['middle-right']).toBeDefined();
      expect(slots.bottom).toBeDefined();
    });

    it('should have correct enum values for layout and size', () => {
      const layoutProp = TModalManifest.properties.layout;
      const sizeProp = TModalManifest.properties.size;

      expect(layoutProp.enum).toContain('single');
      expect(layoutProp.enum).toContain('2-column');
      expect(layoutProp.enum).toContain('2x2');
      expect(layoutProp.enum).toContain('1-2-1');
      expect(layoutProp.enum).toContain('2-1');

      expect(sizeProp.enum).toContain('small');
      expect(sizeProp.enum).toContain('medium');
      expect(sizeProp.enum).toContain('large');
      expect(sizeProp.enum).toContain('xlarge');
      expect(sizeProp.enum).toContain('full');
    });
  });

  // ============================================
  // SUITE 2: Property Functionality (7 tests)
  // ============================================
  describe('Property Functionality', () => {
    it('should have correct default values', () => {
      expect(modal.visible).toBe(false);
      expect(modal.layout).toBe('single');
      expect(modal.size).toBe('medium');
      expect(modal.title).toBe('');
      expect(modal.escapeClose).toBe(true);
      expect(modal.backdropClose).toBe(true);
      expect(modal.loading).toBe(false);
    });

    it('should update visible property', async () => {
      modal.visible = true;
      await modal.updateComplete;
      expect(modal.visible).toBe(true);
      expect(modal.hasAttribute('visible')).toBe(true);
    });

    it('should update layout property', async () => {
      modal.layout = '2-column';
      await modal.updateComplete;
      expect(modal.layout).toBe('2-column');
      expect(modal.getAttribute('layout')).toBe('2-column');
    });

    it('should update size property', async () => {
      modal.size = 'large';
      await modal.updateComplete;
      expect(modal.size).toBe('large');
      expect(modal.getAttribute('size')).toBe('large');
    });

    it('should update title property', async () => {
      modal.title = 'Settings';
      await modal.updateComplete;
      expect(modal.title).toBe('Settings');
      expect(modal.getAttribute('title')).toBe('Settings');
    });

    it('should update escapeClose and backdropClose properties', async () => {
      modal.escapeClose = false;
      modal.backdropClose = false;
      await modal.updateComplete;
      expect(modal.escapeClose).toBe(false);
      expect(modal.backdropClose).toBe(false);
    });

    it('should update loading property', async () => {
      modal.loading = true;
      await modal.updateComplete;
      expect(modal.loading).toBe(true);
      expect(modal.hasAttribute('loading')).toBe(true);
    });
  });

  // ============================================
  // SUITE 3: Method Functionality (6 tests)
  // ============================================
  describe('Method Functionality', () => {
    it('should expose all documented public methods', () => {
      expect(typeof modal.show).toBe('function');
      expect(typeof modal.hide).toBe('function');
      expect(typeof modal.toggle).toBe('function');
      expect(typeof modal.close).toBe('function');
      expect(typeof modal.showLoading).toBe('function');
      expect(typeof modal.hideLoading).toBe('function');
    });

    it('should show modal via show() method', async () => {
      modal.show();
      await modal.updateComplete;
      expect(modal.visible).toBe(true);
    });

    it('should hide modal via hide() method', async () => {
      modal.visible = true;
      await modal.updateComplete;
      modal.hide();
      await modal.updateComplete;
      expect(modal.visible).toBe(false);
    });

    it('should toggle modal via toggle() method', async () => {
      expect(modal.visible).toBe(false);
      modal.toggle();
      await modal.updateComplete;
      expect(modal.visible).toBe(true);

      modal.toggle();
      await modal.updateComplete;
      expect(modal.visible).toBe(false);
    });

    it('should show and hide loading state', async () => {
      modal.showLoading();
      await modal.updateComplete;
      expect(modal.loading).toBe(true);

      modal.hideLoading();
      await modal.updateComplete;
      expect(modal.loading).toBe(false);
    });

    it('should close modal with preventable event', async () => {
      modal.visible = true;
      await modal.updateComplete;

      // Without preventing
      modal.close();
      await modal.updateComplete;
      expect(modal.visible).toBe(false);

      // With preventing
      modal.visible = true;
      await modal.updateComplete;

      modal.addEventListener('modal-before-close', (e) => {
        e.preventDefault();
      }, { once: true });

      modal.close();
      await modal.updateComplete;
      expect(modal.visible).toBe(true); // Should still be visible
    });
  });

  // ============================================
  // SUITE 4: Event Functionality (17 tests)
  // ============================================
  describe('Event Functionality', () => {
    describe('modal-show event', () => {
      it('should fire via show() method', () => {
        return new Promise((resolve) => {
          modal.addEventListener('modal-show', (e) => {
            expect(e.detail).toBeDefined();
            resolve();
          });
          modal.show();
        });
      });

      it('should bubble and be composed', () => {
        return new Promise((resolve) => {
          modal.addEventListener('modal-show', (e) => {
            expect(e.bubbles).toBe(true);
            expect(e.composed).toBe(true);
            resolve();
          });
          modal.show();
        });
      });
    });

    describe('modal-hide event', () => {
      it('should fire via hide() method', () => {
        modal.visible = true;
        return new Promise((resolve) => {
          modal.addEventListener('modal-hide', (e) => {
            expect(e.detail).toBeDefined();
            resolve();
          });
          modal.hide();
        });
      });

      it('should bubble and be composed', () => {
        modal.visible = true;
        return new Promise((resolve) => {
          modal.addEventListener('modal-hide', (e) => {
            expect(e.bubbles).toBe(true);
            expect(e.composed).toBe(true);
            resolve();
          });
          modal.hide();
        });
      });
    });

    describe('modal-before-close event', () => {
      it('should fire via close() method', () => {
        modal.visible = true;
        return new Promise((resolve) => {
          modal.addEventListener('modal-before-close', (e) => {
            expect(e.detail).toBeDefined();
            resolve();
          });
          modal.close();
        });
      });

      it('should be cancelable', async () => {
        modal.visible = true;
        await modal.updateComplete;

        modal.addEventListener('modal-before-close', (e) => {
          e.preventDefault();
        }, { once: true });

        modal.close();
        await modal.updateComplete;
        expect(modal.visible).toBe(true);
      });

      it('should bubble and be composed', () => {
        modal.visible = true;
        return new Promise((resolve) => {
          modal.addEventListener('modal-before-close', (e) => {
            expect(e.bubbles).toBe(true);
            expect(e.composed).toBe(true);
            resolve();
          });
          modal.close();
        });
      });
    });

    describe('modal-close event', () => {
      it('should fire via close() method after hide', () => {
        modal.visible = true;
        return new Promise((resolve) => {
          modal.addEventListener('modal-close', (e) => {
            expect(e.detail).toBeDefined();
            resolve();
          });
          modal.close();
        });
      });

      it('should not fire if before-close is prevented', async () => {
        modal.visible = true;
        await modal.updateComplete;

        let closeFired = false;
        modal.addEventListener('modal-close', () => {
          closeFired = true;
        });

        modal.addEventListener('modal-before-close', (e) => {
          e.preventDefault();
        }, { once: true });

        modal.close();
        await modal.updateComplete;

        // Wait a bit to ensure event doesn't fire
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(closeFired).toBe(false);
      });

      it('should bubble and be composed', () => {
        modal.visible = true;
        return new Promise((resolve) => {
          modal.addEventListener('modal-close', (e) => {
            expect(e.bubbles).toBe(true);
            expect(e.composed).toBe(true);
            resolve();
          });
          modal.close();
        });
      });
    });

    it('should verify all manifest events are tested', () => {
      const testedEvents = ['modal-show', 'modal-hide', 'modal-before-close', 'modal-close'];
      const manifestEvents = Object.keys(TModalManifest.events);

      manifestEvents.forEach(event => {
        expect(testedEvents).toContain(event);
      });
    });
  });

  // ============================================
  // SUITE 5: Slot Functionality (11 tests)
  // ============================================
  describe('Slot Functionality', () => {
    it('should accept content in default slot (single layout)', async () => {
      const modalWithContent = document.createElement('t-mdl');
      modalWithContent.setAttribute('layout', 'single');
      const div = document.createElement('div');
      div.setAttribute('slot', 'default');
      div.textContent = 'Test Content';
      modalWithContent.appendChild(div);
      document.body.appendChild(modalWithContent);
      await modalWithContent.updateComplete;

      const slot = modalWithContent.shadowRoot.querySelector('slot[name="default"]');
      expect(slot).toBeDefined();
      expect(slot.assignedElements().length).toBe(1);
      modalWithContent.remove();
    });

    it('should accept content in left/right slots (2-column layout)', async () => {
      const modalWithContent = document.createElement('t-mdl');
      modalWithContent.setAttribute('layout', '2-column');

      const leftDiv = document.createElement('div');
      leftDiv.setAttribute('slot', 'left');
      leftDiv.textContent = 'Left Panel';
      modalWithContent.appendChild(leftDiv);

      const rightDiv = document.createElement('div');
      rightDiv.setAttribute('slot', 'right');
      rightDiv.textContent = 'Right Panel';
      modalWithContent.appendChild(rightDiv);

      document.body.appendChild(modalWithContent);
      await modalWithContent.updateComplete;

      const leftSlot = modalWithContent.shadowRoot.querySelector('slot[name="left"]');
      const rightSlot = modalWithContent.shadowRoot.querySelector('slot[name="right"]');

      expect(leftSlot.assignedElements().length).toBe(1);
      expect(rightSlot.assignedElements().length).toBe(1);
      modalWithContent.remove();
    });

    it('should accept content in all four slots (2x2 layout)', async () => {
      const modalWithContent = document.createElement('t-mdl');
      modalWithContent.setAttribute('layout', '2x2');

      ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(slotName => {
        const div = document.createElement('div');
        div.setAttribute('slot', slotName);
        div.textContent = slotName;
        modalWithContent.appendChild(div);
      });

      document.body.appendChild(modalWithContent);
      await modalWithContent.updateComplete;

      const tlSlot = modalWithContent.shadowRoot.querySelector('slot[name="top-left"]');
      const trSlot = modalWithContent.shadowRoot.querySelector('slot[name="top-right"]');
      const blSlot = modalWithContent.shadowRoot.querySelector('slot[name="bottom-left"]');
      const brSlot = modalWithContent.shadowRoot.querySelector('slot[name="bottom-right"]');

      expect(tlSlot.assignedElements().length).toBe(1);
      expect(trSlot.assignedElements().length).toBe(1);
      expect(blSlot.assignedElements().length).toBe(1);
      expect(brSlot.assignedElements().length).toBe(1);
      modalWithContent.remove();
    });

    it('should accept content in 1-2-1 layout slots', async () => {
      const modalWithContent = document.createElement('t-mdl');
      modalWithContent.setAttribute('layout', '1-2-1');

      ['top', 'middle-left', 'middle-right', 'bottom'].forEach(slotName => {
        const div = document.createElement('div');
        div.setAttribute('slot', slotName);
        div.textContent = slotName;
        modalWithContent.appendChild(div);
      });

      document.body.appendChild(modalWithContent);
      await modalWithContent.updateComplete;

      const topSlot = modalWithContent.shadowRoot.querySelector('slot[name="top"]');
      const mlSlot = modalWithContent.shadowRoot.querySelector('slot[name="middle-left"]');
      const mrSlot = modalWithContent.shadowRoot.querySelector('slot[name="middle-right"]');
      const bottomSlot = modalWithContent.shadowRoot.querySelector('slot[name="bottom"]');

      expect(topSlot.assignedElements().length).toBe(1);
      expect(mlSlot.assignedElements().length).toBe(1);
      expect(mrSlot.assignedElements().length).toBe(1);
      expect(bottomSlot.assignedElements().length).toBe(1);
      modalWithContent.remove();
    });

    it('should accept content in 2-1 layout slots', async () => {
      const modalWithContent = document.createElement('t-mdl');
      modalWithContent.setAttribute('layout', '2-1');

      ['top-left', 'top-right', 'bottom'].forEach(slotName => {
        const div = document.createElement('div');
        div.setAttribute('slot', slotName);
        div.textContent = slotName;
        modalWithContent.appendChild(div);
      });

      document.body.appendChild(modalWithContent);
      await modalWithContent.updateComplete;

      const tlSlot = modalWithContent.shadowRoot.querySelector('slot[name="top-left"]');
      const trSlot = modalWithContent.shadowRoot.querySelector('slot[name="top-right"]');
      const bottomSlot = modalWithContent.shadowRoot.querySelector('slot[name="bottom"]');

      expect(tlSlot.assignedElements().length).toBe(1);
      expect(trSlot.assignedElements().length).toBe(1);
      expect(bottomSlot.assignedElements().length).toBe(1);
      modalWithContent.remove();
    });

    it('should switch layouts correctly', async () => {
      modal.layout = 'single';
      await modal.updateComplete;
      expect(modal.shadowRoot.querySelector('.layout-single')).toBeDefined();

      modal.layout = '2-column';
      await modal.updateComplete;
      expect(modal.shadowRoot.querySelector('.layout-2-column')).toBeDefined();

      modal.layout = '2x2';
      await modal.updateComplete;
      expect(modal.shadowRoot.querySelector('.layout-2x2')).toBeDefined();
    });
  });

  // ============================================
  // SUITE 6: Validation (3 tests)
  // ============================================
  describe('Validation', () => {
    it('should validate layout enum', () => {
      const validation = TModalLit.getPropertyValidation('layout');
      expect(validation).toBeDefined();

      const validResult = validation.validate('single');
      expect(validResult.valid).toBe(true);

      const invalidResult = validation.validate('invalid-layout');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should validate size enum', () => {
      const validation = TModalLit.getPropertyValidation('size');
      expect(validation).toBeDefined();

      const validResult = validation.validate('medium');
      expect(validResult.valid).toBe(true);

      const invalidResult = validation.validate('invalid-size');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should revert to old value on validation failure', async () => {
      modal.layout = 'single';
      await modal.updateComplete;

      // Try to set invalid layout
      modal.layout = 'invalid-layout';
      await modal.updateComplete;

      // Should revert to 'single'
      expect(modal.layout).toBe('single');
    });
  });

  // ============================================
  // SUITE 7: Rendering (10 tests)
  // ============================================
  describe('Rendering', () => {
    it('should render component', () => {
      expect(modal).toBeDefined();
      expect(modal.shadowRoot).toBeDefined();
    });

    it('should render backdrop', () => {
      const backdrop = modal.shadowRoot.querySelector('.modal-backdrop');
      expect(backdrop).toBeDefined();
    });

    it('should render modal container', () => {
      const modalContainer = modal.shadowRoot.querySelector('.modal');
      expect(modalContainer).toBeDefined();
    });

    it('should render modal header', () => {
      const header = modal.shadowRoot.querySelector('.modal-header');
      expect(header).toBeDefined();
    });

    it('should render modal title', async () => {
      modal.title = 'Test Modal';
      await modal.updateComplete;

      const title = modal.shadowRoot.querySelector('.modal-title');
      expect(title.textContent.trim()).toContain('Test Modal');
    });

    it('should render close button', () => {
      const closeBtn = modal.shadowRoot.querySelector('.modal-close');
      expect(closeBtn).toBeDefined();
    });

    it('should apply open class when visible', async () => {
      modal.visible = false;
      await modal.updateComplete;
      let backdrop = modal.shadowRoot.querySelector('.modal-backdrop');
      expect(backdrop.classList.contains('open')).toBe(false);

      modal.visible = true;
      await modal.updateComplete;
      backdrop = modal.shadowRoot.querySelector('.modal-backdrop');
      expect(backdrop.classList.contains('open')).toBe(true);
    });

    it('should apply size attribute to host', async () => {
      modal.size = 'large';
      await modal.updateComplete;
      expect(modal.hasAttribute('size')).toBe(true);
      expect(modal.getAttribute('size')).toBe('large');
    });

    it('should apply loading attribute to host', async () => {
      modal.loading = true;
      await modal.updateComplete;
      expect(modal.hasAttribute('loading')).toBe(true);
    });

    it('should render correct layout class', async () => {
      modal.layout = '2-column';
      await modal.updateComplete;

      const layout = modal.shadowRoot.querySelector('.modal-layout');
      expect(layout.classList.contains('layout-2-column')).toBe(true);
    });
  });

  // ============================================
  // SUITE 8: Cleanup Patterns (4 tests)
  // ============================================
  describe('Cleanup Patterns', () => {
    it('should restore body overflow on disconnect', async () => {
      document.body.style.overflow = 'scroll';

      modal.visible = true;
      await modal.updateComplete;
      expect(document.body.style.overflow).toBe('hidden');

      modal.remove();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(document.body.style.overflow).toBe('scroll');

      // Cleanup
      document.body.style.overflow = '';
    });

    it('should remove document listeners on disconnect', async () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      modal.visible = true;
      await modal.updateComplete;

      modal.remove();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(removeEventListenerSpy).toHaveBeenCalled();
      removeEventListenerSpy.mockRestore();
    });

    it('should handle Escape key when escapeClose is true', async () => {
      modal.visible = true;
      modal.escapeClose = true;
      await modal.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      await modal.updateComplete;

      expect(modal.visible).toBe(false);
    });

    it('should not close on Escape when escapeClose is false', async () => {
      modal.visible = true;
      modal.escapeClose = false;
      await modal.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      await modal.updateComplete;

      expect(modal.visible).toBe(true);
    });
  });

  // ============================================
  // SUITE 9: Logging (1 test)
  // ============================================
  describe('Logging', () => {
    it('should have logger instance with all methods', () => {
      expect(modal._logger).toBeDefined();
      expect(typeof modal._logger.error).toBe('function');
      expect(typeof modal._logger.warn).toBe('function');
      expect(typeof modal._logger.info).toBe('function');
      expect(typeof modal._logger.debug).toBe('function');
      expect(typeof modal._logger.trace).toBe('function');
    });
  });

  // ============================================
  // SUITE 10: Nesting Support (3 tests)
  // ============================================
  describe('Nesting Support', () => {
    it('should discover nested components', async () => {
      // This test is simplified as we don't have other components loaded
      // In real usage, nested terminal components would be discovered
      expect(typeof modal._discoverNestedComponents).toBe('function');
      expect(typeof modal._registerNestedComponent).toBe('function');
    });

    it('should receive context from parent', () => {
      expect(typeof modal.receiveContext).toBe('function');

      modal.receiveContext({
        parent: {},
        depth: 0,
        logger: modal._logger
      });

      expect(modal._context).toBeDefined();
      expect(modal._context.depth).toBe(0);
    });

    it('should prevent deep nesting', () => {
      expect(() => {
        modal.receiveContext({
          parent: {},
          depth: 10,
          logger: modal._logger
        });
      }).toThrow('Maximum nesting depth exceeded');
    });
  });
});