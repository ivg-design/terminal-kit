# Terminal-Kit Component Specifications

Recommended additional components for building dashboard and chat services.

---

## HIGH PRIORITY

---

### t-tabs
Tab navigation with panel switching

**Features:**
- Horizontal/vertical orientation
- Lazy loading of tab content
- Closable tabs
- Draggable reorder
- Overflow scroll/dropdown for many tabs
- Keyboard navigation (arrow keys, Home/End)
- Badge support per tab
- Disabled state per tab

**API:**
```typescript
// Properties
@property() tabs: Array<{id: string, label: string, icon?: string, badge?: number, disabled?: boolean, closable?: boolean}>
@property() activeTab: string
@property() orientation: 'horizontal' | 'vertical' = 'horizontal'
@property() variant: 'default' | 'pills' | 'underline' = 'default'
@property() size: 'sm' | 'md' | 'lg' = 'md'
@property() lazy: boolean = false  // Only render active tab content
@property() draggable: boolean = false

// Events
@event('tab-change') detail: {tabId: string, previousTabId: string}
@event('tab-close') detail: {tabId: string}
@event('tab-reorder') detail: {tabs: string[]}

// Slots
<slot name="tab-{id}">  // Content for each tab
<slot name="tab-icon-{id}">  // Custom icon per tab
```

**Variants:**
| Variant | Description |
|---------|-------------|
| `default` | Standard tabs with border |
| `pills` | Rounded pill buttons |
| `underline` | Bottom border indicator |
| `vertical` | Side navigation style |

---

### t-badge
Count/status indicator badges

**Features:**
- Numeric count with max (99+)
- Dot-only mode (no number)
- Standalone or attached to element
- Pulse animation for attention
- Color variants by status
- Position control when attached

**API:**
```typescript
// Properties
@property() count: number | null = null
@property() max: number = 99  // Shows "99+" if exceeded
@property() dot: boolean = false  // Dot only, no number
@property() variant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
@property() size: 'sm' | 'md' | 'lg' = 'md'
@property() pulse: boolean = false
@property() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right'
@property() offset: {x: number, y: number} = {x: 0, y: 0}
@property() hidden: boolean = false  // Hide when count is 0

// Slots
<slot>  // Element to attach badge to
```

**Variants:**
| Variant | Color | Use Case |
|---------|-------|----------|
| `default` | Green | Neutral counts |
| `success` | Bright green | Completed items |
| `warning` | Yellow/amber | Needs attention |
| `error` | Red | Critical/overdue |
| `info` | Blue | Informational |

---

### t-progress
Progress indicators (bar/ring)

**Features:**
- Linear bar or circular ring
- Determinate (percentage) or indeterminate
- Segmented/stepped progress
- Buffer/secondary progress
- Label inside or outside
- Striped/animated patterns
- Color transitions based on value

**API:**
```typescript
// Properties
@property() value: number = 0  // 0-100
@property() max: number = 100
@property() type: 'bar' | 'ring' = 'bar'
@property() variant: 'default' | 'success' | 'warning' | 'error' = 'default'
@property() size: 'xs' | 'sm' | 'md' | 'lg' = 'md'
@property() indeterminate: boolean = false
@property() showLabel: boolean = false
@property() labelPosition: 'inside' | 'outside' | 'center' = 'outside'
@property() labelFormat: (value: number, max: number) => string  // Custom formatter
@property() striped: boolean = false
@property() animated: boolean = false  // Animate stripes
@property() buffer: number = 0  // Secondary progress (buffering)
@property() segments: number = 0  // Divide into segments
@property() thresholds: Array<{value: number, variant: string}>  // Auto-color by value

// CSS Custom Properties
--t-progress-height
--t-progress-radius
--t-progress-track-color
--t-progress-fill-color
--t-progress-transition
```

**Variants:**
| Variant | Use Case |
|---------|----------|
| `default` | Standard progress |
| `success` | Completion, health |
| `warning` | Approaching limit |
| `error` | Over limit, critical |

---

### t-tooltip
Hover/focus information tooltips

**Features:**
- Multiple trigger modes (hover, click, focus)
- Smart positioning (flip when near edge)
- Arrow pointer
- Rich content support (HTML)
- Delay on show/hide
- Manual control mode
- Touch device support

**API:**
```typescript
// Properties
@property() content: string  // Plain text
@property() html: boolean = false  // Allow HTML in content
@property() position: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto'
@property() trigger: 'hover' | 'click' | 'focus' | 'manual' = 'hover'
@property() delay: number = 200  // ms before show
@property() hideDelay: number = 0  // ms before hide
@property() arrow: boolean = true
@property() maxWidth: string = '250px'
@property() variant: 'default' | 'light' | 'error' = 'default'
@property() disabled: boolean = false
@property() open: boolean = false  // For manual control

// Events
@event('tooltip-show')
@event('tooltip-hide')

// Slots
<slot>  // Trigger element
<slot name="content">  // Rich tooltip content
```

**Variants:**
| Variant | Description |
|---------|-------------|
| `default` | Dark background, light text |
| `light` | Light background, dark text |
| `error` | Red-tinted for validation errors |

---

### t-skeleton
Loading placeholder shapes

**Features:**
- Multiple shape types
- Shimmer animation
- Composable for complex layouts
- Auto-sizing to container
- Custom dimensions
- Disable animation option

**API:**
```typescript
// Properties
@property() type: 'text' | 'heading' | 'avatar' | 'button' | 'card' | 'rect' | 'circle' = 'text'
@property() width: string = '100%'
@property() height: string = 'auto'  // Auto based on type
@property() lines: number = 1  // For text type
@property() animated: boolean = true
@property() radius: string = '4px'

// Presets
<t-skeleton type="text" lines="3">  // Paragraph
<t-skeleton type="avatar" size="lg">  // Circle avatar
<t-skeleton type="card">  // Card with image + text
```

**Types:**
| Type | Shape | Default Size |
|------|-------|--------------|
| `text` | Rounded rect | 100% × 14px |
| `heading` | Rounded rect | 60% × 24px |
| `avatar` | Circle | 40px × 40px |
| `button` | Rounded rect | 80px × 32px |
| `card` | Complex | 100% × 200px |
| `rect` | Rectangle | Custom |
| `circle` | Circle | Custom |

---

## MEDIUM PRIORITY

---

### t-card
Standardized content card container

**Features:**
- Header/body/footer sections
- Clickable/selectable states
- Image/media support
- Loading overlay
- Expandable/collapsible
- Action buttons area
- Border variants

**API:**
```typescript
// Properties
@property() variant: 'default' | 'outlined' | 'elevated' | 'flat' = 'default'
@property() clickable: boolean = false
@property() selected: boolean = false
@property() disabled: boolean = false
@property() loading: boolean = false
@property() expandable: boolean = false
@property() expanded: boolean = true
@property() padding: 'none' | 'sm' | 'md' | 'lg' = 'md'

// Events
@event('card-click')
@event('card-expand') detail: {expanded: boolean}

// Slots
<slot name="header">
<slot name="media">  // Image/video area
<slot>  // Body content
<slot name="actions">  // Footer buttons
```

**Variants:**
| Variant | Description |
|---------|-------------|
| `default` | Border + subtle background |
| `outlined` | Border only, transparent bg |
| `elevated` | Shadow, no border |
| `flat` | No border or shadow |

---

### t-list
Virtualized scrollable list

**Features:**
- Virtual scrolling for performance
- Single/multi select
- Keyboard navigation
- Dividers between items
- Grouped items with headers
- Empty state
- Loading more (infinite scroll)
- Drag to reorder

**API:**
```typescript
// Properties
@property() items: Array<{id: string, [key: string]: any}>
@property() itemHeight: number = 48  // For virtualization
@property() selectable: 'none' | 'single' | 'multi' = 'none'
@property() selected: string | string[] = []
@property() dividers: boolean = false
@property() dense: boolean = false
@property() loading: boolean = false
@property() loadingMore: boolean = false
@property() emptyText: string = 'No items'
@property() groupBy: string  // Property to group by
@property() draggable: boolean = false

// Events
@event('item-click') detail: {item: any}
@event('selection-change') detail: {selected: string[]}
@event('load-more')  // When scrolled near bottom
@event('reorder') detail: {items: any[]}

// Slots
<slot name="item">  // Custom item template
<slot name="empty">
<slot name="loading">
```

---

### t-menu
Dropdown/context menu

**Features:**
- Trigger by click or right-click
- Nested submenus
- Keyboard navigation
- Icons and shortcuts display
- Checkable items
- Dividers
- Disabled items
- Search/filter

**API:**
```typescript
// Properties
@property() items: Array<MenuItem>
@property() trigger: 'click' | 'contextmenu' | 'hover' = 'click'
@property() position: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right' | 'left' = 'bottom-start'
@property() open: boolean = false
@property() searchable: boolean = false
@property() maxHeight: string = '300px'

interface MenuItem {
  id: string
  label: string
  icon?: string
  shortcut?: string  // e.g., "Ctrl+S"
  disabled?: boolean
  checked?: boolean
  children?: MenuItem[]  // Submenu
  divider?: boolean  // Renders as divider
}

// Events
@event('menu-select') detail: {itemId: string, item: MenuItem}
@event('menu-open')
@event('menu-close')

// Slots
<slot>  // Trigger element
```

---

### t-chip
Tag/filter chip component

**Features:**
- Removable (with X button)
- Selectable/toggleable
- Avatar/icon prefix
- Size variants
- Disabled state
- Click action

**API:**
```typescript
// Properties
@property() label: string
@property() variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default'
@property() size: 'sm' | 'md' | 'lg' = 'md'
@property() removable: boolean = false
@property() selectable: boolean = false
@property() selected: boolean = false
@property() disabled: boolean = false
@property() icon: string  // Left icon
@property() avatar: string  // Avatar image URL

// Events
@event('chip-remove')
@event('chip-click')
@event('chip-select') detail: {selected: boolean}

// Slots
<slot name="icon">  // Custom icon
```

**Variants:**
| Variant | Use Case |
|---------|----------|
| `default` | Neutral tags |
| `primary` | Selected/active filters |
| `success` | Positive status |
| `warning` | Attention tags |
| `error` | Error/critical tags |

---

### t-avatar
User/entity avatar display

**Features:**
- Image with fallback
- Initials fallback
- Icon fallback
- Status indicator dot
- Size variants
- Clickable
- Avatar groups (stacked)

**API:**
```typescript
// Properties
@property() src: string  // Image URL
@property() alt: string
@property() initials: string  // Fallback text
@property() icon: string  // Fallback icon
@property() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
@property() shape: 'circle' | 'square' | 'rounded' = 'circle'
@property() status: 'online' | 'offline' | 'busy' | 'away' | null = null
@property() statusPosition: 'top-right' | 'bottom-right' = 'bottom-right'
@property() clickable: boolean = false
@property() border: boolean = false

// Events
@event('avatar-click')
@event('avatar-error')  // Image load failed

// For avatar groups
<t-avatar-group max="3" size="md">
  <t-avatar src="...">
  <t-avatar src="...">
  <t-avatar src="...">
  <t-avatar src="...">  // Shows +1
</t-avatar-group>
```

**Sizes:**
| Size | Dimensions |
|------|------------|
| `xs` | 24px |
| `sm` | 32px |
| `md` | 40px |
| `lg` | 56px |
| `xl` | 80px |

---

### t-timeline
Vertical timeline display

**Features:**
- Left/right/alternating alignment
- Custom icons per item
- Connectors between items
- Collapsible content
- Loading state
- Infinite scroll support

**API:**
```typescript
// Properties
@property() items: Array<TimelineItem>
@property() align: 'left' | 'right' | 'alternate' = 'left'
@property() dense: boolean = false
@property() loading: boolean = false
@property() loadingMore: boolean = false

interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  content?: string
  timestamp?: string
  icon?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  expandable?: boolean
  expanded?: boolean
}

// Events
@event('item-click') detail: {item: TimelineItem}
@event('item-expand') detail: {itemId: string, expanded: boolean}
@event('load-more')

// Slots
<slot name="item-{id}">  // Custom content per item
<slot name="icon-{id}">  // Custom icon per item
```

---

## LOWER PRIORITY

---

### t-calendar
Date picker/calendar view

**Features:**
- Single date / date range / multiple dates
- Month/year navigation
- Min/max date constraints
- Disabled dates
- Highlighted dates
- Week numbers
- Locale support
- Inline or dropdown mode

**API:**
```typescript
// Properties
@property() value: Date | Date[] | {start: Date, end: Date}
@property() mode: 'single' | 'range' | 'multiple' = 'single'
@property() view: 'days' | 'months' | 'years' = 'days'
@property() min: Date
@property() max: Date
@property() disabled: Date[]  // Specific disabled dates
@property() disabledDays: number[]  // e.g., [0, 6] for weekends
@property() highlighted: Date[]
@property() showWeekNumbers: boolean = false
@property() locale: string = 'en-US'
@property() firstDayOfWeek: 0 | 1 = 0  // 0=Sunday, 1=Monday
@property() inline: boolean = false  // Always visible vs dropdown

// Events
@event('date-select') detail: {date: Date | Date[] | {start, end}}
@event('month-change') detail: {month: number, year: number}
@event('view-change') detail: {view: string}
```

---

### t-chart
Simple data visualizations

**Features:**
- Bar (horizontal/vertical)
- Line/area
- Pie/donut
- Sparkline (minimal)
- Responsive sizing
- Tooltips on hover
- Legend
- Axis labels
- Animated transitions

**API:**
```typescript
// Properties
@property() type: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'sparkline' = 'bar'
@property() data: Array<{label: string, value: number, color?: string}>
@property() orientation: 'vertical' | 'horizontal' = 'vertical'  // For bar
@property() showLegend: boolean = false
@property() showLabels: boolean = true
@property() showTooltips: boolean = true
@property() showGrid: boolean = true
@property() animated: boolean = true
@property() height: string = '200px'
@property() colors: string[]  // Custom color palette

// Events
@event('segment-click') detail: {item: DataItem, index: number}
@event('segment-hover') detail: {item: DataItem, index: number}
```

---

### t-tree
Hierarchical tree structure

**Features:**
- Expand/collapse nodes
- Checkbox selection (single/multi)
- Lazy loading children
- Drag and drop reorder
- Search/filter
- Icons per node
- Custom node rendering

**API:**
```typescript
// Properties
@property() nodes: TreeNode[]
@property() selectable: 'none' | 'single' | 'multi' = 'none'
@property() selected: string[]
@property() expanded: string[]
@property() expandOnClick: boolean = true
@property() showCheckboxes: boolean = false
@property() cascadeSelection: boolean = true  // Parent/child checkbox cascade
@property() draggable: boolean = false
@property() searchable: boolean = false
@property() searchQuery: string = ''

interface TreeNode {
  id: string
  label: string
  icon?: string
  children?: TreeNode[]
  lazy?: boolean  // Load children on expand
  disabled?: boolean
  expanded?: boolean
}

// Events
@event('node-click') detail: {node: TreeNode}
@event('node-expand') detail: {nodeId: string, expanded: boolean}
@event('selection-change') detail: {selected: string[]}
@event('node-drop') detail: {nodeId: string, targetId: string, position: 'before'|'after'|'inside'}
@event('lazy-load') detail: {nodeId: string}  // Request children
```

---

### t-splitter
Resizable panel divider

**Features:**
- Horizontal/vertical split
- Multiple panes
- Min/max sizes
- Collapsible panes
- Persist sizes to localStorage
- Snap to positions
- Keyboard resize

**API:**
```typescript
// Properties
@property() orientation: 'horizontal' | 'vertical' = 'horizontal'
@property() sizes: number[]  // Percentages, e.g., [30, 70]
@property() minSizes: number[]  // Min px per pane
@property() maxSizes: number[]  // Max px per pane
@property() collapsible: boolean[]  // Which panes can collapse
@property() collapsed: boolean[]  // Current collapse state
@property() gutterSize: number = 8
@property() snapOffset: number = 30  // Snap to min when within px
@property() storageKey: string  // localStorage key for persistence

// Events
@event('resize') detail: {sizes: number[]}
@event('resize-start')
@event('resize-end') detail: {sizes: number[]}
@event('collapse') detail: {index: number, collapsed: boolean}

// Slots
<slot name="pane-0">
<slot name="pane-1">
// etc.
```

---

## Summary Table

| Component | Priority | Complexity | Dependencies |
|-----------|----------|------------|--------------|
| t-tabs | High | Medium | None |
| t-badge | High | Low | None |
| t-progress | High | Low | None |
| t-tooltip | High | Medium | Floating UI |
| t-skeleton | High | Low | None |
| t-card | Medium | Low | None |
| t-list | Medium | High | Virtual scroll |
| t-menu | Medium | Medium | Floating UI |
| t-chip | Medium | Low | None |
| t-avatar | Medium | Low | None |
| t-timeline | Medium | Medium | None |
| t-calendar | Lower | High | Date library |
| t-chart | Lower | High | Canvas/SVG |
| t-tree | Lower | High | None |
| t-splitter | Lower | Medium | None |
