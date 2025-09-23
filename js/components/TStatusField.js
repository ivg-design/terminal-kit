/**
 * TerminalStatusField Web Component
 * A simple field component for status bars
 */

import { TComponent } from './TComponent.js';

export class TStatusField extends TComponent {
	static get observedAttributes() {
		return ['label', 'value'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			label: '',
			value: '',
		});
	}

	get componentClass() {
		return 'terminal-status-field';
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'label':
				this.setProp('label', newValue || '');
				break;
			case 'value':
				this.setProp('value', newValue || '');
				break;
		}
	}

	template() {
		const { label, value } = this._props;

		return `
			<div class="status-item">
				<span class="status-label">${label}:</span>
				<span class="status-value">${value}</span>
			</div>
		`;
	}

	// Public API
	setLabel(label) {
		this.setProp('label', label);
		this.setAttribute('label', label);
	}

	setValue(value) {
		this.setProp('value', value);
		this.setAttribute('value', value);
	}

	getLabel() {
		return this.getProp('label');
	}

	getValue() {
		return this.getProp('value');
	}
}

// Register the component
customElements.define('t-sta-field', TStatusField);