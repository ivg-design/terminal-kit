# TerminalLoader

A loading indicator component with terminal/cyberpunk styling. Supports multiple loader types (spinner, dots, bars), size variants, optional text messages, and custom colors.

## Tag Name
```html
<terminal-loader></terminal-loader>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | `'spinner'` | Loader animation type |
| `size` | string | `'medium'` | Size variant |
| `text` | string | `null` | Optional loading text message |
| `color` | string | `null` | Custom color override |

### Loader Types
- `spinner` - Rotating square spinner (terminal aesthetic)
- `dots` - Three bouncing square dots
- `bars` - Five animated vertical bars

### Size Options
- `small` - Compact size for inline use
- `medium` - Standard size for general use
- `large` - Prominent size for important loading states

## Usage

### Basic HTML Usage
```html
<!-- Basic spinner -->
<terminal-loader></terminal-loader>

<!-- Dots loader with text -->
<terminal-loader type="dots" text="Loading data..."></terminal-loader>

<!-- Large bars loader with custom color -->
<terminal-loader 
  type="bars" 
  size="large" 
  text="Processing..." 
  color="#00ffff">
</terminal-loader>
```

### JavaScript API

#### Basic Usage
```javascript
// Create loader programmatically
const loader = document.createElement('terminal-loader');
loader.setType('spinner');
loader.setSize('medium');
loader.setText('Loading...');
document.body.appendChild(loader);

// Show/hide loader
loader.show();
loader.hide();

// Check visibility
if (loader.isVisible()) {
  console.log('Loader is visible');
}
```

#### Updating Properties
```javascript
// Update individual properties
loader.setType('dots');
loader.setSize('large');
loader.setText('Fetching data...');
loader.setColor('#ff4444');

// Update multiple properties at once
loader.update({
  type: 'bars',
  size: 'small',
  text: 'Saving...',
  color: '#00ff41'
});

// Get current values
console.log('Type:', loader.getType());
console.log('Size:', loader.getSize());
console.log('Text:', loader.getText());
console.log('Color:', loader.getColor());
```

#### Common Patterns
```javascript
// Show loader while fetching data
const loader = document.querySelector('#data-loader');
loader.setText('Loading data...');
loader.show();

fetchData()
  .then(data => {
    loader.hide();
    displayData(data);
  })
  .catch(error => {
    loader.update({
      type: 'dots',
      text: 'Error loading data',
      color: '#ff4444'
    });
  });

// Form submission loader
const submitBtn = document.querySelector('#submit-btn');
const formLoader = document.querySelector('#form-loader');

submitBtn.addEventListener('click', () => {
  formLoader.update({
    type: 'spinner',
    text: 'Submitting...'
  });
  formLoader.show();
  submitBtn.disabled = true;
});
```

## Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `setType(type)` | `string` | Set loader type ('spinner', 'dots', 'bars') |
| `getType()` | - | Get current loader type |
| `setSize(size)` | `string` | Set size ('small', 'medium', 'large') |
| `getSize()` | - | Get current size |
| `setText(text)` | `string` | Set loading text message |
| `getText()` | - | Get current text message |
| `setColor(color)` | `string` | Set custom color (hex, rgb, etc.) |
| `getColor()` | - | Get current custom color |
| `show()` | - | Show the loader |
| `hide()` | - | Hide the loader |
| `toggle()` | - | Toggle loader visibility |
| `isVisible()` | - | Check if loader is visible |
| `update(options)` | `object` | Update multiple properties at once |

## Events

| Event | Detail | Description |
|-------|---------|-------------|
| `loader-start` | `{type, size, text}` | Fired when loader is initially rendered |
| `loader-show` | `{type, size, text}` | Fired when loader becomes visible |
| `loader-hide` | `{type, size, text}` | Fired when loader becomes hidden |

### Event Handling
```javascript
// Listen for loader events
const loader = document.querySelector('terminal-loader');

loader.addEventListener('loader-show', (e) => {
  console.log('Loader shown:', e.detail);
});

loader.addEventListener('loader-hide', (e) => {
  console.log('Loader hidden:', e.detail);
});

loader.addEventListener('loader-start', (e) => {
  console.log('Loader initialized:', e.detail);
});
```

## Styling

The component uses CSS custom properties for theming:

```css
:root {
  --terminal-green: #00ff41;
  --terminal-green-dim: #00cc33;
  --terminal-red: #ff4444;
  --terminal-yellow: #ffff00;
  --terminal-cyan: #00ffff;
  --terminal-gray-light: #333333;
}
```

### Custom Styling
```css
/* Custom loader colors */
.my-loader {
  --loader-color: #ff6b6b;
}

/* Custom positioning utilities */
.loader-center-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

/* Custom text styling */
.loader-text {
  font-size: 14px;
  color: #00ff41;
  font-weight: bold;
}
```

### Utility Classes
```css
/* Pre-built utility classes */
.loader-inline { /* Horizontal layout */ }
.loader-centered { /* Absolute center positioning */ }
.loader-overlay { /* Full-screen overlay */ }
.loader-block { /* Block-level container */ }

/* Color variants */
.loader-success { --loader-color: var(--terminal-green); }
.loader-error { --loader-color: var(--terminal-red); }
.loader-warning { --loader-color: var(--terminal-yellow); }
.loader-info { --loader-color: var(--terminal-cyan); }
.loader-dim { --loader-color: var(--terminal-green-dim); }
```

## Accessibility

The component includes accessibility features:
- Reduced motion support (animations disabled when user prefers reduced motion)
- High contrast mode support
- Semantic structure for screen readers
- Proper ARIA attributes when used as loading indicators

### Accessibility Best Practices
```html
<!-- Add ARIA attributes for screen readers -->
<terminal-loader 
  type="spinner" 
  text="Loading content"
  role="status"
  aria-live="polite"
  aria-label="Loading content, please wait">
</terminal-loader>
```

## Examples

### Basic Loading States
```html
<!-- Page loading -->
<div class="page-loader">
  <terminal-loader type="spinner" text="Loading page..."></terminal-loader>
</div>

<!-- Data fetching -->
<div class="data-container">
  <terminal-loader type="dots" text="Fetching data..." color="#00ffff"></terminal-loader>
</div>

<!-- Form processing -->
<form id="contact-form">
  <terminal-loader type="bars" text="Sending message..." style="display: none;"></terminal-loader>
</form>
```

### Dynamic Loading States
```javascript
// Progress through different loader states
const loader = document.querySelector('#dynamic-loader');

// Stage 1: Initial loading
loader.update({
  type: 'spinner',
  text: 'Connecting...',
  color: '#00ff41'
});
loader.show();

setTimeout(() => {
  // Stage 2: Processing
  loader.update({
    type: 'dots',
    text: 'Processing data...',
    color: '#ffff00'
  });
}, 2000);

setTimeout(() => {
  // Stage 3: Finalizing
  loader.update({
    type: 'bars',
    text: 'Almost done...',
    color: '#00ffff'
  });
}, 4000);

setTimeout(() => {
  // Complete
  loader.hide();
}, 6000);
```

### Integration with Async Operations
```javascript
// Wrap async operations with loader
async function loadUserData(userId) {
  const loader = document.querySelector('#user-loader');
  
  try {
    loader.update({
      type: 'spinner',
      text: 'Loading user profile...',
      size: 'medium'
    });
    loader.show();
    
    const user = await fetchUser(userId);
    
    loader.setText('Loading user posts...');
    const posts = await fetchUserPosts(userId);
    
    loader.hide();
    displayUserProfile(user, posts);
    
  } catch (error) {
    loader.update({
      type: 'dots',
      text: 'Failed to load user data',
      color: '#ff4444'
    });
    
    setTimeout(() => loader.hide(), 3000);
  }
}
```

### Overlay Loading
```javascript
// Create full-screen loading overlay
function showPageLoader(message = 'Loading...') {
  const overlay = document.createElement('div');
  overlay.className = 'loader-overlay';
  overlay.innerHTML = `
    <terminal-loader 
      type="spinner" 
      size="large" 
      text="${message}"
      color="#00ff41">
    </terminal-loader>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function hidePageLoader(overlay) {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}

// Usage
const overlay = showPageLoader('Loading application...');
setTimeout(() => hidePageLoader(overlay), 3000);
```

## Browser Support

- Modern browsers with Web Components support
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Dependencies

- Extends `TerminalComponent` base class
- Requires `loader.css` for styling
- Uses CSS custom properties for theming