# TCalendarLit

A date picker and calendar component with terminal styling, supporting single date selection, date ranges, and multiple view modes.

## Tag Name

`t-cal`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-cal` |
| version | `3.0.0` |
| category | `Form` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `value` | `Object\|String` | `null` | No | Selected date (Date object or ISO string) |
| `mode` | `String` | `'single'` | Yes | Selection mode: `'single'`, `'multiple'`, `'range'` |
| `view` | `String` | `'days'` | Yes | Current view: `'days'`, `'months'`, `'years'` |
| `min` | `String` | `''` | No | Minimum selectable date (ISO string) |
| `max` | `String` | `''` | No | Maximum selectable date (ISO string) |
| `disabled` | `Array` | `[]` | No | Array of disabled dates (ISO strings) |
| `disabledDays` | `Array` | `[]` | No | Array of disabled days of week (0=Sun, 6=Sat) |
| `highlighted` | `Array` | `[]` | No | Array of highlighted dates (ISO strings) |
| `showWeekNumbers` | `Boolean` | `false` | Yes | Show week numbers |
| `locale` | `String` | `'en-US'` | No | Locale for formatting |
| `firstDayOfWeek` | `Number` | `0` | No | First day (0=Sunday, 1=Monday) |
| `inline` | `Boolean` | `false` | Yes | Always visible (not dropdown) |
| `showToday` | `Boolean` | `true` | No | Show "Today" button |
| `showClear` | `Boolean` | `true` | No | Show "Clear" button |
| `compact` | `Boolean` | `false` | Yes | Compact mode - hides footer and reduces spacing |

## Methods

### selectDate(date)
Select a date programmatically.

**Parameters:**
- `date` (String|Date): Date to select

**Fires:** `date-select`

### clear()
Clear the selected date(s).

**Fires:** `date-select`

### goToToday()
Navigate to today's date.

**Fires:** `month-change`

### previous()
Go to previous month/year.

**Fires:** `month-change`

### next()
Go to next month/year.

**Fires:** `month-change`

### setView(view)
Change the calendar view.

**Parameters:**
- `view` (String): View mode (`'days'`, `'months'`, `'years'`)

**Fires:** `view-change`

## Events

### date-select
Fired when a date is selected.

```javascript
{
  detail: {
    value: '2024-01-15',
    date: Date // Date object
  }
}
```

### month-change
Fired when the displayed month changes.

```javascript
{
  detail: {
    month: 1,  // 0-11
    year: 2024
  }
}
```

### view-change
Fired when the view mode changes.

```javascript
{
  detail: {
    view: 'months' // 'days', 'months', 'years'
  }
}
```

### range-select
Fired when a date range is selected (mode="range").

```javascript
{
  detail: {
    start: Date,           // Start Date object
    end: Date,             // End Date object
    value: {
      start: '2024-01-15', // Start ISO string
      end: '2024-01-20'    // End ISO string
    }
  }
}
```

## Examples

### Basic Date Picker

```html
<t-cal @date-select=${handleSelect}></t-cal>
```

### Inline Calendar

```html
<t-cal inline value="2024-01-15"></t-cal>
```

### Date Range Selection

```html
<t-cal mode="range" @range-select=${handleRange}></t-cal>
```

### With Min/Max Constraints

```html
<t-cal
  min="2024-01-01"
  max="2024-12-31"
  value="2024-06-15">
</t-cal>
```

### Disabled Specific Dates

```html
<t-cal .disabled=${[
  '2024-01-01',  // New Year
  '2024-12-25',  // Christmas
  '2024-07-04'   // Independence Day
]}></t-cal>
```

### Disabled Days of Week

```html
<!-- Disable weekends (Saturday=6, Sunday=0) -->
<t-cal .disabledDays=${[0, 6]}></t-cal>
```

### Highlighted Dates

```html
<t-cal .highlighted=${[
  '2024-01-10',
  '2024-01-15',
  '2024-01-20'
]}></t-cal>
```

### Week Numbers and Monday Start

```html
<t-cal
  show-week-numbers
  first-day-of-week="1">
</t-cal>
```

### Different Locale

```html
<t-cal locale="de-DE" first-day-of-week="1"></t-cal>
```

### Multiple Selection

```html
<t-cal
  mode="multiple"
  @date-select=${(e) => console.log('Selected:', e.detail.value)}>
</t-cal>
```

### Programmatic Control

```javascript
const calendar = document.querySelector('t-cal');

// Select a date
calendar.selectDate('2024-06-15');

// Clear selection
calendar.clear();

// Navigation
calendar.goToToday();
calendar.previous();
calendar.next();

// Change view
calendar.setView('months');
calendar.setView('years');

// Listen for events
calendar.addEventListener('date-select', (e) => {
  console.log('Selected:', e.detail.value);
});

calendar.addEventListener('month-change', (e) => {
  console.log('Viewing:', e.detail.month + 1, e.detail.year);
});
```

## Slots

None.


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--t-cal-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--t-cal-border` | `var(--terminal-gray-dark)` | Border color |
| `--t-cal-color` | `var(--terminal-green)` | Primary color |
| `--t-cal-hover` | `rgba(0, 255, 65, 0.1)` | Hover background color |

## Related Components

- [TInputLit](./TInputLit.md) - Text input (for date text entry)
