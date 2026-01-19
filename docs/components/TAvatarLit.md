# TAvatarLit

A user/entity avatar component with terminal styling, supporting images, initials, icons, and status indicators.

## Tag Names

- `t-avt`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-avt` |
| version | `3.0.0` |
| category | `Display` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `src` | `String` | `''` | No | Image URL |
| `alt` | `String` | `''` | Yes | Alt text for image |
| `initials` | `String` | `''` | Yes | Fallback initials (e.g., "JD") |
| `icon` | `String` | `''` | No | Fallback icon SVG string |
| `size` | `String` | `'md'` | Yes | Size: `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'` |
| `shape` | `String` | `'circle'` | Yes | Shape: `'circle'`, `'square'`, `'rounded'` |
| `status` | `String` | `null` | Yes | Status indicator: `'online'`, `'offline'`, `'away'`, `'busy'` |
| `statusPosition` | `String` | `'bottom-right'` | Yes | Status dot position: `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'` |
| `clickable` | `Boolean` | `false` | Yes | Enable click interaction |
| `border` | `Boolean` | `false` | Yes | Show border |

## Methods

### setStatus(status)
Update the status indicator.

**Parameters:**
- `status` (String): New status value

## Events

### avatar-click
Fired when a clickable avatar is clicked.

```javascript
{
  detail: {
    src: '/avatars/user.png',
    alt: 'John Doe'
  }
}
```

### avatar-error
Fired when image fails to load.

```javascript
{
  detail: {
    src: '/failed/image.png'
  }
}
```

## Examples

### Basic Avatar with Image

```html
<t-avt src="/avatars/user.png" alt="John Doe"></t-avt>
```

### Avatar with Initials Fallback

```html
<t-avt src="/avatars/user.png" initials="JD" alt="John Doe"></t-avt>
```

### Initials Only

```html
<t-avt initials="AB"></t-avt>
```

### Icon Fallback

```html
<t-avt icon="user"></t-avt>
```

### Different Sizes

```html
<t-avt src="/avatar.png" size="xs"></t-avt>
<t-avt src="/avatar.png" size="sm"></t-avt>
<t-avt src="/avatar.png" size="md"></t-avt>
<t-avt src="/avatar.png" size="lg"></t-avt>
<t-avt src="/avatar.png" size="xl"></t-avt>
```

### Different Shapes

```html
<t-avt src="/avatar.png" shape="circle"></t-avt>
<t-avt src="/avatar.png" shape="square"></t-avt>
<t-avt src="/avatar.png" shape="rounded"></t-avt>
```

### With Status Indicator

```html
<t-avt src="/avatar.png" status="online"></t-avt>
<t-avt src="/avatar.png" status="away"></t-avt>
<t-avt src="/avatar.png" status="busy"></t-avt>
<t-avt src="/avatar.png" status="offline"></t-avt>
```

### Custom Status Position

```html
<t-avt
  src="/avatar.png"
  status="online"
  status-position="top-right">
</t-avt>
```

### Clickable Avatar

```html
<t-avt
  src="/avatar.png"
  clickable
  @avatar-click=${openProfile}>
</t-avt>
```

### With Border

```html
<t-avt src="/avatar.png" border></t-avt>
```

### Avatar Group

```html
<div class="avatar-group">
  <t-avt src="/user1.png" size="sm" border></t-avt>
  <t-avt src="/user2.png" size="sm" border></t-avt>
  <t-avt src="/user3.png" size="sm" border></t-avt>
  <t-avt initials="+5" size="sm" border></t-avt>
</div>
```

### Handle Image Error

```html
<t-avt
  src="/might-fail.png"
  initials="JD"
  @avatar-error=${(e) => console.log('Failed to load:', e.detail.src)}>
</t-avt>
```

### Programmatic Control

```javascript
const avatar = document.querySelector('t-avt');

// Update status
avatar.setStatus('online');
avatar.setStatus('busy');
avatar.setStatus(''); // Remove status

// Listen for events
avatar.addEventListener('avatar-click', () => {
  openUserProfile();
});

avatar.addEventListener('avatar-error', (e) => {
  console.log('Image failed:', e.detail.src);
});
```

## Slots

None.


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--avatar-bg` | `var(--terminal-gray-dark)` | Background color |
| `--avatar-border` | `var(--terminal-gray)` | Border color |
| `--avatar-color` | `var(--terminal-green)` | Text/icon color |
| `--avatar-online` | `var(--terminal-green)` | Online status color |
| `--avatar-away` | `var(--terminal-yellow)` | Away status color |
| `--avatar-busy` | `var(--terminal-red)` | Busy status color |
| `--avatar-offline` | `var(--terminal-gray)` | Offline status color |

## Related Components

- [TChipLit](./TChipLit.md) - Chip with avatar
- [TBadgeLit](./TBadgeLit.md) - Badge indicator
