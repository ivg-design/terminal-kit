// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import { paletteIcon, xIcon, floppyDiskIcon, trashIcon } from '../utils/phosphor-icons.js';
import iro from '@jaames/iro';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TColorPicker
 * @tagname t-clr
 * @description Advanced color picker component with iro.js integration, persistent custom swatches, and multiple color format support (HEXA, RGBA, HSLA). Features a horizontal popover layout with live color updates, bidirectional input, format switching, and modal confirmation for destructive actions. Supports flexible element ordering, three size variants, and custom icons.
 * @category Form Controls
 * @since 1.0.0
 *
 * @features
 * - **iro.js Integration**: Professional color picker with square gradient box, hue slider, and alpha slider
 * - **Live Updates**: Color values update 4x per second (250ms) during drag operations
 * - **Bidirectional Input**: Read and write color values directly in hex, rgba, or hsla format
 * - **Format Switching**: Toggle between HEXA, RGBA, and HSLA display modes
 * - **Persistent Swatches**: Custom swatches saved to localStorage, merged with 10 default swatches
 * - **Flexible Layout**: Order and include/exclude elements: icon, label, swatch (mandatory), input
 * - **Three Size Variants**: Large (48px), Standard (32px), Compact (minimal)
 * - **Smart Positioning**: Popover appears next to triggering element, accounting for page scroll
 * - **Keyboard Shortcuts**: CMD+Click to remove custom swatches
 * - **Modal Confirmation**: Safe deletion of all custom swatches with confirmation dialog
 *
 * @picker-layout
 * The popover displays in a horizontal two-column grid layout:
 *
 * **Left Column (Picker):**
 * - Square color box (180x180px) with gradient selection
 * - Hue slider (20px wide, vertical)
 * - Alpha slider (20px wide, vertical)
 *
 * **Right Column (Controls - 180px wide):**
 * 1. Format buttons (HEXA/RGBA/HSLA) - 9px font, equal width
 * 2. Color input field - bidirectional, left-aligned, 11px font
 * 3. Swatches grid (5 columns, 20px swatches, 4px gaps, scrollable with styled scrollbar)
 * 4. Action buttons (vertical stack):
 *    - Save swatch (green, floppy disk icon)
 *    - Close picker (X icon)
 *    - Clear all swatches (red, trash icon - only if show-clear-button enabled)
 *
 * @element-options
 * Available elements for the `elements` attribute (order matters):
 *
 * - **icon** - Palette icon (24px, terminal green, 70% opacity)
 * - **label** - Two-line label (label1/label2, 10px uppercase, right-aligned)
 * - **swatch** - Color preview box (MANDATORY, opens picker on click)
 * - **input** - Hex color input field (80px, monospace, read-only)
 *
 * The swatch element is mandatory and must be included. Elements render in the exact order specified.
 *
 * @size-variants
 * - **large** (default): 48px height, 12px padding, 24px icons
 * - **standard**: 32px height, 8px padding, 16px icons
 * - **compact**: Minimal height, transparent background, 20px swatch only
 *
 * @color-formats
 * The picker supports three color format display modes:
 *
 * - **HEXA**: #RRGGBBAA (e.g., #00ff41ff)
 * - **RGBA**: rgba(r, g, b, a) (e.g., rgba(0, 255, 65, 1))
 * - **HSLA**: hsla(h, s%, l%, a) (e.g., hsla(135, 100%, 50%, 1))
 *
 * Format switching only affects display - internal value always stored as hex8.
 *
 * @swatches-system
 * - **Default Swatches**: 10 predefined colors (green, red, blue, yellow, magenta, cyan, white, grays)
 * - **Custom Swatches**: User-added colors saved to localStorage with key `t-clr-custom-swatches`
 * - **Add Swatch**: Click floppy disk icon to save current color
 * - **Remove Swatch**: CMD+Click on custom swatch (not default swatches)
 * - **Clear All**: Click trash icon (requires show-clear-button) with modal confirmation
 * - **Grid Layout**: 5 columns, 20px swatches, 4px gaps, styled scrollbar (6px, green thumb)
 *
 * @keyboard-interactions
 * - **CMD+Click**: Remove custom swatch (custom swatches only, not default swatches)
 * - **ESC**: Close picker (handled by document click outside)
 *
 * @events
 * - **change**: Fired when color value changes (250ms debounced)
 *   - detail: { value: string, color: string }
 *
 * @css-variables
 * - **--t-clr-bg**: Background color (default: var(--terminal-bg, #242424))
 * - **--t-clr-border**: Border color (default: var(--terminal-border, #333333))
 * - **--t-clr-color**: Primary color (default: var(--terminal-green, #00cc33))
 * - **--t-clr-color-hover**: Hover color (default: var(--terminal-green-bright, #00ff41))
 * - **--t-clr-transition**: Transition timing (default: var(--terminal-transition, all 0.2s ease))
 *
 * @external-dependencies
 * - **@jaames/iro**: iro.js color picker library
 * - **Phosphor Icons**: paletteIcon, xIcon, floppyDiskIcon, trashIcon
 * - **Global CSS**: css/components/t-clr-iro.css (must be linked in HTML)
 *
 * @global-css-requirement
 * The popover is appended to document.body (light DOM) and requires global CSS:
 * ```html
 * <link rel="stylesheet" href="css/components/t-clr-iro.css">
 * ```
 *
 * @example Basic usage
 * <t-clr value="#00ff41ff"></t-clr>
 *
 * @example Full configuration
 * <t-clr
 *   value="#ff6b35ff"
 *   label1="Theme"
 *   label2="Primary"
 *   variant="large"
 *   elements="icon,label,swatch,input"
 *   show-clear-button>
 * </t-clr>
 *
 * @example Custom element order
 * <t-clr elements="swatch,icon,input"></t-clr>
 * <t-clr elements="icon,swatch"></t-clr>
 * <t-clr elements="label,swatch,input"></t-clr>
 *
 * @example Size variants
 * <t-clr variant="large"></t-clr>
 * <t-clr variant="standard"></t-clr>
 * <t-clr variant="compact"></t-clr>
 *
 * @example Disabled state
 * <t-clr disabled></t-clr>
 *
 * @example With clear button
 * <t-clr show-clear-button></t-clr>
 */
export class TColorPicker extends LitElement {

	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-clr';
	static version = '1.0.0';
	static category = 'Form Controls';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED - even if empty)
	// ----------------------------------------------------------
	static styles = css`
		:host {
			display: inline-block;
			--t-clr-bg: var(--terminal-bg, #242424);
			--t-clr-border: var(--terminal-border, #333333);
			--t-clr-color: var(--terminal-green, #00cc33);
			--t-clr-color-hover: var(--terminal-green-bright, #00ff41);
			--t-clr-transition: var(--terminal-transition, all 0.2s ease);
		}

		.color-picker-wrapper {
			display: flex;
			align-items: center;
			height: 48px;
			background: var(--t-clr-bg);
			border: none;
			position: relative;
			transition: var(--t-clr-transition);
			width: fit-content;
			outline: none;
		}

		.color-picker-wrapper.standard {
			height: 32px;
			min-height: 32px;
		}

		.color-picker-wrapper.compact {
			height: auto;
			background: transparent;
			border: none;
			gap: 4px;
			padding: 0;
		}

		.color-picker-wrapper:focus {
			outline: none;
		}

		.color-picker-wrapper:focus-visible {
			outline: none;
		}

		.color-picker-wrapper.disabled {
			opacity: 0.25 !important;
			pointer-events: none !important;
			filter: grayscale(70%) brightness(0.6) !important;
		}

		.color-picker-icon {
			min-width: 48px;
			height: 48px;
			padding: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--t-clr-color);
			opacity: 0.7;
			transition: var(--t-clr-transition);
		}

		.color-picker-wrapper.standard .color-picker-icon {
			min-width: 32px;
			height: 32px;
			padding: 8px;
		}

		.color-picker-wrapper.compact .color-picker-icon {
			min-width: 20px;
			height: 20px;
			padding: 0;
		}

		.color-picker-wrapper.compact .color-picker-icon svg {
			width: 16px;
			height: 16px;
		}

		.color-picker-icon svg {
			width: 100%;
			height: 100%;
		}

		.color-picker-wrapper:hover .color-picker-icon {
			color: var(--t-clr-color-hover);
			opacity: 1;
		}

		.color-picker-label {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			padding: 12px 12px 12px 0;
			position: relative;
		}

		.color-picker-label-line1,
		.color-picker-label-line2 {
			font-size: 10px;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			line-height: 1.3;
			text-align: right;
			white-space: nowrap;
		}

		.color-picker-label-line1 {
			color: var(--t-clr-color);
			font-weight: normal;
		}

		.color-picker-label-line2 {
			color: var(--t-clr-color-hover);
			font-weight: 500;
		}

		.color-picker-swatch {
			width: 48px;
			height: 48px;
			min-width: 48px;
			min-height: 48px;
			border-left: 1px solid var(--t-clr-border);
			border-right: 1px solid var(--t-clr-border);
			position: relative;
			cursor: pointer;
			overflow: hidden;
			flex-shrink: 0;
		}

		.color-picker-wrapper.standard .color-picker-swatch {
			width: 32px;
			height: 32px;
			min-width: 32px;
			min-height: 32px;
		}

		.color-picker-swatch::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
				linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999);
			background-size: 8px 8px;
			background-position: 0 0, 4px 4px;
			background-color: #fff;
			z-index: 1;
			opacity: 0;
			transition: opacity 0.2s ease;
		}

		.color-picker-swatch.has-transparency::before {
			opacity: 1;
		}

		.color-picker-swatch-color {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.color-picker-swatch-color svg {
			width: 24px;
			height: 24px;
			color: currentColor;
			filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.8));
		}

		.color-picker-swatch-compact {
			width: 20px;
			height: 20px;
			min-width: 20px;
			min-height: 20px;
			border: none;
			cursor: pointer;
			position: relative;
			transition: var(--t-clr-transition);
			flex-shrink: 0;
		}

		.color-picker-swatch-compact::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
				linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999);
			background-size: 4px 4px;
			background-position: 0 0, 2px 2px;
			background-color: #fff;
			z-index: 1;
			opacity: 0;
			transition: opacity 0.2s ease;
		}

		.color-picker-swatch-compact.has-transparency::before {
			opacity: 1;
		}

		.color-picker-swatch-compact .color-picker-swatch-color {
			z-index: 2;
		}

		.color-picker-wrapper.compact .color-picker-hex {
			height: 20px;
			padding: 2px 6px;
			background: #0a0a0a;
			border: 1px solid var(--t-clr-border);
			font-size: 10px;
			width: 70px;
			margin-left: 4px;
		}

		.color-picker-wrapper.compact .color-picker-hex:hover {
			border-color: var(--t-clr-color);
		}

		.color-picker-wrapper.compact .color-picker-hex:focus {
			border-color: var(--t-clr-color-hover);
			color: #ffffff;
		}

		.color-picker-wrapper.compact .color-picker-label {
			padding: 0 6px;
			min-width: auto;
		}

		.color-picker-wrapper.compact .color-picker-label-line1,
		.color-picker-wrapper.compact .color-picker-label-line2 {
			font-size: 9px;
			line-height: 1.2;
		}

		.colorIO {
			padding-left: 12px;
			padding-right: 12px;
			background: #0a0a0a;
			height: 48px;
			display: flex;
			align-items: center;
			border-left: 1px solid var(--t-clr-border);
		}

		.color-picker-wrapper.standard .colorIO {
			height: 32px;
		}

		.color-picker-hex {
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
			font-size: 11px;
			background: transparent;
			border: none;
			color: var(--t-clr-color-hover);
			width: 80px;
			text-align: left;
			outline: none;
			font-weight: 500;
			letter-spacing: 0.5px;
		}

		.color-picker-wrapper.compact .color-picker-hex {
			width: 70px;
			font-size: 10px;
		}

		.color-picker-hex::selection {
			background: var(--t-clr-color);
			color: #000;
		}

		.color-picker-hex:focus {
			outline: none;
			color: #ffffff;
		}

		/* iro.js popover styling */
		.iro-popover {
			position: absolute;
			z-index: 10000;
			background: #1a1a1a;
			border: 1px solid var(--t-clr-border);
			border-radius: 4px;
			padding: 16px;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
			display: none;
			min-width: 240px;
		}

		.iro-popover.open {
			display: block;
		}

		.iro-container {
			margin-bottom: 12px;
		}

		.iro-format-buttons {
			display: flex;
			gap: 4px;
			margin-bottom: 12px;
			justify-content: center;
		}

		.iro-format-btn {
			background: #242424;
			border: 1px solid var(--t-clr-border);
			color: var(--t-clr-color);
			padding: 4px 8px;
			font-size: 10px;
			text-transform: uppercase;
			cursor: pointer;
			transition: var(--t-clr-transition);
			font-family: 'SF Mono', 'Monaco', monospace;
			letter-spacing: 0.5px;
		}

		.iro-format-btn.active {
			background: var(--t-clr-color);
			color: #000;
			border-color: var(--t-clr-color);
		}

		.iro-format-btn:hover:not(.active) {
			border-color: var(--t-clr-color);
		}

		.iro-swatches {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 6px;
			max-height: 120px;
			overflow-y: auto;
			margin-bottom: 12px;
			padding: 4px;
		}

		.iro-swatches::-webkit-scrollbar {
			width: 6px;
		}

		.iro-swatches::-webkit-scrollbar-track {
			background: #0a0a0a;
			border-radius: 3px;
		}

		.iro-swatches::-webkit-scrollbar-thumb {
			background: var(--t-clr-border);
			border-radius: 3px;
		}

		.iro-swatches::-webkit-scrollbar-thumb:hover {
			background: var(--t-clr-color);
		}

		.iro-swatch {
			width: 28px;
			height: 28px;
			border: 1px solid var(--t-clr-border);
			cursor: pointer;
			position: relative;
			transition: var(--t-clr-transition);
			background-image: linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
				linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999);
			background-size: 4px 4px;
			background-position: 0 0, 2px 2px;
			background-color: #fff;
		}

		.iro-swatch-color {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.iro-swatch:hover {
			transform: scale(1.1);
			border-color: var(--t-clr-color);
		}

		.iro-swatch.removable {
			border-color: #ff0041;
		}

		.iro-swatch-remove {
			position: absolute;
			top: -4px;
			right: -4px;
			width: 14px;
			height: 14px;
			background: #ff0041;
			border: 1px solid #000;
			border-radius: 50%;
			display: none;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			z-index: 10;
		}

		.iro-swatch.removable .iro-swatch-remove {
			display: flex;
		}

		.iro-swatch-remove svg {
			width: 8px;
			height: 8px;
			color: #fff;
		}

		.iro-actions {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.iro-actions-left {
			display: flex;
			gap: 4px;
		}

		.iro-save-icon,
		.iro-close-icon,
		.iro-clear-icon {
			background: #242424 !important;
			border: 1px solid var(--t-clr-border) !important;
			color: var(--t-clr-color) !important;
			padding: 6px !important;
			border-radius: 2px !important;
			cursor: pointer !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
			width: 28px !important;
			height: 28px !important;
			flex-shrink: 0 !important;
			transition: var(--t-clr-transition) !important;
		}

		.iro-save-icon:hover,
		.iro-close-icon:hover {
			background: var(--t-clr-color-hover) !important;
			color: #0a0a0a !important;
			border-color: var(--t-clr-color-hover) !important;
		}

		.iro-clear-icon {
			border-color: #ff0041 !important;
			color: #ff0041 !important;
		}

		.iro-clear-icon:hover {
			background: #ff0041 !important;
			color: #0a0a0a !important;
			border-color: #ff0041 !important;
		}

		.iro-close-icon {
			margin-top: 4px !important;
		}

		.iro-clear-icon {
			margin-top: 4px !important;
		}

		.iro-save-icon svg,
		.iro-close-icon svg,
		.iro-clear-icon svg {
			width: 16px !important;
			height: 16px !important;
		}

		.iro-modal-overlay {
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			width: 100% !important;
			height: 100% !important;
			background: rgba(0, 0, 0, 0.8) !important;
			z-index: 10001 !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
		}

		.iro-modal {
			background: #1a1a1a !important;
			border: 1px solid var(--t-clr-border) !important;
			border-radius: 4px !important;
			padding: 20px !important;
			min-width: 300px !important;
			max-width: 400px !important;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
		}

		.iro-modal-title {
			color: #ff0041 !important;
			font-size: 14px !important;
			font-weight: 500 !important;
			margin-bottom: 12px !important;
			text-transform: uppercase !important;
			letter-spacing: 0.5px !important;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
		}

		.iro-modal-message {
			color: var(--t-clr-color) !important;
			font-size: 12px !important;
			margin-bottom: 20px !important;
			line-height: 1.5 !important;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
		}

		.iro-modal-actions {
			display: flex !important;
			gap: 8px !important;
			justify-content: flex-end !important;
		}

		.iro-modal-btn {
			background: #242424 !important;
			border: 1px solid var(--t-clr-border) !important;
			color: var(--t-clr-color) !important;
			padding: 8px 16px !important;
			border-radius: 2px !important;
			cursor: pointer !important;
			font-size: 11px !important;
			text-transform: uppercase !important;
			letter-spacing: 0.5px !important;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
			transition: var(--t-clr-transition) !important;
		}

		.iro-modal-btn:hover {
			border-color: var(--t-clr-color) !important;
			color: var(--t-clr-color-hover) !important;
		}

		.iro-modal-btn.error {
			border-color: #ff0041 !important;
			color: #ff0041 !important;
		}

		.iro-modal-btn.error:hover {
			background: #ff0041 !important;
			color: #0a0a0a !important;
			border-color: #ff0041 !important;
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Static properties definition (Lit reactive properties)
	 * Using static properties instead of decorators for better Vitest compatibility
	 */
	static properties = {
		/**
		 * @property {string} value - Current color value in hex8 format (with alpha channel). Always stored as 8-character hex with alpha (#RRGGBBAA). Display format changes based on selected mode (HEXA/RGBA/HSLA) but internal storage remains hex8.
		 * @type {string}
		 * @default '#00ff41ff'
		 * @attribute value
		 * @reflects false
		 * @example
		 * <t-clr value="#ff6b35ff"></t-clr>
		 * <t-clr value="#00ff4180"></t-clr> <!-- 50% opacity -->
		 */
		value: { type: String },

		/**
		 * @property {string} label1 - First line of label text. Only displayed when 'label' is included in the elements attribute. Renders above label2 in uppercase, right-aligned, 10px font size, terminal green color.
		 * @type {string}
		 * @default 'Color'
		 * @attribute label1
		 * @reflects false
		 * @example
		 * <t-clr label1="Theme" elements="icon,label,swatch"></t-clr>
		 * <t-clr label1="Background" label2="Primary"></t-clr>
		 */
		label1: { type: String },

		/**
		 * @property {string} label2 - Second line of label text. Only displayed when 'label' is included in the elements attribute. Renders below label1 in uppercase, right-aligned, 10px font size, bright terminal green color (500 weight).
		 * @type {string}
		 * @default 'Picker'
		 * @attribute label2
		 * @reflects false
		 * @example
		 * <t-clr label2="Primary" elements="icon,label,swatch"></t-clr>
		 * <t-clr label1="Theme" label2="Accent"></t-clr>
		 */
		label2: { type: String },

		/**
		 * @property {boolean} disabled - Disabled state. When true, component becomes non-interactive with 25% opacity, grayscale filter, and pointer-events disabled. Affects all elements including popover trigger.
		 * @type {boolean}
		 * @default false
		 * @attribute disabled
		 * @reflects true
		 * @example
		 * <t-clr disabled></t-clr>
		 * <t-clr disabled value="#ff6b35ff"></t-clr>
		 */
		disabled: { type: Boolean, reflect: true },

		/**
		 * @property {('large'|'standard'|'compact')} variant - Size variant controlling height and spacing of component elements.
		 * @type {string}
		 * @default 'large'
		 * @attribute variant
		 * @reflects true
		 * @validation Must be one of: 'large', 'standard', 'compact'
		 * @details
		 * - **large**: 48px height, 12px padding, 24px icons (default)
		 * - **standard**: 32px height, 8px padding, 16px icons
		 * - **compact**: Minimal height, transparent background, 20px swatch only
		 * @example
		 * <t-clr variant="large"></t-clr>
		 * <t-clr variant="standard"></t-clr>
		 * <t-clr variant="compact"></t-clr>
		 */
		variant: { type: String, reflect: true },

		/**
		 * @property {string} elements - Comma-separated list of elements to render in exact order specified. Available elements: icon, label, swatch (mandatory), input. Elements render left-to-right in the order listed.
		 * @type {string}
		 * @default 'icon,label,swatch,input'
		 * @attribute elements
		 * @reflects false
		 * @validation Swatch element is mandatory and must be included. Other elements are optional.
		 * @details
		 * **Available Elements:**
		 * - **icon**: Palette icon (24px, terminal green, 70% opacity)
		 * - **label**: Two-line label (label1/label2 properties, 10px uppercase)
		 * - **swatch**: Color preview box (MANDATORY - opens picker on click)
		 * - **input**: Hex color input field (80px, monospace, read-only in component)
		 *
		 * **Order Matters**: Elements render in the exact order specified from left to right.
		 * @example
		 * <!-- Default order -->
		 * <t-clr elements="icon,label,swatch,input"></t-clr>
		 *
		 * <!-- Swatch first -->
		 * <t-clr elements="swatch,icon,label,input"></t-clr>
		 *
		 * <!-- Minimal: icon and swatch only -->
		 * <t-clr elements="icon,swatch"></t-clr>
		 *
		 * <!-- Label and swatch only -->
		 * <t-clr elements="label,swatch"></t-clr>
		 *
		 * <!-- All elements in reverse -->
		 * <t-clr elements="input,swatch,label,icon"></t-clr>
		 */
		elements: { type: String },

		/**
		 * @property {boolean} showClearButton - Controls visibility of "Clear All Swatches" button in picker popover. When enabled, displays a red trash icon button below save/close buttons that triggers a confirmation modal before deleting all custom swatches. Default swatches are never deleted.
		 * @type {boolean}
		 * @default false
		 * @attribute show-clear-button
		 * @reflects false
		 * @details
		 * - **Button Location**: Bottom of action button stack in picker popover
		 * - **Button Style**: Red background (#ff0041), trash icon, 24px square
		 * - **Confirmation Modal**: Shows count of swatches to be deleted with Cancel/Clear All buttons
		 * - **Affects**: Only custom swatches (saved to localStorage), not default 10 swatches
		 * - **Storage Key**: Clears 't-clr-custom-swatches' from localStorage
		 * @example
		 * <!-- Enable clear button -->
		 * <t-clr show-clear-button></t-clr>
		 *
		 * <!-- Full example with clear button -->
		 * <t-clr
		 *   value="#00ff41ff"
		 *   elements="icon,label,swatch,input"
		 *   show-clear-button>
		 * </t-clr>
		 */
		showClearButton: { type: Boolean, attribute: 'show-clear-button' },

		/**
		 * @property {boolean} showCloseButton - Controls visibility of close button in picker popover. Default is false; click outside to close.
		 * @type {boolean}
		 * @default false
		 * @attribute show-close-button
		 */
		showCloseButton: { type: Boolean, attribute: 'show-close-button' },

		/**
		 * @property {boolean} hidePresets - Hides the default preset swatches, showing only the color wheel and input.
		 * @type {boolean}
		 * @default false
		 * @attribute hide-presets
		 */
		hidePresets: { type: Boolean, attribute: 'hide-presets' },

		/**
		 * @property {array} swatches - Predefined color swatches array. Note: Currently not implemented - component uses default swatches (10 predefined) + custom swatches (user-added via localStorage) system instead. This property is included for spec compliance but has no effect.
		 * @type {array}
		 * @default []
		 * @attribute swatches
		 * @reflects false
		 * @deprecated Use custom swatches system instead (saved to localStorage with key 't-clr-custom-swatches')
		 * @example
		 * <!-- This property is ignored -->
		 * <t-clr swatches='["#ff0000", "#00ff00"]'></t-clr>
		 */
		swatches: { type: Array }
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (PRIVATE - underscore prefix)
	// ----------------------------------------------------------

	/** @private */
	_customIcon = null;

	/** @private */
	_colorPicker = null; // iro.js instance

	/** @private */
	_syncingColor = false;

	/** @private */
	_customSwatches = [];

	/** @private */
	_initTimeout = null;

	/** @private */
	_pickerId = null;

	/** @private */
	_pendingColorUpdate = null;

	/** @private */
	_currentMode = 'hex'; // hex | rgb | hsl

	/** @private */
	_popoverElement = null;

	/** @private */
	_isOpen = false;

	/** @private */
	_colorChangeDebounce = null;

	/** @private */
	_cmdKeyPressed = false;

	/** @private */
	_documentListeners = new Map();

	/** @private */
	_timers = new Set();

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

		// Initialize logger first
		this._logger = componentLogger.for(TColorPicker.tagName);

		// Log construction
		this._logger.debug('Component constructed');

		// Initialize reactive property default values
		this.value = '#00ff41ff';
		this.label1 = 'Color';
		this.label2 = 'Picker';
		this.disabled = false;
		this.variant = 'large';
		this.elements = 'icon,label,swatch,input';
		this.showClearButton = false;
		this.showCloseButton = false;
		this.hidePresets = false;
		this.swatches = [];

		// Bind event handlers
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this._handleKeyUp = this._handleKeyUp.bind(this);
		this._handleDocumentClick = this._handleDocumentClick.bind(this);

		// Generate unique ID for picker instance
		this._pickerId = `picker-${Math.random().toString(36).substr(2, 9)}`;

		// Load custom swatches
		this._loadCustomSwatches();
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

		// Add document listeners
		this._addDocumentListener('keydown', this._handleKeyDown);
		this._addDocumentListener('keyup', this._handleKeyUp);
		this._addDocumentListener('mousedown', this._handleDocumentClick);
	}

	/**
	 * Called when component is disconnected from DOM
	 * @lifecycle
	 */
	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');

		// Cleanup iro.js instance
		if (this._colorPicker) {
			this._colorPicker.off('color:change');
			this._colorPicker.off('input:change');
			this._colorPicker.off('color:init');
			this._colorPicker = null;
			this._logger.debug('Color picker instance cleaned up');
		}

		// Clear all timers
		this._timers.forEach(id => clearTimeout(id));
		this._timers.clear();
		this._logger.debug('All timers cleared', { count: this._timers.size });

		// Remove all document listeners
		this._documentListeners.forEach((listeners, event) => {
			listeners.forEach(({ handler, options }) => {
				document.removeEventListener(event, handler, options);
			});
		});
		this._documentListeners.clear();
		this._logger.debug('All document listeners removed');

		// Remove popover element
		if (this._popoverElement && this._popoverElement.parentNode) {
			this._popoverElement.parentNode.removeChild(this._popoverElement);
			this._popoverElement = null;
		}
	}

	/**
	 * Called after first render
	 * @lifecycle
	 * @param {Map} changedProperties
	 */
	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._logger.debug('First update complete', { changedProperties: Array.from(changedProperties.keys()) });

		// Post-render setup - iro.js initialization happens when picker opens
	}

	/**
	 * Called after every render
	 * @lifecycle
	 * @param {Map} changedProperties
	 */
	updated(changedProperties) {
		super.updated(changedProperties);
		this._logger.trace('Updated', { changedProperties: Array.from(changedProperties.keys()) });

		// Sync color with iro.js if value changed externally
		if (changedProperties.has('value') && !this._syncingColor && this._colorPicker) {
			this._syncColorToIro();
		}
	}

	// ----------------------------------------------------------
	// BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
	// ----------------------------------------------------------

	/**
	 * Set custom Phosphor icon for the picker
	 * @public
	 * @param {string} iconSvg - SVG string of Phosphor icon (must be a valid SVG element)
	 * @returns {void}
	 * @throws {Error} When iconSvg is not a valid string or not a valid SVG
	 * @example
	 * import { paintBucketIcon } from './utils/phosphor-icons.js';
	 * picker.setIcon(paintBucketIcon);
	 */
	setIcon(iconSvg) {
		this._logger.debug('setIcon called', { iconSvg: iconSvg?.substring(0, 50) });

		if (typeof iconSvg !== 'string') {
			const error = new Error('Icon must be a string');
			this._logger.error('setIcon validation failed', { iconSvg, error });
			throw error;
		}

		// Validate that the string is a valid SVG element
		const trimmed = iconSvg.trim();
		if (!trimmed.startsWith('<svg') || !trimmed.includes('</svg>')) {
			const error = new Error('Icon must be a valid SVG element starting with <svg> and ending with </svg>');
			this._logger.error('setIcon validation failed - not a valid SVG', { iconSvg: trimmed.substring(0, 100) });
			throw error;
		}

		// Additional XSS protection: check for script tags or event handlers
		const dangerousPatterns = [
			/<script/i,
			/javascript:/i,
			/on\w+\s*=/i  // onclick, onerror, onload, etc.
		];

		for (const pattern of dangerousPatterns) {
			if (pattern.test(iconSvg)) {
				const error = new Error('Icon contains potentially unsafe content (scripts or event handlers)');
				this._logger.error('setIcon validation failed - unsafe content detected', { pattern: pattern.source });
				throw error;
			}
		}

		this._customIcon = iconSvg;
		this.requestUpdate();
	}

	/**
	 * Set color value programmatically
	 * @public
	 * @param {string} color - Color in hex format (with or without alpha)
	 * @returns {void}
	 * @fires TColorPicker#change
	 * @example
	 * picker.setValue('#ff6b35');
	 * picker.setValue('#ff6b35ff');
	 */
	setValue(color) {
		this._logger.debug('setValue called', { color });

		this.value = color;
		this._emitEvent('change', { value: this.value, color: this.value });
	}

	/**
	 * Get current color value
	 * @public
	 * @returns {string} Current color in hex8 format
	 * @example
	 * const color = picker.getValue();
	 */
	getValue() {
		this._logger.debug('getValue called', { value: this.value });
		return this.value;
	}

	/**
	 * Clear all custom swatches (with confirmation modal if UI is open)
	 * @public
	 * @returns {void}
	 * @fires TColorPicker#swatches-cleared
	 * @example
	 * picker.clearAllCustomSwatches();
	 */
	clearAllCustomSwatches() {
		this._logger.debug('clearAllCustomSwatches called');

		this._customSwatches = [];
		localStorage.removeItem('terminal-iro-swatches');
		this._updateSwatchesDisplay();

		this._logger.info('All custom swatches cleared');
		this._emitEvent('swatches-cleared', {});
	}

	/**
	 * Add color to custom swatches
	 * @public
	 * @param {string} hex - Hex color to add
	 * @returns {void}
	 * @fires TColorPicker#swatch-added
	 * @example
	 * picker.addSwatch('#ff6b35');
	 */
	addSwatch(hex) {
		this._logger.debug('addSwatch called', { hex });

		if (!/^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex)) {
			this._logger.error('Invalid hex color', { hex });
			throw new Error('Invalid hex color format');
		}

		const hexValue = hex.startsWith('#') ? hex : `#${hex}`;

		// Check if already exists
		if (this._customSwatches.includes(hexValue)) {
			this._logger.debug('Color already in swatches');
			return;
		}

		// Add to custom swatches
		this._customSwatches.push(hexValue);

		// Limit to 20
		if (this._customSwatches.length > 20) {
			this._customSwatches.shift();
		}

		// Save to localStorage
		localStorage.setItem('terminal-iro-swatches', JSON.stringify(this._customSwatches));

		// Update display if popover is open
		if (this._popoverElement) {
			this._updateSwatchesDisplay();
		}

		// Emit event
		this._emitEvent('swatch-added', {
			color: hexValue,
			timestamp: Date.now()
		});

		this._emitEvent('swatches-updated', {
			swatches: [...this._customSwatches]
		});

		this._logger.info('Swatch added', { hex: hexValue });
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
	 * @event TColorPicker#change
	 * @type {CustomEvent<{value: string, color: string}>}
	 * @description Fired when color value changes (debounced to 250ms during drag)
	 * @property {string} detail.value - Hex8 color value
	 * @property {string} detail.color - Same as value (for compatibility)
	 * @bubbles true
	 * @composed true
	 */

	/**
	 * @event TColorPicker#color-save
	 * @type {CustomEvent<{color: string, timestamp: number}>}
	 * @description Fired when user clicks save button in picker
	 * @property {string} detail.color - Hex8 color value
	 * @property {number} detail.timestamp - Unix timestamp
	 * @bubbles true
	 * @composed true
	 */

	/**
	 * @event TColorPicker#swatches-updated
	 * @type {CustomEvent<{swatches: string[]}>}
	 * @description Fired when custom swatches array is modified
	 * @property {string[]} detail.swatches - Array of hex color values
	 * @bubbles true
	 * @composed true
	 */

	/**
	 * @event TColorPicker#swatches-cleared
	 * @type {CustomEvent<{}>}
	 * @description Fired when all custom swatches are cleared
	 * @bubbles true
	 * @composed true
	 */

	// ----------------------------------------------------------
	// BLOCK 10: NESTING SUPPORT (Minimal - not a container)
	// ----------------------------------------------------------

	/**
	 * Receive context from parent component (no-op for color picker)
	 * @public
	 * @param {Object} context - Context object from parent
	 */
	receiveContext(context) {
		this._logger.debug('Received context (no-op for color picker)', { context });
	}

	// ----------------------------------------------------------
	// BLOCK 11: VALIDATION
	// ----------------------------------------------------------

	/**
	 * Validate property value
	 * @private
	 * @param {string} propName - Property name to validate
	 * @param {*} value - Value to validate
	 * @returns {boolean} True if valid
	 */
	_validateProperty(propName, value) {
		const validation = this.constructor.getPropertyValidation(propName);
		if (!validation) return true;

		const result = validation.validate(value);
		if (!result.valid) {
			this._logger.warn('Property validation failed', {
				propName,
				value,
				errors: result.errors
			});
		}
		return result.valid;
	}

	/**
	 * Get validation rules for a property
	 * @static
	 * @param {string} propName - Property name
	 * @returns {Object|null} Validation object or null
	 */
	static getPropertyValidation(propName) {
		const validations = {
			variant: {
				validate: (value) => ({
					valid: ['large', 'standard', 'compact'].includes(value),
					errors: value ? [`Invalid variant: ${value}. Must be 'large', 'standard', or 'compact'`] : ['Variant is required']
				})
			},
			value: {
				validate: (value) => ({
					valid: /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value),
					errors: value ? [`Invalid hex color: ${value}`] : ['Color value is required']
				})
			}
		};
		return validations[propName] || null;
	}

	// ----------------------------------------------------------
	// BLOCK 12: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Render component template
	 * @returns {TemplateResult}
	 * @slot - No slots (self-contained component)
	 */
	render() {
		this._logger.trace('Rendering');

		const hasTransparency = this._hasTransparency();
		const iconToUse = this._customIcon || paletteIcon;
		const elementList = this.elements.split(',').map(e => e.trim());

		// Build element templates based on variant
		const elementTemplates = {
			icon: html`
				<div class="color-picker-icon">
					${unsafeHTML(iconToUse)}
				</div>
			`,
			label: html`
				<div class="color-picker-label">
					<span class="color-picker-label-line1">${this.label1}</span>
					<span class="color-picker-label-line2">${this.label2}</span>
				</div>
			`,
			swatch: this.variant === 'compact' ? html`
				<div class="color-picker-swatch-compact ${hasTransparency ? 'has-transparency' : ''}"
					 data-color="${this.value}"
					 @click=${this._showColorPicker}>
					<div class="color-picker-swatch-color" style="background: ${this.value}"></div>
				</div>
			` : html`
				<div class="color-picker-swatch ${hasTransparency ? 'has-transparency' : ''}"
					 data-color="${this.value}"
					 @click=${this._showColorPicker}>
					<div class="color-picker-swatch-color" style="background: ${this.value}">
						${this.disabled ? unsafeHTML(xIcon) : ''}
					</div>
				</div>
			`,
			input: this.variant === 'compact' ? html`
				<input
					type="text"
					class="color-picker-hex"
					.value=${this._formatColorForDisplay()}
					@change=${this._handleInputChange}
					@focus=${this._handleInputFocus}
					@blur=${this._handleInputBlur}
					?disabled=${this.disabled}
					spellcheck="false"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					maxlength="30"
				/>
			` : html`
				<div class="colorIO">
					<input
						type="text"
						class="color-picker-hex"
						.value=${this._formatColorForDisplay()}
						@change=${this._handleInputChange}
						@focus=${this._handleInputFocus}
						@blur=${this._handleInputBlur}
						?disabled=${this.disabled}
						spellcheck="false"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="off"
						maxlength="30"
					/>
				</div>
			`
		};

		// Render elements in the exact order specified - no filtering
		const renderedElements = elementList.map(element =>
			elementTemplates[element] || ''
		);

		return html`
			<div class="color-picker-wrapper ${this.variant} ${this.disabled ? 'disabled' : ''}">
				${renderedElements}
			</div>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 13: PRIVATE HELPERS (LAST)
	// ----------------------------------------------------------

	/**
	 * Add document event listener with tracking
	 * @private
	 */
	_addDocumentListener(event, handler, options = {}) {
		document.addEventListener(event, handler, options);

		if (!this._documentListeners.has(event)) {
			this._documentListeners.set(event, []);
		}
		this._documentListeners.get(event).push({ handler, options });

		this._logger.trace('Document listener added', { event });
	}

	/**
	 * Set timeout with tracking
	 * @private
	 */
	_setTimeout(callback, delay) {
		const id = setTimeout(() => {
			this._timers.delete(id);
			callback();
		}, delay);
		this._timers.add(id);
		this._logger.trace('Timer registered', { id, delay });
		return id;
	}

	/**
	 * Clear tracked timeout
	 * @private
	 */
	_clearTimeout(id) {
		clearTimeout(id);
		this._timers.delete(id);
		this._logger.trace('Timer cleared', { id });
	}

	/**
	 * Check if current color has transparency
	 * @private
	 */
	_hasTransparency() {
		if (this.value.length === 9) {
			const alpha = parseInt(this.value.slice(7, 9), 16);
			return alpha < 255;
		}
		return false;
	}

	/**
	 * Format color for display based on current mode
	 * @private
	 */
	_formatColorForDisplay() {
		if (!this.value) return '';

		try {
			if (this._currentMode === 'hex') {
				return this.value;
			} else if (this._currentMode === 'rgb') {
				return this._hexToRgbaString(this.value);
			} else if (this._currentMode === 'hsl') {
				return this._hexToHslaString(this.value);
			}
		} catch (e) {
			this._logger.error('Error formatting color', { error: e, value: this.value });
			return this.value;
		}
	}

	/**
	 * Convert hex to RGBA string
	 * @private
	 */
	_hexToRgbaString(hex) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const a = hex.length === 9 ? (parseInt(hex.slice(7, 9), 16) / 255).toFixed(2) : '1';
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	/**
	 * Convert hex to HSLA string
	 * @private
	 */
	_hexToHslaString(hex) {
		const r = parseInt(hex.slice(1, 3), 16) / 255;
		const g = parseInt(hex.slice(3, 5), 16) / 255;
		const b = parseInt(hex.slice(5, 7), 16) / 255;
		const a = hex.length === 9 ? (parseInt(hex.slice(7, 9), 16) / 255).toFixed(2) : '1';

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
				case g: h = ((b - r) / d + 2) / 6; break;
				case b: h = ((r - g) / d + 4) / 6; break;
			}
		}

		h = Math.round(h * 360);
		s = Math.round(s * 100);
		l = Math.round(l * 100);

		return `hsla(${h}, ${s}%, ${l}%, ${a})`;
	}

	/**
	 * Handle input field changes
	 * @private
	 */
	_handleInputChange(e) {
		const input = e.target.value.trim();
		this._logger.debug('Input change', { input });

		try {
			let hexValue = input;

			// Parse RGB/HSL format
			if (input.startsWith('rgba(') || input.startsWith('rgb(')) {
				hexValue = this._rgbaToHex(input);
			} else if (input.startsWith('hsla(') || input.startsWith('hsl(')) {
				hexValue = this._hslaToHex(input);
			}

			// Validate hex
			if (this._isValidHex(hexValue)) {
				this._syncingColor = true;
				this.value = hexValue;
				if (this._colorPicker) {
					this._colorPicker.color.hexString = hexValue;
				}
				this._syncingColor = false;
				this._emitEvent('change', { value: this.value, color: this.value });
			}
		} catch (error) {
			this._logger.warn('Invalid color input', { input, error });
		}
	}

	/**
	 * Handle input focus
	 * @private
	 */
	_handleInputFocus(e) {
		e.target.select();
	}

	/**
	 * Handle input blur
	 * @private
	 */
	_handleInputBlur(e) {
		// Reformat to current mode
		e.target.value = this._formatColorForDisplay();
	}

	/**
	 * Convert RGBA string to hex
	 * @private
	 */
	_rgbaToHex(rgba) {
		const match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9]*\.?[0-9]+)\s*)?\)/);
		if (!match) throw new Error('Invalid RGBA format');

		const r = parseInt(match[1]).toString(16).padStart(2, '0');
		const g = parseInt(match[2]).toString(16).padStart(2, '0');
		const b = parseInt(match[3]).toString(16).padStart(2, '0');
		const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : 'ff';

		return `#${r}${g}${b}${a}`;
	}

	/**
	 * Convert HSLA string to hex
	 * @private
	 */
	_hslaToHex(hsla) {
		const match = hsla.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9]*\.?[0-9]+)\s*)?\)/);
		if (!match) throw new Error('Invalid HSLA format');

		let h = parseInt(match[1]) / 360;
		let s = parseInt(match[2]) / 100;
		let l = parseInt(match[3]) / 100;
		const a = match[4] ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : 'ff';

		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		r = Math.round(r * 255).toString(16).padStart(2, '0');
		g = Math.round(g * 255).toString(16).padStart(2, '0');
		b = Math.round(b * 255).toString(16).padStart(2, '0');

		return `#${r}${g}${b}${a}`;
	}

	/**
	 * Validate hex color format
	 * @private
	 */
	_isValidHex(hex) {
		return /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hex);
	}

	/**
	 * Show color picker popover
	 * @private
	 */
	_showColorPicker(e) {
		if (this.disabled) return;

		this._logger.debug('Showing color picker');

		if (this._isOpen) {
			this._closeColorPicker();
			return;
		}

		// Create popover if not exists
		if (!this._popoverElement) {
			this._createPopover();
		}

		// Position popover next to the element
		const rect = this.getBoundingClientRect();
		const scrollY = window.scrollY || window.pageYOffset;
		const scrollX = window.scrollX || window.pageXOffset;
		this._popoverElement.style.top = `${rect.bottom + scrollY + 8}px`;
		this._popoverElement.style.left = `${rect.left + scrollX}px`;

		// Show popover
		this._popoverElement.classList.add('open');
		this._isOpen = true;

		// Initialize iro.js if not already
		if (!this._colorPicker) {
			this._initializeColorPicker();
		}

		// Sync current color
		this._syncColorToIro();

		// Update swatches display
		this._updateSwatchesDisplay();
	}

	/**
	 * Close color picker popover
	 * @private
	 */
	_closeColorPicker() {
		if (!this._isOpen) return;

		this._logger.debug('Closing color picker');

		if (this._popoverElement) {
			this._popoverElement.classList.remove('open');
		}
		this._isOpen = false;
	}

	/**
	 * Create popover element
	 * @private
	 */
	_createPopover() {
		this._logger.debug('Creating popover element');

		const popover = document.createElement('div');
		popover.className = 'iro-popover';
		popover.id = `popover-${this._pickerId}`;
		popover.innerHTML = `
			<div class="iro-container" id="picker-${this._pickerId}"></div>
			<div class="iro-controls">
				<div class="iro-format-buttons">
					<button class="iro-format-btn active" data-mode="hex">HEXA</button>
					<button class="iro-format-btn" data-mode="rgb">RGBA</button>
					<button class="iro-format-btn" data-mode="hsl">HSLA</button>
				</div>
				<input type="text" class="iro-hex-input" value="${this.value}" />
				<div class="iro-swatches-container">
					<div class="iro-swatches" id="swatches-${this._pickerId}"></div>
					<div class="iro-actions">
						<div class="iro-save-icon" title="Save to swatches">${floppyDiskIcon}</div>
						${this.showCloseButton ? `<div class="iro-close-icon" title="Close">${xIcon}</div>` : ''}
						${this.showClearButton ? `<div class="iro-clear-icon" title="Clear all swatches">${trashIcon}</div>` : ''}
					</div>
				</div>
			</div>
		`;

		document.body.appendChild(popover);
		this._popoverElement = popover;

		// Add event listeners
		const saveBtn = popover.querySelector('.iro-save-icon');
		if (saveBtn) {
			saveBtn.addEventListener('click', () => this._saveCurrentColor());
		}

		const closeBtn = popover.querySelector('.iro-close-icon');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this._closeColorPicker());
		}

		const clearBtn = popover.querySelector('.iro-clear-icon');
		if (clearBtn) {
			clearBtn.addEventListener('click', () => this._showClearConfirmation());
		}

		// Format buttons
		const formatButtons = popover.querySelectorAll('.iro-format-btn');
		formatButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const mode = btn.dataset.mode;
				this._setColorMode(mode);
				formatButtons.forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
			});
		});

		// Hex input - bidirectional sync
		const hexInput = popover.querySelector('.iro-hex-input');
		if (hexInput) {
			hexInput.addEventListener('input', (e) => {
				const value = e.target.value.trim();
				// Validate hex format
				if (/^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value)) {
					const hexValue = value.startsWith('#') ? value : `#${value}`;
					this.value = hexValue;
					if (this._colorPicker) {
						this._syncingColor = true;
						this._colorPicker.color.hexString = hexValue;
						this._syncingColor = false;
					}
				}
			});
		}
	}

	/**
	 * Initialize iro.js color picker
	 * @private
	 */
	_initializeColorPicker() {
		this._logger.debug('Initializing iro.js color picker');

		const container = document.getElementById(`picker-${this._pickerId}`);
		if (!container) {
			this._logger.error('Color picker container not found');
			return;
		}

		try {
			this._colorPicker = new iro.ColorPicker(container, {
				width: 180,
				color: this.value,
				layoutDirection: 'horizontal',
				layout: [
					{
						component: iro.ui.Box,
						options: {
							boxHeight: 180
						}
					},
					{
						component: iro.ui.Slider,
						options: {
							sliderType: 'hue',
							sliderSize: 20
						}
					},
					{
						component: iro.ui.Slider,
						options: {
							sliderType: 'alpha',
							sliderSize: 20
						}
					}
				]
			});

			// Bridge iro events to Lit events
			this._colorPicker.on('color:change', (color) => {
				this._handleIroColorChange(color, false);
			});

			// Handle live updates during drag
			this._colorPicker.on('input:change', (color) => {
				this._handleIroColorChange(color, true);
			});

			this._logger.debug('Color picker initialized');
		} catch (error) {
			this._logger.error('Failed to initialize color picker', { error });
		}
	}

	/**
	 * Handle iro.js color change
	 * @private
	 */
	_handleIroColorChange(color, isLiveUpdate = false) {
		if (this._syncingColor) return;

		// Update input field immediately during live updates
		if (isLiveUpdate) {
			// Debounce live updates to 4x per second (250ms)
			if (this._liveUpdateDebounce) {
				this._clearTimeout(this._liveUpdateDebounce);
			}

			this._liveUpdateDebounce = this._setTimeout(() => {
				if (this._popoverElement) {
					const hexInput = this._popoverElement.querySelector('.iro-hex-input');
					if (hexInput) {
						hexInput.value = this._formatColorForMode(this._currentMode || 'hex');
					}
				}
				this._liveUpdateDebounce = null;
			}, 250);
			return;
		}

		// Debounce final updates
		if (this._colorChangeDebounce) {
			this._clearTimeout(this._colorChangeDebounce);
		}

		this._colorChangeDebounce = this._setTimeout(() => {
			this._syncingColor = true;
			this.value = color.hex8String;

			// Update input field with current mode format
			if (this._popoverElement) {
				const hexInput = this._popoverElement.querySelector('.iro-hex-input');
				if (hexInput) {
					hexInput.value = this._formatColorForMode(this._currentMode || 'hex');
				}
			}

			this._syncingColor = false;

			this._emitEvent('change', {
				value: this.value,
				color: this.value
			});

			this._colorChangeDebounce = null;
		}, 250);
	}

	/**
	 * Sync color to iro.js
	 * @private
	 */
	_syncColorToIro() {
		if (!this._colorPicker || this._syncingColor) return;

		this._syncingColor = true;
		this._colorPicker.color.hexString = this.value;
		this._syncingColor = false;
	}

	/**
	 * Set color display mode
	 * @private
	 */
	_setColorMode(mode) {
		this._logger.debug('Setting color mode', { mode });
		this._currentMode = mode;

		// Update popover input field
		if (this._popoverElement) {
			const input = this._popoverElement.querySelector('.iro-hex-input');
			if (input && this._colorPicker) {
				input.value = this._formatColorForMode(mode);
			}
		}

		// Update input field in shadow root
		const input = this.shadowRoot.querySelector('.color-picker-hex');
		if (input) {
			input.value = this._formatColorForDisplay();
		}
	}

	/**
	 * Format color value according to mode
	 * @private
	 */
	_formatColorForMode(mode) {
		if (!this._colorPicker) return this.value;

		const color = this._colorPicker.color;

		switch (mode) {
			case 'hex':
				return color.hex8String;
			case 'rgb':
				return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
			case 'hsl':
				return `hsla(${Math.round(color.hsla.h)}, ${Math.round(color.hsla.s)}%, ${Math.round(color.hsla.l)}%, ${color.hsla.a})`;
			default:
				return color.hex8String;
		}
	}

	/**
	 * Save current color to swatches
	 * @private
	 */
	_saveCurrentColor() {
		this._logger.debug('Saving current color', { color: this.value });

		// Check if already exists
		if (this._customSwatches.includes(this.value)) {
			this._logger.debug('Color already in swatches');
			return;
		}

		// Add to custom swatches
		this._customSwatches.push(this.value);

		// Limit to 20
		if (this._customSwatches.length > 20) {
			this._customSwatches.shift();
		}

		// Save to localStorage
		localStorage.setItem('terminal-iro-swatches', JSON.stringify(this._customSwatches));

		// Update display
		this._updateSwatchesDisplay();

		// Emit event
		this._emitEvent('color-save', {
			color: this.value,
			timestamp: Date.now()
		});

		this._emitEvent('swatches-updated', {
			swatches: [...this._customSwatches]
		});
	}

	/**
	 * Load custom swatches from localStorage
	 * @private
	 */
	_loadCustomSwatches() {
		try {
			const saved = localStorage.getItem('terminal-iro-swatches');
			if (saved) {
				this._customSwatches = JSON.parse(saved);
				this._logger.debug('Loaded custom swatches', { count: this._customSwatches.length });
			}
		} catch (error) {
			this._logger.error('Failed to load custom swatches', { error });
			this._customSwatches = [];
		}
	}

	/**
	 * Update swatches display in popover
	 * @private
	 */
	_updateSwatchesDisplay() {
		if (!this._popoverElement) return;

		const container = this._popoverElement.querySelector(`#swatches-${this._pickerId}`);
		if (!container) return;

		// Hide entire swatches container if hidePresets is true
		const swatchesContainer = this._popoverElement.querySelector('.iro-swatches-container');
		if (swatchesContainer) {
			swatchesContainer.style.display = this.hidePresets ? 'none' : '';
		}

		if (this.hidePresets) return;

		// Default swatches
		const defaultSwatches = [
			'#00ff41ff', '#ff0041ff', '#0041ffff', '#ffcc00ff',
			'#ff00ffff', '#00ffffff', '#ffffffff', '#ccccccff',
			'#666666ff', '#333333ff', '#000000ff'
		];

		const allSwatches = [...defaultSwatches, ...this._customSwatches];

		container.innerHTML = allSwatches.map((swatch, index) => {
			const isCustom = index >= defaultSwatches.length;
			return `
				<div class="iro-swatch ${isCustom && this._cmdKeyPressed ? 'removable' : ''}"
					 data-color="${swatch}"
					 data-index="${index}">
					<div class="iro-swatch-color" style="background: ${swatch};"></div>
					${isCustom && this._cmdKeyPressed ? `<div class="iro-swatch-remove">${xIcon}</div>` : ''}
				</div>
			`;
		}).join('');

		// Add click listeners
		container.querySelectorAll('.iro-swatch').forEach(swatch => {
			swatch.addEventListener('click', (e) => {
				const color = swatch.dataset.color;
				const index = parseInt(swatch.dataset.index);

				// Remove if CMD pressed and custom swatch
				if (this._cmdKeyPressed && index >= defaultSwatches.length) {
					this._removeCustomSwatch(index - defaultSwatches.length);
				} else {
					// Apply color
					this._syncingColor = true;
					this.value = color;
					if (this._colorPicker) {
						this._colorPicker.color.hexString = color;
					}

					// Update input field with current mode format
					if (this._popoverElement) {
						const hexInput = this._popoverElement.querySelector('.iro-hex-input');
						if (hexInput) {
							hexInput.value = this._formatColorForMode(this._currentMode || 'hex');
						}
					}

					this._syncingColor = false;
					this._emitEvent('change', { value: this.value, color: this.value });
				}
			});
		});
	}

	/**
	 * Remove custom swatch by index
	 * @private
	 */
	_removeCustomSwatch(index) {
		this._logger.debug('Removing custom swatch', { index });

		this._customSwatches.splice(index, 1);
		localStorage.setItem('terminal-iro-swatches', JSON.stringify(this._customSwatches));
		this._updateSwatchesDisplay();

		this._emitEvent('swatches-updated', {
			swatches: [...this._customSwatches]
		});
	}

	/**
	 * Show clear confirmation modal
	 * @private
	 */
	_showClearConfirmation() {
		this._logger.debug('Showing clear confirmation modal');

		const modalOverlay = document.createElement('div');
		modalOverlay.className = 'iro-modal-overlay';
		modalOverlay.innerHTML = `
			<div class="iro-modal">
				<div class="iro-modal-title">Clear All Custom Swatches?</div>
				<div class="iro-modal-message">This will permanently delete all ${this._customSwatches.length} custom swatch${this._customSwatches.length !== 1 ? 'es' : ''}. This action cannot be undone.</div>
				<div class="iro-modal-actions">
					<button class="iro-modal-btn" data-action="cancel">Cancel</button>
					<button class="iro-modal-btn error" data-action="confirm">Clear All</button>
				</div>
			</div>
		`;

		const handleAction = (e) => {
			const action = e.target.dataset.action;
			if (action === 'confirm') {
				this.clearAllCustomSwatches();
			}
			document.body.removeChild(modalOverlay);
		};

		const cancelBtn = modalOverlay.querySelector('[data-action="cancel"]');
		const confirmBtn = modalOverlay.querySelector('[data-action="confirm"]');
		cancelBtn.addEventListener('click', handleAction);
		confirmBtn.addEventListener('click', handleAction);

		modalOverlay.addEventListener('click', (e) => {
			if (e.target === modalOverlay) {
				document.body.removeChild(modalOverlay);
			}
		});

		document.body.appendChild(modalOverlay);
	}

	/**
	 * Handle keydown events (CMD/Ctrl for swatch removal)
	 * @private
	 */
	_handleKeyDown(e) {
		if (e.key === 'Meta' || e.key === 'Control') {
			this._cmdKeyPressed = true;
			this._updateSwatchesDisplay();
		}

		// Close on Escape
		if (e.key === 'Escape' && this._isOpen) {
			this._closeColorPicker();
		}
	}

	/**
	 * Handle keyup events
	 * @private
	 */
	_handleKeyUp(e) {
		if (e.key === 'Meta' || e.key === 'Control') {
			this._cmdKeyPressed = false;
			this._updateSwatchesDisplay();
		}
	}

	/**
	 * Handle document clicks (close picker when clicking outside)
	 * @private
	 */
	_handleDocumentClick(e) {
		if (!this._isOpen) return;

		// Check if click is outside picker and popover
		if (!this.contains(e.target) &&
			(!this._popoverElement || !this._popoverElement.contains(e.target))) {
			this._closeColorPicker();
		}
	}
}

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(TColorPicker.tagName)) {
	customElements.define(TColorPicker.tagName, TColorPicker);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================

/**
 * Component manifest for TColorPicker
 * @type {Object}
 */
export const TColorPickerManifest = generateManifest(TColorPicker, {
	tagName: 't-clr',
	displayName: 'Color Picker',
	description: 'Advanced color picker component with iro.js integration, persistent custom swatches, and multiple color format support (HEXA, RGBA, HSLA)',
	version: '1.0.0',
	category: 'Form Controls',
	profile: 'FORM-ADVANCED',
	properties: {
		value: { description: 'Current color value in hex8 format (with alpha channel)' },
		label1: { description: 'First line of label text' },
		label2: { description: 'Second line of label text' },
		disabled: { description: 'Disabled state' },
		variant: {
			description: 'Size variant controlling height and spacing',
			enum: ['large', 'standard', 'compact']
		},
		elements: { description: 'Comma-separated list of elements to render in order' },
		showClearButton: { description: 'Controls visibility of "Clear All Swatches" button' },
		swatches: { description: 'Predefined color swatches array (currently not implemented)' }
	},
	methods: {
		setIcon: {
			params: ['iconSvg'],
			returns: 'void',
			description: 'Set custom Phosphor icon for the picker'
		},
		setValue: {
			params: ['color'],
			returns: 'void',
			description: 'Set color value programmatically'
		},
		getValue: {
			params: [],
			returns: 'string',
			description: 'Get current color value in hex8 format'
		},
		clearAllCustomSwatches: {
			params: [],
			returns: 'void',
			description: 'Clear all custom swatches with confirmation modal if UI is open'
		},
		addSwatch: {
			params: ['hex'],
			returns: 'void',
			description: 'Add color to custom swatches'
		}
	},
	events: {
		'change': {
			detail: '{value: string, color: string}',
			description: 'Fired when color value changes (250ms debounced during drag)'
		},
		'color-save': {
			detail: '{color: string, timestamp: number}',
			description: 'Fired when user clicks save button in picker'
		},
		'swatch-added': {
			detail: '{color: string, timestamp: number}',
			description: 'Fired when a new swatch is added to custom swatches'
		},
		'swatches-updated': {
			detail: '{swatches: string[]}',
			description: 'Fired when custom swatches array is modified'
		},
		'swatches-cleared': {
			detail: '{}',
			description: 'Fired when all custom swatches are cleared'
		}
	},
	slots: {},
	cssProperties: {
		'--t-clr-bg': { description: 'Background color (default: var(--terminal-bg, #242424))' },
		'--t-clr-border': { description: 'Border color (default: var(--terminal-border, #333333))' },
		'--t-clr-color': { description: 'Primary color (default: var(--terminal-green, #00cc33))' },
		'--t-clr-color-hover': { description: 'Hover color (default: var(--terminal-green-bright, #00ff41))' },
		'--t-clr-transition': { description: 'Transition timing (default: var(--terminal-transition, all 0.2s ease))' }
	}
});

// ============================================================
// SECTION 5: EXPORT (REQUIRED)
// ============================================================
export default TColorPicker;