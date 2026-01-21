# TERMINAL-Kit

A retro-futuristic web components library with terminal aesthetics. Built with **Pure Lit Architecture** for zero FOUC, complete Shadow DOM encapsulation, and maximum performance.

## Customizable Terminal Color

All components use a unified accent color system via CSS variables. Change the terminal color globally:

```css
:root {
  --terminal-green: #00ffff;  /* Change to any color */
}
```

The library automatically derives related shades (`-dim`, `-bright`, `-dark`, `-glow`) from your base color. Components read these variables dynamically, so color changes apply instantly across all components.

For apps with user-selectable colors, include `accent-init.js` before your CSS to prevent flash of default color:

```html
<head>
  <script src="path/to/accent-init.js"></script>
  <link rel="stylesheet" href="your-styles.css">
</head>
```

The script reads from `localStorage` key `terminal-kit-demo-accent` and sets all color variables before CSS loads.

## Installation

```bash
npm install @ivg-design/tkit
```

## Features

- **Pure Lit 3.x** - Built entirely with Lit web components
- **Zero FOUC** - All styles compiled into components, instant rendering
- **Terminal Aesthetics** - Classic green-on-black cyberpunk styling
- **Shadow DOM** - Complete CSS encapsulation, no style conflicts
- **Reactive Properties** - Automatic re-rendering on property changes
- **Framework-Agnostic** - Works with React, Vue, Angular, or vanilla JS
- **Lightweight** - Minimal dependencies, tree-shakeable

## Architecture

**CRITICAL:** This library uses **Pure Lit Architecture**:
- All styles in `static styles` CSS template literal
- No external CSS loading
- No `adoptedStyleSheets`
- No FOUC (Flash of Unstyled Content)
- Complete Shadow DOM encapsulation

## Components

### Core Components
- **TButton** (`<t-btn>`) - Terminal-style buttons with size/variant options
- **TBadge** (`<t-bdg>`) - Count and status indicator badges
- **TChip** (`<t-chip>`) - Tag and filter chips with selection
- **TAccordion** (`<t-accordion>`) - Collapsible accordion container
- **TPanel** (`<t-pnl>`) - Collapsible panels with header, footer, and actions
- **TCard** (`<t-card>`) - Flexible content card container
- **TModal** (`<t-mdl>`) - Modal dialogs with layouts
- **TTooltip** (`<t-tip>`) - Information tooltips

### Form Components
- **TInput** (`<t-inp>`) - Text inputs with validation
- **TTextarea** (`<t-textarea>`) - Multiline text input with code mode
- **TDropdown** (`<t-drp>`) - Select dropdowns with search
- **TSlider** (`<t-sld>`) - Range sliders
- **TToggle** (`<t-tog>`) - Toggle switches and checkboxes
- **TColorPicker** (`<t-clr>`) - Color picker with swatches
- **TCalendar** (`<t-cal>`) - Date picker with single/multiple/range modes
- **TDynamicControls** (`<t-dynamic-controls>`) - JSON-driven form control generator

### Display Components
- **TAvatar** (`<t-avt>`) - User avatar with image, initials, status
- **TTimeline** (`<t-tmln>`) - Vertical timeline for events
- **TChart** (`<t-chart>`) - Data visualizations (bar, line, pie, donut)
- **TSkeleton** (`<t-skel>`) - Loading placeholder shapes
- **TLogEntry** (`<t-log-entry>`) - Structured log row
- **TLogList** (`<t-log-list>`) - Scrollable log list

### Status & Feedback
- **TLoader** (`<t-ldr>`) - Loading indicators
- **TProgress** (`<t-prg>`) - Progress bars and rings
- **TToast** (`<t-tst>`) - Toast notifications
- **TStatusBar** (`<t-sta>`) - Status bar with fields
- **TStatusField** (`<t-sta-field>`) - Individual status fields

### Navigation
- **TBreadcrumbs** (`<t-bread>`) - Breadcrumb navigation trail
- **TMenu** (`<t-menu>`) - Dropdown/context menus
- **TTabs** (`<t-tabs>`) - Tab navigation with panels
- **TUserMenu** (`<t-usr>`) - User menu dropdown

### Layout Components
- **TSplitter** (`<t-split>`) - Resizable panel divider
- **TList** (`<t-list>`) - Virtualized scrollable list
- **TTree** (`<t-tree>`) - Hierarchical tree structure
- **TKanban** (`<t-kanban>`) - Kanban board layout
- **TGrid** (`<t-grid>`) - Dashboard grid layout (`<t-grid-item>`)

### Composite Components
- **TChatPanel** (`<t-chat>`) - Chat UI with markdown, streaming, attachments

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>T-Kit Demo</title>
</head>
<body>
  <!-- Import components -->
  <script type="module">
    import { TPanelLit, TButtonLit } from '@ivg-design/tkit';
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

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Build documentation
npm run docs:build
```

## Documentation

- **API Documentation**: [`docs/API.md`](./docs/API.md)
- **Component Docs**: [`docs/components/`](./docs/components/) (full coverage for all 37 components)
- **Component Schema**: [`docs/COMPONENT_SCHEMA.md`](./docs/COMPONENT_SCHEMA.md)
- **Component Specs**: [`docs/COMPONENT_SPECIFICATIONS.md`](./docs/COMPONENT_SPECIFICATIONS.md)

## Demos

Interactive demos available in the `/demos` directory:

- [`demos/index.html`](./demos/index.html) - Demo gallery
- [`demos/dashboard.html`](./demos/dashboard.html) - Full dashboard showcase
- [`demos/buttons.html`](./demos/buttons.html) - Button variants
- [`demos/panels.html`](./demos/panels.html) - Panel component showcase

Run `npm run dev` and open http://localhost:12359/demos/ to explore.

## Third-Party Notices

This project bundles third-party libraries (Lit, GridStack, iro.js, marked, PrismJS, Phosphor Icons). See [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) for license details.

## Architecture Rules

### NEVER DO THIS:
```javascript
// External CSS imports
import './styles.css';

// adoptedStyleSheets
this.shadowRoot.adoptedStyleSheets = [sheet];

// innerHTML in constructor
constructor() {
  this.innerHTML = '...';
}

// Extend HTMLElement for new components
class MyComponent extends HTMLElement { }
```

### ALWAYS DO THIS:
```javascript
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

// Extend LitElement
class MyComponent extends LitElement {
  // Static styles block
  static styles = css`
    :host {
      display: block;
      background: var(--terminal-black-light);
    }
  `;

  // Reactive properties
  @property({ type: String })
  title = '';

  @property({ type: Boolean })
  collapsed = false;

  // Lit render method
  render() {
    return html`
      <div class="container">
        <h1>${this.title}</h1>
        ${this.collapsed ? html`<slot></slot>` : ''}
      </div>
    `;
  }

  // Lifecycle methods
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

## Contributing

Contributions welcome! Please:

1. Follow Pure Lit architecture
2. Add tests for new components
3. Update documentation
4. Run `npm test` before committing

## License

MIT License - Free to use, modify, and distribute with attribution required. See [LICENSE](./LICENSE) for details.

## Author

**IVG Design**
- Website: [forge.mograph.life](https://forge.mograph.life)
- GitHub: [@ivg-design](https://github.com/ivg-design)
