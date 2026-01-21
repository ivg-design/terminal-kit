/**
 * Chat Adapter for Terminal Kit Docs Assistant
 * Supports: Offline demo, Ollama, LM Studio, Cloudflare Workers AI
 */

// Built-in docs responses for offline mode
const DOCS_RESPONSES = {
  't-log-list': `## t-log-list Component

The \`<t-log-list>\` component is a scrollable container for log entries.

### Usage
\`\`\`html
<t-log-list id="logs" max-entries="500" auto-scroll>
  <t-log-entry level="info" message="System ready"></t-log-entry>
</t-log-list>
\`\`\`

### Properties
- \`max-entries\`: Maximum log count (default: 100)
- \`auto-scroll\`: Auto-scroll to newest entries

### Events
- \`log-selected\`: Fired when a log is clicked`,

  't-pnl': `## t-pnl (Panel) Component

The \`<t-pnl>\` component is a collapsible container with header, content, and footer.

### Usage
\`\`\`html
<t-pnl title="System Control" collapsible compact>
  <div slot="actions">
    <t-btn size="sm">Action</t-btn>
  </div>
  <p>Panel content here</p>
  <div slot="footer">Footer text</div>
</t-pnl>
\`\`\`

### Properties
- \`title\`: Panel header title
- \`collapsible\`: Enable collapse toggle
- \`collapsed\`: Initial collapsed state
- \`compact\` / \`large\`: Size variants`,

  't-grid': `## t-grid Component

The \`<t-grid>\` component provides a responsive dashboard layout using GridStack.

### Usage
\`\`\`html
<t-grid columns="12" gap="16">
  <t-grid-item gs-x="0" gs-y="0" gs-w="6" gs-h="2">
    Widget content
  </t-grid-item>
</t-grid>
\`\`\`

### Grid Item Attributes
- \`gs-x\`, \`gs-y\`: Position
- \`gs-w\`, \`gs-h\`: Size in grid units
- \`gs-min-w\`, \`gs-min-h\`: Minimum size`,

  't-chart': `## t-chart Component

The \`<t-chart>\` component renders data visualizations.

### Usage
\`\`\`html
<t-chart type="line" monochrome>
</t-chart>

<script>
  chart.setData({
    labels: ['A', 'B', 'C'],
    datasets: [{ label: 'Values', data: [10, 20, 30] }]
  });
</script>
\`\`\`

### Chart Types
- \`line\`, \`bar\`, \`pie\`, \`donut\`

### Properties
- \`type\`: Chart type
- \`monochrome\`: Use accent color only`,

  't-dynamic-controls': `## t-dynamic-controls Component

Renders a form from a JSON schema.

### Usage
\`\`\`html
<t-dynamic-controls id="controls"></t-dynamic-controls>

<script>
  controls.schema = {
    title: "Settings",
    fields: [
      { id: "rate", type: "number", label: "Rate", min: 0, max: 100 },
      { id: "enabled", type: "boolean", label: "Enabled" }
    ]
  };
</script>
\`\`\`

### Field Types
- \`number\`, \`string\`, \`boolean\`, \`select\`, \`color\``,

  'theme': `## Theming

Terminal Kit uses CSS variables for theming. All components respect these variables.

### Core Variables
\`\`\`css
:root {
  --terminal-green: #00ff41;
  --terminal-green-dim: #00cc33;
  --terminal-green-bright: #33ff66;
  --terminal-green-dark: #008820;
  --terminal-black: #0a0a0a;
  --terminal-gray-dark: #242424;
}
\`\`\`

Change \`--terminal-green\` and related shades are auto-derived.`,

  'default': `I'm the Terminal Kit docs assistant. I can help you with:

- **Components**: Ask about any component like t-pnl, t-log-list, t-chart
- **Theming**: How to customize colors and styles
- **Layout**: Using t-grid for dashboard layouts
- **Forms**: Dynamic controls and form components

What would you like to know?`
};

/**
 * Simulate streaming by chunking text
 */
async function* streamText(text, chunkDelay = 50) {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '');
    await new Promise(r => setTimeout(r, chunkDelay + Math.random() * 30));
  }
}

/**
 * Offline docs bot
 */
async function* offlineChat(message) {
  const lower = message.toLowerCase();

  let response = DOCS_RESPONSES.default;

  for (const [key, value] of Object.entries(DOCS_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) {
      response = value;
      break;
    }
  }

  // Check for theme keyword
  if (lower.includes('theme') || lower.includes('color') || lower.includes('css')) {
    response = DOCS_RESPONSES.theme;
  }

  yield* streamText(response);
}

/**
 * Ollama adapter
 */
async function* ollamaChat(message, config) {
  const { baseUrl = 'http://localhost:11434', model = 'gemma3' } = config;

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: message }],
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(l => l.trim());

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.message?.content) {
          yield json.message.content;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}

/**
 * LM Studio adapter (OpenAI compatible)
 */
async function* lmStudioChat(message, config) {
  const { baseUrl = 'http://localhost:1234/v1', model = 'local-model' } = config;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: message }],
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
}

/**
 * Create chat adapter based on provider
 */
function createChatAdapter(config = {}) {
  const { provider = 'offline' } = config;

  return {
    async *sendMessage(message) {
      switch (provider) {
        case 'ollama':
          yield* ollamaChat(message, config);
          break;
        case 'lmstudio':
          yield* lmStudioChat(message, config);
          break;
        case 'offline':
        default:
          yield* offlineChat(message);
      }
    },

    metadata() {
      return {
        provider,
        model: config.model || 'offline-docs'
      };
    }
  };
}

export { createChatAdapter, DOCS_RESPONSES };
export default createChatAdapter;
