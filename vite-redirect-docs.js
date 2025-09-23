/**
 * Vite middleware to redirect /docs -> /docs/index.html so that
 * the static built docs (in public/docs) are served instead of SPA fallback.
 */
export default function redirectDocsToIndex() {
  return {
    name: 'redirect-docs-to-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const url = req.url.split('?')[0];
        if (url === '/docs' || url === '/docs/') {
          res.statusCode = 302;
          res.setHeader('Location', '/docs/index.html');
          res.end();
          return;
        }
        next();
      });
    },
  };
}

