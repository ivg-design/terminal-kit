# TerminalInput

A styled text input component with terminal aesthetics, supporting various input types, validation states, and icons.

## Tag Name
```html
<terminal-input></terminal-input>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | `'text'` | Input type |
| `value` | string | `''` | Input value |
| `placeholder` | string | `''` | Placeholder text |
| `disabled` | boolean | `false` | Disabled state |
| `readonly` | boolean | `false` | Read-only state |
| `error` | boolean | `false` | Error state |
| `success` | boolean | `false` | Success state |
| `label` | string | - | Input label |
| `helper-text` | string | - | Helper text below input |
| `name` | string | - | Input name attribute |
| `required` | boolean | `false` | Required field |
| `pattern` | string | - | Validation pattern |
| `minlength` | number | - | Minimum length |
| `maxlength` | number | - | Maximum length |
| `min` | number/string | - | Minimum value |
| `max` | number/string | - | Maximum value |
| `step` | number | - | Step for number inputs |
| `autocomplete` | string | - | Autocomplete attribute |

### Supported Types
- `text` - Standard text input
- `password` - Password input with toggle visibility
- `email` - Email input
- `number` - Numeric input
- `tel` - Telephone input
- `url` - URL input
- `search` - Search input with clear button
- `date` - Date input
- `time` - Time input
- `datetime-local` - Date and time input

## Methods

### `getValue()`
Returns the current input value.

**Returns:** string

```javascript
const value = input.getValue();
```

### `setValue(value)`
Sets the input value programmatically.

**Parameters:**
- `value` (string): New value

```javascript
input.setValue('new value');
```

### `focus()`
Focuses the input element.

```javascript
input.focus();
```

### `blur()`
Removes focus from the input.

```javascript
input.blur();
```

### `clear()`
Clears the input value.

```javascript
input.clear();
```

### `validate()`
Validates the input based on its attributes.

**Returns:** boolean (true if valid)

```javascript
const isValid = input.validate();
```

### `setError(message)`
Sets error state with optional message.

**Parameters:**
- `message` (string): Error message

```javascript
input.setError('Invalid email format');
```

### `clearError()`
Clears error state.

```javascript
input.clearError();
```

## Events

### `input-change`
Fired when input value changes.

**Event Detail:**
```javascript
{
  value: string,
  oldValue: string
}
```

### `input-focus`
Fired when input gains focus.

**Event Detail:**
```javascript
{
  value: string
}
```

### `input-blur`
Fired when input loses focus.

**Event Detail:**
```javascript
{
  value: string
}
```

### `input-enter`
Fired when Enter key is pressed.

**Event Detail:**
```javascript
{
  value: string
}
```

### `input-clear`
Fired when clear button is clicked (search type).

## CSS Classes

Applied to the container:
- `terminal-input-wrapper` - Base wrapper class
- `terminal-input-wrapper--error` - Error state
- `terminal-input-wrapper--success` - Success state
- `terminal-input-wrapper--disabled` - Disabled state
- `terminal-input-wrapper--focused` - When focused

Applied to the input:
- `terminal-input` - Base input class

## Examples

### Basic Text Input
```html
<terminal-input 
  type="text" 
  placeholder="Enter your name..."
  label="Name">
</terminal-input>
```

### Email with Validation
```html
<terminal-input 
  type="email" 
  placeholder="user@example.com"
  label="Email"
  required
  helper-text="We'll never share your email">
</terminal-input>
```

### Password with Toggle
```html
<terminal-input 
  type="password" 
  placeholder="Enter password..."
  label="Password"
  minlength="8">
</terminal-input>
```

### Number Input with Range
```html
<terminal-input 
  type="number" 
  min="0" 
  max="100" 
  step="5"
  value="50"
  label="Percentage">
</terminal-input>
```

### Search Input
```html
<terminal-input 
  type="search" 
  placeholder="Search..."
  id="searchInput">
</terminal-input>

<script>
  const search = document.getElementById('searchInput');
  search.addEventListener('input-change', (e) => {
    console.log('Searching for:', e.detail.value);
  });
</script>
```

### Input with Error State
```html
<terminal-input 
  type="text" 
  value="invalid data"
  error
  helper-text="This field contains errors">
</terminal-input>
```

### Programmatic Validation
```html
<terminal-input 
  type="email" 
  id="emailInput"
  required>
</terminal-input>

<terminal-button id="submitBtn">Submit</terminal-button>

<script>
  const emailInput = document.getElementById('emailInput');
  const submitBtn = document.getElementById('submitBtn');
  
  submitBtn.addEventListener('button-click', () => {
    if (!emailInput.validate()) {
      emailInput.setError('Please enter a valid email');
    } else {
      // Submit form
      console.log('Valid email:', emailInput.getValue());
    }
  });
  
  emailInput.addEventListener('input-change', () => {
    emailInput.clearError();
  });
</script>
```

### Form Integration
```html
<form id="myForm">
  <terminal-input 
    name="username"
    type="text" 
    label="Username"
    required>
  </terminal-input>
  
  <terminal-input 
    name="email"
    type="email" 
    label="Email"
    required>
  </terminal-input>
  
  <terminal-button type="submit">Submit</terminal-button>
</form>

<script>
  document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form data:', Object.fromEntries(formData));
  });
</script>
```

### Real-time Validation
```html
<terminal-input 
  type="text" 
  id="usernameInput"
  label="Username"
  pattern="^[a-zA-Z0-9_]{3,16}$"
  helper-text="3-16 characters, alphanumeric and underscore only">
</terminal-input>

<script>
  const username = document.getElementById('usernameInput');
  
  username.addEventListener('input-blur', (e) => {
    if (!username.validate()) {
      username.setError('Invalid username format');
    }
  });
  
  username.addEventListener('input-change', (e) => {
    const value = e.detail.value;
    if (value.length > 0 && value.length < 3) {
      username.setError('Username too short');
    } else if (value.length > 16) {
      username.setError('Username too long');
    } else {
      username.clearError();
    }
  });
</script>
```

## Styling Variables

```css
--terminal-green: #00ff41;
--terminal-red: #ff0041;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--font-mono: 'SF Mono', 'Monaco', monospace;
```

## Accessibility

- Proper label association
- ARIA attributes for validation states
- Keyboard navigation support
- Screen reader friendly error messages

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+