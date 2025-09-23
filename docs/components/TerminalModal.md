# TerminalModal

A flexible modal component that can house multiple panels with various layout modes. Perfect for complex dialogs, multi-panel interfaces, and dashboard-style modals with terminal aesthetics.

## Tag Name
```html
<terminal-modal></terminal-modal>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `layout` | string | `'single'` | Layout mode: single, 2-column, 2x2, 1-2-1, 2-1 |
| `title` | string | `''` | Modal title |
| `backdrop-close` | boolean | `true` | Enable/disable backdrop click to close |
| `escape-close` | boolean | `true` | Enable/disable escape key to close |
| `size` | string | `'lg'` | Modal size: sm, md, lg, xl, full |
| `visible` | boolean | `false` | Show/hide modal |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | Current layout mode |
| `title` | string | Modal title text |
| `backdropClose` | boolean | Backdrop close enabled |
| `escapeClose` | boolean | Escape key close enabled |
| `size` | string | Modal size |
| `visible` | boolean | Modal visibility state |

## Layout Modes

### Single
Single full-width panel.
- Slot: `main`

### 2-Column
Two equal-width columns side by side.
- Slots: `left`, `right`

### 2x2
Four equal panels in a 2x2 grid.
- Slots: `top-left`, `top-right`, `bottom-left`, `bottom-right`

### 1-2-1
Three rows: single panel top, two columns middle, single panel bottom.
- Slots: `top`, `middle-left`, `middle-right`, `bottom`

### 2-1
Two rows: two columns top, single panel bottom.
- Slots: `top-left`, `top-right`, `bottom`

## Methods

### `show()`
Shows the modal with focus management and body scroll prevention.

**Returns:** TerminalModal (chainable)

```javascript
modal.show();
```

### `hide()`
Hides the modal and restores body scroll.

**Returns:** TerminalModal (chainable)

```javascript
modal.hide();
```

### `close()`
Closes the modal with before-close event (can be prevented).

**Returns:** TerminalModal (chainable)

```javascript
modal.close();
```

### `toggle()`
Toggles modal visibility.

**Returns:** TerminalModal (chainable)

```javascript
modal.toggle();
```

### `setLayout(layout)`
Sets the layout mode.

**Parameters:**
- `layout` (string): Layout mode (single, 2-column, 2x2, 1-2-1, 2-1)

**Returns:** TerminalModal (chainable)

```javascript
modal.setLayout('2-column');
```

### `setTitle(title)`
Sets the modal title.

**Parameters:**
- `title` (string): Modal title

**Returns:** TerminalModal (chainable)

```javascript
modal.setTitle('Settings Panel');
```

### `setSize(size)`
Sets the modal size.

**Parameters:**
- `size` (string): Size (sm, md, lg, xl, full)

**Returns:** TerminalModal (chainable)

```javascript
modal.setSize('xl');
```

### `setBackdropClose(enabled)`
Enable/disable backdrop click to close.

**Parameters:**
- `enabled` (boolean): Enable backdrop close

**Returns:** TerminalModal (chainable)

```javascript
modal.setBackdropClose(false);
```

### `setEscapeClose(enabled)`
Enable/disable escape key to close.

**Parameters:**
- `enabled` (boolean): Enable escape close

**Returns:** TerminalModal (chainable)

```javascript
modal.setEscapeClose(false);
```

### `setPanelContent(slotName, content)`
Sets HTML content for a specific panel slot.

**Parameters:**
- `slotName` (string): Slot name (e.g., 'main', 'left', 'top-left')
- `content` (string): HTML content

**Returns:** TerminalModal (chainable)

```javascript
modal.setPanelContent('main', '<h3>Panel Content</h3><p>Some text...</p>');
```

### `clearPanel(slotName)`
Clears content from a specific panel slot.

**Parameters:**
- `slotName` (string): Slot name

**Returns:** TerminalModal (chainable)

```javascript
modal.clearPanel('left');
```

### `isVisible()`
Returns modal visibility state.

**Returns:** boolean

```javascript
const isOpen = modal.isVisible();
```

### `getLayout()`
Returns current layout mode.

**Returns:** string

```javascript
const layout = modal.getLayout(); // 'single', '2-column', etc.
```

### `getSize()`
Returns current modal size.

**Returns:** string

```javascript
const size = modal.getSize(); // 'lg', 'xl', etc.
```

### `showLoading()`
Shows loading spinner overlay.

**Returns:** TerminalModal (chainable)

```javascript
modal.showLoading();
```

### `hideLoading()`
Hides loading spinner overlay.

**Returns:** TerminalModal (chainable)

```javascript
modal.hideLoading();
```

## Events

### `modal-show`
Fired when modal is shown.

```javascript
modal.addEventListener('modal-show', (e) => {
  console.log('Modal opened');
});
```

### `modal-hide`
Fired when modal is hidden.

```javascript
modal.addEventListener('modal-hide', (e) => {
  console.log('Modal closed');
});
```

### `modal-before-close`
Fired before modal closes (can be prevented).

```javascript
modal.addEventListener('modal-before-close', (e) => {
  // Prevent closing if form is dirty
  if (formIsDirty()) {
    e.preventDefault();
  }
});
```

### `modal-close`
Fired after modal closes.

```javascript
modal.addEventListener('modal-close', (e) => {
  console.log('Modal closed completely');
});
```

## Features

### Layout Flexibility
- 5 different layout modes for various use cases
- Responsive design adapts layouts on mobile
- Equal-sized panels with consistent spacing
- 2x2 grid layout expands to full modal height

### Accessibility
- Proper ARIA attributes
- Focus management
- Keyboard navigation (Escape to close)
- Screen reader support

### User Experience
- Smooth animations with CSS transitions
- Backdrop blur effect
- Loading state support
- Click-to-close and escape-to-close functionality
- Close button uses TerminalButton component (large, icon-only, danger variant)

### Developer Experience
- Chainable API methods
- Slot-based content management
- Event-driven architecture
- Consistent with other Terminal components
- Can embed TerminalPanel components in slots

## CSS Classes

### Main Classes
- `terminal-modal` - Component root
- `terminal-modal-backdrop` - Backdrop overlay
- `terminal-modal-content` - Modal content container
- `terminal-modal-header` - Header section
- `terminal-modal-body` - Body section
- `terminal-modal-layout` - Layout container

### Layout Classes
- `layout-single` - Single panel layout
- `layout-2-column` - Two column layout
- `layout-2x2` - 2x2 grid layout
- `layout-1-2-1` - 1-2-1 row layout
- `layout-2-1` - 2-1 row layout

### Panel Classes
- `modal-panel` - Individual panel
- `panel-main` - Main panel (single layout)
- `panel-left`, `panel-right` - Left/right panels
- `panel-top-left`, `panel-top-right` - Top panels
- `panel-bottom-left`, `panel-bottom-right` - Bottom panels
- `panel-top`, `panel-bottom` - Full-width panels
- `panel-middle-left`, `panel-middle-right` - Middle panels

### State Classes
- `open` - Modal is visible
- `closing` - Modal is closing (animation)
- `modal-loading` - Loading state

## Examples

### Basic Single Panel Modal
```html
<terminal-modal id="basicModal" title="Settings" size="md">
  <div slot="main">
    <h3>Settings Panel</h3>
    <p>Configure your preferences here.</p>
    <form>
      <label>
        Theme:
        <select>
          <option>Dark</option>
          <option>Light</option>
        </select>
      </label>
    </form>
  </div>
</terminal-modal>

<script>
  const modal = document.getElementById('basicModal');
  
  // Show modal
  document.getElementById('showBtn').addEventListener('click', () => {
    modal.show();
  });
  
  // Handle close event
  modal.addEventListener('modal-close', () => {
    console.log('Settings modal closed');
  });
</script>
```

### Two-Column Layout
```html
<terminal-modal id="twoColModal" layout="2-column" title="File Explorer" size="xl">
  <div slot="left">
    <h4>Directory Tree</h4>
    <ul class="file-tree">
      <li>📁 src/</li>
      <li>📁 components/</li>
      <li>📁 styles/</li>
    </ul>
  </div>
  
  <div slot="right">
    <h4>File Contents</h4>
    <pre><code>// File preview here...</code></pre>
  </div>
</terminal-modal>

<script>
  const fileModal = document.getElementById('twoColModal');
  
  // Dynamic content updates
  function loadFile(filename, content) {
    fileModal.setPanelContent('right', `
      <h4>${filename}</h4>
      <pre><code>${content}</code></pre>
    `);
  }
</script>
```

### 2x2 Dashboard Modal
```html
<terminal-modal id="dashboardModal" layout="2x2" title="System Dashboard" size="full">
  <div slot="top-left">
    <h4>CPU Usage</h4>
    <div class="metric-display">75%</div>
  </div>

  <div slot="top-right">
    <h4>Memory Usage</h4>
    <div class="metric-display">4.2GB / 8GB</div>
  </div>

  <div slot="bottom-left">
    <h4>Network Traffic</h4>
    <canvas id="networkChart"></canvas>
  </div>

  <div slot="bottom-right">
    <h4>System Logs</h4>
    <div class="log-viewer">
      <div class="log-entry">INFO: System started</div>
      <div class="log-entry">WARN: High CPU usage</div>
    </div>
  </div>
</terminal-modal>
```

### Modal with Embedded Panels
```html
<terminal-modal id="panelModal" layout="2-column" title="Panel Example" size="xl">
  <terminal-panel slot="left" title="Navigation" mode="with-header" compact>
    <ul>
      <li>File 1</li>
      <li>File 2</li>
      <li>File 3</li>
    </ul>
  </terminal-panel>

  <terminal-panel slot="right" title="Content" mode="with-header" compact>
    <p>Main content area with embedded terminal panel styling.</p>
  </terminal-panel>
</terminal-modal>
```

### 1-2-1 Layout with Actions
```html
<terminal-modal id="editorModal" layout="1-2-1" title="Code Editor" size="xl">
  <div slot="top">
    <div class="toolbar">
      <terminal-button size="sm">Save</terminal-button>
      <terminal-button size="sm">Run</terminal-button>
      <terminal-button size="sm">Debug</terminal-button>
    </div>
  </div>
  
  <div slot="middle-left">
    <h4>Code</h4>
    <textarea class="code-editor">
function hello() {
  console.log('Hello World');
}
    </textarea>
  </div>
  
  <div slot="middle-right">
    <h4>Output</h4>
    <pre class="output-panel">Hello World</pre>
  </div>
  
  <div slot="bottom">
    <div class="status-bar">
      Line 1, Column 1 | JavaScript | Ready
    </div>
  </div>
</terminal-modal>
```

### Dynamic Layout Switching
```html
<terminal-modal id="dynamicModal" title="Dynamic Layout">
  <div slot="main">
    <h3>Choose Layout</h3>
    <terminal-button onclick="switchLayout('single')">Single</terminal-button>
    <terminal-button onclick="switchLayout('2-column')">2-Column</terminal-button>
    <terminal-button onclick="switchLayout('2x2')">2x2 Grid</terminal-button>
  </div>
</terminal-modal>

<script>
  const dynamicModal = document.getElementById('dynamicModal');
  
  function switchLayout(layout) {
    dynamicModal.setLayout(layout);
    
    // Update content based on layout
    if (layout === '2-column') {
      dynamicModal.setPanelContent('left', '<h4>Left Panel</h4><p>Content...</p>');
      dynamicModal.setPanelContent('right', '<h4>Right Panel</h4><p>Content...</p>');
    } else if (layout === '2x2') {
      dynamicModal.setPanelContent('top-left', '<h4>Top Left</h4>');
      dynamicModal.setPanelContent('top-right', '<h4>Top Right</h4>');
      dynamicModal.setPanelContent('bottom-left', '<h4>Bottom Left</h4>');
      dynamicModal.setPanelContent('bottom-right', '<h4>Bottom Right</h4>');
    }
  }
</script>
```

### Loading States and Error Handling
```html
<terminal-modal id="asyncModal" title="Data Loading">
  <div slot="main">
    <h3>Loading Data...</h3>
    <terminal-button onclick="loadData()">Load Data</terminal-button>
  </div>
</terminal-modal>

<script>
  const asyncModal = document.getElementById('asyncModal');
  
  async function loadData() {
    asyncModal.showLoading();
    
    try {
      const data = await fetch('/api/data');
      const result = await data.json();
      
      asyncModal.setPanelContent('main', `
        <h3>Data Loaded</h3>
        <pre>${JSON.stringify(result, null, 2)}</pre>
      `);
    } catch (error) {
      asyncModal.setPanelContent('main', `
        <h3>Error</h3>
        <p style="color: #ff3333;">${error.message}</p>
        <terminal-button onclick="loadData()">Retry</terminal-button>
      `);
    } finally {
      asyncModal.hideLoading();
    }
  }
</script>
```

### Error/Warning Dialogs
```html
<!-- Error Dialog with Red Theme -->
<terminal-modal id="errorModal" title="⚠ Error" size="sm"
                style="--terminal-green: #ff3333; --terminal-green-dim: #cc2222;">
  <div style="background: rgba(255, 51, 51, 0.1); border: 1px solid #ff3333;
              padding: 15px; margin-bottom: 20px; border-radius: 4px;">
    <p style="color: #ff6b6b;">A critical error has occurred!</p>
  </div>
  <terminal-button variant="danger" onclick="errorModal.close()">OK</terminal-button>
</terminal-modal>

<!-- Warning Dialog with Yellow Theme -->
<terminal-modal id="warningModal" title="⚠ Warning" size="md"
                style="--terminal-green: #ffd700; --terminal-green-dim: #ccaa00;">
  <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700;
              padding: 20px; margin-bottom: 20px; border-radius: 4px;">
    <h4 style="color: #ffd700;">Unsaved Changes</h4>
    <p style="color: #ffdd44;">Your changes will be lost if you continue.</p>
  </div>
  <terminal-button variant="primary" onclick="save()">Save</terminal-button>
  <terminal-button variant="danger" onclick="discard()">Discard</terminal-button>
</terminal-modal>
```

### Form Validation with Prevent Close
```html
<terminal-modal id="formModal" title="User Profile">
  <form slot="main" id="userForm">
    <h3>Edit Profile</h3>
    <label>
      Name: <input type="text" name="name" required>
    </label>
    <label>
      Email: <input type="email" name="email" required>
    </label>
    <div class="form-actions">
      <terminal-button type="submit">Save</terminal-button>
      <terminal-button type="button" onclick="formModal.close()">Cancel</terminal-button>
    </div>
  </form>
</terminal-modal>

<script>
  const formModal = document.getElementById('formModal');
  const userForm = document.getElementById('userForm');
  let formDirty = false;
  
  // Track form changes
  userForm.addEventListener('input', () => {
    formDirty = true;
  });
  
  // Prevent closing if form has unsaved changes
  formModal.addEventListener('modal-before-close', (e) => {
    if (formDirty && !confirm('Unsaved changes will be lost. Continue?')) {
      e.preventDefault();
    }
  });
  
  // Reset on successful save
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save logic here...
    formDirty = false;
    formModal.close();
  });
</script>
```

## Styling Variables

```css
/* Terminal Modal Variables */
--panel-spacing: var(--spacing-md);
--panel-border: 1px solid var(--terminal-gray-light);

/* Base Terminal Variables */
--terminal-green: #00ff41;
--terminal-green-dim: #00cc33;
--terminal-gray-dark: #242424;
--terminal-gray-light: #404040;
--terminal-black: #0a0a0a;
--font-mono: 'SF Mono', 'Monaco', monospace;
--spacing-md: 16px;
--spacing-lg: 24px;
```

## Accessibility

- **Keyboard Navigation**: Escape key closes modal, focus trapping
- **ARIA Labels**: Proper role and aria-modal attributes
- **Screen Readers**: Semantic HTML structure and announcements
- **Focus Management**: Auto-focus on open, restore focus on close
- **Visual Indicators**: Clear focus states and visual hierarchy

## Browser Support

- Chrome 67+ (Custom Elements v1)
- Firefox 63+ (Custom Elements v1)
- Safari 10.1+ (Custom Elements v1)
- Edge 79+ (Chromium-based)

## Integration

The TerminalModal component integrates seamlessly with other Terminal components:

```javascript
// Use with other Terminal components
const modal = document.querySelector('terminal-modal');
const dropdown = modal.querySelector('terminal-dropdown');
const slider = modal.querySelector('terminal-slider');

// Chain operations
modal
  .setLayout('2-column')
  .setTitle('Control Panel')
  .show();
```