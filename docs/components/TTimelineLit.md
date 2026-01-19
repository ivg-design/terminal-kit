# TTimelineLit

A vertical timeline component for displaying chronological events with terminal styling, expandable details, and infinite scroll support.

## Tag Name

`t-tmln`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-tmln` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `items` | `Array` | `[]` | No | Array of timeline items |
| `align` | `String` | `'left'` | Yes | Timeline alignment: `'left'`, `'right'`, `'alternate'` |
| `dense` | `Boolean` | `false` | Yes | Compact spacing mode |
| `loading` | `Boolean` | `false` | Yes | Show loading indicator |
| `loadingMore` | `Boolean` | `false` | Yes | Show loading at bottom (infinite scroll) |

### Item Object Structure

```javascript
{
  id: 'event-1',           // Unique identifier (required)
  title: 'Event Title',    // Primary text (required)
  description: 'Details',  // Event details (optional)
  date: '2024-01-15',      // Date/time string (optional)
  variant: 'success',      // Dot color variant: 'default', 'success', 'warning', 'error', 'info', 'pending'
  expandable: true,        // Can be expanded (optional)
  clickable: true          // Fires click event (optional)
}
```

## Methods

### expandItem(itemId)
Expand a timeline item.

**Parameters:**
- `itemId` (String): ID of item to expand

**Fires:** `item-expand`

### collapseItem(itemId)
Collapse a timeline item.

**Parameters:**
- `itemId` (String): ID of item to collapse

**Fires:** `item-expand`

### toggleItem(itemId)
Toggle item expanded state.

**Parameters:**
- `itemId` (String): ID of item to toggle

**Fires:** `item-expand`

### isExpanded(itemId)
Check if an item is expanded.

**Parameters:**
- `itemId` (String): ID of item to check

**Returns:** `Boolean` - Whether item is expanded

### loadMore()
Trigger loading more items.

**Fires:** `load-more`

## Events

### item-click
Fired when an item with `clickable: true` is clicked.

```javascript
{
  detail: {
    id: 'event-1',
    title: 'Event Title',
    item: { id: 'event-1', title: '...', ... }
  }
}
```

### item-expand
Fired when an item is expanded/collapsed.

```javascript
{
  detail: {
    id: 'event-1',
    expanded: true
  }
}
```

### load-more
Fired when scrolled near bottom (infinite scroll).

```javascript
{
  detail: {}
}
```

## Examples

### Basic Timeline

```html
<t-tmln .items=${[
  { id: '1', title: 'Project Started', date: '2024-01-01', description: 'Initial commit' },
  { id: '2', title: 'Beta Release', date: '2024-03-15', description: 'First public beta' },
  { id: '3', title: 'Version 1.0', date: '2024-06-01', description: 'Stable release' }
]}></t-tmln>
```

### Alternating Alignment

```html
<t-tmln align="alternate" .items=${[
  { id: '1', title: 'Morning', date: '08:00', description: 'Start work' },
  { id: '2', title: 'Noon', date: '12:00', description: 'Lunch break' },
  { id: '3', title: 'Evening', date: '18:00', description: 'End work' }
]}></t-tmln>
```

### With Variants

```html
<t-tmln .items=${[
  { id: '1', title: 'Success', variant: 'success', description: 'Task completed' },
  { id: '2', title: 'Warning', variant: 'warning', description: 'Review needed' },
  { id: '3', title: 'Error', variant: 'error', description: 'Build failed' },
  { id: '4', title: 'Info', variant: 'info', description: 'New update available' },
  { id: '5', title: 'Pending', variant: 'pending', description: 'Waiting for approval' }
]}></t-tmln>
```

### Expandable Items

```html
<t-tmln .items=${[
  {
    id: '1',
    title: 'Deployment',
    date: '2024-01-15 14:30',
    description: 'Click to see details',
    expandable: true
  }
]} @item-expand=${handleExpand}>
  <div slot="expand-1">Full deployment log...</div>
</t-tmln>
```

### Dense Mode

```html
<t-tmln dense .items=${manyItems}></t-tmln>
```

### Infinite Scroll

```html
<t-tmln
  .items=${items}
  ?loading-more=${isLoadingMore}
  @load-more=${loadMoreItems}>
</t-tmln>
```

### Programmatic Control

```javascript
const timeline = document.querySelector('t-tmln');

// Expand/collapse
timeline.expandItem('event-1');
timeline.collapseItem('event-1');
timeline.toggleItem('event-1');

// Check state
const isOpen = timeline.isExpanded('event-1');

// Listen for events
timeline.addEventListener('item-click', (e) => {
  console.log('Clicked:', e.detail.item.title);
});

timeline.addEventListener('item-expand', (e) => {
  console.log('Expanded:', e.detail.id, e.detail.expanded);
});
```

## Slots

| Slot | Description |
| --- | --- |
| `icon-{id}` | Custom icon for a specific timeline item |
| `item-{id}` | Custom content for a specific timeline item |
| `expand-{id}` | Expanded content area for a specific timeline item (used with `expandable: true`) |


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--timeline-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--timeline-border` | `var(--terminal-gray-dark)` | Vertical line and border color |
| `--timeline-green` | `var(--terminal-green)` | Primary accent color |
| `--timeline-green-dim` | `var(--terminal-green-dim)` | Secondary/description text color |
| `--timeline-amber` | `var(--terminal-amber)` | Warning variant color |
| `--timeline-red` | `var(--terminal-red)` | Error variant color |
| `--timeline-cyan` | `var(--terminal-cyan)` | Info variant color |
| `--timeline-gray` | `var(--terminal-gray)` | Pending variant and date color |
| `--timeline-line-width` | `2px` | Width of the timeline line |
| `--timeline-dot-size` | `12px` | Size of the timeline dots |

## Related Components

- [TListLit](./TListLit.md) - Simple list
- [TLogListLit](./TLogListLit.md) - Log entries
