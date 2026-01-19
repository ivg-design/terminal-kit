# TChartLit

A data visualization component with terminal styling, supporting bar charts, line charts, pie charts, and various display options.

## Tag Name

`t-chart`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-chart` |
| version | `3.0.0` |
| category | `Display` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `type` | `String` | `'bar'` | Yes | Chart type: `'bar'`, `'line'`, `'pie'`, `'donut'` |
| `data` | `Array` | `[]` | No | Chart data array |
| `orientation` | `String` | `'vertical'` | Yes | Bar orientation: `'vertical'` or `'horizontal'` |
| `showLegend` | `Boolean` | `false` | Yes | Display legend |
| `showLabels` | `Boolean` | `true` | Yes | Display data labels |
| `showTooltips` | `Boolean` | `true` | Yes | Enable hover tooltips |
| `showGrid` | `Boolean` | `true` | Yes | Show background grid |
| `animated` | `Boolean` | `true` | Yes | Enable animations |
| `height` | `String` | `'200px'` | No | Chart height (CSS value) |
| `colors` | `Array` | `[]` | No | Custom color palette |
| `title` | `String` | `''` | No | Chart title |
| `monochrome` | `Boolean` | `false` | Yes | Use single-color scheme |
| `baseColor` | `String` | `'#00ff41'` | No | Base color for monochrome mode |
| `colorScheme` | `String` | `'terminal'` | Yes | Color scheme preset: `'terminal'`, `'neon'`, `'cool'`, `'warm'`, `'grayscale'` |

### Data Object Structure

```javascript
// For bar/line/area charts
[
  { label: 'January', value: 120 },
  { label: 'February', value: 150 },
  { label: 'March', value: 180 }
]

// For pie/donut charts
[
  { label: 'Desktop', value: 60, color: '#00ff41' },
  { label: 'Mobile', value: 30, color: '#00d4ff' },
  { label: 'Tablet', value: 10, color: '#ff6b6b' }
]
```

## Methods

### setData(data)
Update chart data.

**Parameters:**
- `data` (Array): New data array

### getColor(index)
Get color for a data point.

**Parameters:**
- `index` (Number): Data index

**Returns:** `String` - Color value

## Events

### segment-click
Fired when a chart segment is clicked.

```javascript
{
  detail: {
    item: { label: 'January', value: 120 },
    index: 0,
    label: 'January',
    value: 120
  }
}
```

### segment-hover
Fired when hovering over a segment.

```javascript
{
  detail: {
    item: { label: 'January', value: 120 },
    index: 0,
    entering: true // true when mouse enters, false when mouse leaves
  }
}
```

## Examples

### Basic Bar Chart

```html
<t-chart
  type="bar"
  title="Monthly Sales"
  .data=${[
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 180 },
    { label: 'Apr', value: 140 }
  ]}>
</t-chart>
```

### Horizontal Bar Chart

```html
<t-chart
  type="bar"
  orientation="horizontal"
  .data=${data}>
</t-chart>
```

### Line Chart

```html
<t-chart
  type="line"
  title="Temperature"
  show-grid
  .data=${[
    { label: 'Mon', value: 22 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 21 },
    { label: 'Thu', value: 25 },
    { label: 'Fri', value: 23 }
  ]}>
</t-chart>
```

### Pie Chart

```html
<t-chart
  type="pie"
  title="Market Share"
  .data=${[
    { label: 'Chrome', value: 65 },
    { label: 'Firefox', value: 15 },
    { label: 'Safari', value: 12 },
    { label: 'Other', value: 8 }
  ]}>
</t-chart>
```

### Donut Chart

```html
<t-chart
  type="donut"
  title="Budget Allocation"
  .data=${budgetData}>
</t-chart>
```

### Monochrome Styling

```html
<t-chart
  type="bar"
  monochrome
  base-color="#00ff41"
  .data=${data}>
</t-chart>
```

### Custom Colors

```html
<t-chart
  type="bar"
  .colors=${['#00ff41', '#00d4ff', '#ff6b6b', '#ffd93d']}
  .data=${data}>
</t-chart>
```

### Minimal Chart (No Legend/Grid)

```html
<t-chart
  type="line"
  .showLegend=${false}
  .showGrid=${false}
  .showLabels=${false}
  height="150"
  .data=${sparklineData}>
</t-chart>
```

### Programmatic Control

```javascript
const chart = document.querySelector('t-chart');

// Update data
chart.setData([
  { label: 'Q1', value: 100 },
  { label: 'Q2', value: 150 },
  { label: 'Q3', value: 200 },
  { label: 'Q4', value: 175 }
]);

// Get color
const color = chart.getColor(2);

// Listen for interactions
chart.addEventListener('segment-click', (e) => {
  console.log('Clicked:', e.detail.item.label, e.detail.item.value);
});

chart.addEventListener('segment-hover', (e) => {
  console.log('Hovering:', e.detail.item.label);
});
```

## Slots

None.


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--t-chart-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--t-chart-border` | `var(--terminal-gray-dark)` | Border color |
| `--t-chart-color` | `var(--terminal-green)` | Primary chart color |
| `--t-chart-hover` | `rgba(0, 255, 65, 0.1)` | Hover background color |

## Related Components

- [TProgressLit](./TProgressLit.md) - Progress indicators
