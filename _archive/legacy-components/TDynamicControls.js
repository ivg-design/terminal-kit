/**
 * TerminalDynamicControls Web Component
 * Works with Rive parser blueprint format to generate controls
 * Supports: State Machines, ViewModels with nested hierarchy
 */

import { TComponent } from './TComponent.js';

class TDynamicControls extends TComponent {
	static get observedAttributes() {
		return ['schema', 'disabled'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			schema: null,
			disabled: false,
			values: {},
		});

		// Bind methods
		this.handleToggleChange = this.handleToggleChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.handleDropdownChange = this.handleDropdownChange.bind(this);
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'schema':
				try {
					const schema = JSON.parse(newValue);
					this.setSchema(schema);
				} catch (e) {
					console.error('Invalid schema JSON:', e);
				}
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
		}
	}

	template() {
		const { schema, disabled } = this._props;

		if (!schema) {
			return '<div class="dynamic-controls-empty">No controls defined</div>';
		}

		const controlsHtml = this.renderControls(schema);
		return `<div class="dynamic-controls ${disabled ? 'disabled' : ''}">${controlsHtml}</div>`;
	}

	renderControls(schema) {
		let html = '';

		// Render State Machine controls
		if (schema.stateMachines?.length > 0) {
			schema.stateMachines.forEach(sm => {
				html += this.renderStateMachine(sm);
			});
		}

		// Render ViewModel controls
		if (schema.viewModel) {
			html += this.renderViewModel(schema.viewModel, 0);
		}

		return html;
	}

	renderStateMachine(sm) {
		const { disabled } = this._props;
		const panelId = `sm-${sm.name.replace(/\s+/g, '-')}`;
		const inputCount = sm.inputs?.length || 0;

		// Build the inputs HTML
		let inputsHtml = '';
		if (inputCount > 0) {
			inputsHtml = sm.inputs.map(input => this.renderStateMachineInput(sm.name, input)).join('');
		} else {
			inputsHtml = '<div class="empty-message">No inputs</div>';
		}

		return `
			<terminal-panel
				id="${panelId}"
				title="${sm.name}"
				collapsible
				compact
			>
				<div slot="content" class="sm-controls">
					${inputsHtml}
				</div>
			</terminal-panel>
		`;
	}

	renderStateMachineInput(smName, input) {
		const { disabled } = this._props;
		const controlId = `sm-${smName}-${input.name}`.replace(/\s+/g, '-');
		const value = this.getValueByPath(`sm.${smName}.${input.name}`) ?? input.value ?? this.getDefaultValue(input.type);

		let controlHtml = '';
		switch (input.type) {
			case 'boolean':
				controlHtml = `
					<terminal-toggle
						id="${controlId}"
						name="sm.${smName}.${input.name}"
						variant="checkbox"
						${value ? 'checked' : ''}
						${disabled ? 'disabled' : ''}
						data-control-type="sm-boolean"
					></terminal-toggle>
				`;
				break;

			case 'number':
				const min = input.min ?? 0;
				const max = input.max ?? 100;
				const step = input.step ?? 1;
				controlHtml = `
					<terminal-input
						id="${controlId}"
						name="sm.${smName}.${input.name}"
						type="number"
						value="${value}"
						min="${min}"
						max="${max}"
						step="${step}"
						${disabled ? 'disabled' : ''}
						data-control-type="sm-number"
					></terminal-input>
				`;
				break;

			case 'trigger':
				controlHtml = `
					<terminal-button
						id="${controlId}"
						name="sm.${smName}.${input.name}"
						variant="primary"
						size="small"
						${disabled ? 'disabled' : ''}
						data-control-type="sm-trigger"
					>
						▶ Fire
					</terminal-button>
				`;
				break;

			default:
				controlHtml = `<div class="unsupported">Unsupported type: ${input.type}</div>`;
		}

		return `
			<div class="control-row">
				<label for="${controlId}" class="control-label">${input.name}</label>
				${controlHtml}
			</div>
		`;
	}

	renderViewModel(vm, depth = 0) {
		if (!vm || depth > 10) return '';

		const panelId = `vm-${vm.name}`.replace(/\s+/g, '-');
		const displayName = vm.blueprintName || vm.name || 'ViewModel';

		// Build the content - properties first, then nested VMs inside
		let contentHtml = '';

		// Add properties for this VM
		if (vm.properties && vm.properties.length > 0) {
			contentHtml += vm.properties.map(prop =>
				this.renderViewModelProperty(prop, vm.name)
			).join('');
		}

		// Add nested ViewModels INSIDE this VM's content
		if (vm.nestedViewModels && vm.nestedViewModels.length > 0) {
			contentHtml += vm.nestedViewModels.map(nestedVm =>
				this.renderViewModel(nestedVm, depth + 1)
			).join('');
		}

		// For nested VMs, wrap in a div with indentation
		if (depth > 0) {
			return `
				<div style="margin-left: ${depth * 20}px; border-left: 2px solid var(--terminal-green-dim); padding-left: 10px; margin-top: 10px;">
					<terminal-panel
						id="${panelId}"
						title="${displayName}"
						collapsible
						compact
					>
						<div slot="content" class="vm-controls">
							${contentHtml}
						</div>
					</terminal-panel>
				</div>
			`;
		}

		// Root level panel (no indentation)
		return `
			<terminal-panel
				id="${panelId}"
				title="${displayName}"
				collapsible
				compact
			>
				<div slot="content" class="vm-controls">
					${contentHtml}
				</div>
			</terminal-panel>
		`;
	}

	renderViewModelProperty(prop, vmName) {
		const { disabled } = this._props;
		const controlId = `vm-${vmName}-${prop.name}`.replace(/\s+/g, '-');
		const path = `vm.${vmName}.${prop.name}`;
		const value = this.getValueByPath(path) ?? prop.value ?? this.getDefaultValue(prop.type);

		let controlHtml = '';
		switch (prop.type) {
			case 'boolean':
				controlHtml = `
					<terminal-toggle
						id="${controlId}"
						name="${path}"
						variant="checkbox"
						${value ? 'checked' : ''}
						${disabled ? 'disabled' : ''}
						data-control-type="vm-boolean"
					></terminal-toggle>
				`;
				break;

			case 'number':
				controlHtml = `
					<terminal-input
						id="${controlId}"
						name="${path}"
						type="number"
						value="${value}"
						step="0.01"
						${disabled ? 'disabled' : ''}
						data-control-type="vm-number"
					></terminal-input>
				`;
				break;

			case 'string':
				controlHtml = `
					<terminal-input
						id="${controlId}"
						name="${path}"
						type="text"
						value="${value}"
						${disabled ? 'disabled' : ''}
						data-control-type="vm-string"
					></terminal-input>
				`;
				break;

			case 'color':
				const hexValue = this.argbToHex(value);
				controlHtml = `
					<terminal-color-picker
						id="${controlId}"
						name="${path}"
						value="${hexValue}"
						variant="minimal"
						${disabled ? 'disabled' : ''}
						data-control-type="vm-color"
					></terminal-color-picker>
				`;
				break;

			case 'enumType':
				const enumValues = prop.metadata?.enumValues || prop.values || [];
				const optionsHtml = enumValues.map(val =>
					`<option value="${val}">${val}</option>`
				).join('');
				controlHtml = `
					<terminal-dropdown
						id="${controlId}"
						name="${path}"
						value="${value}"
						search="false"
						icons="false"
						width="180px"
						${disabled ? 'disabled' : ''}
						data-control-type="vm-enum"
					>
						${optionsHtml}
					</terminal-dropdown>
				`;
				break;

			case 'trigger':
				controlHtml = `
					<terminal-button
						id="${controlId}"
						name="${path}"
						variant="primary"
						size="small"
						${disabled ? 'disabled' : ''}
						data-control-type="vm-trigger"
					>
						▶ Fire
					</terminal-button>
				`;
				break;

			default:
				controlHtml = `<div class="unsupported">Unsupported type: ${prop.type}</div>`;
		}

		return `
			<div class="control-row">
				<label for="${controlId}" class="control-label">${prop.name}</label>
				${controlHtml}
			</div>
		`;
	}

	afterRender() {
		// Listen to component events
		this.addEventListener('toggle-change', this.handleToggleChange);
		this.addEventListener('input-change', this.handleInputChange);
		this.addEventListener('color-change', this.handleColorChange);
		this.addEventListener('dropdown-change', this.handleDropdownChange);
		this.addEventListener('button-click', this.handleButtonClick);

		// No longer need native event listeners since we're using components
	}

	handleToggleChange(e) {
		const name = e.target.getAttribute('name');
		if (name) {
			this.updateValue(name, e.detail.checked);
		}
	}

	handleInputChange(e) {
		const name = e.target.getAttribute('name');
		const type = e.target.getAttribute('type');
		if (name) {
			let value = e.detail.value;
			if (type === 'number') {
				value = parseFloat(value) || 0;
			}
			this.updateValue(name, value);
		}
	}

	handleColorChange(e) {
		const name = e.target.getAttribute('name');
		if (name) {
			// Convert hex to ARGB for Rive
			const argb = this.hexToArgb(e.detail.value);
			this.updateValue(name, argb);
		}
	}

	handleDropdownChange(e) {
		const name = e.target.getAttribute('name');
		if (name) {
			this.updateValue(name, e.detail.value);
		}
	}

	handleButtonClick(e) {
		const button = e.target.closest('terminal-button');
		if (button) {
			const name = button.getAttribute('name');
			const type = button.getAttribute('data-control-type');
			if (name && (type === 'vm-trigger' || type === 'sm-trigger')) {
				this.emit('control-trigger', { path: name });
			}
		}
	}

	updateValue(path, value) {
		// Update internal state
		const values = { ...this.getProp('values') };
		this.setValueByPath(values, path, value);
		this.setProp('values', values);

		// Emit event WITHOUT re-rendering
		this.emit('control-change', { path, value });
	}

	getValueByPath(path) {
		if (!path) return undefined;
		const parts = path.split('.');
		let current = this.getProp('values');
		for (const part of parts) {
			current = current?.[part];
		}
		return current;
	}

	setValueByPath(obj, path, value) {
		const parts = path.split('.');
		let current = obj;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (!current[part]) {
				current[part] = {};
			}
			current = current[part];
		}

		current[parts[parts.length - 1]] = value;
	}

	getDefaultValue(type) {
		switch (type) {
			case 'boolean': return false;
			case 'number': return 0;
			case 'string': return '';
			case 'color': return 0xff00ff41; // Green in ARGB
			case 'enumType': return '';
			default: return null;
		}
	}

	// Use color conversion helpers from base class
	// These are inherited from TerminalComponent

	// Public API methods
	setSchema(schema) {
		this.setProp('schema', schema);
		// Initialize values for all controls
		const values = this.extractInitialValues(schema);
		this.setProp('values', values);
		this.render();
	}

	extractInitialValues(schema) {
		const values = {};

		// Extract State Machine values
		if (schema.stateMachines) {
			values.sm = {};
			schema.stateMachines.forEach(sm => {
				values.sm[sm.name] = {};
				sm.inputs?.forEach(input => {
					values.sm[sm.name][input.name] = input.value ?? this.getDefaultValue(input.type);
				});
			});
		}

		// Extract ViewModel values
		if (schema.viewModel) {
			values.vm = {};
			this.extractViewModelValues(schema.viewModel, values.vm);
		}

		return values;
	}

	extractViewModelValues(vm, target) {
		if (!vm) return;

		target[vm.name] = {};

		// Extract property values
		vm.properties?.forEach(prop => {
			target[vm.name][prop.name] = prop.value ?? this.getDefaultValue(prop.type);
		});

		// Extract nested VM values
		vm.nestedViewModels?.forEach(nestedVm => {
			this.extractViewModelValues(nestedVm, target);
		});
	}

	getValues() {
		return { ...this.getProp('values') };
	}

	setValues(values) {
		this.setProp('values', values);
		this.render();
	}

	disable() {
		this.setProp('disabled', true);
		this.render();
	}

	enable() {
		this.setProp('disabled', false);
		this.render();
	}

	// Method to update live values without re-rendering (for external updates)
	updateLiveValue(path, value) {
		const values = { ...this.getProp('values') };
		this.setValueByPath(values, path, value);
		this.setProp('values', values);

		// Find and update the actual control
		const element = this.$(`[name="${path}"]`);
		if (element) {
			const tagName = element.tagName.toLowerCase();

			switch (tagName) {
				case 'terminal-toggle':
					if (element.setChecked) {
						element.setChecked(!!value);
					}
					break;
				case 'terminal-input':
					if (element.setValue) {
						element.setValue(value);
					}
					break;
				case 'terminal-color-picker':
					if (element.setValue) {
						element.setValue(this.argbToHex(value));
					}
					break;
				case 'terminal-dropdown':
					if (element.setValue) {
						element.setValue(value);
					}
					break;
			}
		}
	}
}

// Register the component
if (!customElements.get('terminal-dynamic-controls')) {
	customElements.define('t-dyn', TDynamicControls);
}

// Export the class
export { TDynamicControls };
export default TDynamicControls;