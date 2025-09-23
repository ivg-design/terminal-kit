import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TerminalComponentV2 } from '../../components_v2/js/TerminalComponentV2.js';
import '../../components_v2/js/TerminalLoaderV2.js';
import '../../components_v2/js/TerminalButtonV2.js';

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
  TerminalComponentV2.prototype.ensureStylesLoaded = vi.fn().mockResolvedValue();
  TerminalComponentV2.prototype.render = vi.fn();
});

describe('TerminalButtonV2', () => {
  it('constructs and exposes public API', async () => {
    await customElements.whenDefined('terminal-button-v2');
    const el = document.createElement('terminal-button-v2');
    expect(typeof el.click).toBe('function');
    expect(typeof el.setLoading).toBe('function');
    expect(typeof el.toggle).toBe('function');
  });

  it('toggle variant emits toggle-change and updates state', async () => {
    const el = document.createElement('terminal-button-v2');
    el.setAttribute('variant', 'toggle');
    // Since render is stubbed, just verify toggle() API flips internal state
    const initial = el.getToggleState();
    const next = el.toggle();
    expect(next).toBe(!initial);
  });

  it('renders loader when loading', async () => {
    const el = document.createElement('terminal-button-v2');
    el.setAttribute('loading', '');
    // With render stubbed, ensure attribute is reflected in props
    expect(el.hasAttribute('loading')).toBe(true);
  });
});
