/**
 * Dynamic Control Panel Builder with DSD Support
 * Generates control panels at runtime while maintaining DSD benefits
 */

export class DynamicPanelBuilder {
  constructor() {
    // Cache DSD templates for each component type
    this.templates = new Map();
    this.styles = new Map();

    // Pre-load component templates and styles
    this.initializeTemplates();
  }

  async initializeTemplates() {
    // In production, these would be generated at build time
    // For now, define them here

    // Store DSD templates for each component type
    this.templates.set('t-slider', {
      html: '<input type="range" part="slider"><output part="value"></output>',
      css: `
        :host { display: block; }
        input[type="range"] {
          width: 100%;
          background: var(--color-black);
          outline: 1px solid var(--color-green);
        }
        /* ... more slider styles ... */
      `
    });

    this.templates.set('t-dropdown', {
      html: '<select part="select"><slot></slot></select>',
      css: `
        :host { display: block; }
        select {
          width: 100%;
          background: var(--color-black);
          color: var(--color-green);
          border: 1px solid var(--color-green);
        }
        /* ... more dropdown styles ... */
      `
    });

    this.templates.set('t-input', {
      html: '<input part="input" type="text">',
      css: `
        :host { display: block; }
        input {
          width: 100%;
          background: var(--color-black);
          color: var(--color-green);
          border: 1px solid var(--color-green);
          padding: 0.5em;
        }
        /* ... more input styles ... */
      `
    });

    this.templates.set('t-color-picker', {
      html: '<input type="color" part="picker"><span part="value"></span>',
      css: `
        :host { display: inline-block; }
        input[type="color"] {
          width: 50px;
          height: 50px;
          border: 2px solid var(--color-green);
          background: var(--color-black);
        }
        /* ... more color picker styles ... */
      `
    });

    this.templates.set('t-panel', {
      html: '<header part="header"><slot name="title"></slot></header><div part="content"><slot></slot></div>',
      css: `
        :host {
          display: block;
          border: 1px solid var(--color-green);
          background: var(--color-black);
        }
        header {
          padding: 0.5em;
          background: var(--color-green);
          color: var(--color-black);
        }
        /* ... more panel styles ... */
      `
    });
  }

  /**
   * Create a single control with DSD
   */
  createControl(type, config) {
    const template = this.templates.get(type);
    if (!template) {
      console.error(`Unknown control type: ${type}`);
      return '';
    }

    // Build attributes from config
    const attrs = Object.entries(config)
      .filter(([key]) => key !== 'type' && key !== 'label')
      .map(([key, val]) => `${key}="${val}"`)
      .join(' ');

    // Generate DSD template inline
    const dsdHTML = `
      <${type} ${attrs}>
        <template shadowrootmode="open">
          <style>${template.css}</style>
          ${template.html}
        </template>
        ${config.label || ''}
      </${type}>
    `;

    return dsdHTML;
  }

  /**
   * Generate a complete control panel from configuration
   */
  generatePanel(animationConfig, title = 'Controls') {
    const controls = [];

    // Generate each control with DSD
    for (const [param, config] of Object.entries(animationConfig)) {
      let control = '';

      switch(config.type) {
        case 'slider':
          control = this.createControl('t-slider', {
            name: param,
            min: config.min || 0,
            max: config.max || 100,
            value: config.default || 50,
            label: config.label || param
          });
          break;

        case 'dropdown':
          // Generate options
          const options = (config.options || []).map(opt =>
            `<option value="${opt}">${opt}</option>`
          ).join('');

          control = `
            <t-dropdown name="${param}">
              <template shadowrootmode="open">
                <style>${this.templates.get('t-dropdown').css}</style>
                <select part="select">${options}</select>
              </template>
            </t-dropdown>
          `;
          break;

        case 'color':
        case 'color-picker':
          control = this.createControl('t-color-picker', {
            name: param,
            value: config.default || '#00ff00',
            label: config.label || param
          });
          break;

        case 'input':
          control = this.createControl('t-input', {
            name: param,
            type: config.variant || 'text',
            value: config.default || '',
            placeholder: config.placeholder || param,
            label: config.label || param
          });
          break;

        case 'toggle':
          control = this.createControl('t-toggle', {
            name: param,
            checked: config.default || false,
            label: config.label || param
          });
          break;
      }

      if (control) {
        // Wrap each control in a labeled container
        controls.push(`
          <div class="control-group" data-param="${param}">
            <label>${config.label || param}</label>
            ${control}
          </div>
        `);
      }
    }

    // Wrap everything in a panel with DSD
    const panelHTML = `
      <t-panel class="control-panel">
        <template shadowrootmode="open">
          <style>${this.templates.get('t-panel').css}</style>
          ${this.templates.get('t-panel').html}
        </template>
        <span slot="title">${title}</span>
        ${controls.join('\n')}
      </t-panel>
    `;

    return panelHTML;
  }

  /**
   * Mount a dynamically generated panel to the DOM
   * CRITICAL: Use setHTMLUnsafe to parse DSD templates!
   */
  mountPanel(container, animationConfig, title) {
    const panelHTML = this.generatePanel(animationConfig, title);

    // Check if browser supports setHTMLUnsafe
    if (container.setHTMLUnsafe) {
      // Modern way - DSD templates will be parsed!
      container.setHTMLUnsafe(panelHTML);
    } else {
      // Fallback for older browsers
      console.warn('setHTMLUnsafe not supported, using innerHTML + manual DSD polyfill');
      container.innerHTML = panelHTML;

      // Manually process DSD templates
      this.polyfillDSD(container);
    }

    // Return the panel element for further manipulation
    return container.querySelector('.control-panel');
  }

  /**
   * Polyfill for browsers without setHTMLUnsafe
   */
  polyfillDSD(container) {
    const templates = container.querySelectorAll('template[shadowrootmode]');

    templates.forEach(template => {
      const mode = template.getAttribute('shadowrootmode');
      const host = template.parentElement;

      if (host && !host.shadowRoot) {
        const shadow = host.attachShadow({ mode });
        shadow.innerHTML = template.innerHTML;
        template.remove();
      }
    });
  }

  /**
   * Helper to get all control values
   */
  getValues(panel) {
    const values = {};

    panel.querySelectorAll('[name]').forEach(control => {
      const name = control.getAttribute('name');

      // Get value based on control type
      if (control.tagName === 'T-TOGGLE') {
        values[name] = control.checked;
      } else if (control.tagName === 'T-DROPDOWN') {
        values[name] = control.value;
      } else {
        values[name] = control.value;
      }
    });

    return values;
  }

  /**
   * Helper to subscribe to control changes
   */
  onChange(panel, callback) {
    panel.addEventListener('change', (e) => {
      const control = e.target.closest('[name]');
      if (control) {
        const values = this.getValues(panel);
        callback(values, control.getAttribute('name'));
      }
    });
  }
}

// Usage Example
export function createAnimationControls(animationParams) {
  const builder = new DynamicPanelBuilder();

  // Configuration for animation controls
  const config = {
    duration: {
      type: 'slider',
      min: 0,
      max: 5000,
      default: 1000,
      label: 'Duration (ms)'
    },
    easing: {
      type: 'dropdown',
      options: ['linear', 'ease-in', 'ease-out', 'bounce'],
      default: 'linear',
      label: 'Easing Function'
    },
    color: {
      type: 'color-picker',
      default: '#00ff00',
      label: 'Animation Color'
    },
    loops: {
      type: 'input',
      variant: 'number',
      default: 1,
      min: 1,
      max: 100,
      label: 'Loop Count'
    },
    reverse: {
      type: 'toggle',
      default: false,
      label: 'Reverse Animation'
    }
  };

  // Mount the panel
  const container = document.getElementById('controls-container');
  const panel = builder.mountPanel(container, config, 'Animation Controls');

  // Listen for changes
  builder.onChange(panel, (values, changedParam) => {
    console.log(`${changedParam} changed:`, values);
    // Update animation with new values
    updateAnimation(values);
  });

  return panel;
}