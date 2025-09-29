# TStatusFieldLit API Reference

## Component Definition

```javascript
import { TStatusFieldLit } from './js/components/TStatusFieldLit.js';
```

**Tag Name:** `<t-sta-field>`
**Class:** `TStatusFieldLit`
**Extends:** `LitElement`
**Version:** 1.0.0
**Category:** Display
**Profile:** CORE

## Overview

TStatusFieldLit is a reusable atomic component for displaying status information with a label and value. While originally designed for use within TStatusBarLit, it's a standalone component that can be composed into any container or UI element that needs to display status information.

### Key Design Principles

1. **Atomic Component** - Self-contained with its own styling and behavior
2. **Composable** - Can be used in various contexts, not limited to status bars
3. **Lightweight** - Minimal overhead, primarily for display purposes
4. **Consistent** - Ensures uniform status display across the application

## Properties

| Property | Attribute | Type | Default | Reflects | Description |
|----------|-----------|------|---------|----------|-------------|
| `label` | `label` | `string` | `''` | ✅ | Field label text |
| `value` | `value` | `string` | `''` | ✅ | Field value (always displayed) |
| `icon` | `icon` | `string` | `''` | ✅ | SVG string for icon display |
| `width` | `width` | `string` | `'auto'` | ✅ | Field width (auto, percentage, or pixels) |
| `align` | `align` | `'left' \| 'center' \| 'right'` | `'left'` | ✅ | Text alignment within the field |
| `displayMode` | `display-mode` | `string` | `'text'` | ✅ | Display mode for field rendering |

### Display Modes

- `'text'` - Shows label and value (default)
- `'icon'` - Shows icon and value only
- `'icon-text'` - Shows icon, label, and value
- `'compact'` - Minimal spacing
- `'label-only'` - Only displays the label
- `'value-only'` - Only displays the value

## Methods

### `receiveContext(context)`

Receives configuration context from parent container components.

**Signature:**
```typescript
receiveContext(context: any): void
```

**Parameters:**
- `context` - Configuration object from parent container

**Note:** This method is primarily used internally by container components like TStatusBarLit for context propagation.

## Usage Scenarios

### 1. Within Status Bars (Original Use Case)

The primary design use case - nested within TStatusBarLit:

```html
<t-sta>
  <t-sta-field label="CPU" value="42%" width="25%"></t-sta-field>
  <t-sta-field label="Memory" value="1.2GB" width="30%"></t-sta-field>
  <t-sta-field label="Network" value="Connected" width="45%"></t-sta-field>
</t-sta>
```

### 2. In Panel Headers

Display status information in panel headers:

```html
<t-panel>
  <div slot="header" class="panel-header">
    <h2>System Monitor</h2>
    <div class="status-fields">
      <t-sta-field label="Status" value="Active" icon="${checkIcon}"></t-sta-field>
      <t-sta-field label="Uptime" value="24d 3h" align="right"></t-sta-field>
    </div>
  </div>
  <div slot="content">
    <!-- Panel content -->
  </div>
</t-panel>
```

### 3. In Card Components

Add metadata to card footers:

```html
<div class="card">
  <div class="card-content">
    <h3>Document.pdf</h3>
  </div>
  <div class="card-footer">
    <t-sta-field label="Size" value="1.2MB" display-mode="compact"></t-sta-field>
    <t-sta-field label="Modified" value="2 hours ago"></t-sta-field>
    <t-sta-field label="Owner" value="Admin" icon="${userIcon}"></t-sta-field>
  </div>
</div>
```

### 4. In Custom Toolbars

Create consistent toolbar status displays:

```html
<div class="app-toolbar">
  <div class="toolbar-left">
    <button>File</button>
    <button>Edit</button>
  </div>
  <div class="toolbar-right">
    <t-sta-field label="User" value="john.doe" icon="${userIcon}"></t-sta-field>
    <t-sta-field label="Mode" value="Editor" display-mode="value-only"></t-sta-field>
    <t-sta-field value="14:30" display-mode="value-only"></t-sta-field>
  </div>
</div>
```

### 5. In List Items

Display item metadata in lists:

```html
<ul class="file-list">
  <li class="file-item">
    <span class="file-name">report.xlsx</span>
    <t-sta-field label="Size" value="524KB" display-mode="compact"></t-sta-field>
    <t-sta-field value="Yesterday" display-mode="value-only"></t-sta-field>
  </li>
  <li class="file-item">
    <span class="file-name">presentation.pptx</span>
    <t-sta-field label="Size" value="2.1MB" display-mode="compact"></t-sta-field>
    <t-sta-field value="2 days ago" display-mode="value-only"></t-sta-field>
  </li>
</ul>
```

### 6. In Form Status Indicators

Show form validation or status information:

```html
<form>
  <div class="form-group">
    <label>Username</label>
    <input type="text" name="username">
    <t-sta-field
      label="Status"
      value="Available"
      icon="${checkCircleIcon}"
      display-mode="icon-text">
    </t-sta-field>
  </div>

  <div class="form-footer">
    <t-sta-field label="Fields" value="3/5 completed"></t-sta-field>
    <t-sta-field label="Saved" value="Draft" align="right"></t-sta-field>
  </div>
</form>
```

### 7. In Dashboard Widgets

Create consistent metric displays:

```html
<div class="dashboard-widget">
  <h3>Server Status</h3>
  <div class="metrics">
    <t-sta-field
      label="CPU"
      value="42%"
      icon="${cpuIcon}"
      display-mode="icon-text"
      width="33%">
    </t-sta-field>
    <t-sta-field
      label="RAM"
      value="8.2GB"
      icon="${memoryIcon}"
      display-mode="icon-text"
      width="33%">
    </t-sta-field>
    <t-sta-field
      label="Disk"
      value="67%"
      icon="${diskIcon}"
      display-mode="icon-text"
      width="34%">
    </t-sta-field>
  </div>
</div>
```

### 8. Dynamic Status Updates

Update field values programmatically:

```javascript
// Get reference to field
const cpuField = document.querySelector('#cpu-field');

// Update value dynamically
setInterval(() => {
  const cpuUsage = Math.random() * 100;
  cpuField.value = `${cpuUsage.toFixed(1)}%`;

  // Change icon based on value
  if (cpuUsage > 80) {
    cpuField.icon = warningIcon;
  } else {
    cpuField.icon = normalIcon;
  }
}, 1000);
```

## Styling

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--terminal-green` | `#00ff41` | Primary text color |
| `--terminal-green-dim` | `#00ff4180` | Dimmed label color |
| `--terminal-font` | `'IBM Plex Mono', monospace` | Font family |
| `--terminal-font-size` | `14px` | Font size |

### Custom Styling Example

```css
/* Custom theme for status fields */
t-sta-field {
  --terminal-green: #00bcd4;
  --terminal-green-dim: #00bcd466;
  --terminal-font-size: 12px;
}

/* Different styles for different contexts */
.panel-header t-sta-field {
  --terminal-font-size: 11px;
}

.dashboard-widget t-sta-field {
  --terminal-green: #4caf50;
  --terminal-font-size: 16px;
}
```

## Composition Patterns

### Pattern 1: Status Field Groups

Group related fields together:

```html
<div class="status-group">
  <t-sta-field label="Environment" value="Production"></t-sta-field>
  <span class="separator">|</span>
  <t-sta-field label="Region" value="US-East"></t-sta-field>
  <span class="separator">|</span>
  <t-sta-field label="Version" value="2.1.0"></t-sta-field>
</div>
```

### Pattern 2: Responsive Fields

Adjust display based on screen size:

```html
<t-sta-field
  class="responsive-field"
  label="Temperature"
  value="72°F"
  display-mode="icon-text">
</t-sta-field>

<style>
  @media (max-width: 768px) {
    .responsive-field {
      --terminal-font-size: 10px;
    }
    .responsive-field[display-mode="icon-text"] {
      display-mode: icon; /* Simplified on mobile */
    }
  }
</style>
```

### Pattern 3: Conditional Rendering

Show fields based on state:

```javascript
function renderStatusFields(status) {
  const container = document.querySelector('.status-container');
  container.innerHTML = '';

  if (status.connected) {
    const field = document.createElement('t-sta-field');
    field.label = 'Status';
    field.value = 'Connected';
    field.icon = onlineIcon;
    container.appendChild(field);
  } else {
    const field = document.createElement('t-sta-field');
    field.label = 'Status';
    field.value = 'Offline';
    field.icon = offlineIcon;
    container.appendChild(field);
  }
}
```

## Best Practices

### 1. Use Semantic Labels

```html
<!-- Good: Clear, descriptive labels -->
<t-sta-field label="CPU Usage" value="42%"></t-sta-field>

<!-- Poor: Ambiguous labels -->
<t-sta-field label="Val" value="42"></t-sta-field>
```

### 2. Consistent Display Modes

When using multiple fields together, maintain consistent display modes:

```html
<!-- Good: Consistent display modes -->
<div class="metrics">
  <t-sta-field label="CPU" value="42%" display-mode="icon-text"></t-sta-field>
  <t-sta-field label="RAM" value="8GB" display-mode="icon-text"></t-sta-field>
  <t-sta-field label="Disk" value="67%" display-mode="icon-text"></t-sta-field>
</div>
```

### 3. Appropriate Width Settings

```html
<!-- Good: Defined widths for layout control -->
<t-sta-field label="Name" value="John" width="33%"></t-sta-field>

<!-- Be careful with auto width in constrained spaces -->
<t-sta-field label="LongLabel" value="LongValue" width="auto"></t-sta-field>
```

### 4. Icon Usage

Use icons to enhance recognition:

```javascript
// Map status to appropriate icons
const statusIcons = {
  'success': checkIcon,
  'warning': warningIcon,
  'error': errorIcon,
  'info': infoIcon
};

field.icon = statusIcons[status] || defaultIcon;
```

## Accessibility

- Fields are semantic HTML with proper text content
- Icons are decorative and don't replace text information
- Labels provide context for screen readers
- Color is not the only indicator of meaning

## Performance Considerations

1. **Lightweight** - Minimal JavaScript overhead
2. **No State Management** - Simple property binding
3. **Efficient Rendering** - Only re-renders on property changes
4. **Small Bundle Size** - Minimal dependencies

## Migration Guide

### From Plain HTML/CSS

Before:
```html
<div class="status-field">
  <span class="label">CPU:</span>
  <span class="value">42%</span>
</div>
```

After:
```html
<t-sta-field label="CPU" value="42%"></t-sta-field>
```

### From Other Status Components

```javascript
// Replace custom status displays
const oldStatus = document.querySelector('.custom-status');
const newField = document.createElement('t-sta-field');
newField.label = oldStatus.querySelector('.label').textContent;
newField.value = oldStatus.querySelector('.value').textContent;
oldStatus.replaceWith(newField);
```

## TypeScript Definitions

```typescript
interface TStatusFieldLit extends LitElement {
  label: string;
  value: string;
  icon: string;
  width: string;
  align: 'left' | 'center' | 'right';
  displayMode: 'text' | 'icon' | 'icon-text' | 'compact' | 'label-only' | 'value-only';

  receiveContext(context: any): void;
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Web Components support

## See Also

- [TStatusBarLit Component Guide](./TStatusBarLit.md) - Container component for status fields
- [TStatusBarLit API Reference](./TStatusBarLit-API.md) - Technical API documentation
- [TPanelLit](./TPanelLit.md) - Panel component that can host status fields
- [Terminal Kit Component Guidelines](../COMPONENT_SCHEMA.md) - Component architecture