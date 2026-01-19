# TTooltipLit

A tooltip component with terminal styling, providing contextual information on hover or focus with customizable positioning and triggers.

## Tag Names

- `t-tip`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-tip` |
| version | `3.0.0` |
| category | `Core` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `content` | `String` | `''` | No | Tooltip text content |
| `html` | `Boolean` | `false` | Yes | Allow HTML content rendering (use with caution) |
| `position` | `String` | `'top'` | Yes | Position: `'top'`, `'bottom'`, `'left'`, `'right'` |
| `trigger` | `String` | `'hover'` | Yes | Trigger: `'hover'`, `'focus'`, `'click'` |
| `delay` | `Number` | `200` | No | Show delay in milliseconds |
| `hideDelay` | `Number` | `0` | No | Hide delay in milliseconds |
| `arrow` | `Boolean` | `true` | Yes | Show arrow pointer |
| `noArrow` | `Boolean` | `false` | Yes | Hide arrow (alternative to arrow) |
| `maxWidth` | `String` | `'250px'` | No | Maximum width for multiline tooltips |
| `variant` | `String` | `'default'` | Yes | Style variant: `'default'`, `'error'`, `'warning'`, `'info'` |
| `disabled` | `Boolean` | `false` | Yes | Disable tooltip |
| `open` | `Boolean` | `false` | Yes | Manually control visibility |
| `size` | `String` | `'md'` | Yes | Size: `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'` |

### Position Options

- `top`
- `bottom`
- `left`
- `right`

## Methods

### show()
Show the tooltip.

**Fires:** `tooltip-show`

### hide()
Hide the tooltip.

**Fires:** `tooltip-hide`

### toggle()
Toggle tooltip visibility.

**Fires:** `tooltip-show` or `tooltip-hide`

## Events

### tooltip-show
Fired when tooltip becomes visible.

```javascript
{
  detail: {}
}
```

### tooltip-hide
Fired when tooltip is hidden.

```javascript
{
  detail: {}
}
```

## Examples

### Basic Tooltip

```html
<t-tip content="This is a tooltip">
  <t-button>Hover me</t-button>
</t-tip>
```

### Different Positions

```html
<t-tip content="Top tooltip" position="top">
  <span>Top</span>
</t-tip>

<t-tip content="Bottom tooltip" position="bottom">
  <span>Bottom</span>
</t-tip>

<t-tip content="Left tooltip" position="left">
  <span>Left</span>
</t-tip>

<t-tip content="Right tooltip" position="right">
  <span>Right</span>
</t-tip>
```

### Click Trigger

```html
<t-tip content="Click to toggle" trigger="click">
  <t-button>Click me</t-button>
</t-tip>
```

### Focus Trigger

```html
<t-tip content="Focus tooltip" trigger="focus">
  <input type="text" placeholder="Focus me">
</t-tip>
```

### Manual Control

```html
<t-tip content="Manual tooltip" trigger="manual" ?open=${showTooltip}>
  <span>Manual</span>
</t-tip>
```

### Custom Delays

```html
<t-tip content="Delayed tooltip" delay="500" hide-delay="200">
  <span>Hover (with delay)</span>
</t-tip>
```

### Without Arrow

```html
<t-tip content="No arrow" no-arrow>
  <span>Hover</span>
</t-tip>
```

### Variant Styles

```html
<t-tip content="Default info" variant="default">
  <t-button>Default</t-button>
</t-tip>

<t-tip content="Error message" variant="error">
  <t-button>Error</t-button>
</t-tip>

<t-tip content="Warning message" variant="warning">
  <t-button>Warning</t-button>
</t-tip>

<t-tip content="Info message" variant="info">
  <t-button>Info</t-button>
</t-tip>
```

### Different Sizes

```html
<t-tip content="Small tooltip" size="sm">
  <span>Small</span>
</t-tip>

<t-tip content="Large tooltip with more content" size="lg">
  <span>Large</span>
</t-tip>
```

### HTML Content

```html
<t-tip content="<strong>Bold</strong> and <em>italic</em>" html>
  <span>Rich content</span>
</t-tip>
```

### Max Width

```html
<t-tip
  content="This is a very long tooltip that will wrap to multiple lines when it exceeds the maximum width"
  max-width="200">
  <span>Hover for long tooltip</span>
</t-tip>
```

### Disabled Tooltip

```html
<t-tip content="Won't show" disabled>
  <span>Tooltip disabled</span>
</t-tip>
```

### Form Field Help

```html
<div class="form-field">
  <label>Password</label>
  <t-tip
    content="Must be at least 8 characters with numbers and symbols"
    position="right"
    trigger="focus">
    <input type="password" placeholder="Enter password">
  </t-tip>
</div>
```

### Icon with Tooltip

```html
<t-tip content="More information about this feature">
  <span class="help-icon">?</span>
</t-tip>
```

### Programmatic Control

```javascript
const tooltip = document.querySelector('t-tip');

// Show/hide
tooltip.show();
tooltip.hide();
tooltip.toggle();

// Update content
tooltip.content = 'New tooltip content';

// Listen for events
tooltip.addEventListener('tooltip-show', () => {
  console.log('Tooltip shown');
});

tooltip.addEventListener('tooltip-hide', () => {
  console.log('Tooltip hidden');
});
```

## Slots

| Slot | Description |
| --- | --- |
| default | Trigger content the tooltip anchors to |


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--tooltip-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--tooltip-border` | `var(--terminal-gray-dark)` | Border color |
| `--tooltip-text` | `var(--terminal-white)` | Text color |
| `--tooltip-shadow` | `0 2px 8px rgba(0,0,0,0.5)` | Box shadow |

## Accessibility

- Tooltips are accessible via keyboard focus (when using focus trigger)
- Uses `role="tooltip"` and `aria-describedby` for screen readers
- ESC key dismisses click-triggered tooltips

## Related Components

- [TPopoverLit](./TPopoverLit.md) - More complex popup content
