# TerminalColorPicker

A color selection component that integrates with Pickr library, styled with terminal aesthetics. Supports multiple color formats, custom swatches with persistence, and Supabase integration.

## Tag Name
```html
<terminal-color-picker></terminal-color-picker>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | string | `'#00ff41'` | Initial color value (hex format) |
| `label1` | string | `'Color'` | First line of label text |
| `label2` | string | `'Picker'` | Second line of label text |
| `disabled` | boolean | `false` | Disabled state |
| `compact` | boolean | `false` | Compact mode (smaller size) |
| `variant` | string | `'default'` | Display variant: 'default' or 'minimal' |

## Methods

### `getValue()`
Returns the current color value in hex format.

**Returns:** string

```javascript
const color = picker.getValue();
// Returns: "#00ff41"
```

### `setValue(color)`
Sets the color value programmatically.

**Parameters:**
- `color` (string): Color value in hex format

```javascript
picker.setValue('#ff0041');
```

### `setLabels(label1, label2)`
Sets the label text for the picker.

**Parameters:**
- `label1` (string): First line of label
- `label2` (string): Second line of label

```javascript
picker.setLabels('Theme', 'Color');
```

### `setIcon(iconSvg)`
Sets a custom icon for the picker.

**Parameters:**
- `iconSvg` (string): SVG string for the icon

```javascript
picker.setIcon('<svg>...</svg>');
```

### `reset()`
Resets the color to default (#00ff41).

```javascript
picker.reset();
```

### `disable()`
Disables the color picker.

```javascript
picker.disable();
```

### `enable()`
Enables the color picker.

```javascript
picker.enable();
```

## Usage Examples

### Default Variant
```html
<terminal-color-picker
  value="#00ff41"
  label1="Theme"
  label2="Color">
</terminal-color-picker>
```

### Minimal Variant
The minimal variant displays only the color swatch and hex input field, with no borders or labels.
Perfect for inline color selection in forms or compact UIs.

```html
<terminal-color-picker
  variant="minimal"
  value="#00ff41">
</terminal-color-picker>
```

### Compact Mode
```html
<terminal-color-picker
  compact
  value="#ff0000">
</terminal-color-picker>
```

## Events

### `color-change`
Fired when color value changes.

**Event Detail:**
```javascript
{
  color: string  // Hex color value
}
```

**Example:**
```javascript
picker.addEventListener('color-change', (e) => {
  console.log('New color:', e.detail.color);
});
```

### `color-save`
Fired when color is saved through Pickr's save button.

**Event Detail:**
```javascript
{
  color: string,      // Hex color value
  rgb: string,        // RGB representation
  hsl: string,        // HSL representation
  timestamp: number   // Unix timestamp
}
```

**Example:**
```javascript
picker.addEventListener('color-save', (e) => {
  console.log('Saved color:', e.detail.color);
  console.log('RGB:', e.detail.rgb);
  console.log('HSL:', e.detail.hsl);
  console.log('Saved at:', new Date(e.detail.timestamp));
});
```

### `swatches-updated`
Fired when custom swatches are modified.

**Event Detail:**
```javascript
{
  swatches: string[]  // Array of hex color values
}
```

**Example:**
```javascript
picker.addEventListener('swatches-updated', (e) => {
  console.log('Custom swatches:', e.detail.swatches);
});
```

## Custom Swatches

The color picker includes advanced swatch management:

### Features
- **Persistent Storage**: Custom swatches are saved to localStorage
- **Swatch Limit**: Maximum of 20 custom swatches
- **Visual Management**: Hold Cmd/Ctrl and hover to see remove icon
- **Click to Remove**: Cmd/Ctrl + Click to remove a swatch
- **Automatic Addition**: Saved colors are automatically added to swatches
- **Duplicate Prevention**: Colors are not duplicated in the swatch list

### Default Swatches
The picker includes 11 default terminal-themed swatches:
- Terminal Green (#00ff41)
- Terminal Red (#ff0041)
- Terminal Blue (#0041ff)
- Terminal Yellow (#ffcc00)
- Terminal Magenta (#ff00ff)
- Terminal Cyan (#00ffff)
- White (#ffffff)
- Light Gray (#cccccc)
- Medium Gray (#666666)
- Dark Gray (#333333)
- Black (#000000)

### Managing Swatches
```javascript
// Access custom swatches array
console.log(picker.customSwatches);

// Manually update swatches display
picker.updateSwatchesDisplay();

// Load swatches from storage
picker.loadCustomSwatches();

// Save swatches to storage
picker.saveCustomSwatches();
```

## Supabase Integration

The component can integrate with Supabase for cloud storage of custom swatches:

```javascript
import { ColorSwatchesStorage } from './js/modules/storage/color-swatches-storage.js';

// Initialize Supabase storage
const colorStorage = new ColorSwatchesStorage(supabaseClient);
await colorStorage.init();

// Listen for color save events
picker.addEventListener('color-save', async (e) => {
  await colorStorage.addSwatch(e.detail.color);
});

// Listen for swatches updates
picker.addEventListener('swatches-updated', async (e) => {
  await colorStorage.saveSwatches(e.detail.swatches);
});

// Sync with auth changes
colorStorage.onAuthChange((swatches) => {
  picker.customSwatches = swatches;
  picker.updateSwatchesDisplay();
});
```

## Pickr Configuration

The component uses Pickr with these settings:

```javascript
{
  theme: 'classic',
  useAsButton: true,
  defaultRepresentation: 'HEX',
  position: 'bottom-middle',
  adjustableNumbers: true,
  container: 'body',
  
  swatches: [
    // 11 default swatches
  ],
  
  components: {
    preview: true,
    opacity: true,
    hue: true,
    
    interaction: {
      hex: true,
      rgba: true,
      hsla: true,
      hsva: true,
      cmyk: false,
      input: true,
      clear: true,
      save: true
    }
  }
}
```

## Dependencies

Requires Pickr library:
```html
<!-- Pickr CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css">

<!-- Pickr JS -->
<script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>

<!-- Component CSS (includes Pickr overrides) -->
<link rel="stylesheet" href="css/components/color-picker.css">
```

## CSS Classes

- `color-picker-wrapper` - Main container
- `color-picker-icon` - Icon container
- `color-picker-label` - Label container
- `color-picker-label-line1` - First line of label
- `color-picker-label-line2` - Second line of label
- `color-picker-swatch` - Color swatch display
- `color-picker-swatch-color` - Swatch color element
- `color-picker-hex` - Hex input field
- `compact` - Compact mode modifier
- `disabled` - Disabled state
- `error` - Error state (invalid hex)
- `updating` - Animation during color change

## Examples

### Basic Usage
```html
<terminal-color-picker 
  id="colorPicker"
  label1="Theme"
  label2="Color"
  value="#00ff41">
</terminal-color-picker>

<script>
  const picker = document.getElementById('colorPicker');
  
  picker.addEventListener('color-change', (e) => {
    console.log('Color changed to:', e.detail.color);
  });
</script>
```

### Compact Mode
```html
<terminal-color-picker 
  compact
  value="#ff0041">
</terminal-color-picker>
```

### With Custom Icon
```html
<terminal-color-picker id="customIcon"></terminal-color-picker>

<script>
  import { paintBrushIcon } from './js/utils/phosphor-icons.js';
  
  const picker = document.getElementById('customIcon');
  picker.setIcon(paintBrushIcon);
</script>
```

### Form Integration
```html
<form id="settingsForm">
  <terminal-color-picker 
    name="primaryColor"
    label1="Primary"
    label2="Color"
    value="#00ff41">
  </terminal-color-picker>
  
  <terminal-button type="submit">Save</terminal-button>
</form>

<script>
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const picker = document.querySelector('[name="primaryColor"]');
    const color = picker.getValue();
    console.log('Primary color:', color);
  });
</script>
```

### Theme Builder
```html
<div class="theme-builder">
  <terminal-color-picker id="primary" label1="Primary" label2="Color"></terminal-color-picker>
  <terminal-color-picker id="secondary" label1="Secondary" label2="Color"></terminal-color-picker>
  <terminal-color-picker id="accent" label1="Accent" label2="Color"></terminal-color-picker>
</div>

<script>
  const colors = {
    primary: document.getElementById('primary'),
    secondary: document.getElementById('secondary'),
    accent: document.getElementById('accent')
  };
  
  // Apply theme colors
  function applyTheme() {
    document.documentElement.style.setProperty('--primary', colors.primary.getValue());
    document.documentElement.style.setProperty('--secondary', colors.secondary.getValue());
    document.documentElement.style.setProperty('--accent', colors.accent.getValue());
  }
  
  // Listen for changes
  Object.values(colors).forEach(picker => {
    picker.addEventListener('color-change', applyTheme);
  });
  
  // Save theme
  function saveTheme() {
    const theme = {
      primary: colors.primary.getValue(),
      secondary: colors.secondary.getValue(),
      accent: colors.accent.getValue(),
      swatches: colors.primary.customSwatches
    };
    localStorage.setItem('custom-theme', JSON.stringify(theme));
  }
  
  // Listen for save events
  Object.values(colors).forEach(picker => {
    picker.addEventListener('color-save', saveTheme);
  });
</script>
```

### With Supabase Storage
```html
<terminal-color-picker id="cloudPicker"></terminal-color-picker>

<script type="module">
  import { ColorSwatchesStorage } from './js/modules/storage/color-swatches-storage.js';
  
  const picker = document.getElementById('cloudPicker');
  
  // Initialize Supabase storage when ready
  if (window.supabase) {
    const storage = new ColorSwatchesStorage(window.supabase);
    await storage.init();
    
    // Load saved swatches
    const savedSwatches = storage.getSwatches();
    if (savedSwatches.length > 0) {
      picker.customSwatches = savedSwatches;
      picker.updateSwatchesDisplay();
    }
    
    // Save swatches on update
    picker.addEventListener('swatches-updated', async (e) => {
      await storage.saveSwatches(e.detail.swatches);
    });
    
    // Sync on auth changes
    storage.onAuthChange((swatches) => {
      picker.customSwatches = swatches;
      picker.updateSwatchesDisplay();
    });
  }
</script>
```

## Styling Variables

```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-green-dark: #009926;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--terminal-black: #0a0a0a;
--font-mono: 'SF Mono', 'Monaco', monospace;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--font-size-xs: 10px;
--font-size-sm: 11px;
```

## Accessibility

- Keyboard navigation support in Pickr
- ARIA labels for all interactive elements
- Screen reader compatible
- High contrast mode compatible
- Escape key closes picker
- Tab navigation through color formats

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Notes

- Custom swatches persist across sessions via localStorage
- Maximum 20 custom swatches plus 11 defaults
- Hex input automatically formats and validates
- Color changes are debounced (300ms) for performance
- Pickr instance is properly cleaned up on component unmount
- Supports both light and dark themes through CSS variables