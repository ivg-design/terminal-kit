// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component TTabsLit
 * @tagname t-tabs
 * @description Tab navigation component with panel switching, variants, and keyboard navigation.
 * @category Container
 * @since 3.0.0
 * @example
 * <t-tabs tabs='[{"id": "tab1", "label": "Tab 1"}, {"id": "tab2", "label": "Tab 2"}]'>
 *   <div slot="tab-tab1">Content 1</div>
 *   <div slot="tab-tab2">Content 2</div>
 * </t-tabs>
 */
export class TTabsLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-tabs';
	static version = '3.0.0';
	static category = 'Container';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		/**
		 * TTabsLit Component Styles
		 * Tab navigation with terminal styling
		 */

		/* Host styles */
		:host {
			display: flex;
			flex-direction: column;
			--tabs-bg: var(--terminal-gray-darkest, #1a1a1a);
			--tabs-color: var(--terminal-green, #00ff41);
			--tabs-color-dim: var(--terminal-green-dim, #00cc33);
			--tabs-border: var(--terminal-gray-dark, #2a2a2a);
			--tabs-active-bg: var(--terminal-gray-dark, #2a2a2a);
			--tabs-glow: rgba(0, 255, 65, 0.3);
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: hidden;
		}

		:host([hidden]) {
			display: none !important;
		}

		/* Tab list container */
		.tab-list {
			display: flex;
			background: var(--tabs-bg);
			border-bottom: 1px solid var(--tabs-border);
			overflow-x: auto;
			scrollbar-width: thin;
			scrollbar-color: var(--tabs-color-dim) var(--tabs-bg);
		}

		.tab-list::-webkit-scrollbar {
			height: 4px;
		}

		.tab-list::-webkit-scrollbar-track {
			background: var(--tabs-bg);
		}

		.tab-list::-webkit-scrollbar-thumb {
			background: var(--tabs-color-dim);
			border-radius: 2px;
		}

		/* Vertical orientation */
		:host([orientation="vertical"]) {
			display: flex;
			flex-direction: row;
			align-items: stretch;
		}

		:host([orientation="vertical"]) .tab-list {
			flex-direction: column;
			border-bottom: none;
			border-right: 1px solid var(--tabs-border);
			overflow-x: visible;
			overflow-y: auto;
			min-width: 150px;
		}

		:host([orientation="vertical"]) .tab-panels {
			flex: 1;
		}

		/* Individual tab */
		.tab {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 12px 16px;
			background: transparent;
			border: none;
			color: var(--tabs-color-dim);
			font-family: var(--font-mono, 'Courier New', monospace);
			font-size: 12px;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			cursor: pointer;
			transition: all 0.2s ease;
			position: relative;
			white-space: nowrap;
		}

		.tab:hover {
			color: var(--tabs-color);
			background: rgba(0, 255, 65, 0.05);
		}

		.tab:focus {
			outline: none;
			box-shadow: inset 0 0 0 1px var(--tabs-color);
		}

		.tab.active {
			color: var(--tabs-color);
			background: var(--tabs-active-bg);
		}

		/* Active indicator - horizontal */
		.tab.active::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 2px;
			background: var(--tabs-color);
			box-shadow: 0 0 8px var(--tabs-glow);
		}

		/* Active indicator - vertical */
		:host([orientation="vertical"]) .tab.active::after {
			bottom: auto;
			left: auto;
			right: 0;
			top: 0;
			width: 2px;
			height: 100%;
		}

		/* Tab icon */
		.tab-icon {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.tab-icon svg {
			width: 14px;
			height: 14px;
			fill: currentColor;
		}

		/* Close button */
		.tab-close {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 16px;
			height: 16px;
			padding: 0;
			background: transparent;
			border: none;
			color: var(--tabs-color-dim);
			cursor: pointer;
			border-radius: 2px;
			opacity: 0;
			transition: opacity 0.2s ease, background 0.2s ease;
		}

		.tab:hover .tab-close {
			opacity: 1;
		}

		.tab-close:hover {
			background: rgba(255, 0, 60, 0.2);
			color: var(--terminal-red, #ff003c);
		}

		.tab-close svg {
			width: 10px;
			height: 10px;
			fill: currentColor;
		}

		/* Disabled tab */
		.tab.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.tab.disabled:hover {
			color: var(--tabs-color-dim);
			background: transparent;
		}

		/* Tab panels container */
		.tab-panels {
			padding: 8px;
			background: var(--tabs-bg);
			flex: 1;
			min-height: 0;
			overflow: auto;
		}

		/* Individual panel */
		.tab-panel {
			display: none;
			height: 100%;
		}

		.tab-panel.active {
			display: flex;
			flex-direction: column;
		}

		/* Size variants */
		:host([size="sm"]) .tab {
			padding: 8px 12px;
			font-size: 11px;
		}

		:host([size="lg"]) .tab {
			padding: 16px 20px;
			font-size: 14px;
		}

		/* Variant styles */
		:host([variant="boxed"]) .tab-list {
			border-bottom: none;
			gap: 4px;
			padding: 4px;
		}

		:host([variant="boxed"]) .tab {
			border: 1px solid transparent;
			border-radius: 4px;
		}

		:host([variant="boxed"]) .tab.active {
			border-color: var(--tabs-color);
		}

		:host([variant="boxed"]) .tab.active::after {
			display: none;
		}

		:host([variant="pills"]) .tab-list {
			border-bottom: none;
			gap: 8px;
			padding: 8px;
		}

		:host([variant="pills"]) .tab {
			border-radius: 20px;
			padding: 8px 16px;
		}

		:host([variant="pills"]) .tab.active {
			background: var(--tabs-color);
			color: var(--terminal-black, #0a0a0a);
		}

		:host([variant="pills"]) .tab.active::after {
			display: none;
		}

		/* Accessibility - reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.tab,
			.tab-close {
				transition: none;
			}
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: STATIC PROPERTIES DEFINITION (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		/**
		 * Tab definitions array
		 * @property tabs
		 * @type {Array}
		 * @default []
		 * @attribute tabs
		 */
		tabs: {
			type: Array,
			converter: {
				fromAttribute: (value) => {
					try {
						return JSON.parse(value);
					} catch {
						return [];
					}
				},
				toAttribute: (value) => JSON.stringify(value)
			}
		},

		/**
		 * Active tab ID
		 * @property activeTab
		 * @type {String}
		 * @default ''
		 * @attribute active-tab
		 * @reflects true
		 */
		activeTab: {
			type: String,
			attribute: 'active-tab',
			reflect: true
		},

		/**
		 * Tab orientation
		 * @property orientation
		 * @type {String}
		 * @default 'horizontal'
		 * @attribute orientation
		 * @reflects true
		 */
		orientation: {
			type: String,
			reflect: true
		},

		/**
		 * Visual variant
		 * @property variant
		 * @type {String}
		 * @default 'default'
		 * @attribute variant
		 * @reflects true
		 */
		variant: {
			type: String,
			reflect: true
		},

		/**
		 * Size variant
		 * @property size
		 * @type {String}
		 * @default 'md'
		 * @attribute size
		 * @reflects true
		 */
		size: {
			type: String,
			reflect: true
		},

		/**
		 * Lazy load tab content
		 * @property lazy
		 * @type {Boolean}
		 * @default false
		 * @attribute lazy
		 * @reflects true
		 */
		lazy: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Allow tabs to be closed
		 * @property closable
		 * @type {Boolean}
		 * @default false
		 * @attribute closable
		 * @reflects true
		 */
		closable: {
			type: Boolean,
			reflect: true
		}
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (REQUIRED)
	// ----------------------------------------------------------
	/**
	 * @private
	 */
	_logger = null;

	/**
	 * Track loaded tabs for lazy loading
	 * @private
	 */
	_loadedTabs = new Set();

	// ----------------------------------------------------------
	// BLOCK 5: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();

		// Initialize logger
		this._logger = componentLogger.for('TTabsLit');

		// Set default property values
		this.tabs = [];
		this.activeTab = '';
		this.orientation = 'horizontal';
		this.variant = 'default';
		this.size = 'md';
		this.lazy = false;
		this.closable = false;

		this._logger.debug('Component constructed with defaults');
	}

	// ----------------------------------------------------------
	// BLOCK 6: LIFECYCLE CALLBACKS (REQUIRED)
	// ----------------------------------------------------------
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

		// Set initial active tab if not set
		if (!this.activeTab && this.tabs.length > 0) {
			const firstEnabled = this.tabs.find(t => !t.disabled);
			if (firstEnabled) {
				this.activeTab = firstEnabled.id;
			}
		}

		// Mark initial tab as loaded
		if (this.activeTab) {
			this._loadedTabs.add(this.activeTab);
		}
	}

	updated(changedProperties) {
		this._logger.trace('Updated', Object.fromEntries(changedProperties));

		// Mark new active tab as loaded
		if (changedProperties.has('activeTab') && this.activeTab) {
			this._loadedTabs.add(this.activeTab);
		}
	}

	// ----------------------------------------------------------
	// BLOCK 7: PUBLIC API METHODS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Select a tab by ID
	 * @public
	 * @param {string} tabId - Tab ID to select
	 */
	selectTab(tabId) {
		const tab = this.tabs.find(t => t.id === tabId);
		if (!tab || tab.disabled) {
			this._logger.warn('Cannot select tab', { tabId, reason: tab ? 'disabled' : 'not found' });
			return;
		}

		this._logger.debug('Selecting tab', { tabId });
		const previousTab = this.activeTab;
		this.activeTab = tabId;

		this._emitEvent('tab-change', {
			tabId,
			previousTabId: previousTab,
			tab
		});
	}

	/**
	 * Add a new tab
	 * @public
	 * @param {Object} tab - Tab definition
	 */
	addTab(tab) {
		if (!tab.id || !tab.label) {
			this._logger.warn('Invalid tab definition', tab);
			return;
		}

		this._logger.debug('Adding tab', tab);
		this.tabs = [...this.tabs, tab];
	}

	/**
	 * Remove a tab by ID
	 * @public
	 * @param {string} tabId - Tab ID to remove
	 */
	removeTab(tabId) {
		const tabIndex = this.tabs.findIndex(t => t.id === tabId);
		if (tabIndex === -1) return;

		this._logger.debug('Removing tab', { tabId });
		const removedTab = this.tabs[tabIndex];
		this.tabs = this.tabs.filter(t => t.id !== tabId);
		this._loadedTabs.delete(tabId);

		// If removing active tab, select adjacent
		if (this.activeTab === tabId && this.tabs.length > 0) {
			const newIndex = Math.min(tabIndex, this.tabs.length - 1);
			const newTab = this.tabs[newIndex];
			if (newTab && !newTab.disabled) {
				this.selectTab(newTab.id);
			}
		}

		this._emitEvent('tab-close', { tabId, tab: removedTab });
	}

	/**
	 * Get current active tab
	 * @public
	 * @returns {Object|null}
	 */
	getActiveTab() {
		return this.tabs.find(t => t.id === this.activeTab) || null;
	}

	// ----------------------------------------------------------
	// BLOCK 8: EVENT EMITTERS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Emit a custom event
	 * @private
	 * @param {string} eventName - Event name
	 * @param {Object} detail - Event detail
	 */
	_emitEvent(eventName, detail = {}) {
		this.dispatchEvent(new CustomEvent(eventName, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	// ----------------------------------------------------------
	// BLOCK 9: PRIVATE HELPERS (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Handle tab click
	 * @private
	 * @param {Event} e
	 * @param {Object} tab
	 */
	_handleTabClick(e, tab) {
		if (tab.disabled) return;
		this.selectTab(tab.id);
	}

	/**
	 * Handle close click
	 * @private
	 * @param {Event} e
	 * @param {string} tabId
	 */
	_handleCloseClick(e, tabId) {
		e.stopPropagation();
		this.removeTab(tabId);
	}

	/**
	 * Handle keyboard navigation
	 * @private
	 * @param {KeyboardEvent} e
	 */
	_handleKeyDown(e) {
		const enabledTabs = this.tabs.filter(t => !t.disabled);
		const currentIndex = enabledTabs.findIndex(t => t.id === this.activeTab);

		let newIndex = currentIndex;

		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				e.preventDefault();
				newIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
				break;
			case 'ArrowRight':
			case 'ArrowDown':
				e.preventDefault();
				newIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
				break;
			case 'Home':
				e.preventDefault();
				newIndex = 0;
				break;
			case 'End':
				e.preventDefault();
				newIndex = enabledTabs.length - 1;
				break;
			default:
				return;
		}

		if (newIndex !== currentIndex) {
			this.selectTab(enabledTabs[newIndex].id);
			// Focus the new tab button
			this.updateComplete.then(() => {
				const tabButtons = this.shadowRoot.querySelectorAll('.tab:not(.disabled)');
				tabButtons[newIndex]?.focus();
			});
		}
	}

	/**
	 * Check if tab should render content (for lazy loading)
	 * @private
	 * @param {string} tabId
	 * @returns {boolean}
	 */
	_shouldRenderContent(tabId) {
		if (!this.lazy) return true;
		return this._loadedTabs.has(tabId);
	}

	// ----------------------------------------------------------
	// BLOCK 10: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------

	/**
	 * Render close button
	 * @private
	 * @returns {import('lit').TemplateResult}
	 */
	_renderCloseIcon() {
		return html`
			<svg viewBox="0 0 24 24">
				<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
			</svg>
		`;
	}

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering', {
			tabCount: this.tabs.length,
			activeTab: this.activeTab
		});

		return html`
			<div
				class="tab-list"
				role="tablist"
				aria-orientation="${this.orientation}"
				@keydown="${this._handleKeyDown}"
			>
				${this.tabs.map(tab => html`
					<button
						class="tab ${tab.id === this.activeTab ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}"
						role="tab"
						aria-selected="${tab.id === this.activeTab}"
						aria-controls="panel-${tab.id}"
						tabindex="${tab.id === this.activeTab ? '0' : '-1'}"
						?disabled="${tab.disabled}"
						@click="${(e) => this._handleTabClick(e, tab)}"
					>
						${tab.icon ? html`<span class="tab-icon">${tab.icon}</span>` : ''}
						<span class="tab-label">${tab.label}</span>
						${this.closable && !tab.unclosable ? html`
							<button
								class="tab-close"
								aria-label="Close ${tab.label}"
								@click="${(e) => this._handleCloseClick(e, tab.id)}"
							>
								${this._renderCloseIcon()}
							</button>
						` : ''}
					</button>
				`)}
			</div>
			<div class="tab-panels">
				${this.tabs.map(tab => html`
					<div
						id="panel-${tab.id}"
						class="tab-panel ${tab.id === this.activeTab ? 'active' : ''}"
						role="tabpanel"
						aria-labelledby="tab-${tab.id}"
						?hidden="${tab.id !== this.activeTab}"
					>
						${this._shouldRenderContent(tab.id) ? html`
							<slot name="tab-${tab.id}"></slot>
						` : ''}
					</div>
				`)}
			</div>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 11: STATIC REGISTRATION (REQUIRED)
	// ----------------------------------------------------------
	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ----------------------------------------------------------
// BLOCK 12: EXPORTS (REQUIRED)
// ----------------------------------------------------------
export default TTabsLit;

// Terminal-specific re-export
export const TerminalTabs = TTabsLit;
