# TLogListLit

A log viewer component with terminal styling, supporting log level filtering, search, auto-scroll, and expandable entries.

## Tag Name

`t-log-list`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-log-list` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `entries` | `Array` | `[]` | No | Array of log entries (internal state) |
| `maxEntries` | `Number` | `1000` | No | Maximum entries to keep (0 = unlimited) |
| `autoScroll` | `Boolean` | `true` | Yes | Auto-scroll to new entries |
| `showToolbar` | `Boolean` | `true` | No | Show toolbar with search and filters |
| `showFooter` | `Boolean` | `true` | No | Show footer with stats |
| `searchQuery` | `String` | `''` | No | Current search filter (internal state) |
| `levelFilters` | `Array` | `[]` | No | Active log level filters |
| `compact` | `Boolean` | `false` | Yes | Compact display mode |
| `dense` | `Boolean` | `false` | Yes | Dense/reduced spacing mode |
| `minimal` | `Boolean` | `false` | Yes | Hide toolbar and footer |
| `timestampFormat` | `String` | `'time'` | No | Timestamp format: `'time'`, `'datetime'`, `'relative'`, `'full'` |
| `paused` | `Boolean` | `false` | No | Pause auto-scroll |
| `hideIcons` | `Boolean` | `false` | Yes | Hide level icons on entries |

### Entry Object Structure

```javascript
{
  id: 'log-1',            // Unique identifier (auto-generated if not provided)
  level: 'info',          // 'debug', 'info', 'warn', 'error', 'success', 'trace'
  message: 'Log text',    // Primary message
  timestamp: '2024-01-15T10:30:00Z', // ISO timestamp string
  source: 'MyModule',     // Optional source label
  tags: ['api', 'auth'],  // Optional tags for filtering
  details: {},            // Optional expandable details object
  metadata: {},           // Optional metadata as table
  data: {},               // Optional raw JSON data
  stackTrace: '',         // Optional stack trace string
  expandable: false       // Force expandable state
}
```

## Methods

### addEntry(entry)
Add a single log entry.

**Parameters:**
- `entry` (Object): Log entry object

### addEntries(entries)
Add multiple log entries.

**Parameters:**
- `entries` (Array): Array of entry objects

### clear()
Clear all log entries.

**Fires:** `clear`

### scrollToBottom()
Scroll to the most recent entry.

### togglePause()
Toggle the paused state.

### toggleLevelFilter(level)
Toggle a log level filter.

**Parameters:**
- `level` (String): Level to toggle (`'debug'`, `'info'`, `'warn'`, `'error'`)

**Fires:** `filter-change`

### getFilteredEntries()
Get entries matching current filters.

**Returns:** `Array` - Filtered entries

## Events

### entry-click
Bubbled from child `t-log-entry` elements when an entry is clicked.

```javascript
{
  detail: {
    level: 'info',
    message: 'Log message',
    timestamp: '2024-01-15T10:30:00Z'
  }
}
```

### entry-expand
Bubbled from child `t-log-entry` elements when an entry is expanded/collapsed.

```javascript
{
  detail: {
    expanded: true
  }
}
```

### filter-change
Fired when filters change.

```javascript
{
  detail: {
    levelFilters: ['info', 'warn', 'error'],
    searchQuery: 'error'
  }
}
```

### clear
Fired when log is cleared.

```javascript
{
  detail: {}
}
```

## Examples

### Basic Log List

```html
<t-log-list .entries=${[
  { id: '1', level: 'info', message: 'Application started', timestamp: '2024-01-15T10:30:00Z' },
  { id: '2', level: 'debug', message: 'Loading config', timestamp: '2024-01-15T10:30:01Z' },
  { id: '3', level: 'warn', message: 'Deprecated API used', timestamp: '2024-01-15T10:30:02Z' },
  { id: '4', level: 'error', message: 'Connection failed', timestamp: '2024-01-15T10:30:03Z' }
]}></t-log-list>
```

### With Toolbar and Footer

```html
<t-log-list
  show-toolbar
  show-footer
  .entries=${logs}>
</t-log-list>
```

### Compact Dense Mode

```html
<t-log-list
  compact
  dense
  hide-icons
  timestamp-format="time"
  .entries=${logs}>
</t-log-list>
```

### Minimal Mode (No Chrome)

```html
<t-log-list
  minimal
  auto-scroll
  .entries=${logs}>
</t-log-list>
```

### With Expandable Details

```html
<t-log-list .entries=${[
  {
    id: '1',
    level: 'error',
    message: 'Request failed',
    timestamp: '2024-01-15T10:30:00Z',
    details: {
      url: '/api/users',
      status: 500,
      response: { error: 'Internal Server Error' }
    }
  }
]}></t-log-list>
```

### Filtered by Level

```html
<t-log-list
  .levelFilters=${['warn', 'error']}
  .entries=${logs}>
</t-log-list>
```

### Live Log Stream

```html
<t-log-list
  auto-scroll
  max-entries="500"
  .entries=${liveLogs}>
</t-log-list>
```

### Programmatic Control

```javascript
const logList = document.querySelector('t-log-list');

// Add entries
logList.addEntry({
  level: 'info',
  message: 'New log message',
  timestamp: new Date().toISOString()
});

logList.addEntries([
  { level: 'debug', message: 'Debug 1', timestamp: new Date().toISOString() },
  { level: 'debug', message: 'Debug 2', timestamp: new Date().toISOString() }
]);

// Control
logList.clear();
logList.scrollToBottom();
logList.togglePause();

// Filtering
logList.toggleLevelFilter('debug');
const filtered = logList.getFilteredEntries();

// Listen for events
logList.addEventListener('entry-click', (e) => {
  console.log('Clicked entry:', e.detail.message);
});

logList.addEventListener('filter-change', (e) => {
  console.log('Active filters:', e.detail.levelFilters);
});

logList.addEventListener('clear', () => {
  console.log('Log cleared');
});
```

## Slots

| Slot | Description |
| --- | --- |
| `header` | Custom header content above the toolbar |
| default | Additional log entries (`t-log-entry` elements) |
| `footer` | Custom footer content below the log list |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--t-log-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--t-log-border` | `var(--terminal-gray-dark)` | Border color |
| `--t-log-color` | `var(--terminal-green)` | Primary text color |

## CSS Parts

| Part | Description |
|------|-------------|
| `container` | Main container |
| `toolbar` | Toolbar section |
| `entries` | Entries container |
| `footer` | Footer section |

## Related Components

- [TLogEntryLit](./TLogEntryLit.md) - Individual log entry
- [TListLit](./TListLit.md) - Generic list
- [TTimelineLit](./TTimelineLit.md) - Timeline display
