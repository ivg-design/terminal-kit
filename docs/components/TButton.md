# TButtonLit (t-btn)

A **Pure Lit** button component with terminal/cyberpunk styling. Built with Lit 3.x for zero FOUC, complete Shadow DOM encapsulation, and reactive properties. Supports multiple variants, sizes, states, toggle functionality, and icon integration.

## Architecture

**CRITICAL:** This is a **Pure Lit Component**:
- ✅ Extends `LitElement`
- ✅ All styles in `static styles` CSS block
- ✅ Zero FOUC (Flash of Unstyled Content)
- ✅ Complete Shadow DOM encapsulation
- ✅ Reactive properties with `@property()` decorator
- ✅ No external CSS loading
- ✅ No `adoptedStyleSheets`

## Tag Name
```html
<t-btn></t-btn>
```

## Properties

All properties are reactive Lit properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | String | `'primary'` | Button style: 'primary', 'secondary', 'danger', 'toggle' |
| `type` | String | `'text'` | Display type: 'text', 'icon', 'icon-text' |
| `size` | String | `''` | Size: 'xs', 'small'/'sm', '' (default), 'large'/'lg' |
| `disabled` | Boolean | `false` | Disabled state |
| `loading` | Boolean | `false` | Loading state with spinner |
| `icon` | String | `''` | Icon SVG content |
| `toggleState` | Boolean | `false` | Toggle state (toggle variant only) |
| `iconOn` | String | `''` | Icon when toggle is on |
| `iconOff` | String | `''` | Icon when toggle is off |

### Variants
- `primary` - Primary action button (green filled on hover)
- `secondary` - Secondary action (transparent with glow on hover)
- `danger` - Danger/destructive action (red theme)
- `toggle` - Toggle button with on/off states

### Types
- `text` - Text-only button (default)
- `icon` - Icon-only button
- `icon-text` - Icon with text

### Sizes
- `xs` - Extra small (16px, borderless, transparent)
- `small`/`sm` - Small size (20px)
- `` (empty) - Default size (28px)
- `large`/`lg` - Large size (36px)

## Icon Sizes by Button Size

Icons automatically scale based on button size:
- **XS** - 12px icons
- **Small** - 14px icons
- **Default** - 18px icons (standard)
- **Large** - 20px icons

## Methods

### `setIcon(iconSvg)`
Sets the button icon (automatically scales based on size).

**Parameters:**
- `iconSvg` (String): SVG string for the icon

```javascript
import { gearSixIcon } from '../utils/phosphor-icons.js';
button.setIcon(gearSixIcon);
```

### `toggle()`
Toggles the state (toggle variant only). Returns the new state.

**Returns:** `Boolean` - The new toggle state

```javascript
const newState = button.toggle();
```

## Events

### `click`
Standard DOM click event. Use for all button interactions.

```javascript
button.addEventListener('click', (e) => {
  console.log('Button clicked');
});
```

### `toggle-change`
Fired when toggle state changes (toggle variant only).

**Event Detail:**
```javascript
{
  state: Boolean // New toggle state
}
```

**Example:**
```javascript
button.addEventListener('toggle-change', (e) => {
  console.log('Toggle state:', e.detail.state);
});
```

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
<t-btn>Default</t-btn>

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
<t-btn id="submitBtn" variant="primary">Submit</t-btn>

<script type="module">
  const submitBtn = document.getElementById('submitBtn');

  submitBtn.addEventListener('click', async () => {
    submitBtn.loading = true;

    try {
      await submitForm();
    } finally {
      submitBtn.loading = false;
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
  playPauseBtn.iconOff = playIcon;
  playPauseBtn.iconOn = pauseIcon;

  playPauseBtn.addEventListener('toggle-change', (e) => {
    if (e.detail.state) {
      console.log('Playing...');
    } else {
      console.log('Paused');
    }
  });
</script>
```

#### Recording Toggle
```html
<t-btn
  variant="toggle"
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
  expandBtn.iconOn = caretUpIcon;
  expandBtn.iconOff = caretDownIcon;
</script>
```

### Reactive Property Updates
```html
<t-btn id="dynamicBtn" variant="primary">Submit</t-btn>

<script type="module">
  import { checkIcon, xIcon } from '../js/utils/phosphor-icons.js';
  const dynamicBtn = document.getElementById('dynamicBtn');

  dynamicBtn.addEventListener('click', async () => {
    // Start loading
    dynamicBtn.loading = true;

    try {
      const result = await processData();

      // Success state - properties automatically trigger re-render
      dynamicBtn.loading = false;
      dynamicBtn.variant = 'secondary';
      dynamicBtn.setIcon(checkIcon);

    } catch (error) {
      // Error state
      dynamicBtn.loading = false;
      dynamicBtn.variant = 'danger';
      dynamicBtn.setIcon(xIcon);
    }
  });
</script>
```

## Styling and Theming

### CSS Variables
Components use CSS variables for theming. Override in `:root` or inline:

```css
:root {
  /* Colors */
  --terminal-green: #00ff41;
  --terminal-green-bright: #33ff66;
  --terminal-green-dim: #00cc33;
  --terminal-green-dark: #008820;
  --terminal-gray-dark: #242424;
  --terminal-gray: #808080;

  /* Typography */
  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
  --font-size-sm: 11px;

  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 12px;
}
```

### External Styling with `::part()`
```css
/* Style button internals from outside */
t-btn::part(button) {
  font-weight: bold;
}
```

## Size Specifications

### XS (Extra Small)
- **Height**: 16px
- **Border**: None
- **Background**: Transparent
- **Use case**: Compact UIs, inline actions, panel headers
- **Icon size**: 12px
- **Padding**: Minimal

### Small
- **Height**: 20px
- **Padding**: 0 8px
- **Use case**: Secondary actions, panel action buttons
- **Icon size**: 14px

### Default
- **Height**: 28px
- **Padding**: 0 12px
- **Use case**: Standard buttons
- **Icon size**: 18px

### Large
- **Height**: 36px
- **Padding**: 0 20px
- **Use case**: Primary actions
- **Icon size**: 20px

## Panel Integration

When buttons are placed in panel action slots, the panel automatically sizes them:
- **Compact panels** → XS buttons (12px icons)
- **Standard panels** → Small buttons (14px icons)
- **Large panels** → Default buttons (18px icons)

See [TPanelLit.md](./TPanelLit.md) for details on action button auto-sizing.

## Lit Lifecycle

Component uses Lit lifecycle methods:

```javascript
connectedCallback() {
  // Called when added to DOM
}

updated(changedProperties) {
  // Called after property changes
  if (changedProperties.has('toggleState')) {
    // React to toggle state change
  }
}

render() {
  // Returns Lit html template
}
```

## Accessibility

- Keyboard navigation support (Enter/Space to activate)
- Disabled state prevents interaction
- Focus states managed by browser
- Toggle buttons maintain state in properties
- Disabled buttons have reduced opacity (0.3)

## Component Architecture

- **Base Class**: Extends `LitElement`
- **Shadow DOM**: Complete encapsulation via Lit
- **Style Management**: `static styles` CSS block
- **Reactive Properties**: Automatic re-rendering on change
- **Event System**: Native DOM events + custom events

## Browser Support

- Chrome/Edge 90+ (native Lit support)
- Firefox 90+ (native Lit support)
- Safari 16.4+ (native Lit support)
- Older browsers: Use Lit polyfills

## Migration from Legacy TButton

If migrating from old `TComponent`-based button:

### Before (Legacy)
```javascript
import { TButton } from './js/components/TButton.js';
button.setProp('variant', 'primary');
button.emit('button-click', { ... });
```

### After (Pure Lit)
```javascript
import './js/components/TButtonLit.js';
button.variant = 'primary';
button.dispatchEvent(new CustomEvent('click', { ... }));
```

### Key Changes
1. Component extends `LitElement` not `TComponent`
2. Use properties directly, not `setProp()`
3. Use standard `dispatchEvent()`, not `emit()`
4. No external CSS loading
5. All styles in `static styles` block

## Related Components

- [TPanelLit](./TPanelLit.md) - Panel component with action button auto-sizing
- [TInputLit](./TerminalInput.md) - Text input component
- [TDropdownLit](./TerminalDropdown.md) - Dropdown component

## Resources

- [Lit Documentation](https://lit.dev/)
- [Pure Lit Architecture](../API.md)
- [Component Creation Guide](../COMPONENT_CREATION_GUIDE.md)