# TColorPickerLit (t-clr-pick)

A modern color selection component built with **iro.js** and **Lit**, featuring terminal aesthetics, transparency support, multiple color formats, and persistent custom swatches. Supports HEXA, RGBA, and HSLA color modes with systematic element control and flexible ordering.

## Architecture

**Tag Name:** `<t-clr-pick>`
**Extends:** `LitElement`
**Category:** Input
**Profile:** CORE
**Version:** 1.0.0

## Features

- **iro.js Integration**: Professional color picker with box + sliders layout
- **Multiple Color Formats**: Switch between HEXA, RGBA, and HSLA modes
- **Alpha/Opacity Support**: Full transparency control with dedicated slider
- **Custom Swatches**: Persistent storage with CMD/Ctrl+Click removal
- **Debounced Updates**: 250ms debounce for smooth performance during drag
- **Three Variants**: Large (48px), Standard (32px), and Compact (minimal)
- **Systematic Elements**: Universal element system - icon, label, swatch (mandatory), input (all optional except swatch)
- **Flexible Ordering**: Elements render in exact order specified via `elements` attribute
- **Custom Icons**: Set custom Phosphor icons via `setIcon()` method
- **Clear Button**: Optional trash button with confirmation modal for clearing custom swatches
- **Transparency Grid**: Visual checkerboard for transparent colors
- **Keyboard Support**: CMD/Ctrl key detection for swatch removal
- **LocalStorage**: Persistent swatch storage across sessions

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | string | `'#00ff41ff'` | Initial color value (hex8 format with alpha) |
| `label1` | string | `'Color'` | First line of label text (when `label` element included) |
| `label2` | string | `'Picker'` | Second line of label text (when `label` element included) |
| `disabled` | boolean | `false` | Disabled state (dims and disables interaction) |
| `variant` | string | `'large'` | Display variant: `'large'` (48px), `'standard'` (32px), or `'compact'` (minimal) |
| `elements` | string | `'icon,label,swatch,input'` | Comma-separated list of elements in render order. Available: `icon`, `label`, `swatch`, `input`. Swatch is mandatory. |
| `show-clear-button` | boolean | `false` | Show trash button in picker for clearing all custom swatches (with confirmation modal) |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | string | Current color value in hex8 format (e.g., `#00ff41ff`) |
| `customSwatches` | string[] | Array of custom swatch colors (max 20) |
| `colorPicker` | IroColorPicker | iro.js color picker instance |
| `disabled` | boolean | Disabled state |
| `variant` | string | Current variant: `'large'`, `'standard'`, or `'compact'` |
| `elements` | string | Current element configuration |
| `customIcon` | string | Custom icon SVG string |

## Methods

### `setIcon(iconSvg)`
Sets a custom Phosphor icon for the picker.

**Parameters:**
- `iconSvg` (string): SVG string of Phosphor icon

**Returns:** void

```javascript
import { paintBucketIcon } from '../js/utils/phosphor-icons.js';
const picker = document.querySelector('t-clr-pick');
picker.setIcon(paintBucketIcon);
```

### `clearAllCustomSwatches()`
Clears all custom swatches from storage and display. When called via trash button, shows confirmation modal first.

**Returns:** void

```javascript
const picker = document.querySelector('t-clr-pick');
picker.clearAllCustomSwatches();
```

### `addSwatch(hex)`
Adds a color to the custom swatches array.

**Parameters:**
- `hex` (string): Hex color value (with or without # prefix)

**Returns:** void

**Throws:** Error if hex format is invalid

**Fires:** `swatch-added`, `swatches-updated`

```javascript
picker.addSwatch('#ff6b35');
picker.addSwatch('00ff41ff'); // Without # prefix also works
```

### `getValue()`
Gets the current color value.

**Returns:** string (hex8 format)

```javascript
const color = picker.getValue();
```

### `setValue(color)`
Sets the color value programmatically.

**Parameters:**
- `color` (string): Color in hex format

**Returns:** void

```javascript
picker.setValue('#ff6b35ff');
```

### Enabling/Disabling
To enable or disable the picker, use the `disabled` property:

```javascript
// Disable
picker.disabled = true;

// Enable
picker.disabled = false;
```

## Events

### `change`
Fired when color value changes (debounced to 250ms).

**Event Detail:**
```javascript
{
  value: string,  // Hex8 color value (e.g., "#00ff41ff")
  color: string   // Same as value
}
```

**Example:**
```javascript
picker.addEventListener('change', (e) => {
  console.log('New color:', e.target.value);
  console.log('Detail:', e.detail.value);
});
```

### `color-save`
Fired when user clicks the save button in the picker popover.

**Event Detail:**
```javascript
{
  color: string,      // Hex8 color value
  timestamp: number   // Unix timestamp
}
```

**Example:**
```javascript
picker.addEventListener('color-save', (e) => {
  console.log('Saved color:', e.detail.color);
  console.log('Timestamp:', e.detail.timestamp);
});
```

### `swatches-updated`
Fired when custom swatches array is modified.

**Event Detail:**
```javascript
{
  swatches: string[]  // Array of hex color values
}
```

**Example:**
```javascript
picker.addEventListener('swatches-updated', (e) => {
  console.log('Swatches updated:', e.detail.swatches);
  console.log('Count:', e.detail.swatches.length);
});
```

### `swatches-cleared`
Fired when all custom swatches are cleared.

**Example:**
```javascript
picker.addEventListener('swatches-cleared', () => {
  console.log('All custom swatches cleared');
});
```

### `swatch-added`
Fired when a color is added to custom swatches via `addSwatch()` method.

**Event Detail:**
```javascript
{
  color: string,      // Hex color value with # prefix
  timestamp: number   // Unix timestamp
}
```

**Example:**
```javascript
picker.addEventListener('swatch-added', (e) => {
  console.log('Swatch added:', e.detail.color);
  console.log('At:', new Date(e.detail.timestamp));
});
```

## Variants

### Large Variant (48px height)
Full-size variant with all elements available.

```html
<t-clr
  variant="large"
  value="#00ff41ff"
  label1="Theme"
  label2="Color"
  elements="icon,label,swatch,input">
</t-clr-pick>
```

### Standard Variant (32px height)
Compact version with all elements available but smaller sizing.

```html
<t-clr
  variant="standard"
  value="#00aaff"
  label1="Accent"
  label2="Color"
  elements="icon,label,swatch,input">
</t-clr-pick>
```

### Compact Variant (Minimal)
Ultra-compact design for inline use. All elements available.

```html
<t-clr
  variant="compact"
  value="#ff00ff"
  elements="swatch,input">
</t-clr-pick>
```

## Element System

The component uses a systematic element system where you specify which elements to show and in what order.

### Available Elements

- **`icon`**: Palette icon (or custom icon via `setIcon()`)
- **`label`**: Two-line label (uses `label1` and `label2` attributes)
- **`swatch`**: Color swatch button (mandatory - launches picker)
- **`input`**: Hex color input field

### Element Ordering

Elements render in the **exact order** specified in the `elements` attribute. This allows complete control over layout.

```html
<!-- Default order -->
<t-clr-pick elements="icon,label,swatch,input"></t-clr-pick>

<!-- Swatch first -->
<t-clr-pick elements="swatch,icon,label,input"></t-clr-pick>

<!-- Input before swatch -->
<t-clr-pick elements="icon,label,input,swatch"></t-clr-pick>

<!-- Input in the middle -->
<t-clr-pick elements="icon,input,label,swatch"></t-clr-pick>
```

### Element Combinations

Any combination of elements is allowed (except swatch which is mandatory).

```html
<!-- Icon + Swatch only (no label, no input) -->
<t-clr-pick elements="icon,swatch"></t-clr-pick>

<!-- Label + Swatch only -->
<t-clr-pick elements="label,swatch" label1="Color" label2="Picker"></t-clr-pick>

<!-- Swatch + Input only -->
<t-clr-pick elements="swatch,input"></t-clr-pick>

<!-- Swatch only -->
<t-clr-pick elements="swatch"></t-clr-pick>

<!-- All elements -->
<t-clr-pick elements="icon,label,swatch,input"></t-clr-pick>
```

### Variant + Element Examples

All variants support all elements in any order.

```html
<!-- Large: Icon + Swatch only -->
<t-clr-pick variant="large" elements="icon,swatch"></t-clr-pick>

<!-- Standard: Label + Swatch only -->
<t-clr-pick variant="standard" elements="label,swatch" label1="Theme"></t-clr-pick>

<!-- Compact: Swatch + Input (reversed) -->
<t-clr-pick variant="compact" elements="input,swatch"></t-clr-pick>

<!-- Standard: Reordered with swatch first -->
<t-clr-pick variant="standard" elements="swatch,icon,label,input"></t-clr-pick>
```

## Custom Icons

Use Phosphor icons from the utils library or any SVG string.

```javascript
import { paintBucketIcon, paletteIcon } from '../js/utils/phosphor-icons.js';

const picker = document.querySelector('t-clr-pick');
picker.setIcon(paintBucketIcon);
```

Available icons in `phosphor-icons.js`:
- `paletteIcon` (default)
- `paintBucketIcon`
- `trashIcon`
- `floppyDiskIcon`
- `xIcon`

## Clear Button with Confirmation Modal

Add a trash button to the picker panel that clears all custom swatches with a confirmation modal.

```html
<t-clr
  value="#00ff41ff"
  label1="Custom"
  label2="Swatches"
  elements="icon,label,swatch,input"
  show-clear-button>
</t-clr-pick>
```

When clicked, the trash button shows a confirmation modal:
- **Title**: "Clear All Custom Swatches?" (red text)
- **Message**: Shows count of swatches and warning
- **Actions**: "Cancel" and "Clear All" (red error variant)
- **Behavior**: Modal can be closed by clicking Cancel, Clear All, or outside the modal

## Custom Swatches

### Features
- **Persistent Storage**: Swatches saved to localStorage with key `'terminal-iro-swatches'`
- **Maximum 20**: Limit of 20 custom swatches (oldest removed when exceeded)
- **Default Swatches**: 11 built-in terminal-themed colors always visible
- **Visual Management**: Hold CMD/Ctrl to show remove icons on custom swatches
- **Click to Remove**: CMD/Ctrl + Click to remove a swatch
- **Auto-save**: Click save button to add current color to swatches
- **No Duplicates**: Same color won't be added twice
- **Clear All**: Optional trash button with confirmation modal

### Default Swatches (11 colors)
```javascript
[
  '#00ff41ff',  // Terminal Green
  '#ff0041ff',  // Terminal Red
  '#0041ffff',  // Terminal Blue
  '#ffcc00ff',  // Terminal Yellow
  '#ff00ffff',  // Terminal Magenta
  '#00ffffff',  // Terminal Cyan
  '#ffffffff',  // White
  '#ccccccff',  // Light Gray
  '#666666ff',  // Medium Gray
  '#333333ff',  // Dark Gray
  '#000000ff'   // Black
]
```

### Managing Swatches Programmatically

```javascript
const picker = document.querySelector('t-clr-pick');

// Access custom swatches
console.log(picker.customSwatches);

// Add a custom swatch
picker.customSwatches.push('#ff6b35ff');
picker.saveCustomSwatches();
picker.updateSwatchesDisplay();

// Remove a specific swatch
const index = picker.customSwatches.indexOf('#ff6b35ff');
if (index > -1) {
  picker.customSwatches.splice(index, 1);
  picker.saveCustomSwatches();
  picker.updateSwatchesDisplay();
}

// Clear all custom swatches
picker.clearAllCustomSwatches();

// Reload swatches from storage
picker.loadCustomSwatches();
```

## iro.js Configuration

The component uses iro.js with these settings:

### Layout
```javascript
{
  width: 180,
  layoutDirection: 'horizontal',
  layout: [
    {
      component: iro.ui.Box,
      options: {
        boxHeight: 180
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'hue',
        sliderSize: 20
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'alpha',
        sliderSize: 20
      }
    }
  ]
}
```

### Picker Options
- **Box Size**: 180px × 180px color selection area
- **Horizontal Layout**: Box on left, sliders vertically on right
- **Hue Slider**: Full spectrum color selection (20px wide)
- **Alpha Slider**: Opacity/transparency control (20px wide)
- **Color Format**: Full RGBA with hex8 output

## Color Format Modes

The picker supports three display modes in the input field:

### HEXA Mode (Default)
```
#00ff41ff
```
8-digit hex with alpha channel

### RGBA Mode
```
rgba(0, 255, 65, 1)
```
Red, Green, Blue, Alpha values

### HSLA Mode
```
hsla(141, 100%, 50%, 1)
```
Hue, Saturation, Lightness, Alpha values

**Toggle Modes**: Click the mode selector buttons (HEXA / RGBA / HSLA) in the picker popover to cycle through formats.

## Complete Examples

### Basic Usage - All Elements

```html
<t-clr
  value="#00ff41ff"
  label1="Theme"
  label2="Color"
  elements="icon,label,swatch,input">
</t-clr-pick>
```

### Icon + Swatch Only

```html
<t-clr
  value="#00aaff"
  elements="icon,swatch">
</t-clr-pick>
```

### Label + Swatch Only

```html
<t-clr
  value="#ff00ff"
  label1="Accent"
  label2="Color"
  elements="label,swatch">
</t-clr-pick>
```

### Swatch + Input Only

```html
<t-clr
  value="#ffcc00"
  elements="swatch,input">
</t-clr-pick>
```

### Reordered Elements

```html
<!-- Swatch first -->
<t-clr
  value="#ff0041"
  label1="Error"
  label2="Color"
  elements="swatch,icon,label,input">
</t-clr-pick>

<!-- Input first -->
<t-clr
  value="#00ff41"
  elements="input,icon,label,swatch">
</t-clr-pick>
```

### Standard Variant with Custom Icon

```html
<t-clr
  id="customPicker"
  variant="standard"
  value="#ff0041"
  label1="Paint"
  label2="Bucket"
  elements="icon,label,swatch,input">
</t-clr-pick>

<script type="module">
  import { paintBucketIcon } from '../js/utils/phosphor-icons.js';
  const picker = document.getElementById('customPicker');
  picker.setIcon(paintBucketIcon);
</script>
```

### Compact Variant with Reversed Order

```html
<t-clr
  variant="compact"
  value="#00aaff"
  elements="input,swatch">
</t-clr-pick>
```

### With Clear Button

```html
<t-clr
  value="#ffcc00"
  label1="Custom"
  label2="Swatches"
  elements="icon,label,swatch,input"
  show-clear-button>
</t-clr-pick>
```

### Disabled State

```html
<t-clr
  value="#ff3333"
  label1="Error"
  label2="Color"
  elements="icon,label,swatch,input"
  disabled>
</t-clr-pick>
```

### Programmatic Control

```html
<t-clr-pick id="myPicker" value="#00ff41ff"></t-clr-pick>

<script>
  const picker = document.getElementById('myPicker');

  // Change color
  picker.value = '#ff6b35ff';

  // Change variant
  picker.variant = 'standard';

  // Change elements
  picker.elements = 'swatch,input';

  // Disable
  picker.disabled = true;

  // Listen for changes
  picker.addEventListener('change', (e) => {
    console.log('Color changed:', e.target.value);
  });
</script>
```

## Form Integration

```html
<form id="themeForm">
  <t-clr
    id="primaryColor"
    label1="Primary"
    label2="Color"
    value="#00ff41ff"
    elements="icon,label,swatch,input">
  </t-clr-pick>

  <button type="submit">Save Theme</button>
</form>

<script>
  const form = document.getElementById('themeForm');
  const picker = document.getElementById('primaryColor');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const color = picker.value;
    console.log('Saving color:', color);

    fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryColor: color })
    });
  });
</script>
```

## Performance

### Debouncing
Color updates are debounced to **250ms** (4 times per second) during slider drag operations to prevent excessive event firing and maintain smooth performance.

```javascript
onColorChange(color) {
  if (this._colorChangeDebounce) {
    clearTimeout(this._colorChangeDebounce);
  }

  this._colorChangeDebounce = setTimeout(() => {
    this.updateColor(hexValue);
    this._colorChangeDebounce = null;
  }, 250);

  // Input field updates immediately for visual feedback
  this.updateColorInput();
}
```

### Event Handling
- **Outside Click**: Mousedown event (not click/mouseup) to prevent closing during drag
- **Keyboard Events**: Global CMD/Ctrl detection for swatch removal UI
- **Cleanup**: Proper disposal of iro.js instance and event listeners

## Styling

### Component Structure
```
t-clr (shadow root)
├── .color-picker-wrapper
│   ├── [elements render in specified order]
│   │   ├── .color-picker-icon (if 'icon' in elements)
│   │   ├── .color-picker-label (if 'label' in elements)
│   │   │   ├── .color-picker-label-line1
│   │   │   └── .color-picker-label-line2
│   │   ├── .color-picker-swatch (if 'swatch' in elements, large/standard)
│   │   │   └── .color-picker-swatch-color
│   │   ├── .color-picker-swatch-compact (if 'swatch' in elements, compact)
│   │   │   └── .color-picker-swatch-color
│   │   ├── .colorIO (if 'input' in elements, large/standard)
│   │   │   └── .color-picker-hex
│   │   └── .color-picker-hex (if 'input' in elements, compact)
```

### CSS Classes
- `.color-picker-wrapper` - Main container
- `.large` - Large variant (48px height)
- `.standard` - Standard variant (32px height)
- `.compact` - Compact variant (minimal)
- `.disabled` - Disabled state
- `.has-transparency` - Shows transparency grid

### Variant Sizing
- **Large**: 48px height, 48px square swatches
- **Standard**: 32px height, 32px square swatches
- **Compact**: Auto height, 20px square swatches

## Dependencies

### Required
```javascript
// Lit
import { LitElement, html, css } from 'lit';

// iro.js
import iro from '@jaames/iro';
```

### Installation
```bash
npm install lit @jaames/iro
```

### Import
```javascript
import './js/components/TColorPickerLit.js';
```

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

**Requirements:**
- Web Components support
- ES6 modules
- Shadow DOM
- CSS custom properties

## Troubleshooting

### Picker not opening
- Check that iro.js is properly imported
- Verify component is registered: `customElements.get('t-clr-pick')`
- Check console for errors

### Swatches not persisting
- Verify localStorage is enabled
- Check for localStorage quota errors
- Key used: `'terminal-iro-swatches'`

### Colors not updating
- Changes are debounced to 250ms
- Check event listeners are properly attached
- Verify `value` property is valid hex8 format

### Elements not showing
- Check `elements` attribute is set correctly
- Verify spelling: `icon`, `label`, `swatch`, `input`
- Swatch is mandatory - component will fail without it

### Wrong element order
- Elements render in exact order specified
- Check `elements` attribute for correct comma-separated order
- No spaces allowed: `"icon,label,swatch"` not `"icon, label, swatch"`

## Notes

- Custom swatches persist via localStorage key `'terminal-iro-swatches'`
- Maximum 20 custom swatches (oldest removed when limit exceeded)
- Color updates debounced to 250ms for performance
- Input field updates immediately for visual feedback
- Transparency grid shown automatically for colors with alpha < 1.0
- CMD/Ctrl key detection works globally for swatch removal
- Component properly cleans up on disconnect (removes event listeners)
- Hex input validates and formats automatically
- Swatches grid: 5 columns, scrollable with styled scrollbar
- Confirmation modal shown when clearing swatches via trash button
- Elements render in exact order specified - no automatic filtering or reordering