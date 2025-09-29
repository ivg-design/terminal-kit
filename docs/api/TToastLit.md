# TToastLit API Reference

## Component Definition

```javascript
import { TToastLit } from './js/components/TToastLit.js';
```

**Tag Name:** `<t-tst>`
**Class:** `TToastLit`
**Extends:** `LitElement`
**Version:** 1.0.0
**Category:** Display
**Profile:** CORE

## Properties

| Property | Attribute | Type | Default | Reflects | Description |
|----------|-----------|------|---------|----------|-------------|
| `message` | `message` | `string` | `''` | ✅ | The notification message to display |
| `type` | `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | ✅ | Visual style indicating notification severity |
| `duration` | `duration` | `number` | `3000` | ✅ | Auto-dismiss timeout in milliseconds. Set to `0` to disable auto-dismiss |
| `visible` | `visible` | `boolean` | `false` | ✅ | Controls toast visibility state |
| `position` | `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | ✅ | Screen position for the toast notification |

### Property Details

#### `message`
- **Type:** `string`
- **Default:** `''`
- **Required:** Yes (toast won't render without a message)
- **Description:** The text content displayed in the toast notification. Supports plain text only.

#### `type`
- **Type:** `string` (enum)
- **Default:** `'info'`
- **Valid Values:**
  - `'success'` - Green theme with checkmark icon
  - `'error'` - Red theme with X icon
  - `'warning'` - Yellow theme with warning icon
  - `'info'` - Blue theme with info icon
- **Description:** Determines the visual style and icon of the toast.

#### `duration`
- **Type:** `number`
- **Default:** `3000`
- **Range:** `0` to `Number.MAX_SAFE_INTEGER`
- **Description:** Milliseconds before auto-dismissal. Setting to `0` disables auto-dismiss, requiring manual dismissal.

#### `visible`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Programmatically controlled visibility state. Setting to `true` triggers show animation, `false` triggers hide animation.

#### `position`
- **Type:** `string` (enum)
- **Default:** `'top-right'`
- **Valid Values:**
  - `'top-right'` - Fixed to top-right corner
  - `'top-left'` - Fixed to top-left corner
  - `'bottom-right'` - Fixed to bottom-right corner
  - `'bottom-left'` - Fixed to bottom-left corner
- **Description:** Determines fixed positioning on the viewport.

## Methods

### `show()`

Display the toast notification with entrance animation.

**Signature:**
```typescript
show(): void
```

**Parameters:** None

**Returns:** `void`

**Behavior:**
- Sets `visible` property to `true`
- Triggers entrance animation
- Starts auto-dismiss timer if `duration > 0`
- Emits `toast-show` event
- No-op if already visible

**Example:**
```javascript
const toast = document.querySelector('t-tst');
toast.message = 'Action completed';
toast.type = 'success';
toast.show();
```

### `dismiss()`

Hide the toast notification with exit animation.

**Signature:**
```typescript
dismiss(): void
```

**Parameters:** None

**Returns:** `void`

**Behavior:**
- Triggers exit animation (300ms)
- Sets `visible` to `false` after animation
- Clears any pending auto-dismiss timer
- Emits `toast-dismiss` and `toast-hide` events
- No-op if not visible or already animating

**Example:**
```javascript
const toast = document.querySelector('t-tst');
toast.dismiss(); // Manually dismiss with animation
```

## Events

All events are `CustomEvent` instances with `bubbles: true` and `composed: true`, allowing them to cross shadow DOM boundaries.

### `toast-show`

Fired when toast becomes visible.

**Type:** `CustomEvent<{}>`
**Detail:** Empty object `{}`
**Bubbles:** Yes
**Composed:** Yes
**Cancelable:** No

**Timing:** Emitted immediately when `show()` is called or `visible` is set to `true`

### `toast-hide`

Fired when toast becomes hidden.

**Type:** `CustomEvent<{}>`
**Detail:** Empty object `{}`
**Bubbles:** Yes
**Composed:** Yes
**Cancelable:** No

**Timing:** Emitted after exit animation completes

### `toast-click`

Fired when toast body is clicked (excludes close button).

**Type:** `CustomEvent<{}>`
**Detail:** Empty object `{}`
**Bubbles:** Yes
**Composed:** Yes
**Cancelable:** No

**Use Case:** Navigate to related content or perform action based on notification

### `toast-dismiss`

Fired when toast is manually dismissed via close button or `dismiss()` method.

**Type:** `CustomEvent<{}>`
**Detail:** Empty object `{}`
**Bubbles:** Yes
**Composed:** Yes
**Cancelable:** No

**Note:** Always fired before `toast-hide` when manually dismissed

## CSS Custom Properties

### Color Variables

| Property | Default | Description |
|----------|---------|-------------|
| `--t-tst-bg` | `#000` | Toast background color |
| `--t-tst-border` | `#00ff41` | Default border color |
| `--t-tst-text` | `#00ff41` | Text color |
| `--t-tst-success` | `#00ff41` | Success state color |
| `--t-tst-error` | `#ff4136` | Error state color |
| `--t-tst-warning` | `#ffdc00` | Warning state color |
| `--t-tst-info` | `#0074d9` | Info state color |
| `--t-tst-shadow` | `rgba(0, 255, 65, 0.2)` | Box shadow color |

### Layout Variables

| Property | Default | Description |
|----------|---------|-------------|
| `--t-tst-padding` | `16px` | Internal padding |
| `--t-tst-border-radius` | `4px` | Corner radius |
| `--t-tst-transition` | `all 0.3s ease` | Animation timing |
| `--t-tst-font` | `'IBM Plex Mono', monospace` | Font stack |
| `--t-tst-font-size` | `14px` | Base font size |

## Slots

This component does not provide any slots. All content must be provided via the `message` property.

## Parts

This component does not expose any CSS parts for styling.

## Internal Structure

The component renders the following DOM structure within its shadow root:

```html
<div class="t-tst t-tst--{type}">
  <div class="t-tst__icon">
    <!-- SVG icon based on type -->
  </div>
  <div class="t-tst__message">
    <!-- message text -->
  </div>
  <button class="t-tst__close" type="button" aria-label="Close toast">
    <!-- X icon SVG -->
  </button>
</div>
```

## Animation States

The component manages two animation states:

1. **Entrance:** `t-tst--entering` class (300ms slide-in)
2. **Exit:** `t-tst--leaving` class (300ms slide-out)

Animations use CSS transforms and opacity for performance.

## Lifecycle Behavior

### Connection
- Initializes with default property values
- Logger instance created for debugging

### First Update
- Starts auto-dismiss timer if `visible` and `duration > 0`

### Property Changes
- `visible`: Triggers show/hide animations and timer management
- `duration`: Restarts auto-dismiss timer if visible

### Disconnection
- Clears all active timers
- Cancels any pending animation frames
- Prevents memory leaks

## Accessibility Features

- **ARIA Labels:** Close button includes `aria-label="Close toast"`
- **Keyboard Support:** Close button is keyboard accessible
- **Color Contrast:** Meets WCAG AA standards for all states
- **Focus Management:** Close button receives focus indication
- **Screen Reader:** All interactive elements properly announced

## Performance Considerations

- **Memory Management:** Automatic cleanup of timers and animation frames
- **Animation:** Uses GPU-accelerated transforms
- **Render Optimization:** Empty template when no message
- **Event Delegation:** Single click handler with target detection

## Browser Requirements

- **Web Components:** Full support required
- **ES2015+:** Modern JavaScript features
- **CSS Custom Properties:** For theming
- **Minimum Versions:**
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+

## TypeScript Definitions

```typescript
interface TToastLit extends LitElement {
  // Properties
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  visible: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  // Methods
  show(): void;
  dismiss(): void;
}

// Events
interface ToastShowEvent extends CustomEvent<{}> {}
interface ToastHideEvent extends CustomEvent<{}> {}
interface ToastClickEvent extends CustomEvent<{}> {}
interface ToastDismissEvent extends CustomEvent<{}> {}
```

## Component Manifest

```javascript
import { TToastManifest } from './js/components/TToastLit.js';

// Manifest structure
{
  tagName: 't-tst',
  displayName: 'Toast',
  version: '1.0.0',
  category: 'Display',
  description: 'Toast notification component with auto-dismiss and animation support',
  properties: { /* ... */ },
  methods: { /* ... */ },
  events: { /* ... */ }
}
```

## Testing

Component includes 39 comprehensive tests covering:
- Property validation and reflection
- Method functionality
- Event emission
- Timer management
- Animation states
- Memory leak prevention

**Coverage:** 99.66% lines, 100% functions, 92.85% branches

## See Also

- [TToastLit Component Guide](../components/TToastLit.md) - Usage guide with examples
- [TModalLit](./TModalLit.md) - Modal dialogs for user actions
- [TPanelLit](./TPanelLit.md) - Persistent information panels