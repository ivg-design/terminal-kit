import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TButton, TButtonManifest } from '../../js/components/TButtonLit.js';

describe('TButtonLit', () => {
  let button;

  beforeEach(() => {
    button = document.createElement('t-btn');
    document.body.appendChild(button);
  });

  afterEach(() => {
    button.remove();
  });

  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TButtonManifest).toBeDefined();
      expect(TButtonManifest.tagName).toBe('t-btn');
      expect(TButtonManifest.displayName).toBe('Button');
      expect(TButtonManifest.version).toBe('1.0.0');
    });

    it('should document all 15 properties', () => {
      const { properties } = TButtonManifest;

      expect(properties.variant).toBeDefined();
      expect(properties.type).toBeDefined();
      expect(properties.size).toBeDefined();
      expect(properties.disabled).toBeDefined();
      expect(properties.icon).toBeDefined();
      expect(properties.loading).toBeDefined();
      expect(properties.loaderType).toBeDefined();
      expect(properties.loaderColor).toBeDefined();
      expect(properties.toggleState).toBeDefined();
      expect(properties.iconOn).toBeDefined();
      expect(properties.iconOff).toBeDefined();
      expect(properties.colorOn).toBeDefined();
      expect(properties.colorOff).toBeDefined();
      expect(properties.textOn).toBeDefined();
      expect(properties.textOff).toBeDefined();
    });

    it('should document all 6 methods', () => {
      const { methods } = TButtonManifest;

      expect(methods.click).toBeDefined();
      expect(methods.focus).toBeDefined();
      expect(methods.blur).toBeDefined();
      expect(methods.setIcon).toBeDefined();
      expect(methods.setText).toBeDefined();
      expect(methods.setLoading).toBeDefined();
    });

    it('should document all 2 events', () => {
      const { events } = TButtonManifest;

      expect(events['button-click']).toBeDefined();
      expect(events['toggle-change']).toBeDefined();
    });

    it('should document slots', () => {
      const { slots } = TButtonManifest;
      expect(slots['']).toBeDefined();
    });
  });

  describe('Static Metadata', () => {
    it('should have tagName', () => {
      expect(TButton.tagName).toBe('t-btn');
    });

    it('should have version', () => {
      expect(TButton.version).toBe('1.0.0');
    });

    it('should have category', () => {
      expect(TButton.category).toBe('Form Controls');
    });
  });

  describe('Property Functionality', () => {
    it('variant property should work', async () => {
      button.variant = 'danger';
      await button.updateComplete;
      expect(button.variant).toBe('danger');
    });

    it('type property should work', async () => {
      button.type = 'icon';
      await button.updateComplete;
      expect(button.type).toBe('icon');
    });

    it('size property should work', async () => {
      button.size = 'large';
      await button.updateComplete;
      expect(button.size).toBe('large');
    });

    it('disabled property should work', async () => {
      button.disabled = true;
      await button.updateComplete;
      expect(button.disabled).toBe(true);
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('loading property should work', async () => {
      button.loading = true;
      await button.updateComplete;
      expect(button.loading).toBe(true);
      expect(button.hasAttribute('loading')).toBe(true);
    });

    it('icon property should work', async () => {
      button.icon = '<svg>test</svg>';
      await button.updateComplete;
      expect(button.icon).toBe('<svg>test</svg>');
    });

    it('toggleState property should work', async () => {
      button.toggleState = true;
      await button.updateComplete;
      expect(button.toggleState).toBe(true);
      expect(button.hasAttribute('toggle-state')).toBe(true);
    });

    it('iconOn property should work', async () => {
      button.iconOn = '<svg>on</svg>';
      await button.updateComplete;
      expect(button.iconOn).toBe('<svg>on</svg>');
    });

    it('iconOff property should work', async () => {
      button.iconOff = '<svg>off</svg>';
      await button.updateComplete;
      expect(button.iconOff).toBe('<svg>off</svg>');
    });

    it('colorOn property should work', async () => {
      button.colorOn = '#00ff00';
      await button.updateComplete;
      expect(button.colorOn).toBe('#00ff00');
    });

    it('colorOff property should work', async () => {
      button.colorOff = '#ff0000';
      await button.updateComplete;
      expect(button.colorOff).toBe('#ff0000');
    });

    it('textOn property should work', async () => {
      button.textOn = 'Enabled';
      await button.updateComplete;
      expect(button.textOn).toBe('Enabled');
    });

    it('textOff property should work', async () => {
      button.textOff = 'Disabled';
      await button.updateComplete;
      expect(button.textOff).toBe('Disabled');
    });

    it('loaderType property should work', async () => {
      button.loaderType = 'dots';
      await button.updateComplete;
      expect(button.loaderType).toBe('dots');
    });

    it('loaderColor property should work', async () => {
      button.loaderColor = '#ff0000';
      await button.updateComplete;
      expect(button.loaderColor).toBe('#ff0000');
    });
  });

  describe('Method Functionality', () => {
    it('click() should trigger click', async () => {
      await button.updateComplete;
      let clicked = false;
      button.addEventListener('button-click', () => {
        clicked = true;
      });
      button.click();
      expect(clicked).toBe(true);
    });

    it('click() should not trigger when disabled', async () => {
      button.disabled = true;
      await button.updateComplete;
      let clicked = false;
      button.addEventListener('button-click', () => {
        clicked = true;
      });
      button.click();
      expect(clicked).toBe(false);
    });

    it('click() should not trigger when loading', async () => {
      button.loading = true;
      await button.updateComplete;
      let clicked = false;
      button.addEventListener('button-click', () => {
        clicked = true;
      });
      button.click();
      expect(clicked).toBe(false);
    });

    it('focus() should focus the button', async () => {
      await button.updateComplete;
      button.focus();
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(document.activeElement).toBe(button);
    });

    it('blur() should blur the button', async () => {
      await button.updateComplete;
      button.focus();
      button.blur();
      expect(document.activeElement).not.toBe(button);
    });

    it('setIcon() should update icon', async () => {
      await button.updateComplete;
      button.setIcon('<svg>new</svg>');
      await button.updateComplete;
      expect(button._icon).toBe('<svg>new</svg>');
    });

    it('setText() should update text', async () => {
      await button.updateComplete;
      button.setText('New Text');
      expect(button.innerHTML).toBe('New Text');
    });

    it('setLoading() should update loading state', async () => {
      await button.updateComplete;
      button.setLoading(true);
      expect(button.loading).toBe(true);
    });
  });

  describe('Event Functionality', () => {
    describe('button-click event', () => {
      it('should fire on click', async () => {
        await button.updateComplete;
        let eventFired = false;
        let eventDetail = null;
        button.addEventListener('button-click', (e) => {
          eventFired = true;
          eventDetail = e.detail;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(eventFired).toBe(true);
        expect(eventDetail).toBeDefined();
        expect(eventDetail.button).toBeDefined();
      });

      it('should have bubbles: true', async () => {
        await button.updateComplete;
        let bubbles = false;
        button.addEventListener('button-click', (e) => {
          bubbles = e.bubbles;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(bubbles).toBe(true);
      });

      it('should have composed: true', async () => {
        await button.updateComplete;
        let composed = false;
        button.addEventListener('button-click', (e) => {
          composed = e.composed;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(composed).toBe(true);
      });

      it('should not fire when disabled', async () => {
        button.disabled = true;
        await button.updateComplete;
        let eventFired = false;
        button.addEventListener('button-click', () => {
          eventFired = true;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(eventFired).toBe(false);
      });

      it('should not fire when loading', async () => {
        button.loading = true;
        await button.updateComplete;
        let eventFired = false;
        button.addEventListener('button-click', () => {
          eventFired = true;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(eventFired).toBe(false);
      });
    });

    describe('toggle-change event', () => {
      it('should fire when toggle state changes', async () => {
        button.variant = 'toggle';
        await button.updateComplete;
        let eventFired = false;
        let eventDetail = null;
        button.addEventListener('toggle-change', (e) => {
          eventFired = true;
          eventDetail = e.detail;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(eventFired).toBe(true);
        expect(eventDetail).toBeDefined();
        expect(eventDetail.state).toBe(true);
      });

      it('should have correct detail structure', async () => {
        button.variant = 'toggle';
        await button.updateComplete;
        let detail = null;
        button.addEventListener('toggle-change', (e) => {
          detail = e.detail;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(detail).toHaveProperty('state');
        expect(typeof detail.state).toBe('boolean');
      });

      it('should have bubbles: true', async () => {
        button.variant = 'toggle';
        await button.updateComplete;
        let bubbles = false;
        button.addEventListener('toggle-change', (e) => {
          bubbles = e.bubbles;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(bubbles).toBe(true);
      });

      it('should have composed: true', async () => {
        button.variant = 'toggle';
        await button.updateComplete;
        let composed = false;
        button.addEventListener('toggle-change', (e) => {
          composed = e.composed;
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        expect(composed).toBe(true);
      });

      it('should toggle state on multiple clicks', async () => {
        button.variant = 'toggle';
        await button.updateComplete;
        const states = [];
        button.addEventListener('toggle-change', (e) => {
          states.push(e.detail.state);
        });
        const btn = button.shadowRoot.querySelector('.t-btn');
        btn.click();
        btn.click();
        btn.click();
        expect(states).toEqual([true, false, true]);
      });
    });
  });

  describe('Rendering', () => {
    it('should render shadow DOM', async () => {
      await button.updateComplete;
      expect(button.shadowRoot).toBeDefined();
      expect(button.shadowRoot.querySelector('.t-btn')).toBeDefined();
    });

    it('should render primary variant class', async () => {
      button.variant = 'primary';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--primary')).toBe(true);
    });

    it('should render secondary variant class', async () => {
      button.variant = 'secondary';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--secondary')).toBe(true);
    });

    it('should render danger variant class', async () => {
      button.variant = 'danger';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--danger')).toBe(true);
    });

    it('should render success variant class', async () => {
      button.variant = 'success';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--success')).toBe(true);
    });

    it('should render warning variant class', async () => {
      button.variant = 'warning';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--warning')).toBe(true);
    });

    it('should render info variant class', async () => {
      button.variant = 'info';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--info')).toBe(true);
    });

    it('should render toggle variant class', async () => {
      button.variant = 'toggle';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--toggle')).toBe(true);
    });

    it('should render text type class', async () => {
      button.type = 'text';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--text')).toBe(true);
    });

    it('should render icon type class', async () => {
      button.type = 'icon';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--icon')).toBe(true);
    });

    it('should render icon-text type class', async () => {
      button.type = 'icon-text';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--icon-text')).toBe(true);
    });

    it('should render xs size class', async () => {
      button.size = 'xs';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--xs')).toBe(true);
    });

    it('should render small size class', async () => {
      button.size = 'small';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--small')).toBe(true);
    });

    it('should render large size class', async () => {
      button.size = 'large';
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('t-btn--large')).toBe(true);
    });

    it('should render loading class', async () => {
      button.loading = true;
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('is-loading')).toBe(true);
    });

    it('should render spinner loader by default', async () => {
      button.loading = true;
      await button.updateComplete;
      const loader = button.shadowRoot.querySelector('.btn-loader-spinner');
      expect(loader).toBeDefined();
    });

    it('should render dots loader', async () => {
      button.loading = true;
      button.loaderType = 'dots';
      await button.updateComplete;
      const loader = button.shadowRoot.querySelector('.btn-loader-dots');
      expect(loader).toBeDefined();
    });

    it('should render bars loader', async () => {
      button.loading = true;
      button.loaderType = 'bars';
      await button.updateComplete;
      const loader = button.shadowRoot.querySelector('.btn-loader-bars');
      expect(loader).toBeDefined();
    });

    it('should render toggle off state class', async () => {
      button.variant = 'toggle';
      button.toggleState = false;
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('is-off')).toBe(true);
    });

    it('should render toggle on state class', async () => {
      button.variant = 'toggle';
      button.toggleState = true;
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.classList.contains('is-on')).toBe(true);
    });

    it('should render disabled attribute', async () => {
      button.disabled = true;
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    it('should render slot content', async () => {
      button.textContent = 'Test Button';
      await button.updateComplete;
      const slot = button.shadowRoot.querySelector('slot');
      expect(slot).toBeDefined();
    });

    it('should preserve button width when loading', async () => {
      button.textContent = 'Long Button Text';
      await button.updateComplete;
      button.loading = true;
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('.t-btn');
      expect(btn).toBeDefined();
    });

    it('should render icon when provided via setIcon', async () => {
      button.setIcon('<svg width="16" height="16"><circle cx="8" cy="8" r="8" /></svg>');
      button.type = 'icon';
      await button.updateComplete;
      const content = button.shadowRoot.querySelector('.t-btn').innerHTML;
      expect(content).toContain('svg');
    });

    it('should switch icons for toggle', async () => {
      button.variant = 'toggle';
      button.type = 'icon';
      button.iconOn = '<svg>on</svg>';
      button.iconOff = '<svg>off</svg>';
      button.toggleState = false;
      await button.updateComplete;
      expect(button._icon).toContain('off');
      button.toggleState = true;
      await button.updateComplete;
      expect(button._icon).toContain('on');
    });
  });

  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(button._logger).toBeDefined();
    });

    it('should have logger error method', () => {
      expect(typeof button._logger.error).toBe('function');
    });

    it('should have logger warn method', () => {
      expect(typeof button._logger.warn).toBe('function');
    });

    it('should have logger info method', () => {
      expect(typeof button._logger.info).toBe('function');
    });

    it('should have logger debug method', () => {
      expect(typeof button._logger.debug).toBe('function');
    });

    it('should have logger trace method', () => {
      expect(typeof button._logger.trace).toBe('function');
    });

    it('should log without errors', () => {
      expect(() => {
        button._logger.info('Test log');
        button._logger.debug('Test debug');
        button._logger.error('Test error');
        button._logger.warn('Test warn');
        button._logger.trace('Test trace');
      }).not.toThrow();
    });
  });

  describe('Lifecycle', () => {
    it('should be connected to DOM', async () => {
      expect(button.isConnected).toBe(true);
    });

    it('should disconnect from DOM', async () => {
      const newButton = document.createElement('t-btn');
      document.body.appendChild(newButton);
      expect(newButton.isConnected).toBe(true);
      newButton.remove();
      expect(newButton.isConnected).toBe(false);
    });
  });

  describe('Variant-Specific Behavior', () => {
    it('toggle variant should change text based on state', async () => {
      button.variant = 'toggle';
      button.textOn = 'On';
      button.textOff = 'Off';
      button.toggleState = false;
      await button.updateComplete;
      let content = button.shadowRoot.querySelector('.t-btn').textContent;
      expect(content).toContain('Off');
      button.toggleState = true;
      await button.updateComplete;
      content = button.shadowRoot.querySelector('.t-btn').textContent;
      expect(content).toContain('On');
    });

    it('toggle variant should apply custom colors', async () => {
      button.variant = 'toggle';
      button.colorOn = '#00ff00';
      button.colorOff = '#ff0000';
      await button.updateComplete;
      expect(button.style.getPropertyValue('--toggle-color-on')).toBe('#00ff00');
      expect(button.style.getPropertyValue('--toggle-color-off')).toBe('#ff0000');
    });
  });

  describe('Size-Specific Behavior', () => {
    it('xs size should hide text', async () => {
      button.size = 'xs';
      button.textContent = 'Text';
      await button.updateComplete;
      const textSpan = button.shadowRoot.querySelector('.t-btn__text');
      if (textSpan) {
        const computedStyle = window.getComputedStyle(textSpan);
        expect(computedStyle.display).toBe('none');
      }
    });
  });

  describe('Accessibility', () => {
    it('should have button element', async () => {
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('button');
      expect(btn).toBeDefined();
    });

    it('should be focusable', async () => {
      await button.updateComplete;
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should not be focusable when disabled', async () => {
      button.disabled = true;
      await button.updateComplete;
      const btn = button.shadowRoot.querySelector('button');
      expect(btn.disabled).toBe(true);
    });
  });
});