import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteDSDPlugin } from './vite-plugin-dsd.js';

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
    viteDSDPlugin({
      // DSD is enabled by default in both dev and production
      // Set disableDSD: true to turn it off
      disableDSD: false
    })
  ]
});