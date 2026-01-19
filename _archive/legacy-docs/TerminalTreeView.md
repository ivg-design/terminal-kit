# TerminalTreeView

A hierarchical tree view component with terminal/cyberpunk styling. Supports expand/collapse nodes, selection management, keyboard navigation, and icon integration.

## Tag Names
```html
<terminal-tree-view></terminal-tree-view>
<terminal-tree-node></terminal-tree-node>
```

## Attributes

### TerminalTreeView Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `multi-select` | boolean | `false` | Allow multiple node selection |
| `expand-on-select` | boolean | `true` | Auto-expand nodes when selected |
| `show-root` | boolean | `true` | Show root level nodes |
| `disabled` | boolean | `false` | Disabled state |

### TerminalTreeNode Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `expanded` | boolean | `false` | Node expanded state |
| `selected` | boolean | `false` | Node selected state |
| `level` | number | `0` | Indentation level |
| `has-children` | boolean | `false` | Whether node has child nodes |
| `icon` | string | - | Icon SVG content |
| `disabled` | boolean | `false` | Disabled state |

## Properties

### TerminalTreeView Properties

| Property | Type | Description |
|----------|------|-------------|
| `selectedNodes` | Set | Currently selected nodes |
| `data` | Array | Tree data structure |

### TerminalTreeNode Properties

| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Node display text |
| `value` | any | Node value/data |
| `children` | Array | Child nodes |

## Methods

### TerminalTreeView Methods

#### `setData(data)`
Sets tree data and renders nodes.

**Parameters:**
- `data` (Array): Array of node objects

**Node Object Structure:**
```javascript
{
  text: 'Node Text',
  value: 'node-value',
  icon: '<svg>...</svg>',
  expanded: false,
  selected: false,
  disabled: false,
  children: [
    // Child node objects...
  ]
}
```

**Example:**
```javascript
const treeView = document.querySelector('terminal-tree-view');
treeView.setData([
  {
    text: 'Root Folder',
    value: 'root',
    icon: folderIcon,
    expanded: true,
    children: [
      {
        text: 'Sub Folder',
        value: 'sub',
        icon: folderIcon,
        children: [
          {
            text: 'File 1',
            value: 'file1',
            icon: fileIcon
          }
        ]
      }
    ]
  }
]);
```

#### `getAllNodes()`
Returns all tree nodes.

```javascript
const allNodes = treeView.getAllNodes();
```

#### `getVisibleNodes()`
Returns only visible (expanded parent) nodes.

```javascript
const visibleNodes = treeView.getVisibleNodes();
```

#### `getSelectedNodes()`
Returns currently selected nodes.

```javascript
const selected = treeView.getSelectedNodes();
```

#### `clearSelection()`
Clears all node selections.

```javascript
treeView.clearSelection();
```

#### `selectByValue(value)`
Selects node by its value.

```javascript
treeView.selectByValue('file1');
```

#### `expandAll()`
Expands all nodes with children.

```javascript
treeView.expandAll();
```

#### `collapseAll()`
Collapses all expanded nodes.

```javascript
treeView.collapseAll();
```

#### `findNodeByText(text)`
Finds node by text content.

```javascript
const node = treeView.findNodeByText('File 1');
```

#### `findNodesByValue(value)`
Finds all nodes with specified value.

```javascript
const nodes = treeView.findNodesByValue('folder');
```

#### `getTreeData()`
Returns tree structure as data object.

```javascript
const data = treeView.getTreeData();
```

#### `disable()` / `enable()`
Disables or enables the tree view.

```javascript
treeView.disable();
treeView.enable();
```

### TerminalTreeNode Methods

#### `select()` / `deselect()`
Selects or deselects the node.

```javascript
node.select();
node.deselect();
```

#### `expand()` / `collapse()`
Expands or collapses the node (if it has children).

```javascript
node.expand();
node.collapse();
```

#### `toggle()`
Toggles the expanded state.

```javascript
node.toggle();
```

#### `setText(text)`
Sets node display text.

```javascript
node.setText('New Text');
```

#### `setValue(value)`
Sets node value.

```javascript
node.setValue('new-value');
```

#### `setIcon(iconSvg)`
Sets node icon.

```javascript
node.setIcon('<svg>...</svg>');
```

#### `setDisabled(disabled)`
Sets disabled state.

```javascript
node.setDisabled(true);
```

#### `focus()`
Focuses the node.

```javascript
node.focus();
```

## Events

### TerminalTreeView Events

#### `selection-change`
Fired when selection changes.

**Event Detail:**
```javascript
{
  selectedNodes: Array,  // Currently selected nodes
  node: TerminalTreeNode, // Node that triggered the change
  action: string         // 'select', 'deselect', or 'clear'
}
```

**Example:**
```javascript
treeView.addEventListener('selection-change', (e) => {
  console.log('Selection changed:', e.detail);
});
```

#### `node-expanded`
Fired when a node is expanded.

**Event Detail:**
```javascript
{
  node: TerminalTreeNode,
  value: any,
  text: string
}
```

#### `node-collapsed`
Fired when a node is collapsed.

**Event Detail:**
```javascript
{
  node: TerminalTreeNode,
  value: any,
  text: string
}
```

### TerminalTreeNode Events

#### `node-select`
Fired when node is selected.

#### `node-deselect`
Fired when node is deselected.

#### `node-expand`
Fired when node is expanded.

#### `node-collapse`
Fired when node is collapsed.

## CSS Classes

### TerminalTreeView Classes
- `terminal-tree-view` - Base class
- `tree-view` - Internal container class
- `tree-view--disabled` - When disabled
- `tree-view--no-root` - When show-root is false

### TerminalTreeNode Classes
- `terminal-tree-node` - Base class
- `tree-node` - Internal node class
- `tree-node--selected` - When selected
- `tree-node--expanded` - When expanded
- `tree-node--disabled` - When disabled
- `tree-node--has-children` - When node has children

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` | Focus next visible node |
| `↑` | Focus previous visible node |
| `→` | Expand focused node (if has children) |
| `←` | Collapse focused node (if expanded) |
| `Home` | Focus first node |
| `End` | Focus last visible node |
| `Enter`/`Space` | Select focused node |

## Examples

### Basic Tree View
```html
<terminal-tree-view id="fileTree">
  <terminal-tree-node expanded has-children>
    Root Folder
    <terminal-tree-node has-children>
      Documents
      <terminal-tree-node>document.txt</terminal-tree-node>
      <terminal-tree-node>report.pdf</terminal-tree-node>
    </terminal-tree-node>
    <terminal-tree-node>readme.md</terminal-tree-node>
  </terminal-tree-node>
</terminal-tree-view>
```

### Tree View with Data
```html
<terminal-tree-view id="dataTree"></terminal-tree-view>

<script>
  import { folderIcon, fileIcon } from './phosphor-icons.js';
  
  const treeData = [
    {
      text: 'Project',
      value: 'project',
      icon: folderIcon,
      expanded: true,
      children: [
        {
          text: 'Source',
          value: 'src',
          icon: folderIcon,
          children: [
            { text: 'index.js', value: 'index', icon: fileIcon },
            { text: 'styles.css', value: 'styles', icon: fileIcon }
          ]
        },
        {
          text: 'Tests',
          value: 'tests',
          icon: folderIcon,
          children: [
            { text: 'unit.test.js', value: 'unit-test', icon: fileIcon }
          ]
        }
      ]
    }
  ];
  
  document.getElementById('dataTree').setData(treeData);
</script>
```

### Multi-Selection Tree
```html
<terminal-tree-view multi-select id="multiTree">
  <!-- nodes... -->
</terminal-tree-view>

<script>
  const multiTree = document.getElementById('multiTree');
  
  multiTree.addEventListener('selection-change', (e) => {
    console.log(`${e.detail.selectedNodes.length} nodes selected`);
  });
</script>
```

### File Explorer Example
```html
<terminal-tree-view id="fileExplorer" expand-on-select></terminal-tree-view>

<script>
  import { 
    folderIcon, 
    fileIcon, 
    jsFileIcon, 
    cssFileIcon 
  } from './file-icons.js';
  
  const fileSystemData = [
    {
      text: 'My Project',
      value: '/project',
      icon: folderIcon,
      expanded: true,
      children: [
        {
          text: 'src',
          value: '/project/src',
          icon: folderIcon,
          children: [
            {
              text: 'components',
              value: '/project/src/components',
              icon: folderIcon,
              children: [
                {
                  text: 'Button.js',
                  value: '/project/src/components/Button.js',
                  icon: jsFileIcon
                },
                {
                  text: 'Modal.js',
                  value: '/project/src/components/Modal.js',
                  icon: jsFileIcon
                }
              ]
            },
            {
              text: 'styles',
              value: '/project/src/styles',
              icon: folderIcon,
              children: [
                {
                  text: 'main.css',
                  value: '/project/src/styles/main.css',
                  icon: cssFileIcon
                }
              ]
            }
          ]
        },
        {
          text: 'README.md',
          value: '/project/README.md',
          icon: fileIcon
        }
      ]
    }
  ];
  
  const fileExplorer = document.getElementById('fileExplorer');
  fileExplorer.setData(fileSystemData);
  
  // Handle file selection
  fileExplorer.addEventListener('selection-change', (e) => {
    const selectedNode = e.detail.selectedNodes[0];
    if (selectedNode && !selectedNode.getProp('hasChildren')) {
      console.log('File selected:', selectedNode.getProp('value'));
      // Open file logic here
    }
  });
</script>
```

### Dynamic Tree Updates
```html
<terminal-tree-view id="dynamicTree"></terminal-tree-view>
<button id="addNode">Add Node</button>
<button id="removeNode">Remove Selected</button>

<script>
  const dynamicTree = document.getElementById('dynamicTree');
  let nodeCounter = 0;
  
  // Add node
  document.getElementById('addNode').addEventListener('click', () => {
    const data = dynamicTree.getTreeData();
    data.push({
      text: `New Node ${++nodeCounter}`,
      value: `node-${nodeCounter}`,
      icon: fileIcon
    });
    dynamicTree.setData(data);
  });
  
  // Remove selected nodes
  document.getElementById('removeNode').addEventListener('click', () => {
    const selected = dynamicTree.getSelectedNodes();
    if (selected.length > 0) {
      selected.forEach(node => node.remove());
      dynamicTree.updateNodeStates();
    }
  });
</script>
```

## Styling Variables

The component uses these CSS variables (defined in terminal.css):

```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-gray-dark: #242424;
--terminal-gray: #2a2a2a;
--terminal-gray-light: #333333;
--font-mono: 'SF Mono', 'Monaco', monospace;
--control-height: 28px;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-xl: 24px;
```

## Accessibility

- Supports full keyboard navigation
- ARIA roles and attributes (tree, treeitem)
- Focus management and visible focus indicators
- Screen reader support for expanded/collapsed states
- Proper disabled state handling
- High contrast mode support

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Related Components

- [TerminalTreeNode](./TerminalTreeNode.md) - Individual tree node component
- [TerminalButton](./TerminalButton.md) - Button component used in examples
- [TerminalModal](./TerminalModal.md) - Modal dialog component
- [TerminalDropdown](./TerminalDropdown.md) - Dropdown component