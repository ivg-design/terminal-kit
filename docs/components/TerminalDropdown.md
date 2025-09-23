# TerminalDropdown

A nested dropdown component with folder/file tree structure, search functionality, and metadata support. Perfect for hierarchical selection with terminal aesthetics.

## Tag Name
```html
<terminal-dropdown></terminal-dropdown>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | string | `'Select animation...'` | Placeholder text |
| `disabled` | boolean | `false` | Disabled state |
| `value` | string | `''` | Selected value (file path) |
| `width` | string | `'300px'` | Dropdown width |
| `search` | boolean | `true` | Show/hide search bar |
| `icons` | boolean | `true` | Show/hide file and folder icons |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `data` | Object | Hierarchical data structure |
| `metadata` | Object | File metadata information |
| `search` | boolean | Whether search bar is enabled |
| `icons` | boolean | Whether icons are shown |

## Methods

### `loadData(folderManifest)`
Loads hierarchical data structure.

**Parameters:**
- `folderManifest` (Object): Folder/file structure

**Data Structure:**
```javascript
{
  folders: {
    "FolderName": {
      folders: { /* nested folders */ },
      files: ["file1.riv", "file2.riv"]
    }
  },
  files: ["root-file.riv"]
}
```

**Example:**
```javascript
dropdown.loadData({
  folders: {
    "Characters": {
      files: ["hero.riv", "villain.riv"]
    },
    "UI": {
      folders: {
        "Buttons": {
          files: ["primary.riv", "secondary.riv"]
        }
      },
      files: ["loader.riv"]
    }
  },
  files: ["intro.riv"]
});
```

### `setMetadata(metadata)`
Sets metadata for files.

**Parameters:**
- `metadata` (Object): File metadata map

**Example:**
```javascript
dropdown.setMetadata({
  "hero.riv": {
    description: "Main character animation",
    author: "John Doe",
    version: "1.0.0"
  }
});
```

### `getValue()`
Returns the currently selected file path.

**Returns:** string

```javascript
const selectedPath = dropdown.getValue();
// Returns: "Characters/hero.riv"
```

### `setValue(value)`
Sets the selected value programmatically.

**Parameters:**
- `value` (string): File path to select

```javascript
dropdown.setValue("UI/Buttons/primary.riv");
```

### `getMetadata()`
Returns metadata for the selected file.

**Returns:** Object or null

```javascript
const meta = dropdown.getMetadata();
// Returns: { description: "...", author: "..." }
```

### `reset()`
Resets the dropdown to initial state.

```javascript
dropdown.reset();
```

### `disable()`
Disables the dropdown.

```javascript
dropdown.disable();
```

### `enable()`
Enables the dropdown.

```javascript
dropdown.enable();
```

### `expandAll()`
Expands all folders in the tree.

```javascript
dropdown.expandAll();
```

### `collapseAll()`
Collapses all folders in the tree.

```javascript
dropdown.collapseAll();
```

### `setWidth(width)`
Sets the dropdown width.

**Parameters:**
- `width` (string): CSS width value

```javascript
dropdown.setWidth('400px');
```

### `setOptions(options)`
Sets simple options array (converts to flat file structure).

**Parameters:**
- `options` (Array): Array of strings or objects

```javascript
// Simple strings
dropdown.setOptions(['Option 1', 'Option 2', 'Option 3']);

// Objects with metadata
dropdown.setOptions([
  { value: 'opt1', label: 'Option 1', description: 'First option' },
  { value: 'opt2', label: 'Option 2', description: 'Second option' }
]);
```

### `setSearch(enabled)`
Control search bar visibility.

**Parameters:**
- `enabled` (boolean): Whether to show search bar

```javascript
dropdown.setSearch(false); // Hide search bar
```

### `setIcons(enabled)`
Control icon visibility.

**Parameters:**
- `enabled` (boolean): Whether to show icons

```javascript
dropdown.setIcons(false); // Hide all icons
```

## Events

### `dropdown-change`
Fired when selection changes.

**Event Detail:**
```javascript
{
  value: string,        // File path
  displayName: string,  // File name without extension
  metadata: Object      // File metadata if available
}
```

**Example:**
```javascript
dropdown.addEventListener('dropdown-change', (e) => {
  console.log('Selected:', e.detail.value);
  console.log('Metadata:', e.detail.metadata);
});
```

## Features

### Search Functionality
- Real-time search through all files
- Searches file names (case-insensitive)
- Flattens tree view when searching
- Can be disabled with `search="false"` attribute

### Folder Navigation
- Click to expand/collapse folders
- Visual indicators for open/closed state
- File count badges on folders
- Icons can be hidden with `icons="false"` attribute

### Long Filename Support
- Marquee scrolling for long filenames
- Starts 2 seconds after selection
- Smooth continuous scroll

### Metadata Display
- Info icon for files with metadata
- Tooltip on hover
- Passed in selection event

### Auto-close Behavior
- Only one dropdown can be open at a time
- Opening a dropdown automatically closes others on the page
- Prevents UI clutter with multiple open dropdowns

## CSS Classes

- `nested-dropdown-container` - Main container
- `nested-dropdown-button` - Trigger button
- `nested-dropdown-panel` - Dropdown panel
- `dropdown-tree` - Tree container
- `tree-folder` - Folder element
- `tree-file` - File element
- `selected` - Selected item
- `marquee` - Long text scrolling

## Examples

### Basic Usage
```html
<terminal-dropdown
  id="animationPicker"
  placeholder="Choose animation..."
  width="350px">
</terminal-dropdown>

<script>
  const dropdown = document.getElementById('animationPicker');
  
  // Load data
  dropdown.loadData({
    folders: {
      "Animations": {
        files: ["walk.riv", "run.riv", "jump.riv"]
      }
    }
  });
  
  // Handle selection
  dropdown.addEventListener('dropdown-change', (e) => {
    console.log('Selected:', e.detail.value);
  });
</script>
```

### With Metadata
```html
<terminal-dropdown id="filePicker"></terminal-dropdown>

<script>
  const picker = document.getElementById('filePicker');
  
  picker.loadData({
    folders: {
      "Projects": {
        files: ["project1.riv", "project2.riv"]
      }
    }
  });
  
  picker.setMetadata({
    "project1.riv": {
      description: "Landing page animation",
      size: "245 KB",
      modified: "2024-01-15"
    },
    "project2.riv": {
      description: "Dashboard loader",
      size: "89 KB",
      modified: "2024-01-20"
    }
  });
</script>
```

### Complex Hierarchy
```html
<terminal-dropdown id="complexDropdown"></terminal-dropdown>

<script>
  const dropdown = document.getElementById('complexDropdown');
  
  dropdown.loadData({
    folders: {
      "Characters": {
        folders: {
          "Heroes": {
            files: ["warrior.riv", "mage.riv", "ranger.riv"]
          },
          "Enemies": {
            folders: {
              "Bosses": {
                files: ["dragon.riv", "demon.riv"]
              },
              "Minions": {
                files: ["goblin.riv", "skeleton.riv"]
              }
            }
          }
        },
        files: ["npc.riv"]
      },
      "Environment": {
        files: ["tree.riv", "rock.riv", "water.riv"]
      },
      "UI": {
        folders: {
          "Buttons": {
            files: ["btn_primary.riv", "btn_secondary.riv"]
          },
          "Icons": {
            files: ["icon_health.riv", "icon_mana.riv"]
          }
        },
        files: ["cursor.riv", "loading.riv"]
      }
    },
    files: ["intro.riv", "outro.riv"]
  });
</script>
```

### Programmatic Control
```html
<terminal-dropdown id="controlled"></terminal-dropdown>
<terminal-button id="randomBtn">Random Selection</terminal-button>
<terminal-button id="resetBtn">Reset</terminal-button>

<script>
  const dropdown = document.getElementById('controlled');
  const randomBtn = document.getElementById('randomBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  const files = [
    "folder1/file1.riv",
    "folder1/file2.riv",
    "folder2/file3.riv"
  ];
  
  dropdown.loadData({
    folders: {
      "folder1": { files: ["file1.riv", "file2.riv"] },
      "folder2": { files: ["file3.riv"] }
    }
  });
  
  randomBtn.addEventListener('button-click', () => {
    const randomFile = files[Math.floor(Math.random() * files.length)];
    dropdown.setValue(randomFile);
  });
  
  resetBtn.addEventListener('button-click', () => {
    dropdown.reset();
  });
</script>
```

### Dynamic Updates
```html
<terminal-dropdown id="dynamicDropdown"></terminal-dropdown>
<terminal-button id="addFolder">Add Folder</terminal-button>

<script>
  const dropdown = document.getElementById('dynamicDropdown');
  const addBtn = document.getElementById('addFolder');

  let data = {
    folders: {
      "Initial": { files: ["file1.riv"] }
    }
  };

  dropdown.loadData(data);

  let folderCount = 1;
  addBtn.addEventListener('button-click', () => {
    folderCount++;
    data.folders[`Folder${folderCount}`] = {
      files: [`file${folderCount}.riv`]
    };
    dropdown.loadData(data);
  });
</script>
```

### Dropdown Variants
```html
<!-- Without search bar -->
<terminal-dropdown
  placeholder="Select option..."
  search="false">
</terminal-dropdown>

<!-- Without icons -->
<terminal-dropdown
  placeholder="Select option..."
  icons="false">
</terminal-dropdown>

<!-- Disabled dropdown -->
<terminal-dropdown
  placeholder="Disabled dropdown"
  disabled>
</terminal-dropdown>

<!-- Wide dropdown -->
<terminal-dropdown
  placeholder="Wide dropdown..."
  width="600px">
</terminal-dropdown>

<!-- Narrow dropdown -->
<terminal-dropdown
  placeholder="Select..."
  width="200px">
</terminal-dropdown>
```

### Flat List (No Folders)
```html
<terminal-dropdown id="flatDropdown"></terminal-dropdown>

<script>
  const dropdown = document.getElementById('flatDropdown');

  // Simple flat list of options
  dropdown.setOptions([
    'Option 1',
    'Option 2',
    'Option 3',
    'Very Long Option Name That Will Show Marquee Effect'
  ]);

  // Or with metadata
  dropdown.setOptions([
    { value: 'opt1', label: 'Option 1', description: 'First choice' },
    { value: 'opt2', label: 'Option 2', description: 'Second choice' },
    { value: 'opt3', label: 'Option 3', description: 'Third choice' }
  ]);
</script>
```

## Styling Variables

```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-gray-dark: #242424;
--terminal-black: #0a0a0a;
--font-mono: 'SF Mono', 'Monaco', monospace;
```

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Clear visual indicators

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+