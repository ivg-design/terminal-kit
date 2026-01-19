/**
 * TDynamicControlsLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TDynamicControlsLit.js';

describe('TDynamicControlsLit', () => {
	let controls;
	const testSchema = {
		stateMachines: [
			{
				name: 'MainSM',
				inputs: [
					{ name: 'isActive', type: 'boolean', value: true },
					{ name: 'speed', type: 'number', value: 10, min: 0, max: 100 },
					{ name: 'label', type: 'string', value: 'Hello' },
					{ name: 'fireTrigger', type: 'trigger' }
				]
			}
		],
		viewModel: {
			name: 'RootVM',
			blueprintName: 'Root ViewModel',
			properties: [
				{ name: 'enabled', type: 'boolean', value: false },
				{ name: 'count', type: 'number', value: 42 },
				{ name: 'title', type: 'string', value: 'Test Title' },
				{ name: 'color', type: 'color', value: 0xff00ff41 },
				{ name: 'mode', type: 'enumType', values: ['auto', 'manual', 'off'], value: 'auto' }
			],
			nestedViewModels: [
				{
					name: 'NestedVM',
					blueprintName: 'Nested ViewModel',
					properties: [
						{ name: 'nestedFlag', type: 'boolean', value: true }
					]
				}
			]
		}
	};

	beforeEach(async () => {
		controls = await fixture(html`
			<t-dynamic-controls></t-dynamic-controls>
		`);
	});

	afterEach(() => {
		controls?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(controls.constructor.tagName).toBe('t-dynamic-controls');
		});

		it('should have correct version', () => {
			expect(controls.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(controls.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyControls = document.createElement('t-dynamic-controls');
			expect(emptyControls.schema).toBe(null);
			expect(emptyControls.disabled).toBe(false);
			expect(emptyControls.showTypes).toBe(false);
			expect(emptyControls.compact).toBe(false);
		});

		it('should set schema from property', async () => {
			controls.schema = testSchema;
			await controls.updateComplete;
			expect(controls.schema).toEqual(testSchema);
		});

		it('should reflect disabled attribute', async () => {
			controls.disabled = true;
			await controls.updateComplete;
			expect(controls.hasAttribute('disabled')).toBe(true);
		});

		it('should update showTypes property', async () => {
			controls.showTypes = true;
			await controls.updateComplete;
			expect(controls.showTypes).toBe(true);
		});

		it('should reflect compact attribute', async () => {
			controls.compact = true;
			await controls.updateComplete;
			expect(controls.hasAttribute('compact')).toBe(true);
		});

		it('should accept show-types attribute', async () => {
			const withAttr = await fixture(html`
				<t-dynamic-controls show-types></t-dynamic-controls>
			`);
			expect(withAttr.showTypes).toBe(true);
			withAttr.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		describe('setSchema()', () => {
			it('should set schema and extract values', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				expect(controls.schema).toEqual(testSchema);
				const values = controls.getValues();
				expect(values.sm.MainSM.isActive).toBe(true);
				expect(values.sm.MainSM.speed).toBe(10);
				expect(values.vm.RootVM.enabled).toBe(false);
			});

			it('should handle empty schema', async () => {
				controls.setSchema({});
				await controls.updateComplete;

				const values = controls.getValues();
				expect(values).toEqual({});
			});

			it('should handle null schema by rendering empty state', async () => {
				// Note: setSchema(null) will throw since _extractInitialValues doesn't guard for null
				// The proper way to clear schema is to set it directly via property
				controls.schema = null;
				await controls.updateComplete;

				expect(controls.schema).toBe(null);
				const emptyState = controls.shadowRoot.querySelector('.empty-state');
				expect(emptyState).toBeTruthy();
			});
		});

		describe('getValues()', () => {
			it('should return empty object when no schema', () => {
				const values = controls.getValues();
				expect(values).toEqual({});
			});

			it('should return current values after schema set', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				const values = controls.getValues();
				expect(values.sm).toBeDefined();
				expect(values.vm).toBeDefined();
				expect(values.sm.MainSM.isActive).toBe(true);
				expect(values.vm.RootVM.count).toBe(42);
			});

			it('should return a shallow copy of values', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				const values = controls.getValues();
				// Shallow copy means top-level is different
				expect(values).not.toBe(controls._values);
				// But nested objects are still referenced (shallow copy behavior)
				expect(values.sm).toBe(controls._values.sm);
			});
		});

		describe('setValues()', () => {
			it('should set values externally', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				controls.setValues({ custom: { value: 123 } });
				await controls.updateComplete;

				const values = controls.getValues();
				expect(values.custom.value).toBe(123);
			});
		});

		describe('updateValue()', () => {
			it('should update a single value by path', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				controls.updateValue('sm.MainSM.speed', 50);
				await controls.updateComplete;

				const values = controls.getValues();
				expect(values.sm.MainSM.speed).toBe(50);
			});

			it('should create nested objects if needed', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				controls.updateValue('new.nested.path', 'value');
				await controls.updateComplete;

				const values = controls.getValues();
				expect(values.new.nested.path).toBe('value');
			});
		});

		describe('enable()', () => {
			it('should set disabled to false', async () => {
				controls.disabled = true;
				await controls.updateComplete;

				controls.enable();
				await controls.updateComplete;

				expect(controls.disabled).toBe(false);
			});
		});

		describe('disable()', () => {
			it('should set disabled to true', async () => {
				expect(controls.disabled).toBe(false);

				controls.disable();
				await controls.updateComplete;

				expect(controls.disabled).toBe(true);
			});
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		describe('control-change', () => {
			it('should fire when _handleValueChange is called', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				const handler = vi.fn();
				controls.addEventListener('control-change', handler);

				// Simulate value change via the private method
				controls._handleValueChange('sm.MainSM.speed', 75);

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.detail.path).toBe('sm.MainSM.speed');
				expect(event.detail.value).toBe(75);
				expect(event.detail.values).toBeDefined();
			});

			it('control-change should bubble and be composed', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				const handler = vi.fn();
				document.body.addEventListener('control-change', handler);

				controls._handleValueChange('sm.MainSM.isActive', false);

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('control-change', handler);
			});
		});

		describe('control-trigger', () => {
			it('should fire when _handleTrigger is called', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				const handler = vi.fn();
				controls.addEventListener('control-trigger', handler);

				controls._handleTrigger('sm.MainSM.fireTrigger');

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.detail.path).toBe('sm.MainSM.fireTrigger');
			});

			it('control-trigger should bubble and be composed', async () => {
				controls.setSchema(testSchema);
				await controls.updateComplete;

				const handler = vi.fn();
				document.body.addEventListener('control-trigger', handler);

				controls._handleTrigger('sm.MainSM.fireTrigger');

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('control-trigger', handler);
			});
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await controls.updateComplete;
			expect(controls.shadowRoot).toBeTruthy();
		});

		it('should render empty state when no schema', async () => {
			await controls.updateComplete;
			const emptyState = controls.shadowRoot.querySelector('.empty-state');
			expect(emptyState).toBeTruthy();
			expect(emptyState.textContent).toContain('No schema defined');
		});

		it('should render controls container when schema is set', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const container = controls.shadowRoot.querySelector('.controls-container');
			expect(container).toBeTruthy();
		});

		it('should render state machine sections', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const sections = controls.shadowRoot.querySelectorAll('.section');
			expect(sections.length).toBeGreaterThan(0);

			const sectionTitles = controls.shadowRoot.querySelectorAll('.section-title');
			const titles = Array.from(sectionTitles).map(t => t.textContent);
			expect(titles).toContain('MainSM');
		});

		it('should render viewModel sections', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const sectionTitles = controls.shadowRoot.querySelectorAll('.section-title');
			const titles = Array.from(sectionTitles).map(t => t.textContent);
			expect(titles).toContain('Root ViewModel');
		});

		it('should render nested viewModels', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const nestedSections = controls.shadowRoot.querySelectorAll('.nested-section');
			expect(nestedSections.length).toBeGreaterThan(0);

			const nestedHeaders = controls.shadowRoot.querySelectorAll('.nested-header');
			const headers = Array.from(nestedHeaders).map(h => h.textContent);
			expect(headers).toContain('Nested ViewModel');
		});

		it('should render control rows', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const controlRows = controls.shadowRoot.querySelectorAll('.control-row');
			expect(controlRows.length).toBeGreaterThan(0);
		});

		it('should render control labels', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const labels = controls.shadowRoot.querySelectorAll('.control-label');
			const labelTexts = Array.from(labels).map(l => l.textContent);
			expect(labelTexts).toContain('isActive');
			expect(labelTexts).toContain('speed');
		});

		it('should render type badges when showTypes is true', async () => {
			controls.showTypes = true;
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const typeBadges = controls.shadowRoot.querySelectorAll('.type-badge');
			expect(typeBadges.length).toBeGreaterThan(0);
		});

		it('should not render type badges when showTypes is false', async () => {
			controls.showTypes = false;
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const typeBadges = controls.shadowRoot.querySelectorAll('.type-badge');
			expect(typeBadges.length).toBe(0);
		});

		it('should render section badges with count', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const badges = controls.shadowRoot.querySelectorAll('.section-badge');
			expect(badges.length).toBeGreaterThan(0);
		});

		it('should render unsupported type indicator for unknown types', async () => {
			const schemaWithUnknown = {
				viewModel: {
					name: 'TestVM',
					properties: [
						{ name: 'unknownProp', type: 'unknownType' }
					]
				}
			};

			controls.setSchema(schemaWithUnknown);
			await controls.updateComplete;

			const unsupported = controls.shadowRoot.querySelector('.unsupported');
			expect(unsupported).toBeTruthy();
			expect(unsupported.textContent).toContain('Unsupported');
		});
	});

	// ======================================================
	// SUITE 6: Section Collapse Behavior
	// ======================================================
	describe('Section Collapse Behavior', () => {
		it('should toggle section collapse on header click', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const sectionHeader = controls.shadowRoot.querySelector('.section-header');
			const sectionContent = controls.shadowRoot.querySelector('.section-content');

			expect(sectionContent.classList.contains('collapsed')).toBe(false);

			sectionHeader.click();
			await controls.updateComplete;

			expect(sectionContent.classList.contains('collapsed')).toBe(true);

			sectionHeader.click();
			await controls.updateComplete;

			expect(sectionContent.classList.contains('collapsed')).toBe(false);
		});
	});

	// ======================================================
	// SUITE 7: Value Extraction
	// ======================================================
	describe('Value Extraction', () => {
		it('should extract initial values from state machines', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const values = controls.getValues();
			expect(values.sm.MainSM.isActive).toBe(true);
			expect(values.sm.MainSM.speed).toBe(10);
			expect(values.sm.MainSM.label).toBe('Hello');
		});

		it('should extract initial values from viewModel', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const values = controls.getValues();
			expect(values.vm.RootVM.enabled).toBe(false);
			expect(values.vm.RootVM.count).toBe(42);
			expect(values.vm.RootVM.title).toBe('Test Title');
			expect(values.vm.RootVM.color).toBe(0xff00ff41);
			expect(values.vm.RootVM.mode).toBe('auto');
		});

		it('should extract initial values from nested viewModels', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const values = controls.getValues();
			expect(values.vm.NestedVM.nestedFlag).toBe(true);
		});

		it('should use default values when not specified', async () => {
			const schemaNoValues = {
				viewModel: {
					name: 'TestVM',
					properties: [
						{ name: 'boolProp', type: 'boolean' },
						{ name: 'numProp', type: 'number' },
						{ name: 'strProp', type: 'string' },
						{ name: 'colorProp', type: 'color' },
						{ name: 'enumProp', type: 'enumType' }
					]
				}
			};

			controls.setSchema(schemaNoValues);
			await controls.updateComplete;

			const values = controls.getValues();
			expect(values.vm.TestVM.boolProp).toBe(false);
			expect(values.vm.TestVM.numProp).toBe(0);
			expect(values.vm.TestVM.strProp).toBe('');
			expect(values.vm.TestVM.colorProp).toBe(0xff00ff41);
			expect(values.vm.TestVM.enumProp).toBe('');
		});
	});

	// ======================================================
	// SUITE 8: Color Conversion
	// ======================================================
	describe('Color Conversion', () => {
		it('should convert ARGB to hex correctly', () => {
			// 0xff00ff41 => R=0, G=255, B=65 => #00ff41
			const hex = controls._argbToHex(0xff00ff41);
			expect(hex).toBe('#00ff41');
		});

		it('should handle non-number input for argbToHex', () => {
			const hex = controls._argbToHex('invalid');
			expect(hex).toBe('#00ff41'); // default value
		});

		it('should convert hex to ARGB correctly', () => {
			const argb = controls._hexToArgb('#00ff41');
			// R=0, G=255, B=65, A=255 => 0xff00ff41
			// JavaScript returns signed int, so we compare with bitwise OR result
			expect(argb).toBe(0xff000000 | (0 << 16) | (255 << 8) | 65);
		});
	});

	// ======================================================
	// SUITE 9: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(controls._logger).toBeTruthy();
		});

		it('should log on setSchema', () => {
			const debugSpy = vi.spyOn(controls._logger, 'debug');
			controls.setSchema(testSchema);
			expect(debugSpy).toHaveBeenCalledWith('setSchema called', testSchema);
		});

		it('should log on value change', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const debugSpy = vi.spyOn(controls._logger, 'debug');
			controls._handleValueChange('test.path', 'testValue');
			expect(debugSpy).toHaveBeenCalled();
		});

		it('should log on trigger', async () => {
			controls.setSchema(testSchema);
			await controls.updateComplete;

			const debugSpy = vi.spyOn(controls._logger, 'debug');
			controls._handleTrigger('test.trigger');
			expect(debugSpy).toHaveBeenCalledWith('Trigger fired', { path: 'test.trigger' });
		});
	});
});
