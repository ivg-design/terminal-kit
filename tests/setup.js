/**
 * Vitest Setup File
 * Runs before all tests
 */

// Polyfill for customElements if needed
if (typeof global.customElements === 'undefined') {
  global.customElements = {
    define: () => {},
    get: () => undefined,
    whenDefined: () => Promise.resolve()
  };
}

// Ensure localStorage is available and API-compatible in test environment
if (typeof global.localStorage === 'undefined' || typeof global.localStorage.getItem !== 'function') {
  const store = new Map();
  const mockStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };

  global.localStorage = mockStorage;

  if (typeof global.window !== 'undefined') {
    try {
      Object.defineProperty(global.window, 'localStorage', {
        configurable: true,
        value: mockStorage
      });
    } catch {}
  }
}

if (typeof global.localStorage?.setItem === 'function' && global.localStorage.getItem('t_log_level') === null) {
  global.localStorage.setItem('t_log_level', 'ERROR');
}

// Mock window.__TERMINAL_KIT_REGISTRY__
if (typeof global.window !== 'undefined') {
  global.window.__TERMINAL_KIT_REGISTRY__ = {
    manifests: new Map(),
    register: function(manifest) {
      this.manifests.set(manifest.tagName, manifest);
    },
    get: function(tagName) {
      return this.manifests.get(tagName);
    },
    has: function(tagName) {
      return this.manifests.has(tagName);
    }
  };
}
