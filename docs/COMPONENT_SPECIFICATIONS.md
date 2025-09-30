# Terminal Kit Component Specifications

**Status:** Component Migration Blueprint
**Version:** 1.0.0
**Last Updated:** 2025-09-27

> **Purpose:** This document provides structural skeletons for ALL Terminal Kit components to guide Lit migration. Each specification acts as a blueprint showing exactly which blocks, patterns, and features each component needs.

---

## Table of Contents

1. [Profile Legend](#profile-legend)
2. [Form Controls](#form-controls)
   - [t-btn - Button](#t-btn---button)
   - [t-inp - Input](#t-inp---input)
   - [t-sld - Slider](#t-sld---slider)
   - [t-tog - Toggle](#t-tog---toggle)
   - [t-drp - Dropdown](#t-drp---dropdown)
   - [t-clr - Color Picker](#t-clr---color-picker)
   - [t-textarea - Textarea](#t-textarea---textarea)
3. [Layout & Container](#layout--container)
   - [t-pnl - Panel](#t-pnl---panel)
   - [t-mdl - Modal](#t-mdl---modal)
   - [t-tre - Tree View](#t-tre---tree-view)
   - [t-tre-node - Tree Node](#t-tre-node---tree-node)
4. [Display & Feedback](#display--feedback)
   - [t-ldr - Loader](#t-ldr---loader)
   - [t-tst - Toast](#t-tst---toast)
   - [t-sta - Status Bar](#t-sta---status-bar)
   - [t-sta-field - Status Field](#t-sta-field---status-field)
5. [Navigation](#navigation)
   - [t-usr - User Menu](#t-usr---user-menu)
6. [Dynamic & Special](#dynamic--special)
   - [t-dyn - Dynamic Controls](#t-dyn---dynamic-controls)

---

## Profile Legend

| Profile | Blocks | Test Suites | Description |
|---------|--------|-------------|-------------|
| **CORE** | 1-9, 12-13 | 3 | Basic components |
| **FORM** | CORE + 11 | 6 | Form controls with validation |
| **FORM-ADVANCED** | FORM + special | 6-7 | Form with ElementInternals |
| **CONTAINER** | CORE + 10 | 5 | Components with nesting |
| **DISPLAY** | 1-7, 12-13 | 3 | Simple display-only |
| **BUNDLED-LIB** | FORM + lib patterns | 7 | iro.js color picker |
| **FULL** | ALL blocks | 7 | Complex multi-featured |

---

## Form Controls

### t-btn - Button

**Profile:** CORE
**Tag:** `<t-btn>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ❌ BLOCK 11 (no validation needed)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| variant | enum | 'primary' | ❌ | ✅ | primary, secondary, danger, success, warning, toggle |
| type | enum | 'text' | ❌ | ✅ | text, icon, icon-text |
| size | string | '' | ❌ | ✅ | xs, small, medium, large, '' |
| disabled | boolean | false | ❌ | ✅ | |
| loading | boolean | false | ❌ | ✅ | Shows loader overlay |
| icon | string | '' | ❌ | ❌ | Phosphor icon name |
| toggleState | boolean | false | ❌ | ✅ | For toggle variant |
| iconOn | string | '' | ❌ | ❌ | Toggle on icon |
| iconOff | string | '' | ❌ | ❌ | Toggle off icon |
| textOn | string | '' | ❌ | ❌ | Toggle on text |
| textOff | string | '' | ❌ | ❌ | Toggle off text |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| button-click | `{button: HTMLElement}` | Fires on click |
| toggle-change | `{state: boolean}` | Fires when toggle state changes |

#### Slots

| Name | Accepts | Description |
|------|---------|-------------|
| default | * | Button text content |

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| click() | - | void | Programmatic click |
| focus() | - | void | Focus button |
| blur() | - | void | Blur button |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ❌ Animation state
- ❌ Form participation
- ❌ Bundled library
- ✅ Width locking (for toggle with text)

#### Testing Profile

**CORE** - 3 required suites:
1. Properties
2. Rendering
3. Logging

---

### t-inp - Input

**Profile:** FORM-ADVANCED
**Tag:** `<t-inp>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ✅ BLOCK 11 (validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| type | enum | 'text' | ❌ | ✅ | text, password, email, number, search, tel, url |
| placeholder | string | '' | ❌ | ✅ | |
| value | string | '' | ✅ | ❌ | Pattern/type validation |
| disabled | boolean | false | ❌ | ✅ | |
| readonly | boolean | false | ❌ | ✅ | |
| required | boolean | false | ❌ | ✅ | |
| min | number | null | ❌ | ✅ | For number type |
| max | number | null | ❌ | ✅ | For number type |
| pattern | string | null | ❌ | ✅ | RegEx validation |
| autocomplete | string | 'off' | ❌ | ✅ | |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| input-value | `{value: string}` | Fires on every keystroke |
| input-change | `{value: string}` | Fires on blur/enter |
| input-error | `{error: string}` | Fires on validation error |
| input-focus | `{}` | Fires on focus |
| input-blur | `{}` | Fires on blur |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setValue(value) | string | void | Set value programmatically |
| getValue() | - | string | Get current value |
| focus() | - | void | Focus input |
| blur() | - | void | Blur input |
| validate() | - | boolean | Trigger validation |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ❌ Animation state
- ✅ Form participation (ElementInternals)
- ❌ Bundled library
- ✅ Validation (pattern, required, min/max)

#### Testing Profile

**FORM** - 6 required suites:
1. Properties
2. Rendering
3. Logging
4. Validation
5. Events
6. Form Participation

---

### t-sld - Slider

**Profile:** FORM-ADVANCED
**Tag:** `<t-sld>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ✅ BLOCK 11 (range validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| label | string | '' | ❌ | ✅ | |
| min | number | 0 | ✅ | ✅ | Must be < max |
| max | number | 100 | ✅ | ✅ | Must be > min |
| value | number | 50 | ✅ | ❌ | Must be between min-max |
| step | number | 1 | ❌ | ✅ | |
| disabled | boolean | false | ❌ | ✅ | |
| showTicks | boolean | false | ❌ | ✅ | |
| showValue | boolean | true | ❌ | ✅ | |
| vertical | boolean | false | ❌ | ✅ | |
| smooth | boolean | false | ❌ | ✅ | Continuous updates |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| slider-input | `{value: number}` | Fires during drag (continuous) |
| slider-change | `{value: number}` | Fires on release (final) |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setValue(value) | number | void | Set value |
| increment() | - | void | Increase by step |
| decrement() | - | void | Decrease by step |
| setRange(min, max) | number, number | void | Update range |

#### Special Patterns

- ❌ Timers
- ✅ Document listeners (mouse/touch tracking during drag)
- ❌ Animation state
- ✅ Form participation (ElementInternals)
- ❌ Bundled library
- ✅ Drag state management
- ✅ Debouncing (continuous vs final events)

#### Testing Profile

**FORM** - 6 required suites

---

### t-tog - Toggle

**Profile:** FORM-ADVANCED
**Tag:** `<t-tog>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| label | string | '' | ❌ | ✅ | |
| checked | boolean | false | ❌ | ✅ | |
| disabled | boolean | false | ❌ | ✅ | |
| variant | enum | 'switch' | ❌ | ✅ | switch, checkbox |
| labelPosition | enum | 'right' | ❌ | ✅ | left, right |
| iconOn | string | '' | ❌ | ❌ | Custom on icon |
| iconOff | string | '' | ❌ | ❌ | Custom off icon |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| toggle-change | `{checked: boolean}` | Fires on state change |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| toggle() | - | boolean | Toggle state |
| check() | - | void | Set checked |
| uncheck() | - | void | Set unchecked |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ✅ Animation state (switch slide transition)
- ✅ Form participation (ElementInternals)
- ❌ Bundled library

#### Testing Profile

**FORM** - 6 required suites

---

### t-drp - Dropdown

**Profile:** FORM
**Tag:** `<t-drp>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ✅ BLOCK 11 (options validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| placeholder | string | 'Select...' | ❌ | ✅ | |
| value | string | '' | ❌ | ❌ | Selected value |
| options | array | [] | ✅ | ❌ | Array of {value, label, icon?, type?, metadata?} |
| searchable | boolean | false | ❌ | ✅ | Enable search filter |
| disabled | boolean | false | ❌ | ✅ | |
| open | boolean | false | ❌ | ✅ | Dropdown open state |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| dropdown-change | `{value: string, option: object}` | Fires on selection |
| dropdown-open | `{}` | Fires when opened |
| dropdown-close | `{}` | Fires when closed |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setValue(value) | string | void | Set value |
| open() | - | void | Open dropdown |
| close() | - | void | Close dropdown |
| toggle() | - | void | Toggle open/close |
| setOptions(options) | array | void | Update options |

#### Special Patterns

- ❌ Timers
- ✅ Document listeners (click outside to close)
- ❌ Animation state
- ✅ Form participation (ElementInternals)
- ❌ Bundled library
- ✅ Complex object validation (options array)
- ✅ Marquee (long labels)

#### Testing Profile

**FORM** - 6 required suites

---

### t-clr - Color Picker

**Profile:** BUNDLED-LIB
**Tag:** `<t-clr>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ❌ BLOCK 11 (no validation - iro.js handles it)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| value | string | '#00ff41' | ❌ | ❌ | Hex color value |
| variant | enum | 'default' | ❌ | ✅ | default, minimal |
| disabled | boolean | false | ❌ | ✅ | |
| swatches | array | [] | ❌ | ❌ | Predefined color swatches |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| color-change | `{hex: string, rgb: object, hsl: object}` | Fires on color change |
| color-save | `{hex: string}` | Fires when color saved |
| swatches-update | `{swatches: array}` | Fires when swatches change |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setColor(hex) | string | void | Set color |
| getColor() | - | string | Get current hex |
| addSwatch(hex) | string | void | Add to swatches |
| clearSwatches() | - | void | Clear all swatches |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ❌ Animation state
- ✅ Form participation (ElementInternals)
- ✅ Bundled library (iro.js)
  - Init in firstUpdated()
  - Cleanup in disconnectedCallback()
  - Event bridging (iro events → Lit events)

#### Testing Profile

**BUNDLED-LIB** - 7 required suites:
1. Properties
2. Rendering
3. Logging
4. Validation (minimal - iro handles it)
5. Events
6. Form Participation
7. Library Integration

#### iro.js Integration Pattern

```javascript
// BLOCK 4: Internal State
_colorPicker = null; // iro instance

// BLOCK 7: firstUpdated
firstUpdated(changedProperties) {
  super.firstUpdated(changedProperties);
  this._initializeColorPicker();
}

// BLOCK 7: disconnectedCallback
disconnectedCallback() {
  super.disconnectedCallback();
  if (this._colorPicker) {
    this._colorPicker.off('color:change');
    this._colorPicker = null;
  }
}

// BLOCK 13: Private Helpers
_initializeColorPicker() {
  const container = this.shadowRoot.querySelector('.color-picker');
  this._colorPicker = new iro.ColorPicker(container, {
    width: 200,
    color: this.value
  });

  this._colorPicker.on('color:change', (color) => {
    this._emitEvent('color-change', {
      hex: color.hexString,
      rgb: color.rgb,
      hsl: color.hsl
    });
  });
}
```

---

### t-textarea - Textarea

**Profile:** FORM-ADVANCED
**Tag:** `<t-textarea>`
**Category:** Form Controls

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ✅ BLOCK 11 (validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| placeholder | string | '' | ❌ | ✅ | |
| value | string | '' | ✅ | ❌ | MaxLength validation |
| rows | number | 4 | ❌ | ✅ | |
| disabled | boolean | false | ❌ | ✅ | |
| readonly | boolean | false | ❌ | ✅ | |
| required | boolean | false | ❌ | ✅ | |
| maxlength | number | null | ❌ | ✅ | |
| codeMode | boolean | false | ❌ | ✅ | Enable IDE features |
| showLineNumbers | boolean | false | ❌ | ✅ | For code mode |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| textarea-input | `{value: string}` | Fires on keystroke |
| textarea-change | `{value: string}` | Fires on blur |
| textarea-focus | `{}` | Fires on focus |
| textarea-blur | `{}` | Fires on blur |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setValue(value) | string | void | Set value |
| getValue() | - | string | Get value |
| focus() | - | void | Focus textarea |
| blur() | - | void | Blur textarea |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ❌ Animation state
- ✅ Form participation (ElementInternals)
- ❌ Bundled library
- ✅ Advanced keyboard handling (Tab, Enter, Ctrl+/, Ctrl+D for code mode)

#### Testing Profile

**FORM** - 6 required suites

---

## Layout & Container

### t-pnl - Panel

**Profile:** FULL
**Tag:** `<t-pnl>`
**Category:** Layout

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ✅ BLOCK 10 (container with nesting)
- ✅ BLOCK 11 (validation for variant, slots)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| title | string | '' | ❌ | ✅ | |
| variant | enum | 'standard' | ✅ | ✅ | standard, headless |
| collapsible | boolean | false | ❌ | ✅ | |
| collapsed | boolean | false | ❌ | ✅ | |
| compact | boolean | false | ❌ | ✅ | Smaller size |
| large | boolean | false | ❌ | ✅ | Larger size |
| loading | boolean | false | ❌ | ✅ | Shows loader |
| resizable | boolean | false | ❌ | ✅ | |
| draggable | boolean | false | ❌ | ✅ | |
| icon | string | '' | ❌ | ❌ | Header icon |
| footerCollapsed | boolean | false | ❌ | ✅ | |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| panel-collapsed | `{collapsed: boolean}` | Main collapse state changed |
| panel-footer-collapsed | `{footerCollapsed: boolean}` | Footer collapse state changed |
| panel-loading-start | `{}` | Loading state started |
| panel-loading-end | `{}` | Loading state ended |

#### Slots

| Name | Accepts | Description |
|------|---------|-------------|
| default | * | Main panel content (can nest panels) |
| actions | t-btn | Action buttons (auto-sized, max 10) |
| footer | * | Footer content (collapsible independently) |

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| toggleCollapse() | - | boolean | Toggle main collapse |
| collapse() | - | void | Collapse panel |
| expand() | - | void | Expand panel |
| toggleFooterCollapse() | - | boolean | Toggle footer |
| startLoading() | - | void | Show loader |
| stopLoading() | - | void | Hide loader |

#### Special Patterns

- ✅ Timers (loading auto-timeout)
- ❌ Document listeners
- ✅ Animation state (collapse transitions)
- ❌ Form participation
- ❌ Bundled library
- ✅ Nesting (discovers and sizes child buttons)
- ✅ Multi-slot validation
- ✅ Context propagation (size, theme to children)

#### Testing Profile

**FULL** - 7 required suites:
1. Properties
2. Rendering
3. Logging
4. Nesting
5. Slot Validation
6. Events
7. Methods

---

### t-mdl - Modal

**Profile:** FULL
**Tag:** `<t-mdl>`
**Category:** Layout

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ✅ BLOCK 10 (container with complex layouts)
- ✅ BLOCK 11 (layout/size validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| visible | boolean | false | ❌ | ✅ | |
| layout | enum | 'single' | ✅ | ✅ | single, 2-column, 2x2, 1-2-1, 2-1 |
| size | enum | 'medium' | ✅ | ✅ | small, medium, large, xlarge, full |
| escapeClose | boolean | true | ❌ | ✅ | Close on Escape key |
| backdropClose | boolean | true | ❌ | ✅ | Close on backdrop click |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| modal-show | `{}` | Fires when shown |
| modal-hide | `{}` | Fires when hidden |
| modal-before-close | `{cancel: function}` | Fires before close (preventable) |
| modal-close | `{}` | Fires after close |

#### Slots

Named slots depend on layout:
- **single**: `default`
- **2-column**: `left`, `right`
- **2x2**: `top-left`, `top-right`, `bottom-left`, `bottom-right`
- **1-2-1**: `top`, `middle-left`, `middle-right`, `bottom`
- **2-1**: `left`, `right`

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| show() | - | void | Show modal |
| hide() | - | void | Hide modal |
| toggle() | - | void | Toggle visibility |

#### Special Patterns

- ❌ Timers
- ✅ Document listeners (Escape key, backdrop click)
- ✅ Animation state (backdrop fade, modal slide)
- ❌ Form participation
- ❌ Bundled library
- ✅ Complex slot layouts (5 different layouts)
- ✅ Body scroll lock (prevent scrolling when open)

#### Testing Profile

**FULL** - 7 required suites

---

### t-tre - Tree View

**Profile:** FULL
**Tag:** `<t-tre>`
**Category:** Layout

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ✅ BLOCK 10 (advanced parent-child coordination)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| multiSelect | boolean | false | ❌ | ✅ | |
| expandOnSelect | boolean | false | ❌ | ✅ | |
| collapsible | boolean | true | ❌ | ✅ | |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| selection-change | `{selectedNodes: array}` | Fires when selection changes |
| node-expanded | `{node: element}` | Fires when node expands |
| node-collapsed | `{node: element}` | Fires when node collapses |

#### Slots

| Name | Accepts | Description |
|------|---------|-------------|
| default | t-tre-node | Tree nodes |

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| getAllNodes() | - | array | Get all tree nodes |
| getVisibleNodes() | - | array | Get visible nodes only |
| getSelectedNodes() | - | array | Get selected nodes |
| expandAll() | - | void | Expand all nodes |
| collapseAll() | - | void | Collapse all nodes |
| clearSelection() | - | void | Clear selection |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ❌ Animation state
- ❌ Form participation
- ❌ Bundled library
- ✅ Bidirectional parent-child communication
- ✅ Node registry (tracks all nodes)
- ✅ Selection state management
- ✅ Keyboard navigation

#### Testing Profile

**FULL** - 7 required suites

---

### t-tre-node - Tree Node

**Profile:** CONTAINER
**Tag:** `<t-tre-node>`
**Category:** Layout

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ✅ BLOCK 10 (child of tree view, parent of other nodes)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| label | string | '' | ❌ | ✅ | |
| icon | string | '' | ❌ | ❌ | |
| expanded | boolean | false | ❌ | ✅ | |
| selected | boolean | false | ❌ | ✅ | |
| hasChildren | boolean | false | ❌ | ✅ | Auto-detected |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| node-select | `{node: this}` | Bubbles to tree view |
| node-deselect | `{node: this}` | Bubbles to tree view |
| node-expand | `{node: this}` | Bubbles to tree view |
| node-collapse | `{node: this}` | Bubbles to tree view |

#### Slots

| Name | Accepts | Description |
|------|---------|-------------|
| default | t-tre-node | Nested child nodes |

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| select() | - | void | Select node |
| deselect() | - | void | Deselect node |
| expand() | - | void | Expand node |
| collapse() | - | void | Collapse node |
| toggle() | - | void | Toggle expanded |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ✅ Animation state (expand/collapse transitions)
- ❌ Form participation
- ❌ Bundled library
- ✅ Bidirectional communication with parent tree
- ✅ Recursive nesting (nodes contain nodes)

#### Testing Profile

**CONTAINER** - 5 required suites

---

## Display & Feedback

### t-ldr - Loader

**Profile:** DISPLAY
**Tag:** `<t-ldr>`
**Category:** Display

#### Blocks Required

- ✅ BLOCK 1-7 (basic lifecycle)
- ❌ BLOCK 8-9 (no public methods or events)
- ❌ BLOCK 10 (not a container)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| type | enum | 'spinner' | ❌ | ✅ | spinner, dots, bars, pulse |
| size | enum | 'medium' | ❌ | ✅ | small, medium, large |
| color | string | '' | ❌ | ✅ | CSS color value |
| text | string | '' | ❌ | ✅ | Optional loading text |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| loader-show | `{}` | Fires when shown |
| loader-hide | `{}` | Fires when hidden |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| show() | - | void | Show loader |
| hide() | - | void | Hide loader |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ✅ Animation state (CSS animations for spinner/dots/bars)
- ❌ Form participation
- ❌ Bundled library

#### Testing Profile

**DISPLAY** - 3 required suites:
1. Properties
2. Rendering
3. Logging

---

### t-tst - Toast

**Profile:** CORE
**Tag:** `<t-tst>`
**Category:** Display

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not a container)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| message | string | '' | ❌ | ✅ | |
| type | enum | 'info' | ❌ | ✅ | success, error, warning, info |
| duration | number | 3000 | ❌ | ✅ | Auto-dismiss time (0 = manual) |
| visible | boolean | false | ❌ | ✅ | |
| position | enum | 'top-right' | ❌ | ✅ | top-right, top-left, bottom-right, bottom-left |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| toast-show | `{}` | Fires when shown |
| toast-hide | `{}` | Fires when hidden |
| toast-click | `{}` | Fires on toast click |
| toast-dismiss | `{}` | Fires on manual dismiss |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| show() | - | void | Show toast |
| dismiss() | - | void | Hide toast |

#### Special Patterns

- ✅ Timers (auto-dismiss after duration)
- ❌ Document listeners
- ✅ Animation state (entrance/exit animations)
- ❌ Form participation
- ❌ Bundled library
- ✅ Timer cleanup (clear on dismiss/unmount)

#### Testing Profile

**CORE** - 3 required suites

---

### t-sta - Status Bar

**Profile:** CONTAINER
**Tag:** `<t-sta>`
**Category:** Display

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ✅ BLOCK 10 (contains t-sta-field components)
- ✅ BLOCK 11 (width validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| fields | array | [] | ✅ | ❌ | Array of {label, value, icon, width, align, marquee} |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| field-click | `{field: object, index: number}` | Fires on field click |

#### Slots

| Name | Accepts | Description |
|------|---------|-------------|
| default | t-sta-field | Status fields |

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setFields(fields) | array | void | Update all fields |
| updateField(index, field) | number, object | void | Update single field |
| updateFieldValue(index, value) | number, string | void | Update field value only |

#### Special Patterns

- ✅ Timers (marquee animations)
- ❌ Document listeners
- ✅ Animation state (marquee for long text)
- ❌ Form participation
- ❌ Bundled library
- ✅ Layout calculation (proportional width scaling)
- ✅ Width validation (ensure total ≤ 95%)

#### Testing Profile

**CONTAINER** - 5 required suites

---

### t-sta-field - Status Field

**Profile:** DISPLAY
**Tag:** `<t-sta-field>`
**Category:** Display

#### Blocks Required

- ✅ BLOCK 1-7 (basic lifecycle)
- ❌ BLOCK 8-9 (no methods/events)
- ❌ BLOCK 10 (not a container)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| label | string | '' | ❌ | ✅ | |
| value | string | '' | ❌ | ✅ | |
| icon | string | '' | ❌ | ❌ | |
| width | string | 'auto' | ❌ | ✅ | CSS width value |
| align | enum | 'left' | ❌ | ✅ | left, center, right |

#### Events

None

#### Slots

None

#### Public Methods

None

#### Special Patterns

- ❌ All special patterns

#### Testing Profile

**DISPLAY** - 3 required suites

---

## Navigation

### t-usr - User Menu

**Profile:** CONTAINER
**Tag:** `<t-usr>`
**Category:** Navigation

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ❌ BLOCK 10 (not really a container, but manages menu items)
- ❌ BLOCK 11 (no validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| userName | string | 'User' | ❌ | ✅ | |
| userEmail | string | '' | ❌ | ✅ | |
| userAvatar | string | '' | ❌ | ❌ | Image URL |
| disabled | boolean | false | ❌ | ✅ | |
| open | boolean | false | ❌ | ✅ | Menu open state |
| menuItems | array | [] | ❌ | ❌ | Custom menu items |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| menu-select | `{itemId: string}` | Fires on menu item click |
| menu-open | `{}` | Fires when menu opens |
| menu-close | `{}` | Fires when menu closes |

#### Slots

None

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| open() | - | void | Open menu |
| close() | - | void | Close menu |
| toggle() | - | void | Toggle menu |
| setMenuItems(items) | array | void | Update menu items |
| setUserInfo(info) | object | void | Update user info |

#### Special Patterns

- ❌ Timers
- ✅ Document listeners (click outside, Escape key)
- ❌ Animation state
- ❌ Form participation
- ❌ Bundled library
- ✅ Click-outside pattern

#### Testing Profile

**CORE** - 3 required suites (+ document listeners test)

---

## Dynamic & Special

### t-dyn - Dynamic Controls

**Profile:** FULL
**Tag:** `<t-dyn>`
**Category:** Special

#### Blocks Required

- ✅ BLOCK 1-9 (ALL CORE)
- ✅ BLOCK 10 (generates nested components)
- ✅ BLOCK 11 (schema validation)
- ✅ BLOCK 12-13 (render + helpers)

#### Properties

| Name | Type | Default | Validation | Reflects | Notes |
|------|------|---------|------------|----------|-------|
| schema | object | null | ✅ | ❌ | Component generation schema |

#### Events

| Name | Detail | Description |
|------|--------|-------------|
| control-change | `{path: string, value: any}` | Fires when any control changes |
| control-trigger | `{path: string, action: string}` | Fires on control action |

#### Slots

None (fully dynamic)

#### Public Methods

| Name | Params | Returns | Description |
|------|--------|---------|-------------|
| setSchema(schema) | object | void | Update schema |
| getValues() | - | object | Get all control values |
| setValue(path, value) | string, any | void | Set specific value |

#### Special Patterns

- ❌ Timers
- ❌ Document listeners
- ❌ Animation state
- ❌ Form participation
- ❌ Bundled library
- ✅ Dynamic component generation (from config)
- ✅ Recursive rendering (nested structures)
- ✅ PanelBuilder integration
- ✅ Schema validation

#### Testing Profile

**FULL** - 7 required suites (includes dynamic generation tests)

---

## Summary Statistics

### By Profile

| Profile | Count | Components |
|---------|-------|------------|
| CORE | 3 | t-btn, t-tst, t-usr |
| FORM | 3 | t-inp, t-sld, t-drp, t-textarea |
| FORM-ADVANCED | 1 | t-tog |
| CONTAINER | 4 | t-pnl, t-mdl, t-tre, t-sta |
| DISPLAY | 2 | t-ldr, t-sta-field |
| BUNDLED-LIB | 1 | t-clr |
| FULL | 4 | t-pnl, t-mdl, t-tre, t-dyn |

### Block Usage

| Block | Required For | Count | Components |
|-------|--------------|-------|------------|
| 1-9 | ALL | 18 | All |
| 10 | Containers | 7 | t-pnl, t-mdl, t-tre, t-tre-node, t-sta, t-dyn, (t-usr partial) |
| 11 | Validation | 8 | t-inp, t-sld, t-drp, t-textarea, t-pnl, t-mdl, t-sta, t-dyn |
| 12-13 | ALL | 18 | All |

### Special Pattern Usage

| Pattern | Count | Components |
|---------|-------|------------|
| Timers | 3 | t-pnl, t-tst, t-sta |
| Document listeners | 5 | t-sld, t-drp, t-mdl, t-usr, (t-pnl optional) |
| Animation state | 6 | t-tog, t-pnl, t-mdl, t-tre-node, t-tst, t-sta |
| Form participation | 6 | t-inp, t-sld, t-tog, t-drp, t-clr, t-textarea |
| Bundled library | 1 | t-clr (iro.js) |
| Nesting | 7 | t-pnl, t-mdl, t-tre, t-tre-node, t-sta, t-dyn |

---

**Next Steps:**

1. Use these specifications as blueprints during Lit migration
2. Each spec shows exactly what blocks, patterns, and features needed
3. Test suites clearly defined per component
4. Patterns documented with examples
5. Ready for systematic migration component-by-component