/**
 * @fileoverview TBentoGridLit - Terminal-style Bento Grid Component
 * @module components/TBentoGridLit
 * @version 3.0.0
 *
 * Responsive bento grid container for composing nested Terminal Kit components with per-tile spans.
 *
 * @example
 * <t-bento></t-bento>
 */

import { LitElement, html, css } from 'lit';
import componentLogger from '../utils/ComponentLogger.js';

/**
 * @component TBentoGridLit
 * @tagname t-bento
 * @description Bento-style grid container for mixed-size component tiles.
 * @category Layout
 * @since 3.0.0
 * @example
 * <t-bento columns="12" gap="12" row-height="96" dense>
 *   <t-pnl col-span="4" row-span="2">Panel</t-pnl>
 *   <t-chart col-span="8" row-span="3"></t-chart>
 * </t-bento>
 */
export class TBentoGridLit extends LitElement {
  static tagName = 't-bento';
  static version = '3.0.0';
  static category = 'Layout';

  static properties = {
    columns: { type: Number, reflect: true },
    gap: { type: Number, reflect: true },
    rowHeight: { type: Number, attribute: 'row-height', reflect: true },
    minTileWidth: { type: Number, attribute: 'min-tile-width', reflect: true },
    dense: { type: Boolean, reflect: true },
    responsive: { type: Boolean, reflect: true },
    outlined: { type: Boolean, reflect: true }
  };

  static styles = css`
    :host {
      display: block;
      --bento-columns: 12;
      --bento-gap: 12px;
      --bento-row-height: 96px;
      --bento-min-tile-width: 220px;
      --bento-border: var(--terminal-gray-dark, #333333);
      --bento-bg: color-mix(in srgb, var(--terminal-gray-darkest, #1a1a1a) 88%, transparent);
    }

    :host([hidden]) {
      display: none !important;
    }

    .bento {
      display: grid;
      grid-template-columns: repeat(var(--bento-columns), minmax(0, 1fr));
      grid-auto-rows: minmax(var(--bento-row-height), auto);
      gap: var(--bento-gap);
      align-items: stretch;
      width: 100%;
    }

    :host([dense]) .bento {
      grid-auto-flow: row dense;
    }

    :host([responsive]) .bento {
      grid-template-columns: repeat(auto-fit, minmax(var(--bento-min-tile-width), 1fr));
    }

    ::slotted(*) {
      min-width: 0;
      min-height: 0;
      grid-column: span var(--bento-col-span, 3);
      grid-row: span var(--bento-row-span, 1);
      transition: box-shadow 160ms ease, border-color 160ms ease;
    }

    :host([outlined]) ::slotted(*) {
      border: 1px solid var(--bento-border);
      background: var(--bento-bg);
    }

    @media (max-width: 1200px) {
      :host(:not([responsive])) ::slotted(*) {
        grid-column: span var(--bento-col-span-md, var(--bento-col-span, 3));
        grid-row: span var(--bento-row-span-md, var(--bento-row-span, 1));
      }
    }

    @media (max-width: 800px) {
      :host(:not([responsive])) ::slotted(*) {
        grid-column: span var(--bento-col-span-sm, var(--bento-col-span-md, var(--bento-col-span, 3)));
        grid-row: span var(--bento-row-span-sm, var(--bento-row-span-md, var(--bento-row-span, 1)));
      }
    }
  `;

  _logger = null;
  _itemCount = 0;

  constructor() {
    super();
    this._logger = componentLogger.for('TBentoGridLit');

    this.columns = 12;
    this.gap = 12;
    this.rowHeight = 96;
    this.minTileWidth = 220;
    this.dense = false;
    this.responsive = false;
    this.outlined = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._logger.info('Connected');
  }

  firstUpdated() {
    this._applyHostVariables();
    this.refreshLayout();
  }

  updated(changed) {
    if (
      changed.has('columns') ||
      changed.has('gap') ||
      changed.has('rowHeight') ||
      changed.has('minTileWidth')
    ) {
      this._applyHostVariables();
      this.refreshLayout();
    }
  }

  _applyHostVariables() {
    const columns = this._safeNumber(this.columns, 12, 1, 24);
    const gap = this._safeNumber(this.gap, 12, 0, 80);
    const rowHeight = this._safeNumber(this.rowHeight, 96, 20, 800);
    const minTileWidth = this._safeNumber(this.minTileWidth, 220, 120, 960);

    this.style.setProperty('--bento-columns', String(columns));
    this.style.setProperty('--bento-gap', `${gap}px`);
    this.style.setProperty('--bento-row-height', `${rowHeight}px`);
    this.style.setProperty('--bento-min-tile-width', `${minTileWidth}px`);
  }

  _safeNumber(value, fallback, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  _getItems() {
    const slot = this.renderRoot?.querySelector('slot');
    if (!slot) return [];
    return slot.assignedElements({ flatten: true });
  }

  _getAttrNumber(el, name, fallback, min = 1, max = 24) {
    const raw = el.getAttribute(name);
    if (raw === null || raw === '') return fallback;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  _applyItemLayout(el, index) {
    const colSpan = this._getAttrNumber(el, 'col-span', 3, 1, 24);
    const rowSpan = this._getAttrNumber(el, 'row-span', 1, 1, 24);

    el.style.setProperty('--bento-col-span', String(colSpan));
    el.style.setProperty('--bento-row-span', String(rowSpan));

    const mdColSpan = this._getAttrNumber(el, 'md-col-span', colSpan, 1, 24);
    const mdRowSpan = this._getAttrNumber(el, 'md-row-span', rowSpan, 1, 24);
    const smColSpan = this._getAttrNumber(el, 'sm-col-span', mdColSpan, 1, 24);
    const smRowSpan = this._getAttrNumber(el, 'sm-row-span', mdRowSpan, 1, 24);

    el.style.setProperty('--bento-col-span-md', String(mdColSpan));
    el.style.setProperty('--bento-row-span-md', String(mdRowSpan));
    el.style.setProperty('--bento-col-span-sm', String(smColSpan));
    el.style.setProperty('--bento-row-span-sm', String(smRowSpan));

    const colStart = this._getAttrNumber(el, 'col-start', 0, 0, 24);
    const rowStart = this._getAttrNumber(el, 'row-start', 0, 0, 99);

    if (colStart > 0) {
      el.style.gridColumnStart = String(colStart);
      el.style.gridColumnEnd = `span ${colSpan}`;
    } else {
      el.style.removeProperty('grid-column-start');
      el.style.removeProperty('grid-column-end');
    }

    if (rowStart > 0) {
      el.style.gridRowStart = String(rowStart);
      el.style.gridRowEnd = `span ${rowSpan}`;
    } else {
      el.style.removeProperty('grid-row-start');
      el.style.removeProperty('grid-row-end');
    }

    const order = this._getAttrNumber(el, 'order', 0, 0, 999);
    el.style.order = order > 0 ? String(order) : '';

    if (!el.hasAttribute('bento-item-id')) {
      el.setAttribute('bento-item-id', `item-${index + 1}`);
    }
  }

  refreshLayout() {
    const items = this._getItems();
    items.forEach((item, idx) => this._applyItemLayout(item, idx));

    const previous = this._itemCount;
    this._itemCount = items.length;

    this._logger.debug('Layout refreshed', {
      items: this._itemCount,
      columns: this.columns,
      responsive: this.responsive
    });

    if (previous !== this._itemCount) {
      this.dispatchEvent(
        new CustomEvent('bento-items-change', {
          detail: {
            count: this._itemCount,
            layout: this.getLayout()
          },
          bubbles: true,
          composed: true
        })
      );
    }
  }

  setItemSpan(target, { colSpan, rowSpan, colStart, rowStart } = {}) {
    const item = typeof target === 'string' ? this.querySelector(target) : target;
    if (!item) return false;

    if (Number.isFinite(colSpan)) item.setAttribute('col-span', String(colSpan));
    if (Number.isFinite(rowSpan)) item.setAttribute('row-span', String(rowSpan));

    if (Number.isFinite(colStart) && colStart > 0) {
      item.setAttribute('col-start', String(colStart));
    } else if (colStart === null || colStart === 0) {
      item.removeAttribute('col-start');
    }

    if (Number.isFinite(rowStart) && rowStart > 0) {
      item.setAttribute('row-start', String(rowStart));
    } else if (rowStart === null || rowStart === 0) {
      item.removeAttribute('row-start');
    }

    this._applyItemLayout(item, 0);
    this.requestUpdate();
    return true;
  }

  getLayout() {
    return this._getItems().map((item, index) => ({
      id: item.getAttribute('bento-item-id') || `item-${index + 1}`,
      tag: item.tagName.toLowerCase(),
      colSpan: this._getAttrNumber(item, 'col-span', 3, 1, 24),
      rowSpan: this._getAttrNumber(item, 'row-span', 1, 1, 24),
      colStart: this._getAttrNumber(item, 'col-start', 0, 0, 24),
      rowStart: this._getAttrNumber(item, 'row-start', 0, 0, 99)
    }));
  }

  render() {
    return html`
      <div class="bento" role="grid" aria-label="Bento component grid">
        <slot @slotchange=${this.refreshLayout}></slot>
      </div>
    `;
  }
}

if (!customElements.get(TBentoGridLit.tagName)) {
  customElements.define(TBentoGridLit.tagName, TBentoGridLit);
}

export default TBentoGridLit;
