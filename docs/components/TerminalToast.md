# TerminalToast

A toast notification component with terminal/cyberpunk styling. Supports multiple types, auto-dismiss timers, manual dismissal, and queue management with global positioning.

## Tag Name
```html
<terminal-toast></terminal-toast>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | `'info'` | Toast type variant |
| `message` | string | `''` | Toast message content |
| `duration` | number | `5000` | Auto-dismiss timer in milliseconds (0 = no auto-dismiss) |
| `dismissible` | boolean | `true` | Show close button |
| `position` | string | `'top-right'` | Toast position on screen |

### Toast Types
- `success` - Green accent, checkmark icon
- `error` - Red accent, error icon  
- `warning` - Yellow accent, warning icon
- `info` - Cyan accent, info icon

### Position Options
- `top-right` - Top right corner
- `top-left` - Top left corner
- `bottom-right` - Bottom right corner
- `bottom-left` - Bottom left corner
- `top-center` - Top center
- `bottom-center` - Bottom center

## Usage

### Basic HTML Usage
```html
<terminal-toast 
  type="success" 
  message="Operation completed successfully!"
  duration="3000">
</terminal-toast>
```

### JavaScript API

#### Individual Toast Instance
```javascript
// Create and show toast
const toast = document.createElement('terminal-toast');
toast.show({
  message: 'Hello World!',
  type: 'info',
  duration: 5000,
  dismissible: true,
  position: 'top-right'
});

// Update message
toast.updateMessage('Updated message');

// Update type
toast.updateType('success');

// Manually dismiss
toast.dismiss();
```

#### Global Toast Manager
```javascript
// Access global manager
const toastManager = window.TerminalToastManager;

// Show different types
toastManager.success('Operation successful!');
toastManager.error('Something went wrong!');
toastManager.warning('Please check your input');
toastManager.info('FYI: New feature available');

// Show with options
const toastId = toastManager.show('Custom message', 'success', {
  duration: 10000,
  position: 'bottom-center',
  dismissible: false
});

// Dismiss specific toast
toastManager.dismiss(toastId);

// Dismiss all toasts
toastManager.dismissAll();
```

## Methods

### Instance Methods
| Method | Parameters | Description |
|--------|------------|-------------|
| `show(options)` | `{message, type, duration, dismissible, position, id}` | Show the toast |
| `dismiss()` | - | Dismiss the toast with animation |
| `updateMessage(message)` | `string` | Update toast message |
| `updateType(type)` | `string` | Update toast type |

### Global Manager Methods
| Method | Parameters | Description |
|--------|------------|-------------|
| `show(message, type, options)` | `string, string, object` | Show a toast |
| `success(message, options)` | `string, object` | Show success toast |
| `error(message, options)` | `string, object` | Show error toast |
| `warning(message, options)` | `string, object` | Show warning toast |
| `info(message, options)` | `string, object` | Show info toast |
| `dismiss(id)` | `string` | Dismiss specific toast |
| `dismissAll()` | - | Dismiss all active toasts |

## Events

| Event | Detail | Description |
|-------|---------|-------------|
| `toast-show` | `{id, type, message}` | Fired when toast is shown |
| `toast-dismiss` | `{id, type, message}` | Fired when toast is dismissed |
| `toast-click` | `{type, message, id}` | Fired when toast content is clicked |

### Event Handling
```javascript
// Listen for toast events
document.addEventListener('toast-show', (e) => {
  console.log('Toast shown:', e.detail);
});

document.addEventListener('toast-dismiss', (e) => {
  console.log('Toast dismissed:', e.detail);
});

document.addEventListener('toast-click', (e) => {
  console.log('Toast clicked:', e.detail);
});
```

## Styling

The component uses CSS custom properties for theming:

```css
:root {
  --terminal-green: #00ff41;
  --terminal-red: #ff4444;
  --terminal-yellow: #ffff00;
  --terminal-cyan: #00ffff;
  --terminal-gray-dark: #242424;
  --terminal-gray-light: #333333;
  --terminal-text: #ffffff;
}
```

### Custom Styling
```css
/* Custom toast container */
.terminal-toast-container {
  min-width: 350px;
  max-width: 450px;
}

/* Custom toast appearance */
.toast-success {
  border-left-width: 6px;
  background: var(--custom-success-bg);
}

/* Custom positioning */
.toast-top-right {
  top: 60px; /* Below header */
  right: 20px;
}
```

## Queue Management

The toast manager automatically manages toast queues by position:
- Maximum of 5 toasts per position by default
- Older toasts are automatically dismissed when limit is reached
- Toasts stack vertically in their position containers
- Animations handle entrance/exit smoothly

## Accessibility

The component includes accessibility features:
- ARIA labels on close buttons
- Keyboard navigation support
- High contrast mode support
- Reduced motion support
- Screen reader compatible

## Examples

### Simple Notifications
```javascript
// Quick success message
TerminalToastManager.success('Settings saved!');

// Error with longer duration
TerminalToastManager.error('Failed to connect to server', {
  duration: 10000
});

// Warning with custom position
TerminalToastManager.warning('Low disk space', {
  position: 'bottom-center',
  duration: 0 // No auto-dismiss
});
```

### Advanced Usage
```javascript
// Create custom toast with callback
const toastId = TerminalToastManager.info('Processing...', {
  duration: 0,
  dismissible: false,
  position: 'top-center'
});

// Update it later
setTimeout(() => {
  TerminalToastManager.dismiss(toastId);
  TerminalToastManager.success('Processing complete!');
}, 3000);
```

### Integration with Forms
```javascript
// Form validation example
function handleFormSubmit(formData) {
  TerminalToastManager.info('Submitting form...');
  
  submitForm(formData)
    .then(() => {
      TerminalToastManager.success('Form submitted successfully!');
    })
    .catch((error) => {
      TerminalToastManager.error(`Submission failed: ${error.message}`);
    });
}
```

## Browser Support

- Modern browsers with Web Components support
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Dependencies

- Extends `TerminalComponent` base class
- Requires `toast.css` for styling
- Uses CSS custom properties for theming