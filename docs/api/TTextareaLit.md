# TTextareaLit Component API Documentation

## Overview

`TTextareaLit` is an advanced multiline text input component with code editor features, including syntax highlighting, line numbers, and IDE keyboard shortcuts. It extends standard HTML textarea functionality with Terminal Kit's distinctive design system.

**Tag Name:** `<t-textarea>`
**Category:** Form Controls
**Profile:** FORM-ADVANCED
**Version:** 1.0.0
**Import:** `js/components/TTextareaLit.js`

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Properties](#properties)
3. [Methods](#methods)
4. [Events](#events)
5. [Styling](#styling)
6. [Code Editor Features](#code-editor-features)
7. [Syntax Highlighting](#syntax-highlighting)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Form Integration](#form-integration)
10. [Examples](#examples)

## Basic Usage

### Simple Textarea
```html
<t-textarea
  placeholder="Enter your message..."
  rows="5">
</t-textarea>
```

### Code Editor Mode
```html
<t-textarea
  code-mode
  show-line-numbers
  language="javascript"
  rows="15">
</t-textarea>
```

### Read-only Textarea
```html
<t-textarea
  readonly
  value="This content cannot be edited">
</t-textarea>
```

## Properties

### Core Properties

#### `placeholder`
- **Type:** `String`
- **Default:** `''`
- **Reflects:** `true`
- **Description:** Placeholder text displayed when textarea is empty
- **Example:**
```html
<t-textarea placeholder="Enter description..."></t-textarea>
```

#### `value`
- **Type:** `String`
- **Default:** `''`
- **Reflects:** `false`
- **Description:** Current value of the textarea
- **Fires:** `textarea-input` event on change
- **Example:**
```html
<t-textarea value="Initial content"></t-textarea>
```
```javascript
// Set programmatically
const textarea = document.querySelector('t-textarea');
textarea.value = 'New content';
```

#### `rows`
- **Type:** `Number`
- **Default:** `4`
- **Reflects:** `true`
- **Validation:** Must be between 1 and 50
- **Description:** Number of visible text lines
- **Example:**
```html
<t-textarea rows="10"></t-textarea>
```

### State Properties

#### `disabled`
- **Type:** `Boolean`
- **Default:** `false`
- **Reflects:** `true`
- **Description:** Disables the textarea
- **Example:**
```html
<t-textarea disabled></t-textarea>
```

#### `readonly`
- **Type:** `Boolean`
- **Default:** `false`
- **Reflects:** `true`
- **Description:** Makes textarea read-only
- **Example:**
```html
<t-textarea readonly value="Read-only content"></t-textarea>
```

#### `required`
- **Type:** `Boolean`
- **Default:** `false`
- **Reflects:** `true`
- **Description:** Marks field as required for form submission
- **Example:**
```html
<form>
  <t-textarea required></t-textarea>
</form>
```

### Validation Properties

#### `maxlength`
- **Type:** `Number`
- **Default:** `null`
- **Reflects:** `true`
- **Validation:** Must be positive integer
- **Description:** Maximum number of characters allowed
- **Example:**
```html
<t-textarea maxlength="500"></t-textarea>
```

### Appearance Properties

#### `resize`
- **Type:** `String`
- **Default:** `'vertical'`
- **Reflects:** `true`
- **Values:** `'both'` | `'horizontal'` | `'vertical'` | `'none'`
- **Description:** CSS resize behavior
- **Example:**
```html
<!-- Allow both horizontal and vertical resize -->
<t-textarea resize="both"></t-textarea>

<!-- Disable resize -->
<t-textarea resize="none"></t-textarea>
```

### Code Editor Properties

#### `codeMode`
- **Type:** `Boolean`
- **Default:** `false`
- **Attribute:** `code-mode`
- **Reflects:** `true`
- **Description:** Enables code editor features with IDE shortcuts
- **Example:**
```html
<t-textarea code-mode></t-textarea>
```

#### `showLineNumbers`
- **Type:** `Boolean`
- **Default:** `false`
- **Attribute:** `show-line-numbers`
- **Reflects:** `true`
- **Description:** Displays line numbers (requires code-mode)
- **Example:**
```html
<t-textarea code-mode show-line-numbers></t-textarea>
```

#### `language`
- **Type:** `String`
- **Default:** `null`
- **Reflects:** `true`
- **Values:** `'javascript'` | `'typescript'` | `'css'` | `'html'` | `'json'` | `'markup'` | `'plaintext'` | `'none'`
- **Description:** Programming language for syntax highlighting (requires Prism.js)
- **Example:**
```html
<t-textarea
  code-mode
  language="javascript"
  value="const greeting = 'Hello World';">
</t-textarea>
```

## Methods

### Value Methods

#### `setValue(value)`
Set the textarea value programmatically
- **Parameters:**
  - `value` {String} - New value to set
- **Returns:** `void`
- **Fires:** `textarea-input` event
- **Example:**
```javascript
const textarea = document.querySelector('t-textarea');
textarea.setValue('New content');
```

#### `getValue()`
Get the current textarea value
- **Returns:** {String} - Current value
- **Example:**
```javascript
const textarea = document.querySelector('t-textarea');
const currentValue = textarea.getValue();
console.log(currentValue);
```

#### `clear()`
Clear the textarea value
- **Returns:** `void`
- **Fires:** `textarea-input` event
- **Example:**
```javascript
textarea.clear(); // Sets value to empty string
```

### Focus Methods

#### `focus()`
Focus the textarea element
- **Returns:** `void`
- **Example:**
```javascript
textarea.focus(); // Gives focus to textarea
```

#### `blur()`
Blur the textarea element
- **Returns:** `void`
- **Example:**
```javascript
textarea.blur(); // Removes focus from textarea
```

### Selection Methods

#### `selectAll()`
Select all text in the textarea
- **Returns:** `void`
- **Example:**
```javascript
textarea.selectAll(); // Selects all content
```

### Context Methods

#### `receiveContext(context)`
Receive context from parent component
- **Parameters:**
  - `context` {Object} - Context object from parent
- **Returns:** `void`
- **Example:**
```javascript
textarea.receiveContext({
  theme: 'dark',
  formId: 'contact-form'
});
```

#### `getContext()`
Get the current context
- **Returns:** {Object} - Current context or null
- **Example:**
```javascript
const context = textarea.getContext();
console.log(context); // { theme: 'dark', formId: 'contact-form' }
```

## Events

All events bubble and are composed (cross shadow DOM boundaries).

### `textarea-input`
Fired when the textarea value changes (on every keystroke)
- **Detail:** `{ value: string }`
- **Bubbles:** `true`
- **Composed:** `true`
- **Example:**
```javascript
textarea.addEventListener('textarea-input', (e) => {
  console.log('Current value:', e.detail.value);
});
```

### `textarea-change`
Fired when the textarea loses focus after value change
- **Detail:** `{ value: string }`
- **Bubbles:** `true`
- **Composed:** `true`
- **Example:**
```javascript
textarea.addEventListener('textarea-change', (e) => {
  console.log('Final value:', e.detail.value);
  // Save to database
});
```

### `textarea-focus`
Fired when the textarea receives focus
- **Detail:** `{}`
- **Bubbles:** `true`
- **Composed:** `true`
- **Example:**
```javascript
textarea.addEventListener('textarea-focus', () => {
  console.log('Textarea focused');
});
```

### `textarea-blur`
Fired when the textarea loses focus
- **Detail:** `{}`
- **Bubbles:** `true`
- **Composed:** `true`
- **Example:**
```javascript
textarea.addEventListener('textarea-blur', () => {
  console.log('Textarea blurred');
});
```

## Styling

### CSS Custom Properties

Control resize constraints using CSS custom properties:

```css
t-textarea {
  --textarea-min-width: 200px;
  --textarea-max-width: 800px;
  --textarea-min-height: 100px;
  --textarea-max-height: 500px;
}
```

### Resize Constraints Examples

#### Fixed Height Range
```html
<t-textarea
  resize="vertical"
  style="--textarea-min-height: 100px; --textarea-max-height: 400px;">
</t-textarea>
```

#### Fixed Width Range
```html
<t-textarea
  resize="horizontal"
  style="--textarea-min-width: 300px; --textarea-max-width: 600px;">
</t-textarea>
```

#### Both Dimensions Constrained
```html
<t-textarea
  resize="both"
  style="--textarea-min-width: 300px;
         --textarea-max-width: 800px;
         --textarea-min-height: 150px;
         --textarea-max-height: 500px;">
</t-textarea>
```

## Code Editor Features

### Line Numbers
Display line numbers alongside the textarea:
```html
<t-textarea
  code-mode
  show-line-numbers
  rows="15">
</t-textarea>
```

### Dark Background
Code mode automatically applies a black background:
```html
<t-textarea code-mode></t-textarea>
```

### Monospace Font
Code mode uses monospace font family for better code readability.

## Syntax Highlighting

### Prerequisites
Include Prism.js library and language components:
```html
<!-- Core Prism.js -->
<script src="public/js/libs/prismjs/prism.js"></script>

<!-- Language components -->
<script src="public/js/libs/prismjs/prism-javascript.min.js"></script>
<script src="public/js/libs/prismjs/prism-css.min.js"></script>
<script src="public/js/libs/prismjs/prism-markup.min.js"></script>
```

### JavaScript Highlighting
```html
<t-textarea
  code-mode
  show-line-numbers
  language="javascript"
  value="function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}">
</t-textarea>
```

### HTML Highlighting
```html
<t-textarea
  code-mode
  language="markup"
  value="<div class='container'>
  <h1>Hello World</h1>
</div>">
</t-textarea>
```

### CSS Highlighting
```html
<t-textarea
  code-mode
  language="css"
  value=".container {
  display: flex;
  align-items: center;
}">
</t-textarea>
```

### Language Switcher Example
```html
<select id="langSelector">
  <option value="javascript">JavaScript</option>
  <option value="css">CSS</option>
  <option value="markup">HTML</option>
  <option value="none">Plain Text</option>
</select>

<t-textarea id="codeEditor" code-mode show-line-numbers></t-textarea>

<script>
  const selector = document.getElementById('langSelector');
  const editor = document.getElementById('codeEditor');

  selector.addEventListener('change', (e) => {
    editor.language = e.target.value;
  });
</script>
```

## Keyboard Shortcuts

### Code Mode Shortcuts (when `code-mode` is enabled)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Tab` | Insert tab/indent | Inserts 2 spaces at cursor |
| `Shift+Tab` | Outdent | Removes 2 spaces from line start |
| `Ctrl+/` or `Cmd+/` | Toggle comment | Adds/removes `// ` comment |
| `Ctrl+D` or `Cmd+D` | Duplicate line | Duplicates current line below |
| `Alt+Up` | Move line up | Moves current line up |
| `Alt+Down` | Move line down | Moves current line down |
| `Ctrl+[` or `Cmd+[` | Outdent selection | Outdents selected lines |
| `Ctrl+]` or `Cmd+]` | Indent selection | Indents selected lines |

### Example: Enable All IDE Features
```html
<t-textarea
  code-mode
  show-line-numbers
  language="javascript"
  rows="20"
  placeholder="// Start coding with IDE shortcuts..."
  value="// Try these shortcuts:
// Tab - Indent
// Ctrl+/ - Toggle comment
// Ctrl+D - Duplicate line
// Alt+Up/Down - Move line

function example() {
  console.log('Hello World');
}">
</t-textarea>
```

## Form Integration

### Native Form Participation
The component uses ElementInternals API for native form integration:

```html
<form id="myForm">
  <t-textarea
    name="message"
    required
    maxlength="1000"
    placeholder="Enter your message...">
  </t-textarea>

  <button type="submit">Submit</button>
</form>

<script>
  document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Message:', formData.get('message'));
  });
</script>
```

### Form Validation
```html
<form>
  <t-textarea
    required
    minlength="10"
    maxlength="500"
    placeholder="Required field (10-500 characters)">
  </t-textarea>

  <button type="submit">Submit</button>
</form>
```

### Disabled in Forms
```html
<form>
  <t-textarea
    name="notes"
    disabled
    value="This field is disabled">
  </t-textarea>
</form>
```

## Examples

### Contact Form
```html
<form class="contact-form">
  <t-textarea
    name="message"
    placeholder="Your message..."
    rows="6"
    required
    maxlength="1000">
  </t-textarea>

  <div class="char-count">
    <span id="charCount">0</span> / 1000
  </div>

  <button type="submit">Send Message</button>
</form>

<script>
  const textarea = document.querySelector('t-textarea');
  const charCount = document.getElementById('charCount');

  textarea.addEventListener('textarea-input', (e) => {
    charCount.textContent = e.detail.value.length;
  });
</script>
```

### Code Editor with Toolbar
```html
<div class="editor-container">
  <div class="toolbar">
    <select id="languageSelect">
      <option value="javascript">JavaScript</option>
      <option value="css">CSS</option>
      <option value="markup">HTML</option>
    </select>

    <button onclick="editor.clear()">Clear</button>
    <button onclick="editor.selectAll()">Select All</button>
    <button onclick="copyCode()">Copy</button>
  </div>

  <t-textarea
    id="editor"
    code-mode
    show-line-numbers
    language="javascript"
    rows="20"
    resize="vertical"
    style="--textarea-min-height: 300px; --textarea-max-height: 600px;">
  </t-textarea>
</div>

<script>
  const editor = document.getElementById('editor');
  const languageSelect = document.getElementById('languageSelect');

  languageSelect.addEventListener('change', (e) => {
    editor.language = e.target.value;
  });

  function copyCode() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code);
    alert('Code copied!');
  }
</script>
```

### Auto-Save Textarea
```html
<t-textarea
  id="autoSave"
  placeholder="Your notes (auto-saved)..."
  rows="10">
</t-textarea>

<div id="saveStatus"></div>

<script>
  const textarea = document.getElementById('autoSave');
  const status = document.getElementById('saveStatus');
  let saveTimeout;

  // Load saved content
  const saved = localStorage.getItem('autoSaveContent');
  if (saved) {
    textarea.setValue(saved);
  }

  // Auto-save on input
  textarea.addEventListener('textarea-input', (e) => {
    clearTimeout(saveTimeout);
    status.textContent = 'Typing...';

    saveTimeout = setTimeout(() => {
      localStorage.setItem('autoSaveContent', e.detail.value);
      status.textContent = 'Saved';

      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }, 1000);
  });
</script>
```

### Markdown Editor
```html
<div class="markdown-editor">
  <t-textarea
    id="markdownInput"
    code-mode
    placeholder="# Write Markdown here..."
    rows="15"
    value="# Welcome to Markdown Editor

## Features
- Live preview
- Syntax highlighting
- Auto-save

**Bold text** and *italic text*

```javascript
const code = 'Highlighted';
```">
  </t-textarea>

  <div id="preview"></div>
</div>

<script>
  const input = document.getElementById('markdownInput');
  const preview = document.getElementById('preview');

  // You would use a markdown parser here
  input.addEventListener('textarea-input', (e) => {
    // Example: preview.innerHTML = parseMarkdown(e.detail.value);
    preview.textContent = e.detail.value; // Placeholder
  });
</script>
```

### JSON Editor with Validation
```html
<t-textarea
  id="jsonEditor"
  code-mode
  show-line-numbers
  language="json"
  rows="15"
  placeholder='{"key": "value"}'>
</t-textarea>

<div id="jsonStatus"></div>

<script>
  const jsonEditor = document.getElementById('jsonEditor');
  const jsonStatus = document.getElementById('jsonStatus');

  jsonEditor.addEventListener('textarea-input', (e) => {
    try {
      JSON.parse(e.detail.value || '{}');
      jsonStatus.textContent = '✓ Valid JSON';
      jsonStatus.style.color = 'green';
    } catch (error) {
      jsonStatus.textContent = '✗ Invalid JSON: ' + error.message;
      jsonStatus.style.color = 'red';
    }
  });
</script>
```

### Configuration Editor
```html
<t-textarea
  id="configEditor"
  code-mode
  show-line-numbers
  language="javascript"
  rows="20"
  value="// Application Configuration
const config = {
  app: {
    name: 'Terminal Kit',
    version: '1.0.0',
    debug: true
  },

  theme: {
    primary: '#00ff41',
    background: '#0a0a0a',
    font: 'monospace'
  },

  features: {
    syntaxHighlighting: true,
    lineNumbers: true,
    autoSave: false
  }
};">
</t-textarea>

<button onclick="applyConfig()">Apply Configuration</button>

<script>
  function applyConfig() {
    const editor = document.getElementById('configEditor');
    const code = editor.getValue();

    try {
      // Evaluate configuration (be careful with eval in production)
      eval(code);
      console.log('Configuration applied:', config);
      alert('Configuration applied successfully!');
    } catch (error) {
      alert('Configuration error: ' + error.message);
    }
  }
</script>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

The component requires:
- Web Components support
- ElementInternals API for form participation
- CSS Custom Properties
- Optional: Prism.js for syntax highlighting

## Performance Considerations

1. **Syntax Highlighting**: For large files (>1000 lines), consider disabling real-time highlighting
2. **Line Numbers**: Efficiently rendered, minimal performance impact
3. **Resize Constraints**: Use CSS custom properties for better performance
4. **Form Integration**: Native ElementInternals provides optimal form performance

## Accessibility

- Full keyboard navigation support
- ARIA attributes support
- Screen reader compatible
- Form validation messages
- Focus management

## Migration Guide

### From Standard Textarea
```html
<!-- Before -->
<textarea
  placeholder="Enter text..."
  rows="5"
  maxlength="500">
</textarea>

<!-- After -->
<t-textarea
  placeholder="Enter text..."
  rows="5"
  maxlength="500">
</t-textarea>
```

### Adding Code Features
```html
<!-- Basic textarea -->
<t-textarea></t-textarea>

<!-- Upgrade to code editor -->
<t-textarea
  code-mode
  show-line-numbers
  language="javascript">
</t-textarea>
```

## Troubleshooting

### Syntax Highlighting Not Working
- Ensure Prism.js is loaded before using the component
- Check that language files are included for your specific language
- Verify the `language` attribute matches Prism.js language names

### Resize Not Working
- Check `resize` attribute value is valid
- Ensure no conflicting CSS overrides the resize property
- For disabled/readonly textareas, resize is automatically disabled

### Form Value Not Submitting
- Ensure the `name` attribute is set on the component
- Component must be inside a `<form>` element
- Check browser support for ElementInternals API

## Related Components

- `t-input` - Single-line text input
- `t-select` - Dropdown selection
- `t-form` - Form container with validation
- `t-code-block` - Read-only code display with syntax highlighting