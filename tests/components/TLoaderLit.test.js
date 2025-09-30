/**
 * TLoaderLit Component Tests
 * DISPLAY profile component (Blocks 1-7, 12-13)
 * Testing pattern: Properties, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TLoaderLit.js';

describe('TLoaderLit', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`<t-ldr></t-ldr>`);
  });

  afterEach(() => {
    component?.remove();
  });

  // ======================================================
  // SUITE 1: Properties (REQUIRED for DISPLAY profile)
  // ======================================================
  describe('Properties', () => {
    it('should have correct static metadata', () => {
      expect(component.constructor.tagName).toBe('t-ldr');
      expect(component.constructor.version).toBe('3.0.0');
      expect(component.constructor.category).toBe('Display');
    });

    it('should have correct default values', () => {
      expect(component.type).toBe('atom-spinner');
      expect(component.size).toBe(60);
      expect(component.color).toBe('#00ff41');
      expect(component.text).toBe('');
      expect(component.hidden).toBe(false);
      expect(component.glow).toBe(false);
    });

    it('should update type property', async () => {
      component.type = 'pixel-spinner';
      await component.updateComplete;
      expect(component.type).toBe('pixel-spinner');
      expect(component.getAttribute('type')).toBe('pixel-spinner');

      component.type = 'orbit-spinner';
      await component.updateComplete;
      expect(component.type).toBe('orbit-spinner');
    });

    it('should update size property', async () => {
      component.size = 30;
      await component.updateComplete;
      expect(component.size).toBe(30);
      expect(component.getAttribute('size')).toBe('30');

      component.size = 90;
      await component.updateComplete;
      expect(component.size).toBe(90);
    });

    it('should update color property', async () => {
      component.color = '#ff00aa';
      await component.updateComplete;
      expect(component.color).toBe('#ff00aa');
      expect(component.getAttribute('color')).toBe('#ff00aa');
    });

    it('should update text property', async () => {
      component.text = 'Loading...';
      await component.updateComplete;
      expect(component.text).toBe('Loading...');
      expect(component.getAttribute('text')).toBe('Loading...');
    });

    it('should update glow property', async () => {
      component.glow = false;
      await component.updateComplete;
      expect(component.glow).toBe(false);
      expect(component.hasAttribute('glow')).toBe(false);
    });

    it('should reflect properties to attributes', async () => {
      component.type = 'bar-spinner';
      component.size = 90;
      component.color = '#ff0000';
      component.text = 'Please wait';
      await component.updateComplete;

      expect(component.getAttribute('type')).toBe('bar-spinner');
      expect(component.getAttribute('size')).toBe('90');
      expect(component.getAttribute('color')).toBe('#ff0000');
      expect(component.getAttribute('text')).toBe('Please wait');
    });

    it('should update properties from attributes', async () => {
      const withAttrs = await fixture(html`
        <t-ldr
          type="dot-spinner"
          size="30"
          color="#00aaff"
          text="Processing...">
        </t-ldr>
      `);

      expect(withAttrs.type).toBe('dot-spinner');
      expect(withAttrs.size).toBe(30);
      expect(withAttrs.color).toBe('#00aaff');
      expect(withAttrs.text).toBe('Processing...');
    });

    it('should have list of available spinners', () => {
      const spinnerTypes = component.constructor.spinnerTypes;
      expect(Array.isArray(spinnerTypes)).toBe(true);
      expect(spinnerTypes.length).toBeGreaterThan(50);
      expect(spinnerTypes).toContain('atom-spinner');
      expect(spinnerTypes).toContain('pixel-spinner');
      expect(spinnerTypes).toContain('bar-spinner');
    });
  });

  // ======================================================
  // SUITE 2: Rendering (REQUIRED for DISPLAY profile)
  // ======================================================
  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(component.shadowRoot).toBeDefined();
      expect(component.shadowRoot).not.toBeNull();
    });

    it('should render default spinner type', async () => {
      const wrapper = component.shadowRoot.querySelector('.loader-wrapper');
      expect(wrapper).toBeDefined();

      const spinnerContainer = component.shadowRoot.querySelector('.spinner-container');
      expect(spinnerContainer).toBeDefined();
    });

    it('should render different spinner types', async () => {
      // Test that spinner HTML is rendered
      component.type = 'pixel-spinner';
      await component.updateComplete;
      const container = component.shadowRoot.querySelector('.spinner-container');
      expect(container.innerHTML).toContain('pixel-spinner');

      component.type = 'orbit-spinner';
      await component.updateComplete;
      expect(container.innerHTML).toContain('orbit-spinner');
    });

    it('should handle invalid spinner type', async () => {
      component.type = 'invalid-spinner';
      await component.updateComplete;

      const errorMessage = component.shadowRoot.querySelector('.error-message');
      expect(errorMessage).toBeDefined();
      expect(errorMessage.textContent).toContain('Invalid spinner type');
    });

    it('should apply size styles', async () => {
      // Test numeric size
      component.size = 45;
      await component.updateComplete;
      expect(component.style.getPropertyValue('--loader-size')).toBe('45px');

      // Test larger size
      component.size = 100;
      await component.updateComplete;
      expect(component.style.getPropertyValue('--loader-size')).toBe('100px');
    });

    it('should apply custom color CSS variable', async () => {
      component.color = '#ff6b35';
      await component.updateComplete;
      expect(component.style.getPropertyValue('--loader-color')).toBe('#ff6b35');
    });

    it('should render loading text when provided', async () => {
      component.text = 'Processing data...';
      await component.updateComplete;

      const textElement = component.shadowRoot.querySelector('.loader-text');
      expect(textElement).toBeDefined();
      expect(textElement.textContent).toBe('Processing data...');
    });

    it('should not render text element when text is empty', async () => {
      component.text = '';
      await component.updateComplete;

      const textElement = component.shadowRoot.querySelector('.loader-text');
      expect(textElement).toBeNull();
    });

    it('should apply glow effect class', async () => {
      const container = component.shadowRoot.querySelector('.spinner-container');

      // Glow is false by default
      expect(container.classList.contains('glow')).toBe(false);

      component.glow = true;
      await component.updateComplete;
      expect(container.classList.contains('glow')).toBe(true);
    });
  });

  // ======================================================
  // SUITE 3: Public Methods (REQUIRED for DISPLAY profile)
  // ======================================================
  describe('Public Methods', () => {
    it('should show loader', async () => {
      component.hidden = true;
      await component.updateComplete;

      component.show();
      await component.updateComplete;

      expect(component.hidden).toBe(false);
    });

    it('should hide loader', async () => {
      component.hidden = false;
      await component.updateComplete;

      component.hide();
      await component.updateComplete;

      expect(component.hidden).toBe(true);
    });

    it('should toggle visibility', async () => {
      component.hidden = false;
      component.toggle();
      await component.updateComplete;
      expect(component.hidden).toBe(true);

      component.toggle();
      await component.updateComplete;
      expect(component.hidden).toBe(false);
    });

    it('should set spinner type', async () => {
      component.setType('pixel-spinner');
      await component.updateComplete;
      expect(component.type).toBe('pixel-spinner');

      // Invalid type should not change
      component.setType('invalid-type');
      await component.updateComplete;
      expect(component.type).toBe('pixel-spinner');
    });

    it('should get available types', () => {
      const types = component.getAvailableTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(50);
      expect(types).toContain('atom-spinner');
    });

    it('should set loading text', async () => {
      component.setText('New loading message');
      await component.updateComplete;
      expect(component.text).toBe('New loading message');
    });
  });

  // ======================================================
  // SUITE 4: Events
  // ======================================================
  describe('Events', () => {
    it('should dispatch loader-show event', async () => {
      const eventSpy = vi.fn();
      component.addEventListener('loader-show', eventSpy);

      component.show();
      await component.updateComplete;

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.type).toBe('atom-spinner');
    });

    it('should dispatch loader-hide event', async () => {
      const eventSpy = vi.fn();
      component.addEventListener('loader-hide', eventSpy);

      component.hide();
      await component.updateComplete;

      expect(eventSpy).toHaveBeenCalled();
      expect(eventSpy.mock.calls[0][0].detail.type).toBe('atom-spinner');
    });

    it('should dispatch loader-connected event', async () => {
      const eventSpy = vi.fn();

      const newComponent = document.createElement('t-ldr');
      newComponent.addEventListener('loader-connected', eventSpy);
      document.body.appendChild(newComponent);

      await newComponent.updateComplete;

      expect(eventSpy).toHaveBeenCalled();
      newComponent.remove();
    });
  });

  // ======================================================
  // SUITE 5: Lifecycle (REQUIRED)
  // ======================================================
  describe('Lifecycle', () => {
    it('should call connectedCallback', async () => {
      const spy = vi.spyOn(component.logger, 'info');

      const newComponent = document.createElement('t-ldr');
      document.body.appendChild(newComponent);
      await newComponent.updateComplete;

      expect(spy).toHaveBeenCalledWith('Connected to DOM');
      newComponent.remove();
    });

    it('should call disconnectedCallback', () => {
      const spy = vi.spyOn(component.logger, 'info');

      component.remove();

      expect(spy).toHaveBeenCalledWith('Disconnected from DOM');
    });
  });

  // ======================================================
  // SUITE 6: Logging
  // ======================================================
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(component.logger).toBeDefined();
      expect(component.logger).not.toBeNull();
    });

    it('should have all logger methods', () => {
      expect(typeof component.logger.debug).toBe('function');
      expect(typeof component.logger.info).toBe('function');
      expect(typeof component.logger.warn).toBe('function');
      expect(typeof component.logger.error).toBe('function');
    });

    it('should log lifecycle events', () => {
      const infoSpy = vi.spyOn(component.logger, 'info');
      const debugSpy = vi.spyOn(component.logger, 'debug');

      // Trigger lifecycle
      component.connectedCallback();
      expect(infoSpy).toHaveBeenCalledWith('Connected to DOM');

      // Trigger render
      component.render();
      expect(debugSpy).toHaveBeenCalledWith(
        'Rendering',
        expect.objectContaining({
          type: expect.any(String),
          size: expect.any(Number),
          color: expect.any(String),
          hidden: expect.any(Boolean)
        })
      );
    });
  });

  // ======================================================
  // SUITE 7: CSS and Styling
  // ======================================================
  describe('CSS and Styling', () => {
    it('should have static styles defined', () => {
      expect(component.constructor.styles).toBeDefined();
      expect(component.constructor.styles.cssText).toContain('.loader-wrapper');
      expect(component.constructor.styles.cssText).toContain('.spinner-container');
    });

    it('should apply terminal theme colors', async () => {
      const styles = component.constructor.styles.cssText;
      expect(styles).toContain('--terminal-green');
      expect(styles).toContain('--loader-color');
      expect(styles).toContain('--loader-size');
    });

    it('should support reduced motion media query', () => {
      const styles = component.constructor.styles.cssText;
      expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
    });
  });

  // ======================================================
  // SUITE 8: Accessibility
  // ======================================================
  describe('Accessibility', () => {
    it('should be visible by default', () => {
      expect(component.hidden).toBe(false);
      const wrapper = component.shadowRoot.querySelector('.loader-wrapper');
      expect(wrapper.hasAttribute('hidden')).toBe(false);
    });

    it('should properly hide from screen readers when hidden', async () => {
      component.hidden = true;
      await component.updateComplete;

      const wrapper = component.shadowRoot.querySelector('.loader-wrapper');
      expect(wrapper.hasAttribute('hidden')).toBe(true);
    });

    it('should maintain text readability', async () => {
      component.text = 'Loading your content';
      await component.updateComplete;

      const textElement = component.shadowRoot.querySelector('.loader-text');
      expect(textElement).toBeDefined();
      expect(textElement.textContent).toBe('Loading your content');
    });
  });

  // ======================================================
  // SUITE 9: Integration
  // ======================================================
  describe('Integration', () => {
    it('should work with all property combinations', async () => {
      const configs = [
        { type: 'atom-spinner', size: 30, color: '#ff0000', text: 'Small red atom' },
        { type: 'pixel-spinner', size: 60, color: '#00ff00', text: 'Medium green pixel' },
        { type: 'orbit-spinner', size: 90, color: '#0000ff', text: 'Large blue orbit' }
      ];

      for (const config of configs) {
        Object.assign(component, config);
        await component.updateComplete;

        expect(component.type).toBe(config.type);
        expect(component.size).toBe(config.size);
        expect(component.color).toBe(config.color);
        expect(component.text).toBe(config.text);
      }
    });

    it('should handle rapid property changes', async () => {
      const types = ['atom-spinner', 'pixel-spinner', 'bar-spinner'];

      for (let i = 0; i < 10; i++) {
        component.type = types[i % types.length];
        component.size = 30 + (i * 10);
        component.color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        await component.updateComplete;
      }

      // Should end up with last values
      expect(component.type).toBe('atom-spinner');
      expect(component.size).toBe(120);
    });

    it('should maintain state through show/hide cycles', async () => {
      component.type = 'fingerprint-spinner';
      component.size = 75;
      component.color = '#ff6b35';
      component.text = 'Processing...';
      await component.updateComplete;

      // Hide and show
      component.hide();
      await component.updateComplete;
      component.show();
      await component.updateComplete;

      // State should be maintained
      expect(component.type).toBe('fingerprint-spinner');
      expect(component.size).toBe(75);
      expect(component.color).toBe('#ff6b35');
      expect(component.text).toBe('Processing...');
    });
  });
});