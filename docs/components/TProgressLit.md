# TProgressLit

A progress indicator component with terminal styling, supporting linear bars, circular progress, and various display options.

## Tag Names

- `t-prg`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-prg` |
| version | `3.0.0` |
| category | `Display` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `value` | `Number` | `0` | Yes | Current progress value |
| `max` | `Number` | `100` | Yes | Maximum value |
| `type` | `String` | `'bar'` | Yes | Type: `'bar'`, `'ring'` |
| `variant` | `String` | `'default'` | Yes | Color variant: `'default'`, `'success'`, `'warning'`, `'error'`, `'info'` |
| `size` | `String` | `'md'` | Yes | Size: `'sm'`, `'md'`, `'lg'` |
| `indeterminate` | `Boolean` | `false` | Yes | Show indeterminate animation |
| `showLabel` | `Boolean` | `false` | Yes | Show percentage label |
| `labelPosition` | `String` | `'outside'` | Yes | Label position: `'outside'`, `'inside'` |
| `striped` | `Boolean` | `false` | Yes | Show striped pattern |
| `animated` | `Boolean` | `false` | Yes | Animate stripes |
| `buffer` | `Number` | `0` | No | Buffer/secondary progress value |
| `segments` | `Number` | `0` | No | Divide into segments (0 for continuous) |
| `vertical` | `Boolean` | `false` | Yes | Vertical orientation |
| `showTicks` | `Boolean` | `false` | Yes | Show tick marks |
| `tickInterval` | `Number` | `10` | No | Interval between ticks (percentage) |
| `squared` | `Boolean` | `false` | Yes | Square corners (no border-radius) |

## Methods

### setValue(value)
Set the progress value.

**Parameters:**
- `value` (Number): New value

**Fires:** `progress-complete` (when reaching max)

### increment(amount)
Increment the value.

**Parameters:**
- `amount` (Number): Amount to add (default: 1)

### decrement(amount)
Decrement the value.

**Parameters:**
- `amount` (Number): Amount to subtract (default: 1)

### reset()
Reset to zero.

### getPercentage()
Get current percentage.

**Returns:** `Number` - Percentage (0-100)

## Events

### progress-complete
Fired when progress reaches maximum.

```javascript
{
  detail: {
    value: 100,
    max: 100
  }
}
```

## Examples

### Basic Progress Bar

```html
<t-prg value="60"></t-prg>
```

### With Label

```html
<t-prg value="75" show-label></t-prg>
```

### Different Sizes

```html
<t-prg value="50" size="sm"></t-prg>
<t-prg value="50" size="md"></t-prg>
<t-prg value="50" size="lg"></t-prg>
```

### Color Variants

```html
<t-prg value="25" variant="default"></t-prg>
<t-prg value="50" variant="success"></t-prg>
<t-prg value="75" variant="warning"></t-prg>
<t-prg value="90" variant="error"></t-prg>
```

### Indeterminate Loading

```html
<t-prg indeterminate></t-prg>
```

### Striped and Animated

```html
<t-prg value="60" striped></t-prg>
<t-prg value="60" striped animated></t-prg>
```

### With Buffer (Streaming Progress)

```html
<t-prg value="30" buffer="60"></t-prg>
```

### Segmented Progress

```html
<t-prg value="3" max="5" segments="5"></t-prg>
```

### Ring Progress

```html
<t-prg type="ring" value="75" show-label></t-prg>
<t-prg type="ring" value="60" show-label size="lg"></t-prg>
```

### Vertical Progress

```html
<t-prg vertical value="70" style="height: 200px;"></t-prg>
```

### With Tick Marks

```html
<t-prg value="45" show-ticks tick-interval="25"></t-prg>
```

### Label Positions

```html
<t-prg value="50" show-label label-position="outside"></t-prg>
<t-prg value="50" show-label label-position="inside" size="lg"></t-prg>
```

### File Upload Progress

```html
<t-prg
  .value=${uploadProgress}
  show-label
  label-position="right"
  variant=${uploadProgress === 100 ? 'success' : 'default'}
  @progress-complete=${handleUploadComplete}>
</t-prg>
```

### Programmatic Control

```javascript
const progress = document.querySelector('t-prg');

// Set value
progress.setValue(50);

// Increment/decrement
progress.increment(10);
progress.decrement(5);

// Reset
progress.reset();

// Get percentage
const pct = progress.getPercentage();

// Listen for completion
progress.addEventListener('progress-complete', () => {
  console.log('Progress complete!');
});

// Animate progress
async function animateProgress() {
  progress.reset();
  for (let i = 0; i <= 100; i++) {
    progress.setValue(i);
    await new Promise(r => setTimeout(r, 50));
  }
}
```

## Slots

None.


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--progress-bg` | `var(--terminal-gray-dark)` | Track background |
| `--progress-color` | `var(--terminal-green)` | Fill color |
| `--progress-buffer` | `var(--terminal-gray)` | Buffer color |
| `--progress-text` | `var(--terminal-white)` | Label color |

## Related Components

- [TLoaderLit](./TLoaderLit.md) - Loading spinner
- [TSkeletonLit](./TSkeletonLit.md) - Loading placeholder
