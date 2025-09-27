import { LitElement, html, css } from 'lit';

/**
 * Terminal Button Component - Built with Lit
 * Zero FOUC, fully encapsulated styles, reactive properties
 */
export class TButton extends LitElement {
  static styles = css`
    :host {
      --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
      --terminal-green: #00ff41;
      --terminal-green-bright: #33ff66;
      --terminal-green-dim: #00cc33;
      --terminal-green-dark: #008820;
      --terminal-gray-dark: #242424;
      --terminal-gray-light: #333333;
      --terminal-gray: #808080;
      --spacing-md: 12px;
      --spacing-sm: 8px;
      --font-size-sm: 11px;
    }
    /* ========================================
       HOST ELEMENT STYLES
       ======================================== */
    :host {
      /* Component inherits CSS variables from page design system */
      display: inline-flex;
      vertical-align: middle;
      height: 28px;
      line-height: 28px;
      /* Default toggle colors */
      --toggle-color-off: var(--terminal-green-dim, #00cc33);
      --toggle-color-on: var(--terminal-green, #00ff41);
      /* Default backgrounds/shadows based on green */
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

    /* ========================================
       BASE BUTTON
       ======================================== */
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

    /* ========================================
       BUTTON VARIANTS
       ======================================== */
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

    /* ========================================
       BUTTON TYPES
       ======================================== */
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

    /* ========================================
       BUTTON SIZES
       ======================================== */
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

    /* XS buttons can only be icon-only */
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

    /* ========================================
       LOADING STATE
       ======================================== */
    .t-btn.is-loading {
      pointer-events: none;
      position: relative;
      /* Maintain full visibility during loading */
      opacity: 1 !important;
      color: var(--terminal-green, #00ff41) !important;
    }

    .t-btn.is-loading:not(.t-btn--xs) {
      border-color: var(--terminal-green, #00ff41) !important;
    }

    /* ========================================
       TOGGLE BUTTON
       ======================================== */
    .t-btn--toggle {
      transition: all 0.3s ease;
    }

    /* Primary toggle (clean like primary button) */
    .t-btn--toggle.t-btn--primary.is-off {
      color: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
      background: transparent;
    }

    .t-btn--toggle.t-btn--primary.is-off:hover:not(:disabled) {
      /* Like primary button hover */
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
      /* Darker green on hover when ON */
      color: white;
      border-color: var(--terminal-green-bright, #00ff66);
      background: #006618;
      box-shadow: none;
    }

    /* Secondary toggle (subtle theme like secondary button) */
    .t-btn--toggle.t-btn--secondary.is-off {
      color: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green-dark, #009929);
      background: transparent;
    }

    .t-btn--toggle.t-btn--secondary.is-off:hover:not(:disabled) {
      /* Like secondary button hover */
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
      /* Stronger glow when ON and hovering */
      color: white;
      border-color: var(--terminal-green-bright, #00ff66);
      background: transparent;
      box-shadow: 0 0 30px var(--terminal-green-glow, rgba(0, 255, 65, 0.7)),
                  inset 0 0 30px var(--terminal-green-glow, rgba(0, 255, 65, 0.2));
    }

    /* Custom color toggle (solid colors, no blur) */
    .t-btn--toggle.t-btn--custom.is-off {
      color: var(--toggle-color-off);
      border-color: var(--toggle-color-off);
      background: transparent;
    }

    .t-btn--toggle.t-btn--custom.is-off:hover:not(:disabled) {
      /* Use black text on light backgrounds like yellow */
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

    /* ========================================
       BUTTON PARTS
       ======================================== */
    svg {
      fill: currentColor;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      display: block;
      /* Ensure perfect icon centering */
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

    /* Icon container styling for perfect centering */
    .t-btn span:first-child:has(svg) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    /* Icon toggle states - Primary variant */
    /* OFF state: Filled button with icon cutout */
    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off {
      background: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off svg {
      /* Icon cutout effect - shows dark background through */
      fill: var(--terminal-black, #0a0a0a);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off:hover:not(:disabled) {
      background: var(--terminal-green-bright, #00ff66);
      border-color: var(--terminal-green-bright, #00ff66);
    }

    .t-btn--toggle.t-btn--primary.t-btn--icon.is-off:hover:not(:disabled) svg {
      fill: var(--terminal-black, #0a0a0a);
    }

    /* ON state: Outlined button with filled green icon */
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

    /* Icon toggle states - Secondary variant */
    /* OFF state: Filled button with icon cutout and glow */
    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-off {
      background: var(--terminal-green, #00ff41);
      border-color: var(--terminal-green, #00ff41);
      box-shadow: 0 0 15px var(--terminal-green-glow, rgba(0, 255, 65, 0.4));
    }

    .t-btn--toggle.t-btn--secondary.t-btn--icon.is-off svg {
      /* Icon cutout effect */
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

    /* ON state: Outlined button with filled green icon */
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

    /* ========================================
       LOADER ANIMATIONS
       ======================================== */
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

  static properties = {
    variant: { type: String },
    type: { type: String },
    size: { type: String },
    disabled: { type: Boolean },
    icon: { type: String },
    loading: { type: Boolean },
    loaderType: { type: String, attribute: 'loader-type' },
    loaderColor: { type: String, attribute: 'loader-color' },
    toggleState: { type: Boolean, attribute: 'toggle-state' },
    iconOn: { type: String, attribute: 'icon-on' },
    iconOff: { type: String, attribute: 'icon-off' },
    colorOn: { type: String, attribute: 'color-on' },
    colorOff: { type: String, attribute: 'color-off' },
    textOn: { type: String, attribute: 'text-on' },
    textOff: { type: String, attribute: 'text-off' }
  };

  constructor() {
    super();

    // Initialize properties
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

    // Internal state
    this._icon = '';
    this._fixedWidth = null;
    this._originalContent = null;
    this._preLoadingWidth = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // Set initial icon if provided
    if (this.icon) {
      this._icon = this.icon;
    }
    // Apply custom colors if provided
    this._applyCustomColors();
    // Calculate fixed width immediately for toggle buttons
    this._updateFixedWidth();
  }

  _applyCustomColors() {
    // Apply OFF state colors
    if (this.colorOff) {
      this.style.setProperty('--toggle-color-off', this.colorOff);
      // Set OFF state backgrounds based on colorOff
      const colorOffRgb = this._hexToRgb(this.colorOff);
      if (colorOffRgb) {
        // Determine text color for hover based on brightness
        const brightness = (colorOffRgb.r * 299 + colorOffRgb.g * 587 + colorOffRgb.b * 114) / 1000;
        this.style.setProperty('--toggle-text-hover-off', brightness > 128 ? 'black' : 'white');
        this.style.setProperty('--toggle-bg-hover-off', `rgba(${colorOffRgb.r}, ${colorOffRgb.g}, ${colorOffRgb.b}, 0.2)`);
        this.style.setProperty('--toggle-shadow-off', `rgba(${colorOffRgb.r}, ${colorOffRgb.g}, ${colorOffRgb.b}, 0.3)`);
      }
    }

    // Apply ON state colors
    if (this.colorOn) {
      this.style.setProperty('--toggle-color-on', this.colorOn);
      // Set ON state backgrounds based on colorOn
      const colorOnRgb = this._hexToRgb(this.colorOn);
      if (colorOnRgb) {
        this.style.setProperty('--toggle-bg-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.2)`);
        this.style.setProperty('--toggle-bg-hover-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.3)`);
        this.style.setProperty('--toggle-shadow-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.3)`);
        this.style.setProperty('--toggle-shadow-hover-on', `rgba(${colorOnRgb.r}, ${colorOnRgb.g}, ${colorOnRgb.b}, 0.5)`);
      }
    }
  }

  _hexToRgb(hex) {
    // Convert hex color to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  _calculateMaxTextWidth() {
    // Only calculate for toggle buttons with text variations
    if (this.variant !== 'toggle' || !this.textOn || !this.textOff) {
      return null;
    }

    // Create a temporary element to measure text
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

    // Measure both texts
    measurer.textContent = this.textOff;
    const offWidth = measurer.offsetWidth;

    measurer.textContent = this.textOn;
    const onWidth = measurer.offsetWidth;

    document.body.removeChild(measurer);

    // Add padding for button borders and internal spacing
    const padding = this.size === 'large' || this.size === 'lg' ? 40 :
                    this.size === 'small' || this.size === 'sm' ? 16 : 24;

    return Math.max(offWidth, onWidth) + padding;
  }

  _updateFixedWidth() {
    // For toggle buttons with text
    if (this.variant === 'toggle' && (this.textOn || this.textOff)) {
      const maxWidth = this._calculateMaxTextWidth();
      if (maxWidth) {
        this._fixedWidth = `${maxWidth}px`;
      }
    }
  }


  willUpdate(changedProperties) {
    // Capture width BEFORE loading state changes the render
    if (changedProperties.has('loading')) {
      const wasLoading = changedProperties.get('loading');

      // About to enter loading state - capture current width
      if (this.loading && !wasLoading && this.variant !== 'toggle') {
        const button = this.shadowRoot?.querySelector('.t-btn');
        if (button) {
          this._fixedWidth = `${button.offsetWidth}px`;
        }
      }
      // About to exit loading state - clear width
      else if (!this.loading && wasLoading && this.variant !== 'toggle') {
        this._fixedWidth = null;
      }
    }
  }

  updated(changedProperties) {
    // Recalculate fixed width when relevant properties change
    if (changedProperties.has('variant') || changedProperties.has('textOn') ||
        changedProperties.has('textOff') || changedProperties.has('size')) {
      this._updateFixedWidth();
    }

    // Handle toggle color updates with proper fallbacks
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

    // Handle toggle icon updates
    if (this.variant === 'toggle') {
      if (changedProperties.has('toggleState') || changedProperties.has('iconOn') || changedProperties.has('iconOff')) {
        // Update icon based on toggle state
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

  render() {
    const classes = this._getButtonClasses();

    // Apply fixed width inline for consistent sizing
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

  _getButtonClasses() {
    const classes = ['t-btn'];

    // Add variant class
    if (this.variant) {
      classes.push(`t-btn--${this.variant}`);

      // For toggles, add variant-specific class or custom class
      if (this.variant === 'toggle') {
        if (this.colorOn || this.colorOff) {
          classes.push('t-btn--custom');
        } else {
          // Default to primary if no variant specified
          const toggleVariant = this.getAttribute('toggle-variant') || 'primary';
          classes.push(`t-btn--${toggleVariant}`);
        }
      }
    }

    // Add type class
    if (this.type) {
      classes.push(`t-btn--${this.type}`);
    }

    // Add size class
    if (this.size && this.size !== 'default') {
      classes.push(`t-btn--${this.size}`);
    }

    // Add state classes
    if (this.loading) {
      classes.push('is-loading');
    }

    if (this.variant === 'toggle') {
      classes.push(this.toggleState ? 'is-on' : 'is-off');
    }

    return classes.join(' ');
  }

  _renderContent() {
    // For XS size, always render as icon-only if icon is present
    if (this.size === 'xs' && this._icon) {
      return html`<span .innerHTML=${this._icon}></span>`;
    }

    // Icon only button
    if (this.type === 'icon' && this._icon) {
      return html`<span .innerHTML=${this._icon}></span>`;
    }

    // Icon + text button
    if (this.type === 'icon-text' && this._icon) {
      return html`
        <span .innerHTML=${this._icon}></span>
        <span class="t-btn__text">${this._getToggleText()}</span>
      `;
    }

    // Toggle button with icon switching
    if (this.variant === 'toggle' && this._icon && this.type === 'icon') {
      return html`<span .innerHTML=${this._icon}></span>`;
    }

    // Text only button (default)
    return html`${this._getToggleText()}`;
  }

  _getToggleText() {
    // For toggle buttons with text-on/text-off, change text based on state
    if (this.variant === 'toggle' && (this.textOn || this.textOff)) {
      return this.toggleState
        ? (this.textOn || html`<slot></slot>`)
        : (this.textOff || html`<slot></slot>`);
    }
    // Default to slot content
    return html`<slot></slot>`;
  }

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

  _handleClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }

    // Handle toggle state
    if (this.variant === 'toggle') {
      this.toggleState = !this.toggleState;
      this.dispatchEvent(new CustomEvent('toggle-change', {
        detail: { state: this.toggleState },
        bubbles: true,
        composed: true
      }));
    }
  }

  // Public API methods for compatibility with existing code
  setIcon(iconSvg) {
    this._icon = iconSvg;
    this.requestUpdate();
  }

  setText(text) {
    // Update the slot content
    this.innerHTML = text;
  }

  setLoading(loading) {
    // Capture width before changing loading state
    if (!this.loading && loading && this.variant !== 'toggle') {
      const button = this.shadowRoot?.querySelector('.t-btn');
      if (button) {
        this._preLoadingWidth = button.getBoundingClientRect().width;
      }
    }
    this.loading = loading;
  }
}

// Register the custom element
customElements.define('t-btn', TButton);

// Export for use
export default TButton;