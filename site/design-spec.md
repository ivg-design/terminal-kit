Terminal Kit landing page (dashboard) design spec

This spec defines a single-page landing experience that looks and behaves like a working terminal dashboard, built entirely from Terminal Kit components (Lit web components). It is meant to be “agent-proof”: the layout, widget inventory, data models, interactions, and states are specified precisely enough that an AI agent can implement it without guessing.

Component inventory available in the kit includes (non-exhaustive highlights): t-pnl, t-card, t-grid, t-chart, t-log-list, t-log-entry, t-chat, form controls (t-inp, t-drp, t-textarea, t-sld, t-tog, t-clr, t-cal, t-dynamic-controls), navigation (t-tabs, t-menu, t-bread, t-usr), feedback (t-tst, t-tip, t-ldr, t-prg), layout (t-split, t-list, t-tree, t-kanban).  ￼

Terminal Kit theming is driven via CSS variables like –terminal-green, –terminal-black-light, etc.  ￼

1) Product goals and what the page must prove
	1.	Prove the kit is a real dashboard UI system, not a static component gallery.
	2.	Show reactive updates (live logs, streaming chat, charts updating, toasts, collapsible panels).
	3.	Show composition: widgets built from smaller primitives (panel + tabs + list + controls).
	4.	Provide actually useful “landing page” outcomes:
	•	Copy/paste install + starter code
	•	Generate theme tokens
	•	Generate a JSON-driven control panel schema
	•	See a live demo of log streaming + collapsible detail rows
	•	Chat assistant that can answer “how do I use component X?” (optional integration section below)

2) Page-level information architecture

Single route: / (Landing Dashboard)

Major regions:
	•	Top app bar (sticky): breadcrumbs + quick search + status fields + user menu
	•	Left rail (fixed width): navigation tabs + “Run demo” controls + component filters
	•	Main canvas: responsive dashboard grid of widgets
	•	Global overlays: modal, tooltip, toast, command palette style menu (optional), all triggered from widgets

3) Layout system and breakpoints (hard requirements)

Use t-grid as the only layout engine for the main canvas.  ￼

Viewport breakpoints:
	•	Desktop: >= 1200px
	•	Tablet: 768–1199px
	•	Mobile: < 768px

Grid definition:
	•	Desktop: 12 columns, 16px gap
	•	Tablet: 8 columns, 12px gap
	•	Mobile: 4 columns, 10px gap

Left rail:
	•	Desktop: 280px fixed
	•	Tablet: collapses to icon-ish mode (still using kit components; see 4.2)
	•	Mobile: becomes a top “drawer panel” toggled via a button in the app bar (implemented as a t-mdl or a collapsible t-pnl)

Top app bar height:
	•	56px desktop/tablet
	•	48px mobile

Widget sizing:
	•	Every widget must be a t-pnl (for header/actions/footer/collapse) containing either a t-card or direct component content.  ￼
	•	All widgets must support collapsed state. Collapsed state persists in localStorage (key: tk_landing_layout_v1).

4) Global shell components

4.1 Top app bar (sticky)

Components:
	•	t-bread (breadcrumbs)  ￼
	•	t-inp (search)  ￼
	•	t-sta (status bar) containing 3–5 t-sta-field items  ￼
	•	t-usr (user menu)  ￼
	•	t-menu for quick actions (optional)  ￼

Behavior:
	•	Search filters the “Component Explorer” widget and the “Docs Chat” widget context (if chat enabled).
	•	Status fields (live):
	•	Build: “tkit x.y.z” (read from package.json at build time)
	•	Mode: “demo” (static)
	•	Web Components: “ready” (flips from “booting” after first render)
	•	Events/s: numeric, computed from a simple event bus counter

4.2 Left rail (navigation + controls)

Structure: a single t-pnl (collapsible) with tabs inside.

Components:
	•	t-pnl (title: “Terminal Kit”)  ￼
	•	t-tabs with 3 tabs:
	•	Overview
	•	Components
	•	Demos  ￼
	•	t-btn cluster: “Run all demos”, “Pause”, “Reset”  ￼
	•	t-chip group for filters (levels: info/warn/error, tags)  ￼

Behavior:
	•	Run all demos:
	•	Starts log streaming generator
	•	Starts chart updating
	•	Starts chat “typing indicator” simulation if no backend connected
	•	Pause:
	•	Suspends generators
	•	Reset:
	•	Clears logs, resets charts to baseline, resets toggles/controls to defaults

Persistence:
	•	Left rail collapsed state persists in localStorage (key: tk_landing_leftrail_v1).

5) Dashboard widget inventory (what must appear)

All widgets are placed in the main t-grid. Each widget specifies: grid span by breakpoint, components used, data, and interactions.

Widget list (must include all items below):
	1.	Welcome + Quick Start
	2.	Install + Starter Snippet (copyable)
	3.	Theme Studio (live CSS variable editor)
	4.	Dynamic Controls Studio (JSON-driven controls generator)
	5.	Live Telemetry (charts + progress)
	6.	Log Stream + Inspector (with collapsible log rows)
	7.	Timeline of Events (derived from logs)
	8.	Component Explorer (search + interactive previews)
	9.	Layout Demos (splitter + tree + kanban + virtual list)
	10.	Chat (Docs Assistant) using t-chat (with optional free AI hookup)

Notes:
	•	Widgets 6 and 10 are explicitly required by your follow-up: log list with collapsible line items and chat component.

6) Widget specs (exhaustive)

6.1 Widget 1: Welcome + Quick Start

Grid placement:
	•	Desktop: cols 1–6 (span 6), row 1
	•	Tablet: span 8
	•	Mobile: span 4

Container:
	•	t-pnl title: “Welcome”
	•	header actions: t-bdg showing “Live” when demos running  ￼
	•	content: t-card with short intro + 3 action buttons  ￼

Components:
	•	t-card, t-btn, t-bdg, t-tip tooltips  ￼

Buttons:
	•	“Open Theme Studio” scrolls to widget 3
	•	“Start Demos” triggers same action as left rail “Run all demos”
	•	“View Components” scrolls to widget 8

State:
	•	When demos running, badge switches from “Idle” to “Live” and tooltip explains what is running.

Data:
	•	none; purely navigation + control

6.2 Widget 2: Install + Starter Snippet

Grid placement:
	•	Desktop: cols 7–12 (span 6), row 1
	•	Tablet: span 8
	•	Mobile: span 4

Container:
	•	t-pnl title: “Install”
	•	actions: t-menu with “Copy install”, “Copy starter”, “Open README”  ￼
	•	content: tabbed snippet viewer

Components:
	•	t-tabs with 3 tabs: npm, yarn, pnpm (text only)
	•	t-textarea in code mode (read-only)  ￼
	•	t-tst toast for “Copied”  ￼

Behavior:
	•	Selecting a tab swaps the code snippet.
	•	Clicking copy triggers navigator.clipboard.writeText and shows toast.
	•	“Open README” opens GitHub repo in a new tab.

Snippets (exact strings):
	•	Install:
	•	npm: npm i @ivg-design/tkit
	•	yarn: yarn add @ivg-design/tkit
	•	pnpm: pnpm add @ivg-design/tkit
	•	Starter (minimal):
	•	Includes module import and one t-pnl with two t-btn.

Loading:
	•	none

6.3 Widget 3: Theme Studio (live CSS variable editor)

Goal: prove theming and show the actual variables.

Grid placement:
	•	Desktop: cols 1–4 (span 4), row 2
	•	Tablet: span 4
	•	Mobile: span 4

Container: t-pnl title “Theme Studio”

Components:
	•	t-color-picker for key colors  ￼
	•	t-sld for glow intensity, border radius, scanline strength  ￼
	•	t-tog toggles: “scanlines”, “glow”, “reduced motion”  ￼
	•	t-bdg previews: “primary”, “danger”, “success”
	•	A mini preview card rendered using the same tokens

Theme tokens to control (must map to CSS variables):
	•	–terminal-green  ￼
	•	–terminal-green-bright
	•	–terminal-green-dim
	•	–terminal-black-light
	•	–terminal-gray-dark
	•	–terminal-gray-light
(If additional variables exist in the kit, expose them in an “Advanced” collapsed section, but the above list is mandatory.)  ￼

Implementation detail:
	•	Apply variables on :root (or a wrapping container) so changes reflect across the entire dashboard immediately.
	•	Provide “Export CSS” button that copies a :root { … } block to clipboard.
	•	Provide “Reset” button to revert to defaults.

Export format (exact):
:root {
–terminal-green: #00ff41;
…etc
}

Toasts:
	•	On export copy: “Theme CSS copied”

6.4 Widget 4: Dynamic Controls Studio (JSON-driven)

Goal: show that t-dynamic-controls can render a control panel from schema.  ￼

Grid placement:
	•	Desktop: cols 5–8 (span 4), row 2
	•	Tablet: span 4
	•	Mobile: span 4

Container: t-pnl title “Dynamic Controls”

Components:
	•	t-dynamic-controls renders a generated form  ￼
	•	t-textarea (code mode) shows the JSON schema
	•	t-btn “Regenerate schema”
	•	t-drp selects preset schemas (3 presets)

Presets (must exist):
	1.	“System Control”
	2.	“Chart Settings”
	3.	“Log Filters”

Behavior:
	•	When a user changes controls, show a live “output object” JSON (read-only textarea) that updates in real time.
	•	“Regenerate schema” randomizes some defaults (but preserves field structure) to prove reactivity.

Schema format (define exactly; agent must implement this shape):
{
“title”: “System Control”,
“fields”: [
{
“id”: “refreshRateMs”,
“type”: “number”,
“label”: “Refresh Rate (ms)”,
“min”: 100,
“max”: 5000,
“step”: 100,
“default”: 1000
},
{
“id”: “logLevel”,
“type”: “select”,
“label”: “Log Level”,
“options”: [“debug”,“info”,“warn”,“error”],
“default”: “info”
},
{
“id”: “scanlines”,
“type”: “boolean”,
“label”: “Scanlines”,
“default”: true
},
{
“id”: “accent”,
“type”: “color”,
“label”: “Accent”,
“default”: “#00ff41”
}
]
}

Eventing:
	•	Emit a custom event from this widget: tk-controls-changed with detail = output object
	•	Other widgets listen:
	•	Telemetry uses refreshRateMs
	•	Log widget uses logLevel / filters
	•	Theme widget uses accent (optional, but recommended)

6.5 Widget 5: Live Telemetry (charts + progress)

Goal: show t-chart + t-progress + status fields.  ￼

Grid placement:
	•	Desktop: cols 9–12 (span 4), row 2
	•	Tablet: span 8 (full row)
	•	Mobile: span 4

Container: t-pnl title “Telemetry”

Components:
	•	t-chart with 2 tabs:
	•	Line: events/sec over time
	•	Donut: level distribution (info/warn/error)
	•	t-prg as a ring: “Demo load” (0–100)
	•	t-sta-field row inside footer: “events”, “errors”, “uptime”

Data generation (deterministic-ish):
	•	A demo clock ticks every refreshRateMs (default 1000ms).
	•	On each tick:
	•	events += randomInt(5..25)
	•	errors += randomInt(0..2) with low probability
	•	donut distribution derived from last 60 log entries

Chart window:
	•	Keep last 60 points, drop older.

Interactions:
	•	Hover points show tooltip (use t-tip)
	•	Clicking “Freeze” in widget actions stops updates for this widget only

Loading states:
	•	When paused: show t-ldr in the chart area overlay  ￼

6.6 Widget 6: Log Stream + Inspector (collapsible rows, multiple data types)

This is the “prove you have a real log list” widget.

Grid placement:
	•	Desktop: cols 1–8 (span 8), row 3–4 (tall widget)
	•	Tablet: span 8
	•	Mobile: span 4

Container: t-pnl title “Logs”

Required components:
	•	t-log-list as the scroll container  ￼
	•	Each row rendered as t-log-entry  ￼
	•	A collapsible detail surface per row:
	•	Use t-accordion nested inside the list item OR implement expand/collapse inside t-log-entry if it supports it.
	•	The spec assumes accordion composition is available because t-accordion exists.  ￼

Header controls (inside the panel, above the list):
	•	t-inp: search text (filters message and tags)
	•	t-chip group: level filters (debug/info/warn/error)
	•	t-drp: “Source” filter (system/ui/network/ai)
	•	t-tog: “Auto-scroll”
	•	t-btn: “Clear”
	•	t-btn: “Simulate error” (injects an error log)

Row layout (collapsed state):
	•	Left: timestamp (HH:MM:SS)
	•	Middle: message (single line ellipsis)
	•	Right: badges:
	•	level badge (color via theme; do not hardcode colors, rely on CSS variables)
	•	source chip
	•	optional “json” badge if payload exists

Row detail layout (expanded state, must be collapsible per row):
	•	Section A: Key/value table (simple div grid) showing:
	•	requestId (string)
	•	durationMs (number)
	•	success (boolean)
	•	retries (number)
	•	Section B: payload viewer with tabs:
	•	JSON (pretty)
	•	Stack (only for error)
	•	Raw (original string)
	•	Section C: actions:
	•	“Copy JSON”
	•	“Open in Modal” (opens t-mdl with full content)
	•	“Pin” (adds to a pinned list at top of widget)

Data types to demonstrate (minimum set):
	1.	Plain text log (no payload)
	2.	JSON payload log
	3.	Error log with stack trace string
	4.	“Network” log with durationMs + request metadata
	5.	“UI event” log with target + action
	6.	“AI” log with token-ish counters (if chat enabled; otherwise simulate)

Log item schema (exact):
{
“id”: “uuid”,
“ts”: 1730000000000,
“level”: “info”,
“source”: “system”,
“message”: “Loaded components”,
“tags”: [“boot”,“lit”],
“kv”: {
“requestId”: “req_123”,
“durationMs”: 42,
“success”: true,
“retries”: 0
},
“payload”: { “any”: “json” },
“stack”: “string or null”
}

Behavior:
	•	New logs append at bottom if auto-scroll = on, otherwise do not scroll.
	•	Search/filter applies instantly.
	•	Collapsing/expanding a row does not reflow the entire list unnecessarily (virtualization is preferred; if you use t-list virtualization in support, do it).  ￼

Performance constraints:
	•	Maintain max 500 logs in memory; drop oldest beyond 500.
	•	Render window:
	•	If t-log-list is virtualized internally, rely on it.
	•	If not, implement a simple windowing strategy: render last N visible + buffer.

Edge cases:
	•	Very long message: must not expand height in collapsed mode; only expands in detail mode.
	•	Malformed JSON payload: show “Raw” tab only and an error badge.

Events:
	•	Emit tk-log-selected when a row expands, detail = log item.
	•	Emit tk-log-pinned when pinned.

6.7 Widget 7: Timeline of Events (derived from logs)

Grid placement:
	•	Desktop: cols 9–12 (span 4), row 3
	•	Tablet: span 8
	•	Mobile: span 4

Container: t-pnl title “Timeline”

Components:
	•	t-tmln (timeline)  ￼
	•	t-skel skeleton while empty/loading  ￼

Data:
	•	Convert last 20 logs into timeline events:
	•	label = message
	•	sublabel = source + level
	•	time = relative (e.g., “12s ago”)

Interactions:
	•	Clicking an event scrolls the log list to that log id and expands it.

Empty state:
	•	If no logs: show skeleton + “Run demos to generate activity”

6.8 Widget 8: Component Explorer (search + previews)

Grid placement:
	•	Desktop: cols 9–12 (span 4), row 4
	•	Tablet: span 8
	•	Mobile: span 4

Container: t-pnl title “Component Explorer”

Components:
	•	t-inp search
	•	t-tabs categories: Core, Forms, Display, Layout, Composite  ￼
	•	t-list (virtualized) listing component names  ￼
	•	Right side preview area inside the panel:
	•	Shows one interactive preview at a time

Preview items (minimum set):
	•	t-btn (variants)
	•	t-pnl (collapsible)
	•	t-drp with search enabled
	•	t-cal range mode
	•	t-chart donut
	•	t-tree
	•	t-kanban
	•	t-chat (compact preview: read-only sample)

Behavior:
	•	Search matches component name + short description.
	•	Clicking a list item loads its preview with a tiny “props” area:
	•	Use t-dynamic-controls with a schema specific to that component (simple subset).

This widget is your living component catalog; it should feel like Storybook, but terminal.

6.9 Widget 9: Layout Demos (splitter + tree + kanban + list)

Grid placement:
	•	Desktop: cols 1–12 (span 12), row 5 (wide)
	•	Tablet: span 8
	•	Mobile: span 4

Container: t-pnl title “Layout Demos”

Inside: t-tabs with 4 tabs:
	1.	Splitter
	2.	Tree
	3.	Kanban
	4.	Virtual List  ￼

Tab details:
	1.	Splitter tab

	•	Use t-split to show two panels side by side  ￼
	•	Left: “Nodes” (tree-like text)
	•	Right: “Details” (card)
	•	Dragging changes width; persist splitter ratio in localStorage (tk_split_ratio_v1)

	2.	Tree tab

	•	Use t-tree with a hierarchical dataset  ￼
	•	Selecting node emits tk-node-selected and logs a “ui” log

	3.	Kanban tab

	•	Use t-kanban with 3 columns: Backlog / In Progress / Done  ￼
	•	Drag card: emits tk-kanban-move and logs a “system” log

	4.	Virtual List tab

	•	Use t-list with 1000 items to prove virtualization  ￼
	•	Each item shows a badge and a chip

6.10 Widget 10: Chat (Docs Assistant) using t-chat

This widget is required, and should demonstrate markdown, streaming, attachments (even if attachments are simulated).

Grid placement:
	•	Desktop: cols 1–12 (span 12), row 6
	•	Tablet: span 8
	•	Mobile: span 4

Container: t-pnl title “Docs Assistant”

Component:
	•	t-chat (TChatPanel)  ￼

Required chat features to demonstrate (as surfaced by the component’s description):
	•	Markdown rendering
	•	Streaming responses
	•	Attachments  ￼

Chat UI requirements:
	•	Left side: conversation
	•	Bottom: input composer:
	•	text input
	•	send button
	•	attachment button (even if it just attaches a JSON blob)
	•	Header actions:
	•	“New chat”
	•	“Export transcript” (copies markdown)
	•	“Connect AI” (opens modal described in section 9)

Message schema (internal app state, exact):
{
“id”: “uuid”,
“role”: “user” | “assistant” | “system”,
“ts”: 1730000000000,
“content”: “string markdown”,
“attachments”: [
{ “name”: “theme.css”, “type”: “text/css”, “content”: “…” }
]
}

Behavior:
	•	If no AI backend is connected:
	•	Use a deterministic “docs bot” that answers from a small built-in map:
	•	queries about “t-log-list”, “t-pnl”, “t-grid”, “t-chart”, “t-dynamic-controls”
	•	Simulate streaming by chunking the response over time.
	•	Log each assistant response as source=ai, including token-ish counters.

If AI backend is connected:
	•	Use the adapter described in section 9.
	•	Still stream: show tokens arriving in chunks.

Logging integration:
	•	Every user send emits a log entry (source=ui, message=“chat: user message sent”).
	•	Every assistant response emits a log entry (source=ai) with kv fields:
	•	model
	•	latencyMs
	•	inputChars
	•	outputChars

Accessibility:
	•	Enter sends, Shift+Enter newline
	•	Focus returns to input after send
	•	Live region for streaming text updates (if supported by the component; otherwise wrap in aria-live container)

7) Cross-widget event bus (must implement)

Implement a tiny event bus (custom events on window is fine). Track events/sec for telemetry.

Event names (exact):
	•	tk-demo-start
	•	tk-demo-pause
	•	tk-demo-reset
	•	tk-controls-changed
	•	tk-log-selected
	•	tk-log-pinned
	•	tk-node-selected
	•	tk-kanban-move
	•	tk-chat-send
	•	tk-chat-receive
	•	tk-theme-changed

Each event increments a global counter used by Telemetry.

8) Demo data generators (exact behaviors)

8.1 Log generator

When running:
	•	Interval: refreshRateMs
	•	On each tick, emit 1–4 logs chosen by weighted distribution:
	•	50% info system
	•	20% ui
	•	15% network
	•	10% warn
	•	5% error (include stack)

Each generated log must conform to the schema in 6.6.

8.2 Chart generator

Uses log stream counts and event counter.

8.3 Chat generator (offline mode)
	•	If message contains “log” or “t-log-list”: respond with guidance and include a short markdown snippet.
	•	If message contains “theme”: respond with how CSS variables work and attach exported css in attachments array.
	•	Stream by sending chunks every 40–80ms until complete.

9) Optional: connect chat to a free AI backend (practical and implementable)

You asked for “some type of free version of AI that can talk to users”. There are two sane interpretations of “free”:

A) Free as in no paid API, running locally (you pay with CPU/GPU you already own).
B) Free as in hosted with a free tier/allocation.

This spec supports both via a pluggable adapter.

9.1 Option A (recommended): Local AI via Ollama

Ollama exposes a local HTTP API by default and provides a chat endpoint at POST /api/chat.  ￼

Adapter contract (exact):

createChatAdapter(config) returns:
	•	sendMessage(messages, opts) => async iterable of text chunks
	•	metadata() => { provider, model }

Config:
{
“provider”: “ollama”,
“baseUrl”: “http://localhost:11434”,
“model”: “gemma3”,
“stream”: true
}

Request shape (use Ollama’s API):
POST {baseUrl}/api/chat
{
“model”: “gemma3”,
“messages”: [
{ “role”: “user”, “content”: “…” }
],
“stream”: true
}

The docs show the endpoint and basic request shape.  ￼

Streaming handling:
	•	Consume newline-delimited JSON chunks (or whatever Ollama returns) and append content deltas to the t-chat UI.

Safety note for implementation:
	•	Browsers cannot call localhost from a hosted site reliably in all cases due to mixed content/CORS. The safe pattern is:
	•	Landing page runs as a static site
	•	A tiny local proxy (Node, Python, or Workers dev) forwards to Ollama and adds CORS headers
	•	Provide a “Local Proxy” toggle in the Connect AI modal.

Connect AI modal UI (must exist):
	•	Implement as t-mdl  ￼
	•	Fields:
	•	Provider dropdown: Offline demo, Ollama local, LM Studio local, Cloudflare Workers AI
	•	Base URL input
	•	Model input
	•	Test button
	•	Test button sends a short message and prints result

9.2 Option A2: Local AI via LM Studio (OpenAI-compatible endpoints)

LM Studio can serve local models and exposes OpenAI-compatible endpoints; docs instruct setting base_url to http://localhost:1234/v1 for compatibility.  ￼

Config:
{
“provider”: “lmstudio”,
“baseUrl”: “http://localhost:1234/v1”,
“model”: “local-model-name”,
“stream”: true
}

Implementation:
	•	Use OpenAI-style /chat/completions (or /responses if you choose) against the LM Studio server, using the compatibility described in their docs.  ￼

9.3 Option B: Hosted with free allocation via Cloudflare Workers AI

Cloudflare states Workers AI is included in both Free and Paid Workers plans and provides a free allocation, with pricing in “neurons”.  ￼

Practical integration pattern:
	•	Create a Cloudflare Worker endpoint /api/chat that:
	•	Accepts the same message schema as your app
	•	Calls Workers AI (server-side)
	•	Streams text back to the browser via SSE (server-sent events) or chunked fetch

Why this is nice:
	•	No localhost issues
	•	Can be deployed alongside your landing page
	•	Still “free enough” for a demo, within allocation  ￼

Spec constraints:
	•	Do not embed secrets in the client.
	•	The landing page’s “Connect AI” modal should support:
	•	Provider: “cloudflare”
	•	Endpoint: your worker URL
	•	Model: an identifier you choose (the worker can ignore and pin a default)

9.4 Chat security and abuse controls (must implement even for demos)
	•	Rate limit: max 1 request per 2 seconds per session when provider != offline demo
	•	Max input length: 2000 chars
	•	Strip or escape any HTML in messages before rendering (markdown renderer must be safe)
	•	If streaming fails: show a toast and stop the typing indicator  ￼

10) Visual style rules (so it looks like a terminal dashboard, not a green website)
	•	Use kit defaults; any additional CSS must be minimal and only for layout glue.
	•	Use CSS variables for color; do not hardcode greens/greys in widget CSS. The Theme Studio must be able to change the feel globally via variables like –terminal-green.  ￼
	•	Favor compact density:
	•	Most widgets default to compact variant where available (panels explicitly support compact/standard/large in the README).  ￼
	•	Motion:
	•	Subtle; respect “reduced motion” toggle by disabling streaming cursor animation and chart transitions when enabled.

Micro-interactions that must exist:
	•	Tooltips on icon actions (t-tip)
	•	Toasts on copy/export/connect events (t-tst)
	•	Skeletons during boot (t-skel)

11) Boot sequence (so the page feels alive immediately)

On first load:
	1.	Render shell and empty widgets instantly.
	2.	Show skeletons in Timeline and Component Explorer for 300ms.
	3.	Flip status field “Web Components” from booting → ready.
	4.	If localStorage says demos were running last session, do not auto-run; show a toast: “Session restored, press Run to start demos.”

12) Acceptance checklist (agent must pass)

Layout and shell:
	•	Top bar sticky, left rail present with tabs and run/pause/reset controls.
	•	Main canvas uses t-grid with specified spans and breakpoints.

Widgets:
	•	All 10 widgets exist.
	•	Every widget is a t-pnl.
	•	Telemetry updates when demos running and stops when paused.
	•	Log widget uses t-log-list + t-log-entry and supports per-row expand/collapse with multi-type payload display.  ￼
	•	Chat widget uses t-chat and supports markdown + streaming simulation at minimum.  ￼

Persistence:
	•	Collapsed states persisted.
	•	Split ratio persisted.

Optional AI connection:
	•	“Connect AI” modal exists.
	•	Ollama option works against POST /api/chat when pointed at a working endpoint.  ￼
	•	LM Studio option works with OpenAI-compatible base URL.  ￼
	•	Cloudflare option described and pluggable; worker endpoint not required for MVP but the UI and adapter interface must exist.  ￼

13) Blunt opinionated guidance (so you don’t accidentally ship a “component zoo”)

Do not make the landing page a grid of random pretty tiles. The page should behave like a real operator console:
	•	One place to change theme and instantly see everything react.
	•	One place to generate control schemas and watch other widgets respond.
	•	One place where logs are not decorative: they drive the timeline and telemetry.
	•	Chat is not a gimmick: it must attach real artifacts (exported theme CSS, a starter snippet, a JSON schema) into the conversation.

If you implement exactly what’s above, the page will feel like a product, not documentation cosplay.