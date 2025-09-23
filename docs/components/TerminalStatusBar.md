# TerminalStatusBar Component

## Description
A flexible status bar component with dynamic fields, alignment control, and marquee support for displaying information in a horizontal bar layout.

## Tag Name
`<terminal-status-bar>`

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| separator | string | "\|" | Separator character between fields |

## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| setFields(fields) | Array&lt;FieldConfig&gt; | void | Set all fields at once |
| addField(config) | FieldConfig | void | Add a new status field |
| updateField(index, updates) | number, Object | void | Update field properties at index |
| removeField(index) | number | void | Remove field at index |
| clearFields() | none | void | Remove all fields |
| setSeparator(separator) | string | void | Set separator character |
| updateFieldValue(index, value) | number, string | void | Update only the value of a field |
| updateFieldLabel(index, label) | number, string | void | Update only the label of a field |
| enableFieldMarquee(index) | number | void | Enable marquee for a field |
| disableFieldMarquee(index) | number | void | Disable marquee for a field |

## Field Configuration

```javascript
{
  label: 'CPU',           // Field label text
  value: '42%',           // Field value text
  width: '25%',           // Width: percentage ('25%'), pixels ('100px'), or 'auto'
  align: 'left',          // Alignment: 'left', 'center', 'right'
  marquee: false,         // Enable marquee scrolling for long text
  marqueeSpeed: 30,       // Marquee scroll speed (pixels per second)
  icon: '<svg>...</svg>', // Optional SVG icon HTML
  displayMode: 'text'     // Display mode: 'text', 'icon', 'icon-text'
}
```

### Width Control
- **Percentage**: `'25%'` - Takes 25% of available width
- **Pixels**: `'100px'` - Fixed pixel width  
- **Auto**: `'auto'` - Shrinks to content size (default)
- **Validation**: Total widths automatically scaled down if exceeding 95%

### Alignment Control
- **`'left'`**: Default alignment
- **`'right'`**: First right-aligned field gets `margin-left: auto`, pushing subsequent fields right
- **`'center'`**: Isolated center fields get auto margins on both sides
- Uses flexbox with `justify-content: space-between` for optimal spacing

### Marquee Features
- Automatically activates when text overflows field width
- Maintains field width when marquee is enabled/disabled
- Font size remains consistent during marquee animation
- Configurable scroll speed with `marqueeSpeed` parameter

## CSS Classes

| Class | Description |
|-------|-------------|
| .terminal-status-bar | Component container |
| .status-bar | Bar container with flexbox layout |
| .status-field | Individual field container |
| .status-field.has-width | Field with explicit width |
| .status-field.marquee-active | Field with active marquee |
| .status-field.push-left | Left margin auto |
| .status-field.push-right | Right margin auto |
| .status-field.push-center | Center margins auto |
| .field-label | Field label element |
| .field-value | Field value element |
| .field-value-wrapper | Value container for marquee |
| .field-icon | Icon container |
| .status-separator | Separator between fields |

## Usage Examples

### Basic Status Bar
```javascript
const statusBar = document.getElementById('myStatusBar');
statusBar.setFields([
  { label: 'CPU', value: '42%', width: '20%' },
  { label: 'Memory', value: '8GB', width: '20%' },
  { label: 'Disk', value: '256GB', width: '25%' },
  { label: 'Status', value: 'Running', width: 'auto', align: 'right' }
]);
```

### With Real-time Data Updates
```javascript
// Update from WebSocket
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  statusBar.updateFieldValue(0, data.cpu + '%');
  statusBar.updateFieldValue(1, data.memory);
  statusBar.updateFieldValue(2, data.disk);
};

// Update from API polling
async function updateStatus() {
  const stats = await fetch('/api/stats').then(r => r.json());
  statusBar.updateFieldValue(0, stats.cpu + '%');
  statusBar.updateFieldValue(1, stats.ram);
  statusBar.updateFieldValue(2, stats.load);
}
setInterval(updateStatus, 5000);
```

### Advanced Configuration with Marquee
```javascript
statusBar.setFields([
  {
    label: 'File',
    value: 'very_long_filename_that_will_scroll_automatically_when_it_overflows_the_container.riv',
    width: '35%',
    align: 'left',
    marquee: true,
    marqueeSpeed: 30,
    icon: folderIcon,
    displayMode: 'icon-text'
  },
  {
    label: 'Frame',
    value: '125 / 300',
    width: '15%',
    align: 'center'
  },
  {
    label: 'FPS',
    value: '60',
    width: '10%',
    align: 'right'
  },
  {
    label: 'Mode',
    value: 'EDIT',
    width: 'auto',
    align: 'right'
  }
]);
```

### Dynamic Field Management
```javascript
// Add a new field
statusBar.addField({
  label: 'Network',
  value: 'Connected',
  width: '15%',
  align: 'right',
  icon: networkIcon
});

// Update specific field properties
statusBar.updateField(2, {
  value: 'Disconnected',
  marquee: true
});

// Remove a field
statusBar.removeField(3);

// Enable marquee for long text
statusBar.enableFieldMarquee(0);

// Change separator
statusBar.setSeparator(' • ');
```

### Integration with Application State
```javascript
// Connect to application events
app.on('fileOpen', (filename) => {
  statusBar.updateFieldValue(0, filename);
  // Enable marquee if filename is long
  if (filename.length > 30) {
    statusBar.enableFieldMarquee(0);
  }
});

app.on('frameChange', (current, total) => {
  statusBar.updateFieldValue(1, `${current} / ${total}`);
});

app.on('fpsUpdate', (fps) => {
  statusBar.updateFieldValue(2, fps.toFixed(0));
});

app.on('modeChange', (mode) => {
  statusBar.updateFieldValue(3, mode.toUpperCase());
});
```

### HTML Usage with Attributes
```html
<terminal-status-bar id="statusBar" separator=" • ">
</terminal-status-bar>
```

## Integration Notes

- **Responsive Design**: Fields automatically adjust within their allocated widths
- **Overflow Protection**: Total widths are automatically scaled to prevent overflow (max 95%)
- **Marquee Behavior**: 
  - Only scrolls when text exceeds field width
  - Maintains consistent field width when toggled
  - Font size stays constant during animation
- **Alignment Strategy**: Uses flexbox with `space-between` and margin-based positioning
- **Performance**: Efficient updates without full re-renders
- **Accessibility**: Maintains readable text during all states

## Common Patterns

### File Editor Status Bar
```javascript
statusBar.setFields([
  { label: 'File', value: filename, width: '40%', marquee: true },
  { label: 'Line', value: '1', width: '10%' },
  { label: 'Col', value: '1', width: '10%' },
  { label: 'Spaces', value: '2', width: '10%' },
  { label: 'UTF-8', value: '', width: 'auto', align: 'right' },
  { label: 'LF', value: '', width: 'auto', align: 'right' }
]);
```

### Media Player Status Bar
```javascript
statusBar.setFields([
  { label: 'Playing', value: songTitle, width: '50%', marquee: true, icon: playIcon },
  { label: 'Time', value: '0:00 / 3:45', width: '20%' },
  { label: 'Volume', value: '75%', width: '15%', align: 'right' },
  { label: 'Quality', value: 'HD', width: 'auto', align: 'right' }
]);
```

### System Monitor Status Bar
```javascript
statusBar.setFields([
  { label: 'CPU', value: '0%', width: '15%', icon: cpuIcon },
  { label: 'RAM', value: '0GB', width: '15%', icon: ramIcon },
  { label: 'GPU', value: '0%', width: '15%', icon: gpuIcon },
  { label: 'Temp', value: '0°C', width: '15%' },
  { label: 'Network', value: '0 Mbps', width: 'auto', align: 'right' }
]);
```