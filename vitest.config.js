import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'esnext'
  },
  test: {
    // Use happy-dom for DOM simulation (lighter than jsdom)
    environment: 'happy-dom',

    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Test file patterns
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/dist/**'
      ]
    },

    // Setup files
    setupFiles: ['./tests/setup.js'],

    // Test timeout
    testTimeout: 10000,

    // Show test output
    silent: false
  }
});