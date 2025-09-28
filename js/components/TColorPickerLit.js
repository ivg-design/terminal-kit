import { LitElement, html, css } from 'lit';

export class TColorPickerLit extends LitElement {
  static styles = css`
/**
 * Color Picker Component
 * Custom color picker with label, swatch, and hex input
 */

/* Color Picker Container */
.color-picker-wrapper {
	display: flex;
	align-items: center;
	height: 48px;
	background: var(--terminal-gray-dark);
	/* #242424 */
	border: 1px solid var(--terminal-gray-light);
	/* #333333 */
	position: relative;
	transition: all 0.2s ease;
	width: fit-content;
}

/* Minimal variant - no border, compact layout */
.color-picker-wrapper.minimal {
	height: auto;
	background: transparent;
	border: none;
	gap: 4px;
	padding: 0;
}

.color-picker-wrapper.minimal:hover {
	border: none;
	box-shadow: none;
}

.color-picker-swatch-minimal {
	width: 20px;
	height: 20px;
	border: 1px solid var(--terminal-green-dim);
	cursor: pointer;
	position: relative;
	transition: all 0.2s ease;
}

.color-picker-swatch-minimal .color-picker-swatch-color {
	pointer-events: none; /* Allow clicks to pass through */
}

.color-picker-swatch-minimal:hover {
	border-color: var(--terminal-green);
	box-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
}

.color-picker-wrapper.minimal .color-picker-hex {
	width: 70px;
	height: 20px;
	padding: 0 6px;
	border: 1px solid var(--terminal-gray-light);
	background: var(--terminal-gray-dark);
	color: var(--terminal-green);
	font-family: var(--font-mono);
	font-size: 10px;
}

.color-picker-wrapper.minimal .color-picker-hex:focus {
	border-color: var(--terminal-green);
	outline: none;
}

.color-picker-wrapper:hover {
	border-color: var(--terminal-green);
}

.color-picker-wrapper.active {
	border-color: var(--terminal-green);
	box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
}

/* Label Section (Left) */
.color-picker-label {
	/* flex: 1; */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
	padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 0;
	position: relative;
	/* max-width: auto !important; */

}

.color-picker-label-line1,
.color-picker-label-line2 {
	font-size: var(--font-size-xs);
	/* 10px */
	text-transform: uppercase;
	letter-spacing: 0.5px;
	line-height: 1.3;
	text-align: right;
	white-space: nowrap;
	/* padding-left: 25px; */
}

.color-picker-label-line1 {
	color: var(--terminal-green-dim);
	/* #00cc33 */
	font-weight: normal;
}

.color-picker-label-line2 {
	color: var(--terminal-green);
	/* #00ff41 */
	font-weight: 500;
}

/* Icon Overlay (Bottom Left of Label) */
.color-picker-icon {
	min-width: 48px;
	height: 48px;
	padding: var(--spacing-md);
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--terminal-green-dim);
	opacity: 0.7;
	transition: all 0.2s ease;
}

.color-picker-icon svg {
	width: 100%;
	height: 100%;
}

.color-picker-wrapper:hover .color-picker-icon {
	color: var(--terminal-green);
	opacity: 1;
}

/* Color Swatch (Middle) */
.color-picker-swatch {
	width: 48px;
	height: 100%;
	border-left: 1px solid var(--terminal-gray-light);
	border-right: 1px solid var(--terminal-gray-light);
	position: relative;
	cursor: pointer;
	overflow: hidden;
	flex-shrink: 0;
}
.color-picker-swatch svg {
	display: none;
}

.color-picker-swatch::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image:
		linear-gradient(45deg, #808080 25%, transparent 25%),
		linear-gradient(-45deg, #808080 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #808080 75%),
		linear-gradient(-45deg, transparent 75%, #808080 75%);
	background-size: 8px 8px;
	background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
	opacity: 0.2;
}

.color-picker-swatch-color {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: var(--terminal-green);
	transition: background-color 0.2s ease;
	pointer-events: none; /* Allow clicks to pass through to parent */
}

/* Ensure icons inside swatch-color are also non-interactive */
.color-picker-swatch-color svg {
	pointer-events: none;
}

.color-picker-swatch:hover::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border: 2px solid var(--terminal-green);
	pointer-events: none;
}

/* Hex Input (Right) */
.colorIO {
	margin-left: var(--spacing-md);
	margin-right: var(--spacing-md);
	width: 70%;
}

.color-picker-hex {
	width: 80px !important;
	padding: 0 var(--spacing-sm);
	background: transparent;
	border: none;
	color: var(--terminal-green);
	font-family: var(--font-mono);
	font-size: var(--font-size-sm);
	/* 11px */
	text-transform: uppercase;
	text-align: center;
	letter-spacing: 0.5px;
	outline: none;
	transition: all 0.2s ease;
}

.color-picker-hex::placeholder {
	color: var(--terminal-gray-light);
	opacity: 0.5;
}

.color-picker-hex:focus {
	background: var(--terminal-black);
}

.color-picker-hex:hover {
	background: rgba(0, 255, 65, 0.05);
}

/* Pickr Integration (Hidden but functional) */
.color-picker-wrapper .pcr-button {
	position: absolute;
	opacity: 0;
	pointer-events: none;
	width: 1px;
	height: 1px;
	left: 50%;
	bottom: -10px;
}

/* States */
.color-picker-wrapper.disabled {
	opacity: 0.5;
	pointer-events: none;
}
.color-picker-wrapper.disabled .color-picker-swatch svg {
	opacity: 0.4;
	color: black;
}

.color-picker-wrapper.error {
	border-color: #ff3333;
}

.color-picker-wrapper.error .color-picker-hex {
	color: #ff3333;
}

/* Compact Mode for Integration */
.color-picker-wrapper.compact {
	height: 30px;
}

.color-picker-wrapper.compact .color-picker-label {
	display: none;
}

.color-picker-wrapper.compact .color-picker-swatch {
	width: 30px;
}
.color-picker-wrapper.compact .color-picker-swatch svg {
	display: none
}
.color-picker-wrapper.compact .color-picker-icon {
	min-width: 30px;
	height: 30px;
	padding: 6px;
}
.color-picker-wrapper.compact .colorIO {
	margin-left: var(--spacing-sm);
	margin-right: var(--spacing-sm);
	width: 100%
}

.color-picker-wrapper.compact .color-picker-hex {
	width: 70px;
	font-size: var(--font-size-xs);
}

/* Minimal variant with compact mode - 20px tall */
.color-picker-wrapper.minimal.compact .color-picker-swatch-minimal {
	width: 20px;
	height: 20px;
}
.color-picker-wrapper.minimal.compact .color-picker-hex {
	height: 20px;
	font-size: 10px;
}

/* Dark variant */
.color-picker-wrapper.dark {
	background: var(--terminal-black);
	border-color: var(--terminal-green-dark);
}

/* Multiple Color Pickers Container */
.color-pickers-group {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
}

.color-pickers-row {
	display: flex;
	gap: var(--spacing-md);
	flex-wrap: wrap;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
	.color-picker-wrapper {
		min-width: 200px;
	}

	.color-picker-label {
		min-width: 70px;
		padding: 0 var(--spacing-sm);
	}

	.color-picker-hex {
		width: 70px;
	}
}

/* Responsive - Mobile */
@media (max-width: 768px) {
	.color-picker-wrapper {
		height: 40px;
		min-width: 140px;
	}

	/* Hide label text on mobile */
	.color-picker-label-line1,
	.color-picker-label-line2 {
		display: none;
	}

	/* Keep icon but center it */
	.color-picker-label {
		min-width: 32px;
		padding: 0;
		align-items: center;
		justify-content: center;
	}

	.color-picker-icon {
		position: relative;
		bottom: auto;
		left: auto;
		opacity: 1;
	}

	/* Smaller swatch */
	.color-picker-swatch {
		width: 40px;
	}

	/* Smaller hex input */
	.color-picker-hex {
		width: 68px;
		padding: 0 var(--spacing-xs);
		font-size: var(--font-size-xs);
	}
}

/* Very small mobile */
@media (max-width: 480px) {
	.color-picker-wrapper {
		height: 36px;
		min-width: 120px;
	}

	.color-picker-label {
		min-width: 28px;
	}

	.color-picker-icon {
		width: 14px;
		height: 14px;
	}

	.color-picker-swatch {
		width: 36px;
	}

	.color-picker-hex {
		width: 56px;
		font-size: 9px;
	}
}

/* Animation for color changes */
@keyframes colorPulse {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.7;
	}
}

.color-picker-swatch.updating {
	animation: colorPulse 0.3s ease;
}

/* Tooltip for hover */
.color-picker-wrapper[data-tooltip]::after {
	content: attr(data-tooltip);
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	margin-bottom: 8px;
	padding: 4px 8px;
	background: var(--terminal-black);
	border: 1px solid var(--terminal-green);
	color: var(--terminal-green);
	font-size: var(--font-size-xs);
	white-space: nowrap;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.2s ease;
	z-index: 100;
}

.color-picker-wrapper:hover[data-tooltip]::after {
	opacity: 1;
}

/**
 * Pickr Library Overrides
 * Dark terminal theme customizations for Pickr color picker
 */

/* Dark theme colors matching app theme */
.pcr-app {
	background: #1a1a1a !important;
	border: 1px solid #00ff41 !important;
	font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
	border-radius: 0 !important;
	z-index: 10000 !important; /* Ensure it appears on top */
}

/* Make picker even wider */
.pcr-app[data-theme="classic"] {
	width: 38em !important;
}

.pcr-app .pcr-selection {
	background: #0a0a0a !important;
	display: flex !important;
	flex-direction: row !important;
}

/* CRITICAL: Preserve Pickr's gradient backgrounds for sliders - VERTICAL */
.pcr-app .pcr-selection .pcr-hue {
	background: linear-gradient(to bottom, red 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red 100%) !important;
}

/* Opacity slider - simple black to transparent gradient */
.pcr-app .pcr-selection .pcr-opacity {
	background: linear-gradient(to bottom, transparent, black),
	            linear-gradient(45deg, #ddd 25%, transparent 0, transparent 75%, #ddd 0, #ddd),
	            linear-gradient(45deg, #ddd 25%, transparent 0, transparent 75%, #ddd 0, #ddd) !important;
	background-size: 100%, 10px 10px, 10px 10px !important;
	background-position: 0 0, 0 0, 5px 5px !important;
}

/* Add transparency checkerboard to main color palette */
.pcr-app .pcr-selection .pcr-color-palette {
	background: linear-gradient(45deg, #666 25%, transparent 0, transparent 75%, #666 0, #666),
	            linear-gradient(45deg, #666 25%, transparent 0, transparent 75%, #666 0, #666) !important;
	background-size: 8px 8px, 8px 8px !important;
	background-position: 0 0, 4px 4px !important;
}

/* Fix height for color palette */
.pcr-app[data-theme="classic"] .pcr-selection .pcr-color-palette {
	width: 100% !important;
	height: 120px !important;
	border-radius: 4px !important;
}

.pcr-app[data-theme="classic"] .pcr-selection .pcr-color-palette .pcr-palette {
	width: 100% !important;
	height: 100% !important;
}

/* Make text more readable with better weight */
.pcr-app .pcr-interaction input {
	background: #242424 !important;
	color: #00ff41 !important;
	border: 1px solid #333333 !important;
	font-size: 12px !important;
	font-weight: 500 !important;
	letter-spacing: unset !important;
	font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
	border-radius: 0 !important;
}

.pcr-app .pcr-interaction .pcr-result {
	background: #242424 !important;
	color: #00ff41 !important;
	font-size: 12px !important;
	font-weight: 500 !important;
	font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
	border-radius: 0 !important;
}

/* Hide the redundant cancel button */
.pcr-app .pcr-interaction .pcr-cancel {
	display: none !important;
}

/* Button styles - Icon-only with fixed sizes and proper margins */
.pcr-app .pcr-interaction .pcr-save,
.pcr-app .pcr-interaction .pcr-clear,
.pcr-app .pcr-interaction .pcr-copy-btn {
	border-radius: 0 !important;
	width: 28px !important;
	height: 28px !important;
	padding: 0 !important;
	transition: all 0.15s !important;
	cursor: pointer !important;
	position: relative !important;
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	vertical-align: middle !important;
	margin: 0.75em 0.2em 0 0.2em !important;
	margin-top: 0.75em !important;
}

/* Style buttons like HEXA/RGBA buttons - dark background with GREEN icons */
.pcr-app[data-theme="classic"] .pcr-interaction .pcr-save {
	background: #242424 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%2300ff41'%3E%3Cpath d='M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z'/%3E%3C/svg%3E") center/18px 18px no-repeat !important;
	text-indent: -9999px !important;
	overflow: hidden !important;
}

.pcr-app[data-theme="classic"] .pcr-interaction .pcr-clear {
	background: #242424 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300ff41' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='9' y1='9' x2='15' y2='15'/%3E%3Cline x1='15' y1='9' x2='9' y2='15'/%3E%3C/svg%3E") center/18px 18px no-repeat !important;
	text-indent: -9999px !important;
	overflow: hidden !important;
}

.pcr-app[data-theme="classic"] .pcr-interaction .pcr-copy-btn {
	background: #242424 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%2300ff41'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E") center/18px 18px no-repeat !important;
	text-indent: -9999px !important;
	overflow: hidden !important;
}

/* Button borders - match HEXA/RGBA style */
.pcr-app .pcr-interaction .pcr-save,
.pcr-app .pcr-interaction .pcr-clear,
.pcr-app .pcr-interaction .pcr-copy-btn {
	border: 1px solid #333333 !important;
}

.pcr-app .pcr-interaction .pcr-copy-btn {
	margin: 0.75em 0.2em 0 0.2em !important;
}

.pcr-app .pcr-interaction .pcr-save:hover,
.pcr-app .pcr-interaction .pcr-clear:hover,
.pcr-app .pcr-interaction .pcr-cancel:hover,
.pcr-app .pcr-interaction .pcr-copy-btn:hover {
	filter: brightness(1.2) !important;
}

/* Active state */
.pcr-app .pcr-interaction .pcr-type.active {
	color: #00ff41 !important;
	background: #242424 !important;
	border: 1px solid #00ff41 !important;
}

/* Adjust hue and opacity sliders to contain thumb */
.pcr-app[data-theme="classic"] .pcr-color-chooser,
.pcr-app[data-theme="classic"] .pcr-color-opacity {
	position: relative !important;
	z-index: 1 !important;
	display: flex !important;
	align-items: center !important;
	width: 20px !important; /* Fixed width for better layout */
}

.pcr-app[data-theme="classic"] .pcr-color-chooser .pcr-slider,
.pcr-app[data-theme="classic"] .pcr-color-opacity .pcr-slider {
	width: 100% !important;
	height: 100% !important;
	position: relative !important;
	z-index: 1 !important;
	border-radius: 4px !important;
}

/* Adjust picker thumb to stay inside slider */
.pcr-app[data-theme="classic"] .pcr-color-chooser .pcr-picker,
.pcr-app[data-theme="classic"] .pcr-color-opacity .pcr-picker {
	width: 20px !important;
	height: 12px !important;
	border-radius: 4px !important;
	border: 2px solid #fff !important;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.8) !important;
	left: 50% !important;
	transform: translateX(-50%) !important;
	z-index: 10 !important;
	position: absolute !important;
	background: transparent !important;
}

/* Main palette picker styling */
.pcr-app[data-theme="classic"] .pcr-color-palette .pcr-picker {
	width: 14px !important;
	height: 14px !important;
	border: 2px solid #fff !important;
}

/* Adjust main color palette to compensate for wider sliders */
.pcr-app[data-theme="classic"] .pcr-selection .pcr-color-palette {
	margin-right: -2px !important;
}

/* Ensure spacing between elements */
.pcr-app[data-theme="classic"] .pcr-color-chooser,
.pcr-app[data-theme="classic"] .pcr-color-opacity {
	margin-left: 0.5em !important;
}

/* Swatches */
.pcr-app .pcr-swatches > button {
	border-radius: 0 !important;
}

/* Custom swatch styling - add subtle indicator */
.pcr-app .pcr-swatches > button.custom-swatch {
	position: relative !important;
	overflow: visible !important;
	box-shadow: inset 0 0 0 1px rgba(0, 255, 65, 0.3) !important;
}

/* Removable state when CMD/Ctrl is pressed - MORE VISIBLE */
.pcr-app .pcr-swatches > button.custom-swatch.removable {
	opacity: 0.5 !important;
	cursor: crosshair !important;
	transform: scale(0.85) !important;
	transition: all 0.1s ease !important;
	box-shadow: 0 0 0 2px #ff0041 !important;
	position: relative !important;
	z-index: 10 !important;
}

/* X overlay for removable swatches */
.pcr-app .pcr-swatches > button.custom-swatch.removable::after {
	content: '✕' !important;
	position: absolute !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	color: #ff0041 !important;
	font-size: 20px !important;
	font-weight: bold !important;
	text-shadow:
		-1px -1px 0 #000,
		 1px -1px 0 #000,
		-1px  1px 0 #000,
		 1px  1px 0 #000,
		 0 0 4px rgba(0, 0, 0, 0.8) !important;
	z-index: 1000 !important;
	pointer-events: none !important;
	background: rgba(0, 0, 0, 0.3) !important;
}

/* Make button square in container */
.color-picker-container .pcr-button {
	border-radius: 0 !important;
}

.pickr .pcr-button {
	border-radius: 0 !important;
}

.pickr .pcr-button::before,
.pickr .pcr-button::after {
	border-radius: 0 !important;
}

/* CRITICAL FIX: Ensure color shows in button */
.pickr .pcr-button::after {
	content: "" !important;
	position: absolute !important;
	top: 0 !important;
	left: 0 !important;
	width: 100% !important;
	height: 100% !important;
	background: var(--pcr-color) !important;
	z-index: 1 !important;
}
/* Force HEXA button to be visible */
.pcr-app .pcr-interaction .pcr-type[data-type="HEXA"] {
	display: inline-flex !important;
	visibility: visible !important;
}

/* Active format button styling */
.pcr-app .pcr-interaction .pcr-type.active {
	background: #00ff41 !important;
	color: #0a0a0a !important;
}
  `;

  static properties = {
    value: { type: String },
    size: { type: String }
  };

  constructor() {
    super();
    this.value = '#00ff41';
    this.size = '';
  }

  render() {
    return html`
      <input
        type="color"
        .value=${this.value}
        @input=${this._handleInput}
      />
    `;
  }

  _handleInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('color-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('t-clr')) {
  customElements.define('t-clr', TColorPickerLit);
}

export default TColorPickerLit;
