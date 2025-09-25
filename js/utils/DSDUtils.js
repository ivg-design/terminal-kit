/**
 * Declarative Shadow DOM (DSD) Utilities
 * Provides detection, polyfill, and hydration support for DSD components
 * to eliminate FOUC (Flash of Unstyled Content)
 */

import componentLogger from './ComponentLogger.js';
const log = componentLogger.for('DSDUtils');

/**
 * Check if the browser supports Declarative Shadow DOM
 * @returns {boolean} True if DSD is supported natively
 */
export function supportsDSD() {
    try {
        const div = document.createElement('div');
        div.innerHTML = '<div><template shadowrootmode="open"></template></div>';
        return !!div.firstElementChild?.shadowRoot;
    } catch (e) {
        return false;
    }
}

/**
 * Polyfill for Declarative Shadow DOM
 * Converts <template shadowrootmode="open|closed"> elements to actual shadow DOM
 * @param {Element} root - Root element to scan for DSD templates (default: document)
 */
export function polyfillDSD(root = document) {
    if (supportsDSD()) {
        log.debug('Native DSD support detected, skipping polyfill');
        return; // Native support available, no polyfill needed
    }

    // Find all template elements with shadowrootmode attribute
    const templates = root.querySelectorAll('template[shadowrootmode]');

    if (templates.length > 0) {
        log.info(`Polyfilling ${templates.length} DSD templates`);
    }

    templates.forEach(template => {
        const mode = template.getAttribute('shadowrootmode');
        const parent = template.parentElement;

        if (parent && (mode === 'open' || mode === 'closed')) {
            // Create shadow root
            const shadowRoot = parent.attachShadow({ mode });

            // Move template content to shadow root
            shadowRoot.appendChild(template.content.cloneNode(true));

            // Remove the template element
            template.remove();

            log.debug(`Polyfilled DSD for ${parent.tagName}`, {
                mode,
                id: parent.id || 'unnamed'
            });
        }
    });
}

/**
 * Initialize DSD polyfill when DOM is ready
 */
export function initDSDPolyfill() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => polyfillDSD());
    } else {
        polyfillDSD();
    }
}

/**
 * Generate DSD template HTML for a component
 * @param {string} componentTag - The custom element tag name
 * @param {string} shadowContent - HTML content for the shadow DOM
 * @param {Object} attributes - Attributes to set on the component element
 * @returns {string} Complete HTML with DSD template
 */
export function generateDSDTemplate(componentTag, shadowContent, attributes = {}) {
    const attrs = Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    return `
        <${componentTag}${attrs ? ' ' + attrs : ''}>
            <template shadowrootmode="open">
                ${shadowContent}
            </template>
        </${componentTag}>
    `;
}

/**
 * Utility to check if an element has a shadow root from DSD
 * @param {Element} element - The element to check
 * @returns {boolean} True if element has a shadow root (likely from DSD)
 */
export function hasDSDShadowRoot(element) {
    return !!element.shadowRoot;
}

/**
 * Extract template content from a DSD component for server-side generation
 * @param {string} componentClass - Component class name for identification
 * @param {Object} props - Component properties/state
 * @param {Function} templateFunction - Function that generates template HTML
 * @returns {string} Template content ready for DSD
 */
export function extractTemplateForDSD(componentClass, props, templateFunction) {
    try {
        // Create a temporary instance to generate template
        return templateFunction.call({ _props: props, getProp: (name) => props[name] });
    } catch (e) {
        console.warn(`Failed to extract template for ${componentClass}:`, e);
        return '';
    }
}

/**
 * DSD-aware component initialization
 * Call this in component constructor to handle both DSD and regular initialization
 * @param {HTMLElement} component - The component instance
 * @param {Function} initCallback - Function to call after DSD detection
 */
export function initializeDSDComponent(component, initCallback) {
    // Check if we already have a shadow root from DSD
    let isDSD = !!component.shadowRoot;

    // If no shadow root, check for DSD template that needs polyfilling
    if (!isDSD) {
        const template = component.querySelector('template[shadowrootmode]');
        if (template) {
            // Try to apply polyfill for this specific component
            const mode = template.getAttribute('shadowrootmode');
            if (mode && !component.shadowRoot) {
                try {
                    const shadowRoot = component.attachShadow({ mode });
                    shadowRoot.appendChild(template.content.cloneNode(true));
                    template.remove();
                    isDSD = true;
                    log.debug(`Applied DSD polyfill for ${component.tagName}`);
                } catch (error) {
                    log.error('Failed to apply DSD polyfill:', error);
                }
            }
        }
    }

    // Store DSD state and render mode for later use
    component._isDSD = isDSD;
    component._renderMode = isDSD ? 'dsd' : 'dynamic';

    // Call initialization callback with DSD information
    if (initCallback) {
        initCallback(isDSD);
    }

    return isDSD;
}

/**
 * Hydrate event listeners and interactive elements for DSD components
 * @param {HTMLElement} component - The component instance
 * @param {Function} hydrateCallback - Function to call for hydration
 */
export function hydrateDSDComponent(component, hydrateCallback) {
    if (component._isDSD && hydrateCallback) {
        // Component was server-rendered with DSD, needs hydration
        hydrateCallback();
    }
}

/**
 * Global DSD initialization - call this once when your app starts
 * Sets up polyfill and any global DSD configuration
 */
export function setupDSD() {
    // Initialize polyfill
    initDSDPolyfill();

    // Add global DSD indicator for debugging
    const hasNativeSupport = supportsDSD();
    if (!hasNativeSupport) {
        document.documentElement.setAttribute('data-dsd-polyfilled', 'true');
        log.info('DSD Support: Polyfilled');
    } else {
        document.documentElement.setAttribute('data-dsd-native', 'true');
        log.info('DSD Support: Native');
    }
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
    setupDSD();
}