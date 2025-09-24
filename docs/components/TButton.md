# TButton (t-btn)

A customizable button component with terminal/cyberpunk styling. Supports multiple variants, sizes, states, toggle functionality, and icon integration.

## Tag Name
```html
<t-btn></t-btn>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | string | `'primary'` | Button style variant: 'primary', 'secondary', 'danger', 'toggle' |
| `type` | string | `'text'` | Button display type: 'text', 'icon', 'icon-text' |
| `size` | string | `'default'` | Button size: 'xs', 'small'/'sm', 'default', 'large'/'lg' |
| `disabled` | boolean | `false` | Disabled state (presence-based) |
| `loading` | boolean | `false` | Loading state (presence-based) |
| `loader-type` | string | `'spinner'` | Loader animation type: 'spinner', 'dots', 'bars' |
| `loader-color` | string | `null` | Custom color for the loader (CSS color value) |
| `icon` | string | `null` | Icon SVG content |
| `toggle-state` | string | `'false'` | Current state for toggle variant (string: 'true'/'false') |
| `icon-on` | string | `null` | Icon SVG when toggle is on |
| `icon-off` | string | `null` | Icon SVG when toggle is off |
| `color-on` | string | `null` | CSS color when toggle is on |
| `color-off` | string | `null` | CSS color when toggle is off |

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
- `xs` - Extra small (16px, borderless, transparent)
- `small`/`sm` - Small size (20px)
- `default` - Default size (28px)
- `large`/`lg` - Large size (36px)

## Properties

All attributes are reflected as properties with camelCase naming:

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
Programmatically clicks the button (if not disabled or loading).

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
Sets the loading state with automatic width preservation.

**Parameters:**
- `loading` (boolean): Whether button is loading

```javascript
button.setLoading(true);
// Width is automatically preserved to prevent layout shift
```

### `setText(text)`
Sets the button text content.

**Parameters:**
- `text` (string): Button text content

```javascript
button.setText('Save Changes');
```

### `setIcon(iconSvg)`
Sets the button icon (automatically scales based on size).

**Parameters:**
- `iconSvg` (string): SVG string for the icon

```javascript
import { gearSixIcon } from '../utils/phosphor-icons.js';
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
- `size` (string): One of 'xs', 'small'/'sm', 'default', 'large'/'lg'

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
  console.log('Button clicked', e.detail.originalEvent);
});
```

### `toggle-change`
Fired when toggle state changes (toggle variant only).

**Event Detail:**
```javascript
{
  state: boolean // New toggle state
}
```

**Example:**
```javascript
button.addEventListener('toggle-change', (e) => {
  console.log('Toggle state:', e.detail.state);
});
```

## CSS Classes

The component uses these internal CSS classes (applied to shadow DOM):

### Base Classes
- `.t-btn` - Base button class
- `.t-btn--{variant}` - Variant modifier (primary, secondary, danger)
- `.t-btn--toggle` - Toggle button class

### Type Classes
- `.t-btn--text` - Text-only button
- `.t-btn--icon` - Icon-only button
- `.t-btn--icon-text` - Icon with text button

### Size Classes
- `.t-btn--xs` - Extra small size
- `.t-btn--sm` - Small size (also supports 'small')
- `.t-btn--lg` - Large size (also supports 'large')

### State Classes
- `.is-disabled` - Disabled state
- `.is-loading` - Loading state
- `.is-on` - Toggle button in on state
- `.is-off` - Toggle button in off state
- `.hover` - Hover state (programmatically applied)

## Toggle Button Visual States

### OFF State
- **Normal**: Dimmed green color with matching border
- **Hover**: Bright green color, light background tint
- **Active**: Button depresses (translateY)

### ON State
- **Normal**: Bright green with background tint and glow
- **Hover**: Enhanced glow and brighter background
- **Active**: Button depresses (translateY)

## Examples

### Basic Buttons
```html
<!-- Text button -->
<t-btn>Click Me</t-btn>

<!-- Primary variant -->
<t-btn variant="primary">Save Changes</t-btn>

<!-- Secondary variant -->
<t-btn variant="secondary">Cancel</t-btn>

<!-- Danger variant -->
<t-btn variant="danger">Delete</t-btn>
```

### Button Sizes
```html
<!-- XS Size (16px, borderless) -->
<t-btn size="xs" type="icon" id="xsBtn"></t-btn>

<!-- Small Size (20px) -->
<t-btn size="small" type="icon" id="smallBtn"></t-btn>

<!-- Default Size (28px) -->
<t-btn size="default">Default</t-btn>

<!-- Large Size (36px) -->
<t-btn size="large">Large Button</t-btn>

<script type="module">
  import { xIcon, gearSixIcon } from '../js/utils/phosphor-icons.js';
  document.getElementById('xsBtn').setIcon(xIcon);
  document.getElementById('smallBtn').setIcon(gearSixIcon);
</script>
```

### Button with Icon
```html
<!-- Icon with text -->
<t-btn type="icon-text" id="saveBtn">Save</t-btn>

<!-- Icon only -->
<t-btn type="icon" id="settingsBtn"></t-btn>

<script type="module">
  import { floppyDiskIcon, gearSixIcon } from '../js/utils/phosphor-icons.js';
  document.getElementById('saveBtn').setIcon(floppyDiskIcon);
  document.getElementById('settingsBtn').setIcon(gearSixIcon);
</script>
```

### Loading State
```html
<!-- Default spinner loader -->
<t-btn id="submitBtn" variant="primary">Submit</t-btn>

<!-- Dots loader -->
<t-btn id="processBtn" loader-type="dots">Process</t-btn>

<!-- Bars loader with custom color -->
<t-btn id="uploadBtn" loader-type="bars" loader-color="#00aaff">Upload</t-btn>

<script type="module">
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

### Toggle Buttons

#### Play/Pause Toggle
```html
<t-btn
  variant="toggle"
  type="icon"
  id="playPauseBtn">
</t-btn>

<script type="module">
  import { playIcon, pauseIcon } from '../js/utils/phosphor-icons.js';

  const playPauseBtn = document.getElementById('playPauseBtn');
  playPauseBtn.setAttribute('icon-off', playIcon);
  playPauseBtn.setAttribute('icon-on', pauseIcon);

  playPauseBtn.addEventListener('toggle-change', (e) => {
    if (e.detail.state) {
      console.log('Playing...');
    } else {
      console.log('Paused');
    }
  });
</script>
```

#### Recording Toggle with Custom Colors
```html
<t-btn
  variant="toggle"
  color-on="#ff0000"
  color-off="#00ff41"
  toggle-state="false">
  Recording
</t-btn>
```

#### Expand/Collapse Toggle
```html
<t-btn
  variant="toggle"
  type="icon-text"
  id="expandBtn">
  Details
</t-btn>

<script type="module">
  import { caretUpIcon, caretDownIcon } from '../js/utils/phosphor-icons.js';

  const expandBtn = document.getElementById('expandBtn');
  expandBtn.setAttribute('icon-on', caretUpIcon);
  expandBtn.setAttribute('icon-off', caretDownIcon);
</script>
```

### Dynamic Button State Changes
```html
<t-btn id="dynamicBtn" variant="primary">Submit</t-btn>

<script type="module">
  import { checkIcon, xIcon } from '../js/utils/phosphor-icons.js';
  const dynamicBtn = document.getElementById('dynamicBtn');

  dynamicBtn.addEventListener('button-click', async () => {
    // Start loading (width automatically preserved)
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

## Styling and Theming

The component uses Shadow DOM with adoptedStyleSheets for encapsulated styling. It inherits CSS variables from the theme:

### CSS Variables Used
```css
/* Colors */
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-green-dark: #009929;
--terminal-green-bright: #00ff66;
--terminal-gray-dark: #242424;
--terminal-gray: #333333;
--terminal-gray-light: #333333;
--terminal-red: #ff0041;

/* Typography */
--font-mono: 'SF Mono', 'Monaco', monospace;
--font-size-xs: 10px;
--font-size-sm: 11px;
--font-size-md: 12px;

/* Sizing */
--control-height: 28px;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
```

### Custom Properties
You can set custom colors via CSS variables:

```html
<t-btn style="--loader-color: #00aaff;">Custom Loader Color</t-btn>
<t-btn variant="toggle" style="--toggle-color-on: #ff0000; --toggle-color-off: #00ff41;">
  Custom Toggle Colors
</t-btn>
```

## Size Specifications

### XS (Extra Small)
- **Height**: 16px
- **Border**: None
- **Background**: Transparent
- **Use case**: Compact UIs, inline actions
- **Icon size**: 12px
- **Supports**: Icon-only

### Small
- **Height**: 20px
- **Padding**: 0 8px
- **Use case**: Secondary actions
- **Icon size**: 16px
- **Supports**: All types

### Default
- **Height**: 28px
- **Padding**: 0 12px
- **Use case**: Standard buttons
- **Icon size**: 16px
- **Supports**: All types

### Large
- **Height**: 36px
- **Padding**: 0 20px
- **Use case**: Primary actions
- **Icon size**: 20px
- **Supports**: All types

## Loading Animations

The button displays loader animations inline (not using separate loader component):

### Loader Types
- **spinner** (default) - CSS-based orbital spinner using box-shadow animation
- **dots** - Three animated dots with bounce effect
- **bars** - Five animated vertical bars with wave effect

All animations are defined via @keyframes in the stylesheet and applied via CSS classes.

### Width Preservation
When `setLoading(true)` is called:
1. Current button width is captured
2. `min-width` is applied to prevent collapse
3. Loading animation is displayed
4. When loading ends, width constraint is removed

## Accessibility

- Keyboard navigation support (Enter/Space to activate)
- Properly handles disabled state with `pointer-events: none`
- Focus states managed internally
- Toggle buttons maintain state in attributes
- Disabled buttons have reduced opacity (0.3)

## Component Architecture

- **Base Class**: Extends `TComponent`
- **Shadow DOM**: Encapsulated styling and DOM
- **Style Management**: Uses `StyleSheetManager` with adoptedStyleSheets
- **Logger**: Uses `ComponentLogger` for debugging
- **Event System**: Custom events with `emit()` method
- **Lifecycle**: Managed render cycles with `afterRender()` hooks

## Browser Support

- Chrome 90+ (adoptedStyleSheets)
- Firefox 101+ (adoptedStyleSheets)
- Safari 16.4+ (adoptedStyleSheets)
- Edge 90+ (adoptedStyleSheets)

## Debugging

Enable debug mode for this component:
```
http://localhost:3007/demos/buttons.html?debug=TButton
```

This will show detailed logs for stylesheet loading and component lifecycle.