# TListLit

A high-performance virtualized list component with selection, grouping, drag-and-drop reordering, and infinite scroll support.

## Tag Name

`t-list`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-list` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `items` | `Array` | `[]` | No | Array of list items |
| `itemHeight` | `Number` | `48` | No | Height of each item in pixels (for virtualization) |
| `selectable` | `String` | `'none'` | Yes | Selection mode: `'none'`, `'single'`, `'multiple'` |
| `selected` | `Array` | `[]` | No | Array of selected item IDs |
| `dividers` | `Boolean` | `false` | Yes | Show dividers between items |
| `dense` | `Boolean` | `false` | Yes | Compact item spacing |
| `loading` | `Boolean` | `false` | Yes | Show loading indicator |
| `loadingMore` | `Boolean` | `false` | Yes | Show loading at bottom (infinite scroll) |
| `emptyText` | `String` | `'No items'` | No | Text when list is empty |
| `groupBy` | `String` | `''` | No | Property to group items by |
| `draggable` | `Boolean` | `false` | Yes | Enable drag-and-drop reordering |
| `virtual` | `Boolean` | `false` | Yes | Enable virtualization for large lists |
| `overscan` | `Number` | `5` | No | Extra items to render outside viewport |
| `itemKey` | `String` | `'id'` | No | Property to use as unique key |

### Item Object Structure

```javascript
{
  id: 'item-1',           // Unique identifier
  label: 'Item Label',    // Primary text (or use title, text, name)
  secondary: 'Details',   // Secondary text (or use description)
  icon: '<svg>...</svg>', // Optional icon (SVG/HTML string)
  avatar: 'url',          // Optional avatar URL
  disabled: false,        // Disable item
  trailing: 'info',       // Trailing text (or use meta)
  group: 'Category'       // Group identifier (if groupBy used)
}
```

## Methods

### select(itemId)
Select an item.

**Parameters:**
- `itemId` (String): ID of item to select

**Fires:** `selection-change`

### deselect(itemId)
Deselect an item.

**Parameters:**
- `itemId` (String): ID of item to deselect

**Fires:** `selection-change`

### toggleSelection(itemId)
Toggle item selection.

**Parameters:**
- `itemId` (String): ID of item to toggle

**Fires:** `selection-change`

### selectAll()
Select all items.

**Fires:** `selection-change`

### clearSelection()
Clear all selections.

**Fires:** `selection-change`

### scrollToItem(itemId, position)
Scroll to make an item visible.

**Parameters:**
- `itemId` (String): ID of item to scroll to
- `position` (String): Scroll position: `'start'`, `'center'`, `'end'`, `'nearest'` (default)

### focusItem(index)
Focus an item for keyboard navigation.

**Parameters:**
- `index` (Number): Index of item to focus

## Events

### item-click
Fired when an item is clicked.

```javascript
{
  detail: {
    item: { id: 'item-1', label: '...', ... },
    index: 0,
    id: 'item-1'
  }
}
```

### selection-change
Fired when selection changes.

```javascript
{
  detail: {
    selected: ['item-1', 'item-3'],
    items: [{ id: 'item-1', ... }, { id: 'item-3', ... }]
  }
}
```

### load-more
Fired when scrolled near bottom (infinite scroll).

```javascript
{
  detail: {
    itemCount: 50
  }
}
```

### reorder
Fired when items are reordered via drag-and-drop.

```javascript
{
  detail: {
    item: { id: 'item-1', ... },
    fromIndex: 2,
    toIndex: 0
  }
}
```

## Examples

### Basic List

```html
<t-list .items=${[
  { id: '1', label: 'Item One' },
  { id: '2', label: 'Item Two' },
  { id: '3', label: 'Item Three' }
]}></t-list>
```

### Selectable List with Icons

```html
<t-list
  selectable="single"
  dividers
  .items=${[
    { id: 'inbox', label: 'Inbox', icon: '<svg>...</svg>', secondary: '5 new' },
    { id: 'sent', label: 'Sent', icon: '<svg>...</svg>' },
    { id: 'trash', label: 'Trash', icon: '<svg>...</svg>' }
  ]}
  @selection-change=${handleSelection}>
</t-list>
```

### Grouped List

```html
<t-list
  group-by="category"
  .items=${[
    { id: '1', label: 'Apple', category: 'Fruits' },
    { id: '2', label: 'Banana', category: 'Fruits' },
    { id: '3', label: 'Carrot', category: 'Vegetables' },
    { id: '4', label: 'Broccoli', category: 'Vegetables' }
  ]}>
</t-list>
```

### Draggable Reordering

```html
<t-list
  draggable
  .items=${items}
  @reorder=${handleReorder}>
</t-list>
```

### Infinite Scroll

```html
<t-list
  .items=${items}
  ?loading-more=${isLoadingMore}
  @load-more=${loadMoreItems}>
</t-list>
```

### Virtualized Large List

```html
<t-list
  virtual
  item-height="48"
  .overscan=${5}
  .items=${largeDataset}>
</t-list>
```

### Dense with Avatars

```html
<t-list dense .items=${[
  { id: '1', label: 'John Doe', avatar: '/avatars/john.png' },
  { id: '2', label: 'Jane Smith', avatar: '/avatars/jane.png' }
]}></t-list>
```

### Programmatic Control

```javascript
const list = document.querySelector('t-list');

// Selection
list.select('item-1');
list.selectAll();
list.clearSelection();

// Navigation
list.scrollToItem('item-50');
list.focusItem(0); // Focus by index, not ID

// Listen for events
list.addEventListener('item-click', (e) => {
  console.log('Clicked:', e.detail.item.label);
});
```

## Slots

| Slot | Description |
|------|-------------|
| `item` | Custom item template (receives item data) |
| `empty` | Content displayed when the list is empty |
| `loading` | Custom loading indicator |

## CSS Parts

| Part | Description |
|------|-------------|
| `list` | The list container |
| `item` | Individual list item |
| `item-selected` | Selected list item |
| `divider` | Item divider |
| `group-header` | Group header |
| `empty` | Empty state container |
| `loading` | Loading indicator |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--t-list-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--t-list-border` | `var(--terminal-gray-dark)` | Border color |
| `--t-list-color` | `var(--terminal-green)` | Text/accent color |
| `--t-list-item-hover` | `rgba(0, 255, 65, 0.1)` | Hover background |
| `--t-list-item-selected` | `rgba(0, 255, 65, 0.2)` | Selected background |
| `--t-font-mono` | `'JetBrains Mono', monospace` | Font family |

## Related Components

- [TMenuLit](./TMenuLit.md) - Dropdown menu
- [TTreeLit](./TTreeLit.md) - Tree structure
