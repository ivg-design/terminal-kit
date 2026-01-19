/**
 * @fileoverview TKanbanLit - Terminal-style Kanban Board
 * @module components/TKanbanLit
 * @version 3.0.0
 *
 * A kanban board component with draggable cards, color-controlled columns,
 * and expandable card content. Follows terminal-kit aesthetic.
 *
 * @example
 * <t-kanban>
 *   <t-kanban-column id="todo" title="To Do" color="amber">
 *     <t-kanban-card id="1" title="Task 1"></t-kanban-card>
 *   </t-kanban-column>
 * </t-kanban>
 */

import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { scrollbarStyles, scrollbarProperties } from '../utils/scrollbar-styles.js';
import {
	plusSquareIcon,
	dotsThreeCircleVerticalIcon,
	caretDownIcon,
	caretRightIcon,
	trashIcon,
	notePencilIcon
} from '../utils/phosphor-icons.js';

// ============================================================
// SECTION 1: KANBAN CARD COMPONENT
// ============================================================

/**
 * @component TKanbanCardLit
 * @tagname t-kanban-card
 * @description Individual kanban card with expandable content
 */
export class TKanbanCardLit extends LitElement {
	static tagName = 't-kanban-card';
	static version = '3.0.0';
	static category = 'Container';

	static styles = css`
		:host {
			display: block;
			--card-bg: var(--terminal-gray-darkest, #1a1a1a);
			--card-border: var(--terminal-gray-dark, #333);
			--card-color: var(--terminal-green, #00ff41);
			--card-text: var(--terminal-gray-light, #888);
		}

		:host([dragging]) {
			opacity: 0.5;
		}

		.card {
			background: var(--card-bg);
			border: 1px solid var(--card-border);
			padding: 8px 10px;
			cursor: grab;
			transition: all 0.2s ease;
			font-family: var(--font-mono, 'SF Mono', monospace);
		}

		.card:hover {
			border-color: var(--card-color);
			box-shadow: 0 0 6px color-mix(in srgb, var(--card-color) 30%, transparent);
		}

		.card:active {
			cursor: grabbing;
		}

		.card-header {
			display: flex;
			align-items: flex-start;
			gap: 8px;
		}

		.expand-toggle {
			flex-shrink: 0;
			width: 16px;
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			color: var(--card-text);
			transition: color 0.2s ease;
		}

		.expand-toggle:hover {
			color: var(--card-color);
		}

		.expand-toggle svg {
			width: 14px;
			height: 14px;
		}

		.card-title {
			flex: 1;
			font-size: 12px;
			color: var(--terminal-white, #fff);
			line-height: 1.4;
			word-break: break-word;
		}

		.card-actions {
			display: none;
			gap: 4px;
			flex-shrink: 0;
		}

		.card:hover .card-actions {
			display: flex;
		}

		.action-btn {
			width: 18px;
			height: 18px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: transparent;
			border: none;
			cursor: pointer;
			color: var(--card-text);
			padding: 0;
			transition: color 0.2s ease;
		}

		.action-btn:hover {
			color: var(--card-color);
		}

		.action-btn svg {
			width: 14px;
			height: 14px;
		}

		.card-content {
			display: none;
			margin-top: 8px;
			padding-top: 8px;
			border-top: 1px solid var(--card-border);
			font-size: 11px;
			color: var(--card-text);
			line-height: 1.5;
		}

		:host([expanded]) .card-content {
			display: block;
		}

		.card-tags {
			display: flex;
			flex-wrap: wrap;
			gap: 4px;
			margin-top: 6px;
		}

		.tag {
			font-size: 9px;
			padding: 2px 6px;
			background: color-mix(in srgb, var(--card-color) 20%, transparent);
			color: var(--card-color);
			border: 1px solid var(--card-color);
		}

		.card-meta {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-top: 6px;
			font-size: 10px;
			color: var(--terminal-gray, #666);
		}

		.priority-indicator {
			width: 3px;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			background: var(--card-color);
		}

		:host([priority="high"]) .priority-indicator {
			background: var(--terminal-red, #ff003c);
		}

		:host([priority="medium"]) .priority-indicator {
			background: var(--terminal-amber, #ffb000);
		}

		:host([priority="low"]) .priority-indicator {
			background: var(--terminal-cyan, #00ffff);
		}

		.card.has-priority {
			position: relative;
			padding-left: 12px;
		}
	`;

	static properties = {
		cardId: { type: String, attribute: 'card-id', reflect: true },
		title: { type: String, reflect: true },
		description: { type: String },
		tags: { type: Array },
		priority: { type: String, reflect: true },
		expanded: { type: Boolean, reflect: true },
		dragging: { type: Boolean, reflect: true },
		assignee: { type: String },
		dueDate: { type: String, attribute: 'due-date' }
	};

	_logger = null;

	constructor() {
		super();
		this._logger = componentLogger.for('TKanbanCardLit');
		this.cardId = '';
		this.title = '';
		this.description = '';
		this.tags = [];
		this.priority = '';
		this.expanded = false;
		this.dragging = false;
		this.assignee = '';
		this.dueDate = '';
		this._logger.debug('Card constructed');
	}

	connectedCallback() {
		super.connectedCallback();
		this.setAttribute('draggable', 'true');
		this.addEventListener('dragstart', this._handleDragStart);
		this.addEventListener('dragend', this._handleDragEnd);
		this._logger.info('Card connected');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('dragstart', this._handleDragStart);
		this.removeEventListener('dragend', this._handleDragEnd);
		this._logger.info('Card disconnected');
	}

	_handleDragStart = (e) => {
		this.dragging = true;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', this.cardId);
		this._emitEvent('card-drag-start', { cardId: this.cardId });
	};

	_handleDragEnd = () => {
		this.dragging = false;
		this._emitEvent('card-drag-end', { cardId: this.cardId });
	};

	_toggleExpand() {
		this.expanded = !this.expanded;
		this._emitEvent('card-expand', { cardId: this.cardId, expanded: this.expanded });
	}

	_handleEdit() {
		this._emitEvent('card-edit', { cardId: this.cardId });
	}

	_handleDelete() {
		this._emitEvent('card-delete', { cardId: this.cardId });
	}

	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	render() {
		const hasContent = this.description || this.tags?.length > 0 || this.assignee || this.dueDate;
		const cardClasses = {
			card: true,
			'has-priority': !!this.priority
		};

		return html`
			<div class=${classMap(cardClasses)}>
				${this.priority ? html`<div class="priority-indicator"></div>` : ''}
				<div class="card-header">
					${hasContent ? html`
						<div class="expand-toggle" @click=${this._toggleExpand}>
							${unsafeHTML(this.expanded ? caretDownIcon : caretRightIcon)}
						</div>
					` : ''}
					<div class="card-title">${this.title}</div>
					<div class="card-actions">
						<button class="action-btn" @click=${this._handleEdit} title="Edit">
							${unsafeHTML(notePencilIcon)}
						</button>
						<button class="action-btn" @click=${this._handleDelete} title="Delete">
							${unsafeHTML(trashIcon)}
						</button>
					</div>
				</div>
				${hasContent ? html`
					<div class="card-content">
						${this.description ? html`<div class="card-description">${this.description}</div>` : ''}
						${this.tags?.length > 0 ? html`
							<div class="card-tags">
								${this.tags.map(tag => html`<span class="tag">${tag}</span>`)}
							</div>
						` : ''}
						${(this.assignee || this.dueDate) ? html`
							<div class="card-meta">
								${this.assignee ? html`<span>@${this.assignee}</span>` : ''}
								${this.dueDate ? html`<span>${this.dueDate}</span>` : ''}
							</div>
						` : ''}
						<slot></slot>
					</div>
				` : ''}
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
// SECTION 2: KANBAN COLUMN COMPONENT
// ============================================================

/**
 * @component TKanbanColumnLit
 * @tagname t-kanban-column
 * @description Column container for kanban cards
 */
export class TKanbanColumnLit extends LitElement {
	static tagName = 't-kanban-column';
	static version = '3.0.0';
	static category = 'Container';

	static styles = [
		scrollbarStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				min-width: 250px;
				max-width: 300px;
				--column-color: var(--terminal-green, #00ff41);
				--column-bg: var(--terminal-gray-darkest, #1a1a1a);
				--column-border: var(--terminal-gray-dark, #333);
			}

			:host([color="green"]) { --column-color: var(--terminal-green, #00ff41); }
			:host([color="amber"]) { --column-color: var(--terminal-amber, #ffb000); }
			:host([color="cyan"]) { --column-color: var(--terminal-cyan, #00ffff); }
			:host([color="red"]) { --column-color: var(--terminal-red, #ff003c); }
			:host([color="gray"]) { --column-color: var(--terminal-gray-light, #888); }
			:host([color="white"]) { --column-color: var(--terminal-white, #fff); }

			:host([monochrome]) {
				--column-color: var(--terminal-gray-light, #888);
			}

			.column {
				display: flex;
				flex-direction: column;
				height: 100%;
				background: var(--column-bg);
				border: 1px solid var(--column-border);
			}

			.column-header {
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 10px 12px;
				border-bottom: 2px solid var(--column-color);
				background: color-mix(in srgb, var(--column-color) 5%, transparent);
			}

			.column-title {
				flex: 1;
				font-family: var(--font-mono, 'SF Mono', monospace);
				font-size: 12px;
				font-weight: 600;
				color: var(--column-color);
				text-transform: uppercase;
				letter-spacing: 0.5px;
			}

			.column-count {
				font-family: var(--font-mono, 'SF Mono', monospace);
				font-size: 10px;
				padding: 2px 6px;
				background: var(--column-color);
				color: var(--terminal-black, #0a0a0a);
				font-weight: 700;
			}

			.column-actions {
				display: flex;
				gap: 4px;
			}

			.column-btn {
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: transparent;
				border: none;
				cursor: pointer;
				color: var(--terminal-gray, #666);
				padding: 0;
				transition: color 0.2s ease;
			}

			.column-btn:hover {
				color: var(--column-color);
			}

			.column-btn svg {
				width: 16px;
				height: 16px;
			}

			.column-body {
				flex: 1;
				overflow-y: auto;
				padding: 8px;
				display: flex;
				flex-direction: column;
				gap: 6px;
			}

			.column-body.drag-over {
				background: color-mix(in srgb, var(--column-color) 10%, transparent);
			}

			.drop-placeholder {
				height: 40px;
				border: 2px dashed var(--column-color);
				background: color-mix(in srgb, var(--column-color) 10%, transparent);
				display: none;
			}

			.column-body.drag-over .drop-placeholder {
				display: block;
			}

			::slotted(t-kanban-card) {
				--card-color: var(--column-color);
			}

			.empty-state {
				text-align: center;
				padding: 20px;
				color: var(--terminal-gray, #666);
				font-family: var(--font-mono, 'SF Mono', monospace);
				font-size: 11px;
			}
		`
	];

	static properties = {
		...scrollbarProperties,
		columnId: { type: String, attribute: 'column-id', reflect: true },
		title: { type: String, reflect: true },
		color: { type: String, reflect: true },
		monochrome: { type: Boolean, reflect: true },
		collapsed: { type: Boolean, reflect: true },
		maxCards: { type: Number, attribute: 'max-cards' }
	};

	_logger = null;
	_cardCount = 0;
	_dragOver = false;

	constructor() {
		super();
		this._logger = componentLogger.for('TKanbanColumnLit');
		this.columnId = '';
		this.title = 'Column';
		this.color = 'green';
		this.monochrome = false;
		this.collapsed = false;
		this.maxCards = 0;
		this.scrollbar = 'thin';
		this._logger.debug('Column constructed');
	}

	connectedCallback() {
		super.connectedCallback();
		this._updateCardCount();
		this._logger.info('Column connected');
	}

	firstUpdated() {
		const slot = this.shadowRoot.querySelector('slot:not([name])');
		if (slot) {
			slot.addEventListener('slotchange', () => this._updateCardCount());
		}
	}

	_updateCardCount() {
		const cards = this.querySelectorAll('t-kanban-card');
		this._cardCount = cards.length;
		this.requestUpdate();
	}

	_handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		if (!this._dragOver) {
			this._dragOver = true;
			this.requestUpdate();
		}
	};

	_handleDragLeave = (e) => {
		if (!this.contains(e.relatedTarget)) {
			this._dragOver = false;
			this.requestUpdate();
		}
	};

	_handleDrop = (e) => {
		e.preventDefault();
		this._dragOver = false;
		const cardId = e.dataTransfer.getData('text/plain');
		this._emitEvent('card-drop', { cardId, columnId: this.columnId });
		this.requestUpdate();
	};

	_handleAddCard() {
		this._emitEvent('column-add-card', { columnId: this.columnId });
	}

	_handleMenu() {
		this._emitEvent('column-menu', { columnId: this.columnId });
	}

	_emitEvent(name, detail = {}) {
		this.dispatchEvent(new CustomEvent(name, {
			detail,
			bubbles: true,
			composed: true
		}));
	}

	render() {
		const bodyClasses = {
			'column-body': true,
			'drag-over': this._dragOver
		};

		return html`
			<div class="column">
				<div class="column-header">
					<span class="column-title">${this.title}</span>
					<span class="column-count">${this._cardCount}</span>
					<div class="column-actions">
						<button class="column-btn" @click=${this._handleAddCard} title="Add Card">
							${unsafeHTML(plusSquareIcon)}
						</button>
						<button class="column-btn" @click=${this._handleMenu} title="Menu">
							${unsafeHTML(dotsThreeCircleVerticalIcon)}
						</button>
					</div>
				</div>
				<div
					class=${classMap(bodyClasses)}
					@dragover=${this._handleDragOver}
					@dragleave=${this._handleDragLeave}
					@drop=${this._handleDrop}
				>
					<slot></slot>
					<div class="drop-placeholder"></div>
					${this._cardCount === 0 ? html`
						<div class="empty-state">No cards</div>
					` : ''}
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
// SECTION 3: KANBAN BOARD COMPONENT
// ============================================================

/**
 * @component TKanbanLit
 * @tagname t-kanban
 * @description Terminal-style kanban board with drag-and-drop
 */
export class TKanbanLit extends LitElement {
	static tagName = 't-kanban';
	static version = '3.0.0';
	static category = 'Container';

	static styles = [
		scrollbarStyles,
		css`
			:host {
				display: block;
				--board-bg: var(--terminal-black, #0a0a0a);
				--board-border: var(--terminal-gray-dark, #333);
			}

			.board {
				display: flex;
				gap: 12px;
				padding: 12px;
				background: var(--board-bg);
				border: 1px solid var(--board-border);
				overflow-x: auto;
				min-height: 300px;
			}

			.board-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 12px;
				background: var(--terminal-gray-darkest, #1a1a1a);
				border: 1px solid var(--board-border);
				border-bottom: none;
			}

			.board-title {
				font-family: var(--font-mono, 'SF Mono', monospace);
				font-size: 14px;
				color: var(--terminal-green, #00ff41);
				font-weight: 600;
			}

			.board-actions {
				display: flex;
				gap: 8px;
			}

			.board-btn {
				display: flex;
				align-items: center;
				gap: 4px;
				padding: 4px 8px;
				background: transparent;
				border: 1px solid var(--terminal-gray-dark, #333);
				color: var(--terminal-gray-light, #888);
				font-family: var(--font-mono, 'SF Mono', monospace);
				font-size: 11px;
				cursor: pointer;
				transition: all 0.2s ease;
			}

			.board-btn:hover {
				border-color: var(--terminal-green, #00ff41);
				color: var(--terminal-green, #00ff41);
			}

			.board-btn svg {
				width: 14px;
				height: 14px;
			}

			::slotted(t-kanban-column) {
				flex-shrink: 0;
			}
		`
	];

	static properties = {
		...scrollbarProperties,
		title: { type: String, reflect: true },
		showHeader: { type: Boolean, attribute: 'show-header', reflect: true }
	};

	_logger = null;

	constructor() {
		super();
		this._logger = componentLogger.for('TKanbanLit');
		this.title = '';
		this.showHeader = false;
		this.scrollbar = 'thin';
		this._logger.debug('Board constructed');
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('card-drop', this._handleCardDrop);
		this._logger.info('Board connected');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('card-drop', this._handleCardDrop);
		this._logger.info('Board disconnected');
	}

	_handleCardDrop = (e) => {
		const { cardId, columnId } = e.detail;
		this._logger.debug('Card dropped', { cardId, columnId });
		this._emitEvent('card-move', { cardId, columnId });
	};

	_handleAddColumn() {
		this._emitEvent('add-column');
	}

	/**
	 * Move a card to a different column
	 * @public
	 * @param {string} cardId - Card ID
	 * @param {string} targetColumnId - Target column ID
	 */
	moveCard(cardId, targetColumnId) {
		this._logger.debug('Moving card', { cardId, targetColumnId });
		const card = this.querySelector(`t-kanban-card[card-id="${cardId}"]`);
		const targetColumn = this.querySelector(`t-kanban-column[column-id="${targetColumnId}"]`);

		if (card && targetColumn) {
			targetColumn.appendChild(card);
			this._emitEvent('card-moved', { cardId, columnId: targetColumnId });
		}
	}

	/**
	 * Get all cards in a column
	 * @public
	 * @param {string} columnId - Column ID
	 * @returns {Array} Array of card elements
	 */
	getColumnCards(columnId) {
		const column = this.querySelector(`t-kanban-column[column-id="${columnId}"]`);
		return column ? Array.from(column.querySelectorAll('t-kanban-card')) : [];
	}

	/**
	 * Get all columns
	 * @public
	 * @returns {Array} Array of column elements
	 */
	getColumns() {
		return Array.from(this.querySelectorAll('t-kanban-column'));
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
			${this.showHeader ? html`
				<div class="board-header">
					<span class="board-title">${this.title || 'Kanban Board'}</span>
					<div class="board-actions">
						<button class="board-btn" @click=${this._handleAddColumn}>
							${unsafeHTML(plusSquareIcon)} Add Column
						</button>
					</div>
				</div>
			` : ''}
			<div class="board">
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
export default TKanbanLit;
