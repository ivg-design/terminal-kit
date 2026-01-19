# TPanelLit - Pure Lit Panel Component

**IMPORTANT: This is a Pure Lit component following strict architectural principles. Do NOT violate these rules.**

## Architecture: Pure Lit (Zero FOUC, Fully Encapsulated)

### Critical Architecture Rules

1. **ALL styles MUST be in the `static styles` CSS block** - NO external stylesheets
2. **Shadow DOM only** - All styles are encapsulated, no style leakage
3. **Reactive properties** - Use Lit's `static properties` for all component state
4. **No manual style adoption** - Lit handles everything automatically
5. **Zero FOUC** - Styles are adopted before first render by Lit's internal mechanisms
6. **No `:not(:defined)` hacks needed** - Lit manages component registration
7. **Slots for content distribution** - Light DOM content projected via named slots

### Why These Rules Matter

This component was migrated from a hybrid Declarative Shadow DOM + StyleSheetManager architecture to Pure Lit because:
- **Zero FOUC guarantee** - Lit adopts styles before first paint
- **True encapsulation** - Shadow DOM isolation prevents style conflicts
- **Reactive by design** - Property changes automatically trigger re-renders
- **Maintainable** - Single source of truth (component file)
- **Performant** - Lit optimizes rendering and style adoption

**DO NOT** try to add external stylesheets, manipulate Shadow DOM manually, or bypass Lit's reactivity system.

## Tag Name

```html
<t-pnl></t-pnl>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | `''` | Panel header title |
| `variant` | string | `'standard'` | Panel variant: 'standard', 'headless' |
| `collapsible` | boolean | `false` | Whether panel can collapse |
| `collapsed` | boolean | `false` | Current collapsed state |
| `compact` | boolean | `false` | Compact mode (20px header) |
| `large` | boolean | `false` | Large mode (36px header) |
| `loading` | boolean | `false` | Show loading state |
| `icon` | string | `''` | SVG icon string for header |
| `footerCollapsed` | boolean | `false` | Footer collapsed state (attribute: `footer-collapsed`) |

### Property Details

#### `variant`
- **'standard'**: Default panel with header and border decorations `[ title ]`
- **'headless'**: No header, just content container

#### Size Modes
- **Default (standard)**: 28px header height, 18px action buttons, 16px collapse button
- **compact**: 20px header height, 14px action buttons, 16px collapse button
- **large**: 36px header height, 20px action buttons, 20px collapse button

## Methods

### Core Methods

#### `expand()`
Expands the panel.

```javascript
const panel = document.querySelector('t-pnl');
panel.expand();
```

#### `collapse()`
Collapses the panel.

```javascript
panel.collapse();
```

#### `toggleCollapse()`
Toggles panel collapsed state.

**Returns:** `boolean` - New collapsed state

```javascript
const isCollapsed = panel.toggleCollapse();
```

#### `startLoading()`
Shows loading state.

```javascript
panel.startLoading();
// ... async operation
```

#### `stopLoading()`
Hides loading state.

```javascript
panel.stopLoading();
```

### Footer Methods

#### `toggleFooterCollapse()`
Toggles the footer collapsed state (slides down when collapsed, up when expanded).

**Returns:** `boolean` - New footer collapsed state

```javascript
const footerCollapsed = panel.toggleFooterCollapse();
console.log('Footer collapsed:', footerCollapsed);
```

### Context Methods

#### `receiveContext(context)`
Receives context from a parent component (for nesting support).

**Parameters:**
- `context` (Object): Context object with `size` ('compact', 'large', 'default') and `variant`

```javascript
panel.receiveContext({ size: 'compact', variant: 'standard' });
```

## Events

### `panel-collapsed`
Fired when panel is collapsed or expanded.

**Detail:** `{ collapsed: boolean }`

```javascript
panel.addEventListener('panel-collapsed', (e) => {
  console.log('Panel collapsed:', e.detail.collapsed);
});
```

### `panel-footer-collapsed`
Fired when panel footer is collapsed or expanded via `toggleFooterCollapse()`.

**Detail:** `{ footerCollapsed: boolean }`

```javascript
panel.addEventListener('panel-footer-collapsed', (e) => {
  console.log('Footer collapsed:', e.detail.footerCollapsed);
});
```

### `panel-loading-start`
Fired when loading state starts.

**Detail:** `{}`

```javascript
panel.addEventListener('panel-loading-start', (e) => {
  console.log('Panel loading started');
});
```

### `panel-loading-end`
Fired when loading state ends.

**Detail:** `{}`

```javascript
panel.addEventListener('panel-loading-end', (e) => {
  console.log('Panel loading ended');
});
```

## Slots

### `default` (unnamed slot)
Main panel content. Supports nesting other panels.

```html
<t-pnl title="Panel">
  <p>Main content goes here</p>
</t-pnl>
```

### `actions`
Header action buttons (automatically sized based on panel variant).

```html
<t-pnl title="Panel" compact>
  <div slot="actions">
    <t-btn type="icon" id="settings"></t-btn>
    <t-btn type="icon" id="close"></t-btn>
  </div>
  <p>Content</p>
</t-pnl>
```

**Important:** Action buttons are **automatically resized** by the panel:
- Standard panel: `size="small"` (20px buttons)
- Compact panel: `size="xs"` (16px buttons)
- Large panel: default size (28px buttons)

### `footer`
Footer content with collapse functionality.

```html
<t-pnl title="Panel">
  <p>Main content</p>
  <div slot="footer">
    <span>Status: Ready</span>
  </div>
</t-pnl>
```

The footer automatically includes:
- Collapse button (caret-down icon)
- Slide-down animation when collapsed
- Reopen tab at bottom when collapsed

## CSS Architecture

### Internal CSS Classes (for reference)

These classes are internal to the component. **DO NOT** try to style them from outside.

- `.t-pnl` - Main panel container (flex column)
- `.t-pnl--collapsible` - Collapsible panel
- `.t-pnl--collapsed` - Collapsed state
- `.t-pnl--compact` - Compact size mode
- `.t-pnl--large` - Large size mode
- `.t-pnl--standard` - Standard variant
- `.t-pnl__header` - Header area (flex row, vertically centered)
- `.t-pnl__collapse-btn` - Header collapse button (16px, caret icon)
- `.t-pnl__title` - Title text
- `.t-pnl__actions` - Action buttons container
- `.t-pnl__body` - Content area (flex: 1)
- `.t-pnl__footer` - Footer area (slides with transform)
- `.t-pnl__footer--collapsed` - Footer collapsed (translateY(100%))
- `.t-pnl__footer-collapse` - Footer collapse button
- `.t-pnl__footer-reopen` - Footer reopen tab

### Size Specifications

#### Header Heights
| Mode | Height | Padding | Collapse Button |
|------|--------|---------|-----------------|
| Standard | 28px | 6px 12px | 16×16px |
| Compact | 20px | 3px 8px | 16×16px |
| Large | 36px | 9px 12px | 20×20px |

#### Footer Heights (matches header)
| Mode | Height | Padding |
|------|--------|---------|
| Standard | 28px | 6px 12px |
| Compact | 20px | 3px 8px |
| Large | 36px | 9px 12px |

#### Action Button Sizes (auto-set by panel)
| Panel Mode | Button Size | Height |
|------------|-------------|--------|
| Standard | small | 20px |
| Compact | xs | 16px |
| Large | default | 28px |

### CSS Variables

The component uses these CSS variables from the design system:

```css
--terminal-black: #0a0a0a
--terminal-black-light: #1a1a1a
--terminal-green: #00ff41
--terminal-green-bright: #33ff66
--terminal-green-dim: #00cc33
--terminal-green-dark: #008820
--terminal-gray: #808080
--terminal-gray-dark: #242424
--terminal-gray-light: #333333
--terminal-font: 'SF Mono', Monaco, monospace
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
```

## Examples

### Basic Panel with Header

```html
<t-pnl title="Settings" collapsible>
  <div slot="actions">
    <t-btn type="icon" id="closeBtn"></t-btn>
  </div>
  <p>Panel content here</p>
</t-pnl>

<script type="module">
  import { xIcon } from './js/utils/phosphor-icons.js';

  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn && closeBtn.setIcon) {
    closeBtn.setIcon(xIcon);
  }
</script>
```

### Compact Panel

```html
<t-pnl title="Compact Panel" collapsible compact>
  <div slot="actions">
    <t-btn type="icon" id="btn1"></t-btn>
    <t-btn type="icon" id="btn2"></t-btn>
  </div>
  <p>Content with 20px header and xs buttons (auto-sized)</p>
</t-pnl>
```

### Large Panel

```html
<t-pnl title="Large Panel" collapsible large>
  <div slot="actions">
    <t-btn type="icon" id="btn1"></t-btn>
  </div>
  <p>Content with 36px header and default-sized buttons (auto-sized)</p>
</t-pnl>
```

### Headless Panel

```html
<t-pnl variant="headless">
  <div style="padding: 20px;">
    <h3>Custom Content</h3>
    <p>No header, just styled container</p>
  </div>
</t-pnl>
```

### Panel with Footer

```html
<t-pnl title="Panel with Footer" collapsible>
  <p>Main content area</p>

  <div slot="footer">
    <span style="opacity: 0.7;">Status: Ready</span>
    <span style="margin-left: auto;">100% Complete</span>
  </div>
</t-pnl>
```

Footer features:
- Collapse button (caret-down) automatically added on right
- Slides down with `transform: translateY(100%)` when collapsed
- Reopen tab appears at bottom-right when collapsed
- Collapse/expand animates smoothly (0.3s ease-out)

### Collapsible Panel (Initially Collapsed)

```html
<t-pnl title="Initially Collapsed" collapsible collapsed>
  <p>This panel starts collapsed</p>
</t-pnl>
```

### Panel with Icon

```html
<t-pnl title="File Browser" collapsible>
  <div slot="actions">
    <t-btn type="icon" id="refreshBtn"></t-btn>
  </div>
  <ul>
    <li>file1.js</li>
    <li>file2.css</li>
  </ul>
</t-pnl>
```

### Nested Panels

```html
<t-pnl title="Parent Panel" collapsible>
  <t-pnl title="Child Panel 1" collapsible compact>
    <p>Nested content 1</p>
  </t-pnl>

  <t-pnl title="Child Panel 2" collapsible compact>
    <p>Nested content 2</p>
  </t-pnl>
</t-pnl>
```

### Loading State

```html
<t-pnl title="Data Panel" id="dataPanel">
  <p>Loading data...</p>
</t-pnl>

<script>
  const panel = document.getElementById('dataPanel');
  panel.startLoading();

  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      panel.stopLoading();
      // Update content
    });
</script>
```

### Programmatic Control

```html
<t-pnl title="Control Panel" id="myPanel" collapsible>
  <p>Content here</p>
  <div slot="footer">
    <span>Footer content</span>
  </div>
</t-pnl>

<button id="togglePanel">Toggle Panel</button>
<button id="toggleFooter">Toggle Footer</button>

<script>
  const panel = document.getElementById('myPanel');

  document.getElementById('togglePanel').addEventListener('click', () => {
    panel.toggleCollapse();
  });

  document.getElementById('toggleFooter').addEventListener('click', () => {
    panel.toggleFooterCollapse();
  });
</script>
```

## Action Button Auto-Sizing

The panel automatically resizes action buttons in the `actions` slot based on its size mode:

```html
<!-- Standard panel - buttons become size="small" -->
<t-pnl title="Standard">
  <div slot="actions">
    <t-btn type="icon"></t-btn> <!-- Auto: 20px -->
  </div>
</t-pnl>

<!-- Compact panel - buttons become size="xs" -->
<t-pnl title="Compact" compact>
  <div slot="actions">
    <t-btn type="icon"></t-btn> <!-- Auto: 16px -->
  </div>
</t-pnl>

<!-- Large panel - buttons stay default -->
<t-pnl title="Large" large>
  <div slot="actions">
    <t-btn type="icon"></t-btn> <!-- Auto: 28px -->
  </div>
</t-pnl>
```

This happens automatically via:
1. `firstUpdated()` - Listens for slot changes
2. `updated()` - Watches for `compact`/`large` property changes
3. `_updateActionButtonSizes()` - Sets button `size` attributes

**Implementation:**
```javascript
// Panel searches for buttons in actions slot (including nested in divs)
const buttons = actionsSlot.querySelectorAll('t-btn');

// Sets size based on panel mode
if (compact) btn.setAttribute('size', 'xs');
else if (large) btn.removeAttribute('size');
else btn.setAttribute('size', 'small');
```

## Footer Collapse Behavior

The footer uses a slide-down animation:

1. **Expanded State:**
   - `transform: translateY(0)` - Visible at bottom
   - Collapse button (caret-down) visible on right
   - Full content visible

2. **Collapsed State:**
   - `transform: translateY(100%)` - Slid down out of view
   - Reopen tab visible at bottom-right edge
   - Panel height stays constant (body grows)

3. **Animation:**
   - `transition: transform 0.3s ease-out`
   - Smooth slide up/down
   - Panel uses `overflow: hidden` to clip footer

4. **Reopen Tab:**
   - Positioned `bottom: 100%` relative to footer
   - 32px × 16px clickable area
   - Caret-up icon
   - Visible when footer collapsed

## Accessibility

- Keyboard navigation for collapse buttons
- ARIA labels on collapse/expand buttons
- Proper focus management
- Screen reader announcements for state changes
- Keyboard shortcuts: Enter/Space to toggle on focused header

## Browser Support

- Chrome 67+ (full support)
- Firefox 63+ (full support)
- Safari 10.1+ (full support)
- Edge 79+ (full support)

Requires:
- Custom Elements v1
- Shadow DOM v1
- ES6 Modules
- Lit 3.x

## Migration from Old TerminalPanel

If migrating from the old hybrid component:

### Breaking Changes

1. **Tag name changed:** `<terminal-panel>` → `<t-pnl>`
2. **Slot names changed:**
   - `header-actions` → `actions`
   - `content` → default slot
   - `status-bar` → removed (status bar is separate component)
3. **Mode removed:** Use `variant` instead
4. **Custom elements lifecycle:** No `attributeChangedCallback` needed
5. **Styles:** All internal, remove external panel.css imports

### Property Mapping

| Old | New |
|-----|-----|
| `mode="with-header"` | `variant="standard"` (default) |
| `mode="headless"` | `variant="headless"` |
| `mode="with-status-bar"` | Use `slot="footer"` |
| `compact` | `compact` (same) |
| `collapsible` | `collapsible` (same) |
| `collapsed` | `collapsed` (same) |

### Code Changes

**Before:**
```html
<terminal-panel mode="with-header" title="Panel" compact>
  <div slot="header-actions">
    <button>X</button>
  </div>
  <div slot="content">
    <p>Content</p>
  </div>
</terminal-panel>
```

**After:**
```html
<t-pnl title="Panel" compact collapsible>
  <div slot="actions">
    <t-btn type="icon" id="closeBtn"></t-btn>
  </div>
  <p>Content</p>
</t-pnl>
```

## Implementation Notes

### Lit Reactivity

Properties trigger automatic re-renders:
```javascript
// These all trigger component updates
panel.collapsed = true;
panel.title = "New Title";
panel.compact = true;
panel.footerCollapsed = true;
```

### Shadow DOM Encapsulation

Styles are completely isolated:
```javascript
// This WON'T work (Shadow DOM boundary)
document.querySelector('.t-pnl__header').style.color = 'red';

// Use properties instead
panel.style.setProperty('--terminal-green', 'red');
```

### Slot Content

Slotted content is Light DOM, styles apply:
```html
<t-pnl>
  <!-- This content is NOT in Shadow DOM -->
  <!-- Your styles apply here -->
  <p style="color: blue;">Styled content</p>
</t-pnl>
```

### Component Registration

Component auto-registers as `t-pnl`:
```javascript
// Defined in TPanelLit.js
if (!customElements.get('t-pnl')) {
  customElements.define('t-pnl', TPanelLit);
}
```

## Performance Notes

- **First paint:** Zero FOUC - Lit adopts styles before render
- **Updates:** Lit optimizes re-renders to changed properties only
- **Memory:** Shadow DOM per instance (isolated styles)
- **Nested panels:** Each maintains own Shadow DOM tree

## Troubleshooting

### Action buttons not resizing
- Ensure buttons are `t-btn` elements
- Check console for `[TPanelLit] Sizing N action buttons` logs
- Verify buttons are in `<div slot="actions">`

### Footer not collapsing
- Panel needs `overflow: hidden` (set automatically)
- Check `footerCollapsed` property
- Verify footer content is in `<div slot="footer">`

### Styles not applying
- Remember: Shadow DOM isolation
- Use CSS variables to customize
- Don't try to style internal classes from outside

### Panel not rendering
- Check browser console for errors
- Verify Lit is imported
- Ensure custom element is defined
- Check for JavaScript module errors

## Advanced Usage

### Custom Styling via CSS Variables

```html
<t-pnl title="Custom Colors" style="
  --terminal-green: #00ff00;
  --terminal-gray-dark: #1a1a1a;
">
  <p>Custom themed panel</p>
</t-pnl>
```

### Dynamic Content Updates

```javascript
const panel = document.getElementById('myPanel');

// Update title
panel.title = 'New Title';

// Toggle collapsed
panel.collapsed = !panel.collapsed;

// Change variant
panel.variant = 'headless';
```

### Event Handling

```javascript
panel.addEventListener('panel-collapsed', (e) => {
  console.log('Collapsed:', e.detail.collapsed);
  localStorage.setItem('panelState', e.detail.collapsed);
});

// Restore state
const savedState = localStorage.getItem('panelState');
if (savedState) {
  panel.collapsed = savedState === 'true';
}
```

---

**Last Updated:** 2025-09-27
**Component Version:** TPanelLit (Pure Lit Architecture)
**Lit Version:** 3.x