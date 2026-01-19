/**
 * @fileoverview TLogListLit - Container for log entries with filtering and virtualization
 * @module components/TLogListLit
 * @version 3.0.0
 *
 * A FULL profile component that manages a collection of TLogEntryLit items
 * with filtering, searching, auto-scroll, and virtual scrolling support.
 *
 * @example
 * <t-log-list auto-scroll></t-log-list>
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import componentLogger from '../utils/ComponentLogger.js';
import { scrollbarStyles, scrollbarProperties, scrollbarDefaults } from '../utils/scrollbar-styles.js';
import {
	magnifyingGlassIcon,
	funnelIcon,
	trashIcon,
	caretDownIcon,
	pauseIcon,
	playIcon
} from '../utils/phosphor-icons.js';
import './TLogEntryLit.js';

// ============================================================
// Block 1: Static Metadata
// ============================================================

/**
 * TLogListLit - Container for log entries
 *
 * @element t-log-list
 * @tagname t-log-list
 *
 * @fires entry-click - Bubbles from child entries
 * @fires entry-expand - Bubbles from child entries
 * @fires filter-change - Fired when filters change
 * @fires clear - Fired when log is cleared
 *
 * @slot - Default slot for t-log-entry elements
 * @slot header - Custom header content
 * @slot footer - Custom footer content
 *
 * @csspart container - Main container
 * @csspart toolbar - Toolbar section
 * @csspart entries - Entries container
 * @csspart footer - Footer section
 */
class TLogListLit extends LitElement {
	/** @static @readonly */
	static tagName = 't-log-list';

	/** @static @readonly */
	static version = '3.0.0';

	/** @static @readonly */
	static category = 'Container';

	// ============================================================
	// Block 2: Static Styles
	// ============================================================

	static styles = [
		scrollbarStyles,
		css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			background: var(--t-log-bg, var(--terminal-gray-darkest, #1a1a1a));
			border: 1px solid var(--t-log-border, var(--terminal-gray-dark, #333));
			color: var(--t-log-color, var(--terminal-green, #00ff41));
			height: 100%;
			overflow: hidden;
		}

		/* Toolbar */
		.toolbar {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
			background: rgba(0, 0, 0, 0.3);
			border-bottom: 1px solid var(--terminal-gray-dark, #333);
			flex-shrink: 0;
		}

		.toolbar-section {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.toolbar-section.grow {
			flex: 1;
		}

		/* Search input */
		.search-container {
			display: flex;
			align-items: center;
			background: var(--terminal-black, #0a0a0a);
			border: 1px solid var(--terminal-gray-dark, #333);
			border-radius: 4px;
			padding: 0 8px;
			flex: 1;
			max-width: 300px;
		}

		.search-container:focus-within {
			border-color: var(--terminal-green, #00ff41);
		}

		.search-icon {
			width: 14px;
			height: 14px;
			color: var(--terminal-gray, #666);
			flex-shrink: 0;
		}

		.search-icon svg {
			width: 100%;
			height: 100%;
		}

		.search-input {
			flex: 1;
			background: transparent;
			border: none;
			color: var(--terminal-green, #00ff41);
			font-family: inherit;
			font-size: 12px;
			padding: 6px 8px;
			outline: none;
		}

		.search-input::placeholder {
			color: var(--terminal-gray, #666);
		}

		/* Filter buttons */
		.filter-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 24px;
			height: 24px;
			background: transparent;
			border: 1px solid var(--terminal-gray-dark, #333);
			color: var(--terminal-gray, #666);
			cursor: pointer;
			border-radius: 4px;
			padding: 0;
			transition: all 0.15s ease;
		}

		.filter-btn:hover {
			border-color: var(--terminal-green, #00ff41);
			color: var(--terminal-green, #00ff41);
		}

		.filter-btn.active {
			background: var(--terminal-green, #00ff41);
			border-color: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
		}

		.filter-btn svg {
			width: 12px;
			height: 12px;
		}

		/* Level filter chips */
		.level-filters {
			display: flex;
			gap: 4px;
		}

		.level-chip {
			padding: 2px 8px;
			background: transparent;
			border: 1px solid var(--terminal-gray-dark, #333);
			border-radius: 12px;
			font-size: 10px;
			cursor: pointer;
			transition: all 0.15s ease;
			text-transform: uppercase;
		}

		.level-chip:hover {
			border-color: currentColor;
		}

		.level-chip.active {
			background: currentColor;
			color: var(--terminal-black, #0a0a0a);
		}

		.level-chip.debug { color: var(--terminal-gray, #666); }
		.level-chip.info { color: var(--terminal-cyan, #00ffff); }
		.level-chip.warn { color: var(--terminal-amber, #ffb000); }
		.level-chip.error { color: var(--terminal-red, #ff003c); }
		.level-chip.success { color: var(--terminal-green, #00ff41); }

		/* Stats */
		.stats {
			display: flex;
			gap: 12px;
			font-size: 10px;
			color: var(--terminal-gray, #666);
		}

		.stat {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.stat-count {
			font-weight: bold;
		}

		.stat-count.error { color: var(--terminal-red, #ff003c); }
		.stat-count.warn { color: var(--terminal-amber, #ffb000); }

		/* Entries container */
		.entries {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
		}

		/* Scrollbar styling for entries */
		.entries::-webkit-scrollbar {
			width: var(--scrollbar-width);
		}

		.entries::-webkit-scrollbar-track {
			background: var(--scrollbar-track);
			border-radius: var(--scrollbar-radius);
		}

		.entries::-webkit-scrollbar-thumb {
			background: var(--scrollbar-thumb);
			border-radius: var(--scrollbar-radius);
			border: 1px solid var(--scrollbar-track);
		}

		.entries::-webkit-scrollbar-thumb:hover {
			background: var(--scrollbar-thumb-hover);
		}

		.entries-wrapper {
			min-height: 100%;
		}

		/* Empty state */
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 40px 20px;
			color: var(--terminal-gray, #666);
			text-align: center;
		}

		.empty-icon {
			width: 32px;
			height: 32px;
			margin-bottom: 12px;
			opacity: 0.5;
		}

		.empty-icon svg {
			width: 100%;
			height: 100%;
		}

		.empty-text {
			font-size: 14px;
		}

		/* Footer */
		.footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 6px 12px;
			background: rgba(0, 0, 0, 0.3);
			border-top: 1px solid var(--terminal-gray-dark, #333);
			font-size: 10px;
			color: var(--terminal-gray, #666);
			flex-shrink: 0;
		}

		.footer-left,
		.footer-right {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		.auto-scroll-indicator {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.auto-scroll-indicator.active {
			color: var(--terminal-green, #00ff41);
		}

		/* Scroll to bottom button */
		.scroll-bottom-btn {
			position: absolute;
			bottom: 50px;
			right: 20px;
			width: 32px;
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--terminal-gray-dark, #333);
			border: 1px solid var(--terminal-green, #00ff41);
			color: var(--terminal-green, #00ff41);
			cursor: pointer;
			border-radius: 50%;
			padding: 0;
			opacity: 0;
			transform: translateY(10px);
			transition: all 0.2s ease;
			z-index: 10;
		}

		.scroll-bottom-btn.visible {
			opacity: 1;
			transform: translateY(0);
		}

		.scroll-bottom-btn:hover {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
		}

		.scroll-bottom-btn svg {
			width: 16px;
			height: 16px;
		}

		/* Hide toolbar */
		:host([minimal]) .toolbar {
			display: none;
		}

		:host([minimal]) .footer {
			display: none;
		}
	`];

	// ============================================================
	// Block 3: Reactive Properties
	// ============================================================

	static properties = {
		...scrollbarProperties,

		/**
		 * Log entries data array
		 * @property entries
		 * @type {Array<Object>}
		 */
		entries: {
			type: Array,
			state: true
		},

		/**
		 * Maximum entries to keep (0 = unlimited)
		 * @property maxEntries
		 * @type {Number}
		 * @default 1000
		 * @attribute max-entries
		 */
		maxEntries: {
			type: Number,
			attribute: 'max-entries'
		},

		/**
		 * Auto-scroll to bottom on new entries
		 * @property autoScroll
		 * @type {Boolean}
		 * @default true
		 * @attribute auto-scroll
		 * @reflects true
		 */
		autoScroll: {
			type: Boolean,
			attribute: 'auto-scroll',
			reflect: true
		},

		/**
		 * Show toolbar
		 * @property showToolbar
		 * @type {Boolean}
		 * @default true
		 * @attribute show-toolbar
		 */
		showToolbar: {
			type: Boolean,
			attribute: 'show-toolbar'
		},

		/**
		 * Show footer
		 * @property showFooter
		 * @type {Boolean}
		 * @default true
		 * @attribute show-footer
		 */
		showFooter: {
			type: Boolean,
			attribute: 'show-footer'
		},

		/**
		 * Search query
		 * @property searchQuery
		 * @type {String}
		 */
		searchQuery: {
			type: String
		},

		/**
		 * Active level filters
		 * @property levelFilters
		 * @type {Array<String>}
		 */
		levelFilters: {
			type: Array
		},

		/**
		 * Compact display mode
		 * @property compact
		 * @type {Boolean}
		 * @default false
		 * @attribute compact
		 * @reflects true
		 */
		compact: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Dense display mode
		 * @property dense
		 * @type {Boolean}
		 * @default false
		 * @attribute dense
		 * @reflects true
		 */
		dense: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Minimal mode (no toolbar/footer)
		 * @property minimal
		 * @type {Boolean}
		 * @default false
		 * @attribute minimal
		 * @reflects true
		 */
		minimal: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Timestamp format for entries
		 * @property timestampFormat
		 * @type {'time'|'datetime'|'relative'|'full'}
		 * @default 'time'
		 * @attribute timestamp-format
		 */
		timestampFormat: {
			type: String,
			attribute: 'timestamp-format'
		},

		/**
		 * Paused state (stops auto-scroll)
		 * @property paused
		 * @type {Boolean}
		 * @default false
		 */
		paused: {
			type: Boolean
		}
	};

	// ============================================================
	// Block 4: Internal State
	// ============================================================

	/**
	 * @private
	 */
	_logger = null;

	/**
	 * Whether user has scrolled away from bottom
	 * @private
	 */
	_isAtBottom = true;

	/**
	 * Stats counters
	 * @private
	 */
	_stats = {
		total: 0,
		error: 0,
		warn: 0,
		info: 0,
		debug: 0
	};

	// ============================================================
	// Block 5: Logger Instance
	// ============================================================

	// (Combined with Block 4)

	// ============================================================
	// Block 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Default values
		this.entries = [];
		this.maxEntries = 1000;
		this.autoScroll = true;
		this.showToolbar = true;
		this.showFooter = true;
		this.searchQuery = '';
		this.levelFilters = [];
		this.compact = false;
		this.dense = false;
		this.minimal = false;
		this.timestampFormat = 'time';
		this.paused = false;

		// Scrollbar defaults
		this.scrollbar = scrollbarDefaults.scrollbar;
		this.scrollbarStyle = scrollbarDefaults.scrollbarStyle;

		this._logger = componentLogger.for('TLogListLit');
		this._logger.debug('Component constructed');

		// Bind methods
		this._handleScroll = this._handleScroll.bind(this);
	}

	// ============================================================
	// Block 7: Lifecycle Methods
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
		this._updateStats();
	}

	updated(changedProperties) {
		this._logger.trace('Updated', { changedProperties: [...changedProperties.keys()] });

		if (changedProperties.has('entries')) {
			this._updateStats();
			if (this.autoScroll && !this.paused && this._isAtBottom) {
				this._scrollToBottom();
			}
		}
	}

	// ============================================================
	// Block 8: Public API Methods
	// ============================================================

	/**
	 * Add a log entry
	 * @public
	 * @param {Object} entry - Log entry object
	 * @returns {void}
	 */
	addEntry(entry) {
		this._logger.debug('addEntry called', { level: entry.level });

		const newEntry = {
			id: entry.id || Date.now() + Math.random(),
			timestamp: entry.timestamp || new Date().toISOString(),
			...entry
		};

		let newEntries = [...this.entries, newEntry];

		// Trim if exceeds max
		if (this.maxEntries > 0 && newEntries.length > this.maxEntries) {
			newEntries = newEntries.slice(-this.maxEntries);
		}

		this.entries = newEntries;
	}

	/**
	 * Add multiple entries
	 * @public
	 * @param {Array<Object>} entries - Array of log entries
	 * @returns {void}
	 */
	addEntries(entries) {
		this._logger.debug('addEntries called', { count: entries.length });

		const newEntries = entries.map(entry => ({
			id: entry.id || Date.now() + Math.random(),
			timestamp: entry.timestamp || new Date().toISOString(),
			...entry
		}));

		let allEntries = [...this.entries, ...newEntries];

		if (this.maxEntries > 0 && allEntries.length > this.maxEntries) {
			allEntries = allEntries.slice(-this.maxEntries);
		}

		this.entries = allEntries;
	}

	/**
	 * Clear all entries
	 * @public
	 * @returns {void}
	 * @fires clear
	 */
	clear() {
		this._logger.debug('clear called');
		this.entries = [];
		this._emitEvent('clear');
	}

	/**
	 * Scroll to bottom
	 * @public
	 * @returns {void}
	 */
	scrollToBottom() {
		this._scrollToBottom();
	}

	/**
	 * Toggle pause state
	 * @public
	 * @returns {void}
	 */
	togglePause() {
		this.paused = !this.paused;
		this._logger.debug('togglePause', { paused: this.paused });
	}

	/**
	 * Set level filter
	 * @public
	 * @param {String} level - Level to filter
	 * @returns {void}
	 * @fires filter-change
	 */
	toggleLevelFilter(level) {
		this._logger.debug('toggleLevelFilter', { level });

		if (this.levelFilters.includes(level)) {
			this.levelFilters = this.levelFilters.filter(l => l !== level);
		} else {
			this.levelFilters = [...this.levelFilters, level];
		}

		this._emitEvent('filter-change', { levelFilters: this.levelFilters, searchQuery: this.searchQuery });
	}

	/**
	 * Get filtered entries
	 * @public
	 * @returns {Array<Object>}
	 */
	getFilteredEntries() {
		return this._getFilteredEntries();
	}

	// ============================================================
	// Block 9: Event Emitters
	// ============================================================

	/**
	 * Emit a custom event
	 * @private
	 * @param {string} eventName - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(eventName, detail = {}) {
		this.dispatchEvent(
			new CustomEvent(eventName, {
				detail,
				bubbles: true,
				composed: true,
			})
		);
	}

	// ============================================================
	// Block 10: Nesting Support
	// ============================================================

	// Manages child t-log-entry elements

	// ============================================================
	// Block 11: Validation
	// ============================================================

	// No validation needed

	// ============================================================
	// Block 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		const filteredEntries = this._getFilteredEntries();
		const scrollBtnClasses = {
			'scroll-bottom-btn': true,
			visible: !this._isAtBottom
		};

		return html`
			<slot name="header"></slot>

			${this.showToolbar && !this.minimal ? this._renderToolbar() : ''}

			<div class="entries" part="entries" @scroll=${this._handleScroll}>
				<div class="entries-wrapper">
					${filteredEntries.length > 0 ? html`
						${filteredEntries.map(entry => this._renderEntry(entry))}
					` : this._renderEmpty()}
					<slot></slot>
				</div>
			</div>

			<button
				class=${classMap(scrollBtnClasses)}
				@click=${this._scrollToBottom}
				title="Scroll to bottom"
			>
				${unsafeHTML(caretDownIcon)}
			</button>

			${this.showFooter && !this.minimal ? this._renderFooter() : ''}

			<slot name="footer"></slot>
		`;
	}

	// ============================================================
	// Block 13: Private Helpers
	// ============================================================

	/**
	 * Render toolbar
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderToolbar() {
		const levels = ['error', 'warn', 'info', 'debug'];

		return html`
			<div class="toolbar" part="toolbar">
				<div class="toolbar-section grow">
					<div class="search-container">
						<span class="search-icon">${unsafeHTML(magnifyingGlassIcon)}</span>
						<input
							type="text"
							class="search-input"
							placeholder="Filter logs..."
							.value=${this.searchQuery}
							@input=${this._handleSearch}
						>
					</div>
				</div>

				<div class="toolbar-section level-filters">
					${levels.map(level => html`
						<button
							class="level-chip ${level} ${this.levelFilters.includes(level) ? 'active' : ''}"
							@click=${() => this.toggleLevelFilter(level)}
						>${level}</button>
					`)}
				</div>

				<div class="toolbar-section">
					<button
						class="filter-btn ${this.paused ? 'active' : ''}"
						@click=${this.togglePause}
						title=${this.paused ? 'Resume' : 'Pause'}
					>
						${this.paused ? unsafeHTML(playIcon) : unsafeHTML(pauseIcon)}
					</button>
					<button
						class="filter-btn"
						@click=${this.clear}
						title="Clear logs"
					>
						${unsafeHTML(trashIcon)}
					</button>
				</div>
			</div>
		`;
	}

	/**
	 * Render footer
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderFooter() {
		return html`
			<div class="footer" part="footer">
				<div class="footer-left">
					<div class="stats">
						<span class="stat">
							Total: <span class="stat-count">${this._stats.total}</span>
						</span>
						${this._stats.error > 0 ? html`
							<span class="stat">
								Errors: <span class="stat-count error">${this._stats.error}</span>
							</span>
						` : ''}
						${this._stats.warn > 0 ? html`
							<span class="stat">
								Warnings: <span class="stat-count warn">${this._stats.warn}</span>
							</span>
						` : ''}
					</div>
				</div>
				<div class="footer-right">
					<span class="auto-scroll-indicator ${this.autoScroll && !this.paused ? 'active' : ''}">
						Auto-scroll: ${this.autoScroll && !this.paused ? 'ON' : 'OFF'}
					</span>
				</div>
			</div>
		`;
	}

	/**
	 * Render a single entry
	 * @private
	 * @param {Object} entry
	 * @returns {import('lit').TemplateResult}
	 */
	_renderEntry(entry) {
		return html`
			<t-log-entry
				level=${entry.level || 'info'}
				timestamp=${entry.timestamp || ''}
				timestamp-format=${this.timestampFormat}
				message=${entry.message || ''}
				source=${entry.source || ''}
				.tags=${entry.tags || []}
				.details=${entry.details || null}
				.metadata=${entry.metadata || null}
				.data=${entry.data || null}
				stack-trace=${entry.stackTrace || ''}
				?compact=${this.compact}
				?dense=${this.dense}
				?expandable=${entry.expandable || entry.details || entry.metadata || entry.data || entry.stackTrace}
			></t-log-entry>
		`;
	}

	/**
	 * Render empty state
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderEmpty() {
		return html`
			<div class="empty-state">
				<div class="empty-icon">${unsafeHTML(funnelIcon)}</div>
				<div class="empty-text">No log entries</div>
			</div>
		`;
	}

	/**
	 * Get filtered entries
	 * @private
	 * @returns {Array<Object>}
	 */
	_getFilteredEntries() {
		let filtered = this.entries;

		// Filter by level
		if (this.levelFilters.length > 0) {
			filtered = filtered.filter(e => this.levelFilters.includes(e.level));
		}

		// Filter by search query
		if (this.searchQuery) {
			const query = this.searchQuery.toLowerCase();
			filtered = filtered.filter(e =>
				(e.message && e.message.toLowerCase().includes(query)) ||
				(e.source && e.source.toLowerCase().includes(query)) ||
				(e.tags && e.tags.some(t => t.toLowerCase().includes(query)))
			);
		}

		return filtered;
	}

	/**
	 * Update stats
	 * @private
	 */
	_updateStats() {
		this._stats = {
			total: this.entries.length,
			error: this.entries.filter(e => e.level === 'error').length,
			warn: this.entries.filter(e => e.level === 'warn').length,
			info: this.entries.filter(e => e.level === 'info').length,
			debug: this.entries.filter(e => e.level === 'debug').length
		};
	}

	/**
	 * Handle scroll event
	 * @private
	 * @param {Event} e
	 */
	_handleScroll(e) {
		const el = e.target;
		const threshold = 50;
		this._isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
		this.requestUpdate();
	}

	/**
	 * Scroll to bottom
	 * @private
	 */
	_scrollToBottom() {
		const entriesEl = this.shadowRoot?.querySelector('.entries');
		if (entriesEl) {
			entriesEl.scrollTop = entriesEl.scrollHeight;
			this._isAtBottom = true;
			this.requestUpdate();
		}
	}

	/**
	 * Handle search input
	 * @private
	 * @param {Event} e
	 */
	_handleSearch(e) {
		this.searchQuery = e.target.value;
		this._emitEvent('filter-change', { levelFilters: this.levelFilters, searchQuery: this.searchQuery });
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TLogListLit.tagName)) {
	customElements.define(TLogListLit.tagName, TLogListLit);
}

export default TLogListLit;
