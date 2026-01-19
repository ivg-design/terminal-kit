/**
 * StyleSheetManager - Manages shared CSSStyleSheet objects for all components
 * Uses adoptedStyleSheets API to share styles across Shadow DOMs without duplication
 *
 * This solves the memory duplication problem when using Shadow DOM with nested components
 * Each stylesheet is created ONCE and adopted by multiple shadow roots
 */

import componentLogger from './ComponentLogger.js';

class StyleSheetManager {
    constructor() {
        // Initialize logger - use singleton with component name
        this.logger = componentLogger.for('StyleSheetManager');

        // Cache for all component stylesheets
        this.styleSheets = new Map();

        // Cache for theme variables stylesheet
        this.themeSheet = null;

        // Track if sheets are initialized
        this.initialized = false;
    }

    /**
     * Initialize all component stylesheets
     * This should be called once at app startup
     */
    async init() {
        if (this.initialized) return;

        // Prevent multiple initializations
        if (this._initPromise) return this._initPromise;

        this._initPromise = this._doInit();
        return this._initPromise;
    }

    async _doInit() {
        // Load theme stylesheet from external file
        this.themeSheet = await this.loadStyleSheet('theme', '/css/theme.css');

        // Load all component stylesheets
        await this.loadComponentStyles();

        this.initialized = true;
        this.logger.info('Initialized with adoptedStyleSheets');
    }

    /**
     * Create a CSSStyleSheet from CSS text
     */
    async createStyleSheet(name, cssText) {
        try {
            // Remove CSS comments that might break CSSStyleSheet.replace()
            // Keep the CSS but strip block comments
            const cleanCSS = cssText
                .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove block comments
                .trim();

            const sheet = new CSSStyleSheet();
            await sheet.replace(cleanCSS);
            this.styleSheets.set(name, sheet);

            // Debug: Check for keyframes
            let keyframeCount = 0;
            for (let i = 0; i < sheet.cssRules.length; i++) {
                if (sheet.cssRules[i].type === CSSRule.KEYFRAMES_RULE) {
                    keyframeCount++;
                }
            }

            // Only log detailed info if debugging specific component via URL param
            const urlParams = new URLSearchParams(window.location.search);
            const debugComponent = urlParams.get('debug');

            if (debugComponent === name || debugComponent === 'all') {
                this.logger.info(`Created stylesheet ${name} with ${sheet.cssRules.length} rules (${keyframeCount} keyframes)`);
            } else {
                // Minimal logging for non-debug components
                this.logger.debug(`${name}: ${sheet.cssRules.length} rules`);
            }

            // Debug: show first few rules
            if (sheet.cssRules.length > 0) {
                this.logger.debug(`First rule in ${name}:`, sheet.cssRules[0].cssText);
            }

            return sheet;
        } catch (error) {
            this.logger.error(`Failed to create stylesheet ${name}:`, error);
            this.logger.error(`CSS that failed (first 500 chars):`, cssText.substring(0, 500));

            // Try alternative: use replaceSync instead of replace
            try {
                const sheet = new CSSStyleSheet();
                const cleanCSS = cssText.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '').trim();
                sheet.replaceSync(cleanCSS);
                this.styleSheets.set(name, sheet);

                // Debug: Check for keyframes
                let keyframeCount = 0;
                for (let i = 0; i < sheet.cssRules.length; i++) {
                    if (sheet.cssRules[i].type === CSSRule.KEYFRAMES_RULE) {
                        keyframeCount++;
                    }
                }

                // Only log detailed info if debugging specific component
                const urlParams = new URLSearchParams(window.location.search);
                const debugComponent = urlParams.get('debug');

                if (debugComponent === name || debugComponent === 'all') {
                    this.logger.info(`Created stylesheet ${name} with replaceSync: ${sheet.cssRules.length} rules (${keyframeCount} keyframes)`);
                } else {
                    this.logger.debug(`${name}: ${sheet.cssRules.length} rules (fallback)`);
                }
                return sheet;
            } catch (syncError) {
                this.logger.error(`Even replaceSync failed for ${name}:`, syncError);
                // Final fallback: create an empty sheet
                const sheet = new CSSStyleSheet();
                this.styleSheets.set(name, sheet);
                return sheet;
            }
        }
    }

    /**
     * Load stylesheet from external CSS file
     */
    async loadStyleSheet(name, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            let cssText = await response.text();

            // Check if Vite wrapped the CSS in JavaScript
            if (cssText.includes('__vite__css')) {
                // Extract CSS from Vite's JavaScript wrapper - handle multiline
                // Use a more robust regex that captures everything between quotes including newlines
                const match = cssText.match(/const __vite__css = "((?:[^"\\]|\\.)*)"/);
                if (match) {
                    // Unescape the CSS string (Vite escapes it)
                    cssText = match[1]
                        .replace(/\\n/g, '\n')
                        .replace(/\\r/g, '\r')
                        .replace(/\\t/g, '\t')
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\');
                    // Only log Vite extraction if debugging this component
                    const urlParams = new URLSearchParams(window.location.search);
                    const debugComponent = urlParams.get('debug');

                    if (debugComponent === name || debugComponent === 'all') {
                        this.logger.debug(`Extracted CSS from Vite wrapper for ${name} (${cssText.length} chars)`);
                        // Check if keyframes made it through
                        const keyframeCount = (cssText.match(/@keyframes/g) || []).length;
                        this.logger.debug(`Found ${keyframeCount} @keyframes rules in extracted CSS`);
                    }
                }
            }

            // Conditionally log based on debug param
            const urlParams = new URLSearchParams(window.location.search);
            const debugComponent = urlParams.get('debug');

            if (debugComponent === name || debugComponent === 'all') {
                this.logger.info(`Loaded stylesheet ${name} from ${url} (${cssText.length} bytes)`);
            }
            return await this.createStyleSheet(name, cssText);
        } catch (error) {
            this.logger.error(`Failed to load stylesheet ${name} from ${url}:`, error);
            return await this.createStyleSheet(name, '');
        }
    }

    /**
     * Get stylesheets for a component
     * Returns array of CSSStyleSheet objects to adopt
     */
    getComponentStyleSheets(componentName) {
        const sheets = [];

        // Always include theme sheet first
        if (this.themeSheet) {
            sheets.push(this.themeSheet);
        }

        // Add component-specific sheet
        const componentSheet = this.styleSheets.get(componentName);
        if (componentSheet) {
            sheets.push(componentSheet);
        }

        return sheets;
    }

    /**
     * Load all component stylesheets
     * These are created from existing CSS files or inline styles
     */
    async loadComponentStyles() {
        // CRITICAL: Load all component styles SYNCHRONOUSLY to avoid timing issues
        // Use embedded CSS instead of external files for immediate availability

        // Load all stylesheets in PARALLEL for speed
        const stylePromises = [
            this.loadStyleSheet('TPanel', '/css/components/t-pnl.css'),
            this.loadStyleSheet('TButton', '/css/components/t-btn.css'),
            this.loadStyleSheet('TInput', '/css/components/t-inp.css'),
            this.loadStyleSheet('TToggle', '/css/components/t-tog.css'),
            this.loadStyleSheet('TSlider', '/css/components/t-sld.css'),
            this.loadStyleSheet('TDropdown', '/css/components/t-drp.css'),
            this.loadStyleSheet('TColorPicker', '/css/components/t-clr.css'),
            this.loadStyleSheet('TStatusBar', '/css/components/t-sta.css'),
            this.loadStyleSheet('TLoader', '/css/components/t-ldr.css'),
            this.loadStyleSheet('TModal', '/css/components/t-mdl.css'),
            this.loadStyleSheet('TToast', '/css/components/t-tst.css'),
            this.loadStyleSheet('TTreeView', '/css/components/t-tre.css'),
            this.loadStyleSheet('TDynamicControls', '/css/components/t-dyn.css'),
            this.loadStyleSheet('TUserMenu', '/css/components/t-usr.css'),
            this.loadStyleSheet('TTextarea', '/css/components/t-inp.css')  // Shares input styles
        ];

        // Wait for ALL styles to load
        await Promise.all(stylePromises);

        // Count loaded stylesheets for summary
        const loadedCount = this.styleSheets.size;
        this.logger.info(`Loaded ${loadedCount} component stylesheets successfully`);

        // CRITICAL: Force all existing components to re-adopt styles
        // This handles components that were created before styles loaded
        this.updateAllComponents();
    }

    /**
     * Force all existing components to re-adopt stylesheets
     * This fixes timing issues where components were created before styles loaded
     */
    updateAllComponents() {
        // Find all custom elements that extend TComponent
        const allElements = document.querySelectorAll('*');
        let updated = 0;

        allElements.forEach(element => {
            // Check if it's a custom element (has hyphen in tag name)
            if (element.tagName.includes('-')) {
                // Check if it has shadowRoot (our components)
                if (element.shadowRoot) {
                    const componentName = element.constructor.name;

                    // CRITICAL: Skip Lit components (they manage their own styles)
                    // Lit components have constructor that extends LitElement
                    // Check for Lit-specific properties to detect them
                    if (element.constructor.elementStyles ||
                        element.constructor._styles ||
                        componentName.endsWith('Lit') ||
                        element.constructor.toString().includes('LitElement')) {
                        this.logger.debug(`Skipping Lit component: ${element.tagName} (${componentName})`);
                        return;
                    }

                    this.logger.debug(`Updating component: ${element.tagName}, constructor: ${componentName}`);
                    const sheets = this.getComponentStyleSheets(componentName);
                    this.logger.debug(`Found ${sheets.length} sheets for ${componentName}`);
                    if (sheets.length > 0) {
                        element.shadowRoot.adoptedStyleSheets = sheets;
                        updated++;
                    }
                }
            }
        });

        this.logger.debug(`Updated ${updated} components with stylesheets`);
    }

    /**
     * Update a stylesheet dynamically
     * This will update ALL components using this stylesheet immediately
     */
    async updateStyleSheet(name, cssText) {
        const sheet = this.styleSheets.get(name);
        if (sheet) {
            await sheet.replace(cssText);
            this.logger.info(`Updated stylesheet: ${name}`);
        } else {
            await this.createStyleSheet(name, cssText);
        }
    }

    /**
     * Add rules to an existing stylesheet
     */
    addRules(name, rules) {
        const sheet = this.styleSheets.get(name);
        if (sheet) {
            rules.forEach(rule => {
                try {
                    sheet.insertRule(rule, sheet.cssRules.length);
                } catch (error) {
                    this.logger.error(`Failed to insert rule: ${rule}`, error);
                }
            });
        }
    }
}

// Create singleton instance
const styleSheetManager = new StyleSheetManager();

// CRITICAL: Block component loading until styles are ready
// This ensures NO timing issues
let initPromise = null;

if (typeof window !== 'undefined') {
    // Start initialization immediately
    initPromise = styleSheetManager.init();
}

// Export a promise that resolves when ready
export const stylesReady = initPromise || Promise.resolve();

// Export the manager
export { styleSheetManager };