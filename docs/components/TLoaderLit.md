# TLoaderLit Component Documentation

## Overview

The TLoaderLit component (`<t-ldr>`) is an advanced loading indicator with 55+ animation types from the wc-spinners library, wrapped in terminal/cyberpunk styling. It provides a comprehensive collection of spinners from Epic Spinners, React Spinners, and CSS Spinners libraries, all unified under a single component interface.

**Component Tag:** `<t-ldr>`
**Category:** Display
**Version:** 3.0.0
**Profile:** DISPLAY

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Properties](#properties)
3. [Methods](#methods)
4. [Events](#events)
5. [Spinner Types](#spinner-types)
6. [Styling](#styling)
7. [Examples](#examples)
8. [Advanced Usage](#advanced-usage)

## Basic Usage

```html
<!-- Import the component -->
<script type="module">
  import 'path/to/TLoaderLit.js';
</script>

<!-- Basic loader -->
<t-ldr type="atom-spinner" size="60" color="#00ff41"></t-ldr>

<!-- Loader with text -->
<t-ldr type="pixel-spinner" size="70" text="Processing..." color="#ffb000"></t-ldr>

<!-- Loader with glow effect -->
<t-ldr type="orbit-spinner" size="55" color="#00ffff" glow></t-ldr>
```

## Properties

### Complete Property Reference

| Property | Type | Default | Attribute | Reflects | Description |
|----------|------|---------|-----------|----------|-------------|
| `type` | `String` | `'atom-spinner'` | `type` | Yes | The spinner animation type. Must be one of the 55 available spinner types. |
| `size` | `Number` | `60` | `size` | Yes | Size of the spinner in pixels. Can also accept string values: 'small' (30px), 'medium' (60px), 'large' (90px). |
| `color` | `String` | `'#00ff41'` | `color` | Yes | Color of the spinner. Accepts any valid CSS color value (hex, rgb, hsl, color names). |
| `duration` | `Number` | `1` | `duration` | Yes | Animation duration in seconds. Controls the speed of the spinner animation. |
| `text` | `String` | `''` | `text` | Yes | Optional loading text displayed below the spinner. |
| `hidden` | `Boolean` | `false` | `hidden` | Yes | Controls visibility of the loader. When true, the loader is hidden. |
| `glow` | `Boolean` | `false` | `glow` | Yes | Adds a glow effect to the spinner using CSS drop-shadow. |

### Property Details

#### `type` Property
Controls which spinner animation to display. The component includes 55 different spinner types from three libraries:
- **Epic Spinners:** 20 types
- **React Spinners:** 20 types
- **CSS Spinners:** 15 types

```javascript
// Setting spinner type
loader.type = 'pixel-spinner';

// Or via attribute
<t-ldr type="orbit-spinner"></t-ldr>
```

#### `size` Property
Controls the spinner size. Accepts numeric values in pixels or named sizes.

```javascript
// Numeric size in pixels
loader.size = 45;

// Named sizes
loader.size = 'small';  // 30px
loader.size = 'medium'; // 60px
loader.size = 'large';  // 90px

// Via attribute
<t-ldr size="80"></t-ldr>
<t-ldr size="large"></t-ldr>
```

#### `color` Property
Sets the spinner color. Accepts any valid CSS color format.

```javascript
// Hex color
loader.color = '#ff6b35';

// RGB
loader.color = 'rgb(255, 107, 53)';

// HSL
loader.color = 'hsl(15, 100%, 60%)';

// Color name
loader.color = 'cyan';

// Via attribute
<t-ldr color="#00ff41"></t-ldr>
```

#### `duration` Property
Controls animation speed. Value is in seconds.

```javascript
// Fast animation (0.5 seconds)
loader.duration = 0.5;

// Slow animation (3 seconds)
loader.duration = 3;

// Via attribute
<t-ldr duration="1.5"></t-ldr>
```

#### `text` Property
Optional loading message displayed below the spinner.

```javascript
// Set loading text
loader.text = 'Loading data...';

// Clear text
loader.text = '';

// Via attribute
<t-ldr text="Please wait..."></t-ldr>
```

#### `hidden` Property
Controls loader visibility.

```javascript
// Hide loader
loader.hidden = true;

// Show loader
loader.hidden = false;

// Via attribute
<t-ldr hidden></t-ldr>
```

#### `glow` Property
Adds a glow effect to the spinner.

```javascript
// Enable glow
loader.glow = true;

// Disable glow
loader.glow = false;

// Via attribute
<t-ldr glow></t-ldr>
```

## Methods

### Complete Method Reference

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `show()` | None | `void` | Shows the loader by setting `hidden` to `false` and dispatches 'loader-show' event. |
| `hide()` | None | `void` | Hides the loader by setting `hidden` to `true` and dispatches 'loader-hide' event. |
| `toggle()` | None | `void` | Toggles loader visibility. If hidden, shows it; if visible, hides it. |
| `setType(type)` | `type: String` | `void` | Sets the spinner type. Only accepts valid spinner types. |
| `getAvailableTypes()` | None | `String[]` | Returns an array of all 55 available spinner type names. |
| `setText(text)` | `text: String` | `void` | Sets the loading text displayed below the spinner. |

### Method Details

#### `show()` Method
Shows the loader and dispatches a custom event.

```javascript
const loader = document.querySelector('t-ldr');
loader.show();

// Listen for the event
loader.addEventListener('loader-show', (e) => {
  console.log('Loader shown:', e.detail.type);
});
```

#### `hide()` Method
Hides the loader and dispatches a custom event.

```javascript
const loader = document.querySelector('t-ldr');
loader.hide();

// Listen for the event
loader.addEventListener('loader-hide', (e) => {
  console.log('Loader hidden:', e.detail.type);
});
```

#### `toggle()` Method
Toggles between show and hide states.

```javascript
const loader = document.querySelector('t-ldr');
loader.toggle(); // If visible, hides; if hidden, shows
```

#### `setType(type)` Method
Programmatically changes the spinner type with validation.

```javascript
const loader = document.querySelector('t-ldr');

// Valid type - will change
loader.setType('pixel-spinner');

// Invalid type - will log warning, won't change
loader.setType('invalid-spinner');
```

#### `getAvailableTypes()` Method
Returns all available spinner types for dynamic UI generation.

```javascript
const loader = document.querySelector('t-ldr');
const types = loader.getAvailableTypes();

// Create dropdown of available types
types.forEach(type => {
  console.log(type); // 'atom-spinner', 'pixel-spinner', etc.
});

// Returns array of 55 spinner types
```

#### `setText(text)` Method
Updates the loading text programmatically.

```javascript
const loader = document.querySelector('t-ldr');
loader.setText('Connecting to server...');

// Clear text
loader.setText('');
```

## Events

### Complete Event Reference

| Event Name | Detail | Bubbles | Composed | Description |
|------------|--------|---------|----------|-------------|
| `loader-connected` | `{ type: String }` | Yes | Yes | Fired when the loader is connected to the DOM. |
| `loader-show` | `{ type: String }` | Yes | Yes | Fired when the loader is shown via `show()` method. |
| `loader-hide` | `{ type: String }` | Yes | Yes | Fired when the loader is hidden via `hide()` method. |

### Event Details

#### `loader-connected` Event
Dispatched when the component is added to the DOM.

```javascript
document.addEventListener('loader-connected', (e) => {
  console.log('Loader connected with type:', e.detail.type);
});
```

#### `loader-show` Event
Dispatched when the loader becomes visible.

```javascript
loader.addEventListener('loader-show', (e) => {
  console.log('Showing loader:', e.detail.type);
  // Start loading operation
});
```

#### `loader-hide` Event
Dispatched when the loader becomes hidden.

```javascript
loader.addEventListener('loader-hide', (e) => {
  console.log('Hiding loader:', e.detail.type);
  // Loading complete
});
```

## Spinner Types

### Complete List of 55 Spinner Types

#### Epic Spinners (20 types)
1. `atom-spinner` - Atomic orbital animation
2. `breeding-rhombus-spinner` - Breeding rhombus shapes
3. `circles-to-rhombuses-spinner` - Morphing circles to rhombuses
4. `fingerprint-spinner` - Fingerprint-like circular pattern
5. `flower-spinner` - Blooming flower animation
6. `fulfilling-bouncing-circle-spinner` - Bouncing circle that fills
7. `fulfilling-square-spinner` - Square that fills progressively
8. `half-circle-spinner` - Rotating half circles
9. `hollow-dots-spinner` - Hollow dots in circular pattern
10. `intersecting-circles-spinner` - Overlapping circular paths
11. `looping-rhombuses-spinner` - Looping rhombus shapes
12. `orbit-spinner` - Orbital motion animation
13. `pixel-spinner` - Pixelated loading animation
14. `radar-spinner` - Radar sweep effect
15. `scaling-squares-spinner` - Scaling square patterns
16. `self-building-square-spinner` - Square that builds itself
17. `semipolar-spinner` - Semi-polar coordinate animation
18. `spring-spinner` - Spring/coil animation
19. `swapping-squares-spinner` - Squares swapping positions
20. `trinity-rings-spinner` - Three interlocked rings

#### React Spinners (20 types)
21. `bar-spinner` - Loading bars animation
22. `beat-spinner` - Beating/pulsing animation
23. `bounce-spinner` - Bouncing dots
24. `circle-spinner` - Circular loading animation
25. `climbing-box-spinner` - Box climbing stairs effect
26. `clip-spinner` - Clipping circle animation
27. `dot-spinner` - Animated dots
28. `fade-spinner` - Fading elements
29. `grid-spinner` - Grid of animated squares
30. `hash-spinner` - Hash/pound sign animation
31. `moon-spinner` - Crescent moon rotation
32. `pacman-spinner` - Pac-Man eating dots
33. `propagate-spinner` - Propagating wave effect
34. `pulse-spinner` - Pulsing circles
35. `ring-spinner` - Ring rotation
36. `rise-spinner` - Rising elements
37. `rotate-spinner` - Rotating square
38. `scale-spinner` - Scaling animation
39. `skew-spinner` - Skewing rectangle
40. `square-spinner` - Square rotation

#### CSS Spinners (15 types)
41. `rsc-circle-spinner` - Simple circle spinner
42. `default-spinner` - Default loading spinner
43. `dual-ring-spinner` - Double ring animation
44. `ellipsis-spinner` - Ellipsis dots animation
45. `facebook-spinner` - Facebook-style loader
46. `rsc-grid-spinner` - Grid pattern loader
47. `heart-spinner` - Heart shape animation
48. `hourglass-spinner` - Hourglass rotation
49. `orbitals-spinner` - Orbital paths
50. `ouroboro-spinner` - Ouroboros (snake eating tail)
51. `rsc-ring-spinner` - Ring spinner variant
52. `ripple-spinner` - Ripple effect
53. `roller-spinner` - Rolling animation
54. `spinner-spinner` - Classic spinner
55. `sync-spinner` - Synchronized circles

## Styling

### CSS Custom Properties

The component exposes CSS custom properties for styling:

```css
t-ldr {
  /* Core properties */
  --loader-color: #00ff41;    /* Spinner color */
  --loader-size: 60px;         /* Spinner size */
  --loader-duration: 1s;       /* Animation duration */

  /* Terminal theme variables (fallbacks) */
  --terminal-green: #00ff41;
  --terminal-amber: #ffb000;
  --terminal-red: #ff003c;
  --terminal-cyan: #00ffff;
  --terminal-purple: #9d00ff;

  /* Typography */
  --font-mono: 'Courier New', monospace;
  --font-size-sm: 14px;

  /* Spacing */
  --spacing-sm: 12px;
  --spacing-md: 16px;
}
```

### Color Presets

The component includes built-in color presets via attributes:

```html
<!-- Terminal color presets -->
<t-ldr color="green"></t-ldr>   <!-- #00ff41 -->
<t-ldr color="amber"></t-ldr>   <!-- #ffb000 -->
<t-ldr color="red"></t-ldr>     <!-- #ff003c -->
<t-ldr color="cyan"></t-ldr>    <!-- #00ffff -->
<t-ldr color="purple"></t-ldr>  <!-- #9d00ff -->
```

### Size Presets

Named size attributes for convenience:

```html
<t-ldr size="small"></t-ldr>   <!-- 30px -->
<t-ldr size="medium"></t-ldr>  <!-- 60px -->
<t-ldr size="large"></t-ldr>   <!-- 90px -->
```

## Examples

### Basic Examples

```html
<!-- Simple loader -->
<t-ldr></t-ldr>

<!-- Custom type and size -->
<t-ldr type="pixel-spinner" size="80"></t-ldr>

<!-- With loading text -->
<t-ldr type="orbit-spinner" text="Loading data..."></t-ldr>

<!-- Custom color and speed -->
<t-ldr type="atom-spinner" color="#ff6b35" duration="2"></t-ldr>

<!-- With glow effect -->
<t-ldr type="radar-spinner" color="#00ffff" glow></t-ldr>

<!-- Initially hidden -->
<t-ldr type="pulse-spinner" hidden></t-ldr>
```

### JavaScript Control

```javascript
// Get loader element
const loader = document.querySelector('t-ldr');

// Configure loader
loader.type = 'fingerprint-spinner';
loader.size = 75;
loader.color = '#00ff41';
loader.duration = 1.5;
loader.text = 'Authenticating...';
loader.glow = true;

// Show loader during async operation
async function fetchData() {
  loader.show();
  loader.setText('Fetching data...');

  try {
    const data = await fetch('/api/data');
    // Process data
  } finally {
    loader.hide();
  }
}

// Toggle on button click
document.querySelector('#toggleBtn').addEventListener('click', () => {
  loader.toggle();
});
```

### Dynamic Type Selection

```javascript
// Create type selector
const loader = document.querySelector('t-ldr');
const types = loader.getAvailableTypes();

const select = document.createElement('select');
types.forEach(type => {
  const option = document.createElement('option');
  option.value = type;
  option.textContent = type;
  select.appendChild(option);
});

select.addEventListener('change', (e) => {
  loader.setType(e.target.value);
});
```

### Loading States Management

```javascript
class LoadingManager {
  constructor(loader) {
    this.loader = loader;
    this.states = {
      connecting: { text: 'Connecting...', type: 'orbit-spinner' },
      authenticating: { text: 'Authenticating...', type: 'fingerprint-spinner' },
      loading: { text: 'Loading data...', type: 'bar-spinner' },
      processing: { text: 'Processing...', type: 'grid-spinner' },
      saving: { text: 'Saving...', type: 'pulse-spinner' }
    };
  }

  setState(state) {
    const config = this.states[state];
    if (config) {
      this.loader.setType(config.type);
      this.loader.setText(config.text);
      this.loader.show();
    }
  }

  clear() {
    this.loader.hide();
  }
}

// Usage
const manager = new LoadingManager(document.querySelector('t-ldr'));
manager.setState('connecting');
// ... later
manager.setState('loading');
// ... when done
manager.clear();
```

## Advanced Usage

### Creating a Loading Button

```html
<button id="saveBtn">
  Save
  <t-ldr
    type="circle-spinner"
    size="20"
    color="white"
    hidden>
  </t-ldr>
</button>

<script>
const btn = document.getElementById('saveBtn');
const loader = btn.querySelector('t-ldr');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  loader.show();

  try {
    await saveData();
  } finally {
    loader.hide();
    btn.disabled = false;
  }
});
</script>
```

### Random Spinner Demo

```javascript
function randomSpinner() {
  const loader = document.querySelector('t-ldr');
  const types = loader.getAvailableTypes();
  const colors = ['#00ff41', '#ffb000', '#ff003c', '#00ffff', '#9d00ff'];

  // Random configuration
  loader.setType(types[Math.floor(Math.random() * types.length)]);
  loader.color = colors[Math.floor(Math.random() * colors.length)];
  loader.size = Math.floor(Math.random() * 60) + 40; // 40-100
  loader.duration = Math.random() * 2 + 0.5; // 0.5-2.5
}
```

### Loading Overlay

```html
<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .loading-overlay[hidden] {
    display: none;
  }
</style>

<div class="loading-overlay" hidden>
  <t-ldr
    type="atom-spinner"
    size="90"
    color="#00ff41"
    text="Please wait..."
    glow>
  </t-ldr>
</div>

<script>
function showOverlay() {
  document.querySelector('.loading-overlay').hidden = false;
}

function hideOverlay() {
  document.querySelector('.loading-overlay').hidden = true;
}
</script>
```

### Accessibility Considerations

The component respects the `prefers-reduced-motion` media query:

```css
/* Animations are automatically disabled for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  /* Spinner animations and text pulsing are disabled */
}
```

### Performance Notes

1. **Lazy Loading:** The wc-spinners library is loaded when the component is imported
2. **GPU Acceleration:** Animations use CSS transforms for better performance
3. **Scaling Adjustments:** Each spinner type has optimized scale factors for consistent sizing
4. **Event Delegation:** Use event delegation for multiple loaders

```javascript
// Efficient event handling for multiple loaders
document.addEventListener('loader-show', (e) => {
  if (e.target.tagName === 'T-LDR') {
    console.log('Loader shown:', e.target.type);
  }
});
```

## Browser Compatibility

- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

The component uses:
- Web Components (Custom Elements v1)
- CSS Custom Properties
- ES6 Modules
- Lit 2.0+ framework

## Dependencies

- **Lit:** ^2.0.0
- **wc-spinners:** Bundled in `/public/js/libs/wc-spinners.js`

## Migration Guide

### From Previous Versions

If migrating from an older loader component:

```javascript
// Old API
loader.setSize(60);
loader.setColor('#00ff41');
loader.showLoader();
loader.hideLoader();

// New API (v3.0.0)
loader.size = 60;
loader.color = '#00ff41';
loader.show();
loader.hide();
```

## Troubleshooting

### Common Issues

1. **Invalid Spinner Type Error**
   - Ensure the type is one of the 55 valid types
   - Use `getAvailableTypes()` to see all options

2. **Spinner Not Visible**
   - Check the `hidden` property
   - Ensure the component is imported correctly
   - Verify wc-spinners.js is loaded

3. **Wrong Size**
   - Some spinners have internal scaling adjustments
   - Use numeric values for precise control
   - Check if CSS is overriding the size

4. **Color Not Applying**
   - Use valid CSS color formats
   - Some spinners may have multiple colored elements
   - Check browser dev tools for CSS conflicts

## Complete API Summary

### Properties Summary
- `type`: Spinner animation type (55 options)
- `size`: Size in pixels or named size
- `color`: Any CSS color value
- `duration`: Animation speed in seconds
- `text`: Optional loading text
- `hidden`: Visibility control
- `glow`: Glow effect toggle

### Methods Summary
- `show()`: Display the loader
- `hide()`: Hide the loader
- `toggle()`: Toggle visibility
- `setType(type)`: Change spinner type
- `getAvailableTypes()`: Get all spinner types
- `setText(text)`: Update loading text

### Events Summary
- `loader-connected`: Component connected to DOM
- `loader-show`: Loader displayed
- `loader-hide`: Loader hidden

## Support

For issues, feature requests, or questions:
- GitHub Issues: [terminal-kit-loader/issues](https://github.com/terminal-kit/loader/issues)
- Documentation: [Terminal Kit Docs](https://terminal-kit.dev/components/loader)