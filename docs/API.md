# Terminal Components API Documentation

## Table of Contents

### Core Components
- [TerminalComponent](./components/TerminalComponent.md) - Base component class

### UI Components
- [TerminalButton](./components/TerminalButton.md) - Interactive button component
- [TerminalInput](./components/TerminalInput.md) - Text input field component
- [TerminalDropdown](./components/TerminalDropdown.md) - Nested dropdown with search
- [TerminalColorPicker](./components/TerminalColorPicker.md) - Color selection component
- [TerminalSlider](./components/TerminalSlider.md) - Range slider component
- [TerminalToggle](./components/TerminalToggle.md) - Toggle switch component

## Quick Start

```html
<!-- Include CSS -->
<link rel="stylesheet" href="css/theme/terminal.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/form.css">
<link rel="stylesheet" href="css/components/dropdown.css">
<link rel="stylesheet" href="css/components/slider.css">
<link rel="stylesheet" href="css/components/toggle.css">

<!-- Import Components -->
<script type="module">
  import './js/components/TerminalButton.js';
  import './js/components/TerminalInput.js';
  import './js/components/TerminalDropdown.js';
  import './js/components/TerminalColorPicker.js';
  import './js/components/TerminalSlider.js';
  import './js/components/TerminalToggle.js';
</script>

<!-- Use Components -->
<terminal-button variant="primary">Click Me</terminal-button>
<terminal-input type="text" placeholder="Enter text..."></terminal-input>
<terminal-dropdown placeholder="Select option..."></terminal-dropdown>
```

## Component Features

All components extend from `TerminalComponent` and share these common features:

- **Event System**: Custom events with `emit()` method
- **Lifecycle Hooks**: `onMount()`, `onUnmount()`, `afterRender()`
- **Props Management**: Reactive props with `setProp()` and `getProp()`
- **DOM Utilities**: `$()` and `$$()` query selectors
- **Event Cleanup**: Automatic listener cleanup on unmount
- **No Shadow DOM**: Direct styling with global CSS

## Styling

All components use a consistent terminal/cyberpunk theme with:
- **Primary Color**: `#00ff41` (Terminal Green)
- **Background**: Dark grays (`#0a0a0a` to `#333333`)
- **Font**: Monospace (`SF Mono`, `Monaco`, `Inconsolata`)
- **Effects**: Glowing borders, smooth transitions

## Browser Support

- Modern browsers with Web Components support
- Chrome 67+, Firefox 63+, Safari 10.1+, Edge 79+

## Contributing

See individual component documentation for detailed API references, examples, and customization options.