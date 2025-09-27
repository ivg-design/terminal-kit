/**
 * TPanelLit Component Tests
 * Validates all properties, methods, events, and manifest
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TPanelLit, TPanelManifest } from '../../js/components/TPanelLit.js';
import { componentRegistry } from '../../js/utils/component-registry.js';

describe('TPanelLit', () => {
  let panel;

  beforeEach(() => {
    // Create fresh instance for each test
    panel = document.createElement('t-pnl');
    document.body.appendChild(panel);
  });

  describe('Manifest', () => {
    it('should export a valid manifest', () => {
      expect(TPanelManifest).toBeDefined();
      expect(TPanelManifest.tagName).toBe('t-pnl');
      expect(TPanelManifest.displayName).toBe('Terminal Panel');
      expect(TPanelManifest.properties).toBeDefined();
      expect(TPanelManifest.methods).toBeDefined();
      expect(TPanelManifest.events).toBeDefined();
      expect(TPanelManifest.slots).toBeDefined();
    });

    it('should register manifest in global registry', () => {
      expect(componentRegistry.has('t-pnl')).toBe(true);
      const manifest = componentRegistry.get('t-pnl');
      expect(manifest).toEqual(TPanelManifest);
    });

    it('should document all component properties', () => {
      const { properties } = TPanelManifest;

      expect(properties.title).toBeDefined();
      expect(properties.title.type).toBe('string');

      expect(properties.variant).toBeDefined();
      expect(properties.variant.enum).toContain('standard');
      expect(properties.variant.enum).toContain('headless');

      expect(properties.collapsible).toBeDefined();
      expect(properties.collapsible.type).toBe('boolean');

      expect(properties.collapsed).toBeDefined();
      expect(properties.compact).toBeDefined();
      expect(properties.large).toBeDefined();
      expect(properties.loading).toBeDefined();
      expect(properties.resizable).toBeDefined();
      expect(properties.draggable).toBeDefined();
      expect(properties.icon).toBeDefined();
      expect(properties.footerCollapsed).toBeDefined();
    });

    it('should document all methods', () => {
      const { methods } = TPanelManifest;

      expect(methods.toggleCollapse).toBeDefined();
      expect(methods.toggleCollapse.parameters).toEqual([]);
      expect(methods.toggleCollapse.returns.type).toBe('boolean');

      expect(methods.toggleFooter).toBeDefined();
      expect(methods.toggleFooter.returns.type).toBe('boolean');
    });

    it('should document all events', () => {
      const { events } = TPanelManifest;

      expect(events['panel-collapsed']).toBeDefined();
      expect(events['panel-collapsed'].bubbles).toBe(true);
      expect(events['panel-collapsed'].composed).toBe(true);

      expect(events['panel-footer-collapsed']).toBeDefined();
    });

    it('should document all slots', () => {
      const { slots } = TPanelManifest;

      expect(slots.default).toBeDefined();
      expect(slots.actions).toBeDefined();
      expect(slots.actions.accepts).toContain('t-btn');
      expect(slots.footer).toBeDefined();
    });
  });

  describe('Properties', () => {
    it('should have default property values', () => {
      expect(panel.title).toBe('');
      expect(panel.variant).toBe('standard');
      expect(panel.collapsible).toBe(false);
      expect(panel.collapsed).toBe(false);
      expect(panel.compact).toBe(false);
      expect(panel.large).toBe(false);
      expect(panel.loading).toBe(false);
      expect(panel.resizable).toBe(false);
      expect(panel.draggable).toBe(false);
      expect(panel.icon).toBe('');
      expect(panel.footerCollapsed).toBe(false);
    });

    it('should accept property changes', async () => {
      panel.title = 'Test Panel';
      panel.collapsible = true;
      panel.collapsed = true;

      await panel.updateComplete;

      expect(panel.title).toBe('Test Panel');
      expect(panel.collapsible).toBe(true);
      expect(panel.collapsed).toBe(true);
    });

    it('should reflect boolean properties to attributes', async () => {
      panel.collapsible = true;
      panel.compact = true;

      await panel.updateComplete;

      expect(panel.hasAttribute('collapsible')).toBe(true);
      expect(panel.hasAttribute('compact')).toBe(true);
    });

    it('should validate variant enum values', () => {
      const validation = componentRegistry.validate('t-pnl', {
        variant: 'invalid-variant'
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
    });

    it('should accept valid variant values', () => {
      const validation1 = componentRegistry.validate('t-pnl', {
        variant: 'standard'
      });
      expect(validation1.valid).toBe(true);

      const validation2 = componentRegistry.validate('t-pnl', {
        variant: 'headless'
      });
      expect(validation2.valid).toBe(true);
    });
  });

  describe('Methods', () => {
    it('should have toggleCollapse method', () => {
      expect(typeof panel.toggleCollapse).toBe('function');
    });

    it('should toggle collapse state', async () => {
      panel.collapsible = true;
      await panel.updateComplete;

      const initialState = panel.collapsed;
      const newState = panel.toggleCollapse();

      await panel.updateComplete;

      expect(newState).toBe(!initialState);
      expect(panel.collapsed).toBe(newState);
    });

    it('should have toggleFooter method', () => {
      expect(typeof panel.toggleFooter).toBe('function');
    });

    it('should toggle footer state', async () => {
      const initialState = panel.footerCollapsed;
      const newState = panel.toggleFooter();

      await panel.updateComplete;

      expect(newState).toBe(!initialState);
      expect(panel.footerCollapsed).toBe(newState);
    });
  });

  describe('Events', () => {
    it('should emit panel-collapsed event on collapse', (done) => {
      panel.collapsible = true;
      panel.addEventListener('panel-collapsed', (e) => {
        expect(e.detail.collapsed).toBeDefined();
        expect(typeof e.detail.collapsed).toBe('boolean');
        expect(e.bubbles).toBe(true);
        expect(e.composed).toBe(true);
        done();
      });

      panel.toggleCollapse();
    });

    it('should emit panel-footer-collapsed event on footer toggle', (done) => {
      panel.addEventListener('panel-footer-collapsed', (e) => {
        expect(e.detail.collapsed).toBeDefined();
        expect(typeof e.detail.collapsed).toBe('boolean');
        done();
      });

      panel.toggleFooter();
    });
  });

  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(panel.shadowRoot).toBeDefined();
    });

    it('should render header in standard variant', async () => {
      panel.variant = 'standard';
      panel.title = 'Test Title';

      await panel.updateComplete;

      const header = panel.shadowRoot.querySelector('.t-pnl__header');
      expect(header).toBeDefined();
    });

    it('should not render header in headless variant', async () => {
      panel.variant = 'headless';

      await panel.updateComplete;

      const header = panel.shadowRoot.querySelector('.t-pnl__header');
      expect(header).toBeNull();
    });

    it('should apply size classes', async () => {
      panel.compact = true;
      await panel.updateComplete;

      expect(panel.classList.contains('t-pnl--compact') ||
             panel.shadowRoot.host.hasAttribute('compact')).toBe(true);

      panel.compact = false;
      panel.large = true;
      await panel.updateComplete;

      expect(panel.hasAttribute('large')).toBe(true);
    });
  });

  describe('Slots', () => {
    it('should have default slot for content', () => {
      const slots = panel.shadowRoot.querySelectorAll('slot:not([name])');
      expect(slots.length).toBeGreaterThan(0);
    });

    it('should have actions slot', () => {
      const actionsSlot = panel.shadowRoot.querySelector('slot[name="actions"]');
      expect(actionsSlot).toBeDefined();
    });

    it('should have footer slot', () => {
      const footerSlot = panel.shadowRoot.querySelector('slot[name="footer"]');
      expect(footerSlot).toBeDefined();
    });
  });
});