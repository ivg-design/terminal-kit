# TTextareaLit Component

**Tag:** `<t-textarea>`
**Category:** Form Controls
**Profile:** FORM-ADVANCED
**Version:** 1.0.0

## Tag Names

- `t-textarea`

## Description

Multiline text input component with advanced code editor features including line numbers, IDE keyboard shortcuts, and text manipulation capabilities. Follows the FORM-ADVANCED profile with full form participation via ElementInternals API.

## Features

- ✅ Basic multiline text input with all standard attributes
- ✅ Form participation with ElementInternals API
- ✅ Code editor mode with IDE keyboard shortcuts
- ✅ Optional line numbers display
- ✅ Auto-indent on Enter key
- ✅ Tab/Shift+Tab for indent/outdent
- ✅ Ctrl/Cmd+D for duplicate line
- ✅ Syntax highlighting via Prism.js (when `language` attribute is set)
- ✅ Resizable textarea (configurable via `resize` attribute)
- ✅ Maxlength validation
- ✅ Disabled and readonly states
- ✅ Custom scrollbar styling
- ✅ Full event system (input, change, focus, blur)

## Usage

### Basic Textarea

```html
<t-textarea
  placeholder="Enter your text here..."
  rows="5">
</t-textarea>
```

### With Pre-filled Content

```html
<t-textarea
  value="This is pre-filled content.
Multiple lines supported."
  rows="8">
</t-textarea>
```

### Code Editor Mode

```html
<t-textarea
  code-mode
  show-line-numbers
  placeholder="// Enter code here..."
  rows="15">
</t-textarea>
```

### With Syntax Highlighting

```html
<!-- Requires Prism.js to be loaded globally -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>

<t-textarea
  code-mode
  show-line-numbers
  language="javascript"
  rows="15">
</t-textarea>
```

### With Validation

```html
<t-textarea
  placeholder="Max 500 characters"
  maxlength="500"
  required
  rows="6">
</t-textarea>
```

### Read-only

```html
<t-textarea
  value="This content cannot be edited"
  readonly
  rows="4">
</t-textarea>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | String | `''` | Placeholder text shown when empty |
| `value` | String | `''` | Current textarea value |
| `rows` | Number | `4` | Number of visible text rows |
| `disabled` | Boolean | `false` | Disables the textarea |
| `readonly` | Boolean | `false` | Makes textarea read-only |
| `required` | Boolean | `false` | Marks field as required for forms |
| `maxlength` | Number | `null` | Maximum character length (validated) |
| `codeMode` | Boolean | `false` | Enables code editor features with IDE shortcuts |
| `showLineNumbers` | Boolean | `false` | Shows line numbers (only visible when true) |
| `resize` | String | `'both'` | CSS resize behavior: `'both'`, `'horizontal'`, `'vertical'`, `'none'` |
| `language` | String | `null` | Programming language for syntax highlighting via Prism.js (e.g., `'javascript'`, `'css'`, `'html'`, `'json'`) |

### Property Details

#### `value`
- Controls the textarea content
- Updates on every keystroke
- Syncs with form value via ElementInternals
- Can be set programmatically via `setValue()`

#### `codeMode`
- Enables IDE keyboard shortcuts
- Sets `tab-size: 4` for proper tab rendering
- Activates advanced text manipulation features

#### `showLineNumbers`
- Displays line numbers in left gutter
- Auto-updates line count as content changes
- Gutter width adjusts to line count

#### `maxlength`
- Validates on property change
- Must be positive number or null
- Logs warning if validation fails

#### `resize`
- Controls CSS resize behavior of the textarea
- Valid values: `'both'`, `'horizontal'`, `'vertical'`, `'none'`
- In code-mode, resize is disabled on the textarea but the container is resizable
- Disabled and readonly states force resize to `'none'`

#### `language`
- Enables syntax highlighting via Prism.js
- Supported languages: `'javascript'`, `'typescript'`, `'css'`, `'html'`, `'json'`, `'markup'`, `'plaintext'`, `'none'`
- Requires Prism.js to be loaded globally (window.Prism)
- When set, textarea text becomes transparent and highlighting layer shows on top
- Falls back to plain text if grammar not found

## Methods

### `setValue(value: string): void`

Set the textarea value programmatically.

```javascript
const textarea = document.querySelector('t-textarea');
textarea.setValue('New content\nMultiple lines');
```

**Parameters:**
- `value` (string): New textarea content

**Updates:**
- Component value property
- ElementInternals form value
- Line numbers count

---

### `getValue(): string`

Get the current textarea value.

```javascript
const textarea = document.querySelector('t-textarea');
const content = textarea.getValue();
console.log(content); // Returns current value
```

**Returns:** Current textarea value as string

---

### `focus(): void`

Focus the textarea programmatically.

```javascript
const textarea = document.querySelector('t-textarea');
textarea.focus();
```

**Fires:** `textarea-focus` event

---

### `blur(): void`

Blur the textarea programmatically.

```javascript
const textarea = document.querySelector('t-textarea');
textarea.blur();
```

**Fires:** `textarea-blur` event

---

### `selectAll(): void`

Select all text in the textarea.

```javascript
const textarea = document.querySelector('t-textarea');
textarea.selectAll();
```

---

### `clear(): void`

Clear the textarea value (sets value to empty string).

```javascript
const textarea = document.querySelector('t-textarea');
textarea.clear();
```

**Fires:** `textarea-input` event with empty value

---

### `receiveContext(context: Object): void`

Receive context from a parent component for nesting support.

```javascript
const textarea = document.querySelector('t-textarea');
textarea.receiveContext({ theme: 'dark', size: 'large' });
```

**Parameters:**
- `context` (Object): Context object from parent component

---

### `getContext(): Object`

Get the current context received from parent.

```javascript
const textarea = document.querySelector('t-textarea');
const ctx = textarea.getContext();
console.log(ctx); // { theme: 'dark', size: 'large' }
```

**Returns:** Current context object or null if none set

## Events

### `textarea-input`

Fires on every keystroke (continuous input).

**Detail:**
```typescript
{
  value: string  // Current textarea value
}
```

**Example:**
```javascript
textarea.addEventListener('textarea-input', (e) => {
  console.log('Current value:', e.detail.value);
});
```

---

### `textarea-change`

Fires when textarea loses focus (blur).

**Detail:**
```typescript
{
  value: string  // Final textarea value
}
```

**Example:**
```javascript
textarea.addEventListener('textarea-change', (e) => {
  console.log('Final value:', e.detail.value);
  saveToDatabase(e.detail.value);
});
```

---

### `textarea-focus`

Fires when textarea gains focus.

**Detail:**
```typescript
{} // Empty detail object
```

**Example:**
```javascript
textarea.addEventListener('textarea-focus', () => {
  console.log('Textarea focused');
});
```

---

### `textarea-blur`

Fires when textarea loses focus.

**Detail:**
```typescript
{} // Empty detail object
```

**Example:**
```javascript
textarea.addEventListener('textarea-blur', () => {
  console.log('Textarea blurred');
});
```

## Code Editor Keyboard Shortcuts

When `code-mode` is enabled, the following IDE shortcuts are available:

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Tab** | Indent | Inserts tab or indents selected lines |
| **Shift+Tab** | Outdent | Removes indentation from current/selected lines |
| **Enter** | Auto-indent | New line with same indentation as previous |
| **Ctrl/Cmd+D** | Duplicate Line | Duplicates the current line below |

### Keyboard Shortcut Examples

#### Tab Indentation
```javascript
// Before (cursor at start of line):
function example() {

// Press Tab:
function example() {

```

#### Multi-line Indent
```javascript
// Before (select multiple lines):
const x = 1;
const y = 2;

// Press Tab:
	const x = 1;
	const y = 2;
```

#### Duplicate Line
```javascript
// Before (cursor on line):
console.log('Hello');

// Press Ctrl+D or Cmd+D:
console.log('Hello');
console.log('Hello');
```

## Form Participation

The component implements the ElementInternals API for native form integration.

### Form Example

```html
<form id="myForm">
  <label>
    Description
    <t-textarea
      name="description"
      required
      maxlength="500"
      rows="6">
    </t-textarea>
  </label>

  <button type="submit">Submit</button>
</form>

<script>
  const form = document.getElementById('myForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const description = formData.get('description');
    console.log('Description:', description);
  });
</script>
```

### Form Value Access

```javascript
// Via ElementInternals
const textarea = document.querySelector('t-textarea');
const value = textarea.getValue();

// Via form data
const form = document.querySelector('form');
const formData = new FormData(form);
const value = formData.get('description');
```

## Styling

The component uses CSS custom properties for theming:

```css
t-textarea {
  --terminal-gray-dark: #242424;    /* Background */
  --terminal-gray-light: #333333;   /* Border */
  --terminal-green: #00ff41;        /* Text color */
  --terminal-green-dim: #00cc33;    /* Scrollbar */
  --font-mono: 'SF Mono', monospace; /* Font */
  --font-size-sm: 11px;             /* Font size */
}
```

### Custom Scrollbar

The textarea includes custom scrollbar styling:

- **Width:** 8px
- **Track:** Dark gray with border
- **Thumb:** Terminal green with hover effect
- **Resizer:** Terminal green gradient in corner

## Examples

### Character Counter

```html
<t-textarea id="limited" maxlength="280" rows="6"></t-textarea>
<div id="counter">0 / 280 characters</div>

<script>
  const textarea = document.getElementById('limited');
  const counter = document.getElementById('counter');

  textarea.addEventListener('textarea-input', (e) => {
    const length = e.detail.value.length;
    counter.textContent = `${length} / 280 characters`;

    if (length > 280) {
      counter.style.color = 'red';
    }
  });
</script>
```

### Auto-growing Textarea

```html
<t-textarea id="auto" rows="3"></t-textarea>

<script>
  const textarea = document.getElementById('auto');

  textarea.addEventListener('textarea-input', (e) => {
    const lines = e.detail.value.split('\n').length;
    const newRows = Math.max(3, Math.min(lines + 1, 15));
    textarea.rows = newRows;
  });
</script>
```

### Code Editor with Syntax Highlighting

```html
<t-textarea
  id="codeEditor"
  code-mode
  show-line-numbers
  rows="15">
</t-textarea>

<script>
  const editor = document.getElementById('codeEditor');

  // Load initial code
  editor.setValue(`function fibonacci(n) {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const temp = curr;
    curr = prev + curr;
    prev = temp;
  }

  return curr;
}`);

  // Save on change
  editor.addEventListener('textarea-change', (e) => {
    localStorage.setItem('code', e.detail.value);
  });
</script>
```

## Accessibility

The component follows accessibility best practices:

- ✅ Native `<textarea>` element with proper semantics
- ✅ Supports `required` attribute for form validation
- ✅ Supports `disabled` and `readonly` states
- ✅ Proper focus management
- ✅ Keyboard shortcuts don't interfere with screen readers
- ✅ Line numbers are decorative (not read by screen readers)

## Browser Support

- ✅ Chrome/Edge 119+
- ✅ Firefox 120+
- ✅ Safari 17+
- ⚠️ ElementInternals requires modern browsers

### Polyfills

For older browsers, include:

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs"></script>
```

## Migration from Old TTextarea

### Old (DSD Architecture)

```html
<terminal-textarea
  line-numbers
  code-editor
  rows="10">
</terminal-textarea>

<script>
  const textarea = document.querySelector('terminal-textarea');
  textarea.getValue();
  textarea.setValue('New value');
  textarea.toggleLineNumbers();
</script>
```

### New (Lit Architecture)

```html
<t-textarea
  show-line-numbers
  code-mode
  rows="10">
</t-textarea>

<script>
  const textarea = document.querySelector('t-textarea');
  textarea.getValue();
  textarea.setValue('New value');

  // Toggle line numbers
  textarea.showLineNumbers = !textarea.showLineNumbers;
</script>
```

### Key Changes

| Old | New | Notes |
|-----|-----|-------|
| `line-numbers` | `show-line-numbers` | Boolean attribute |
| `code-editor` | `code-mode` | Boolean attribute |
| `toggleLineNumbers()` | `showLineNumbers = !showLineNumbers` | Use property |
| `setRows()` | `rows = n` | Use property |
| `terminal-textarea` | `t-textarea` | Shorter tag name |

## Testing

The component has 9 comprehensive test suites covering:

1. **Manifest Completeness** - Validates manifest structure
2. **Property Functionality** - Tests all 9 properties
3. **Method Functionality** - Tests all 4 methods
4. **Event Functionality** - Tests all 4 events with detail
5. **Form Participation** - ElementInternals integration
6. **Validation** - Maxlength validation
7. **Rendering** - Visual states and DOM structure
8. **Code Editor Mode** - IDE keyboard shortcuts
9. **Logging** - Logger instance and methods

**Total Tests:** 70+
**Coverage:** >85%

Run tests:

```bash
npm run test:run
npm run test:coverage
```

## Performance

- ✅ Minimal re-renders (only on property changes)
- ✅ Efficient line number updates (only when line count changes)
- ✅ Debounced input events
- ✅ Shadow DOM encapsulation prevents style leaks
- ✅ No memory leaks (proper cleanup)

## Known Limitations

- Line numbers don't support custom formatting
- Code mode shortcuts are JavaScript-centric (`//` comments)
- Syntax highlighting requires Prism.js to be loaded globally (`window.Prism`)
- Keyboard shortcuts only work when `code-mode` is enabled
- Toggle comment shortcut (`Ctrl/Cmd+/`) is documented but not implemented in the component

## Troubleshooting

### Line numbers not showing

**Solution:** Set `show-line-numbers` attribute:

```html
<t-textarea show-line-numbers></t-textarea>
```

### Keyboard shortcuts not working

**Solution:** Enable `code-mode`:

```html
<t-textarea code-mode></t-textarea>
```

### Form value not submitting

**Solution:** Ensure `name` attribute is set:

```html
<t-textarea name="description"></t-textarea>
```

### Value not updating

**Solution:** Use `setValue()` method, not direct attribute:

```javascript
// ❌ Don't do this
textarea.setAttribute('value', 'New value');

// ✅ Do this instead
textarea.setValue('New value');
```

## See Also

- [t-inp](./TInputLit.md) - Single-line text input
- [t-tog](./TToggleLit.md) - Toggle/checkbox control
- [t-drp](./TDropdownLit.md) - Dropdown select

---

**Component Status:** ✅ Production Ready
**Last Updated:** 2025-09-28
**Follows:** COMPONENT_SCHEMA.md FORM-ADVANCED profile

## Slots

None.

