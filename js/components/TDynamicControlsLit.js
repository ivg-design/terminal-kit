/**
 * @fileoverview TDynamicControlsLit - Dynamic Control Generator Component
 * @module components/TDynamicControlsLit
 * @version 3.1.0
 *
 * Generates form controls dynamically from a schema. General-purpose control
 * panel that can integrate most terminal-kit components. Originally designed
 * for Rive ViewModels, now supports any structured data.
 *
 * @example
 * <t-dynamic-controls></t-dynamic-controls>
 * // Then: element.setSchema(schemaObject)
 */

import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// CONSTANTS
// ============================================================

const tagName = 't-dynamic-controls';

// ============================================================
// COMPONENT: TDynamicControlsLit
// ============================================================

/**
 * @component TDynamicControlsLit
 * @tagname t-dynamic-controls
 * @description Dynamic control generator from schema definitions
 *
 * @fires control-change - When any control value changes
 * @fires control-trigger - When a trigger control is fired
 */
export class TDynamicControlsLit extends LitElement {
	// ============================================================
	// BLOCK 1: Static Metadata
	// ============================================================

	static tagName = tagName;
	static version = '3.0.0';
	static category = 'Container';

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = css`
		:host {
			display: block;
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			--dyn-bg: var(--terminal-gray-darkest, #1a1a1a);
			--dyn-border: var(--terminal-gray-dark, #333);
			--dyn-color: var(--terminal-green, #00ff41);
			--dyn-text: var(--terminal-gray-light, #888);
			--dyn-indent: 8px;
			--dyn-label-width: 100px;
		}

		:host([disabled]) {
			opacity: 0.6;
			pointer-events: none;
		}

		:host([compact]) {
			--dyn-indent: 6px;
			--dyn-label-width: 80px;
		}

		.controls-container {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.empty-state {
			padding: 16px;
			text-align: center;
			color: var(--dyn-text);
			font-size: 11px;
		}

		/* Control sections */
		.section-header {
			display: flex;
			align-items: center;
			gap: 6px;
			padding: 6px 10px;
			background: rgba(0, 0, 0, 0.3);
			border-bottom: 1px solid var(--dyn-border);
			cursor: pointer;
			user-select: none;
		}

		.section-header:hover {
			background: rgba(0, 255, 65, 0.05);
		}

		.section-chevron {
			width: 12px;
			height: 12px;
			color: var(--dyn-color);
			transition: transform 0.15s ease;
			flex-shrink: 0;
		}

		.section-chevron.collapsed {
			transform: rotate(-90deg);
		}

		.section-title {
			flex: 1;
			font-size: 10px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			color: var(--dyn-color);
		}

		.section-badge {
			font-size: 9px;
			padding: 1px 5px;
			background: var(--dyn-color);
			color: var(--terminal-black, #0a0a0a);
			font-weight: 700;
		}

		.section-content {
			padding: 8px;
		}

		.section-content.collapsed {
			display: none;
		}

		.section {
			border: 1px solid var(--dyn-border);
			background: var(--dyn-bg);
		}

		/* Nested sections - collapsible */
		.nested-section {
			margin-top: 4px;
			margin-left: var(--dyn-indent);
			border-left: 2px solid color-mix(in srgb, var(--dyn-color) 30%, transparent);
			padding-left: var(--dyn-indent);
		}

		.nested-header {
			display: flex;
			align-items: center;
			gap: 4px;
			font-size: 9px;
			font-weight: 600;
			color: var(--dyn-color);
			margin-bottom: 4px;
			text-transform: uppercase;
			letter-spacing: 0.3px;
			cursor: pointer;
			user-select: none;
			padding: 2px 0;
		}

		.nested-header:hover {
			color: var(--terminal-green-bright, #00ff41);
		}

		.nested-chevron {
			width: 10px;
			height: 10px;
			transition: transform 0.15s ease;
			flex-shrink: 0;
		}

		.nested-chevron.collapsed {
			transform: rotate(-90deg);
		}

		.nested-content {
			display: block;
		}

		.nested-content.collapsed {
			display: none;
		}

		/* Control rows - responsive */
		.control-row {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 4px 0;
			border-bottom: 1px solid rgba(51, 51, 51, 0.3);
			position: relative;
		}

		.control-row:last-child {
			border-bottom: none;
		}

		.control-label {
			flex: 0 0 var(--dyn-label-width);
			min-width: 60px;
			font-size: 10px;
			color: var(--terminal-white, #fff);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.control-input {
			flex: 1;
			min-width: 80px;
		}

		/* Dropdown overflow fix */
		.control-input t-drp {
			width: 100%;
			--dropdown-menu-max-height: 150px;
			--dropdown-menu-position: fixed;
		}

		/* Color picker minimal variant */
		.control-input t-clr {
			width: auto;
		}

		/* Type indicator - right aligned */
		.type-badge {
			font-size: 8px;
			padding: 1px 3px;
			background: var(--dyn-border);
			color: var(--dyn-text);
			text-transform: uppercase;
			flex-shrink: 0;
			margin-left: auto;
		}

		/* Type filter dropdown */
		.type-filter {
			padding: 4px 8px;
			border-bottom: 1px solid var(--dyn-border);
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 10px;
			color: var(--dyn-text);
		}

		.type-filter t-drp {
			flex: 1;
			max-width: 150px;
		}

		/* Unsupported type */
		.unsupported {
			font-size: 10px;
			color: var(--terminal-red, #ff003c);
			font-style: italic;
		}

		/* Responsive adjustments */
		@container (max-width: 300px) {
			.control-row {
				flex-direction: column;
				align-items: flex-start;
				gap: 4px;
			}

			.control-label {
				flex: none;
				width: 100%;
			}

			.control-input {
				width: 100%;
				max-width: none;
			}
		}
	`;

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		/**
		 * Schema object defining controls
		 * @property schema
		 * @type {Object}
		 * @default null
		 */
		schema: {
			type: Object,
			hasChanged: () => true // Always re-render when schema is set
		},

		/**
		 * Disabled state
		 * @property disabled
		 * @type {Boolean}
		 * @default false
		 * @attribute disabled
		 * @reflects true
		 */
		disabled: { type: Boolean, reflect: true },

		/**
		 * Show type badges
		 * @property showTypes
		 * @type {Boolean}
		 * @default false
		 * @attribute show-types
		 */
		showTypes: { type: Boolean, attribute: 'show-types' },

		/**
		 * Compact mode
		 * @property compact
		 * @type {Boolean}
		 * @default false
		 * @attribute compact
		 * @reflects true
		 */
		compact: { type: Boolean, reflect: true },

		/**
		 * Show type filter dropdown
		 * @property showFilter
		 * @type {Boolean}
		 * @default false
		 * @attribute show-filter
		 */
		showFilter: { type: Boolean, attribute: 'show-filter' },

		/**
		 * Active type filter
		 * @property typeFilter
		 * @type {String}
		 * @default ''
		 */
		typeFilter: { type: String, attribute: 'type-filter' }
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/**
	 * @private
	 * @type {Object}
	 */
	_values = {};

	/**
	 * @private - Tracks collapsed top-level sections
	 * @type {Set<string>}
	 */
	_collapsedSections = new Set();

	/**
	 * @private - Tracks collapsed nested sections
	 * @type {Set<string>}
	 */
	_collapsedNested = new Set();

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/**
	 * @private
	 */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();
		this._logger = componentLogger.for('TDynamicControlsLit');
		this.schema = null;
		this.disabled = false;
		this.showTypes = false;
		this.compact = false;
		this.showFilter = false;
		this.typeFilter = '';
		this._logger.debug('Component constructed');
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProps) {
		if (changedProps.has('schema') && this.schema) {
			this._values = this._extractInitialValues(this.schema);
			this._logger.debug('Schema updated, values extracted');
		}
		this._logger.trace('Updated');
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Set the control schema
	 * @public
	 * @param {Object} schema - Schema definition
	 */
	setSchema(schema) {
		this._logger.debug('setSchema called', schema);
		this.schema = schema;
		this._values = this._extractInitialValues(schema);
		this.requestUpdate();
	}

	/**
	 * Get current values
	 * @public
	 * @returns {Object} Current control values
	 */
	getValues() {
		return { ...this._values };
	}

	/**
	 * Set values externally
	 * @public
	 * @param {Object} values - Values to set
	 */
	setValues(values) {
		this._logger.debug('setValues called');
		this._values = { ...values };
		this.requestUpdate();
	}

	/**
	 * Update a single value by path
	 * @public
	 * @param {String} path - Dot-notation path
	 * @param {*} value - New value
	 */
	updateValue(path, value) {
		this._logger.debug('updateValue', { path, value });
		this._setValueByPath(this._values, path, value);
		this.requestUpdate();
	}

	/**
	 * Enable controls
	 * @public
	 */
	enable() {
		this.disabled = false;
	}

	/**
	 * Disable controls
	 * @public
	 */
	disable() {
		this.disabled = true;
	}

	// ============================================================
	// BLOCK 9: Event Emitters
	// ============================================================

	/**
	 * @private
	 */
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	render() {
		this._logger.trace('render');

		if (!this.schema) {
			return html`<div class="empty-state">No schema defined</div>`;
		}

		return html`
			<div class="controls-container">
				${this._renderTypeFilter()}
				${this._renderStateMachines()}
				${this._renderViewModel()}
			</div>
		`;
	}

	/**
	 * @private
	 */
	_renderTypeFilter() {
		if (!this.showFilter) return '';

		const types = this._collectAllTypes();
		const options = [
			{ value: '', label: 'All types' },
			...types.map(t => ({ value: t, label: t }))
		];

		return html`
			<div class="type-filter">
				<span>Filter:</span>
				<t-drp
					size="sm"
					.value=${this.typeFilter}
					.options=${options}
					@dropdown-change=${(e) => { this.typeFilter = e.detail.value; }}
				></t-drp>
			</div>
		`;
	}

	/**
	 * @private - Collect all unique types from schema
	 */
	_collectAllTypes() {
		const types = new Set();

		const collectFromInputs = (inputs) => {
			inputs?.forEach(input => {
				if (input.type) types.add(input.type);
			});
		};

		const collectFromVM = (vm) => {
			if (!vm) return;
			collectFromInputs(vm.properties);
			vm.nestedViewModels?.forEach(nested => collectFromVM(nested));
		};

		this.schema?.stateMachines?.forEach(sm => collectFromInputs(sm.inputs));
		collectFromVM(this.schema?.viewModel);

		return Array.from(types).sort();
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * @private
	 */
	_renderStateMachines() {
		const sms = this.schema?.stateMachines;
		if (!sms || sms.length === 0) return '';

		return sms.map(sm => this._renderSection(
			`sm-${sm.name}`,
			sm.name,
			sm.inputs?.length || 0,
			sm.inputs?.map(input => this._renderControl(
				`sm.${sm.name}.${input.name}`,
				input.name,
				input.type,
				input
			)) || []
		));
	}

	/**
	 * @private
	 */
	_renderViewModel() {
		const vm = this.schema?.viewModel;
		if (!vm) return '';

		return this._renderViewModelSection(vm, 0);
	}

	/**
	 * @private
	 */
	_renderViewModelSection(vm, depth) {
		if (!vm || depth > 10) return '';

		const sectionId = `vm-${vm.name}`;
		const displayName = vm.blueprintName || vm.name;
		const propCount = vm.properties?.length || 0;

		const controls = vm.properties?.map(prop => this._renderControl(
			`vm.${vm.name}.${prop.name}`,
			prop.name,
			prop.type,
			prop
		)) || [];

		const nestedSections = vm.nestedViewModels?.map(nested =>
			this._renderNestedViewModel(nested, depth + 1)
		) || [];

		return this._renderSection(sectionId, displayName, propCount, [...controls, ...nestedSections]);
	}

	/**
	 * @private
	 */
	_renderNestedViewModel(vm, depth) {
		if (!vm || depth > 10) return '';

		const displayName = vm.blueprintName || vm.name;
		const nestedId = `nested-${vm.name}-${depth}`;
		const isCollapsed = this._collapsedNested.has(nestedId);

		const controls = vm.properties?.map(prop => this._renderControl(
			`vm.${vm.name}.${prop.name}`,
			prop.name,
			prop.type,
			prop
		)) || [];

		const nestedSections = vm.nestedViewModels?.map(nested =>
			this._renderNestedViewModel(nested, depth + 1)
		) || [];

		return html`
			<div class="nested-section">
				<div class="nested-header" @click=${() => this._toggleNested(nestedId)}>
					<svg class="nested-chevron ${isCollapsed ? 'collapsed' : ''}" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
					</svg>
					<span>${displayName}</span>
				</div>
				<div class="nested-content ${isCollapsed ? 'collapsed' : ''}">
					${controls}
					${nestedSections}
				</div>
			</div>
		`;
	}

	/**
	 * Toggle nested section collapse
	 * @private
	 */
	_toggleNested(id) {
		if (this._collapsedNested.has(id)) {
			this._collapsedNested.delete(id);
		} else {
			this._collapsedNested.add(id);
		}
		this.requestUpdate();
	}

	/**
	 * @private
	 */
	_renderSection(id, title, count, content) {
		const isCollapsed = this._collapsedSections.has(id);

		return html`
			<div class="section">
				<div class="section-header" @click=${() => this._toggleSection(id)}>
					<svg class="section-chevron ${isCollapsed ? 'collapsed' : ''}" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
					</svg>
					<span class="section-title">${title}</span>
					${count > 0 ? html`<span class="section-badge">${count}</span>` : ''}
				</div>
				<div class="section-content ${isCollapsed ? 'collapsed' : ''}">
					${content}
				</div>
			</div>
		`;
	}

	/**
	 * @private
	 */
	_renderControl(path, name, type, config) {
		// Apply type filter
		if (this.typeFilter && type !== this.typeFilter) {
			return '';
		}

		const value = this._getValueByPath(path);

		let controlHtml;
		switch (type) {
			case 'boolean':
				controlHtml = html`
					<t-tog
						size="sm"
						?checked=${!!value}
						?disabled=${this.disabled}
						@toggle-change=${(e) => this._handleValueChange(path, e.detail.checked)}
					></t-tog>
				`;
				break;

			case 'number':
				controlHtml = html`
					<t-inp
						type="number"
						size="sm"
						.value=${String(value ?? 0)}
						min=${config.min ?? ''}
						max=${config.max ?? ''}
						step=${config.step ?? 'any'}
						?disabled=${this.disabled}
						@input-change=${(e) => this._handleValueChange(path, parseFloat(e.detail.value) || 0)}
					></t-inp>
				`;
				break;

			case 'string':
				controlHtml = html`
					<t-inp
						type="text"
						size="sm"
						.value=${value ?? ''}
						?disabled=${this.disabled}
						@input-change=${(e) => this._handleValueChange(path, e.detail.value)}
					></t-inp>
				`;
				break;

			case 'color':
				controlHtml = html`
					<t-clr
						value=${this._argbToHex(value)}
						elements="swatch,input"
						variant="compact"
						?disabled=${this.disabled}
						@color-change=${(e) => this._handleValueChange(path, this._hexToArgb(e.detail.value))}
					></t-clr>
				`;
				break;

			case 'enumType':
				const options = config.metadata?.enumValues || config.values || [];
				controlHtml = html`
					<t-drp
						size="sm"
						.value=${value ?? ''}
						.options=${options.map(v => ({ value: v, label: v }))}
						?disabled=${this.disabled}
						@dropdown-change=${(e) => this._handleValueChange(path, e.detail.value)}
					></t-drp>
				`;
				break;

			case 'trigger':
				controlHtml = html`
					<t-btn
						variant="secondary"
						size="sm"
						?disabled=${this.disabled}
						@button-click=${() => this._handleTrigger(path)}
					>Fire</t-btn>
				`;
				break;

			case 'slider':
			case 'range':
				controlHtml = html`
					<t-sld
						size="sm"
						.value=${value ?? 0}
						min=${config.min ?? 0}
						max=${config.max ?? 100}
						step=${config.step ?? 1}
						?disabled=${this.disabled}
						@slider-change=${(e) => this._handleValueChange(path, e.detail.value)}
					></t-sld>
				`;
				break;

			case 'progress':
				controlHtml = html`
					<t-prg
						.value=${value ?? 0}
						max=${config.max ?? 100}
						size="sm"
						show-label
					></t-prg>
				`;
				break;

			case 'textarea':
				controlHtml = html`
					<t-textarea
						size="sm"
						.value=${value ?? ''}
						rows=${config.rows ?? 3}
						resize=${config.resize ?? 'vertical'}
						?disabled=${this.disabled}
						@textarea-change=${(e) => this._handleValueChange(path, e.detail.value)}
					></t-textarea>
				`;
				break;

			default:
				controlHtml = html`<span class="unsupported">Unsupported: ${type}</span>`;
		}

		return html`
			<div class="control-row">
				<label class="control-label">${name}</label>
				<div class="control-input">${controlHtml}</div>
				${this.showTypes ? html`<span class="type-badge">${type}</span>` : ''}
			</div>
		`;
	}

	/**
	 * @private
	 */
	_toggleSection(id) {
		if (this._collapsedSections.has(id)) {
			this._collapsedSections.delete(id);
		} else {
			this._collapsedSections.add(id);
		}
		this.requestUpdate();
	}

	/**
	 * @private
	 */
	_handleValueChange(path, value) {
		this._setValueByPath(this._values, path, value);
		this._emitEvent('control-change', { path, value, values: this.getValues() });
		this._logger.debug('Value changed', { path, value });
	}

	/**
	 * @private
	 */
	_handleTrigger(path) {
		this._emitEvent('control-trigger', { path });
		this._logger.debug('Trigger fired', { path });
	}

	/**
	 * @private
	 */
	_extractInitialValues(schema) {
		const values = {};

		// Extract State Machine values
		if (schema.stateMachines) {
			values.sm = {};
			schema.stateMachines.forEach(sm => {
				values.sm[sm.name] = {};
				sm.inputs?.forEach(input => {
					values.sm[sm.name][input.name] = input.value ?? this._getDefaultValue(input.type);
				});
			});
		}

		// Extract ViewModel values
		if (schema.viewModel) {
			values.vm = {};
			this._extractViewModelValues(schema.viewModel, values.vm);
		}

		return values;
	}

	/**
	 * @private
	 */
	_extractViewModelValues(vm, target) {
		if (!vm) return;

		target[vm.name] = {};

		vm.properties?.forEach(prop => {
			target[vm.name][prop.name] = prop.value ?? this._getDefaultValue(prop.type);
		});

		vm.nestedViewModels?.forEach(nestedVm => {
			this._extractViewModelValues(nestedVm, target);
		});
	}

	/**
	 * @private
	 */
	_getDefaultValue(type) {
		switch (type) {
			case 'boolean': return false;
			case 'number': return 0;
			case 'string': return '';
			case 'color': return 0xff00ff41;
			case 'enumType': return '';
			case 'slider':
			case 'range': return 50;
			case 'progress': return 0;
			case 'textarea':
			case 'text': return '';
			default: return null;
		}
	}

	/**
	 * @private
	 */
	_getValueByPath(path) {
		if (!path) return undefined;
		const parts = path.split('.');
		let current = this._values;
		for (const part of parts) {
			current = current?.[part];
		}
		return current;
	}

	/**
	 * @private
	 */
	_setValueByPath(obj, path, value) {
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

	/**
	 * @private
	 */
	_argbToHex(argb) {
		if (typeof argb !== 'number') return '#00ff41';
		const r = (argb >> 16) & 0xff;
		const g = (argb >> 8) & 0xff;
		const b = argb & 0xff;
		return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
	}

	/**
	 * @private
	 */
	_hexToArgb(hex) {
		const clean = hex.replace('#', '');
		const r = parseInt(clean.substr(0, 2), 16);
		const g = parseInt(clean.substr(2, 2), 16);
		const b = parseInt(clean.substr(4, 2), 16);
		return 0xff000000 | (r << 16) | (g << 8) | b;
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(tagName)) {
	customElements.define(tagName, TDynamicControlsLit);
}

export default TDynamicControlsLit;
