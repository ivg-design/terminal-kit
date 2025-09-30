# TUserMenuLit Component Documentation

## Overview

The `TUserMenuLit` component (`<t-usr>`) is a dropdown menu triggered by a user badge click. It displays user information (name, email, avatar) and provides customizable menu items with icons. The component follows the CORE profile from the Terminal Kit component schema.

**Tag:** `<t-usr>`
**Category:** Navigation
**Version:** 1.0.0
**Profile:** CORE (with document listeners pattern)

## Features

- 🎭 User avatar with fallback to initials
- 📋 Customizable menu items with icons
- 🎯 Click outside to close
- ⌨️ Escape key support
- 📱 Mobile responsive
- ♿ Accessibility support (ARIA attributes)
- 🎨 Fully themeable via CSS variables
- 🧹 Automatic cleanup of document listeners

## Basic Usage

```html
<!-- Basic user menu -->
<t-usr
  user-name="John Doe"
  user-email="john@example.com">
</t-usr>

<!-- With avatar -->
<t-usr
  user-name="Jane Smith"
  user-email="jane@example.com"
  user-avatar="https://example.com/avatar.jpg">
</t-usr>

<!-- Disabled state -->
<t-usr
  user-name="Admin"
  disabled>
</t-usr>
```

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `userName` | String | 'User' | ✅ | User's display name |
| `userEmail` | String | '' | ✅ | User's email address |
| `userAvatar` | String | '' | ❌ | URL to user's avatar image |
| `disabled` | Boolean | false | ✅ | Whether the menu is disabled |
| `open` | Boolean | false | ✅ | Whether the menu is open |
| `menuItems` | Array | [] | ❌ | Custom menu items array |

### Property Details

#### userName
The name displayed in the badge and menu header. Used to generate initials when no avatar is provided.

```javascript
// Via attribute
<t-usr user-name="John Doe"></t-usr>

// Via JavaScript
const menu = document.querySelector('t-usr');
menu.userName = 'John Doe';
```

#### userEmail
Optional email address displayed in the menu header below the user name.

```javascript
// Via attribute
<t-usr user-email="john@example.com"></t-usr>

// Via JavaScript
menu.userEmail = 'john@example.com';
```

#### userAvatar
URL to the user's avatar image. If not provided, initials are generated from userName.

```javascript
// Via JavaScript only (doesn't reflect to attribute)
menu.userAvatar = 'https://example.com/avatar.jpg';
```

#### menuItems
Array of menu item objects. If not provided, default menu items are shown.

```javascript
menu.menuItems = [
  { id: 'profile', label: 'Profile', icon: '<svg>...</svg>' },
  { id: 'settings', label: 'Settings', icon: '<svg>...</svg>' },
  { type: 'separator' },
  { id: 'logout', label: 'Sign Out', icon: '<svg>...</svg>' }
];
```

Menu item structure:
- `id` (String): Unique identifier for the item
- `label` (String): Display text
- `icon` (String, optional): SVG icon markup
- `type` (String, optional): Set to 'separator' for divider lines

## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `openMenu()` | - | void | Open the menu dropdown |
| `closeMenu()` | - | void | Close the menu dropdown |
| `toggleMenu()` | - | void | Toggle menu open/close state |
| `setMenuItems(items)` | Array | void | Set custom menu items |
| `setUserInfo(info)` | Object | void | Update user information |

### Method Examples

```javascript
const menu = document.querySelector('t-usr');

// Open/close/toggle menu
menu.openMenu();
menu.closeMenu();
menu.toggleMenu();

// Set custom menu items
menu.setMenuItems([
  { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
  { id: 'analytics', label: 'Analytics', icon: analyticsIcon },
  { type: 'separator' },
  { id: 'logout', label: 'Sign Out', icon: logoutIcon }
]);

// Update user info
menu.setUserInfo({
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: 'https://example.com/jane.jpg'
});
```

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `menu-select` | `{itemId: string}` | Fired when a menu item is selected |
| `menu-open` | `{}` | Fired when the menu opens |
| `menu-close` | `{}` | Fired when the menu closes |

All events bubble and are composed (cross shadow DOM boundaries).

### Event Examples

```javascript
const menu = document.querySelector('t-usr');

// Listen for menu item selection
menu.addEventListener('menu-select', (e) => {
  console.log('Selected item:', e.detail.itemId);

  switch(e.detail.itemId) {
    case 'profile':
      window.location.href = '/profile';
      break;
    case 'settings':
      window.location.href = '/settings';
      break;
    case 'logout':
      logout();
      break;
  }
});

// Listen for menu state changes
menu.addEventListener('menu-open', () => {
  console.log('Menu opened');
});

menu.addEventListener('menu-close', () => {
  console.log('Menu closed');
});
```

## Styling

The component uses CSS custom properties for theming. Override these in your stylesheet:

```css
t-usr {
  --terminal-bg: #0a0a0a;
  --terminal-green: #00ff41;
  --terminal-green-dim: #00cc33;
  --terminal-green-dark: #008820;
  --terminal-gray-dark: #242424;
  --terminal-gray-darkest: #1a1a1a;
  --font-mono: 'SF Mono', monospace;
  --font-size-sm: 11px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
}
```

### Custom Styling Examples

```css
/* Custom color scheme */
t-usr {
  --terminal-green: #0074d9;  /* Blue theme */
  --terminal-green-dark: #005a9e;
}

/* Larger text */
t-usr {
  --font-size-sm: 14px;
  --font-size-md: 16px;
}

/* Custom font */
t-usr {
  --font-mono: 'Fira Code', monospace;
}
```

## Default Menu Items

When no custom menu items are provided, the component displays:

1. **Profile** - User profile page
2. **User Files** - User's files/documents
3. **Settings** - Application settings
4. *Separator*
5. **Sign Out** - Logout action

Each default item includes a Phosphor icon for visual consistency.

## Mobile Behavior

On mobile devices (< 768px width):
- User name displays as initials only in the badge
- Menu dropdown animates from bottom of screen
- Increased touch targets for better usability

## Accessibility

The component implements proper ARIA attributes:

- `aria-expanded` on the badge button
- `aria-haspopup="true"` on the badge
- `role="menu"` on the dropdown
- `role="menuitem"` on menu items
- Keyboard support (Escape to close)

## Advanced Examples

### Complete Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '/js/components/TUserMenuLit.js';

    // Custom menu items with icons
    const customMenuItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '<svg>...</svg>'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '<svg>...</svg>'
      },
      { type: 'separator' },
      {
        id: 'settings',
        label: 'Settings',
        icon: '<svg>...</svg>'
      },
      {
        id: 'help',
        label: 'Help & Support',
        icon: '<svg>...</svg>'
      },
      { type: 'separator' },
      {
        id: 'logout',
        label: 'Sign Out',
        icon: '<svg>...</svg>'
      }
    ];

    // Setup menu when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      const userMenu = document.querySelector('t-usr');

      // Set user info
      userMenu.setUserInfo({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/assets/avatars/john.jpg'
      });

      // Set custom menu items
      userMenu.setMenuItems(customMenuItems);

      // Handle menu selections
      userMenu.addEventListener('menu-select', (e) => {
        handleMenuAction(e.detail.itemId);
      });
    });

    function handleMenuAction(itemId) {
      switch(itemId) {
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'analytics':
          window.location.href = '/analytics';
          break;
        case 'settings':
          openSettingsModal();
          break;
        case 'help':
          window.open('/help', '_blank');
          break;
        case 'logout':
          confirmLogout();
          break;
      }
    }
  </script>
</head>
<body>
  <header>
    <nav>
      <t-usr></t-usr>
    </nav>
  </header>
</body>
</html>
```

### Dynamic User Updates

```javascript
// Update user info based on authentication
async function updateUserMenu() {
  const userMenu = document.querySelector('t-usr');
  const userData = await fetchUserData();

  userMenu.setUserInfo({
    name: userData.displayName,
    email: userData.email,
    avatar: userData.avatarUrl
  });

  // Update menu items based on user role
  const menuItems = getMenuItemsForRole(userData.role);
  userMenu.setMenuItems(menuItems);
}

function getMenuItemsForRole(role) {
  const baseItems = [
    { id: 'profile', label: 'My Profile', icon: profileIcon }
  ];

  if (role === 'admin') {
    baseItems.push(
      { id: 'admin', label: 'Admin Panel', icon: adminIcon },
      { id: 'users', label: 'Manage Users', icon: usersIcon }
    );
  }

  baseItems.push(
    { type: 'separator' },
    { id: 'logout', label: 'Sign Out', icon: logoutIcon }
  );

  return baseItems;
}
```

### Integration with State Management

```javascript
// Redux/Vuex/MobX integration example
import { store } from './store';
import './components/TUserMenuLit.js';

class UserMenuController {
  constructor() {
    this.menu = document.querySelector('t-usr');
    this.setupStateSync();
    this.setupEventHandlers();
  }

  setupStateSync() {
    // Subscribe to state changes
    store.subscribe(() => {
      const state = store.getState();
      this.updateMenu(state.user);
    });

    // Initial update
    this.updateMenu(store.getState().user);
  }

  updateMenu(userState) {
    if (!userState.isAuthenticated) {
      this.menu.disabled = true;
      return;
    }

    this.menu.disabled = false;
    this.menu.setUserInfo({
      name: userState.name,
      email: userState.email,
      avatar: userState.avatar
    });
  }

  setupEventHandlers() {
    this.menu.addEventListener('menu-select', (e) => {
      store.dispatch({ type: 'MENU_ACTION', payload: e.detail.itemId });
    });
  }
}

// Initialize when component is ready
customElements.whenDefined('t-usr').then(() => {
  new UserMenuController();
});
```

## Testing

The component includes a comprehensive test suite with 52 tests covering:

- Component registration and manifest
- All properties and their reflection
- All public methods
- Event emission
- Rendering scenarios
- Document listener cleanup
- Mobile responsive behavior
- Integration scenarios

Run tests with:
```bash
npm run test:run tests/components/TUserMenuLit.test.js
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Opera 74+

The component uses:
- Web Components (Custom Elements v1)
- Shadow DOM v1
- ES Modules
- CSS Custom Properties
- Lit 3.0

## Migration from TUserMenu

If migrating from the old DSD-based `TUserMenu` component:

1. **Method names have changed** to avoid conflicts:
   - `open()` → `openMenu()`
   - `close()` → `closeMenu()`
   - `toggle()` → `toggleMenu()`

2. **Properties are now reactive** - changes automatically trigger re-renders

3. **Events remain the same** - no changes needed for event listeners

4. **CSS is encapsulated** - styles are now in Shadow DOM, use CSS variables for theming

## Performance Considerations

- **Lazy rendering**: Menu content only renders when opened
- **Event delegation**: Single event listener for all menu items
- **Automatic cleanup**: Document listeners removed when component disconnects
- **No memory leaks**: Proper cleanup in `disconnectedCallback()`

## Security Notes

- Avatar URLs are sanitized through Lit's template system
- Menu item icons accept SVG strings - ensure these are trusted
- XSS protection through Lit's automatic escaping

## Contributing

When modifying this component:

1. Follow the COMPONENT_SCHEMA.md structure (13 blocks)
2. Update tests for new features
3. Maintain backward compatibility for public API
4. Document all changes
5. Run full test suite before submitting

## License

MIT License - See LICENSE file for details