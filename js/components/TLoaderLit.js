import { LitElement, html, css } from 'lit';

export class TLoaderLit extends LitElement {
  static styles = css`
    /**
     * TerminalLoader Component Styles
     * Loading indicators with terminal/cyberpunk styling
     */

    /* Base Loader Styles */
    .terminal-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    /* THE standalone orbital loader - works with <span class="loader"></span> */
    .loader {
      color: #ffffff;
      font-size: 45px;
      text-indent: -9999em;
      overflow: hidden;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      transform: translateZ(0);
      animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
    }

    /* Loader Text */
    .loader-text {
      font-size: var(--font-size-sm);
      color: var(--loader-color);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: var(--font-mono);
      text-align: center;
      animation: text-pulse 2s ease-in-out infinite;
    }

    @keyframes text-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* Component container wrapper */
    .loader-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      --loader-color: var(--terminal-green);
    }

    /* === ORBITAL LOADER (Component Spinner) === */
    .loader-spinner {
      color: var(--loader-color);
      font-size: 24px;
      text-indent: -9999em;
      overflow: hidden;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      display: block;
      transform: translateZ(0);
      animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
    }

    /* Spinner Sizes */
    .loader-wrapper.loader-small .loader-spinner {
      font-size: 16px;
    }

    .loader-wrapper.loader-medium .loader-spinner {
      font-size: 24px;
    }

    .loader-wrapper.loader-large .loader-spinner {
      font-size: 40px;
    }

    /* Orbital animation keyframes */
    @keyframes mltShdSpin {
      0% {
        box-shadow: 0 -0.83em 0 -0.4em,
        0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      5%,
      95% {
        box-shadow: 0 -0.83em 0 -0.4em,
        0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
      }
      10%,
      59% {
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


    /* === DOTS LOADER === */
    .loader-dots {
      display: flex;
      gap: var(--spacing-xs);
      align-items: center;
    }

    .loader-dots .dot {
      background-color: var(--loader-color);
      border-radius: 0; /* Square dots for terminal aesthetic */
      animation: dot-bounce 1.4s ease-in-out infinite both;
    }

    .loader-dots .dot-1 { animation-delay: -0.32s; }
    .loader-dots .dot-2 { animation-delay: -0.16s; }
    .loader-dots .dot-3 { animation-delay: 0s; }

    /* Dots Sizes */
    .loader-wrapper.loader-small .loader-dots .dot {
      width: 4px;
      height: 4px;
    }

    .loader-wrapper.loader-medium .loader-dots .dot {
      width: 6px;
      height: 6px;
    }

    .loader-wrapper.loader-large .loader-dots .dot {
      width: 10px;
      height: 10px;
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

    /* === BARS LOADER === */
    .loader-bars {
      display: flex;
      gap: 2px;
      align-items: flex-end;
    }

    .loader-bars .bar {
      background-color: var(--loader-color);
      animation: bar-bounce 1.2s ease-in-out infinite;
    }

    .loader-bars .bar-1 { animation-delay: -0.9s; }
    .loader-bars .bar-2 { animation-delay: -0.7s; }
    .loader-bars .bar-3 { animation-delay: -0.5s; }
    .loader-bars .bar-4 { animation-delay: -0.3s; }
    .loader-bars .bar-5 { animation-delay: -0.1s; }

    /* Bars Sizes */
    .loader-wrapper.loader-small .loader-bars .bar {
      width: 2px;
      height: 8px;
    }

    .loader-wrapper.loader-medium .loader-bars .bar {
      width: 3px;
      height: 16px;
    }

    .loader-wrapper.loader-large .loader-bars .bar {
      width: 4px;
      height: 24px;
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

    /* === SIZE VARIANTS === */

    /* XS size for buttons (fits in 28px height) */
    .loader-wrapper.loader-xs .loader-spinner {
      font-size: 12px;
    }

    .loader-wrapper.loader-xs .loader-dots .dot {
      width: 3px;
      height: 3px;
    }

    .loader-wrapper.loader-xs .loader-bars .bar {
      width: 2px;
      height: 6px;
    }

    /* Small Text */
    .loader-wrapper.loader-small .loader-text {
      font-size: var(--font-size-xs);
    }

    /* Large Text */
    .loader-wrapper.loader-large .loader-text {
      font-size: var(--font-size-base);
    }

    /* === UTILITY CLASSES === */

    /* Inline loader (horizontal layout) */
    .loader-inline {
      flex-direction: row;
      gap: var(--spacing-sm);
    }

    /* Centered loader (full width/height) */
    .loader-centered {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* Fixed loader (overlay) */
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    /* Block loader (within container) */
    .loader-block {
      position: relative;
      width: 100%;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* === COLOR VARIANTS === */

    /* Success Green */
    .loader-success {
      --loader-color: var(--terminal-green);
    }

    /* Error Red */
    .loader-error {
      --loader-color: var(--terminal-red);
    }

    /* Warning Yellow */
    .loader-warning {
      --loader-color: var(--terminal-yellow);
    }

    /* Info Cyan */
    .loader-info {
      --loader-color: var(--terminal-cyan);
    }

    /* Dim Green */
    .loader-dim {
      --loader-color: var(--terminal-green-dim);
    }

    /* === THEME SUPPORT === */

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .loader-spinner {
        border-top-color: currentColor;
      }

      .loader-dots .dot,
      .loader-bars .bar {
        background-color: currentColor;
      }

      .loader-text {
        color: currentColor;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .loader-spinner {
        animation: none;
        box-shadow: 0 -0.83em 0 -0.4em var(--loader-color);
      }

      .loader-dots .dot,
      .loader-bars .bar {
        animation: none;
        opacity: 1;
        transform: none;
      }

      .loader-text {
        animation: none;
        opacity: 1;
      }
    }

    /* Dark Theme Overrides */
    @media (prefers-color-scheme: dark) {
      .loader {
        --loader-color: var(--terminal-green);
      }

      .loader-spinner {
        border-color: var(--terminal-gray-light);
      }
    }

    /* === LEGACY LOADING STYLES (from loading.css) === */

    /* Loading Indicator */
    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
      color: var(--terminal-green-dim);
    }

    .loading-indicator.active {
      display: flex;
    }

    .loading-indicator span {
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--terminal-green);
    }

    /* Legacy Spinner Classes */
    .spinner {
      width: 24px;
      height: 24px;
      color: var(--terminal-green);
      font-size: 24px;
      text-indent: -9999em;
      overflow: hidden;
      border-radius: 50%;
      position: relative;
      transform: translateZ(0);
      animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
    }

    .spinner-lg {
      width: 40px;
      height: 40px;
      font-size: 40px;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }

    /* Auth Spinner */
    .auth-spinner {
      width: 40px;
      height: 40px;
      color: var(--terminal-green);
      font-size: 40px;
      text-indent: -9999em;
      overflow: hidden;
      border-radius: 50%;
      position: relative;
      transform: translateZ(0);
      animation: mltShdSpin 1.7s infinite ease, round 1.7s infinite ease;
      margin: 0 auto var(--spacing-lg);
    }

    /* Terminal Cursor Loading */
    .terminal-cursor::after {
      content: '_';
      animation: terminal-blink 1s infinite;
      color: var(--terminal-green);
    }

    @keyframes terminal-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    /* Full Page Loading */
    .app-loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--terminal-black);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .loading-text {
      font-size: var(--font-size-lg);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--terminal-green);
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Loading Overlay */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    /* Loading Bar */
    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: var(--terminal-green);
      transition: width 0.3s ease;
      z-index: 10000;
    }

    /* Loading States for Containers */
    .is-loading {
      position: relative;
      pointer-events: none;
    }

    /* Removed generic ::before and ::after - interferes with button loader
       Use actual loader component instead of pseudo-element overlays */

    /* Skeleton Loading */
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--terminal-gray-dark) 25%,
        var(--terminal-gray) 50%,
        var(--terminal-gray-dark) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .skeleton-text {
      height: var(--font-size-base);
      margin-bottom: var(--spacing-xs);
      border-radius: 0;
    }

    .skeleton-button {
      height: var(--control-height);
      width: 100px;
      border-radius: 0;
    }

    .skeleton-input {
      height: var(--control-height);
      width: 100%;
      border-radius: 0;
    }
  `;

  static properties = {
    type: { type: String },
    message: { type: String },
    size: { type: String }
  };

  constructor() {
    super();
    this.type = 'spinner';
    this.message = '';
    this.size = '';
  }

  render() {
    return html`
      <div class="loader ${this.type}">
        ${this.message ? html`<span>${this.message} </span>` : ''}
      </div>
    `;
  }
}

if (!customElements.get('t-ldr')) {
  customElements.define('t-ldr', TLoaderLit);
}

export default TLoaderLit;
