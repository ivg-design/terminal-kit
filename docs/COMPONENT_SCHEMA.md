# Component Schema - Rigid Template for All Terminal Kit Components

**Status:** Architecture Specification
**Version:** 1.0.0
**Last Updated:** 2025-09-27

---

## Table of Contents

1. [Schema Overview](#schema-overview) ⭐ **START HERE**
2. [Schema Profiles](#schema-profiles) 🎯 **Choose Your Profile**
3. [Plan Summary](#plan-summary)
4. [Core Principles](#core-principles)
5. [The Inviolate Schema](#the-inviolate-schema)
6. [Cleanup Patterns](#cleanup-patterns) 🧹 **Memory Leak Prevention**
7. [Shared Validation Utilities](#shared-validation-utilities) ♻️ **DRY Validation**
8. [Nesting Architecture](#nesting-architecture)
9. [Logging System](#logging-system)
10. [Safety Mechanisms](#safety-mechanisms)
11. [JSDoc Requirements](#jsdoc-requirements)
12. [Unit Testing Requirements](#unit-testing-requirements)
13. [Build-Time Generation](#build-time-generation)
14. [CSS Migration Strategy](#css-migration-strategy) 🎨 **Shared → Static Styles**
15. [Complete Example](#complete-example)

---

## Schema Overview

> **⭐ This is the structure every component MUST follow. Point to this during component rewrites.**

### Component File Structure Map

```
ComponentName.js
│
├─ SECTION 1: IMPORTS
│  └─ Import Lit, logger, utilities (NO decorators)
│
├─ SECTION 2: COMPONENT CLASS
│  │  [JSDoc: @component, @tagname, @description, @category, @since, @example]
│  │
│  ├─ BLOCK 1: Static Metadata
│  │  ├─ tagName (string)
│  │  ├─ version (string)
│  │  └─ category (string)
│  │
│  ├─ BLOCK 2: Static Styles
│  │  └─ css`` template (all component styles)
│  │
│  ├─ BLOCK 3: Reactive Properties
│  │  └─ static properties = { ... } (NO @property decorators)
│  │     [JSDoc: @property, @default, @attribute, @reflects, @validation, @example]
│  │
│  ├─ BLOCK 4: Internal State
│  │  └─ Private properties (_prefixed)
│  │     [JSDoc: @private]
│  │
│  ├─ BLOCK 5: Logger Instance
│  │  └─ _logger = null
│  │     [JSDoc: @private]
│  │
│  ├─ BLOCK 6: Constructor
│  │  ├─ super()
│  │  ├─ Initialize logger → this._logger.debug('Component constructed')
│  │  ├─ Initialize properties
│  │  ├─ Bind event handlers
│  │  └─ Setup nested component registry
│  │
│  ├─ BLOCK 7: Lifecycle Methods (in order)
│  │  │  [JSDoc: @lifecycle, @param]
│  │  │
│  │  ├─ connectedCallback()
│  │  │  └─ this._logger.info('Connected to DOM')
│  │  │
│  │  ├─ disconnectedCallback()
│  │  │  └─ this._logger.info('Disconnected from DOM')
│  │  │
│  │  ├─ firstUpdated(changedProperties)
│  │  │  └─ this._logger.debug('First update complete', { changedProperties })
│  │  │
│  │  └─ updated(changedProperties)
│  │     └─ this._logger.trace('Updated', { changedProperties })
│  │
│  ├─ BLOCK 8: Public API Methods
│  │  │  [JSDoc: @public, @param, @returns, @throws, @fires, @example]
│  │  │
│  │  └─ Each method:
│  │     ├─ this._logger.debug('methodName called', { params })
│  │     ├─ Validation (log errors on failure)
│  │     ├─ Execute logic
│  │     ├─ Emit events
│  │     └─ Return result
│  │
│  ├─ BLOCK 9: Event Emitters
│  │  │  [JSDoc: @event, @type, @description, @property, @bubbles, @composed]
│  │  │
│  │  └─ _emitEvent(eventName, detail)
│  │     └─ this._logger.debug('Emitting event', { eventName, detail })
│  │
│  ├─ BLOCK 10: Nesting Support (if container)
│  │  │  [JSDoc: @private or @public]
│  │  │
│  │  ├─ _registerNestedComponent(component)
│  │  │  └─ this._logger.debug('Registering nested component', { tag })
│  │  │
│  │  ├─ _discoverNestedComponents()
│  │  │  └─ Logger calls for each discovered component
│  │  │
│  │  ├─ _propagateContext(component)
│  │  │  └─ Logger calls for context propagation
│  │  │
│  │  └─ receiveContext(context)
│  │     └─ this._logger.debug('Received context from parent', { context })
│  │
│  ├─ BLOCK 11: Validation
│  │  │  [JSDoc: @private, @static, @param, @returns]
│  │  │
│  │  ├─ _validateProperty(propName, value)
│  │  │  └─ this._logger.warn('Property validation failed', { errors })
│  │  │
│  │  ├─ getPropertyValidation(propName) [static]
│  │  │
│  │  ├─ _validateSlotContent(slotName, elements)
│  │  │  └─ this._logger.warn('Invalid slot content', { slotName })
│  │  │
│  │  └─ getSlotValidation(slotName) [static]
│  │
│  ├─ BLOCK 12: Render Method
│  │  │  [JSDoc: @returns, @slot (for each slot)]
│  │  │
│  │  └─ render()
│  │     └─ this._logger.trace('Rendering')
│  │
│  └─ BLOCK 13: Private Helpers
│     │  [JSDoc: @private, @param, @returns]
│     │
│     └─ All private helper methods
│        └─ Logger calls where appropriate (errors, warnings, debug)
│
├─ SECTION 3: Custom Element Registration
│  └─ customElements.define()
│
└─ SECTION 4: Export
   └─ export default ComponentName

ComponentName.test.js (co-located)
│
├─ TEST SUITE 1: Properties
├─ TEST SUITE 2: Methods
├─ TEST SUITE 3: Events
├─ TEST SUITE 4: Nesting (if applicable)
├─ TEST SUITE 5: Validation
├─ TEST SUITE 6: Rendering
└─ TEST SUITE 7: Logging
```

### The 13 Blocks (Quick Reference)

| Block | Name | Required For | JSDoc | Logger |
|-------|------|--------------|-------|--------|
| 1 | Static Metadata | ALL | No | No |
| 2 | Static Styles | ALL | No | No |
| 3 | Reactive Properties | ALL | ✅ static properties object, JSDoc comments | No |
| 4 | Internal State | ALL | ✅ @private | No |
| 5 | Logger Instance | ALL | ✅ @private | N/A (this IS the logger) |
| 6 | Constructor | ALL | No | ✅ debug on construct |
| 7 | Lifecycle Methods | ALL | ✅ @lifecycle, @param | ✅ info/debug/trace |
| 8 | Public API Methods | MOST | ✅ @public, @param, @returns, @throws, @fires | ✅ debug calls + error logging |
| 9 | Event Emitters | MOST | ✅ @event, @type, @description | ✅ debug on emit |
| 10 | Nesting Support | **CONDITIONAL** (containers only) | ✅ @private/@public | ✅ debug on register/context |
| 11 | Validation | **CONDITIONAL** (validation needed) | ✅ @private/@static | ✅ warn on validation failure |
| 12 | Render Method | ALL | ✅ @returns, @slot | ✅ trace on render |
| 13 | Private Helpers | ALL | ✅ @private, @param, @returns | ✅ contextual logging |

### Essential Rules

1. **Block Order is Inviolate** - Blocks must appear in exact numerical order
2. **Blocks 10-11 are Conditional** - Only implement if component needs them (see [Schema Profiles](#schema-profiles))
3. **JSDoc is Mandatory** - Properties, methods, events, slots must be documented
4. **Tests are Required** - Co-located `.test.js` file (3-7 suites depending on profile)
5. **Logger Always Present** - Every component has ComponentLogger instance
6. **Nesting-Ready** - Container components must implement `receiveContext()`

### Quick Start Checklist

When rewriting a component, verify:

- [ ] All 13 blocks present in correct order
- [ ] All properties defined in static properties = {} object (NO decorators)
- [ ] Every public property has JSDoc with @property, @default, @attribute
- [ ] Every public method has JSDoc with @public, @param, @returns, @fires
- [ ] Every event has JSDoc with @event, @type, @description, @property
- [ ] ComponentLogger instantiated in constructor
- [ ] Nesting methods implemented (if container component)
- [ ] Validation methods implemented
- [ ] Co-located test file exists with 7 required test suites
- [ ] customElements.define() called
- [ ] Component exported as default

---

## Schema Profiles

> **🎯 Choose the right profile for your component to avoid unnecessary boilerplate**

Not all components need all blocks! Use these profiles to determine which blocks your component requires.

### Profile Comparison

| Profile | Blocks Required | Test Suites | Use Case |
|---------|----------------|-------------|----------|
| **CORE** | 1-9, 12-13 | 3 | Basic components (buttons, simple displays) |
| **FORM** | CORE + 11 | 6 | Form controls with validation |
| **FORM-ADVANCED** | FORM + ElementInternals | 6 | Form controls with browser form integration |
| **CONTAINER** | CORE + 10 | 5 | Components with nested children |
| **DISPLAY** | 1-7, 12-13 | 3 | Display-only components (loaders, status fields) |
| **BUNDLED-LIB** | FORM + library patterns | 7 | Components using iro.js |
| **FULL** | ALL blocks | 7 | Complex multi-featured components |

### CORE Profile

**For:** Buttons, toasts, simple interactive components

**Blocks:**
- ✅ 1-9 (metadata, styles, properties, state, logger, constructor, lifecycle, methods, events)
- ❌ 10 (skip nesting)
- ❌ 11 (skip validation)
- ✅ 12-13 (render, helpers)

**Test Suites:** 3
1. Properties
2. Rendering
3. Logging

**Examples:** `t-btn`, `t-tst`, `t-usr`

---

### FORM Profile

**For:** Input controls with validation needs

**Blocks:**
- ✅ 1-9 (all core)
- ❌ 10 (skip nesting)
- ✅ 11 (validation)
- ✅ 12-13 (render, helpers)

**Test Suites:** 6
1. Properties
2. Rendering
3. Logging
4. Validation
5. Events
6. Form Participation (if using ElementInternals)

**Examples:** `t-inp`, `t-sld`, `t-drp`, `t-textarea`

**Add ElementInternals for browser form integration:**
```javascript
// BLOCK 6: Constructor
static formAssociated = true;

constructor() {
  super();
  if (this.attachInternals) {
    this._internals = this.attachInternals();
  }
}

// BLOCK 8: Public Methods
setValue(value) {
  this.value = value;
  if (this._internals) {
    this._internals.setFormValue(value);
  }
}
```

---

### CONTAINER Profile

**For:** Panels, modals, trees - components that contain/coordinate children

**Blocks:**
- ✅ 1-9 (all core)
- ✅ 10 (nesting)
- ✅/❌ 11 (validation if needed)
- ✅ 12-13 (render, helpers)

**Test Suites:** 5
1. Properties
2. Rendering
3. Logging
4. Nesting
5. Slot Validation

**Examples:** `t-pnl`, `t-mdl`, `t-tre`, `t-sta`

---

### DISPLAY Profile

**For:** Simple display-only components with minimal interactivity

**Blocks:**
- ✅ 1-7 (metadata through lifecycle)
- ❌ 8 (often no public methods)
- ❌ 9 (often no events)
- ❌ 10 (no nesting)
- ❌ 11 (no validation)
- ✅ 12-13 (render, helpers)

**Test Suites:** 3
1. Properties
2. Rendering
3. Logging

**Examples:** `t-ldr`, `t-sta-field`

---

### BUNDLED-LIB Profile

**For:** Components using bundled libraries (iro.js color picker)

**Blocks:**
- ✅ 1-9 (all core)
- ❌ 10 (no nesting)
- ❌ 11 (library handles validation)
- ✅ 12-13 (render, helpers)
- ✅ **Special:** Library lifecycle management

**Test Suites:** 7
1. Properties
2. Rendering
3. Logging
4. Events
5. Form Participation
6. Library Integration
7. Cleanup

**Examples:** `t-clr` (iro.js)

**Required Patterns:**
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

### FULL Profile

**For:** Complex components needing all features

**Blocks:**
- ✅ ALL (1-13)

**Test Suites:** 7 (all)

**Examples:** `t-pnl`, `t-mdl`, `t-tre`, `t-dyn`

---

### Decision Tree: Which Profile?

```
Does component have nested children (slots)?
├─ YES: Start with CONTAINER
│  ├─ Does it need validation?
│  │  ├─ YES: FULL profile
│  │  └─ NO: CONTAINER profile
│  └─ Continue ↓
│
├─ NO: Is it a form control?
   ├─ YES: FORM profile
   │  └─ Does it integrate with browser forms?
   │     ├─ YES: FORM-ADVANCED (add ElementInternals)
   │     └─ NO: FORM profile
   │
   └─ NO: Does it have public methods/events?
      ├─ YES: CORE profile
      └─ NO: DISPLAY profile
```

---

## Plan Summary

### Current Problems
1. ❌ Runtime manifest generation is fragile
2. ❌ Manual manifest writing is error-prone
3. ❌ Import order matters
4. ❌ No validation until runtime
5. ❌ Single point of failure

### New Architecture: JSDoc → Build-Time → JSON

**Phase 1:** Add comprehensive JSDoc to all components
**Phase 2:** Build script parses JSDoc + extracts properties
**Phase 3:** Generate single `manifests.json` at build time
**Phase 4:** Runtime loads JSON (zero reflection, zero fragility)

### Benefits
✅ Single source of truth (JSDoc in component)
✅ Build-time validation (catch errors early)
✅ Zero runtime cost (just load JSON)
✅ TypeScript/IDE support (JSDoc is standard)
✅ No fragile runtime reflection
✅ Works perfectly with Pure Lit architecture

---

## Core Principles

### 1. Inviolate Structure
Every component MUST follow the exact structure defined below. No deviations.

### 2. Flexibility Through Composition
Components can vary in behavior but MUST use the same structural blocks.

### 3. Self-Documenting
JSDoc IS the manifest. Documentation is not separate from code.

### 4. Nested-First Design
Every component assumes it may contain or be contained by another component.

### 5. Fail-Safe Defaults
If validation fails, component degrades gracefully with warnings.

### 6. Observable Behavior
All state changes, events, and errors are logged through unified system.

### 7. NO DECORATORS - Use Static Properties
**CRITICAL**: Do NOT use `@property` decorators. Use `static properties = {}` instead.
- Decorators require transpilation and are not native JavaScript
- Static properties work directly in browsers and Node.js without build tools
- All Terminal Kit components MUST use static properties for consistency

---

## The Inviolate Schema

### File Structure (MANDATORY ORDER)

```javascript
// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import { ValidationMixin } from '../utils/validation-mixin.js';
// ... other imports

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================
/**
 * @component ComponentName
 * @tagname tag-name
 * @description Brief one-line description
 * @category UI Components | Form Controls | Layout | etc.
 * @since 1.0.0
 * @example
 * <tag-name prop="value">Content</tag-name>
 */
export class ComponentName extends LitElement {

  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 'tag-name';
  static version = '1.0.0';
  static category = 'UI Components';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED - even if empty)
  // ----------------------------------------------------------
  static styles = css`
    /* All component styles here - ZERO FOUC */
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  /**
   * @property {string} title - Component title
   * @default ''
   * @attribute title
   * @reflects true
   */
  static properties = {
    /**
     * @property {string} title - Component title
     * @default ''
     * @attribute title
     * @reflects true
     */
    title: { type: String, reflect: true },

    /**
     * @property {('variant1'|'variant2')} variant - Component variant
     * @default 'variant1'
     * @attribute variant
     */
    variant: { type: String }
  };

  // ... more properties

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE - underscore prefix)
  // ----------------------------------------------------------
  /** @private */
  _internalState = null;

  // ----------------------------------------------------------
  // BLOCK 5: LOGGER INSTANCE (REQUIRED)
  // ----------------------------------------------------------
  /** @private */
  _logger = null;

  // ----------------------------------------------------------
  // BLOCK 6: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  constructor() {
    super();

    // Initialize logger first
    this._logger = new ComponentLogger(ComponentName.tagName, this);

    // Log construction
    this._logger.debug('Component constructed');

    // Initialize property defaults
    this.title = '';
    this.variant = 'variant1';

    // Bind event handlers
    this._bindEventHandlers();

    // Initialize nested component registry
    this._nestedComponents = new Set();
  }

  // ----------------------------------------------------------
  // BLOCK 7: LIFECYCLE METHODS (REQUIRED - in order)
  // ----------------------------------------------------------

  /**
   * Called when component is connected to DOM
   * @lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected to DOM');

    // Register with parent if nested
    this._registerWithParent();

    // Setup observers
    this._setupObservers();
  }

  /**
   * Called when component is disconnected from DOM
   * @lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');

    // Cleanup
    this._cleanup();

    // Unregister from parent
    this._unregisterFromParent();
  }

  /**
   * Called after first render
   * @lifecycle
   * @param {Map} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete', { changedProperties });

    // Post-render setup
    this._postRenderSetup();

    // Discover nested components
    this._discoverNestedComponents();
  }

  /**
   * Called after every render
   * @lifecycle
   * @param {Map} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', { changedProperties });

    // React to property changes
    this._handlePropertyChanges(changedProperties);
  }

  // ----------------------------------------------------------
  // BLOCK 8: PUBLIC API METHODS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Public method description
   * @public
   * @param {string} param - Parameter description
   * @returns {boolean} Return value description
   * @throws {Error} When invalid param
   * @example
   * component.publicMethod('value');
   */
  publicMethod(param) {
    this._logger.debug('publicMethod called', { param });

    // Validate
    if (!this._validateParam(param)) {
      const error = new Error('Invalid parameter');
      this._logger.error('Validation failed', { param, error });
      throw error;
    }

    // Execute
    const result = this._executeLogic(param);

    // Emit event
    this._emitEvent('method-executed', { param, result });

    return result;
  }

  // ----------------------------------------------------------
  // BLOCK 9: EVENT EMITTERS (REQUIRED SECTION)
  // ----------------------------------------------------------

  /**
   * Emit custom event
   * @private
   * @param {string} eventName
   * @param {Object} detail
   * @fires ComponentName#event-name
   */
  _emitEvent(eventName, detail = {}) {
    this._logger.debug('Emitting event', { eventName, detail });

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  /**
   * @event component-event
   * @type {CustomEvent<{key: string}>}
   * @description Fired when something happens
   * @property {string} detail.key - Description of detail property
   * @bubbles true
   * @composed true
   */

  // ----------------------------------------------------------
  // BLOCK 10: NESTING SUPPORT (REQUIRED FOR CONTAINER COMPONENTS)
  // ----------------------------------------------------------

  /**
   * Register nested component
   * @private
   * @param {LitElement} component
   */
  _registerNestedComponent(component) {
    this._logger.debug('Registering nested component', {
      tag: component.tagName
    });

    this._nestedComponents.add(component);

    // Propagate parent context
    this._propagateContext(component);

    // Setup nested hooks
    this._setupNestedHooks(component);
  }

  /**
   * Discover nested components
   * @private
   */
  _discoverNestedComponents() {
    // Query default slot
    const defaultSlot = this.shadowRoot.querySelector('slot:not([name])');
    if (defaultSlot) {
      const assigned = defaultSlot.assignedElements();
      assigned.forEach(el => {
        if (el.tagName && el.tagName.startsWith('T-')) {
          this._registerNestedComponent(el);
        }
      });
    }

    // Query named slots
    const namedSlots = this.shadowRoot.querySelectorAll('slot[name]');
    namedSlots.forEach(slot => {
      slot.assignedElements().forEach(el => {
        if (el.tagName && el.tagName.startsWith('T-')) {
          this._registerNestedComponent(el);
        }
      });
    });
  }

  /**
   * Propagate context to nested component
   * @private
   */
  _propagateContext(component) {
    if (typeof component.receiveContext === 'function') {
      component.receiveContext({
        parent: this,
        depth: (this._context?.depth || 0) + 1,
        logger: this._logger,
        theme: this._getTheme()
      });
    }
  }

  /**
   * Receive context from parent
   * @public
   * @param {Object} context
   */
  receiveContext(context) {
    this._context = context;
    this._logger.debug('Received context from parent', { context });
  }

  // ----------------------------------------------------------
  // BLOCK 11: VALIDATION (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Validate property value
   * @private
   * @param {string} propName
   * @param {*} value
   * @returns {boolean}
   */
  _validateProperty(propName, value) {
    const validation = this.constructor.getPropertyValidation(propName);
    if (!validation) return true;

    const result = validation.validate(value);
    if (!result.valid) {
      this._logger.warn('Property validation failed', {
        propName,
        value,
        errors: result.errors
      });
    }

    return result.valid;
  }

  /**
   * Get property validation rules
   * @static
   * @param {string} propName
   * @returns {Object|null}
   */
  static getPropertyValidation(propName) {
    // Override in subclass to provide validation
    return null;
  }

  // ----------------------------------------------------------
  // BLOCK 12: RENDER METHOD (REQUIRED)
  // ----------------------------------------------------------

  /**
   * Render component template
   * @returns {TemplateResult}
   */
  render() {
    this._logger.trace('Rendering');

    return html`
      <div class="component-container">
        <!-- Render logic here -->
        <slot></slot>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 13: PRIVATE HELPERS (LAST)
  // ----------------------------------------------------------

  /** @private */
  _initializeProperties() {
    // Property initialization
  }

  /** @private */
  _bindEventHandlers() {
    // Bind handlers
  }

  /** @private */
  _setupObservers() {
    // Setup observers
  }

  /** @private */
  _cleanup() {
    // Cleanup logic
  }

  /** @private */
  _registerWithParent() {
    // Register with parent component
    const parent = this.parentElement;
    if (parent && typeof parent._registerNestedComponent === 'function') {
      parent._registerNestedComponent(this);
    }
  }

  /** @private */
  _unregisterFromParent() {
    // Unregister from parent
  }

  /** @private */
  _handlePropertyChanges(changedProperties) {
    // React to changes
  }

  /** @private */
  _postRenderSetup() {
    // Post-render setup
  }

  /** @private */
  _setupNestedHooks(component) {
    // Setup hooks for nested component
  }

  /** @private */
  _getTheme() {
    return this._context?.theme || 'default';
  }
}

// ============================================================
// SECTION 3a: UNIT TESTS (REQUIRED - co-located .test.js file)
// ============================================================
// Each component MUST have a corresponding .test.js file that validates:
// - All properties work as documented
// - All methods function correctly with valid/invalid inputs
// - All events fire with correct detail structure
// - Nesting behavior works (if applicable)
// - Validation catches invalid inputs
// - Slot content validation works (if applicable)
//
// Tests should be co-located with component:
// js/components/ComponentName.js
// js/components/ComponentName.test.js

// ============================================================
// SECTION 3: CUSTOM ELEMENT REGISTRATION (REQUIRED)
// ============================================================
if (!customElements.get(ComponentName.tagName)) {
  customElements.define(ComponentName.tagName, ComponentName);
}

// ============================================================
// SECTION 4: MANIFEST EXPORT (REQUIRED)
// ============================================================
// Manifest is auto-generated from JSDoc at build time
// No manual manifest needed here
```

---

## Cleanup Patterns

> **🧹 Critical patterns to prevent memory leaks in components**

All components must properly clean up resources in `disconnectedCallback()`. Follow these patterns based on what your component uses.

### Pattern 1: Timer Cleanup

**Use when:** Component uses setTimeout, setInterval, auto-dismiss, debouncing

```javascript
// BLOCK 4: Internal State
_timers = new Set();

// BLOCK 13: Private Helpers
_setTimeout(callback, delay) {
  const id = setTimeout(() => {
    this._timers.delete(id);
    callback();
  }, delay);
  this._timers.add(id);
  this._logger.trace('Timer registered', { id, delay });
  return id;
}

_clearTimeout(id) {
  clearTimeout(id);
  this._timers.delete(id);
  this._logger.trace('Timer cleared', { id });
}

// BLOCK 7: Lifecycle - disconnectedCallback
disconnectedCallback() {
  super.disconnectedCallback();
  this._logger.info('Disconnected from DOM');

  // Cleanup all timers
  this._timers.forEach(id => clearTimeout(id));
  this._timers.clear();
  this._logger.debug('All timers cleared', { count: this._timers.size });
}
```

**Examples:** `t-tst` (auto-dismiss), `t-pnl` (loading timeout), `t-sta` (marquee animation)

---

### Pattern 2: Document Listener Cleanup

**Use when:** Component listens to document/window events (click-outside, escape key, drag tracking)

```javascript
// BLOCK 4: Internal State
_documentListeners = new Map();

// BLOCK 13: Private Helpers
_addDocumentListener(event, handler, options = {}) {
  document.addEventListener(event, handler, options);

  if (!this._documentListeners.has(event)) {
    this._documentListeners.set(event, []);
  }
  this._documentListeners.get(event).push({ handler, options });

  this._logger.trace('Document listener added', { event });
}

_removeDocumentListener(event, handler) {
  document.removeEventListener(event, handler);

  if (this._documentListeners.has(event)) {
    const listeners = this._documentListeners.get(event);
    const index = listeners.findIndex(l => l.handler === handler);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  this._logger.trace('Document listener removed', { event });
}

// BLOCK 7: Lifecycle - disconnectedCallback
disconnectedCallback() {
  super.disconnectedCallback();
  this._logger.info('Disconnected from DOM');

  // Cleanup all document listeners
  this._documentListeners.forEach((listeners, event) => {
    listeners.forEach(({ handler, options }) => {
      document.removeEventListener(event, handler, options);
    });
  });
  this._documentListeners.clear();

  this._logger.debug('All document listeners removed');
}
```

**Examples:** `t-mdl` (Escape key), `t-usr` (click outside), `t-drp` (click outside), `t-sld` (drag tracking)

---

### Pattern 3: Animation Frame Cleanup

**Use when:** Component uses requestAnimationFrame for animations

```javascript
// BLOCK 4: Internal State
_isAnimating = false;
_animationFrame = null;

// BLOCK 13: Private Helpers
_startAnimation() {
  if (this._isAnimating) return;

  this._isAnimating = true;
  this._logger.debug('Animation started');

  const animate = () => {
    if (!this._isAnimating) return;

    // Animation logic here
    this._updateAnimation();

    this._animationFrame = requestAnimationFrame(animate);
  };

  this._animationFrame = requestAnimationFrame(animate);
}

_stopAnimation() {
  this._isAnimating = false;

  if (this._animationFrame) {
    cancelAnimationFrame(this._animationFrame);
    this._animationFrame = null;
    this._logger.debug('Animation stopped');
  }
}

// BLOCK 7: Lifecycle - disconnectedCallback
disconnectedCallback() {
  super.disconnectedCallback();
  this._logger.info('Disconnected from DOM');

  // Stop animations
  this._stopAnimation();
}
```

**Examples:** `t-sta` (marquee), custom animations

---

### Pattern 4: Bundled Library Cleanup (iro.js)

**Use when:** Component uses bundled third-party library

```javascript
// BLOCK 4: Internal State
_colorPicker = null; // iro.js instance

// BLOCK 7: Lifecycle - firstUpdated
firstUpdated(changedProperties) {
  super.firstUpdated(changedProperties);
  this._logger.debug('First update complete');

  // Initialize bundled library
  this._initializeColorPicker();
}

// BLOCK 7: Lifecycle - disconnectedCallback
disconnectedCallback() {
  super.disconnectedCallback();
  this._logger.info('Disconnected from DOM');

  // Cleanup iro.js instance
  if (this._colorPicker) {
    // Remove all event listeners
    this._colorPicker.off('color:change');
    this._colorPicker.off('input:change');
    this._colorPicker.off('color:init');

    // Destroy instance
    this._colorPicker = null;

    this._logger.debug('Color picker instance cleaned up');
  }
}

// BLOCK 13: Private Helpers
_initializeColorPicker() {
  const container = this.shadowRoot.querySelector('.color-picker-container');
  if (!container) {
    this._logger.error('Color picker container not found');
    return;
  }

  this._colorPicker = new iro.ColorPicker(container, {
    width: 200,
    color: this.value,
    layout: [
      { component: iro.ui.Wheel },
      { component: iro.ui.Slider, options: { sliderType: 'hue' } }
    ]
  });

  // Bridge iro events to Lit events
  this._colorPicker.on('color:change', (color) => {
    this._emitEvent('color-change', {
      hex: color.hexString,
      rgb: color.rgb,
      hsl: color.hsl
    });
  });

  this._logger.debug('Color picker initialized');
}
```

**Examples:** `t-clr` (iro.js color picker)

---

### Pattern 5: Nested Component Cleanup

**Use when:** Container component maintains registry of nested components

```javascript
// BLOCK 4: Internal State
_nestedComponents = new Set();

// BLOCK 10: Nesting Support
_registerNestedComponent(component) {
  this._logger.debug('Registering nested component', {
    tag: component.tagName
  });

  this._nestedComponents.add(component);
  this._propagateContext(component);
}

_unregisterNestedComponent(component) {
  this._nestedComponents.delete(component);
  this._logger.debug('Unregistered nested component', {
    tag: component.tagName
  });
}

// BLOCK 7: Lifecycle - disconnectedCallback
disconnectedCallback() {
  super.disconnectedCallback();
  this._logger.info('Disconnected from DOM');

  // Clear nested component registry
  this._nestedComponents.clear();

  this._logger.debug('Nested components cleared');
}
```

**Examples:** `t-pnl`, `t-mdl`, `t-tre`, `t-sta`

---

### Combined Example: Component with Multiple Cleanup Needs

```javascript
export class TDropdownLit extends LitElement {
  // BLOCK 4: Internal State
  _timers = new Set();
  _documentListeners = new Map();
  _isAnimating = false;

  // ... other blocks ...

  // BLOCK 7: disconnectedCallback
  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');

    // 1. Clear timers (debounce, auto-close)
    this._timers.forEach(id => clearTimeout(id));
    this._timers.clear();

    // 2. Remove document listeners (click outside)
    this._documentListeners.forEach((listeners, event) => {
      listeners.forEach(({ handler }) => {
        document.removeEventListener(event, handler);
      });
    });
    this._documentListeners.clear();

    // 3. Stop animations (dropdown transitions)
    this._isAnimating = false;

    this._logger.debug('All resources cleaned up');
  }
}
```

---

### Cleanup Checklist

When implementing `disconnectedCallback()`, verify you're cleaning up:

- [ ] All `setTimeout`/`setInterval` timers
- [ ] All `document`/`window` event listeners
- [ ] All `requestAnimationFrame` animations
- [ ] All third-party library instances (iro.js, etc.)
- [ ] All nested component registries
- [ ] All internal state that could leak memory

---

## Shared Validation Utilities

> **♻️ DRY validation - reusable validators for common patterns**

Create `js/utils/validation-helpers.js` to share validation logic across components.

### Utility Module

```javascript
/**
 * Shared validation utilities for component properties
 * @module validation-helpers
 */

export const validators = {
  /**
   * Validate enum value
   * @param {Array<string>} allowedValues
   * @returns {Function} Validator function
   */
  enum: (allowedValues) => (value) => ({
    valid: allowedValues.includes(value),
    errors: allowedValues.includes(value) ? [] :
      [`Must be one of: ${allowedValues.join(', ')}. Got: ${value}`]
  }),

  /**
   * Validate numeric range
   * @param {number} min
   * @param {number} max
   * @returns {Function} Validator function
   */
  range: (min, max) => (value) => {
    const isValid = typeof value === 'number' && value >= min && value <= max;
    return {
      valid: isValid,
      errors: isValid ? [] : [`Must be between ${min} and ${max}. Got: ${value}`]
    };
  },

  /**
   * Validate dependent property
   * @param {string} dependentProp - Property name that must also be true
   * @param {string} dependentValue - Required value of dependent property
   * @returns {Function} Validator function
   */
  dependent: (dependentProp, dependentValue) => (value, context) => {
    if (value && context[dependentProp] !== dependentValue) {
      return {
        valid: false,
        errors: [`Requires ${dependentProp}=${dependentValue}`]
      };
    }
    return { valid: true, errors: [] };
  },

  /**
   * Validate array of objects
   * @param {Function} itemValidator - Validator for each array item
   * @returns {Function} Validator function
   */
  arrayOf: (itemValidator) => (value) => {
    if (!Array.isArray(value)) {
      return { valid: false, errors: ['Must be an array'] };
    }

    const errors = [];
    value.forEach((item, i) => {
      const result = itemValidator(item);
      if (!result.valid) {
        errors.push(`[${i}]: ${result.errors.join(', ')}`);
      }
    });

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate object shape
   * @param {Object} requiredKeys - Map of {key: validator}
   * @returns {Function} Validator function
   */
  objectShape: (requiredKeys) => (value) => {
    if (typeof value !== 'object' || value === null) {
      return { valid: false, errors: ['Must be an object'] };
    }

    const errors = [];

    Object.entries(requiredKeys).forEach(([key, validator]) => {
      if (!(key in value)) {
        errors.push(`Missing required key: ${key}`);
      } else {
        const result = validator(value[key]);
        if (!result.valid) {
          errors.push(`${key}: ${result.errors.join(', ')}`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  },

  /**
   * Validate string pattern
   * @param {RegExp} pattern
   * @param {string} message - Error message
   * @returns {Function} Validator function
   */
  pattern: (pattern, message) => (value) => {
    const isValid = typeof value === 'string' && pattern.test(value);
    return {
      valid: isValid,
      errors: isValid ? [] : [message || `Must match pattern: ${pattern}`]
    };
  },

  /**
   * Validate string length
   * @param {number} min
   * @param {number} max
   * @returns {Function} Validator function
   */
  stringLength: (min, max) => (value) => {
    if (typeof value !== 'string') {
      return { valid: false, errors: ['Must be a string'] };
    }

    const len = value.length;
    const isValid = len >= min && len <= max;

    return {
      valid: isValid,
      errors: isValid ? [] : [`Length must be between ${min} and ${max}. Got: ${len}`]
    };
  }
};
```

### Usage in Components

```javascript
import { validators } from '../utils/validation-helpers.js';

export class TPanelLit extends LitElement {
  // ... other blocks ...

  // BLOCK 11: Validation
  static getPropertyValidation(propName) {
    return {
      variant: {
        validate: validators.enum(['standard', 'headless'])
      },

      title: {
        validate: validators.stringLength(0, 100)
      },

      // Dependent validation: collapsed requires collapsible=true
      collapsed: {
        validate: validators.dependent('collapsible', true)
      }
    }[propName];
  }
}
```

### Complex Validation Example: Dropdown Options

```javascript
import { validators } from '../utils/validation-helpers.js';

export class TDropdownLit extends LitElement {
  // BLOCK 11: Validation
  static getPropertyValidation(propName) {
    return {
      options: {
        // Each option must have {value, label}
        validate: validators.arrayOf(
          validators.objectShape({
            value: (v) => ({
              valid: typeof v === 'string',
              errors: typeof v === 'string' ? [] : ['value must be string']
            }),
            label: (v) => ({
              valid: typeof v === 'string',
              errors: typeof v === 'string' ? [] : ['label must be string']
            }),
            icon: (v) => ({
              valid: v === undefined || typeof v === 'string',
              errors: (v === undefined || typeof v === 'string') ? [] : ['icon must be string']
            })
          })
        )
      }
    }[propName];
  }
}
```

### Range Validation Example: Slider

```javascript
import { validators } from '../utils/validation-helpers.js';

export class TSliderLit extends LitElement {
  // BLOCK 11: Validation
  _validateProperty(propName, value) {
    const validation = this.constructor.getPropertyValidation(propName);
    if (!validation) return true;

    // Pass context for dependent validation
    const context = {
      min: this.min,
      max: this.max,
      value: this.value
    };

    const result = validation.validate(value, context);
    if (!result.valid) {
      this._logger.warn('Property validation failed', {
        propName,
        value,
        errors: result.errors
      });
    }

    return result.valid;
  }

  static getPropertyValidation(propName) {
    return {
      min: {
        validate: (value, context) => {
          // Min must be less than max
          if (context.max !== undefined && value >= context.max) {
            return {
              valid: false,
              errors: [`min (${value}) must be less than max (${context.max})`]
            };
          }
          return { valid: true, errors: [] };
        }
      },

      max: {
        validate: (value, context) => {
          // Max must be greater than min
          if (context.min !== undefined && value <= context.min) {
            return {
              valid: false,
              errors: [`max (${value}) must be greater than min (${context.min})`]
            };
          }
          return { valid: true, errors: [] };
        }
      },

      value: {
        validate: validators.range(this.min || 0, this.max || 100)
      }
    }[propName];
  }
}
```

---

## Nesting Architecture

### Parent Responsibilities

1. **Discovery:** Automatically discover nested components in slots
2. **Registration:** Maintain registry of nested components
3. **Context:** Propagate context (theme, depth, parent ref) to children
4. **Hooks:** Setup lifecycle hooks for nested components
5. **Cleanup:** Unregister nested components on disconnect

### Child Responsibilities

1. **Registration:** Register with parent on connect
2. **Context Reception:** Implement `receiveContext()` method
3. **Unregistration:** Unregister from parent on disconnect
4. **Event Bubbling:** Emit events with `bubbles: true, composed: true`
5. **Isolation:** Maintain own state despite parent context

### Context Object Structure

```typescript
interface ComponentContext {
  parent: LitElement;           // Parent component reference
  depth: number;                // Nesting depth (0 = root)
  logger: ComponentLogger;      // Shared logger instance
  theme: string;                // Theme name
  [key: string]: unknown;       // Component-specific context
}
```

### Example: Panel Nesting Panel

```javascript
export class TPanelLit extends LitElement {
  // ... standard blocks ...

  _registerNestedComponent(component) {
    super._registerNestedComponent?.(component);

    // Panel-specific: adjust nested panel size
    if (component.tagName === 'T-PNL') {
      if (this.compact && !component.hasAttribute('compact')) {
        component.compact = true;
      }
    }
  }

  _propagateContext(component) {
    super._propagateContext?.(component);

    // Panel-specific context
    if (typeof component.receiveContext === 'function') {
      component.receiveContext({
        ...this._context,
        parent: this,
        depth: (this._context?.depth || 0) + 1,
        parentVariant: this.variant,
        parentCollapsed: this.collapsed
      });
    }
  }
}
```

---

## Logging System

### ComponentLogger API

```javascript
export class ComponentLogger {
  constructor(componentName, componentInstance) {
    this.componentName = componentName;
    this.instance = componentInstance;
    this.enabled = this._checkEnabled();
    this.level = this._getLevel();
  }

  /**
   * Check if logging enabled for this component
   * @private
   * @returns {boolean}
   */
  _checkEnabled() {
    // URL param: ?debug=t-pnl,t-btn
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    if (!debug) return false;

    if (debug === '*' || debug === 'all') return true;

    const components = debug.split(',').map(c => c.trim());
    return components.includes(this.componentName);
  }

  /**
   * Get log level for this component
   * @private
   * @returns {string}
   */
  _getLevel() {
    // URL param: ?loglevel=trace
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('loglevel') || 'debug';
    return level;
  }

  /**
   * Log levels (ordered by severity)
   */
  static LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4
  };

  /**
   * Error log (always shown)
   * @param {string} message
   * @param {Object} data
   */
  error(message, data = {}) {
    console.error(`[${this.componentName}]`, message, data);
    this._trackError(message, data);
  }

  /**
   * Warning log
   * @param {string} message
   * @param {Object} data
   */
  warn(message, data = {}) {
    if (!this.enabled) return;
    if (ComponentLogger.LEVELS[this.level] < ComponentLogger.LEVELS.warn) return;

    console.warn(`[${this.componentName}]`, message, data);
  }

  /**
   * Info log
   * @param {string} message
   * @param {Object} data
   */
  info(message, data = {}) {
    if (!this.enabled) return;
    if (ComponentLogger.LEVELS[this.level] < ComponentLogger.LEVELS.info) return;

    console.info(`[${this.componentName}]`, message, data);
  }

  /**
   * Debug log
   * @param {string} message
   * @param {Object} data
   */
  debug(message, data = {}) {
    if (!this.enabled) return;
    if (ComponentLogger.LEVELS[this.level] < ComponentLogger.LEVELS.debug) return;

    console.log(`[${this.componentName}]`, message, data);
  }

  /**
   * Trace log (most verbose)
   * @param {string} message
   * @param {Object} data
   */
  trace(message, data = {}) {
    if (!this.enabled) return;
    if (ComponentLogger.LEVELS[this.level] < ComponentLogger.LEVELS.trace) return;

    console.log(`[${this.componentName}][TRACE]`, message, data);
  }

  /**
   * Track error for analytics
   * @private
   */
  _trackError(message, data) {
    if (window.__TERMINAL_KIT_ERROR_TRACKER__) {
      window.__TERMINAL_KIT_ERROR_TRACKER__.track({
        component: this.componentName,
        message,
        data,
        timestamp: Date.now()
      });
    }
  }
}
```

### Usage in Components

```javascript
// Enable logging for specific components
// URL: ?debug=t-pnl,t-btn&loglevel=trace

constructor() {
  super();
  this._logger = new ComponentLogger('t-pnl', this);
  this._logger.debug('Constructed');
}

connectedCallback() {
  super.connectedCallback();
  this._logger.info('Connected');
}

publicMethod(param) {
  this._logger.debug('Method called', { param });

  try {
    // ... logic
  } catch (error) {
    this._logger.error('Method failed', { param, error });
    throw error;
  }
}

updated(changedProperties) {
  super.updated(changedProperties);
  this._logger.trace('Updated', {
    changed: Array.from(changedProperties.keys())
  });
}
```

---

## Safety Mechanisms

### 1. Property Validation

```javascript
export class TPanelLit extends LitElement {
  static getPropertyValidation(propName) {
    const validations = {
      variant: {
        validate: (value) => {
          const valid = ['standard', 'headless'].includes(value);
          return {
            valid,
            errors: valid ? [] : [`variant must be 'standard' or 'headless', got '${value}'`]
          };
        }
      },
      title: {
        validate: (value) => {
          const valid = typeof value === 'string' && value.length <= 100;
          return {
            valid,
            errors: valid ? [] : ['title must be string with max 100 chars']
          };
        }
      }
    };

    return validations[propName] || null;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    // Validate changed properties
    changedProperties.forEach((oldValue, propName) => {
      const newValue = this[propName];
      if (!this._validateProperty(propName, newValue)) {
        // Revert to old value
        this[propName] = oldValue;
        this._logger.warn('Property reverted due to validation failure', {
          propName,
          attempted: newValue,
          reverted: oldValue
        });
      }
    });
  }
}
```

### 2. Circular Nesting Prevention

```javascript
export class TPanelLit extends LitElement {
  receiveContext(context) {
    // Check nesting depth
    const maxDepth = 10;
    if (context.depth >= maxDepth) {
      this._logger.error('Maximum nesting depth exceeded', {
        depth: context.depth,
        maxDepth
      });
      throw new Error(`Maximum nesting depth (${maxDepth}) exceeded`);
    }

    // Check for circular reference
    let parent = context.parent;
    const ancestors = new Set();

    while (parent) {
      if (ancestors.has(parent)) {
        this._logger.error('Circular nesting detected');
        throw new Error('Circular nesting detected');
      }
      ancestors.add(parent);
      parent = parent._context?.parent;
    }

    this._context = context;
  }
}
```

### 3. Slot Content Validation

```javascript
export class TPanelLit extends LitElement {
  /**
   * Validate slot content
   * @private
   * @param {string} slotName
   * @param {Element[]} elements
   */
  _validateSlotContent(slotName, elements) {
    const rules = this.constructor.getSlotValidation(slotName);
    if (!rules) return true;

    // Check allowed elements
    if (rules.accepts) {
      const invalid = elements.filter(el => {
        const tagName = el.tagName.toLowerCase();
        return !rules.accepts.includes(tagName) && !rules.accepts.includes('*');
      });

      if (invalid.length > 0) {
        this._logger.warn('Invalid slot content', {
          slotName,
          allowed: rules.accepts,
          invalid: invalid.map(el => el.tagName)
        });
        return false;
      }
    }

    // Check max count
    if (rules.maxCount && elements.length > rules.maxCount) {
      this._logger.warn('Slot content exceeds max count', {
        slotName,
        maxCount: rules.maxCount,
        actual: elements.length
      });
      return false;
    }

    return true;
  }

  static getSlotValidation(slotName) {
    return {
      actions: {
        accepts: ['t-btn'],
        maxCount: 10
      },
      default: {
        accepts: ['*']
      }
    }[slotName];
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    // Validate all slots
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      const slotName = slot.name || 'default';
      const elements = slot.assignedElements();
      this._validateSlotContent(slotName, elements);
    });
  }
}
```

### 4. Event Validation

```javascript
export class TPanelLit extends LitElement {
  _emitEvent(eventName, detail = {}) {
    // Validate event name
    const allowedEvents = this.constructor.getAllowedEvents();
    if (!allowedEvents.includes(eventName)) {
      this._logger.error('Attempted to emit unregistered event', {
        eventName,
        allowedEvents
      });
      throw new Error(`Event '${eventName}' not registered in component manifest`);
    }

    // Validate event detail
    const validation = this.constructor.getEventValidation(eventName);
    if (validation) {
      const result = validation.validate(detail);
      if (!result.valid) {
        this._logger.error('Event detail validation failed', {
          eventName,
          detail,
          errors: result.errors
        });
        throw new Error(`Invalid event detail: ${result.errors.join(', ')}`);
      }
    }

    super._emitEvent(eventName, detail);
  }

  static getAllowedEvents() {
    return ['panel-collapsed', 'panel-footer-collapsed'];
  }

  static getEventValidation(eventName) {
    return {
      'panel-collapsed': {
        validate: (detail) => {
          const valid = typeof detail.collapsed === 'boolean';
          return {
            valid,
            errors: valid ? [] : ['detail.collapsed must be boolean']
          };
        }
      }
    }[eventName];
  }
}
```

---

## JSDoc Requirements

### Property Documentation

```javascript
/**
 * @property {string} title - Panel title displayed in header
 * @default ''
 * @attribute title
 * @reflects true
 * @validation Must be string with max 100 characters
 * @example
 * <t-pnl title="My Panel"></t-pnl>
 */
static properties = {
  /**
   * @property {string} title - Panel title displayed in header
   * @default ''
   * @attribute title
   * @reflects true
   * @validation Must be string with max 100 characters
   * @example
   * <t-pnl title="My Panel"></t-pnl>
   */
  title: { type: String, reflect: true },

  /**
   * @property {('standard'|'headless')} variant - Panel variant
   * @default 'standard'
   * @attribute variant
   * @validation Must be 'standard' or 'headless'
   * @example
   * <t-pnl variant="headless"></t-pnl>
   */
  variant: { type: String },

  /**
   * @property {boolean} collapsible - Enable collapse functionality
   * @default false
   * @attribute collapsible
   * @reflects true
   * @example
   * <t-pnl collapsible></t-pnl>
   */
  collapsible: { type: Boolean, reflect: true }
};
```

### Method Documentation

```javascript
/**
 * Toggle panel collapse state
 * @public
 * @returns {boolean} New collapsed state
 * @throws {Error} When panel is not collapsible
 * @fires TPanelLit#panel-collapsed
 * @example
 * const newState = panel.toggleCollapse();
 * console.log(newState); // true or false
 */
toggleCollapse() {
  if (!this.collapsible) {
    throw new Error('Panel is not collapsible');
  }
  this.collapsed = !this.collapsed;
  this._emitEvent('panel-collapsed', { collapsed: this.collapsed });
  return this.collapsed;
}
```

### Event Documentation

```javascript
/**
 * @event TPanelLit#panel-collapsed
 * @type {CustomEvent<{collapsed: boolean}>}
 * @description Fired when panel collapse state changes
 * @property {boolean} detail.collapsed - New collapsed state
 * @bubbles true
 * @composed true
 * @example
 * panel.addEventListener('panel-collapsed', (e) => {
 *   console.log('Panel collapsed:', e.detail.collapsed);
 * });
 */
```

### Slot Documentation

```javascript
/**
 * @slot - Default slot for panel content. Accepts any elements. Supports nesting other panels.
 * @slot actions - Action buttons in panel header. Accepts only t-btn elements. Auto-sized based on panel size.
 * @slot footer - Footer content. Accepts any elements. Can be collapsed with slide animation.
 */
```

---

## Unit Testing Requirements

### Test File Structure

Every component MUST have a co-located test file following Vitest conventions:

```
js/components/
├── TPanelLit.js
└── TPanelLit.test.js
```

### Required Test Suites

```javascript
// js/components/ComponentName.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import './ComponentName.js';

describe('ComponentName', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`<tag-name></tag-name>`);
  });

  afterEach(() => {
    component?.remove();
  });

  // SUITE 1: Properties (REQUIRED)
  describe('Properties', () => {
    it('should have correct default values', () => {
      expect(component.title).toBe('');
      expect(component.variant).toBe('standard');
    });

    it('should update properties', async () => {
      component.title = 'Test';
      await component.updateComplete;
      expect(component.title).toBe('Test');
    });

    it('should reflect properties to attributes', async () => {
      component.title = 'Test';
      await component.updateComplete;
      expect(component.getAttribute('title')).toBe('Test');
    });

    it('should validate property values', () => {
      component.variant = 'invalid';
      // Component should reject or revert invalid value
      expect(component.variant).not.toBe('invalid');
    });
  });

  // SUITE 2: Methods (REQUIRED)
  describe('Methods', () => {
    it('should expose documented public methods', () => {
      expect(typeof component.publicMethod).toBe('function');
    });

    it('should execute methods correctly', () => {
      const result = component.publicMethod('valid-param');
      expect(result).toBeDefined();
    });

    it('should throw on invalid parameters', () => {
      expect(() => component.publicMethod(null)).toThrow();
    });
  });

  // SUITE 3: Events (REQUIRED)
  describe('Events', () => {
    it('should emit documented events', (done) => {
      component.addEventListener('component-event', (e) => {
        expect(e.detail).toBeDefined();
        expect(e.bubbles).toBe(true);
        expect(e.composed).toBe(true);
        done();
      });

      component.publicMethod('trigger-event');
    });

    it('should emit events with correct detail structure', (done) => {
      component.addEventListener('component-event', (e) => {
        expect(e.detail).toHaveProperty('expectedKey');
        expect(typeof e.detail.expectedKey).toBe('string');
        done();
      });

      component.publicMethod('trigger-event');
    });
  });

  // SUITE 4: Nesting (REQUIRED for container components)
  describe('Nesting', () => {
    it('should discover nested components', async () => {
      const nested = await fixture(html`
        <tag-name>
          <t-btn>Button</t-btn>
        </tag-name>
      `);

      await nested.updateComplete;
      expect(nested._nestedComponents.size).toBe(1);
    });

    it('should propagate context to nested components', async () => {
      const nested = await fixture(html`
        <tag-name>
          <t-btn>Button</t-btn>
        </tag-name>
      `);

      await nested.updateComplete;
      const button = nested.querySelector('t-btn');
      expect(button._context).toBeDefined();
      expect(button._context.parent).toBe(nested);
    });

    it('should prevent circular nesting', () => {
      expect(() => {
        component.receiveContext({
          depth: 10  // Max depth
        });
      }).toThrow('Maximum nesting depth exceeded');
    });
  });

  // SUITE 5: Validation (REQUIRED)
  describe('Validation', () => {
    it('should validate property types', () => {
      const validation = component.constructor.getPropertyValidation('variant');
      expect(validation).toBeDefined();

      const result = validation.validate('invalid');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate slot content', async () => {
      const withInvalidSlot = await fixture(html`
        <tag-name>
          <div slot="actions">Invalid - should be t-btn</div>
        </tag-name>
      `);

      await withInvalidSlot.updateComplete;
      // Component should log warning (check logger)
    });
  });

  // SUITE 6: Rendering (REQUIRED)
  describe('Rendering', () => {
    it('should render with shadow DOM', () => {
      expect(component.shadowRoot).toBeDefined();
    });

    it('should render slots', async () => {
      const withContent = await fixture(html`
        <tag-name>
          <div>Content</div>
        </tag-name>
      `);

      await withContent.updateComplete;
      const slot = withContent.shadowRoot.querySelector('slot');
      expect(slot.assignedElements().length).toBe(1);
    });

    it('should update render on property change', async () => {
      component.title = 'New Title';
      await component.updateComplete;

      const titleEl = component.shadowRoot.querySelector('.component__title');
      expect(titleEl.textContent).toBe('New Title');
    });
  });

  // SUITE 7: Logging (REQUIRED)
  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(component._logger).toBeDefined();
      expect(component._logger.componentName).toBe('tag-name');
    });

    it('should log errors always', () => {
      const spy = vi.spyOn(console, 'error');
      component._logger.error('Test error');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
```

### Test Coverage Requirements

1. **100% Public API Coverage** - All public methods, properties, events, and slots must be tested
2. **Error Cases** - Test invalid inputs, edge cases, and error conditions
3. **Integration Tests** - Test nesting behavior if component supports it
4. **Event Testing** - Verify all events fire with correct detail structure
5. **Validation Testing** - Verify all validation rules work correctly

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## CSS Migration Strategy

> **🎨 Migrating from shared external CSS to Lit static styles**

All components must use Lit's `static styles` with `css``template` for encapsulated, FOUC-free styling.

### Current Architecture (TComponent/DSD)

```javascript
// ❌ OLD: External CSS loaded in HTML
<link rel="stylesheet" href="css/terminal-kit.css">

// Component depends on external stylesheet being loaded
```

**Problems:**
- FOUC (Flash of Unstyled Content) on load
- CSS must load before components render
- Global namespace collisions
- Can't distribute as standalone components

---

### Target Architecture (Lit)

```javascript
// ✅ NEW: Static styles in component
import { LitElement, html, css } from 'lit';

export class TButtonLit extends LitElement {
  static styles = css`
    /* All component-specific styles */
    :host {
      display: inline-block;
      --t-btn-bg: var(--terminal-bg, #000);
      --t-btn-border: var(--terminal-green, #00ff41);
    }

    .btn {
      background: var(--t-btn-bg);
      border: 1px solid var(--t-btn-border);
      color: var(--t-btn-border);
      padding: 8px 16px;
    }
  `;

  render() {
    return html`<button class="btn">${this.textContent}</button>`;
  }
}
```

**Benefits:**
- ✅ Zero FOUC - styles bundled with component
- ✅ Shadow DOM encapsulation
- ✅ Component is self-contained
- ✅ Can distribute as single file

---

### Migration Steps

#### Step 1: Extract Component-Specific Styles

Find all CSS rules for your component in shared `css/terminal-kit.css`:

```css
/* css/terminal-kit.css */

/* Button styles - EXTRACT THESE */
.terminal-button {
  background: #000;
  border: 1px solid #00ff41;
  /* ... */
}

.terminal-button:hover {
  background: #00ff4120;
}

.terminal-button.primary {
  background: #00ff41;
  color: #000;
}
```

#### Step 2: Convert to Lit css`` Template

```javascript
// js/components/TButtonLit.js

static styles = css`
  /* Convert class selectors to :host and internal classes */
  :host {
    display: inline-block;
  }

  .btn {
    background: #000;
    border: 1px solid #00ff41;
  }

  .btn:hover {
    background: #00ff4120;
  }

  .btn.primary {
    background: #00ff41;
    color: #000;
  }
`;
```

#### Step 3: Replace Hardcoded Colors with CSS Variables

```javascript
static styles = css`
  :host {
    display: inline-block;

    /* Define component-specific CSS variables */
    --t-btn-bg: var(--terminal-bg, #000);
    --t-btn-border: var(--terminal-green, #00ff41);
    --t-btn-hover: var(--terminal-green-dim, #00ff4120);
  }

  .btn {
    background: var(--t-btn-bg);
    border: 1px solid var(--t-btn-border);
  }

  .btn:hover {
    background: var(--t-btn-hover);
  }
`;
```

#### Step 4: Test in Isolation

```bash
# Run dev server
npm run dev

# Test component loads without external CSS
# Component should render correctly standalone
```

#### Step 5: Remove from Shared CSS

Once component works standalone, remove the rules from `css/terminal-kit.css`:

```css
/* css/terminal-kit.css */

/* ❌ DELETE - Now in TButtonLit.js static styles */
/* .terminal-button { ... } */
```

---

### CSS Variable Strategy

#### Global Theme Variables (stay in global CSS)

```css
/* css/terminal-kit.css - KEEP THESE */
:root {
  /* Colors */
  --terminal-bg: #000;
  --terminal-green: #00ff41;
  --terminal-green-dim: #00ff4180;
  --terminal-red: #ff4136;
  --terminal-blue: #0074d9;

  /* Typography */
  --terminal-font: 'IBM Plex Mono', monospace;
  --terminal-font-size: 14px;

  /* Spacing */
  --terminal-spacing-xs: 4px;
  --terminal-spacing-sm: 8px;
  --terminal-spacing-md: 16px;
  --terminal-spacing-lg: 24px;

  /* Borders */
  --terminal-border-width: 1px;
  --terminal-border-radius: 4px;

  /* Transitions */
  --terminal-transition: all 0.2s ease;
}
```

#### Component-Specific Variables (in static styles)

```javascript
static styles = css`
  :host {
    /* Component defaults that reference global variables */
    --t-btn-bg: var(--terminal-bg);
    --t-btn-border: var(--terminal-green);
    --t-btn-padding: var(--terminal-spacing-sm) var(--terminal-spacing-md);
    --t-btn-transition: var(--terminal-transition);
  }

  .btn {
    background: var(--t-btn-bg);
    border: var(--terminal-border-width) solid var(--t-btn-border);
    padding: var(--t-btn-padding);
    transition: var(--t-btn-transition);
  }
`;
```

**Users can override component variables:**
```html
<style>
  t-btn {
    --t-btn-bg: #111;
    --t-btn-border: #ff0000;
  }
</style>

<t-btn>Custom Styled Button</t-btn>
```

---

### Bundled Assets Strategy

#### Fonts

**Fonts stay in global CSS** (not component-specific):

```css
/* css/terminal-kit.css */
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/IBMPlexMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Components reference via CSS variable:

```javascript
static styles = css`
  .btn {
    font-family: var(--terminal-font, 'IBM Plex Mono', monospace);
  }
`;
```

#### Icons

**Icons already bundled** in `js/utils/phosphor-icons.js`:

```javascript
// js/utils/phosphor-icons.js
export const caretDownIcon = '<svg>...</svg>';
export const caretRightIcon = '<svg>...</svg>';

// Usage in component
import { caretDownIcon } from '../utils/phosphor-icons.js';

render() {
  return html`
    <button>
      <span .innerHTML=${caretDownIcon}></span>
    </button>
  `;
}
```

#### iro.js Color Picker

**Bundled locally** (not CDN):

```javascript
// Import from node_modules (bundled by Vite)
import iro from '@jaames/iro';

export class TColorPickerLit extends LitElement {
  firstUpdated() {
    this._colorPicker = iro.ColorPicker(container, {
      width: 200,
      color: this.value
    });
  }
}
```

**package.json:**
```json
{
  "dependencies": {
    "lit": "^3.3.1",
    "@jaames/iro": "^5.5.2"
  }
}
```

---

### Migration Checklist

For each component being migrated:

- [ ] Extract all component CSS rules from `css/terminal-kit.css`
- [ ] Convert to Lit `css`` template` in `static styles`
- [ ] Replace hardcoded colors with CSS variables
- [ ] Use `:host` for component-level styles
- [ ] Reference global theme variables (`--terminal-*`)
- [ ] Test component renders without external CSS
- [ ] Verify no FOUC on page load
- [ ] Remove old CSS rules from `css/terminal-kit.css`
- [ ] Update documentation with new CSS variable API

---

### Common Patterns

#### Pattern: Conditional Styles Based on Properties

```javascript
static styles = css`
  :host {
    display: block;
  }

  /* Base styles */
  .panel {
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-green);
  }

  /* Variant styles */
  :host([variant="headless"]) .panel {
    border: none;
  }

  /* State styles */
  :host([collapsed]) .panel__body {
    display: none;
  }

  :host([disabled]) .panel {
    opacity: 0.5;
    pointer-events: none;
  }
`;
```

#### Pattern: Size Variations

```javascript
static styles = css`
  :host {
    display: block;
  }

  /* Base size */
  .panel {
    padding: var(--terminal-spacing-md);
  }

  /* Compact size */
  :host([compact]) .panel {
    padding: var(--terminal-spacing-sm);
  }

  /* Large size */
  :host([large]) .panel {
    padding: var(--terminal-spacing-lg);
    font-size: 16px;
  }
`;
```

#### Pattern: Theming Support

```javascript
static styles = css`
  :host {
    /* Light theme defaults */
    --component-bg: var(--terminal-bg, #000);
    --component-fg: var(--terminal-green, #00ff41);
  }

  /* Dark theme override */
  :host([theme="dark"]) {
    --component-bg: #111;
    --component-fg: #0f0;
  }

  /* User can override any variable */
  .content {
    background: var(--component-bg);
    color: var(--component-fg);
  }
`;
```

---

### Distribution Strategy

Once all components use static styles:

**Library can be distributed as:**
1. **ES Modules** (individual component files)
2. **Single Bundle** (all components in one file)
3. **NPM Package** (published to npm)

**Users install and import:**
```bash
npm install @terminal-kit/components
```

```javascript
import '@terminal-kit/components/t-btn.js';
import '@terminal-kit/components/t-pnl.js';

// Components work standalone - no external CSS needed!
```

**Theme customization via CSS variables:**
```html
<style>
  :root {
    --terminal-bg: #0a0e27;
    --terminal-green: #00d9ff;
    --terminal-font: 'Fira Code', monospace;
  }
</style>
```

---

## Build-Time Generation

### Manifest Generator Script

```javascript
// scripts/generate-manifests.js
import { parse } from '@typescript-eslint/typescript-estree';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Extract manifest from component file
 */
function extractManifest(filePath) {
  const source = readFileSync(filePath, 'utf-8');
  const ast = parse(source, {
    loc: true,
    comment: true,
    jsx: false
  });

  const manifest = {
    tagName: null,
    displayName: null,
    description: null,
    properties: {},
    methods: {},
    events: {},
    slots: {}
  };

  // Parse AST and extract JSDoc
  // ... parsing logic

  return manifest;
}

/**
 * Generate manifests for all components
 */
function generateManifests() {
  const componentsDir = './js/components';
  const files = readdirSync(componentsDir)
    .filter(f => f.endsWith('Lit.js'));

  const manifests = {};

  files.forEach(file => {
    const filePath = join(componentsDir, file);
    const manifest = extractManifest(filePath);

    if (manifest.tagName) {
      manifests[manifest.tagName] = manifest;
      console.log(`✓ Generated manifest for ${manifest.tagName}`);
    }
  });

  // Write to JSON
  writeFileSync(
    './js/manifests.json',
    JSON.stringify(manifests, null, 2)
  );

  console.log(`\n✓ Generated ${Object.keys(manifests).length} manifests`);
}

generateManifests();
```

### Package.json Scripts

```json
{
  "scripts": {
    "manifests": "node scripts/generate-manifests.js",
    "manifests:watch": "nodemon --watch js/components --ext js --exec npm run manifests",
    "prebuild": "npm run manifests",
    "predev": "npm run manifests",
    "dev": "npm run manifests:watch & vite"
  }
}
```

---

## Complete Example

### TPanelLit with Full Schema

```javascript
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import { caretRightIcon, caretDownIcon } from '../utils/phosphor-icons.js';

/**
 * @component TPanelLit
 * @tagname t-pnl
 * @description Collapsible panel with header, footer, and nested content support. Automatically sizes nested action buttons and propagates context to nested components.
 * @category Layout
 * @since 1.0.0
 * @example
 * <t-pnl title="My Panel" collapsible>
 *   <div slot="actions">
 *     <t-btn>Action</t-btn>
 *   </div>
 *   Panel content here
 *   <div slot="footer">Footer content</div>
 * </t-pnl>
 */
export class TPanelLit extends LitElement {

  // BLOCK 1: STATIC METADATA
  static tagName = 't-pnl';
  static version = '1.0.0';
  static category = 'Layout';

  // BLOCK 2: STATIC STYLES
  static styles = css`
    /* ... all styles ... */
  `;

  // BLOCK 3: REACTIVE PROPERTIES

  /**
   * @property {string} title - Panel title displayed in header
   * @default ''
   * @attribute title
   * @reflects true
   */
  static properties = {
    /**
     * @property {string} title - Panel title displayed in header
     * @default ''
     * @attribute title
     * @reflects true
     */
    title: { type: String, reflect: true },

    /**
     * @property {('standard'|'headless')} variant - Panel variant
     * @default 'standard'
     * @attribute variant
     */
    variant: { type: String },

    /**
     * @property {boolean} collapsible - Enable collapse/expand functionality
     * @default false
     * @attribute collapsible
     * @reflects true
     */
    collapsible: { type: Boolean, reflect: true }
  };

  // ... more properties

  // BLOCK 4: INTERNAL STATE
  /** @private */
  _nestedComponents = new Set();

  /** @private */
  _context = null;

  // BLOCK 5: LOGGER
  /** @private */
  _logger = null;

  // BLOCK 6: CONSTRUCTOR
  constructor() {
    super();
    this._logger = new ComponentLogger(TPanelLit.tagName, this);
    this._logger.debug('Component constructed');
  }

  // BLOCK 7: LIFECYCLE
  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected to DOM');
    this._registerWithParent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.info('Disconnected from DOM');
    this._cleanup();
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._logger.debug('First update complete');
    this._discoverNestedComponents();
    this._validateSlots();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._logger.trace('Updated', {
      changed: Array.from(changedProperties.keys())
    });
    this._handlePropertyChanges(changedProperties);
  }

  // BLOCK 8: PUBLIC API

  /**
   * Toggle panel collapse state
   * @public
   * @returns {boolean} New collapsed state
   * @fires TPanelLit#panel-collapsed
   */
  toggleCollapse() {
    this._logger.debug('toggleCollapse called');

    if (!this.collapsible) {
      const error = new Error('Panel is not collapsible');
      this._logger.error('toggleCollapse failed', { error });
      throw error;
    }

    this.collapsed = !this.collapsed;
    this._emitEvent('panel-collapsed', { collapsed: this.collapsed });

    return this.collapsed;
  }

  // BLOCK 9: EVENT EMITTERS

  /**
   * @private
   */
  _emitEvent(eventName, detail = {}) {
    this._logger.debug('Emitting event', { eventName, detail });

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });

    this.dispatchEvent(event);
  }

  /**
   * @event TPanelLit#panel-collapsed
   * @type {CustomEvent<{collapsed: boolean}>}
   * @description Fired when panel collapse state changes
   * @property {boolean} detail.collapsed - New collapsed state
   * @bubbles true
   * @composed true
   */

  // BLOCK 10: NESTING SUPPORT

  /**
   * @private
   */
  _registerNestedComponent(component) {
    this._logger.debug('Registering nested component', {
      tag: component.tagName
    });

    this._nestedComponents.add(component);
    this._propagateContext(component);
  }

  /**
   * @private
   */
  _discoverNestedComponents() {
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      slot.assignedElements().forEach(el => {
        if (el.tagName?.startsWith('T-')) {
          this._registerNestedComponent(el);
        }
      });
    });
  }

  /**
   * @private
   */
  _propagateContext(component) {
    if (typeof component.receiveContext === 'function') {
      component.receiveContext({
        parent: this,
        depth: (this._context?.depth || 0) + 1,
        logger: this._logger,
        theme: this._getTheme(),
        parentVariant: this.variant
      });
    }
  }

  /**
   * @public
   */
  receiveContext(context) {
    // Validate depth
    if (context.depth >= 10) {
      throw new Error('Maximum nesting depth exceeded');
    }

    this._context = context;
    this._logger.debug('Received context from parent', { context });
  }

  // BLOCK 11: VALIDATION

  /**
   * @private
   */
  _validateProperty(propName, value) {
    const validation = this.constructor.getPropertyValidation(propName);
    if (!validation) return true;

    const result = validation.validate(value);
    if (!result.valid) {
      this._logger.warn('Property validation failed', {
        propName,
        value,
        errors: result.errors
      });
    }

    return result.valid;
  }

  static getPropertyValidation(propName) {
    const validations = {
      variant: {
        validate: (value) => ({
          valid: ['standard', 'headless'].includes(value),
          errors: ['Must be "standard" or "headless"']
        })
      }
    };
    return validations[propName];
  }

  /**
   * @private
   */
  _validateSlots() {
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      const slotName = slot.name || 'default';
      const elements = slot.assignedElements();
      this._validateSlotContent(slotName, elements);
    });
  }

  /**
   * @private
   */
  _validateSlotContent(slotName, elements) {
    const rules = this.constructor.getSlotValidation(slotName);
    if (!rules) return true;

    if (rules.accepts) {
      const invalid = elements.filter(el => {
        const tagName = el.tagName.toLowerCase();
        return !rules.accepts.includes(tagName) && !rules.accepts.includes('*');
      });

      if (invalid.length > 0) {
        this._logger.warn('Invalid slot content', {
          slotName,
          allowed: rules.accepts,
          invalid: invalid.map(el => el.tagName)
        });
      }
    }

    return true;
  }

  static getSlotValidation(slotName) {
    return {
      actions: { accepts: ['t-btn'], maxCount: 10 },
      default: { accepts: ['*'] },
      footer: { accepts: ['*'] }
    }[slotName];
  }

  // BLOCK 12: RENDER

  /**
   * @slot - Default slot for panel content
   * @slot actions - Action buttons (t-btn only)
   * @slot footer - Footer content
   */
  render() {
    this._logger.trace('Rendering');

    if (this.variant === 'headless') {
      return html`
        <div class="t-pnl">
          <div class="t-pnl__body">
            <slot></slot>
          </div>
        </div>
      `;
    }

    return html`
      <div class="t-pnl">
        <div class="t-pnl__header">
          ${this.collapsible ? this._renderCollapseButton() : ''}
          <div class="t-pnl__title">${this.title}</div>
          <div class="t-pnl__actions">
            <slot name="actions"></slot>
          </div>
        </div>
        ${!this.collapsed ? html`
          <div class="t-pnl__body">
            <slot></slot>
          </div>
        ` : ''}
        <div class="t-pnl__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  // BLOCK 13: PRIVATE HELPERS

  /** @private */
  _renderCollapseButton() {
    const icon = this.collapsed ? caretRightIcon : caretDownIcon;
    return html`
      <button
        class="t-pnl__collapse-btn"
        @click=${() => this.toggleCollapse()}>
        <span .innerHTML=${icon}></span>
      </button>
    `;
  }

  /** @private */
  _registerWithParent() {
    const parent = this.parentElement;
    if (parent && typeof parent._registerNestedComponent === 'function') {
      parent._registerNestedComponent(this);
    }
  }

  /** @private */
  _cleanup() {
    this._nestedComponents.clear();
  }

  /** @private */
  _handlePropertyChanges(changedProperties) {
    // Validate each changed property
    changedProperties.forEach((oldValue, propName) => {
      const newValue = this[propName];
      if (!this._validateProperty(propName, newValue)) {
        this[propName] = oldValue;
      }
    });
  }

  /** @private */
  _getTheme() {
    return this._context?.theme || 'default';
  }
}

// SECTION 3: REGISTRATION
if (!customElements.get(TPanelLit.tagName)) {
  customElements.define(TPanelLit.tagName, TPanelLit);
}

// SECTION 4: EXPORT
export default TPanelLit;
```

---

## Summary

This schema provides:

1. ✅ **Rigid Structure** - Every component follows exact same blocks
2. ✅ **Flexibility** - Components vary in behavior, not structure
3. ✅ **Nesting Support** - Parent-child communication built-in
4. ✅ **Logging System** - Granular per-component debugging
5. ✅ **Safety Mechanisms** - Validation at every level
6. ✅ **Self-Documenting** - JSDoc generates manifest
7. ✅ **Unit Testing** - Required co-located tests for all components
8. ✅ **Build-Time Generation** - No runtime fragility
9. ✅ **Pure Lit Compatible** - Works perfectly with Lit architecture

Every component built with this schema will be robust, maintainable, testable, and interoperable.