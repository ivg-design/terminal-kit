import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'esnext'
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['js/components/**/*.js'],
      exclude: [
        'js/components/**/*.backup.js',
        'node_modules/**',
        'test/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },
    testTimeout: 10000,
    silent: false
  }
});