# Component Build Tasks

## Prerequisites
- Review existing components in `/src-v2/js/components/` for patterns
- Use `TerminalComponent` base class from `TerminalComponent.js`
- Follow CSS structure in `/src-v2/css/components/`
- Reference `/src-v2/docs/COMPONENT_ROADMAP_FINAL.md` for specifications

## Build Order & Tasks

### 1. TerminalButton Toggle Variant
**Files to create/modify:**
- [ ] Update `/src-v2/js/components/TerminalButton.js`
  - Add `variant="toggle"` support
  - Add `icon-on`, `icon-off`, `color-on`, `color-off` attributes
  - Add `toggle-state` attribute
  - Implement `toggle()` method
  - Emit `toggle` event with state
- [ ] Update `/src-v2/css/components/button.css`
  - Add `.toggle` variant styles
  - Add state-based color classes
- [ ] Create `/src-v2/docs/components/TerminalButton.md`
  - Update with toggle variant documentation
  - Add toggle API methods
- [ ] Update `/src-v2/demo-components.html`
  - Add toggle button examples
  - Show play/pause example
  - Show expand/collapse example

### 2. TerminalUserMenu
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalUserMenu.js`
  - Extends TerminalComponent
  - Dropdown triggered by user badge click
  - Menu items: profile, settings, logout
  - Integration points for Clerk/Supabase
- [ ] Create `/src-v2/css/components/user-menu.css`
  - Dropdown styles
  - Menu item styles
  - Hover/active states
- [ ] Create `/src-v2/docs/components/TerminalUserMenu.md`
  - API documentation
  - Event documentation
  - Integration examples
- [ ] Add to `/src-v2/demo-components.html`
  - Basic menu example
  - With custom items example

### 3. TerminalStatusBar
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalStatusBar.js`
  - Container for status fields
  - Support for multiple fields
- [ ] Create `/src-v2/js/components/TerminalStatusField.js`
  - Individual field component
  - Label, icon, value properties
  - Marquee scrolling for long text
- [ ] Create `/src-v2/css/components/status-bar.css`
  - Bar layout styles
  - Field styles
  - Marquee animation
- [ ] Create `/src-v2/docs/components/TerminalStatusBar.md`
  - API documentation
  - Field configuration
  - Dynamic update examples
- [ ] Add to `/src-v2/demo-components.html`
  - Basic status bar
  - With marquee text
  - Dynamic updates example

### 4. TerminalPanel
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalPanel.js`
  - Three modes: with-header, headless, with-taskbar
  - Slots: header-actions, content, taskbar
  - Collapsible when header present
  - Title, icon support
- [ ] Create `/src-v2/css/components/panel.css`
  - Header styles
  - Content area styles
  - Taskbar styles
  - Collapsed state
- [ ] Create `/src-v2/docs/components/TerminalPanel.md`
  - All three modes documentation
  - Slot usage
  - Nesting examples
- [ ] Add to `/src-v2/demo-components.html`
  - Header panel example
  - Headless panel example
  - Panel with taskbar example
  - Nested components example

### 5. TerminalModal
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalModal.js`
  - Layout modes: single, 2-column, 2x2, 1-2-1, 2-1
  - Backdrop with click-to-close
  - Close button
  - Escape key support
  - Can house multiple panels
- [ ] Create `/src-v2/css/components/modal.css`
  - Backdrop styles
  - Modal container
  - Layout grid styles
  - Animation (fade/slide)
- [ ] Create `/src-v2/docs/components/TerminalModal.md`
  - Layout documentation
  - Event handling
  - Panel nesting examples
- [ ] Add to `/src-v2/demo-components.html`
  - Single panel modal
  - 2-column modal
  - Complex layout modal

### 6. TerminalDynamicControls
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalDynamicControls.js`
  - Schema-based control generation
  - Control types: number, color, dropdown, text, trigger, boolean, group
  - Recursive nesting for groups
  - Collapsible state management
  - Value change events
- [ ] Create `/src-v2/css/components/dynamic-controls.css`
  - Control group styles
  - Nested indentation
  - Collapse/expand styles
- [ ] Create `/src-v2/docs/components/TerminalDynamicControls.md`
  - Schema format documentation
  - Control type specifications
  - Nesting examples
  - Event handling
- [ ] Add to `/src-v2/demo-components.html`
  - Simple controls example
  - Nested groups example
  - Rive-like controls example

### 7. TerminalTreeView
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalTreeView.js`
  - Hierarchical node structure
  - Expand/collapse nodes
  - Selection management
  - Icon support per node
- [ ] Create `/src-v2/js/components/TerminalTreeNode.js`
  - Individual node component
  - Children management
  - Click/select events
- [ ] Create `/src-v2/css/components/tree-view.css`
  - Tree structure styles
  - Indentation levels
  - Selection highlights
  - Expand/collapse icons
- [ ] Create `/src-v2/docs/components/TerminalTreeView.md`
  - Node structure documentation
  - Event handling
  - Selection API
- [ ] Add to `/src-v2/demo-components.html`
  - File tree example
  - Animation hierarchy example
  - Dynamic tree example

### 8. TerminalToast
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalToast.js`
  - Toast types: success, error, warning, info
  - Auto-dismiss timer
  - Manual dismiss
  - Toast queue management
- [ ] Create `/src-v2/css/components/toast.css`
  - Toast container positioning
  - Toast styles per type
  - Animation (slide/fade)
- [ ] Create `/src-v2/docs/components/TerminalToast.md`
  - Show/hide methods
  - Toast types
  - Queue management
- [ ] Add to `/src-v2/demo-components.html`
  - Success toast example
  - Error toast example
  - Queue example

### 9. TerminalLoader
**Files to create:**
- [ ] Create `/src-v2/js/components/TerminalLoader.js`
  - Loader types: spinner, dots, bars
  - Size variants: small, medium, large
  - Optional text message
- [ ] Create `/src-v2/css/components/loader.css`
  - Spinner animation
  - Dots animation
  - Bars animation
- [ ] Create `/src-v2/docs/components/TerminalLoader.md`
  - Loader types
  - Size options
  - Usage patterns
- [ ] Add to `/src-v2/demo-components.html`
  - All loader types
  - Different sizes
  - With text examples

## Component Standards Checklist
Each component must:
- [ ] Extend TerminalComponent base class
- [ ] Use observedAttributes for reactive props
- [ ] Implement proper lifecycle methods
- [ ] Have comprehensive CSS with CSS variables
- [ ] Include full API documentation
- [ ] Have demo examples showing all variants
- [ ] Support theme customization
- [ ] Be accessible (ARIA, keyboard navigation)
- [ ] Emit appropriate custom events
- [ ] Have consistent naming patterns

## File Structure Template
```
/src-v2/
  js/components/
    Terminal[ComponentName].js
  css/components/
    [component-name].css
  docs/components/
    Terminal[ComponentName].md
  demo-components.html (update with examples)
```

## API Documentation Template
Each component documentation must include:
1. Component description
2. Tag name
3. Attributes table
4. Methods documentation
5. Events documentation
6. CSS classes/variables
7. Usage examples
8. Integration notes

## Testing Each Component
After building each component:
1. Test all documented attributes
2. Test all methods work as expected
3. Test all events fire correctly
4. Test keyboard navigation
5. Test responsive behavior
6. Test theme variable changes
7. Verify demo shows all variants

## Import Pattern
Follow existing pattern in demo-components.html:
```javascript
import { Terminal[ComponentName] } from './js/components/Terminal[ComponentName].js';
```

## CSS Import Pattern
Add to demo-components.html:
```html
<link rel="stylesheet" href="css/components/[component-name].css">
```