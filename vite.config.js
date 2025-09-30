import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@jaames/iro': resolve(__dirname, 'node_modules/@jaames/iro/dist/iro.es.js')
    }
  },
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
    port: 12359,
    open: false,
    // Handle demo routes that don't exist yet
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  // Serve public directory properly
  publicDir: 'public'
});