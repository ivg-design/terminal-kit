# TerminalUserMenu Component

## Description
A dropdown user menu component triggered by clicking a user badge. Displays user information and customizable menu items with support for Clerk/Supabase integration.

## Tag Name
`<terminal-user-menu>`

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| user-name | string | "User" | User's display name |
| user-email | string | "" | User's email address |
| user-avatar | string | "" | URL to user's avatar image |
| disabled | boolean | false | Disable the menu |
| open | boolean | false | Control menu open state |

## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| open() | none | void | Open the dropdown menu |
| close() | none | void | Close the dropdown menu |
| toggle() | none | void | Toggle menu open/closed |
| setMenuItems(items) | Array | void | Set custom menu items |
| addMenuItem(item, index) | Object, number | void | Add a menu item at index |
| removeMenuItem(itemId) | string | void | Remove a menu item by ID |
| setUserInfo(info) | Object | void | Update user information |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| menu-select | {itemId: string} | Fired when a menu item is selected |
| menu-open | none | Fired when menu opens |
| menu-close | none | Fired when menu closes |

## CSS Classes

| Class | Description |
|-------|-------------|
| .terminal-user-menu | Component container |
| .user-menu-container | Menu wrapper |
| .user-badge | Clickable user badge |
| .user-avatar | User avatar image |
| .user-initials | User initials fallback |
| .user-info | User info container |
| .menu-dropdown | Dropdown menu container |
| .menu-header | Menu header with user info |
| .menu-content | Menu items container |
| .menu-item | Individual menu item |
| .menu-separator | Visual separator |

## Menu Item Structure

```javascript
{
  id: 'unique-id',        // Unique identifier
  label: 'Menu Item',     // Display text
  icon: '<svg>...</svg>', // Optional icon
  type: 'separator'       // Optional: creates a separator
}
```

## Usage Examples

### Basic User Menu
```html
<terminal-user-menu 
  user-name="John Doe"
  user-email="john@example.com">
</terminal-user-menu>
```

### With Avatar
```html
<terminal-user-menu 
  user-name="Jane Smith"
  user-email="jane@example.com"
  user-avatar="/path/to/avatar.jpg">
</terminal-user-menu>
```

### Custom Menu Items
```html
<terminal-user-menu id="userMenu">
</terminal-user-menu>

<script>
  const userMenu = document.getElementById('userMenu');
  
  userMenu.setMenuItems([
    { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
    { id: 'profile', label: 'My Profile', icon: userIcon },
    { id: 'settings', label: 'Settings', icon: gearIcon },
    { type: 'separator' },
    { id: 'help', label: 'Help & Support', icon: helpIcon },
    { id: 'logout', label: 'Sign Out', icon: logoutIcon }
  ]);
</script>
```

### Event Handling
```html
<terminal-user-menu id="userMenu">
</terminal-user-menu>

<script>
  const userMenu = document.getElementById('userMenu');
  
  userMenu.addEventListener('menu-select', (e) => {
    switch(e.detail.itemId) {
      case 'profile':
        window.location.href = '/profile';
        break;
      case 'settings':
        window.location.href = '/settings';
        break;
      case 'logout':
        handleLogout();
        break;
    }
  });
</script>
```

### Clerk Integration Example
```javascript
import { useUser, useClerk } from '@clerk/clerk-react';

const userMenu = document.querySelector('terminal-user-menu');
const { user } = useUser();
const { signOut } = useClerk();

if (user && userMenu) {
  userMenu.setUserInfo({
    name: user.fullName || user.username,
    email: user.primaryEmailAddress?.emailAddress,
    avatar: user.profileImageUrl
  });
  
  userMenu.addEventListener('menu-select', (e) => {
    if (e.detail.itemId === 'logout') {
      signOut();
    }
  });
}
```

### Supabase Integration Example
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);
const userMenu = document.querySelector('terminal-user-menu');

// Get user data
const { data: { user } } = await supabase.auth.getUser();

if (user && userMenu) {
  userMenu.setUserInfo({
    name: user.user_metadata?.full_name || user.email,
    email: user.email,
    avatar: user.user_metadata?.avatar_url
  });
  
  userMenu.addEventListener('menu-select', async (e) => {
    if (e.detail.itemId === 'logout') {
      await supabase.auth.signOut();
    }
  });
}
```

### Programmatic Control
```javascript
const userMenu = document.querySelector('terminal-user-menu');

// Open menu programmatically
userMenu.open();

// Close menu
userMenu.close();

// Add new menu item
userMenu.addMenuItem({
  id: 'billing',
  label: 'Billing',
  icon: creditCardIcon
}, 2); // Insert at position 2

// Remove menu item
userMenu.removeMenuItem('help');
```

## Integration Notes

- Automatically closes when clicking outside
- Closes on Escape key press
- Supports keyboard navigation
- Shows user initials when no avatar is provided
- Mobile responsive (becomes bottom sheet on small screens)
- Menu items support icons and separators
- Can integrate with any authentication provider