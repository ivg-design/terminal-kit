# TBentoGridLit Component Documentation

<!-- STANDARD_DOC_INTRO -->

## Overview

Bento-style layout container for assembling differently sized nested components into a dashboard grid. Supports explicit spans, optional fixed placement, dense packing, and responsive fallbacks.

## Tag Names

- `t-bento`

## Architecture

- Extends: `LitElement`
- Category: Layout
- Version: 3.0.0

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Properties](#properties)
3. [Tile Attributes](#tile-attributes)
4. [Methods](#methods)
5. [Events](#events)
6. [Examples](#examples)
7. [Slots](#slots)

## Basic Usage

```html
<t-bento columns="12" gap="12" row-height="96" dense>
  <t-pnl col-span="4" row-span="2" title="System">Panel</t-pnl>
  <t-chart col-span="8" row-span="3"></t-chart>
  <t-log-list col-span="6" row-span="2"></t-log-list>
  <t-calendar col-span="6" row-span="2"></t-calendar>
</t-bento>
```

## Properties

| Property | Type | Default | Attribute | Reflects | Description |
|----------|------|---------|-----------|----------|-------------|
| `columns` | `Number` | `12` | `columns` | Yes | Number of grid columns in fixed mode. |
| `gap` | `Number` | `12` | `gap` | Yes | Gap between tiles in pixels. |
| `rowHeight` | `Number` | `96` | `row-height` | Yes | Base row height in pixels. |
| `minTileWidth` | `Number` | `220` | `min-tile-width` | Yes | Minimum tile width for responsive mode. |
| `dense` | `Boolean` | `false` | `dense` | Yes | Enables CSS dense packing (`grid-auto-flow: dense`). |
| `responsive` | `Boolean` | `false` | `responsive` | Yes | Uses `auto-fit` columns based on `minTileWidth`. |
| `outlined` | `Boolean` | `false` | `outlined` | Yes | Adds a subtle terminal border/background to each tile. |

## Tile Attributes

Apply these to each direct child of `<t-bento>`.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `col-span` | `Number` | `3` | Number of columns the tile spans. |
| `row-span` | `Number` | `1` | Number of rows the tile spans. |
| `col-start` | `Number` | auto | Optional fixed starting column. |
| `row-start` | `Number` | auto | Optional fixed starting row. |
| `md-col-span` | `Number` | `col-span` | Column span at medium widths (`<=1200px`). |
| `md-row-span` | `Number` | `row-span` | Row span at medium widths (`<=1200px`). |
| `sm-col-span` | `Number` | `md-col-span` | Column span at small widths (`<=800px`). |
| `sm-row-span` | `Number` | `md-row-span` | Row span at small widths (`<=800px`). |
| `order` | `Number` | auto | Optional visual ordering hint. |

## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `refreshLayout()` | None | `void` | Re-reads slotted children and reapplies span layout. |
| `setItemSpan(target, options)` | `Element\|String`, `{ colSpan?, rowSpan?, colStart?, rowStart? }` | `Boolean` | Updates one tile's span/position attributes and reapplies layout. |
| `getLayout()` | None | `Array` | Returns normalized layout data for all tiles. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `bento-items-change` | `{ count, layout }` | Fires when number of slotted tiles changes. |

## Examples

### Responsive Auto-Fit Layout

```html
<t-bento responsive min-tile-width="260" row-height="100" gap="16">
  <t-pnl col-span="2" row-span="2">Overview</t-pnl>
  <t-kanban col-span="4" row-span="3"></t-kanban>
  <t-log-list col-span="2" row-span="2"></t-log-list>
</t-bento>
```

### Programmatic Span Updates

```javascript
const bento = document.querySelector('t-bento');
bento.setItemSpan('#latency-panel', { colSpan: 6, rowSpan: 2, colStart: 1 });
console.log(bento.getLayout());
```

## Slots

| Slot | Description |
|------|-------------|
| default | Bento tile content. Any direct child component can be used as a tile. |
