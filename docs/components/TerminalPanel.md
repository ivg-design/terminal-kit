# TerminalPanel

A flexible panel component with terminal/cyberpunk styling that supports three different modes, customizable slots, and compact header options. Perfect for creating layouts with headers, content areas, and status bars.

## Tag Name
```html
<terminal-panel></terminal-panel>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | string | `'with-header'` | Panel layout mode |
| `title` | string | `''` | Panel title (for header mode) |
| `icon` | string | `null` | Icon SVG content (for header mode) |
| `collapsed` | boolean | `false` | Whether panel is collapsed |
| `collapsible` | boolean | `false` | Whether panel can be collapsed |
| `compact` | boolean | `false` | Whether to use compact header (20px vs 36px) |

### Modes
- `with-header` - Panel with header containing title and actions
- `headless` - Panel with no header, just content
- `with-status-bar` - Panel with content area and bottom status bar

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `mode` | string | Current panel mode |
| `title` | string | Panel title text |
| `icon` | string | Icon SVG content |
| `collapsed` | boolean | Collapsed state |
| `collapsible` | boolean | Whether panel can collapse |
| `compact` | boolean | Whether using compact header mode |

## Methods

### `setMode(mode)`
Sets the panel mode.

**Parameters:**
- `mode` (string): One of 'with-header', 'headless', 'with-status-bar'

**Example:**
```javascript
const panel = document.querySelector('terminal-panel');
panel.setMode('headless');
```

### `setTitle(title)`
Sets the panel title (for header mode).

**Parameters:**
- `title` (string): The panel title

**Example:**
```javascript
panel.setTitle('Control Panel');
```

### `setIcon(iconSvg)`
Sets the panel icon (for header mode).

**Parameters:**
- `iconSvg` (string): SVG string for the icon

**Example:**
```javascript
panel.setIcon('<svg>...</svg>');
```

### `collapse()`
Collapses the panel (if collapsible).

```javascript
panel.collapse();
```

### `expand()`
Expands the panel (if collapsible).

```javascript
panel.expand();
```

### `expandWithParents()`
Expands this panel and all parent panels to ensure visibility. Useful for nested panels where you want to ensure the target panel is visible.

**Example:**
```javascript
// Expands the panel and all parent panels
panel.expandWithParents();
```

### `toggle()`
Toggles the panel collapsed state. Returns the new collapsed state.

**Returns:** `boolean` - The new collapsed state

```javascript
const isCollapsed = panel.toggle();
```

### `toggleWithVisibility()`
Toggles the panel state with smart parent expansion. When expanding, also expands all parent panels to ensure this panel is visible.

**Returns:** `boolean` - The new collapsed state

**Example:**
```javascript
// Toggles panel and ensures visibility when expanding
const isCollapsed = panel.toggleWithVisibility();
```

### `isCollapsed()`
Returns whether the panel is currently collapsed.

**Returns:** `boolean` - Whether panel is collapsed

```javascript
const collapsed = panel.isCollapsed();
```

### `setCollapsible(collapsible)`
Sets whether the panel can be collapsed.

**Parameters:**
- `collapsible` (boolean): Whether panel should be collapsible

```javascript
panel.setCollapsible(true);
```

### `setCompact(compact)`
Sets whether the panel uses compact header mode. Compact headers are 20px tall instead of the default 36px, with smaller collapse buttons and reduced padding.

**Parameters:**
- `compact` (boolean): Whether to use compact header

**Example:**
```javascript
panel.setCompact(true); // Enable compact header
```

### `isCompact()`
Returns whether the panel is using compact header mode.

**Returns:** `boolean` - Whether panel is in compact mode

```javascript
const isCompact = panel.isCompact();
```

### `setSlotContent(slotName, content)`
Programmatically sets content for a specific slot.

**Parameters:**
- `slotName` (string): Name of the slot ('header-actions', 'content', 'status-bar')
- `content` (string): HTML content

```javascript
panel.setSlotContent('content', '<p>Dynamic content</p>');
```

### `clearSlot(slotName)`
Clears content from a specific slot.

**Parameters:**
- `slotName` (string): Name of the slot to clear

```javascript
panel.clearSlot('content');
```

### `showLoading()`
Shows loading state on the panel.

```javascript
panel.showLoading();
```

### `hideLoading()`
Hides loading state from the panel.

```javascript
panel.hideLoading();
```

### `setError(message)`
Sets the panel to display an error state with message.

**Parameters:**
- `message` (string): Error message to display

```javascript
panel.setError('Failed to load data');
```

### `setEmpty(message)`
Sets the panel to display an empty state with optional message.

**Parameters:**
- `message` (string): Empty state message (default: 'No content available')

```javascript
panel.setEmpty('No items found');
```

## Events

### `panel-collapsed`
Fired when the panel is collapsed.

**Example:**
```javascript
panel.addEventListener('panel-collapsed', () => {
  console.log('Panel collapsed');
});
```

### `panel-expanded`
Fired when the panel is expanded.

**Example:**
```javascript
panel.addEventListener('panel-expanded', () => {
  console.log('Panel expanded');
});
```

## Slots

### `header-actions`
Content for the header actions area (with-header mode only).

### `content`
Main panel content area.

### `status-bar`
Content for the status bar area (with-status-bar mode only).

## CSS Classes

The component applies these classes internally:

- `terminal-panel` - Base component class
- `panel` - Main panel container
- `panel-collapsible` - When panel is collapsible
- `panel-collapsed` - When panel is collapsed
- `panel-compact` - When panel is in compact mode
- `panel-loading` - When panel is in loading state
- `panel-header` - Header area
- `panel-title` - Panel title
- `panel-actions` - Header actions area
- `panel-body` - Content area
- `panel-body--headless` - Headless mode content
- `panel-body--with-status-bar` - Content with status bar
- `panel-status-bar` - Status bar area
- `panel-collapse-btn` - Collapse/expand button
- `panel-error` - Error state container
- `panel-empty` - Empty state container

## Examples

### Basic Panel with Header
```html
<terminal-panel mode="with-header" title="Settings" collapsible>
  <div slot="header-actions">
    <terminal-button variant="secondary" size="small" type="icon">⚙</terminal-button>
  </div>
  <div slot="content">
    <p>Panel content goes here</p>
  </div>
</terminal-panel>
```

### Compact Panel
```html
<terminal-panel mode="with-header" title="Compact Panel" collapsible compact>
  <div slot="content">
    <p>This panel has a compact 20px header instead of 36px</p>
  </div>
</terminal-panel>
```

### Headless Panel

The headless mode creates a panel without any header, providing just a styled content container. This is perfect for:
- Simple content containers that don't need titles
- Custom layouts where you want the panel styling without header chrome
- Embedded content areas within other components
- Minimal UI designs
- Dashboard widgets and metrics displays
- Code display areas
- Form containers

```html
<!-- Basic headless panel -->
<terminal-panel mode="headless">
  <div slot="content">
    <p>Simple content without header</p>
  </div>
</terminal-panel>

<!-- Headless panel with custom content -->
<terminal-panel mode="headless">
  <div slot="content">
    <div style="padding: 20px;">
      <h3 style="color: var(--terminal-green); margin-bottom: 10px;">Custom Content Area</h3>
      <p>This panel has no header but still provides the terminal-themed container styling.</p>
      <terminal-button variant="primary">Action</terminal-button>
    </div>
  </div>
</terminal-panel>

<!-- Headless panel as a code display -->
<terminal-panel mode="headless">
  <div slot="content">
    <terminal-textarea 
      value="// Code example
const config = {
  theme: 'terminal',
  mode: 'headless'
};"
      readonly
      rows="6">
    </terminal-textarea>
  </div>
</terminal-panel>

<!-- Multiple headless panels in a grid -->
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
  <terminal-panel mode="headless">
    <div slot="content">
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 24px; color: var(--terminal-green);">42</div>
        <div style="font-size: 11px; color: var(--terminal-green-dim);">Active Users</div>
      </div>
    </div>
  </terminal-panel>
  
  <terminal-panel mode="headless">
    <div slot="content">
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 24px; color: var(--terminal-green);">128</div>
        <div style="font-size: 11px; color: var(--terminal-green-dim);">Processes</div>
      </div>
    </div>
  </terminal-panel>
  
  <terminal-panel mode="headless">
    <div slot="content">
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 24px; color: var(--terminal-green);">99%</div>
        <div style="font-size: 11px; color: var(--terminal-green-dim);">Uptime</div>
      </div>
    </div>
  </terminal-panel>
</div>
```

#### Headless Panel Use Cases

1. **Dashboard Cards**
```html
<terminal-panel mode="headless">
  <div slot="content">
    <div class="dashboard-metric">
      <span class="metric-value">1,234</span>
      <span class="metric-label">Total Items</span>
    </div>
  </div>
</terminal-panel>
```

2. **Content Sections**
```html
<terminal-panel mode="headless">
  <div slot="content">
    <article>
      <h2>Article Title</h2>
      <p>Article content goes here...</p>
    </article>
  </div>
</terminal-panel>
```

3. **Form Container**
```html
<terminal-panel mode="headless">
  <div slot="content">
    <form style="padding: 20px;">
      <terminal-input placeholder="Username"></terminal-input>
      <terminal-input type="password" placeholder="Password"></terminal-input>
      <terminal-button variant="primary">Login</terminal-button>
    </form>
  </div>
</terminal-panel>
```

4. **Live Data Display**
```html
<terminal-panel mode="headless" id="liveDataPanel">
  <div slot="content">
    <div style="padding: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--terminal-green-dim); font-size: 11px;">SYSTEM STATUS</span>
        <span id="statusIndicator" style="color: var(--terminal-green);">● ONLINE</span>
      </div>
      <div style="margin-top: 10px; font-family: monospace; font-size: 10px;">
        <div>CPU: <span id="cpuUsage">45%</span></div>
        <div>MEM: <span id="memUsage">2.3GB</span></div>
        <div>NET: <span id="netSpeed">125KB/s</span></div>
      </div>
    </div>
  </div>
</terminal-panel>

<script>
  // Update live data periodically
  setInterval(() => {
    document.getElementById('cpuUsage').textContent = Math.floor(Math.random() * 100) + '%';
    document.getElementById('memUsage').textContent = (Math.random() * 8).toFixed(1) + 'GB';
    document.getElementById('netSpeed').textContent = Math.floor(Math.random() * 1000) + 'KB/s';
  }, 2000);
</script>
```

5. **Terminal Output Display**
```html
<terminal-panel mode="headless">
  <div slot="content">
    <div style="padding: 10px; background: var(--terminal-black); font-family: monospace; font-size: 11px;">
      <div style="color: var(--terminal-green-dim);">
        $ npm install<br>
        <span style="color: var(--terminal-green);">✓</span> Packages installed successfully<br>
        $ npm run build<br>
        <span style="color: var(--terminal-green);">✓</span> Build completed in 3.2s<br>
        $ npm start<br>
        <span style="color: var(--terminal-green);">Server running on port 3000...</span>
      </div>
    </div>
  </div>
</terminal-panel>
```

6. **Interactive List Container**
```html
<terminal-panel mode="headless">
  <div slot="content">
    <div style="max-height: 200px; overflow-y: auto;">
      <div class="list-item" style="padding: 8px; border-bottom: 1px solid var(--terminal-gray-dark); cursor: pointer;"
           onmouseover="this.style.background='var(--terminal-gray-dark)'" 
           onmouseout="this.style.background='transparent'">
        <span style="color: var(--terminal-green);">►</span> Item 1
      </div>
      <div class="list-item" style="padding: 8px; border-bottom: 1px solid var(--terminal-gray-dark); cursor: pointer;"
           onmouseover="this.style.background='var(--terminal-gray-dark)'" 
           onmouseout="this.style.background='transparent'">
        <span style="color: var(--terminal-green);">►</span> Item 2
      </div>
      <div class="list-item" style="padding: 8px; border-bottom: 1px solid var(--terminal-gray-dark); cursor: pointer;"
           onmouseover="this.style.background='var(--terminal-gray-dark)'" 
           onmouseout="this.style.background='transparent'">
        <span style="color: var(--terminal-green);">►</span> Item 3
      </div>
    </div>
  </div>
</terminal-panel>
```

### Panel with Status Bar
```html
<terminal-panel mode="with-status-bar">
  <div slot="content">
    <p>Main content area</p>
  </div>
  <div slot="status-bar">
    <terminal-status-bar>
      <!-- Status bar content -->
    </terminal-status-bar>
  </div>
</terminal-panel>
```

### Nested Collapsible Panels
```html
<terminal-panel mode="with-header" title="Parent Panel" collapsible id="parentPanel">
  <div slot="content">
    <terminal-panel mode="with-header" title="Child Panel 1" collapsible compact id="childPanel1">
      <div slot="content">
        <p>Nested content 1</p>
      </div>
    </terminal-panel>
    
    <terminal-panel mode="with-header" title="Child Panel 2" collapsible compact id="childPanel2">
      <div slot="content">
        <p>Nested content 2</p>
      </div>
    </terminal-panel>
  </div>
</terminal-panel>

<script>
  // Expand a nested panel and all its parents
  const childPanel = document.getElementById('childPanel1');
  childPanel.expandWithParents(); // Expands child and parent panels
</script>
```

### Compact vs Regular Panels Comparison
```html
<!-- Regular height panel (36px header) -->
<terminal-panel mode="with-header" title="Regular Panel" collapsible>
  <div slot="content">
    <p>Standard 36px header height</p>
  </div>
</terminal-panel>

<!-- Compact panel (20px header) -->
<terminal-panel mode="with-header" title="Compact Panel" collapsible compact>
  <div slot="content">
    <p>Compact 20px header - saves vertical space</p>
  </div>
</terminal-panel>

<!-- Multiple compact panels for space efficiency -->
<div style="height: 200px; overflow: auto;">
  <terminal-panel mode="with-header" title="Compact 1" collapsible compact>
    <div slot="content">Content 1</div>
  </terminal-panel>
  <terminal-panel mode="with-header" title="Compact 2" collapsible compact>
    <div slot="content">Content 2</div>
  </terminal-panel>
  <terminal-panel mode="with-header" title="Compact 3" collapsible compact>
    <div slot="content">Content 3</div>
  </terminal-panel>
</div>
```

### Dynamic Compact Mode
```html
<terminal-panel mode="with-header" title="Adaptive Panel" collapsible id="adaptivePanel">
  <div slot="header-actions">
    <terminal-button id="toggleCompact" size="xs" type="icon">⚙</terminal-button>
  </div>
  <div slot="content">
    <p>This panel can switch between regular and compact modes</p>
  </div>
</terminal-panel>

<script>
  const panel = document.getElementById('adaptivePanel');
  const toggleBtn = document.getElementById('toggleCompact');
  
  toggleBtn.addEventListener('button-click', () => {
    const isCompact = panel.isCompact();
    panel.setCompact(!isCompact);
    console.log(`Panel is now ${!isCompact ? 'compact' : 'regular'}`);
  });
</script>
```

### Panel with Icon and Actions
```html
<terminal-panel 
  mode="with-header" 
  title="File Browser" 
  icon='<svg><!-- folder icon --></svg>'
  collapsible
  compact
  id="filePanel">
  <div slot="header-actions">
    <terminal-button variant="secondary" size="xs" type="icon">+</terminal-button>
    <terminal-button variant="secondary" size="xs" type="icon">⟳</terminal-button>
  </div>
  <div slot="content">
    <ul>
      <li>file1.js</li>
      <li>file2.css</li>
      <li>file3.html</li>
    </ul>
  </div>
</terminal-panel>
```

### Dynamic Content Management
```html
<terminal-panel mode="with-header" title="Data Panel" id="dataPanel">
  <div slot="header-actions">
    <terminal-button id="refreshBtn" size="small" type="icon">🔄</terminal-button>
  </div>
  <div slot="content">
    <!-- Content will be loaded dynamically -->
  </div>
</terminal-panel>

<script>
  const dataPanel = document.getElementById('dataPanel');
  const refreshBtn = document.getElementById('refreshBtn');
  
  async function loadData() {
    dataPanel.showLoading();
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      if (data.length === 0) {
        dataPanel.setEmpty('No data available');
      } else {
        dataPanel.setSlotContent('content', `
          <div>
            <h3>Data Items (${data.length})</h3>
            ${data.map(item => `<p>${item.name}</p>`).join('')}
          </div>
        `);
      }
      
      dataPanel.hideLoading();
    } catch (error) {
      dataPanel.setError('Failed to load data: ' + error.message);
    }
  }
  
  refreshBtn.addEventListener('button-click', loadData);
  loadData(); // Initial load
</script>
```

### Smart Toggle with Parent Expansion
```html
<terminal-panel mode="with-header" title="Level 1" collapsible id="level1">
  <div slot="content">
    <terminal-panel mode="with-header" title="Level 2" collapsible compact id="level2">
      <div slot="content">
        <terminal-panel mode="with-header" title="Level 3" collapsible compact id="level3">
          <div slot="content">
            <p>Deeply nested content</p>
          </div>
        </terminal-panel>
      </div>
    </terminal-panel>
  </div>
</terminal-panel>

<terminal-button id="toggleLevel3">Toggle Level 3</terminal-button>

<script>
  document.getElementById('toggleLevel3').addEventListener('button-click', () => {
    const level3 = document.getElementById('level3');
    // This will expand parent panels if level3 is being expanded
    level3.toggleWithVisibility();
  });
</script>
```

## Styling Variables

The component uses these CSS variables (defined in panel.css):

```css
--terminal-black-light: #1a1a1a;
--terminal-gray-dark: #242424;
--terminal-gray-light: #333333;
--terminal-gray-medium: #2e2e2e;
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-green-dark: #008822;
--terminal-red: #ff0041;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--font-size-xs: 10px;
--font-size-sm: 11px;
--font-size-base: 12px;
```

## Compact Mode Specifications

### Regular Mode (Default)
- Header height: 36px
- Collapse button: 20px × 20px
- Title font size: 11px
- Padding: 8px 12px

### Compact Mode
- Header height: 20px
- Collapse button: 16px × 16px (borderless XS button)
- Title font size: 11px
- Padding: 2px 8px
- Action buttons: XS size (16px)

## Accessibility

- Collapsible panels support keyboard navigation
- Focus states on interactive elements
- Proper ARIA attributes for expanded/collapsed states
- Screen reader friendly content structure
- Collapse buttons have appropriate aria-labels

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+