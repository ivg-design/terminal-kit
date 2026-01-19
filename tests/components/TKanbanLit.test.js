/**
 * TKanbanLit Component Tests
 * CONTAINER profile component
 * Testing pattern: Properties, Methods, Events, Rendering, Logging
 *
 * Tests three components:
 * 1. TKanbanCardLit (t-kanban-card)
 * 2. TKanbanColumnLit (t-kanban-column)
 * 3. TKanbanLit (t-kanban)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TKanbanLit.js';

// ============================================================
// SECTION 1: TKanbanCardLit Tests
// ============================================================
describe('TKanbanCardLit', () => {
	let card;

	beforeEach(async () => {
		card = await fixture(html`
			<t-kanban-card
				card-id="card1"
				title="Test Card"
				description="Test description"
				priority="high"
				assignee="johndoe"
				due-date="2025-12-31"
				.tags="${['bug', 'urgent']}"
			></t-kanban-card>
		`);
	});

	afterEach(() => {
		card?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(card.constructor.tagName).toBe('t-kanban-card');
		});

		it('should have correct version', () => {
			expect(card.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(card.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyCard = document.createElement('t-kanban-card');
			expect(emptyCard.cardId).toBe('');
			expect(emptyCard.title).toBe('');
			expect(emptyCard.description).toBe('');
			expect(emptyCard.tags).toEqual([]);
			expect(emptyCard.priority).toBe('');
			expect(emptyCard.expanded).toBe(false);
			expect(emptyCard.dragging).toBe(false);
			expect(emptyCard.assignee).toBe('');
			expect(emptyCard.dueDate).toBe('');
		});

		it('should set cardId from attribute', () => {
			expect(card.cardId).toBe('card1');
		});

		it('should set title from attribute', () => {
			expect(card.title).toBe('Test Card');
		});

		it('should set description from property', () => {
			expect(card.description).toBe('Test description');
		});

		it('should set tags from property', () => {
			expect(card.tags).toEqual(['bug', 'urgent']);
		});

		it('should set priority from attribute', () => {
			expect(card.priority).toBe('high');
		});

		it('should set assignee from attribute', () => {
			expect(card.assignee).toBe('johndoe');
		});

		it('should set dueDate from attribute', () => {
			expect(card.dueDate).toBe('2025-12-31');
		});

		it('should update expanded property', async () => {
			card.expanded = true;
			await card.updateComplete;
			expect(card.expanded).toBe(true);
			expect(card.hasAttribute('expanded')).toBe(true);
		});

		it('should reflect dragging property', async () => {
			card.dragging = true;
			await card.updateComplete;
			expect(card.hasAttribute('dragging')).toBe(true);
		});

		it('should have draggable attribute set', async () => {
			await card.updateComplete;
			expect(card.getAttribute('draggable')).toBe('true');
		});
	});

	// ======================================================
	// SUITE 3: Events
	// ======================================================
	describe('Events', () => {
		it('should fire card-expand when toggling expand', async () => {
			await card.updateComplete;
			const handler = vi.fn();
			card.addEventListener('card-expand', handler);

			card._toggleExpand();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
			expect(handler.mock.calls[0][0].detail.expanded).toBe(true);
		});

		it('should fire card-edit when edit is triggered', async () => {
			await card.updateComplete;
			const handler = vi.fn();
			card.addEventListener('card-edit', handler);

			card._handleEdit();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
		});

		it('should fire card-delete when delete is triggered', async () => {
			await card.updateComplete;
			const handler = vi.fn();
			card.addEventListener('card-delete', handler);

			card._handleDelete();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
		});

		it('should fire card-drag-start on dragstart', async () => {
			await card.updateComplete;
			const handler = vi.fn();
			card.addEventListener('card-drag-start', handler);

			// Simulate dragstart by calling the internal handler directly
			// since DragEvent.dataTransfer is not available in jsdom/happy-dom
			const mockEvent = {
				dataTransfer: {
					effectAllowed: '',
					setData: vi.fn()
				}
			};
			card._handleDragStart(mockEvent);

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
			expect(card.dragging).toBe(true);
			expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
			expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'card1');
		});

		it('should fire card-drag-end on dragend', async () => {
			await card.updateComplete;
			card.dragging = true;
			const handler = vi.fn();
			card.addEventListener('card-drag-end', handler);

			const dragEvent = new DragEvent('dragend', { bubbles: true });
			card.dispatchEvent(dragEvent);

			expect(handler).toHaveBeenCalled();
			expect(card.dragging).toBe(false);
		});

		it('events should bubble and be composed', async () => {
			const handler = vi.fn();
			document.body.addEventListener('card-expand', handler);

			card._toggleExpand();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('card-expand', handler);
		});
	});

	// ======================================================
	// SUITE 4: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await card.updateComplete;
			expect(card.shadowRoot).toBeTruthy();
		});

		it('should render card container', async () => {
			await card.updateComplete;
			const cardEl = card.shadowRoot.querySelector('.card');
			expect(cardEl).toBeTruthy();
		});

		it('should render card title', async () => {
			await card.updateComplete;
			const title = card.shadowRoot.querySelector('.card-title');
			expect(title).toBeTruthy();
			expect(title.textContent).toBe('Test Card');
		});

		it('should render expand toggle when has content', async () => {
			await card.updateComplete;
			const toggle = card.shadowRoot.querySelector('.expand-toggle');
			expect(toggle).toBeTruthy();
		});

		it('should not render expand toggle when no content', async () => {
			const simpleCard = await fixture(html`
				<t-kanban-card card-id="simple" title="Simple"></t-kanban-card>
			`);
			await simpleCard.updateComplete;
			const toggle = simpleCard.shadowRoot.querySelector('.expand-toggle');
			expect(toggle).toBeFalsy();
			simpleCard.remove();
		});

		it('should render priority indicator when priority set', async () => {
			await card.updateComplete;
			const indicator = card.shadowRoot.querySelector('.priority-indicator');
			expect(indicator).toBeTruthy();
		});

		it('should render action buttons', async () => {
			await card.updateComplete;
			const actions = card.shadowRoot.querySelectorAll('.action-btn');
			expect(actions.length).toBe(2); // edit and delete
		});

		it('should render description when expanded', async () => {
			card.expanded = true;
			await card.updateComplete;
			const desc = card.shadowRoot.querySelector('.card-description');
			expect(desc).toBeTruthy();
			expect(desc.textContent).toBe('Test description');
		});

		it('should render tags', async () => {
			card.expanded = true;
			await card.updateComplete;
			const tags = card.shadowRoot.querySelectorAll('.tag');
			expect(tags.length).toBe(2);
			expect(tags[0].textContent).toBe('bug');
			expect(tags[1].textContent).toBe('urgent');
		});

		it('should render assignee and due date', async () => {
			card.expanded = true;
			await card.updateComplete;
			const meta = card.shadowRoot.querySelector('.card-meta');
			expect(meta).toBeTruthy();
			expect(meta.textContent).toContain('@johndoe');
			expect(meta.textContent).toContain('2025-12-31');
		});
	});

	// ======================================================
	// SUITE 5: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(card._logger).toBeTruthy();
		});
	});
});

// ============================================================
// SECTION 2: TKanbanColumnLit Tests
// ============================================================
describe('TKanbanColumnLit', () => {
	let column;

	beforeEach(async () => {
		column = await fixture(html`
			<t-kanban-column
				column-id="todo"
				title="To Do"
				color="amber"
			>
				<t-kanban-card card-id="card1" title="Task 1"></t-kanban-card>
				<t-kanban-card card-id="card2" title="Task 2"></t-kanban-card>
			</t-kanban-column>
		`);
	});

	afterEach(() => {
		column?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(column.constructor.tagName).toBe('t-kanban-column');
		});

		it('should have correct version', () => {
			expect(column.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(column.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyColumn = document.createElement('t-kanban-column');
			expect(emptyColumn.columnId).toBe('');
			expect(emptyColumn.title).toBe('Column');
			expect(emptyColumn.color).toBe('green');
			expect(emptyColumn.monochrome).toBe(false);
			expect(emptyColumn.collapsed).toBe(false);
			expect(emptyColumn.maxCards).toBe(0);
			expect(emptyColumn.scrollbar).toBe('thin');
		});

		it('should set columnId from attribute', () => {
			expect(column.columnId).toBe('todo');
		});

		it('should set title from attribute', () => {
			expect(column.title).toBe('To Do');
		});

		it('should set color from attribute', () => {
			expect(column.color).toBe('amber');
		});

		it('should update monochrome property', async () => {
			column.monochrome = true;
			await column.updateComplete;
			expect(column.monochrome).toBe(true);
			expect(column.hasAttribute('monochrome')).toBe(true);
		});

		it('should update collapsed property', async () => {
			column.collapsed = true;
			await column.updateComplete;
			expect(column.collapsed).toBe(true);
			expect(column.hasAttribute('collapsed')).toBe(true);
		});

		it('should set maxCards from attribute', async () => {
			column.maxCards = 5;
			await column.updateComplete;
			expect(column.maxCards).toBe(5);
		});

		it('should track card count', async () => {
			await column.updateComplete;
			// Wait for slotchange
			await new Promise(r => setTimeout(r, 50));
			expect(column._cardCount).toBe(2);
		});
	});

	// ======================================================
	// SUITE 3: Events
	// ======================================================
	describe('Events', () => {
		it('should fire column-add-card when add button clicked', async () => {
			await column.updateComplete;
			const handler = vi.fn();
			column.addEventListener('column-add-card', handler);

			column._handleAddCard();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.columnId).toBe('todo');
		});

		it('should fire column-menu when menu button clicked', async () => {
			await column.updateComplete;
			const handler = vi.fn();
			column.addEventListener('column-menu', handler);

			column._handleMenu();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.columnId).toBe('todo');
		});

		it('should fire card-drop on drop event', async () => {
			await column.updateComplete;
			const handler = vi.fn();
			column.addEventListener('card-drop', handler);

			// Simulate drop by calling internal handler directly
			// since DragEvent.dataTransfer is not available in jsdom/happy-dom
			column._handleDrop({
				preventDefault: vi.fn(),
				dataTransfer: {
					getData: () => 'card3'
				}
			});

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card3');
			expect(handler.mock.calls[0][0].detail.columnId).toBe('todo');
		});

		it('events should bubble and be composed', async () => {
			const handler = vi.fn();
			document.body.addEventListener('column-add-card', handler);

			column._handleAddCard();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('column-add-card', handler);
		});
	});

	// ======================================================
	// SUITE 4: Drag and Drop
	// ======================================================
	describe('Drag and Drop', () => {
		it('should set dragOver state on dragover', async () => {
			await column.updateComplete;

			column._handleDragOver({
				preventDefault: () => {},
				dataTransfer: { dropEffect: '' }
			});

			expect(column._dragOver).toBe(true);
		});

		it('should clear dragOver state on drop', async () => {
			await column.updateComplete;
			column._dragOver = true;

			column._handleDrop({
				preventDefault: () => {},
				dataTransfer: { getData: () => 'card1' }
			});

			expect(column._dragOver).toBe(false);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await column.updateComplete;
			expect(column.shadowRoot).toBeTruthy();
		});

		it('should render column container', async () => {
			await column.updateComplete;
			const col = column.shadowRoot.querySelector('.column');
			expect(col).toBeTruthy();
		});

		it('should render column header', async () => {
			await column.updateComplete;
			const header = column.shadowRoot.querySelector('.column-header');
			expect(header).toBeTruthy();
		});

		it('should render column title', async () => {
			await column.updateComplete;
			const title = column.shadowRoot.querySelector('.column-title');
			expect(title).toBeTruthy();
			expect(title.textContent).toBe('To Do');
		});

		it('should render card count', async () => {
			await column.updateComplete;
			// Wait for slotchange
			await new Promise(r => setTimeout(r, 50));
			await column.updateComplete;
			const count = column.shadowRoot.querySelector('.column-count');
			expect(count).toBeTruthy();
			expect(count.textContent).toBe('2');
		});

		it('should render column action buttons', async () => {
			await column.updateComplete;
			const buttons = column.shadowRoot.querySelectorAll('.column-btn');
			expect(buttons.length).toBe(2); // add card and menu
		});

		it('should render column body with slot', async () => {
			await column.updateComplete;
			const body = column.shadowRoot.querySelector('.column-body');
			expect(body).toBeTruthy();
			const slot = body.querySelector('slot');
			expect(slot).toBeTruthy();
		});

		it('should render empty state when no cards', async () => {
			const emptyColumn = await fixture(html`
				<t-kanban-column column-id="empty" title="Empty"></t-kanban-column>
			`);
			await emptyColumn.updateComplete;
			const emptyState = emptyColumn.shadowRoot.querySelector('.empty-state');
			expect(emptyState).toBeTruthy();
			expect(emptyState.textContent).toBe('No cards');
			emptyColumn.remove();
		});

		it('should render drop placeholder', async () => {
			await column.updateComplete;
			const placeholder = column.shadowRoot.querySelector('.drop-placeholder');
			expect(placeholder).toBeTruthy();
		});

		it('should add drag-over class when dragging over', async () => {
			await column.updateComplete;
			// Trigger dragover which sets _dragOver and requests update
			column._handleDragOver({
				preventDefault: vi.fn(),
				dataTransfer: { dropEffect: '' }
			});
			await column.updateComplete;
			const body = column.shadowRoot.querySelector('.column-body');
			expect(body.classList.contains('drag-over')).toBe(true);
		});
	});

	// ======================================================
	// SUITE 6: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(column._logger).toBeTruthy();
		});
	});
});

// ============================================================
// SECTION 3: TKanbanLit Tests
// ============================================================
describe('TKanbanLit', () => {
	let kanban;

	beforeEach(async () => {
		kanban = await fixture(html`
			<t-kanban title="Project Board" show-header>
				<t-kanban-column column-id="todo" title="To Do" color="amber">
					<t-kanban-card card-id="card1" title="Task 1"></t-kanban-card>
					<t-kanban-card card-id="card2" title="Task 2"></t-kanban-card>
				</t-kanban-column>
				<t-kanban-column column-id="inprogress" title="In Progress" color="cyan">
					<t-kanban-card card-id="card3" title="Task 3"></t-kanban-card>
				</t-kanban-column>
				<t-kanban-column column-id="done" title="Done" color="green">
				</t-kanban-column>
			</t-kanban>
		`);
	});

	afterEach(() => {
		kanban?.remove();
	});

	// ======================================================
	// SUITE 1: Static Metadata
	// ======================================================
	describe('Static Metadata', () => {
		it('should have correct tagName', () => {
			expect(kanban.constructor.tagName).toBe('t-kanban');
		});

		it('should have correct version', () => {
			expect(kanban.constructor.version).toBe('3.0.0');
		});

		it('should have correct category', () => {
			expect(kanban.constructor.category).toBe('Container');
		});
	});

	// ======================================================
	// SUITE 2: Properties
	// ======================================================
	describe('Properties', () => {
		it('should have correct default values', () => {
			const emptyKanban = document.createElement('t-kanban');
			expect(emptyKanban.title).toBe('');
			expect(emptyKanban.showHeader).toBe(false);
			expect(emptyKanban.scrollbar).toBe('thin');
		});

		it('should set title from attribute', () => {
			expect(kanban.title).toBe('Project Board');
		});

		it('should set showHeader from attribute', () => {
			expect(kanban.showHeader).toBe(true);
		});

		it('should update title property', async () => {
			kanban.title = 'New Title';
			await kanban.updateComplete;
			expect(kanban.title).toBe('New Title');
		});

		it('should update showHeader property', async () => {
			kanban.showHeader = false;
			await kanban.updateComplete;
			expect(kanban.showHeader).toBe(false);
			expect(kanban.hasAttribute('show-header')).toBe(false);
		});
	});

	// ======================================================
	// SUITE 3: Methods
	// ======================================================
	describe('Methods', () => {
		it('getColumns() should return all columns', () => {
			const columns = kanban.getColumns();
			expect(columns.length).toBe(3);
			expect(columns[0].columnId).toBe('todo');
			expect(columns[1].columnId).toBe('inprogress');
			expect(columns[2].columnId).toBe('done');
		});

		it('getColumnCards() should return cards in specified column', () => {
			const cards = kanban.getColumnCards('todo');
			expect(cards.length).toBe(2);
			expect(cards[0].cardId).toBe('card1');
			expect(cards[1].cardId).toBe('card2');
		});

		it('getColumnCards() should return empty array for non-existent column', () => {
			const cards = kanban.getColumnCards('nonexistent');
			expect(cards).toEqual([]);
		});

		it('getColumnCards() should return empty array for empty column', () => {
			const cards = kanban.getColumnCards('done');
			expect(cards.length).toBe(0);
		});

		it('moveCard() should move card to target column', async () => {
			const handler = vi.fn();
			kanban.addEventListener('card-moved', handler);

			kanban.moveCard('card1', 'inprogress');
			await kanban.updateComplete;

			const todoCards = kanban.getColumnCards('todo');
			const inProgressCards = kanban.getColumnCards('inprogress');

			expect(todoCards.length).toBe(1);
			expect(inProgressCards.length).toBe(2);
			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
			expect(handler.mock.calls[0][0].detail.columnId).toBe('inprogress');
		});

		it('moveCard() should not emit event for non-existent card', async () => {
			const handler = vi.fn();
			kanban.addEventListener('card-moved', handler);

			kanban.moveCard('nonexistent', 'inprogress');

			expect(handler).not.toHaveBeenCalled();
		});

		it('moveCard() should not emit event for non-existent column', async () => {
			const handler = vi.fn();
			kanban.addEventListener('card-moved', handler);

			kanban.moveCard('card1', 'nonexistent');

			expect(handler).not.toHaveBeenCalled();
		});
	});

	// ======================================================
	// SUITE 4: Events
	// ======================================================
	describe('Events', () => {
		it('should fire card-move when card-drop is received', async () => {
			await kanban.updateComplete;
			const handler = vi.fn();
			kanban.addEventListener('card-move', handler);

			const dropEvent = new CustomEvent('card-drop', {
				detail: { cardId: 'card1', columnId: 'inprogress' },
				bubbles: true,
				composed: true
			});
			kanban.dispatchEvent(dropEvent);

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
			expect(handler.mock.calls[0][0].detail.columnId).toBe('inprogress');
		});

		it('should fire add-column when add column button clicked', async () => {
			await kanban.updateComplete;
			const handler = vi.fn();
			kanban.addEventListener('add-column', handler);

			kanban._handleAddColumn();

			expect(handler).toHaveBeenCalled();
		});

		it('events should bubble and be composed', async () => {
			const handler = vi.fn();
			document.body.addEventListener('add-column', handler);

			kanban._handleAddColumn();

			expect(handler).toHaveBeenCalled();
			const event = handler.mock.calls[0][0];
			expect(event.bubbles).toBe(true);
			expect(event.composed).toBe(true);

			document.body.removeEventListener('add-column', handler);
		});
	});

	// ======================================================
	// SUITE 5: Rendering
	// ======================================================
	describe('Rendering', () => {
		it('should render shadow DOM', async () => {
			await kanban.updateComplete;
			expect(kanban.shadowRoot).toBeTruthy();
		});

		it('should render board container', async () => {
			await kanban.updateComplete;
			const board = kanban.shadowRoot.querySelector('.board');
			expect(board).toBeTruthy();
		});

		it('should render board header when showHeader is true', async () => {
			await kanban.updateComplete;
			const header = kanban.shadowRoot.querySelector('.board-header');
			expect(header).toBeTruthy();
		});

		it('should not render board header when showHeader is false', async () => {
			kanban.showHeader = false;
			await kanban.updateComplete;
			const header = kanban.shadowRoot.querySelector('.board-header');
			expect(header).toBeFalsy();
		});

		it('should render board title', async () => {
			await kanban.updateComplete;
			const title = kanban.shadowRoot.querySelector('.board-title');
			expect(title).toBeTruthy();
			expect(title.textContent).toBe('Project Board');
		});

		it('should render default title when title not set', async () => {
			kanban.title = '';
			await kanban.updateComplete;
			const title = kanban.shadowRoot.querySelector('.board-title');
			expect(title.textContent).toBe('Kanban Board');
		});

		it('should render add column button in header', async () => {
			await kanban.updateComplete;
			const addBtn = kanban.shadowRoot.querySelector('.board-btn');
			expect(addBtn).toBeTruthy();
			expect(addBtn.textContent).toContain('Add Column');
		});

		it('should render slot for columns', async () => {
			await kanban.updateComplete;
			const slot = kanban.shadowRoot.querySelector('slot');
			expect(slot).toBeTruthy();
		});

		it('should slot columns correctly', async () => {
			await kanban.updateComplete;
			const columns = kanban.querySelectorAll('t-kanban-column');
			expect(columns.length).toBe(3);
		});

		it('should slot cards correctly within columns', async () => {
			await kanban.updateComplete;
			const cards = kanban.querySelectorAll('t-kanban-card');
			expect(cards.length).toBe(3);
		});
	});

	// ======================================================
	// SUITE 6: Logging
	// ======================================================
	describe('Logging', () => {
		it('should have logger instance', () => {
			expect(kanban._logger).toBeTruthy();
		});
	});

	// ======================================================
	// SUITE 7: Integration
	// ======================================================
	describe('Integration', () => {
		it('card events should bubble through column to board', async () => {
			await kanban.updateComplete;
			const handler = vi.fn();
			kanban.addEventListener('card-edit', handler);

			const card = kanban.querySelector('t-kanban-card[card-id="card1"]');
			card._handleEdit();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.cardId).toBe('card1');
		});

		it('column events should bubble to board', async () => {
			await kanban.updateComplete;
			const handler = vi.fn();
			kanban.addEventListener('column-add-card', handler);

			const column = kanban.querySelector('t-kanban-column[column-id="todo"]');
			column._handleAddCard();

			expect(handler).toHaveBeenCalled();
			expect(handler.mock.calls[0][0].detail.columnId).toBe('todo');
		});

		it('drop event should propagate and trigger card-move', async () => {
			await kanban.updateComplete;
			const handler = vi.fn();
			kanban.addEventListener('card-move', handler);

			const column = kanban.querySelector('t-kanban-column[column-id="inprogress"]');
			column._handleDrop({
				preventDefault: () => {},
				dataTransfer: { getData: () => 'card1' }
			});

			expect(handler).toHaveBeenCalled();
		});
	});
});
