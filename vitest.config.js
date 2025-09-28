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

    // Test file patterns - support both test/ and tests/ directories
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['js/components/**/*.js'],
      exclude: [
        'js/components/**/*.backup.js',
        'node_modules/**',
        'test/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/dist/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },

    // Setup files - support both locations
    setupFiles: ['./test/setup.js'],

    // Test timeout
    testTimeout: 10000,

    // Show test output
    silent: false
  }
});