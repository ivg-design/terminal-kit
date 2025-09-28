# TDropdownLit Component API Documentation

**Component:** TDropdownLit
**Tag Name:** `<t-drp>`
**Category:** Form Controls
**Version:** 1.0.0
**Profile:** FORM (with validation support)

## Overview

TDropdownLit is a terminal-styled dropdown component featuring a hierarchical tree structure with folders and files, real-time search capabilities, metadata support, and comprehensive keyboard navigation. It supports both nested tree structures and simple flat lists.

## Installation & Import

```javascript
import { TDropdownLit } from './js/components/TDropdownLit.js';
// or
import './js/components/TDropdownLit.js'; // Auto-registers as <t-drp>
```

## Basic Usage

```html
<t-drp
  id="myDropdown"
  placeholder="Select file..."
  width="400px">
</t-drp>
```

## Properties

### Static Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `placeholder` | String | `'Select...'` | ✅ | Placeholder text displayed when no selection |
| `disabled` | Boolean | `false` | ✅ | Disables the dropdown when true |
| `value` | String | `''` | ❌ | Currently selected value (file path) |
| `width` | String | `'300px'` | ❌ | CSS width of the dropdown |
| `searchable` | Boolean | `true` | ✅ | Shows/hides the search input field |
| `showIcons` | Boolean | `true` | ✅ | Shows/hides folder and file icons |
| `compact` | Boolean | `false` | ✅ | Enables compact size variant |
| `data` | Object | `null` | ❌ | Tree structure data object |
| `metadata` | Object | `{}` | ❌ | Metadata for files |
| `options` | Array | `[]` | ❌ | Simple options array (alternative to data) |

### HTML Attributes

All reflected properties can be set as HTML attributes:

```html
<t-drp
  placeholder="Choose animation..."
  searchable="false"
  show-icons="false"
  compact="true"
  disabled>
</t-drp>
```

**Note:** For backward compatibility, `search="false"` and `icons="false"` are also supported.

## Public Methods

### Data Loading Methods

#### `loadData(data)`
Loads hierarchical tree structure data into the dropdown.

**Parameters:**
- `data` (Object): Tree structure with folders and files

**Returns:** void

**Example:**
```javascript
dropdown.loadData({
  folders: {
    'Characters': {
      folders: {
        'Heroes': {
          files: ['knight.riv', 'wizard.riv', 'archer.riv']
        },
        'Enemies': {
          files: ['goblin.riv', 'dragon.riv']
        }
      },
      files: ['npc_merchant.riv']
    },
    'Effects': {
      files: ['explosion.riv', 'sparkle.riv']
    }
  },
  files: ['intro.riv', 'credits.riv']
});
```

#### `setOptions(options)`
Sets simple options array for flat dropdown lists.

**Parameters:**
- `options` (Array<string|Object>): Array of options

**Returns:** void

**Examples:**
```javascript
// Simple strings
dropdown.setOptions(['Option 1', 'Option 2', 'Option 3']);

// Objects with labels
dropdown.setOptions([
  { value: 'opt1', label: 'First Option' },
  { value: 'opt2', label: 'Second Option' }
]);
```

#### `setMetadata(metadata)`
Sets metadata information for files (shows info icon with tooltips).

**Parameters:**
- `metadata` (Object): Map of file paths to metadata objects

**Returns:** void

**Example:**
```javascript
dropdown.setMetadata({
  'knight.riv': {
    description: 'Armored knight with sword animations',
    size: '245KB',
    author: 'John Doe'
  },
  'wizard.riv': {
    description: 'Magic user with spell animations',
    size: '189KB'
  }
});
```

### Value Management Methods

#### `setValue(value)`
Programmatically sets the selected value.

**Parameters:**
- `value` (String): File path to select

**Returns:** void

**Example:**
```javascript
dropdown.setValue('Characters/Heroes/knight.riv');
```

#### `getValue()`
Gets the currently selected value.

**Parameters:** none

**Returns:** String - The selected file path or empty string

**Example:**
```javascript
const selected = dropdown.getValue();
console.log(selected); // 'Characters/Heroes/knight.riv'
```

#### `reset()`
Resets the dropdown to initial state (clears selection, search, and collapses folders).

**Parameters:** none

**Returns:** void

**Example:**
```javascript
dropdown.reset();
```

### Dropdown Control Methods

#### `open()`
Opens the dropdown panel programmatically.

**Parameters:** none

**Returns:** void

**Fires:** `dropdown-open` event

**Example:**
```javascript
dropdown.open();
```

#### `close()`
Closes the dropdown panel programmatically.

**Parameters:** none

**Returns:** void

**Fires:** `dropdown-close` event

**Example:**
```javascript
dropdown.close();
```

#### `toggle()`
Toggles the dropdown open/closed state.

**Parameters:** none

**Returns:** void

**Example:**
```javascript
dropdown.toggle();
```

## Events

### `dropdown-change`
Fired when a selection is made.

**Event Detail:**
```javascript
{
  value: String,    // Selected file path
  option: {         // Option details
    value: String,    // File path
    metadata: Object  // Associated metadata (if any)
  }
}
```

**Example:**
```javascript
dropdown.addEventListener('dropdown-change', (e) => {
  console.log('Selected:', e.detail.value);
  console.log('Metadata:', e.detail.option.metadata);
});
```

### `dropdown-open`
Fired when the dropdown opens.

**Event Detail:** `{}` (empty object)

**Example:**
```javascript
dropdown.addEventListener('dropdown-open', () => {
  console.log('Dropdown opened');
});
```

### `dropdown-close`
Fired when the dropdown closes.

**Event Detail:** `{}` (empty object)

**Example:**
```javascript
dropdown.addEventListener('dropdown-close', () => {
  console.log('Dropdown closed');
});
```

## Internal State Properties

These properties are managed internally but can be accessed if needed:

| Property | Type | Description |
|----------|------|-------------|
| `_isOpen` | Boolean | Dropdown panel open state |
| `_searchTerm` | String | Current search query |
| `_folderStates` | Object | Map of folder paths to expanded state |
| `_selectedValue` | String | Internal selected value |

## Features

### Tree Structure
- **Nested Folders:** Unlimited nesting depth supported
- **Folder States:** Folders start collapsed by default
- **File Count:** Shows file count badge on each folder
- **Visual Indicators:** Different icons for folders (open/closed) and files

### Search Functionality
- **Real-time Search:** Filters as you type with 200ms debounce
- **Case-insensitive:** Searches are case-insensitive
- **Auto-expand:** Automatically expands folders containing matches
- **No Results:** Shows "No matching results found" message

### Icons
- **Folder Icons:** Closed/open folder icons with caret indicators
- **File Icons:** Document icon for files
- **Info Icons:** Shows for files with metadata
- **Customizable:** Can be hidden with `showIcons="false"`

### Sizing Variants

#### Standard Size (default)
```html
<t-drp placeholder="Standard size"></t-drp>
```
- Button height: 32px
- Font size: 13px
- Padding: 4px 12px

#### Compact Size
```html
<t-drp compact="true" placeholder="Compact size"></t-drp>
```
- Button height: 24px
- Font size: 11px
- Padding: 2px 8px
- Reduced spacing throughout

### Width Control
```html
<!-- Fixed width -->
<t-drp width="400px"></t-drp>

<!-- Percentage width -->
<t-drp width="100%"></t-drp>

<!-- Min/max constraints applied automatically -->
<t-drp width="50px"></t-drp>  <!-- Will use min-width: 200px -->
```

### Keyboard Support
- **Escape:** Closes dropdown when open
- **Enter:** Selects focused item
- **Tab:** Navigate through items
- **Click Outside:** Closes dropdown

### Auto-close Behavior
- Clicking outside closes the dropdown
- Opening one dropdown closes any other open dropdowns
- Prevents multiple dropdowns being open simultaneously

## CSS Custom Properties

The component uses CSS custom properties for theming:

```css
/* Core colors */
--dropdown-width: 300px;
--dropdown-bg: var(--terminal-gray-dark, #242424);
--dropdown-border: var(--terminal-gray-light, #333333);
--dropdown-text: var(--terminal-green, #00ff41);
--dropdown-text-dim: var(--terminal-green-dim, #00cc33);
--dropdown-bg-hover: var(--terminal-gray-medium, #2a2a2a);
--dropdown-shadow: rgba(0, 255, 65, 0.2);
--dropdown-panel-bg: var(--terminal-black, #0a0a0a);
--dropdown-search-bg: var(--terminal-gray-darkest, #1a1a1a);
--dropdown-scrollbar-bg: var(--terminal-gray-darkest, #1a1a1a);
```

## Complete Examples

### Example 1: Basic Tree Structure
```html
<t-drp id="fileSelector"></t-drp>

<script>
const dropdown = document.getElementById('fileSelector');

// Load hierarchical data
dropdown.loadData({
  folders: {
    'Documents': {
      folders: {
        'Reports': {
          files: ['q1-report.pdf', 'q2-report.pdf']
        }
      },
      files: ['readme.txt', 'notes.txt']
    },
    'Images': {
      files: ['logo.png', 'banner.jpg']
    }
  },
  files: ['index.html']
});

// Handle selection
dropdown.addEventListener('dropdown-change', (e) => {
  console.log('Selected file:', e.detail.value);
});
</script>
```

### Example 2: Simple Options List
```html
<t-drp
  id="simpleSelect"
  placeholder="Choose option..."
  searchable="false">
</t-drp>

<script>
const dropdown = document.getElementById('simpleSelect');

// Use simple options array
dropdown.setOptions([
  'Option A',
  'Option B',
  'Option C',
  'Very Long Option Name That Should Truncate'
]);

dropdown.addEventListener('dropdown-change', (e) => {
  console.log('Selected:', e.detail.value);
});
</script>
```

### Example 3: With Metadata and Icons
```html
<t-drp
  id="richDropdown"
  width="450px">
</t-drp>

<script>
const dropdown = document.getElementById('richDropdown');

// Load data structure
dropdown.loadData({
  folders: {
    'Components': {
      files: ['Button.js', 'Modal.js', 'Dropdown.js']
    },
    'Utils': {
      files: ['helpers.js', 'constants.js']
    }
  }
});

// Add metadata for tooltips
dropdown.setMetadata({
  'Button.js': {
    description: 'Terminal button component',
    size: '12KB',
    modified: '2024-01-15',
    author: 'Jane Doe'
  },
  'Modal.js': {
    description: 'Modal dialog component',
    size: '18KB',
    modified: '2024-01-20'
  }
});
</script>
```

### Example 4: Programmatic Control
```html
<t-drp id="controlled"></t-drp>
<button onclick="selectRandom()">Random Select</button>
<button onclick="resetDropdown()">Reset</button>
<button onclick="toggleDropdown()">Toggle</button>

<script>
const dropdown = document.getElementById('controlled');
const allFiles = [];

// Load complex structure
const data = {
  folders: {
    'Level1': {
      folders: {
        'Level2': {
          files: ['deep-file1.txt', 'deep-file2.txt']
        }
      },
      files: ['file1.txt', 'file2.txt']
    }
  },
  files: ['root.txt']
};

dropdown.loadData(data);

// Collect all file paths for random selection
function collectFiles(obj, path = '') {
  if (obj.files) {
    obj.files.forEach(file => {
      allFiles.push(path ? `${path}/${file}` : file);
    });
  }
  if (obj.folders) {
    Object.entries(obj.folders).forEach(([name, folder]) => {
      collectFiles(folder, path ? `${path}/${name}` : name);
    });
  }
}
collectFiles(data);

function selectRandom() {
  const randomFile = allFiles[Math.floor(Math.random() * allFiles.length)];
  dropdown.setValue(randomFile);
}

function resetDropdown() {
  dropdown.reset();
}

function toggleDropdown() {
  dropdown.toggle();
}
</script>
```

### Example 5: Compact Variant
```html
<t-drp
  compact="true"
  placeholder="Compact dropdown..."
  width="250px">
</t-drp>
```

### Example 6: Disabled States
```html
<!-- Disabled from start -->
<t-drp
  disabled
  placeholder="Disabled dropdown">
</t-drp>

<!-- Programmatically disable/enable -->
<t-drp id="toggleDisabled"></t-drp>
<script>
const dropdown = document.getElementById('toggleDisabled');

// Disable
dropdown.disabled = true;

// Enable
dropdown.disabled = false;
</script>
```

## Validation Support

The component includes validation support through the `getPropertyValidation` method:

```javascript
// Get validation rules for a property
const validation = TDropdownLit.getPropertyValidation('data');

// Validation structure returned:
{
  required: Boolean,
  validate: Function // Returns { valid: Boolean, errors: Array<String> }
}
```

### Validated Properties
- **data**: Must be an object with valid folders/files structure
- **width**: Must be a valid CSS unit (px, %, em, rem)

## Component Lifecycle

The component follows standard LitElement lifecycle with logging:

1. **constructor**: Initializes logger and properties
2. **connectedCallback**: Sets up event listeners, processes attributes
3. **firstUpdated**: Marks component as initialized
4. **updated**: Processes property changes
5. **disconnectedCallback**: Cleanup timers and listeners

## Browser Compatibility

- Chrome/Edge 79+
- Firefox 63+
- Safari 12.1+
- Opera 66+

Requires support for:
- Web Components
- ES6 Modules
- CSS Custom Properties
- LitElement 3.x

## Performance Considerations

- **Debounced Search**: 200ms debounce on search input
- **Virtual Scrolling**: Not implemented, may lag with 1000+ items
- **Memory Management**: Automatic cleanup of timers and listeners
- **Render Optimization**: Only visible tree nodes are rendered

## Migration from Legacy

If migrating from the old `<terminal-dropdown>` component:

1. Change tag name: `<terminal-dropdown>` → `<t-drp>`
2. Update property names:
   - `search` → `searchable`
   - `icons` → `showIcons`
3. Update event names:
   - `dropdown-change` event detail structure changed
4. Remove deprecated methods:
   - `disable()` → set `disabled = true`
   - `enable()` → set `disabled = false`
   - `getMetadata()` → access via event detail
   - `setWidth()` → set `width` property
   - `setSearch()` → set `searchable` property
   - `setIcons()` → set `showIcons` property
   - `expandAll()` → not available
   - `collapseAll()` → not available

## Component Logger

The component uses ComponentLogger for debugging. Enable verbose logging:

```javascript
// In browser console
TLog.setLevel('DEBUG'); // Show all debug messages
TLog.setLevel('INFO');  // Show info and above
TLog.setLevel('ERROR'); // Only errors

// Disable logging for this component
TLog.disable('t-drp');

// Re-enable
TLog.enable('t-drp');
```

## Known Issues & Limitations

1. **No multi-select**: Only single selection is supported
2. **No lazy loading**: All data must be loaded at once
3. **No drag & drop**: Items cannot be reordered
4. **No custom templates**: Cannot customize item rendering
5. **Search limitations**: Only searches file names, not metadata
6. **No keyboard navigation**: Arrow keys don't navigate tree (only Tab)

## Future Enhancements

- Virtual scrolling for large datasets
- Keyboard navigation with arrow keys
- Multi-select support
- Lazy loading of folder contents
- Custom item templates
- Accessibility improvements (ARIA)
- Right-to-left (RTL) support

---

**Component Version:** 1.0.0
**Documentation Updated:** 2024-09-28
**Author:** Terminal Kit Team
**License:** MIT