# TTreeLit

A hierarchical tree structure component with terminal styling, supporting expand/collapse, selection, checkboxes, drag-and-drop, and lazy loading.

## Tag Name

`t-tree`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-tree` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Attribute | Reflects | Description |
|----------|------|---------|-----------|----------|-------------|
| `nodes` | `Array` | `[]` | - | No | Array of tree nodes |
| `selectable` | `String` | `'none'` | `selectable` | Yes | Selection mode: `'none'`, `'single'`, `'multiple'` |
| `selected` | `Array` | `[]` | - | No | Array of selected node IDs |
| `expanded` | `Array` | `[]` | - | No | Array of expanded node IDs |
| `expandOnClick` | `Boolean` | `true` | `expand-on-click` | Yes | Expand nodes when clicked |
| `showCheckboxes` | `Boolean` | `false` | `show-checkboxes` | Yes | Show checkboxes for selection |
| `cascadeSelection` | `Boolean` | `true` | `cascade-selection` | Yes | Selection cascades to children/parents |
| `draggable` | `Boolean` | `false` | `draggable` | Yes | Enable drag-and-drop |
| `searchable` | `Boolean` | `false` | `searchable` | Yes | Show search input |
| `searchQuery` | `String` | `''` | `search-query` | No | Current search query |
| `nodeKey` | `String` | `'id'` | `node-key` | No | Property to use as unique key |

### Node Object Structure

```javascript
{
  id: 'node-1',          // Unique identifier
  label: 'Node Label',   // Display text (or use 'name')
  icon: '<svg>...</svg>',// Optional custom icon (SVG string)
  children: [],          // Child nodes
  disabled: false,       // Disable node
  lazy: true,            // Load children on demand
  meta: 'info',          // Optional metadata/badge text
  badge: 'info'          // Alternative to meta
}
```

## Methods

### expandNode(nodeId)
Expand a node.

**Parameters:**
- `nodeId` (String): ID of node to expand

**Fires:** `node-expand`

### collapseNode(nodeId)
Collapse a node.

**Parameters:**
- `nodeId` (String): ID of node to collapse

**Fires:** `node-expand`

### toggleExpand(nodeId)
Toggle node expansion.

**Parameters:**
- `nodeId` (String): ID of node to toggle

**Fires:** `node-expand`

### expandAll()
Expand all nodes.

### collapseAll()
Collapse all nodes.

### selectNode(nodeId)
Select a node.

**Parameters:**
- `nodeId` (String): ID of node to select

**Fires:** `selection-change`

### deselectNode(nodeId)
Deselect a node.

**Parameters:**
- `nodeId` (String): ID of node to deselect

**Fires:** `selection-change`

### toggleSelection(nodeId)
Toggle node selection.

**Parameters:**
- `nodeId` (String): ID of node to toggle

**Fires:** `selection-change`

### clearSelection()
Clear all selections.

**Fires:** `selection-change`

### findNode(nodeId)
Find a node by ID.

**Parameters:**
- `nodeId` (String): ID of node to find

**Returns:** `Object|null` - Node object or null

### setNodeLoading(nodeId, loading)
Set loading state on a node.

**Parameters:**
- `nodeId` (String): ID of node
- `loading` (Boolean): Loading state

## Events

### node-click
Fired when a node is clicked.

```javascript
{
  detail: {
    node: { id: 'node-1', label: '...', ... },
    id: 'node-1'
  }
}
```

### node-expand
Fired when a node is expanded/collapsed.

```javascript
{
  detail: {
    node: { id: 'node-1', label: '...', ... },
    id: 'node-1',
    expanded: true
  }
}
```

### selection-change
Fired when selection changes.

```javascript
{
  detail: {
    selected: ['node-1', 'node-3'],
    nodes: [{ id: 'node-1', ... }, { id: 'node-3', ... }]
  }
}
```

### node-drop
Fired when a node is dropped (drag-and-drop).

```javascript
{
  detail: {
    draggedNode: { id: 'dragged-node', ... },
    targetNode: { id: 'drop-target', ... },
    draggedId: 'dragged-node',
    targetId: 'drop-target',
    position: 'after'
  }
}
```

### lazy-load
Fired when a lazy node is expanded.

```javascript
{
  detail: {
    node: { id: 'lazy-node', lazy: true, ... },
    id: 'lazy-node'
  }
}
```

## Examples

### Basic Tree

```html
<t-tree .nodes=${[
  {
    id: 'root',
    label: 'Root',
    children: [
      { id: 'child-1', label: 'Child 1' },
      { id: 'child-2', label: 'Child 2' }
    ]
  }
]}></t-tree>
```

### File Explorer Style

```html
<t-tree .nodes=${[
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      { id: 'index', label: 'index.js', icon: 'file' },
      { id: 'app', label: 'App.js', icon: 'file' },
      {
        id: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { id: 'header', label: 'Header.js', icon: 'file' },
          { id: 'footer', label: 'Footer.js', icon: 'file' }
        ]
      }
    ]
  }
]}></t-tree>
```

### Selectable with Checkboxes

```html
<t-tree
  selectable="multiple"
  show-checkboxes
  cascade-selection
  .nodes=${nodes}
  @selection-change=${handleSelection}>
</t-tree>
```

### Searchable Tree

```html
<t-tree searchable .nodes=${nodes}></t-tree>
```

### Draggable Nodes

```html
<t-tree
  draggable
  .nodes=${nodes}
  @node-drop=${handleDrop}>
</t-tree>
```

### Lazy Loading

```html
<t-tree
  .nodes=${[
    { id: 'folder-1', label: 'Large Folder', lazy: true, children: [] }
  ]}
  @lazy-load=${async (e) => {
    const { nodeId } = e.detail;
    tree.setNodeLoading(nodeId, true);
    const children = await fetchChildren(nodeId);
    // Update nodes with fetched children
    tree.setNodeLoading(nodeId, false);
  }}>
</t-tree>
```

### Programmatic Control

```javascript
const tree = document.querySelector('t-tree');

// Expansion
tree.expandNode('folder-1');
tree.collapseNode('folder-1');
tree.expandAll();
tree.collapseAll();

// Selection
tree.selectNode('file-1');
tree.deselectNode('file-1');
tree.clearSelection();

// Find node
const node = tree.findNode('file-1');

// Listen for events
tree.addEventListener('node-click', (e) => {
  console.log('Clicked:', e.detail.node.label);
});
```

## Slots

| Slot | Description |
|------|-------------|
| `icon-{id}` | Custom icon for a specific node by ID |

## CSS Parts

| Part | Description |
|------|-------------|
| `tree` | The tree container |
| `node` | Individual tree node |
| `node-selected` | Selected tree node |
| `node-content` | Node content wrapper |
| `expand-icon` | Expand/collapse icon |
| `checkbox` | Node checkbox |
| `node-icon` | Node icon |
| `node-label` | Node label text |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--t-tree-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--t-tree-color` | `var(--terminal-green)` | Text/icon color |
| `--t-tree-hover` | `rgba(0, 255, 65, 0.1)` | Hover background color |
| `--t-tree-selected` | `rgba(0, 255, 65, 0.2)` | Selected background color |
| `--t-font-mono` | `'JetBrains Mono', monospace` | Font family |

## Related Components

- [TListLit](./TListLit.md) - Flat list
- [TMenuLit](./TMenuLit.md) - Dropdown menu
