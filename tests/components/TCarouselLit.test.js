import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TCarouselLit.js';

describe('TCarouselLit', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`
      <t-carousel>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </t-carousel>
    `);
    await component.updateComplete;
  });

  afterEach(() => {
    component?.remove();
  });

  it('has static metadata', () => {
    expect(component.constructor.tagName).toBe('t-carousel');
    expect(component.constructor.version).toBe('3.0.0');
    expect(component.constructor.category).toBe('Layout');
  });

  it('has expected default properties', () => {
    expect(component.index).toBe(0);
    expect(component.infinite).toBe(false);
    expect(component.draggable).toBe(true);
    expect(component.keyboard).toBe(true);
    expect(component.controls).toBe(true);
    expect(component.dots).toBe(true);
    expect(component.slidesPerView).toBe(1);
    expect(component.transitionMs).toBe(450);
  });

  it('clamps index in non-infinite mode', async () => {
    component.goTo(99);
    await component.updateComplete;
    expect(component.index).toBe(2);

    component.goTo(-1);
    await component.updateComplete;
    expect(component.index).toBe(0);
  });

  it('wraps index in infinite mode', async () => {
    component.infinite = true;
    await component.updateComplete;

    component.goTo(99);
    await component.updateComplete;
    expect(component.index).toBe(0);

    component.goTo(-1);
    await component.updateComplete;
    expect(component.index).toBe(2);
  });

  it('next and prev navigate slides', async () => {
    component.next();
    await component.updateComplete;
    expect(component.index).toBe(1);

    component.prev();
    await component.updateComplete;
    expect(component.index).toBe(0);
  });

  it('updates page count with slides-per-view', async () => {
    component.slidesPerView = 2;
    await component.updateComplete;

    const dots = component.shadowRoot.querySelectorAll('.dot');
    expect(dots.length).toBe(2);
  });

  it('fires carousel-change event when index changes', async () => {
    const handler = vi.fn();
    component.addEventListener('carousel-change', handler);

    component.goTo(1, { userInitiated: true });
    await component.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail.index).toBe(1);
    expect(event.detail.previousIndex).toBe(0);
    expect(event.detail.userInitiated).toBe(true);
  });

  it('renders controls and dots by default', async () => {
    component._slideCount = 3;
    component.requestUpdate();
    await component.updateComplete;

    expect(component.shadowRoot.querySelectorAll('.control-btn').length).toBe(2);
    expect(component.shadowRoot.querySelectorAll('.dot').length).toBeGreaterThan(0);
  });

  it('supports autoplay lifecycle controls', async () => {
    component.autoplay = true;
    component.interval = 300;
    await component.updateComplete;

    expect(component._autoplayTimer).toBeTruthy();

    component.pause();
    expect(component._autoplayTimer).toBeFalsy();
  });

  it('handles keyboard navigation keys', () => {
    component._slideCount = 3;
    const nextSpy = vi.spyOn(component, 'next');
    const prevSpy = vi.spyOn(component, 'prev');
    const goToSpy = vi.spyOn(component, 'goTo');

    const right = { key: 'ArrowRight', preventDefault: vi.fn() };
    const left = { key: 'ArrowLeft', preventDefault: vi.fn() };
    const home = { key: 'Home', preventDefault: vi.fn() };
    const end = { key: 'End', preventDefault: vi.fn() };

    component._onKeyDown(right);
    component._onKeyDown(left);
    component._onKeyDown(home);
    component._onKeyDown(end);

    expect(right.preventDefault).toHaveBeenCalled();
    expect(left.preventDefault).toHaveBeenCalled();
    expect(home.preventDefault).toHaveBeenCalled();
    expect(end.preventDefault).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
    expect(prevSpy).toHaveBeenCalled();
    expect(goToSpy).toHaveBeenCalledWith(0, { userInitiated: true });
    expect(goToSpy).toHaveBeenCalledWith(component._getMaxIndex(), { userInitiated: true });
  });

  it('skips keyboard handling when disabled', () => {
    component.keyboard = false;
    const nextSpy = vi.spyOn(component, 'next');
    component._onKeyDown({ key: 'ArrowRight', preventDefault: vi.fn() });
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('handles drag start/move/end navigation', () => {
    component._slideCount = 3;
    component.index = 0;

    const viewport = {
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
      clientWidth: 200
    };
    const originalQuery = component.renderRoot.querySelector.bind(component.renderRoot);
    vi.spyOn(component.renderRoot, 'querySelector').mockImplementation((selector) => {
      if (selector === '.viewport') return viewport;
      return originalQuery(selector);
    });

    component._startDrag({ pointerType: 'mouse', button: 0, clientX: 200, pointerId: 7 });
    expect(component._dragging).toBe(true);
    expect(viewport.setPointerCapture).toHaveBeenCalledWith(7);

    component._moveDrag({ pointerId: 7, clientX: 40 });
    expect(component._dragOffsetX).toBe(-160);

    component._endDrag({ pointerId: 7 });
    expect(component.index).toBe(1);
    expect(component._dragging).toBe(false);
    expect(viewport.releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it('ignores drag start when non-primary mouse button is used', () => {
    component._slideCount = 3;
    const viewport = { setPointerCapture: vi.fn() };
    vi.spyOn(component.renderRoot, 'querySelector').mockReturnValue(viewport);

    component._startDrag({ pointerType: 'mouse', button: 1, clientX: 100, pointerId: 1 });
    expect(component._dragging).toBe(false);
    expect(viewport.setPointerCapture).not.toHaveBeenCalled();
  });

  it('supports force-start autoplay and hover pause flags', () => {
    component._slideCount = 3;
    component.autoplay = false;

    component._updateAutoplay(true);
    expect(component._autoplayTimer).toBeTruthy();

    component._onMouseEnter();
    expect(component._hovering).toBe(true);
    component._onMouseLeave();
    expect(component._hovering).toBe(false);

    component._stopAutoplay();
    expect(component._autoplayTimer).toBeNull();
  });

  it('includes drag offset in track transform expression', () => {
    component.index = 1;
    component.slidesPerView = 2;
    component.gap = 10;
    component._dragging = true;
    component._dragOffsetX = 25;

    const transform = component._trackTransform();
    expect(transform).toContain('+ 25px');
    expect(transform).toContain('-1');
  });
});
