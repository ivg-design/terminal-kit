# UI ELEMENT MIGRATION MAP
## All Styled Elements Grouped by Component

### 🎨 COLOR FIXES REQUIRED
**CRITICAL: Original uses #00ff41, NOT #00ff00**
- --text-primary: #00ff41
- --text-secondary: #00cc33  
- --text-muted: #008822
- --border-color: #00ff41
- --accent: #00ff41

### 📦 BUTTON COMPONENTS
```css
/* File: /css/components/button.css */

.btn {
  height: 28px; /* EXACT from original */
  padding: 0 12px;
  background: #242424;
  border: 1px solid #333333;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary { border-color: #00ff41; }
.btn-icon { width: 28px; padding: 0; }
.btn-small { height: 20px; width: 20px; }
.btn-toggle { width: 130px; /* FIXED WIDTH */ }

/* Icons: Phosphor at 14px (small: 12px) */
```

### 🎛️ CONTROL PANEL
```css
/* File: /css/panels/controls-panel.css */

.control-panel {
  background: #1a1a1a;
  border-bottom: 1px solid #333333;
  padding: 12px;
  height: 350px; /* FIXED HEIGHT */
}

.control-panel-grid {
  display: flex;
  gap: 12px;
}

.left-column { flex: 0 0 60%; }
.right-column { flex: 0 0 calc(40% - 12px); }

.file-operations,
.color-controls {
  border: 0.5px solid #00ff41;
  background: #1a1a1a;
  padding: 8px;
}
```

### 🔽 DROPDOWN COMPONENTS
```css
/* File: /css/components/dropdown.css */

.nested-dropdown-container { position: relative; }
.nested-dropdown-button {
  height: 28px;
  min-width: 300px;
  background: #242424;
  border: 1px solid #333333;
}

.nested-dropdown-panel {
  width: 200%;
  max-width: 600px;
  max-height: 400px;
  background: #1a1a1a;
  border: 1px solid #00ff41;
  z-index: 1000;
}

.tree-folder, .tree-file { /* Nested tree structure */ }
```

### 🪟 MODAL COMPONENTS
```css
/* File: /css/components/modal.css */

.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.modal-content {
  background: #0a0a0a;
  border: 1px solid #00ff41;
  min-width: 500px;
  max-height: 70vh;
}

/* Special Modals */
.animation-manager-dialog { z-index: 10000; }
.metadata-editor-dialog { z-index: 10001; }
.files-manager-modal { /* User files */ }
```

### 🎨 COLOR PICKER
```css
/* File: /css/components/form.css (add to) */

.color-picker-container {
  width: 28px;
  height: 28px;
  border: 0.5px solid #00ff41;
}

/* Pickr overrides */
.pcr-app {
  background: #1a1a1a !important;
  border: 1px solid #00ff41 !important;
}
```

### 📝 CSS EDITOR
```css
/* File: /css/panels/css-editor-panel.css */

.css-editor-section {
  border: 0.5px solid #00ff41;
  background: #1a1a1a;
}

.css-textarea {
  background: #0a0a0a;
  color: #00ff41;
  font-size: 11px;
}
```

### 🎮 RIVE CONTROLS
```css
/* File: /css/panels/rive-controls-panel.css */

.rive-controls-section {
  border: 0.5px solid #00ff41;
  background: #1a1a1a;
}

.dynamic-controls-content {
  background: #0a0a0a;
  overflow-y: auto;
}

.control-row input { height: 22px; }
```

### 📊 STATUS BAR
```css
/* File: /css/components/status-bar.css (create) */

.status-bar {
  background: #1a1a1a;
  border-top: 1px solid #333333;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.version-indicator {
  margin-left: auto;
  color: #00ff41; /* green for prod */
}
```

### 🔄 LOADING STATES
```css
/* File: /css/components/loading.css (create) */

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #333333;
  border-top-color: #00ff41;
  animation: spin 1s linear infinite;
}
```

### 👤 USER BADGE
```css
/* File: /css/components/user-badge.css (create) */

.user-badge {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 999999;
  background: #1a1a1a;
  border: 1px solid #00ff41;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
```

### 📱 RESPONSIVE BREAKPOINTS
```css
/* File: /css/responsive/breakpoints.css */

/* Desktop: ≥1025px - Side-by-side */
/* Tablet: ≤1024px - Stacked, slide panel */
/* Mobile: ≤768px - Larger slide panel, wrapped controls */
/* Small: ≤480px - Reduced font sizes */

@media (max-width: 1024px) {
  .right-column.slide-panel {
    position: fixed;
    transform: translateX(100%);
    width: 40vw;
    min-width: 320px;
    z-index: 9999;
  }
}
```

## 🚨 MISSING ELEMENTS TO ADD

### 1. Tag Manager
```html
<div class="tag-manager-section">
  <div class="tag-manager-header">
    <span>TAGS</span>
    <button class="btn btn-sm">+</button>
  </div>
  <div class="tag-list"></div>
</div>
```

### 2. Animation Library
```html
<div class="animation-library-panel panel hidden">
  <div class="panel-header">
    <div class="panel-title">ANIMATION LIBRARY</div>
  </div>
  <div class="library-grid"></div>
</div>
```

### 3. Metadata Editor
```html
<div class="metadata-editor-dialog">
  <!-- Tag chips, categories -->
</div>
```

### 4. Code Export Panel
```html
<div class="code-export-panel">
  <select id="export-format">
    <option>HTML</option>
    <option>React</option>
  </select>
  <textarea class="export-code-textarea"></textarea>
</div>
```

## ✅ MIGRATION CHECKLIST

- [ ] Fix ALL color values from #00ff00 to #00ff41
- [ ] Set control-height to exactly 28px
- [ ] Import Phosphor icons at correct sizes
- [ ] Remove legacy panels.css import (line 36)
- [ ] Remove legacy modals.css import (line 37)
- [ ] Add missing HTML elements (4 components)
- [ ] Connect JavaScript event listeners
- [ ] Test all 3 responsive breakpoints
- [ ] Verify z-index layers work correctly
- [ ] Test modal stacking and animations
- [ ] Verify dropdown tree navigation
- [ ] Test color picker integration
- [ ] Ensure status bar updates work
- [ ] Test loading states
- [ ] Verify user badge stays on top

## 🔥 CRITICAL FIXES

1. **Colors**: #00ff41 NOT #00ff00
2. **Heights**: 28px for controls
3. **Font**: SF Mono first, then fallbacks
4. **Spacing**: Use exact px values (4,8,12,16,20)
5. **Borders**: 0.5px for thin, 1px normal