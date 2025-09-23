/**
 * Vite plugin to inject the console capture client into every HTML page in dev.
 * Ensures logging works across all demo pages without manual imports.
 */
export default function injectConsoleCapture() {
  return {
    name: 'inject-console-capture',
    apply: 'serve',
    transformIndexHtml(html) {
      // Inject as an ES module at the end of <head> to run early
      const tag = '<script type="module" src="/js/console-capture.js"></script>';
      if (html.includes('/js/console-capture.js')) return html;
      return html.replace('</head>', `  ${tag}\n</head>`);
    },
  };
}

