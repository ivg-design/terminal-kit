import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TPanelLit, TPanelManifest } from '../../js/components/TPanelLit.js';

describe('TPanelLit', () => {
  let panel;

  beforeEach(() => {
    panel = document.createElement('t-pnl');
    document.body.appendChild(panel);
  });

  afterEach(() => {
    panel.remove();
  });

  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TPanelManifest).toBeDefined();
      expect(TPanelManifest.tagName).toBe('t-pnl');
      expect(TPanelManifest.displayName).toBe('Terminal Panel');
      expect(TPanelManifest.version).toBe('1.0.0');
    });

    it('should document all properties', () => {
      const { properties } = TPanelManifest;

      expect(properties.title).toBeDefined();
      expect(properties.variant).toBeDefined();
      expect(properties.collapsible).toBeDefined();
      expect(properties.collapsed).toBeDefined();
      expect(properties.compact).toBeDefined();
      expect(properties.large).toBeDefined();
      expect(properties.loading).toBeDefined();
      expect(properties.icon).toBeDefined();
      expect(properties.footerCollapsed).toBeDefined();
    });

    it('should document all methods', () => {
      const { methods } = TPanelManifest;

      expect(methods.toggleCollapse).toBeDefined();
      expect(methods.collapse).toBeDefined();
      expect(methods.expand).toBeDefined();
      expect(methods.toggleFooterCollapse).toBeDefined();
      expect(methods.startLoading).toBeDefined();
      expect(methods.stopLoading).toBeDefined();
      expect(methods.receiveContext).toBeDefined();
    });

    it('should document all events', () => {
      const { events } = TPanelManifest;

      expect(events['panel-collapsed']).toBeDefined();
      expect(events['panel-footer-collapsed']).toBeDefined();
      expect(events['panel-loading-start']).toBeDefined();
      expect(events['panel-loading-end']).toBeDefined();
    });

    it('should document all slots', () => {
      const { slots } = TPanelManifest;

      expect(slots.default).toBeDefined();
      expect(slots.actions).toBeDefined();
      expect(slots.footer).toBeDefined();
    });

    it('should have variant enum values', () => {
      const { properties } = TPanelManifest;
      expect(properties.variant.enum).toContain('standard');
      expect(properties.variant.enum).toContain('headless');
    });
  });

  describe('Property Functionality', () => {
    it('title property should work', async () => {
      panel.title = 'Test Panel';
      await panel.updateComplete;
      expect(panel.title).toBe('Test Panel');
      expect(panel.getAttribute('title')).toBe('Test Panel');
    });

    it('variant property should work', async () => {
      panel.variant = 'headless';
      await panel.updateComplete;
      expect(panel.variant).toBe('headless');
      expect(panel.getAttribute('variant')).toBe('headless');
    });

    it('collapsible property should work', async () => {
      panel.collapsible = true;
      await panel.updateComplete;
      expect(panel.collapsible).toBe(true);
      expect(panel.hasAttribute('collapsible')).toBe(true);
    });

    it('collapsed property should work', async () => {
      panel.collapsed = true;
      await panel.updateComplete;
      expect(panel.collapsed).toBe(true);
      expect(panel.hasAttribute('collapsed')).toBe(true);
    });

    it('compact property should work', async () => {
      panel.compact = true;
      await panel.updateComplete;
      expect(panel.compact).toBe(true);
      expect(panel.hasAttribute('compact')).toBe(true);
    });

    it('large property should work', async () => {
      panel.large = true;
      await panel.updateComplete;
      expect(panel.large).toBe(true);
      expect(panel.hasAttribute('large')).toBe(true);
    });

    it('loading property should work', async () => {
      panel.loading = true;
      await panel.updateComplete;
      expect(panel.loading).toBe(true);
      expect(panel.hasAttribute('loading')).toBe(true);
    });

    it('icon property should work', async () => {
      panel.icon = '<svg>test</svg>';
      await panel.updateComplete;
      expect(panel.icon).toBe('<svg>test</svg>');
    });

    it('footerCollapsed property should work', async () => {
      panel.footerCollapsed = true;
      await panel.updateComplete;
      expect(panel.footerCollapsed).toBe(true);
      expect(panel.hasAttribute('footer-collapsed')).toBe(true);
    });
  });

  describe('Method Functionality', () => {
    it('toggleCollapse() should work when collapsible', async () => {
      panel.collapsible = true;
      await panel.updateComplete;

      const result = panel.toggleCollapse();
      expect(result).toBe(true);
      expect(panel.collapsed).toBe(true);

      panel.toggleCollapse();
      expect(panel.collapsed).toBe(false);
    });

    it('toggleCollapse() should not work when not collapsible', async () => {
      panel.collapsible = false;
      await panel.updateComplete;

      const result = panel.toggleCollapse();
      expect(result).toBe(false);
      expect(panel.collapsed).toBe(false);
    });

    it('collapse() should work when collapsible', async () => {
      panel.collapsible = true;
      await panel.updateComplete;

      panel.collapse();
      expect(panel.collapsed).toBe(true);
    });

    it('expand() should work', async () => {
      panel.collapsed = true;
      await panel.updateComplete;

      panel.expand();
      expect(panel.collapsed).toBe(false);
    });

    it('toggleFooterCollapse() should work', async () => {
      await panel.updateComplete;

      const result = panel.toggleFooterCollapse();
      expect(result).toBe(true);
      expect(panel.footerCollapsed).toBe(true);

      panel.toggleFooterCollapse();
      expect(panel.footerCollapsed).toBe(false);
    });

    it('startLoading() should work', async () => {
      panel.startLoading();
      await panel.updateComplete;
      expect(panel.loading).toBe(true);
    });

    it('stopLoading() should work', async () => {
      panel.loading = true;
      await panel.updateComplete;

      panel.stopLoading();
      await panel.updateComplete;
      expect(panel.loading).toBe(false);
    });

    it('receiveContext() should work', async () => {
      panel.receiveContext({ size: 'compact' });
      await panel.updateComplete;
      expect(panel.compact).toBe(true);

      panel.compact = false;
      panel.receiveContext({ size: 'large' });
      await panel.updateComplete;
      expect(panel.large).toBe(true);
    });
  });

  describe('Event Functionality', () => {
    describe('panel-collapsed event', () => {
      it('should fire when toggleCollapse() is called', async () => {
        panel.collapsible = true;
        await panel.updateComplete;

        const handler = vi.fn();
        panel.addEventListener('panel-collapsed', handler);

        panel.toggleCollapse();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][0].detail.collapsed).toBe(true);
      });

      it('should fire when collapse() is called', async () => {
        panel.collapsible = true;
        await panel.updateComplete;

        const handler = vi.fn();
        panel.addEventListener('panel-collapsed', handler);

        panel.collapse();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][0].detail.collapsed).toBe(true);
      });

      it('should fire when expand() is called', async () => {
        panel.collapsible = true;
        panel.collapsed = true;
        await panel.updateComplete;

        const handler = vi.fn();
        panel.addEventListener('panel-collapsed', handler);

        panel.expand();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][0].detail.collapsed).toBe(false);
      });

      it('should bubble and be composed', async () => {
        panel.collapsible = true;
        await panel.updateComplete;

        const handler = vi.fn();
        document.body.addEventListener('panel-collapsed', handler);

        panel.toggleCollapse();

        expect(handler).toHaveBeenCalledOnce();
        const event = handler.mock.calls[0][0];
        expect(event.bubbles).toBe(true);
        expect(event.composed).toBe(true);

        document.body.removeEventListener('panel-collapsed', handler);
      });

      it('should include correct detail structure', async () => {
        panel.collapsible = true;
        await panel.updateComplete;

        const handler = vi.fn();
        panel.addEventListener('panel-collapsed', handler);

        panel.toggleCollapse();

        const event = handler.mock.calls[0][0];
        expect(event.detail).toHaveProperty('collapsed');
        expect(typeof event.detail.collapsed).toBe('boolean');
      });
    });

    describe('panel-footer-collapsed event', () => {
      it('should fire when toggleFooterCollapse() is called', async () => {
        const handler = vi.fn();
        panel.addEventListener('panel-footer-collapsed', handler);

        panel.toggleFooterCollapse();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0][0].detail.footerCollapsed).toBe(true);
      });

      it('should fire via footer collapse button click', async () => {
        const footer = document.createElement('div');
        footer.setAttribute('slot', 'footer');
        panel.appendChild(footer);
        await panel.updateComplete;

        const handler = vi.fn();
        panel.addEventListener('panel-footer-collapsed', handler);

        const collapseBtn = panel.shadowRoot.querySelector('.t-pnl__footer-collapse');
        if (collapseBtn) {
          collapseBtn.click();
          expect(handler).toHaveBeenCalled();
        }
      });

      it('should bubble and be composed', async () => {
        const handler = vi.fn();
        document.body.addEventListener('panel-footer-collapsed', handler);

        panel.toggleFooterCollapse();

        expect(handler).toHaveBeenCalledOnce();
        const event = handler.mock.calls[0][0];
        expect(event.bubbles).toBe(true);
        expect(event.composed).toBe(true);

        document.body.removeEventListener('panel-footer-collapsed', handler);
      });
    });

    describe('panel-loading-start event', () => {
      it('should fire when startLoading() is called', async () => {
        const handler = vi.fn();
        panel.addEventListener('panel-loading-start', handler);

        panel.startLoading();
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();
      });

      it('should fire when loading property is set to true', async () => {
        const handler = vi.fn();
        panel.addEventListener('panel-loading-start', handler);

        panel.loading = true;
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();
      });

      it('should bubble and be composed', async () => {
        const handler = vi.fn();
        document.body.addEventListener('panel-loading-start', handler);

        panel.startLoading();
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();
        const event = handler.mock.calls[0][0];
        expect(event.bubbles).toBe(true);
        expect(event.composed).toBe(true);

        document.body.removeEventListener('panel-loading-start', handler);
      });
    });

    describe('panel-loading-end event', () => {
      it('should fire when stopLoading() is called', async () => {
        const handler = vi.fn();
        panel.addEventListener('panel-loading-end', handler);

        panel.loading = true;
        await panel.updateComplete;

        panel.stopLoading();
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();
      });

      it('should fire when loading property is set to false', async () => {
        panel.loading = true;
        await panel.updateComplete;

        const handler = vi.fn();
        panel.addEventListener('panel-loading-end', handler);

        panel.loading = false;
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();
      });

      it('should fire when loading auto-times out', async () => {
        vi.useFakeTimers();

        const handler = vi.fn();
        panel.addEventListener('panel-loading-end', handler);

        panel.startLoading();
        await panel.updateComplete;

        vi.advanceTimersByTime(30000);
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();

        vi.useRealTimers();
      });

      it('should bubble and be composed', async () => {
        panel.loading = true;
        await panel.updateComplete;

        const handler = vi.fn();
        document.body.addEventListener('panel-loading-end', handler);

        panel.stopLoading();
        await panel.updateComplete;

        expect(handler).toHaveBeenCalledOnce();
        const event = handler.mock.calls[0][0];
        expect(event.bubbles).toBe(true);
        expect(event.composed).toBe(true);

        document.body.removeEventListener('panel-loading-end', handler);
      });
    });

    describe('Event manifest completeness', () => {
      it('all manifest events should be testable', () => {
        const manifestEvents = Object.keys(TPanelManifest.events);
        const testedEvents = [
          'panel-collapsed',
          'panel-footer-collapsed',
          'panel-loading-start',
          'panel-loading-end'
        ];

        manifestEvents.forEach(eventName => {
          expect(testedEvents).toContain(eventName);
        });
      });

      it('all manifest events should have bubbles:true', () => {
        const { events } = TPanelManifest;
        Object.values(events).forEach(eventConfig => {
          expect(eventConfig.bubbles).toBe(true);
        });
      });

      it('all manifest events should have composed:true', () => {
        const { events } = TPanelManifest;
        Object.values(events).forEach(eventConfig => {
          expect(eventConfig.composed).toBe(true);
        });
      });
    });
  });

  describe('Slot Functionality', () => {
    it('default slot should accept content', async () => {
      const content = document.createElement('div');
      content.textContent = 'Test Content';
      panel.appendChild(content);

      await panel.updateComplete;

      const slot = panel.shadowRoot.querySelector('slot:not([name])');
      expect(slot).toBeTruthy();
      const assigned = slot.assignedElements();
      expect(assigned.length).toBe(1);
      expect(assigned[0]).toBe(content);
    });

    it('actions slot should accept buttons', async () => {
      const button = document.createElement('t-btn');
      button.setAttribute('slot', 'actions');
      panel.appendChild(button);

      await panel.updateComplete;

      const slot = panel.shadowRoot.querySelector('slot[name="actions"]');
      expect(slot).toBeTruthy();
      const assigned = slot.assignedElements();
      expect(assigned.length).toBe(1);
      expect(assigned[0]).toBe(button);
    });

    it('footer slot should accept content', async () => {
      const footer = document.createElement('div');
      footer.setAttribute('slot', 'footer');
      footer.textContent = 'Footer Content';
      panel.appendChild(footer);

      await panel.updateComplete;

      const slot = panel.shadowRoot.querySelector('slot[name="footer"]');
      expect(slot).toBeTruthy();
      const assigned = slot.assignedElements();
      expect(assigned.length).toBe(1);
      expect(assigned[0]).toBe(footer);
    });
  });

  describe('Validation', () => {
    it('should validate variant enum', () => {
      const validation = TPanelLit.getPropertyValidation('variant');
      expect(validation).toBeDefined();

      const validResult = validation.validate('standard');
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = validation.validate('invalid');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should validate actions slot', () => {
      const validation = TPanelLit.getSlotValidation('actions');
      expect(validation).toBeDefined();
      expect(validation.accepts).toContain('t-btn');
      expect(validation.maxElements).toBe(10);
    });
  });

  describe('Rendering', () => {
    it('should render', async () => {
      await panel.updateComplete;
      const shadowRoot = panel.shadowRoot;
      expect(shadowRoot).toBeTruthy();
    });

    it('should render header when not headless', async () => {
      panel.title = 'Test Panel';
      await panel.updateComplete;
      const header = panel.shadowRoot.querySelector('.t-pnl__header');
      expect(header).toBeTruthy();
    });

    it('should render body', async () => {
      await panel.updateComplete;
      const body = panel.shadowRoot.querySelector('.t-pnl__body');
      expect(body).toBeTruthy();
    });

    it('should hide body when collapsed', async () => {
      panel.collapsed = true;
      await panel.updateComplete;
      const body = panel.shadowRoot.querySelector('.t-pnl__body');
      expect(body).toBeFalsy();
    });

    it('should render collapse button when collapsible', async () => {
      panel.collapsible = true;
      await panel.updateComplete;
      const collapseBtn = panel.shadowRoot.querySelector('.t-pnl__collapse-btn');
      expect(collapseBtn).toBeTruthy();
    });

    it('should apply compact class', async () => {
      panel.compact = true;
      await panel.updateComplete;
      const panelDiv = panel.shadowRoot.querySelector('.t-pnl');
      expect(panelDiv.classList.contains('t-pnl--compact')).toBe(true);
    });

    it('should apply large class', async () => {
      panel.large = true;
      await panel.updateComplete;
      const panelDiv = panel.shadowRoot.querySelector('.t-pnl');
      expect(panelDiv.classList.contains('t-pnl--large')).toBe(true);
    });

    it('should apply loading class', async () => {
      panel.loading = true;
      await panel.updateComplete;
      const panelDiv = panel.shadowRoot.querySelector('.t-pnl');
      expect(panelDiv.classList.contains('t-pnl--loading')).toBe(true);
    });
  });

  describe('Nesting Support', () => {
    it('should discover nested components', async () => {
      const nestedPanel = document.createElement('t-pnl');
      panel.appendChild(nestedPanel);

      await panel.updateComplete;
      await nestedPanel.updateComplete;

      const slot = panel.shadowRoot.querySelector('slot:not([name])');
      const assigned = slot.assignedElements();
      const hasNestedPanel = assigned.some(el => el.tagName === 'T-PNL');
      expect(hasNestedPanel).toBe(true);
    });

    it('should propagate context to children via receiveContext', async () => {
      document.body.removeChild(panel);

      const newPanel = document.createElement('t-pnl');
      const nestedPanel = document.createElement('t-pnl');
      newPanel.appendChild(nestedPanel);
      document.body.appendChild(newPanel);

      // Wait for components to be fully upgraded and initialized
      await customElements.whenDefined('t-pnl');
      await newPanel.updateComplete;
      await nestedPanel.updateComplete;

      // Nested panel should have default compact value
      expect(nestedPanel.compact).toBeDefined();
      expect(nestedPanel.compact).toBe(false);

      newPanel.compact = true;
      await newPanel.updateComplete;

      expect(nestedPanel.compact).toBe(true);

      newPanel.remove();
    });
  });

  describe('Cleanup Patterns', () => {
    it('should clear timers on disconnect', async () => {
      panel.startLoading();
      await panel.updateComplete;

      const timerCount = panel._timers.size;
      expect(timerCount).toBeGreaterThan(0);

      panel.remove();

      expect(panel._timers.size).toBe(0);
    });

    it('should auto-stop loading after timeout', async () => {
      vi.useFakeTimers();

      panel.startLoading();
      await panel.updateComplete;
      expect(panel.loading).toBe(true);

      vi.advanceTimersByTime(30000);
      await panel.updateComplete;

      expect(panel.loading).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(panel._logger).toBeDefined();
      expect(panel._logger.debug).toBeDefined();
      expect(panel._logger.info).toBeDefined();
      expect(panel._logger.warn).toBeDefined();
      expect(panel._logger.error).toBeDefined();
    });
  });
});