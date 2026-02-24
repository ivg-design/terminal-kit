# TTimelineLit Component Documentation

<!-- STANDARD_DOC_INTRO -->

## Overview

Timeline display with chronological events (vertical & horizontal)

## Tag Names

- `t-tmln`

## Architecture

- Extends: `LitElement`
- Category: Container
- Version: 3.0.0

## Table of Contents
1. [Properties](#properties)
2. [Methods](#methods)
3. [Events](#events)
4. [Examples](#examples)
5. [Slots](#slots)
6. [CSS Custom Properties](#css-custom-properties)
7. [Related Components](#related-components)

## Static Metadata

| Property | Value |
| --- | --- |
| `tagName` | `t-tmln` |
| `version` | `3.0.0` |
| `category` | `Container` |

## Properties

| Property | Type | Default | Reflects | Attribute | Description |
| --- | --- | --- | --- | --- | --- |
| `items` | `Array` | `[]` | No | - | Timeline item objects. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Yes | `orientation` | Layout direction. |
| `dense` | `Boolean` | `false` | Yes | `dense` | Compact spacing and typography. |
| `loading` | `Boolean` | `false` | Yes | `loading` | Loading state style for items. |
| `loadingMore` | `Boolean` | `false` | Yes | `loading-more` | Displays “Loading more…” footer. |
| `linePosition` | `String` | `null` | Yes | `line-position` | Vertical: `left`/`right`; Horizontal: `top`/`bottom`. Defaults by orientation. |
| `contentAlign` | `'left' \| 'center' \| 'right'` | `'center'` | Yes | `content-align` | Horizontal item text alignment. |
| `dotSize` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Yes | `dot-size` | Dot size preset. |
| `dotShape` | `'circle' \| 'square' \| 'diamond'` | `'circle'` | Yes | `dot-shape` | Dot shape variant. |
| `dotColorMode` | `'variant' \| 'uniform' \| 'gradient'` | `'variant'` | Yes | `dot-color-mode` | Dot color strategy. |
| `dotColor` | `String` | `'#00ff41'` | No | `dot-color` | Uniform dot color. |
| `dotColorStart` | `String` | `'#00ff41'` | No | `dot-color-start` | Gradient start color. |
| `dotColorEnd` | `String` | `'#00ffff'` | No | `dot-color-end` | Gradient end color. |

### Item Object Shape

```js
{
  id: 'deploy-1',          // required
  title: 'Deploy complete',// required
  date: '3:00 PM',         // optional
  description: '...',      // optional
  variant: 'success',      // optional: default|success|warning|error|info|pending
  expandable: true,        // optional
  clickable: true          // optional
}
```

## Methods

| Method | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `expandItem(id)` | `id: string` | `void` | Expands an expandable item. |
| `collapseItem(id)` | `id: string` | `void` | Collapses an item. |
| `toggleItem(id)` | `id: string` | `void` | Toggles expanded state. |
| `isExpanded(id)` | `id: string` | `boolean` | Returns expanded state. |
| `loadMore()` | - | `void` | Emits `load-more` if `loadingMore` is false. |

## Events

| Event | Detail | Description |
| --- | --- | --- |
| `item-click` | `{ id, title, item }` | Fired when a `clickable` item is clicked. |
| `item-expand` | `{ id, expanded }` | Fired when item expansion state changes. |
| `load-more` | `{}` | Fired when more data should be loaded. |

## Slots

| Slot | Description |
| --- | --- |
| `icon-{id}` | Custom dot/icon content for a specific item. |
| `item-{id}` | Extra content rendered in item body. |
| `expand-{id}` | Expandable content region for an item. |

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--tl-bg` | `var(--terminal-gray-darkest)` | Item background. |
| `--tl-border` | `var(--terminal-gray-dark)` | Item border color. |
| `--tl-green` | `var(--terminal-green)` | Primary accent. |
| `--tl-green-dim` | `var(--terminal-green-dim)` | Secondary accent. |
| `--tl-amber` | `var(--terminal-amber)` | Warning color. |
| `--tl-red` | `var(--terminal-red)` | Error color. |
| `--tl-cyan` | `var(--terminal-cyan)` | Info color. |
| `--tl-gray` | `var(--terminal-gray)` | Neutral/pending color. |
| `--tl-line-width` | `2px` | Timeline line thickness. |
| `--tl-dot-size` | `12px` | Dot size. |
| `--tl-gap` | `16px` | Gap between dot track and content. |
| `--tl-item-gap` | `24px` | Gap between timeline items. |

## Examples

```html
<!-- Vertical (default), line on left -->
<t-tmln id="timeline"></t-tmln>

<!-- Vertical with right line -->
<t-tmln line-position="right"></t-tmln>

<!-- Horizontal with bottom line -->
<t-tmln orientation="horizontal" line-position="bottom"></t-tmln>

<!-- Uniform dot color -->
<t-tmln dot-color-mode="uniform" dot-color="#00ff41"></t-tmln>

<!-- Gradient dot colors -->
<t-tmln
  dot-color-mode="gradient"
  dot-color-start="#00ff41"
  dot-color-end="#00ffff">
</t-tmln>
```

```js
const timeline = document.querySelector('#timeline');
timeline.items = [
  { id: '1', title: 'Event One', date: '1:00 PM', description: 'Started', variant: 'success' },
  { id: '2', title: 'Event Two', date: '2:00 PM', description: 'In progress', expandable: true },
  { id: '3', title: 'Event Three', date: '3:00 PM', description: 'Complete', clickable: true }
];

timeline.addEventListener('item-click', (e) => console.log(e.detail));
timeline.addEventListener('item-expand', (e) => console.log(e.detail));
timeline.addEventListener('load-more', () => console.log('Load next page'));
```

## Related Components

- [TListLit](./TListLit.md)
- [TLogListLit](./TLogListLit.md)
