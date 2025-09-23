# TerminalTextarea

A multiline text input component with terminal/cyberpunk styling. Perfect for code editors, long-form text input, and configuration editing.

## Tag Name
```html
<terminal-textarea></terminal-textarea>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | string | `''` | Placeholder text |
| `value` | string | `''` | Initial text value |
| `rows` | number | `10` | Number of visible text rows |
| `readonly` | boolean | `false` | Makes textarea read-only |
| `disabled` | boolean | `false` | Disables the textarea |
| `resizable` | boolean | `true` | Allows user to resize the textarea |
| `line-numbers` | boolean | `false` | Shows line numbers for code editor mode |
| `code-editor` | boolean | `false` | Enables code editor mode with IDE shortcuts |
| `min-width` | string | `null` | Minimum width (e.g., '200px') |
| `max-width` | string | `null` | Maximum width (e.g., '800px') |
| `min-height` | string | `null` | Minimum height (e.g., '100px') |
| `max-height` | string | `null` | Maximum height (e.g., '600px') |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `placeholder` | string | Placeholder text |
| `value` | string | Current text value |
| `rows` | number | Number of visible rows |
| `readonly` | boolean | Read-only state |
| `disabled` | boolean | Disabled state |
| `resizable` | boolean | Whether textarea can be resized |
| `lineNumbers` | boolean | Whether line numbers are shown |
| `codeEditor` | boolean | Whether code editor mode is enabled |
| `minWidth` | string | Minimum width constraint |
| `maxWidth` | string | Maximum width constraint |
| `minHeight` | string | Minimum height constraint |
| `maxHeight` | string | Maximum height constraint |

## Methods

### `getValue()`
Gets the current value of the textarea.

**Returns:** `string` - The current text value

```javascript
const textarea = document.querySelector('terminal-textarea');
const text = textarea.getValue();
```

### `setValue(value)`
Sets the value of the textarea.

**Parameters:**
- `value` (string): The text to set

```javascript
textarea.setValue('New content here');
```

### `focus()`
Sets focus to the textarea.

```javascript
textarea.focus();
```

### `blur()`
Removes focus from the textarea.

```javascript
textarea.blur();
```

### `setReadonly(readonly)`
Sets the read-only state.

**Parameters:**
- `readonly` (boolean): Whether textarea should be read-only

```javascript
textarea.setReadonly(true);
```

### `setDisabled(disabled)`
Sets the disabled state.

**Parameters:**
- `disabled` (boolean): Whether textarea should be disabled

```javascript
textarea.setDisabled(true);
```

### `setRows(rows)`
Sets the number of visible rows.

**Parameters:**
- `rows` (number): Number of rows to display

```javascript
textarea.setRows(15);
```

### `selectAll()`
Selects all text in the textarea.

```javascript
textarea.selectAll();
```

### `setLineNumbers(enabled)`
Toggle line numbers display.

**Parameters:**
- `enabled` (boolean): Whether to show line numbers

```javascript
textarea.setLineNumbers(true); // Show line numbers
textarea.setLineNumbers(false); // Hide line numbers
```

### `toggleLineNumbers()`
Toggle line numbers visibility.

**Returns:** `boolean` - The new state of line numbers

```javascript
const isShowingLineNumbers = textarea.toggleLineNumbers();
```

### `setMinWidth(width)`
Set minimum width constraint.

**Parameters:**
- `width` (string): Minimum width (e.g., '200px')

```javascript
textarea.setMinWidth('300px');
```

### `setMaxWidth(width)`
Set maximum width constraint.

**Parameters:**
- `width` (string): Maximum width (e.g., '800px')

```javascript
textarea.setMaxWidth('600px');
```

### `setMinHeight(height)`
Set minimum height constraint.

**Parameters:**
- `height` (string): Minimum height (e.g., '100px')

```javascript
textarea.setMinHeight('200px');
```

### `setMaxHeight(height)`
Set maximum height constraint.

**Parameters:**
- `height` (string): Maximum height (e.g., '600px')

```javascript
textarea.setMaxHeight('500px');
```

## Events

### `input`
Fired when the content changes (on every keystroke).

**Event Detail:**
```javascript
{
  value: string // Current text value
}
```

**Example:**
```javascript
textarea.addEventListener('input', (e) => {
  console.log('Current value:', e.detail.value);
});
```

### `change`
Fired when the textarea loses focus after the value has changed.

**Event Detail:**
```javascript
{
  value: string // Current text value
}
```

**Example:**
```javascript
textarea.addEventListener('change', (e) => {
  console.log('Final value:', e.detail.value);
});
```

### `focus`
Fired when the textarea receives focus.

```javascript
textarea.addEventListener('focus', () => {
  console.log('Textarea focused');
});
```

### `blur`
Fired when the textarea loses focus.

```javascript
textarea.addEventListener('blur', () => {
  console.log('Textarea blurred');
});
```

## CSS Classes

The component applies these classes internally:

- `terminal-textarea` - Base component class
- `textarea` - Applied to the textarea element
- `textarea-resizable` - When resizing is enabled
- `textarea-container` - Container div when in code editor mode
- `with-line-numbers` - Applied when line numbers are visible
- `code-editor-mode` - Applied when in code editor mode without line numbers
- `line-numbers` - Line numbers container
- `textarea-with-lines` - Applied to textarea in code editor mode

## Examples

### Basic Textarea
```html
<terminal-textarea 
  placeholder="Enter your text here..."
  rows="5">
</terminal-textarea>
```

### Pre-filled Textarea
```html
<terminal-textarea 
  value="Initial content goes here"
  rows="8">
</terminal-textarea>
```

### Read-only Textarea
```html
<terminal-textarea 
  value="This content cannot be edited"
  readonly
  rows="5">
</terminal-textarea>
```

### Non-resizable Textarea
```html
<terminal-textarea
  placeholder="Fixed size textarea"
  resizable="false"
  rows="10">
</terminal-textarea>
```

### Code Editor with Line Numbers
```html
<terminal-textarea
  line-numbers
  placeholder="// Enter your code here..."
  rows="15"
  min-height="200px"
  max-height="600px"
  value="function fibonacci(n) {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const temp = curr;
    curr = prev + curr;
    prev = temp;
  }

  return curr;
}">
</terminal-textarea>
```

### Code Editor with IDE Shortcuts
When `code-editor` or `line-numbers` attributes are set, the textarea supports IDE-like keyboard shortcuts:

- **Tab**: Insert tab character or indent selection
- **Shift+Tab**: Outdent current line or selection
- **Enter**: Auto-indent new line based on previous line
- **Ctrl/Cmd + /**: Toggle line comment
- **Ctrl/Cmd + D**: Duplicate current line or selection

```html
<terminal-textarea
  id="codeEditor"
  line-numbers
  placeholder="// Code editor with IDE shortcuts"
  rows="20">
</terminal-textarea>

<script>
  const editor = document.getElementById('codeEditor');

  // Toggle line numbers programmatically
  document.getElementById('toggleBtn').addEventListener('click', () => {
    editor.toggleLineNumbers();
  });
</script>
```

### Code Editor Example
```html
<terminal-textarea 
  id="codeEditor"
  placeholder="// Enter your code here"
  rows="15"
  value="function hello() {
  console.log('Hello, World!');
}">
</terminal-textarea>

<script>
  const editor = document.getElementById('codeEditor');
  
  // Auto-save functionality
  let saveTimeout;
  editor.addEventListener('input', (e) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem('code', e.detail.value);
      console.log('Code auto-saved');
    }, 1000);
  });
  
  // Load saved code
  const savedCode = localStorage.getItem('code');
  if (savedCode) {
    editor.setValue(savedCode);
  }
</script>
```

### Configuration Editor
```html
<terminal-panel mode="with-header" title="Configuration">
  <div slot="content">
    <terminal-textarea 
      id="configEditor"
      placeholder="# Enter configuration..."
      rows="12">
    </terminal-textarea>
    <div style="margin-top: 10px; display: flex; gap: 10px;">
      <terminal-button id="saveConfig" variant="primary">Save</terminal-button>
      <terminal-button id="resetConfig" variant="secondary">Reset</terminal-button>
    </div>
  </div>
</terminal-panel>

<script>
  const configEditor = document.getElementById('configEditor');
  const saveBtn = document.getElementById('saveConfig');
  const resetBtn = document.getElementById('resetConfig');
  
  saveBtn.addEventListener('button-click', () => {
    const config = configEditor.getValue();
    // Save configuration
    console.log('Saving config:', config);
  });
  
  resetBtn.addEventListener('button-click', () => {
    configEditor.setValue('');
    configEditor.focus();
  });
</script>
```

### Form with Textarea
```html
<form id="feedbackForm">
  <terminal-input 
    placeholder="Your name"
    required>
  </terminal-input>
  
  <terminal-textarea 
    id="feedback"
    placeholder="Your feedback..."
    rows="6"
    required>
  </terminal-textarea>
  
  <terminal-button type="submit" variant="primary">
    Submit Feedback
  </terminal-button>
</form>

<script>
  const form = document.getElementById('feedbackForm');
  const feedback = document.getElementById('feedback');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedbackText = feedback.getValue();
    if (feedbackText.trim()) {
      console.log('Feedback submitted:', feedbackText);
      feedback.setValue('');
    }
  });
</script>
```

### Character Counter
```html
<div>
  <terminal-textarea 
    id="message"
    placeholder="Enter your message..."
    rows="4">
  </terminal-textarea>
  <div id="charCount" style="text-align: right; color: var(--terminal-green-dim); font-size: 11px;">
    0 / 280 characters
  </div>
</div>

<script>
  const message = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const maxChars = 280;
  
  message.addEventListener('input', (e) => {
    const length = e.detail.value.length;
    charCount.textContent = `${length} / ${maxChars} characters`;
    
    if (length > maxChars) {
      charCount.style.color = 'var(--terminal-red)';
    } else if (length > maxChars * 0.9) {
      charCount.style.color = 'var(--terminal-yellow)';
    } else {
      charCount.style.color = 'var(--terminal-green-dim)';
    }
  });
</script>
```

### Dynamic Rows
```html
<terminal-textarea 
  id="dynamicTextarea"
  placeholder="This textarea grows as you type..."
  rows="3">
</terminal-textarea>

<script>
  const dynamicTextarea = document.getElementById('dynamicTextarea');
  
  dynamicTextarea.addEventListener('input', (e) => {
    const lines = e.detail.value.split('\n').length;
    const newRows = Math.max(3, Math.min(lines + 1, 20)); // Min 3, max 20 rows
    dynamicTextarea.setRows(newRows);
  });
</script>
```

### Copy to Clipboard
```html
<terminal-textarea 
  id="output"
  value="Some output text here"
  readonly
  rows="5">
</terminal-textarea>
<terminal-button id="copyBtn" variant="secondary">
  Copy to Clipboard
</terminal-button>

<script>
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  
  copyBtn.addEventListener('button-click', async () => {
    output.selectAll();
    try {
      await navigator.clipboard.writeText(output.getValue());
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
</script>
```

## Styling Variables

The component uses these CSS variables (defined in form.css):

```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--terminal-black: #0a0a0a;
--font-mono: 'SF Mono', 'Monaco', monospace;
--font-size-sm: 11px;
--spacing-sm: 8px;
--spacing-md: 12px;
```

## Textarea Specifications

- Font: Monospace (inherits from terminal theme)
- Default rows: 10
- Min-height: Based on rows
- Resize: Vertical only (when enabled)
- Background: Dark terminal background
- Border: Green terminal border
- Focus: Green glow effect
- Disabled: 50% opacity
- Read-only: Lighter background

## Accessibility

- Supports keyboard navigation
- Tab order compliant
- Proper disabled and readonly states
- Label association support
- Screen reader compatible
- Standard textarea keyboard shortcuts (Ctrl+A, etc.)

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+