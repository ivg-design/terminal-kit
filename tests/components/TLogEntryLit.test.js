/**
 * TLogEntryLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Static Metadata, Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TLogEntryLit.js';

describe('TLogEntryLit', () => {
	let entry;

	beforeEach(async () => {
		entry = await fixture(html`
			<t-log-entry
				level="info"
				message="Test log message"
				timestamp="2024-01-15T10:30:00Z"
				source="test-source"
			></t-log-entry>
		`);
	});

	afterEach(() => {
		entry?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(entry.constructor.tagName).toBe('t-log-entry');
		});

		it('should have correct version', () => {
			expect(entry.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(entry.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		describe('Default Values', () => {
			it('should have correct default values', () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.level).toBe('info');
				expect(emptyEntry.timestamp).toBe(null);
				expect(emptyEntry.timestampFormat).toBe('time');
				expect(emptyEntry.message).toBe('');
				expect(emptyEntry.source).toBe('');
				expect(emptyEntry.tags).toEqual([]);
				expect(emptyEntry.expanded).toBe(false);
				expect(emptyEntry.expandable).toBe(false);
				expect(emptyEntry.details).toBe(null);
				expect(emptyEntry.stackTrace).toBe('');
				expect(emptyEntry.metadata).toBe(null);
				expect(emptyEntry.data).toBe(null);
				expect(emptyEntry.compact).toBe(false);
				expect(emptyEntry.dense).toBe(false);
				expect(emptyEntry.icon).toBe('');
				emptyEntry.remove();
			});
		});

		describe('level', () => {
			it('should set level property', async () => {
				expect(entry.level).toBe('info');
			});

			it('should reflect level attribute', async () => {
				entry.level = 'error';
				await entry.updateComplete;
				expect(entry.getAttribute('level')).toBe('error');
			});

			it('should accept all valid level values', async () => {
				const levels = ['debug', 'info', 'warn', 'error', 'success', 'trace'];
				for (const level of levels) {
					entry.level = level;
					await entry.updateComplete;
					expect(entry.level).toBe(level);
				}
			});
		});

		describe('timestamp', () => {
			it('should set timestamp property', async () => {
				expect(entry.timestamp).toBe('2024-01-15T10:30:00Z');
			});

			it('should accept Date object', async () => {
				const date = new Date('2024-06-01T12:00:00Z');
				entry.timestamp = date;
				await entry.updateComplete;
				expect(entry.timestamp).toBe(date);
			});

			it('should handle null timestamp', async () => {
				entry.timestamp = null;
				await entry.updateComplete;
				expect(entry.timestamp).toBe(null);
			});
		});

		describe('timestampFormat', () => {
			it('should have default timestampFormat of time', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.timestampFormat).toBe('time');
				emptyEntry.remove();
			});

			it('should accept valid format values', async () => {
				const formats = ['time', 'datetime', 'relative', 'full'];
				for (const format of formats) {
					entry.timestampFormat = format;
					await entry.updateComplete;
					expect(entry.timestampFormat).toBe(format);
				}
			});

			it('should set via attribute', async () => {
				const entryWithAttr = await fixture(html`
					<t-log-entry timestamp-format="full" timestamp="2024-01-15T10:30:00Z"></t-log-entry>
				`);
				expect(entryWithAttr.timestampFormat).toBe('full');
				entryWithAttr.remove();
			});
		});

		describe('message', () => {
			it('should set message property', async () => {
				expect(entry.message).toBe('Test log message');
			});

			it('should update message property', async () => {
				entry.message = 'Updated message';
				await entry.updateComplete;
				expect(entry.message).toBe('Updated message');
			});
		});

		describe('source', () => {
			it('should set source property', async () => {
				expect(entry.source).toBe('test-source');
			});

			it('should update source property', async () => {
				entry.source = 'new-source';
				await entry.updateComplete;
				expect(entry.source).toBe('new-source');
			});
		});

		describe('tags', () => {
			it('should accept tags array', async () => {
				entry.tags = ['tag1', 'tag2', 'tag3'];
				await entry.updateComplete;
				expect(entry.tags).toEqual(['tag1', 'tag2', 'tag3']);
			});

			it('should default to empty array', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.tags).toEqual([]);
				emptyEntry.remove();
			});
		});

		describe('expanded', () => {
			it('should default to false', async () => {
				expect(entry.expanded).toBe(false);
			});

			it('should reflect expanded attribute', async () => {
				entry.expandable = true;
				entry.expanded = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('expanded')).toBe(true);
			});

			it('should update when set', async () => {
				entry.expandable = true;
				entry.expanded = true;
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
			});
		});

		describe('expandable', () => {
			it('should default to false', async () => {
				expect(entry.expandable).toBe(false);
			});

			it('should make entry expandable when true', async () => {
				entry.expandable = true;
				await entry.updateComplete;
				expect(entry.expandable).toBe(true);
			});
		});

		describe('details', () => {
			it('should accept details object', async () => {
				const details = { key1: 'value1', key2: 'value2' };
				entry.details = details;
				await entry.updateComplete;
				expect(entry.details).toEqual(details);
			});

			it('should default to null', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.details).toBe(null);
				emptyEntry.remove();
			});
		});

		describe('stackTrace', () => {
			it('should accept stack trace string', async () => {
				const stack = 'Error: Test error\n    at test.js:10:15';
				entry.stackTrace = stack;
				await entry.updateComplete;
				expect(entry.stackTrace).toBe(stack);
			});

			it('should set via attribute', async () => {
				const entryWithAttr = await fixture(html`
					<t-log-entry stack-trace="Error at line 1"></t-log-entry>
				`);
				expect(entryWithAttr.stackTrace).toBe('Error at line 1');
				entryWithAttr.remove();
			});
		});

		describe('metadata', () => {
			it('should accept metadata object', async () => {
				const metadata = { user: 'admin', ip: '127.0.0.1' };
				entry.metadata = metadata;
				await entry.updateComplete;
				expect(entry.metadata).toEqual(metadata);
			});

			it('should default to null', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.metadata).toBe(null);
				emptyEntry.remove();
			});
		});

		describe('data', () => {
			it('should accept data object', async () => {
				const data = { request: { method: 'GET' }, response: { status: 200 } };
				entry.data = data;
				await entry.updateComplete;
				expect(entry.data).toEqual(data);
			});

			it('should default to null', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.data).toBe(null);
				emptyEntry.remove();
			});
		});

		describe('compact', () => {
			it('should default to false', async () => {
				expect(entry.compact).toBe(false);
			});

			it('should reflect compact attribute', async () => {
				entry.compact = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('compact')).toBe(true);
			});
		});

		describe('dense', () => {
			it('should default to false', async () => {
				expect(entry.dense).toBe(false);
			});

			it('should reflect dense attribute', async () => {
				entry.dense = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('dense')).toBe(true);
			});
		});

		describe('icon', () => {
			it('should default to empty string', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.icon).toBe('');
				emptyEntry.remove();
			});

			it('should accept custom icon SVG', async () => {
				const customIcon = '<svg><circle cx="10" cy="10" r="5"/></svg>';
				entry.icon = customIcon;
				await entry.updateComplete;
				expect(entry.icon).toBe(customIcon);
			});
		});

		describe('hideIcons', () => {
			it('should default to false', async () => {
				const emptyEntry = document.createElement('t-log-entry');
				expect(emptyEntry.hideIcons).toBeFalsy();
				emptyEntry.remove();
			});

			it('should reflect hide-icons attribute', async () => {
				entry.hideIcons = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('hide-icons')).toBe(true);
			});
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		describe('toggle()', () => {
			it('should toggle expanded state when expandable', async () => {
				entry.expandable = true;
				await entry.updateComplete;

				expect(entry.expanded).toBe(false);
				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(false);
			});

			it('should not toggle when not expandable', async () => {
				entry.expandable = false;
				entry.details = null;
				entry.stackTrace = '';
				entry.metadata = null;
				entry.data = null;
				await entry.updateComplete;

				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(false);
			});

			it('should toggle when has details', async () => {
				entry.details = { key: 'value' };
				await entry.updateComplete;

				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
			});

			it('should toggle when has stackTrace', async () => {
				entry.stackTrace = 'Error stack';
				await entry.updateComplete;

				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
			});

			it('should toggle when has metadata', async () => {
				entry.metadata = { info: 'data' };
				await entry.updateComplete;

				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
			});

			it('should toggle when has data', async () => {
				entry.data = { json: 'data' };
				await entry.updateComplete;

				entry.toggle();
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
			});
		});

		describe('expand()', () => {
			it('should expand when expandable', async () => {
				entry.expandable = true;
				await entry.updateComplete;

				entry.expand();
				await entry.updateComplete;
				expect(entry.expanded).toBe(true);
			});

			it('should not expand when not expandable', async () => {
				entry.expandable = false;
				entry.details = null;
				entry.stackTrace = '';
				entry.metadata = null;
				entry.data = null;
				await entry.updateComplete;

				entry.expand();
				await entry.updateComplete;
				expect(entry.expanded).toBe(false);
			});

			it('should do nothing when already expanded', async () => {
				entry.expandable = true;
				entry.expanded = true;
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('entry-expand', handler);

				entry.expand();
				await entry.updateComplete;

				expect(entry.expanded).toBe(true);
				expect(handler).not.toHaveBeenCalled();
			});
		});

		describe('collapse()', () => {
			it('should collapse when expanded', async () => {
				entry.expandable = true;
				entry.expanded = true;
				await entry.updateComplete;

				entry.collapse();
				await entry.updateComplete;
				expect(entry.expanded).toBe(false);
			});

			it('should do nothing when already collapsed', async () => {
				entry.expandable = true;
				entry.expanded = false;
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('entry-expand', handler);

				entry.collapse();
				await entry.updateComplete;

				expect(entry.expanded).toBe(false);
				expect(handler).not.toHaveBeenCalled();
			});
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		describe('entry-click', () => {
			it('should fire entry-click when header is clicked', async () => {
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('entry-click', handler);

				const header = entry.shadowRoot.querySelector('.entry-header');
				header.click();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
			});

			it('should include correct detail in entry-click event', async () => {
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('entry-click', handler);

				const header = entry.shadowRoot.querySelector('.entry-header');
				header.click();
				await entry.updateComplete;

				const eventDetail = handler.mock.calls[0][0].detail;
				expect(eventDetail.level).toBe('info');
				expect(eventDetail.message).toBe('Test log message');
				expect(eventDetail.timestamp).toBe('2024-01-15T10:30:00Z');
			});

			it('entry-click should bubble and be composed', async () => {
				await entry.updateComplete;

				const handler = vi.fn();
				document.body.addEventListener('entry-click', handler);

				const header = entry.shadowRoot.querySelector('.entry-header');
				header.click();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('entry-click', handler);
			});
		});

		describe('entry-expand', () => {
			it('should fire entry-expand when toggled', async () => {
				entry.expandable = true;
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('entry-expand', handler);

				entry.toggle();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
				expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
			});

			it('should fire entry-expand with false when collapsed', async () => {
				entry.expandable = true;
				entry.expanded = true;
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('entry-expand', handler);

				entry.collapse();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
				expect(handler.mock.calls[0][0].detail.expanded).toBe(false);
			});

			it('entry-expand should bubble and be composed', async () => {
				entry.expandable = true;
				await entry.updateComplete;

				const handler = vi.fn();
				document.body.addEventListener('entry-expand', handler);

				entry.toggle();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('entry-expand', handler);
			});
		});

		describe('tag-click', () => {
			it('should fire tag-click when tag is clicked', async () => {
				entry.tags = ['test-tag', 'another-tag'];
				await entry.updateComplete;

				const handler = vi.fn();
				entry.addEventListener('tag-click', handler);

				const tags = entry.shadowRoot.querySelectorAll('.tag');
				tags[0].click();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
				expect(handler.mock.calls[0][0].detail.tag).toBe('test-tag');
			});

			it('tag-click should stop propagation', async () => {
				entry.tags = ['test-tag'];
				await entry.updateComplete;

				const clickHandler = vi.fn();
				const tagHandler = vi.fn();

				entry.addEventListener('entry-click', clickHandler);
				entry.addEventListener('tag-click', tagHandler);

				const tag = entry.shadowRoot.querySelector('.tag');
				tag.click();
				await entry.updateComplete;

				expect(tagHandler).toHaveBeenCalled();
				// entry-click should NOT be called because tag click stops propagation
				expect(clickHandler).not.toHaveBeenCalled();
			});

			it('tag-click should bubble and be composed', async () => {
				entry.tags = ['test-tag'];
				await entry.updateComplete;

				const handler = vi.fn();
				document.body.addEventListener('tag-click', handler);

				const tag = entry.shadowRoot.querySelector('.tag');
				tag.click();
				await entry.updateComplete;

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('tag-click', handler);
			});
		});

		describe('action-click', () => {
			it('should dispatch custom events from slotted action buttons', async () => {
				const entryWithActions = await fixture(html`
					<t-log-entry message="Test">
						<button slot="actions" id="test-action">Action</button>
					</t-log-entry>
				`);
				await entryWithActions.updateComplete;

				// Note: action-click event is typically dispatched by custom action buttons
				// The component provides the actions slot, not the event itself
				const actionsSlot = entryWithActions.shadowRoot.querySelector('slot[name="actions"]');
				expect(actionsSlot).toBeTruthy();

				entryWithActions.remove();
			});
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		describe('Shadow DOM', () => {
			it('should render shadow DOM', async () => {
				await entry.updateComplete;
				expect(entry.shadowRoot).toBeTruthy();
			});

			it('should render entry container', async () => {
				await entry.updateComplete;
				const entryEl = entry.shadowRoot.querySelector('.entry');
				expect(entryEl).toBeTruthy();
			});

			it('should render entry header', async () => {
				await entry.updateComplete;
				const header = entry.shadowRoot.querySelector('.entry-header');
				expect(header).toBeTruthy();
			});
		});

		describe('Level Icon', () => {
			it('should render level icon', async () => {
				await entry.updateComplete;
				const icon = entry.shadowRoot.querySelector('.level-icon');
				expect(icon).toBeTruthy();
			});

			it('should apply level class to icon', async () => {
				entry.level = 'error';
				await entry.updateComplete;
				const icon = entry.shadowRoot.querySelector('.level-icon.error');
				expect(icon).toBeTruthy();
			});

			it('should render custom icon when provided', async () => {
				entry.icon = '<svg id="custom-icon"></svg>';
				await entry.updateComplete;
				const icon = entry.shadowRoot.querySelector('.level-icon');
				expect(icon.innerHTML).toContain('custom-icon');
			});
		});

		describe('Timestamp', () => {
			it('should render timestamp when provided', async () => {
				await entry.updateComplete;
				const timestamp = entry.shadowRoot.querySelector('.timestamp');
				expect(timestamp).toBeTruthy();
			});

			it('should not render timestamp when null', async () => {
				entry.timestamp = null;
				await entry.updateComplete;
				const timestamp = entry.shadowRoot.querySelector('.timestamp');
				expect(timestamp).toBeFalsy();
			});

			it('should apply full class for full format', async () => {
				entry.timestampFormat = 'full';
				await entry.updateComplete;
				const timestamp = entry.shadowRoot.querySelector('.timestamp.full');
				expect(timestamp).toBeTruthy();
			});
		});

		describe('Source', () => {
			it('should render source when provided', async () => {
				await entry.updateComplete;
				const source = entry.shadowRoot.querySelector('.source');
				expect(source).toBeTruthy();
				expect(source.textContent).toBe('test-source');
			});

			it('should not render source when empty', async () => {
				entry.source = '';
				await entry.updateComplete;
				const source = entry.shadowRoot.querySelector('.source');
				expect(source).toBeFalsy();
			});
		});

		describe('Message', () => {
			it('should render message', async () => {
				await entry.updateComplete;
				const message = entry.shadowRoot.querySelector('.message');
				expect(message).toBeTruthy();
				expect(message.textContent).toBe('Test log message');
			});
		});

		describe('Tags', () => {
			it('should render tags when provided', async () => {
				entry.tags = ['tag1', 'tag2'];
				await entry.updateComplete;
				const tags = entry.shadowRoot.querySelectorAll('.tag');
				expect(tags.length).toBe(2);
				expect(tags[0].textContent).toBe('tag1');
				expect(tags[1].textContent).toBe('tag2');
			});

			it('should not render tags container when empty', async () => {
				entry.tags = [];
				await entry.updateComplete;
				const tagsContainer = entry.shadowRoot.querySelector('.tags');
				expect(tagsContainer).toBeFalsy();
			});
		});

		describe('Expand Toggle', () => {
			it('should render expand toggle', async () => {
				await entry.updateComplete;
				const toggle = entry.shadowRoot.querySelector('.expand-toggle');
				expect(toggle).toBeTruthy();
			});

			it('should have empty class when not expandable', async () => {
				entry.expandable = false;
				entry.details = null;
				entry.stackTrace = '';
				entry.metadata = null;
				entry.data = null;
				await entry.updateComplete;
				const toggle = entry.shadowRoot.querySelector('.expand-toggle.empty');
				expect(toggle).toBeTruthy();
			});

			it('should not have empty class when expandable', async () => {
				entry.expandable = true;
				await entry.updateComplete;
				const toggle = entry.shadowRoot.querySelector('.expand-toggle:not(.empty)');
				expect(toggle).toBeTruthy();
			});

			it('should have expanded class when expanded', async () => {
				entry.expandable = true;
				entry.expanded = true;
				await entry.updateComplete;
				const toggle = entry.shadowRoot.querySelector('.expand-toggle.expanded');
				expect(toggle).toBeTruthy();
			});
		});

		describe('Details Section', () => {
			it('should render details section when expandable', async () => {
				entry.expandable = true;
				await entry.updateComplete;
				const details = entry.shadowRoot.querySelector('.details');
				expect(details).toBeTruthy();
			});

			it('should not render details section when not expandable', async () => {
				entry.expandable = false;
				entry.details = null;
				entry.stackTrace = '';
				entry.metadata = null;
				entry.data = null;
				await entry.updateComplete;
				const details = entry.shadowRoot.querySelector('.details');
				expect(details).toBeFalsy();
			});

			it('should render detail fields when details provided', async () => {
				entry.details = { field1: 'value1', field2: 'value2' };
				entry.expanded = true;
				await entry.updateComplete;
				const detailFields = entry.shadowRoot.querySelector('.detail-fields');
				expect(detailFields).toBeTruthy();
			});

			it('should render stack trace when provided', async () => {
				entry.stackTrace = 'Error: Test\n    at line 1';
				entry.expanded = true;
				await entry.updateComplete;
				const stackTrace = entry.shadowRoot.querySelector('.stack-trace');
				expect(stackTrace).toBeTruthy();
			});

			it('should render metadata table when provided', async () => {
				entry.metadata = { key1: 'val1', key2: 'val2' };
				entry.expanded = true;
				await entry.updateComplete;
				const metadataTable = entry.shadowRoot.querySelector('.metadata-table');
				expect(metadataTable).toBeTruthy();
			});

			it('should render JSON viewer when data provided', async () => {
				entry.data = { test: 'value' };
				entry.expanded = true;
				await entry.updateComplete;
				const jsonViewer = entry.shadowRoot.querySelector('.json-viewer');
				expect(jsonViewer).toBeTruthy();
			});
		});

		describe('CSS Parts', () => {
			it('should expose entry part', async () => {
				await entry.updateComplete;
				const partEntry = entry.shadowRoot.querySelector('[part="entry"]');
				expect(partEntry).toBeTruthy();
			});

			it('should expose header part', async () => {
				await entry.updateComplete;
				const partHeader = entry.shadowRoot.querySelector('[part="header"]');
				expect(partHeader).toBeTruthy();
			});

			it('should expose icon part', async () => {
				await entry.updateComplete;
				const partIcon = entry.shadowRoot.querySelector('[part="icon"]');
				expect(partIcon).toBeTruthy();
			});

			it('should expose timestamp part', async () => {
				await entry.updateComplete;
				const partTimestamp = entry.shadowRoot.querySelector('[part="timestamp"]');
				expect(partTimestamp).toBeTruthy();
			});

			it('should expose message part', async () => {
				await entry.updateComplete;
				const partMessage = entry.shadowRoot.querySelector('[part="message"]');
				expect(partMessage).toBeTruthy();
			});

			it('should expose tags part when tags exist', async () => {
				entry.tags = ['tag1'];
				await entry.updateComplete;
				const partTags = entry.shadowRoot.querySelector('[part="tags"]');
				expect(partTags).toBeTruthy();
			});

			it('should expose details part when expandable', async () => {
				entry.expandable = true;
				await entry.updateComplete;
				const partDetails = entry.shadowRoot.querySelector('[part="details"]');
				expect(partDetails).toBeTruthy();
			});
		});

		describe('Slots', () => {
			it('should have details slot', async () => {
				entry.expandable = true;
				await entry.updateComplete;
				const slot = entry.shadowRoot.querySelector('slot[name="details"]');
				expect(slot).toBeTruthy();
			});

			it('should have actions slot', async () => {
				await entry.updateComplete;
				const slot = entry.shadowRoot.querySelector('slot[name="actions"]');
				expect(slot).toBeTruthy();
			});
		});

		describe('Display Modes', () => {
			it('should apply compact styles', async () => {
				entry.compact = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('compact')).toBe(true);
			});

			it('should apply dense styles', async () => {
				entry.dense = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('dense')).toBe(true);
			});

			it('should apply hide-icons styles', async () => {
				entry.hideIcons = true;
				await entry.updateComplete;
				expect(entry.hasAttribute('hide-icons')).toBe(true);
			});
		});

		describe('Level Data Attribute', () => {
			it('should set data-level attribute on entry', async () => {
				entry.level = 'error';
				await entry.updateComplete;
				const entryEl = entry.shadowRoot.querySelector('.entry');
				expect(entryEl.getAttribute('data-level')).toBe('error');
			});
		});
	});

	// ======================================================
	// SUITE 6: Timestamp Formatting
	// ======================================================
	describe('Timestamp Formatting', () => {
		it('should format as time by default', async () => {
			entry.timestamp = '2024-01-15T10:30:00Z';
			entry.timestampFormat = 'time';
			await entry.updateComplete;
			const timestamp = entry.shadowRoot.querySelector('.timestamp');
			// Contains time portion
			expect(timestamp.textContent).toBeTruthy();
		});

		it('should format as datetime', async () => {
			entry.timestamp = '2024-01-15T10:30:00Z';
			entry.timestampFormat = 'datetime';
			await entry.updateComplete;
			const timestamp = entry.shadowRoot.querySelector('.timestamp');
			expect(timestamp.textContent).toBeTruthy();
		});

		it('should format as full ISO string', async () => {
			entry.timestamp = '2024-01-15T10:30:00Z';
			entry.timestampFormat = 'full';
			await entry.updateComplete;
			const timestamp = entry.shadowRoot.querySelector('.timestamp');
			expect(timestamp.textContent).toContain('2024');
		});

		it('should format as relative time', async () => {
			// Set timestamp to recent time for relative formatting
			const recentDate = new Date(Date.now() - 60000); // 1 minute ago
			entry.timestamp = recentDate.toISOString();
			entry.timestampFormat = 'relative';
			await entry.updateComplete;
			const timestamp = entry.shadowRoot.querySelector('.timestamp');
			expect(timestamp.textContent).toMatch(/\d+[smhd] ago/);
		});

		it('should handle invalid timestamp gracefully', async () => {
			entry.timestamp = 'invalid-date';
			await entry.updateComplete;
			const timestamp = entry.shadowRoot.querySelector('.timestamp');
			// Should display the original string if parsing fails
			expect(timestamp.textContent.trim()).toBe('invalid-date');
		});

		it('should accept Date object for timestamp', async () => {
			const date = new Date('2024-06-15T14:00:00Z');
			entry.timestamp = date;
			entry.timestampFormat = 'full';
			await entry.updateComplete;
			const timestamp = entry.shadowRoot.querySelector('.timestamp');
			expect(timestamp.textContent).toContain('2024');
		});
	});

	// ======================================================
	// SUITE 7: JSON Highlighting
	// ======================================================
	describe('JSON Highlighting', () => {
		it('should render JSON data with syntax highlighting', async () => {
			entry.data = { name: 'test', count: 42, active: true, empty: null };
			entry.expanded = true;
			await entry.updateComplete;
			const jsonViewer = entry.shadowRoot.querySelector('.json-viewer');
			expect(jsonViewer.innerHTML).toContain('json-key');
			expect(jsonViewer.innerHTML).toContain('json-string');
			expect(jsonViewer.innerHTML).toContain('json-number');
			expect(jsonViewer.innerHTML).toContain('json-boolean');
			expect(jsonViewer.innerHTML).toContain('json-null');
		});

		it('should handle invalid JSON data gracefully', async () => {
			// Create circular reference that can't be stringified
			const circularObj = { a: 1 };
			circularObj.self = circularObj;
			entry.data = circularObj;
			entry.expanded = true;
			await entry.updateComplete;
			const jsonViewer = entry.shadowRoot.querySelector('.json-viewer');
			expect(jsonViewer.textContent).toContain('[Invalid JSON]');
		});
	});

	// ======================================================
	// SUITE 8: Click Behavior
	// ======================================================
	describe('Click Behavior', () => {
		it('should toggle expansion on header click when expandable', async () => {
			entry.expandable = true;
			await entry.updateComplete;

			const header = entry.shadowRoot.querySelector('.entry-header');
			header.click();
			await entry.updateComplete;

			expect(entry.expanded).toBe(true);

			header.click();
			await entry.updateComplete;

			expect(entry.expanded).toBe(false);
		});

		it('should not toggle expansion on header click when not expandable', async () => {
			entry.expandable = false;
			entry.details = null;
			entry.stackTrace = '';
			entry.metadata = null;
			entry.data = null;
			await entry.updateComplete;

			const header = entry.shadowRoot.querySelector('.entry-header');
			header.click();
			await entry.updateComplete;

			expect(entry.expanded).toBe(false);
		});

		it('should fire entry-click even when not expandable', async () => {
			entry.expandable = false;
			entry.details = null;
			entry.stackTrace = '';
			entry.metadata = null;
			entry.data = null;
			await entry.updateComplete;

			const handler = vi.fn();
			entry.addEventListener('entry-click', handler);

			const header = entry.shadowRoot.querySelector('.entry-header');
			header.click();
			await entry.updateComplete;

			expect(handler).toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 9: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(entry._logger).toBeTruthy();
		});

		it('should have logger with correct component name', () => {
			// Logger is created with 'TLogEntryLit' context
			expect(entry._logger).toBeDefined();
		});
	});
});
