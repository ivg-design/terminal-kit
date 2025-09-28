import { beforeEach, afterEach } from 'vitest';

// Mock window.location before any imports
if (typeof window !== 'undefined' && !window.location) {
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'localhost',
      search: '',
      href: 'http://localhost/'
    },
    writable: true
  });
}

// Mock performance API if not available
if (typeof window !== 'undefined' && !window.performance) {
  window.performance = {
    now: () => Date.now()
  };
}

// Note: Class field shadowing warnings from Lit are caught in individual tests
// This is expected when using Babel to transpile decorators

// Setup runs before each test
beforeEach(() => {
  // Clear document body
  document.body.innerHTML = '';

  // Reset any global state if needed
  if (window.localStorage) {
    window.localStorage.clear();
  }
});

// Cleanup runs after each test
afterEach(() => {
  // Clear document body
  document.body.innerHTML = '';
});

// Mock window.localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

if (typeof window !== 'undefined' && !window.localStorage) {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
}