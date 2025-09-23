# COMPLETE ELEMENT TO COMPONENT MAP

## ✅ PREREQUISITES

### Fonts Needed
```
PRIMARY MONOSPACE FONTS (in order of preference):
1. SF Mono (macOS system font)
2. Monaco (fallback monospace)
3. Inconsolata (Google Font - needs import)
4. Fira Code (Google Font - needs import)
5. Courier New (universal fallback)

DISPLAY FONT (for headers/special UI):
- Orbitron (Google Font - for cyber/terminal aesthetic)
- JetBrains Mono (alternative monospace)

Font Stack CSS:
--font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
--font-display: 'Orbitron', 'SF Mono', monospace;
```

### Icons Needed (Phosphor Icons)
```
CDN: https://unpkg.com/phosphor-icons@1.4.2/src/css/phosphor.css

Icons used:
ph-play, ph-pause, ph-upload, ph-download, ph-gear, ph-user, ph-folder, 
ph-folders, ph-sign-out, ph-sliders-horizontal, ph-paint-bucket, 
ph-frame-corners, ph-magnifying-glass, ph-code, ph-floppy-disk, 
ph-copy, ph-trash, ph-push-pin, ph-x, ph-chevron-down, ph-chevron-right,
ph-file, ph-check, ph-plus, ph-arrow-right, ph-info, ph-warning-circle,
ph-check-circle, ph-x-circle
```

### External Libraries
```
1. Pickr Color Picker:
   CSS: https://cdn.jsdelivr.net/npm/@simonwep/pickr@1.9.1/dist/themes/classic.min.css
   JS: https://cdn.jsdelivr.net/npm/@simonwep/pickr@1.9.1/dist/pickr.min.js

2. Rive Runtime:
   JS: https://unpkg.com/@rive-app/canvas@2.15.7/rive.js

3. Supabase Client (for storage):
   JS: https://unpkg.com/@supabase/supabase-js@2

4. Clerk Authentication:
   JS: https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js
```

## 🗂️ COMPONENT GROUPINGS

### 1. AUTHENTICATION COMPONENT
**Elements:**
- div.auth-overlay#authOverlay
- div.auth-content
- div.auth-spinner
- h1 (auth title)
- p (auth messages)

**Responsive:** No breakpoints needed

---

### 2. USER BADGE COMPONENT
**Elements:**
- div.user-badge#userBadge
- img#userAvatar
- span#userName
- div.user-menu
- button.menu-btn
- div.user-dropdown#userDropdown
- button (profile/files/manager/signout)

**Responsive:** ✅ YES
- Mobile: Smaller padding, reduced font

---

### 3. BUTTON COMPONENT
**Elements:**
- button.btn
- button.btn.btn-primary
- button.btn.btn-icon
- button.btn.btn-toggle
- button.btn-small
- button#play-btn
- button#pause-btn
- button#download-btn
- button#toggle-btn
- button#upload-btn
- button#css-save-btn
- button#css-copy-btn
- button#css-clear-btn
- button#panelPinBtn
- button.header-btn
- button.slide-panel-close
- button.btn.btn-secondary

**Responsive:** ✅ YES
- Mobile: Smaller padding

---

### 4. CONTROL PANEL COMPONENT
**Elements:**
- div.control-panel
- div.control-panel-grid
- div.left-column
- div.right-column
- div.file-operations
- div.color-controls
- div.control-row
- div.control-group
- div.control-group.select-with-info
- div.control-group.zoom-group

**Responsive:** ✅ YES
- Tablet: Stack columns
- Mobile: Wrap controls

---

### 5. DROPDOWN COMPONENT (NESTED)
**Elements:**
- div#animation-dropdown
- div.nested-dropdown-container
- div.nested-dropdown-button
- span.dropdown-label
- span.dropdown-arrow
- div.nested-dropdown-panel
- input.dropdown-search
- div.dropdown-tree
- div.tree-folder
- div.folder-header
- span.folder-arrow
- span.folder-icon
- span.folder-name
- span.folder-count
- div.folder-content
- div.tree-file
- span.file-icon
- span.file-name
- span.info-icon

**Responsive:** ✅ YES
- Mobile: Full width panel

---

### 6. COLOR PICKER COMPONENT
**Elements:**
- div.color-picker-container
- div#canvas-color-container
- div#wrapper-color-container
- .pcr-app (Pickr overrides)
- .pcr-button
- .pcr-selection
- .pcr-interaction

**Responsive:** No breakpoints needed

---

### 7. FORM INPUT COMPONENT
**Elements:**
- input[type="file"]#file-upload
- input[type="range"]#zoom-slider
- input[type="text"]
- input[type="number"]
- input[type="checkbox"]
- input[type="color"]
- textarea.css-textarea#css-editor
- select.select-control
- label.control-label
- span.slider-value#zoom-value

**Responsive:** No breakpoints needed

---

### 8. CSS EDITOR COMPONENT
**Elements:**
- div.css-editor-section
- div.editor-header
- h3 (editor title)
- div.editor-actions
- textarea.css-textarea#css-editor

**Responsive:** No breakpoints needed

---

### 9. RIVE CONTROLS PANEL COMPONENT
**Elements:**
- div.right-column.slide-panel#rivePanel
- div.rive-controls-section
- div.controls-header
- span.header-panel-controls
- span.header-title
- i.header-icon
- div.dynamic-controls-content#dynamic-controls
- div.placeholder-text
- div.control-section (dynamic)
- button.rive-panel-toggle#rivePanelToggle

**Responsive:** ✅ YES
- Tablet: Slide-out panel
- Mobile: 70vw width

---

### 10. CANVAS COMPONENT
**Elements:**
- div.canvas-area
- div.canvas-wrapper#canvas-wrapper
- canvas#rive-canvas

**Responsive:** No breakpoints needed

---

### 11. LOADING COMPONENT
**Elements:**
- div.loading-indicator#loading-indicator
- div.spinner
- span (loading text)
- div.loading (in modals)

**Responsive:** No breakpoints needed

---

### 12. STATUS BAR COMPONENT
**Elements:**
- div.status-bar
- div.status-section
- span.status-label
- span.status-value
- span#status-filename
- span#status-artboard
- span#status-state-machine
- span#status-view-model
- span#status-fps
- div.version-indicator#version-indicator
- span#app-version

**Responsive:** ✅ YES
- Mobile: Smaller font

---

### 13. MODAL COMPONENT
**Elements:**
- div.files-manager-modal
- div.modal-overlay
- div.modal-content
- div.modal-buttons
- h3 (modal titles)
- div.files-list#filesList
- div.file-item
- div.file-info
- div.file-name
- span.file-badge.user
- span.file-badge.admin
- div.file-meta

**Responsive:** ✅ YES
- Mobile: Full width

---

### 14. ANIMATION MANAGER COMPONENT (FROM JS)
**Elements:**
- div.animation-manager-dialog
- div.manager-overlay
- div.manager-content
- div.manager-header
- div.manager-body
- div.manager-sidebar
- div.sidebar-toolbar
- div.tree-view
- div.tree-node
- div.tree-node-content
- span.tree-toggle
- span.tree-indent
- span.tree-icon
- span.tree-label
- div.tree-children
- div.manager-details
- div#animation-details
- div.detail-section
- div.detail-actions
- div.manager-footer
- div.empty-state

**Responsive:** ✅ YES
- Mobile: Stack sidebar/details

---

### 15. METADATA EDITOR COMPONENT (FROM JS)
**Elements:**
- div.metadata-editor-dialog
- div.editor-overlay
- div.editor-content
- div.editor-header
- span.admin-badge
- div.editor-form
- div.form-group
- div.combined-input-container
- input.inline-input
- div.tag-chip
- span.tag-remove
- div.tag-suggestions
- span.tag-suggestion
- div.editor-actions
- div.editor-warning
- div.editor-message

**Responsive:** ✅ YES
- Mobile: 90% width

---

### 16. TAG MANAGER COMPONENT (NEEDS ADDING)
**Elements:**
- div.tag-manager-section
- div.tag-manager-header
- span.tag-manager-title
- button.tag-add-btn
- div.tag-list
- div.tag-item

**Responsive:** No breakpoints needed

---

### 17. ANIMATION LIBRARY COMPONENT (NEEDS ADDING)
**Elements:**
- button.library-toggle-btn
- div.animation-library-panel
- div.library-search
- input#library-search
- div.library-grid
- div.library-item
- img.library-thumbnail
- span.library-name

**Responsive:** ✅ YES
- Mobile: 2 column grid

---

### 18. CODE EXPORT COMPONENT (NEEDS ADDING)
**Elements:**
- div.code-export-panel
- select#export-format
- textarea.export-code-textarea
- div.export-actions
- button#export-copy-btn
- button#export-download-btn

**Responsive:** No breakpoints needed

---

## 📱 RESPONSIVE BREAKPOINTS SUMMARY

### Components Requiring Breakpoints:
1. **User Badge** - Smaller on mobile
2. **Buttons** - Reduced padding on mobile
3. **Control Panel** - Stack layout on tablet/mobile
4. **Dropdown** - Full width on mobile
5. **Rive Controls Panel** - Slide-out on tablet/mobile
6. **Status Bar** - Smaller font on mobile
7. **Modals** - Full width on mobile
8. **Animation Manager** - Stack layout on mobile
9. **Metadata Editor** - Width adjustment on mobile
10. **Animation Library** - Grid adjustment on mobile

### Breakpoint Values:
- **Desktop**: ≥1025px
- **Tablet**: ≤1024px
- **Mobile**: ≤768px
- **Small Mobile**: ≤480px

---

## 🔄 MIGRATION ORDER

### Phase 1: Core Components
1. Fix terminal.css colors (#00ff41)
2. Update variables.css
3. Button component
4. Form inputs
5. Dropdowns

### Phase 2: Layout Components
6. Control panel
7. Status bar
8. Canvas area
9. Loading states

### Phase 3: Interactive Components
10. Modals
11. Color picker
12. CSS editor
13. Rive controls panel

### Phase 4: Advanced Components
14. Animation manager
15. Metadata editor
16. User badge/menu

### Phase 5: New Components
17. Tag manager
18. Animation library
19. Code export panel

### Phase 6: Responsive Testing
20. Test all breakpoints
21. Verify slide-out panels
22. Check mobile usability