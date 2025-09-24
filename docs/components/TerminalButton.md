# TerminalButton

A customizable button component with terminal/cyberpunk styling. Supports multiple variants, sizes, states, toggle functionality, and icon integration.

## Live Demo

<ButtonDemo />

## Tag Name
```html
<terminal-button></terminal-button>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | string | `'primary'` | Button style variant |
| `type` | string | `'text'` | Button display type |
| `size` | string | `'default'` | Button size |
| `disabled` | boolean | `false` | Disabled state |
| `loading` | boolean | `false` | Loading state |
| `loader-type` | string | `'spinner'` | Loader animation type: 'spinner', 'dots', 'bars' |
| `loader-color` | string | `null` | Custom color for the loader |
| `icon` | string | `null` | Icon SVG content |
| `toggle-state` | boolean | `false` | Current state for toggle variant |
| `icon-on` | string | `null` | Icon SVG when toggle is on |
| `icon-off` | string | `null` | Icon SVG when toggle is off |
| `color-on` | string | `null` | Color when toggle is on |
| `color-off` | string | `null` | Color when toggle is off |

### Variants
- `primary` - Primary action button (green filled on hover)
- `secondary` - Secondary action (transparent with glow on hover)
- `danger` - Danger/destructive action (red theme)
- `toggle` - Toggle button with on/off states

### Types
- `text` - Text-only button
- `icon` - Icon-only button
- `icon-text` - Icon with text

### Sizes
- `xs` - Extra small (16px, borderless, icon-only)
- `small` - Small size (20px, icon-only)
- `default` - Default size (28px)
- `large` - Large size (36px)

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `variant` | string | Button variant |
| `type` | string | Button display type |
| `size` | string | Button size |
| `disabled` | boolean | Disabled state |
| `icon` | string | Icon SVG content |
| `loading` | boolean | Loading state |
| `loaderType` | string | Loader animation type |
| `loaderColor` | string | Custom loader color |
| `text` | string | Button text content |
| `toggleState` | boolean | Current toggle state |
| `iconOn` | string | Icon for toggle on state |
| `iconOff` | string | Icon for toggle off state |
| `colorOn` | string | Color for toggle on state |
| `colorOff` | string | Color for toggle off state |

## Methods

### `click()`
Programmatically clicks the button.

```javascript
button.click();
```

### `disable()`
Disables the button.

```javascript
button.disable();
```

### `enable()`
Enables the button.

```javascript
button.enable();
```

### `setLoading(loading)`
Sets the loading state.

**Parameters:**
- `loading` (boolean): Whether button is loading

```javascript
button.setLoading(true);
```

### `setText(text)`
Sets the button text.

**Parameters:**
- `text` (string): Button text content

```javascript
button.setText('Save');
```

### `setIcon(iconSvg)`
Sets the button icon.

**Parameters:**
- `iconSvg` (string): SVG string for the icon

```javascript
import { gearSixIcon } from './phosphor-icons.js';
button.setIcon(gearSixIcon);
```

### `setVariant(variant)`
Sets the button variant.

**Parameters:**
- `variant` (string): One of 'primary', 'secondary', 'danger', 'toggle'

```javascript
button.setVariant('danger');
```

### `setType(type)`
Sets the button display type.

**Parameters:**
- `type` (string): One of 'text', 'icon', 'icon-text'

```javascript
button.setType('icon');
```

### `setSize(size)`
Sets the button size.

**Parameters:**
- `size` (string): One of 'xs', 'small', 'default', 'large'

```javascript
button.setSize('xs');
```

### `toggle()`
Toggles the state (toggle variant only). Returns the new state.

**Returns:** `boolean` - The new toggle state

```javascript
const newState = button.toggle();
```

### `setToggleState(state)`
Sets the toggle state directly.

**Parameters:**
- `state` (boolean): The new toggle state

```javascript
button.setToggleState(true);
```

### `getToggleState()`
Gets the current toggle state.

**Returns:** `boolean` - Current toggle state

```javascript
const isOn = button.getToggleState();
```

## Events

### `button-click`
Fired when the button is clicked (not disabled or loading).

**Event Detail:**
```javascript
{
  originalEvent: MouseEvent
}
```

**Example:**
```javascript
button.addEventListener('button-click', (e) => {
  console.log('Button clicked', e.detail);
});
```

### `toggle-change`
Fired when toggle state changes (toggle variant only).

**Event Detail:**
```javascript
{
  state: boolean
}
```

**Example:**
```javascript
button.addEventListener('toggle-change', (e) => {
  console.log('Toggle state:', e.detail.state);
});
```

## CSS Classes

The component applies these classes to the internal button element:

- `btn` - Base button class
- `btn-{variant}` - Variant modifier (primary, secondary, danger)
- `btn-toggle-custom` - Toggle button class
- `btn-icon` - Icon-only button
- `btn-icon-text` - Icon with text button
- `btn-{size}` - Size modifier (xs, small, large)
- `btn-loading` - When loading
- `btn-loading-{type}` - Loader type modifier (spinner, dots, bars)
- `toggle-on` - Toggle button in on state
- `toggle-off` - Toggle button in off state
- `hover` - Hover state

## Toggle Button Visual States

### OFF State
- **Normal**: Transparent background with green outline
- **Hover**: Light green background tint (15% opacity), green glow, brightened icon
- **Active**: Button depresses (translateY)

### ON State
- **Normal**: Filled green background with dark green icon
- **Hover**: Darker green background, lighter green icon with glow
- **Active**: Button depresses (translateY)

## Examples

### Basic Buttons
```html
<!-- Text button -->
<terminal-button>Click Me</terminal-button>

<!-- Primary variant -->
<terminal-button variant="primary">Save Changes</terminal-button>

<!-- Secondary variant -->
<terminal-button variant="secondary">Cancel</terminal-button>

<!-- Danger variant -->
<terminal-button variant="danger">Delete</terminal-button>
```

### Button Sizes
```html
<!-- XS Size (16px, borderless, icon-only) -->
<terminal-button size="xs" id="xsBtn"></terminal-button>

<!-- Small Size (20px, icon-only) -->
<terminal-button size="small" id="smallBtn"></terminal-button>

<!-- Default Size (28px) -->
<terminal-button size="default">Default</terminal-button>

<!-- Large Size (36px) -->
<terminal-button size="large">Large Button</terminal-button>

<script>
  import { xIcon, gearSixIcon } from './phosphor-icons.js';
  document.getElementById('xsBtn').setIcon(xIcon);
  document.getElementById('smallBtn').setIcon(gearSixIcon);
</script>
```

### Button with Icon
```html
<!-- Icon with text -->
<terminal-button type="icon-text" id="saveBtn">
  Save
</terminal-button>

<!-- Icon only -->
<terminal-button type="icon" id="settingsBtn"></terminal-button>

<script>
  import { floppyDiskIcon, gearSixIcon } from './phosphor-icons.js';
  document.getElementById('saveBtn').setIcon(floppyDiskIcon);
  document.getElementById('settingsBtn').setIcon(gearSixIcon);
</script>
```

### XS Button for Compact UIs
```html
<!-- Perfect for compact panel headers -->
<terminal-panel mode="with-header" title="Compact Panel" compact>
  <div slot="header-actions">
    <terminal-button size="xs" type="icon" id="action1"></terminal-button>
    <terminal-button size="xs" type="icon" id="action2"></terminal-button>
  </div>
</terminal-panel>

<script>
  import { plusIcon, gearSixIcon } from './phosphor-icons.js';
  document.getElementById('action1').setIcon(plusIcon);
  document.getElementById('action2').setIcon(gearSixIcon);
</script>
```

### Loading State
```html
<!-- Default spinner loader -->
<terminal-button id="submitBtn" variant="primary">
  Submit
</terminal-button>

<!-- Dots loader -->
<terminal-button id="processBtn" loader-type="dots">
  Process
</terminal-button>

<!-- Bars loader with custom color -->
<terminal-button id="uploadBtn" loader-type="bars" loader-color="#00aaff">
  Upload
</terminal-button>

<script>
  const submitBtn = document.getElementById('submitBtn');

  submitBtn.addEventListener('button-click', async () => {
    submitBtn.setLoading(true);

    try {
      await submitForm();
    } finally {
      submitBtn.setLoading(false);
    }
  });
</script>
```

#### Loading with Different Loader Types
```html
<terminal-button id="dynamicLoader" variant="primary">
  Save
</terminal-button>

<script>
  const btn = document.getElementById('dynamicLoader');

  // Change loader type
  btn.setAttribute('loader-type', 'dots');

  // Change loader color
  btn.setAttribute('loader-color', '#ff6b35');

  // Activate loading with custom loader
  btn.setLoading(true);
</script>
```

### Disabled State
```html
<terminal-button disabled>
  Unavailable
</terminal-button>

<!-- Programmatically disable/enable -->
<terminal-button id="actionBtn">Action</terminal-button>

<script>
  const actionBtn = document.getElementById('actionBtn');
  
  // Disable
  actionBtn.disable();
  
  // Enable
  actionBtn.enable();
</script>
```

### Toggle Buttons

#### Play/Pause Toggle
```html
<terminal-button 
  variant="toggle"
  type="icon"
  id="playPauseBtn">
</terminal-button>

<script>
  import { playIcon, pauseIcon } from './phosphor-icons.js';
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  playPauseBtn.setAttribute('icon-off', playIcon);
  playPauseBtn.setAttribute('icon-on', pauseIcon);
  
  playPauseBtn.addEventListener('toggle-change', (e) => {
    if (e.detail.state) {
      console.log('Playing...');
      startPlayback();
    } else {
      console.log('Paused');
      pausePlayback();
    }
  });
</script>
```

#### Recording Toggle with Custom Colors
```html
<terminal-button 
  variant="toggle"
  color-on="#ff0000"
  color-off="#00ff41"
  toggle-state="false">
  Recording
</terminal-button>
```

#### Expand/Collapse Toggle
```html
<terminal-button 
  variant="toggle"
  type="icon-text"
  id="expandBtn">
  Details
</terminal-button>

<script>
  import { caretUpIcon, caretDownIcon } from './phosphor-icons.js';
  
  const expandBtn = document.getElementById('expandBtn');
  expandBtn.setAttribute('icon-on', caretUpIcon);
  expandBtn.setAttribute('icon-off', caretDownIcon);
  
  expandBtn.addEventListener('toggle-change', (e) => {
    const panel = document.getElementById('detailsPanel');
    if (e.detail.state) {
      panel.expand();
    } else {
      panel.collapse();
    }
  });
</script>
```

### Dynamic Button State Changes
```html
<terminal-button id="dynamicBtn" variant="primary">
  Submit
</terminal-button>

<script>
  const dynamicBtn = document.getElementById('dynamicBtn');
  
  dynamicBtn.addEventListener('button-click', async () => {
    // Start loading
    dynamicBtn.setLoading(true);
    dynamicBtn.setText('Processing...');
    
    try {
      const result = await processData();
      
      // Success state
      dynamicBtn.setLoading(false);
      dynamicBtn.setVariant('secondary');
      dynamicBtn.setText('Success!');
      dynamicBtn.setIcon(checkIcon);
      
    } catch (error) {
      // Error state
      dynamicBtn.setLoading(false);
      dynamicBtn.setVariant('danger');
      dynamicBtn.setText('Failed');
      dynamicBtn.setIcon(xIcon);
    }
  });
</script>
```

### Button Group with Mixed Sizes
```html
<div class="button-group">
  <!-- Large primary action -->
  <terminal-button variant="primary" size="large">
    Create New
  </terminal-button>
  
  <!-- Default secondary actions -->
  <terminal-button variant="secondary">
    Edit
  </terminal-button>
  <terminal-button variant="secondary">
    Duplicate
  </terminal-button>
  
  <!-- Small icon actions -->
  <terminal-button size="small" type="icon" id="refreshBtn"></terminal-button>
  
  <!-- XS danger action -->
  <terminal-button size="xs" type="icon" variant="danger" id="deleteBtn"></terminal-button>
</div>
```

### Programmatic Toggle Control
```html
<terminal-button variant="toggle" id="autoToggle">
  Auto Mode
</terminal-button>

<terminal-button id="controlBtn">
  Set Auto On
</terminal-button>

<script>
  const autoToggle = document.getElementById('autoToggle');
  const controlBtn = document.getElementById('controlBtn');
  
  // Programmatically set toggle state
  controlBtn.addEventListener('button-click', () => {
    autoToggle.setToggleState(true);
  });
  
  // Get current state
  function checkAutoMode() {
    const isAuto = autoToggle.getToggleState();
    console.log('Auto mode is:', isAuto ? 'ON' : 'OFF');
  }
  
  // Listen for changes
  autoToggle.addEventListener('toggle-change', (e) => {
    console.log('Auto mode changed to:', e.detail.state);
  });
</script>
```

## Styling Variables

The component uses these CSS variables (defined in terminal.css and buttons.css):

```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-green-dark: #008822;
--terminal-black: #0a0a0a;
--terminal-black-light: #1a1a1a;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--terminal-red: #ff3333;
--control-height: 28px;
--font-mono: 'SF Mono', 'Monaco', monospace;
--font-size-xs: 10px;
--font-size-sm: 11px;
--font-size-base: 12px;
--font-size-md: 13px;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
```

## Size Specifications

### XS (Extra Small)
- Size: 16px × 16px
- Border: None
- Background: Transparent
- Use case: Compact UIs, panel headers
- Icon size: 12px
- Type: Icon-only

### Small
- Size: 20px × 20px
- Border: 1px
- Use case: Secondary actions
- Icon size: 12px
- Type: Icon-only

### Default
- Size: 28px height
- Padding: 0 12px
- Use case: Standard buttons
- Icon size: 16px
- Type: Text, icon, or icon-text

### Large
- Size: 36px height
- Padding: 0 16px
- Use case: Primary actions
- Icon size: 18px
- Type: Text, icon, or icon-text

## Loading State Implementation

The button uses the `TerminalLoader` component internally to display loading animations. When `loading` is true:
- The button text becomes hidden
- A `<terminal-loader>` component is rendered inside the button
- The loader inherits the `loader-type` and `loader-color` attributes
- Button width is preserved to prevent layout shifts
- The loader is automatically sized to fit within the button (12px for spinner, proportional for dots/bars)

### Loader Types
- **spinner** (default) - Orbital spinner animation
- **dots** - Three animated square dots
- **bars** - Five animated vertical bars

## Accessibility

- Supports keyboard navigation (Enter/Space to activate)
- Properly handles disabled state
- ARIA attributes for loading and toggle states
- Focus visible states
- aria-label support for icon-only buttons
- Toggle buttons announce state changes

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+