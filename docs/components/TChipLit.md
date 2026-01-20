# TChipLit

A compact tag/chip component for displaying labels, filters, or selections with optional removal and selection states.

## Tag Names

- `t-chip`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-chip` |
| version | `3.0.0` |
| category | `Core` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `label` | `String` | `''` | Yes | Chip text content |
| `variant` | `String` | `'default'` | Yes | Color variant: `'default'`, `'success'`, `'warning'`, `'error'`, `'info'` |
| `size` | `String` | `'md'` | Yes | Size: `'sm'`, `'md'`, `'lg'` |
| `removable` | `Boolean` | `false` | Yes | Show remove button |
| `selectable` | `Boolean` | `false` | Yes | Enable selection |
| `selected` | `Boolean` | `false` | Yes | Selection state |
| `disabled` | `Boolean` | `false` | Yes | Disable interactions |
| `icon` | `String` | `''` | No | Icon SVG string (left side) |
| `avatar` | `String` | `''` | No | Avatar image URL |
| `autoRemove` | `Boolean` | `true` | Yes | Auto-remove from DOM when remove button clicked |
| `shape` | `String` | `'pill'` | Yes | Shape variant: `'pill'` (rounded), `'tag'` (left accent), `'square'` |

## Methods

### select()
Select the chip.

**Fires:** `chip-select`

### deselect()
Deselect the chip.

**Fires:** `chip-select`

### toggle()
Toggle selection state.

**Fires:** `chip-select`

### requestRemove()
Request chip removal (triggers event, auto-removes if enabled).

**Fires:** `chip-remove`

## Events

### chip-click
Fired when chip is clicked.

```javascript
{
  detail: {
    label: 'Tag Name',
    selected: false
  }
}
```

### chip-select
Fired when selection state changes.

```javascript
{
  detail: {
    label: 'Tag Name',
    selected: true
  }
}
```

### chip-remove
Fired when remove button is clicked.

```javascript
{
  detail: {
    label: 'Tag Name'
  }
}
```

## Examples

### Basic Chip

```html
<t-chip label="Tag"></t-chip>
```

### Chip Variants

```html
<t-chip label="Default" variant="default"></t-chip>
<t-chip label="Success" variant="success"></t-chip>
<t-chip label="Warning" variant="warning"></t-chip>
<t-chip label="Error" variant="error"></t-chip>
<t-chip label="Info" variant="info"></t-chip>
```

### Sizes

```html
<t-chip label="Small" size="sm"></t-chip>
<t-chip label="Medium" size="md"></t-chip>
<t-chip label="Large" size="lg"></t-chip>
```

### Removable Chip

```html
<t-chip
  label="Removable"
  removable
  @chip-remove=${handleRemove}>
</t-chip>
```

### Auto-Remove Chip

```html
<t-chip label="Click to Remove" removable auto-remove></t-chip>
```

### Selectable Filter Chips

```html
<t-chip
  label="JavaScript"
  selectable
  ?selected=${filters.includes('js')}
  @chip-select=${handleFilter}>
</t-chip>
<t-chip
  label="Python"
  selectable
  ?selected=${filters.includes('py')}
  @chip-select=${handleFilter}>
</t-chip>
```

### With Icon

```html
<t-chip label="Settings" icon="gear"></t-chip>
<t-chip label="User" icon="user"></t-chip>
```

### With Avatar

```html
<t-chip label="John Doe" avatar="/avatars/john.png"></t-chip>
```

### Different Shapes

```html
<t-chip label="Pill" shape="pill"></t-chip>
<t-chip label="Tag" shape="tag"></t-chip>
<t-chip label="Square" shape="square"></t-chip>
```

### Disabled Chip

```html
<t-chip label="Disabled" disabled></t-chip>
```

### Chip Group (Filter Example)

```html
<div class="chip-group">
  ${tags.map(tag => html`
    <t-chip
      label=${tag.name}
      selectable
      removable
      ?selected=${tag.selected}
      @chip-select=${() => toggleTag(tag)}
      @chip-remove=${() => removeTag(tag)}>
    </t-chip>
  `)}
</div>
```

### Programmatic Control

```javascript
const chip = document.querySelector('t-chip');

// Selection
chip.select();
chip.deselect();
chip.toggle();

// Remove
chip.requestRemove();

// Listen for events
chip.addEventListener('chip-click', (e) => {
  console.log('Clicked:', e.detail.label);
});

chip.addEventListener('chip-select', (e) => {
  console.log('Selected:', e.detail.label, e.detail.selected);
});

chip.addEventListener('chip-remove', (e) => {
  console.log('Removed:', e.detail.label);
});
```

## Slots

None.


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--chip-bg` | `var(--terminal-gray-dark)` | Background color |
| `--chip-border` | `var(--terminal-gray)` | Border color |
| `--chip-color` | `var(--terminal-green)` | Accent/selected color |
| `--chip-text` | `var(--terminal-white)` | Text color |

## Related Components

- [TBadgeLit](./TBadgeLit.md) - Simple badge
- [TAvatarLit](./TAvatarLit.md) - Avatar display
