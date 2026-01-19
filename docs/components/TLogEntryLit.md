# TLogEntryLit

A log entry component with terminal styling, supporting multiple log levels, timestamps, tags, and expandable details.

## Tag Name

`t-log-entry`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-log-entry` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `level` | `String` | `'info'` | Yes | Log level: 'debug', 'info', 'warn', 'error', 'success', 'trace' |
| `timestamp` | `String\|Date` | `null` | No | Entry timestamp |
| `timestampFormat` | `String` | `'time'` | No | Format: 'time', 'datetime', 'relative', 'full' |
| `message` | `String` | `''` | No | Primary log message |
| `source` | `String` | `''` | No | Source/category label |
| `tags` | `Array` | `[]` | No | Tags for filtering |
| `expanded` | `Boolean` | `false` | Yes | Whether details are expanded |
| `expandable` | `Boolean` | `false` | No | Force expandable state |
| `details` | `Object` | `null` | No | Key-value detail fields |
| `stackTrace` | `String` | `''` | No | Error stack trace |
| `metadata` | `Object` | `null` | No | Metadata as table |
| `data` | `Object` | `null` | No | Raw JSON data to display |
| `compact` | `Boolean` | `false` | Yes | Compact display mode |
| `dense` | `Boolean` | `false` | Yes | Dense display mode |
| `icon` | `String` | `''` | No | Custom icon (overrides level) |
| `hideIcons` | `Boolean` | `false` | Yes | Hide level icons |

## Methods

### toggle()
Toggle the expanded state.

**Fires:** `entry-expand`

### expand()
Expand the entry details.

**Fires:** `entry-expand`

### collapse()
Collapse the entry details.

**Fires:** `entry-expand`

## Events

### entry-click
Fired when the entry row is clicked.

```javascript
{
  detail: {
    level: 'error',
    message: 'Connection failed',
    timestamp: '2024-01-15T10:30:00Z'
  }
}
```

### entry-expand
Fired when the entry is expanded or collapsed.

```javascript
{
  detail: {
    expanded: true
  }
}
```

### tag-click
Fired when a tag is clicked.

```javascript
{
  detail: {
    tag: 'network'
  }
}
```

## Slots

| Slot | Description |
|------|-------------|
| `details` | Custom content for expanded details section |
| `actions` | Custom action buttons in header |

## CSS Parts

| Part | Description |
|------|-------------|
| `entry` | The entry container |
| `header` | Entry header row |
| `icon` | Level icon |
| `timestamp` | Timestamp display |
| `message` | Main message text |
| `tags` | Tags container |
| `details` | Expanded details section |

## Examples

### Basic Log Entry

```html
<t-log-entry
  level="info"
  message="Application started successfully"
  timestamp="2024-01-15T10:30:00Z">
</t-log-entry>
```

### Error with Stack Trace

```html
<t-log-entry
  level="error"
  message="Connection failed"
  timestamp="2024-01-15T10:30:00Z"
  source="api-gateway"
  stack-trace="Error: Connection refused
    at connect (net.js:123)
    at Socket.connect (socket.js:45)">
</t-log-entry>
```

### With Tags and Details

```html
<t-log-entry
  level="warn"
  message="Rate limit approaching"
  .tags=${['api', 'rate-limit', 'warning']}
  .details=${{
    'Current Rate': '450/500',
    'Reset In': '30 seconds',
    'Endpoint': '/api/users'
  }}>
</t-log-entry>
```

### With Metadata Table

```html
<t-log-entry
  level="debug"
  message="Request completed"
  .metadata=${{
    'Method': 'GET',
    'URL': '/api/users/123',
    'Status': 200,
    'Duration': '45ms'
  }}>
</t-log-entry>
```

### With JSON Data

```html
<t-log-entry
  level="info"
  message="User authenticated"
  .data=${{
    user: { id: 123, name: 'John Doe' },
    session: { token: 'abc...', expires: '2024-01-16' }
  }}>
</t-log-entry>
```

### Compact Mode

```html
<t-log-entry
  compact
  dense
  hide-icons
  level="debug"
  message="Debug output"
  timestamp-format="relative">
</t-log-entry>
```

### Custom Actions

```html
<t-log-entry
  level="error"
  message="Critical failure">
  <button slot="actions" @click=${handleCopy}>Copy</button>
  <button slot="actions" @click=${handleRetry}>Retry</button>
</t-log-entry>
```

### Programmatic Control

```javascript
const entry = document.querySelector('t-log-entry');

// Toggle expansion
entry.toggle();

// Expand/collapse
entry.expand();
entry.collapse();

// Listen for events
entry.addEventListener('entry-click', (e) => {
  console.log('Entry clicked:', e.detail.message);
});

entry.addEventListener('tag-click', (e) => {
  console.log('Filter by tag:', e.detail.tag);
});
```

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--t-log-debug` | `var(--terminal-gray)` | Debug level color |
| `--t-log-info` | `var(--terminal-cyan)` | Info level color |
| `--t-log-warn` | `var(--terminal-amber)` | Warning level color |
| `--t-log-error` | `var(--terminal-red)` | Error level color |
| `--t-log-success` | `var(--terminal-green)` | Success level color |
| `--t-log-trace` | `var(--terminal-purple)` | Trace level color |

## Log Levels

| Level | Icon | Color | Use Case |
|-------|------|-------|----------|
| `debug` | Code | Gray | Development debugging |
| `info` | Info | Cyan | General information |
| `warn` | Warning | Amber | Warnings, non-critical issues |
| `error` | X Circle | Red | Errors, failures |
| `success` | Check | Green | Success confirmations |
| `trace` | Code | Purple | Detailed tracing |

## Related Components

- [TLogListLit](./TLogListLit.md) - Container for log entries
- [TTimelineLit](./TTimelineLit.md) - Timeline display
- [TListLit](./TListLit.md) - Generic list
