# TDynamicControlsLit

A dynamic form generator that creates controls from a schema definition. Designed to work with Rive parser blueprint format (State Machines and ViewModels).

## Tag Name

`t-dynamic-controls`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-dynamic-controls` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `schema` | `Object` | `null` | No | Schema object defining controls (State Machines and ViewModels) |
| `disabled` | `Boolean` | `false` | Yes | Disable all controls |
| `showTypes` | `Boolean` | `false` | No | Show type badges on controls |
| `compact` | `Boolean` | `false` | Yes | Compact layout mode |

### Schema Structure (Rive Parser Format)

```javascript
{
  stateMachines: [
    {
      name: 'StateMachine1',
      inputs: [
        { name: 'isPlaying', type: 'boolean', value: false },
        { name: 'speed', type: 'number', value: 1.0, min: 0, max: 10 },
        { name: 'playTrigger', type: 'trigger' }
      ]
    }
  ],
  viewModel: {
    name: 'MainViewModel',
    blueprintName: 'Main',
    properties: [
      { name: 'label', type: 'string', value: 'Hello' },
      { name: 'color', type: 'color', value: 0xff00ff41 },
      { name: 'state', type: 'enumType', values: ['idle', 'active', 'done'] }
    ],
    nestedViewModels: [
      {
        name: 'ChildViewModel',
        blueprintName: 'Child',
        properties: [...]
      }
    ]
  }
}
```

### Supported Control Types

| Type | Control | Description |
|------|---------|-------------|
| `boolean` | Toggle (`t-tog`) | Boolean on/off toggle |
| `number` | Input (`t-inp`) | Number input with optional min/max/step |
| `string` | Input (`t-inp`) | Text input |
| `color` | Color Picker (`t-clr`) | ARGB color picker |
| `enumType` | Dropdown (`t-drp`) | Selection from enum values |
| `trigger` | Button (`t-btn`) | Fire button that emits trigger event |

## Methods

### setSchema(schema)
Set the control schema.

**Parameters:**
- `schema` (Object): Schema definition object

### getValues()
Get all current control values.

**Returns:** `Object` - Nested object with current values organized by path

### setValues(values)
Set multiple control values.

**Parameters:**
- `values` (Object): Object with values to set

### updateValue(path, value)
Update a single control value by dot-notation path.

**Parameters:**
- `path` (String): Dot-notation path (e.g., `'sm.StateMachine1.speed'` or `'vm.MainViewModel.label'`)
- `value` (any): New value

### enable()
Enable all controls.

### disable()
Disable all controls.

## Events

### control-change
Fired when any control value changes.

```javascript
{
  detail: {
    path: 'sm.StateMachine1.speed',
    value: 2.5,
    values: { /* all current values */ }
  }
}
```

### control-trigger
Fired when a trigger control is fired.

```javascript
{
  detail: {
    path: 'sm.StateMachine1.playTrigger'
  }
}
```

## Examples

### Basic Usage with Rive Schema

```html
<t-dynamic-controls></t-dynamic-controls>
```

```javascript
const controls = document.querySelector('t-dynamic-controls');

// Set schema from Rive parser
controls.setSchema({
  stateMachines: [
    {
      name: 'MainSM',
      inputs: [
        { name: 'isActive', type: 'boolean', value: false },
        { name: 'progress', type: 'number', value: 0, min: 0, max: 100 },
        { name: 'fire', type: 'trigger' }
      ]
    }
  ],
  viewModel: {
    name: 'Root',
    blueprintName: 'RootVM',
    properties: [
      { name: 'title', type: 'string', value: 'Hello World' },
      { name: 'bgColor', type: 'color', value: 0xff1a1a1a }
    ]
  }
});

// Listen for changes
controls.addEventListener('control-change', (e) => {
  console.log('Changed:', e.detail.path, '=', e.detail.value);
});

controls.addEventListener('control-trigger', (e) => {
  console.log('Trigger fired:', e.detail.path);
});
```

### With Show Types

```html
<t-dynamic-controls show-types></t-dynamic-controls>
```

### Compact Mode

```html
<t-dynamic-controls compact></t-dynamic-controls>
```

### Programmatic Value Control

```javascript
const controls = document.querySelector('t-dynamic-controls');

// Get all values
const values = controls.getValues();
console.log(values);
// { sm: { MainSM: { isActive: false, progress: 0 } }, vm: { Root: { title: 'Hello World' } } }

// Update single value
controls.updateValue('sm.MainSM.progress', 50);

// Set multiple values
controls.setValues({
  sm: { MainSM: { isActive: true, progress: 75 } },
  vm: { Root: { title: 'Updated Title' } }
});

// Enable/disable
controls.disable();
controls.enable();
```

## Slots

None.

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--dyn-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--dyn-border` | `var(--terminal-gray-dark)` | Border color |
| `--dyn-color` | `var(--terminal-green)` | Accent color |
| `--dyn-text` | `var(--terminal-gray-light)` | Text color |

## Related Components

- [TInputLit](./TInputLit.md) - Text/number input
- [TToggleLit](./TToggleLit.md) - Toggle switch
- [TDropdownLit](./TDropdownLit.md) - Dropdown select
- [TColorPickerLit](./TColorPickerLit.md) - Color picker
- [TButtonLit](./TButtonLit.md) - Button
