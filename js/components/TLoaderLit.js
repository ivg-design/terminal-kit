// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';

// Import wc-spinners library - loads all spinner web components
import '../../public/js/libs/wc-spinners.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TLoaderLit
 * @tagname t-ldr
 * @description Loading indicator with 50+ animation types from wc-spinners library, wrapped in terminal/cyberpunk styling.
 * @category Display
 * @since 3.0.0
 * @example
 * <t-ldr type="atom-spinner" size="60" color="#00ff41" text="Loading..."></t-ldr>
 * <t-ldr type="pixel-spinner" size="70" text="Processing..."></t-ldr>
 * <t-ldr type="orbit-spinner" size="55" color="#ff6b35"></t-ldr>
 */
export class TLoaderLit extends LitElement {
  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-ldr';
  static version = '3.0.0';
  static category = 'Display';

  // List of all available spinners from wc-spinners
  static spinnerTypes = [
    // Epic Spinners (20)
    'atom-spinner',
    'breeding-rhombus-spinner',
    'circles-to-rhombuses-spinner',
    'fingerprint-spinner',
    'flower-spinner',
    'fulfilling-bouncing-circle-spinner',
    'fulfilling-square-spinner',
    'half-circle-spinner',
    'hollow-dots-spinner',
    'intersecting-circles-spinner',
    'looping-rhombuses-spinner',
    'orbit-spinner',
    'pixel-spinner',
    'radar-spinner',
    'scaling-squares-spinner',
    'self-building-square-spinner',
    'semipolar-spinner',
    'spring-spinner',
    'swapping-squares-spinner',
    'trinity-rings-spinner',

    // React Spinners (20)
    'bar-spinner',
    'beat-spinner',
    'bounce-spinner',
    'circle-spinner',
    'climbing-box-spinner',
    'clip-spinner',
    'dot-spinner',
    'fade-spinner',
    'grid-spinner',
    'hash-spinner',
    'moon-spinner',
    'pacman-spinner',
    'propagate-spinner',
    'pulse-spinner',
    'ring-spinner',
    'rise-spinner',
    'rotate-spinner',
    'scale-spinner',
    'skew-spinner',
    'square-spinner',

    // React Spinners CSS (14+)
    'rsc-circle-spinner',
    'default-spinner',
    'dual-ring-spinner',
    'ellipsis-spinner',
    'facebook-spinner',
    'rsc-grid-spinner',
    'heart-spinner',
    'hourglass-spinner',
    'orbitals-spinner',
    'ouroboro-spinner',
    'rsc-ring-spinner',
    'ripple-spinner',
    'roller-spinner',
    'spinner-spinner',
    'sync-spinner'
  ];

  static widthHeightDefaults = Object.freeze({
    'bar-spinner': { base: 100, width: 100, height: 4 },
    'fade-spinner': { base: 50, width: 5, height: 15, radius: 10 },
    'scale-spinner': { base: 40, width: 4, height: 35, radius: 2, margin: 2 }
  });

  static sizeDefaults = Object.freeze({
    'atom-spinner': { defaultSize: 60, innerMax: 60 },
    'breeding-rhombus-spinner': { defaultSize: 65, innerMax: 91.9 },
    'circles-to-rhombuses-spinner': { defaultSize: 15, innerMax: 78.8 },
    'fingerprint-spinner': { defaultSize: 64, innerMax: 64 },
    'flower-spinner': { defaultSize: 70, innerMax: 70 },
    'fulfilling-bouncing-circle-spinner': { defaultSize: 50, innerMax: 59.2 },
    'fulfilling-square-spinner': { defaultSize: 50, innerMax: 70 },
    'half-circle-spinner': { defaultSize: 60, innerMax: 60 },
    'hollow-dots-spinner': { defaultSize: 15, innerMax: 90 },
    'intersecting-circles-spinner': { defaultSize: 35, innerMax: 70 },
    'looping-rhombuses-spinner': { defaultSize: 15, innerMax: 60 },
    'orbit-spinner': { defaultSize: 55, innerMax: 55 },
    'pixel-spinner': { defaultSize: 70, innerMax: 70 },
    'radar-spinner': { defaultSize: 60, innerMax: 60 },
    'scaling-squares-spinner': { defaultSize: 65, innerMax: 91.6 },
    'self-building-square-spinner': { defaultSize: 10, innerMax: 40 },
    'semipolar-spinner': { defaultSize: 65, innerMax: 65 },
    'spring-spinner': { defaultSize: 60, innerMax: 60 },
    'swapping-squares-spinner': { defaultSize: 65, innerMax: 65 },
    'trinity-rings-spinner': { defaultSize: 60, innerMax: 120 },
    'beat-spinner': { defaultSize: 15, innerMax: 76.3 },
    'bounce-spinner': { defaultSize: 60, innerMax: 60 },
    'circle-spinner': { defaultSize: 60, innerMax: 60 },
    'climbing-box-spinner': { defaultSize: 15, innerMax: 113.6 },
    'clip-spinner': { defaultSize: 35, innerMax: 34.4 },
    'dot-spinner': { defaultSize: 60, innerMax: 83.8 },
    'grid-spinner': { defaultSize: 15, innerMax: 57 },
    'hash-spinner': { defaultSize: 50, innerMax: 61.2 },
    'moon-spinner': { defaultSize: 60, innerMax: 105.4 },
    'pacman-spinner': { defaultSize: 25, innerMax: 50 },
    'propagate-spinner': { defaultSize: 15, innerMax: 0 },
    'pulse-spinner': { defaultSize: 15, innerMax: 57 },
    'ring-spinner': { defaultSize: 60, innerMax: 60 },
    'rise-spinner': { defaultSize: 15, innerMax: 133.5 },
    'rotate-spinner': { defaultSize: 15, innerMax: 76.9 },
    'skew-spinner': { defaultSize: 20, innerMax: 42.4 },
    'square-spinner': { defaultSize: 50, innerMax: 50 },
    'sync-spinner': { defaultSize: 15, innerMax: 57 },
    'rsc-circle-spinner': { defaultSize: 64, innerMax: 64 },
    'default-spinner': { defaultSize: 80, innerMax: 80 },
    'dual-ring-spinner': { defaultSize: 80, innerMax: 80 },
    'ellipsis-spinner': { defaultSize: 80, innerMax: 80 },
    'facebook-spinner': { defaultSize: 80, innerMax: 80 },
    'rsc-grid-spinner': { defaultSize: 80, innerMax: 80 },
    'heart-spinner': { defaultSize: 80, innerMax: 113.1 },
    'hourglass-spinner': { defaultSize: 80, innerMax: 80 },
    'rsc-ring-spinner': { defaultSize: 80, innerMax: 80 },
    'ripple-spinner': { defaultSize: 80, innerMax: 80 }
  });

  static sizeLessDefaults = Object.freeze({
    'orbitals-spinner': { innerMax: 80 },
    'ouroboro-spinner': { innerMax: 64 },
    'roller-spinner': { innerMax: 80 },
    'spinner-spinner': { innerMax: 80 }
  });

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    /**
     * TLoaderLit Component Styles
     * Wrapper for wc-spinners with terminal/cyberpunk styling
     */

    /* Host styles */
    :host {
      display: inline-block;
      --loader-color: var(--terminal-green, #00ff41);
      --loader-size: 60px;
      --loader-duration: 1s;
    }

    :host([hidden]) {
      display: none !important;
    }

    /* Component container wrapper */
    .loader-wrapper {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0;
      padding: 0;
      width: fit-content;
      height: fit-content;
      min-width: 0;
      min-height: 0;
    }

    /* Spinner container */
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: var(--loader-size);
      height: var(--loader-size);
      flex: 0 0 var(--loader-size);
      min-width: 0;
      min-height: 0;
    }

    /* Apply terminal styling to all spinner components */
    .spinner-container > * {
      --color: var(--loader-color);
      --size: var(--loader-size);
      --duration: var(--loader-duration);
      display: block;
      min-width: 0;
      min-height: 0;
      transform-origin: center center;
    }

    /* Spinner sizing normalized at runtime based on wc-spinners defaults. */

    /* Glow effect (disabled by default) */
    .spinner-container.glow > * {
      filter: drop-shadow(0 0 8px var(--loader-color));
    }

    /* Loader Text */
    .loader-text {
      font-size: var(--font-size-sm, 14px);
      color: var(--loader-color);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: var(--font-mono, 'Courier New', monospace);
      text-align: center;
      animation: text-pulse 2s ease-in-out infinite;
      margin-top: 8px;
    }

    @keyframes text-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* Size modifiers */
    :host([size="small"]) {
      --loader-size: 30px;
    }

    :host([size="medium"]) {
      --loader-size: 60px;
    }

    :host([size="large"]) {
      --loader-size: 90px;
    }

    /* Color presets */
    :host([color="green"]) {
      --loader-color: var(--terminal-green, #00ff41);
    }

    :host([color="amber"]) {
      --loader-color: var(--terminal-amber, #ffb000);
    }

    :host([color="red"]) {
      --loader-color: var(--terminal-red, #ff003c);
    }

    :host([color="cyan"]) {
      --loader-color: var(--terminal-cyan, #00ffff);
    }

    :host([color="purple"]) {
      --loader-color: var(--terminal-purple, #9d00ff);
    }

    /* Accessibility - reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .spinner-container > *,
      .loader-text {
        animation: none !important;
      }
    }

    /* Error state for invalid spinner type */
    .error-message {
      color: var(--terminal-red, #ff003c);
      font-family: var(--font-mono, 'Courier New', monospace);
      font-size: var(--font-size-sm, 14px);
      text-align: center;
      padding: var(--spacing-md, 16px);
      border: 1px solid var(--terminal-red, #ff003c);
      background: rgba(255, 0, 60, 0.1);
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
  // ----------------------------------------------------------
  static properties = {
    type: {
      type: String,
      reflect: true
    },
    size: {
      type: Number,
      reflect: true,
      converter: {
        fromAttribute: (value) => {
          // Handle named sizes
          if (value === 'small') return 30;
          if (value === 'medium') return 60;
          if (value === 'large') return 90;
          // Handle numeric values
          return Number(value) || 60;
        },
        toAttribute: (value) => String(value)
      }
    },
    color: {
      type: String,
      reflect: true
    },
    duration: {
      type: Number,
      reflect: true
    },
    text: {
      type: String,
      reflect: true
    },
    hidden: {
      type: Boolean,
      reflect: true
    },
    glow: {
      type: Boolean,
      reflect: true
    }
  };

  // ----------------------------------------------------------
  // BLOCK 4: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  constructor() {
    super();

    // Initialize logger
    this.logger = componentLogger.for('TLoaderLit');

    // Set default property values
    this.type = 'atom-spinner';
    this.size = 60;
    this.color = '#00ff41';
    this.duration = 1;
    this.text = '';
    this.hidden = false;
    this.glow = false;

    this.logger.debug('Component constructed with defaults');
  }

  // ----------------------------------------------------------
  // BLOCK 5: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------
  render() {
    this.logger.debug('Rendering', {
      type: this.type,
      size: this.size,
      color: this.color,
      hidden: this.hidden
    });

    // Check if the spinner type is valid
    if (!TLoaderLit.spinnerTypes.includes(this.type)) {
      return html`
        <div class="error-message">
          ⚠️ Invalid spinner type: "${this.type}"<br>
          Available types: ${TLoaderLit.spinnerTypes.slice(0, 5).join(', ')}...
        </div>
      `;
    }

    // Update CSS custom properties
    this.style.setProperty('--loader-color', this.color);
    this.style.setProperty('--loader-size', `${this.size}px`);
    this.style.setProperty('--loader-duration', `${this.duration}s`);

    const widthHeightConfig = TLoaderLit.widthHeightDefaults[this.type];
    const sizeConfig = TLoaderLit.sizeDefaults[this.type];
    const sizeLessConfig = TLoaderLit.sizeLessDefaults[this.type];
    const targetSize = Math.max(1, Number(this.size) || 60);
    const formatNumber = (value) => {
      const rounded = Math.round(value * 10) / 10;
      return Number.isInteger(rounded) ? String(rounded) : String(rounded);
    };
    let spinnerHTML = '';

    if (widthHeightConfig) {
      const base = widthHeightConfig.base || Math.max(widthHeightConfig.width, widthHeightConfig.height, 1);
      const scale = base ? targetSize / base : 1;
      const width = Math.max(1, widthHeightConfig.width * scale);
      const height = Math.max(1, widthHeightConfig.height * scale);
      const attrs = [
        `color="${this.color}"`,
        `width="${formatNumber(width)}"`,
        `height="${formatNumber(height)}"`
      ];

      if (widthHeightConfig.radius !== undefined) {
        const radius = Math.max(1, widthHeightConfig.radius * scale);
        attrs.push(`radius="${formatNumber(radius)}"`);
      }

      if (widthHeightConfig.margin !== undefined) {
        const margin = Math.max(0, widthHeightConfig.margin * scale);
        attrs.push(`margin="${formatNumber(margin)}"`);
      }

      spinnerHTML = `<${this.type} ${attrs.join(' ')}></${this.type}>`;
    } else if (sizeConfig) {
      const innerMax = sizeConfig.innerMax > 0 ? sizeConfig.innerMax : sizeConfig.defaultSize;
      const ratio = innerMax ? sizeConfig.defaultSize / innerMax : 1;
      const normalizedSize = Math.max(1, targetSize * ratio);
      spinnerHTML = `<${this.type}
        color="${this.color}"
        size="${formatNumber(normalizedSize)}"
        duration="${this.duration}">
      </${this.type}>`;
    } else if (sizeLessConfig) {
      const innerMax = sizeLessConfig.innerMax || targetSize;
      const scale = innerMax ? targetSize / innerMax : 1;
      spinnerHTML = `<${this.type}
        color="${this.color}"
        duration="${this.duration}"
        style="transform: scale(${formatNumber(scale)}); transform-origin: center;">
      </${this.type}>`;
    } else {
      spinnerHTML = `<${this.type}
        color="${this.color}"
        size="${targetSize}"
        duration="${this.duration}">
      </${this.type}>`;
    }

    const typeClass = this.type ? `type-${this.type}` : '';

    return html`
      <div class="loader-wrapper" ?hidden="${this.hidden}">
        <div class="spinner-container ${this.glow ? 'glow' : ''} ${typeClass}">
          ${unsafeHTML(spinnerHTML)}
        </div>
        ${this.text ? html`<div class="loader-text">${this.text}</div>` : ''}
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 6: LIFECYCLE CALLBACKS (REQUIRED)
  // ----------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    this.logger.info('Connected to DOM');

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('loader-connected', {
      detail: { type: this.type },
      bubbles: true,
      composed: true
    }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.logger.info('Disconnected from DOM');
  }

  // ----------------------------------------------------------
  // BLOCK 7: PUBLIC METHODS (REQUIRED FOR DISPLAY)
  // ----------------------------------------------------------

  /**
   * Show the loader
   * @public
   */
  show() {
    this.logger.debug('Showing loader');
    this.hidden = false;
    this.dispatchEvent(new CustomEvent('loader-show', {
      detail: { type: this.type },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Hide the loader
   * @public
   */
  hide() {
    this.logger.debug('Hiding loader');
    this.hidden = true;
    this.dispatchEvent(new CustomEvent('loader-hide', {
      detail: { type: this.type },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Toggle loader visibility
   * @public
   */
  toggle() {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Set spinner type
   * @public
   * @param {string} type - The spinner type to use
   */
  setType(type) {
    if (TLoaderLit.spinnerTypes.includes(type)) {
      this.type = type;
      this.logger.debug('Type changed', { type });
    } else {
      this.logger.warn('Invalid spinner type', { type });
    }
  }

  /**
   * Get list of available spinner types
   * @public
   * @returns {string[]} Array of available spinner types
   */
  getAvailableTypes() {
    return [...TLoaderLit.spinnerTypes];
  }

  /**
   * Set loading text
   * @public
   * @param {string} text - The loading text to display
   */
  setText(text) {
    this.text = text;
    this.logger.debug('Text updated', { text });
  }

  // ----------------------------------------------------------
  // BLOCK 12: STATIC REGISTRATION (REQUIRED)
  // ----------------------------------------------------------
  static {
    // Self-registration
    customElements.define(this.tagName, this);
  }

  // ----------------------------------------------------------
  // BLOCK 13: EXPORTS (REQUIRED)
  // ----------------------------------------------------------
}

// Export as default and named
export default TLoaderLit;

// Terminal-specific re-export
export const TerminalLoader = TLoaderLit;
