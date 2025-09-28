# Test Suite Documentation

## Overview

Comprehensive test suite for Terminal Kit Panels components. All tests validate that the component manifest is accurate and that every documented feature is operational.

## Running Tests

```bash
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once (CI mode)
npm run test:ui       # Interactive UI
npm run test:coverage # With coverage report
```

## Test Coverage

### TPanelLit Component - 61 Tests

#### 1. Manifest Completeness (6 tests)
Validates that the component manifest is complete and accurate:
- ✅ Manifest structure (tagName, displayName, version)
- ✅ All 11 properties documented
- ✅ All 7 methods documented
- ✅ All 4 events documented
- ✅ All 3 slots documented
- ✅ Variant enum values present

#### 2. Property Functionality (11 tests)
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
- `resizable` - Resizable mode
- `draggable` - Draggable mode
- `icon` - Header icon
- `footerCollapsed` - Footer collapsed state

#### 3. Method Functionality (8 tests)
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

**panel-loading-end event (4 tests):**
- ✅ Fires via `stopLoading()`
- ✅ Fires via `loading` property change
- ✅ Fires on auto-timeout (30s)
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

#### 8. Nesting Support (2 tests)
- ✅ Discovers nested components
- ✅ Propagates context to children (size, variant)

#### 9. Cleanup Patterns (2 tests)
- ✅ Clears timers on disconnect (memory leak prevention)
- ✅ Auto-stops loading after 30s timeout

#### 10. Logging (1 test)
- ✅ Logger instance present with all methods (error, warn, info, debug)

## Test Philosophy

### Manifest-Driven Testing
Every test validates that the component manifest is:
1. **Complete** - All properties, methods, events, and slots are documented
2. **Accurate** - Documentation matches actual behavior
3. **Operational** - Every documented feature works correctly

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
12. **Cleanup** (if applicable)
13. **Logging** (1 test)

## CI/CD Integration

Tests run automatically via:
```bash
npm test -- --run
```

All tests must pass before merging to main branch.

## Test Environment

- **Framework:** Vitest 2.1.0
- **DOM:** happy-dom 15.11.0
- **Mocking:** Vitest built-in (vi)
- **Target:** ESNext (supports modern JS)

## Coverage Goals

- **Statements:** > 90%
- **Branches:** > 85%
- **Functions:** > 90%
- **Lines:** > 90%

Run coverage report:
```bash
npm run test:coverage
```