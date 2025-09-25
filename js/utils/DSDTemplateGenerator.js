export class DSDTemplateGenerator {
    constructor(options = {}) {
        this.outputDir = options.outputDir || './dist';
        this.componentsDir = options.componentsDir || './js/components';
        this.cache = new Map();
        this.jsdomModule = null;
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

    async generateTemplatesForComponent(ComponentClass, tagName) {
        await this.initJSDOM();
        const templates = new Map();

        // Create a single instance with default props
        const instance = new ComponentClass();

        // Check if component already has shadow root (from constructor)
        if (!instance.shadowRoot) {
            instance.attachShadow({ mode: 'open' });
        }

        // Check if component has a getGenericTemplate method
        let shadowHTML;
        if (typeof instance.getGenericTemplate === 'function') {
            // Use the generic template that includes styles
            shadowHTML = instance.getGenericTemplate();
        } else {
            // Fallback to render method
            if (typeof instance.render === 'function') {
                instance.render();
            }
            shadowHTML = instance.shadowRoot.innerHTML;

            // CRITICAL: Add CSS inline since adoptedStyleSheets don't work in DSD
            // Try to get the component's CSS and inject it
            const componentName = ComponentClass.name;
            const cssPath = `/css/components/t-${tagName.substring(2)}.css`;

            // Add a style tag with the CSS
            shadowHTML = `
                <style>
                    /* Component styles should be loaded here */
                    /* TODO: Load actual CSS from ${cssPath} */
                </style>
                ${shadowHTML}
            `;
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