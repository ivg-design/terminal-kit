# TerminalToggle

A versatile toggle switch and checkbox component with terminal styling, supporting multiple layouts, states, icons, and visual variants.

## Tag Name
```html
<terminal-toggle></terminal-toggle>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | boolean | `false` | Toggle/checkbox state |
| `disabled` | boolean | `false` | Disabled state |
| `size` | string | `'default'` | Component size |
| `label` | string | - | Label text |
| `layout` | string | `'label-toggle'` | Layout mode |
| `variant` | string | `'toggle'` | Visual variant (toggle or checkbox) |
| `icon` | string | - | Icon SVG string |
| `on-label` | string | - | Label when ON (switching layouts) |
| `off-label` | string | - | Label when OFF (switching layouts) |
| `on-icon` | string | - | Icon when ON |
| `off-icon` | string | - | Icon when OFF |
| `equal-states` | boolean | `false` | Equal emphasis for both states |
| `error` | boolean | `false` | Error state (checkbox variant only) |

### Sizes
- `small` - Compact size (14px checkbox, smaller toggle)
- `default` - Standard size (18px checkbox)
- `large` - Larger size (24px checkbox, larger toggle)

### Layouts
- `label-toggle` - Label + toggle/checkbox (default)
- `icon-toggle` - Icon + toggle/checkbox
- `icon-label-toggle` - Icon + label + toggle/checkbox
- `switching` - Switching label/icon based on state
- `icon-switching` - Icon-only switching

### Variants
- `toggle` - Traditional toggle switch (default)
- `checkbox` - Square checkbox with checkmark

## Properties

The component uses standard HTML element properties:
- `checked` - Get/set checked state
- `disabled` - Get/set disabled state

## Methods

The component responds to standard DOM methods:
- Click events toggle the state
- Keyboard events (Space/Enter) toggle when focused

## Events

### `change`
Fired when toggle/checkbox state changes (standard change event).

**Example:**
```javascript
toggle.addEventListener('change', (e) => {
  console.log('State changed to:', e.target.checked);
});
```

## CSS Classes

- `terminal-toggle` - Main container
- `checked` - Checked state
- `disabled` - Disabled state
- `small`, `large` - Size modifiers
- `layout-{type}` - Layout modifiers
- `equal-states` - Equal emphasis mode
- `error` - Error state (checkbox only)
- `toggle-switch` - Toggle switch element
- `toggle-checkbox` - Checkbox element
- `toggle-label` - Label element
- `toggle-icon` - Icon element

## Examples

### Basic Toggle
```html
<terminal-toggle label="Enable notifications"></terminal-toggle>
```

### Checkbox Variant
```html
<terminal-toggle
  variant="checkbox"
  label="I agree to terms">
</terminal-toggle>
```

### Error Checkbox
```html
<terminal-toggle
  variant="checkbox"
  error
  label="Invalid selection">
</terminal-toggle>
```

### Checked by Default
```html
<terminal-toggle
  checked
  label="Auto-save enabled">
</terminal-toggle>
```

### Different Sizes
```html
<!-- Toggle sizes -->
<terminal-toggle size="small" label="Small toggle"></terminal-toggle>
<terminal-toggle size="default" label="Default toggle"></terminal-toggle>
<terminal-toggle size="large" label="Large toggle"></terminal-toggle>

<!-- Checkbox sizes (14px, 18px, 24px) -->
<terminal-toggle variant="checkbox" size="small" label="Small checkbox"></terminal-toggle>
<terminal-toggle variant="checkbox" size="default" label="Default checkbox"></terminal-toggle>
<terminal-toggle variant="checkbox" size="large" label="Large checkbox"></terminal-toggle>
```

### Layout Variants
```html
<!-- Label + Toggle (default) -->
<terminal-toggle label="Default layout"></terminal-toggle>

<!-- Icon + Toggle -->
<terminal-toggle layout="icon-toggle" icon="☆"></terminal-toggle>

<!-- Icon + Label + Toggle -->
<terminal-toggle layout="icon-label-toggle" icon="☆" label="Favorite"></terminal-toggle>

<!-- Switching label/icon based on state -->
<terminal-toggle
  layout="switching"
  on-label="Active"
  off-label="Inactive">
</terminal-toggle>

<!-- Icon-only switching -->
<terminal-toggle
  layout="icon-switching"
  on-icon="☀"
  off-icon="☽">
</terminal-toggle>
```

### Equal States Toggle
```html
<!-- For A/B choices where both states are equally important -->
<terminal-toggle
  equal-states
  layout="switching"
  on-label="Work"
  off-label="Personal">
</terminal-toggle>
```

### With Icons
```html
<terminal-toggle id="themeToggle" label="Dark Mode"></terminal-toggle>

<script>
  import { sunIcon, moonIcon } from './phosphor-icons.js';
  
  const toggle = document.getElementById('themeToggle');
  toggle.setIcon(sunIcon, 'off');
  toggle.setIcon(moonIcon, 'on');
</script>
```

### Event Handling
```html
<terminal-toggle 
  id="settingsToggle" 
  label="Advanced Settings">
</terminal-toggle>

<div id="advancedPanel" style="display: none;">
  <!-- Advanced settings content -->
</div>

<script>
  const toggle = document.getElementById('settingsToggle');
  const panel = document.getElementById('advancedPanel');
  
  toggle.addEventListener('toggle-change', (e) => {
    panel.style.display = e.detail.checked ? 'block' : 'none';
  });
</script>
```

### Form Integration with Mixed Variants
```html
<form id="preferencesForm">
  <terminal-toggle
    name="emailNotifications"
    label="Email notifications">
  </terminal-toggle>

  <terminal-toggle
    variant="checkbox"
    name="agreeToTerms"
    label="I agree to the terms">
  </terminal-toggle>

  <terminal-toggle
    variant="checkbox"
    error
    name="invalidOption"
    label="Invalid selection">
  </terminal-toggle>

  <terminal-toggle
    name="darkMode"
    label="Dark mode"
    checked>
  </terminal-toggle>

  <terminal-button type="submit">Save Preferences</terminal-button>
</form>

<script>
  document.getElementById('preferencesForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const preferences = {};
    
    // Toggles only send value when checked
    e.target.querySelectorAll('terminal-toggle').forEach(toggle => {
      const name = toggle.getAttribute('name');
      preferences[name] = toggle.isChecked();
    });
    
    console.log('Preferences:', preferences);
  });
</script>
```

### Theme Switcher with Switching Layout
```html
<terminal-toggle
  id="theme"
  layout="icon-switching"
  equal-states>
</terminal-toggle>

<script>
  import { sunIcon, moonIcon } from './phosphor-icons.js';

  const themeToggle = document.getElementById('theme');

  // Set switching icons
  themeToggle.setAttribute('off-icon', sunIcon);
  themeToggle.setAttribute('on-icon', moonIcon);

  // Check current theme
  const isDark = localStorage.getItem('theme') === 'dark';
  if (isDark) {
    themeToggle.check();
    document.body.classList.add('dark-theme');
  }

  // Handle theme change
  themeToggle.addEventListener('toggle-change', (e) => {
    if (e.detail.checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  });
</script>
```

### Settings Panel
```html
<div class="settings-panel">
  <h3>Display Settings</h3>
  
  <terminal-toggle 
    id="autoplay"
    label="Autoplay videos"
    checked>
  </terminal-toggle>
  
  <terminal-toggle 
    id="subtitles"
    label="Show subtitles">
  </terminal-toggle>
  
  <terminal-toggle 
    id="hd"
    label="HD quality"
    checked>
  </terminal-toggle>
  
  <terminal-button id="applyBtn">Apply Settings</terminal-button>
</div>

<script>
  const settings = {
    autoplay: document.getElementById('autoplay'),
    subtitles: document.getElementById('subtitles'),
    hd: document.getElementById('hd')
  };
  
  document.getElementById('applyBtn').addEventListener('button-click', () => {
    const config = {};
    for (const [key, toggle] of Object.entries(settings)) {
      config[key] = toggle.isChecked();
    }
    
    console.log('Applying settings:', config);
    // Apply settings to video player
  });
</script>
```

### Mixed Toggles and Checkboxes
```html
<div class="settings-group">
  <h3>Settings</h3>

  <!-- Toggle for on/off settings -->
  <terminal-toggle
    label="Enable feature">
  </terminal-toggle>

  <!-- Checkbox for confirmations -->
  <terminal-toggle
    variant="checkbox"
    label="Remember my choice">
  </terminal-toggle>

  <!-- Error checkbox for validation -->
  <terminal-toggle
    variant="checkbox"
    error
    label="Required field missing">
  </terminal-toggle>

  <!-- Equal states toggle for A/B choices -->
  <terminal-toggle
    equal-states
    layout="switching"
    on-label="Production"
    off-label="Development">
  </terminal-toggle>

  <terminal-button id="saveSettings">Save Settings</terminal-button>
</div>

<script>
  const permissions = document.querySelectorAll('.permission');
  
  document.getElementById('grantAll').addEventListener('button-click', () => {
    permissions.forEach(toggle => toggle.check());
  });
  
  document.getElementById('denyAll').addEventListener('button-click', () => {
    permissions.forEach(toggle => toggle.uncheck());
  });
  
  permissions.forEach(toggle => {
    toggle.addEventListener('toggle-change', (e) => {
      const permission = toggle.dataset.permission;
      console.log(`${permission}: ${e.detail.checked ? 'granted' : 'denied'}`);
    });
  });
</script>
```

### Disabled State
```html
<terminal-toggle 
  label="Premium feature" 
  disabled>
</terminal-toggle>

<terminal-button id="upgradeBtn">Upgrade to Premium</terminal-button>

<script>
  const premiumToggle = document.querySelector('[label="Premium feature"]');
  
  document.getElementById('upgradeBtn').addEventListener('button-click', () => {
    // After upgrade process
    premiumToggle.enable();
    premiumToggle.check();
  });
</script>
```

## Keyboard Support

- **Space**: Toggle state when focused
- **Enter**: Toggle state when focused
- **Tab**: Navigate between toggles

## Styling Variables

```css
--terminal-green: #00ff41;
--terminal-blue: #0099ff;
--terminal-red: #ff0041;
--terminal-yellow: #ffcc00;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--toggle-transition: 0.3s ease;
```

## Accessibility

- Keyboard navigation support
- ARIA switch role
- ARIA checked state
- Label association
- Focus indicators
- Screen reader support

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+