# TGridLit

A dashboard grid layout component wrapping GridStack for drag-and-drop and resizable widgets.

## Tag Names

- `t-grid` - Grid container
- `t-grid-item` - Grid item/widget

## Static Metadata

| Property | Value |
| --- | --- |
| tagName | `t-grid` / `t-grid-item` |
| version | `3.0.0` |
| category | `Container` |

## Properties

### Grid Properties (t-grid)

| Property | Type | Default | Reflects | Description |
| --- | --- | --- | --- | --- |
| `columns` | `Number` | `12` | No | Number of columns |
| `cellHeight` | `Number` | `80` | No | Cell height in pixels (`cell-height`) |
| `margin` | `Number` | `10` | No | Margin between items |
| `draggable` | `Boolean` | `true` | No | Enable drag and drop |
| `resizable` | `Boolean` | `true` | No | Enable resize handles |
| `showOverlay` | `Boolean` | `true` | No | Show grid overlay during drag/resize (`show-overlay`) |
| `animate` | `Boolean` | `true` | No | Animate layout transitions |
| `compact` | `Boolean` | `false` | Yes | Compact mode (smaller margins) |
| `float` | `Boolean` | `false` | No | Float mode (no auto-compact) |
| `storageKey` | `String` | `` | No | Storage key for layout persistence (`storage-key`) |
| `minWidth` | `Number` | `2` | No | Minimum item width (`min-width`) |
| `minHeight` | `Number` | `1` | No | Minimum item height (`min-height`) |
| `lockSize` | `Boolean` | `true` | Yes | Lock grid width to initial dimensions (`lock-size`) |

### Grid Item Properties (t-grid-item)

| Property | Type | Default | Reflects | Description |
| --- | --- | --- | --- | --- |
| `itemId` | `String` | `` | Yes | Item ID (`item-id`) |
| `title` | `String` | `` | No | Header title (`widget-title`) |
| `x` | `Number` | `0` | Yes | Column position (`gs-x`) |
| `y` | `Number` | `0` | Yes | Row position (`gs-y`) |
| `w` | `Number` | `2` | Yes | Width in columns (`gs-w`) |
| `h` | `Number` | `2` | Yes | Height in rows (`gs-h`) |
| `minW` | `Number` | `2` | Yes | Minimum width (`gs-min-w`) |
| `minH` | `Number` | `1` | Yes | Minimum height (`gs-min-h`) |
| `maxW` | `Number` | - | Yes | Maximum width (`gs-max-w`) (no default) |
| `maxH` | `Number` | - | Yes | Maximum height (`gs-max-h`) (no default) |
| `locked` | `Boolean` | `false` | Yes | Lock item (no drag/resize) (`gs-locked`) |
| `noMove` | `Boolean` | `false` | Yes | Disable move (`gs-no-move`) |
| `noResize` | `Boolean` | `false` | Yes | Disable resize (`gs-no-resize`) |

## Methods

### addWidget(options)
Add a widget to the grid.

### removeWidget(el, removeDOM = true)
Remove a widget from the grid.

### updateWidget(el, options)
Update a widget's position/size.

### getLayout()
Get current layout data.

### loadLayout(layout)
Load a saved layout.

### compactGrid()
Compact the grid.

### enable(enable = true)
Enable/disable the grid.

### reset()
Reset to default layout.

### setStatic(staticMode = true)
Lock/unlock all widgets from drag/resize.

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `grid-change` | `{ items }` | Fired when layout changes |
| `grid-drag-start` | `{ element }` | Fired when drag starts |
| `grid-drag-stop` | `{ element }` | Fired when drag stops |
| `grid-resize-start` | `{ element }` | Fired when resize starts |
| `grid-resize-stop` | `{ element }` | Fired when resize stops |
| `grid-added` | `{ items }` | Fired when item is added |
| `grid-removed` | `{ items }` | Fired when item is removed |

## Examples

### Basic Grid

```html
<t-grid columns="12" cell-height="80">
  <t-grid-item item-id="a" x="0" y="0" w="4" h="2" widget-title="Status">
    <div>Widget content</div>
  </t-grid-item>
  <t-grid-item item-id="b" x="4" y="0" w="8" h="2" widget-title="Activity">
    <div>Another widget</div>
  </t-grid-item>
</t-grid>
```

### Item Header Controls

```html
<t-grid-item item-id="logs" widget-title="Logs" x="0" y="2" w="6" h="3">
  <button slot="controls">Clear</button>
  <div>Log content</div>
</t-grid-item>
```

## Slots

### Grid Slots
| Slot | Description |
| --- | --- |
| default | `t-grid-item` elements |

### Grid Item Slots
| Slot | Description |
| --- | --- |
| default | Item content area |
| header | Custom header content (place above content) |
| controls | Header controls aligned right |

## CSS Custom Properties

| Property | Default | Description |
| --- | --- | --- |
| `--grid-bg` | `var(--terminal-black)` | Grid background |
| `--grid-border` | `var(--terminal-gray-dark)` | Item border color |
| `--grid-green` | `var(--terminal-green)` | Accent color |
| `--grid-placeholder-bg` | `rgba(0, 255, 65, 0.1)` | Placeholder background |
| `--grid-placeholder-border` | `var(--terminal-green)` | Placeholder border |
| `--grid-cell-height` | `80px` | Default cell height |

## Related Components

- [TPanelLit](./TPanelLit.md) - Panel container for widgets
- [TSplitterLit](./TSplitterLit.md) - Layout splits

## Third-Party Credits

- GridStack. See [`../third-party.md`](../third-party.md).

## Notes

- Requires GridStack available on `window.GridStack` (import from `gridstack` and assign to `window` or include the bundle).
- `t-grid-item` uses light DOM for GridStack compatibility.
- If you provide a custom header slot, add `data-drag-handle` to enable drag from that header.
