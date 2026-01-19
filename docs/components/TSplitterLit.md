# TSplitterLit

A resizable panel divider component that allows users to adjust the size of adjacent panels by dragging a gutter.

## Tag Name

`t-split`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-split` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `orientation` | `String` | `'horizontal'` | Yes | Layout direction: `'horizontal'` or `'vertical'` |
| `sizes` | `Array` | `[50, 50]` | No | Pane sizes as percentages [pane-0, pane-1] |
| `minSizes` | `Array` | `[50, 50]` | No | Minimum sizes for each pane in pixels (attribute: `min-sizes`) |
| `collapsible` | `Array` | `[false, false]` | No | Whether each pane can be collapsed [pane-0, pane-1] |
| `collapsed` | `Array` | `[false, false]` | No | Collapsed state for each pane [pane-0, pane-1] |
| `gutterSize` | `Number` | `8` | No | Size of the drag gutter in pixels (attribute: `gutter-size`) |
| `snapOffset` | `Number` | `30` | No | Distance in pixels to trigger snap-to-collapse (attribute: `snap-offset`) |
| `storageKey` | `String` | `''` | No | localStorage key for persisting sizes (attribute: `storage-key`) |

## Methods

### setSizes(sizes)
Set pane sizes programmatically.

**Parameters:**
- `sizes` (Array): Array of percentage values [pane-0, pane-1]

**Fires:** `resize`

### collapse(index)
Collapse a specific pane.

**Parameters:**
- `index` (Number): Pane index to collapse (0 or 1)

**Fires:** `collapse`

### expand(index)
Expand a collapsed pane.

**Parameters:**
- `index` (Number): Pane index to expand (0 or 1)

**Fires:** `collapse`

### toggleCollapse(index)
Toggle collapse state of a pane.

**Parameters:**
- `index` (Number): Pane index to toggle (0 or 1)

**Fires:** `collapse`

### reset()
Reset to default sizes (50/50) and expand all panes.

**Fires:** `resize`

## Events

### resize
Fired when pane sizes change (during drag and when setSizes is called).

```javascript
{
  detail: {
    sizes: [60, 40] // Current sizes as percentages
  }
}
```

### resize-start
Fired when drag operation begins.

```javascript
{
  detail: {
    sizes: [50, 50] // Sizes at start
  }
}
```

### resize-end
Fired when drag operation ends.

```javascript
{
  detail: {
    sizes: [60, 40] // Final sizes
  }
}
```

### collapse
Fired when a pane is collapsed or expanded.

```javascript
{
  detail: {
    index: 0,       // Pane index that changed
    collapsed: true // New collapsed state for that pane
  }
}
```

## Examples

### Basic Horizontal Split

```html
<t-split>
  <div slot="pane-0">Left Pane</div>
  <div slot="pane-1">Right Pane</div>
</t-split>
```

### Vertical Split with Custom Sizes

```html
<t-split orientation="vertical" .sizes=${[30, 70]}>
  <div slot="pane-0">Top Pane</div>
  <div slot="pane-1">Bottom Pane</div>
</t-split>
```

### Collapsible with Minimum Sizes

```html
<t-split
  .collapsible=${[true, true]}
  .minSizes=${[100, 200]}
  storage-key="my-splitter">
  <div slot="pane-0">Sidebar</div>
  <div slot="pane-1">Main Content</div>
</t-split>
```

### Programmatic Control

```javascript
const splitter = document.querySelector('t-split');

// Set sizes
splitter.setSizes([25, 75]);

// Collapse first pane
splitter.collapse(0);

// Expand first pane
splitter.expand(0);

// Toggle collapse state
splitter.toggleCollapse(0);

// Listen for resize
splitter.addEventListener('resize', (e) => {
  console.log('New sizes:', e.detail.sizes);
});

// Listen for collapse
splitter.addEventListener('collapse', (e) => {
  console.log('Pane', e.detail.index, 'collapsed:', e.detail.collapsed);
});
```

## Slots

| Slot | Description |
|------|-------------|
| `pane-0` | Content for the first pane (left/top) |
| `pane-1` | Content for the second pane (right/bottom) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--splitter-bg` | `var(--terminal-gray-darkest)` | Pane background color |
| `--splitter-border` | `var(--terminal-gray-dark)` | Gutter color |
| `--splitter-green` | `var(--terminal-green)` | Gutter hover/active color |
| `--splitter-gutter-size` | `8px` | Size of the gutter |
| `--splitter-min-pane-size` | `50px` | Minimum pane size |

## Related Components

- [TPanelLit](./TPanelLit.md) - Panel container
