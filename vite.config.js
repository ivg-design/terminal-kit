import { defineConfig } from 'vite';
import { resolve } from 'path';
import reloadDocsOnChange from './vite-reload-docs.js';
import redirectDocsToIndex from './vite-redirect-docs.js';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 12358,
    open: false,
  },
  plugins: [
    // Ensure /docs route hits /docs/index.html
    redirectDocsToIndex(),
    // Force full reload when built docs under public/docs change
    reloadDocsOnChange(),
  ]
});