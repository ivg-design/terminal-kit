# TSkeletonLit

A loading placeholder component with terminal styling, used to show content structure while data is loading.

## Tag Names

- `t-skel`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-skel` |
| version | `3.0.0` |
| category | `Display` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `type` | `String` | `'text'` | Yes | Skeleton type (see below) |
| `width` | `String` | `'100%'` | No | Custom width (CSS value) |
| `height` | `String` | `'auto'` | No | Custom height (CSS value) |
| `lines` | `Number` | `1` | Yes | Number of text lines (for text type) |
| `animated` | `Boolean` | `true` | Yes | Enable shimmer animation |
| `radius` | `String` | `'4px'` | No | Border radius (CSS value) |
| `size` | `String` | `'md'` | Yes | Size preset: `'sm'`, `'md'`, `'lg'` |
| `glow` | `Boolean` | `false` | Yes | Add terminal glow effect |

### Available Types

| Type | Description |
|------|-------------|
| `text` | Single or multiple lines of text |
| `heading` | Heading/title placeholder |
| `avatar` | Circular avatar |
| `button` | Button shape |
| `card` | Card container with header and content lines |
| `rect` | Generic rectangle |
| `circle` | Generic circle |

## Methods

### getAvailableTypes()
Get list of available skeleton types.

**Returns:** `Array<String>` - List of type names

## Events

This component does not emit events.

## Examples

### Basic Text Skeleton

```html
<t-skel type="text"></t-skel>
```

### Multiple Lines

```html
<t-skel type="text" lines="3"></t-skel>
```

### Avatar Skeleton

```html
<t-skel type="avatar"></t-skel>
<t-skel type="avatar" size="sm"></t-skel>
<t-skel type="avatar" size="lg"></t-skel>
```

### Rectangle Placeholder

```html
<t-skel type="rect" width="100%" height="200px"></t-skel>
```

### Button Skeleton

```html
<t-skel type="button"></t-skel>
<t-skel type="button" width="120px"></t-skel>
```

### Heading Skeleton

```html
<t-skel type="heading"></t-skel>
```

### Card Skeleton

```html
<t-skel type="card" width="300px" height="200px"></t-skel>
```

### Custom Shapes

```html
<t-skel type="rect" width="100px" height="50px" radius="8px"></t-skel>
<t-skel type="circle" width="60px" height="60px"></t-skel>
```

### Without Animation

```html
<t-skel type="text" animated="false"></t-skel>
```

### Glow Effect

```html
<t-skel type="text" glow></t-skel>
```

### Card Loading State Example

```html
<div class="card-skeleton">
  <t-skel type="rect" width="100%" height="150px"></t-skel>
  <div style="padding: 16px;">
    <t-skel type="heading"></t-skel>
    <t-skel type="text" lines="2" style="margin-top: 8px;"></t-skel>
    <div style="display: flex; gap: 8px; margin-top: 16px;">
      <t-skel type="button" width="80px"></t-skel>
      <t-skel type="button" width="80px"></t-skel>
    </div>
  </div>
</div>
```

### User List Loading State

```html
<div class="user-list-skeleton">
  ${[1, 2, 3].map(() => html`
    <div style="display: flex; gap: 12px; padding: 8px;">
      <t-skel type="avatar"></t-skel>
      <div style="flex: 1;">
        <t-skel type="text" width="60%"></t-skel>
        <t-skel type="text" width="40%" style="margin-top: 4px;"></t-skel>
      </div>
    </div>
  `)}
</div>
```

### Form Loading State

```html
<div class="form-skeleton">
  <t-skel type="text" width="100px"></t-skel>
  <t-skel type="rect" height="36px" style="margin-top: 8px;"></t-skel>

  <t-skel type="text" width="100px" style="margin-top: 16px;"></t-skel>
  <t-skel type="rect" height="36px" style="margin-top: 8px;"></t-skel>

  <t-skel type="button" width="100%" style="margin-top: 24px;"></t-skel>
</div>
```

### Conditional Loading

```html
${isLoading
  ? html`
    <t-skel type="card" width="100%" height="300px"></t-skel>
  `
  : html`
    <t-card>
      <!-- Actual content -->
    </t-card>
  `
}
```

### Programmatic Usage

```javascript
const skeleton = document.querySelector('t-skel');

// Get available types
const types = skeleton.getAvailableTypes();
console.log(types); // ['text', 'heading', 'avatar', 'button', 'card', 'rect', 'circle']

// Dynamic skeleton
function showSkeleton(type) {
  skeleton.type = type;
}
```

## Slots

None.


## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--skeleton-bg` | `var(--terminal-gray-dark)` | Base background |
| `--skeleton-highlight` | `var(--terminal-gray)` | Shimmer highlight |
| `--skeleton-glow` | `var(--terminal-green)` | Glow effect color |

## Related Components

- [TLoaderLit](./TLoaderLit.md) - Loading spinner
- [TProgressLit](./TProgressLit.md) - Progress bar
