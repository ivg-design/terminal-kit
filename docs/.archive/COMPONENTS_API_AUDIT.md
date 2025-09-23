# Terminal UI Components — Implementation vs Docs Audit

This document reviews the terminal‑styled component library, comparing implementations in `js/components` and `css/components` against the documented API in `docs/components`, with spot checks against demos in `demos/`. It highlights mismatches, missing pieces, and suggested fixes.

## Status Update (2025-09-16)

- TerminalInput: Resolved. Observes/forwards standard attributes (`name`, `required`, `pattern`, `minlength`, `maxlength`, `min`, `max`, `step`, `autocomplete`, `label`, `helper-text`, `success`), adds `input-enter` and `input-clear` for search.
  - Demo behavior: Updated input.html to validate email/URL on blur or Enter (not per keystroke). Fixed input focus loss by avoiding re-render on keystrokes (no attribute write in `handleInput`).
- TerminalSlider: Partially resolved. Events now match docs (`slider-input` during drag; both events include `{ value, percentage }`). CSS class names in docs (e.g., `terminal-slider-container`, `slider-progress`) still differ from implementation (`terminal-slider`, `.slider-track-fill`, etc.).
- TerminalModal: Resolved. `visible` is now in `observedAttributes` and toggles show/hide.
- TerminalToggle: Resolved. Emits native `change` (bubbling) in addition to `toggle-change`; docs include both patterns.
- TerminalComponent (Docs vs Code): Partially resolved. `addListener` now accepts `options`, aligning with docs; internals still use `_listeners` Map (docs mention `_eventListeners` and `_mounted`).
- TerminalStatusField: Resolved. New docs added at `docs/components/terminal-status-field.md`.
- TerminalDropdown: Unresolved minor. Docs mention ~2s delay before marquee; implementation starts marquee immediately after close.

The sections below reflect the original audit with notes on current status where applicable.

## Overall Summary

- Most components are implemented and documented consistently.
- Biggest drift: `TerminalInput` (docs list many attributes/events not wired in the component) and `TerminalSlider` (event payload names and missing `slider-input`).
- `TerminalModal` is missing a documented attribute (`visible`) from observed attributes.
- `TerminalToggle` docs describe native `change` semantics; implementation uses a custom event.
- `TerminalComponent` base class docs are out of sync with actual property/method names.
- An extra component (`TerminalStatusField`) exists but lacks docs.
- A few demo usages rely on attributes that aren’t forwarded to inner elements (notably in `TerminalInput`).

---

## Component Reviews

### TerminalComponent

- Mismatch: Docs list protected fields `_eventListeners` (Array) and `_mounted`; implementation uses `_listeners` (Map), `_initialized` (unused), and no `_mounted`.
- Mismatch: Docs say `addListener(element, event, handler, options)`; implementation signature is `addListener(element, event, handler)` (no options).
- OK: Lifecycle and general shape match (connected, disconnected, attributeChanged, render/template/afterRender hooks).
- Suggestion: Update docs to reflect `_listeners: Map`, and that `addListener` doesn’t accept options (or add options support in code).

### TerminalButton

- Matches docs well: attributes (variant, type, size, disabled, loading, loader-type, loader-color, icon, toggle-state, icon-on/off, color-on/off), events (`button-click`, `toggle-change` with `{state}`), and methods.
- Minor: Loader sizing in loading mode is effectively “small” for `xs/small`; consider noting in docs.
- Accessibility: Consider adding `aria-pressed` for toggle variant (docs mention ARIA support).

### TerminalColorPicker

- Consistent with docs: attributes, methods (`getValue`, `setValue`, `setLabels`, `setIcon`, `reset`, `disable`, `enable`), events (`color-change`, `color-save`, `swatches-updated`), and Pickr config.
- Good: Emits `swatches-updated` from `saveCustomSwatches()` to support external storage (as docs show with Supabase).

### TerminalDropdown

- Largely consistent: attributes (`placeholder`, `disabled`, `value`, `width`, `search`, `icons`), methods (`loadData`, `setMetadata`, `getValue`, `setValue`, `getMetadata`, `reset`, `disable`, `enable`, `expandAll`, `collapseAll`, `setWidth`, `setOptions`, `setSearch`, `setIcons`), and event (`dropdown-change`).
- Mismatch: Docs say marquee for long filenames starts ~2s after selection; implementation adds marquee immediately after close (no delay). Either document immediate behavior or add the delay.

### TerminalDynamicControls

- Matches docs: supports control types (number, color, dropdown, text, trigger, boolean, group), schema format, and events (`control-change`, `control-trigger`, `group-toggle`).
- Not in docs (but in code):
  - Value APIs: `getValues`, `setValues`, `resetValues`.
  - Collapse/expand APIs: `collapseGroup`, `expandGroup`, `collapseAll`, `expandAll`.
- Suggestion: Extend docs to include these APIs, indentation behavior, and that color control syncs hex text and color input.

### TerminalInput

- Major drift vs docs:
  - Docs list many attributes not observed/forwarded: `success`, `helper-text`, `name`, `required`, `pattern`, `minlength`, `maxlength`, `min`, `max`, `step`, `autocomplete`, and input types like `search`, `date`, `time`, `datetime-local`.
  - Implementation observes only: `type`, `placeholder`, `value`, `disabled`, `readonly`, `error`, `icon`.
  - No attribute‑to‑inner `<input>` mapping for `min`, `max`, `step`, `maxlength`, etc.
  - Docs events include `input-enter`, `input-clear` (search) — implementation emits `input-value`, `input-change`, `input-focus`, `input-blur`; no `input-enter`, no search‑clear behavior.
  - Docs mention label and helper text; component supports `label` via prop (not observed attr), and there’s no built‑in helper text rendering.
- Demos use attributes like `min/max/required/maxlength` on `<terminal-input>`, which aren’t forwarded, so browser validation won’t work unless scripts directly touch the internal `<input>` (the demo does this workaround).
- Suggestions:
  - Option A (code): Observe and forward standard input attributes (`name`, `required`, `maxlength`, `min`, `max`, `step`, `autocomplete`, etc.), add `input-enter`, and optional search clear.
  - Option B (docs): Tighten docs to current capabilities and show external validation patterns.
  - At minimum, wire through common attributes and add a `label` observed attribute to match docs.

### TerminalLoader

- Matches docs: attributes, methods, and events (`loader-start`, `loader-show`, `loader-hide`).

### TerminalModal

- Matches docs on layout modes, size, title, closing behavior, programmatic `show/hide/close/toggle`, replaceable slot content, and events (`modal-show`, `modal-hide`, `modal-before-close`, `modal-close`).
- Mismatch: Docs list a `visible` attribute, but it’s not observed; setting `visible` in HTML won’t open the modal. `onMount` checks `visible` only to set initial state.
- Suggestions: Add `visible` to `observedAttributes` and toggle via attribute, or remove `visible` from docs and emphasize programmatic control.

### TerminalPanel

- Matches docs: modes (`with-header`, `headless`, `with-status-bar`), attributes, collapse behavior, compact headers, events (`panel-collapsed`, `panel-expanded`), content slots, and helper methods like `expandWithParents` and `toggleWithVisibility`.
- Note: `_handleModeChange` warns about content loss on mode switch — worth documenting explicitly.

### TerminalSlider

- Mismatches vs docs:
  - Events: Docs say `slider-change` emits `{ value, percentage }` and a `slider-input` exists for real‑time updates. Implementation emits `slider-change` with `{ value, oldValue }`; no `percentage`, no `slider-input`.
  - CSS classes: Docs reference container classes like `terminal-slider-container`, `slider-header`, `slider-progress`; implementation uses `terminal-slider`, `.slider-track-fill`, `.slider-thumb`, etc.
- Other features (icon/icon-size, variants `with-input` and `value-in-thumb`, ticks, smooth mode) are implemented and align conceptually.
- Suggestions: Either update events to match docs (add `percentage` and emit `slider-input` during drag), or update docs to current payload. Sync CSS class names or note the current structure in docs.

### TerminalStatusBar

- Consistent with docs: `separator` attribute; methods (`setFields`, `addField`, `updateField`, `removeField`, `clearFields`, `setSeparator`, `updateFieldValue`, `updateFieldLabel`, `enableFieldMarquee`, `disableFieldMarquee`); marquee behavior implemented with width locking.

### TerminalStatusField

- Implemented (`js/components/TerminalStatusField.js`) but no doc page.
- Suggestion: Add minimal docs (tag `<terminal-status-field>`, attributes `label`, `value`, methods `setLabel`, `setValue`) or mark as internal.

### TerminalToast

- Matches docs: attributes, instance methods, global manager with queue/positioning, events (`toast-show`, `toast-dismiss`, `toast-click`).

### TerminalToggle

- Mismatches vs docs:
  - Docs describe standard `change` event/form semantics; implementation emits custom `toggle-change` with `{ checked, oldValue }`. No native `change` is fired.
  - Docs show form integration using `name` and imply form posting; component is not a form‑associated custom element and won’t post values by default.
  - Docs show `setIcon(icon, state)`; implementation has `setIcon(iconSvg)` and attributes `on-icon`/`off-icon` for switching.
- Other features (layouts, sizes, checkbox variant with error, equal-states) match.
- Suggestions: Either also emit native `change` on state changes (and clarify form behavior), or update docs to prefer `toggle-change`. Consider a `setIcons(on, off)` method if needed.

### TerminalTreeView / TerminalTreeNode

- Consistent with docs: attributes, selection/expand events/APIs, `setData`, traversal helpers, and keyboard navigation. The TreeView doc includes node APIs that exist in `TerminalTreeNode`.

---

## Demos Notes

- Input demo uses attributes (`min`, `max`, `required`, `maxlength`) that aren’t forwarded to the inner `<input>`. Scripts then query the inner input to manipulate validity — a workaround.
  - Suggest aligning the component to support forwarding of these attributes or adjusting the demo/docs to emphasize component‑side validation APIs.
- Other demos align with component behavior (sliders, dropdowns, color picker, status bar, tree, panels, toast, toggles).

---

## Recommended Fixes (Prioritized)

1. TerminalInput
   - Observe/forward standard input attributes (`name`, `required`, `maxlength`, `min`, `max`, `step`, `autocomplete`, etc.).
   - Add `input-enter` event; optionally add search clear behavior if keeping `search`.
   - Or tighten docs to current capabilities (with examples for external validation).

2. TerminalSlider
   - Align events to docs by adding `percentage` and a live `slider-input` event, or update docs to reflect `{ value, oldValue }` only.
   - Sync CSS class naming in docs with current DOM (or update DOM to match docs).

3. TerminalModal
   - Add `visible` to `observedAttributes` and toggle visibility on attribute change; or remove `visible` from docs and emphasize programmatic API.

4. TerminalToggle
   - Emit a native `change` event in addition to `toggle-change`, and clarify form semantics in docs; consider `setIcons(on, off)` API.

5. TerminalComponent (Docs)
   - Update internals to match code (`_listeners` Map, no `options` param for `addListener`).

6. TerminalStatusField
   - Add a small doc page or mark it as internal.

7. TerminalDropdown (Docs)
   - Update marquee timing note (immediate vs 2s delay) or add the delay in code.

---

## Next Steps (If We Want to Patch Code)

- Implement attribute forwarding and `input-enter` in `TerminalInput`.
- Add `slider-input` events during drag and include `percentage` in payloads.
- Observe `visible` in `TerminalModal` and toggle via attribute.
- Emit native `change` in `TerminalToggle` along with `toggle-change`.
- Update docs to reflect any chosen approach (code changes vs documentation alignment).

- TerminalInput: forward standard input attrs; add `input-enter`; docs update.
- TerminalSlider: emit `slider-input` during drag; add `percentage` in payload o
r update docs.
- TerminalModal: observe `visible` or remove it from docs.
- TerminalToggle: emit native `change` in addition to `toggle-change`; clarify f
orm semantics.
- TerminalComponent docs: reflect `_listeners` Map and current `addListener` sig
nature.
- Add docs for `TerminalStatusField` or mark internal.
 Event consistency
  - Bold naming: standardize to kebab-case (already used), keep `bubbles: true`,
 `composed: true` where crossing boundaries is needed.
  - Payloads: define stable schemas and add missing fields (e.g., `TerminalSlide
r` add `percentage`; `TerminalToggle` add native `change`).
- Base-class polish
  - `addListener` options: support `{ once, passive, capture, signal }`.
  - Return unsubscribe: keep your key, but export an `off(key)` alias for clarit
y.
  - Typings/consts: export event name constants and TypeScript interfaces in a `
events.d.ts` file.
- Docs alignment
  - Update event tables to reflect actual names + payloads; add examples that at
tach at container/document level.
