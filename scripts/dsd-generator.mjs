#!/usr/bin/env node
/**
 * Sophisticated DSD Template Generator
 * Generates complete Declarative Shadow DOM templates from manifest
 * Includes all styles, variants, and component options
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

class DSDGenerator {
    constructor() {
        this.manifest = null;
        this.componentStyles = new Map();
        this.globalStyles = '';
    }

    async loadManifest() {
        const manifestPath = path.join(ROOT_DIR, 'dsd-manifest.json');
        const content = await fs.readFile(manifestPath, 'utf-8');
        this.manifest = JSON.parse(content);

        // Build global styles
        if (this.manifest.globalStyles?.cssVariables) {
            this.globalStyles = `:host {\n  ${this.manifest.globalStyles.cssVariables.join(';\n  ')};\n}\n`;
        }

        console.log(`[OK] Loaded manifest with ${this.manifest.components.length} components`);
    }

    async loadComponentStyles() {
        for (const component of this.manifest.components) {
            const styles = await this.getComponentStyles(component);
            this.componentStyles.set(component.tagName, styles);

            // Also store for aliases
            if (component.aliases) {
                for (const alias of component.aliases) {
                    this.componentStyles.set(alias, styles);
                }
            }
        }
    }

    async getComponentStyles(component) {
        // Try multiple style sources
        const possiblePaths = [
            component.cssPath,
            `css/components/${component.name}.css`,
            `css/components/${component.tagName}.css`,
            `css/components/${component.name.toLowerCase()}.css`
        ].filter(Boolean);

        for (const stylePath of possiblePaths) {
            try {
                const fullPath = path.join(ROOT_DIR, stylePath);
                const css = await fs.readFile(fullPath, 'utf-8');
                console.log(`  ✓ Loaded styles for ${component.name} from ${stylePath}`);
                return this.processCSS(css);
            } catch (e) {
                // Try next path
            }
        }

        // If no CSS file found, generate default styles based on component attributes
        console.log(`  ⚠ No CSS file found for ${component.name}, generating defaults`);
        return this.generateDefaultStyles(component);
    }

    processCSS(css) {
        // Remove comments but preserve the CSS
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');

        // Don't add fallbacks - the CSS variables should be defined in :host
        // Only the manifest's globalStyles CSS variables are needed
        // Let undefined variables just fail gracefully rather than using wrong fallbacks

        return css;
    }

    generateDefaultStyles(component) {
        // Return minimal CSS when no file is found
        console.warn(`WARNING: No CSS file found for ${component.name} - using minimal styles`);
        return `
/* WARNING: No CSS file found for ${component.name} */
:host {
  display: block;
}
`;
    }

    // Removed - no longer needed since we're loading actual CSS files

    // Removed - no longer needed since we're loading actual CSS files

    generateDSDTemplate(component, element = null) {
        const styles = this.componentStyles.get(component.tagName);

        // Build the template content
        let templateContent = `<style>${this.globalStyles}${styles}</style>`;

        // Add HTML structure based on component
        if (component.tagName === 't-btn') {
            templateContent += `<button class="t-btn" type="button"><slot></slot></button>`;
        } else if (component.tagName === 't-panel' || component.tagName === 't-pnl') {
            templateContent += `
<div class="t-panel">
  <div class="t-panel__header">
    <slot name="header">
      <span class="t-panel__title"></span>
      <div class="t-panel__controls">
        <span class="t-panel__toggle">▼</span>
      </div>
    </slot>
  </div>
  <div class="t-panel__content">
    <slot></slot>
  </div>
  <slot name="footer"></slot>
</div>`;
        } else {
            // Generic structure
            templateContent += `<div class="${component.tagName}"><slot></slot></div>`;
        }

        return `<template shadowrootmode="open">${templateContent}</template>`;
    }

    async processHTMLFile(inputPath, outputPath) {
        console.log(`\n[FILE] Processing ${path.basename(inputPath)}...`);

        const html = await fs.readFile(inputPath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;

        let injectedCount = 0;

        // Process each component in the manifest
        for (const component of this.manifest.components) {
            const elements = document.querySelectorAll(component.tagName);

            // Also process aliases
            const aliases = component.aliases || [];
            for (const alias of aliases) {
                const aliasElements = document.querySelectorAll(alias);
                aliasElements.forEach(el => elements.push?.(el));
            }

            for (const element of elements) {
                // Skip if already has DSD
                if (element.querySelector('template[shadowrootmode]')) {
                    continue;
                }

                // Generate and inject DSD template
                const template = this.generateDSDTemplate(component, element);
                element.insertAdjacentHTML('afterbegin', template);
                element.setAttribute('data-dsd', 'true');
                injectedCount++;
            }
        }

        // Remove/comment out component imports that cause FOUC with DSD
        this.removeComponentImports(document);

        // Write the processed HTML
        const processedHtml = dom.serialize();
        await fs.writeFile(outputPath, processedHtml);

        console.log(`  [DONE] Injected ${injectedCount} DSD templates`);
        console.log(`  [SAVE] ${outputPath}`);

        return injectedCount;
    }

    removeComponentImports(document) {
        // Find all script tags with type="module"
        const moduleScripts = document.querySelectorAll('script[type="module"]');

        for (const script of moduleScripts) {
            if (!script.textContent) continue;

            let modifiedScript = script.textContent;
            let hasChanges = false;

            // List of component imports to remove/comment out (they cause FOUC with DSD)
            const componentImportsToRemove = [
                /import\s+[^;]*?['"'][^'"]*?components\/TComponent\.js['"'][^;]*?;?/g,
                /import\s+[^;]*?['"'][^'"]*?components\/TButton\.js['"'][^;]*?;?/g,
                /import\s+[^;]*?['"'][^'"]*?components\/TLoader\.js['"'][^;]*?;?/g,
                /import\s+[^;]*?['"'][^'"]*?components\/TPanel\.js['"'][^;]*?;?/g,
                // Add more component imports as needed
            ];

            // Remove/comment out problematic component imports
            componentImportsToRemove.forEach(importRegex => {
                if (importRegex.test(modifiedScript)) {
                    modifiedScript = modifiedScript.replace(importRegex, (match) => {
                        hasChanges = true;
                        return `// DSD: Removed to prevent FOUC - ${match.trim()}`;
                    });
                }
            });

            // Also comment out the dynamic TComponent import that logs DSD statistics
            // since we don't need it with pure DSD
            const dynamicImportRegex = /import\(['"][^'"]*?components\/TComponent\.js['"]\)[\s\S]*?logDSDStatistics\(\);/g;
            if (dynamicImportRegex.test(modifiedScript)) {
                modifiedScript = modifiedScript.replace(dynamicImportRegex, (match) => {
                    hasChanges = true;
                    return `// DSD: Removed dynamic import and statistics logging\n            // ${match.replace(/\n/g, '\n            // ')}`;
                });
            }

            // Update the script content if changes were made
            if (hasChanges) {
                script.textContent = modifiedScript;
                console.log(`  [CLEAN] Removed component imports that cause FOUC`);
            }
        }
    }

    async processAllDemos() {
        const demosDir = path.join(ROOT_DIR, 'demos');
        const outputDir = path.join(ROOT_DIR, '.dsd-build');

        // Clean output directory first
        await fs.rm(outputDir, { recursive: true, force: true });
        await fs.mkdir(outputDir, { recursive: true });

        // Get all component tags from manifest
        const componentTags = new Set();
        for (const component of this.manifest.components) {
            componentTags.add(component.tagName);
            if (component.aliases) {
                component.aliases.forEach(alias => componentTags.add(alias));
            }
        }

        // Process all HTML files
        const files = await fs.readdir(demosDir);
        const htmlFiles = files.filter(f => f.endsWith('.html'));

        let totalInjected = 0;
        let filesProcessed = 0;

        for (const file of htmlFiles) {
            const inputPath = path.join(demosDir, file);

            // Check if file contains any manifest components
            const content = await fs.readFile(inputPath, 'utf-8');
            let hasManifestComponents = false;

            for (const tag of componentTags) {
                if (content.includes(`<${tag}`)) {
                    hasManifestComponents = true;
                    break;
                }
            }

            // Only process files with manifest components
            if (hasManifestComponents) {
                const outputPath = path.join(outputDir, file);
                const count = await this.processHTMLFile(inputPath, outputPath);
                totalInjected += count;
                filesProcessed++;
            }
        }

        console.log(`\n[TOTAL] ${totalInjected} DSD templates injected`);
        console.log(`[FILES] Processed ${filesProcessed} files (out of ${htmlFiles.length} total)`);
        return outputDir;
    }
}

// Main execution
async function main() {
    console.log('DSD Template Generator');
    console.log('==========================\n');

    const generator = new DSDGenerator();

    try {
        // Load manifest and styles
        await generator.loadManifest();
        await generator.loadComponentStyles();

        // Process based on command line args
        const args = process.argv.slice(2);

        if (args.length === 2) {
            // Process specific files
            const [input, output] = args;
            await generator.processHTMLFile(
                path.resolve(input),
                path.resolve(output)
            );
        } else {
            // Process all demos
            const outputDir = await generator.processAllDemos();
            console.log(`\n[OUTPUT] ${outputDir}`);
            console.log('[TIP] Use "npm run dev:dsd" to serve these files');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();