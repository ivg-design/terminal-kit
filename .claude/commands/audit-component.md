You are auditing a component for compliance with docs/COMPONENT_SCHEMA.md and docs/COMPONENT_SPECIFICATIONS.md.

# Instructions

1. **Read the component file** provided by the user (e.g., js/components/TPanelLit.js)
2. **Read the test file** (same path with .test.js extension)
3. **Read docs/COMPONENT_SCHEMA.md** to understand the 13-block structure requirements
4. **Read docs/COMPONENT_SPECIFICATIONS.md** to find this component's specification

# Audit Checklist

## Step 1: Identify Profile
Determine which profile from COMPONENT_SPECIFICATIONS.md:
- CORE (basic components)
- FORM (form controls with validation)
- FORM-ADVANCED (form with ElementInternals)
- CONTAINER (components with nesting)
- DISPLAY (simple display-only)
- BUNDLED-LIB (iro.js)
- FULL (complex multi-featured)

## Step 2: Check 13-Block Structure

**Block 1: Static Metadata**
- [ ] tagName, version, category present

**Block 2: Static Styles**
- [ ] static styles = css\`\` present
- [ ] :host selector used
- [ ] CSS variables for theming

**Block 3: Reactive Properties**
- [ ] All spec properties present
- [ ] @property decorators
- [ ] JSDoc with @property, @default, @attribute, @reflects

**Block 4: Internal State**
- [ ] Private properties prefixed with _
- [ ] JSDoc @private tags

**Block 5: Logger Instance**
- [ ] _logger = null
- [ ] JSDoc @private

**Block 6: Constructor**
- [ ] super()
- [ ] this._logger = new ComponentLogger(tagName, this)
- [ ] this._logger.debug('Component constructed')

**Block 7: Lifecycle Methods** (in order)
- [ ] connectedCallback() with this._logger.info('Connected to DOM')
- [ ] disconnectedCallback() with this._logger.info('Disconnected from DOM')
- [ ] firstUpdated() with this._logger.debug('First update complete')
- [ ] updated() with this._logger.trace('Updated')

**Block 8: Public API Methods**
- [ ] All spec methods present
- [ ] JSDoc @public, @param, @returns, @throws, @fires
- [ ] Logger debug calls at entry

**Block 9: Event Emitters**
- [ ] _emitEvent() helper
- [ ] JSDoc @event for each event
- [ ] Events match spec

**Block 10: Nesting Support** (if CONTAINER/FULL)
- [ ] _registerNestedComponent()
- [ ] _discoverNestedComponents()
- [ ] _propagateContext()
- [ ] receiveContext()

**Block 11: Validation** (if FORM/FULL)
- [ ] _validateProperty()
- [ ] static getPropertyValidation()
- [ ] _validateSlotContent()
- [ ] static getSlotValidation()

**Block 12: Render Method**
- [ ] render()
- [ ] Logger trace call
- [ ] JSDoc @returns, @slot

**Block 13: Private Helpers**
- [ ] Helpers at end
- [ ] JSDoc @private

## Step 3: Check Special Patterns

Based on spec, verify:
- [ ] **Timer Cleanup** - _timers Set, wrappers, cleanup in disconnectedCallback
- [ ] **Document Listeners** - _documentListeners Map, wrappers, cleanup
- [ ] **Animation State** - _isAnimating, _animationFrame, cleanup
- [ ] **Form Participation** - formAssociated, _internals, setFormValue()
- [ ] **Bundled Library** - Instance in Block 4, init in firstUpdated(), cleanup
- [ ] **Nesting** - _nestedComponents Set, discovery, context propagation

## Step 4: Check Test File

Verify required test suites based on profile:
- [ ] Properties (always)
- [ ] Rendering (always)
- [ ] Logging (always)
- [ ] Methods (if has public methods)
- [ ] Events (if has events)
- [ ] Validation (if FORM/FULL)
- [ ] Nesting (if CONTAINER/FULL)
- [ ] Form Participation (if FORM-ADVANCED)
- [ ] Library Integration (if BUNDLED-LIB)

## Step 5: Check Registration
- [ ] customElements.define(tagName, ClassName)
- [ ] Check for existing registration
- [ ] export default ClassName

# Output Format

Provide a report with:

```
# Audit Report: [Component Name]

**Profile:** [Profile]
**Compliance Score:** [X/100]

## ✅ Passing ([X] items)
- ✅ Block 1: Static Metadata present
[list all passing]

## ❌ Failing ([X] items)
- ❌ Block 5: Logger not initialized in constructor
  **Line:** XX
  **Fix:** Add `this._logger = new ComponentLogger(tagName, this)` after super()
[list all failing with line numbers and specific fixes]

## ⚠️ Warnings ([X] items)
- ⚠️ Missing logger call in publicMethod()
  **Line:** XX
  **Suggestion:** Add `this._logger.debug('methodName called')`
[list all warnings]

## 📊 Breakdown
| Category | Score | Status |
|----------|-------|--------|
| Block Structure | XX/13 | [✅/❌] |
| JSDoc Coverage | XX/XX | [✅/❌] |
| Special Patterns | XX/XX | [✅/❌] |
| Test Coverage | XX/XX | [✅/❌] |

## 📝 Priority Fixes
1. [High priority fix with code example]
2. [Medium priority fix]
3. [Low priority improvement]

## Summary
[2-3 sentence summary of compliance status]
```

Be thorough, provide specific line numbers, and give actionable fixes.