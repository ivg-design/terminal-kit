# TToastLit Component

## Overview

`TToastLit` is a toast notification component that provides user feedback through temporary, non-intrusive messages. Built with Lit framework following the Terminal Kit component schema, it supports various notification types, auto-dismiss functionality, and smooth animations.

**Profile:** CORE
**Category:** Display
**Tag:** `<t-tst>`
**Version:** 1.0.0

## Features

- ✅ Multiple notification types (success, error, warning, info)
- ✅ Auto-dismiss with configurable duration
- ✅ Manual dismiss capability
- ✅ Smooth entrance and exit animations
- ✅ Configurable screen positions
- ✅ Click event handling
- ✅ Proper timer cleanup to prevent memory leaks
- ✅ Accessible close button

## Usage

### Basic Usage

```html
<t-tst message="Operation successful!" type="success"></t-tst>
```

### JavaScript API

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

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `message` | `string` | `''` | ✅ | The message to display in the toast |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | ✅ | The type/severity of the notification |
| `duration` | `number` | `3000` | ✅ | Auto-dismiss time in milliseconds (0 = manual dismiss only) |
| `visible` | `boolean` | `false` | ✅ | Whether the toast is currently visible |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | ✅ | Position of the toast on screen |

## Methods

### `show()`

Shows the toast notification with entrance animation.

```javascript
const toast = document.querySelector('t-tst');
toast.message = 'Hello, World!';
toast.show();
```

**Returns:** `void`

### `dismiss()`

Dismisses the toast with exit animation.

```javascript
const toast = document.querySelector('t-tst');
toast.dismiss();
```

**Returns:** `void`

## Events

All events bubble and are composed, allowing them to cross shadow DOM boundaries.

### `toast-show`

Fired when the toast is shown.

```javascript
toast.addEventListener('toast-show', (e) => {
  console.log('Toast shown');
});
```

**Detail:** `{}` (empty object)

### `toast-hide`

Fired when the toast is hidden.

```javascript
toast.addEventListener('toast-hide', (e) => {
  console.log('Toast hidden');
});
```

**Detail:** `{}` (empty object)

### `toast-click`

Fired when the toast is clicked (excluding the close button).

```javascript
toast.addEventListener('toast-click', (e) => {
  console.log('Toast clicked');
  // Could be used to navigate to related content
});
```

**Detail:** `{}` (empty object)

### `toast-dismiss`

Fired when the toast is manually dismissed via the close button or `dismiss()` method.

```javascript
toast.addEventListener('toast-dismiss', (e) => {
  console.log('Toast dismissed by user');
});
```

**Detail:** `{}` (empty object)

## CSS Variables

Customize the toast appearance using CSS variables:

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

## Advanced Examples

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

## Accessibility

- The close button includes an `aria-label` for screen readers
- Toast notifications use appropriate color contrast
- Icons are decorative and marked as such
- Animations respect `prefers-reduced-motion` when configured

## Memory Management

The component properly cleans up resources:
- Auto-dismiss timers are cleared on disconnect
- Animation states are properly managed
- Event listeners are automatically cleaned up by Lit

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Web Components support

## Migration from TToast

If migrating from the older TToast component:

1. Replace `<terminal-toast>` with `<t-tst>`
2. Update property names if needed (most are the same)
3. Event names remain the same
4. Remove any TToastManager usage (handle separately if needed)
5. CSS classes are now encapsulated in shadow DOM

## Notes

- Toast notifications are positioned using `position: fixed`
- Multiple toasts should be managed by a separate toast manager/queue system
- The component focuses on single toast behavior, not queue management
- Animations use CSS transforms for better performance

## Testing

The component includes comprehensive test coverage:
- 39 tests covering all functionality
- Property validation
- Event emission
- Timer management
- Animation states
- Memory leak prevention

Run tests with:
```bash
npm run test:run -- TToastLit
```

## Related Components

- TModalLit - For modal dialogs requiring user action
- TPanelLit - For persistent information display