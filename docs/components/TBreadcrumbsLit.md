# TBreadcrumbsLit (t-bread)

A **Pure Lit** navigation breadcrumb component with multiple style variants and separator options. Built with Lit 3.x for terminal/cyberpunk styling.

## Architecture

**CRITICAL:** This is a **Pure Lit Component**:
- ✅ Extends `LitElement`
- ✅ All styles in `static styles` CSS block
- ✅ Zero FOUC (Flash of Unstyled Content)
- ✅ Complete Shadow DOM encapsulation

## Tag Names
```html
<t-bread></t-bread>
```

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-bread` |
| version | `1.0.0` |
| category | `Navigation` |

## Properties

| Property | Type | Default | Attribute | Reflects | Description |
|----------|------|---------|-----------|----------|-------------|
| `items` | Array | `[]` | - | - | Array of breadcrumb items `{label: string, href?: string, icon?: string}` |
| `variant` | String | `'default'` | `variant` | ✅ | Visual style variant (see Variants section) |
| `size` | String | `'md'` | `size` | ✅ | Size: 'sm', 'md', 'lg' |
| `separator` | String | `''` | `separator` | - | Custom separator character/string |
| `maxItems` | Number | `0` | `max-items` | - | Maximum items to show before collapsing (0 = no collapse) |
| `preventNavigation` | Boolean | `false` | `prevent-navigation` | ✅ | Prevent default navigation on link clicks (emit events only) |
| `disabled` | Boolean | `false` | `disabled` | ✅ | Disabled state |

### Items Array Structure

Each item in the `items` array should have the following structure:

```javascript
{
  label: 'Item Label',     // Required: Display text
  href: '/path/to/page',   // Optional: Link URL
  icon: '<svg>...</svg>'   // Optional: SVG icon string or text
}
```

## Methods

### navigateTo(index)
Programmatically navigate to a specific breadcrumb item.

**Parameters:**
- `index` (Number): Index of the item to navigate to

**Fires:** `breadcrumb-navigate`

### expand()
Expand collapsed breadcrumbs to show all items.

### collapse()
Collapse breadcrumbs back to the condensed view (respects `maxItems`).

## Events

### `breadcrumb-click`
Fired when any breadcrumb item is clicked.

**Event Detail:**
```javascript
{
  index: Number,  // Index of clicked item
  item: Object    // The item object {label, href?, icon?}
}
```

### `breadcrumb-navigate`
Fired when `navigateTo()` method is called.

**Event Detail:**
```javascript
{
  index: Number,  // Index of navigated item
  item: Object    // The item object {label, href?, icon?}
}
```

### `breadcrumb-expand`
Fired when collapsed breadcrumbs are expanded (ellipsis clicked).

**Event Detail:**
```javascript
{}
```

## CSS Custom Properties

```css
:root {
  --bread-bg: transparent;                          /* Background color */
  --bread-color: var(--terminal-gray-light, #888);  /* Text color for non-active items */
  --bread-active: var(--terminal-green, #00ff41);   /* Color for active/current item */
  --bread-hover: var(--terminal-cyan, #00ffff);     /* Hover color */
  --bread-separator: var(--terminal-gray, #666);    /* Separator color */
  --bread-glow: rgba(0, 255, 65, 0.2);              /* Glow effect on hover */
}
```

## Variants

The component supports 9 visual style variants:

| Variant | Description |
|---------|-------------|
| `default` | Slash (`/`) separator |
| `arrows` | Chevron arrow (`>`) separator with SVG |
| `dots` | Bullet point (`•`) separator |
| `dashes` | Em dash (`—`) separator |
| `brackets` | Terminal-style items wrapped in `[brackets]` |
| `pills` | Button-like pill styling for each item |
| `path` | File path style with leading `>` prompt |
| `steps` | Numbered steps with circular indicators |
| `underline` | Minimal underlined links with `›` separator |

## Examples

### Basic Usage
```html
<t-bread .items=${[
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Laptops' }
]}></t-bread>
```

### Variant: Default (Slash Separator)
```html
<t-bread variant="default" .items=${[
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Current Page' }
]}></t-bread>
```
Output: `Home / Category / Current Page`

### Variant: Arrows (Chevron Separator)
```html
<t-bread variant="arrows" .items=${[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile' }
]}></t-bread>
```
Output: `Dashboard > Settings > Profile`

### Variant: Dots (Bullet Separator)
```html
<t-bread variant="dots" .items=${[
  { label: 'Start', href: '#' },
  { label: 'Middle', href: '#' },
  { label: 'End' }
]}></t-bread>
```
Output: `Start • Middle • End`

### Variant: Dashes (Em Dash Separator)
```html
<t-bread variant="dashes" .items=${[
  { label: 'Root', href: '#' },
  { label: 'Branch', href: '#' },
  { label: 'Leaf' }
]}></t-bread>
```
Output: `Root — Branch — Leaf`

### Variant: Brackets (Terminal Style)
```html
<t-bread variant="brackets" .items=${[
  { label: 'usr', href: '#' },
  { label: 'local', href: '#' },
  { label: 'bin' }
]}></t-bread>
```
Output: `[usr][local][bin]`

### Variant: Pills (Button-Like)
```html
<t-bread variant="pills" .items=${[
  { label: 'All', href: '#' },
  { label: 'Active', href: '#' },
  { label: 'Completed' }
]}></t-bread>
```
Items displayed as rounded pill buttons with the current item highlighted.

### Variant: Path (File Path Style)
```html
<t-bread variant="path" .items=${[
  { label: 'home', href: '#' },
  { label: 'user', href: '#' },
  { label: 'documents' }
]}></t-bread>
```
Output: `> home/user/documents`

### Variant: Steps (Numbered Progress)
```html
<t-bread variant="steps" .items=${[
  { label: 'Cart', href: '#' },
  { label: 'Shipping', href: '#' },
  { label: 'Payment', href: '#' },
  { label: 'Confirmation' }
]}></t-bread>
```
Items displayed with numbered circular indicators (1, 2, 3, 4) connected by lines.

### Variant: Underline (Minimal Style)
```html
<t-bread variant="underline" .items=${[
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Article Title' }
]}></t-bread>
```
Links displayed with dashed underlines, current item with solid underline.

## Size Variants

```html
<!-- Small -->
<t-bread size="sm" .items=${items}></t-bread>

<!-- Medium (default) -->
<t-bread size="md" .items=${items}></t-bread>

<!-- Large -->
<t-bread size="lg" .items=${items}></t-bread>
```

## Collapsing Feature

When you have many breadcrumb items, use `max-items` to collapse middle items into an ellipsis:

```html
<!-- Collapse when more than 3 items -->
<t-bread max-items="3" .items=${[
  { label: 'Home', href: '/' },
  { label: 'Category', href: '/category' },
  { label: 'Subcategory', href: '/category/sub' },
  { label: 'Products', href: '/category/sub/products' },
  { label: 'Item Details' }
]}></t-bread>
```
Output: `Home / ... / Item Details`

Clicking the `...` expands to show all items.

### Programmatic Expand/Collapse
```javascript
const breadcrumbs = document.querySelector('t-bread');

// Expand all items
breadcrumbs.expand();

// Collapse back
breadcrumbs.collapse();
```

## Custom Separator

Override the default separator with any character or string:

```html
<!-- Double arrow -->
<t-bread separator=" >> " .items=${items}></t-bread>

<!-- Pipe -->
<t-bread separator=" | " .items=${items}></t-bread>

<!-- Tilde -->
<t-bread separator=" ~ " .items=${items}></t-bread>

<!-- Custom emoji or symbol -->
<t-bread separator=" → " .items=${items}></t-bread>
```

**Note:** Custom `separator` takes precedence over variant-specific separators.

## Items with Icons

```html
<t-bread .items=${[
  {
    label: 'Home',
    href: '/',
    icon: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>'
  },
  { label: 'Profile' }
]}></t-bread>
```

## Event Handling

```javascript
const breadcrumbs = document.querySelector('t-bread');

// Listen for clicks
breadcrumbs.addEventListener('breadcrumb-click', (e) => {
  console.log('Clicked item:', e.detail.item.label);
  console.log('Index:', e.detail.index);
});

// Listen for expansion
breadcrumbs.addEventListener('breadcrumb-expand', () => {
  console.log('Breadcrumbs expanded');
});

// Programmatic navigation
breadcrumbs.addEventListener('breadcrumb-navigate', (e) => {
  console.log('Navigating to:', e.detail.item.label);
});
```

## Disabled State

```html
<t-bread disabled .items=${items}></t-bread>
```

When disabled:
- Opacity reduced to 50%
- All pointer events disabled
- No hover or click interactions

## Accessibility

- Uses semantic `<nav>` element with `aria-label="Breadcrumb"`
- Links are properly focusable and keyboard navigable
- Current page item is rendered as `<span>` instead of `<a>` to indicate non-navigable
- High contrast colors for visibility

## Related Components

- [TTabsLit](./TTabsLit.md) - Tab navigation
- [TNavLit](./TNavLit.md) - Main navigation
- [TMenuLit](./TMenuLit.md) - Dropdown menus
