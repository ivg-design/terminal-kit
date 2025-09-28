/**
 * PanelBuilder - Type-safe programmatic panel construction
 *
 * Builds Lit templates from configuration objects with:
 * - Manifest-based validation
 * - Nested panel support
 * - Hook system for lifecycle events
 * - Runtime type checking
 */

import { html, nothing } from 'lit';
import { componentRegistry } from './component-registry.js';

export class PanelBuilder {
  /**
   * @param {import('../types/panel-builder').PanelBuilderOptions} [options]
   */
  constructor(options = {}) {
    this.options = {
      validate: options.validate ?? true,
      strict: options.strict ?? false,
      debug: options.debug ?? false,
      ...options
    };

    /** @type {import('../types/panel-builder').HookRegistry} */
    this.hooks = {};

    this.log('PanelBuilder initialized', this.options);
  }

  /**
   * Register a lifecycle hook
   * @param {keyof import('../types/panel-builder').HookRegistry} hookName
   * @param {Function} callback
   */
  registerHook(hookName, callback) {
    this.hooks[hookName] = callback;
    this.log(`Registered hook: ${hookName}`);
  }

  /**
   * Build a panel from config
   * @param {import('../types/panel-builder').PanelConfig} config
   * @returns {import('lit').TemplateResult}
   */
  build(config) {
    this.log('Building panel', config);

    // Validate config if enabled
    if (this.options.validate) {
      const validation = this.validate(config);
      if (!validation.valid) {
        const error = new Error(`Panel config validation failed:\n${validation.errors.join('\n')}`);

        if (this.hooks.onError) {
          this.hooks.onError(error, config);
        }

        if (this.options.strict) {
          throw error;
        }

        console.error(error.message);
      }
    }

    // Before render hook
    if (this.hooks.beforeRender) {
      this.hooks.beforeRender(config);
    }

    // Build the template
    const template = this._buildPanel(config);

    return template;
  }

  /**
   * Internal panel builder
   * @private
   */
  _buildPanel(config) {
    const {
      title = '',
      variant = 'standard',
      collapsible = false,
      collapsed = false,
      compact = false,
      large = false,
      loading = false,
      resizable = false,
      draggable = false,
      icon = '',
      footerCollapsed = false,
      actions = [],
      content = [],
      footer = [],
      panels = [],
      id,
      classes = [],
      style,
      events = {},
      props = {}
    } = config;

    // Build properties object
    const panelProps = {
      title,
      variant,
      collapsible,
      collapsed,
      compact,
      large,
      loading,
      resizable,
      draggable,
      icon,
      footerCollapsed,
      ...props
    };

    return html`
      <t-pnl
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        .title="${panelProps.title}"
        .variant="${panelProps.variant}"
        ?collapsible="${panelProps.collapsible}"
        ?collapsed="${panelProps.collapsed}"
        ?compact="${panelProps.compact}"
        ?large="${panelProps.large}"
        ?loading="${panelProps.loading}"
        ?resizable="${panelProps.resizable}"
        ?draggable="${panelProps.draggable}"
        .icon="${panelProps.icon}"
        ?footerCollapsed="${panelProps.footerCollapsed}"
        ${this._buildEventListeners(events)}>

        ${actions.length > 0 ? html`
          <div slot="actions">
            ${actions.map(action => this.buildComponent(action))}
          </div>
        ` : nothing}

        ${content.map(item => this._buildContent(item))}
        ${panels.map(panel => this._buildPanel(panel))}

        ${footer.length > 0 ? html`
          <div slot="footer">
            ${footer.map(item => this._buildContent(item))}
          </div>
        ` : nothing}
      </t-pnl>
    `;
  }

  /**
   * Build any component from config
   * @param {import('../types/panel-builder').ComponentConfig} config
   * @returns {import('lit').TemplateResult | typeof nothing}
   */
  buildComponent(config) {
    const { type } = config;

    if (!type) {
      console.error('[PanelBuilder] Component config missing type', config);
      return nothing;
    }

    // Validate if enabled
    if (this.options.validate && componentRegistry.has(type)) {
      const validation = componentRegistry.validate(type, config.props || {});
      if (!validation.valid) {
        console.error(`[PanelBuilder] Validation failed for ${type}:`, validation.errors);
        if (this.options.strict) {
          throw new Error(`Component validation failed: ${validation.errors.join(', ')}`);
        }
      }
    }

    // Route to specific builder
    switch (type) {
      case 't-pnl':
        return this._buildPanel(config);
      case 't-btn':
        return this._buildButton(config);
      case 't-inp':
        return this._buildInput(config);
      case 't-sld':
        return this._buildSlider(config);
      case 't-tog':
        return this._buildToggle(config);
      case 't-drp':
        return this._buildDropdown(config);
      case 't-clr':
        return this._buildColorPicker(config);
      case 't-textarea':
        return this._buildTextarea(config);
      case 't-ldr':
        return this._buildLoader(config);
      default:
        // Generic component builder
        return this._buildGenericComponent(config);
    }
  }

  /**
   * Build button component
   * @private
   */
  _buildButton(config) {
    const {
      label = '',
      variant = 'primary',
      buttonType = 'text',
      size = '',
      disabled = false,
      loading = false,
      icon = '',
      toggleState = false,
      iconOn = '',
      iconOff = '',
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-btn
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        variant="${variant}"
        type="${buttonType}"
        size="${size || nothing}"
        ?disabled="${disabled}"
        ?loading="${loading}"
        .icon="${icon}"
        ?toggleState="${toggleState}"
        .iconOn="${iconOn}"
        .iconOff="${iconOff}"
        ${this._buildEventListeners(events)}>
        ${label}
      </t-btn>
    `;
  }

  /**
   * Build input component
   * @private
   */
  _buildInput(config) {
    const {
      inputType = 'text',
      placeholder = '',
      value = '',
      disabled = false,
      readonly = false,
      required = false,
      min,
      max,
      pattern,
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-inp
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        type="${inputType}"
        placeholder="${placeholder}"
        .value="${value}"
        ?disabled="${disabled}"
        ?readonly="${readonly}"
        ?required="${required}"
        min="${min ?? nothing}"
        max="${max ?? nothing}"
        pattern="${pattern || nothing}"
        ${this._buildEventListeners(events)}>
      </t-inp>
    `;
  }

  /**
   * Build slider component
   * @private
   */
  _buildSlider(config) {
    const {
      label = '',
      min = 0,
      max = 100,
      value = 50,
      step = 1,
      disabled = false,
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-sld
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        .label="${label}"
        min="${min}"
        max="${max}"
        .value="${value}"
        step="${step}"
        ?disabled="${disabled}"
        ${this._buildEventListeners(events)}>
      </t-sld>
    `;
  }

  /**
   * Build toggle component
   * @private
   */
  _buildToggle(config) {
    const {
      label = '',
      checked = false,
      disabled = false,
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-tog
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        .label="${label}"
        ?checked="${checked}"
        ?disabled="${disabled}"
        ${this._buildEventListeners(events)}>
      </t-tog>
    `;
  }

  /**
   * Build dropdown component
   * @private
   */
  _buildDropdown(config) {
    const {
      placeholder = '',
      value = '',
      options = [],
      searchable = false,
      disabled = false,
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-drp
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        placeholder="${placeholder}"
        .value="${value}"
        .options="${options}"
        ?searchable="${searchable}"
        ?disabled="${disabled}"
        ${this._buildEventListeners(events)}>
      </t-drp>
    `;
  }

  /**
   * Build color picker component
   * @private
   */
  _buildColorPicker(config) {
    const {
      value = '#00ff41',
      disabled = false,
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-clr
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        .value="${value}"
        ?disabled="${disabled}"
        ${this._buildEventListeners(events)}>
      </t-clr>
    `;
  }

  /**
   * Build textarea component
   * @private
   */
  _buildTextarea(config) {
    const {
      placeholder = '',
      value = '',
      rows = 4,
      disabled = false,
      readonly = false,
      required = false,
      id,
      classes = [],
      style,
      events = {}
    } = config;

    return html`
      <t-textarea
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        placeholder="${placeholder}"
        .value="${value}"
        rows="${rows}"
        ?disabled="${disabled}"
        ?readonly="${readonly}"
        ?required="${required}"
        ${this._buildEventListeners(events)}>
      </t-textarea>
    `;
  }

  /**
   * Build loader component
   * @private
   */
  _buildLoader(config) {
    const {
      loaderType = 'spinner',
      size = 'medium',
      color = '',
      id,
      classes = [],
      style
    } = config;

    return html`
      <t-ldr
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        type="${loaderType}"
        size="${size}"
        color="${color || nothing}">
      </t-ldr>
    `;
  }

  /**
   * Build generic component (fallback)
   * @private
   */
  _buildGenericComponent(config) {
    const { type, id, classes = [], style, props = {}, events = {} } = config;

    // Build property bindings dynamically
    const propBindings = Object.entries(props).map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : nothing;
      }
      return { [key]: value };
    });

    this.log(`Building generic component: ${type}`, config);

    return html`
      <${type}
        id="${id || nothing}"
        class="${classes.join(' ') || nothing}"
        style="${typeof style === 'string' ? style : this._styleObjectToString(style)}"
        ${this._buildEventListeners(events)}>
      </${type}>
    `;
  }

  /**
   * Build content (can be string, TemplateResult, or ComponentConfig)
   * @private
   */
  _buildContent(item) {
    if (typeof item === 'string') {
      return html`${item}`;
    }

    if (item && typeof item === 'object' && 'type' in item) {
      return this.buildComponent(item);
    }

    // Assume it's already a TemplateResult
    return item;
  }

  /**
   * Build event listeners directive
   * @private
   */
  _buildEventListeners(events) {
    return (part) => {
      if (!part.element) return;

      for (const [eventName, handler] of Object.entries(events)) {
        part.element.addEventListener(eventName, handler);
      }
    };
  }

  /**
   * Convert style object to string
   * @private
   */
  _styleObjectToString(style) {
    if (!style || typeof style !== 'object') return '';

    return Object.entries(style)
      .map(([key, value]) => {
        const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  }

  /**
   * Validate a config against its manifest
   * @param {import('../types/panel-builder').ComponentConfig} config
   * @returns {import('../types/panel-builder').ValidationResult}
   */
  validate(config) {
    const { type, props = {} } = config;

    if (!componentRegistry.has(type)) {
      return {
        valid: true,
        warnings: [`No manifest found for ${type}, skipping validation`]
      };
    }

    const result = componentRegistry.validate(type, props);

    const validationResult = {
      valid: result.valid,
      errors: result.errors.map(err => ({ path: type, message: err })),
      warnings: []
    };

    if (this.hooks.onValidate) {
      this.hooks.onValidate(config, validationResult);
    }

    return validationResult;
  }

  /**
   * Debug logging
   * @private
   */
  log(...args) {
    if (this.options.debug) {
      console.log('[PanelBuilder]', ...args);
    }
  }
}

// Convenience factory
export function createPanelBuilder(options) {
  return new PanelBuilder(options);
}