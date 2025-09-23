# BULLETPROOF COMPONENT PATTERN

## Critical Rules - NO EXCEPTIONS

### 1. StyleSheetManager Initialization
- **MUST** complete initialization BEFORE any components are created
- **MUST** load ALL stylesheets in parallel for speed
- **MUST** export a `stylesReady` promise that components can await
- **NEVER** allow components to render without styles

### 2. Component Base Class (TComponent)
- **MUST** wait for `stylesReady` before adopting stylesheets
- **MUST** use Shadow DOM for encapsulation
- **MUST** adopt stylesheets only ONCE (track with `_stylesAdopted` flag)
- **NEVER** use setTimeout/setInterval for critical initialization
- **NEVER** manipulate slots or move DOM nodes around

### 3. Component CSS Files
- **MUST** use standard selectors for shadow DOM content (`.t-btn`, etc)
- **MUST** include `:host` styles for the component element itself
- **NEVER** rely on global styles (everything is encapsulated)

### 4. Component Implementation
```javascript
export class TExample extends TComponent {
    constructor() {
        super(); // This handles Shadow DOM and style adoption

        // Initialize props SYNCHRONOUSLY
        this._props = {
            value: '',
            disabled: false
        };

        // NO setTimeout, NO requestAnimationFrame, NO async init
    }

    template() {
        // Return HTML string with proper class names
        return `<div class="t-example">${this._props.value}</div>`;
    }

    afterRender() {
        // Bind events here - DOM is guaranteed to exist
        const button = this.$('.t-example-btn');
        if (button) {
            this.addListener(button, 'click', () => this.handleClick());
        }
    }
}

// Register component SYNCHRONOUSLY
customElements.define('t-example', TExample);
```

### 5. Testing Checklist
- [ ] Component renders immediately when added to DOM
- [ ] Styles are applied without flickering
- [ ] No console errors about missing styles
- [ ] Works when dynamically created via JavaScript
- [ ] Works when parsed from HTML
- [ ] Nested components work properly
- [ ] No timing-dependent behavior

### 6. Common Mistakes to AVOID
- ❌ Using setTimeout to wait for styles
- ❌ Using requestAnimationFrame for initialization
- ❌ Loading CSS files individually in components
- ❌ Assuming parent/child render order
- ❌ Manipulating slot content directly
- ❌ Using document.querySelector for shadow DOM elements
- ❌ Relying on global CSS variables without :host

### 7. StyleSheetManager Usage

```javascript
// In StyleSheetManager.js
class StyleSheetManager {
    async init() {
        // 1. Create theme stylesheet
        this.themeSheet = await this.createStyleSheet('theme', THEME_CSS);

        // 2. Load ALL component styles in PARALLEL
        const promises = [
            this.loadStyleSheet('TButton', '/css/components/t-btn.css'),
            this.loadStyleSheet('TPanel', '/css/components/t-pnl.css'),
            // ... all other components
        ];

        await Promise.all(promises);
        this.initialized = true;
    }
}

// Export ready promise
export const stylesReady = styleSheetManager.init();
```

### 8. Component Style Adoption

```javascript
// In TComponent.js
adoptComponentStyles() {
    if (styleSheetManager.initialized) {
        this._adoptStyles();
    } else {
        stylesReady.then(() => this._adoptStyles());
    }
}

_adoptStyles() {
    if (this._stylesAdopted) return; // Only once!

    const sheets = styleSheetManager.getComponentStyleSheets(this.constructor.name);
    if (sheets.length > 0) {
        this.shadowRoot.adoptedStyleSheets = sheets;
        this._stylesAdopted = true;
    }
}
```

## Summary

This pattern GUARANTEES:
1. No timing issues
2. No style flickering
3. No race conditions
4. Consistent behavior
5. Fast performance (parallel loading, shared stylesheets)
6. Proper encapsulation (Shadow DOM)
7. No memory duplication (adoptedStyleSheets)

Follow this pattern EXACTLY for every component. NO EXCEPTIONS.