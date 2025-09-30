# Terminal Components API Documentation

## Architecture: Pure Lit Components

**CRITICAL:** This library has migrated to **Pure Lit Architecture**. All components are built with [Lit 3.x](https://lit.dev/) using Shadow DOM encapsulation.

### Architecture Principles

1. **Zero FOUC** - All styles defined in `static styles` block, no external CSS loading
2. **Shadow DOM** - Complete style encapsulation using Lit's reactive properties
3. **Lit Elements** - All components extend `LitElement`, use `@property` decorators
4. **No adoptedStyleSheets** - Styles compiled into component definition
5. **Reactive Properties** - Data binding with `@property()` decorator
6. **Lifecycle Methods** - Use Lit lifecycle: `firstUpdated()`, `updated()`, `connectedCallback()`

### ⚠️ Migration from Legacy Components

If you see references to:
- `TerminalComponent` base class
- `DSD` (Declarative Shadow DOM)
- External CSS files
- `setHTMLUnsafe()`
- Hybrid architecture

**These are DEPRECATED.** All components are now Pure Lit.

## Table of Contents

### Lit Components (Current)
- [TPanelLit](./components/TPanelLit.md) - Panel with collapsible header/footer ✅ **CURRENT**
- [TButtonLit](./components/TButton.md) - Interactive button component ✅ **CURRENT**
- [TInputLit](./components/TerminalInput.md) - Text input field component
- [TDropdownLit](./components/TerminalDropdown.md) - Nested dropdown with search
- [TColorPickerLit](./components/TerminalColorPicker.md) - Color selection component
- [TSliderLit](./components/TerminalSlider.md) - Range slider component
- [TToggleLit](./components/TToggleLit.md) - Toggle switch and checkbox component ✅ **CURRENT**
- [TTextareaLit](./components/TerminalTextarea.md) - Multiline text input
- [TLoaderLit](./components/TerminalLoader.md) - Loading indicators

### Legacy Components (Deprecated)
- [TerminalComponent](./components/TerminalComponent.md) - ⚠️ DEPRECATED: Old base class
- [TerminalPanel](./components/TerminalPanel.md) - ⚠️ DEPRECATED: Use TPanelLit instead

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Terminal Kit Components</title>
</head>
<body>
  <!-- Import Lit components -->
  <script type="module">
    import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
    import './js/components/TPanelLit.js';
    import './js/components/TButtonLit.js';
  </script>

  <!-- Use components -->
  <t-pnl title="System Control" collapsible>
    <div slot="actions">
      <t-btn variant="primary">Execute</t-btn>
      <t-btn variant="danger">Terminate</t-btn>
    </div>

    <p>Panel content here</p>

    <div slot="footer">
      <span>Status: Ready</span>
    </div>
  </t-pnl>
</body>
</html>
```

## Component Features

All Lit components share these features:

### Shadow DOM Encapsulation
- ✅ Complete CSS isolation
- ✅ No style conflicts
- ✅ Predictable styling
- ✅ `::part()` for external styling

### Reactive Properties
```javascript
// Properties automatically re-render on change
panel.title = "New Title";
panel.collapsed = true;
```

### Custom Events
```javascript
// All components emit custom events
panel.addEventListener('panel-collapsed', (e) => {
  console.log('Panel collapsed:', e.detail);
});
```

### Slots for Content Distribution
```javascript
// Named slots for layout control
<t-pnl>
  <div slot="actions">...</div>
  <div>Default slot content</div>
  <div slot="footer">...</div>
</t-pnl>
```

### Lifecycle Hooks
```javascript
firstUpdated() {
  // Called after first render
}

updated(changedProperties) {
  // Called after any property update
  if (changedProperties.has('collapsed')) {
    // React to specific property changes
  }
}
```

## Styling

### CSS Variables
Components expose CSS variables for theming:

```css
:root {
  /* Terminal color palette */
  --terminal-green: #00ff41;
  --terminal-green-bright: #33ff66;
  --terminal-green-dim: #00cc33;
  --terminal-green-dark: #008820;

  --terminal-black-light: #0d0d0d;
  --terminal-gray-dark: #242424;
  --terminal-gray-light: #333333;
  --terminal-gray: #808080;

  /* Typography */
  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace;
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
```css
/* Style internal parts from outside */
t-pnl::part(header) {
  background-color: #1a1a1a;
}

t-btn::part(button) {
  font-weight: bold;
}
```

### Component Sizing Variants

Most components support size variants:
- `compact` - Smallest size (e.g., 20px header)
- (default) - Standard size (e.g., 28px header)
- `large` - Largest size (e.g., 36px header)

```html
<t-pnl compact>Compact panel</t-pnl>
<t-pnl>Standard panel</t-pnl>
<t-pnl large>Large panel</t-pnl>
```

## Browser Support

- Chrome/Edge 90+ (native Lit support)
- Firefox 90+ (native Lit support)
- Safari 16.4+ (native Lit support)
- Older browsers: Use Lit polyfills

## Development Setup

```bash
# Install dependencies (includes Lit 3.x)
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build
```

## Architecture Rules (MUST FOLLOW)

### ❌ NEVER DO THIS:
```javascript
// ❌ External CSS loading
import './styles.css';

// ❌ adoptedStyleSheets
this.shadowRoot.adoptedStyleSheets = [sheet];

// ❌ innerHTML in constructor
constructor() {
  this.innerHTML = '...';
}

// ❌ Mixing Lit and non-Lit patterns
class MyComponent extends HTMLElement {
  render() { return html`...`; } // Wrong!
}
```

### ✅ ALWAYS DO THIS:
```javascript
// ✅ Static styles block
static styles = css`
  :host {
    display: block;
  }
`;

// ✅ Reactive properties
@property({ type: Boolean })
collapsed = false;

// ✅ Lit render method
render() {
  return html`<div>${this.title}</div>`;
}

// ✅ Extend LitElement
class MyComponent extends LitElement {
  // ...
}
```

## Component Creation Guide

When creating new components:

1. **Extend LitElement** - Always use `extends LitElement`
2. **Define static styles** - All CSS in `static styles = css\`...\``
3. **Use @property decorators** - For reactive properties
4. **Implement render()** - Return Lit `html\`...\`` template
5. **Use lifecycle methods** - `firstUpdated()`, `updated()`, `connectedCallback()`
6. **Emit custom events** - Use `this.dispatchEvent(new CustomEvent(...))`
7. **Document all properties** - In component markdown file
8. **Add size variants** - Support `compact`, standard, `large` where applicable

## Contributing

When adding or updating components:

1. Follow Pure Lit architecture strictly
2. Update component documentation in `docs/components/`
3. Add examples to demo pages
4. Test all size variants
5. Verify Shadow DOM encapsulation
6. Check browser compatibility
7. Document all properties, methods, events, and slots

## Resources

- [Lit Documentation](https://lit.dev/)
- [Web Components Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Shadow DOM Specification](https://dom.spec.whatwg.org/#shadow-trees)
- [Terminal Kit GitHub](https://github.com/ivg-design/terminal-kit)