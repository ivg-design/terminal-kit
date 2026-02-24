import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing-helpers';
import '../../js/components/TBentoGridLit.js';

describe('TBentoGridLit', () => {
  let component;

  beforeEach(async () => {
    component = await fixture(html`
      <t-bento>
        <div id="a" col-span="4" row-span="2">A</div>
        <div id="b" col-span="8" row-span="3">B</div>
      </t-bento>
    `);
    await component.updateComplete;
    component.refreshLayout();
    await component.updateComplete;
  });

  afterEach(() => {
    component?.remove();
  });

  it('registers custom element and exposes static metadata', () => {
    expect(customElements.get('t-bento')).toBeTruthy();
    expect(component.constructor.tagName).toBe('t-bento');
    expect(component.constructor.version).toBe('3.0.0');
    expect(component.constructor.category).toBe('Layout');
  });

  it('has expected default properties', () => {
    const fresh = document.createElement('t-bento');
    expect(fresh.columns).toBe(12);
    expect(fresh.gap).toBe(12);
    expect(fresh.rowHeight).toBe(96);
    expect(fresh.minTileWidth).toBe(220);
    expect(fresh.dense).toBe(false);
    expect(fresh.responsive).toBe(false);
    expect(fresh.outlined).toBe(false);
  });

  it('applies host CSS variables from component properties', async () => {
    component.columns = 16;
    component.gap = 20;
    component.rowHeight = 140;
    component.minTileWidth = 300;
    await component.updateComplete;

    expect(component.style.getPropertyValue('--bento-columns')).toBe('16');
    expect(component.style.getPropertyValue('--bento-gap')).toBe('20px');
    expect(component.style.getPropertyValue('--bento-row-height')).toBe('140px');
    expect(component.style.getPropertyValue('--bento-min-tile-width')).toBe('300px');
  });

  it('clamps invalid host property values to safe bounds', async () => {
    component.columns = 99;
    component.gap = -20;
    component.rowHeight = 5;
    component.minTileWidth = 40;
    await component.updateComplete;

    expect(component.style.getPropertyValue('--bento-columns')).toBe('24');
    expect(component.style.getPropertyValue('--bento-gap')).toBe('0px');
    expect(component.style.getPropertyValue('--bento-row-height')).toBe('20px');
    expect(component.style.getPropertyValue('--bento-min-tile-width')).toBe('120px');
  });

  it('maps tile span attributes to CSS vars', () => {
    const a = component.querySelector('#a');
    expect(a.style.getPropertyValue('--bento-col-span')).toBe('4');
    expect(a.style.getPropertyValue('--bento-row-span')).toBe('2');
  });

  it('setItemSpan updates span attributes and inline grid positioning', async () => {
    const b = component.querySelector('#b');
    const result = component.setItemSpan('#b', {
      colSpan: 6,
      rowSpan: 2,
      colStart: 3,
      rowStart: 4
    });
    await component.updateComplete;

    expect(result).toBe(true);
    expect(b.getAttribute('col-span')).toBe('6');
    expect(b.getAttribute('row-span')).toBe('2');
    expect(b.getAttribute('col-start')).toBe('3');
    expect(b.getAttribute('row-start')).toBe('4');
    expect(b.style.gridColumnStart).toBe('3');
    expect(b.style.gridRowStart).toBe('4');
  });

  it('setItemSpan can clear explicit start positions', async () => {
    const b = component.querySelector('#b');
    b.setAttribute('col-start', '2');
    b.setAttribute('row-start', '2');

    component.setItemSpan(b, { colStart: 0, rowStart: null });
    await component.updateComplete;

    expect(b.hasAttribute('col-start')).toBe(false);
    expect(b.hasAttribute('row-start')).toBe(false);
    expect(b.style.gridColumnStart).toBe('');
    expect(b.style.gridRowStart).toBe('');
  });

  it('returns false for setItemSpan when target does not exist', () => {
    expect(component.setItemSpan('#missing', { colSpan: 2 })).toBe(false);
  });

  it('returns a normalized layout snapshot', () => {
    const layout = component.getLayout();
    expect(layout.length).toBe(2);
    expect(layout[0]).toMatchObject({
      tag: 'div',
      colSpan: 4,
      rowSpan: 2
    });
  });

  it('emits bento-items-change when slot count changes', async () => {
    const handler = vi.fn();
    component.addEventListener('bento-items-change', handler);

    const item = document.createElement('div');
    item.textContent = 'C';
    component.appendChild(item);
    await component.updateComplete;
    component.refreshLayout();

    expect(handler).toHaveBeenCalled();
    const detail = handler.mock.calls.at(-1)[0].detail;
    expect(detail.count).toBe(3);
    item.remove();
  });

  it('does not emit bento-items-change when item count is unchanged', () => {
    const handler = vi.fn();
    component.addEventListener('bento-items-change', handler);

    component.refreshLayout();
    component.refreshLayout();

    expect(handler).not.toHaveBeenCalled();
  });

  it('falls back to defaults for invalid tile attributes', () => {
    const a = component.querySelector('#a');
    a.setAttribute('col-span', 'invalid');
    a.setAttribute('row-span', '');
    component.refreshLayout();

    expect(a.style.getPropertyValue('--bento-col-span')).toBe('3');
    expect(a.style.getPropertyValue('--bento-row-span')).toBe('1');
  });
});
