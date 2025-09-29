# TToastLit (t-tst)

A **LitElement-based** toast notification component for terminal-style user interfaces. Provides user feedback through temporary, non-intrusive messages with auto-dismiss functionality, smooth animations, and configurable positioning. Built with full Shadow DOM encapsulation following Terminal Kit component schema.

## Architecture

**Tag Name:** `<t-tst>`
**Extends:** `LitElement`
**Category:** Display
**Profile:** CORE
**Version:** 1.0.0

## Properties

All properties are reactive Lit properties with attribute reflection:

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `message` | `string` | `''` | ✅ | The notification message to display |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | ✅ | Visual style indicating notification severity |
| `duration` | `number` | `3000` | ✅ | Auto-dismiss timeout in milliseconds. Set to `0` to disable auto-dismiss |
| `visible` | `boolean` | `false` | ✅ | Controls toast visibility state |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | ✅ | Screen position for the toast notification |

### Property Details

#### `message`
- **Type:** `string`
- **Required:** Yes (toast won't render without a message)
- **Description:** The text content displayed in the toast notification. Supports plain text only.

#### `type`
- **Type:** `string` (enum)
- **Valid Values:**
  - `'success'` - Green theme with checkmark icon
  - `'error'` - Red theme with X icon
  - `'warning'` - Yellow theme with warning icon
  - `'info'` - Blue theme with info icon
- **Description:** Determines the visual style and icon of the toast.

#### `duration`
- **Type:** `number`
- **Range:** `0` to `Number.MAX_SAFE_INTEGER`
- **Description:** Milliseconds before auto-dismissal. Setting to `0` disables auto-dismiss, requiring manual dismissal.

#### `visible`
- **Type:** `boolean`
- **Description:** Programmatically controlled visibility state. Setting to `true` triggers show animation, `false` triggers hide animation.

#### `position`
- **Type:** `string` (enum)
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

**Event Type:** `CustomEvent<{}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes (crosses shadow DOM boundary)

**Detail:** Empty object `{}`

**Cancelable:** No

**Timing:** Emitted immediately when `show()` is called or `visible` is set to `true`

**Example:**
```javascript
toast.addEventListener('toast-show', (e) => {
  console.log('Toast shown');
});
```

### `toast-hide`

Fired when toast becomes hidden.

**Event Type:** `CustomEvent<{}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes

**Detail:** Empty object `{}`

**Timing:** Emitted after exit animation completes

**Example:**
```javascript
toast.addEventListener('toast-hide', (e) => {
  console.log('Toast hidden');
});
```

### `toast-click`

Fired when toast body is clicked (excludes close button).

**Event Type:** `CustomEvent<{}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes

**Detail:** Empty object `{}`

**Use Case:** Navigate to related content or perform action based on notification

**Example:**
```javascript
toast.addEventListener('toast-click', (e) => {
  console.log('Toast clicked');
  // Could be used to navigate to related content
});
```

### `toast-dismiss`

Fired when toast is manually dismissed via close button or `dismiss()` method.

**Event Type:** `CustomEvent<{}>`

**Bubbles:** ✅ Yes

**Composed:** ✅ Yes

**Detail:** Empty object `{}`

**Note:** Always fired before `toast-hide` when manually dismissed

**Example:**
```javascript
toast.addEventListener('toast-dismiss', (e) => {
  console.log('Toast dismissed by user');
});
```

## Usage Patterns & Examples

### Basic Usage

```html
<t-tst message="Operation successful!" type="success"></t-tst>
```

### JavaScript API Usage

```javascript
// Get the toast element
const toast = document.querySelector('t-tst');

// Show a toast
toast.message = 'File saved successfully';
toast.type = 'success';
toast.show();

// Auto-dismiss after 5 seconds
toast.duration = 5000;
toast.show();

// Manual dismiss
toast.dismiss();
```

### Different Types

```html
<!-- Success toast -->
<t-tst message="Operation completed" type="success"></t-tst>

<!-- Error toast -->
<t-tst message="An error occurred" type="error"></t-tst>

<!-- Warning toast -->
<t-tst message="Please review your input" type="warning"></t-tst>

<!-- Info toast (default) -->
<t-tst message="New update available" type="info"></t-tst>
```

### Positioning

```html
<!-- Top right (default) -->
<t-tst message="Top right" position="top-right"></t-tst>

<!-- Top left -->
<t-tst message="Top left" position="top-left"></t-tst>

<!-- Bottom right -->
<t-tst message="Bottom right" position="bottom-right"></t-tst>

<!-- Bottom left -->
<t-tst message="Bottom left" position="bottom-left"></t-tst>
```

### Disable Auto-Dismiss

```html
<!-- Won't auto-dismiss (manual dismiss only) -->
<t-tst message="Persistent notification" duration="0"></t-tst>
```

### Programmatic Toast with Event Handling

```javascript
// Create and configure a toast
const toast = document.createElement('t-tst');
toast.message = 'Download complete';
toast.type = 'success';
toast.duration = 4000;
toast.position = 'bottom-right';

// Add event listeners
toast.addEventListener('toast-click', () => {
  window.location.href = '/downloads';
});

toast.addEventListener('toast-dismiss', () => {
  console.log('User dismissed the notification');
});

// Add to DOM and show
document.body.appendChild(toast);
toast.show();
```

### Sequential Notifications

```javascript
async function showNotifications() {
  const messages = [
    { text: 'Starting process...', type: 'info' },
    { text: 'Loading data...', type: 'info' },
    { text: 'Processing...', type: 'warning' },
    { text: 'Complete!', type: 'success' }
  ];

  for (const msg of messages) {
    const toast = document.createElement('t-tst');
    toast.message = msg.text;
    toast.type = msg.type;
    toast.duration = 2000;
    toast.position = 'top-right';

    document.body.appendChild(toast);
    toast.show();

    // Wait for toast to dismiss
    await new Promise(resolve => {
      toast.addEventListener('toast-hide', resolve, { once: true });
    });

    // Clean up
    toast.remove();
  }
}
```

### Error Handling Pattern

```javascript
async function performAction() {
  const toast = document.querySelector('t-tst') || document.createElement('t-tst');

  try {
    // Perform some operation
    await someAsyncOperation();

    // Show success
    toast.message = 'Operation completed successfully';
    toast.type = 'success';
    toast.duration = 3000;
    toast.show();
  } catch (error) {
    // Show error
    toast.message = `Error: ${error.message}`;
    toast.type = 'error';
    toast.duration = 0; // Don't auto-dismiss errors
    toast.show();
  }
}
```

## CSS Customization

### CSS Variables

Components use CSS variables for theming:

```css
t-tst {
  /* Base colors */
  --t-tst-bg: #000;
  --t-tst-border: #00ff41;
  --t-tst-text: #00ff41;

  /* Type-specific colors */
  --t-tst-success: #00ff41;
  --t-tst-error: #ff4136;
  --t-tst-warning: #ffdc00;
  --t-tst-info: #0074d9;

  /* Other styling */
  --t-tst-shadow: rgba(0, 255, 65, 0.2);
  --t-tst-padding: 16px;
  --t-tst-border-radius: 4px;
  --t-tst-transition: all 0.3s ease;
  --t-tst-font: 'IBM Plex Mono', monospace;
  --t-tst-font-size: 14px;
}
```

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

### Component Structure

The component uses Shadow DOM with this structure:

```html
<t-tst>
  #shadow-root
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
</t-tst>
```

## Advanced Features

### Animation States

The component manages two animation states:

1. **Entrance:** `t-tst--entering` class (300ms slide-in)
2. **Exit:** `t-tst--leaving` class (300ms slide-out)

Animations use CSS transforms and opacity for performance.

### Lifecycle Behavior

#### Connection
- Initializes with default property values
- Logger instance created for debugging

#### First Update
- Starts auto-dismiss timer if `visible` and `duration > 0`

#### Property Changes
- `visible`: Triggers show/hide animations and timer management
- `duration`: Restarts auto-dismiss timer if visible

#### Disconnection
- Clears all active timers
- Cancels any pending animation frames
- Prevents memory leaks

### Memory Management

The component properly cleans up resources:
- Auto-dismiss timers are cleared on disconnect
- Animation states are properly managed
- Event listeners are automatically cleaned up by Lit

### Accessibility Features

- **ARIA Labels:** Close button includes `aria-label="Close toast"`
- **Keyboard Support:** Close button is keyboard accessible
- **Color Contrast:** Meets WCAG AA standards for all states
- **Focus Management:** Close button receives focus indication
- **Screen Reader:** All interactive elements properly announced
- **Reduced Motion:** Animations respect `prefers-reduced-motion` when configured

### Performance Considerations

- **Memory Management:** Automatic cleanup of timers and animation frames
- **Animation:** Uses GPU-accelerated transforms
- **Render Optimization:** Empty template when no message
- **Event Delegation:** Single click handler with target detection

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

// Toast position type
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

// Toast type enum
type ToastType = 'success' | 'error' | 'warning' | 'info';

// Component interface for registration
interface ToastManifest {
  tagName: 't-tst';
  displayName: 'Toast';
  version: '1.0.0';
  category: 'Display';
  description: 'Toast notification component with auto-dismiss and animation support';
  properties: {
    message: { type: 'string', required: true };
    type: { type: 'string', enum: ToastType[], default: 'info' };
    duration: { type: 'number', default: 3000 };
    visible: { type: 'boolean', default: false };
    position: { type: 'string', enum: ToastPosition[], default: 'top-right' };
  };
  methods: {
    show: { returns: 'void' };
    dismiss: { returns: 'void' };
  };
  events: {
    'toast-show': { detail: '{}' };
    'toast-hide': { detail: '{}' };
    'toast-click': { detail: '{}' };
    'toast-dismiss': { detail: '{}' };
  };
}
```

## Browser Support

- **Chrome/Edge 90+** (native Lit support)
- **Firefox 88+** (native Lit support)
- **Safari 14+** (native Lit support)
- **Older browsers:** Use Lit polyfills
- **Requirements:**
  - Web Components support
  - ES2015+ modern JavaScript features
  - CSS Custom Properties for theming

## Performance & Testing

### Component Testing

The component includes comprehensive test coverage:
- **39 tests** covering all functionality
- **Coverage:** 99.66% lines, 100% functions, 92.85% branches
- Property validation and reflection
- Event emission
- Timer management
- Animation states
- Memory leak prevention

**Run tests with:**
```bash
npm run test:run -- TToastLit
```

### Usage Notes

- Toast notifications are positioned using `position: fixed`
- Multiple toasts should be managed by a separate toast manager/queue system
- The component focuses on single toast behavior, not queue management
- Animations use CSS transforms for better performance

## Migration from TToast

If migrating from the older TToast component:

### Before (Legacy)
```javascript
// Old (TComponent-based)
const oldToast = new TToast();
```

### After (LitElement-based)
```javascript
// New (LitElement-based)
const newToast = document.createElement('t-tst');
```

### Key Changes
1. Replace `<terminal-toast>` with `<t-tst>`
2. Update property names if needed (most are the same)
3. Event names remain the same
4. Remove any TToastManager usage (handle separately if needed)
5. CSS classes are now encapsulated in shadow DOM
6. Now extends LitElement instead of TComponent
7. Uses Shadow DOM with complete encapsulation
8. Better memory management and performance
9. Reactive properties with automatic re-rendering
10. CSS variable theming system

## Related Components

- [TModalLit](./TModalLit.md) - Modal dialogs requiring user action
- [TPanelLit](./TPanelLit.md) - Persistent information display
- [TStatusBarLit](./TStatusBarLit.md) - Status information display