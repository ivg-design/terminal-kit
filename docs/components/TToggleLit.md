# TToggleLit Component Documentation

## Overview

`TToggleLit` is a fully-featured toggle/checkbox component built with LitElement that provides switch and checkbox variants with extensive customization options. It follows the Terminal Kit design system and implements the FORM-ADVANCED profile specification.

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [CSS Custom Properties](#css-custom-properties)
- [Variants](#variants)
- [Examples](#examples)
- [Form Integration](#form-integration)
- [Accessibility](#accessibility)

## Installation

```javascript
// Import component
import './js/components/TToggleLit.js';

// Import with manifest (for tooling/documentation)
import { TToggleLit, TToggleManifest } from './js/components/TToggleLit.js';
```

## Basic Usage

```html
<!-- Basic toggle switch -->
<t-tog label="Enable feature"></t-tog>

<!-- Checkbox variant -->
<t-tog variant="checkbox" label="Accept terms"></t-tog>

<!-- With icons -->
<t-tog icon-on="✓" icon-off="✗" label="Status"></t-tog>

<!-- Equal states toggle -->
<t-tog equal-states label-on="DARK" label-off="LIGHT"></t-tog>
```

## Properties

### Required Properties

| Property | Type | Default | Attribute | Description |
|----------|------|---------|-----------|-------------|
| `label` | `String` | `''` | `label` | Main label text for the toggle |

### Optional Properties

| Property | Type | Default | Attribute | Description |
|----------|------|---------|-----------|-------------|
| `labelOn` | `String` | `''` | `label-on` | Label text when checked (switches with state) |
| `labelOff` | `String` | `''` | `label-off` | Label text when unchecked (switches with state) |
| `checked` | `Boolean` | `false` | `checked` | Current checked state |
| `disabled` | `Boolean` | `false` | `disabled` | Disabled state |
| `required` | `Boolean` | `false` | `required` | Required field for form validation |
| `variant` | `String` | `'switch'` | `variant` | Visual variant: 'switch' or 'checkbox' |
| `size` | `String` | `'medium'` | `size` | Size variant: 'small', 'medium', 'large' |
| `iconOn` | `String` | `''` | `icon-on` | Icon/symbol for checked state |
| `iconOff` | `String` | `''` | `icon-off` | Icon/symbol for unchecked state |
| `equalStates` | `Boolean` | `false` | `equal-states` | Both states appear as "on" with inverted styling |
| `labelPosition` | `String` | `'right'` | `label-position` | Position of label: 'left' or 'right' |
| `alignment` | `String` | `'left'` | `alignment` | Checkbox alignment: 'left' or 'right' |
| `colorScheme` | `String` | `''` | `color-scheme` | Color variant: 'error', 'warning', 'success' |
| `loading` | `Boolean` | `false` | `loading` | Loading state with animation |

## Methods

### Public Methods

#### `toggle()`
Toggles the checked state.

```javascript
const toggle = document.querySelector('t-tog');
toggle.toggle();
```

#### `check()`
Sets the toggle to checked state.

```javascript
toggle.check();
```

#### `uncheck()`
Sets the toggle to unchecked state.

```javascript
toggle.uncheck();
```

#### `setValue(value)`
Sets the value programmatically.

**Parameters:**
- `value` (Boolean|String): The value to set ('on', 'off', true, false)

```javascript
toggle.setValue(true);
toggle.setValue('on');
```

#### `getValue()`
Gets the current value.

**Returns:** String - 'on' if checked, 'off' if unchecked

```javascript
const value = toggle.getValue(); // 'on' or 'off'
```

#### `focus()`
Focuses the toggle element.

```javascript
toggle.focus();
```

#### `blur()`
Removes focus from the toggle element.

```javascript
toggle.blur();
```

## Events

### `toggle-change`
Fired when the toggle state changes.

**Event Detail:**
- `checked` (Boolean): The new checked state

```javascript
toggle.addEventListener('toggle-change', (e) => {
  console.log('Toggle changed to:', e.detail.checked);
});
```

## CSS Custom Properties

### Color Variables

| Property | Default | Description |
|----------|---------|-------------|
| `--t-tog-bg` | `#000000` | Background color of unchecked toggle |
| `--t-tog-border` | `#333333` | Border color of unchecked toggle |
| `--t-tog-thumb` | `#666666` | Thumb color when unchecked |
| `--t-tog-label` | `#999999` | Label color when unchecked |
| `--t-tog-checked-bg` | `#005520` | Background color when checked |
| `--t-tog-checked-border` | `#00ff41` | Border color when checked |
| `--t-tog-thumb-checked` | `#00ff41` | Thumb color when checked |
| `--t-tog-label-checked` | `#00ff41` | Label color when checked |
| `--t-tog-glow` | `#00ff4133` | Glow effect color |
| `--t-tog-disabled-opacity` | `0.5` | Opacity when disabled |

## Variants

### Switch Variant (Default)
Standard toggle switch with sliding thumb.

```html
<t-tog label="Enable notifications"></t-tog>
```

### Checkbox Variant
Traditional checkbox style.

```html
<t-tog variant="checkbox" label="Subscribe to newsletter"></t-tog>
```

### Equal States
Both states appear as "on" - useful for mode selection.

```html
<t-tog equal-states label-on="DARK" label-off="LIGHT"></t-tog>
```

## Examples

### Basic Examples

```html
<!-- Simple toggle -->
<t-tog label="Auto-save"></t-tog>

<!-- Checked by default -->
<t-tog label="Dark mode" checked></t-tog>

<!-- Disabled state -->
<t-tog label="Premium feature" disabled></t-tog>

<!-- Required field -->
<t-tog label="Accept terms" required></t-tog>
```

### Icon Examples

```html
<!-- Icon only -->
<t-tog icon-on="♥" icon-off="♡"></t-tog>

<!-- Icon with label -->
<t-tog icon-on="●" icon-off="○" label="Notifications"></t-tog>

<!-- Switching icons -->
<t-tog icon-on="+" icon-off="-"></t-tog>
```

### Label Switching

```html
<!-- Label changes with state -->
<t-tog label-on="ONLINE" label-off="OFFLINE"></t-tog>

<!-- Combined with icons -->
<t-tog
  icon-on="●"
  icon-off="○"
  label-on="Connected"
  label-off="Disconnected">
</t-tog>
```

### Size Variants

```html
<!-- Small -->
<t-tog label="Compact" size="small"></t-tog>

<!-- Medium (default) -->
<t-tog label="Standard" size="medium"></t-tog>

<!-- Large -->
<t-tog label="Large" size="large"></t-tog>
```

### Checkbox Groups

```html
<!-- Left aligned checkboxes -->
<div style="display: flex; flex-direction: column; gap: 10px;">
  <t-tog variant="checkbox" alignment="left" label="Option 1"></t-tog>
  <t-tog variant="checkbox" alignment="left" label="Option 2"></t-tog>
  <t-tog variant="checkbox" alignment="left" label="Option 3"></t-tog>
</div>

<!-- Right aligned checkboxes (label-checkbox order) -->
<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
  <t-tog variant="checkbox" alignment="right" label="Setting A"></t-tog>
  <t-tog variant="checkbox" alignment="right" label="Setting B"></t-tog>
  <t-tog variant="checkbox" alignment="right" label="Setting C"></t-tog>
</div>
```

### Color Schemes

```html
<!-- Default -->
<t-tog variant="checkbox" label="Default" checked></t-tog>

<!-- Error state -->
<t-tog variant="checkbox" color-scheme="error" label="Error" checked></t-tog>

<!-- Warning state -->
<t-tog variant="checkbox" color-scheme="warning" label="Warning" checked></t-tog>

<!-- Success state -->
<t-tog variant="checkbox" color-scheme="success" label="Success" checked></t-tog>
```

### Equal State Toggles

```html
<!-- Mode selection -->
<t-tog equal-states label-on="PRODUCTION" label-off="DEVELOPMENT"></t-tog>

<!-- View toggle -->
<t-tog equal-states label-on="GRID" label-off="LIST"></t-tog>

<!-- With icons -->
<t-tog equal-states icon-on="▶" icon-off="||" label-on="PLAY" label-off="PAUSE"></t-tog>
```

## Form Integration

The component implements the ElementInternals API for native form participation.

```html
<form id="settings-form">
  <t-tog id="notifications" label="Enable notifications"></t-tog>
  <t-tog id="newsletter" variant="checkbox" label="Subscribe"></t-tog>
  <t-tog id="theme" equal-states label-on="DARK" label-off="LIGHT"></t-tog>

  <button type="submit">Save Settings</button>
</form>

<script>
document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Get values from toggles directly
  const notifications = document.getElementById('notifications').getValue();
  const newsletter = document.getElementById('newsletter').getValue();
  const theme = document.getElementById('theme').getValue();

  console.log('notifications:', notifications); // 'on' or 'off'
  console.log('newsletter:', newsletter); // 'on' or 'off'
  console.log('theme:', theme); // 'on' or 'off'
});
</script>
```

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` | Toggle checked state |
| `Enter` | Toggle checked state |
| `Tab` | Focus next element |
| `Shift+Tab` | Focus previous element |

### ARIA Support

- Proper `role="switch"` via ElementInternals API
- `aria-checked` state management
- `aria-label` for screen readers
- `aria-disabled` for disabled state
- `aria-required` for required fields

### Screen Reader Support

The component provides comprehensive screen reader support with proper announcements for:
- State changes
- Label text
- Required field status
- Disabled state

## Advanced Usage

### Programmatic Control

```javascript
// Get all toggles
const toggles = document.querySelectorAll('t-tog');

// Set all to checked
toggles.forEach(toggle => toggle.check());

// Toggle all
toggles.forEach(toggle => toggle.toggle());

// Listen to changes
toggles.forEach(toggle => {
  toggle.addEventListener('toggle-change', (e) => {
    console.log(`${toggle.label} changed to ${e.detail.checked}`);
  });
});
```

### Dynamic Property Updates

```javascript
const toggle = document.querySelector('t-tog');

// Change size dynamically
toggle.size = 'large';

// Update labels
toggle.labelOn = 'Active';
toggle.labelOff = 'Inactive';

// Change color scheme
toggle.colorScheme = 'success';

// Enable equal states
toggle.equalStates = true;
```

### Custom Styling

```css
/* Override default colors */
t-tog {
  --t-tog-checked-bg: #0066cc;
  --t-tog-checked-border: #0099ff;
  --t-tog-thumb-checked: #ffffff;
  --t-tog-label-checked: #0099ff;
  --t-tog-glow: rgba(0, 153, 255, 0.3);
}

/* Custom size */
t-tog.custom-size {
  --toggle-width: 60px;
  --toggle-height: 30px;
  --thumb-size: 24px;
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14.1+
- Edge 90+

The component uses modern web APIs including:
- Custom Elements v1
- Shadow DOM v1
- CSS Custom Properties
- ElementInternals API

## Migration Guide

### From Old TerminalToggle Component

```html
<!-- Old -->
<terminal-toggle label="Feature"></terminal-toggle>

<!-- New -->
<t-tog label="Feature"></t-tog>

<!-- Old with icons -->
<terminal-toggle on-icon="✓" off-icon="✗"></terminal-toggle>

<!-- New with icons -->
<t-tog icon-on="✓" icon-off="✗"></t-tog>
```

## Best Practices

1. **Always provide labels** for accessibility
2. **Use semantic color schemes** (error, warning, success) appropriately
3. **Group related checkboxes** with consistent alignment
4. **Use equal-states** for mutually exclusive binary choices
5. **Provide visual feedback** for loading states
6. **Test keyboard navigation** in your forms
7. **Use appropriate sizes** based on touch targets (mobile vs desktop)

## Troubleshooting

### Toggle not responding
- Check if `disabled` attribute is set
- Verify JavaScript is loaded
- Check browser console for errors

### Form data not submitting
- Ensure `name` attribute is set
- Verify form has proper `id` or wrapping
- Check that component is properly registered

### Styling issues
- Verify CSS custom properties are set correctly
- Check for conflicting global styles
- Ensure shadow DOM styles are not being overridden

## Component Schema Compliance

This component follows the Terminal Kit COMPONENT_SCHEMA.md specification:
- **Profile**: FORM-ADVANCED
- **Schema Version**: 1.0.0
- **Blocks**: All 13 required blocks implemented
- **Testing**: 95.74% code coverage
- **Documentation**: Comprehensive with examples
- **Accessibility**: WCAG 2.1 AA compliant