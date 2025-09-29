# TStatusBarLit Component API Documentation

## Component Overview

`TStatusBarLit` is a LitElement-based status bar component for terminal-style user interfaces. It provides dynamic field management, flexible display modes, alignment zones, hover interactions, and automatic width validation.

**Custom Element Tag:** `<t-sta>`
**Category:** Display
**Profile:** CONTAINER
**Version:** 1.0.0
**Extends:** LitElement

## Quick Start

```html
<t-sta id="myStatusBar"></t-sta>

<script type="module">
  import { gaugeIcon, packageIcon } from '../js/utils/phosphor-icons.js';

  const statusBar = document.getElementById('myStatusBar');
  statusBar.setFields([
    {
      label: 'CPU',
      value: '42%',
      width: '25%',
      icon: gaugeIcon,
      displayMode: 'icon-text',
      hover: true,
      onHover: (field) => console.log('Hovering:', field.label)
    }
  ]);
</script>
```

## Field Configuration Properties

Each field object can have the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `''` | Field label text |
| `value` | `string` | `''` | Field value (always displayed) |
| `width` | `string` | `'auto'` | Field width: `'auto'`, percentage (`'25%'`), or pixels (`'150px'`) |
| `icon` | `string` | `null` | SVG string for the icon |
| `displayMode` | `string` | `'text'` | Display mode (see Display Modes section) |
| `align` | `string` | `'left'` | Alignment: `'left'`, `'center'`, or `'right'` |
| `hover` | `boolean` | `true` | Enable/disable hover effects and interactions |
| `marquee` | `boolean` | `false` | Enable text scrolling for long values |
| `onHover` | `function` | `null` | Callback when mouse enters field |
| `onHoverEnd` | `function` | `null` | Callback when mouse leaves field |

## Display Modes

The `displayMode` property controls what elements are shown:

| Mode | Shows | Description |
|------|-------|-------------|
| `'text'` | Label + Value | Shows label and value, no icon |
| `'icon'` | Icon + Value | Shows icon and value, no label |
| `'icon-text'` | Icon + Label + Value | Shows all elements |
| `'value'` | Value Only | Shows only the value |

**Note:** The value is ALWAYS displayed regardless of display mode.

## Public Methods

### `setFields(fields)`
Sets all fields at once, replacing any existing fields.

**Parameters:**
- `fields` (Array): Array of field configuration objects

**Returns:** void

**Example:**
```javascript
statusBar.setFields([
  { label: 'CPU', value: '42%', width: '20%' },
  { label: 'RAM', value: '1.2GB', width: '30%' },
  { label: 'Status', value: 'Running', width: '20%' }
]);
```

### `addField(field)`
Adds a new field to the end of the status bar.

**Parameters:**
- `field` (Object): Field configuration object

**Returns:** void

**Example:**
```javascript
statusBar.addField({
  label: 'Network',
  value: '1.2 MB/s',
  width: '25%',
  icon: networkIcon
});
```

### `removeField(index)`
Removes a field at the specified index.

**Parameters:**
- `index` (number): Zero-based index of the field to remove

**Returns:** void

**Example:**
```javascript
statusBar.removeField(2); // Removes the third field
```

### `updateField(index, updates)`
Updates specific properties of a field without replacing it entirely.

**Parameters:**
- `index` (number): Zero-based index of the field
- `updates` (Object): Partial field object with properties to update

**Returns:** void

**Example:**
```javascript
statusBar.updateField(0, {
  value: '55%',
  hover: false,
  displayMode: 'icon'
});
```

### `updateFieldValue(index, value)`
Convenience method to update only a field's value.

**Parameters:**
- `index` (number): Zero-based index of the field
- `value` (string): New value for the field

**Returns:** void

**Example:**
```javascript
statusBar.updateFieldValue(1, '2.4GB');
```

### `clearFields()`
Removes all fields from the status bar.

**Returns:** void

**Example:**
```javascript
statusBar.clearFields();
```

### `receiveContext(context)`
Used internally for nested component communication. Called automatically by parent containers.

**Parameters:**
- `context` (Object): Context object from parent

**Returns:** void

## Callback Functions

### `onHover(field, index, statusBar)`
Called when mouse enters a field (if hover is enabled).

**Parameters:**
- `field` (Object): The field configuration object
- `index` (number): Field index
- `statusBar` (TStatusBarLit): Reference to the status bar instance

**Example:**
```javascript
{
  label: 'CPU',
  value: '42%',
  hover: true,
  onHover: (field, index, bar) => {
    console.log(`Hovering field ${index}: ${field.label}`);
    // Could update a tooltip, highlight related content, etc.
  }
}
```

### `onHoverEnd(field, index, statusBar)`
Called when mouse leaves a field (if hover is enabled).

**Parameters:** Same as `onHover`

**Example:**
```javascript
{
  label: 'CPU',
  value: '42%',
  hover: true,
  onHoverEnd: (field, index, bar) => {
    console.log(`Left field ${index}`);
  }
}
```

## Custom Events

The component dispatches the following custom events:

### `field-click`
Fired when a field is clicked.

**Event Detail:**
```javascript
{
  field: Object,  // The field configuration
  index: number   // Field index
}
```

**Example:**
```javascript
statusBar.addEventListener('field-click', (e) => {
  console.log('Clicked:', e.detail.field.label);
  console.log('Index:', e.detail.index);
});
```

### `field-hover`
Fired when mouse enters a field with hover enabled.

**Event Detail:** Same as `field-click`

**Example:**
```javascript
statusBar.addEventListener('field-hover', (e) => {
  console.log('Hovering:', e.detail.field.label);
});
```

### `field-hover-end`
Fired when mouse leaves a field with hover enabled.

**Event Detail:** Same as `field-click`

## Reactive Properties

### `fields`
**Type:** Array
**Default:** `[]`
**Reactive:** Yes

The array of field configurations. Changes trigger re-render.

```javascript
// Direct property access (triggers re-render)
statusBar.fields = [
  { label: 'New', value: 'Field' }
];

// Get current fields
const currentFields = statusBar.fields;
```

## Alignment System

Fields can be aligned to three zones:

### Left Alignment (default)
Fields align to the left edge, displayed in order.

### Center Alignment
Fields with `align: 'center'` create a center zone that pushes between left and right zones.

### Right Alignment
Fields with `align: 'right'` push to the right edge.

**Example:**
```javascript
statusBar.setFields([
  // Left zone
  { label: 'File', value: 'main.js', align: 'left' },
  { label: 'Line', value: '42', align: 'left' },

  // Center zone
  { label: 'Mode', value: 'INSERT', align: 'center' },

  // Right zone
  { label: 'Branch', value: 'main', align: 'right' },
  { label: 'Time', value: '14:30', align: 'right' }
]);
```

## Width Management

### Automatic Width Validation
Total field width is automatically scaled if it exceeds 95% to prevent overflow:

```javascript
// These total 120% but will be scaled to ~95%
statusBar.setFields([
  { label: 'A', value: '1', width: '40%' },  // Becomes ~31.6%
  { label: 'B', value: '2', width: '40%' },  // Becomes ~31.6%
  { label: 'C', value: '3', width: '40%' }   // Becomes ~31.6%
]);
```

### Width Types
- **Auto:** `width: 'auto'` - Size to content
- **Percentage:** `width: '25%'` - Percentage of container
- **Pixels:** `width: '150px'` - Fixed pixel width

## Hover Behavior

When `hover: false`:
- No pointer cursor
- No hover visual effects
- No text selection (`pointer-events: none`)
- No hover callbacks triggered
- No hover events dispatched

When `hover: true` (default):
- Pointer cursor on hover
- Background highlight effect
- Text color changes
- Hover callbacks execute
- Events are dispatched

## Marquee Scrolling

Enable automatic text scrolling for long content:

```javascript
{
  label: 'File',
  value: 'very_long_filename_that_needs_to_scroll.txt',
  width: '35%',
  marquee: true  // Enables scrolling animation
}
```

**Note:** Marquee only activates when text overflows the field width.

## Styling

### CSS Variables
```css
t-sta {
  --terminal-black-light: #1a1a1a;     /* Background */
  --terminal-green: #00ff41;            /* Text color */
  --terminal-green-dim: #00cc33;        /* Label color */
  --terminal-gray-light: #333333;       /* Border/separator */
  --font-mono: 'SF Mono', monospace;    /* Font family */
  --font-size-xs: 10px;                 /* Font size */
  --spacing-sm: 8px;                    /* Vertical padding */
  --spacing-md: 12px;                   /* Horizontal padding */
}
```

### Component Structure
The component uses Shadow DOM with this structure:
```
<t-sta>
  #shadow-root
    <div class="status-bar">
      <div class="status-field">
        <span class="field-icon">...</span>
        <span class="field-label">...</span>
        <div class="field-value-wrapper">
          <span class="field-value">...</span>
        </div>
      </div>
      <span class="status-separator">|</span>
      <!-- More fields... -->
    </div>
</t-sta>
```

## Complete Example

```javascript
// Import icons
import {
  gaugeIcon,
  packageIcon,
  playIcon,
  userCircleIcon
} from '../js/utils/phosphor-icons.js';

// Get status bar element
const statusBar = document.getElementById('myStatusBar');

// Configure fields
statusBar.setFields([
  {
    label: 'CPU',
    value: '42%',
    width: '20%',
    icon: gaugeIcon,
    displayMode: 'icon-text',
    hover: true,
    onHover: (field, index) => {
      updateTooltip(`CPU Usage: ${field.value}`);
    },
    onHoverEnd: () => {
      hideTooltip();
    }
  },
  {
    label: 'Memory',
    value: '1.2GB / 8GB',
    width: '30%',
    icon: packageIcon,
    displayMode: 'text',
    hover: true
  },
  {
    label: 'Status',
    value: 'Running',
    width: '20%',
    icon: playIcon,
    displayMode: 'icon',
    hover: false  // Non-interactive
  },
  {
    label: 'User',
    value: 'Admin',
    width: '30%',
    icon: userCircleIcon,
    displayMode: 'value',  // Only show value
    align: 'right',
    hover: true
  }
]);

// Listen for events
statusBar.addEventListener('field-click', (e) => {
  if (e.detail.field.label === 'User') {
    showUserMenu();
  }
});

statusBar.addEventListener('field-hover', (e) => {
  console.log('Hovering:', e.detail.field.label);
});

// Update values dynamically
setInterval(() => {
  fetch('/api/stats')
    .then(r => r.json())
    .then(stats => {
      statusBar.updateFieldValue(0, stats.cpu + '%');
      statusBar.updateFieldValue(1, `${stats.memUsed}GB / ${stats.memTotal}GB`);
    });
}, 1000);

// Add a new field dynamically
document.getElementById('addNetworkField').addEventListener('click', () => {
  statusBar.addField({
    label: 'Network',
    value: '0 KB/s',
    width: '20%',
    icon: networkIcon,
    marquee: true
  });
});

// Clear all fields
document.getElementById('clearStatus').addEventListener('click', () => {
  statusBar.clearFields();
});
```

## Performance Notes

- Component uses LitElement's efficient rendering
- Only changed fields trigger re-renders
- Marquee animations use CSS transforms (GPU accelerated)
- Width validation occurs once per `setFields()` call
- Event listeners are properly cleaned up on disconnect
- No limit on number of fields (practical limit ~10-15 for usability)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Requires ES modules support

## Accessibility

The component includes:
- Semantic HTML structure
- Keyboard event support (when hover enabled)
- ARIA attributes can be added to the host element

```html
<t-sta
  role="status"
  aria-live="polite"
  aria-label="Application status"
></t-sta>
```

## Migration from Legacy TStatusBar

If migrating from the old TStatusBar component:

```javascript
// Old (TComponent-based)
const oldBar = new TStatusBar();

// New (LitElement-based)
const newBar = document.createElement('t-sta');
```

Key differences:
- Now extends LitElement instead of TComponent
- Uses Shadow DOM
- Better memory management
- More display modes
- Hover callbacks support
- Improved event system