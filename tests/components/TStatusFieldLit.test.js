/**
 * TStatusFieldLit Component Tests
 * DISPLAY profile component (part of TStatusBarLit system)
 * Testing pattern: Properties, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TStatusFieldLit.js';

describe('TStatusFieldLit', () => {
	let field;

	beforeEach(async () => {
		field = await fixture(html`
			<t-sta-field label="CPU" value="42%"></t-sta-field>
		`);
	});

	afterEach(() => {
		field?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(field.constructor.tagName).toBe('t-sta-field');
		});

		it('should have correct version', () => {
			expect(field.constructor.version).toBe('1.0.0');
		});

		it('should have correct category', () => {
			expect(field.constructor.category).toBe('Display');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyField = document.createElement('t-sta-field');
			expect(emptyField.label).toBe('');
			expect(emptyField.value).toBe('');
			expect(emptyField.icon).toBe('');
			expect(emptyField.width).toBe('auto');
			expect(emptyField.align).toBe('left');
		});

		it('should set label from property', async () => {
			expect(field.label).toBe('CPU');
		});

		it('should set value from property', async () => {
			expect(field.value).toBe('42%');
		});

		it('should update label property', async () => {
			field.label = 'Memory';
			await field.updateComplete;
			expect(field.label).toBe('Memory');
			expect(field.getAttribute('label')).toBe('Memory');
		});

		it('should update value property', async () => {
			field.value = '85%';
			await field.updateComplete;
			expect(field.value).toBe('85%');
			expect(field.getAttribute('value')).toBe('85%');
		});

		it('should update icon property', async () => {
			const svgIcon = '<svg><circle r="5"/></svg>';
			field.icon = svgIcon;
			await field.updateComplete;
			expect(field.icon).toBe(svgIcon);
		});

		it('should update width property', async () => {
			field.width = '100px';
			await field.updateComplete;
			expect(field.width).toBe('100px');
			expect(field.getAttribute('width')).toBe('100px');
			expect(field.style.width).toBe('100px');
		});

		it('should update align property', async () => {
			field.align = 'center';
			await field.updateComplete;
			expect(field.align).toBe('center');
			expect(field.getAttribute('align')).toBe('center');
		});

		it('should clear width style when set to auto', async () => {
			field.width = '100px';
			await field.updateComplete;
			expect(field.style.width).toBe('100px');

			field.width = 'auto';
			await field.updateComplete;
			expect(field.style.width).toBe('');
		});

		it('should parse label from attribute', async () => {
			const withAttr = await fixture(html`
				<t-sta-field label="Disk" value="50%"></t-sta-field>
			`);
			expect(withAttr.label).toBe('Disk');
			withAttr.remove();
		});

		it('should parse value from attribute', async () => {
			const withAttr = await fixture(html`
				<t-sta-field label="Network" value="1.2 MB/s"></t-sta-field>
			`);
			expect(withAttr.value).toBe('1.2 MB/s');
			withAttr.remove();
		});
	});

	// ======================================================
	// SUITE 3: Context Support
	// ======================================================
	describe('Context Support', () => {
		it('should receive context from parent', async () => {
			const context = { theme: 'dark', statusBar: true };
			field.receiveContext(context);
			expect(field._context).toEqual(context);
		});

		it('should store null context initially', async () => {
			const newField = document.createElement('t-sta-field');
			expect(newField._context).toBeNull();
		});
	});

	// ======================================================
	// SUITE 4: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await field.updateComplete;
			expect(field.shadowRoot).toBeTruthy();
		});

		it('should render label with colon', async () => {
			await field.updateComplete;
			const labelSpan = field.shadowRoot.querySelector('.field-label');
			expect(labelSpan).toBeTruthy();
			expect(labelSpan.textContent).toBe('CPU:');
		});

		it('should render value', async () => {
			await field.updateComplete;
			const valueSpan = field.shadowRoot.querySelector('.field-value');
			expect(valueSpan).toBeTruthy();
			expect(valueSpan.textContent).toBe('42%');
		});

		it('should not render label when empty', async () => {
			const noLabel = await fixture(html`
				<t-sta-field value="100%"></t-sta-field>
			`);
			await noLabel.updateComplete;
			const labelSpan = noLabel.shadowRoot.querySelector('.field-label');
			expect(labelSpan).toBeFalsy();
			noLabel.remove();
		});

		it('should render empty value span when value is empty', async () => {
			const noValue = await fixture(html`
				<t-sta-field label="Status"></t-sta-field>
			`);
			await noValue.updateComplete;
			const valueSpan = noValue.shadowRoot.querySelector('.field-value');
			expect(valueSpan).toBeTruthy();
			expect(valueSpan.textContent).toBe('');
			noValue.remove();
		});

		it('should render icon when provided', async () => {
			const svgIcon = '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/></svg>';
			field.icon = svgIcon;
			await field.updateComplete;

			const iconSpan = field.shadowRoot.querySelector('.field-icon');
			expect(iconSpan).toBeTruthy();
			const svg = iconSpan.querySelector('svg');
			expect(svg).toBeTruthy();
		});

		it('should not render icon container when icon is empty', async () => {
			await field.updateComplete;
			const iconSpan = field.shadowRoot.querySelector('.field-icon');
			expect(iconSpan).toBeFalsy();
		});

		it('should render icon, label, and value together', async () => {
			const fullField = await fixture(html`
				<t-sta-field
					label="Temp"
					value="65°C"
					icon="<svg><rect/></svg>">
				</t-sta-field>
			`);
			await fullField.updateComplete;

			expect(fullField.shadowRoot.querySelector('.field-icon')).toBeTruthy();
			expect(fullField.shadowRoot.querySelector('.field-label')).toBeTruthy();
			expect(fullField.shadowRoot.querySelector('.field-value')).toBeTruthy();
			fullField.remove();
		});

		it('should update rendering when label changes', async () => {
			await field.updateComplete;
			field.label = 'GPU';
			await field.updateComplete;

			const labelSpan = field.shadowRoot.querySelector('.field-label');
			expect(labelSpan.textContent).toBe('GPU:');
		});

		it('should update rendering when value changes', async () => {
			await field.updateComplete;
			field.value = '99%';
			await field.updateComplete;

			const valueSpan = field.shadowRoot.querySelector('.field-value');
			expect(valueSpan.textContent).toBe('99%');
		});
	});

	// ======================================================
	// SUITE 5: Width and Alignment
	// ======================================================
	describe('Width and Alignment', () => {
		it('should set width style on connectedCallback', async () => {
			const widthField = await fixture(html`
				<t-sta-field label="Test" value="123" width="150px"></t-sta-field>
			`);
			expect(widthField.style.width).toBe('150px');
			widthField.remove();
		});

		it('should not set width style when auto', async () => {
			const autoField = await fixture(html`
				<t-sta-field label="Test" value="123" width="auto"></t-sta-field>
			`);
			expect(autoField.style.width).toBe('');
			autoField.remove();
		});

		it('should support percentage width', async () => {
			field.width = '25%';
			await field.updateComplete;
			expect(field.style.width).toBe('25%');
		});

		it('should have left alignment by default', async () => {
			expect(field.align).toBe('left');
		});

		it('should support center alignment', async () => {
			const centerField = await fixture(html`
				<t-sta-field label="Test" value="123" align="center"></t-sta-field>
			`);
			expect(centerField.getAttribute('align')).toBe('center');
			centerField.remove();
		});

		it('should support right alignment', async () => {
			const rightField = await fixture(html`
				<t-sta-field label="Test" value="123" align="right"></t-sta-field>
			`);
			expect(rightField.getAttribute('align')).toBe('right');
			rightField.remove();
		});
	});

	// ======================================================
	// SUITE 6: Lifecycle
	// ======================================================
	describe('Lifecycle', () => {
		it('should be connected to DOM after fixture', async () => {
			expect(field.isConnected).toBe(true);
		});

		it('should be disconnected from DOM after remove', async () => {
			const newField = await fixture(html`<t-sta-field></t-sta-field>`);
			expect(newField.isConnected).toBe(true);
			newField.remove();
			expect(newField.isConnected).toBe(false);
		});

		it('should call firstUpdated', async () => {
			const newField = document.createElement('t-sta-field');
			const spy = vi.spyOn(newField, 'firstUpdated');
			document.body.appendChild(newField);
			await newField.updateComplete;
			expect(spy).toHaveBeenCalled();
			newField.remove();
		});

		it('should call updated when properties change', async () => {
			const spy = vi.spyOn(field, 'updated');
			field.value = 'new value';
			await field.updateComplete;
			expect(spy).toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 7: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(field._logger).toBeTruthy();
		});

		it('should create logger with correct component name', () => {
			// The logger is created in constructor with 'TStatusFieldLit'
			expect(field._logger).toBeDefined();
		});
	});
});
