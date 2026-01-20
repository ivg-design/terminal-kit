import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';

/**
 * @component TButtonLit
 * @tagname t-btn
 * @description Terminal-styled button component with variants, loading states, and toggle functionality. Supports multiple button types (text, icon, icon-text), sizes, variants, and includes built-in loading indicators.
 * @category Form Controls
 * @since 1.0.0
 * @example
 * <t-btn variant="primary">Click Me</t-btn>
 * @example
 * <t-btn variant="toggle" icon-on="<svg>...</svg>" icon-off="<svg>...</svg>">Toggle</t-btn>
 * @example
 * <t-btn type="icon" icon="<svg>...</svg>" size="large"></t-btn>
 */
export class TButton extends LitElement {
  // ============================================================
  // BLOCK 1: STATIC METADATA
  // ============================================================
  static tagName = 't-btn';
  static version = '1.0.0';
  static category = 'Form Controls';

  // ============================================================
  // BLOCK 2: STATIC STYLES
  // ============================================================
  static styles = css`
    :host {
      --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
      --terminal-green: var(--tk-green, #00ff41);
      --terminal-green-bright: var(--tk-green-bright, #33ff66);
      --terminal-green-dim: var(--tk-green-dim, #00cc33);
      --terminal-green-dark: var(--tk-green-dark, #008820);
      --terminal-green-glow: var(--tk-green-glow, rgba(0, 255, 65, 0.5));
      --terminal-gray-dark: #242424;
      --terminal-gray-light: #333333;
      --terminal-gray: #808080;
      --spacing-md: 12px;
      --spacing-sm: 8px;
      --font-size-sm: 11px;
    }
    :host {
      display: inline-flex;
      vertical-align: middle;
      height: 28px;
      line-height: 28px;
      --toggle-color-off: var(--terminal-green-dim, #00cc33);
      --toggle-color-on: var(--terminal-green, #00ff41);
      --toggle-bg-hover-off: rgba(0, 255, 65, 0.1);
      --toggle-bg-on: rgba(0, 255, 65, 0.2);
      --toggle-bg-hover-on: rgba(0, 255, 65, 0.3);
      --toggle-shadow-on: rgba(0, 255, 65, 0.3);
      --toggle-shadow-hover-on: rgba(0, 255, 65, 0.5);
    }

    :host([size="xs"]) {
      height: 16px;
      line-height: 16px;
    }

    :host([size="small"]),
    :host([size="sm"]) {
      height: 20px;
      line-height: 20px;
    }

    :host([size="large"]),
    :host([size="lg"]) {
      height: 36px;
      line-height: 36px;
    }

    .t-btn {
      height: 100%;
      width: 100%;
      padding: 0 var(--spacing-md);
      background: var(--terminal-gray-dark, #242424);
      color: var(--terminal-green, #00ff41);
      border: 1px solid var(--terminal-gray-light, #333333);
      font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
      font-size: var(--font-size-sm, 11px);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md, 12px);
      white-space: nowrap;
      transition: all 0.2s ease;
      border-radius: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      user-select: none;
      position: relative;
      overflow: hidden;
    }

    .t-btn:hover:not(:disabled) {
      background: var(--terminal-gray, #808080);
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn:active:not(:disabled) {
      transform: translateY(1px);
    }

    .t-btn:focus {
      outline: none;
    }

    .t-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .t-btn--primary {
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn--primary:hover:not(:disabled) {
      background: var(--terminal-green-dark, #008820);
      color: white;
      border-color: var(--terminal-green, #00ff41);
      box-shadow: none;
    }

    .t-btn--secondary {
      background: transparent;
      border-color: var(--terminal-green-dark, #009929);
    }

    .t-btn--secondary:hover:not(:disabled) {
      background: transparent;
      color: white;
      border-color: var(--terminal-green, #00ff41);
      box-shadow: 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.5)),
                  inset 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.1));
    }

    .t-btn--danger {
      background: var(--terminal-red-glow, rgba(255, 0, 65, 0.2));
      color: var(--terminal-gray, #808080);
      border-color: var(--terminal-red, rgba(255, 0, 65, 0.4));
    }

    .t-btn--danger:hover:not(:disabled),
    .t-btn--danger:active:not(:disabled) {
      background: var(--terminal-red, #ff0041);
      color: white;
      border-color: var(--terminal-red, #ff0041);
    }

    .t-btn--warning {
      background: var(--terminal-yellow-glow, rgba(255, 204, 0, 0.2));
      color: var(--terminal-yellow, #ffcc00);
      border-color: var(--terminal-yellow, rgba(255, 204, 0, 0.4));
    }

    .t-btn--warning:hover:not(:disabled) {
      background: var(--terminal-yellow, #ffcc00);
      color: var(--terminal-black, #0a0a0a);
      border-color: var(--terminal-yellow, #ffcc00);
    }

    .t-btn--info {
      background: var(--terminal-blue-glow, rgba(0, 204, 255, 0.2));
      color: var(--terminal-blue, #00ccff);
      border-color: var(--terminal-blue, rgba(0, 204, 255, 0.4));
    }

    .t-btn--info:hover:not(:disabled) {
      background: var(--terminal-blue, #00ccff);
      color: white;
      border-color: var(--terminal-blue, #00ccff);
    }

    .t-btn--success {
      background: var(--terminal-green-glow, rgba(0, 255, 65, 0.2));
      color: var(--terminal-green-bright, #00ff66);
      border-color: var(--terminal-green, rgba(0, 255, 65, 0.4));
    }

    .t-btn--success:hover:not(:disabled) {
      background: var(--terminal-green, #00ff41);
      color: var(--terminal-black, #0a0a0a);
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn--icon-text {
      padding: 0 var(--spacing-md);
    }

    .t-btn--icon {
      width: 28px;
      padding: 0;
      justify-content: center;
    }

    .t-btn--icon.t-btn--sm,
    .t-btn--icon.t-btn--small {
      width: 20px;
      padding: 0;
    }

    .t-btn--icon.t-btn--xs {
      width: 16px;
      padding: 0;
    }

    .t-btn--icon.t-btn--lg,
    .t-btn--icon.t-btn--large {
      width: 36px;
      padding: 0;
    }

    .t-btn--xs {
      height: 100%;
      min-width: 16px;
      padding: 0;
      border: none !important;
      background: transparent !important;
      font-size: 10px;
    }

    .t-btn--xs:hover:not(:disabled) {
      background: transparent !important;
      border: none !important;
      color: var(--terminal-green-bright, #00ff66);
    }

    .t-btn--xs .t-btn__text {
      display: none;
    }

    .t-btn--sm,
    .t-btn--small {
      height: 100%;
      min-width: 20px;
      padding: 0 8px;
      font-size: 10px;
    }

    .t-btn--lg,
    .t-btn--large {
      height: 100%;
      padding: 0 20px;
      font-size: 13px;
    }

    .t-btn.is-loading {
      pointer-events: none;
      position: relative;
      opacity: 1 !important;
      color: var(--terminal-green, #00ff41) !important;
    }

    .t-btn.is-loading:not(.t-btn--xs) {
      border-color: var(--terminal-green, #00ff41) !important;
    }

    .t-btn--toggle {
      transition: all 0.3s ease;
    }

    .t-btn--toggle.t-btn--primary.is-off {
      color: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
      background: transparent;
    }

    .t-btn--toggle.t-btn--primary.is-off:hover:not(:disabled) {
      background: var(--terminal-green-dark, #008820);
      color: white;
      border-color: var(--terminal-green, #00ff41);
      box-shadow: none;
    }

    .t-btn--toggle.t-btn--primary.is-on {
      color: white;
      border-color: var(--terminal-green, #00ff41);
      background: var(--terminal-green-dark, #008820);
      box-shadow: none;
    }

    .t-btn--toggle.t-btn--primary.is-on:hover:not(:disabled) {
      color: white;
      border-color: var(--terminal-green-bright, #00ff66);
      background: #006618;
      box-shadow: none;
    }

    .t-btn--toggle.t-btn--secondary.is-off {
      color: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green-dark, #009929);
      background: transparent;
    }

    .t-btn--toggle.t-btn--secondary.is-off:hover:not(:disabled) {
      background: transparent;
      color: white;
      border-color: var(--terminal-green, #00ff41);
      box-shadow: 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.5)),
                  inset 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.1));
    }

    .t-btn--toggle.t-btn--secondary.is-on {
      color: white;
      border-color: var(--terminal-green, #00ff41);
      background: transparent;
      box-shadow: 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.5)),
                  inset 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.1));
    }

    .t-btn--toggle.t-btn--secondary.is-on:hover:not(:disabled) {
      color: white;
      border-color: var(--terminal-green-bright, #00ff66);
      background: transparent;
      box-shadow: 0 0 30px var(--terminal-green-glow, rgba(0, 255, 65, 0.7)),
                  inset 0 0 30px var(--terminal-green-glow, rgba(0, 255, 65, 0.2));
    }

    .t-btn--toggle.t-btn--custom.is-off {
      color: var(--toggle-color-off);
      border-color: var(--toggle-color-off);
      background: transparent;
    }

    .t-btn--toggle.t-btn--custom.is-off:hover:not(:disabled) {
      color: var(--toggle-text-hover-off, black);
      border-color: var(--toggle-color-off);
      background: var(--toggle-color-off);
      box-shadow: 0 0 5px var(--toggle-shadow-off);
    }

    .t-btn--toggle.t-btn--custom.is-on {
      color: white;
      border-color: var(--toggle-color-on);
      background: var(--toggle-color-on);
      box-shadow: none;
    }

    .t-btn--toggle.t-btn--custom.is-on:hover:not(:disabled) {
      color: white;
      border-color: var(--toggle-color-on);
      background: var(--toggle-bg-hover-on);
      box-shadow: 0 0 5px var(--toggle-shadow-hover-on);
    }

    svg {
      fill: currentColor;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      display: block;
      vertical-align: middle;
    }

    .t-btn--xs svg {
      width: 12px;
      height: 12px;
    }

    .t-btn--sm svg,
    .t-btn--small svg {
      width: 14px;
      height: 14px;
    }

    .t-btn--lg svg,
    .t-btn--large svg {
      width: 20px;
      height: 20px;
    }

    .t-btn__text {
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
    }

    .t-btn span:first-child:has(svg) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off {
      background: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off svg {
      fill: var(--terminal-black, #0a0a0a);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off:hover:not(:disabled) {
      background: var(--terminal-green-bright, #00ff66);
      border-color: var(--terminal-green-bright, #00ff66);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off:hover:not(:disabled) svg {
      fill: var(--terminal-black, #0a0a0a);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-on {
      background: transparent;
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-on svg {
      fill: var(--terminal-green, #00ff41);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-on:hover:not(:disabled) {
      background: var(--terminal-green-dark, #008820);
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-on:hover:not(:disabled) svg {
      fill: white;
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-off {
      background: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
      box-shadow: 0 0 15px var(--terminal-green-glow, rgba(0, 255, 65, 0.4));
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-off svg {
      fill: var(--terminal-black, #0a0a0a);
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-off:hover:not(:disabled) {
      background: var(--terminal-green-bright, #00ff66);
      border-color: var(--terminal-green-bright, #00ff66);
      box-shadow: 0 0 25px var(--terminal-green-glow, rgba(0, 255, 65, 0.6));
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-off:hover:not(:disabled) svg {
      fill: var(--terminal-black, #0a0a0a);
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-on {
      background: transparent;
      border-color: var(--terminal-green-dark, #009929);
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-on svg {
      fill: var(--terminal-green, #00ff41);
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-on:hover:not(:disabled) {
      background: transparent;
      border-color: var(--terminal-green, #00ff41);
      box-shadow: 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.5)),
                  inset 0 0 20px var(--terminal-green-glow, rgba(0, 255, 65, 0.1));
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-on:hover:not(:disabled) svg {
      fill: white;
    }

    .btn-loader {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-loader-spinner {
      color: var(--loader-color, var(--terminal-green, #00ff41));
      font-size: 12px;
      text-indent: -9999em;
      overflow: hidden;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      display: block;
      animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
    }

    .btn-loader-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .btn-loader-dots .btn-dot {
      width: 3px;
      height: 3px;
      background-color: var(--loader-color, var(--terminal-green, #00ff41));
      animation: dot-bounce 1.4s ease-in-out infinite both;
    }

    .btn-loader-dots .btn-dot-1 { animation-delay: -0.32s; }
    .btn-loader-dots .btn-dot-2 { animation-delay: -0.16s; }
    .btn-loader-dots .btn-dot-3 { animation-delay: 0s; }

    .btn-loader-bars {
      display: flex;
      gap: 2px;
      align-items: flex-end;
    }

    .btn-loader-bars .btn-bar {
      width: 2px;
      height: 6px;
      background-color: var(--loader-color, var(--terminal-green, #00ff41));
      animation: bar-bounce 1.2s ease-in-out infinite;
    }

    .btn-loader-bars .btn-bar-1 { animation-delay: -0.9s; }
    .btn-loader-bars .btn-bar-2 { animation-delay: -0.7s; }
    .btn-loader-bars .btn-bar-3 { animation-delay: -0.5s; }
    .btn-loader-bars .btn-bar-4 { animation-delay: -0.3s; }
    .btn-loader-bars .btn-bar-5 { animation-delay: -0.1s; }

    @keyframes mltShdSpin {
      0% {
        box-shadow: 0 -0.83em 0 -0.4em,
        0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      5%, 95% {
        box-shadow: 0 -0.83em 0 -0.4em,
        0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      10%, 59% {
        box-shadow: 0 -0.83em 0 -0.4em,
        -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em,
        -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
      }
      20% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
        -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
        -0.749em -0.34em 0 -0.477em;
      }
      38% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
        -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
        -0.82em -0.09em 0 -0.477em;
      }
      100% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em,
        0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
    }

    @keyframes round {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }

    @keyframes dot-bounce {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes bar-bounce {
      0%, 40%, 100% {
        transform: scaleY(0.4);
        opacity: 0.6;
      }
      20% {
        transform: scaleY(1);
        opacity: 1;
      }
    }
  `;

  // ============================================================
  // BLOCK 3: REACTIVE PROPERTIES
  // ============================================================

  /**
   * @property {('primary'|'secondary'|'danger'|'success'|'warning'|'info'|'toggle')} variant - Button visual variant
   * @default 'primary'
   * @attribute variant
   * @reflects true
   * @example
   * <t-btn variant="danger">Delete</t-btn>
   */
  /**
   * @property {('text'|'icon'|'icon-text')} type - Button content type
   * @default 'text'
   * @attribute type
   * @reflects true
   * @example
   * <t-btn type="icon" icon="<svg>...</svg>"></t-btn>
   */
  /**
   * @property {string} size - Button size (xs, small, medium, large, or empty string for default)
   * @default ''
   * @attribute size
   * @reflects true
   * @example
   * <t-btn size="large">Big Button</t-btn>
   */
  /**
   * @property {boolean} disabled - Disable button interactions
   * @default false
   * @attribute disabled
   * @reflects true
   * @example
   * <t-btn disabled>Can't Click</t-btn>
   */
  /**
   * @property {string} icon - SVG icon content for the button
   * @default ''
   * @attribute icon
   * @example
   * <t-btn icon="<svg>...</svg>">Button</t-btn>
   */
  /**
   * @property {boolean} loading - Show loading indicator
   * @default false
   * @attribute loading
   * @reflects true
   * @example
   * <t-btn loading>Processing...</t-btn>
   */
  /**
   * @property {('spinner'|'dots'|'bars')} loaderType - Type of loading indicator
   * @default 'spinner'
   * @attribute loader-type
   * @example
   * <t-btn loading loader-type="dots">Loading</t-btn>
   */
  /**
   * @property {string} loaderColor - Custom color for loader (CSS color value)
   * @default ''
   * @attribute loader-color
   * @example
   * <t-btn loading loader-color="#ff0000">Loading</t-btn>
   */
  /**
   * @property {boolean} toggleState - Current state for toggle variant
   * @default false
   * @attribute toggle-state
   * @reflects true
   * @example
   * <t-btn variant="toggle" toggle-state="true">On</t-btn>
   */
  /**
   * @property {string} iconOn - Icon to show when toggle is ON
   * @default ''
   * @attribute icon-on
   * @example
   * <t-btn variant="toggle" icon-on="<svg>...</svg>" icon-off="<svg>...</svg>">Toggle</t-btn>
   */
  /**
   * @property {string} iconOff - Icon to show when toggle is OFF
   * @default ''
   * @attribute icon-off
   * @example
   * <t-btn variant="toggle" icon-on="<svg>...</svg>" icon-off="<svg>...</svg>">Toggle</t-btn>
   */
  /**
   * @property {string} colorOn - Custom color when toggle is ON
   * @default ''
   * @attribute color-on
   * @example
   * <t-btn variant="toggle" color-on="#00ff00" color-off="#ff0000">Toggle</t-btn>
   */
  /**
   * @property {string} colorOff - Custom color when toggle is OFF
   * @default ''
   * @attribute color-off
   * @example
   * <t-btn variant="toggle" color-on="#00ff00" color-off="#ff0000">Toggle</t-btn>
   */
  /**
   * @property {string} textOn - Text to show when toggle is ON
   * @default ''
   * @attribute text-on
   * @example
   * <t-btn variant="toggle" text-on="Enabled" text-off="Disabled">Toggle</t-btn>
   */
  /**
   * @property {string} textOff - Text to show when toggle is OFF
   * @default ''
   * @attribute text-off
   * @example
   * <t-btn variant="toggle" text-on="Enabled" text-off="Disabled">Toggle</t-btn>
   */
  static properties = {
    variant: { type: String, reflect: true },
    type: { type: String, reflect: true },
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    icon: { type: String },
    loading: { type: Boolean, reflect: true },
    loaderType: { type: String, attribute: 'loader-type' },
    loaderColor: { type: String, attribute: 'loader-color' },
    toggleState: { type: Boolean, attribute: 'toggle-state', reflect: true },
    iconOn: { type: String, attribute: 'icon-on' },
    iconOff: { type: String, attribute: 'icon-off' },
    colorOn: { type: String, attribute: 'color-on' },
    colorOff: { type: String, attribute: 'color-off' },
    textOn: { type: String, attribute: 'text-on' },
    textOff: { type: String, attribute: 'text-off' }
  };

  // ============================================================
  // BLOCK 4: INTERNAL STATE
  // ============================================================

  /**
   * @private
   * @type {string}
   */
  _icon = '';

  /**
   * @private
   * @type {string|null}
   */
  _fixedWidth = null;

  /**
   * @private
   * @type {string|null}
   */
  _originalContent = null;

  /**
   * @private
   * @type {string|null}
   */
  _preLoadingWidth = null;

  // ============================================================
  // BLOCK 5: LOGGER INSTANCE
  // ============================================================

  /**
   * @private
   * @type {Object}
   */
  _logger = componentLogger.for('TButton');

  // ============================================================
  // BLOCK 6: CONSTRUCTOR
  // ============================================================

  constructor() {
    super();

    this._logger.debug('Component constructed');

    this.variant = 'primary';
    this.type = 'text';
    this.size = 'default';
    this.disabled = false;
    this.icon = '';
    this.loading = false;
    this.loaderType = 'spinner';
    this.loaderColor = '';
    this.toggleState = false;
    this.iconOn = '';
    this.iconOff = '';
    this.colorOn = '';
    this.colorOff = '';
    this.textOn = '';
    this.textOff = '';
  }

  // ============================================================
  // BLOCK 7: LIFECYCLE METHODS
  // ============================================================

  /**
   * Called when component is connected to DOM
   * @lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected to DOM');

    if (this.icon) {
      this._icon = this.icon;
    }
    this._applyCustomColors();
    this._updateFixedWidth();
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
   * Called before component updates
   * @lifecycle
   * @param {Map} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('loading')) {
      const wasLoading = changedProperties.get('loading');

      if (this.loading && !wasLoading && this.variant !== 'toggle') {
        const button = this.shadowRoot?.querySelector('.t-btn');
        if (button) {
          this._fixedWidth = `${button.offsetWidth}px`;
        }
      }
      else if (!this.loading && wasLoading && this.variant !== 'toggle') {
        this._fixedWidth = null;
      }
    }
  }

  /**
   * Called after component updates
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    this._logger.trace('Updated', {
      changedProperties: Array.from(changedProperties.keys())
    });

    if (changedProperties.has('variant') || changedProperties.has('textOn') ||
        changedProperties.has('textOff') || changedProperties.has('size')) {
      this._updateFixedWidth();
    }

    if (changedProperties.has('colorOn') || changedProperties.has('colorOff')) {
      if (!this.colorOff) {
        this.style.removeProperty('--toggle-color-off');
      }
      if (!this.colorOn) {
        this.style.removeProperty('--toggle-color-on');
        this.style.removeProperty('--toggle-bg-on');
        this.style.removeProperty('--toggle-bg-hover-on');
        this.style.removeProperty('--toggle-shadow-on');
        this.style.removeProperty('--toggle-shadow-hover-on');
        this.style.removeProperty('--toggle-bg-hover-off');
      } else {
        this._applyCustomColors();
      }
    }

    if (this.variant === 'toggle') {
      if (changedProperties.has('toggleState') || changedProperties.has('iconOn') || changedProperties.has('iconOff')) {
        if (this.iconOn && this.iconOff) {
          const newIcon = this.toggleState ? this.iconOn : this.iconOff;
          if (this._icon !== newIcon) {
            this._icon = newIcon;
            this.requestUpdate();
          }
        }
      }
    }
  }

  // ============================================================
  // BLOCK 8: PUBLIC API METHODS
  // ============================================================

  /**
   * Programmatically click the button
   * @public
   * @returns {void}
   * @fires TButton#button-click
   * @example
   * button.click();
   */
  click() {
    this._logger.debug('click called');
    const btn = this.shadowRoot.querySelector('.t-btn');
    if (btn && !this.disabled && !this.loading) {
      btn.click();
    }
  }

  /**
   * Focus the button
   * @public
   * @returns {void}
   * @example
   * button.focus();
   */
  focus() {
    this._logger.debug('focus called');
    const btn = this.shadowRoot.querySelector('.t-btn');
    if (btn) {
      btn.focus();
    }
  }

  /**
   * Blur the button
   * @public
   * @returns {void}
   * @example
   * button.blur();
   */
  blur() {
    this._logger.debug('blur called');
    const btn = this.shadowRoot.querySelector('.t-btn');
    if (btn) {
      btn.blur();
    }
  }

  /**
   * Set the button icon
   * @public
   * @param {string} iconSvg - SVG icon markup
   * @returns {void}
   * @example
   * button.setIcon('<svg>...</svg>');
   */
  setIcon(iconSvg) {
    this._logger.debug('setIcon called', { iconSvg });
    this._icon = iconSvg;
    this.requestUpdate();
  }

  /**
   * Set the button text
   * @public
   * @param {string} text - Button text content
   * @returns {void}
   * @example
   * button.setText('New Text');
   */
  setText(text) {
    this._logger.debug('setText called', { text });
    this.innerHTML = text;
  }

  /**
   * Set the loading state
   * @public
   * @param {boolean} loading - Loading state
   * @returns {void}
   * @example
   * button.setLoading(true);
   */
  setLoading(loading) {
    this._logger.debug('setLoading called', { loading });
    if (!this.loading && loading && this.variant !== 'toggle') {
      const button = this.shadowRoot?.querySelector('.t-btn');
      if (button) {
        this._preLoadingWidth = button.getBoundingClientRect().width;
      }
    }
    this.loading = loading;
  }

  // ============================================================
  // BLOCK 9: EVENT EMITTERS
  // ============================================================

  /**
   * Emit custom event
   * @private
   * @param {string} name - Event name
   * @param {Object} detail - Event detail object
   * @returns {void}
   */
  _emitEvent(name, detail = {}) {
    this._logger.debug('Emitting event', { name, detail });
    const event = new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  /**
   * @event TButton#button-click
   * @type {CustomEvent<{button: HTMLElement}>}
   * @description Fired when button is clicked
   * @property {HTMLElement} detail.button - Button element that was clicked
   * @bubbles true
   * @composed true
   * @example
   * button.addEventListener('button-click', (e) => {
   *   console.log('Clicked:', e.detail.button);
   * });
   */

  /**
   * @event TButton#toggle-change
   * @type {CustomEvent<{state: boolean}>}
   * @description Fired when toggle state changes
   * @property {boolean} detail.state - New toggle state
   * @bubbles true
   * @composed true
   * @example
   * button.addEventListener('toggle-change', (e) => {
   *   console.log('Toggle state:', e.detail.state);
   * });
   */

  // ============================================================
  // BLOCK 12: RENDER METHOD
  // ============================================================

  /**
   * Render component template
   * @returns {TemplateResult}
   * @slot - Default slot for button text content
   */
  render() {
    this._logger.trace('Rendering');

    const classes = this._getButtonClasses();

    const buttonStyles = {};
    if (this._fixedWidth) {
      buttonStyles.minWidth = this._fixedWidth;
      buttonStyles.width = this._fixedWidth;
    }

    return html`
      <button
        class=${classes}
        style=${Object.entries(buttonStyles).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}
        ?disabled=${this.disabled || this.loading}
        @click=${this._handleClick}
      >
        ${this.loading ? this._renderLoader() : this._renderContent()}
      </button>
    `;
  }

  // ============================================================
  // BLOCK 13: PRIVATE HELPERS
  // ============================================================

  /**
   * @private
   */
  _applyCustomColors() {
    if (this.colorOff) {
      this.style.setProperty('--toggle-color-off', this.colorOff);
      const colorOffRgb = this._hexToRgb(this.colorOff);
      if (colorOffRgb) {
        const brightness = (colorOffRgb.r * 299 + colorOffRgb.g * 587 + colorOffRgb.b * 114) / 1000;
        this.style.setProperty('--toggle-text-hover-off', brightness > 128 ? 'black' : 'white');
        this.style.setProperty('--toggle-bg-hover-off', `rgba(${colorOffRgb.r}, ${colorOffRgb.g}, ${colorOffRgb.b}, 0.2)`);
        this.style.setProperty('--toggle-shadow-off', `rgba(${colorOffRgb.r}, ${colorOffRgb.g}, ${colorOffRgb.b}, 0.3)`);
      }
    }

    if (this.colorOn) {
      this.style.setProperty('--toggle-color-on', this.colorOn);
      const colorOnRgb = this._hexToRgb(this.colorOn);
      if (colorOnRgb) {
        this.style.setProperty('--toggle-bg-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.2)`);
        this.style.setProperty('--toggle-bg-hover-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.3)`);
        this.style.setProperty('--toggle-shadow-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.3)`);
        this.style.setProperty('--toggle-shadow-hover-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.5)`);
      }
    }
  }

  /**
   * @private
   */
  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * @private
   */
  _calculateMaxTextWidth() {
    if (this.variant !== 'toggle' || !this.textOn || !this.textOff) {
      return null;
    }

    const measurer = document.createElement('span');
    measurer.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
      font-size: ${this.size === 'large' || this.size === 'lg' ? '13px' :
                   this.size === 'small' || this.size === 'sm' ? '10px' : '11px'};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 var(--spacing-md, 12px);
    `;
    document.body.appendChild(measurer);

    measurer.textContent = this.textOff;
    const offWidth = measurer.offsetWidth;

    measurer.textContent = this.textOn;
    const onWidth = measurer.offsetWidth;

    document.body.removeChild(measurer);

    const padding = this.size === 'large' || this.size === 'lg' ? 40 :
                    this.size === 'small' || this.size === 'sm' ? 16 : 24;

    return Math.max(offWidth, onWidth) + padding;
  }

  /**
   * @private
   */
  _updateFixedWidth() {
    if (this.variant === 'toggle' && (this.textOn || this.textOff)) {
      const maxWidth = this._calculateMaxTextWidth();
      if (maxWidth) {
        this._fixedWidth = `${maxWidth}px`;
      }
    }
  }

  /**
   * @private
   */
  _getButtonClasses() {
    const classes = ['t-btn'];

    if (this.variant) {
      classes.push(`t-btn--${this.variant}`);

      if (this.variant === 'toggle') {
        if (this.colorOn || this.colorOff) {
          classes.push('t-btn--custom');
        } else {
          const toggleVariant = this.getAttribute('toggle-variant') || 'primary';
          classes.push(`t-btn--${toggleVariant}`);
        }
      }
    }

    if (this.type) {
      classes.push(`t-btn--${this.type}`);
    }

    if (this.size && this.size !== 'default') {
      classes.push(`t-btn--${this.size}`);
    }

    if (this.loading) {
      classes.push('is-loading');
    }

    if (this.variant === 'toggle') {
      classes.push(this.toggleState ? 'is-on' : 'is-off');
    }

    return classes.join(' ');
  }

  /**
   * @private
   */
  _renderContent() {
    if (this.size === 'xs' && this._icon) {
      return html`<span .innerHTML=${this._icon}></span>`;
    }

    if (this.type === 'icon' && this._icon) {
      return html`<span .innerHTML=${this._icon}></span>`;
    }

    if (this.type === 'icon-text' && this._icon) {
      return html`
        <span .innerHTML=${this._icon}></span>
        <span class="t-btn__text">${this._getToggleText()}</span>
      `;
    }

    if (this.variant === 'toggle' && this._icon && this.type === 'icon') {
      return html`<span .innerHTML=${this._icon}></span>`;
    }

    return html`${this._getToggleText()}`;
  }

  /**
   * @private
   */
  _getToggleText() {
    if (this.variant === 'toggle' && (this.textOn || this.textOff)) {
      return this.toggleState
        ? (this.textOn || html`<slot></slot>`)
        : (this.textOff || html`<slot></slot>`);
    }
    return html`<slot></slot>`;
  }

  /**
   * @private
   */
  _renderLoader() {
    switch (this.loaderType) {
      case 'dots':
        return html`
          <div class="btn-loader btn-loader-dots">
            <div class="btn-dot btn-dot-1"></div>
            <div class="btn-dot btn-dot-2"></div>
            <div class="btn-dot btn-dot-3"></div>
          </div>
        `;
      case 'bars':
        return html`
          <div class="btn-loader btn-loader-bars">
            <div class="btn-bar btn-bar-1"></div>
            <div class="btn-bar btn-bar-2"></div>
            <div class="btn-bar btn-bar-3"></div>
            <div class="btn-bar btn-bar-4"></div>
            <div class="btn-bar btn-bar-5"></div>
          </div>
        `;
      case 'spinner':
      default:
        return html`<div class="btn-loader btn-loader-spinner"></div>`;
    }
  }

  /**
   * @private
   */
  _handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    this._logger.debug('Button clicked');

    this._emitEvent('button-click', { button: e.target });

    if (this.variant === 'toggle') {
      this.toggleState = !this.toggleState;
      this._emitEvent('toggle-change', { state: this.toggleState });
    }
  }
}

customElements.define('t-btn', TButton);

export const TButtonManifest = generateManifest(TButton, {
  tagName: 't-btn',
  displayName: 'Button',
  description: 'Terminal-styled button component with variants, loading states, and toggle functionality. Supports multiple button types (text, icon, icon-text), sizes, variants, and includes built-in loading indicators.',
  version: '1.0.0',
  category: 'Form Controls',
  methods: {
    click: {
      description: 'Programmatically click the button',
      parameters: [],
      returns: 'void'
    },
    focus: {
      description: 'Focus the button',
      parameters: [],
      returns: 'void'
    },
    blur: {
      description: 'Blur the button',
      parameters: [],
      returns: 'void'
    },
    setIcon: {
      description: 'Set the button icon',
      parameters: [{ name: 'iconSvg', type: 'string', description: 'SVG icon markup' }],
      returns: 'void'
    },
    setText: {
      description: 'Set the button text',
      parameters: [{ name: 'text', type: 'string', description: 'Button text content' }],
      returns: 'void'
    },
    setLoading: {
      description: 'Set the loading state',
      parameters: [{ name: 'loading', type: 'boolean', description: 'Loading state' }],
      returns: 'void'
    }
  },
  events: {
    'button-click': {
      detail: '{button: HTMLElement}',
      description: 'Fired when button is clicked'
    },
    'toggle-change': {
      detail: '{state: boolean}',
      description: 'Fired when toggle state changes'
    }
  },
  slots: {
    '': {
      description: 'Default slot for button text content'
    }
  }
});

export default TButton;
