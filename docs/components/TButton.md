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

## Static Metadata

| Property | Value | Description |
|----------|-------|-------------|
| `tagName` | `'t-btn'` | Custom element tag name |
| `version` | `'1.0.0'` | Component version |
| `category` | `'Form Controls'` | Component category |

## Properties

All properties are reactive Lit properties:

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `variant` | String | `'primary'` | ✅ | Button style: 'primary', 'secondary', 'danger', 'toggle' |
| `type` | String | `'text'` | ✅ | Display type: 'text', 'icon', 'icon-text' |
| `size` | String | `'default'` | ✅ | Size: 'xs', 'small'/'sm', 'default', 'large'/'lg' |
| `disabled` | Boolean | `false` | ✅ | Disabled state |
| `loading` | Boolean | `false` | ✅ | Loading state with spinner |
| `icon` | String | `''` | ❌ | Icon SVG content |
| `loaderType` | String | `'spinner'` | ❌ | Loader type: 'spinner', 'dots', 'bars' |
| `loaderColor` | String | `''` | ❌ | Custom loader color (CSS color value) |
| `toggleState` | Boolean | `false` | ✅ | Toggle state (toggle variant only) |
| `iconOn` | String | `''` | ❌ | Icon when toggle is on |
| `iconOff` | String | `''` | ❌ | Icon when toggle is off |
| `colorOn` | String | `''` | ❌ | Custom color when toggle is on |
| `colorOff` | String | `''` | ❌ | Custom color when toggle is off |
| `textOn` | String | `''` | ❌ | Text to display when toggle is on |
| `textOff` | String | `''` | ❌ | Text to display when toggle is off |

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

### `click()`
Programmatically click the button. Only works when button is not disabled or loading.

**Parameters:** None

**Returns:** `void`

**Fires:** `button-click` event

```javascript
button.click();
```

### `focus()`
Focus the button element.

**Parameters:** None

**Returns:** `void`

```javascript
button.focus();
```

### `blur()`
Blur (unfocus) the button element.

**Parameters:** None

**Returns:** `void`

```javascript
button.blur();
```

### `setIcon(iconSvg)`
Sets the button icon (automatically scales based on size).

**Parameters:**
- `iconSvg` (String): SVG string for the icon

**Returns:** `void`

```javascript
import { gearSixIcon } from '../utils/phosphor-icons.js';
button.setIcon(gearSixIcon);
```

### `setText(text)`
Sets the button text content.

**Parameters:**
- `text` (String): Button text content

**Returns:** `void`

```javascript
button.setText('New Text');
```

### `setLoading(loading)`
Sets the loading state. Automatically preserves button width during loading.

**Parameters:**
- `loading` (Boolean): Loading state

**Returns:** `void`

```javascript
button.setLoading(true);
// Later...
button.setLoading(false);
```

## Events

### `button-click`
Fired when button is clicked. This is a custom event that fires for all button variants.

**Event Type:** `CustomEvent`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes (crosses shadow DOM boundary)

**Event Detail:**
```javascript
{
  button: HTMLElement // The button element that was clicked
}
```

**Example:**
```javascript
button.addEventListener('button-click', (e) => {
  console.log('Button clicked:', e.detail.button);
});
```

### `toggle-change`
Fired when toggle state changes (toggle variant only).

**Event Type:** `CustomEvent`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes (crosses shadow DOM boundary)

**Event Detail:**
```javascript
{
  state: Boolean // New toggle state (true = on, false = off)
}
```

**Example:**
```javascript
button.addEventListener('toggle-change', (e) => {
  console.log('Toggle state:', e.detail.state);
  if (e.detail.state) {
    console.log('Toggle is ON');
  } else {
    console.log('Toggle is OFF');
  }
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

  submitBtn.addEventListener('button-click', async () => {
    // Using setLoading() method (automatically preserves width)
    submitBtn.setLoading(true);

    try {
      await submitForm();
    } finally {
      submitBtn.setLoading(false);
    }
  });
</script>
```

### Custom Loader Types and Colors
```html
<!-- Spinner loader (default) -->
<t-btn loading loader-type="spinner">Loading...</t-btn>

<!-- Dots loader with custom color -->
<t-btn loading loader-type="dots" loader-color="#00ff41">Processing...</t-btn>

<!-- Bars loader -->
<t-btn loading loader-type="bars">Saving...</t-btn>
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

##### Recording Toggle with Custom Colors
```html
<t-btn
  variant="toggle"
  toggle-state="false"
  color-off="#808080"
  color-on="#ff0000">
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

  dynamicBtn.addEventListener('button-click', async () => {
    // Start loading (using setLoading method)
    dynamicBtn.setLoading(true);

    try {
      const result = await processData();

      // Success state - properties automatically trigger re-render
      dynamicBtn.setLoading(false);
      dynamicBtn.variant = 'secondary';
      dynamicBtn.setIcon(checkIcon);
      dynamicBtn.setText('Success!');

    } catch (error) {
      // Error state
      dynamicBtn.setLoading(false);
      dynamicBtn.variant = 'danger';
      dynamicBtn.setIcon(xIcon);
      dynamicBtn.setText('Error');
    }
  });
</script>
```

### Programmatic Control
```html
<t-btn id="myBtn">Click Me</t-btn>
<button onclick="controlButton()">Control Button</button>

<script type="module">
  const myBtn = document.getElementById('myBtn');

  function controlButton() {
    // Focus the button
    myBtn.focus();

    // Wait 1 second, then programmatically click it
    setTimeout(() => {
      myBtn.click(); // Triggers button-click event
    }, 1000);

    // Wait 2 seconds, then blur it
    setTimeout(() => {
      myBtn.blur();
    }, 2000);
  }

  // Listen for programmatic clicks
  myBtn.addEventListener('button-click', () => {
    console.log('Button was clicked (programmatically or by user)');
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

## Lifecycle Hooks

Component implements full Lit lifecycle with integrated logging:

### `constructor()`
Initializes component with default property values and logger.

### `connectedCallback()`
Called when component is added to the DOM. Applies custom colors and updates fixed width.

**Logging:** Logs "Connected to DOM" at INFO level

### `disconnectedCallback()`
Called when component is removed from the DOM.

**Logging:** Logs "Disconnected from DOM" at INFO level

### `firstUpdated(changedProperties)`
Called after the first render completes.

**Logging:** Logs "First update complete" at DEBUG level with changed properties

### `willUpdate(changedProperties)`
Called before each render. Manages fixed width during loading state transitions.

**Behavior:**
- Captures button width when loading starts (non-toggle variants)
- Clears fixed width when loading ends

### `updated(changedProperties)`
Called after each render. Triggers re-renders for icon/content changes.

**Behavior:**
- Re-renders if `_icon` changed
- Re-renders if slot content changed

```javascript
// Example: React to property changes
button.addEventListener('toggle-change', (e) => {
  // updated() was called after toggleState changed
  console.log('Toggle state updated:', e.detail.state);
});
```

## Logger Integration\n\nTButtonLit integrates with the componentLogger system for debugging and monitoring:\n\n```javascript\nimport TLog from './js/utils/ComponentLogger.js';\n\n// View current logger configuration\nTLog.config();\n\n// Enable debug logging for TButton\nTLog.setLevel('debug');\n\n// Logger outputs for TButton lifecycle:\n// [TButton] Component constructed\n// [TButton] Connected to DOM\n// [TButton] First update complete\n// [TButton] click called\n// [TButton] Emitting event { name: 'button-click', detail: {...} }\n// [TButton] Disconnected from DOM\n```\n\n**Log Levels:**\n- `debug` - Method calls, event emissions, property changes\n- `info` - Lifecycle events (connected, disconnected)\n- `warn` - Warnings\n- `error` - Errors\n- `trace` - Detailed trace information\n\n## Accessibility\n\n- Keyboard navigation support (Enter/Space to activate)\n- Disabled state prevents interaction\n- Focus states managed by browser\n- Toggle buttons maintain state in properties\n- Disabled buttons have reduced opacity (0.3)\n- `focus()` and `blur()` methods for programmatic focus control

## Component Architecture

### Schema Compliance

TButtonLit follows the **CORE Profile** of COMPONENT_SCHEMA.md:

- ✅ **Block 1**: Static Metadata (tagName, version, category)
- ✅ **Block 2**: Static Styles (complete CSS encapsulation)
- ✅ **Block 3**: Properties (15 reactive properties with reflection)
- ✅ **Block 4**: Internal State (_icon, _fixedWidth, _originalContent, _preLoadingWidth)
- ✅ **Block 5**: Logger Instance (componentLogger integration)
- ✅ **Block 6**: Constructor (initialization with logging)
- ✅ **Block 7**: Lifecycle Hooks (all hooks with logging)
- ✅ **Block 8**: Public API Methods (6 methods: click, focus, blur, setIcon, setText, setLoading)
- ✅ **Block 9**: Event Emitters (_emitEvent helper)
- ✅ **Block 12**: Render Methods (render with internal helpers)
- ✅ **Block 13**: Internal Helpers (_renderIcon, _renderLoader, etc.)

### Architecture Details

- **Base Class**: Extends `LitElement`
- **Shadow DOM**: Complete encapsulation via Lit
- **Style Management**: `static styles` CSS block (no external CSS)
- **Reactive Properties**: Automatic re-rendering on change
- **Property Reflection**: Key properties reflect to attributes for CSS selectors
- **Event System**: Custom events with bubbles + composed
- **Logging**: Integrated componentLogger for all lifecycle and method calls
- **Test Coverage**: 98.38% statement coverage, 100% function coverage

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
// button-click event is now automatically emitted
button.addEventListener('button-click', (e) => {
  console.log('Clicked:', e.detail.button);
});
```

### Key Changes
1. Component extends `LitElement` not `TComponent`
2. Use properties directly, not `setProp()`
3. `button-click` event now automatically emitted (custom event)
4. New methods: `click()`, `focus()`, `blur()`, `setText()`, `setLoading()`
5. New properties: `loaderType`, `loaderColor`, `colorOn`, `colorOff`, `textOn`, `textOff`
6. Property reflection: Key properties now reflect to attributes
7. Logger integration: All lifecycle and method calls logged
8. No external CSS loading - all styles in `static styles` block
9. Static metadata: `tagName`, `version`, `category` properties
10. Complete lifecycle hooks: `firstUpdated()` added

### Event Migration
```javascript
// OLD: Listen to native click event
button.addEventListener('click', (e) => { ... });

// NEW: Listen to button-click custom event (recommended)
button.addEventListener('button-click', (e) => {
  // e.detail.button contains the button element
});

// Note: Native click still works, but button-click provides
// consistent event structure across all button interactions
```

## Related Components

- [TPanelLit](./TPanelLit.md) - Panel component with action button auto-sizing
- [TInputLit](./TerminalInput.md) - Text input component
- [TDropdownLit](./TerminalDropdown.md) - Dropdown component

## Resources

- [Lit Documentation](https://lit.dev/)
- [Pure Lit Architecture](../API.md)
- [Component Creation Guide](../COMPONENT_CREATION_GUIDE.md)