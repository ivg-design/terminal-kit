// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';

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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm, 12px);
      padding: var(--spacing-md, 16px);
    }

    /* Spinner container */
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Apply terminal styling to all spinner components */
    .spinner-container > * {
      --color: var(--loader-color);
      --size: var(--loader-size);
      --duration: var(--loader-duration);
    }

    /* Spinner-specific size fixes */
    /* These spinners have internal elements that don't respect the size property correctly */

    /* Breeding rhombus spinner - has absolutely positioned children */
    breeding-rhombus-spinner {
      transform: scale(0.5);
    }

    /* Looping rhombuses - renders much larger */
    looping-rhombuses-spinner {
      transform: scale(0.3);
    }

    /* Intersecting circles - needs scaling */
    intersecting-circles-spinner {
      transform: scale(0.6);
    }

    /* Circles to rhombuses - large animation area */
    circles-to-rhombuses-spinner {
      transform: scale(0.25);
    }

    /* Fulfilling bouncing circle - bounces outside bounds */
    fulfilling-bouncing-circle-spinner {
      transform: scale(0.75);
    }

    /* Self building square - builds outside original size */
    self-building-square-spinner {
      transform: scale(0.2);
    }

    /* Swapping squares - swaps in larger area */
    swapping-squares-spinner {
      transform: scale(0.8);
    }

    /* Trinity rings - rings extend beyond size */
    trinity-rings-spinner {
      transform: scale(0.75);
    }

    /* Hollow dots - dots positioned outside */
    hollow-dots-spinner {
      transform: scale(0.35);
    }

    /* Scaling squares - scales beyond bounds */
    scaling-squares-spinner {
      transform: scale(0.7);
    }

    /* Pixel spinner - pixels spread out */
    pixel-spinner {
      transform: scale(0.85);
    }

    /* Grid spinner (React) - grid is too large */
    grid-spinner {
      transform: scale(0.325);
    }

    /* Propagate spinner - propagates wide */
    propagate-spinner {
      transform: scale(0.42);
    }

    /* Pacman spinner - mouth opens wide */
    pacman-spinner {
      transform: scale(0.325) translateX(-15%);
    }

    /* Sync spinner - circles spread out */
    sync-spinner {
      transform: scale(0.45);
    }

    /* Flower spinner - petals extend */
    flower-spinner {
      transform: scale(0.85);
    }

    /* Spring spinner - springs outward */
    spring-spinner {
      transform: scale(0.8);
    }

    /* Atom spinner - electrons orbit wide */
    atom-spinner {
      transform: scale(1.0);
    }

    /* Fingerprint spinner - rings are wide */
    fingerprint-spinner {
      transform: scale(1.0);
    }

    /* Radar spinner - sweep is large */
    radar-spinner {
      transform: scale(1.0);
    }

    /* Orbit spinner - orbits extend */
    orbit-spinner {
      transform: scale(1.0);
    }

    /* Half circle spinner */
    half-circle-spinner {
      transform: scale(1.0);
    }

    /* Fulfilling square spinner */
    fulfilling-square-spinner {
      transform: scale(0.8);
    }

    /* Semipolar spinner */
    semipolar-spinner {
      transform: scale(0.95);
    }

    /* Rise spinner - rises too high */
    rise-spinner {
      transform: scale(0.244);
    }

    /* Beat spinner */
    beat-spinner {
      transform: scale(0.375);
    }

    /* Climbing box spinner - climbs outside bounds */
    climbing-box-spinner {
      transform: scale(0.25);
    }

    /* Clip spinner - clips outside */
    clip-spinner {
      transform: scale(0.5);
    }

    /* Rotate spinner - rotates wide */
    rotate-spinner {
      transform: scale(0.4);
    }

    /* Pulse spinner (React) */
    pulse-spinner {
      transform: scale(0.3);
    }

    /* Roller spinner */
    roller-spinner {
      transform: scale(0.85);
    }

    /* Dual ring spinner */
    dual-ring-spinner {
      transform: scale(0.85);
    }

    /* Facebook spinner */
    facebook-spinner {
      transform: scale(0.8);
    }

    /* Hourglass spinner */
    hourglass-spinner {
      transform: scale(0.8);
    }

    /* Ellipsis spinner */
    ellipsis-spinner {
      transform: scale(0.75);
    }

    /* Orbitals spinner */
    orbitals-spinner {
      transform: scale(0.8);
    }

    /* Ouroboro spinner */
    ouroboro-spinner {
      transform: scale(0.85);
    }

    /* Additional spinner adjustments for better sizing */

    /* Circle spinner - needs to be larger */
    circle-spinner {
      transform: scale(0.8);
    }

    /* Dot spinner - needs to be larger */
    dot-spinner {
      transform: scale(0.7);
    }

    /* Fade spinner - needs to be larger */
    fade-spinner {
      transform: scale(0.8);
    }

    /* Hash spinner - needs to be larger */
    hash-spinner {
      transform: scale(0.9);
    }

    /* Moon spinner - needs to be larger */
    moon-spinner {
      transform: scale(0.8);
    }

    /* Ring spinner - needs to be larger */
    ring-spinner {
      transform: scale(0.8);
    }

    /* Scale spinner - needs to be larger */
    scale-spinner {
      transform: scale(0.7);
    }

    /* Skew spinner - needs to be larger */
    skew-spinner {
      transform: scale(0.64);
    }

    /* Square spinner - needs to be larger */
    square-spinner {
      transform: scale(0.64);
    }

    /* Default spinner - needs to be larger */
    default-spinner {
      transform: scale(0.9);
    }

    /* RSC Circle spinner - needs to be larger */
    rsc-circle-spinner {
      transform: scale(0.8);
    }

    /* Heart spinner - needs to be larger */
    heart-spinner {
      transform: scale(0.9);
    }

    /* RSC Ring spinner - needs to be larger */
    rsc-ring-spinner {
      transform: scale(0.85);
    }

    /* Bounce spinner - slightly larger */
    bounce-spinner {
      transform: scale(0.85);
    }

    /* Bar spinner - slightly larger */
    bar-spinner {
      transform: scale(0.8);
    }

    /* Spinner-spinner - needs adjustment */
    spinner-spinner {
      transform: scale(0.8);
    }

    /* Ripple spinner - needs to be larger */
    ripple-spinner {
      transform: scale(0.9);
    }

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
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------

  /**
   * @property {string} type - Spinner type
   * @default 'atom-spinner'
   * @attribute type
   * @reflects true
   */
  /**
   * @property {number} size - Size in pixels
   * @default 60
   * @attribute size
   * @reflects true
   */
  /**
   * @property {string} color - Color value (hex or CSS color)
   * @default '#00ff41'
   * @attribute color
   * @reflects true
   */
  /**
   * @property {number} duration - Animation duration in seconds
   * @default 1
   * @attribute duration
   * @reflects true
   */
  /**
   * @property {string} text - Loading text to display
   * @default ''
   * @attribute text
   * @reflects true
   */
  /**
   * @property {boolean} hidden - Whether loader is hidden
   * @default false
   * @attribute hidden
   * @reflects true
   */
  /**
   * @property {boolean} glow - Whether to show glow effect
   * @default false
   * @attribute glow
   * @reflects true
   */
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
  // BLOCK 4: INTERNAL STATE (REQUIRED)
  // ----------------------------------------------------------

  /** @private */
  _isAnimating = false;

  // ----------------------------------------------------------
  // BLOCK 5: LOGGER INSTANCE (REQUIRED)
  // ----------------------------------------------------------

  /** @private */
  _logger = null;

  // ----------------------------------------------------------
  // BLOCK 6: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  constructor() {
    super();

    // Initialize logger
    this._logger = new componentLogger(TLoaderLit.tagName, this);
    this._logger.debug('Component constructed');

    // Set default property values
    this.type = 'atom-spinner';
    this.size = 60;
    this.color = '#00ff41';
    this.duration = 1;
    this.text = '';
    this.hidden = false;
    this.glow = false;
  }

  // ----------------------------------------------------------
  // BLOCK 7: LIFECYCLE METHODS (REQUIRED - in order)
  // ----------------------------------------------------------

  /**
   * Called when component is connected to DOM
   * @lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected to DOM');
  }

  /**
   * Called when component is disconnected from DOM
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });
  }

  /**
   * Called after every render
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', { changedProperties });
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED FOR DISPLAY)
  // ----------------------------------------------------------

  /**
   * Show the loader
   * @public
   * @fires loader-show
   */
  show() {
    this._logger.debug('show() called');
    this.hidden = false;
    this._emitEvent('loader-show', { type: this.type });
  }

  /**
   * Hide the loader
   * @public
   * @fires loader-hide
   */
  hide() {
    this._logger.debug('hide() called');
    this.hidden = true;
    this._emitEvent('loader-hide', { type: this.type });
  }

  /**
   * Toggle loader visibility
   * @public
   */
  toggle() {
    this._logger.debug('toggle() called');
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
    this._logger.debug('setType() called', { type });
    if (TLoaderLit.spinnerTypes.includes(type)) {
      this.type = type;
    } else {
      this._logger.warn('Invalid spinner type', { type });
    }
  }

  /**
   * Get list of available spinner types
   * @public
   * @returns {string[]} Array of available spinner types
   */
  getAvailableTypes() {
    this._logger.debug('getAvailableTypes() called');
    return [...TLoaderLit.spinnerTypes];
  }

  /**
   * Set loading text
   * @public
   * @param {string} text - The loading text to display
   */
  setText(text) {
    this._logger.debug('setText() called', { text });
    this.text = text;
  }

  // ----------------------------------------------------------
  // BLOCK 9: EVENT EMITTERS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Emit custom event
   * @private
   * @param {string} eventName
   * @param {Object} detail
   */
  _emitEvent(eventName, detail = {}) {
    this._logger.debug('Emitting event', { eventName, detail });

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  /**
   * @event TLoaderLit#loader-show
   * @type {CustomEvent<{type: string}>}
   * @description Fired when loader is shown
   * @property {string} detail.type - Current spinner type
   * @bubbles true
   * @composed true
   */

  /**
   * @event TLoaderLit#loader-hide
   * @type {CustomEvent<{type: string}>}
   * @description Fired when loader is hidden
   * @property {string} detail.type - Current spinner type
   * @bubbles true
   * @composed true
   */

  // ----------------------------------------------------------
  // BLOCK 10: Nesting Support - NOT NEEDED (DISPLAY profile)
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // BLOCK 11: Validation - NOT NEEDED (DISPLAY profile)
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Render component template
   * @returns {TemplateResult}
   */
  render() {
    this._logger.trace('Rendering', {
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

    // Build the HTML string for the custom element
    const spinnerHTML = `<${this.type}
      color="${this.color}"
      size="${this.size}"
      duration="${this.duration}">
    </${this.type}>`;

    return html`
      <div class="loader-wrapper" ?hidden="${this.hidden}">
        <div class="spinner-container ${this.glow ? 'glow' : ''}">
          ${unsafeHTML(spinnerHTML)}
        </div>
        ${this.text ? html`<div class="loader-text">${this.text}</div>` : ''}
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  // No private helpers needed for this component
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TLoaderLit.tagName)) {
  customElements.define(TLoaderLit.tagName, TLoaderLit);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================
export const TLoaderManifest = generateManifest(TLoaderLit, {
  tagName: 't-ldr',
  displayName: 'Loader',
  description: 'Loading indicator with 50+ animation types from wc-spinners library',
  methods: {
    show: {
      description: 'Show the loader',
      params: [],
      returns: 'void'
    },
    hide: {
      description: 'Hide the loader',
      params: [],
      returns: 'void'
    },
    toggle: {
      description: 'Toggle loader visibility',
      params: [],
      returns: 'void'
    },
    setType: {
      description: 'Set spinner type',
      params: [
        { name: 'type', type: 'string', description: 'Spinner type to use' }
      ],
      returns: 'void'
    },
    getAvailableTypes: {
      description: 'Get list of available spinner types',
      params: [],
      returns: 'string[]'
    },
    setText: {
      description: 'Set loading text',
      params: [
        { name: 'text', type: 'string', description: 'Loading text to display' }
      ],
      returns: 'void'
    }
  },
  events: {
    'loader-show': {
      description: 'Fired when loader is shown',
      detail: {
        type: {
          type: 'string',
          description: 'Current spinner type'
        }
      }
    },
    'loader-hide': {
      description: 'Fired when loader is hidden',
      detail: {
        type: {
          type: 'string',
          description: 'Current spinner type'
        }
      }
    }
  }
});

// ============================================================
// SECTION 5: EXPORTS
// ============================================================
export default TLoaderLit;