RESPONSE 1

The core principle is to **generate one generic DSD template per component at build time**. This template should contain an inline `<style>` tag with all possible variant styles defined using `:host()` attribute selectors. Your component's JavaScript should then simply detect and "hydrate" this pre-existing shadow root, attaching event listeners without re-rendering.

-----

## 1\. Template Generation: One Generic Template

You should generate **one generic template per component type**. Creating separate templates for each variant is not scalable and defeats the purpose of CSS.

The correct approach is to use the `:host()` pseudo-class with attribute selectors in your CSS. This allows a single stylesheet to contain the logic for all visual variants. The browser's CSS engine is highly optimized to apply the correct style based on the element's current attributes.

**Example CSS for `<t-btn>`:**

```css
/* Base styles */
:host button {
  border: 1px solid #ccc;
  padding: 8px 16px;
  border-radius: 4px;
}

/* Variant styles */
:host([variant="danger"]) button {
  background: red;
  color: white;
  border-color: darkred;
}

:host([variant="primary"]) button {
  background: blue;
  color: white;
  border-color: darkblue;
}

:host([disabled]) button {
  opacity: 0.5;
  cursor: not-allowed;
}
```

This single block of CSS can be embedded in your DSD template and will correctly style `<t-btn>`, `<t-btn variant="danger">`, and `<t-btn variant="primary" disabled">` without any changes to the template itself.

-----

## 2\. Style Inclusion: Inline `<style>` Tags

For DSD, you must use inline **`<style>` tags** inside the `<template>`.

  * **Inline `<style>` Tags:** This is the **only way to prevent FOUC**. The CSS is part of the initial HTML document parsed by the browser. The styles are applied the moment the element is rendered, even before any JavaScript has been downloaded or executed.
  * **`<link rel="stylesheet">`:** This approach **re-introduces FOUC**. The browser would have to make a separate network request to fetch the CSS file. While the DSD shadow root would be attached, it would be unstyled until that external file is downloaded and parsed, defeating the primary goal of DSD.

**Performance & Caching:** While inline styles increase the size of the initial HTML payload and cannot be cached separately like external files, this is the necessary trade-off to eliminate FOUC. For component-level CSS, the size increase is often negligible and well worth the improved user experience.

-----

## 3\. Component Detection: Check `this.shadowRoot`

The correct and simplest way for a component to detect a pre-existing DSD shadow root is to check for `this.shadowRoot` in its **`constructor`**.

When the browser parses HTML containing a `<template shadowrootmode="...">`, it automatically creates and attaches the shadow root to the host element *before* upgrading the element and running its `constructor`.

```javascript
// t-btn.js
class TButton extends HTMLElement {
  constructor() {
    super();

    // DSD check: If the browser created the shadow root, this will already exist.
    if (this.shadowRoot) {
      // The shadow root already exists and is styled.
      // This is the "hydration" step. We just need to attach listeners.
      console.log('Hydrating existing Declarative Shadow Root.');
    } else {
      // Fallback for older browsers or dynamic creation.
      // This is the progressive enhancement step.
      console.log('Creating Shadow Root imperatively.');
      this.attachShadow({ mode: 'open' });
      // ...append styles and template content here...
    }

    // You can now safely query the shadow root for elements.
    this._button = this.shadowRoot.querySelector('button');
  }

  connectedCallback() {
    // Attach event listeners here.
    if (this._button) {
      this._button.addEventListener('click', this._handleClick);
    }
  }

  // ... other lifecycle methods and event handlers
}

customElements.define('t-btn', TButton);
```

-----

## 4\. Style Conflicts: Use DSD for Initial Paint

DSD's inline styles and `adoptedStyleSheets` are **complementary, not mutually exclusive**.

  * **DSD `<style>`:** Provides the critical, blocking styles needed for the **initial paint** to prevent FOUC.
  * **`adoptedStyleSheets`:** Can be used **after hydration** to dynamically add or update styles, such as for theme changes.

Your current issue where `adoptedStyleSheets` overrides DSD styles is likely because your component logic is unconditionally replacing the sheet array.

**Incorrect (Causes FOUC):**

```javascript
// This REPLACES all existing styles, including the DSD ones.
this.shadowRoot.adoptedStyleSheets = [myComponentStyles];
```

**Correct (Preserves DSD styles):**
Your component doesn't need to adopt its own base stylesheet if it was already provided by DSD. The inline `<style>` tag handles it. If you need to add *shared* styles later, you would append them:

```javascript
// In connectedCallback, after hydrating...
// `sharedThemeStyles` would be a CSSStyleSheet object defined elsewhere.
this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, sharedThemeStyles];
```

-----

## 5\. Build Process: Vite Plugin Strategy

For a Vite plugin, you need to transform the final HTML to inject the DSD templates.

  * **Generation Timing:** Templates should be generated **once at build start** and then cached. In development (`serve` mode), you should watch the source files (e.g., `t-btn.css`, `t-btn.html`) and regenerate the specific template only when a file changes.
  * **Node.js vs. Browser APIs:** Your Vite plugin runs in a Node.js environment. You cannot use browser APIs. The process should be simple string manipulation or using a Node-based HTML parser like `cheerio`.

### Solving Your "DSD Not Parsed" Warning

The browser warning `"Found declarative shadowrootmode attribute but declarative Shadow DOM is not being parsed"` almost always means the `<template>` is not the **very first thing** inside its parent custom element. Even whitespace or a comment can break it.

**Incorrect HTML (will fail):**

```html
<t-btn variant="danger">
  <template shadowrootmode="open">...</template>
  Delete
</t-btn>
```

**Correct HTML:**

```html
<t-btn variant="danger"><template shadowrootmode="open">...</template>Delete</t-btn>
```

Your build process must ensure this exact structure.

### Conceptual Vite Plugin

Here is a simplified conceptual approach for a Vite plugin:

```javascript
// vite-dsd-plugin.js
import { promises as fs } from 'fs';
import path from 'path';

// A cache to store generated DSD templates
const templateCache = new Map();

async function getDsdTemplate(componentName) {
  if (templateCache.has(componentName)) {
    return templateCache.get(componentName);
  }

  try {
    const cssPath = path.join('src/components', componentName, `${componentName}.css`);
    const htmlPath = path.join('src/components', componentName, `${componentName}.html`);

    const cssContent = await fs.readFile(cssPath, 'utf-8');
    const htmlContent = await fs.readFile(htmlPath, 'utf-8');

    const template = `<template shadowrootmode="open"><style>${cssContent}</style>${htmlContent}</template>`;
    templateCache.set(componentName, template);
    return template;
  } catch (e) {
    return null; // Component doesn't have a template
  }
}

export function dsdPlugin() {
  return {
    name: 'vite-plugin-dsd',
    async transformIndexHtml(html) {
      let transformedHtml = html;
      const componentTags = html.match(/<t-[\w-]+/g) || [];
      const uniqueTags = [...new Set(componentTags.map(tag => tag.substring(1)))];

      for (const tagName of uniqueTags) {
        const dsdTemplate = await getDsdTemplate(tagName);
        if (dsdTemplate) {
          // Regex to inject the template right after the opening tag
          // of all instances of this component.
          const regex = new RegExp(`(<${tagName}[^>]*>)`, 'g');
          transformedHtml = transformedHtml.replace(regex, `$1${dsdTemplate}`);
        }
      }
      return transformedHtml;
    },
  };
}
```


RESPONSE 2
Declarative Shadow DOM (DSD) for zero-FOUC web components — the sane, standards-compliant path

Here’s the blunt version: ship one generic DSD template per component, put real CSS inside that template (not adoptedStyleSheets), hydrate by detecting the already-attached shadow root, and only fall back to adoptedStyleSheets when you do not have DSD. If you inject HTML at runtime, don’t use innerHTML; use the new setHTMLUnsafe()/parseHTMLUnsafe() or you’ll get the “DSD isn’t being parsed” warning forever.

Below are direct answers + a reference implementation you can drop into your library.

⸻

Answers to your specific questions
	1.	Template generation
Use one generic template per component type. Put all variant logic in CSS with :host([variant="..."]), not baked classes. That satisfies your “single template” constraint, avoids branching at build time, and keeps hydration trivial. Firefox/Chromium/WebKit all parse <template shadowrootmode="open"> at HTML-parse time, so the shadow root will exist before your element upgrades.
	2.	Style inclusion strategy (and caching/perf)

	•	If your top priority is “no-JS baseline, no flash,” inline a <style> inside the DSD. That’s render-blocking for the shadow tree and gives you instant paint with zero extra round trips.
	•	If you want caching across many instances, you can put <link rel="stylesheet"> inside the shadow root; it will HTTP-cache and reuse between instances. Preload it from <head> to reduce the first-paint risk:
<link rel="preload" as="style" href="/assets/t-btn.css">.

Opinionated guidance: for components like buttons/panels, inline a small “critical” CSS layer in the template and optionally also include a <link> to the full sheet for larger rules (icons, animations). That gives you reliable first paint plus caching on subsequent pages.
	3.	Component detection for DSD hydration
Don’t invent flags. If a DSD template was parsed, the element already has a shadow root at upgrade time. In your constructor:

const sr = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
// If DSD existed, don't re-render or restyle.

No ElementInternals needed; that’s for form/ARIA internals. No data-* marker either. Chromium’s compat note matches this behavior for upgraded custom elements.
	4.	Style conflicts (DSD vs adoptedStyleSheets)
They’re not mutually exclusive, but be careful: adopted stylesheets are ordered after other sheets in the same root, so with equal specificity they win and can cause a “flash” when JS boots. If you ship a DSD <style> as the truth, don’t adopt another sheet on hydrate. If you must use both, fix the order with cascade layers:

/* inside the DSD <style> (parsed first) */
@layer runtime, dsd;     /* define layer order: dsd wins */
@layer dsd {
  :host([variant="danger"]) button { background: red; color: white; }
}

Then, in any runtime/adopted sheet use @layer runtime { ... }. Layer order is defined where layers are first introduced; later layers win for normal rules, earlier layers win for !important. This prevents flicker without specificity wars.
	5.	Vite build process

	•	Dev: regenerate on file change so HMR reflects CSS/markup edits.
	•	Prod: generate once at build.
Do all DSD generation in Node (Vite plugin) using strings/AST tools (e.g., PostCSS, parse5). You are not using browser APIs at build time; you’re just producing HTML strings that browsers will parse into shadow roots later.

⸻

Fix the three problems you listed
	1.	“Wrong variant classes baked in”
Remove variant classes from the template. The template should be structural only:

<template shadowrootmode="open">
  <style>
    @layer runtime, dsd;
    @layer dsd {
      :host { /* base */ }
      :host([variant="danger"]) button { background: red; color: white; }
      /* …other variants… */
    }
  </style>
  <button part="button"><slot></slot></button>
</template>

	2.	“adoptedStyleSheets are overriding inline DSD styles causing FOUC”
On upgrade, if this.shadowRoot exists (DSD present), skip adoptedStyleSheets entirely or adopt only a sheet that lives in the lower-priority @layer runtime. Also, do not re-append template content.
	3.	“Found declarative shadowrootmode attribute… DSD is not being parsed”
You are injecting HTML fragments with innerHTML (or similar). DSD is parser-only unless you opt in. Replace that with:

// Option A: set on an element
container.setHTMLUnsafe(htmlWithTemplates);

// Option B: parse a Document directly
const doc = Document.parseHTMLUnsafe(htmlWithTemplates);

Using innerHTML/insertAdjacentHTML will not attach shadow roots; setHTMLUnsafe()/parseHTMLUnsafe() (and friends) do. That warning is Chrome telling you exactly this.

⸻

Hydration pattern (no re-render, no style flash)

export class TBtn extends HTMLElement {
  static get observedAttributes() { return ['variant']; }

  constructor() {
    super();
    const hasDSD = !!this.shadowRoot;
    const sr = hasDSD ? this.shadowRoot : this.attachShadow({ mode: 'open' });

    // If no DSD (older browsers + polyfill path), attach template and styles here.
    if (!hasDSD) {
      sr.append(TBtn.template.content.cloneNode(true));
      // If you really need constructed sheets, they go in the lower layer:
      // const sheet = new CSSStyleSheet();
      // sheet.replaceSync(`@layer runtime { /* same rules */ }`);
      // sr.adoptedStyleSheets = [sheet];
    }

    // Bind events, refs, etc. Do NOT mutate styles when DSD existed.
  }

  attributeChangedCallback(name, _old, _new) {
    // CSS reacts automatically via :host([variant=…]); no DOM work needed.
  }
}
customElements.define('t-btn', TBtn);

Why this works: browsers attach the DSD shadow root during HTML parse; when your custom element upgrades, this.shadowRoot is already there. You hydrate behavior only; you don’t disturb markup/styles.

⸻

Vite plugin sketch (build-time generation)

Generate structural DSD once per component, inject into HTML, and optionally add a preload for the component CSS (if you’re using <link> in the template):

// vite.config.ts
import fs from 'node:fs';
export default {
  plugins: [{
    name: 'dsd-templates',
    enforce: 'pre',
    transformIndexHtml(html) {
      const btnCss = fs.readFileSync('dist/t-btn.css', 'utf8');
      const dsd = `
        <template shadowrootmode="open">
          <style>
            @layer runtime, dsd;
            @layer dsd {${btnCss}}
          </style>
          <button part="button"><slot></slot></button>
        </template>`;
      return {
        html: html.replaceAll(/<t-btn(\b[^>]*)?>/g, m => `${m}${dsd}`),
        tags: [
          // Polyfill for older browsers (no impact on modern):
          {
            tag: 'script',
            attrs: { type: 'module' },
            children: `
              if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
                import('/vendor/declarative-shadow-dom-polyfill.min.js');
              }
            `,
            injectTo: 'head'
          },
          // Optional: ensure fast CSS discovery if you use <link> in shadow:
          // { tag: 'link', attrs: { rel: 'preload', as: 'style', href: '/assets/t-btn.css' }, injectTo: 'head' }
        ]
      };
    },
    handleHotUpdate(ctx) {
      // Recompute the injected template on CSS/HTML change for dev.
    }
  }]
}

Polyfill reference (if you need it for legacy): mfreed7’s tiny polyfill attaches shadow roots for <template shadowrootmode> in unsupported browsers. Feature detect using the standardized shadowRootMode on HTMLTemplateElement.

⸻

A note on injecting HTML at runtime

If your app sometimes builds DOM from strings (CMS content, streaming, etc.), you must switch to the safe parsing APIs when those strings contain DSD:

// Instead of innerHTML:
el.setHTMLUnsafe(htmlWithDSD);
// Or:
const frag = document.parseHTMLUnsafe(htmlWithDSD);
el.append(frag);

Using innerHTML will preserve the <template shadowrootmode> tags and produce that exact warning you saw, because the fragment parser historically ignored DSD. The new APIs opt you in to DSD during fragment parsing.

⸻

Small guardrail to prevent FOUC on legacy

If you support old browsers with the polyfill, use the canonical “no-flash” rule that only hides children until upgrade completes:

<style>
  /* In non-DSD browsers the template remains in light DOM, so hide siblings: */
  t-btn:not(:defined) > template[shadowrootmode] ~ * { display: none; }
</style>

Modern DSD browsers remove the <template> during parse, so this rule doesn’t match and nothing is hidden.

⸻

TL;DR — the opinionated checklist
	•	One template per component. Variants via :host([variant]).
	•	Inline <style> in the DSD for the critical path; optionally also <link> for cached bulk CSS (preload it).
	•	In constructor: if this.shadowRoot exists, hydrate behavior only; do not re-render or adopt sheets.
	•	If you must keep adoptedStyleSheets, fence with cascade layers so DSD wins on first paint.
	•	Never use innerHTML to insert DSD. Use setHTMLUnsafe()/parseHTMLUnsafe(). That’s what your warning is about.
	•	Dev: regenerate on file change. Prod: once. Do all generation in Node (Vite plugin).

If you want, I can refactor one of your components (<t-btn> or <t-panel>) into this pattern right now so you can diff before/after and spot any residual flashes.