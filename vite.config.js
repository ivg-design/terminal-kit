import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';
// hybridLogger removed; CDP mirror is the sole logging pipeline now
// Page-level console capture is disabled by default now; CDP mirror handles logs
// import injectConsoleCapture from './vite-inject-console-capture.js';
import reloadDocsOnChange from './vite-reload-docs.js';
import redirectDocsToIndex from './vite-redirect-docs.js';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/apps/rive-preview/' : '/',
  build: {
    outDir: '../dist-v2',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3007,
    open: false,
    // Enable HMR with full page reload fallback
    hmr: {
      overlay: true, // Show error overlay
      port: 3009 // Use a different port for HMR WebSocket to avoid conflicts
    },
    // Watch all files for changes
    watch: {
      usePolling: false, // Use native file system events
      ignored: ['**/node_modules/**', '**/logs/**']
    }
  },
  // CSS configuration for better HMR
  css: {
    devSourcemap: true, // Enable CSS source maps in development
    modules: {
      localsConvention: 'camelCase'
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      '@rive-app/canvas',
      '@rive-app/webgl',
      '@supabase/supabase-js',
      '@simonwep/pickr'
    ]
  },
  plugins: [
    // Ensure /docs route hits /docs/index.html (static) instead of SPA fallback
    redirectDocsToIndex(),
    // Page console injection disabled (use CDP mirror instead)
    // injectConsoleCapture(),
    // Force full reload when built docs under public/docs change
    reloadDocsOnChange(),
    // Hybrid logger removed (use CDP logs only)
    copy({
      targets: [
        // Copy Rive runtime files during build
        { 
          src: 'node_modules/@rive-app/canvas/rive.js', 
          dest: 'public/js/',
          rename: 'rive-canvas.js'
        },
        { 
          src: 'node_modules/@rive-app/webgl/rive.js', 
          dest: 'public/js/',
          rename: 'rive-webgl.js'
        },
        // Copy Pickr files
        { 
          src: 'node_modules/@simonwep/pickr/dist/pickr.min.js', 
          dest: 'public/js/libs/'
        },
        { 
          src: 'node_modules/@simonwep/pickr/dist/themes/monolith.min.css', 
          dest: 'css/libs/',
          rename: 'pickr.min.css'
        }
      ],
      hook: 'buildStart'
    })
  ]
});
