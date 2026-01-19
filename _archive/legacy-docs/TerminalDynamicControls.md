# TerminalDynamicControls

Schema-based dynamic control generation component with recursive nesting support. Generates various control types based on JSON schema definitions.

## Class Definition

```javascript
class TerminalDynamicControls extends TerminalComponent
```

## Usage

```html
<terminal-dynamic-controls schema='[...]' id="controls"></terminal-dynamic-controls>
```

## Supported Control Types

### Basic Controls
- `number` - Number input with min/max/step
- `color` - Color picker with text input
- `dropdown` - Select dropdown with options
- `text` - Text input or textarea
- `trigger` - Action button
- `boolean` - Toggle switch
- `group` - Collapsible container for other controls

## Schema Format

The component accepts a JSON schema array defining the control structure:

```javascript
const schema = [
  {
    type: 'group',
    key: 'animations',
    label: 'Animation Controls',
    collapsed: false,
    children: [
      {
        type: 'number',
        key: 'speed',
        label: 'Speed',
        min: 0,
        max: 2,
        step: 0.1,
        value: 1
      },
      {
        type: 'boolean',
        key: 'autoplay',
        label: 'Autoplay',
        value: true
      },
      {
        type: 'color',
        key: 'tint',
        label: 'Tint Color',
        value: '#ff0000'
      }
    ]
  },
  {
    type: 'trigger',
    key: 'reset',
    label: 'Reset Animation',
    variant: 'danger'
  }
];
```

## Control Type Specifications

### Number Control
```javascript
{
  type: 'number',
  key: 'speed',           // Unique identifier
  label: 'Speed',         // Display label
  min: 0,                 // Minimum value
  max: 100,               // Maximum value
  step: 1,                // Step increment
  value: 50,              // Default value
  disabled: false         // Optional disabled state
}
```

### Color Control
```javascript
{
  type: 'color',
  key: 'background',
  label: 'Background Color',
  value: '#00ff41'        // Hex color value
}
```

### Dropdown Control
```javascript
{
  type: 'dropdown',
  key: 'blend_mode',
  label: 'Blend Mode',
  value: 'normal',        // Default selected value
  options: [
    'normal',
    'multiply',
    'screen',
    // Or objects with value/label pairs:
    { value: 'overlay', label: 'Overlay Mode' }
  ]
}
```

### Text Control
```javascript
{
  type: 'text',
  key: 'title',
  label: 'Title',
  value: 'Default Text',
  placeholder: 'Enter text...',
  multiline: false        // Use textarea if true
}
```

### Trigger Control
```javascript
{
  type: 'trigger',
  key: 'play',
  label: 'Play Animation',
  variant: 'primary'      // 'default', 'primary', 'danger', 'warning'
}
```

### Boolean Control
```javascript
{
  type: 'boolean',
  key: 'visible',
  label: 'Visible',
  value: true
}
```

### Group Control
```javascript
{
  type: 'group',
  key: 'transform',
  label: 'Transform',
  collapsed: false,       // Initial collapsed state
  children: [
    // Nested control definitions...
  ]
}
```

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `schema` | String | JSON string of control schema array |
| `disabled` | Boolean | Disables all controls |

## Events

### control-change
Fired when any control value changes.

```javascript
controls.addEventListener('control-change', (e) => {
  const { key, value, type } = e.detail;
  console.log(`Control ${key} changed to:`, value);
});
```

### control-trigger
Fired when a trigger control is activated.

```javascript
controls.addEventListener('control-trigger', (e) => {
  const { key } = e.detail;
  console.log(`Trigger ${key} activated`);
});
```

### group-toggle
Fired when a group is collapsed or expanded.

```javascript
controls.addEventListener('group-toggle', (e) => {
  const { key, collapsed } = e.detail;
  console.log(`Group ${key} ${collapsed ? 'collapsed' : 'expanded'}`);
});
```

## Methods

### Schema Management

#### `setSchema(schema)`
Set the control schema and reset all values.

**Parameters:**
- `schema` (Array): Control definition array

```javascript
const controls = document.querySelector('#controls');
controls.setSchema([
  { type: 'number', key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.1, value: 1 }
]);
```

#### `getSchema()`
Get current schema.

**Returns:** Schema array

### Value Management

#### `setValue(key, value)`
Set value for a specific control.

**Parameters:**
- `key` (string): Control key
- `value` (any): New value

```javascript
controls.setValue('opacity', 0.5);
```

#### `getValue(key)`
Get value for a specific control.

**Parameters:**
- `key` (string): Control key

**Returns:** Control value

#### `setValues(values)`
Set multiple values at once.

**Parameters:**
- `values` (Object): Key-value pairs

```javascript
controls.setValues({
  opacity: 0.5,
  speed: 1.5,
  visible: false
});
```

#### `getValues()`
Get all current values.

**Returns:** Object with all control values

#### `resetValues()`
Reset all values to their schema defaults.

### Group Management

#### `collapseGroup(key)`
Collapse a specific group.

**Parameters:**
- `key` (string): Group key

#### `expandGroup(key)`
Expand a specific group.

**Parameters:**
- `key` (string): Group key

#### `collapseAll()`
Collapse all groups.

#### `expandAll()`
Expand all groups.

### State Management

#### `disable()`
Disable all controls.

#### `enable()`
Enable all controls.

## CSS Classes

The component uses these CSS classes for styling:

- `.dynamic-controls` - Main container
- `.control-item` - Individual control wrapper
- `.control-label` - Control label
- `.control-input` - Input element
- `.group-control` - Group container
- `.group-header` - Group header with toggle
- `.group-content` - Group content area
- `.level-{n}` - Nesting level classes

## Example Usage

```javascript
// HTML
<terminal-dynamic-controls id="animation-controls"></terminal-dynamic-controls>

// JavaScript
const controls = document.querySelector('#animation-controls');

// Define schema
const schema = [
  {
    type: 'group',
    key: 'playback',
    label: 'Playback Controls',
    children: [
      {
        type: 'number',
        key: 'speed',
        label: 'Speed',
        min: 0.1,
        max: 3,
        step: 0.1,
        value: 1
      },
      {
        type: 'boolean',
        key: 'loop',
        label: 'Loop',
        value: true
      }
    ]
  },
  {
    type: 'group',
    key: 'appearance',
    label: 'Appearance',
    children: [
      {
        type: 'color',
        key: 'tint',
        label: 'Tint',
        value: '#ffffff'
      },
      {
        type: 'number',
        key: 'opacity',
        label: 'Opacity',
        min: 0,
        max: 1,
        step: 0.1,
        value: 1
      }
    ]
  },
  {
    type: 'trigger',
    key: 'reset',
    label: 'Reset All',
    variant: 'danger'
  }
];

// Set schema
controls.setSchema(schema);

// Listen for changes
controls.addEventListener('control-change', (e) => {
  const { key, value } = e.detail;
  updateAnimation(key, value);
});

controls.addEventListener('control-trigger', (e) => {
  if (e.detail.key === 'reset') {
    controls.resetValues();
  }
});

// Set values programmatically
controls.setValue('speed', 1.5);
controls.setValue('tint', '#ff0000');

// Get all values
const allValues = controls.getValues();
console.log('Current values:', allValues);
```

## Best Practices

1. **Use meaningful keys** - Control keys should be descriptive and unique
2. **Group related controls** - Use groups to organize related functionality
3. **Set appropriate constraints** - Define min/max/step for number controls
4. **Provide default values** - Always specify default values in schema
5. **Handle events** - Listen for control-change events to update your application
6. **Use appropriate variants** - Use trigger variants (primary, danger, warning) for better UX
7. **Consider nesting depth** - Avoid excessive nesting levels for better usability