# Component Rewrite Instructions for Worktree Agents

**Mission:** You are an autonomouse code writing agent based on the most advanced LLM today - Claude Opus 4.1. You are working in a worktree directory for a terminal-kit component library. look at the folder name of the worktree - the part that comes after - terminal-kit- isthe name of the compoenent you need to work on! Completely rewrite the component to be fully compliant with COMPONENT_SCHEMA.md and COMPONENT_SPECIFICATIONS.md.

---

## Phase 1: Analysis & Planning

### 1.1 Read the Architecture Documents
Read these files IN ORDER:
1. `docs/COMPONENT_SCHEMA.md` - The rigid 13-block structure ALL components must follow
2. `docs/COMPONENT_SPECIFICATIONS.md` - Find your component's specific requirements and profile
3. `tests/README.md` - Understand testing philosophy and requirements

### 1.2 Identify Your Component Profile
Determine which profile your component follows:
- **CORE**: Basic components (Blocks 1-9, 12-13) → 3 test suites
- **FORM**: Form controls with validation (CORE + Block 11) → 6 test suites
- **FORM-ADVANCED**: Form + ElementInternals API → 6-7 test suites
- **CONTAINER**: Components with nesting (CORE + Block 10) → 5 test suites
- **DISPLAY**: Display-only components (Blocks 1-7, 12-13) → 3 test suites
- **BUNDLED-LIB**: External library integration (FORM + lib patterns) → 7 test suites
- **FULL**: All blocks (1-13) → 7+ test suites

### 1.3 Analyze Existing Component
Read the current component file:
- `js/components/[ComponentName].js` or
- `js/components/[ComponentName]Lit.js` (if Lit version exists)

Identify:
- Current properties, methods, events, slots
- CSS styles that need migration
- Validation logic
- Any custom behaviors or utilities

### 1.4 Create Implementation Plan
Create a detailed plan with:
- Which blocks from COMPONENT_SCHEMA.md you need (based on profile)
- Properties to implement (with types, defaults, reflection)
- Methods to implement (public API)
- Events to emit (with detail structures)
- Slots to define
- Validation requirements
- Nesting requirements (if CONTAINER/FULL profile)
- Cleanup requirements (if timers/listeners needed)

**DO NOT START CODING UNTIL THIS PLAN IS APPROVED BY THE USER**

---

## Phase 2: Component Implementation

### 2.1 Create/Rewrite Component File
File: `js/components/[ComponentName]Lit.js`

Follow the EXACT structure from COMPONENT_SCHEMA.md:

```javascript
// SECTION 1: IMPORTS
import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';
// ... other imports based on your profile

// SECTION 2: COMPONENT CLASS
/**
 * @component [tagname]
 * @tagname [t-xxx]
 * @description [Clear description]
 * @category [Category from specs]
 * @since 1.0.0
 * @example
 * <[tagname] property="value"></[tagname]>
 */
class [ComponentName]Lit extends LitElement {
  // BLOCK 1: Static Metadata (REQUIRED)
  static tagName = 't-xxx';
  static version = '1.0.0';
  static category = 'Category Name';

  // BLOCK 2: Static Styles (REQUIRED)
  static styles = css`
    /* All component styles here */
  `;

  // BLOCK 3: Reactive Properties (REQUIRED)
  static properties = {
    // Define ALL properties with types, reflect, attribute
  };

  // BLOCK 4: Internal State (if needed)
  // Private properties, tracked state

  // BLOCK 5: Logger (REQUIRED)
  _logger = componentLogger.for('[ComponentName]');

  // BLOCK 6: Constructor
  constructor() {
    super();
    // Initialize default values
    // Initialize private state
  }

  // BLOCK 7: Lifecycle Methods (REQUIRED)
  connectedCallback() {
    super.connectedCallback();
    this._logger.debug('Connected to DOM');
    // Setup work
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._logger.debug('Disconnected from DOM');
    // CRITICAL: Cleanup timers, listeners, etc.
  }

  // BLOCK 8: Public Methods
  // All methods from your spec

  // BLOCK 9: Event Emitters (REQUIRED)
  _emitEvent(name, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true
      })
    );
  }

  // BLOCK 10: Nesting Support (if CONTAINER/FULL profile)
  // discoverNestedComponents(), receiveContext(), etc.

  // BLOCK 11: Form Participation (if FORM profile)
  // ElementInternals setup, getValue(), setValue(), etc.

  // BLOCK 12: Validation (if needed)
  // _validateProperty(), _validateSlot(), etc.

  // BLOCK 13: Render (REQUIRED)
  render() {
    return html`
      <!-- Component template -->
    `;
  }
}

// SECTION 3: REGISTRATION
if (!customElements.get([ComponentName]Lit.tagName)) {
  customElements.define([ComponentName]Lit.tagName, [ComponentName]Lit);
}

// SECTION 4: MANIFEST GENERATION
export const [ComponentName]Manifest = generateManifest([ComponentName]Lit);

// SECTION 5: EXPORTS
export { [ComponentName]Lit };
```

### 2.2 Implement All Required Blocks
Based on your profile, implement:

**All Profiles:**
- ✅ Block 1: Static Metadata
- ✅ Block 2: Static Styles (migrate from old CSS)
- ✅ Block 3: Reactive Properties (with proper decorators)
- ✅ Block 5: Logger
- ✅ Block 7: Lifecycle Methods (with cleanup!)
- ✅ Block 9: Event Emitters
- ✅ Block 13: Render

**FORM/FORM-ADVANCED:**
- ✅ Block 11: Form Participation (getValue, setValue, validation)

**CONTAINER/FULL:**
- ✅ Block 10: Nesting Support (context propagation)

**FULL Profile Only:**
- ✅ Block 4: Internal State Management
- ✅ Block 8: Complete Public API
- ✅ Block 12: Advanced Validation

### 2.3 Critical Requirements

#### Logging
```javascript
_logger = componentLogger.for('[ComponentName]');

connectedCallback() {
  this._logger.debug('Connected to DOM');
}

disconnectedCallback() {
  this._logger.debug('Disconnected from DOM');
}
```

#### Cleanup Pattern (CRITICAL!)
```javascript
disconnectedCallback() {
  super.disconnectedCallback();

  // Clear ALL timers
  this._timers?.forEach(id => clearTimeout(id));
  this._timers?.clear();

  // Remove ALL listeners
  this._documentListeners?.forEach(({event, handler}) => {
    document.removeEventListener(event, handler);
  });
  this._documentListeners?.clear();

  // Cleanup external libs
  this._externalLib?.destroy?.();

  this._logger.debug('Disconnected from DOM');
}
```

#### Event Pattern
```javascript
_emitEvent(name, detail = {}) {
  this.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    })
  );
}

someMethod() {
  this._emitEvent('component-action', {
    value: this.value,
    timestamp: Date.now()
  });
}
```

#### Property Reflection
```javascript
static properties = {
  variant: { type: String, reflect: true },  // Reflects to attribute
  disabled: { type: Boolean, reflect: true }, // Reflects to attribute
  value: { type: String }                     // Does not reflect
};
```

---

## Phase 3: Testing

### 3.1 Create Comprehensive Test File
File: `tests/components/[ComponentName]Lit.test.js`

Follow the test structure from existing tests (TPanelLit.test.js, TColorPicker.test.js).

### 3.2 Required Test Suites (based on profile)

**All Profiles:**
1. **Manifest Completeness** - Validates all properties/methods/events/slots documented
2. **Property Functionality** - Tests all properties work correctly
3. **Method Functionality** - Tests all methods work correctly
4. **Event Functionality** - Tests all events fire correctly with proper detail
5. **Rendering** - Tests component renders all states correctly
6. **Logging** - Tests logger exists and has all methods

**FORM Profile Add:**
7. **Form Participation** - Tests getValue(), setValue(), form integration
8. **Validation** - Tests property and value validation

**CONTAINER/FULL Profile Add:**
9. **Nesting Support** - Tests context propagation, nested discovery

**FULL Profile Add:**
10. **Cleanup Patterns** - Tests memory leak prevention

**BUNDLED-LIB Profile Add:**
11. **Library Integration** - Tests external library setup/cleanup/bridging

### 3.3 Test Requirements

#### Each property must have tests for:
- Default value
- Value assignment
- Attribute reflection (if reflected)
- Type coercion

#### Each method must have tests for:
- Basic functionality
- Return value
- State changes
- Event emission
- Edge cases

#### Each event must have tests for:
- Trigger paths (all ways to fire)
- Detail structure
- bubbles: true
- composed: true

#### Each slot must have tests for:
- Content acceptance
- Rendering
- Validation (if applicable)

### 3.4 Run Tests
```bash
npm run test:run
npm run test:coverage
```

Tests MUST pass with:
- 100% of manifest features tested
- No test failures
- Coverage > 80% for your component

---

## Phase 4: Documentation

### 4.1 Create Component Documentation
File: `docs/components/[ComponentName]Lit.md`

Include:
- Component description
- Usage examples
- All properties with types and defaults
- All methods with parameters and return values
- All events with detail structures
- All slots with accepted content
- Code examples
- Accessibility notes

### 4.2 Update Tests README
Add your component to `tests/README.md` with:
- Test count
- Profile type
- Test suite breakdown
- Coverage stats

---

## Phase 5: Integration & Cleanup

### 5.1 Run Final Verification
```bash
# Run tests
npm run test:run

# Check coverage
npm run test:coverage

# Run in dev mode
npm run dev
```

### 5.2 Manual Testing Checklist
- [ ] Component renders in browser
- [ ] All properties work via attributes and JS
- [ ] All methods work via console
- [ ] All events fire correctly
- [ ] Styles look correct
- [ ] No console errors
- [ ] No memory leaks (check DevTools Memory)
- [ ] Logger works (check console with ?log=DEBUG)
- [ ] Form participation works (if applicable)
- [ ] Nesting works (if applicable)

### 5.3 Create Pull Request
Prepare PR with:
- Branch name: `feature/[component-name]-rewrite`
- Commit message:
  ```
  Rewrite [ComponentName] to be schema-compliant

  - Implement [PROFILE] profile (Blocks 1-X)
  - Add comprehensive test suite (X tests)
  - Achieve X% code coverage
  - Full JSDoc documentation
  - Cleanup patterns for memory safety
  - [Any special features]

  🤖 Generated with Claude Code
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

---

## Reference Examples

### Complete Working Examples
Study these for reference:
- `js/components/TPanelLit.js` - FULL profile example (all 13 blocks)
- `js/components/TColorPicker.js` - BUNDLED-LIB profile example
- `tests/components/TPanelLit.test.js` - Complete test suite (59 tests)
- `tests/components/TColorPicker.test.js` - BUNDLED-LIB tests (52 tests)

### Key Documents
- `docs/COMPONENT_SCHEMA.md` - The law (13-block structure)
- `docs/COMPONENT_SPECIFICATIONS.md` - Component-specific requirements
- `tests/README.md` - Testing philosophy and standards

---

## Common Pitfalls to Avoid

### ❌ DON'T:
- Skip cleanup in disconnectedCallback
- Forget to add logger
- Miss property reflection for attributes
- Forget bubbles: true, composed: true on events
- Skip JSDoc comments
- Copy old DSD patterns
- Use console.log (use logger instead)
- Create memory leaks (timers, listeners)
- Skip test coverage
- Forget to test ALL manifest features

### ✅ DO:
- Follow COMPONENT_SCHEMA.md exactly
- Clean up ALL resources in disconnectedCallback
- Use componentLogger.for() for logging
- Emit events with proper detail structure
- Write comprehensive tests
- Test ALL properties, methods, events, slots
- Achieve >80% coverage
- Document everything with JSDoc
- Follow existing TPanelLit/TColorPicker patterns
- Run tests before committing

---

## Success Criteria

Your component rewrite is complete when:

- ✅ Component follows COMPONENT_SCHEMA.md structure exactly
- ✅ Component matches its profile requirements from COMPONENT_SPECIFICATIONS.md
- ✅ All tests pass (npm run test:run)
- ✅ Coverage >80% for component
- ✅ No memory leaks (timers/listeners cleaned up)
- ✅ Logger implemented and working
- ✅ All events have bubbles: true, composed: true
- ✅ Complete JSDoc documentation
- ✅ Component documentation written
- ✅ Manual testing completed
- ✅ Component works in dev mode
- ✅ Tests added to tests/README.md
- ✅ Ready for PR to main

---

## Questions?

If you encounter issues:
1. Check TPanelLit.js and TColorPicker.js for reference
2. Re-read COMPONENT_SCHEMA.md carefully
3. Verify your profile in COMPONENT_SPECIFICATIONS.md
4. Check existing tests for patterns
5. Ask user for clarification

Remember: **COMPONENT_SCHEMA.md is the law. Follow it exactly.**