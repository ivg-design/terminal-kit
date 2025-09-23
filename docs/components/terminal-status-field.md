# TerminalStatusField

A simple field component for displaying label-value pairs in status bars. This component is typically used as a child element within `TerminalStatusBar` but can also be used independently.

## Usage

```html
<terminal-status-field label="Status" value="Connected"></terminal-status-field>
```

### With TerminalStatusBar

```javascript
const statusBar = document.querySelector('terminal-status-bar');
statusBar.addField({
  id: 'connection-status',
  label: 'Connection',
  value: 'Active'
});
```

## Attributes

| Attribute | Type   | Default | Description               |
|-----------|--------|---------|---------------------------|
| `label`   | string | `""`    | The label text to display |
| `value`   | string | `""`    | The value text to display |

## Methods

| Method                | Parameters  | Returns | Description                    |
|-----------------------|-------------|---------|--------------------------------|
| `setLabel(label)`     | `label`     | void    | Updates the field label        |
| `setValue(value)`     | `value`     | void    | Updates the field value        |
| `getLabel()`          | -           | string  | Returns the current label      |
| `getValue()`          | -           | string  | Returns the current value      |

## Events

This component does not emit any custom events.

## Examples

### Basic Usage

```html
<terminal-status-field
  label="User"
  value="admin">
</terminal-status-field>
```

### Dynamic Updates

```javascript
const field = document.querySelector('terminal-status-field');

// Update label and value
field.setLabel('Environment');
field.setValue('Production');

// Get current values
console.log(field.getLabel()); // "Environment"
console.log(field.getValue()); // "Production"
```

### Multiple Fields

```html
<div class="status-container">
  <terminal-status-field label="Mode" value="Edit"></terminal-status-field>
  <terminal-status-field label="Line" value="42"></terminal-status-field>
  <terminal-status-field label="Column" value="15"></terminal-status-field>
</div>
```

### Real-time Updates

```javascript
const cpuField = document.createElement('terminal-status-field');
cpuField.setLabel('CPU');
document.body.appendChild(cpuField);

// Update CPU usage every second
setInterval(() => {
  const usage = Math.floor(Math.random() * 100);
  cpuField.setValue(`${usage}%`);
}, 1000);
```

## Styling

The component uses these CSS classes:
- `.terminal-status-field` - Container element
- `.status-item` - Inner wrapper
- `.status-label` - Label element
- `.status-value` - Value element

### Custom Styling

```css
terminal-status-field {
  font-family: monospace;
  font-size: 12px;
}

terminal-status-field .status-label {
  color: var(--terminal-dim);
  margin-right: 4px;
}

terminal-status-field .status-value {
  color: var(--terminal-bright);
  font-weight: bold;
}
```

## Notes

- This component is intentionally simple and lightweight
- It's designed primarily for use within `TerminalStatusBar` but works independently
- The label includes a colon (`:`) separator by default
- Both label and value are rendered as plain text (HTML is escaped)

## See Also

- [TerminalStatusBar](./TerminalStatusBar.md) - Parent container for status fields