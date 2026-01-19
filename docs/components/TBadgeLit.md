# TBadgeLit (t-badge)

A **Pure Lit** badge component for displaying counts, status indicators, and notifications. Built with Lit 3.x for terminal/cyberpunk styling.

## Architecture

**CRITICAL:** This is a **Pure Lit Component**:
- ✅ Extends `LitElement`
- ✅ All styles in `static styles` CSS block
- ✅ Zero FOUC (Flash of Unstyled Content)
- ✅ Complete Shadow DOM encapsulation

## Tag Name
```html
<t-badge></t-badge>
```

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `count` | Number | `null` | ✅ | Numeric count to display |
| `max` | Number | `99` | ✅ | Maximum count before showing "99+" |
| `dot` | Boolean | `false` | ✅ | Show as dot indicator instead of count |
| `variant` | String | `'default'` | ✅ | Color variant: 'default', 'success', 'warning', 'error', 'info' |
| `size` | String | `'md'` | ✅ | Size: 'sm', 'md', 'lg' |
| `pulse` | Boolean | `false` | ✅ | Add pulsing animation |
| `hidden` | Boolean | `false` | ✅ | Hide the badge |

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
<t-badge count="5"></t-badge>
<t-badge count="42" variant="success"></t-badge>
<t-badge count="100" max="99" variant="warning"></t-badge>
```

### Dot Badge
```html
<t-badge dot variant="error"></t-badge>
<t-badge dot variant="success" pulse></t-badge>
```

### With Positioning
```html
<div style="position: relative; display: inline-block;">
  <t-button>Notifications</t-button>
  <t-badge count="3" style="position: absolute; top: -5px; right: -5px;"></t-badge>
</div>
```

## CSS Variables

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

## Accessibility

- Uses appropriate ARIA attributes
- High contrast colors for visibility
- Pulse animation respects `prefers-reduced-motion`
