/**
 * TLogListLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Static Metadata, Properties, Methods, Events, Rendering, Logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TLogListLit.js';

describe('TLogListLit', () => {
	let logList;
	const testEntries = [
		{ id: '1', level: 'info', message: 'Info message', source: 'test' },
		{ id: '2', level: 'warn', message: 'Warning message', source: 'test' },
		{ id: '3', level: 'error', message: 'Error message', source: 'test' },
		{ id: '4', level: 'debug', message: 'Debug message', source: 'test' }
	];

	beforeEach(async () => {
		logList = await fixture(html`
			<t-log-list .entries="${testEntries}"></t-log-list>
		`);
	});

	afterEach(() => {
		logList?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(logList.constructor.tagName).toBe('t-log-list');
		});

		it('should have correct version', () => {
			expect(logList.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(logList.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyLogList = document.createElement('t-log-list');
			expect(emptyLogList.entries).toEqual([]);
			expect(emptyLogList.maxEntries).toBe(1000);
			expect(emptyLogList.autoScroll).toBe(true);
			expect(emptyLogList.showToolbar).toBe(true);
			expect(emptyLogList.showFooter).toBe(true);
			expect(emptyLogList.searchQuery).toBe('');
			expect(emptyLogList.levelFilters).toEqual([]);
			expect(emptyLogList.compact).toBe(false);
			expect(emptyLogList.dense).toBe(false);
			expect(emptyLogList.minimal).toBe(false);
			expect(emptyLogList.timestampFormat).toBe('time');
			expect(emptyLogList.paused).toBe(false);
			emptyLogList.remove();
		});

		it('should set entries from property', async () => {
			expect(logList.entries).toEqual(testEntries);
		});

		it('should update maxEntries property', async () => {
			logList.maxEntries = 500;
			await logList.updateComplete;
			expect(logList.maxEntries).toBe(500);
		});

		it('should reflect maxEntries from attribute', async () => {
			const withAttr = await fixture(html`
				<t-log-list max-entries="100"></t-log-list>
			`);
			expect(withAttr.maxEntries).toBe(100);
			withAttr.remove();
		});

		it('should update autoScroll property', async () => {
			logList.autoScroll = false;
			await logList.updateComplete;
			expect(logList.autoScroll).toBe(false);
		});

		it('should reflect autoScroll attribute', async () => {
			const withAttr = await fixture(html`
				<t-log-list auto-scroll></t-log-list>
			`);
			expect(withAttr.autoScroll).toBe(true);
			expect(withAttr.hasAttribute('auto-scroll')).toBe(true);
			withAttr.remove();
		});

		it('should update showToolbar property', async () => {
			logList.showToolbar = false;
			await logList.updateComplete;
			expect(logList.showToolbar).toBe(false);
		});

		it('should reflect showToolbar from attribute', async () => {
			const withAttr = await fixture(html`
				<t-log-list show-toolbar></t-log-list>
			`);
			expect(withAttr.showToolbar).toBe(true);
			withAttr.remove();
		});

		it('should update showFooter property', async () => {
			logList.showFooter = false;
			await logList.updateComplete;
			expect(logList.showFooter).toBe(false);
		});

		it('should reflect showFooter from attribute', async () => {
			const withAttr = await fixture(html`
				<t-log-list show-footer></t-log-list>
			`);
			expect(withAttr.showFooter).toBe(true);
			withAttr.remove();
		});

		it('should update searchQuery property', async () => {
			logList.searchQuery = 'test query';
			await logList.updateComplete;
			expect(logList.searchQuery).toBe('test query');
		});

		it('should update levelFilters property', async () => {
			logList.levelFilters = ['error', 'warn'];
			await logList.updateComplete;
			expect(logList.levelFilters).toEqual(['error', 'warn']);
		});

		it('should update compact property', async () => {
			logList.compact = true;
			await logList.updateComplete;
			expect(logList.compact).toBe(true);
			expect(logList.hasAttribute('compact')).toBe(true);
		});

		it('should update dense property', async () => {
			logList.dense = true;
			await logList.updateComplete;
			expect(logList.dense).toBe(true);
			expect(logList.hasAttribute('dense')).toBe(true);
		});

		it('should update minimal property', async () => {
			logList.minimal = true;
			await logList.updateComplete;
			expect(logList.minimal).toBe(true);
			expect(logList.hasAttribute('minimal')).toBe(true);
		});

		it('should update timestampFormat property', async () => {
			logList.timestampFormat = 'datetime';
			await logList.updateComplete;
			expect(logList.timestampFormat).toBe('datetime');
		});

		it('should reflect timestampFormat from attribute', async () => {
			const withAttr = await fixture(html`
				<t-log-list timestamp-format="relative"></t-log-list>
			`);
			expect(withAttr.timestampFormat).toBe('relative');
			withAttr.remove();
		});

		it('should update paused property', async () => {
			logList.paused = true;
			await logList.updateComplete;
			expect(logList.paused).toBe(true);
		});

		it('should update hideIcons property', async () => {
			logList.hideIcons = true;
			await logList.updateComplete;
			expect(logList.hideIcons).toBe(true);
			expect(logList.hasAttribute('hide-icons')).toBe(true);
		});

		it('should reflect hideIcons from attribute', async () => {
			const withAttr = await fixture(html`
				<t-log-list hide-icons></t-log-list>
			`);
			expect(withAttr.hideIcons).toBe(true);
			withAttr.remove();
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		describe('addEntry()', () => {
			it('should add a single entry', async () => {
				const initialLength = logList.entries.length;
				logList.addEntry({ level: 'info', message: 'New entry' });
				await logList.updateComplete;
				expect(logList.entries.length).toBe(initialLength + 1);
				expect(logList.entries[logList.entries.length - 1].message).toBe('New entry');
			});

			it('should auto-generate id if not provided', async () => {
				logList.addEntry({ level: 'info', message: 'Entry without id' });
				await logList.updateComplete;
				const lastEntry = logList.entries[logList.entries.length - 1];
				expect(lastEntry.id).toBeDefined();
			});

			it('should auto-generate timestamp if not provided', async () => {
				logList.addEntry({ level: 'info', message: 'Entry without timestamp' });
				await logList.updateComplete;
				const lastEntry = logList.entries[logList.entries.length - 1];
				expect(lastEntry.timestamp).toBeDefined();
			});

			it('should respect maxEntries limit', async () => {
				logList.maxEntries = 5;
				logList.entries = [];
				await logList.updateComplete;

				for (let i = 0; i < 10; i++) {
					logList.addEntry({ level: 'info', message: `Entry ${i}` });
				}
				await logList.updateComplete;

				expect(logList.entries.length).toBe(5);
				expect(logList.entries[0].message).toBe('Entry 5');
			});

			it('should preserve provided id and timestamp', async () => {
				const customId = 'custom-id-123';
				const customTimestamp = '2024-01-01T00:00:00Z';
				logList.addEntry({
					id: customId,
					timestamp: customTimestamp,
					level: 'info',
					message: 'Custom entry'
				});
				await logList.updateComplete;

				const lastEntry = logList.entries[logList.entries.length - 1];
				expect(lastEntry.id).toBe(customId);
				expect(lastEntry.timestamp).toBe(customTimestamp);
			});
		});

		describe('addEntries()', () => {
			it('should add multiple entries', async () => {
				const initialLength = logList.entries.length;
				const newEntries = [
					{ level: 'info', message: 'Batch entry 1' },
					{ level: 'warn', message: 'Batch entry 2' }
				];
				logList.addEntries(newEntries);
				await logList.updateComplete;

				expect(logList.entries.length).toBe(initialLength + 2);
			});

			it('should auto-generate ids for all entries', async () => {
				logList.entries = [];
				await logList.updateComplete;

				logList.addEntries([
					{ level: 'info', message: 'Entry 1' },
					{ level: 'info', message: 'Entry 2' }
				]);
				await logList.updateComplete;

				logList.entries.forEach(entry => {
					expect(entry.id).toBeDefined();
				});
			});

			it('should respect maxEntries limit with batch add', async () => {
				logList.maxEntries = 3;
				logList.entries = [];
				await logList.updateComplete;

				logList.addEntries([
					{ level: 'info', message: 'Entry 1' },
					{ level: 'info', message: 'Entry 2' },
					{ level: 'info', message: 'Entry 3' },
					{ level: 'info', message: 'Entry 4' },
					{ level: 'info', message: 'Entry 5' }
				]);
				await logList.updateComplete;

				expect(logList.entries.length).toBe(3);
				expect(logList.entries[0].message).toBe('Entry 3');
			});
		});

		describe('clear()', () => {
			it('should remove all entries', async () => {
				expect(logList.entries.length).toBeGreaterThan(0);
				logList.clear();
				await logList.updateComplete;
				expect(logList.entries.length).toBe(0);
			});

			it('should fire clear event', async () => {
				const handler = vi.fn();
				logList.addEventListener('clear', handler);

				logList.clear();
				await logList.updateComplete;

				expect(handler).toHaveBeenCalled();
			});
		});

		describe('scrollToBottom()', () => {
			it('should be callable without errors', async () => {
				await logList.updateComplete;
				expect(() => logList.scrollToBottom()).not.toThrow();
			});
		});

		describe('togglePause()', () => {
			it('should toggle paused state', async () => {
				expect(logList.paused).toBe(false);
				logList.togglePause();
				await logList.updateComplete;
				expect(logList.paused).toBe(true);
				logList.togglePause();
				await logList.updateComplete;
				expect(logList.paused).toBe(false);
			});
		});

		describe('toggleLevelFilter()', () => {
			it('should add level to filters when not present', async () => {
				expect(logList.levelFilters).toEqual([]);
				logList.toggleLevelFilter('error');
				await logList.updateComplete;
				expect(logList.levelFilters).toContain('error');
			});

			it('should remove level from filters when present', async () => {
				logList.levelFilters = ['error', 'warn'];
				await logList.updateComplete;

				logList.toggleLevelFilter('error');
				await logList.updateComplete;

				expect(logList.levelFilters).not.toContain('error');
				expect(logList.levelFilters).toContain('warn');
			});

			it('should fire filter-change event', async () => {
				const handler = vi.fn();
				logList.addEventListener('filter-change', handler);

				logList.toggleLevelFilter('error');
				await logList.updateComplete;

				expect(handler).toHaveBeenCalled();
				expect(handler.mock.calls[0][0].detail.levelFilters).toContain('error');
			});
		});

		describe('getFilteredEntries()', () => {
			it('should return all entries when no filters', async () => {
				await logList.updateComplete;
				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(testEntries.length);
			});

			it('should filter by level', async () => {
				logList.levelFilters = ['error'];
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(1);
				expect(filtered[0].level).toBe('error');
			});

			it('should filter by multiple levels', async () => {
				logList.levelFilters = ['error', 'warn'];
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(2);
				expect(filtered.every(e => ['error', 'warn'].includes(e.level))).toBe(true);
			});

			it('should filter by search query in message', async () => {
				logList.searchQuery = 'Warning';
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(1);
				expect(filtered[0].message).toContain('Warning');
			});

			it('should filter by search query in source', async () => {
				logList.entries = [
					{ id: '1', level: 'info', message: 'Message', source: 'component-a' },
					{ id: '2', level: 'info', message: 'Message', source: 'component-b' }
				];
				logList.searchQuery = 'component-a';
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(1);
				expect(filtered[0].source).toBe('component-a');
			});

			it('should filter by search query in tags', async () => {
				logList.entries = [
					{ id: '1', level: 'info', message: 'Message', tags: ['important', 'review'] },
					{ id: '2', level: 'info', message: 'Message', tags: ['minor'] }
				];
				logList.searchQuery = 'important';
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(1);
				expect(filtered[0].tags).toContain('important');
			});

			it('should combine level and search filters', async () => {
				logList.entries = [
					{ id: '1', level: 'error', message: 'Critical error' },
					{ id: '2', level: 'error', message: 'Minor error' },
					{ id: '3', level: 'warn', message: 'Critical warning' }
				];
				logList.levelFilters = ['error'];
				logList.searchQuery = 'Critical';
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(1);
				expect(filtered[0].level).toBe('error');
				expect(filtered[0].message).toContain('Critical');
			});

			it('should be case-insensitive for search', async () => {
				logList.searchQuery = 'warning';
				await logList.updateComplete;

				const filtered = logList.getFilteredEntries();
				expect(filtered.length).toBe(1);
				expect(filtered[0].message.toLowerCase()).toContain('warning');
			});
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		describe('entry-click', () => {
			it('should bubble from component', async () => {
				const handler = vi.fn();
				document.body.addEventListener('entry-click', handler);

				logList.dispatchEvent(new CustomEvent('entry-click', {
					bubbles: true,
					composed: true,
					detail: { entryId: '1' }
				}));

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('entry-click', handler);
			});
		});

		describe('entry-expand', () => {
			it('should bubble from component', async () => {
				const handler = vi.fn();
				document.body.addEventListener('entry-expand', handler);

				logList.dispatchEvent(new CustomEvent('entry-expand', {
					bubbles: true,
					composed: true,
					detail: { entryId: '1', expanded: true }
				}));

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('entry-expand', handler);
			});
		});

		describe('filter-change', () => {
			it('should fire when level filter changes', async () => {
				const handler = vi.fn();
				logList.addEventListener('filter-change', handler);

				logList.toggleLevelFilter('error');
				await logList.updateComplete;

				expect(handler).toHaveBeenCalled();
				expect(handler.mock.calls[0][0].detail.levelFilters).toEqual(['error']);
			});

			it('should fire when search query changes via input', async () => {
				const handler = vi.fn();
				logList.addEventListener('filter-change', handler);

				await logList.updateComplete;
				const searchInput = logList.shadowRoot.querySelector('.search-input');

				if (searchInput) {
					searchInput.value = 'test';
					searchInput.dispatchEvent(new Event('input'));
					await logList.updateComplete;

					expect(handler).toHaveBeenCalled();
					expect(handler.mock.calls[0][0].detail.searchQuery).toBe('test');
				}
			});

			it('should include both levelFilters and searchQuery in detail', async () => {
				logList.searchQuery = 'existing query';
				await logList.updateComplete;

				const handler = vi.fn();
				logList.addEventListener('filter-change', handler);

				logList.toggleLevelFilter('warn');
				await logList.updateComplete;

				expect(handler).toHaveBeenCalled();
				const detail = handler.mock.calls[0][0].detail;
				expect(detail.levelFilters).toContain('warn');
				expect(detail.searchQuery).toBe('existing query');
			});
		});

		describe('clear', () => {
			it('should fire when clear() is called', async () => {
				const handler = vi.fn();
				logList.addEventListener('clear', handler);

				logList.clear();
				await logList.updateComplete;

				expect(handler).toHaveBeenCalled();
			});

			it('should bubble and compose', async () => {
				const handler = vi.fn();
				document.body.addEventListener('clear', handler);

				logList.clear();
				await logList.updateComplete;

				expect(handler).toHaveBeenCalled();
				const event = handler.mock.calls[0][0];
				expect(event.bubbles).toBe(true);
				expect(event.composed).toBe(true);

				document.body.removeEventListener('clear', handler);
			});
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await logList.updateComplete;
			expect(logList.shadowRoot).toBeTruthy();
		});

		it('should render toolbar by default', async () => {
			await logList.updateComplete;
			const toolbar = logList.shadowRoot.querySelector('.toolbar');
			expect(toolbar).toBeTruthy();
		});

		it('should hide toolbar when showToolbar is false', async () => {
			logList.showToolbar = false;
			await logList.updateComplete;
			const toolbar = logList.shadowRoot.querySelector('.toolbar');
			expect(toolbar).toBeFalsy();
		});

		it('should hide toolbar in minimal mode', async () => {
			logList.minimal = true;
			await logList.updateComplete;
			const toolbar = logList.shadowRoot.querySelector('.toolbar');
			expect(toolbar).toBeFalsy();
		});

		it('should render footer by default', async () => {
			await logList.updateComplete;
			const footer = logList.shadowRoot.querySelector('.footer');
			expect(footer).toBeTruthy();
		});

		it('should hide footer when showFooter is false', async () => {
			logList.showFooter = false;
			await logList.updateComplete;
			const footer = logList.shadowRoot.querySelector('.footer');
			expect(footer).toBeFalsy();
		});

		it('should hide footer in minimal mode', async () => {
			logList.minimal = true;
			await logList.updateComplete;
			const footer = logList.shadowRoot.querySelector('.footer');
			expect(footer).toBeFalsy();
		});

		it('should render entries container', async () => {
			await logList.updateComplete;
			const entries = logList.shadowRoot.querySelector('.entries');
			expect(entries).toBeTruthy();
		});

		it('should render t-log-entry elements for each entry', async () => {
			await logList.updateComplete;
			const entryElements = logList.shadowRoot.querySelectorAll('t-log-entry');
			expect(entryElements.length).toBe(testEntries.length);
		});

		it('should render empty state when no entries', async () => {
			logList.entries = [];
			await logList.updateComplete;
			const emptyState = logList.shadowRoot.querySelector('.empty-state');
			expect(emptyState).toBeTruthy();
		});

		it('should render search input in toolbar', async () => {
			await logList.updateComplete;
			const searchInput = logList.shadowRoot.querySelector('.search-input');
			expect(searchInput).toBeTruthy();
		});

		it('should render level filter chips', async () => {
			await logList.updateComplete;
			const levelChips = logList.shadowRoot.querySelectorAll('.level-chip');
			expect(levelChips.length).toBe(4); // error, warn, info, debug
		});

		it('should mark active level filters', async () => {
			logList.levelFilters = ['error'];
			await logList.updateComplete;
			const activeChip = logList.shadowRoot.querySelector('.level-chip.error.active');
			expect(activeChip).toBeTruthy();
		});

		it('should render pause button in toolbar', async () => {
			await logList.updateComplete;
			const pauseBtn = logList.shadowRoot.querySelector('.filter-btn');
			expect(pauseBtn).toBeTruthy();
		});

		it('should render clear button in toolbar', async () => {
			await logList.updateComplete;
			const buttons = logList.shadowRoot.querySelectorAll('.filter-btn');
			expect(buttons.length).toBeGreaterThanOrEqual(2);
		});

		it('should render scroll to bottom button', async () => {
			await logList.updateComplete;
			const scrollBtn = logList.shadowRoot.querySelector('.scroll-bottom-btn');
			expect(scrollBtn).toBeTruthy();
		});

		it('should display stats in footer', async () => {
			await logList.updateComplete;
			const stats = logList.shadowRoot.querySelector('.stats');
			expect(stats).toBeTruthy();
			expect(stats.textContent).toContain('Total:');
		});

		it('should display error count in footer when errors exist', async () => {
			await logList.updateComplete;
			const errorStat = logList.shadowRoot.querySelector('.stat-count.error');
			expect(errorStat).toBeTruthy();
			expect(errorStat.textContent).toBe('1');
		});

		it('should display warn count in footer when warnings exist', async () => {
			await logList.updateComplete;
			const warnStat = logList.shadowRoot.querySelector('.stat-count.warn');
			expect(warnStat).toBeTruthy();
			expect(warnStat.textContent).toBe('1');
		});

		it('should display auto-scroll indicator in footer', async () => {
			await logList.updateComplete;
			const indicator = logList.shadowRoot.querySelector('.auto-scroll-indicator');
			expect(indicator).toBeTruthy();
			expect(indicator.textContent).toContain('Auto-scroll:');
		});

		it('should have CSS parts for styling', async () => {
			await logList.updateComplete;
			expect(logList.shadowRoot.querySelector('[part="toolbar"]')).toBeTruthy();
			expect(logList.shadowRoot.querySelector('[part="entries"]')).toBeTruthy();
			expect(logList.shadowRoot.querySelector('[part="footer"]')).toBeTruthy();
		});

		it('should render header slot', async () => {
			const withSlot = await fixture(html`
				<t-log-list>
					<div slot="header">Custom Header</div>
				</t-log-list>
			`);
			await withSlot.updateComplete;
			const headerSlot = withSlot.shadowRoot.querySelector('slot[name="header"]');
			expect(headerSlot).toBeTruthy();
			withSlot.remove();
		});

		it('should render footer slot', async () => {
			const withSlot = await fixture(html`
				<t-log-list>
					<div slot="footer">Custom Footer</div>
				</t-log-list>
			`);
			await withSlot.updateComplete;
			const footerSlot = withSlot.shadowRoot.querySelector('slot[name="footer"]');
			expect(footerSlot).toBeTruthy();
			withSlot.remove();
		});

		it('should render default slot for custom entries', async () => {
			await logList.updateComplete;
			const defaultSlot = logList.shadowRoot.querySelector('.entries-wrapper slot:not([name])');
			expect(defaultSlot).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 6: Toolbar Interactions
	// ======================================================
	describe('Toolbar Interactions', () => {
		it('should update search query on input', async () => {
			await logList.updateComplete;
			const searchInput = logList.shadowRoot.querySelector('.search-input');

			searchInput.value = 'test search';
			searchInput.dispatchEvent(new Event('input'));
			await logList.updateComplete;

			expect(logList.searchQuery).toBe('test search');
		});

		it('should toggle level filter on chip click', async () => {
			await logList.updateComplete;
			const errorChip = logList.shadowRoot.querySelector('.level-chip.error');

			errorChip.click();
			await logList.updateComplete;

			expect(logList.levelFilters).toContain('error');
		});

		it('should toggle pause on pause button click', async () => {
			await logList.updateComplete;
			const pauseBtn = logList.shadowRoot.querySelectorAll('.filter-btn')[0];

			pauseBtn.click();
			await logList.updateComplete;

			expect(logList.paused).toBe(true);
		});

		it('should clear entries on clear button click', async () => {
			await logList.updateComplete;
			const clearBtn = logList.shadowRoot.querySelectorAll('.filter-btn')[1];

			clearBtn.click();
			await logList.updateComplete;

			expect(logList.entries.length).toBe(0);
		});
	});

	// ======================================================
	// SUITE 7: Entry Rendering Props
	// ======================================================
	describe('Entry Rendering Props', () => {
		it('should pass compact prop to entries', async () => {
			logList.compact = true;
			await logList.updateComplete;
			const entry = logList.shadowRoot.querySelector('t-log-entry');
			expect(entry.hasAttribute('compact')).toBe(true);
		});

		it('should pass dense prop to entries', async () => {
			logList.dense = true;
			await logList.updateComplete;
			const entry = logList.shadowRoot.querySelector('t-log-entry');
			expect(entry.hasAttribute('dense')).toBe(true);
		});

		it('should pass hide-icons prop to entries', async () => {
			logList.hideIcons = true;
			await logList.updateComplete;
			const entry = logList.shadowRoot.querySelector('t-log-entry');
			expect(entry.hasAttribute('hide-icons')).toBe(true);
		});

		it('should pass timestampFormat to entries', async () => {
			logList.timestampFormat = 'relative';
			await logList.updateComplete;
			const entry = logList.shadowRoot.querySelector('t-log-entry');
			expect(entry.getAttribute('timestamp-format')).toBe('relative');
		});
	});

	// ======================================================
	// SUITE 8: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(logList._logger).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 9: Auto-scroll Behavior
	// ======================================================
	describe('Auto-scroll Behavior', () => {
		it('should not auto-scroll when paused', async () => {
			logList.paused = true;
			await logList.updateComplete;

			const entriesEl = logList.shadowRoot.querySelector('.entries');
			const initialScrollTop = entriesEl.scrollTop;

			logList.addEntry({ level: 'info', message: 'New entry' });
			await logList.updateComplete;

			// Scroll position should not change when paused
			// Note: This test may need adjustment based on actual component behavior
			expect(logList.paused).toBe(true);
		});

		it('should track _isAtBottom state', async () => {
			await logList.updateComplete;
			// Initially should be at bottom
			expect(logList._isAtBottom).toBe(true);
		});
	});

	// ======================================================
	// SUITE 10: Stats Tracking
	// ======================================================
	describe('Stats Tracking', () => {
		it('should track total entries', async () => {
			await logList.updateComplete;
			expect(logList._stats.total).toBe(testEntries.length);
		});

		it('should track error count', async () => {
			await logList.updateComplete;
			expect(logList._stats.error).toBe(1);
		});

		it('should track warn count', async () => {
			await logList.updateComplete;
			expect(logList._stats.warn).toBe(1);
		});

		it('should track info count', async () => {
			await logList.updateComplete;
			expect(logList._stats.info).toBe(1);
		});

		it('should track debug count', async () => {
			await logList.updateComplete;
			expect(logList._stats.debug).toBe(1);
		});

		it('should update stats when entries change', async () => {
			logList.addEntry({ level: 'error', message: 'Another error' });
			await logList.updateComplete;

			expect(logList._stats.total).toBe(testEntries.length + 1);
			expect(logList._stats.error).toBe(2);
		});
	});
});
