# Terminal UI Components Documentation

A comprehensive library of terminal-styled web components built with Lit 3.x.

## Component List

### Form Components

- [TButtonLit](./components/TButtonLit.md) - Button with variants and toggle support (`t-btn`)
- [TInputLit](./components/TInputLit.md) - Text input with validation (`t-inp`)
- [TTextareaLit](./components/TTextareaLit.md) - Multi-line text input with line numbers (`t-textarea`)
- [TToggleLit](./components/TToggleLit.md) - Toggle switch and checkbox variants (`t-tog`)
- [TSliderLit](./components/TSliderLit.md) - Range slider with value display (`t-sld`)
- [TDropdownLit](./components/TDropdownLit.md) - Dropdown selector with search (`t-drp`)
- [TColorPickerLit](./components/TColorPickerLit.md) - Color picker with swatches (`t-clr`)

### Layout Components

- [TPanelLit](./components/TPanelLit.md) - Collapsible container panel (`t-pnl`)
- [TModalLit](./components/TModalLit.md) - Modal dialog with animations (`t-mdl`)
- [TCardLit](./components/TCardLit.md) - Content card with header and actions (`t-card`)
- [TAccordionLit](./components/TAccordionLit.md) - Collapsible accordion sections (`t-accordion`)
- [TSplitterLit](./components/TSplitterLit.md) - Resizable split panes (`t-split`)
- [TGridLit](./components/TGridLit.md) - Dashboard grid layout (`t-grid`)
- [TTabsLit](./components/TTabsLit.md) - Tab navigation with panels (`t-tabs`)

### Data Display Components

- [TListLit](./components/TListLit.md) - Virtualized list with selection (`t-list`)
- [TTreeLit](./components/TTreeLit.md) - Hierarchical tree view (`t-tree`)
- [TBreadcrumbsLit](./components/TBreadcrumbsLit.md) - Breadcrumb navigation trail (`t-bread`)
- [TMenuLit](./components/TMenuLit.md) - Dropdown/context menu (`t-menu`)
- [TTimelineLit](./components/TTimelineLit.md) - Vertical timeline display (`t-tmln`)
- [TCalendarLit](./components/TCalendarLit.md) - Date picker calendar (`t-cal`)
- [TChartLit](./components/TChartLit.md) - Simple data visualizations (`t-chart`)
- [TKanbanLit](./components/TKanbanLit.md) - Kanban board with drag-and-drop (`t-kanban`)

### Log Components

- [TLogListLit](./components/TLogListLit.md) - Log viewer with filtering (`t-log-list`)
- [TLogEntryLit](./components/TLogEntryLit.md) - Individual log entry (`t-log-entry`)

### Feedback Components

- [TLoaderLit](./components/TLoaderLit.md) - Loading spinner with variants (`t-ldr`)
- [TToastLit](./components/TToastLit.md) - Toast notifications (`t-tst`)
- [TProgressLit](./components/TProgressLit.md) - Progress bar/ring indicators (`t-prg`)
- [TSkeletonLit](./components/TSkeletonLit.md) - Loading placeholder shapes (`t-skel`)
- [TTooltipLit](./components/TTooltipLit.md) - Hover tooltips (`t-tip`)

### UI Components

- [TBadgeLit](./components/TBadgeLit.md) - Count/status badges (`t-bdg`)
- [TChipLit](./components/TChipLit.md) - Tag/filter chips (`t-chip`)
- [TAvatarLit](./components/TAvatarLit.md) - User avatar display (`t-avt`)
- [TStatusBarLit](./components/TStatusBarLit.md) - Status bar with dynamic fields (`t-sta`)
- [TStatusFieldLit](./components/TStatusFieldLit.md) - Individual status field (`t-sta-field`)
- [TUserMenuLit](./components/TUserMenuLit.md) - User menu dropdown (`t-usr`)

### Specialized Components

- [TDynamicControlsLit](./components/TDynamicControlsLit.md) - Schema-driven form controls (`t-dynamic-controls`)
- [TChatPanelLit](./components/TChatPanelLit.md) - Chat interface panel (`t-chat`)

## Getting Started

### Installation

```html
<!-- Include theme styles -->
<link rel="stylesheet" href="css/theme/terminal.css">

<!-- Import components -->
<script type="module">
  import './js/components/TButtonLit.js';
  import './js/components/TInputLit.js';
  // Import other components as needed
</script>
```

### Basic Usage

```html
<!-- Simple button -->
<t-btn variant="primary">Click Me</t-btn>

<!-- Input with validation -->
<t-inp
  type="email"
  placeholder="Enter email"
  required>
</t-inp>

<!-- Toggle switch -->
<t-tog
  label="Enable feature"
  checked>
</t-tog>
```

### Component Architecture

All components are built with Lit 3.x and follow a 13-block schema structure:
- Shadow DOM encapsulation
- Reactive properties with automatic updates
- Custom event system with bubbles and composed
- CSS custom properties for theming
- Comprehensive logging via ComponentLogger

### Styling

Components use a terminal-inspired design system with:
- Green-on-black color scheme
- Monospace fonts (JetBrains Mono, SF Mono)
- CRT-inspired effects (glow, scanlines)
- CSS variables for theming

### Demo Utilities

All demo pages include a global tint picker in the header that updates `--terminal-green` (and related glow colors) for quick palette testing.

Key CSS variables:
```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-black: #0a0a0a;
--terminal-gray-dark: #333;
--terminal-gray-darkest: #1a1a1a;
--terminal-red: #ff003c;
--terminal-amber: #ffb000;
--terminal-cyan: #00ffff;
```

### Events

Components emit custom events that bubble and compose:
```javascript
const input = document.querySelector('t-inp');
input.addEventListener('input-change', (e) => {
  console.log('Value changed:', e.detail.value);
});
```

### Form Integration

Components work with native HTML forms via ElementInternals:
```html
<form id="myForm">
  <t-inp name="email" type="email" required></t-inp>
  <t-tog name="subscribe"></t-tog>
  <t-btn type="submit">Submit</t-btn>
</form>
```

## Demos

Interactive demos are available in the `/demos` directory:

### Featured Demos
- [dashboard.html](../demos/dashboard.html) - Comprehensive component showcase
- [dynamic-controls.html](../demos/dynamic-controls.html) - Schema-driven control generation
- [chat-panel.html](../demos/chat-panel.html) - Chat interface demo

### Form Components
- [input.html](../demos/input.html) - Input validation examples
- [buttons.html](../demos/buttons.html) - Button variants and states
- [dropdown.html](../demos/dropdown.html) - Dropdown with search
- [color-picker.html](../demos/color-picker.html) - Color picker
- [slider.html](../demos/slider.html) - Range sliders
- [textarea.html](../demos/textarea.html) - Textarea with line numbers
- [toggle.html](../demos/toggle.html) - Toggle switches

### Layout Components
- [panel.html](../demos/panel.html) - Collapsible panels
- [modal.html](../demos/modal.html) - Modal dialogs
- [accordion.html](../demos/accordion.html) - Accordion sections
- [tabs.html](../demos/tabs.html) - Tab navigation
- [splitter.html](../demos/splitter.html) - Resizable panes
- [grid.html](../demos/grid.html) - Dashboard grid layout

### Data Display
- [list.html](../demos/list.html) - Virtualized list
- [tree.html](../demos/tree.html) - Tree view navigation
- [timeline.html](../demos/timeline.html) - Timeline display
- [calendar.html](../demos/calendar.html) - Date picker
- [chart.html](../demos/chart.html) - Data visualizations
- [kanban.html](../demos/kanban.html) - Kanban board

### Feedback
- [loader.html](../demos/loader.html) - Loading animations
- [toast.html](../demos/toast.html) - Toast notifications
- [progress.html](../demos/progress.html) - Progress indicators
- [skeleton.html](../demos/skeleton.html) - Loading skeletons
- [tooltip.html](../demos/tooltip.html) - Tooltips

### UI Components
- [status-bar.html](../demos/status-bar.html) - Status bar
- [user-menu.html](../demos/user-menu.html) - User menu dropdown
- [badge.html](../demos/badge.html) - Badges
- [chip.html](../demos/chip.html) - Chips
- [avatar.html](../demos/avatar.html) - Avatars
- [menu.html](../demos/menu.html) - Context menus

## Third-Party Notices

Runtime dependencies and bundled assets are listed in [`third-party.md`](./third-party.md).

Icons are provided by Phosphor Icons (MIT). See the notices for details.

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- No IE11 support

Components use modern web standards:
- Custom Elements v1
- Shadow DOM v1
- ES6 modules
- CSS Grid/Flexbox
- CSS Custom Properties

## Development

### Running Locally

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Run tests
yarn test

# Build docs
yarn docs:build
```

### Component Schema

See [COMPONENT_SCHEMA.md](./COMPONENT_SCHEMA.md) for the 13-block structure all components follow.

### Component Specifications

See [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) for detailed specs per component.

## License

MIT
