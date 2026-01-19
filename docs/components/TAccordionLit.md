# TAccordionLit

A collapsible accordion component with expandable sections, terminal styling, and support for single or multiple open panels.

## Tag Names

- `t-accordion` - Container component
- `t-accordion-item` - Individual panel

## Static Metadata

| Property | Value |
|----------|-------|
| tagName | `t-accordion` / `t-accordion-item` |
| version | `3.0.0` |
| category | `Container` |

## Accordion Properties (t-accordion)

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `multiple` | `Boolean` | `false` | Yes | Allow multiple panels open simultaneously |
| `bordered` | `Boolean` | `false` | Yes | Add outer border to accordion |
| `expandedItems` | `Array` | `[]` | No | Array of expanded item IDs |
| `orientation` | `String` | `'vertical'` | Yes | Layout: `'vertical'` or `'horizontal'` |

## Item Properties (t-accordion-item)

| Property | Type | Default | Reflects | Description |
|----------|------|---------|----------|-------------|
| `itemId` | `String` | `''` | Yes | Unique identifier for the item |
| `title` | `String` | `''` | Yes | Header title text |
| `subtitle` | `String` | `''` | No | Secondary text in header |
| `badge` | `String` | `''` | No | Badge text displayed in header |
| `expanded` | `Boolean` | `false` | Yes | Whether panel is expanded |
| `disabled` | `Boolean` | `false` | Yes | Disable interaction |
| `animated` | `Boolean` | `false` | Yes | Enable expand/collapse animation |
| `variant` | `String` | `'default'` | Yes | Style: `'default'`, `'bordered'`, `'flush'` |
| `size` | `String` | `'md'` | Yes | Size: `'sm'`, `'md'`, `'lg'` |
| `iconPosition` | `String` | `'left'` | Yes | Caret position: `'left'` or `'right'` |
| `orientation` | `String` | `'vertical'` | Yes | Inherited from parent |

## Methods

### Accordion Methods

#### expandAll()
Expand all items (only works if `multiple=true`).

#### collapseAll()
Collapse all items.

**Fires:** `accordion-change`

#### getItems()
Get all accordion item elements.

**Returns:** `Array` - Array of item elements

#### getExpandedItems()
Get currently expanded item elements.

**Returns:** `Array` - Array of expanded items

### Item Methods

#### toggle()
Toggle the expanded state.

**Fires:** `item-toggle`

#### expand()
Expand the item.

**Fires:** `item-toggle`

#### collapse()
Collapse the item.

**Fires:** `item-toggle`

## Events

### item-toggle
Fired by item when toggled.

```javascript
{
  detail: {
    itemId: 'section-1',
    expanded: true
  }
}
```

### accordion-change
Fired by accordion when any item changes.

```javascript
{
  detail: {
    expandedItems: ['section-1', 'section-3'],
    itemId: 'section-1',
    expanded: true
  }
}
```

## Examples

### Basic Accordion

```html
<t-accordion>
  <t-accordion-item item-id="s1" title="Section 1">
    Content for section 1
  </t-accordion-item>
  <t-accordion-item item-id="s2" title="Section 2">
    Content for section 2
  </t-accordion-item>
  <t-accordion-item item-id="s3" title="Section 3">
    Content for section 3
  </t-accordion-item>
</t-accordion>
```

### Multiple Open with Badges

```html
<t-accordion multiple bordered>
  <t-accordion-item
    item-id="inbox"
    title="Inbox"
    badge="5"
    expanded>
    Inbox messages
  </t-accordion-item>
  <t-accordion-item
    item-id="sent"
    title="Sent"
    subtitle="Last 30 days">
    Sent messages
  </t-accordion-item>
  <t-accordion-item
    item-id="drafts"
    title="Drafts"
    disabled>
    Draft messages
  </t-accordion-item>
</t-accordion>
```

### Animated with Custom Styling

```html
<t-accordion>
  <t-accordion-item
    item-id="faq1"
    title="What is this?"
    animated
    variant="bordered"
    size="lg"
    icon-position="right">
    This is an accordion component.
  </t-accordion-item>
</t-accordion>
```

### With Header Actions

```html
<t-accordion>
  <t-accordion-item item-id="s1" title="Section 1">
    <t-button slot="header-action" size="xs">Edit</t-button>
    Section content
  </t-accordion-item>
</t-accordion>
```

### Programmatic Control

```javascript
const accordion = document.querySelector('t-accordion');

// Expand all (if multiple mode)
accordion.expandAll();

// Collapse all
accordion.collapseAll();

// Get expanded items
const expanded = accordion.getExpandedItems();

// Listen for changes
accordion.addEventListener('accordion-change', (e) => {
  console.log('Expanded items:', e.detail.expandedItems);
});
```

## Slots

### Accordion Slots
| Slot | Description |
|------|-------------|
| default | `t-accordion-item` elements |

### Item Slots
| Slot | Description |
|------|-------------|
| default | Panel content |
| `header-action` | Actions in the header |

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--item-bg` | `var(--terminal-gray-darkest)` | Content background |
| `--item-border` | `var(--terminal-gray-dark)` | Border color |
| `--item-color` | `var(--terminal-green)` | Accent color |
| `--item-header-bg` | `var(--terminal-black)` | Header background |

## Related Components

- [TTabsLit](./TTabsLit.md) - Tab navigation
- [TCardLit](./TCardLit.md) - Card container
