# TTabsLit

A tab navigation component for organizing content into switchable panels with terminal styling.

## Tag Name

`t-tabs`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-tabs` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `tabs` | `Array` | `[]` | No | Array of tab objects with `id`, `label`, optional `icon`, `disabled`, `unclosable` |
| `activeTab` | `String` | `''` | Yes | ID of the currently active tab (attribute: `active-tab`) |
| `orientation` | `String` | `'horizontal'` | Yes | Tab layout: `'horizontal'` or `'vertical'` |
| `variant` | `String` | `'default'` | Yes | Visual style: `'default'`, `'boxed'`, `'pills'` |
| `size` | `String` | `'md'` | Yes | Size: `'sm'`, `'md'`, `'lg'` |
| `lazy` | `Boolean` | `false` | Yes | Only render active tab content (lazy loading) |
| `closable` | `Boolean` | `false` | Yes | Show close buttons on tabs (respects `unclosable` property on individual tabs) |

## Methods

### selectTab(tabId)
Select a tab by ID.

**Parameters:**
- `tabId` (String): ID of tab to select

**Fires:** `tab-change`

### addTab(tab)
Add a new tab dynamically.

**Parameters:**
- `tab` (Object): Tab object with `id`, `label`, etc.

### removeTab(tabId)
Remove a tab by ID.

**Parameters:**
- `tabId` (String): ID of tab to remove

**Fires:** `tab-close`

### getActiveTab()
Get the currently active tab object.

**Returns:** `Object|null` - Active tab or null

## Events

### tab-change
Fired when the active tab changes.

```javascript
{
  detail: {
    tabId: 'tab-1',
    previousTabId: 'tab-0',
    tab: { id: 'tab-1', label: 'Tab 1', ... }
  }
}
```

### tab-close
Fired when a tab is closed (if closable).

```javascript
{
  detail: {
    tabId: 'tab-1',
    tab: { id: 'tab-1', label: 'Tab 1', ... }
  }
}
```

## Examples

### Basic Tabs

```html
<t-tabs .tabs=${[
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
  { id: 'about', label: 'About' }
]} active-tab="home">
  <div slot="tab-home">Home content</div>
  <div slot="tab-settings">Settings content</div>
  <div slot="tab-about">About content</div>
</t-tabs>
```

### Tabs with Icons and Badges

```html
<t-tabs .tabs=${[
  { id: 'inbox', label: 'Inbox', icon: 'mail', badge: '5' },
  { id: 'sent', label: 'Sent', icon: 'send' },
  { id: 'trash', label: 'Trash', icon: 'trash', disabled: true }
]} active-tab="inbox">
  <div slot="tab-inbox">Inbox messages</div>
  <div slot="tab-sent">Sent messages</div>
  <div slot="tab-trash">Deleted messages</div>
</t-tabs>
```

### Vertical Pills Variant

```html
<t-tabs
  orientation="vertical"
  variant="pills"
  .tabs=${[
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' }
  ]}>
  <div slot="tab-profile">Profile settings</div>
  <div slot="tab-security">Security settings</div>
  <div slot="tab-notifications">Notification preferences</div>
</t-tabs>
```

### Closable Tabs

```html
<t-tabs closable .tabs=${tabs} @tab-close=${handleClose}>
  <!-- Tab content slots -->
</t-tabs>
```

### Programmatic Control

```javascript
const tabs = document.querySelector('t-tabs');

// Select a tab
tabs.selectTab('settings');

// Add a new tab
tabs.addTab({ id: 'new', label: 'New Tab' });

// Remove a tab
tabs.removeTab('old-tab');

// Listen for changes
tabs.addEventListener('tab-change', (e) => {
  console.log('Switched to:', e.detail.tabId);
});
```

## Slots

| Slot | Description |
|------|-------------|
| `tab-{id}` | Content for each tab panel (use tab ID) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--tabs-bg` | `var(--terminal-black)` | Tab bar background |
| `--tabs-color` | `var(--terminal-green)` | Active tab color |
| `--tabs-border` | `var(--terminal-gray-dark)` | Border color |

## Related Components

- [TAccordionLit](./TAccordionLit.md) - Collapsible sections
- [TPanelLit](./TPanelLit.md) - Panel container
