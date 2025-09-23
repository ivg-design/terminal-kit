# Component Creation Guide for Terminal Components v2

## Overview
This guide documents the **complete patterns and best practices** for creating Terminal Components using Shadow DOM with adoptedStyleSheets. Following these patterns will help avoid ALL common issues we've encountered during development.

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [Component Creation Pattern](#component-creation-pattern)
3. [Critical Patterns to Follow](#critical-patterns-to-follow)
4. [Common Issues and Solutions](#common-issues-and-solutions)
5. [Testing and Debugging](#testing-and-debugging)
6. [Component API Documentation](#component-api-documentation)
7. [Complete Checklist](#complete-checklist)

## Core Architecture

### 1. Base Class (TComponent)
All components **MUST** extend `TComponent` which provides:
- Shadow DOM initialization with `mode: 'open'`
- Props management with automatic re-rendering
- Event handling with automatic cleanup
- Lifecycle methods (connectedCallback, disconnectedCallback, afterRender)
- Style adoption via StyleSheetManager
- Utility methods: `$()` for querySelector, `$$()` for querySelectorAll

### 2. StyleSheetManager Integration
Components get their styles through the `StyleSheetManager` singleton:
- CSS files are loaded from `/css/components/`
- Styles are shared across all component instances via adoptedStyleSheets (memory efficient!)
- Animations and keyframes are preserved through proper CSS extraction from Vite
- **CRITICAL**: Vite wraps CSS in JavaScript - StyleSheetManager extracts it properly

### 3. ComponentLogger Integration
All components use the singleton ComponentLogger for debugging:
- Import: `import componentLogger from '../utils/ComponentLogger.js';`
- Create logger: `this.logger = componentLogger.for('ComponentName');`
- Use ONLY: `info()`, `debug()`, `error()`, `warn()` - **NEVER use `log()`**

## Component Creation Pattern

### File Structure
```
src-v2/
├── js/
│   └── components/
│       └── TMyComponent.js      # Component implementation
├── css/
│   └── components/
│       └── t-myc.css            # Component styles (3-letter abbreviation)
└── demos/
    └── my-component.html        # Demo page
```

### Naming Conventions
- **Class name**: `TMyComponent` (PascalCase with T prefix)
- **Element name**: `t-myc` (lowercase with t- prefix, 3-4 letter abbreviation)
- **CSS file**: `t-myc.css` (matches element name)
- **Attributes**: `attribute-name` (kebab-case)
- **Properties**: `propertyName` (camelCase)
- **Events**: `component-action` (kebab-case)

### 1. JavaScript Component File (Complete Template)

```javascript
/**
 * TMyComponent Web Component
 * Brief description of component purpose
 */

import { TComponent } from './TComponent.js';
import componentLogger from '../utils/ComponentLogger.js';

export class TMyComponent extends TComponent {
    // CRITICAL: Define ALL observed attributes for automatic updates
    static get observedAttributes() {
        return [
            'value',           // String attributes
            'disabled',        // Boolean attributes (presence-based)
            'size',           // Enum attributes
            'max-length',     // Numeric attributes
            'custom-color'    // CSS variable attributes
        ];
    }

    constructor() {
        super();

        // Initialize logger
        this.logger = componentLogger.for('TMyComponent');

        // Capture initial text content BEFORE any rendering
        this._initialText = this.textContent || '';

        // Initialize props with ALL default values
        this.setProps({
            value: '',
            disabled: false,
            size: 'default', // xs, sm, default, lg
            maxLength: 100,
            customColor: null,
            // Internal state
            _isProcessing: false,
            _capturedWidth: null
        });

        // Bind methods if needed for event handlers
        this._handleClick = this._handleClick.bind(this);
    }

    // Handle ALL attribute changes
    onAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'value':
                this.setProp('value', newValue || '');
                break;
            case 'disabled':
                // Boolean: presence = true, absence = false
                this.setProp('disabled', newValue !== null);
                break;
            case 'size':
                // Enum with validation
                const validSizes = ['xs', 'sm', 'default', 'lg'];
                this.setProp('size', validSizes.includes(newValue) ? newValue : 'default');
                break;
            case 'max-length':
                // Numeric with parsing
                this.setProp('maxLength', parseInt(newValue) || 100);
                break;
            case 'custom-color':
                this.setProp('customColor', newValue);
                break;
        }
    }

    // Template method - returns HTML string
    template() {
        const { value, disabled, size, customColor, _isProcessing } = this._props;

        // Build class list properly
        const classes = ['t-myc'];
        if (size !== 'default') classes.push(`t-myc--${size}`);
        if (disabled) classes.push('is-disabled');
        if (_isProcessing) classes.push('is-processing');

        // Build inline styles for CSS variables
        const styles = [];
        if (customColor) {
            styles.push(`--custom-color: ${customColor}`);
        }
        const styleAttr = styles.length > 0 ? `style="${styles.join('; ')}"` : '';

        // NEVER include <style> tags - styles come from adoptedStyleSheets
        return `
            <div class="${classes.join(' ')}" ${styleAttr}>
                ${_isProcessing ? this._renderLoader() : ''}
                <div class="t-myc__content">
                    ${this._escapeHtml(value || this._initialText)}
                </div>
            </div>
        `;
    }

    // Helper to render loader (example of composition)
    _renderLoader() {
        // For animations, use CSS classes, not inline animation
        return `
            <div class="t-myc__loader">
                <div class="loader-spinner"></div>
            </div>
        `;
    }

    // CRITICAL: Escape HTML to prevent XSS
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // After render lifecycle - attach event listeners
    afterRender() {
        const container = this.$('.t-myc');
        if (!container) return;

        // Use addListener for automatic cleanup
        this.addListener(container, 'click', this._handleClick);

        // Handle focus management if needed
        const input = this.$('input');
        if (input && this._shouldFocus) {
            input.focus();
            this._shouldFocus = false;
        }
    }

    // Event handler
    _handleClick(e) {
        if (this.getProp('disabled')) return;

        // Emit custom event with detail
        this.emit('myc-click', {
            value: this.getProp('value'),
            originalEvent: e
        });
    }

    // Lifecycle: Component connected to DOM
    connectedCallback() {
        super.connectedCallback();
        this.logger.debug('Component connected');
    }

    // Lifecycle: Component removed from DOM
    disconnectedCallback() {
        super.disconnectedCallback();
        // Cleanup any timers, observers, etc.
        this.logger.debug('Component disconnected');
    }

    // ========== PUBLIC API ==========

    /**
     * Set the component value
     * @param {string} value - The new value
     */
    setValue(value) {
        this.setProp('value', value);
        this.setAttribute('value', value);
    }

    /**
     * Get the component value
     * @returns {string} The current value
     */
    getValue() {
        return this.getProp('value');
    }

    /**
     * Enable the component
     */
    enable() {
        this.setProp('disabled', false);
        this.removeAttribute('disabled');
    }

    /**
     * Disable the component
     */
    disable() {
        this.setProp('disabled', true);
        this.setAttribute('disabled', '');
    }

    /**
     * Start processing state
     */
    startProcessing() {
        // Capture width before state change to prevent layout shift
        const container = this.$('.t-myc');
        if (container) {
            this._capturedWidth = container.offsetWidth + 'px';
            container.style.minWidth = this._capturedWidth;
        }

        this.setProp('_isProcessing', true);
    }

    /**
     * Stop processing state
     */
    stopProcessing() {
        this.setProp('_isProcessing', false);

        // Remove width constraint after animation
        setTimeout(() => {
            const container = this.$('.t-myc');
            if (container && this._capturedWidth) {
                container.style.minWidth = '';
                this._capturedWidth = null;
            }
        }, 300);
    }
}

// Register the component - MUST be at end of file
customElements.define('t-myc', TMyComponent);
```

### 2. CSS Stylesheet File (Complete Template)

```css
/**
 * MyComponent (t-myc)
 * Component description
 */

/* ========================================
   BASE COMPONENT STYLES
   ======================================== */
.t-myc {
    /* ALWAYS use CSS variables for theming */
    background: var(--terminal-gray-dark);
    color: var(--terminal-green);
    border: 1px solid var(--terminal-gray-light);

    /* Standard sizing */
    height: var(--control-height); /* 28px default */
    padding: 0 var(--spacing-md);

    /* Typography */
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);

    /* Layout */
    display: inline-flex;
    align-items: center;
    position: relative;

    /* Interaction */
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
}

/* ========================================
   COMPONENT STATES
   ======================================== */

/* Hover state */
.t-myc:hover:not(.is-disabled) {
    background: var(--terminal-gray);
    border-color: var(--terminal-green);
}

/* Active state */
.t-myc:active:not(.is-disabled) {
    transform: translateY(1px);
}

/* Focus state */
.t-myc:focus-within {
    outline: 1px solid var(--terminal-green);
    outline-offset: 2px;
}

/* Disabled state */
.t-myc.is-disabled {
    opacity: 0.3; /* Make it very faint */
    cursor: not-allowed;
    pointer-events: none;
}

/* Processing state */
.t-myc.is-processing {
    pointer-events: none;
    min-width: 100px; /* Prevent collapse */
}

/* ========================================
   SIZE VARIANTS
   ======================================== */

.t-myc--xs {
    height: 16px;
    padding: 0 var(--spacing-xs);
    font-size: var(--font-size-xs);
}

.t-myc--sm {
    height: 20px;
    padding: 0 var(--spacing-sm);
    font-size: var(--font-size-xs);
}

/* Default is already defined in base */

.t-myc--lg {
    height: 36px;
    padding: 0 var(--spacing-lg);
    font-size: var(--font-size-md);
}

/* ========================================
   COMPONENT PARTS
   ======================================== */

.t-myc__content {
    display: flex;
    align-items: center;
    flex: 1;
}

.t-myc__loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* ========================================
   ANIMATIONS (CRITICAL: Use @keyframes!)
   ======================================== */

/* Loader spinner animation */
.loader-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid transparent;
    border-top-color: var(--custom-color, var(--terminal-green));
    border-radius: 50%;
    animation: spinnerRotate 0.8s linear infinite;
}

/* Define ALL animations with @keyframes */
@keyframes spinnerRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Pulse animation example */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Use animations via classes */
.t-myc--pulsing {
    animation: pulse 2s ease-in-out infinite;
}

/* ========================================
   CUSTOM PROPERTIES SUPPORT
   ======================================== */

/* Support custom color via CSS variable */
.t-myc[style*="--custom-color"] {
    color: var(--custom-color);
}

.t-myc[style*="--custom-color"]:hover:not(.is-disabled) {
    border-color: var(--custom-color);
}
```

### 3. Register Stylesheet in StyleSheetManager

Add to `/js/utils/StyleSheetManager.js` in `loadComponentStyles()`:

```javascript
async loadComponentStyles() {
    const stylePromises = [
        // ... existing components (alphabetical order)
        this.loadStyleSheet('TMyComponent', '/css/components/t-myc.css'),
    ];

    await Promise.all(stylePromises);
    this.logger.debug('All component stylesheets loaded successfully');
}
```

## Critical Patterns to Follow

### 1. Logger Usage (CRITICAL!)
```javascript
// CORRECT - These methods exist
this.logger.info('Information message');
this.logger.debug('Debug message');
this.logger.error('Error message', error);
this.logger.warn('Warning message');

// WRONG - This will cause runtime error!
this.logger.log('Message'); // ❌ log() does NOT exist!
```

### 2. Shadow DOM and Styles
- **NEVER** inject `<style>` tags in templates
- **NEVER** use inline `animation` styles
- **ALWAYS** use CSS classes for animations
- **ALWAYS** define animations with `@keyframes` in CSS file
- CSS variables CAN be set inline for dynamic customization

```javascript
// CORRECT - CSS variable for dynamic color
`<div class="animated" style="--color: ${dynamicColor};">`

// WRONG - Inline animation
`<div style="animation: spin 1s linear infinite;">` // ❌
```

### 3. Props vs Attributes
```javascript
// Attributes: kebab-case, always strings
<t-myc toggle-state="true" max-length="100">

// Props: camelCase, proper types
this.setProp('toggleState', true);  // boolean
this.setProp('maxLength', 100);     // number

// Boolean attribute handling pattern
case 'disabled':
    this.setProp('disabled', newValue !== null); // presence = true
    break;

// String to boolean conversion
case 'toggle-state':
    this.setProp('toggleState', newValue === 'true');
    break;
```

### 4. Event Handling Pattern
```javascript
// ALWAYS use addListener for automatic cleanup
this.addListener(element, 'click', (e) => {
    this.emit('component-click', {
        value: this.getValue(),
        originalEvent: e  // Always include original event
    });
});

// NEVER use addEventListener directly
element.addEventListener('click', handler); // ❌ No automatic cleanup!
```

### 5. CSS Animations and Keyframes
```css
/* CORRECT - Define in CSS file */
@keyframes myAnimation {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
}

.component--animating {
    animation: myAnimation 0.3s ease;
}
```

```javascript
// CORRECT - Apply via class
element.classList.add('component--animating');

// WRONG - Inline animation
element.style.animation = 'spin 1s linear'; // ❌
```

### 6. Text Content Capture
```javascript
constructor() {
    super();
    // Capture BEFORE any rendering occurs
    this._initialText = this.textContent || '';
}

template() {
    // Use captured text as fallback
    const text = this.getProp('text') || this._initialText;
}
```

### 7. Width Preservation During State Changes
```javascript
startLoading() {
    const element = this.$('.element');
    if (element) {
        // Capture width before state change
        this._capturedWidth = element.offsetWidth + 'px';
        element.style.minWidth = this._capturedWidth;
    }
    this.setProp('loading', true);
}

stopLoading() {
    this.setProp('loading', false);
    // Restore width after state change
    const element = this.$('.element');
    if (element && this._capturedWidth) {
        element.style.minWidth = '';
        this._capturedWidth = null;
    }
}
```

## Common Issues and Solutions

### Issue 1: Styles Not Loading
**Symptom**: Component renders without styles
**Causes & Solutions**:
1. **Not registered in StyleSheetManager**
   ```javascript
   // Add to loadComponentStyles()
   this.loadStyleSheet('TMyComponent', '/css/components/t-myc.css')
   ```

2. **Wrong file path**
   - Verify path starts with `/css/components/`
   - Check filename matches pattern `t-xxx.css`

3. **Vite CSS extraction failing**
   - Check devmirror logs for "Extracted CSS from Vite wrapper"
   - Ensure StyleSheetManager regex handles multiline CSS

### Issue 2: Animations Not Playing
**Symptom**: Animation classes applied but nothing animates
**Causes & Solutions**:
1. **Keyframes not in CSS file**
   ```css
   /* Must be in CSS file, not inline */
   @keyframes animationName { ... }
   ```

2. **Keyframes stripped during extraction**
   - Check logs: "Created stylesheet X with Y rules (Z keyframes)"
   - If Z = 0, keyframes aren't being loaded

3. **Using inline animation**
   ```javascript
   // WRONG
   style="animation: spin 1s"

   // CORRECT
   class="spinner"  /* with animation in CSS */
   ```

### Issue 3: Logger Errors
**Symptom**: "this.logger.log is not a function"
**Solution**: Use `info()`, `debug()`, `error()`, `warn()` - NOT `log()`

### Issue 4: Props Not Updating
**Symptom**: Attribute changes don't trigger re-render
**Solutions**:
1. Add to `observedAttributes` array
2. Handle in `onAttributeChange`
3. Call `setProp()` to trigger render

### Issue 5: Memory Leaks
**Symptom**: Component performance degrades over time
**Solutions**:
1. Use `addListener()` for automatic cleanup
2. Clear timers in `disconnectedCallback`
3. Remove observers in `disconnectedCallback`

### Issue 6: Layout Shift During State Changes
**Symptom**: Button width changes when showing loader
**Solution**: Capture and preserve width before state change

## Testing and Debugging

### Demo Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyComponent Demo</title>
    <style>
        :root {
            --terminal-black: #0a0a0a;
            --terminal-green: #00ff41;
            --font-mono: 'SF Mono', Monaco, monospace;
            /* Include all theme variables */
        }

        body {
            background: var(--terminal-black);
            color: var(--terminal-green);
            font-family: var(--font-mono);
            padding: 40px;
        }

        .demo-section {
            margin-bottom: 40px;
        }
    </style>
</head>
<body>
    <h1>MyComponent Demo</h1>

    <div class="demo-section">
        <h2>Basic Usage</h2>
        <t-myc value="Initial Value"></t-myc>
    </div>

    <div class="demo-section">
        <h2>Sizes</h2>
        <t-myc size="xs">XS Size</t-myc>
        <t-myc size="sm">Small</t-myc>
        <t-myc>Default</t-myc>
        <t-myc size="lg">Large</t-myc>
    </div>

    <div class="demo-section">
        <h2>States</h2>
        <t-myc disabled>Disabled</t-myc>
        <t-myc id="loadingExample">Click to Load</t-myc>
    </div>

    <script type="module">
        import '../js/components/TComponent.js';
        import '../js/components/TMyComponent.js';

        // Get component reference
        const component = document.querySelector('t-myc');

        // Listen for events
        component.addEventListener('myc-click', (e) => {
            console.log('Component clicked:', e.detail);
        });

        // Use public API
        setTimeout(() => {
            component.setValue('Updated Value');
        }, 2000);

        // Loading example
        const loadingExample = document.getElementById('loadingExample');
        loadingExample.addEventListener('myc-click', () => {
            loadingExample.startProcessing();
            setTimeout(() => {
                loadingExample.stopProcessing();
            }, 3000);
        });
    </script>
</body>
</html>
```

### Debugging with URL Parameters
```javascript
// Add ?debug=TButton to URL to see detailed logs for TButton only
// Add ?debug=all to see all component logs

http://localhost:3007/demos/buttons.html?debug=TButton
```

### DevMirror Log Monitoring
```bash
# Watch logs in real-time
tail -f devmirror-logs/current.log

# Filter for specific component
tail -f devmirror-logs/current.log | grep "TButton"

# Check for errors
tail -f devmirror-logs/current.log | grep "ERROR"
```

### Chrome DevTools Debugging
1. **Inspect Shadow DOM**: Click ⚙️ > Show user agent shadow DOM
2. **Check adoptedStyleSheets**:
   ```javascript
   $0.shadowRoot.adoptedStyleSheets
   ```
3. **Verify styles loaded**:
   ```javascript
   $0.shadowRoot.adoptedStyleSheets[0].cssRules.length
   ```
4. **Check for animations**:
   ```javascript
   Array.from($0.shadowRoot.adoptedStyleSheets[0].cssRules)
     .filter(r => r.type === CSSRule.KEYFRAMES_RULE)
   ```

## Component API Documentation

### Standard Component Methods

Every component should implement these public methods:

```javascript
// Value Management
setValue(value)      // Set the component value
getValue()          // Get the current value

// State Management
enable()            // Enable the component
disable()           // Disable the component
reset()             // Reset to default state

// Loading States (if applicable)
setLoading(loading) // Set loading state
startProcessing()   // Start processing with width preservation
stopProcessing()    // Stop processing

// Visual States (if applicable)
show()              // Show the component
hide()              // Hide the component
focus()             // Focus the component
blur()              // Blur the component

// Data Methods (if applicable)
setData(data)       // Set component data
getData()           // Get component data
clearData()         // Clear all data
```

### Standard Events

Components should emit these standard events:

```javascript
// User Interaction
'[component]-click'     // User clicked component
'[component]-change'    // Value changed
'[component]-input'     // Input received

// State Changes
'[component]-enable'    // Component enabled
'[component]-disable'   // Component disabled
'[component]-ready'     // Component initialized

// Data Events
'[component]-load'      // Data loaded
'[component]-error'     // Error occurred
'[component]-clear'     // Data cleared
```

Event detail should always include:
```javascript
{
    value: currentValue,        // Current component value
    previousValue: oldValue,    // Previous value (if applicable)
    originalEvent: e,           // Original DOM event
    timestamp: Date.now()       // Event timestamp
}
```

## Complete Checklist

### Setup
- [ ] Component extends `TComponent`
- [ ] Component file named `TMyComponent.js`
- [ ] CSS file named `t-myc.css` (3-4 letter abbreviation)
- [ ] Element registered as `t-myc` (lowercase, hyphenated)

### Implementation
- [ ] `observedAttributes` array includes ALL attributes
- [ ] Constructor initializes logger with `componentLogger.for()`
- [ ] Constructor captures initial text content
- [ ] Constructor sets ALL default props
- [ ] `onAttributeChange` handles ALL observed attributes
- [ ] Boolean attributes use presence detection (`newValue !== null`)
- [ ] Numeric attributes are parsed (`parseInt()` or `parseFloat()`)

### Template
- [ ] `template()` returns valid HTML string
- [ ] NO `<style>` tags in template
- [ ] CSS classes built properly with array.join()
- [ ] CSS variables set via inline style attribute
- [ ] HTML properly escaped to prevent XSS
- [ ] Animations applied via classes, not inline

### Styles
- [ ] CSS file uses CSS variables for ALL colors
- [ ] CSS file uses CSS variables for spacing
- [ ] ALL animations defined with `@keyframes`
- [ ] Animations applied via classes
- [ ] Hover/active states use `:not(.is-disabled)`
- [ ] Size variants follow naming pattern (`t-myc--xs`, `t-myc--sm`, etc.)

### Event Handling
- [ ] `afterRender()` uses `addListener()` for all events
- [ ] Events emitted with meaningful names
- [ ] Event detail includes `originalEvent`
- [ ] Click handlers check disabled state

### Lifecycle
- [ ] `connectedCallback` calls `super.connectedCallback()`
- [ ] `disconnectedCallback` cleans up timers/observers
- [ ] `disconnectedCallback` calls `super.disconnectedCallback()`

### Public API
- [ ] All public methods documented with JSDoc
- [ ] Methods update both prop and attribute when needed
- [ ] Standard methods implemented (enable/disable, setValue/getValue)
- [ ] Width preserved during loading states

### Registration
- [ ] Stylesheet added to StyleSheetManager.loadComponentStyles()
- [ ] Component registered with `customElements.define()`
- [ ] Registration at END of file

### Testing
- [ ] Demo page created
- [ ] All variants/states demonstrated
- [ ] Event handling tested
- [ ] Public API tested
- [ ] Accessibility tested (keyboard navigation)

### Debugging
- [ ] Logger uses correct methods (info/debug/error/warn)
- [ ] NO use of `logger.log()`
- [ ] Meaningful debug messages included
- [ ] Component works with `?debug=ComponentName` URL param

### Performance
- [ ] No memory leaks (event listeners cleaned)
- [ ] No excessive re-renders
- [ ] Animations use CSS transforms/opacity
- [ ] Width captured before state changes

### Documentation
- [ ] Component purpose documented
- [ ] Public API documented
- [ ] Events documented
- [ ] Usage examples provided

## Best Practices

1. **Keep components focused** - Single responsibility principle
2. **Use semantic HTML** - Proper elements and ARIA attributes
3. **Follow naming conventions** - Consistency across all components
4. **Document public API** - Clear method names and JSDoc comments
5. **Test edge cases** - Empty states, disabled, loading, errors
6. **Use CSS variables** - For ALL colors, spacing, and sizing
7. **Emit meaningful events** - Include all relevant detail data
8. **Handle cleanup** - Remove ALL listeners, clear ALL timers
9. **Validate props** - Set sensible defaults, validate enums
10. **Monitor performance** - Check stylesheet rule count, test with many instances
11. **Preserve layout** - Capture dimensions before state changes
12. **Escape user input** - Prevent XSS vulnerabilities
13. **Support accessibility** - Keyboard navigation, ARIA attributes
14. **Use debug mode** - Add `?debug=ComponentName` support
15. **Write tests** - Unit tests for methods, integration tests for behavior

## Common Patterns

### Toggle Pattern
```javascript
case 'toggle-state':
    this.setProp('toggleState', newValue === 'true');
    break;

toggle() {
    const newState = !this.getProp('toggleState');
    this.setProp('toggleState', newState);
    this.setAttribute('toggle-state', newState.toString());
    this.emit('toggle-change', { state: newState });
    return newState;
}
```

### Loading Pattern
```javascript
setLoading(loading) {
    const element = this.$('.element');

    if (loading && element) {
        // Preserve width
        this._capturedWidth = element.offsetWidth + 'px';
        element.style.minWidth = this._capturedWidth;
    }

    this.setProp('loading', loading);

    if (!loading && element && this._capturedWidth) {
        // Restore after animation
        setTimeout(() => {
            element.style.minWidth = '';
            this._capturedWidth = null;
        }, 300);
    }
}
```

### Icon Scaling Pattern
```javascript
_scaleIcon(iconSvg, size) {
    if (!iconSvg) return iconSvg;

    const sizeMap = {
        'xs': 12,
        'sm': 14,
        'default': 16,
        'lg': 20
    };

    const iconSize = sizeMap[size] || 16;

    return iconSvg
        .replace(/width="[^"]*"/i, `width="${iconSize}"`)
        .replace(/height="[^"]*"/i, `height="${iconSize}"`);
}
```

## Resources

- **Base Class**: `/js/components/TComponent.js`
- **Style Manager**: `/js/utils/StyleSheetManager.js`
- **Logger**: `/js/utils/ComponentLogger.js`
- **Theme Variables**: `/css/theme.css`
- **Example Components**:
  - `/js/components/TButton.js` - Complete button implementation
  - `/js/components/TInput.js` - Input with validation
  - `/js/components/TToggle.js` - Toggle switch
  - `/js/components/TModal.js` - Modal with lifecycle
  - `/js/components/TLoader.js` - Loading animations

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| "this.logger.log is not a function" | Use `info()`, `debug()`, `error()`, `warn()` |
| Animations not playing | Check @keyframes in CSS file, use classes not inline |
| Styles not loading | Register in StyleSheetManager, check file path |
| Props not updating | Add to observedAttributes, handle in onAttributeChange |
| Memory leaks | Use addListener(), cleanup in disconnectedCallback |
| Layout shift | Capture width before state change |
| Events not firing | Use addListener(), check disabled state |
| CSS not extracted from Vite | Check StyleSheetManager regex, look for "Extracted CSS" log |