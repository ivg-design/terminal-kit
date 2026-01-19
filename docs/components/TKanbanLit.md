# TKanbanLit

A Kanban board component with terminal styling, featuring draggable cards, customizable columns, and task management functionality.

## Tag Names

- `t-kanban` - Board container
- `t-kanban-column` - Individual column
- `t-kanban-card` - Task card

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-kanban` / `t-kanban-column` / `t-kanban-card` |
| version | `3.0.0` |
| category | `Container` |

## Board Properties (t-kanban)

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `title` | `String` | `''` | Yes | Board title |
| `showHeader` | `Boolean` | `false` | Yes | Show board header |

## Column Properties (t-kanban-column)

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `columnId` | `String` | `''` | Yes | Unique column identifier |
| `title` | `String` | `'Column'` | Yes | Column title |
| `color` | `String` | `'green'` | Yes | Column accent color (`green`, `amber`, `cyan`, `red`, `gray`, `white`) |
| `monochrome` | `Boolean` | `false` | Yes | Use monochrome styling |
| `collapsed` | `Boolean` | `false` | Yes | Collapse the column |
| `maxCards` | `Number` | `0` | No | Maximum cards (0 = unlimited) |

## Card Properties (t-kanban-card)

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `cardId` | `String` | `''` | Yes | Unique card identifier |
| `title` | `String` | `''` | Yes | Card title |
| `description` | `String` | `''` | No | Card description |
| `tags` | `Array` | `[]` | No | Array of tag strings |
| `priority` | `String` | `''` | Yes | Priority: `'low'`, `'medium'`, `'high'` |
| `expanded` | `Boolean` | `false` | Yes | Show full description |
| `dragging` | `Boolean` | `false` | Yes | Currently being dragged |
| `assignee` | `String` | `''` | No | Assigned user name |
| `dueDate` | `String` | `''` | No | Due date string |

## Methods

### Board Methods

#### moveCard(cardId, targetColumnId)
Move a card to a different column.

**Parameters:**
- `cardId` (String): Card ID to move
- `targetColumnId` (String): Destination column ID

**Fires:** `card-moved`

#### getColumnCards(columnId)
Get cards in a column.

**Parameters:**
- `columnId` (String): Column ID

**Returns:** `Array` - Array of card elements

#### getColumns()
Get all columns.

**Returns:** `Array` - Array of column elements

## Events

### card-move
Fired when a card drop is detected (before move completes). Emitted by board when `card-drop` bubbles up.

```javascript
{
  detail: {
    cardId: 'card-1',
    columnId: 'doing'
  }
}
```

### card-moved
Fired after card move completes via `moveCard()` method.

```javascript
{
  detail: {
    cardId: 'card-1',
    columnId: 'doing'
  }
}
```

### card-drag-start
Fired when drag begins.

```javascript
{
  detail: {
    cardId: 'card-1'
  }
}
```

### card-drag-end
Fired when drag ends.

```javascript
{
  detail: {
    cardId: 'card-1'
  }
}
```

### card-drop
Fired when card is dropped on a column.

```javascript
{
  detail: {
    cardId: 'card-1',
    columnId: 'doing'
  }
}
```

### card-expand
Fired when card is expanded/collapsed. Emitted by `t-kanban-card`.

```javascript
{
  detail: {
    cardId: 'card-1',
    expanded: true
  }
}
```

### card-edit
Fired when edit is requested.

```javascript
{
  detail: {
    cardId: 'card-1'
  }
}
```

### card-delete
Fired when delete is requested.

```javascript
{
  detail: {
    cardId: 'card-1'
  }
}
```

### column-add-card
Fired when add card button is clicked.

```javascript
{
  detail: {
    columnId: 'todo'
  }
}
```

### column-menu
Fired when column menu is opened.

```javascript
{
  detail: {
    columnId: 'todo'
  }
}
```

### add-column
Fired when add column button is clicked.

```javascript
{
  detail: {}
}
```

## Examples

### Basic Kanban Board

```html
<t-kanban title="Project Board" show-header>
  <t-kanban-column column-id="todo" title="To Do" color="amber">
    <t-kanban-card
      card-id="task-1"
      title="Design UI"
      description="Create wireframes">
    </t-kanban-card>
    <t-kanban-card
      card-id="task-2"
      title="Setup Database">
    </t-kanban-card>
  </t-kanban-column>

  <t-kanban-column column-id="doing" title="In Progress" color="cyan">
    <t-kanban-card
      card-id="task-3"
      title="API Development"
      priority="high">
    </t-kanban-card>
  </t-kanban-column>

  <t-kanban-column column-id="done" title="Done" color="green">
    <t-kanban-card
      card-id="task-4"
      title="Project Setup">
    </t-kanban-card>
  </t-kanban-column>
</t-kanban>
```

### Cards with Tags and Priority

```html
<t-kanban-card
  card-id="task-1"
  title="Implement Auth"
  description="Add OAuth2 authentication"
  priority="high"
  .tags=${['backend', 'security']}
  assignee="John"
  due-date="2024-01-20">
</t-kanban-card>
```

### Monochrome Columns

```html
<t-kanban>
  <t-kanban-column column-id="backlog" title="Backlog" monochrome>
    <!-- cards -->
  </t-kanban-column>
</t-kanban>
```

### Column with Card Limit

```html
<t-kanban-column
  column-id="wip"
  title="Work in Progress"
  max-cards="3"
  color="amber">
  <!-- max 3 cards -->
</t-kanban-column>
```

### Handling Drag and Drop

```html
<t-kanban
  @card-move=${handleMove}
  @card-moved=${handleMoved}
  @card-drag-start=${handleDragStart}
  @card-drag-end=${handleDragEnd}>
  <!-- columns and cards -->
</t-kanban>
```

### Programmatic Card Movement

```javascript
const kanban = document.querySelector('t-kanban');

// Move card to column
kanban.moveCard('task-1', 'doing');

// Get column cards
const todoCards = kanban.getColumnCards('todo');

// Get all columns
const columns = kanban.getColumns();

// Listen for events
kanban.addEventListener('card-move', (e) => {
  console.log('Moving:', e.detail.cardId, 'to', e.detail.columnId);
});

kanban.addEventListener('column-add-card', (e) => {
  // Open new card dialog for this column
  openNewCardDialog(e.detail.columnId);
});
```

## Slots

### Board Slots
| Slot | Description |
|------|-------------|
| default | `t-kanban-column` elements |

### Column Slots
| Slot | Description |
|------|-------------|
| default | `t-kanban-card` elements |

### Card Slots
| Slot | Description |
|------|-------------|
| default | Additional card content |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--board-bg` | `var(--terminal-black)` | Board background |
| `--board-border` | `var(--terminal-gray-dark)` | Board border color |
| `--column-color` | `var(--terminal-green)` | Column accent color |
| `--column-bg` | `var(--terminal-gray-darkest)` | Column background |
| `--card-bg` | `var(--terminal-gray-darkest)` | Card background |
| `--card-border` | `var(--terminal-gray-dark)` | Card border color |
| `--card-color` | `var(--terminal-green)` | Card accent color |

## Related Components

- [TCardLit](./TCardLit.md) - Card container
- [TListLit](./TListLit.md) - List display
