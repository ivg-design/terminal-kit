/**
 * @fileoverview TLogEntryLit - Complex log entry list item component
 * @module components/TLogEntryLit
 * @version 3.0.0
 *
 * A FULL profile component for displaying structured log entries with
 * collapsible rows, icons, timestamps, tags, and expandable details.
 *
 * @example
 * <t-log-entry
 *   level="error"
 *   timestamp="2024-01-15T10:30:00Z"
 *   message="Connection failed"
 *   source="api-gateway"
 * ></t-log-entry>
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import componentLogger from '../utils/ComponentLogger.js';
import { scrollbarStyles, scrollbarProperties, scrollbarDefaults } from '../utils/scrollbar-styles.js';
import {
	caretRightIcon,
	caretDownIcon,
	infoIcon,
	warningIcon,
	xCircleIcon,
	checkCircleIcon,
	codeIcon
} from '../utils/phosphor-icons.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================

/**
 * @component TLogEntryLit
 * @tagname t-log-entry
 * @description Structured log entry row with expandable details and tags.
 * @category Container
 * @since 3.0.0
 *
 * @element t-log-entry
 *
 * @fires entry-click - Fired when entry row is clicked
 * @fires entry-expand - Fired when entry is expanded/collapsed
 * @fires tag-click - Fired when a tag is clicked
 * @fires action-click - Fired when an action button is clicked
 *
 * @slot details - Custom content for expanded details section
 * @slot actions - Custom action buttons
 *
 * @csspart entry - The entry container
 * @csspart header - Entry header row
 * @csspart icon - Level icon
 * @csspart timestamp - Timestamp display
 * @csspart message - Main message text
 * @csspart tags - Tags container
 * @csspart details - Expanded details section
 */
class TLogEntryLit extends LitElement {
	/** @static @readonly */
	static tagName = 't-log-entry';

	/** @static @readonly */
	static version = '3.0.0';

	/** @static @readonly */
	static category = 'Container';

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = [
		scrollbarStyles,
		css`
		:host {
			display: block;
			font-family: var(--t-font-mono, 'JetBrains Mono', monospace);
			font-size: 12px;
			line-height: 1.4;
			--entry-bg: var(--terminal-gray-darkest, #1a1a1a);
			--entry-border: var(--terminal-gray-dark, #333);
			--entry-hover: rgba(255, 255, 255, 0.03);

			/* Configurable level colors */
			--log-debug-color: var(--t-log-debug, var(--terminal-gray, #666));
			--log-info-color: var(--t-log-info, var(--terminal-cyan, #00ffff));
			--log-warn-color: var(--t-log-warn, var(--terminal-amber, #ffb000));
			--log-error-color: var(--t-log-error, var(--terminal-red, #ff003c));
			--log-success-color: var(--t-log-success, var(--terminal-green, #00ff41));
			--log-trace-color: var(--t-log-trace, var(--terminal-purple, #9d00ff));
		}

		/* Hide icons mode */
		:host([hide-icons]) .level-icon {
			display: none;
		}

		.entry {
			border-bottom: 1px solid var(--entry-border);
			transition: background 0.15s ease;
		}

		.entry:hover {
			background: var(--entry-hover);
		}

		.entry.expanded {
			background: rgba(0, 255, 65, 0.02);
		}

		/* Header row */
		.entry-header {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
			cursor: pointer;
			user-select: none;
		}

		/* Expand toggle */
		.expand-toggle {
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			color: var(--terminal-gray, #666);
			transition: transform 0.15s ease;
		}

		.expand-toggle svg {
			width: 12px;
			height: 12px;
		}

		.expand-toggle.expanded {
			color: var(--terminal-green, #00ff41);
		}

		.expand-toggle.empty {
			visibility: hidden;
		}

		/* Level icon */
		.level-icon {
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.level-icon svg {
			width: 14px;
			height: 14px;
		}

		.level-icon.debug { color: var(--log-debug-color); }
		.level-icon.info { color: var(--log-info-color); }
		.level-icon.warn { color: var(--log-warn-color); }
		.level-icon.error { color: var(--log-error-color); }
		.level-icon.success { color: var(--log-success-color); }
		.level-icon.trace { color: var(--log-trace-color); }

		/* Timestamp */
		.timestamp {
			flex-shrink: 0;
			color: var(--terminal-gray, #666);
			font-size: 11px;
			min-width: 80px;
		}

		.timestamp.full {
			min-width: 150px;
		}

		/* Source/category */
		.source {
			flex-shrink: 0;
			color: var(--terminal-cyan, #00ffff);
			font-size: 11px;
			padding: 1px 6px;
			background: rgba(0, 255, 255, 0.1);
			border-radius: 2px;
			max-width: 120px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		/* Message */
		.message {
			flex: 1;
			color: var(--terminal-green, #00ff41);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.entry.expanded .message {
			white-space: normal;
			word-break: break-word;
		}

		/* Level-specific message colors */
		.entry[data-level="error"] .message {
			color: var(--terminal-red, #ff003c);
		}

		.entry[data-level="warn"] .message {
			color: var(--terminal-amber, #ffb000);
		}

		.entry[data-level="debug"] .message,
		.entry[data-level="trace"] .message {
			color: var(--terminal-gray, #666);
		}

		/* Tags */
		.tags {
			display: flex;
			gap: 4px;
			flex-shrink: 0;
		}

		.tag {
			padding: 1px 6px;
			background: var(--terminal-gray-dark, #333);
			color: var(--terminal-green, #00ff41);
			border-radius: 2px;
			font-size: 10px;
			cursor: pointer;
			transition: all 0.15s ease;
		}

		.tag:hover {
			background: var(--terminal-green, #00ff41);
			color: var(--terminal-black, #0a0a0a);
		}

		/* Actions */
		.actions {
			display: flex;
			gap: 4px;
			flex-shrink: 0;
			opacity: 0;
			transition: opacity 0.15s ease;
		}

		.entry:hover .actions {
			opacity: 1;
		}

		.action-btn {
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: transparent;
			border: none;
			color: var(--terminal-gray, #666);
			cursor: pointer;
			border-radius: 2px;
			padding: 0;
			transition: all 0.15s ease;
		}

		.action-btn:hover {
			background: var(--terminal-gray-dark, #333);
			color: var(--terminal-green, #00ff41);
		}

		.action-btn svg {
			width: 12px;
			height: 12px;
		}

		/* Details section */
		.details {
			display: none;
			padding: 0 12px 12px 40px;
			border-top: 1px dashed var(--entry-border);
			margin-top: 4px;
		}

		.entry.expanded .details {
			display: block;
		}

		.details-content {
			background: rgba(0, 0, 0, 0.3);
			border-radius: 4px;
			padding: 12px;
			margin-top: 8px;
			overflow-x: auto;
		}

		/* Detail fields */
		.detail-fields {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 4px 12px;
			font-size: 11px;
		}

		.detail-label {
			color: var(--terminal-gray, #666);
			text-transform: uppercase;
		}

		.detail-value {
			color: var(--terminal-green, #00ff41);
			word-break: break-all;
		}

		.detail-value.error {
			color: var(--terminal-red, #ff003c);
		}

		/* Stack trace */
		.stack-trace {
			margin-top: 12px;
			padding-top: 12px;
			border-top: 1px dashed var(--entry-border);
		}

		.stack-trace-title {
			color: var(--terminal-gray, #666);
			text-transform: uppercase;
			font-size: 10px;
			margin-bottom: 8px;
		}

		.stack-trace-content {
			font-size: 10px;
			color: var(--terminal-red, #ff003c);
			white-space: pre-wrap;
			font-family: inherit;
			line-height: 1.6;
		}

		/* Metadata table */
		.metadata-table {
			width: 100%;
			border-collapse: collapse;
			font-size: 11px;
			margin-top: 12px;
		}

		.metadata-table th,
		.metadata-table td {
			text-align: left;
			padding: 4px 8px;
			border-bottom: 1px solid var(--entry-border);
		}

		.metadata-table th {
			color: var(--terminal-gray, #666);
			text-transform: uppercase;
			font-weight: normal;
		}

		.metadata-table td {
			color: var(--terminal-green, #00ff41);
		}

		/* JSON viewer */
		.json-viewer {
			font-size: 11px;
			color: var(--terminal-green, #00ff41);
			white-space: pre-wrap;
			font-family: inherit;
		}

		.json-key {
			color: var(--terminal-cyan, #00ffff);
		}

		.json-string {
			color: var(--terminal-amber, #ffb000);
		}

		.json-number {
			color: var(--terminal-green, #00ff41);
		}

		.json-boolean {
			color: var(--terminal-purple, #9d00ff);
		}

		.json-null {
			color: var(--terminal-gray, #666);
		}

		/* Compact mode */
		:host([compact]) .entry-header {
			padding: 4px 8px;
		}

		:host([compact]) .timestamp {
			display: none;
		}

		:host([compact]) .source {
			display: none;
		}

		/* Dense mode */
		:host([dense]) .entry-header {
			padding: 2px 8px;
			gap: 4px;
		}

		:host([dense]) .expand-toggle,
		:host([dense]) .level-icon {
			width: 12px;
			height: 12px;
		}

		:host([dense]) .expand-toggle svg,
		:host([dense]) .level-icon svg {
			width: 10px;
			height: 10px;
		}

		:host([dense]) .message {
			font-size: 11px;
		}

		/* Zebra striping */
		:host([striped]) .entry:nth-child(even) {
			background: rgba(255, 255, 255, 0.02);
		}
	`];

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		...scrollbarProperties,

		/**
		 * Log level
		 * @property level
		 * @type {'debug'|'info'|'warn'|'error'|'success'|'trace'}
		 * @default 'info'
		 * @attribute level
		 * @reflects true
		 */
		level: {
			type: String,
			reflect: true
		},

		/**
		 * Timestamp (ISO string or Date)
		 * @property timestamp
		 * @type {String|Date}
		 * @attribute timestamp
		 */
		timestamp: {
			type: String
		},

		/**
		 * Timestamp format
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
		 * Log message
		 * @property message
		 * @type {String}
		 * @attribute message
		 */
		message: {
			type: String
		},

		/**
		 * Source/category of the log
		 * @property source
		 * @type {String}
		 * @attribute source
		 */
		source: {
			type: String
		},

		/**
		 * Tags for filtering
		 * @property tags
		 * @type {Array<String>}
		 */
		tags: {
			type: Array
		},

		/**
		 * Whether entry is expanded
		 * @property expanded
		 * @type {Boolean}
		 * @default false
		 * @attribute expanded
		 * @reflects true
		 */
		expanded: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether entry is expandable (has details)
		 * @property expandable
		 * @type {Boolean}
		 * @default false
		 * @attribute expandable
		 */
		expandable: {
			type: Boolean
		},

		/**
		 * Additional detail fields (key-value pairs)
		 * @property details
		 * @type {Object}
		 */
		details: {
			type: Object
		},

		/**
		 * Stack trace for errors
		 * @property stackTrace
		 * @type {String}
		 * @attribute stack-trace
		 */
		stackTrace: {
			type: String,
			attribute: 'stack-trace'
		},

		/**
		 * Metadata object to display as table
		 * @property metadata
		 * @type {Object}
		 */
		metadata: {
			type: Object
		},

		/**
		 * Raw data to display as JSON
		 * @property data
		 * @type {Object}
		 */
		data: {
			type: Object
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
		 * Custom icon (overrides level icon)
		 * @property icon
		 * @type {String}
		 */
		icon: {
			type: String
		},

		/**
		 * Hide level icons
		 * @property hideIcons
		 * @type {Boolean}
		 * @default false
		 * @attribute hide-icons
		 * @reflects true
		 */
		hideIcons: {
			type: Boolean,
			attribute: 'hide-icons',
			reflect: true
		}
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/**
	 * @private
	 */
	_logger = null;

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	// (Combined with BLOCK 4)

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Default values
		this.level = 'info';
		this.timestamp = null;
		this.timestampFormat = 'time';
		this.message = '';
		this.source = '';
		this.tags = [];
		this.expanded = false;
		this.expandable = false;
		this.details = null;
		this.stackTrace = '';
		this.metadata = null;
		this.data = null;
		this.compact = false;
		this.dense = false;
		this.icon = '';

		// Scrollbar defaults
		this.scrollbar = scrollbarDefaults.scrollbar;
		this.scrollbarStyle = scrollbarDefaults.scrollbarStyle;

		this._logger = componentLogger.for('TLogEntryLit');
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

	updated(changedProperties) {
		this._logger.trace('Updated', { changedProperties: [...changedProperties.keys()] });
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Toggle expanded state
	 * @public
	 * @returns {void}
	 * @fires entry-expand
	 */
	toggle() {
		if (!this._hasExpandableContent()) return;
		this._logger.debug('toggle called');
		this.expanded = !this.expanded;
		this._emitEvent('entry-expand', { expanded: this.expanded });
	}

	/**
	 * Expand the entry
	 * @public
	 * @returns {void}
	 * @fires entry-expand
	 */
	expand() {
		if (!this._hasExpandableContent() || this.expanded) return;
		this._logger.debug('expand called');
		this.expanded = true;
		this._emitEvent('entry-expand', { expanded: true });
	}

	/**
	 * Collapse the entry
	 * @public
	 * @returns {void}
	 * @fires entry-expand
	 */
	collapse() {
		if (!this.expanded) return;
		this._logger.debug('collapse called');
		this.expanded = false;
		this._emitEvent('entry-expand', { expanded: false });
	}

	// ============================================================
	// BLOCK 9: Event Emitters
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
	// BLOCK 10: Nesting Support
	// ============================================================

	// No nesting support needed

	// ============================================================
	// BLOCK 11: Validation
	// ============================================================

	// No validation needed

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		const hasExpandable = this._hasExpandableContent();

		const entryClasses = {
			entry: true,
			expanded: this.expanded
		};

		const expandClasses = {
			'expand-toggle': true,
			expanded: this.expanded,
			empty: !hasExpandable
		};

		return html`
			<div
				class=${classMap(entryClasses)}
				data-level=${this.level}
				part="entry"
			>
				<div
					class="entry-header"
					part="header"
					@click=${this._handleClick}
				>
					<span class=${classMap(expandClasses)}>
						${this.expanded ? unsafeHTML(caretDownIcon) : unsafeHTML(caretRightIcon)}
					</span>

					<span class="level-icon ${this.level}" part="icon">
						${this._renderLevelIcon()}
					</span>

					${this.timestamp ? html`
						<span class="timestamp ${this.timestampFormat === 'full' ? 'full' : ''}" part="timestamp">
							${this._formatTimestamp()}
						</span>
					` : ''}

					${this.source ? html`
						<span class="source" title=${this.source}>${this.source}</span>
					` : ''}

					<span class="message" part="message">${this.message}</span>

					${this.tags && this.tags.length > 0 ? html`
						<span class="tags" part="tags">
							${this.tags.map(tag => html`
								<span
									class="tag"
									@click=${(e) => this._handleTagClick(e, tag)}
								>${tag}</span>
							`)}
						</span>
					` : ''}

					<span class="actions">
						<slot name="actions"></slot>
					</span>
				</div>

				${hasExpandable ? html`
					<div class="details" part="details">
						<div class="details-content">
							<slot name="details">
								${this._renderDetails()}
							</slot>
						</div>
					</div>
				` : ''}
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Check if entry has expandable content
	 * @private
	 * @returns {boolean}
	 */
	_hasExpandableContent() {
		return this.expandable ||
			this.details ||
			this.stackTrace ||
			this.metadata ||
			this.data ||
			this.querySelector('[slot="details"]');
	}

	/**
	 * Render level icon
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderLevelIcon() {
		if (this.icon) {
			return unsafeHTML(this.icon);
		}

		const icons = {
			debug: codeIcon,
			info: infoIcon,
			warn: warningIcon,
			error: xCircleIcon,
			success: checkCircleIcon,
			trace: codeIcon
		};

		return unsafeHTML(icons[this.level] || infoIcon);
	}

	/**
	 * Format timestamp based on format setting
	 * @private
	 * @returns {string}
	 */
	_formatTimestamp() {
		if (!this.timestamp) return '';

		const date = this.timestamp instanceof Date
			? this.timestamp
			: new Date(this.timestamp);

		if (isNaN(date.getTime())) return this.timestamp;

		switch (this.timestampFormat) {
			case 'time':
				return date.toLocaleTimeString();
			case 'datetime':
				return date.toLocaleString();
			case 'full':
				return date.toISOString();
			case 'relative':
				return this._getRelativeTime(date);
			default:
				return date.toLocaleTimeString();
		}
	}

	/**
	 * Get relative time string
	 * @private
	 * @param {Date} date
	 * @returns {string}
	 */
	_getRelativeTime(date) {
		const now = new Date();
		const diff = now - date;
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (seconds < 60) return `${seconds}s ago`;
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	}

	/**
	 * Render details section
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderDetails() {
		return html`
			${this.details ? this._renderDetailFields() : ''}
			${this.stackTrace ? this._renderStackTrace() : ''}
			${this.metadata ? this._renderMetadataTable() : ''}
			${this.data ? this._renderJsonViewer() : ''}
		`;
	}

	/**
	 * Render detail fields
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderDetailFields() {
		if (!this.details || typeof this.details !== 'object') return '';

		return html`
			<div class="detail-fields">
				${Object.entries(this.details).map(([key, value]) => html`
					<span class="detail-label">${key}</span>
					<span class="detail-value">${String(value)}</span>
				`)}
			</div>
		`;
	}

	/**
	 * Render stack trace
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderStackTrace() {
		if (!this.stackTrace) return '';

		return html`
			<div class="stack-trace">
				<div class="stack-trace-title">Stack Trace</div>
				<pre class="stack-trace-content">${this.stackTrace}</pre>
			</div>
		`;
	}

	/**
	 * Render metadata table
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderMetadataTable() {
		if (!this.metadata || typeof this.metadata !== 'object') return '';

		return html`
			<table class="metadata-table">
				<thead>
					<tr>
						<th>Key</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					${Object.entries(this.metadata).map(([key, value]) => html`
						<tr>
							<td>${key}</td>
							<td>${String(value)}</td>
						</tr>
					`)}
				</tbody>
			</table>
		`;
	}

	/**
	 * Render JSON viewer with syntax highlighting
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderJsonViewer() {
		if (!this.data) return '';

		try {
			const json = JSON.stringify(this.data, null, 2);
			const highlighted = this._highlightJson(json);
			return html`<pre class="json-viewer">${unsafeHTML(highlighted)}</pre>`;
		} catch {
			return html`<pre class="json-viewer">[Invalid JSON]</pre>`;
		}
	}

	/**
	 * Highlight JSON syntax
	 * @private
	 * @param {string} json
	 * @returns {string}
	 */
	_highlightJson(json) {
		return json
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
			.replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
			.replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
			.replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
			.replace(/: (null)/g, ': <span class="json-null">$1</span>');
	}

	/**
	 * Handle header click
	 * @private
	 * @param {Event} e
	 */
	_handleClick(e) {
		this._logger.debug('Entry clicked');
		this._emitEvent('entry-click', {
			level: this.level,
			message: this.message,
			timestamp: this.timestamp
		});

		if (this._hasExpandableContent()) {
			this.toggle();
		}
	}

	/**
	 * Handle tag click
	 * @private
	 * @param {Event} e
	 * @param {string} tag
	 */
	_handleTagClick(e, tag) {
		e.stopPropagation();
		this._logger.debug('Tag clicked', { tag });
		this._emitEvent('tag-click', { tag });
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(TLogEntryLit.tagName)) {
	customElements.define(TLogEntryLit.tagName, TLogEntryLit);
}

export default TLogEntryLit;
