# TUserMenuLit Component - Complete API Documentation

## Tag Names

- `t-usr`

## Table of Contents
1. [Overview](#overview)
2. [Installation & Import](#installation--import)
3. [Basic Usage](#basic-usage)
4. [Properties (Attributes)](#properties-attributes)
5. [Methods](#methods)
6. [Events](#events)
7. [Menu Item Configuration](#menu-item-configuration)
8. [Icon Support](#icon-support)
9. [Styling & CSS Customization](#styling--css-customization)
10. [Accessibility](#accessibility)
11. [Advanced Examples](#advanced-examples)
12. [Migration Guide](#migration-guide)
13. [Browser Support](#browser-support)
14. [API Reference Summary](#api-reference-summary)

---

## Overview

The `TUserMenuLit` component (`<t-usr>`) is a fully-featured dropdown user menu built with Lit Element. It provides a customizable user badge with avatar support, dropdown menu with configurable items, and comprehensive event handling for user interactions.

**Component Tag:** `<t-usr>`
**Version:** 1.0.0
**Profile:** CORE
**Category:** Navigation
**Dependencies:** Lit 3.0+

### Key Features
- 🎨 Avatar image or initials display
- 📱 Compact mode for mobile views
- ⚡ Custom menu items with icon support
- ♿ Full accessibility with ARIA attributes
- 🎯 Click-outside and Escape key handling
- 🔧 Fully customizable via properties and CSS
- 📊 Built-in logging with ComponentLogger
- 🚀 Shadow DOM encapsulation

---

## Installation & Import

### ES Module Import
```javascript
import '../js/components/TUserMenuLit.js';
```

### HTML Script Tag
```html
<script type="module" src="/js/components/TUserMenuLit.js"></script>
```

### CDN Usage
```html
<script type="module">
  import 'https://your-cdn.com/terminal-kit/TUserMenuLit.js';
</script>
```

---

## Basic Usage

### Minimal Example
```html
<t-usr user-name="John Doe"></t-usr>
```

### With All Attributes
```html
<t-usr
  user-name="Jane Smith"
  user-email="jane@example.com"
  user-avatar="https://example.com/avatar.jpg"
  compact
  disabled
  open>
</t-usr>
```

---

## Properties (Attributes)

### Complete Property Reference

| Property | Attribute | Type | Default | Reflects | Description |
|----------|-----------|------|---------|----------|-------------|
| `userName` | `user-name` | `String` | `'User'` | ✅ | User's display name. Shows in badge and dropdown header. |
| `userEmail` | `user-email` | `String` | `''` | ✅ | User's email address. Displays below name in dropdown header when provided. |
| `userAvatar` | `user-avatar` | `String` | `''` | ❌ | URL to user's avatar image. Falls back to initials if not provided or fails to load. |
| `disabled` | `disabled` | `Boolean` | `false` | ✅ | Disables all interactions with the menu. Applies disabled styling. |
| `open` | `open` | `Boolean` | `false` | ✅ | Controls dropdown visibility. Can be set programmatically or via attribute. |
| `menuItems` | - | `Array` | `[]` | ❌ | Custom menu items. No attribute binding, set via JavaScript only. |
| `compact` | `compact` | `Boolean` | `false` | ✅ | Enables compact mode showing initials only, ideal for mobile/small screens. |

### Property Details

#### userName
```javascript
// Set via attribute
<t-usr user-name="Alice Cooper"></t-usr>

// Set via JavaScript
const menu = document.querySelector('t-usr');
menu.userName = 'Bob Dylan';
```

#### userEmail
```javascript
// Set via attribute
<t-usr user-email="user@company.com"></t-usr>

// Set via JavaScript
menu.userEmail = 'newemail@company.com';
```

#### userAvatar
```javascript
// Absolute URL
<t-usr user-avatar="https://cdn.example.com/avatars/user123.jpg"></t-usr>

// Relative URL
<t-usr user-avatar="/images/avatar.png"></t-usr>

// Data URL
<t-usr user-avatar="data:image/png;base64,iVBORw0KG..."></t-usr>

// JavaScript
menu.userAvatar = 'https://i.pravatar.cc/150?img=5';
```

#### disabled
```javascript
// HTML attribute
<t-usr disabled></t-usr>

// JavaScript
menu.disabled = true;  // Disable
menu.disabled = false; // Enable
```

#### open
```javascript
// Check state
if (menu.open) {
  console.log('Menu is open');
}

// Programmatically control
menu.open = true;  // Open dropdown
menu.open = false; // Close dropdown
```

#### menuItems
```javascript
// Only settable via JavaScript
menu.menuItems = [
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
  { type: 'separator' },
  { id: 'logout', label: 'Sign Out', icon: 'signOut' }
];
```

#### compact
```javascript
// Enable compact mode
<t-usr compact></t-usr>

// Toggle programmatically
menu.compact = true;  // Shows initials only
menu.compact = false; // Shows full name
```

---

## Methods

### Public Methods Reference

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `openMenu()` | None | `void` | Opens the dropdown menu. No-op if disabled. |
| `closeMenu()` | None | `void` | Closes the dropdown menu. |
| `toggleMenu()` | None | `void` | Toggles menu open/close state. |
| `setMenuItems(items)` | `Array` | `void` | Sets custom menu items with icon mapping. |
| `setUserInfo(info)` | `Object` | `void` | Updates user information (name, email, avatar). |

### Method Details

#### openMenu()
Opens the dropdown menu programmatically. Will not open if component is disabled.
```javascript
const menu = document.querySelector('t-usr');
menu.openMenu();

// With disabled check
if (!menu.disabled) {
  menu.openMenu();
}
```

#### closeMenu()
Closes the dropdown menu programmatically.
```javascript
menu.closeMenu();

// Example: Close all menus
document.querySelectorAll('t-usr').forEach(m => m.closeMenu());
```

#### toggleMenu()
Toggles the menu between open and closed states.
```javascript
// Toggle on button click
button.addEventListener('click', () => {
  menu.toggleMenu();
});
```

#### setMenuItems(items)
Sets custom menu items. Automatically maps string icon names to SVG icons.

```javascript
menu.setMenuItems([
  // Standard menu item
  {
    id: 'dashboard',      // Unique identifier
    label: 'Dashboard',   // Display text
    icon: 'dashboard'     // Icon name (mapped internally)
  },

  // Separator
  { type: 'separator' },

  // Item with custom SVG
  {
    id: 'custom',
    label: 'Custom Action',
    icon: '<svg>...</svg>'  // Direct SVG string
  },

  // Item without icon
  {
    id: 'plain',
    label: 'Plain Item'     // No icon property
  }
]);
```

**Supported Icon Names:**
- `'user'`, `'userCircle'` - User profile icon
- `'gear'`, `'settings'` - Settings/configuration icon
- `'signOut'`, `'logout'` - Sign out/logout icon
- `'folder'`, `'files'` - Folder/files icon
- `'grid'`, `'dashboard'` - Dashboard/grid icon
- `'users'` - Multiple users icon

#### setUserInfo(info)
Updates multiple user properties at once.

```javascript
// Update all properties
menu.setUserInfo({
  name: 'John Smith',
  email: 'john@example.com',
  avatar: 'https://example.com/john.jpg'
});

// Partial update (only provided properties are updated)
menu.setUserInfo({
  name: 'Jane Doe'  // Only updates name
});

// Clear email
menu.setUserInfo({
  email: ''
});
```

---

## Events

### Event Reference

| Event | Detail | Bubbles | Composed | Cancelable | Description |
|-------|--------|---------|----------|------------|-------------|
| `menu-open` | None | ✅ | ✅ | ❌ | Fired when dropdown opens |
| `menu-close` | None | ✅ | ✅ | ❌ | Fired when dropdown closes |
| `menu-select` | `{itemId: string}` | ✅ | ✅ | ❌ | Fired when menu item is selected |

### Event Handling Examples

#### menu-open
```javascript
menu.addEventListener('menu-open', (e) => {
  console.log('Menu opened');

  // Track analytics
  analytics.track('user_menu_opened');

  // Update UI state
  document.body.classList.add('menu-active');
});
```

#### menu-close
```javascript
menu.addEventListener('menu-close', (e) => {
  console.log('Menu closed');

  // Clean up
  document.body.classList.remove('menu-active');
});
```

#### menu-select
```javascript
menu.addEventListener('menu-select', (e) => {
  const itemId = e.detail.itemId;
  console.log(`Selected: ${itemId}`);

  // Handle navigation
  switch(itemId) {
    case 'profile':
      window.location.href = '/profile';
      break;
    case 'settings':
      openSettingsModal();
      break;
    case 'logout':
      performLogout();
      break;
  }
});
```

### Event Delegation
```javascript
// Handle all user menu events at document level
document.addEventListener('menu-select', (e) => {
  if (e.target.tagName === 'T-USR') {
    handleMenuSelection(e.detail.itemId);
  }
});
```

---

## Menu Item Configuration

### Menu Item Structure

```typescript
interface MenuItem {
  id?: string;           // Unique identifier (required for items)
  label?: string;        // Display text (required for items)
  icon?: string;         // Icon name or SVG string (optional)
  type?: 'separator';    // Item type (only 'separator' supported)
}
```

### Default Menu Items

When no custom items are set, the component uses these defaults:

```javascript
[
  { id: 'profile', label: 'Profile', icon: userCircleIcon },
  { id: 'files', label: 'User Files', icon: folderUserIcon },
  { id: 'settings', label: 'Settings', icon: gearSixIcon },
  { type: 'separator' },
  { id: 'logout', label: 'Sign Out', icon: signOutIcon }
]
```

### Complex Menu Example

```javascript
menu.setMenuItems([
  // Section 1: User Actions
  { id: 'profile', label: 'My Profile', icon: 'user' },
  { id: 'account', label: 'Account Settings', icon: 'gear' },
  { id: 'billing', label: 'Billing', icon: 'creditCard' },

  // Separator
  { type: 'separator' },

  // Section 2: Application
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'team', label: 'Team Members', icon: 'users' },

  // Separator
  { type: 'separator' },

  // Section 3: Support
  { id: 'help', label: 'Help & Support' },  // No icon
  { id: 'feedback', label: 'Send Feedback' },

  // Separator
  { type: 'separator' },

  // Section 4: Session
  { id: 'logout', label: 'Sign Out', icon: 'signOut' }
]);
```

---

## Icon Support

### Using Built-in Icons

The component includes an icon mapping system for common icons:

```javascript
const iconMap = {
  'user': userCircleIcon,
  'userCircle': userCircleIcon,
  'gear': gearSixIcon,
  'settings': gearSixIcon,
  'signOut': signOutIcon,
  'logout': signOutIcon,
  'folder': folderUserIcon,
  'files': folderUserIcon,
  'grid': tableIcon,
  'dashboard': tableIcon,
  'users': userCircleIcon  // Fallback
};
```

### Custom SVG Icons

You can provide custom SVG strings directly:

```javascript
menu.setMenuItems([
  {
    id: 'custom',
    label: 'Custom Icon',
    icon: '<svg width="16" height="16" viewBox="0 0 16 16">...</svg>'
  }
]);
```

### Icon Fallback Behavior

1. If icon is a mapped name → Use mapped SVG
2. If icon is an SVG string → Use as-is
3. If icon is unknown string → Log warning, omit icon
4. If no icon property → Render without icon

---

## Styling & CSS Customization

### CSS Variables

The component uses Terminal Kit theme variables:

```css
/* Available CSS Variables */
--terminal-green-bright: #00ff41;
--terminal-green: #00cc33;
--terminal-green-dark: #009926;
--terminal-gray-darkest: #1a1a1a;
--terminal-gray-darker: #242424;
--terminal-gray-dark: #2d2d2d;
--terminal-gray: #3d3d3d;
--terminal-gray-light: #4d4d4d;
--terminal-gray-lighter: #5d5d5d;
--terminal-gray-lightest: #6d6d6d;
--terminal-white: #f0f0f0;
--terminal-white-dim: #cccccc;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
```

### Component Styling

```css
/* Style the host element */
t-usr {
  --usr-primary-color: #00ff41;
  --usr-background: #1a1a1a;
  position: relative;
}

/* Target specific states */
t-usr[disabled] {
  opacity: 0.5;
  pointer-events: none;
}

t-usr[open] {
  z-index: 1000;
}

t-usr[compact] {
  /* Compact mode styles */
}
```

### Shadow DOM Parts

Currently, the component doesn't expose CSS parts, but you can style the host element and use CSS variables for theming.

### Custom Theme Example

```css
/* Dark theme */
.dark-theme t-usr {
  --terminal-green-bright: #00ff41;
  --terminal-gray-darkest: #0a0a0a;
}

/* Light theme */
.light-theme t-usr {
  --terminal-green-bright: #00aa33;
  --terminal-gray-darkest: #ffffff;
  --terminal-white: #333333;
}
```

---

## Accessibility

### ARIA Support

The component implements comprehensive ARIA attributes:

- **Button**: `aria-expanded`, `aria-haspopup="true"`
- **Dropdown**: `role="menu"`
- **Menu Items**: `role="menuitem"`
- **Avatar Images**: `alt` attribute with user name

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Escape` | Closes the menu when open |
| `Enter/Space` | Activates menu items when focused |
| `Tab` | Navigate through focusable elements |

### Screen Reader Support

```html
<!-- Announces: "User menu, John Doe, button, collapsed" -->
<t-usr user-name="John Doe"></t-usr>

<!-- Announces: "User menu, Jane Smith, button, expanded" -->
<t-usr user-name="Jane Smith" open></t-usr>
```

---

## Advanced Examples

### 1. Admin Dashboard Integration

```javascript
// Admin menu with role-based items
const adminMenu = document.querySelector('#admin-menu');

// Set admin-specific menu items
adminMenu.setMenuItems([
  { id: 'dashboard', label: 'Admin Dashboard', icon: 'dashboard' },
  { id: 'users', label: 'Manage Users', icon: 'users' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'system', label: 'System Settings', icon: 'gear' },
  { type: 'separator' },
  { id: 'docs', label: 'Documentation' },
  { id: 'support', label: 'Support' },
  { type: 'separator' },
  { id: 'logout', label: 'Sign Out', icon: 'signOut' }
]);

// Handle menu selection
adminMenu.addEventListener('menu-select', async (e) => {
  switch(e.detail.itemId) {
    case 'users':
      await loadUsersPanel();
      break;
    case 'analytics':
      window.location.href = '/admin/analytics';
      break;
    case 'logout':
      await performAdminLogout();
      break;
  }
});
```

### 2. Dynamic User Loading

```javascript
async function loadUserMenu() {
  const menu = document.querySelector('t-usr');

  try {
    // Fetch user data from API
    const response = await fetch('/api/current-user');
    const userData = await response.json();

    // Update menu with user data
    menu.setUserInfo({
      name: userData.displayName,
      email: userData.email,
      avatar: userData.profilePicture
    });

    // Set role-specific menu items
    const menuItems = userData.role === 'admin'
      ? getAdminMenuItems()
      : getStandardMenuItems();

    menu.setMenuItems(menuItems);

  } catch (error) {
    console.error('Failed to load user data:', error);
    menu.userName = 'Guest';
    menu.setMenuItems(getGuestMenuItems());
  }
}

// Load on page ready
document.addEventListener('DOMContentLoaded', loadUserMenu);
```

### 3. Mobile Responsive Implementation

```javascript
class ResponsiveMenu {
  constructor() {
    this.menu = document.querySelector('t-usr');
    this.mediaQuery = window.matchMedia('(max-width: 768px)');

    this.handleViewportChange();
    this.mediaQuery.addListener(() => this.handleViewportChange());
  }

  handleViewportChange() {
    // Toggle compact mode based on viewport
    this.menu.compact = this.mediaQuery.matches;

    // Adjust menu items for mobile
    if (this.mediaQuery.matches) {
      this.setMobileMenuItems();
    } else {
      this.setDesktopMenuItems();
    }
  }

  setMobileMenuItems() {
    this.menu.setMenuItems([
      { id: 'profile', label: 'Profile', icon: 'user' },
      { id: 'settings', label: 'Settings', icon: 'gear' },
      { type: 'separator' },
      { id: 'logout', label: 'Sign Out', icon: 'signOut' }
    ]);
  }

  setDesktopMenuItems() {
    this.menu.setMenuItems([
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'profile', label: 'My Profile', icon: 'user' },
      { id: 'projects', label: 'Projects', icon: 'folder' },
      { id: 'team', label: 'Team', icon: 'users' },
      { id: 'settings', label: 'Settings', icon: 'gear' },
      { type: 'separator' },
      { id: 'help', label: 'Help & Support' },
      { id: 'logout', label: 'Sign Out', icon: 'signOut' }
    ]);
  }
}

// Initialize
new ResponsiveMenu();
```

### 4. Multi-User Quick Switcher

```javascript
// User switcher implementation
class UserSwitcher {
  constructor() {
    this.currentUser = 0;
    this.users = [
      { name: 'Alice Admin', email: 'alice@company.com', avatar: '/avatars/alice.jpg' },
      { name: 'Bob Builder', email: 'bob@company.com', avatar: '/avatars/bob.jpg' },
      { name: 'Charlie Cooper', email: 'charlie@company.com' }
    ];

    this.menu = document.querySelector('t-usr');
    this.setupMenu();
  }

  setupMenu() {
    this.updateCurrentUser();

    // Add user switching items
    this.menu.setMenuItems([
      { id: 'switch-alice', label: 'Switch to Alice', icon: 'user' },
      { id: 'switch-bob', label: 'Switch to Bob', icon: 'user' },
      { id: 'switch-charlie', label: 'Switch to Charlie', icon: 'user' },
      { type: 'separator' },
      { id: 'manage-accounts', label: 'Manage Accounts', icon: 'users' },
      { type: 'separator' },
      { id: 'logout-all', label: 'Sign Out All', icon: 'signOut' }
    ]);

    this.menu.addEventListener('menu-select', (e) => {
      if (e.detail.itemId.startsWith('switch-')) {
        const userIndex = ['alice', 'bob', 'charlie'].indexOf(
          e.detail.itemId.replace('switch-', '')
        );
        this.switchUser(userIndex);
      }
    });
  }

  switchUser(index) {
    this.currentUser = index;
    this.updateCurrentUser();
    console.log(`Switched to ${this.users[index].name}`);
  }

  updateCurrentUser() {
    const user = this.users[this.currentUser];
    this.menu.setUserInfo({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  }
}

new UserSwitcher();
```

### 5. State Persistence

```javascript
// Save menu state to localStorage
class PersistentMenu {
  constructor() {
    this.menu = document.querySelector('t-usr');
    this.storageKey = 'userMenuPreferences';

    this.loadState();
    this.attachListeners();
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const state = JSON.parse(saved);

      // Restore user info
      if (state.userInfo) {
        this.menu.setUserInfo(state.userInfo);
      }

      // Restore compact mode preference
      if (state.compact !== undefined) {
        this.menu.compact = state.compact;
      }

      // Restore custom menu items
      if (state.menuItems) {
        this.menu.setMenuItems(state.menuItems);
      }
    }
  }

  saveState() {
    const state = {
      userInfo: {
        name: this.menu.userName,
        email: this.menu.userEmail,
        avatar: this.menu.userAvatar
      },
      compact: this.menu.compact,
      menuItems: this.menu.menuItems
    };

    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  attachListeners() {
    // Save state when menu is customized
    const observer = new MutationObserver(() => this.saveState());
    observer.observe(this.menu, {
      attributes: true,
      attributeFilter: ['user-name', 'user-email', 'user-avatar', 'compact']
    });
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  new PersistentMenu();
});
```

---

## Migration Guide

### From TerminalUserMenu to TUserMenuLit

If migrating from the older component:

```javascript
// Old API
<terminal-user-menu
  user-name="John"
  user-avatar="/avatar.jpg">
</terminal-user-menu>

// New API
<t-usr
  user-name="John"
  user-avatar="/avatar.jpg">
</t-usr>

// Method changes
oldMenu.open();    → newMenu.openMenu();
oldMenu.close();   → newMenu.closeMenu();
oldMenu.toggle();  → newMenu.toggleMenu();

// Event changes
'menu-item-click' → 'menu-select'
e.detail.item     → e.detail.itemId
```

---

## Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14.1+ | Full support |
| Edge | 90+ | Full support |
| Opera | 76+ | Full support |

### Required Web APIs
- Custom Elements v1
- Shadow DOM v1
- ES Modules
- CSS Custom Properties
- MutationObserver
- Template literals

---

## API Reference Summary

### Quick Reference Card

```javascript
// Element
<t-usr></t-usr>

// Properties
menu.userName = 'string';      // User's display name
menu.userEmail = 'string';     // User's email
menu.userAvatar = 'string';    // Avatar URL
menu.disabled = boolean;       // Enable/disable
menu.open = boolean;          // Open state
menu.menuItems = [];          // Menu items array
menu.compact = boolean;       // Compact mode

// Methods
menu.openMenu();              // Open dropdown
menu.closeMenu();             // Close dropdown
menu.toggleMenu();            // Toggle state
menu.setMenuItems(items);     // Set menu items
menu.setUserInfo(info);       // Update user info

// Events
menu.addEventListener('menu-open', handler);    // Menu opened
menu.addEventListener('menu-close', handler);   // Menu closed
menu.addEventListener('menu-select', handler);  // Item selected

// Event detail
e.detail.itemId  // Selected item ID (menu-select only)
```

### Component Manifest

```javascript
import { TUserMenuManifest } from './TUserMenuLit.js';

console.log(TUserMenuManifest);
// {
//   tagName: 't-usr',
//   displayName: 'User Menu',
//   description: '...',
//   properties: {...},
//   methods: {...},
//   events: {...}
// }
```

---

## Support & Resources

### Component Files
- **Component**: `/js/components/TUserMenuLit.js`
- **Tests**: `/tests/components/TUserMenuLit.test.js`
- **Documentation**: `/docs/components/TUserMenuLit.md`
- **Demo**: `/demos/user-menu.html`

### Related Components
- `TStatusBarLit` - Status bar component
- `TPanelLit` - Panel container component
- `TToastLit` - Toast notification component

### Terminal Kit Resources
- [Component Schema](../COMPONENT_SCHEMA.md)
- [Component Specifications](../COMPONENT_SPECIFICATIONS.md)
- [Phosphor Icons](https://phosphoricons.com/)

---

## License

Terminal Kit User Menu Component
Copyright (c) 2024 Terminal Kit
MIT License

---

*Documentation Version: 2.0.0*
*Last Updated: September 2024*
*Component Version: 1.0.0*

## Slots

None.

