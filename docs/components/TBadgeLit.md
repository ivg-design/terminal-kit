# TBadgeLit (t-bdg)

A **Pure Lit** badge component for displaying counts, status indicators, and notifications. Built with Lit 3.x for terminal/cyberpunk styling.

## Tag Names

- `t-bdg`

## Architecture

**CRITICAL:** This is a **Pure Lit Component**:
- ✅ Extends `LitElement`
- ✅ All styles in `static styles` CSS block
- ✅ Zero FOUC (Flash of Unstyled Content)
- ✅ Complete Shadow DOM encapsulation

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-bdg` |
| version | `3.0.0` |
| category | `Core` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `count` | Number | `null` | Yes | Numeric count to display |
| `max` | Number | `99` | Yes | Maximum count before showing "99+" |
| `dot` | Boolean | `false` | Yes | Show as dot indicator instead of count |
| `variant` | String | `'default'` | Yes | Color variant: `'default'`, `'success'`, `'warning'`, `'error'`, `'info'` |
| `size` | String | `'md'` | Yes | Size: `'sm'`, `'md'`, `'lg'` |
| `pulse` | Boolean | `false` | Yes | Add pulsing animation |
| `position` | String | `null` | Yes | Position relative to slot content: `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'` |
| `hidden` | Boolean | `false` | Yes | Hide the badge |
| `clickable` | Boolean | `false` | Yes | Make badge clickable |

## Methods

### show()
Show the badge.

### hide()
Hide the badge.

### setCount(value)
Set the count value.

**Parameters:**
- `value` (Number): Count to display

### increment(amount = 1)
Increment the count.

**Parameters:**
- `amount` (Number): Amount to increment by

### decrement(amount = 1)
Decrement the count.

**Parameters:**
- `amount` (Number): Amount to decrement by

## Events

### `badge-click`
Fired when badge is clicked.

**Event Detail:**
```javascript
{
  count: Number,
  variant: String
}
```

## Examples

### Basic Badge
```html
<t-bdg count="5"></t-bdg>
<t-bdg count="42" variant="success"></t-bdg>
<t-bdg count="100" max="99" variant="warning"></t-bdg>
```

### Dot Badge
```html
<t-bdg dot variant="error"></t-bdg>
<t-bdg dot variant="success" pulse></t-bdg>
```

### With Positioning
```html
<div style="position: relative; display: inline-block;">
  <t-button>Notifications</t-button>
  <t-bdg count="3" style="position: absolute; top: -5px; right: -5px;"></t-bdg>
</div>
```

## Slots

| Slot | Description |
| --- | --- |
| default | Anchor content wrapped by the badge |

## CSS Custom Properties

```css
:root {
  --badge-bg: var(--terminal-gray-dark);
  --badge-color: var(--terminal-white);
  --badge-success: var(--terminal-green);
  --badge-warning: var(--terminal-amber);
  --badge-error: var(--terminal-red);
  --badge-info: var(--terminal-cyan);
}
```

## Related Components

- [TChipLit](./TChipLit.md) - Compact status labels
- [TAvatarLit](./TAvatarLit.md) - Avatar with optional status
- [TTooltipLit](./TTooltipLit.md) - Tooltip for badge details

## Accessibility

- Uses appropriate ARIA attributes
- High contrast colors for visibility
- Pulse animation respects `prefers-reduced-motion`
