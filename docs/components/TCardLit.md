# TCardLit

A versatile content card container with terminal styling, supporting expandable content, selection states, and loading indicators.

## Tag Name

`t-card`

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-card` |
| version | `3.0.0` |
| category | `Container` |

## Properties

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `variant` | `String` | `'default'` | Yes | Style variant: `'default'`, `'outlined'`, `'elevated'`, `'terminal'` |
| `clickable` | `Boolean` | `false` | Yes | Enable click interaction |
| `selected` | `Boolean` | `false` | Yes | Selection state |
| `disabled` | `Boolean` | `false` | Yes | Disable interactions |
| `loading` | `Boolean` | `false` | Yes | Show loading animation |
| `expandable` | `Boolean` | `false` | Yes | Enable expandable content |
| `expanded` | `Boolean` | `true` | Yes | Expanded state (content visible by default) |
| `padding` | `String` | `'md'` | Yes | Content padding: `'none'`, `'sm'`, `'md'`, `'lg'` |

## Methods

### toggleExpand()
Toggle the expanded state.

**Fires:** `card-expand`

### expand()
Expand the card content.

**Fires:** `card-expand`

### collapse()
Collapse the card content.

**Fires:** `card-expand`

### select()
Select the card programmatically.

### deselect()
Deselect the card programmatically.

## Events

### card-click
Fired when a clickable card is clicked.

```javascript
{
  detail: {
    selected: true,
    variant: 'default'
  }
}
```

### card-expand
Fired when expandable content is toggled.

```javascript
{
  detail: {
    expanded: true
  }
}
```

## Examples

### Basic Card

```html
<t-card>
  <div slot="header">Card Title</div>
  <p>Card content goes here.</p>
</t-card>
```

### Card with All Slots

```html
<t-card variant="outlined">
  <img slot="media" src="image.jpg" alt="Card image">
  <div slot="header">
    <h3>Card Title</h3>
    <span>Subtitle</span>
  </div>
  <p>Main content of the card.</p>
  <div slot="actions">
    <button>Action</button>
  </div>
</t-card>
```

### Clickable Selection Card

```html
<t-card clickable ?selected=${isSelected} @card-click=${handleClick}>
  <div slot="header">Option 1</div>
  <p>Click to select this option.</p>
</t-card>
```

### Expandable Card

```html
<t-card expandable>
  <div slot="header">Expandable Section</div>
  <p>This content collapses when toggled.</p>
</t-card>
```

### Loading State

```html
<t-card loading>
  <div slot="header">Loading Data</div>
  <p>Content is loading...</p>
</t-card>
```

### Elevated Variant

```html
<t-card variant="elevated" padding="lg">
  <div slot="header">Featured</div>
  <p>This card has a shadow and larger padding.</p>
</t-card>
```

### Programmatic Control

```javascript
const card = document.querySelector('t-card');

// Toggle expansion
card.toggleExpand();

// Select/deselect
card.select();
card.deselect();

// Listen for events
card.addEventListener('card-click', (e) => {
  console.log('Card selected:', e.detail.selected);
});

card.addEventListener('card-expand', (e) => {
  console.log('Card expanded:', e.detail.expanded);
});
```

## Slots

| Slot | Description |
|------|-------------|
| default | Main card content |
| `header` | Card header/title area |
| `media` | Image or media content |
| `actions` | Card action buttons (footer area) |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--card-bg` | `var(--terminal-gray-darkest)` | Background color |
| `--card-border` | `var(--terminal-gray-dark)` | Border color |
| `--card-color` | `var(--terminal-green)` | Accent color |
| `--card-radius` | `4px` | Border radius |

## Related Components

- [TPanelLit](./TPanelLit.md) - Panel container
- [TAccordionLit](./TAccordionLit.md) - Collapsible sections
