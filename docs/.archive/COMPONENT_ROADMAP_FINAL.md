# Terminal UI Component Library - FINAL Roadmap

## ✅ Already Built (6 components)
1. **TerminalButton** ✓
2. **TerminalInput** ✓
3. **TerminalDropdown** ✓
4. **TerminalSlider** ✓
5. **TerminalToggle** ✓
6. **TerminalColorPicker** ✓

## 🎯 ACTUALLY NEEDED Components

### Priority 1: Core UI Updates (2 components/updates)

#### Button Enhancement
- **TerminalButton (Toggle Variant)** - Add stateful toggle mode
  - Two-state button (play/pause, expand/collapse)
  - Different icons for each state
  - Different colors for each state
  - API: `setToggleState()`, `onToggle` event
  ```javascript
  <terminal-button 
    variant="toggle"
    icon-on="playIcon"
    icon-off="pauseIcon"
    color-on="#00ff41"
    color-off="#ff0041">
  </terminal-button>
  ```

#### User System
- **TerminalUserMenu** - Dropdown menu for user actions
  - Triggered by UserBadge click
  - Profile, settings, logout options
  - Integrates with Clerk/Supabase

### Priority 2: Layout Components (3 components)

#### Status Bar
- **TerminalStatusBar** - Modular status display
  - Multiple text/icon fields
  - Marquee scrolling for long text
  - Labeled data fields
  - Dynamic population via API
  ```html
  <terminal-status-bar>
    <terminal-status-field label="Status" icon="dotIcon" marquee>Ready</terminal-status-field>
    <terminal-status-field label="Files">12</terminal-status-field>
    <terminal-status-field label="User">John Doe</terminal-status-field>
  </terminal-status-bar>
  ```

#### Panel System
- **TerminalPanel** - Flexible container component
  - **Three modes:**
    - With header (title, icon, actions)
    - Headless (just content area)
    - With taskbar (bottom bar for controls/status)
  - Collapsible (when header present)
  - Can nest any components
  - Header actions (minimize, close, menu)
  - Optional taskbar slot for bottom controls
  ```html
  <!-- With Header -->
  <terminal-panel title="CSS Editor" icon="codeIcon" collapsible>
    <terminal-button slot="header-actions" variant="icon">...</terminal-button>
    <textarea slot="content"></textarea>
  </terminal-panel>
  
  <!-- Headless -->
  <terminal-panel headless>
    <div slot="content">Direct content, no header</div>
  </terminal-panel>
  
  <!-- With Taskbar -->
  <terminal-panel title="Animation">
    <canvas slot="content"></canvas>
    <terminal-status-bar slot="taskbar">
      <terminal-button variant="toggle" icon-on="playIcon" icon-off="pauseIcon"></terminal-button>
      <terminal-slider min="0" max="2" value="1" label="Speed"></terminal-slider>
    </terminal-status-bar>
  </terminal-panel>
  ```

#### Modal with Layouts
- **TerminalModal** - Flexible modal dialog
  - Multiple layout modes:
    - Single panel
    - Two columns
    - 2x2 grid
    - 1-2-1 (header-2cols-footer)
    - 2-1 (2 top, 1 bottom)
  - Can house multiple panels
  ```html
  <terminal-modal layout="2-column">
    <terminal-panel slot="left">...</terminal-panel>
    <terminal-panel slot="right">...</terminal-panel>
  </terminal-modal>
  ```

### Priority 3: Data Components (3 components)

#### Dynamic Controls
- **TerminalDynamicControls** - Recursive control generator
  - Control types:
    - Number input
    - Color input
    - Dropdown
    - Text input
    - Trigger button
    - Boolean checkbox
  - Nestable (view model nesting)
  - Collapsible at every level
  - API to set collapsed states
  ```javascript
  const controlSchema = {
    type: 'group',
    label: 'Animation Settings',
    collapsed: false,
    controls: [
      { type: 'number', label: 'Speed', min: 0, max: 2, value: 1 },
      { type: 'color', label: 'Background', value: '#000000' },
      { type: 'group', label: 'Advanced', collapsed: true, controls: [...] }
    ]
  };
  ```

#### Tree View
- **TerminalTreeView** - Hierarchical data display
  - For animation manager
  - File browser
  - Nested structures
  - Expand/collapse nodes
  - Selection states
  ```html
  <terminal-tree-view>
    <terminal-tree-node label="Animations" expanded>
      <terminal-tree-node label="Intro.riv" icon="fileIcon"></terminal-tree-node>
      <terminal-tree-node label="Loop.riv" icon="fileIcon"></terminal-tree-node>
    </terminal-tree-node>
  </terminal-tree-view>
  ```

#### Feedback
- **TerminalToast** - Simple notifications
- **TerminalLoader** - Loading states

### Priority 4: Styling & Integration

#### Clerk Modal Styling
- Custom CSS for Clerk components to match terminal theme
- Override Clerk's default styles
- Maintain accessibility

## 📐 Component Architecture

### TerminalButton Toggle Mode
```javascript
class TerminalButton extends TerminalComponent {
  static get observedAttributes() {
    return [...existing, 'variant', 'icon-on', 'icon-off', 'color-on', 'color-off', 'toggle-state'];
  }
  
  toggle() {
    if (this.variant === 'toggle') {
      this.toggleState = !this.toggleState;
      this.updateIcon();
      this.updateColor();
      this.emit('toggle', { state: this.toggleState });
    }
  }
}
```

### TerminalDynamicControls Schema
```javascript
{
  type: 'group|number|color|dropdown|text|trigger|boolean',
  label: 'Control Label',
  name: 'field_name',
  value: any,
  collapsed: boolean,
  controls: [], // for groups
  options: [], // for dropdowns
  min/max: number, // for number inputs
  placeholder: string, // for text
  onChange: (value) => {}
}
```

## 🏗 Realistic Timeline

### Week 1
- TerminalButton toggle variant
- TerminalUserMenu
- TerminalStatusBar
- Clerk styling

### Week 2
- TerminalPanel
- TerminalModal with layouts
- TerminalDynamicControls

### Week 3
- TerminalTreeView
- TerminalToast
- TerminalLoader
- Testing & refinement

## 📊 Final Metrics
- **Total New Components**: 8
- **Updates to Existing**: 1 (Button)
- **Bundle Size**: < 40kb
- **Development Time**: 3 weeks

## ✅ What This Enables

### Current App Needs
- User menu for profile/logout ✓
- Status bar for app state ✓
- Panels for CSS editor, controls ✓
- Dynamic Rive controls ✓
- Modal for various dialogs ✓

### Future Features
- Animation manager with tree view ✓
- Complex modal layouts ✓
- Nested control groups ✓
- Status monitoring ✓

## 🚫 What We're NOT Building
- ~~File cards~~ - Use existing HTML/CSS
- ~~Tabs~~ - Use existing HTML/CSS
- ~~Progress bars~~ - Use existing HTML/CSS
- ~~Playback controls~~ - Just icon buttons
- ~~Cards~~ - Just styled divs

---

**TOTAL COMPONENTS: 14** (6 existing + 8 new)
**FOCUS: Actual functionality needed, not generic components**