# Terminal UI Web Components Library

Welcome to the Terminal UI Components documentation. This library provides a collection of web components styled with a retro terminal aesthetic.

## Quick Start

```html
<!-- Import the components -->
<script type="module" src="js/components/TerminalComponent.js"></script>
<script type="module" src="js/components/TerminalButton.js"></script>
<!-- Add more components as needed -->

<!-- Use the components -->
<terminal-button variant="primary">Click Me</terminal-button>
```

## Available Components

### Base Component
- [TerminalComponent](components/TerminalComponent.md) - Base class for all terminal components

### Core Components
- [TerminalButton](components/TerminalButton.md) - Interactive button with multiple variants and toggle support
- [TerminalPanel](components/TerminalPanel.md) - Collapsible container panel with terminal styling
- [TerminalModal](components/TerminalModal.md) - Modal dialog with various layouts and animations
- [TerminalLoader](components/TerminalLoader.md) - Loading indicators (spinner, dots, bars)
- [TerminalToast](components/TerminalToast.md) - Toast notification system with positioning and queuing

### Form Components
- [TerminalInput](components/TerminalInput.md) - Text input field with comprehensive validation
- [TerminalTextarea](components/TerminalTextarea.md) - Multi-line text input with optional line numbers
- [TerminalToggle](components/TerminalToggle.md) - Toggle switch and checkbox variants
- [TerminalSlider](components/TerminalSlider.md) - Range slider with multiple display modes
- [TerminalDropdown](components/TerminalDropdown.md) - Dropdown selector with search and tree support
- [TerminalColorPicker](components/TerminalColorPicker.md) - Color picker with swatches and custom colors

### Display Components
- [TerminalStatusBar](components/TerminalStatusBar.md) - Status bar with dynamic fields and indicators
- [TerminalStatusField](components/terminal-status-field.md) - Individual status field component

### Data Components
- [TerminalTreeView](components/TerminalTreeView.md) - Hierarchical tree view with expand/collapse
- [TerminalDynamicControls](components/TerminalDynamicControls.md) - Dynamic form generation from JSON schema

### Menu Components
- [TerminalUserMenu](components/TerminalUserMenu.md) - User avatar with dropdown menu

## Features

- **Terminal Aesthetic**: Retro green-on-black terminal styling
- **Web Components**: Framework-agnostic, works anywhere
- **Customizable**: CSS variables for easy theming
- **Accessible**: ARIA support and keyboard navigation
- **Responsive**: Mobile-friendly designs

## Getting Started

1. Include the component scripts in your HTML
2. Use the custom elements in your markup
3. Customize with attributes and CSS variables

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT License - Use freely in your projects!

created by IVG Design 2025