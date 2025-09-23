# Terminal Kit

A retro-futuristic web components library with terminal aesthetics. Build cyberpunk-inspired UIs with pre-styled, customizable components.

## Features

- 🎨 **Terminal Aesthetics** - Classic green-on-black terminal styling
- ⚡ **Web Components** - Framework-agnostic, works everywhere
- 🌙 **Shadow DOM** - Encapsulated styles, no conflicts
- 🎯 **Zero Dependencies** - Pure vanilla JavaScript
- 📦 **Modular** - Import only what you need
- 🚀 **Performance** - Lightweight and fast

## Components

- **TButton** (`<t-btn>`) - Terminal-style buttons with variants
- **TPanel** (`<t-pnl>`) - Collapsible panels with headers
- **TInput** (`<t-inp>`) - Text inputs with validation
- **TToggle** (`<t-tog>`) - Toggle switches
- **TSlider** (`<t-sld>`) - Range sliders
- **TDropdown** (`<t-drp>`) - Select dropdowns with search
- **TColorPicker** (`<t-clr>`) - Color picker with swatches
- **TLoader** (`<t-ldr>`) - Loading indicators
- **TTextarea** (`<t-textarea>`) - Multiline text input
- **TStatusBar** (`<t-status-bar>`) - Status bars with fields

## Installation

```bash
npm install terminal-kit
```

## Quick Start

```html
<!-- Import the components you need -->
<script type="module">
  import 'terminal-kit/components/TButton.js';
  import 'terminal-kit/components/TPanel.js';
</script>

<!-- Use them in your HTML -->
<t-pnl title="System Control" collapsible>
  <t-btn variant="primary">Execute</t-btn>
  <t-btn variant="danger">Terminate</t-btn>
</t-pnl>
```

## Development

```bash
# Clone the repo
git clone https://github.com/ivg-design/terminal-kit.git
cd terminal-kit

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+

## License

MIT

## Author

IVG Design