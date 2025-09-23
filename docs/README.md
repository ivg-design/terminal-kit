# Terminal UI Components Documentation

A comprehensive library of terminal-styled web components built with vanilla JavaScript and CSS.

## Component List

### Core Components

- [TerminalComponent](./components/TerminalComponent.md) - Base class for all components
- [TerminalButton](./components/TerminalButton.md) - Button with variants and toggle support
- [TerminalInput](./components/TerminalInput.md) - Text input with validation
- [TerminalTextarea](./components/TerminalTextarea.md) - Multi-line text input with line numbers
- [TerminalToggle](./components/TerminalToggle.md) - Toggle switch and checkbox variants
- [TerminalSlider](./components/TerminalSlider.md) - Range slider with value display

### Layout Components

- [TerminalPanel](./components/TerminalPanel.md) - Collapsible container panel
- [TerminalModal](./components/TerminalModal.md) - Modal dialog with animations
- [TerminalStatusBar](./components/TerminalStatusBar.md) - Status bar with dynamic fields
- [TerminalStatusField](./components/terminal-status-field.md) - Individual status field component

### Interactive Components

- [TerminalDropdown](./components/TerminalDropdown.md) - Dropdown selector with search
- [TerminalColorPicker](./components/TerminalColorPicker.md) - Color picker with swatches
- [TerminalTreeView](./components/TerminalTreeView.md) - Tree view with expand/collapse
- [TerminalTreeNode](./components/TerminalTreeNode.md) - Individual tree node (internal)
- [TerminalDynamicControls](./components/TerminalDynamicControls.md) - Dynamic form controls from JSON

### Feedback Components

- [TerminalLoader](./components/TerminalLoader.md) - Loading spinner with variants
- [TerminalToast](./components/TerminalToast.md) - Toast notifications

### Menu Components

- [TerminalUserMenu](./components/TerminalUserMenu.md) - User avatar and dropdown menu

## Getting Started

### Installation

```html
<!-- Include base styles -->
<link rel="stylesheet" href="css/theme/terminal.css">
<link rel="stylesheet" href="css/components/form.css">
<link rel="stylesheet" href="css/components/button.css">
<!-- Add other component styles as needed -->

<!-- Import components -->
<script type="module">
  import './js/components/TerminalComponent.js';
  import './js/components/TerminalInput.js';
  import './js/components/TerminalButton.js';
  // Import other components as needed
</script>
```

### Basic Usage

```html
<!-- Simple button -->
<terminal-button variant="primary">Click Me</terminal-button>

<!-- Input with validation -->
<terminal-input
  type="email"
  placeholder="Enter email"
  required>
</terminal-input>

<!-- Toggle switch -->
<terminal-toggle
  label="Enable feature"
  checked>
</terminal-toggle>
```

### Component Architecture

All components extend from `TerminalComponent` base class which provides:
- Property management with automatic re-rendering
- Event emission system
- Lifecycle hooks (onMount, afterRender, etc.)
- DOM querying utilities
- Event listener management with auto-cleanup

### Styling

Components use a terminal-inspired design system with:
- Green-on-black color scheme
- Monospace fonts (SF Mono, Monaco)
- Retro CRT-like effects (glow, scanlines)
- CSS variables for theming

Key CSS variables:
```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-black: #0a0a0a;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--terminal-red: #ff3333;
--terminal-yellow: #ffcc00;
```

### Events

Components emit custom events that bubble and compose:
```javascript
// Listen to events
const input = document.querySelector('terminal-input');
input.addEventListener('input-value', (e) => {
  console.log('Value changed:', e.detail.value);
});

input.addEventListener('input-error', (e) => {
  console.log('Validation error:', e.detail.message);
});
```

### Form Integration

Components work with native HTML forms:
```html
<form id="myForm">
  <terminal-input name="email" type="email" required></terminal-input>
  <terminal-toggle name="subscribe"></terminal-toggle>
  <terminal-button type="submit">Submit</terminal-button>
</form>
```

### Advanced Features

- **Validation**: Built-in HTML5 validation with custom error messages
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Theming**: CSS variable overrides for custom color schemes
- **Performance**: Efficient rendering with minimal DOM updates
- **TypeScript**: Full TypeScript definitions available

## Demos

Interactive demos are available in the `/demos` directory:

- [input.html](../demos/input.html) - Input validation examples
- [buttons.html](../demos/buttons.html) - Button variants and states
- [dropdown.html](../demos/dropdown.html) - Dropdown with search and metadata
- [color-picker.html](../demos/color-picker.html) - Color picker with Supabase integration
- [dynamic-controls.html](../demos/dynamic-controls.html) - Dynamic form generation
- [loader.html](../demos/loader.html) - Loading animations
- [modal.html](../demos/modal.html) - Modal dialogs
- [panel.html](../demos/panel.html) - Collapsible panels
- [slider.html](../demos/slider.html) - Range sliders
- [status-bar.html](../demos/status-bar.html) - Status bar with fields
- [textarea.html](../demos/textarea.html) - Textarea with line numbers
- [toast.html](../demos/toast.html) - Toast notifications
- [toggle.html](../demos/toggle.html) - Toggle switches
- [tree.html](../demos/tree.html) - Tree view navigation
- [user-menu.html](../demos/user-menu.html) - User menu dropdown

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- No IE11 support

Components use modern web standards:
- Custom Elements v1
- ES6 modules
- CSS Grid/Flexbox
- CSS Custom Properties

## Contributing

See [COMPONENTS_API_AUDIT.md](./COMPONENTS_API_AUDIT.md) for implementation status and known issues.

## License

MIT