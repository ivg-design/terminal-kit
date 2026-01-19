/**
 * @fileoverview TMenuLit - Dropdown/context menu component
 * @module components/TMenuLit
 * @version 3.0.0
 *
 * A dropdown menu component with item selection, keyboard navigation,
 * dividers, icons, and sub-menus support.
 *
 * @example
 * <t-menu>
 *   <button slot="trigger">Open Menu</button>
 * </t-menu>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import componentLogger from '../utils/ComponentLogger.js';

// ============================================================
// BLOCK 1: Static Metadata
// ============================================================
const tagName = 't-menu';
const version = '3.0.0';
const category = 'Core';

// ============================================================
// BLOCK 2: Static Styles
// ============================================================
const styles = css`
	:host {
		--menu-bg: var(--terminal-gray-darkest, #1a1a1a);
		--menu-border: var(--terminal-gray-dark, #333);
		--menu-green: var(--terminal-green, #00ff41);
		--menu-green-dim: var(--terminal-green-dim, #00cc33);
		--menu-amber: var(--terminal-amber, #ffb000);
		--menu-red: var(--terminal-red, #ff003c);
		--menu-cyan: var(--terminal-cyan, #00ffff);
		--menu-gray: var(--terminal-gray, #666);
		--menu-radius: 4px;
		--menu-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

		display: inline-block;
		position: relative;
		font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
	}

	.trigger {
		cursor: pointer;
	}

	.menu-container {
		position: absolute;
		z-index: 1000;
		min-width: 180px;
		max-height: var(--menu-max-height, 300px);
		background: var(--menu-bg);
		border: 1px solid var(--menu-border);
		border-radius: var(--menu-radius);
		box-shadow: var(--menu-shadow);
		overflow-y: auto;
		opacity: 0;
		visibility: hidden;
		transform: translateY(-8px);
		transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
	}

	.menu-container.open {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}

	/* Positions */
	.menu-container.bottom-start {
		top: 100%;
		left: 0;
		margin-top: 4px;
	}

	.menu-container.bottom-end {
		top: 100%;
		right: 0;
		margin-top: 4px;
	}

	.menu-container.top-start {
		bottom: 100%;
		left: 0;
		margin-bottom: 4px;
	}

	.menu-container.top-end {
		bottom: 100%;
		right: 0;
		margin-bottom: 4px;
	}

	/* Search */
	.menu-search {
		padding: 8px;
		border-bottom: 1px solid var(--menu-border);
	}

	.menu-search input {
		width: 100%;
		background: transparent;
		border: 1px solid var(--menu-border);
		color: var(--menu-green);
		padding: 6px 10px;
		font-family: inherit;
		font-size: 12px;
		border-radius: 2px;
		outline: none;
	}

	.menu-search input:focus {
		border-color: var(--menu-green);
	}

	.menu-search input::placeholder {
		color: var(--menu-gray);
	}

	/* Menu items */
	.menu-items {
		padding: 4px 0;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 12px;
		color: var(--menu-green-dim);
		font-size: 13px;
		cursor: pointer;
		transition: all 0.1s ease;
	}

	.menu-item:hover,
	.menu-item.focused {
		background: rgba(0, 255, 65, 0.1);
		color: var(--menu-green);
	}

	.menu-item.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.menu-item.disabled:hover {
		background: transparent;
		color: var(--menu-green-dim);
	}

	.menu-item.selected {
		background: rgba(0, 255, 65, 0.15);
		color: var(--menu-green);
	}

	.menu-item-icon {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.menu-item-icon svg {
		width: 14px;
		height: 14px;
		fill: currentColor;
	}

	.menu-item-label {
		flex: 1;
	}

	.menu-item-shortcut {
		font-size: 11px;
		color: var(--menu-gray);
		margin-left: auto;
	}

	.menu-item-arrow {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-item-arrow svg {
		width: 12px;
		height: 12px;
		fill: currentColor;
	}

	/* Divider */
	.menu-divider {
		height: 1px;
		background: var(--menu-border);
		margin: 4px 0;
	}

	/* Group header */
	.menu-group {
		padding: 8px 12px 4px;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--menu-gray);
	}

	/* Empty state */
	.menu-empty {
		padding: 16px 12px;
		text-align: center;
		color: var(--menu-gray);
		font-size: 12px;
	}

	/* Custom scrollbar */
	.menu-container::-webkit-scrollbar {
		width: 6px;
	}

	.menu-container::-webkit-scrollbar-track {
		background: var(--menu-bg);
	}

	.menu-container::-webkit-scrollbar-thumb {
		background: var(--menu-border);
		border-radius: 3px;
	}

	.menu-container::-webkit-scrollbar-thumb:hover {
		background: var(--menu-green-dim);
	}
`;

/**
 * @component TMenuLit
 * @tagname t-menu
 * @description Dropdown/context menu component with selection, keyboard navigation, and submenu support
 * @category Core
 * @since 3.0.0
 *
 * TMenuLit - Dropdown/context menu component
 *
 * @slot trigger - The trigger element that opens the menu
 *
 * @fires menu-select - Fired when a menu item is selected
 * @fires menu-open - Fired when the menu opens
 * @fires menu-close - Fired when the menu closes
 *
 * @cssprop [--menu-bg] - Menu background color
 * @cssprop [--menu-border] - Menu border color
 * @cssprop [--menu-max-height] - Maximum menu height
 */
class TMenuLit extends LitElement {
	// ============================================================
	// BLOCK 1: Static Metadata (getters)
	// ============================================================

	static get tagName() {
		return tagName;
	}

	static get version() {
		return version;
	}

	static get category() {
		return category;
	}

	// ============================================================
	// BLOCK 2: Static Styles
	// ============================================================

	static styles = styles;

	// ============================================================
	// BLOCK 3: Reactive Properties
	// ============================================================

	static properties = {
		/**
		 * Menu items array
		 * @property items
		 * @type {Array<{id: string, label: string, icon?: string, shortcut?: string, disabled?: boolean, divider?: boolean, group?: string}>}
		 * @default []
		 */
		items: {
			type: Array
		},

		/**
		 * Trigger type for opening menu
		 * @property trigger
		 * @type {'click'|'hover'|'context'}
		 * @default 'click'
		 * @attribute trigger
		 * @reflects true
		 */
		trigger: {
			type: String,
			reflect: true
		},

		/**
		 * Menu position relative to trigger
		 * @property position
		 * @type {'bottom-start'|'bottom-end'|'top-start'|'top-end'}
		 * @default 'bottom-start'
		 * @attribute position
		 * @reflects true
		 */
		position: {
			type: String,
			reflect: true
		},

		/**
		 * Whether the menu is open
		 * @property open
		 * @type {boolean}
		 * @default false
		 * @attribute open
		 * @reflects true
		 */
		open: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Whether to show search input
		 * @property searchable
		 * @type {boolean}
		 * @default false
		 * @attribute searchable
		 * @reflects true
		 */
		searchable: {
			type: Boolean,
			reflect: true
		},

		/**
		 * Maximum menu height
		 * @property maxHeight
		 * @type {string}
		 * @default '300px'
		 * @attribute max-height
		 */
		maxHeight: {
			type: String,
			attribute: 'max-height'
		}
	};

	// ============================================================
	// BLOCK 4: Internal State
	// ============================================================

	/**
	 * Currently focused item index
	 * @type {number}
	 * @private
	 */
	_focusedIndex = -1;

	/**
	 * Search query
	 * @type {string}
	 * @private
	 */
	_searchQuery = '';

	/**
	 * Document click handler reference
	 * @type {Function|null}
	 * @private
	 */
	_documentClickHandler = null;

	/**
	 * Document keydown handler reference
	 * @type {Function|null}
	 * @private
	 */
	_documentKeydownHandler = null;

	// ============================================================
	// BLOCK 5: Logger Instance
	// ============================================================

	/**
	 * Component logger instance
	 * @type {Object|null}
	 * @private
	 */
	_logger = null;

	// ============================================================
	// BLOCK 6: Constructor
	// ============================================================

	constructor() {
		super();

		// Default values
		this.items = [];
		this.trigger = 'click';
		this.position = 'bottom-start';
		this.open = false;
		this.searchable = false;
		this.maxHeight = '300px';

		this._logger = componentLogger.for('TMenuLit');
		this._logger.debug('Component constructed');

		// Bind methods
		this._handleTriggerClick = this._handleTriggerClick.bind(this);
		this._handleTriggerHover = this._handleTriggerHover.bind(this);
		this._handleTriggerContext = this._handleTriggerContext.bind(this);
		this._handleDocumentClick = this._handleDocumentClick.bind(this);
		this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);
		this._handleSearchInput = this._handleSearchInput.bind(this);
	}

	// ============================================================
	// BLOCK 7: Lifecycle Methods
	// ============================================================

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Connected to DOM');

		// Add document listeners
		this._documentClickHandler = this._handleDocumentClick;
		this._documentKeydownHandler = this._handleDocumentKeydown;
		document.addEventListener('click', this._documentClickHandler);
		document.addEventListener('keydown', this._documentKeydownHandler);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Disconnected from DOM');

		// Remove document listeners
		if (this._documentClickHandler) {
			document.removeEventListener('click', this._documentClickHandler);
		}
		if (this._documentKeydownHandler) {
			document.removeEventListener('keydown', this._documentKeydownHandler);
		}
	}

	firstUpdated() {
		this._logger.debug('First update complete');
	}

	updated(changedProperties) {
		this._logger.trace('Updated', { changedProperties: [...changedProperties.keys()] });

		if (changedProperties.has('open')) {
			if (this.open) {
				this._emitEvent('menu-open');
				// Focus search or first item
				this.updateComplete.then(() => {
					if (this.searchable) {
						const searchInput = this.shadowRoot.querySelector('.menu-search input');
						searchInput?.focus();
					} else {
						this._focusedIndex = this._getFirstSelectableIndex();
					}
				});
			} else {
				this._emitEvent('menu-close');
				this._focusedIndex = -1;
				this._searchQuery = '';
			}
		}
	}

	// ============================================================
	// BLOCK 8: Public API Methods
	// ============================================================

	/**
	 * Open the menu
	 * @public
	 * @returns {void}
	 * @fires menu-open
	 */
	show() {
		this._logger.debug('show called');
		this.open = true;
	}

	/**
	 * Close the menu
	 * @public
	 * @returns {void}
	 * @fires menu-close
	 */
	hide() {
		this._logger.debug('hide called');
		this.open = false;
	}

	/**
	 * Toggle the menu
	 * @public
	 * @returns {void}
	 */
	toggle() {
		this._logger.debug('toggle called');
		this.open = !this.open;
	}

	/**
	 * Select an item by ID
	 * @public
	 * @param {string} id - Item ID to select
	 * @returns {void}
	 * @fires menu-select
	 */
	selectItem(id) {
		this._logger.debug('selectItem called', { id });
		const item = this.items.find(i => i.id === id);
		if (item && !item.disabled && !item.divider) {
			this._selectItem(item);
		}
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

	// No nesting support needed for this component

	// ============================================================
	// BLOCK 11: Validation
	// ============================================================

	// No validation needed for this component

	// ============================================================
	// BLOCK 12: Render Method
	// ============================================================

	/**
	 * Render the component
	 * @returns {import('lit').TemplateResult}
	 */
	render() {
		this._logger.trace('Rendering');

		const menuClasses = {
			'menu-container': true,
			open: this.open,
			[this.position]: true,
		};

		const filteredItems = this._getFilteredItems();

		return html`
			<div
				class="trigger"
				@click=${this.trigger === 'click' ? this._handleTriggerClick : null}
				@mouseenter=${this.trigger === 'hover' ? this._handleTriggerHover : null}
				@contextmenu=${this.trigger === 'context' ? this._handleTriggerContext : null}
			>
				<slot name="trigger"></slot>
			</div>

			<div
				class=${classMap(menuClasses)}
				role="menu"
				aria-hidden=${!this.open}
				style="--menu-max-height: ${this.maxHeight}"
			>
				${this.searchable
					? html`
							<div class="menu-search">
								<input
									type="text"
									placeholder="Search..."
									.value=${this._searchQuery}
									@input=${this._handleSearchInput}
									@keydown=${this._handleSearchKeydown}
								/>
							</div>
						`
					: ''}

				<div class="menu-items">
					${filteredItems.length === 0
						? html`<div class="menu-empty">No items found</div>`
						: filteredItems.map((item, index) => this._renderItem(item, index))}
				</div>
			</div>
		`;
	}

	// ============================================================
	// BLOCK 13: Private Helpers
	// ============================================================

	/**
	 * Render a menu item
	 * @private
	 * @param {Object} item - Item to render
	 * @param {number} index - Item index
	 * @returns {import('lit').TemplateResult}
	 */
	_renderItem(item, index) {
		if (item.divider) {
			return html`<div class="menu-divider"></div>`;
		}

		if (item.group) {
			return html`<div class="menu-group">${item.group}</div>`;
		}

		const itemClasses = {
			'menu-item': true,
			disabled: item.disabled,
			focused: index === this._focusedIndex,
			selected: item.selected,
		};

		return html`
			<div
				class=${classMap(itemClasses)}
				role="menuitem"
				tabindex=${item.disabled ? '-1' : '0'}
				aria-disabled=${item.disabled}
				@click=${() => this._handleItemClick(item)}
				@mouseenter=${() => this._handleItemHover(index)}
			>
				${item.icon
					? html`
							<span class="menu-item-icon">
								<svg viewBox="0 0 24 24">
									<use href="#icon-${item.icon}"></use>
								</svg>
							</span>
						`
					: ''}
				<span class="menu-item-label">${item.label}</span>
				${item.shortcut
					? html`<span class="menu-item-shortcut">${item.shortcut}</span>`
					: ''}
				${item.children?.length
					? html`
							<span class="menu-item-arrow">
								<svg viewBox="0 0 24 24">
									<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
								</svg>
							</span>
						`
					: ''}
			</div>
		`;
	}

	/**
	 * Get filtered items based on search query
	 * @private
	 * @returns {Array}
	 */
	_getFilteredItems() {
		if (!this._searchQuery) {
			return this.items;
		}

		const query = this._searchQuery.toLowerCase();
		return this.items.filter(item => {
			if (item.divider || item.group) return false;
			return item.label.toLowerCase().includes(query);
		});
	}

	/**
	 * Get first selectable item index
	 * @private
	 * @returns {number}
	 */
	_getFirstSelectableIndex() {
		const items = this._getFilteredItems();
		return items.findIndex(item => !item.disabled && !item.divider && !item.group);
	}

	/**
	 * Handle trigger click
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleTriggerClick(e) {
		e.stopPropagation();
		this.toggle();
	}

	/**
	 * Handle trigger hover
	 * @private
	 */
	_handleTriggerHover() {
		this.show();
	}

	/**
	 * Handle trigger context menu
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleTriggerContext(e) {
		e.preventDefault();
		e.stopPropagation();
		this.show();
	}

	/**
	 * Handle document click to close menu
	 * @private
	 * @param {MouseEvent} e
	 */
	_handleDocumentClick(e) {
		if (this.open && !this.contains(e.target)) {
			this.hide();
		}
	}

	/**
	 * Handle document keydown for keyboard navigation
	 * @private
	 * @param {KeyboardEvent} e
	 */
	_handleDocumentKeydown(e) {
		if (!this.open) return;

		const items = this._getFilteredItems();
		const selectableItems = items.filter(item => !item.disabled && !item.divider && !item.group);

		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				this.hide();
				break;

			case 'ArrowDown':
				e.preventDefault();
				this._moveFocus(1);
				break;

			case 'ArrowUp':
				e.preventDefault();
				this._moveFocus(-1);
				break;

			case 'Enter':
			case ' ':
				e.preventDefault();
				if (this._focusedIndex >= 0) {
					const item = this._getFilteredItems()[this._focusedIndex];
					if (item && !item.disabled && !item.divider && !item.group) {
						this._selectItem(item);
					}
				}
				break;

			case 'Home':
				e.preventDefault();
				this._focusedIndex = this._getFirstSelectableIndex();
				this.requestUpdate();
				break;

			case 'End':
				e.preventDefault();
				const lastIndex = items.length - 1 - [...items].reverse().findIndex(item =>
					!item.disabled && !item.divider && !item.group
				);
				if (lastIndex >= 0 && lastIndex < items.length) {
					this._focusedIndex = lastIndex;
					this.requestUpdate();
				}
				break;
		}
	}

	/**
	 * Move focus by delta
	 * @private
	 * @param {number} delta - Direction to move
	 */
	_moveFocus(delta) {
		const items = this._getFilteredItems();
		let newIndex = this._focusedIndex;

		do {
			newIndex += delta;
			if (newIndex < 0) newIndex = items.length - 1;
			if (newIndex >= items.length) newIndex = 0;

			const item = items[newIndex];
			if (!item.disabled && !item.divider && !item.group) {
				this._focusedIndex = newIndex;
				this.requestUpdate();
				return;
			}
		} while (newIndex !== this._focusedIndex);
	}

	/**
	 * Handle item click
	 * @private
	 * @param {Object} item
	 */
	_handleItemClick(item) {
		if (item.disabled) return;
		this._selectItem(item);
	}

	/**
	 * Handle item hover
	 * @private
	 * @param {number} index
	 */
	_handleItemHover(index) {
		this._focusedIndex = index;
		this.requestUpdate();
	}

	/**
	 * Select an item
	 * @private
	 * @param {Object} item
	 */
	_selectItem(item) {
		this._emitEvent('menu-select', {
			id: item.id,
			label: item.label,
			item
		});
		this.hide();
	}

	/**
	 * Handle search input
	 * @private
	 * @param {InputEvent} e
	 */
	_handleSearchInput(e) {
		this._searchQuery = e.target.value;
		this._focusedIndex = this._getFirstSelectableIndex();
		this.requestUpdate();
	}

	/**
	 * Handle search keydown
	 * @private
	 * @param {KeyboardEvent} e
	 */
	_handleSearchKeydown(e) {
		// Prevent document handler from processing these keys in search
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			// Let document handler process for menu navigation
		}
	}
}

// ============================================================
// Registration
// ============================================================

if (!customElements.get(tagName)) {
	customElements.define(tagName, TMenuLit);
}

export default TMenuLit;
