# DSD CSS Strategy - Preventing Style Drift

## The Problem
CSS in DSD templates could drift out of sync with your component stylesheets, causing inconsistencies.

## The Recommended Solution: One Source, Two Paths

### Principle: Write Once, Use Appropriately

```
                    ┌─────────────────┐
                    │ button.css      │
                    │ (Single Source) │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
          Build Time                 Runtime Only
                │                         │
    ┌───────────▼──────────┐   ┌─────────▼──────────┐
    │   DSD Template       │   │ adoptedStyleSheets │
    │   (Inline <style>)   │   │ (Dynamic Creation) │
    └──────────────────────┘   └────────────────────┘
```

### Implementation

#### 1. Your Source CSS File
```css
/* /css/components/button.css */

/* Critical Styles (needed for FOUC prevention) */
:host {
  display: inline-block;
}

button {
  position: relative;
  padding: 0.5em 1em;
  background: var(--btn-bg, #00ff00);
  color: var(--btn-color, #000);
  border: 1px solid currentColor;
  cursor: pointer;
  font-family: var(--font-mono);
}

:host([variant="danger"]) button {
  background: #ff0000;
  color: #fff;
  border-color: #ff0000;
}

:host([disabled]) button {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Enhancement Styles (can load async) */
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,255,0,0.3);
}

button:active:not(:disabled) {
  transform: translateY(0);
}
```

#### 2. Build-Time DSD Generation
```javascript
// vite-plugin-dsd.js
import fs from 'fs/promises';
import postcss from 'postcss';

async function generateDSDTemplate(componentName) {
  // Read the SINGLE SOURCE CSS
  const cssPath = `/css/components/${componentName}.css`;
  const cssContent = await fs.readFile(cssPath, 'utf-8');

  // Option A: Include all CSS (simplest, recommended)
  const dsdCSS = cssContent;

  // Option B: Extract only critical (if you want to optimize)
  // const dsdCSS = await extractCriticalCSS(cssContent);

  return `<template shadowrootmode="open">
    <style>${dsdCSS}</style>
    ${getComponentHTML(componentName)}
  </template>`;
}
```

#### 3. Component Implementation
```javascript
export class TButton extends HTMLElement {
  // Store whether we're using DSD or dynamic
  #renderMode = null;

  constructor() {
    super();

    if (this.shadowRoot) {
      // DSD path - styles already loaded
      this.#renderMode = 'dsd';
      this.#hydrate();
    } else {
      // Dynamic path - need to load styles
      this.#renderMode = 'dynamic';
      this.attachShadow({ mode: 'open' });
      this.#render();
    }
  }

  async #render() {
    // Only for dynamic creation
    this.shadowRoot.innerHTML = `
      <button><slot></slot></button>
    `;

    // Load the SAME CSS dynamically
    const styles = await this.#loadStyles();
    this.shadowRoot.adoptedStyleSheets = [styles];

    this.#attachListeners();
  }

  #hydrate() {
    // For DSD - styles already there, just add behavior
    this.#attachListeners();

    // DO NOT add adoptedStyleSheets here!
    // Trust the DSD styles completely
  }

  async #loadStyles() {
    // Cache this at the module level in production
    if (!TButton.styleSheet) {
      TButton.styleSheet = new CSSStyleSheet();

      // In dev: fetch the file
      const response = await fetch('/css/components/button.css');
      const css = await response.text();

      // In prod: this could be inlined by build tool
      await TButton.styleSheet.replace(css);
    }
    return TButton.styleSheet;
  }
}
```

## The Key Rules

### ✅ DO:
1. **Single CSS source file** per component
2. **Build process reads** that file for DSD templates
3. **Dynamic components load** the same file
4. **Cache stylesheets** at module level
5. **Use CSS custom properties** for theming

### ❌ DON'T:
1. **Don't maintain two versions** of component CSS
2. **Don't mix DSD and adoptedStyleSheets** on same instance
3. **Don't manually sync** styles between files
4. **Don't use cascade layers** if you're keeping paths separate

## Decision Tree

```
Is this a static HTML page?
    YES → Use DSD with full inline styles
    NO ↓

Is this component created dynamically?
    YES → Use adoptedStyleSheets only
    NO ↓

Is DSD support critical?
    YES → Use DSD, skip adoptedStyleSheets entirely
    NO → Use progressive enhancement
```

## Testing for Drift

```javascript
// Add this to your test suite
function testStyleConsistency() {
  // Create component with DSD
  const dsdComponent = document.querySelector('t-btn[data-dsd]');

  // Create component dynamically
  const dynamicComponent = document.createElement('t-btn');
  document.body.append(dynamicComponent);

  // Compare computed styles
  const dsdStyles = getComputedStyle(
    dsdComponent.shadowRoot.querySelector('button')
  );
  const dynamicStyles = getComputedStyle(
    dynamicComponent.shadowRoot.querySelector('button')
  );

  // They should match!
  console.assert(
    dsdStyles.backgroundColor === dynamicStyles.backgroundColor,
    'Style drift detected!'
  );
}
```

## Recommendation for Terminal Kit

Given your architecture, I recommend:

1. **Single CSS file** per component
2. **DSD templates include ALL styles** (no layers needed)
3. **Dynamic components use adoptedStyleSheets** with same CSS
4. **Never mix both** on the same instance
5. **Build process ensures** sync by reading single source

This eliminates drift while keeping the implementation simple and maintainable.