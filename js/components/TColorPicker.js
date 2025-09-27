/**
 * TerminalColorPicker Web Component using iro.js and Lit
 */

import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { paletteIcon, xIcon, floppyDiskIcon, trashIcon } from '../utils/phosphor-icons.js';
import iro from '@jaames/iro';

// Debug mode
const DEBUG_MODE = window.TERMINAL_DEBUG || false;
const log = (...args) => DEBUG_MODE && console.log('[ColorPicker]', ...args);
const warn = (...args) => console.warn('[ColorPicker]', ...args);
const error = (...args) => console.error('[ColorPicker]', ...args);

export class TColorPicker extends LitElement {
	static get properties() {
		return {
			value: { type: String },
			label1: { type: String },
			label2: { type: String },
			disabled: { type: Boolean },
			variant: { type: String },
			elements: { type: String },
			customIcon: { type: String, attribute: 'custom-icon' },
			showClearButton: { type: Boolean, attribute: 'show-clear-button' }
		};
	}

	constructor() {
		super();
		log('Constructor called');

		// Initialize properties
		this.value = '#00ff41ff'; // Default with alpha
		this.label1 = 'Color';
		this.label2 = 'Picker';
		this.disabled = false;
		this.variant = 'large'; // large | standard | compact
		this.elements = 'icon,label,swatch,input'; // Comma-separated list of elements in order
		this.customIcon = null;
		this.showClearButton = false;

		// Initialize state
		this.colorPicker = null;
		this.hueSlider = null;
		this.alphaSlider = null;
		this._syncingColor = false;
		this.customSwatches = [];
		this._initTimeout = null;
		this._pickerId = null;
		this._pendingColorUpdate = null;
		this._currentMode = 'hex'; // hex, rgb, hsl
		this._popoverElement = null;
		this._isOpen = false;
		this._colorChangeDebounce = null;

		// Load custom swatches
		this.loadCustomSwatches();
	}

	static styles = css`
		.color-picker-wrapper {
			display: flex;
			align-items: center;
			height: 48px;
			background: #242424;
			border: none;
			position: relative;
			transition: all 0.2s ease;
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
			color: #00cc33;
			opacity: 0.7;
			transition: all 0.2s ease;
		}

		.color-picker-wrapper.standard .color-picker-icon {
			min-width: 32px;
			height: 32px;
			padding: 8px;
		}

		.color-picker-icon svg {
			width: 100%;
			height: 100%;
		}

		.color-picker-wrapper:hover .color-picker-icon {
			color: #00ff41;
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
			color: #00cc33;
			font-weight: normal;
		}

		.color-picker-label-line2 {
			color: #00ff41;
			font-weight: 500;
		}

		.color-picker-swatch {
			width: 48px;
			height: 48px;
			min-width: 48px;
			min-height: 48px;
			border-left: 1px solid #333333;
			border-right: 1px solid #333333;
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

		.color-picker-wrapper.compact .color-picker-swatch {
			width: 32px;
		}

		.color-picker-swatch-compact {
			width: 20px;
			height: 20px;
			min-width: 20px;
			min-height: 20px;
			border: none;
			cursor: pointer;
			position: relative;
			transition: all 0.2s ease;
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
			background-size: 8px 8px;
			background-position: 0 0, 4px 4px;
			background-color: #fff;
			z-index: 1;
			opacity: 0;
			transition: opacity 0.2s ease;
		}

		.color-picker-swatch-xs.has-transparency::before {
			opacity: 1;
		}

		.color-picker-swatch-xs .color-picker-swatch-color {
			position: relative;
			z-index: 2;
		}

		.color-picker-swatch-xs:hover {
			box-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
		}

		.color-picker-swatch-color {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 12px;
			position: relative;
			z-index: 2;
		}

		.colorIO {
			margin-left: 12px;
			margin-right: 12px;
		}

		.color-picker-hex {
			width: 80px;
			height: 28px;
			padding: 0 8px;
			border: 1px solid #333333;
			background: #1a1a1a;
			color: #00ff41;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
			font-size: 11px;
			transition: all 0.2s ease;
		}

		.color-picker-wrapper.compact .color-picker-hex {
			width: 70px;
			height: 20px;
			padding: 0 6px;
			font-size: 10px;
		}

		.color-picker-hex:focus {
			outline: none;
			border-color: #00cc33;
		}

		.color-picker-wrapper.error .color-picker-hex {
			border-color: #ff0041;
			color: #ff0041;
		}

		/* Popover Styles */
		:host {
			--iro-color: #00ff41;
		}

		/* Global popover styles injected into document */
		.iro-popover {
			position: fixed !important;
			background: #1a1a1a !important;
			border: 1px solid #333333 !important;
			border-radius: 4px !important;
			padding: 12px !important;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
			z-index: 10000 !important;
			min-width: 300px !important;
		}

		.iro-picker-container {
			display: flex !important;
			gap: 16px !important;
			align-items: flex-start !important;
		}

		.iro-picker-main {
			flex-shrink: 0 !important;
		}

		.iro-sliders-vertical {
			display: flex !important;
			flex-direction: column !important;
			gap: 12px !important;
		}

		.iro-individual-slider {
			display: flex !important;
			justify-content: center !important;
		}

		.iro-individual-slider .IroColorPicker {
			background: transparent !important;
		}

		.iro-individual-slider .IroSlider {
			width: 20px !important;
			height: 80px !important;
			border: none !important;
			background: transparent !important;
			border-radius: 4px !important;
			overflow: hidden !important;
		}

		.iro-controls {
			display: flex !important;
			flex-direction: column !important;
			gap: 12px !important;
			min-width: 120px !important;
		}

		.iro-mode-selector {
			display: flex !important;
			gap: 4px !important;
		}

		.iro-mode-btn {
			background: #242424 !important;
			border: 1px solid #333333 !important;
			color: #00cc33 !important;
			padding: 4px 8px !important;
			font-size: 10px !important;
			border-radius: 2px !important;
			cursor: pointer !important;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
			transition: all 0.15s ease !important;
			text-transform: uppercase !important;
		}

		.iro-mode-btn.active {
			background: #00ff41 !important;
			color: #0a0a0a !important;
			border-color: #00ff41 !important;
		}

		.iro-mode-btn:hover:not(.active) {
			border-color: #00cc33 !important;
			color: #00ff41 !important;
		}

		.iro-color-input {
			background: #0a0a0a !important;
			border: 1px solid #333333 !important;
			color: #00ff41 !important;
			padding: 3px 4px !important;
			border-radius: 2px !important;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
			font-size: 9px !important;
			width: 100% !important;
			transition: all 0.2s ease !important;
		}

		.iro-color-input:focus {
			outline: none !important;
			border-color: #00cc33 !important;
			box-shadow: none !important;
		}

		.iro-swatches-container {
			display: flex !important;
			flex-direction: column !important;
			gap: 8px !important;
		}

		.iro-swatches {
			display: grid !important;
			grid-template-columns: repeat(5, 20px) !important;
			gap: 4px !important;
			max-height: 132px !important;
			overflow-y: scroll !important;
			align-content: start !important;
			padding-right: 4px !important;
			padding-bottom: 2px !important;
		}

		.iro-swatches::-webkit-scrollbar {
			width: 6px !important;
		}

		.iro-swatches::-webkit-scrollbar-track {
			background: #0a0a0a !important;
			border-radius: 3px !important;
		}

		.iro-swatches::-webkit-scrollbar-thumb {
			background: #333333 !important;
			border-radius: 3px !important;
		}

		.iro-swatches::-webkit-scrollbar-thumb:hover {
			background: #00cc33 !important;
		}

		.iro-swatch-wrapper {
			position: relative !important;
			width: 20px !important;
			height: 20px !important;
		}

		.iro-swatch {
			width: 100% !important;
			height: 100% !important;
			border: 1px solid #333 !important;
			border-radius: 2px !important;
			cursor: pointer !important;
			position: relative !important;
		}

		.iro-swatch:hover {
			border-color: #00cc33 !important;
			transform: scale(1.05) !important;
		}

		.iro-swatch-remove {
			position: absolute !important;
			top: 0 !important;
			left: 0 !important;
			width: 100% !important;
			height: 100% !important;
			background: rgba(0, 0, 0, 0.7) !important;
			color: #00ff41 !important;
			border-radius: 2px !important;
			display: none !important;
			align-items: center !important;
			justify-content: center !important;
			font-size: 16px !important;
			font-weight: bold !important;
			cursor: pointer !important;
			z-index: 10 !important;
		}

		.iro-swatch-wrapper.cmd-hover .iro-swatch-remove {
			display: flex !important;
		}

		.iro-save-icon,
		.iro-close-icon,
		.iro-clear-icon {
			background: #242424 !important;
			border: 1px solid #333333 !important;
			color: #00cc33 !important;
			padding: 6px !important;
			border-radius: 2px !important;
			cursor: pointer !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
			width: 28px !important;
			height: 28px !important;
			flex-shrink: 0 !important;
			transition: all 0.15s ease !important;
		}

		.iro-save-icon:hover,
		.iro-close-icon:hover {
			background: #00ff41 !important;
			color: #0a0a0a !important;
			border-color: #00ff41 !important;
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
			border: 1px solid #333333 !important;
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
			color: #00cc33 !important;
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
			border: 1px solid #333333 !important;
			color: #00cc33 !important;
			padding: 8px 16px !important;
			border-radius: 2px !important;
			cursor: pointer !important;
			font-size: 11px !important;
			text-transform: uppercase !important;
			letter-spacing: 0.5px !important;
			font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
			transition: all 0.15s ease !important;
		}

		.iro-modal-btn:hover {
			border-color: #00cc33 !important;
			color: #00ff41 !important;
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

		.iro-swatches-actions {
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
		}
	`;

	render() {
		const hasTransparency = this._hasTransparency();
		const iconToUse = this.customIcon || paletteIcon;
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
					 @click=${this.showColorPicker}>
					<div class="color-picker-swatch-color" style="background: ${this.value}"></div>
				</div>
			` : html`
				<div class="color-picker-swatch ${hasTransparency ? 'has-transparency' : ''}"
					 data-color="${this.value}"
					 @click=${this.showColorPicker}>
					<div class="color-picker-swatch-color" style="background: ${this.value}">
						${this.disabled ? unsafeHTML(xIcon) : ''}
					</div>
				</div>
			`,
			input: this.variant === 'compact' ? html`
				<input
					type="text"
					class="color-picker-hex"
					.value="${this.value}"
					placeholder="#000000"
					maxlength="9"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					@input=${this._handleHexInput}
					@blur=${this._validateHex}
				/>
			` : html`
				<div class="colorIO">
					<input
						type="text"
						class="color-picker-hex"
						.value="${this.value}"
						placeholder="#000000"
						maxlength="9"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="off"
						spellcheck="false"
						@input=${this._handleHexInput}
						@blur=${this._validateHex}
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

	firstUpdated() {
		log('First updated - component rendered');
		// Component is now properly rendered with Lit
	}

	updated(changedProperties) {
		if (changedProperties.has('value') && this.colorPicker) {
			// Update color picker when value changes
			if (this.value && this.value !== this.colorPicker.color.hex8String) {
				try {
					this.colorPicker.color.hex8String = this.value;
				if (this.hueSlider) {
					this.hueSlider.color.hex8String = this.value;
				}
				if (this.alphaSlider) {
					this.alphaSlider.color.hex8String = this.value;
				}
				} catch (e) {
					log('Error updating color:', e);
				}
			}
		}
	}

	_handleHexInput(e) {
		this._debouncedHexInput(e.target.value);
	}

	_debouncedHexInput = this._debounce((value) => {
		const formatted = this.formatHex(value);
		if (this.isValidHex(formatted)) {
			this.updateColor(formatted, false);
			this.shadowRoot.querySelector('.color-picker-wrapper').classList.remove('error');
		} else {
			this.shadowRoot.querySelector('.color-picker-wrapper').classList.add('error');
		}
	}, 300);

	_validateHex() {
		const input = this.shadowRoot.querySelector('.color-picker-hex');
		const value = this.formatHex(input.value);

		if (this.isValidHex(value)) {
			this.updateColor(value);
			this.shadowRoot.querySelector('.color-picker-wrapper').classList.remove('error');
		} else {
			// Revert to last valid color
			input.value = this.value;
			this.shadowRoot.querySelector('.color-picker-wrapper').classList.remove('error');
		}
	}

	showColorPicker() {
		if (this.disabled) return;
		if (this._isOpen) return;

		// Create popover if it doesn't exist
		if (!this._popoverElement) {
			this.createPopover();
		}

		// Position popover
		const swatch = this.variant === 'compact'
			? this.shadowRoot.querySelector('.color-picker-swatch-compact')
			: this.shadowRoot.querySelector('.color-picker-swatch');

		if (swatch) {
			// Append to body FIRST so elements are in DOM
			if (!this._popoverElement.parentNode) {
				document.body.appendChild(this._popoverElement);
			}

			const rect = swatch.getBoundingClientRect();
			this._popoverElement.style.position = 'fixed';
			this._popoverElement.style.top = `${rect.bottom + 10}px`;
			this._popoverElement.style.left = `${rect.left}px`;
			this._popoverElement.style.zIndex = '10000';
			this._popoverElement.style.visibility = 'hidden';
			this._popoverElement.style.display = 'block';

			// Initialize iro.js (elements now in DOM)
			if (!this.colorPicker) {
				this.initializeColorPicker();
			}

			// Show popover AFTER initialization to prevent FOUC
			requestAnimationFrame(() => {
				this._popoverElement.style.visibility = 'visible';
				this._popoverElement.classList.add('initialized');
			});
		}

		this._isOpen = true;

		// Add mousedown outside listener (not click/mouseup to avoid closing during drag)
		setTimeout(() => {
			document.addEventListener('mousedown', this.handleOutsideClick);
		}, 100);
	}

	hideColorPicker() {
		if (!this._isOpen) return;

		if (this._popoverElement) {
			this._popoverElement.style.display = 'none';
			// Remove from DOM to prevent any leaking
			if (this._popoverElement.parentNode) {
				this._popoverElement.parentNode.removeChild(this._popoverElement);
			}
		}

		this._isOpen = false;
		document.removeEventListener('mousedown', this.handleOutsideClick);
	}

	handleOutsideClick = (e) => {
		if (this._popoverElement && !this._popoverElement.contains(e.target) &&
			!this.contains(e.target)) {
			this.hideColorPicker();
		}
	}

	createPopover() {
		// Generate unique ID
		if (!this._pickerId) {
			this._pickerId = this._generateId();
		}

		// Inject global popover styles if not already injected
		this._injectGlobalStyles();

		// Create popover element with proper horizontal layout
		this._popoverElement = document.createElement('div');
		this._popoverElement.className = `iro-popover terminal-picker-${this._pickerId}`;
		this._popoverElement.style.display = 'none'; // Hidden by default
		this._popoverElement.innerHTML = `
			<div class="iro-picker-container">
				<div class="iro-picker-main" id="picker-${this._pickerId}"></div>
				<div class="iro-controls">
					<div class="iro-mode-selector">
						<button class="iro-mode-btn active" data-mode="hex">HEXA</button>
						<button class="iro-mode-btn" data-mode="rgb">RGBA</button>
						<button class="iro-mode-btn" data-mode="hsl">HSLA</button>
					</div>
					<div class="iro-input-group">
						<input type="text" class="iro-color-input" id="color-input-${this._pickerId}">
					</div>
					<div class="iro-swatches-container">
						<div class="iro-swatches-row">
							<div class="iro-swatches" id="swatches-${this._pickerId}"></div>
							<div class="iro-swatches-actions">
								<button class="iro-save-icon" id="save-btn-${this._pickerId}" title="Save to Swatches">
									${floppyDiskIcon}
								</button>
								<button class="iro-close-icon" id="close-btn-${this._pickerId}" title="Close">
									${xIcon}
								</button>
								${this.showClearButton ? `
								<button class="iro-clear-icon" id="clear-btn-${this._pickerId}" title="Clear All Custom Swatches">
									${trashIcon}
								</button>
								` : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		// Don't append to body yet - will be done when shown

		// Add event listeners for mode buttons
		const modeButtons = this._popoverElement.querySelectorAll('.iro-mode-btn');
		modeButtons.forEach(btn => {
			btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
		});

		// Add save icon listener
		const saveBtn = this._popoverElement.querySelector('.iro-save-icon');
		if (saveBtn) {
			saveBtn.addEventListener('click', () => this.saveCurrentColor());
		}

		// Add close icon listener
		const closeBtn = this._popoverElement.querySelector('.iro-close-icon');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this.hideColorPicker());
		}

		// Add clear icon listener
		const clearBtn = this._popoverElement.querySelector('.iro-clear-icon');
		if (clearBtn) {
			clearBtn.addEventListener('click', () => this.showClearConfirmation());
		}

		// Add input listener
		const colorInput = this._popoverElement.querySelector('.iro-color-input');
		if (colorInput) {
			colorInput.addEventListener('input', (e) => this.handleColorInput(e.target.value));
		}
	}

	initializeColorPicker() {
		if (this.colorPicker || !this._popoverElement) return;

		const pickerId = `picker-${this._pickerId}`;
		const pickerElement = document.getElementById(pickerId);

		if (!pickerElement) {
			warn('Picker element not found');
			return;
		}

		log('Initializing iro.js color picker');

		try {
			// Parse initial color
			const initialColor = this.value || '#00ff41ff';

			// Create iro color picker with Box + Sliders in horizontal layout
			this.colorPicker = new iro.ColorPicker(pickerElement, {
				width: 180,
				color: initialColor,
				layoutDirection: 'horizontal',
				borderWidth: 0,
				borderColor: 'transparent',
				handleRadius: 8,
				handleColor: '#ffffff',
				handleBorderColor: '#000000',
				handleBorderWidth: 2,
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

			// Set up event listeners
			this.colorPicker.on('color:change', (color) => {
				this.onColorChange(color);
			});

			// Update swatches
			this.updateSwatchesDisplay();

			// Update input with current color
			this.updateColorInput();

			// Add initialized classes to prevent FOUC
			setTimeout(() => {
				if (pickerElement) {
					pickerElement.classList.add('initialized');
				}
			}, 50);

		} catch (err) {
			error('Error initializing iro.js:', err);
			this.colorPicker = null;
		}
	}

	onColorChange(color) {
		const hexValue = color.hex8String;

		// Debounce color updates during drag (250ms = 4 times per second)
		if (this._colorChangeDebounce) {
			clearTimeout(this._colorChangeDebounce);
		}

		this._colorChangeDebounce = setTimeout(() => {
			this.updateColor(hexValue);
			this._colorChangeDebounce = null;
		}, 250);

		// Always update input immediately for visual feedback
		this.updateColorInput();
	}

	updateColorInput() {
		if (!this.colorPicker || !this._popoverElement) return;

		const input = this._popoverElement.querySelector('.iro-color-input');
		if (!input) return;

		const color = this.colorPicker.color;
		let value;

		switch (this._currentMode) {
			case 'rgb':
				value = `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${(color.rgba.a).toFixed(2)})`;
				break;
			case 'hsl':
				value = `hsla(${Math.round(color.hsla.h)}, ${Math.round(color.hsla.s)}%, ${Math.round(color.hsla.l)}%, ${(color.hsla.a).toFixed(2)})`;
				break;
			case 'hex':
			default:
				value = color.hex8String;
				break;
		}

		input.value = value;
	}

	handleColorInput(value) {
		if (!this.colorPicker) return;

		try {
			// Try to set the color
			this.colorPicker.color.set(value);
			this.updateColor(this.colorPicker.color.hex8String);
		} catch (e) {
			// Invalid color format
			log('Invalid color format:', value);
		}
	}

	switchMode(mode) {
		this._currentMode = mode;

		// Update active button
		const buttons = this._popoverElement.querySelectorAll('.iro-mode-btn');
		buttons.forEach(btn => {
			btn.classList.toggle('active', btn.dataset.mode === mode);
		});

		// Update input display
		this.updateColorInput();
	}

	// Utility: Debounce function
	_debounce(func, wait) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	// Utility: Generate unique ID
	_generateId(prefix = 'terminal') {
		return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
	}

	// Check if color has transparency
	_hasTransparency() {
		if (!this.value || typeof this.value !== 'string') return false;
		if (this.value.length === 9 && this.value.startsWith('#')) {
			const alpha = this.value.substring(7, 9);
			return alpha.toLowerCase() !== 'ff';
		}
		return false;
	}

	// Inject global styles for popover (since it's outside shadow DOM)
	_injectGlobalStyles() {
		if (document.getElementById('iro-popover-styles')) return;

		const style = document.createElement('style');
		style.id = 'iro-popover-styles';
		style.textContent = `
			.iro-popover {
				position: fixed !important;
				background: #1a1a1a !important;
				border: 1px solid #333333 !important;
				border-radius: 4px !important;
				padding: 12px !important;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8) !important;
				z-index: 10000 !important;
				min-width: 300px !important;
			}

			.iro-picker-container {
				display: flex !important;
				flex-direction: row !important;
				gap: 12px !important;
				align-items: flex-start !important;
			}

			.iro-picker-main {
				flex-shrink: 0 !important;
			}

			.iro-sliders-vertical {
				flex-shrink: 0 !important;
				display: flex !important;
				flex-direction: column !important;
				gap: 12px !important;
				background: transparent !important;
				align-items: center !important;
				width: 20px !important;
				min-height: 180px !important;
			}

			.iro-individual-slider {
				display: flex !important;
				justify-content: center !important;
			}

			.iro-individual-slider .IroColorPicker {
				background: transparent !important;
				height: 180px !important;
			}

			.iro-individual-slider .IroSlider {
				width: 20px !important;
				height: 180px !important;
				border: none !important;
				background: transparent !important;
				border-radius: 4px !important;
				overflow: hidden !important;
				position: relative !important;
			}

			.iro-individual-slider .IroSliderGradient {
				width: 100% !important;
				height: 100% !important;
				border-radius: 4px !important;
			}

			.iro-individual-slider .IroHandle {
				position: absolute !important;
				left: 50% !important;
				transform: translateX(-50%) !important;
				z-index: 10 !important;
			}

			.iro-controls {
				display: flex !important;
				flex-direction: column !important;
				gap: 12px !important;
				min-width: 120px !important;
			}

			.iro-mode-selector {
				display: flex !important;
				gap: 4px !important;
			}

			.iro-mode-btn {
				background: #242424 !important;
				border: 1px solid #333333 !important;
				color: #00cc33 !important;
				padding: 4px 8px !important;
				font-size: 10px !important;
				border-radius: 2px !important;
				cursor: pointer !important;
				font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
				transition: all 0.15s ease !important;
				text-transform: uppercase !important;
			}

			.iro-mode-btn.active {
				background: #00ff41 !important;
				color: #0a0a0a !important;
				border-color: #00ff41 !important;
			}

			.iro-mode-btn:hover:not(.active) {
				border-color: #00cc33 !important;
				color: #00ff41 !important;
			}

			.iro-color-input {
				background: #0a0a0a !important;
				border: 1px solid #333333 !important;
				color: #00ff41 !important;
				padding: 3px 4px !important;
				border-radius: 2px !important;
				font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
				font-size: 9px !important;
				width: 100% !important;
				transition: all 0.2s ease !important;
			}

			.iro-color-input:focus {
				outline: none !important;
				border-color: #00cc33 !important;
				box-shadow: none !important;
			}

			.iro-swatches-container {
				display: flex !important;
				flex-direction: column !important;
				gap: 8px !important;
			}

			.iro-swatches-row {
				display: flex !important;
				flex-direction: row !important;
				gap: 8px !important;
				align-items: flex-start !important;
			}

			.iro-swatches {
				display: grid !important;
				grid-template-columns: repeat(5, 20px) !important;
				gap: 4px !important;
				max-height: 132px !important;
				overflow-y: scroll !important;
				align-content: start !important;
				flex: 1 !important;
				padding-right: 4px !important;
				padding-bottom: 2px !important;
			}

			.iro-swatches::-webkit-scrollbar {
				width: 6px !important;
			}

			.iro-swatches::-webkit-scrollbar-track {
				background: #0a0a0a !important;
				border-radius: 3px !important;
			}

			.iro-swatches::-webkit-scrollbar-thumb {
				background: #333333 !important;
				border-radius: 3px !important;
			}

			.iro-swatches::-webkit-scrollbar-thumb:hover {
				background: #00cc33 !important;
			}

			.iro-swatch-wrapper {
				position: relative !important;
				width: 20px !important;
				height: 20px !important;
			}

			.iro-swatch {
				width: 100% !important;
				height: 100% !important;
				border: 1px solid #333 !important;
				border-radius: 2px !important;
				cursor: pointer !important;
				position: relative !important;
			}

			.iro-swatch:hover {
				border-color: #00cc33 !important;
				transform: scale(1.05) !important;
			}

			.iro-swatch-remove {
				position: absolute !important;
				top: 0 !important;
				left: 0 !important;
				width: 100% !important;
				height: 100% !important;
				background: rgba(0, 0, 0, 0.7) !important;
				color: #00ff41 !important;
				border-radius: 2px !important;
				display: none !important;
				align-items: center !important;
				justify-content: center !important;
				font-size: 16px !important;
				font-weight: bold !important;
				cursor: pointer !important;
				z-index: 10 !important;
			}

			.iro-swatch-wrapper.cmd-hover .iro-swatch-remove {
				display: flex !important;
			}

			.iro-save-icon,
			.iro-close-icon,
			.iro-clear-icon {
				background: #242424 !important;
				border: 1px solid #333333 !important;
				color: #00cc33 !important;
				padding: 6px !important;
				border-radius: 2px !important;
				cursor: pointer !important;
				display: flex !important;
				align-items: center !important;
				justify-content: center !important;
				flex-shrink: 0 !important;
				width: 28px !important;
				height: 28px !important;
				transition: all 0.15s ease !important;
			}

			.iro-save-icon:hover,
			.iro-close-icon:hover {
				background: #00ff41 !important;
				color: #0a0a0a !important;
				border-color: #00ff41 !important;
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
				border: 1px solid #333333 !important;
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
				color: #00cc33 !important;
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
				border: 1px solid #333333 !important;
				color: #00cc33 !important;
				padding: 8px 16px !important;
				border-radius: 2px !important;
				cursor: pointer !important;
				font-size: 11px !important;
				text-transform: uppercase !important;
				letter-spacing: 0.5px !important;
				font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace !important;
				transition: all 0.15s ease !important;
			}

			.iro-modal-btn:hover {
				border-color: #00cc33 !important;
				color: #00ff41 !important;
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

			.iro-swatches-actions {
				display: flex !important;
				flex-direction: column !important;
				gap: 0 !important;
			}

			/* Clean iro.js styling - remove all unwanted borders and backgrounds */
			.IroColorPicker {
				background: transparent !important;
				font-family: inherit !important;
			}

			.IroBox {
				border: 1px solid #333333 !important;
				border-radius: 3px !important;
				box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3) !important;
			}

			.IroSlider {
				border: none !important;
				box-shadow: none !important;
				border-radius: 4px !important;
				background: transparent !important;
				overflow: hidden !important;
				position: relative !important;
			}

			.IroSlider::before {
				content: '' !important;
				position: absolute !important;
				top: 0 !important;
				left: 0 !important;
				width: 100% !important;
				height: 100% !important;
				background-image: linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
					linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999) !important;
				background-size: 6px 6px !important;
				background-position: 0 0, 3px 3px !important;
				background-color: #fff !important;
				z-index: 0 !important;
				pointer-events: none !important;
			}

			.IroSliderGradient {
				border-radius: 4px !important;
				border: none !important;
			}

			.IroHandle {
				stroke: #ffffff !important;
				stroke-width: 2 !important;
				fill: transparent !important;
			}

			.IroHandle > * {
				fill: transparent !important;
			}

			.IroHandle:hover {
				stroke: #00ff41 !important;
			}

			.IroHandle circle,
			.IroHandle rect,
			.IroHandle path {
				fill: transparent !important;
			}

			.IroHandle circle {
				r: 8 !important;
			}
		`;
		document.head.appendChild(style);
	}

	updateColor(color, updateInput = true) {
		const formatted = this.formatHex(color);

		// Update internal state - this will trigger a re-render
		this.value = formatted;

		// Update iro picker if exists
		if (this.colorPicker && this.colorPicker.color.hex8String !== formatted) {
			try {
				this.colorPicker.color.hex8String = formatted;
				if (this.hueSlider) {
					this.hueSlider.color.hex8String = formatted;
				}
				if (this.alphaSlider) {
					this.alphaSlider.color.hex8String = formatted;
				}
			} catch (e) {
				this._pendingColorUpdate = formatted;
			}
		}

		// Emit events
		const changeEvent = new CustomEvent('change', {
			bubbles: true,
			composed: true,
			detail: {
				color: formatted,
				value: formatted
			}
		});
		this.dispatchEvent(changeEvent);

		// Also dispatch Lit-style event
		this.dispatchEvent(new CustomEvent('color-change', {
			bubbles: true,
			composed: true,
			detail: {
				color: formatted,
				value: formatted
			}
		}));
	}

	saveCurrentColor() {
		if (!this.colorPicker) return;

		const color = this.colorPicker.color.hex8String;
		this.addColorToSwatches(color);

		// Emit save event
		this.dispatchEvent(new CustomEvent('color-save', {
			bubbles: true,
			composed: true,
			detail: {
				color: color,
				timestamp: Date.now()
			}
		}));
	}

	addColorToSwatches(hex) {
		// Check if color already exists
		if (this.customSwatches.includes(hex)) {
			return;
		}

		// Add to custom swatches
		this.customSwatches.unshift(hex);

		// Limit to 20 custom swatches
		if (this.customSwatches.length > 20) {
			this.customSwatches = this.customSwatches.slice(0, 20);
		}

		// Save to localStorage
		this.saveCustomSwatches();

		// Update display
		this.updateSwatchesDisplay();
	}

	updateSwatchesDisplay() {
		if (!this._popoverElement) return;

		const container = this._popoverElement.querySelector('.iro-swatches');
		if (!container) return;

		// Default swatches
		const defaultSwatches = [
			'#00ff41ff', // Terminal green
			'#ff0041ff', // Terminal red
			'#0041ffff', // Terminal blue
			'#ffcc00ff', // Terminal yellow
			'#ff00ffff', // Terminal magenta
			'#00ffffff', // Terminal cyan
			'#ffffffff', // White
			'#ccccccff', // Light gray
			'#666666ff', // Medium gray
			'#333333ff', // Dark gray
			'#000000ff', // Black
		];

		// Combine with custom swatches
		const allSwatches = [...defaultSwatches, ...this.customSwatches];

		// Clear container
		container.innerHTML = '';

		// Create swatch elements with wrapper for X overlay
		allSwatches.forEach((color, index) => {
			const isCustom = index >= defaultSwatches.length;
			const swatchWrapper = document.createElement('div');
			swatchWrapper.className = 'iro-swatch-wrapper';

			const swatch = document.createElement('div');
			swatch.className = `iro-swatch ${isCustom ? 'custom' : 'default'}`;
			swatch.style.backgroundColor = color;
			swatch.title = isCustom ? 'Custom swatch - Click to apply, Cmd+Click to remove' : 'Click to apply';

			// Add X overlay for custom swatches
			if (isCustom) {
				const xOverlay = document.createElement('div');
				xOverlay.className = 'iro-swatch-remove';
				xOverlay.innerHTML = '×';
				swatchWrapper.appendChild(xOverlay);
			}

			swatchWrapper.appendChild(swatch);

			// Track cmd/ctrl key for visual feedback
			if (isCustom) {
				swatchWrapper.addEventListener('mouseenter', (e) => {
					if (e.metaKey || e.ctrlKey) {
						swatchWrapper.classList.add('cmd-hover');
					}
				});

				swatchWrapper.addEventListener('mouseleave', () => {
					swatchWrapper.classList.remove('cmd-hover');
				});
			}

			swatchWrapper.addEventListener('click', (e) => {
				e.stopPropagation();
				if (e.metaKey || e.ctrlKey) {
					if (isCustom) {
						e.preventDefault();
						this.removeColorFromSwatches(color);
						// Don't close the picker
						return false;
					}
				} else {
					// Apply color
					if (this.colorPicker) {
						this.colorPicker.color.hex8String = color;
					}
					this.updateColor(color);
				}
			});

			container.appendChild(swatchWrapper);
		});

		// Add global key listeners for CMD/Ctrl
		if (!this._keyListenersAdded) {
			this._keyListenersAdded = true;
			document.addEventListener('keydown', (e) => {
				if (e.metaKey || e.ctrlKey) {
					document.body.classList.add('cmd-pressed');
					// Update hover state for current element
					const hoveredWrapper = this._popoverElement?.querySelector('.iro-swatch-wrapper:hover');
					if (hoveredWrapper && hoveredWrapper.querySelector('.custom')) {
						hoveredWrapper.classList.add('cmd-hover');
					}
				}
			});

			document.addEventListener('keyup', (e) => {
				if (!e.metaKey && !e.ctrlKey) {
					document.body.classList.remove('cmd-pressed');
					// Remove all cmd-hover classes
					this._popoverElement?.querySelectorAll('.cmd-hover').forEach(el => {
						el.classList.remove('cmd-hover');
					});
				}
			});
		}
	}

	removeColorFromSwatches(color) {
		const index = this.customSwatches.indexOf(color);
		if (index > -1) {
			this.customSwatches.splice(index, 1);
			this.saveCustomSwatches();
			this.updateSwatchesDisplay();
		}
	}

	loadCustomSwatches() {
		try {
			const saved = localStorage.getItem('terminal-iro-swatches');
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					this.customSwatches = parsed.filter(c => this.isValidHex(c));
				} else {
					this.customSwatches = [];
				}
			} else {
				this.customSwatches = [];
			}
		} catch (e) {
			warn('Error loading custom swatches:', e);
			this.customSwatches = [];
		}
	}

	saveCustomSwatches() {
		try {
			if (Array.isArray(this.customSwatches)) {
				localStorage.setItem('terminal-iro-swatches', JSON.stringify(this.customSwatches));
				this.dispatchEvent(new CustomEvent('swatches-updated', {
					bubbles: true,
					composed: true,
					detail: { swatches: [...this.customSwatches] }
				}));
			}
		} catch (e) {
			warn('Error saving custom swatches:', e);
		}
	}

	setIcon(iconSvg) {
		this.customIcon = iconSvg;
		this.requestUpdate();
	}

	showClearConfirmation() {
		const modalOverlay = document.createElement('div');
		modalOverlay.className = 'iro-modal-overlay';
		modalOverlay.innerHTML = `
			<div class="iro-modal">
				<div class="iro-modal-title">Clear All Custom Swatches?</div>
				<div class="iro-modal-message">This will permanently delete all ${this.customSwatches.length} custom swatch${this.customSwatches.length !== 1 ? 'es' : ''}. This action cannot be undone.</div>
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

	clearAllCustomSwatches() {
		this.customSwatches = [];
		localStorage.removeItem('terminal-iro-swatches');
		this.updateSwatchesDisplay();
		log('All custom swatches cleared');
		this.dispatchEvent(new CustomEvent('swatches-cleared', {
			bubbles: true,
			composed: true
		}));
	}

	cleanupColorPicker() {
		if (this.colorPicker) {
			try {
				// iro.js doesn't have a destroy method, just null it
				this.colorPicker = null;
			} catch (e) {
				warn('Error cleaning up color picker:', e);
			}
		}
		if (this.hueSlider) {
			try {
				this.hueSlider = null;
			} catch (e) {
				warn('Error cleaning up hue slider:', e);
			}
		}
		if (this.alphaSlider) {
			try {
				this.alphaSlider = null;
			} catch (e) {
				warn('Error cleaning up alpha slider:', e);
			}
		}
	}

	onUnmount() {
		// Clear timeouts
		if (this._initTimeout) {
			clearTimeout(this._initTimeout);
			this._initTimeout = null;
		}

		// Remove popover
		if (this._popoverElement && this._popoverElement.parentNode) {
			this._popoverElement.parentNode.removeChild(this._popoverElement);
			this._popoverElement = null;
		}

		// Clean up color picker
		this.cleanupColorPicker();

		// Remove listeners
		document.removeEventListener('mousedown', this.handleOutsideClick);

		// Reset state
		this._pendingColorUpdate = null;
		this._pickerId = null;
		this._isOpen = false;
	}

	disconnectedCallback() {
		this.onUnmount();
		super.disconnectedCallback && super.disconnectedCallback();
	}

	// Override parent formatHex to always return 8-digit hex for iro.js
	formatHex(color) {
		if (!color || typeof color !== 'string') {
			return this.value || '#00ff41ff';
		}

		// Clean up the color string
		color = color.trim();

		// Handle hex colors
		if (color.startsWith('#')) {
			// Remove # and clean
			let hex = color.substring(1).replace(/[^0-9a-fA-F]/g, '');

			// Handle different hex formats
			if (hex.length === 3) {
				// RGB -> RGBA
				hex = hex.split('').map(c => c + c).join('') + 'ff';
			} else if (hex.length === 4) {
				// RGBA short -> RGBA full
				hex = hex.split('').map(c => c + c).join('');
			} else if (hex.length === 6) {
				// RGB -> RGBA (add full opacity)
				hex = hex + 'ff';
			} else if (hex.length !== 8) {
				// Invalid length, return default
				return this.value || '#00ff41ff';
			}

			return '#' + hex.toLowerCase();
		}

		// For other formats, return as-is
		return color;
	}

	// Override to check for 8-digit hex
	isValidHex(color) {
		if (!color || typeof color !== 'string') return false;

		// Check hex format (must be 8 digits for RGBA)
		if (color.startsWith('#')) {
			const hex = color.substring(1);
			return /^[0-9a-fA-F]{8}$/.test(hex);
		}

		// Could add RGB/HSL validation here if needed
		return true;
	}

	// Public API
	getValue() {
		return this.value;
	}

	setValue(color) {
		const formatted = this.formatHex(color);
		if (this.isValidHex(formatted)) {
			this.updateColor(formatted);
		}
	}

	setLabels(label1, label2) {
		this.label1 = label1;
		this.label2 = label2;
	}

	reset() {
		this.setValue('#00ff41ff');
	}

	// Lit lifecycle method
	disconnectedCallback() {
		super.disconnectedCallback();
		this.onUnmount();
	}

	disable() {
		this.disabled = true;
	}

	enable() {
		this.disabled = false;
	}
}

// Register the component
customElements.define('t-clr', TColorPicker);