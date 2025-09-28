# Test Suite Documentation

## Overview

Comprehensive test suite for Terminal Kit components. All tests validate that component manifests are accurate and that every documented feature is operational.

## Running Tests

```bash
npm test              # Run tests in watch mode
npm run test:ui       # Interactive UI
npm run test:run      # Run tests once (CI mode)
npm run test:coverage # With coverage report
```

## Test Coverage

### TPanelLit Component - 59 Tests (FULL Profile)

FULL profile component with complete lifecycle, nesting, and validation support.

#### 1. Manifest Completeness (6 tests)
Validates that the component manifest is complete and accurate:
- ✅ Manifest structure (tagName, displayName, version)
- ✅ All 11 properties documented
- ✅ All 7 methods documented
- ✅ All 4 events documented
- ✅ All 3 slots documented
- ✅ Variant enum values present

#### 2. Property Functionality (8 tests)
Every property in the manifest is tested for operational correctness:
- Value assignment works
- Attribute reflection works (for reflected properties)
- Default values are correct

**Properties Tested:**
- `title` - Panel title
- `variant` - Panel variant (standard | headless)
- `collapsible` - Enable collapse functionality
- `collapsed` - Collapsed state
- `compact` - Compact size mode
- `large` - Large size mode
- `loading` - Loading state
- `icon` - Header icon
- `footerCollapsed` - Footer collapsed state

#### 3. Method Functionality (7 tests)
Every method in the manifest is tested:
- ✅ `toggleCollapse()` - Works when collapsible, rejects when not
- ✅ `collapse()` - Collapses panel
- ✅ `expand()` - Expands panel
- ✅ `toggleFooterCollapse()` - Toggles footer
- ✅ `startLoading()` - Starts loading state
- ✅ `stopLoading()` - Stops loading state
- ✅ `receiveContext()` - Accepts parent context

#### 4. Event Functionality (17 tests)
Comprehensive event testing for all manifest events:

**panel-collapsed event (5 tests):**
- ✅ Fires via `toggleCollapse()`
- ✅ Fires via `collapse()`
- ✅ Fires via `expand()`
- ✅ Bubbles and is composed
- ✅ Includes correct detail structure (`{collapsed: boolean}`)

**panel-footer-collapsed event (3 tests):**
- ✅ Fires via `toggleFooterCollapse()`
- ✅ Fires via footer button click
- ✅ Bubbles and is composed

**panel-loading-start event (3 tests):**
- ✅ Fires via `startLoading()`
- ✅ Fires via `loading` property change
- ✅ Bubbles and is composed

**panel-loading-end event (3 tests):**
- ✅ Fires via `stopLoading()`
- ✅ Fires via `loading` property change
- ✅ Bubbles and is composed

**Event manifest validation (3 tests):**
- ✅ All manifest events are tested
- ✅ All events have `bubbles: true`
- ✅ All events have `composed: true`

#### 5. Slot Functionality (3 tests)
Every slot in the manifest accepts content:
- ✅ `default` slot - Accepts any content
- ✅ `actions` slot - Accepts buttons
- ✅ `footer` slot - Accepts any content

#### 6. Validation (2 tests)
- ✅ Variant enum validation works
- ✅ Actions slot validation configured (max 10 buttons)

#### 7. Rendering (8 tests)
- ✅ Component renders
- ✅ Header renders (standard mode)
- ✅ Body renders
- ✅ Body hides when collapsed
- ✅ Collapse button shows when collapsible
- ✅ Compact class applies
- ✅ Large class applies
- ✅ Loading class applies

#### 8. Nesting Support (4 tests)
- ✅ Discovers nested components
- ✅ Propagates context to children (size, variant)
- ✅ Parent-child relationship tracking
- ✅ Context inheritance validation

#### 9. Cleanup Patterns (2 tests)
- ✅ Clears timers on disconnect (memory leak prevention)
- ✅ Removes event listeners on disconnect

#### 10. Logging (1 test)
- ✅ Logger instance present with all methods (error, warn, info, debug, trace)

---

### TColorPicker Component - 52 Tests (BUNDLED-LIB Profile)

BUNDLED-LIB profile component with iro.js color picker library integration.

#### 1. Properties (8 tests)
- ✅ Static metadata (tagName, displayName, version, category)
- ✅ Default property values (value, disabled, variant, labels)
- ✅ Property updates (value, disabled, variant)
- ✅ Label properties (showLabel, labelPosition, labelText)
- ✅ Attribute reflection (variant, disabled)

#### 2. Rendering (9 tests)
- ✅ Shadow DOM structure
- ✅ Color picker wrapper element
- ✅ Variant classes (standard, compact, minimal)
- ✅ Disabled state rendering
- ✅ Label elements (when specified)
- ✅ Swatch element
- ✅ Input element
- ✅ Icon element
- ✅ Adopted stylesheets present

#### 3. Logging (5 tests)
- ✅ Logger instance exists
- ✅ Logger has correct component name
- ✅ All logger methods present (error, warn, info, debug, trace)
- ✅ Debug messages log without error
- ✅ Info messages log without error

#### 4. Validation (5 tests)
- ✅ Valid hex color with alpha (#RRGGBBAA)
- ✅ Valid hex color without alpha (#RRGGBB)
- ✅ Value persistence
- ✅ Uppercase hex value handling
- ✅ Variant enum validation

#### 5. Events (5 tests)
- ✅ `color-change` event emission
- ✅ `color-save` event emission
- ✅ `swatches-update` event emission
- ✅ Event detail structure
- ✅ Event bubbling enabled

#### 6. Form Participation (5 tests)
- ✅ `getValue()` returns form value
- ✅ `setValue()` updates form value
- ✅ Value persistence after multiple updates
- ✅ Form controls accessibility
- ✅ Disabled state for forms

#### 7. Library Integration - iro.js (9 tests)
- ✅ iro.js instance initialization
- ✅ Cleanup on disconnect
- ✅ Double cleanup safety
- ✅ iro container element presence
- ✅ Color sync to iro.js
- ✅ Event bridging (iro → Lit)
- ✅ Document listener tracking
- ✅ Timer tracking
- ✅ Complete resource cleanup

#### 8. Public API (3 tests)
- ✅ `setIcon()` method exists
- ✅ `clearAllCustomSwatches()` method exists
- ✅ Custom icon setting
- ✅ Custom swatch clearing

#### 9. Lifecycle (3 tests)
- ✅ Constructor initialization
- ✅ DOM connection
- ✅ DOM disconnection cleanup

---

## Test Philosophy

### Manifest-Driven Testing
Every test validates that the component manifest is:
1. **Complete** - All properties, methods, events, and slots are documented
2. **Accurate** - Documentation matches actual behavior
3. **Operational** - Every documented feature works correctly

### Profile-Based Testing
Components follow different test patterns based on their profile:

- **FULL Profile** (TPanelLit): Complete lifecycle, nesting, validation, timers
- **BUNDLED-LIB Profile** (TColorPicker): Library integration, resource cleanup, form participation
- **CORE Profile**: Basic properties, methods, events, slots
- **FORM Profile**: Form participation, validation, ARIA
- **CONTAINER Profile**: Nesting, context propagation

### Event Testing Standards
All events are tested for:
- **Trigger paths** - Every way an event can be fired
- **Detail structure** - Correct payload shape and types
- **Bubbling** - `bubbles: true` works correctly
- **Composition** - `composed: true` works correctly (crosses shadow DOM)
- **Manifest completeness** - All manifest events are tested

### Property Testing Standards
All properties are tested for:
- **Value assignment** - Setting property works
- **Attribute reflection** - Reflected properties sync to attributes
- **Default values** - Correct initial state

### Method Testing Standards
All methods are tested for:
- **Return values** - Correct return type
- **State changes** - Method changes component state correctly
- **Event emission** - Methods fire appropriate events
- **Edge cases** - Methods handle invalid states gracefully

### Library Integration Testing (BUNDLED-LIB)
External library integrations are tested for:
- **Initialization** - Library loads and initializes correctly
- **Cleanup** - All resources cleaned up on disconnect
- **Event bridging** - Library events → component events
- **Memory management** - Listeners, timers, instances removed
- **Double cleanup safety** - Multiple disconnects don't error

## Adding New Tests

When adding a new component, ensure tests cover:

1. **Manifest structure** (1 test)
2. **Property documentation** (1 test per property)
3. **Property functionality** (1 test per property)
4. **Method documentation** (1 test per method)
5. **Method functionality** (1 test per method)
6. **Event documentation** (1 test per event)
7. **Event functionality** (3-5 tests per event: triggers, bubbling, detail)
8. **Slot documentation** (1 test per slot)
9. **Slot functionality** (1 test per slot)
10. **Validation** (1 test per validated property/slot)
11. **Rendering** (5-10 tests for visual states)
12. **Cleanup** (if applicable - FULL/BUNDLED-LIB profiles)
13. **Logging** (1 test)
14. **Library integration** (if applicable - BUNDLED-LIB profile)
15. **Nesting** (if applicable - FULL/CONTAINER profiles)

## CI/CD Integration

Tests run automatically via:
```bash
npm run test:run
```

All tests must pass before merging to main branch.

## Test Environment

- **Framework:** Vitest 3.2.4
- **DOM:** happy-dom 18.0.1
- **Mocking:** Vitest built-in (vi)
- **Target:** ESNext (supports modern JS)
- **Setup:** `tests/setup.js` - Polyfills customElements and __TERMINAL_KIT_REGISTRY__

## Coverage Goals

Current thresholds (vitest.config.js):
- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 75%
- **Statements:** 80%

Run coverage report:
```bash
npm run test:coverage
```

## Test Results Summary

```
Test Files  6 passed (6)
Tests       525 passed (525)
Duration    ~900-1000ms
```

- **TPanelLit:** 63 tests covering FULL profile compliance
- **TColorPicker:** 52 tests covering BUNDLED-LIB profile compliance
- **TModalLit:** 57 tests covering FULL profile compliance
- **TButtonLit:** 84 tests covering CORE profile compliance
- **TInputLit:** 107 tests covering FORM-ADVANCED profile compliance
- **TTextareaLit:** 55 tests covering FORM-ADVANCED profile compliance

---

### TTextareaLit Component - 55 Tests (FORM-ADVANCED Profile)

FORM-ADVANCED profile component with form participation, validation, and code editor features.

#### 1. Manifest Completeness (5 tests)
- ✅ Manifest structure (tagName, displayName, version)
- ✅ All 9 properties documented
- ✅ All 4 methods documented
- ✅ All 4 events documented
- ✅ No slots documented

#### 2. Property Functionality (10 tests)
- ✅ Correct default values for all properties
- ✅ `placeholder`, `value`, `rows` properties work
- ✅ `disabled`, `readonly`, `required` properties work
- ✅ `maxlength`, `codeMode`, `showLineNumbers` properties work
- ✅ Attribute reflection works for reflected properties

#### 3. Method Functionality (5 tests)
- ✅ All 4 public methods exist
- ✅ `setValue()` sets the value
- ✅ `getValue()` returns the value
- ✅ `focus()` focuses the textarea
- ✅ `blur()` blurs the textarea

#### 4. Event Functionality (10 tests)
- **textarea-input event (3 tests):**
  - ✅ Fires on input
  - ✅ Bubbles and is composed
  - ✅ Includes correct detail structure

- **textarea-change event (2 tests):**
  - ✅ Fires on change
  - ✅ Bubbles and is composed

- **textarea-focus event (2 tests):**
  - ✅ Fires on focus
  - ✅ Bubbles and is composed

- **textarea-blur event (2 tests):**
  - ✅ Fires on blur
  - ✅ Bubbles and is composed

- **Event manifest validation (1 test):**
  - ✅ All manifest events are tested

#### 5. Form Participation (5 tests)
- ✅ `formAssociated` set to true
- ✅ ElementInternals initialized
- ✅ `getValue()` returns form value
- ✅ `setValue()` updates form value
- ✅ Internals updated when value changes

#### 6. Validation (4 tests)
- ✅ Maxlength validation works
- ✅ Rejects negative maxlength
- ✅ Accepts null maxlength
- ✅ Rejects zero maxlength

#### 7. Rendering (8 tests)
- ✅ Shadow DOM structure
- ✅ Textarea element renders
- ✅ Line numbers hidden by default
- ✅ Line numbers shown when enabled
- ✅ Container class applied correctly
- ✅ Line numbers count updates with content
- ✅ Disabled state applies
- ✅ Readonly state applies

#### 8. Code Editor Mode (6 tests)
- ✅ Code mode enables correctly
- ✅ Tab key for indentation
- ✅ Shift+Tab for outdent
- ✅ Enter for auto-indent
- ✅ Ctrl/Cmd+/ for toggle comment
- ✅ Ctrl/Cmd+D for duplicate line

#### 9. Logging (2 tests)
- ✅ Logger instance exists
- ✅ All logger methods present

#### Documentation
📄 **API Documentation:** `docs/components/TTextareaLit.md`
- Complete API reference with all properties, methods, events
- 10+ code examples covering all use cases
- IDE keyboard shortcuts guide
- Form participation examples
- Migration guide from old TerminalTextarea

---

### TInputLit Component - 107 Tests (FORM-ADVANCED Profile)

FORM-ADVANCED profile component with ElementInternals API for native form participation.

#### 1. Property Functionality (16 tests)
Every property in the component is tested for operational correctness:
- ✅ Default values (15 properties)
- ✅ Value assignment works
- ✅ Attribute reflection works (for reflected properties)

**Properties Tested:**
- `type` - Input type (text, password, email, number, search, tel, url)
- `placeholder` - Placeholder text
- `value` - Input value
- `disabled` - Disabled state
- `readonly` - Readonly state
- `required` - Required field validation
- `min` - Minimum value (number type)
- `max` - Maximum value (number type)
- `minlength` - Minimum character length
- `maxlength` - Maximum character length
- `pattern` - RegEx validation pattern
- `autocomplete` - Autocomplete attribute
- `label` - Optional label above input
- `helperText` - Optional helper text below input
- `icon` - Optional icon SVG string

#### 2. Rendering (10 tests)
- ✅ Shadow DOM structure
- ✅ Input element renders
- ✅ Label renders when provided
- ✅ Helper text renders when provided
- ✅ Password toggle for password type
- ✅ Number controls for number type
- ✅ Search clear button for search type with value
- ✅ Error message renders when error state
- ✅ Icon renders when provided

#### 3. Logging (5 tests)
- ✅ Logger instance exists
- ✅ Logger has correct component name
- ✅ All logger methods present (error, warn, info, debug, trace)
- ✅ Debug messages log without error
- ✅ Info messages log without error

#### 4. Validation (20 tests)
Comprehensive validation testing:
- ✅ Required field validation (empty/filled)
- ✅ Maxlength constraint (pass/fail)
- ✅ Minlength constraint (pass/fail)
- ✅ Email format validation (valid/invalid)
- ✅ URL format validation (valid with protocol, bare domain, invalid)
- ✅ Number type validation (valid, invalid, NaN)
- ✅ Number min constraint
- ✅ Number max constraint
- ✅ Number range constraint
- ✅ Empty value when not required
- ✅ Error clearing on valid input
- ✅ ElementInternals validity state updates

#### 5. Events (40 tests)
All 8 events tested comprehensively (5 tests per event):

**input-value event (5 tests):**
- ✅ Fires on input
- ✅ Bubbles
- ✅ Is composed
- ✅ Correct detail structure
- ✅ Trigger paths

**input-change event (4 tests):**
- ✅ Fires on blur
- ✅ Bubbles
- ✅ Is composed
- ✅ Correct detail structure

**input-focus event (3 tests):**
- ✅ Fires on focus
- ✅ Bubbles
- ✅ Is composed

**input-blur event (3 tests):**
- ✅ Fires on blur
- ✅ Bubbles
- ✅ Is composed

**input-enter event (4 tests):**
- ✅ Fires on Enter key
- ✅ Bubbles
- ✅ Is composed
- ✅ Correct detail structure

**input-error event (4 tests):**
- ✅ Fires on validation failure
- ✅ Bubbles
- ✅ Is composed
- ✅ Correct detail structure

**input-valid event (4 tests):**
- ✅ Fires when validation passes
- ✅ Bubbles
- ✅ Is composed
- ✅ Correct detail structure

**input-clear event (4 tests):**
- ✅ Fires when clear() called
- ✅ Bubbles
- ✅ Is composed
- ✅ Fires when search clear button clicked

#### 6. Methods (7 tests)
Every method in the API is tested:
- ✅ `setValue()` - Sets value
- ✅ `getValue()` - Returns value
- ✅ `focus()` - Focuses input
- ✅ `blur()` - Blurs input
- ✅ `validate()` - Returns validation result
- ✅ `setError()` - Sets error state
- ✅ `clear()` - Clears value

#### 7. Form Participation (10 tests)
- ✅ ElementInternals exists if supported
- ✅ `getValue()` returns form value
- ✅ `setValue()` updates form value
- ✅ Form value syncs on value change
- ✅ Integrates with native form
- ✅ Sets validity state on error
- ✅ Clears validity state on valid
- ✅ Disabled state in forms
- ✅ Readonly state in forms
- ✅ Required state reported

#### 8. Type-Specific Features (8 tests)
- ✅ Password toggle changes input type
- ✅ Number increment increases value
- ✅ Number decrement decreases value
- ✅ Number increment respects max
- ✅ Number decrement respects min
- ✅ Search clear clears value and focuses
- ✅ URL type accepts bare domains
- ✅ URL type accepts full URLs

#### Documentation
📄 **API Documentation:** `docs/components/TInputLit.md`
- Complete API reference with all properties, methods, events
- 20+ code examples covering all use cases
- Type-specific feature documentation
- Form integration guide
- Validation timing strategies
- Accessibility notes
- Troubleshooting guide

---

### TModalLit Component - 57 Tests (FULL Profile)

FULL profile component with complete lifecycle, nesting, validation, and complex slot layouts support.

#### 1. Manifest Completeness (6 tests)
- ✅ Manifest structure (tagName, displayName, version)
- ✅ All 7 properties documented
- ✅ All 6 methods documented
- ✅ All 4 events documented
- ✅ All 11 slots documented (across 5 layouts)
- ✅ Layout and size enum values present

#### 2. Property Functionality (7 tests)
- ✅ Default values correct
- ✅ `visible`, `layout`, `size`, `title` properties work
- ✅ `escapeClose`, `backdropClose` properties work
- ✅ `loading` property works
- ✅ Attribute reflection works

#### 3. Method Functionality (6 tests)
- ✅ All 6 public methods exist
- ✅ `show()` / `hide()` methods work
- ✅ `toggle()` method works
- ✅ `close()` method with preventable event works
- ✅ `showLoading()` / `hideLoading()` methods work

#### 4. Event Functionality (17 tests)
- **modal-show event (2 tests):**
  - ✅ Fires via `show()` method
  - ✅ Bubbles and is composed

- **modal-hide event (2 tests):**
  - ✅ Fires via `hide()` method
  - ✅ Bubbles and is composed

- **modal-before-close event (3 tests):**
  - ✅ Fires via `close()` method
  - ✅ Is cancelable
  - ✅ Bubbles and is composed

- **modal-close event (3 tests):**
  - ✅ Fires after hide
  - ✅ Does not fire if prevented
  - ✅ Bubbles and is composed

- **Event manifest validation (1 test):**
  - ✅ All manifest events are tested

#### 5. Slot Functionality (6 tests)
- ✅ Default slot accepts content (single layout)
- ✅ Left/right slots work (2-column layout)
- ✅ All four quadrant slots work (2x2 layout)
- ✅ All four slots work (1-2-1 layout)
- ✅ All three slots work (2-1 layout)
- ✅ Layout switching works correctly

#### 6. Validation (3 tests)
- ✅ Layout enum validation works
- ✅ Size enum validation works
- ✅ Invalid values revert to old values

#### 7. Rendering (10 tests)
- ✅ Component renders
- ✅ Backdrop renders
- ✅ Modal container renders
- ✅ Header and title render
- ✅ Close button renders
- ✅ Open class applies when visible
- ✅ Size attribute reflects to host
- ✅ Loading attribute reflects to host
- ✅ Layout classes apply correctly

#### 8. Cleanup Patterns (4 tests)
- ✅ Body overflow restored on disconnect
- ✅ Document listeners removed on disconnect
- ✅ Escape key works when enabled
- ✅ Escape key ignored when disabled

#### 9. Logging (1 test)
- ✅ Logger instance present with all methods

#### 10. Nesting Support (3 tests)
- ✅ Discovers nested components
- ✅ Receives context from parent
- ✅ Prevents deep nesting (max depth 10)

#### Documentation
📄 **API Documentation:** `docs/components/TModalLit.md`
- Complete API reference with all properties, methods, events, slots
- 15+ code examples covering all use cases
- Migration guide from old TerminalModal
- Accessibility, performance, and best practices
- Troubleshooting guide

---