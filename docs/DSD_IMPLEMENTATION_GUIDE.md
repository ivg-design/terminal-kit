# Ultimate DSD Implementation Guide for Terminal Kit

## Core Principles

1. **One generic template per component type** with all variants handled via `:host()` selectors
2. **Hybrid styling approach**: Inline critical CSS + optional cached stylesheets
3. **Simple detection**: Just check `this.shadowRoot`
4. **Cascade layers** to manage style priority
5. **Proper APIs** for runtime HTML injection

## 1. Template Structure

### The Perfect DSD Template

```html
<t-btn variant="danger">
  <template shadowrootmode="open">
    <style>
      /* Define layer order - DSD wins over runtime styles */
      @layer runtime, dsd;

      @layer dsd {
        /* Critical inline styles for zero FOUC */
        :host {
          display: inline-block;
        }

        /* Base styles */
        :host button {
          padding: 0.5em 1em;
          border: 1px solid currentColor;
          cursor: pointer;
          font-family: var(--font-mono);
          transition: all 0.2s;
        }

        /* All variants via :host() selectors */
        :host([variant="primary"]) button {
          background: var(--color-primary);
          color: var(--color-black);
        }

        :host([variant="danger"]) button {
          background: var(--color-danger);
          color: var(--color-white);
        }

        :host([disabled]) button {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    </style>

    <!-- Optional: Link for non-critical/shared styles -->
    <link rel="stylesheet" href="/css/components/animations.css">

    <!-- Minimal structural HTML -->
    <button part="button" type="button">
      <slot></slot>
    </button>
  </template>
  Delete
</t-btn>
```

### Key Rules

- **NO WHITESPACE** before `<template>` tag
- **NO variant classes** in HTML (only structural)
- **Use CSS custom properties** for theming
- **Use `part` attribute** for external styling

## 2. Component Implementation

### The Perfect Component Class

```javascript
export class TButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'disabled'];
  }

  constructor() {
    super();

    // Simple DSD detection - that's it!
    const hasDSD = !!this.shadowRoot;

    if (hasDSD) {
      // DSD exists - just hydrate (add interactivity)
      this.#hydrate();
    } else {
      // No DSD - create shadow root and render
      this.attachShadow({ mode: 'open' });
      this.#render();
    }
  }

  #render() {
    // Only called for non-DSD (dynamic creation, older browsers)
    this.shadowRoot.innerHTML = `
      <style>
        @layer runtime, dsd;
        @layer dsd {
          /* Same styles as DSD template */
        }
      </style>
      <button part="button"><slot></slot></button>
    `;

    // Optional: Add runtime styles in lower priority layer
    if (window.sharedStyles) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`@layer runtime { ${window.sharedStyles} }`);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    this.#attachListeners();
  }

  #hydrate() {
    // Just add behavior, don't touch styles or structure!
    this.#attachListeners();

    // Log for debugging
    console.log(`[${this.tagName}] Hydrated with DSD ✓`);
  }

  #attachListeners() {
    const button = this.shadowRoot.querySelector('button');
    button?.addEventListener('click', this.#handleClick);
  }

  #handleClick = (e) => {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('t-click', {
      detail: { variant: this.variant },
      bubbles: true,
      composed: true
    }));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // CSS handles visual changes via :host() selectors
    // Only handle behavioral changes here
    if (name === 'disabled' && this.shadowRoot) {
      const button = this.shadowRoot.querySelector('button');
      if (button) {
        button.disabled = newValue !== null;
      }
    }
  }
}

customElements.define('t-btn', TButton);
```

## 3. Build Process (Vite Plugin)

### The Perfect Vite Plugin

```javascript
// vite-plugin-dsd.js
import fs from 'node:fs/promises';
import path from 'node:path';

const templateCache = new Map();
const cssCache = new Map();

async function loadComponentCSS(componentName) {
  if (!cssCache.has(componentName)) {
    const cssPath = path.join('src/styles/components', `${componentName}.css`);
    try {
      const css = await fs.readFile(cssPath, 'utf-8');
      cssCache.set(componentName, css);
    } catch {
      cssCache.set(componentName, '');
    }
  }
  return cssCache.get(componentName);
}

async function generateDSDTemplate(tagName) {
  if (templateCache.has(tagName)) {
    return templateCache.get(tagName);
  }

  const componentName = tagName.replace('t-', '');
  const css = await loadComponentCSS(componentName);

  // Critical CSS inline, optional link for animations
  const template = `<template shadowrootmode="open">
    <style>
      @layer runtime, dsd;
      @layer dsd {
        ${css}
      }
    </style>
    ${componentName === 'btn' ? '<button part="button"><slot></slot></button>' : ''}
    ${componentName === 'panel' ? '<div part="panel"><slot name="header"></slot><slot></slot></div>' : ''}
  </template>`;

  templateCache.set(tagName, template);
  return template;
}

export function viteDSDPlugin(options = {}) {
  return {
    name: 'vite-plugin-dsd',
    enforce: 'pre',

    async transformIndexHtml(html, ctx) {
      // Find all custom elements
      const componentRegex = /<(t-[a-z-]+)(?:\s[^>]*)?>/gi;
      const components = new Set();
      let match;

      while ((match = componentRegex.exec(html)) !== null) {
        components.add(match[1]);
      }

      // Generate and inject templates
      let transformedHtml = html;
      for (const tagName of components) {
        const template = await generateDSDTemplate(tagName);

        // CRITICAL: No whitespace between > and <template
        const regex = new RegExp(`(<${tagName}(?:\\s[^>]*)?>)`, 'gi');
        transformedHtml = transformedHtml.replace(regex, `$1${template}`);
      }

      // Add polyfill detection and CSS hiding rule
      const tags = [
        {
          tag: 'style',
          children: `
            /* Hide unupgraded custom elements to prevent FOUC */
            t-btn:not(:defined),
            t-panel:not(:defined) {
              opacity: 0;
            }

            /* Hide non-shadow content in polyfilled browsers */
            t-btn:not(:defined) > template[shadowrootmode] ~ *,
            t-panel:not(:defined) > template[shadowrootmode] ~ * {
              display: none;
            }
          `,
          injectTo: 'head'
        },
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: `
            // Polyfill for browsers without DSD support
            if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
              console.warn('Browser lacks native DSD support, loading polyfill...');
              import('/vendor/dsd-polyfill.min.js').then(() => {
                // Polyfill processes existing templates
                document.querySelectorAll('template[shadowrootmode]').forEach(template => {
                  const mode = template.getAttribute('shadowrootmode');
                  const host = template.parentElement;
                  if (host && !host.shadowRoot) {
                    const shadowRoot = host.attachShadow({ mode });
                    shadowRoot.innerHTML = template.innerHTML;
                    template.remove();
                  }
                });
              });
            }
          `,
          injectTo: 'head'
        }
      ];

      // Add preload hints for external stylesheets if used
      if (options.useExternalStyles) {
        tags.push({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'style',
            href: '/css/components/animations.css'
          },
          injectTo: 'head'
        });
      }

      return { html: transformedHtml, tags };
    },

    async handleHotUpdate({ file, server }) {
      // Clear caches on component file changes
      if (file.includes('/components/') || file.includes('/styles/')) {
        templateCache.clear();
        cssCache.clear();

        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    }
  };
}
```

## 4. Runtime HTML Injection

### CRITICAL: Use the Correct APIs

```javascript
// ❌ WRONG - DSD templates won't be parsed
element.innerHTML = htmlWithDSD;
element.insertAdjacentHTML('beforeend', htmlWithDSD);

// ✅ CORRECT - DSD templates will be parsed
element.setHTMLUnsafe(htmlWithDSD);

// ✅ CORRECT - For creating new documents
const doc = Document.parseHTMLUnsafe(htmlWithDSD);
element.append(...doc.body.children);
```

## 5. Style Management Strategy

### The Cascade Layer Approach

```css
/* In DSD template - define layer order */
@layer runtime, theme, dsd;

/* DSD styles - highest priority */
@layer dsd {
  :host button {
    background: var(--btn-bg, #00ff00);
    color: var(--btn-color, #000);
  }
}

/* Theme overrides - medium priority */
@layer theme {
  :host([theme="dark"]) {
    --btn-bg: #333;
    --btn-color: #fff;
  }
}

/* Runtime styles - lowest priority */
@layer runtime {
  /* Dynamic styles added via adoptedStyleSheets */
}
```

## 6. Browser Support & Polyfilling

### Detection & Fallback

```javascript
// Proper feature detection
const supportsDSD = HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode');

// Alternative functional test
function testDSDSupport() {
  const div = document.createElement('div');
  div.innerHTML = '<div><template shadowrootmode="open"></template></div>';
  return !!div.firstElementChild?.shadowRoot;
}

// Apply polyfill only when needed
if (!supportsDSD) {
  import('/vendor/dsd-polyfill.js').then(({ polyfillDSD }) => {
    polyfillDSD();

    // Watch for dynamic content
    const observer = new MutationObserver(polyfillDSD);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}
```

## 7. Testing & Debugging

### DSD Health Check

```javascript
function checkDSDHealth() {
  const components = document.querySelectorAll('t-btn, t-panel');
  const stats = {
    total: components.length,
    withDSD: 0,
    withoutDSD: 0,
    errors: []
  };

  components.forEach(el => {
    if (el.shadowRoot) {
      stats.withDSD++;

      // Check for style conflicts
      const sheets = el.shadowRoot.adoptedStyleSheets;
      if (sheets.length > 0 && el.hasAttribute('data-dsd')) {
        stats.errors.push(`${el.tagName} has both DSD and adoptedStyleSheets`);
      }
    } else {
      stats.withoutDSD++;
    }
  });

  console.table(stats);
  return stats;
}
```

## 8. Migration Checklist

- [ ] Remove all variant-specific classes from templates
- [ ] Convert all variant styles to `:host()` selectors
- [ ] Add cascade layers to manage style priority
- [ ] Replace `innerHTML` with `setHTMLUnsafe()` for runtime injection
- [ ] Add `:not(:defined)` CSS to hide unupgraded elements
- [ ] Implement simple `this.shadowRoot` check in constructors
- [ ] Remove adoptedStyleSheets for DSD components (or use layers)
- [ ] Ensure no whitespace before `<template>` tags
- [ ] Add polyfill with proper feature detection
- [ ] Test with browser DevTools network throttling to verify no FOUC

## 9. Common Pitfalls to Avoid

1. **Don't mix DSD with adoptedStyleSheets** without cascade layers
2. **Don't use innerHTML** for runtime DSD injection
3. **Don't add whitespace** before `<template shadowrootmode>`
4. **Don't re-render** when hydrating DSD components
5. **Don't bake variant classes** into templates
6. **Don't forget the polyfill** for older browsers
7. **Don't use complex DSD detection** - just check `this.shadowRoot`

## 10. Performance Tips

- **Inline critical CSS** (layout, colors) in DSD template
- **Use `<link>` for non-critical CSS** (animations, icons)
- **Preload external stylesheets** from `<head>`
- **Cache templates** during build, regenerate only on change
- **Use CSS custom properties** for runtime theming
- **Minimize template HTML** - structural only

---

This guide synthesizes the best practices from all approaches into a production-ready DSD implementation that eliminates FOUC while maintaining performance and developer experience.