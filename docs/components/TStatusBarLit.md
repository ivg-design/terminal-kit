# TStatusBarLit (t-sta)

A **LitElement-based** status bar component for terminal-style user interfaces. Provides dynamic field management, flexible display modes, alignment zones, hover interactions, and automatic width validation with full Shadow DOM encapsulation.

## Tag Names

- `t-sta`

## Architecture

**Tag Name:** `<t-sta>`
**Extends:** `LitElement`
**Category:** Display
**Profile:** CONTAINER
**Version:** 1.0.0

## Properties

All properties are reactive Lit properties:

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `fields` | `Array<FieldConfig>` | `[]` | ❌ | Array of field configuration objects |

### FieldConfig Object Structure

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

## Methods

### `setFields(fields)`
Sets all fields at once, replacing any existing fields.

**Parameters:**
- `fields` (Array): Array of field configuration objects

**Returns:** `void`

**Throws:** `Error` if fields is not an array

**Example:**
```javascript
statusBar.setFields([
  { label: 'CPU', value: '42%', width: '20%' },
  { label: 'RAM', value: '1.2GB', width: '30%' },
  { label: 'Status', value: 'Running', width: '20%' }
]);
```

### `updateField(index, field)`
Updates specific properties of a field without replacing it entirely.

**Parameters:**
- `index` (number): Zero-based index of the field
- `field` (Object): Partial field object with properties to update

**Returns:** `void`

**Throws:** `Error` if index is out of bounds

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

**Returns:** `void`

**Example:**
```javascript
statusBar.updateFieldValue(1, '2.4GB');
```

### `receiveContext(context)`
Used internally for nested component communication. Called automatically by parent containers.

**Parameters:**
- `context` (Object): Context object from parent

**Returns:** `void`

**Throws:** `Error` if maximum nesting depth (10) is exceeded

## Events

### `field-click`
Fired when a field is clicked.

**Event Type:** `CustomEvent<{field: FieldConfig, index: number}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes (crosses shadow DOM boundary)

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

**Event Type:** `CustomEvent<{field: FieldConfig, index: number}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes

**Event Detail:** Same as `field-click`

**Example:**
```javascript
statusBar.addEventListener('field-hover', (e) => {
  console.log('Hovering:', e.detail.field.label);
});
```

### `field-hover-end`
Fired when mouse leaves a field with hover enabled.

**Event Type:** `CustomEvent<{field: FieldConfig, index: number}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes

**Event Detail:** Same as `field-click`

## Usage Patterns & Examples

### Basic Setup

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

### Display Modes

The `displayMode` property controls what elements are shown:

#### `text` (Default)
Shows label and value with standard spacing:
```javascript
{ label: 'CPU', value: '42%', displayMode: 'text' }
// Renders: CPU: 42%
```

#### `icon`
Shows icon and value only:
```javascript
{ label: 'CPU', value: '42%', icon: gaugeIcon, displayMode: 'icon' }
// Renders: [📊] 42%
```

#### `icon-text`
Shows icon, label, and value:
```javascript
{ label: 'CPU', value: '42%', icon: gaugeIcon, displayMode: 'icon-text' }
// Renders: [📊] CPU: 42%
```

#### `value`
Shows only the value:
```javascript
{ label: 'CPU', value: '42%', displayMode: 'value' }
// Renders: 42%
```

**Note:** The value is ALWAYS displayed regardless of display mode.

### Programmatic Usage (Recommended)

Primary way to use TStatusBarLit - no additional components needed:

```javascript
const statusBar = document.querySelector('t-sta');

// Set fields dynamically
statusBar.setFields([
  {
    label: 'CPU',
    value: '42%',
    width: '25%',
    icon: cpuIcon,
    displayMode: 'icon-text'
  },
  {
    label: 'Memory',
    value: '1.2GB',
    width: '30%',
    align: 'center'
  },
  {
    label: 'Network',
    value: 'Connected',
    width: '45%',
    align: 'right'
  }
]);

// Update values dynamically
setInterval(() => {
  statusBar.updateFieldValue(0, Math.random() * 100 + '%');
}, 1000);
```

### Declarative Mode with Nested Components

For static layouts or when composition is needed:

```html
<t-sta>
  <t-sta-field label="CPU" value="42%" width="25%"></t-sta-field>
  <t-sta-field label="Memory" value="1.2GB" width="30%"></t-sta-field>
  <t-sta-field label="Network" value="Connected" width="45%"></t-sta-field>
</t-sta>
```

**Note:** When using nested components, the status bar discovers and registers them automatically.

### Interactive Fields with Callbacks

```javascript
statusBar.setFields([
  {
    label: 'CPU',
    value: '42%',
    hover: true,
    onHover: (field, index, bar) => {
      console.log(`Hovering field ${index}: ${field.label}`);
      // Could update a tooltip, highlight related content, etc.
    },
    onHoverEnd: (field, index, bar) => {
      console.log(`Left field ${index}`);
    }
  }
]);
```

### Dynamic Field Management

```javascript
// Update specific field value
statusBar.updateFieldValue(0, '55%');

// Update multiple field properties
statusBar.updateField(1, {
  value: '2.4GB',
  hover: false,
  displayMode: 'icon'
});

// To add a field, get current fields, add new one, and set all
const currentFields = statusBar.fields;
statusBar.setFields([
  ...currentFields,
  {
    label: 'Network',
    value: '1.2 MB/s',
    width: '20%',
    icon: networkIcon,
    marquee: true
  }
]);

// To remove a field, filter out by index and set all
statusBar.setFields(statusBar.fields.filter((_, i) => i !== 2));

// To clear all fields
statusBar.setFields([]);
```

## CSS Customization

### CSS Variables
Components use CSS variables for theming:

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

### Layout Variables

| Property | Default | Description |
|----------|---------|-------------|
| `--t-sta-height` | `32px` | Status bar height |
| `--t-sta-padding` | `0 12px` | Horizontal padding |
| `--t-sta-gap` | `16px` | Gap between fields |

### Color Variables

| Property | Default | Description |
|----------|---------|-------------|
| `--t-sta-bg` | `rgba(0, 0, 0, 0.9)` | Background color |
| `--t-sta-border` | `#00ff41` | Border color |
| `--t-sta-text` | `#00ff41` | Text color |
| `--t-sta-hover-bg` | `rgba(0, 255, 65, 0.1)` | Hover background |

### Typography Variables

| Property | Default | Description |
|----------|---------|-------------|
| `--t-sta-font` | `'IBM Plex Mono', monospace` | Font family |
| `--t-sta-font-size` | `12px` | Font size |

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

## Advanced Features

### Alignment System

Fields can be aligned to create visual zones:

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

### Width Management

#### Automatic Width Validation
Total field width is automatically scaled if it exceeds 95% to prevent overflow:

```javascript
// These total 120% but will be scaled to ~95%
statusBar.setFields([
  { label: 'A', value: '1', width: '40%' },  // Becomes ~31.6%
  { label: 'B', value: '2', width: '40%' },  // Becomes ~31.6%
  { label: 'C', value: '3', width: '40%' }   // Becomes ~31.6%
]);
```

#### Width Types
- **Auto:** `width: 'auto'` - Size to content
- **Percentage:** `width: '25%'` - Percentage of container
- **Pixels:** `width: '150px'` - Fixed pixel width

### Marquee Animation

Enable text scrolling for long values:

```javascript
statusBar.setFields([
  {
    label: 'Path',
    value: '/very/long/path/that/needs/to/scroll/across/the/field',
    width: '200px',
    marquee: true
  }
]);
```

**Note:** Marquee only activates when text overflows the field width.

### Hover Behavior Control

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
  statusBar.setFields([
    ...statusBar.fields,
    {
      label: 'Network',
      value: '0 KB/s',
      width: '20%',
      icon: networkIcon,
      marquee: true
    }
  ]);
});

// Clear all fields
document.getElementById('clearStatus').addEventListener('click', () => {
  statusBar.setFields([]);
});
```

## TypeScript Definitions

```typescript
interface FieldConfig {
  label?: string;           // Field label text
  value: string;            // Field value (required)
  width?: string;           // 'auto' | '25%' | '150px'
  icon?: string;            // SVG string for icon
  displayMode?: DisplayMode; // Display mode for field
  align?: 'left' | 'center' | 'right';
  hover?: boolean;          // Enable hover effects (default: true)
  marquee?: boolean;        // Enable text scrolling
  onHover?: (field: FieldConfig, index: number, statusBar: TStatusBarLit) => void;
  onHoverEnd?: (field: FieldConfig, index: number, statusBar: TStatusBarLit) => void;
}

type DisplayMode =
  | 'text'           // Label and value only
  | 'icon'           // Icon and value only
  | 'icon-text'      // Icon, label, and value
  | 'value';         // Only show value

interface TStatusBarLit extends LitElement {
  fields: FieldConfig[];

  setFields(fields: FieldConfig[]): void;
  updateField(index: number, field: Partial<FieldConfig>): void;
  updateFieldValue(index: number, value: string): void;
  receiveContext(context: Object): void;
}

interface StatusBarEvents {
  'field-click': CustomEvent<{field: FieldConfig, index: number}>;
  'field-hover': CustomEvent<{field: FieldConfig, index: number}>;
  'field-hover-end': CustomEvent<{field: FieldConfig, index: number}>;
}
```

## Browser Support

- Chrome 90+ (native Lit support)
- Firefox 88+ (native Lit support)
- Safari 14+ (native Lit support)
- Edge 90+ (native Lit support)
- Older browsers: Use Lit polyfills
- Requires ES modules support

## Performance Considerations

1. **Efficient Updates** - Use `updateFieldValue()` for value-only updates
2. **Width Validation** - Performed only on field structure changes
3. **Event Delegation** - Single listener for all field interactions
4. **Marquee Optimization** - Animation only active when needed
5. **LitElement Efficiency** - Only changed fields trigger re-renders
6. **GPU Acceleration** - Marquee animations use CSS transforms
7. **Memory Management** - Event listeners properly cleaned up on disconnect
8. **Practical Limits** - No hard limit on fields (~10-15 recommended for usability)

## Accessibility

The component includes:
- Semantic HTML structure
- Keyboard event support (when hover enabled)
- ARIA attributes can be added to the host element
- Focus states managed appropriately

```html
<t-sta
  role="status"
  aria-live="polite"
  aria-label="Application status"
></t-sta>
```

## Migration from Legacy TStatusBar

If migrating from the old TStatusBar component:

### Before (Legacy)
```javascript
// Old (TComponent-based)
const oldBar = new TStatusBar();
```

### After (LitElement-based)
```javascript
// New (LitElement-based)
const newBar = document.createElement('t-sta');
```

### Key Changes
1. Now extends LitElement instead of TComponent
2. Uses Shadow DOM with complete encapsulation
3. Better memory management and performance
4. More display modes available
5. Enhanced hover callbacks support
6. Improved event system with bubbling/composed events
7. Reactive properties with automatic re-rendering
8. CSS variable theming system
9. Container profile capabilities for nested components

## Slots

| Slot | Description |
| --- | --- |
| default | `t-sta-field` elements |


## Related Components

- [TStatusFieldLit](./TStatusFieldLit.md) - Individual field component for composition
- [TPanelLit](./TPanelLit.md) - Container that can host status fields