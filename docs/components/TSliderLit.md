# TSliderLit Component

## Tag Names

- `t-sld`

## Overview

The `TSliderLit` component (`<t-sld>`) is a terminal-themed range slider with comprehensive features including drag support, form integration, icons, multiple display modes, and extensive customization options. Built with Lit Element following the FORM-ADVANCED profile.

## Features

- **Drag Support**: Mouse and touch dragging with smooth or stepped movement
- **Form Integration**: Native HTML form participation via ElementInternals API
- **Display Options**: Multiple ways to show values (output, input field, in-thumb)
- **Icons**: Support for any Phosphor icon from the library
- **Tick Marks**: Optional major and minor tick marks for visual reference
- **Fill Colors**: Multiple color variants (default, bright, dim, dark)
- **Sizes**: Compact, default, and large size options
- **Orientations**: Both horizontal (default) and vertical layouts
- **Keyboard Navigation**: Full keyboard support (arrows, page up/down, home/end)
- **Accessibility**: ARIA attributes and screen reader support
- **Theming**: CSS custom properties for complete visual control
- **Memory Safe**: Proper cleanup of all event listeners

## Quick Start

```html
<!-- Import the component -->
<script type="module" src="./js/components/TSliderLit.js"></script>

<!-- Simple slider with defaults (0-100, value 50) -->
<t-sld></t-sld>

<!-- Slider with label and custom range -->
<t-sld label="Volume" min="0" max="100" value="75"></t-sld>

<!-- Compact slider with value in thumb and ticks -->
<t-sld
  size="compact"
  show-value-in-thumb
  show-ticks
  min="-100"
  max="100"
  value="0">
</t-sld>

<!-- Slider with input field for direct value entry -->
<t-sld label="Quantity" show-input min="1" max="999" value="10"></t-sld>

<!-- Vertical slider with icon -->
<t-sld vertical icon="fadersIcon" label="Equalizer"></t-sld>

<!-- Smooth continuous slider -->
<t-sld smooth step="0.01" min="0" max="1" value="0.5"></t-sld>
```

## Properties

### Value & Range Properties

| Property | Type | Default | Attribute | Description |
|----------|------|---------|-----------|-------------|
| `min` | number | 0 | `min` | Minimum value for the slider range |
| `max` | number | 100 | `max` | Maximum value for the slider range |
| `value` | number | 50 | `value` | Current value of the slider |
| `step` | number | 1 | `step` | Step increment for value changes |

### Display Properties

| Property | Type | Default | Attribute | Description |
|----------|------|---------|-----------|-------------|
| `label` | string | '' | `label` | Label text displayed before the slider |
| `icon` | string | '' | `icon` | Phosphor icon name (e.g., "speakerHighIcon", "fadersIcon") |
| `showTicks` | boolean | false | `show-ticks` | Display tick marks on the track (major ticks every 5 steps) |
| `showValue` | boolean | true | `show-value` | Display current value after the slider |
| `showInput` | boolean | false | `show-input` | Show editable input field for direct value entry |
| `showOutput` | boolean | false | `show-output` | Show read-only output field displaying current value |
| `showValueInThumb` | boolean | false | `show-value-in-thumb` | Display the current value inside the slider thumb |

### Style Properties

| Property | Type | Default | Attribute | Description |
|----------|------|---------|-----------|-------------|
| `size` | string | 'default' | `size` | Size variant: 'compact', 'default', or 'large' |
| `fillColor` | string | 'default' | `fill-color` | Fill color variant: 'default', 'bright', 'dim', or 'dark' |
| `minimal` | boolean | false | `minimal` | Use minimal styling (simplified appearance) |

### Behavior Properties

| Property | Type | Default | Attribute | Description |
|----------|------|---------|-----------|-------------|
| `vertical` | boolean | false | `vertical` | Display slider vertically instead of horizontally |
| `smooth` | boolean | false | `smooth` | Enable smooth continuous dragging (ignores step during drag) |
| `disabled` | boolean | false | `disabled` | Disable the slider (no interaction allowed) |

## Methods

### Value Methods

#### `setValue(value)`
Programmatically set the slider value. Value will be clamped to min/max range.

```javascript
const slider = document.querySelector('t-sld');
slider.setValue(75);
// Value is automatically clamped
slider.setValue(150); // If max is 100, value becomes 100
```

#### `getValue()`
Get the current numeric value of the slider.

```javascript
const value = slider.getValue(); // Returns: number
console.log(`Current value: ${value}`);
```

### Navigation Methods

#### `increment()`
Increase the value by one step amount.

```javascript
slider.increment(); // If step=5 and value=50, becomes 55
```

#### `decrement()`
Decrease the value by one step amount.

```javascript
slider.decrement(); // If step=5 and value=50, becomes 45
```

### Configuration Methods

#### `setRange(min, max)`
Update the minimum and maximum values. Current value is adjusted if needed.

```javascript
// Change from 0-100 to -50 to 50
slider.setRange(-50, 50);

// Value is automatically adjusted if outside new range
slider.value = 75;
slider.setRange(0, 50); // Value becomes 50 (clamped to max)
```

## Events

### `slider-input`
Fires continuously during interaction (dragging, keyboard navigation). Use for real-time updates.

```javascript
slider.addEventListener('slider-input', (e) => {
  console.log('Current value:', e.detail.value);
  // Good for: Live preview, real-time calculations
  updatePreview(e.detail.value);
});
```

**Event Detail:**
```javascript
{
  value: number  // Current slider value
}
```

### `slider-change`
Fires when interaction ends (mouse up, key release, setValue() call). Use for final actions.

```javascript
slider.addEventListener('slider-change', (e) => {
  console.log('Final value:', e.detail.value);
  // Good for: Saving to database, triggering expensive operations
  saveSettings(e.detail.value);
});
```

**Event Detail:**
```javascript
{
  value: number  // Final slider value
}
```

### Event Usage Guidelines

- Use `slider-input` for lightweight, real-time updates
- Use `slider-change` for expensive operations or final commits
- Both events bubble and are cancelable
- Events fire for all interaction types (mouse, touch, keyboard, programmatic)

## Keyboard Navigation

### Horizontal Sliders

| Key | Action | Example (step=5) |
|-----|--------|-------------------|
| `ArrowRight` | Increase by step | 50 → 55 |
| `ArrowLeft` | Decrease by step | 50 → 45 |
| `ArrowUp` | Increase by step | 50 → 55 |
| `ArrowDown` | Decrease by step | 50 → 45 |
| `PageUp` | Increase by 10 × step | 50 → 100 |
| `PageDown` | Decrease by 10 × step | 50 → 0 |
| `Home` | Jump to minimum | any → min |
| `End` | Jump to maximum | any → max |

### Vertical Sliders

For vertical sliders, the arrow key behavior is intuitive:
- `ArrowUp` increases value (thumb moves up)
- `ArrowDown` decreases value (thumb moves down)
- Other keys work the same as horizontal

## Form Integration

The component fully participates in HTML forms via ElementInternals API:

### Basic Form Usage

```html
<form id="settings-form">
  <t-sld name="volume" label="Volume" value="75"></t-sld>
  <t-sld name="brightness" label="Brightness" min="0" max="100" value="80"></t-sld>
  <button type="submit">Save Settings</button>
</form>
```

### Accessing Form Data

```javascript
const form = document.getElementById('settings-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Method 1: FormData
  const formData = new FormData(form);
  console.log('Volume:', formData.get('volume'));      // "75"
  console.log('Brightness:', formData.get('brightness')); // "80"

  // Method 2: Form elements
  const volume = form.elements.volume.getValue();
  const brightness = form.elements.brightness.getValue();
});
```

### Form Validation

```html
<form>
  <!-- Required field with validation -->
  <t-sld
    name="age"
    label="Age"
    min="18"
    max="120"
    value="25"
    required>
  </t-sld>

  <button type="submit">Submit</button>
</form>
```

### Form Reset

```javascript
// Sliders return to their initial values on form reset
form.reset();
```

## Styling

### CSS Custom Properties

```css
t-sld {
  /* Track styling */
  --t-sld-track-height: 14px;      /* Height of the track */
  --t-sld-track-bg: #1a1a1a;       /* Track background color */
  --t-sld-track-border: #333;      /* Track border color */

  /* Fill (progress) styling */
  --t-sld-fill-bg: #00ff41;        /* Fill color or gradient */
  --t-sld-fill-glow: none;         /* Glow effect (set to none by default) */

  /* Thumb (handle) styling */
  --t-sld-thumb-size: 14px;        /* Size of the draggable thumb */
  --t-sld-thumb-bg: #005520;       /* Thumb background (dark green) */
  --t-sld-thumb-border: #00aa40;   /* Thumb border (medium green) */

  /* Value display styling */
  --t-sld-value-bg: #1a1a1a;       /* Background for value display */
  --t-sld-value-border: #333;      /* Border for value display */
  --t-sld-value-color: #00ff41;    /* Text color for value */

  /* Labels and ticks */
  --t-sld-label-color: rgba(0, 255, 65, 0.8);  /* Label text color */
  --t-sld-tick-color: #333;                    /* Minor tick color */
  --t-sld-tick-major-color: #555;              /* Major tick color */

  /* Icon styling */
  --t-sld-icon-size: 14px;         /* Size of the icon */
}
```

### Size Variants

The `size` attribute automatically adjusts multiple properties:

```css
/* Compact: Smaller controls, tighter spacing */
:host([size="compact"]) {
  --t-sld-track-height: 10px;
  --t-sld-thumb-size: 10px;
  --t-sld-icon-size: 12px;
  /* Font sizes: 9px */
}

/* Large: Bigger controls, more spacing */
:host([size="large"]) {
  --t-sld-track-height: 18px;
  --t-sld-thumb-size: 18px;
  --t-sld-icon-size: 18px;
  /* Font sizes: 12px */
}
```

### Fill Color Variants

Predefined color schemes via `fill-color` attribute:

```html
<!-- Default green -->
<t-sld fill-color="default"></t-sld>

<!-- Bright green (#00ff00) -->
<t-sld fill-color="bright"></t-sld>

<!-- Dim green (rgba(0, 255, 65, 0.7)) -->
<t-sld fill-color="dim"></t-sld>

<!-- Dark green (#00cc33) -->
<t-sld fill-color="dark"></t-sld>
```

### Custom Theming Examples

```css
/* Red theme */
.red-slider {
  --t-sld-fill-bg: linear-gradient(90deg, #000, #ff0000);
  --t-sld-thumb-bg: #ff0000;
  --t-sld-thumb-border: #cc0000;
  --t-sld-label-color: #ff6666;
}

/* Blue theme */
.blue-slider {
  --t-sld-fill-bg: linear-gradient(90deg, #000, #0080ff);
  --t-sld-thumb-bg: #0080ff;
  --t-sld-thumb-border: #0066cc;
  --t-sld-label-color: #66aaff;
}

/* Minimal monochrome */
.minimal-slider {
  --t-sld-track-bg: transparent;
  --t-sld-track-border: #666;
  --t-sld-fill-bg: #999;
  --t-sld-thumb-bg: #fff;
  --t-sld-thumb-border: #999;
}
```

## Complete Examples

### Volume Control with Icon

```html
<t-sld
  id="volume"
  label="Volume"
  icon="speakerHighIcon"
  min="0"
  max="100"
  value="75"
  show-ticks>
</t-sld>

<script>
  const volumeSlider = document.getElementById('volume');

  volumeSlider.addEventListener('slider-change', (e) => {
    const volume = e.detail.value;
    const audioElement = document.querySelector('audio');
    audioElement.volume = volume / 100;

    // Update icon based on volume level
    if (volume === 0) {
      volumeSlider.icon = 'speakerSimpleXIcon';
    } else if (volume < 33) {
      volumeSlider.icon = 'speakerSimpleLowIcon';
    } else if (volume < 66) {
      volumeSlider.icon = 'speakerSimpleNoneIcon';
    } else {
      volumeSlider.icon = 'speakerHighIcon';
    }
  });
</script>
```

### Temperature Control with Input Field

```html
<t-sld
  id="temperature"
  label="Temperature (°C)"
  icon="thermometerIcon"
  min="16"
  max="30"
  value="22"
  step="0.5"
  show-input
  show-ticks>
</t-sld>

<span id="temp-display">22.0°C</span>

<script>
  const tempSlider = document.getElementById('temperature');
  const display = document.getElementById('temp-display');

  tempSlider.addEventListener('slider-input', (e) => {
    display.textContent = `${e.detail.value.toFixed(1)}°C`;
  });
</script>
```

### Playback Speed Control

```html
<t-sld
  id="playback-speed"
  label="Speed"
  min="0.25"
  max="2"
  value="1"
  step="0.25"
  show-value-in-thumb
  show-ticks>
</t-sld>

<script>
  const speedSlider = document.getElementById('playback-speed');
  const video = document.querySelector('video');

  speedSlider.addEventListener('slider-change', (e) => {
    video.playbackRate = e.detail.value;
  });
</script>
```

### RGB Color Mixer

```html
<style>
  .color-mixer {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  #red-slider {
    --t-sld-fill-bg: linear-gradient(90deg, #000, #ff0000);
    --t-sld-thumb-bg: #ff0000;
    --t-sld-thumb-border: #cc0000;
  }

  #green-slider {
    --t-sld-fill-bg: linear-gradient(90deg, #000, #00ff00);
    --t-sld-thumb-bg: #00ff00;
    --t-sld-thumb-border: #00cc00;
  }

  #blue-slider {
    --t-sld-fill-bg: linear-gradient(90deg, #000, #0000ff);
    --t-sld-thumb-bg: #0000ff;
    --t-sld-thumb-border: #0000cc;
  }

  .color-preview {
    width: 150px;
    height: 150px;
    border: 2px solid #333;
    margin-top: 20px;
    transition: background-color 0.1s;
  }

  .color-code {
    margin-top: 10px;
    font-family: monospace;
    color: #00ff41;
  }
</style>

<div class="color-mixer">
  <t-sld id="red-slider" label="R" min="0" max="255" value="128" show-output></t-sld>
  <t-sld id="green-slider" label="G" min="0" max="255" value="128" show-output></t-sld>
  <t-sld id="blue-slider" label="B" min="0" max="255" value="128" show-output></t-sld>

  <div class="color-preview" id="color-preview"></div>
  <div class="color-code" id="color-code">rgb(128, 128, 128)</div>
</div>

<script>
  const updateColor = () => {
    const r = Math.round(document.getElementById('red-slider').getValue());
    const g = Math.round(document.getElementById('green-slider').getValue());
    const b = Math.round(document.getElementById('blue-slider').getValue());

    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

    document.getElementById('color-preview').style.backgroundColor = rgb;
    document.getElementById('color-code').textContent = `${rgb} / ${hex}`;
  };

  ['red-slider', 'green-slider', 'blue-slider'].forEach(id => {
    document.getElementById(id).addEventListener('slider-input', updateColor);
  });

  updateColor();
</script>
```

### Vertical Equalizer

```html
<style>
  .equalizer {
    display: flex;
    gap: 20px;
    height: 250px;
    padding: 20px;
    background: #111;
    border: 1px solid #333;
  }

  .eq-band {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .eq-label {
    font-size: 10px;
    color: #00ff41;
    text-transform: uppercase;
  }

  .eq-value {
    font-size: 10px;
    color: rgba(0, 255, 65, 0.7);
  }
</style>

<div class="equalizer">
  <div class="eq-band">
    <t-sld id="eq-60" vertical min="-12" max="12" value="0" step="1" show-ticks></t-sld>
    <span class="eq-label">60Hz</span>
    <span class="eq-value" id="eq-60-value">0dB</span>
  </div>

  <div class="eq-band">
    <t-sld id="eq-250" vertical min="-12" max="12" value="0" step="1" show-ticks></t-sld>
    <span class="eq-label">250Hz</span>
    <span class="eq-value" id="eq-250-value">0dB</span>
  </div>

  <div class="eq-band">
    <t-sld id="eq-1k" vertical min="-12" max="12" value="0" step="1" show-ticks></t-sld>
    <span class="eq-label">1kHz</span>
    <span class="eq-value" id="eq-1k-value">0dB</span>
  </div>

  <div class="eq-band">
    <t-sld id="eq-4k" vertical min="-12" max="12" value="0" step="1" show-ticks></t-sld>
    <span class="eq-label">4kHz</span>
    <span class="eq-value" id="eq-4k-value">0dB</span>
  </div>

  <div class="eq-band">
    <t-sld id="eq-16k" vertical min="-12" max="12" value="0" step="1" show-ticks></t-sld>
    <span class="eq-label">16kHz</span>
    <span class="eq-value" id="eq-16k-value">0dB</span>
  </div>
</div>

<button onclick="resetEqualizer()">Reset</button>
<button onclick="presetBass()">Bass Boost</button>
<button onclick="presetTreble()">Treble Boost</button>

<script>
  // Update value displays
  ['60', '250', '1k', '4k', '16k'].forEach(band => {
    const slider = document.getElementById(`eq-${band}`);
    const display = document.getElementById(`eq-${band}-value`);

    slider.addEventListener('slider-input', (e) => {
      const db = e.detail.value;
      display.textContent = `${db > 0 ? '+' : ''}${db}dB`;
    });
  });

  // Preset functions
  function resetEqualizer() {
    ['60', '250', '1k', '4k', '16k'].forEach(band => {
      document.getElementById(`eq-${band}`).setValue(0);
    });
  }

  function presetBass() {
    document.getElementById('eq-60').setValue(6);
    document.getElementById('eq-250').setValue(4);
    document.getElementById('eq-1k').setValue(0);
    document.getElementById('eq-4k').setValue(-2);
    document.getElementById('eq-16k').setValue(-4);
  }

  function presetTreble() {
    document.getElementById('eq-60').setValue(-4);
    document.getElementById('eq-250').setValue(-2);
    document.getElementById('eq-1k').setValue(0);
    document.getElementById('eq-4k').setValue(4);
    document.getElementById('eq-16k').setValue(6);
  }
</script>
```

### Balance Control with Center Detent

```html
<t-sld
  id="balance"
  label="Balance"
  icon="fadersIcon"
  min="-100"
  max="100"
  value="0"
  step="5"
  show-value-in-thumb
  show-ticks>
</t-sld>

<div id="balance-display">Center</div>

<script>
  const balanceSlider = document.getElementById('balance');
  const display = document.getElementById('balance-display');

  balanceSlider.addEventListener('slider-input', (e) => {
    const value = e.detail.value;

    if (value === 0) {
      display.textContent = 'Center';
    } else if (value < 0) {
      display.textContent = `Left ${Math.abs(value)}%`;
    } else {
      display.textContent = `Right ${value}%`;
    }

    // Apply audio panning
    if (window.audioContext) {
      const panValue = value / 100; // Convert to -1 to 1 range
      stereoPanner.pan.value = panValue;
    }
  });
</script>
```

### Compact Progress Indicator

```html
<style>
  .progress-slider {
    --t-sld-fill-bg: linear-gradient(90deg, #00cc33, #00ff41);
  }
</style>

<t-sld
  class="progress-slider"
  id="upload-progress"
  label="Upload"
  min="0"
  max="100"
  value="0"
  size="compact"
  show-value-in-thumb
  disabled>
</t-sld>

<button onclick="simulateUpload()">Start Upload</button>

<script>
  function simulateUpload() {
    const slider = document.getElementById('upload-progress');
    slider.disabled = false;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          alert('Upload complete!');
          slider.setValue(0);
          slider.disabled = true;
        }, 500);
      }
      slider.setValue(Math.min(progress, 100));
    }, 200);
  }
</script>
```

## Icons

### Using Phosphor Icons

The component supports any icon from the Phosphor icons library. Use the exact name as exported from `phosphor-icons.js`:

```html
<!-- Audio/Video Controls -->
<t-sld icon="speakerHighIcon" label="Volume"></t-sld>
<t-sld icon="speakerSimpleLowIcon" label="Volume"></t-sld>
<t-sld icon="microphoneIcon" label="Mic Gain"></t-sld>
<t-sld icon="playIcon" label="Playback"></t-sld>
<t-sld icon="pauseIcon" label="Pause"></t-sld>

<!-- Settings/Adjustments -->
<t-sld icon="fadersIcon" label="Mixer"></t-sld>
<t-sld icon="slidersIcon" label="Settings"></t-sld>
<t-sld icon="gearIcon" label="Config"></t-sld>
<t-sld icon="wrenchIcon" label="Tools"></t-sld>

<!-- Display/Visual -->
<t-sld icon="sunIcon" label="Brightness"></t-sld>
<t-sld icon="moonIcon" label="Night Mode"></t-sld>
<t-sld icon="eyeIcon" label="Visibility"></t-sld>
<t-sld icon="eyeSlashIcon" label="Hidden"></t-sld>

<!-- Metrics/Charts -->
<t-sld icon="chartBarIcon" label="Stats"></t-sld>
<t-sld icon="chartLineIcon" label="Trend"></t-sld>
<t-sld icon="gaugeIcon" label="Performance"></t-sld>
<t-sld icon="thermometerIcon" label="Temperature"></t-sld>

<!-- Navigation/Movement -->
<t-sld icon="arrowRightIcon" label="Forward"></t-sld>
<t-sld icon="arrowLeftIcon" label="Back"></t-sld>
<t-sld icon="arrowUpIcon" label="Up"></t-sld>
<t-sld icon="arrowDownIcon" label="Down"></t-sld>
```

### Icon Sizes

Icons automatically scale with the slider size:

```html
<!-- Compact: 12px icon -->
<t-sld size="compact" icon="speakerHighIcon"></t-sld>

<!-- Default: 14px icon -->
<t-sld icon="speakerHighIcon"></t-sld>

<!-- Large: 18px icon -->
<t-sld size="large" icon="speakerHighIcon"></t-sld>
```

## Accessibility

The component provides comprehensive accessibility support:

### ARIA Attributes
- `role="slider"` - Identifies the element as a slider
- `aria-valuemin` - Minimum value
- `aria-valuemax` - Maximum value
- `aria-valuenow` - Current value
- `aria-label` - Accessible label from the label prop
- `tabindex="0"` - Keyboard focusable

### Keyboard Support
Full keyboard navigation as described in the Keyboard Navigation section.

### Screen Reader Support
- Hidden native input element for compatibility
- Proper value announcements on change
- Label association for context

### Focus Management
- Clear focus indicators
- Logical tab order
- Focus trap prevention

## Tick Marks

### How Ticks Work

When `show-ticks` is enabled:
- **Minor ticks**: Appear at every step value
- **Major ticks**: Appear every 5 steps (darker and taller)
- Automatically scale with the range and step size

```html
<!-- Shows ticks at: 0, 10, 20, 30, 40, 50 (major at 0, 50) -->
<t-sld min="0" max="50" step="10" show-ticks></t-sld>

<!-- Shows ticks at: 0, 1, 2, 3, 4, 5 (major at 0, 5) -->
<t-sld min="0" max="5" step="1" show-ticks></t-sld>

<!-- Dense ticks for fine control -->
<t-sld min="0" max="10" step="0.5" show-ticks></t-sld>
```

## Browser Support

### Required Features
- **Lit Element**: Modern web component library
- **ElementInternals API**: For form participation (Chrome 77+, Firefox 98+, Safari 16.4+)
- **CSS Custom Properties**: For theming
- **ES6 Modules**: For imports

### Browser Versions
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Graceful Degradation
- Works without ElementInternals (no form participation)
- Falls back to basic styling if CSS features unsupported
- Touch events work on all modern mobile browsers

## Common Patterns

### Linked Sliders

```javascript
// Keep two sliders in sync
const slider1 = document.getElementById('slider1');
const slider2 = document.getElementById('slider2');

slider1.addEventListener('slider-input', (e) => {
  slider2.setValue(100 - e.detail.value); // Inverse relationship
});

slider2.addEventListener('slider-input', (e) => {
  slider1.setValue(100 - e.detail.value);
});
```

### Value Constraints

```javascript
// Ensure minimum difference between two sliders
const minSlider = document.getElementById('range-min');
const maxSlider = document.getElementById('range-max');
const MIN_GAP = 10;

minSlider.addEventListener('slider-change', (e) => {
  const minVal = e.detail.value;
  const maxVal = maxSlider.getValue();

  if (minVal > maxVal - MIN_GAP) {
    minSlider.setValue(maxVal - MIN_GAP);
  }
});

maxSlider.addEventListener('slider-change', (e) => {
  const maxVal = e.detail.value;
  const minVal = minSlider.getValue();

  if (maxVal < minVal + MIN_GAP) {
    maxSlider.setValue(minVal + MIN_GAP);
  }
});
```

### Saving State

```javascript
// Save to localStorage
const slider = document.getElementById('user-preference');

// Load saved value
const saved = localStorage.getItem('sliderValue');
if (saved) {
  slider.setValue(parseFloat(saved));
}

// Save on change
slider.addEventListener('slider-change', (e) => {
  localStorage.setItem('sliderValue', e.detail.value);
});
```

## Best Practices

### Do's
✓ **Always provide labels** for accessibility and context
✓ **Use `slider-change` event** for expensive operations (API calls, heavy calculations)
✓ **Use `slider-input` event** for real-time visual updates
✓ **Show tick marks** when discrete steps are important
✓ **Use `show-value-in-thumb`** for sliders with wide ranges
✓ **Test keyboard navigation** for accessibility
✓ **Use appropriate step values** (integers for counts, decimals for percentages)
✓ **Provide visual feedback** with icons and colors

### Don'ts
✗ **Don't omit labels** - they're crucial for accessibility
✗ **Don't use `slider-input`** for database saves or API calls
✗ **Don't set min > max** - validate your ranges
✗ **Don't use tiny steps** with large ranges (e.g., step=0.01 with range 0-10000)
✗ **Don't forget form names** when using in forms
✗ **Don't ignore touch users** - ensure thumb is large enough

### Responsive Design

```css
/* Mobile-friendly sliders */
@media (max-width: 768px) {
  t-sld {
    /* Larger touch targets */
    --t-sld-thumb-size: 20px;
    --t-sld-track-height: 16px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  t-sld {
    --t-sld-track-border: #fff;
    --t-sld-thumb-border: #fff;
  }
}
```

## Performance Optimization

### Built-in Optimizations
- **Efficient rendering**: Lit's reactive system only updates changed parts
- **Memory management**: Automatic cleanup of document listeners on disconnect
- **Event delegation**: Single document listener for all drag events
- **Debounced updates**: Smooth dragging without excessive renders

### Developer Tips

```javascript
// Good: Debounce expensive operations
let debounceTimer;
slider.addEventListener('slider-input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    expensiveOperation(e.detail.value);
  }, 100);
});

// Better: Use slider-change for final values
slider.addEventListener('slider-change', (e) => {
  expensiveOperation(e.detail.value);
});

// Batch updates for multiple sliders
const updates = new Map();
sliders.forEach(slider => {
  slider.addEventListener('slider-input', (e) => {
    updates.set(slider.id, e.detail.value);
    requestAnimationFrame(() => {
      if (updates.size > 0) {
        batchProcess(updates);
        updates.clear();
      }
    });
  });
});
```

### Large Scale Usage

When using many sliders (50+):
- Consider virtual scrolling for slider lists
- Use `show-value-in-thumb` instead of separate value displays
- Minimize use of `smooth` attribute for better performance
- Batch API calls when multiple sliders change

## Troubleshooting

### Common Issues

**Slider value doesn't update:**
- Check that value is within min/max range
- Ensure value is a number, not a string
- Verify the slider isn't disabled

**Icons not showing:**
- Verify phosphor-icons.js is imported
- Use exact icon names (e.g., "speakerHighIcon" not "speaker-high")
- Check browser console for import errors

**Form submission doesn't include slider value:**
- Add `name` attribute to the slider
- Ensure form element properly wraps the slider
- Check browser support for ElementInternals

**Vertical slider layout issues:**
- Set explicit height on container
- Ensure parent has `display: flex` if needed
- Check for conflicting CSS

**Touch dragging not working:**
- Verify no parent element is preventing touch events
- Check for `pointer-events: none` in CSS
- Test without any touch gesture libraries

### Debug Mode

```javascript
// Enable component logging
localStorage.setItem('debug', 'TSliderLit:*');

// Check slider state
const slider = document.querySelector('t-sld');
console.log({
  value: slider.getValue(),
  min: slider.min,
  max: slider.max,
  step: slider.step,
  disabled: slider.disabled
});
```

## API Quick Reference

### Attributes
```html
<t-sld
  label="string"              <!-- Label text -->
  icon="phosphorIconName"     <!-- Icon from phosphor-icons.js -->
  min="number"                <!-- Minimum value (default: 0) -->
  max="number"                <!-- Maximum value (default: 100) -->
  value="number"              <!-- Current value (default: 50) -->
  step="number"               <!-- Step increment (default: 1) -->
  size="compact|default|large" <!-- Size variant -->
  fill-color="default|bright|dim|dark" <!-- Fill color variant -->
  show-ticks                   <!-- Show tick marks -->
  show-value                   <!-- Show value display (default: true) -->
  show-input                   <!-- Show editable input field -->
  show-output                  <!-- Show read-only output field -->
  show-value-in-thumb          <!-- Display value in thumb -->
  vertical                     <!-- Vertical orientation -->
  smooth                       <!-- Smooth dragging -->
  minimal                      <!-- Minimal styling -->
  disabled                     <!-- Disable interaction -->
  name="string"               <!-- Form field name -->
>
</t-sld>
```

### Methods
```javascript
slider.setValue(75);           // Set value
slider.getValue();             // Get value
slider.increment();            // Increase by step
slider.decrement();            // Decrease by step
slider.setRange(0, 200);       // Update min/max
```

### Events
```javascript
slider.addEventListener('slider-input', handler);  // During drag
slider.addEventListener('slider-change', handler); // After drag
// Event detail: { value: number }
```

## Version History

- **1.0.0** - Initial release
  - Full FORM-ADVANCED profile compliance
  - Complete Phosphor icons integration
  - Multiple display modes (input, output, in-thumb)
  - Fill color variants
  - Size variants (compact, default, large)
  - Vertical orientation support
  - Form participation via ElementInternals
  - Comprehensive keyboard navigation
  - Touch and mouse drag support

## Slots

None.

