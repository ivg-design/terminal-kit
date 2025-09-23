/**
 * Vite plugin to trigger a full reload when built docs change under public/docs.
 */
export default function reloadDocsOnChange() {
  let reloadTimer = null;
  let isInitialBuild = true;

  return {
    name: 'reload-docs-on-change',
    apply: 'serve',
    configureServer(server) {
      const pattern = 'public/docs/**/*';
      server.watcher.add(pattern);

      // Give initial build time to complete
      setTimeout(() => {
        isInitialBuild = false;
      }, 5000);

      const onChange = (file) => {
        // Skip during initial build to prevent loops
        if (isInitialBuild) return;

        if (file && file.includes('public/docs/')) {
          // Debounce rapid changes to prevent reload loops
          clearTimeout(reloadTimer);
          reloadTimer = setTimeout(() => {
            server.ws.send({ type: 'full-reload' });
          }, 1000);
        }
      };

      server.watcher.on('add', onChange);
      server.watcher.on('change', onChange);
      server.watcher.on('unlink', onChange);
    },
  };
}

