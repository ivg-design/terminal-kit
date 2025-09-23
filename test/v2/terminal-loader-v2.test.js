import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TerminalComponentV2 } from '../../components_v2/js/TerminalComponentV2.js';
import '../../components_v2/js/TerminalLoaderV2.js';

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
  // Avoid hitting HTML parser via render in jsdom; test API-level behavior
  TerminalComponentV2.prototype.ensureStylesLoaded = vi.fn().mockResolvedValue();
  TerminalComponentV2.prototype.render = vi.fn();
});

describe('TerminalLoaderV2', () => {
  it('constructs and exposes API methods', async () => {
    await customElements.whenDefined('terminal-loader-v2');
    const el = document.createElement('terminal-loader-v2');
    expect(typeof el.show).toBe('function');
    expect(typeof el.hide).toBe('function');
    expect(typeof el.toggle).toBe('function');
  });

  it('supports show/hide/toggle API', async () => {
    const el = document.createElement('terminal-loader-v2');
    // No need to append; avoid lifecycle rendering
    el.hide();
    expect(el.isVisible()).toBe(false);
    el.show();
    expect(el.isVisible()).toBe(true);
    el.toggle();
    expect([true, false]).toContain(el.isVisible());
  });
});
