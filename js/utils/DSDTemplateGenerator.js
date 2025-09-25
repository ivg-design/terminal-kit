export class DSDTemplateGenerator {
    constructor(options = {}) {
        this.outputDir = options.outputDir || './dist';
        this.componentsDir = options.componentsDir || './js/components';
        this.cache = new Map();
        this.jsdomModule = null;
        this.cssCache = new Map();
    }

    async initJSDOM() {
        if (!this.jsdomModule) {
            const { JSDOM } = await import('jsdom');
            this.jsdomModule = JSDOM;
            this.dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
                url: 'http://localhost',
                pretendToBeVisual: true,
                storageQuota: 10000000
            });
            this.window = this.dom.window;
            this.document = this.window.document;

            // Set up globals for component initialization
            global.window = this.window;
            global.document = this.document;
            global.customElements = this.window.customElements;
            global.HTMLElement = this.window.HTMLElement;

            // Mock browser APIs
            global.localStorage = {
                getItem: () => null,
                setItem: () => {},
                removeItem: () => {},
                clear: () => {}
            };

            // Mock fetch to return empty CSS for StyleSheetManager
            global.fetch = (url) => {
                return Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve('/* SSR mock CSS */'),
                    json: () => Promise.resolve({})
                });
            };

            // Mock CSSStyleSheet with proper constructor
            global.CSSStyleSheet = class CSSStyleSheet {
                constructor() {
                    this.cssRules = [];
                }
                replaceSync(text) {
                    this.cssRules = [{ cssText: text }];
                }
                replace(text) {
                    this.cssRules = [{ cssText: text }];
                    return Promise.resolve();
                }
            };

            // Set SSR flag so components can skip certain initializations
            global.__IS_SSR__ = true;
        }
        return this.jsdomModule;
    }

    async loadComponentCSS(tagName) {
        // Check cache first
        if (this.cssCache.has(tagName)) {
            return this.cssCache.get(tagName);
        }

        // Map tag names to CSS file names
        const cssFileMap = {
            't-btn': 't-btn.css',
            't-button': 't-btn.css',
            't-pnl': 't-pnl.css',
            't-panel': 't-pnl.css',
            't-inp': 't-inp.css',
            't-input': 't-inp.css',
            't-drp': 't-drp.css',
            't-dropdown': 't-drp.css',
            't-sld': 't-sld.css',
            't-slider': 't-sld.css',
            't-tog': 't-tog.css',
            't-toggle': 't-tog.css'
        };

        const cssFileName = cssFileMap[tagName.toLowerCase()];
        if (!cssFileName) {
            console.warn(`No CSS mapping found for ${tagName}`);
            return '';
        }

        try {
            const fs = await import('fs/promises');
            const path = await import('path');
            const { fileURLToPath } = await import('url');

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const cssPath = path.join(__dirname, '../../css/components', cssFileName);

            const cssContent = await fs.readFile(cssPath, 'utf-8');
            this.cssCache.set(tagName, cssContent);
            return cssContent;
        } catch (error) {
            console.warn(`Could not load CSS for ${tagName}: ${error.message}`);
            return '';
        }
    }

    async generateTemplatesForComponent(ComponentClass, tagName) {
        await this.initJSDOM();
        const templates = new Map();

        // Create a single instance with default props
        const instance = new ComponentClass();

        // Check if component already has shadow root (from constructor)
        if (!instance.shadowRoot) {
            instance.attachShadow({ mode: 'open' });
        }

        // Load CSS from file
        const cssContent = await this.loadComponentCSS(tagName);

        // Check if component has a getGenericTemplate method
        let shadowHTML;
        if (typeof instance.getGenericTemplate === 'function') {
            // Use the generic template but prepend CSS
            const templateContent = instance.getGenericTemplate();
            // Check if template already has styles
            if (templateContent.includes('<style>') && cssContent) {
                // Replace the existing style tag with full CSS
                shadowHTML = templateContent.replace(
                    /<style>[^<]*<\/style>/,
                    `<style>${cssContent}</style>`
                );
            } else if (cssContent) {
                // Add CSS at the beginning
                shadowHTML = `<style>${cssContent}</style>${templateContent}`;
            } else {
                shadowHTML = templateContent;
            }
        } else {
            // Fallback to render method
            if (typeof instance.render === 'function') {
                instance.render();
            }
            shadowHTML = instance.shadowRoot.innerHTML;

            // Add CSS inline since adoptedStyleSheets don't work in DSD
            if (cssContent) {
                shadowHTML = `<style>${cssContent}</style>${shadowHTML}`;
            }
        }

        const templateHTML = `<template shadowrootmode="open">${shadowHTML}</template>`;

        // Store one template per component type
        templates.set(tagName, {
            tagName,
            template: templateHTML
        });

        return templates;
    }

    async generateFromConfig(config) {
        await this.initJSDOM();
        const allTemplates = new Map();

        for (const componentConfig of config.components) {
            const { path: componentPath, tagName, className } = componentConfig;

            const ComponentModule = await import(componentPath);
            const ComponentClass = className ? ComponentModule[className] : ComponentModule.default;

            const templates = await this.generateTemplatesForComponent(
                ComponentClass,
                tagName
            );

            for (const [key, value] of templates.entries()) {
                allTemplates.set(key, value);
            }
        }

        return allTemplates;
    }

    async injectTemplatesIntoHTML(htmlOrPath, templates) {
        const JSDOM = await this.initJSDOM();

        // Check if it's a file path or HTML string
        let html;
        if (htmlOrPath.includes('<!DOCTYPE') || htmlOrPath.includes('<html')) {
            html = htmlOrPath;
        } else {
            const fs = await import('fs/promises');
            html = await fs.readFile(htmlOrPath, 'utf-8');
        }

        const dom = new JSDOM(html);
        const { document } = dom.window;

        // For each component type, inject the same template into all instances
        for (const [tagName, templateData] of templates.entries()) {
            const { template } = templateData;

            const elements = document.querySelectorAll(tagName);

            for (const element of elements) {
                // Skip if element already has DSD
                if (!element.querySelector('template[shadowrootmode]')) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = template;
                    const templateElement = tempDiv.firstChild;

                    element.insertBefore(templateElement, element.firstChild);
                    element.setAttribute('data-dsd', 'true');
                }
            }
        }

        return dom.serialize();
    }

    elementMatchesVariant(element, variant) {
        if (!variant.props) return true;

        for (const [prop, value] of Object.entries(variant.props)) {
            if (element.getAttribute(prop) !== value) {
                return false;
            }
        }

        return true;
    }

    async generateStaticComponents(config) {
        const fs = await import('fs/promises');
        const path = await import('path');
        const templates = await this.generateFromConfig(config);

        const output = {
            templates: Object.fromEntries(templates),
            generated: new Date().toISOString(),
            config
        };

        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.writeFile(
            path.join(this.outputDir, 'dsd-templates.json'),
            JSON.stringify(output, null, 2)
        );

        return templates;
    }

    async processHTMLFiles(htmlFiles, templates) {
        const fs = await import('fs/promises');
        const results = [];

        for (const htmlFile of htmlFiles) {
            const processed = await this.injectTemplatesIntoHTML(htmlFile, templates);

            const outputPath = htmlFile.replace(/\.html$/, '.dsd.html');
            await fs.writeFile(outputPath, processed);

            results.push({
                input: htmlFile,
                output: outputPath,
                templatesInjected: templates.size
            });
        }

        return results;
    }
}

export async function generateDSDForProduction(config) {
    const generator = new DSDTemplateGenerator(config.options);

    const templates = await generator.generateStaticComponents(config);

    if (config.htmlFiles) {
        const results = await generator.processHTMLFiles(config.htmlFiles, templates);
        console.log('DSD Generation Complete:', results);
        return results;
    }

    return templates;
}