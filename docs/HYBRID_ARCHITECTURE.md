# Hybrid Architecture: Static + Dynamic Components

## Your Use Case
```
┌────────────────────────────────────────────┐
│            Animation Player UI              │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────┐     │
│  │     Player Controls (STATIC)      │     │ ← DSD from HTML
│  │  [Play] [Pause] [Reset] [Export]  │     │   No FOUC
│  └──────────────────────────────────┘     │
│                                            │
│  ┌──────────────────────────────────┐     │
│  │    Timeline View (STATIC)         │     │ ← DSD from HTML
│  │  ================================  │     │   No FOUC
│  └──────────────────────────────────┘     │
│                                            │
│  ┌──────────────────────────────────┐     │
│  │  Parameter Controls (DYNAMIC)     │     │ ← Generated based
│  │  Duration: [====|====]            │     │   on animation
│  │  Easing:   [dropdown ▼]          │     │   parameters
│  │  Color:    [#00ff00]              │     │
│  │  + Add Parameter                  │     │
│  └──────────────────────────────────┘     │
│                                            │
└────────────────────────────────────────────┘
```

## Implementation Strategy

### 1. Static Components (Known at Build Time)

```html
<!-- index.html - Static player shell with DSD -->
<t-animation-player>
  <template shadowrootmode="open">
    <style>
      /* Player styles inline for zero FOUC */
      :host {
        display: block;
        background: var(--color-black);
        border: 1px solid var(--color-green);
      }
      /* ... */
    </style>
    <div class="player-container">
      <slot name="controls"></slot>
      <slot name="timeline"></slot>
      <slot name="parameters"></slot>
    </div>
  </template>

  <!-- Static controls with DSD -->
  <t-player-controls slot="controls">
    <template shadowrootmode="open">
      <style>/* Control styles */</style>
      <button part="play">▶</button>
      <button part="pause">⏸</button>
      <button part="reset">⏮</button>
      <button part="export">💾</button>
    </template>
  </t-player-controls>

  <!-- Static timeline with DSD -->
  <t-timeline slot="timeline">
    <template shadowrootmode="open">
      <style>/* Timeline styles */</style>
      <div class="timeline-track"></div>
      <div class="timeline-cursor"></div>
    </template>
  </t-timeline>

  <!-- Dynamic parameter panel - placeholder -->
  <div slot="parameters" id="dynamic-controls">
    <!-- Will be populated at runtime -->
  </div>
</t-animation-player>
```

### 2. Dynamic Components (Generated at Runtime)

```javascript
// AnimationController.js
export class AnimationController {
  constructor(playerElement) {
    this.player = playerElement;
    this.controlsContainer = playerElement.querySelector('#dynamic-controls');

    // Static components already have DSD - just hydrate
    this.playButton = playerElement.querySelector('t-player-controls')
      .shadowRoot.querySelector('[part="play"]');

    this.timeline = playerElement.querySelector('t-timeline');
  }

  /**
   * Load animation and generate controls dynamically
   */
  async loadAnimation(animationConfig) {
    // Static parts are already rendered with DSD
    this.setupStaticControls();

    // Generate dynamic controls based on animation
    this.generateDynamicControls(animationConfig.parameters);
  }

  /**
   * Static controls just need event listeners
   */
  setupStaticControls() {
    // These already have styles from DSD - just add behavior
    this.playButton.addEventListener('click', () => this.play());
    // etc...
  }

  /**
   * Dynamic controls need full generation
   */
  generateDynamicControls(parameters) {
    const controlsHTML = this.buildControlsHTML(parameters);

    // Use setHTMLUnsafe for DSD parsing
    if (this.controlsContainer.setHTMLUnsafe) {
      this.controlsContainer.setHTMLUnsafe(controlsHTML);
    } else {
      // Fallback with manual DSD processing
      this.controlsContainer.innerHTML = controlsHTML;
      this.processDSDTemplates(this.controlsContainer);
    }
  }

  /**
   * Build HTML with DSD templates for dynamic controls
   */
  buildControlsHTML(parameters) {
    const controls = [];

    // Some controls are always present (semi-static)
    controls.push(this.createControl('t-slider', {
      name: 'master-speed',
      label: 'Speed',
      min: 0.1,
      max: 2,
      value: 1,
      static: true  // Always present
    }));

    // Dynamic controls based on animation
    for (const [name, config] of Object.entries(parameters)) {
      switch(config.type) {
        case 'color':
          controls.push(this.createColorControl(name, config));
          break;
        case 'number':
          controls.push(this.createSliderControl(name, config));
          break;
        case 'select':
          controls.push(this.createDropdownControl(name, config));
          break;
        // etc...
      }
    }

    // Wrap in a panel
    return `
      <t-panel class="parameter-controls">
        <template shadowrootmode="open">
          <style>
            ${this.getPanelStyles()}
          </style>
          <header><slot name="title"></slot></header>
          <div class="controls"><slot></slot></div>
        </template>
        <span slot="title">Parameters</span>
        ${controls.join('\n')}
      </t-panel>
    `;
  }

  /**
   * Create individual control with DSD
   */
  createControl(tagName, config) {
    const styles = this.getStylesFor(tagName);
    const template = this.getTemplateFor(tagName);

    return `
      <${tagName} ${this.buildAttributes(config)}>
        <template shadowrootmode="open">
          <style>${styles}</style>
          ${template}
        </template>
        ${config.label || ''}
      </${tagName}>
    `;
  }

  /**
   * Style cache - loaded once, used for all dynamic instances
   */
  static styleCache = new Map();

  getStylesFor(tagName) {
    if (!AnimationController.styleCache.has(tagName)) {
      // In production, these would be inlined by build tool
      const styles = this.loadStylesSync(tagName);
      AnimationController.styleCache.set(tagName, styles);
    }
    return AnimationController.styleCache.get(tagName);
  }
}
```

### 3. Component Implementation (Dual-Mode)

```javascript
// Example component that works in both modes
export class TSlider extends HTMLElement {
  static observedAttributes = ['min', 'max', 'value', 'label'];

  constructor() {
    super();

    // Check if we have DSD
    if (this.shadowRoot) {
      // Static mode - DSD exists
      this.mode = 'static';
      this.hydrate();
    } else {
      // Dynamic mode - need to create everything
      this.mode = 'dynamic';
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  }

  hydrate() {
    // For static DSD - just add interactivity
    this.input = this.shadowRoot.querySelector('input');
    this.output = this.shadowRoot.querySelector('output');
    this.attachListeners();
  }

  render() {
    // For dynamic creation - need full render
    this.shadowRoot.innerHTML = `
      <style>${TSlider.styles}</style>
      <label part="label">
        <span part="label-text"><slot></slot></span>
        <input type="range" part="input">
        <output part="output"></output>
      </label>
    `;

    this.input = this.shadowRoot.querySelector('input');
    this.output = this.shadowRoot.querySelector('output');
    this.attachListeners();
  }

  attachListeners() {
    this.input?.addEventListener('input', (e) => {
      this.output.value = e.target.value;
      this.dispatchEvent(new CustomEvent('slider-change', {
        detail: { value: e.target.value },
        bubbles: true
      }));
    });
  }

  // Styles loaded once and cached
  static styles = '';
  static {
    // Load styles once for dynamic instances
    fetch('/css/components/slider.css')
      .then(r => r.text())
      .then(css => this.styles = css)
      .catch(() => {
        // Fallback styles if fetch fails
        this.styles = `
          :host { display: block; }
          input { width: 100%; }
        `;
      });
  }
}

customElements.define('t-slider', TSlider);
```

## The Key Architecture Points

### 1. **Static Components (Player Shell, Main Controls)**
- ✅ Use DSD in HTML
- ✅ Zero FOUC
- ✅ Just hydrate (add listeners)
- ✅ No style loading needed

### 2. **Dynamic Components (Parameter Controls)**
- ✅ Generate with `setHTMLUnsafe()`
- ✅ Include DSD templates in generated HTML
- ✅ Cache styles in JavaScript
- ✅ Still get zero FOUC!

### 3. **Semi-Dynamic Components**
Some controls might always exist but with dynamic properties:
```javascript
// The slider always exists, but its min/max/value change
const slider = document.querySelector('#speed-slider');
slider.min = animation.minSpeed;
slider.max = animation.maxSpeed;
// Component already has DSD styles, just updating attributes
```

## Benefits of This Hybrid Approach

1. **Best of Both Worlds**
   - Static parts load instantly with DSD
   - Dynamic parts generated without FOUC

2. **Performance**
   - No unnecessary style loading for static components
   - Shared style cache for dynamic components

3. **Maintainability**
   - Clear separation: static vs dynamic
   - Single source of truth for styles

4. **Developer Experience**
   - Components work in both modes
   - Same API for static and dynamic

## Testing Strategy

```javascript
// Test that both modes work
describe('TSlider', () => {
  it('works with DSD (static)', () => {
    document.body.setHTMLUnsafe(`
      <t-slider>
        <template shadowrootmode="open">
          <style>/* styles */</style>
          <input type="range">
        </template>
      </t-slider>
    `);

    const slider = document.querySelector('t-slider');
    expect(slider.shadowRoot).toBeTruthy();
    expect(slider.mode).toBe('static');
  });

  it('works without DSD (dynamic)', () => {
    const slider = document.createElement('t-slider');
    document.body.appendChild(slider);

    expect(slider.shadowRoot).toBeTruthy();
    expect(slider.mode).toBe('dynamic');
  });
});
```

## Implementation Checklist

- [ ] Static components have DSD templates in HTML
- [ ] Dynamic generation uses `setHTMLUnsafe()`
- [ ] Components detect and handle both modes
- [ ] Styles are cached for dynamic instances
- [ ] No adoptedStyleSheets for DSD components
- [ ] Build process generates DSD for known components
- [ ] Runtime generates DSD for dynamic components
- [ ] Fallback for browsers without `setHTMLUnsafe()`