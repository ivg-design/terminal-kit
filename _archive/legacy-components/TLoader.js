/**
 * TerminalLoader Web Component
 * Loading indicators with terminal/cyberpunk styling
 */

import { TComponent } from './TComponent.js';

export class TLoader extends TComponent {
	static get observedAttributes() {
		return ['type', 'size', 'text', 'color'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			type: 'spinner', // spinner, dots, bars
			size: 'medium', // xs, small, medium, large
			text: null, // Optional loading text
			color: null, // Custom color override
		});
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'type':
				this.setProp('type', newValue || 'spinner');
				break;
			case 'size':
				this.setProp('size', newValue || 'medium');
				break;
			case 'text':
				this.setProp('text', newValue);
				break;
			case 'color':
				this.setProp('color', newValue);
				break;
		}
	}

	get componentClass() {
		return 'terminal-loader';
	}

	template() {
		const { type, size, text, color } = this._props;

		// Build class list
		const classes = ['loader-wrapper'];
		classes.push(`loader-${size}`);

		// Custom color style
		let style = '';
		if (color) {
			style = `style="--loader-color: ${color};"`;
		}

		// Get loader content
		let loaderContent = '';
		switch (type) {
			case 'spinner':
				loaderContent = '<div class="loader-spinner"></div>';
				break;
			case 'dots':
				loaderContent = `
					<div class="loader-dots">
						<div class="dot dot-1"></div>
						<div class="dot dot-2"></div>
						<div class="dot dot-3"></div>
					</div>
				`;
				break;
			case 'bars':
				loaderContent = `
					<div class="loader-bars">
						<div class="bar bar-1"></div>
						<div class="bar bar-2"></div>
						<div class="bar bar-3"></div>
						<div class="bar bar-4"></div>
						<div class="bar bar-5"></div>
					</div>
				`;
				break;
			default:
				loaderContent = '<div class="loader-spinner"></div>';
		}

		// Add text if provided
		const textElement = text ? `<div class="loader-text">${text}</div>` : '';

		return `
			<div class="${classes.join(' ')}" ${style}>
				${loaderContent}
				${textElement}
			</div>
		`;
	}

	afterRender() {
		// Emit loader-start event when rendered
		this.emit('loader-start', {
			type: this.getProp('type'),
			size: this.getProp('size'),
			text: this.getProp('text'),
		});
	}

	// Public API
	setType(type) {
		if (['spinner', 'dots', 'bars'].includes(type)) {
			this.setProp('type', type);
			this.setAttribute('type', type);
		}
	}

	getType() {
		return this.getProp('type');
	}

	setSize(size) {
		if (['xs', 'small', 'medium', 'large'].includes(size)) {
			this.setProp('size', size);
			this.setAttribute('size', size);
		}
	}

	getSize() {
		return this.getProp('size');
	}

	setText(text) {
		this.setProp('text', text);
		if (text) {
			this.setAttribute('text', text);
		} else {
			this.removeAttribute('text');
		}
	}

	getText() {
		return this.getProp('text');
	}

	setColor(color) {
		this.setProp('color', color);
		if (color) {
			this.setAttribute('color', color);
		} else {
			this.removeAttribute('color');
		}
	}

	getColor() {
		return this.getProp('color');
	}

	// Show/hide the loader
	show() {
		this.style.display = 'flex';
		this.emit('loader-show', {
			type: this.getProp('type'),
			size: this.getProp('size'),
			text: this.getProp('text'),
		});
	}

	hide() {
		this.style.display = 'none';
		this.emit('loader-hide', {
			type: this.getProp('type'),
			size: this.getProp('size'),
			text: this.getProp('text'),
		});
	}

	// Toggle visibility
	toggle() {
		if (this.style.display === 'none') {
			this.show();
		} else {
			this.hide();
		}
	}

	// Check if loader is visible
	isVisible() {
		return this.style.display !== 'none';
	}

	// Update all properties at once
	update(options = {}) {
		const { type, size, text, color } = options;

		if (type) this.setType(type);
		if (size) this.setSize(size);
		if (text !== undefined) this.setText(text);
		if (color !== undefined) this.setColor(color);
	}
}

// Register the component
customElements.define('t-ldr', TLoader);
