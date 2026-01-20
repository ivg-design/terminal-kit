/**
 * @fileoverview TAccordionLit - Terminal-style Accordion Component
 * @module components/TAccordionLit
 * @version 3.0.0
 *
 * An accordion component with collapsible sections, terminal styling,
 * and support for single or multiple open panels.
 *
 * @example
 * <t-accordion>
 *   <t-accordion-item title="Section 1">Content 1</t-accordion-item>
 *   <t-accordion-item title="Section 2">Content 2</t-accordion-item>
 * </t-accordion>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { caretRightIcon, caretDownIcon } from '../utils/phosphor-icons.js';

// ============================================================
// SECTION 1: ACCORDION ITEM COMPONENT
// ============================================================

/**
 * @component TAccordionItemLit
 * @tagname t-accordion-item
 * @description Individual accordion panel with header and content
 */
export class TAccordionItemLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-accordion-item';
	static version = '3.0.0';
	static category = 'Container';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		:host {
			display: block;
			--item-bg: var(--terminal-gray-dark, #242424);
			--item-border: var(--terminal-gray-dark, #333);
			--item-color: var(--terminal-green, #00ff41);
			--item-text: var(--terminal-green-dim, #00cc33);
			--item-header-bg: var(--terminal-gray-darkest, #1a1a1a);
		}

		:host([disabled]) {
			opacity: 0.5;
			pointer-events: none;
		}

		.item {
			border: 1px solid var(--item-border);
			margin-top: -1px;
		}

		:host(:first-child) .item {
			margin-top: 0;
		}

		.header {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 10px 12px;
			background: var(--item-header-bg);
			cursor: pointer;
			transition: all 0.2s ease;
			font-family: var(--font-mono, 'SF Mono', monospace);
			user-select: none;
		}

		.header:hover {
			background: color-mix(in srgb, var(--item-color) 5%, var(--item-header-bg));
		}

		.header:focus {
			outline: none;
			box-shadow: inset 0 0 0 1px var(--item-color);
		}

		:host([expanded]) .header {
			border-bottom: 1px solid var(--item-border);
			background: color-mix(in srgb, var(--item-color) 10%, var(--item-header-bg));
		}

		.icon {
			flex-shrink: 0;
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--item-color);
			transition: transform 0.2s ease;
		}

		.icon svg {
			width: 14px;
			height: 14px;
		}

		.title {
			flex: 1;
			font-size: 12px;
			color: var(--item-color);
			font-weight: 500;
		}

		.subtitle {
			font-size: 11px;
			color: var(--item-text);
		}

		.badge {
			font-size: 10px;
			padding: 2px 6px;
			background: var(--item-color);
			color: var(--terminal-black, #0a0a0a);
			font-weight: 700;
		}

		.content {
			background: var(--item-bg);
			font-family: var(--font-mono, 'SF Mono', monospace);
			font-size: 12px;
			color: var(--item-text);
			line-height: 1.5;
			overflow: hidden;
		}

		/* Non-animated: use display */
		:host(:not([animated])) .content {
			display: none;
			padding: 12px;
		}

		:host(:not([animated])[expanded]) .content {
			display: block;
		}

		/* Animated: use height transition */
		:host([animated]) .content {
			display: block;
			max-height: 0;
			padding: 0 12px;
			transition: max-height 0.3s ease-out, padding 0.3s ease-out;
		}

		:host([animated][expanded]) .content {
			max-height: 500px;
			padding: 12px;
		}

		/* Variant styles */
		:host([variant="bordered"]) .item {
			border-color: var(--item-color);
		}

		:host([variant="flush"]) .item {
			border-left: none;
			border-right: none;
		}

		:host([variant="flush"]:first-child) .item {
			border-top: none;
		}

		:host([variant="flush"]:last-child) .item {
			border-bottom: none;
		}

		/* Size variants */
		:host([size="sm"]) .header {
			padding: 6px 10px;
		}

		:host([size="sm"]) .title {
			font-size: 11px;
		}

		:host([size="sm"]) .content {
			padding: 8px 10px;
			font-size: 11px;
		}

		:host([size="lg"]) .header {
			padding: 14px 16px;
		}

		:host([size="lg"]) .title {
			font-size: 14px;
		}

		:host([size="lg"]) .content {
			padding: 16px;
			font-size: 13px;
		}

		/* Icon position - default is left (icon order 0) */
		.icon {
			order: 0;
		}

		.title {
			order: 1;
		}

		.subtitle {
			order: 2;
		}

		.badge {
			order: 3;
		}

		.header-actions {
			order: 4;
			display: flex;
			gap: 4px;
		}

		/* Icon position right - move icon to end */
		:host([icon-position="right"]) .icon {
			order: 5;
		}

		::slotted([slot="header-action"]) {
			font-size: 11px;
		}

		/* Horizontal orientation styles */
		:host([orientation="horizontal"]) {
			flex: 0 0 auto;
			min-width: fit-content;
		}

		:host([orientation="horizontal"][expanded]) {
			flex: 1 1 auto;
		}

		:host([orientation="horizontal"]) .item {
			display: flex;
			flex-direction: row;
			height: 100%;
			margin-top: 0;
			margin-left: -1px;
		}

		:host([orientation="horizontal"]:first-child) .item {
			margin-left: 0;
		}

		:host([orientation="horizontal"]) .header {
			writing-mode: vertical-rl;
			text-orientation: mixed;
			flex-direction: column;
			padding: 12px 10px;
			min-width: 40px;
			height: 100%;
			flex-shrink: 0;
		}

		:host([orientation="horizontal"][expanded]) .header {
			border-bottom: none;
			border-right: 1px solid var(--item-border);
		}

		:host([orientation="horizontal"]) .icon {
			transform: rotate(90deg);
		}

		:host([orientation="horizontal"]) .content {
			height: 100%;
			overflow: hidden;
		}

		:host([orientation="horizontal"]:not([animated])) .content {
			display: none;
			width: 0;
			padding: 0;
		}

		:host([orientation="horizontal"]:not([animated])[expanded]) .content {
			display: block;
			flex: 1;
			width: auto;
			padding: 12px;
		}

		:host([orientation="horizontal"][animated]) .content {
			width: 0;
			max-height: none;
			padding: 0;
			transition: width 0.3s ease-out, padding 0.3s ease-out;
		}

		:host([orientation="horizontal"][animated][expanded]) .content {
			width: auto;
			flex: 1;
			padding: 12px;
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		itemId: { type: String, attribute: 'item-id', reflect: true },
		title: { type: String, reflect: true },
		subtitle: { type: String },
		badge: { type: String },
		expanded: { type: Boolean, reflect: true },
		disabled: { type: Boolean, reflect: true },
		animated: { type: Boolean, reflect: true },
		variant: { type: String, reflect: true },
		size: { type: String, reflect: true },
		iconPosition: { type: String, attribute: 'icon-position', reflect: true },
		orientation: { type: String, reflect: true }
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (N/A)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 5: LOGGER INSTANCE (REQUIRED)
	// ----------------------------------------------------------
	_logger = null;

	// ----------------------------------------------------------
	// BLOCK 6: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();
		this._logger = componentLogger.for('TAccordionItemLit');
		this.itemId = '';
		this.title = '';
		this.subtitle = '';
		this.badge = '';
		this.expanded = false;
		this.disabled = false;
		this.animated = false;
		this.variant = 'default';
		this.size = 'md';
		this.iconPosition = 'left';
		this.orientation = 'vertical';
		this._logger.debug('Item constructed');
	}

	// ----------------------------------------------------------
	// BLOCK 7: LIFECYCLE METHODS (REQUIRED)
	// ----------------------------------------------------------
	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Item connected');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Item disconnected');
	}

	// ----------------------------------------------------------
	// BLOCK 8: PUBLIC API METHODS
	// ----------------------------------------------------------
	/**
	 * Toggle the expanded state
	 * @public
	 */
	toggle() {
		if (!this.disabled) {
			this.expanded = !this.expanded;
			this._emitEvent('item-toggle', {
				itemId: this.itemId,
				expanded: this.expanded
			});
		}
	}

	/**
	 * Expand the item
	 * @public
	 */
	expand() {
		if (!this.expanded && !this.disabled) {
			this.expanded = true;
			this._emitEvent('item-toggle', {
				itemId: this.itemId,
				expanded: true
			});
		}
	}

	/**
	 * Collapse the item
	 * @public
	 */
	collapse() {
		if (this.expanded) {
			this.expanded = false;
			this._emitEvent('item-toggle', {
				itemId: this.itemId,
				expanded: false
			});
		}
	}

	// ----------------------------------------------------------
	// BLOCK 9: EVENT EMITTERS
	// ----------------------------------------------------------
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	// ----------------------------------------------------------
	// BLOCK 10: NESTING SUPPORT (N/A)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 11: VALIDATION (N/A)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 12: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------
	render() {
		return html`
			<div class="item">
				<div
					class="header"
					role="button"
					tabindex="${this.disabled ? -1 : 0}"
					aria-expanded="${this.expanded}"
					@click=${this._handleClick}
					@keydown=${this._handleKeydown}
				>
					<span class="icon">
						${unsafeHTML(this.expanded ? caretDownIcon : caretRightIcon)}
					</span>
					<span class="title">${this.title}</span>
					${this.subtitle ? html`<span class="subtitle">${this.subtitle}</span>` : ''}
					${this.badge ? html`<span class="badge">${this.badge}</span>` : ''}
					<div class="header-actions">
						<slot name="header-action"></slot>
					</div>
				</div>
				<div class="content" role="region">
					<slot></slot>
				</div>
			</div>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 13: PRIVATE HELPERS
	// ----------------------------------------------------------
	_handleClick() {
		this.toggle();
	}

	_handleKeydown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			this.toggle();
		}
	}

	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ============================================================
// SECTION 2: ACCORDION CONTAINER COMPONENT
// ============================================================

/**
 * @component TAccordionLit
 * @tagname t-accordion
 * @description Terminal-style accordion container
 */
export class TAccordionLit extends LitElement {
	// ----------------------------------------------------------
	// BLOCK 1: STATIC METADATA (REQUIRED)
	// ----------------------------------------------------------
	static tagName = 't-accordion';
	static version = '3.0.0';
	static category = 'Container';

	// ----------------------------------------------------------
	// BLOCK 2: STATIC STYLES (REQUIRED)
	// ----------------------------------------------------------
	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			--accordion-border: var(--terminal-gray-dark, #333);
			--scrollbar-width: 8px;
			--scrollbar-track: var(--terminal-gray-darkest, #1a1a1a);
			--scrollbar-thumb: var(--terminal-gray-dark, #333);
			--scrollbar-thumb-hover: var(--terminal-gray, #555);
			--scrollbar-radius: 4px;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			overflow: auto;
		}

		/* Terminal-styled scrollbars */
		:host::-webkit-scrollbar {
			width: var(--scrollbar-width);
			height: var(--scrollbar-width);
		}

		:host::-webkit-scrollbar-track {
			background: var(--scrollbar-track);
			border-radius: var(--scrollbar-radius);
		}

		:host::-webkit-scrollbar-thumb {
			background: var(--scrollbar-thumb);
			border-radius: var(--scrollbar-radius);
			border: 1px solid var(--scrollbar-track);
		}

		:host::-webkit-scrollbar-thumb:hover {
			background: var(--scrollbar-thumb-hover);
		}

		:host::-webkit-scrollbar-corner {
			background: var(--scrollbar-track);
		}

		.accordion {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-height: 0;
		}

		/* Horizontal orientation */
		:host([orientation="horizontal"]) .accordion {
			flex-direction: row;
		}

		:host([orientation="horizontal"]) ::slotted(t-accordion-item) {
			min-width: 0;
		}

		:host([orientation="horizontal"]) ::slotted(t-accordion-item[expanded]) {
			flex: 1;
		}

		/* Bordered variant */
		:host([bordered]) .accordion {
			border: 1px solid var(--accordion-border);
		}
	`;

	// ----------------------------------------------------------
	// BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
	// ----------------------------------------------------------
	static properties = {
		multiple: { type: Boolean, reflect: true },
		bordered: { type: Boolean, reflect: true },
		expandedItems: { type: Array, attribute: 'expanded-items' },
		orientation: { type: String, reflect: true }
	};

	// ----------------------------------------------------------
	// BLOCK 4: INTERNAL STATE (N/A)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 5: LOGGER INSTANCE (REQUIRED)
	// ----------------------------------------------------------
	_logger = null;

	// ----------------------------------------------------------
	// BLOCK 6: CONSTRUCTOR (REQUIRED)
	// ----------------------------------------------------------
	constructor() {
		super();
		this._logger = componentLogger.for('TAccordionLit');
		this.multiple = false;
		this.bordered = false;
		this.expandedItems = [];
		this.orientation = 'vertical';
		this._logger.debug('Accordion constructed');
	}

	// ----------------------------------------------------------
	// BLOCK 7: LIFECYCLE METHODS (REQUIRED)
	// ----------------------------------------------------------
	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('item-toggle', this._handleItemToggle);
		this._logger.info('Accordion connected');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('item-toggle', this._handleItemToggle);
		this._logger.info('Accordion disconnected');
	}

	firstUpdated() {
		// Sync initial expanded state
		if (this.expandedItems.length > 0) {
			this._syncExpandedItems();
		}
		// Propagate orientation to child items
		this._propagateOrientation();
		this._logger.debug('First update complete');
	}

	updated(changedProps) {
		if (changedProps.has('orientation')) {
			this._propagateOrientation();
		}
	}

	// ----------------------------------------------------------
	// BLOCK 8: PUBLIC API METHODS
	// ----------------------------------------------------------
	/**
	 * Expand all items (only works if multiple=true)
	 * @public
	 */
	expandAll() {
		if (this.multiple) {
			const items = this.querySelectorAll('t-accordion-item');
			items.forEach(item => item.expand());
			this._logger.debug('Expanded all items');
		}
	}

	/**
	 * Collapse all items
	 * @public
	 */
	collapseAll() {
		this._collapseAll();
		this.expandedItems = [];
		this._emitEvent('accordion-change', {
			expandedItems: [],
			itemId: null,
			expanded: false
		});
		this._logger.debug('Collapsed all items');
	}

	/**
	 * Get all accordion items
	 * @public
	 * @returns {Array} Array of item elements
	 */
	getItems() {
		return Array.from(this.querySelectorAll('t-accordion-item'));
	}

	/**
	 * Get expanded items
	 * @public
	 * @returns {Array} Array of expanded item elements
	 */
	getExpandedItems() {
		return this.getItems().filter(item => item.expanded);
	}

	// ----------------------------------------------------------
	// BLOCK 9: EVENT EMITTERS
	// ----------------------------------------------------------
	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	// ----------------------------------------------------------
	// BLOCK 10: NESTING SUPPORT (N/A)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 11: VALIDATION (N/A)
	// ----------------------------------------------------------

	// ----------------------------------------------------------
	// BLOCK 12: RENDER METHOD (REQUIRED)
	// ----------------------------------------------------------
	render() {
		return html`
			<div class="accordion" role="tablist">
				<slot></slot>
			</div>
		`;
	}

	// ----------------------------------------------------------
	// BLOCK 13: PRIVATE HELPERS
	// ----------------------------------------------------------
	_propagateOrientation() {
		const items = this.querySelectorAll('t-accordion-item');
		items.forEach(item => {
			item.orientation = this.orientation;
		});
	}

	_handleItemToggle = (e) => {
		const { itemId, expanded } = e.detail;
		this._logger.debug('Item toggled', { itemId, expanded });

		if (!this.multiple && expanded) {
			// Close other items when not in multiple mode
			this._collapseAll(itemId);
		}

		// Update expandedItems array
		if (expanded) {
			if (!this.expandedItems.includes(itemId)) {
				this.expandedItems = this.multiple
					? [...this.expandedItems, itemId]
					: [itemId];
			}
		} else {
			this.expandedItems = this.expandedItems.filter(id => id !== itemId);
		}

		this._emitEvent('accordion-change', {
			expandedItems: this.expandedItems,
			itemId,
			expanded
		});
	};

	_collapseAll(exceptId = null) {
		const items = this.querySelectorAll('t-accordion-item');
		items.forEach(item => {
			if (item.itemId !== exceptId && item.expanded) {
				item.collapse();
			}
		});
	}

	_syncExpandedItems() {
		const items = this.querySelectorAll('t-accordion-item');
		items.forEach(item => {
			if (this.expandedItems.includes(item.itemId)) {
				item.expanded = true;
			} else {
				item.expanded = false;
			}
		});
	}

	static {
		if (!customElements.get(this.tagName)) {
			customElements.define(this.tagName, this);
		}
	}
}

// ============================================================
// EXPORTS
// ============================================================
export default TAccordionLit;
