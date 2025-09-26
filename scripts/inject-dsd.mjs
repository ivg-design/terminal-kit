#!/usr/bin/env node

/**
 * Script to inject DSD templates into HTML files
 * Run this to pre-process HTML files with DSD templates
 */

import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the button CSS
async function loadButtonCSS() {
    const cssPath = path.join(__dirname, '../css/components/TButton.css');
    try {
        return await fs.readFile(cssPath, 'utf-8');
    } catch (error) {
        console.warn('Could not load TButton.css, using inline styles');
        return getDefaultButtonCSS();
    }
}

function getDefaultButtonCSS() {
    return `
:host {
    display: inline-block;
    font-family: var(--font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace);
}

.t-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 8px 16px;
    min-height: 28px;
    background: transparent;
    color: var(--terminal-green, #00ff41);
    border: 1px solid currentColor;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    outline: none;
    text-decoration: none;
    -webkit-appearance: none;
}

.t-btn:hover:not(:disabled) {
    background: var(--terminal-green, #00ff41);
    color: var(--terminal-black, #0a0a0a);
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
    transform: translateY(-1px);
}

.t-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
}

.t-btn:focus-visible {
    outline: 2px solid var(--terminal-green, #00ff41);
    outline-offset: 2px;
}

.t-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

:host([loading]) .t-btn {
    pointer-events: none;
    opacity: 0.7;
}

/* Secondary variant */
:host([variant="secondary"]) .t-btn {
    color: var(--terminal-green-dim, #00cc33);
    border-color: var(--terminal-green-dim, #00cc33);
}

:host([variant="secondary"]) .t-btn:hover:not(:disabled) {
    background: var(--terminal-green-dim, #00cc33);
    color: var(--terminal-black, #0a0a0a);
}

/* Danger variant */
:host([variant="danger"]) .t-btn {
    color: #ff0066;
    border-color: #ff0066;
}

:host([variant="danger"]) .t-btn:hover:not(:disabled) {
    background: #ff0066;
    color: var(--terminal-black, #0a0a0a);
    box-shadow: 0 0 10px rgba(255, 0, 102, 0.5);
}

/* Toggle variant */
:host([variant="toggle"]) .t-btn {
    border-style: dashed;
}

:host([variant="toggle"][toggle-state="true"]) .t-btn {
    background: var(--terminal-green, #00ff41);
    color: var(--terminal-black, #0a0a0a);
    border-style: solid;
}

/* Size variants */
:host([size="xs"]) .t-btn {
    padding: 0;
    min-height: 16px;
    width: 16px;
    height: 16px;
    border: none;
}

:host([size="xs"]) .t-btn:hover:not(:disabled) {
    background: transparent;
    color: var(--terminal-green, #00ff41);
    transform: scale(1.1);
}

:host([size="small"]) .t-btn {
    padding: 4px 8px;
    min-height: 20px;
    font-size: 11px;
}

:host([size="large"]) .t-btn {
    padding: 12px 24px;
    min-height: 36px;
    font-size: 14px;
}

/* Icon styles */
.t-btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    flex-shrink: 0;
}

.t-btn-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
}

:host([type="icon"]) .t-btn {
    padding: 4px;
    min-width: 28px;
}

:host([type="icon"][size="xs"]) .t-btn {
    min-width: 16px;
}

:host([type="icon"][size="small"]) .t-btn {
    min-width: 20px;
}

:host([type="icon"][size="large"]) .t-btn {
    min-width: 36px;
}

/* Loading state */
.t-btn-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

:host([loading]) .t-btn-content {
    visibility: hidden;
}

.t-btn-content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.t-btn-text {
    flex: 1;
}`;
}

// Create the DSD template for a button
function createButtonDSDTemplate(css) {
    return `<template shadowrootmode="open">
<style>${css}</style>
<button class="t-btn" type="button">
    <span class="t-btn-content">
        <slot></slot>
    </span>
</button>
</template>`;
}

async function injectDSDTemplates(htmlPath, outputPath) {
    console.log(`Processing: ${htmlPath}`);

    // Read the HTML file
    const html = await fs.readFile(htmlPath, 'utf-8');

    // Parse with JSDOM
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // Load button CSS
    const buttonCSS = await loadButtonCSS();
    const buttonTemplate = createButtonDSDTemplate(buttonCSS);

    // Find all t-btn elements
    const buttons = document.querySelectorAll('t-btn');
    let injectedCount = 0;

    buttons.forEach(button => {
        // Skip if already has template
        if (button.querySelector('template[shadowrootmode]')) {
            console.log('  Button already has DSD template, skipping');
            return;
        }

        // Get the button's content (will become slot content)
        const content = button.innerHTML;

        // Insert the DSD template
        button.innerHTML = buttonTemplate + content;
        button.setAttribute('data-dsd-injected', 'true');
        injectedCount++;
    });

    if (injectedCount > 0) {
        console.log(`  ✅ Injected ${injectedCount} DSD templates`);

        // Write the output
        const output = dom.serialize();
        await fs.writeFile(outputPath || htmlPath, output);
        console.log(`  💾 Saved to: ${outputPath || htmlPath}`);
    } else {
        console.log('  No buttons found to inject DSD templates');
    }

    return injectedCount;
}

async function processFile(filePath) {
    const outputPath = filePath.replace('.html', '-dsd-injected.html');
    await injectDSDTemplates(filePath, outputPath);
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node inject-dsd.mjs <html-file> [output-file]');
        console.log('');
        console.log('Examples:');
        console.log('  node inject-dsd.mjs demos/buttons.html');
        console.log('  node inject-dsd.mjs demos/buttons.html dist/buttons.html');
        process.exit(1);
    }

    const inputFile = path.resolve(args[0]);
    const outputFile = args[1] ? path.resolve(args[1]) : null;

    try {
        await injectDSDTemplates(inputFile, outputFile);
        console.log('✨ Done!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { injectDSDTemplates, createButtonDSDTemplate };