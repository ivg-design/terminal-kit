/**
 * PanelBuilder Usage Examples
 *
 * Demonstrates building complex nested panel layouts from config objects
 */

import { render } from 'lit';
import { PanelBuilder } from '../js/utils/panel-builder.js';
import { componentRegistry } from '../js/utils/component-registry.js';

// Import components to register them
import '../js/components/TPanelLit.js';
import '../js/components/TButtonLit.js';

// Create builder instance
const builder = new PanelBuilder({
  validate: true,
  strict: false,
  debug: true
});

// Register lifecycle hooks
builder.registerHook('beforeRender', (config) => {
  console.log('About to render:', config.type);
});

builder.registerHook('onError', (error, config) => {
  console.error('Build error:', error.message, config);
});

// ============================================
// Example 1: Simple Panel
// ============================================

const simplePanelConfig = {
  type: 't-pnl',
  title: 'Simple Panel',
  collapsible: true,
  content: [
    'This is a simple panel with text content.'
  ]
};

const simplePanel = builder.build(simplePanelConfig);
render(simplePanel, document.getElementById('simple-example'));

// ============================================
// Example 2: Panel with Actions
// ============================================

const panelWithActionsConfig = {
  type: 't-pnl',
  title: 'Animation Controls',
  collapsible: true,
  compact: false,
  actions: [
    {
      type: 't-btn',
      label: 'Play',
      variant: 'primary',
      size: 'small',
      events: {
        click: () => console.log('Play clicked')
      }
    },
    {
      type: 't-btn',
      label: 'Stop',
      variant: 'danger',
      size: 'small',
      events: {
        click: () => console.log('Stop clicked')
      }
    }
  ],
  content: [
    'Animation controls content here...'
  ]
};

const actionsPanel = builder.build(panelWithActionsConfig);
render(actionsPanel, document.getElementById('actions-example'));

// ============================================
// Example 3: Nested Panels
// ============================================

const nestedPanelsConfig = {
  type: 't-pnl',
  title: 'Animation Editor',
  large: true,
  collapsible: true,
  panels: [
    {
      type: 't-pnl',
      title: 'Timing',
      compact: true,
      collapsible: true,
      content: [
        {
          type: 't-sld',
          id: 'duration',
          label: 'Duration (s)',
          min: 0,
          max: 10,
          value: 2,
          step: 0.1,
          events: {
            change: (e) => console.log('Duration:', e.target.value)
          }
        },
        {
          type: 't-sld',
          id: 'delay',
          label: 'Delay (s)',
          min: 0,
          max: 5,
          value: 0,
          step: 0.1,
          events: {
            change: (e) => console.log('Delay:', e.target.value)
          }
        }
      ]
    },
    {
      type: 't-pnl',
      title: 'Easing',
      compact: true,
      collapsible: true,
      content: [
        {
          type: 't-drp',
          id: 'easing',
          placeholder: 'Select easing function',
          value: 'ease-in-out',
          options: [
            { label: 'Linear', value: 'linear' },
            { label: 'Ease In', value: 'ease-in' },
            { label: 'Ease Out', value: 'ease-out' },
            { label: 'Ease In-Out', value: 'ease-in-out' }
          ],
          events: {
            change: (e) => console.log('Easing:', e.target.value)
          }
        }
      ]
    },
    {
      type: 't-pnl',
      title: 'Colors',
      compact: true,
      collapsible: true,
      content: [
        {
          type: 't-clr',
          id: 'color-start',
          value: '#00ff41',
          events: {
            change: (e) => console.log('Start color:', e.target.value)
          }
        },
        {
          type: 't-clr',
          id: 'color-end',
          value: '#ff0041',
          events: {
            change: (e) => console.log('End color:', e.target.value)
          }
        }
      ]
    }
  ],
  footer: [
    'Ready to animate'
  ]
};

const nestedPanel = builder.build(nestedPanelsConfig);
render(nestedPanel, document.getElementById('nested-example'));

// ============================================
// Example 4: Dynamic Panel Creation
// ============================================

function createDynamicPanel(animationData) {
  const config = {
    type: 't-pnl',
    title: animationData.name,
    collapsible: true,
    collapsed: !animationData.expanded,
    actions: [
      {
        type: 't-btn',
        label: 'Edit',
        variant: 'secondary',
        size: 'small',
        events: {
          click: () => editAnimation(animationData.id)
        }
      },
      {
        type: 't-btn',
        label: 'Delete',
        variant: 'danger',
        size: 'small',
        events: {
          click: () => deleteAnimation(animationData.id)
        }
      }
    ],
    panels: animationData.parameters.map(param => ({
      type: 't-pnl',
      title: param.name,
      compact: true,
      content: [
        createControlForParameter(param)
      ]
    })),
    footer: [
      `Duration: ${animationData.duration}s`
    ]
  };

  return builder.build(config);
}

function createControlForParameter(param) {
  switch (param.type) {
    case 'number':
      return {
        type: 't-sld',
        id: `param-${param.id}`,
        label: param.label,
        min: param.min,
        max: param.max,
        value: param.value,
        events: {
          change: (e) => updateParameter(param.id, e.target.value)
        }
      };

    case 'color':
      return {
        type: 't-clr',
        id: `param-${param.id}`,
        value: param.value,
        events: {
          change: (e) => updateParameter(param.id, e.target.value)
        }
      };

    case 'select':
      return {
        type: 't-drp',
        id: `param-${param.id}`,
        placeholder: param.label,
        value: param.value,
        options: param.options,
        events: {
          change: (e) => updateParameter(param.id, e.target.value)
        }
      };

    case 'boolean':
      return {
        type: 't-tog',
        id: `param-${param.id}`,
        label: param.label,
        checked: param.value,
        events: {
          change: (e) => updateParameter(param.id, e.target.checked)
        }
      };

    default:
      return `Unsupported parameter type: ${param.type}`;
  }
}

// Dummy callbacks
function editAnimation(id) {
  console.log('Edit animation:', id);
}

function deleteAnimation(id) {
  console.log('Delete animation:', id);
}

function updateParameter(id, value) {
  console.log(`Parameter ${id} updated:`, value);
}

// Sample animation data
const sampleAnimation = {
  id: 'anim-001',
  name: 'Fade In',
  duration: 2.5,
  expanded: true,
  parameters: [
    {
      id: 'opacity',
      name: 'Opacity',
      type: 'number',
      label: 'Opacity',
      min: 0,
      max: 1,
      value: 1
    },
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      value: '#00ff41'
    },
    {
      id: 'easing',
      name: 'Easing',
      type: 'select',
      label: 'Easing Function',
      value: 'ease-in',
      options: [
        { label: 'Linear', value: 'linear' },
        { label: 'Ease In', value: 'ease-in' },
        { label: 'Ease Out', value: 'ease-out' }
      ]
    },
    {
      id: 'loop',
      name: 'Loop',
      type: 'boolean',
      label: 'Loop Animation',
      value: false
    }
  ]
};

const dynamicPanel = createDynamicPanel(sampleAnimation);
render(dynamicPanel, document.getElementById('dynamic-example'));

// ============================================
// Example 5: Manifest Validation
// ============================================

console.log('=== Manifest Validation ===');

// Get TPanelLit manifest
const panelManifest = componentRegistry.get('t-pnl');
console.log('Panel manifest:', panelManifest);

// Validate valid config
const validConfig = {
  title: 'Valid Panel',
  variant: 'standard',
  collapsible: true
};

const validResult = componentRegistry.validate('t-pnl', validConfig);
console.log('Valid config result:', validResult);

// Validate invalid config
const invalidConfig = {
  title: 'Invalid Panel',
  variant: 'nonexistent', // Invalid variant
  collapsible: 'yes' // Wrong type
};

const invalidResult = componentRegistry.validate('t-pnl', invalidConfig);
console.log('Invalid config result:', invalidResult);

// ============================================
// Example 6: Saving/Loading Layouts
// ============================================

// Save layout as JSON
const layoutConfig = nestedPanelsConfig;
const layoutJSON = JSON.stringify(layoutConfig, null, 2);
console.log('Saved layout:', layoutJSON);

// Load layout from JSON
const loadedConfig = JSON.parse(layoutJSON);
const loadedPanel = builder.build(loadedConfig);
console.log('Loaded panel:', loadedPanel);

// ============================================
// Export for use
// ============================================

export {
  builder,
  simplePanelConfig,
  panelWithActionsConfig,
  nestedPanelsConfig,
  createDynamicPanel
};