# TChatPanelLit (t-chat)

A compact, terminal-styled chat panel with markdown rendering, streaming support, message queueing, attachments, and export functionality.

## Tag Names

- `t-chat`

## Static Metadata

| Property | Value |
| --- | --- |
| tagName | `t-chat` |
| version | `1.0.0` |
| category | `Composite` |

## Examples

```html
<t-chat
  title="Chat"
  selected-mode="sonnet"
  spinner-type="ellipsis-spinner"
  spinner-size="24"
  export-format="markdown"
  export-filename="chat-export"
  max-height="100%"
  max-rows="4"
  persist-key="agent-chat"
></t-chat>
```

## Properties

| Property | Type | Attribute | Default | Description |
| --- | --- | --- | --- | --- |
| `title` | string | `title` | `Chat` | Panel title (forwarded to `t-pnl`). |
| `icon` | string | - | `noteBlankIcon` | SVG icon string for the header. |
| `messages` | array | - | `[]` | Array of message objects. |
| `queue` | array | - | `[]` | Array of queued message objects. |
| `agentModes` | array | `agent-modes` | `[{value:'haiku',label:'Haiku'},{value:'sonnet',label:'Sonnet'},{value:'opus',label:'Opus'}]` | Dropdown options for agent selection. |
| `selectedMode` | string | `selected-mode` | `sonnet` | Current agent mode. |
| `thinking` | boolean | `thinking` | `false` | Shows streaming bubble with spinner. |
| `spinnerType` | string | `spinner-type` | `ellipsis-spinner` | Spinner type from `t-ldr`. |
| `spinnerSize` | number | `spinner-size` | `24` | Spinner size in pixels. |
| `exportFormat` | string | `export-format` | `markdown` | Export format (`markdown` or `json`). |
| `exportFilename` | string | `export-filename` | `chat-export` | Base export filename. |
| `maxHeight` | string | `max-height` | `100%` | Max height for the message stream. |
| `maxRows` | number | `max-rows` | `4` | Max auto-grow rows for the composer. |
| `persistKey` | string | `persist-key` | `` | Local storage key prefix for draft/queue. |
| `showQueue` | boolean | `show-queue` | `false` | Whether the queue panel is visible. |
| `queueEnabled` | boolean | `queue-enabled` | `true` | Allow queueing while busy. |
| `autoScroll` | boolean | `auto-scroll` | `true` | Auto-scroll to newest message. |
| `disabled` | boolean | `disabled` | `false` | Disables input/actions. |
| `streamingContent` | string | `streaming-content` | `` | Streaming assistant text. |

### Message Shape

```js
{
  id: 'msg-1',
  role: 'user' | 'assistant' | 'system' | 'tool' | 'error',
  content: 'Hello',
  timestamp: '2026-01-18T16:00:00Z',
  model: 'sonnet',
  traceId: 'trace-123',
  attachments: [{ name: 'file.txt', size: 1024 }]
}
```

## Methods

### clearChat()
Clear all messages and streaming content.

### exportChat(format = exportFormat)
Export chat history.

**Parameters:**
- `format` (String): `markdown` or `json`

### enqueueMessage(content, attachments = [])
Queue a message while the agent is busy.

**Parameters:**
- `content` (String): Message content
- `attachments` (File[]): Optional attachments

### dequeueMessage()
Remove and return the next queued message.

**Returns:** `Object | null`

### addMessage(message)
Append a message to the chat.

**Parameters:**
- `message` (Object): Message object

### setStreamingContent(content)
Set assistant streaming content.

**Parameters:**
- `content` (String): Streaming text

### receiveContext(context)
Receives context from a parent container component.

**Parameters:**
- `context` (Object): Context object from parent

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `chat-send` | `{ message, attachments, mode }` | Fired when Send is pressed. |
| `chat-queued` | `{ item, queue }` | Fired when a message is queued. |
| `chat-dequeued` | `{ item, queue }` | Fired when a queued message is removed. |
| `chat-queue-remove` | `{ item, queue }` | Fired when a queue item is removed. |
| `chat-mode-change` | `{ value }` | Fired when agent mode changes. |
| `chat-attachments` | `{ files }` | Fired when attachments are selected. |
| `chat-export` | `{ format, payload }` | Fired before export download. |
| `chat-cleared` | `{}` | Fired when the chat is cleared. |

## Slots

| Slot | Description |
| --- | --- |
| default | Main content area (inside t-pnl) |
| actions | Header action buttons |

## CSS Custom Properties

| Property | Default | Description |
| --- | --- | --- |
| `--chat-max-height` | `100%` | Max height for the message stream |

## Related Components

- [TPanelLit](./TPanelLit.md) - Container panel
- [TLoaderLit](./TLoaderLit.md) - Spinners for thinking state
- [TDropdownLit](./TDropdownLit.md) - Mode selector

## Third-Party Credits

- marked and PrismJS for markdown and code highlighting. See [`../third-party.md`](../third-party.md).

## Notes

- Markdown rendering uses `marked` with HTML stripped for safety.
- Code blocks are highlighted with Prism in the component shadow DOM.
- Use `spinner-type` to select from available `t-ldr` spinners.
- Composer auto-grows on new lines; manual resize is disabled.
- Use Cmd+Enter (or Ctrl+Enter) to insert a new line; Enter sends.
