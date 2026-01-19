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
	static tagName = 't-accordion-item';
	static version = '3.0.0';
	static category = 'Container';

	static styles = css`
		:host {
			display: block;
			--item-bg: var(--terminal-gray-darkest, #1a1a1a);
			--item-border: var(--terminal-gray-dark, #333);
			--item-color: var(--terminal-green, #00ff41);
			--item-text: var(--terminal-gray-light, #888);
			--item-header-bg: var(--terminal-black, #0a0a0a);
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
			color: var(--terminal-white, #fff);
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
			display: none;
			background: var(--item-bg);
			padding: 12px;
			font-family: var(--font-mono, 'SF Mono', monospace);
			font-size: 12px;
			color: var(--item-text);
			line-height: 1.5;
		}

		:host([expanded]) .content {
			display: block;
		}

		/* Animation variant */
		:host([animated]) .content {
			overflow: hidden;
			max-height: 0;
			padding: 0 12px;
			transition: max-height 0.3s ease, padding 0.3s ease;
		}

		:host([animated][expanded]) .content {
			max-height: 1000px;
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

		/* Icon position */
		:host([icon-position="right"]) .header {
			flex-direction: row-reverse;
		}

		:host([icon-position="right"]) .icon {
			order: 1;
		}

		:host([icon-position="right"]) .title {
			order: 0;
		}

		/* Custom slot for header actions */
		.header-actions {
			display: flex;
			gap: 4px;
		}

		::slotted([slot="header-action"]) {
			font-size: 11px;
		}
	`;

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
		iconPosition: { type: String, attribute: 'icon-position', reflect: true }
	};

	_logger = null;

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
		this._logger.debug('Item constructed');
	}

	connectedCallback() {
		super.connectedCallback();
		this._logger.info('Item connected');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._logger.info('Item disconnected');
	}

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

	_handleClick() {
		this.toggle();
	}

	_handleKeydown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			this.toggle();
		}
	}

	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

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
	static tagName = 't-accordion';
	static version = '3.0.0';
	static category = 'Container';

	static styles = css`
		:host {
			display: block;
			--accordion-border: var(--terminal-gray-dark, #333);
		}

		.accordion {
			display: flex;
			flex-direction: column;
		}

		/* Bordered variant */
		:host([bordered]) .accordion {
			border: 1px solid var(--accordion-border);
		}
	`;

	static properties = {
		multiple: { type: Boolean, reflect: true },
		bordered: { type: Boolean, reflect: true },
		expandedItems: { type: Array, attribute: 'expanded-items' }
	};

	_logger = null;

	constructor() {
		super();
		this._logger = componentLogger.for('TAccordionLit');
		this.multiple = false;
		this.bordered = false;
		this.expandedItems = [];
		this._logger.debug('Accordion constructed');
	}

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
		this._logger.debug('First update complete');
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

	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	render() {
		return html`
			<div class="accordion" role="tablist">
				<slot></slot>
			</div>
		`;
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
