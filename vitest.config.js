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
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'js/components/TButtonLit.js',
        'js/components/TColorPickerLit.js',
        'js/components/TDropdownLit.js',
        'js/components/TInputLit.js',
        'js/components/TLoaderLit.js',
        'js/components/TModalLit.js',
        'js/components/TPanelLit.js',
        'js/components/TSliderLit.js',
        'js/components/TTextareaLit.js',
        'js/components/TToastLit.js',
        'js/components/TToggleLit.js'
      ],
      exclude: [
        'js/components/**/*.backup.js',
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/dist/**'
      ],
      thresholds: {
        lines: 70,
        functions: 65,
        branches: 65,
        statements: 70
      }
    },

    // Setup file
    setupFiles: ['./tests/setup.js'],

    // Test timeout
    testTimeout: 10000,

    // Show test output
    silent: false
  }
});