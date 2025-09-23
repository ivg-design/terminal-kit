import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TerminalComponentV2 } from '../../components_v2/js/TerminalComponentV2.js';
import '../../components_v2/js/TerminalLoaderV2.js';
import '../../components_v2/js/TerminalButtonV2.js';

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
  // Avoid lifecycle rendering in unit tests
  TerminalComponentV2.prototype.ensureStylesLoaded = vi.fn().mockResolvedValue();
  TerminalComponentV2.prototype.render = vi.fn();
});

describe('DataManager integration (v2)', () => {
  it('shares a singleton DataManager across components', async () => {
    await customElements.whenDefined('terminal-loader-v2');
    await customElements.whenDefined('terminal-button-v2');
    const a = document.createElement('terminal-loader-v2');
    const b = document.createElement('terminal-button-v2');
    // No need to append; constructor runs on creation
    expect(a.dataManager).toBeTruthy();
    expect(b.dataManager).toBeTruthy();
    expect(a.dataManager).toBe(b.dataManager);
    expect(a.dataManager).toBe(TerminalComponentV2.dataManager);
  });
});
