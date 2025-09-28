import { LitElement, html, css } from 'lit';

export class TSliderLit extends LitElement {
  static styles = css`
/**
 * Slider Component Styles
 * Terminal-themed range slider for zoom and other controls
 */

/* Slider Container */
.terminal-slider {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  /* padding: var(--spacing-sm); */
  min-width: 150px;
}

/* Remove the auto width override - we want fixed widths */
/* Input widths are now controlled by specific variant rules above */

.terminal-slider-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

/* Slider Track */
.slider-track {
  position: relative;
  width: 100%;
  height: 16px;
  background: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  cursor: pointer;
  overflow: visible;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
  margin: 12px 0;
}

.slider-track-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, var(--terminal-green-dark), var(--terminal-green));
  box-shadow: 0 0 8px var(--terminal-green-glow);
  transition: width 0.1s ease;
  border-right: 1px solid var(--terminal-green-bright);
}

/* Slider Thumb */
.slider-thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: var(--terminal-green-dim);
  border: 2.5px solid var(--terminal-green-dark);
  cursor: grab;
  transform: translateX(-50%);
  transition: all 0.2s ease;
  z-index: 3;
  top: -1px;
  box-shadow: 0 0 6px rgba(0, 255, 65, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-thumb:hover {
  background-color: var(--terminal-green-dim);
  box-shadow: 0 0 15px var(--terminal-green-glow);
  transform: translateX(-50%) scale(1.1);
}

.slider-thumb:active {
  cursor: grabbing;
  background-color: var(--terminal-green-dark);
  transform: translateX(-50%) scale(0.95);
}

.slider-thumb.dragging {
  cursor: grabbing;
  box-shadow: 0 0 20px var(--terminal-green-glow-strong);
  background-color: var(--terminal-green-dark);
}

/* Value Display */
.slider-value {
  width: 55px; /* Fixed width to accommodate 3 digits + decimal */
  min-width: 55px;
  max-width: 55px;
  padding: var(--spacing-xs) var(--spacing-xs);
  background: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  color: var(--terminal-green);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  text-align: center;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.slider-value.editable {
  cursor: text;
  transition: all 0.2s ease;
}

.slider-value.editable:hover {
  border-color: var(--terminal-green);
  background: var(--terminal-gray-darkest);
}

.slider-value.editable:focus {
  outline: none;
  border-color: var(--terminal-green);
  box-shadow: 0 0 10px var(--terminal-green-glow);
}

/* Labels */
.slider-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  color: var(--terminal-green-dim);
  letter-spacing: 0.5px;
  min-width: 50px;
}

.slider-min,
.slider-max {
  font-size: var(--font-size-xs);
  color: var(--terminal-gray-text);
  padding: 0 var(--spacing-xs);
}

/* Tick Marks for Stepped Sliders */
.slider-ticks {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.slider-tick {
  position: absolute;
  width: 1px;
  height: 10px;
  background: var(--terminal-gray-lighter);
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  z-index: 1;
}

.slider-tick.major {
  height: 14px;
  width: 2px;
  background: var(--terminal-green-dim);
  opacity: 0.7;
}

/* Stepped/Notched Slider */
.terminal-slider.stepped .slider-thumb {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.terminal-slider.stepped .slider-track-fill {
  transition: width 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth Slider (default) */
.terminal-slider.smooth .slider-thumb {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.terminal-slider.smooth .slider-track-fill {
  transition: none;
}

/* Disabled State */
.terminal-slider.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.terminal-slider.disabled .slider-track {
  background: var(--terminal-gray-darkest);
}

.terminal-slider.disabled .slider-thumb {
  border-color: var(--terminal-gray-light);
  cursor: not-allowed;
}

/* Vertical Slider */
.terminal-slider.vertical {
  flex-direction: column;
  height: 250px;
  width: auto;
  align-items: center;
  gap: var(--spacing-sm);
}

.terminal-slider.vertical .terminal-slider-wrapper {
  width: 30px;
  height: 200px;
  flex-direction: column;
  position: relative;
}

.terminal-slider.vertical .slider-track {
  width: 16px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}

.terminal-slider.vertical .slider-track-fill {
  width: 100%;
  bottom: 0;
  position: absolute;
}

.terminal-slider.vertical .slider-thumb {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  /* Remove top positioning to allow bottom to work */
  top: auto;
}

.terminal-slider.vertical .slider-thumb:hover {
  transform: translateX(-50%) translateY(50%) scale(1.1);
}

.terminal-slider.vertical .slider-thumb:active {
  transform: translateX(-50%) translateY(50%) scale(0.95);
}

.terminal-slider.vertical .slider-thumb.dragging {
  transform: translateX(-50%) translateY(50%) scale(0.95);
}

.terminal-slider.vertical .slider-value {
  margin-top: var(--spacing-xs);
}

.terminal-slider.vertical .slider-label {
  writing-mode: horizontal-tb;
  text-align: center;
}

.terminal-slider.vertical .slider-icon {
  margin-bottom: var(--spacing-xs);
}


/* Vertical with ticks */
.terminal-slider.vertical .slider-ticks {
  height: 100%;
  width: 100%;
}

.terminal-slider.vertical .slider-tick {
  width: 10px;
  height: 1px;
  left: 50%;
  transform: translateX(-50%);
  top: auto;
}

.terminal-slider.vertical .slider-tick.major {
  width: 14px;
  height: 2px;
}

/* Compact Mode */
.terminal-slider.compact {
  padding: var(--spacing-xs);
  min-width: 120px;
  gap: var(--spacing-xs);
}

.terminal-slider.compact .terminal-slider-wrapper {
  height: 20px;
}

.terminal-slider.compact .slider-track {
  height: 10px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  margin: 8px 0;
}

.terminal-slider.compact .slider-thumb {
  width: 12px;
  height: 12px;
  border-width: 1px;
  top: -2px;
}

.terminal-slider.compact .slider-value:not(input) {
  width: 45px; /* Fixed width for compact mode */
  min-width: 45px;
  max-width: 45px;
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-xs);
  height: 20px;
}

.terminal-slider.compact .slider-label {
  font-size: 10px;
}

/* With Icon */
.slider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--terminal-green-dim);
  flex-shrink: 0;
}

/* Icon size variants */
.slider-icon.icon-small {
  width: 14px;
  height: 14px;
}

.slider-icon.icon-medium {
  width: 16px;
  height: 16px;
}

.slider-icon.icon-large {
  width: 20px;
  height: 20px;
}

.slider-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.terminal-slider.compact .slider-icon.icon-small {
  width: 12px;
  height: 12px;
}

.terminal-slider.compact .slider-icon.icon-medium {
  width: 14px;
  height: 14px;
}

.terminal-slider.compact .slider-icon.icon-large {
  width: 16px;
  height: 16px;
}

/* Value Inside Thumb */
.terminal-slider.value-in-thumb .slider-thumb {
  width: 36px;
  height: 18px;
  border-radius: 2px;
  font-size: 10px;
  color: var(--terminal-green-bright);
  background: var(--terminal-gray-dark);
  font-family: var(--font-mono);
  text-shadow: 0 0 3px rgba(0, 255, 65, 0.5);
  top: -2px;
}

.terminal-slider.value-in-thumb.compact .slider-thumb {
  width: 30px;
  height: 14px;
  font-size: 9px;
  top: -5px;
}

.terminal-slider.value-in-thumb .slider-value-in-thumb {
  position: relative;
  z-index: 1;
  pointer-events: none;
  line-height: 1;
}

/* Vertical value-in-thumb needs special handling */
.terminal-slider.vertical.value-in-thumb .slider-thumb {
  top: auto; /* Remove horizontal top positioning */
  width: 36px;
  /* height: 24px; */
  padding: 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Input Field Variant */
.terminal-slider.with-input input.slider-value {
  width: 65px; /* Fixed width for input variant */
  min-width: 65px;
  max-width: 65px;
  background: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  padding: 0 4px;
  height: var(--control-height);
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--terminal-green);
  cursor: text;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  margin-left: var(--spacing-xs);
  display: block;
  box-sizing: border-box;
  flex-shrink: 0;
}

.terminal-slider.with-input.compact input.slider-value {
  height: 22px;
  width: 55px; /* Fixed width for compact input */
  min-width: 55px;
  max-width: 55px;
  font-size: var(--font-size-xs);
  padding: 0 4px;
}

.terminal-slider.with-input input.slider-value::-webkit-inner-spin-button,
.terminal-slider.with-input input.slider-value::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.terminal-slider.with-input input.slider-value:hover {
  border-color: var(--terminal-green-dim);
}

.terminal-slider.with-input input.slider-value:focus {
  outline: none;
  border-color: var(--terminal-green);
  box-shadow: 0 0 8px var(--terminal-green-glow);
  background: var(--terminal-gray-darkest);
}

/* Responsive */
@media (max-width: 768px) {
  .terminal-slider {
    min-width: 150px;
  }

  /* Value box keeps same fixed width on mobile */
  .slider-value {
    width: 55px;
    min-width: 55px;
    max-width: 55px;
  }

  .terminal-slider.compact .slider-value {
    width: 45px;
    min-width: 45px;
    max-width: 45px;
  }
}

@media (max-width: 480px) {
  .terminal-slider {
    gap: var(--spacing-sm);
  }

  .terminal-slider-wrapper {
    height: 28px;
  }

  .slider-thumb {
    width: 18px;
    height: 18px;
  }
}
  `;

  static properties = {
    min: { type: Number },
    max: { type: Number },
    value: { type: Number },
    size: { type: String }
  };

  constructor() {
    super();
    this.min = 0;
    this.max = 100;
    this.value = 50;
    this.size = '';
  }

  render() {
    return html`
      <input
        type="range"
        .min=${this.min}
        .max=${this.max}
        .value=${this.value}
        @input=${this._handleInput}
      />
    `;
  }

  _handleInput(e) {
    this.value = Number(e.target.value);
    this.dispatchEvent(new CustomEvent('slider-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('t-sld')) {
  customElements.define('t-sld', TSliderLit);
}

export default TSliderLit;
