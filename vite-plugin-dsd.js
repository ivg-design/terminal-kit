import { DSDTemplateGenerator } from './js/utils/DSDTemplateGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function viteDSDPlugin(options = {}) {
    let generator;
    let config;
    let cachedTemplates = null;
    let isGenerating = false;

    // Configuration for components to generate DSD for
    const componentConfig = {
        components: [
            {
                path: path.join(__dirname, 'js/components/TButton.js'),
                tagName: 't-btn',
                className: 'TButton'
            },
            {
                path: path.join(__dirname, 'js/components/TPanel.js'),
                tagName: 't-panel',
                className: 'TPanel'
            }
            // Add more components here as needed
        ]
    };

    async function generateTemplates() {
        if (isGenerating) return cachedTemplates;

        isGenerating = true;
        try {
            console.log('🔨 Generating DSD templates...');
            cachedTemplates = await generator.generateFromConfig(componentConfig);
            console.log(`✅ Generated ${cachedTemplates.size} DSD templates`);
            return cachedTemplates;
        } catch (error) {
            console.error('Failed to generate DSD templates:', error);
            return new Map();
        } finally {
            isGenerating = false;
        }
    }

    return {
        name: 'vite-plugin-dsd',

        async configResolved(resolvedConfig) {
            config = resolvedConfig;
            generator = new DSDTemplateGenerator({
                outputDir: path.join(__dirname, 'dist/dsd'),
                componentsDir: path.join(__dirname, 'js/components')
            });

            // Generate templates once at startup in dev mode
            if (config.command === 'serve' && !options.disableDSD) {
                await generateTemplates();
            }
        },

        transform(code, id) {
            // Process HTML files
            if (id.endsWith('.html')) {
                return this.transformIndexHtml.handler(code);
            }
        },

        transformIndexHtml: {
            order: 'pre', // Back to 'pre' to inject early
            async handler(html) {
                // Enable DSD in both dev and build modes
                // Can be disabled with options.disableDSD = true
                if (options.disableDSD) {
                    return html;
                }

                try {
                    // In dev mode, use cached templates; in build mode, generate fresh
                    const templates = config.command === 'build'
                        ? await generateTemplates()
                        : cachedTemplates || await generateTemplates();

                    // Check if this HTML has any components we support
                    const hasComponents = Array.from(templates.keys()).some(tag => html.includes(`<${tag}`));

                    if (!hasComponents) {
                        return html; // No components to process
                    }

                    // Inject templates into HTML
                    const processedHtml = await generator.injectTemplatesIntoHTML(html, templates);

                    const mode = config.command === 'build' ? 'production' : 'development';

                    // Check if templates were actually injected
                    const injected = processedHtml.includes('shadowrootmode');

                    if (injected) {
                        console.log(`✅ [${mode}] Successfully injected ${templates.size} DSD template(s)`);
                        // Debug: Show a snippet of injected content
                        const snippet = processedHtml.match(/<t-btn[^>]*>[\s\S]{0,100}/);
                        if (snippet) {
                            console.log('Sample:', snippet[0].substring(0, 80) + '...');
                        }
                    } else {
                        console.log(`❌ [${mode}] Failed to inject templates - checking why...`);
                        console.log('Has t-btn elements:', processedHtml.includes('<t-btn'));
                        console.log('Template size:', templates.size);
                    }

                    return processedHtml;
                } catch (error) {
                    console.warn('Failed to inject DSD templates:', error);
                    return html;
                }
            }
        },

        async handleHotUpdate({ file, server }) {
            // Regenerate cached templates when components change
            if (file.includes('/js/components/')) {
                console.log(`🔄 Component changed, regenerating DSD templates...`);

                // Clear and regenerate templates
                cachedTemplates = null;
                await generateTemplates();

                // Trigger full reload to apply new templates
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
            }
        }
    };
}