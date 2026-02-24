/**
 * @fileoverview TCarouselLit - Terminal-style Carousel Component
 * @module components/TCarouselLit
 * @version 3.0.0
 *
 * Carousel layout for nested components with drag, keyboard, and button navigation.
 *
 * @example
 * <t-carousel></t-carousel>
 */

import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import componentLogger from '../utils/ComponentLogger.js';
import { caretLeftIcon, caretRightIcon } from '../utils/phosphor-icons.js';

/**
 * @component TCarouselLit
 * @tagname t-carousel
 * @description Carousel layout for nested components with drag, keyboard, and button navigation.
 * @category Layout
 * @since 3.0.0
 * @example
 * <t-carousel infinite controls dots>
 *   <t-card>First</t-card>
 *   <t-card>Second</t-card>
 * </t-carousel>
 */
export class TCarouselLit extends LitElement {
  static tagName = 't-carousel';
  static version = '3.0.0';
  static category = 'Layout';

  static styles = css`
    :host {
      display: block;
      --carousel-bg: var(--terminal-gray-darkest, #1a1a1a);
      --carousel-border: var(--terminal-gray-dark, #333333);
      --carousel-text: var(--terminal-green, #00ff41);
      --carousel-text-dim: var(--terminal-green-dim, #00cc33);
      --carousel-glow: rgba(0, 255, 65, 0.25);
      --carousel-gap: 12px;
      --carousel-transition-ms: 450ms;
      --carousel-slides-per-view: 1;
      --carousel-index: 0;
    }

    :host([hidden]) {
      display: none !important;
    }

    .carousel {
      position: relative;
      border: 1px solid var(--carousel-border);
      background: var(--carousel-bg);
      padding: 12px;
      overflow: hidden;
      outline: none;
    }

    .viewport {
      overflow: hidden;
      width: 100%;
      touch-action: pan-y;
      user-select: none;
      cursor: grab;
    }

    .viewport.dragging {
      cursor: grabbing;
    }

    .track {
      display: flex;
      align-items: stretch;
      gap: var(--carousel-gap);
      transition: transform var(--carousel-transition-ms) cubic-bezier(0.2, 0.8, 0.2, 1);
      will-change: transform;
      transform: translateX(0);
    }

    .track.no-transition {
      transition: none !important;
    }

    slot {
      display: contents;
    }

    ::slotted(*) {
      flex: 0 0 calc(
        (100% - (var(--carousel-gap) * (var(--carousel-slides-per-view) - 1))) /
          var(--carousel-slides-per-view)
      );
      min-width: 0;
      max-width: calc(
        (100% - (var(--carousel-gap) * (var(--carousel-slides-per-view) - 1))) /
          var(--carousel-slides-per-view)
      );
    }

    .controls {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
    }

    .control-btn {
      pointer-events: auto;
      width: 32px;
      height: 32px;
      border: 1px solid var(--carousel-text);
      background: color-mix(in srgb, var(--carousel-bg) 85%, transparent);
      color: var(--carousel-text);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      backdrop-filter: blur(2px);
    }

    .control-btn:hover:not(:disabled) {
      background: var(--carousel-text);
      color: var(--terminal-black, #0a0a0a);
      box-shadow: 0 0 10px var(--carousel-glow);
    }

    .control-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .control-btn svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }

    .dots {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid var(--carousel-text);
      background: transparent;
      cursor: pointer;
      padding: 0;
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }

    .dot.active {
      background: var(--carousel-text);
      box-shadow: 0 0 8px var(--carousel-glow);
    }

    .meta {
      margin-top: 10px;
      font-size: 10px;
      color: var(--carousel-text-dim);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    @media (prefers-reduced-motion: reduce) {
      .track,
      .control-btn,
      .dot {
        transition: none !important;
      }
    }
  `;

  static properties = {
    index: { type: Number, reflect: true },
    infinite: { type: Boolean, reflect: true },
    draggable: { type: Boolean, reflect: true },
    keyboard: { type: Boolean, reflect: true },
    controls: { type: Boolean, reflect: true },
    dots: { type: Boolean, reflect: true },
    slidesPerView: { type: Number, attribute: 'slides-per-view', reflect: true },
    gap: { type: Number, reflect: true },
    transitionMs: { type: Number, attribute: 'transition-ms', reflect: true },
    autoplay: { type: Boolean, reflect: true },
    interval: { type: Number, reflect: true },
    pauseOnHover: { type: Boolean, attribute: 'pause-on-hover', reflect: true },
    threshold: { type: Number, reflect: true }
  };

  _logger = null;
  _slideCount = 0;
  _dragging = false;
  _dragStartX = 0;
  _dragOffsetX = 0;
  _pointerId = null;
  _autoplayTimer = null;
  _hovering = false;
  _draggingClass = false;

  constructor() {
    super();
    this._logger = componentLogger.for('TCarouselLit');

    this.index = 0;
    this.infinite = false;
    this.draggable = true;
    this.keyboard = true;
    this.controls = true;
    this.dots = true;
    this.slidesPerView = 1;
    this.gap = 12;
    this.transitionMs = 450;
    this.autoplay = false;
    this.interval = 4000;
    this.pauseOnHover = true;
    this.threshold = 0.2;
  }

  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected');
  }

  disconnectedCallback() {
    this._stopAutoplay();
    super.disconnectedCallback();
    this._logger.info('Disconnected');
  }

  firstUpdated() {
    this._refreshSlides();
    this._applyHostVariables();
    this._updateAutoplay();
  }

  updated(changedProperties) {
    this._applyHostVariables();

    if (
      changedProperties.has('autoplay') ||
      changedProperties.has('interval') ||
      changedProperties.has('infinite')
    ) {
      this._updateAutoplay();
    }

    if (changedProperties.has('slidesPerView')) {
      this._clampIndex();
    }
  }

  getSlideCount() {
    return this._slideCount;
  }

  next() {
    this.goTo(this.index + 1, { userInitiated: true });
  }

  prev() {
    this.goTo(this.index - 1, { userInitiated: true });
  }

  pause() {
    this._stopAutoplay();
  }

  play() {
    if (this.autoplay) {
      this._updateAutoplay(true);
    }
  }

  goTo(targetIndex, { userInitiated = false } = {}) {
    const maxIndex = this._getMaxIndex();
    let nextIndex = Number.isFinite(targetIndex) ? targetIndex : 0;

    if (this.infinite && this._slideCount > 0) {
      if (nextIndex > maxIndex) nextIndex = 0;
      if (nextIndex < 0) nextIndex = maxIndex;
    } else {
      nextIndex = Math.max(0, Math.min(maxIndex, nextIndex));
    }

    const previous = this.index;
    this.index = nextIndex;

    if (previous !== nextIndex) {
      this._emitEvent('carousel-change', {
        index: nextIndex,
        previousIndex: previous,
        totalSlides: this._slideCount,
        userInitiated
      });
    }
  }

  _getSlides() {
    const slot = this.renderRoot?.querySelector('slot');
    if (!slot) return [];
    return slot.assignedElements({ flatten: true });
  }

  _refreshSlides() {
    const slides = this._getSlides();
    this._slideCount = slides.length;
    this._clampIndex();
    this._emitEvent('carousel-slides-change', {
      totalSlides: this._slideCount,
      pageCount: this._getPageCount()
    });
  }

  _clampIndex() {
    const maxIndex = this._getMaxIndex();
    if (this.index > maxIndex) this.index = maxIndex;
    if (this.index < 0) this.index = 0;
  }

  _getMaxIndex() {
    return Math.max(0, this._slideCount - this._normalizedSlidesPerView());
  }

  _getPageCount() {
    return this._getMaxIndex() + 1;
  }

  _normalizedSlidesPerView() {
    return Math.max(1, Number(this.slidesPerView) || 1);
  }

  _applyHostVariables() {
    const perView = this._normalizedSlidesPerView();
    this.style.setProperty('--carousel-slides-per-view', String(perView));
    this.style.setProperty('--carousel-gap', `${Math.max(0, Number(this.gap) || 0)}px`);
    this.style.setProperty('--carousel-transition-ms', `${Math.max(0, Number(this.transitionMs) || 0)}ms`);
    this.style.setProperty('--carousel-index', String(Math.max(0, this.index)));
  }

  _trackTransform() {
    const perView = this._normalizedSlidesPerView();
    const gap = Math.max(0, Number(this.gap) || 0);
    const index = Math.max(0, this.index);
    const dragOffset = this._dragging ? this._dragOffsetX : 0;

    const stepExpr = `((100% - ${(perView - 1) * gap}px) / ${perView} + ${gap}px)`;
    return `transform: translateX(calc(${stepExpr} * -${index} + ${dragOffset}px));`;
  }

  _startDrag(e) {
    if (!this.draggable || this._slideCount <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const viewport = this.renderRoot.querySelector('.viewport');
    if (!viewport) return;

    this._dragging = true;
    this._dragStartX = e.clientX;
    this._dragOffsetX = 0;
    this._pointerId = e.pointerId;
    this._draggingClass = true;

    viewport.setPointerCapture(e.pointerId);
    this.requestUpdate();

    this._emitEvent('carousel-drag-start', { index: this.index });
  }

  _moveDrag(e) {
    if (!this._dragging || e.pointerId !== this._pointerId) return;
    this._dragOffsetX = e.clientX - this._dragStartX;
    this.requestUpdate();
  }

  _endDrag(e) {
    if (!this._dragging) return;
    if (this._pointerId !== null && e.pointerId !== this._pointerId) return;

    const viewport = this.renderRoot.querySelector('.viewport');
    if (viewport && this._pointerId !== null && viewport.hasPointerCapture(this._pointerId)) {
      viewport.releasePointerCapture(this._pointerId);
    }

    const width = viewport?.clientWidth || 1;
    const dragRatio = Math.abs(this._dragOffsetX) / width;
    const shouldAdvance = dragRatio >= Math.max(0.05, Number(this.threshold) || 0.2);

    if (shouldAdvance) {
      if (this._dragOffsetX < 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    this._dragging = false;
    this._dragOffsetX = 0;
    this._dragStartX = 0;
    this._pointerId = null;
    this._draggingClass = false;
    this.requestUpdate();

    this._emitEvent('carousel-drag-end', {
      index: this.index,
      advanced: shouldAdvance
    });
  }

  _onKeyDown(e) {
    if (!this.keyboard) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'Home':
        e.preventDefault();
        this.goTo(0, { userInitiated: true });
        break;
      case 'End':
        e.preventDefault();
        this.goTo(this._getMaxIndex(), { userInitiated: true });
        break;
      default:
        break;
    }
  }

  _onPointerCancel(e) {
    this._endDrag(e);
  }

  _onMouseEnter() {
    this._hovering = true;
  }

  _onMouseLeave() {
    this._hovering = false;
  }

  _updateAutoplay(forceStart = false) {
    this._stopAutoplay();

    if (!this.autoplay && !forceStart) return;
    if (this._slideCount <= 1) return;

    const delay = Math.max(300, Number(this.interval) || 4000);
    this._autoplayTimer = setInterval(() => {
      if (this.pauseOnHover && this._hovering) return;
      if (this._dragging) return;
      this.next();
    }, delay);
  }

  _stopAutoplay() {
    if (this._autoplayTimer) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }

  _emitEvent(name, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    const perView = this._normalizedSlidesPerView();
    const pageCount = this._getPageCount();
    const canPrev = this.infinite || this.index > 0;
    const canNext = this.infinite || this.index < this._getMaxIndex();

    return html`
      <div
        class="carousel"
        tabindex="0"
        role="region"
        aria-roledescription="carousel"
        aria-label="Component carousel"
        @keydown=${this._onKeyDown}
      >
        <div
          class="viewport ${this._draggingClass ? 'dragging' : ''}"
          @pointerdown=${this._startDrag}
          @pointermove=${this._moveDrag}
          @pointerup=${this._endDrag}
          @pointercancel=${this._onPointerCancel}
          @pointerleave=${this._onPointerCancel}
          @mouseenter=${this._onMouseEnter}
          @mouseleave=${this._onMouseLeave}
        >
          <div class="track ${this._dragging ? 'no-transition' : ''}" style="${this._trackTransform()}">
            <slot @slotchange=${this._refreshSlides}></slot>
          </div>
        </div>

        ${this.controls
          ? html`
              <div class="controls" aria-hidden="true">
                <button
                  class="control-btn"
                  ?disabled=${!canPrev}
                  @click=${this.prev}
                  aria-label="Previous slide"
                >
                  ${unsafeHTML(caretLeftIcon)}
                </button>
                <button
                  class="control-btn"
                  ?disabled=${!canNext}
                  @click=${this.next}
                  aria-label="Next slide"
                >
                  ${unsafeHTML(caretRightIcon)}
                </button>
              </div>
            `
          : ''}

        ${this.dots && pageCount > 1
          ? html`
              <div class="dots" role="tablist" aria-label="Carousel pages">
                ${Array.from({ length: pageCount }, (_, i) => {
                  const active = i === this.index;
                  return html`
                    <button
                      class="dot ${active ? 'active' : ''}"
                      role="tab"
                      aria-selected=${active ? 'true' : 'false'}
                      aria-label=${`Go to slide ${i + 1}`}
                      @click=${() => this.goTo(i, { userInitiated: true })}
                    ></button>
                  `;
                })}
              </div>
            `
          : ''}

        <div class="meta">
          <span>slide ${Math.min(this.index + 1, pageCount)} / ${pageCount}</span>
          <span>${this._slideCount} item${this._slideCount === 1 ? '' : 's'} • view ${perView}</span>
        </div>
      </div>
    `;
  }
}

if (!customElements.get(TCarouselLit.tagName)) {
  customElements.define(TCarouselLit.tagName, TCarouselLit);
}

export default TCarouselLit;
