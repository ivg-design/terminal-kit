# Terminal Kit

A retro-futuristic web components library with terminal aesthetics. Built with **Pure Lit Architecture** for zero FOUC, complete Shadow DOM encapsulation, and maximum performance.

## Features

- **Pure Lit 3.x** - Built entirely with Lit web components
- **Zero FOUC** - All styles compiled into components, instant rendering
- **Terminal Aesthetics** - Classic green-on-black cyberpunk styling
- **Shadow DOM** - Complete CSS encapsulation, no style conflicts
- **Reactive Properties** - Automatic re-rendering on property changes
- **Framework-Agnostic** - Works with React, Vue, Angular, or vanilla JS
- **Lightweight** - Minimal dependencies, tree-shakeable
- **Type-Safe** - Full TypeScript support

## Architecture

**CRITICAL:** This library uses **Pure Lit Architecture**:
- ✅ All styles in `static styles` CSS template literal
- ✅ No external CSS loading
- ✅ No `adoptedStyleSheets`
- ✅ No FOUC (Flash of Unstyled Content)
- ✅ Complete Shadow DOM encapsulation

## Components

### Current Lit Components

- **TPanel** (`<t-pnl>`) - Collapsible panels with header, footer, and actions
- **TButton** (`<t-btn>`) - Terminal-style buttons with size/variant options
- **TInput** (`<t-inp>`) - Text inputs with validation
- **TToggle** (`<t-tog>`) - Toggle switches
- **TSlider** (`<t-sld>`) - Range sliders
- **TDropdown** (`<t-drp>`) - Select dropdowns with search
- **TColorPicker** (`<t-clr>`) - Color picker with swatches
- **TLoader** (`<t-ldr>`) - Loading indicators
- **TTextarea** (`<t-textarea>`) - Multiline text input

## Installation

```bash
npm install terminal-kit
```

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Terminal Kit Demo</title>
</head>
<body>
  <!-- Import components -->
  <script type="module">
    import './node_modules/terminal-kit/js/components/TPanelLit.js';
    import './node_modules/terminal-kit/js/components/TButtonLit.js';
  </script>

  <!-- Use components -->
  <t-pnl title="System Control" collapsible>
    <div slot="actions">
      <t-btn variant="primary">Execute</t-btn>
      <t-btn variant="danger">Terminate</t-btn>
    </div>

    <p>Panel content goes here</p>

    <div slot="footer">
      <span>Status: Ready</span>
    </div>
  </t-pnl>

  <script type="module">
    // Components are reactive
    const panel = document.querySelector('t-pnl');
    panel.addEventListener('panel-collapsed', (e) => {
      console.log('Collapsed:', e.detail.collapsed);
    });

    // Change properties dynamically
    setTimeout(() => {
      panel.title = "Updated Title";
      panel.collapsed = true;
    }, 2000);
  </script>
</body>
</html>
```

## Component Sizes

Most components support three size variants:

```html
<!-- Compact: Smallest size (20px header) -->
<t-pnl compact title="Compact Panel">...</t-pnl>

<!-- Standard: Default size (28px header) -->
<t-pnl title="Standard Panel">...</t-pnl>

<!-- Large: Largest size (36px header) -->
<t-pnl large title="Large Panel">...</t-pnl>
```

## Styling

### CSS Variables

Override theme variables to customize appearance:

```css
:root {
  /* Colors */
  --terminal-green: #00ff41;
  --terminal-green-bright: #33ff66;
  --terminal-green-dim: #00cc33;
  --terminal-green-dark: #008820;

  --terminal-black-light: #0d0d0d;
  --terminal-gray-dark: #242424;
  --terminal-gray-light: #333333;
  --terminal-gray: #808080;

  /* Typography */
  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace;
  --font-size-xs: 9px;
  --font-size-sm: 11px;
  --font-size-md: 13px;
  --font-size-lg: 16px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
}
```

### External Styling with `::part()`

Style component internals using CSS shadow parts:

```css
t-pnl::part(header) {
  background-color: #1a1a1a;
}

t-btn::part(button) {
  border-width: 2px;
}
```

## Development

```bash
# Clone the repo
git clone https://github.com/ivg-design/terminal-kit.git
cd terminal-kit

# Install dependencies (includes Lit 3.x)
npm install

# Start development server with hot reload
npm run dev

# Start with DevMirror (Chrome CDP integration)
npm run dev:all:mirror

# Build for production
npm run build

# Run tests
npm test
```

## API Documentation

Full API documentation available in [`docs/API.md`](./docs/API.md)

### Component Documentation
- [TPanelLit](./docs/components/TPanelLit.md) - Complete panel API
- [TButton](./docs/components/TButton.md) - Button variants and sizes
- [Component Creation Guide](./docs/COMPONENT_CREATION_GUIDE.md) - How to create new components

## Architecture Rules

### ❌ NEVER DO THIS:
```javascript
// ❌ External CSS imports
import './styles.css';

// ❌ adoptedStyleSheets
this.shadowRoot.adoptedStyleSheets = [sheet];

// ❌ innerHTML in constructor
constructor() {
  this.innerHTML = '...';
}

// ❌ Extend HTMLElement for new components
class MyComponent extends HTMLElement { }
```

### ✅ ALWAYS DO THIS:
```javascript
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

// ✅ Extend LitElement
class MyComponent extends LitElement {
  // ✅ Static styles block
  static styles = css`
    :host {
      display: block;
      background: var(--terminal-black-light);
    }
  `;

  // ✅ Reactive properties
  @property({ type: String })
  title = '';

  @property({ type: Boolean })
  collapsed = false;

  // ✅ Lit render method
  render() {
    return html`
      <div class="container">
        <h1>${this.title}</h1>
        ${this.collapsed ? html`<slot></slot>` : ''}
      </div>
    `;
  }

  // ✅ Lifecycle methods
  firstUpdated() {
    // Called after first render
  }
}

customElements.define('my-component', MyComponent);
```

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 16.4+
- Opera 76+

Older browsers require [Lit polyfills](https://lit.dev/docs/tools/requirements/#polyfills).

## Examples

Check out the demos:
- [`demos/panels.html`](./demos/panels.html) - Panel component showcase
- [`demos/buttons.html`](./demos/buttons.html) - Button variants
- Live demo: [https://terminal-kit-demo.netlify.app](https://terminal-kit-demo.netlify.app)

## Migration from Legacy Components

If you're using old `TerminalComponent` base class components:

1. Replace `<terminal-panel>` with `<t-pnl>`
2. Replace `<terminal-button>` with `<t-btn>`
3. Remove external CSS imports
4. Use Lit properties instead of `setProp()`
5. See [Migration Guide](./docs/MIGRATION_COMPLETE.md)

## Contributing

Contributions welcome! Please:

1. Follow Pure Lit architecture
2. Add tests for new components
3. Update documentation
4. Run `npm run lint` before committing

## License

MIT

## Author

IVG Design
- GitHub: [@ivg-design](https://github.com/ivg-design)
- Website: [ivg.design](https://ivg.design)