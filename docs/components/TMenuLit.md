# TMenuLit

A dropdown/context menu component with terminal styling, supporting nested items, search filtering, and keyboard navigation.

## Tag Name

`t-menu`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-menu` |
| version | `3.0.0` |
| category | `Core` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `items` | `Array` | `[]` | No | Menu items array |
| `trigger` | `String` | `'click'` | Yes | Open trigger: `'click'`, `'hover'`, `'context'` |
| `position` | `String` | `'bottom-start'` | Yes | Menu position relative to trigger |
| `open` | `Boolean` | `false` | Yes | Whether menu is open |
| `searchable` | `Boolean` | `false` | Yes | Enable search filtering |
| `maxHeight` | `String` | `'300px'` | No | Maximum menu height (CSS value) |

### Item Object Structure

```javascript
{
  id: 'item-1',        // Unique identifier
  label: 'Item Label', // Display text
  icon: 'icon-name',   // Optional icon
  shortcut: 'Ctrl+S',  // Optional keyboard shortcut display
  disabled: false,     // Disable item
  divider: false,      // Render as divider
  group: 'Group Name', // Render as group header
  selected: false,     // Mark item as selected
  children: []         // Nested items (submenu)
}
```

## Methods

### show()
Open the menu.

**Fires:** `menu-open`

### hide()
Close the menu.

**Fires:** `menu-close`

### toggle()
Toggle menu visibility.

**Fires:** `menu-open` or `menu-close`

### selectItem(itemId)
Programmatically select an item.

**Parameters:**
- `itemId` (String): ID of item to select

**Fires:** `menu-select`

## Events

### menu-select
Fired when an item is selected.

```javascript
{
  detail: {
    id: 'edit',
    label: 'Edit',
    item: { id: 'edit', label: 'Edit', ... }
  }
}
```

### menu-open
Fired when menu opens.

```javascript
{
  detail: {}
}
```

### menu-close
Fired when menu closes.

```javascript
{
  detail: {}
}
```

## Examples

### Basic Dropdown Menu

```html
<t-menu .items=${[
  { id: 'new', label: 'New File', icon: 'file' },
  { id: 'open', label: 'Open...', icon: 'folder' },
  { divider: true },
  { id: 'save', label: 'Save', icon: 'save' },
  { id: 'exit', label: 'Exit' }
]}>
  <t-button slot="trigger">File</t-button>
</t-menu>
```

### Context Menu

```html
<t-menu trigger="context" .items=${contextItems}>
  <div slot="trigger" class="context-area">
    Right-click here
  </div>
</t-menu>
```

### Nested Submenu

```html
<t-menu .items=${[
  { id: 'edit', label: 'Edit' },
  {
    id: 'view',
    label: 'View',
    children: [
      { id: 'zoom-in', label: 'Zoom In' },
      { id: 'zoom-out', label: 'Zoom Out' },
      { id: 'reset', label: 'Reset Zoom' }
    ]
  },
  { id: 'help', label: 'Help' }
]}>
  <t-button slot="trigger">Menu</t-button>
</t-menu>
```

### Searchable Menu

```html
<t-menu searchable .items=${longItemList} max-height="400px">
  <t-button slot="trigger">Select Item</t-button>
</t-menu>
```

### Hover Trigger

```html
<t-menu trigger="hover" position="right-start" .items=${items}>
  <span slot="trigger">Hover me</span>
</t-menu>
```

### Programmatic Control

```javascript
const menu = document.querySelector('t-menu');

// Open/close
menu.show();
menu.hide();
menu.toggle();

// Select item
menu.selectItem('save');

// Listen for selection
menu.addEventListener('menu-select', (e) => {
  console.log('Selected:', e.detail.item.label);
});
```

## Slots

| Slot | Description |
|------|-------------|
| `trigger` | Element that triggers the menu |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Select focused item |
| `ArrowDown` | Move focus down |
| `ArrowUp` | Move focus up |
| `ArrowRight` | Open submenu |
| `ArrowLeft` | Close submenu |
| `Escape` | Close menu |
| `Home` | Focus first item |
| `End` | Focus last item |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--menu-bg` | `var(--terminal-gray-darkest)` | Menu background color |
| `--menu-border` | `var(--terminal-gray-dark)` | Border color |
| `--menu-green` | `var(--terminal-green)` | Primary accent color |
| `--menu-green-dim` | `var(--terminal-green-dim)` | Dimmed accent color |
| `--menu-amber` | `var(--terminal-amber)` | Amber accent color |
| `--menu-red` | `var(--terminal-red)` | Red accent color |
| `--menu-cyan` | `var(--terminal-cyan)` | Cyan accent color |
| `--menu-gray` | `var(--terminal-gray)` | Gray text color |
| `--menu-radius` | `4px` | Border radius |
| `--menu-shadow` | `0 4px 16px rgba(0, 0, 0, 0.5)` | Box shadow |
| `--menu-max-height` | `300px` | Maximum menu height |

## Related Components

- [TButtonLit](./TButtonLit.md) - Button trigger
- [TListLit](./TListLit.md) - List display
