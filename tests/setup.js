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