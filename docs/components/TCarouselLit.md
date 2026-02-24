# TCarouselLit Component Documentation

<!-- STANDARD_DOC_INTRO -->

## Overview

Composable carousel container for nested components. Supports infinite looping, keyboard navigation, pointer drag, autoplay, and optional controls/dots.

## Tag Names

- `t-carousel`

## Architecture

- Extends: `LitElement`
- Category: Layout
- Version: 3.0.0

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Properties](#properties)
3. [Methods](#methods)
4. [Events](#events)
5. [Examples](#examples)
6. [Slots](#slots)

## Basic Usage

```html
<t-carousel controls dots>
  <t-pnl title="Slide 1">First panel</t-pnl>
  <t-textarea value="Second slide content"></t-textarea>
  <t-accordion>
    <t-accordion-item title="Third slide">Nested accordion</t-accordion-item>
  </t-accordion>
</t-carousel>
```

## Properties

| Property | Type | Default | Attribute | Reflects | Description |
|----------|------|---------|-----------|----------|-------------|
| `index` | `Number` | `0` | `index` | Yes | Current slide index. |
| `infinite` | `Boolean` | `false` | `infinite` | Yes | Wraps from last to first slide and reverse. |
| `draggable` | `Boolean` | `true` | `draggable` | Yes | Enables pointer drag/swipe navigation. |
| `keyboard` | `Boolean` | `true` | `keyboard` | Yes | Enables arrow/home/end keyboard navigation. |
| `controls` | `Boolean` | `true` | `controls` | Yes | Shows previous/next control buttons. |
| `dots` | `Boolean` | `true` | `dots` | Yes | Shows pagination dots. |
| `slidesPerView` | `Number` | `1` | `slides-per-view` | Yes | Number of slides shown at once. |
| `gap` | `Number` | `12` | `gap` | Yes | Gap in pixels between slides. |
| `transitionMs` | `Number` | `450` | `transition-ms` | Yes | Slide animation duration in milliseconds. |
| `autoplay` | `Boolean` | `false` | `autoplay` | Yes | Enables automatic slide progression. |
| `interval` | `Number` | `4000` | `interval` | Yes | Autoplay interval in milliseconds. |
| `pauseOnHover` | `Boolean` | `true` | `pause-on-hover` | Yes | Pauses autoplay while the carousel is hovered. |
| `threshold` | `Number` | `0.2` | `threshold` | Yes | Drag distance ratio required to change slide. |

## Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `next()` | None | `void` | Moves to the next slide/page. |
| `prev()` | None | `void` | Moves to the previous slide/page. |
| `goTo(index, options?)` | `Number`, `Object` | `void` | Jumps to a specific index. |
| `pause()` | None | `void` | Stops autoplay timer. |
| `play()` | None | `void` | Starts autoplay when `autoplay` is enabled. |
| `getSlideCount()` | None | `Number` | Returns number of slotted slides. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `carousel-change` | `{ index, previousIndex, totalSlides, userInitiated }` | Fires when active index changes. |
| `carousel-slides-change` | `{ totalSlides, pageCount }` | Fires when slotted slide count changes. |
| `carousel-drag-start` | `{ index }` | Fires on drag start. |
| `carousel-drag-end` | `{ index, advanced }` | Fires on drag end. |

## Examples

### Infinite + Keyboard + Controls

```html
<t-carousel infinite keyboard controls dots slides-per-view="1">
  <t-card>One</t-card>
  <t-card>Two</t-card>
  <t-card>Three</t-card>
</t-carousel>
```

### Autoplay + Pause on Hover

```html
<t-carousel autoplay interval="3000" pause-on-hover>
  <t-loader type="orbit-spinner"></t-loader>
  <t-loader type="atom-spinner"></t-loader>
  <t-loader type="flower-spinner"></t-loader>
</t-carousel>
```

### Programmatic Control

```javascript
const carousel = document.querySelector('t-carousel');
carousel.goTo(2, { userInitiated: true });
carousel.next();
carousel.pause();
```

## Slots

| Slot | Description |
|------|-------------|
| default | Carousel slide content. Any nested component is supported. |
