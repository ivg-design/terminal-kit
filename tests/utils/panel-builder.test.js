/**
 * PanelBuilder Tests
 * Validates builder functionality and manifest integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PanelBuilder } from '../../js/utils/panel-builder.js';
import { componentRegistry } from '../../js/utils/component-registry.js';
import { TPanelManifest } from '../../js/components/TPanelLit.js';

describe('PanelBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new PanelBuilder({
      validate: true,
      strict: false,
      debug: false
    });

    // Ensure manifest is registered
    if (!componentRegistry.has('t-pnl')) {
      componentRegistry.register(TPanelManifest);
    }
  });

  describe('Initialization', () => {
    it('should create builder instance', () => {
      expect(builder).toBeDefined();
      expect(builder.options).toBeDefined();
    });

    it('should accept options', () => {
      const customBuilder = new PanelBuilder({
        validate: false,
        strict: true,
        debug: true
      });

      expect(customBuilder.options.validate).toBe(false);
      expect(customBuilder.options.strict).toBe(true);
      expect(customBuilder.options.debug).toBe(true);
    });
  });

  describe('Hook System', () => {
    it('should register hooks', () => {
      const beforeRender = (config) => {};
      builder.registerHook('beforeRender', beforeRender);

      expect(builder.hooks.beforeRender).toBe(beforeRender);
    });

    it('should call beforeRender hook', () => {
      let called = false;

      builder.registerHook('beforeRender', (config) => {
        called = true;
        expect(config.type).toBe('t-pnl');
      });

      builder.build({
        type: 't-pnl',
        title: 'Test'
      });

      expect(called).toBe(true);
    });

    it('should call onValidate hook', () => {
      let validationResult = null;

      builder.registerHook('onValidate', (config, result) => {
        validationResult = result;
      });

      builder.build({
        type: 't-pnl',
        title: 'Test'
      });

      expect(validationResult).toBeDefined();
      expect(validationResult.valid).toBeDefined();
    });
  });

  describe('Simple Panel Building', () => {
    it('should build simple panel', () => {
      const config = {
        type: 't-pnl',
        title: 'Simple Panel'
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build panel with all properties', () => {
      const config = {
        type: 't-pnl',
        title: 'Full Panel',
        variant: 'standard',
        collapsible: true,
        collapsed: false,
        compact: true,
        large: false,
        loading: false,
        resizable: true,
        draggable: true
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build panel with id and classes', () => {
      const config = {
        type: 't-pnl',
        id: 'test-panel',
        classes: ['custom-class', 'another-class']
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });
  });

  describe('Panel with Actions', () => {
    it('should build panel with action buttons', () => {
      const config = {
        type: 't-pnl',
        title: 'Panel with Actions',
        actions: [
          {
            type: 't-btn',
            label: 'Save',
            variant: 'primary'
          },
          {
            type: 't-btn',
            label: 'Cancel',
            variant: 'secondary'
          }
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build panel with action button events', () => {
      const clickHandler = () => {};

      const config = {
        type: 't-pnl',
        actions: [
          {
            type: 't-btn',
            label: 'Click Me',
            events: {
              click: clickHandler
            }
          }
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });
  });

  describe('Nested Panels', () => {
    it('should build nested panels', () => {
      const config = {
        type: 't-pnl',
        title: 'Parent Panel',
        panels: [
          {
            type: 't-pnl',
            title: 'Child Panel 1',
            compact: true
          },
          {
            type: 't-pnl',
            title: 'Child Panel 2',
            compact: true
          }
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build deeply nested panels', () => {
      const config = {
        type: 't-pnl',
        title: 'Level 1',
        panels: [
          {
            type: 't-pnl',
            title: 'Level 2',
            panels: [
              {
                type: 't-pnl',
                title: 'Level 3'
              }
            ]
          }
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });
  });

  describe('Panel with Content', () => {
    it('should build panel with string content', () => {
      const config = {
        type: 't-pnl',
        title: 'Panel',
        content: ['Simple text content']
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build panel with component content', () => {
      const config = {
        type: 't-pnl',
        title: 'Panel',
        content: [
          {
            type: 't-inp',
            placeholder: 'Enter text',
            value: 'Initial value'
          }
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build panel with mixed content', () => {
      const config = {
        type: 't-pnl',
        title: 'Mixed Content',
        content: [
          'Text before',
          {
            type: 't-sld',
            min: 0,
            max: 100,
            value: 50
          },
          'Text after'
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });
  });

  describe('Panel with Footer', () => {
    it('should build panel with footer', () => {
      const config = {
        type: 't-pnl',
        title: 'Panel',
        footer: ['Footer content']
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });

    it('should build panel with footer components', () => {
      const config = {
        type: 't-pnl',
        title: 'Panel',
        footer: [
          {
            type: 't-btn',
            label: 'Footer Button',
            size: 'xs'
          }
        ]
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should validate panel config', () => {
      const config = {
        type: 't-pnl',
        variant: 'standard'
      };

      const validation = builder.validate(config);
      expect(validation.valid).toBe(true);
    });

    it('should catch invalid variant', () => {
      const config = {
        type: 't-pnl',
        props: {
          variant: 'invalid-variant'
        }
      };

      const validation = builder.validate(config);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should warn about missing manifest', () => {
      const config = {
        type: 'unknown-component'
      };

      const validation = builder.validate(config);
      expect(validation.warnings).toBeDefined();
    });

    it('should throw in strict mode for invalid config', () => {
      const strictBuilder = new PanelBuilder({
        validate: true,
        strict: true
      });

      expect(() => {
        strictBuilder.build({
          type: 't-pnl',
          props: {
            variant: 'invalid'
          }
        });
      }).toThrow();
    });
  });

  describe('Component Building', () => {
    it('should build button component', () => {
      const config = {
        type: 't-btn',
        label: 'Click Me',
        variant: 'primary'
      };

      const result = builder.buildComponent(config);
      expect(result).toBeDefined();
    });

    it('should build input component', () => {
      const config = {
        type: 't-inp',
        placeholder: 'Enter text',
        value: 'Test'
      };

      const result = builder.buildComponent(config);
      expect(result).toBeDefined();
    });

    it('should build slider component', () => {
      const config = {
        type: 't-sld',
        label: 'Volume',
        min: 0,
        max: 100,
        value: 75
      };

      const result = builder.buildComponent(config);
      expect(result).toBeDefined();
    });

    it('should build toggle component', () => {
      const config = {
        type: 't-tog',
        label: 'Enable',
        checked: true
      };

      const result = builder.buildComponent(config);
      expect(result).toBeDefined();
    });

    it('should build dropdown component', () => {
      const config = {
        type: 't-drp',
        placeholder: 'Select option',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]
      };

      const result = builder.buildComponent(config);
      expect(result).toBeDefined();
    });
  });

  describe('Complex Layouts', () => {
    it('should build animation editor layout', () => {
      const config = {
        type: 't-pnl',
        title: 'Animation Editor',
        large: true,
        actions: [
          { type: 't-btn', label: 'Play', variant: 'primary', size: '' },
          { type: 't-btn', label: 'Stop', variant: 'danger', size: '' }
        ],
        panels: [
          {
            type: 't-pnl',
            title: 'Timing',
            compact: true,
            content: [
              { type: 't-sld', label: 'Duration', min: 0, max: 10, value: 2 },
              { type: 't-sld', label: 'Delay', min: 0, max: 5, value: 0 }
            ]
          },
          {
            type: 't-pnl',
            title: 'Colors',
            compact: true,
            content: [
              { type: 't-clr', value: '#00ff41' },
              { type: 't-clr', value: '#ff0041' }
            ]
          }
        ],
        footer: ['Status: Ready']
      };

      const result = builder.build(config);
      expect(result).toBeDefined();
    });
  });
});