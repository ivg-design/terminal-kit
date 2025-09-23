# TerminalSlider

A customizable range slider component with terminal styling, supporting icons, labels, tick marks, and various display modes.

## Tag Name
```html
<terminal-slider></terminal-slider>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `min` | number | `0` | Minimum value |
| `max` | number | `100` | Maximum value |
| `value` | number | `50` | Current value |
| `step` | number | `1` | Step increment |
| `label` | string | - | Slider label |
| `icon` | string | - | Icon SVG content |
| `icon-size` | string | `'medium'` | Icon size ('small', 'medium', 'large') |
| `disabled` | boolean | `false` | Disabled state |
| `vertical` | boolean | `false` | Vertical orientation |
| `variant` | string | `'default'` | Display variant |
| `show-ticks` | boolean | `false` | Show tick marks |
| `major-tick-interval` | number | `5` | Steps between major tick marks |
| `compact` | boolean | `false` | Compact mode |
| `smooth` | boolean | `false` | Smooth sliding (no step snapping) |

### Variants
- `default` - Standard slider with value display
- `with-input` - Includes editable input field
- `value-in-thumb` - Shows value inside the thumb

## Methods

### `getValue()`
Returns the current slider value.

**Returns:** number

```javascript
const value = slider.getValue();
```

### `setValue(value)`
Sets the slider value programmatically.

**Parameters:**
- `value` (number): New value

```javascript
slider.setValue(75);
```

### `setMin(min)`
Sets the minimum value.

**Parameters:**
- `min` (number): Minimum value

```javascript
slider.setMin(0);
```

### `setMax(max)`
Sets the maximum value.

**Parameters:**
- `max` (number): Maximum value

```javascript
slider.setMax(200);
```

### `setStep(step)`
Sets the step increment.

**Parameters:**
- `step` (number): Step value

```javascript
slider.setStep(5);
```

### `disable()`
Disables the slider.

```javascript
slider.disable();
```

### `enable()`
Enables the slider.

```javascript
slider.enable();
```

### `setIcon(iconSvg)`
Sets the slider icon.

**Parameters:**
- `iconSvg` (string): SVG string for icon

```javascript
import { speakerHighIcon } from './phosphor-icons.js';
slider.setIcon(speakerHighIcon);
```

### `reset()`
Resets to initial value.

```javascript
slider.reset();
```

## Events

### `slider-change`
Fired when slider value changes.

**Event Detail:**
```javascript
{
  value: number,
  percentage: number  // 0-100
}
```

**Example:**
```javascript
slider.addEventListener('slider-change', (e) => {
  console.log('Value:', e.detail.value);
  console.log('Percentage:', e.detail.percentage);
});
```

### `slider-input`
Fired during sliding (real-time).

**Event Detail:** Same as `slider-change`

## CSS Classes

- `terminal-slider-container` - Main container
- `terminal-slider-container--compact` - Compact mode
- `terminal-slider-container--disabled` - Disabled state
- `slider-header` - Label and value section
- `slider-wrapper` - Slider track wrapper
- `slider-track` - Slider track
- `slider-progress` - Filled portion
- `slider-thumb` - Draggable thumb
- `slider-ticks` - Tick marks container

## Examples

### Basic Slider
```html
<terminal-slider
  min="0"
  max="100"
  value="50"
  label="Volume">
</terminal-slider>
```

### Vertical Slider
```html
<terminal-slider
  min="0"
  max="100"
  value="75"
  step="10"
  label="Height"
  vertical>
</terminal-slider>
```

### With Icon and Size Variants
```html
<!-- Small icon -->
<terminal-slider
  id="smallIconSlider"
  icon-size="small"
  min="0"
  max="100"
  value="25">
</terminal-slider>

<!-- Large icon -->
<terminal-slider
  id="largeIconSlider"
  icon-size="large"
  min="0"
  max="100"
  value="75">
</terminal-slider>

<script>
  import { speakerHighIcon, gaugeIcon } from './phosphor-icons.js';
  document.getElementById('smallIconSlider').setAttribute('icon', speakerHighIcon);
  document.getElementById('largeIconSlider').setAttribute('icon', gaugeIcon);
</script>
```

### Value in Thumb
```html
<terminal-slider
  min="0"
  max="100"
  value="65"
  variant="value-in-thumb"
  label="Progress">
</terminal-slider>
```

### With Input Field
```html
<terminal-slider
  variant="with-input"
  min="0"
  max="255"
  value="128"
  step="1"
  label="Opacity">
</terminal-slider>
```

### With Tick Marks
```html
<!-- Default major ticks every 5 steps -->
<terminal-slider
  min="0"
  max="20"
  value="10"
  step="1"
  show-ticks
  label="Steps">
</terminal-slider>

<!-- Major ticks every 10 steps -->
<terminal-slider
  min="0"
  max="100"
  value="50"
  step="5"
  show-ticks
  major-tick-interval="10"
  label="Percentage">
</terminal-slider>
```

### Compact Mode
```html
<terminal-slider
  compact
  min="0"
  max="10"
  value="5"
  label="Rating">
</terminal-slider>
```

### Smooth Continuous
```html
<terminal-slider
  smooth
  min="0"
  max="1"
  value="0.5"
  step="0.01"
  label="Opacity">
</terminal-slider>
```

### Percentage Display
```html
<terminal-slider 
  id="percentSlider"
  min="0" 
  max="100" 
  value="75"
  label="Progress">
</terminal-slider>

<div id="percentDisplay"></div>

<script>
  const slider = document.getElementById('percentSlider');
  const display = document.getElementById('percentDisplay');
  
  slider.addEventListener('slider-change', (e) => {
    display.textContent = `${e.detail.percentage}%`;
  });
</script>
```

### Range Control
```html
<terminal-slider 
  id="tempSlider"
  min="-20" 
  max="40" 
  value="20"
  step="0.5"
  label="Temperature (°C)"
  variant="with-input">
</terminal-slider>

<script>
  const slider = document.getElementById('tempSlider');
  
  slider.addEventListener('slider-change', (e) => {
    const temp = e.detail.value;
    if (temp < 0) {
      slider.style.setProperty('--slider-color', '#0099ff');
    } else if (temp > 30) {
      slider.style.setProperty('--slider-color', '#ff0041');
    } else {
      slider.style.setProperty('--slider-color', '#00ff41');
    }
  });
</script>
```

### Audio Control
```html
<terminal-slider 
  id="audioSlider"
  min="0" 
  max="100" 
  value="50"
  label="Master Volume">
</terminal-slider>

<terminal-button id="muteBtn">Mute</terminal-button>

<script>
  import { speakerHighIcon, speakerSlashIcon } from './phosphor-icons.js';
  
  const slider = document.getElementById('audioSlider');
  const muteBtn = document.getElementById('muteBtn');
  
  let previousValue = slider.getValue();
  let isMuted = false;
  
  slider.setIcon(speakerHighIcon);
  
  muteBtn.addEventListener('button-click', () => {
    if (isMuted) {
      slider.setValue(previousValue);
      slider.setIcon(speakerHighIcon);
      slider.enable();
      isMuted = false;
      muteBtn.textContent = 'Mute';
    } else {
      previousValue = slider.getValue();
      slider.setValue(0);
      slider.setIcon(speakerSlashIcon);
      slider.disable();
      isMuted = true;
      muteBtn.textContent = 'Unmute';
    }
  });
</script>
```

### Multiple Sliders
```html
<div id="colorMixer">
  <terminal-slider id="red" min="0" max="255" value="0" label="Red"></terminal-slider>
  <terminal-slider id="green" min="0" max="255" value="255" label="Green"></terminal-slider>
  <terminal-slider id="blue" min="0" max="255" value="65" label="Blue"></terminal-slider>
  <div id="colorPreview" style="width: 100px; height: 100px; border: 2px solid #00ff41;"></div>
</div>

<script>
  const sliders = {
    red: document.getElementById('red'),
    green: document.getElementById('green'),
    blue: document.getElementById('blue')
  };
  const preview = document.getElementById('colorPreview');
  
  function updateColor() {
    const r = sliders.red.getValue();
    const g = sliders.green.getValue();
    const b = sliders.blue.getValue();
    preview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }
  
  Object.values(sliders).forEach(slider => {
    slider.addEventListener('slider-input', updateColor);
  });
  
  updateColor();
</script>
```

### Dynamic Range
```html
<terminal-slider id="dynamicSlider" label="Dynamic Range"></terminal-slider>
<terminal-button id="expandBtn">Expand Range</terminal-button>
<terminal-button id="contractBtn">Contract Range</terminal-button>

<script>
  const slider = document.getElementById('dynamicSlider');
  const expandBtn = document.getElementById('expandBtn');
  const contractBtn = document.getElementById('contractBtn');
  
  let currentMax = 100;
  
  expandBtn.addEventListener('button-click', () => {
    currentMax += 50;
    slider.setMax(currentMax);
  });
  
  contractBtn.addEventListener('button-click', () => {
    if (currentMax > 50) {
      currentMax -= 50;
      slider.setMax(currentMax);
      if (slider.getValue() > currentMax) {
        slider.setValue(currentMax);
      }
    }
  });
</script>
```

## Keyboard Support

- **Arrow Left/Down**: Decrease value
- **Arrow Right/Up**: Increase value
- **Home**: Set to minimum
- **End**: Set to maximum
- **Page Up**: Increase by 10%
- **Page Down**: Decrease by 10%

## Styling Variables

```css
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--slider-thumb-size: 20px;
--slider-track-height: 6px;
```

## Accessibility

- ARIA attributes for screen readers
- Keyboard navigation
- Focus indicators
- Value announcements

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+