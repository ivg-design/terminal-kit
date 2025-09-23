# TerminalComponent

Base class for all Terminal UI components. Provides core functionality for Web Components without Shadow DOM.

## Class Definition

```javascript
class TerminalComponent extends HTMLElement
```

## Constructor

```javascript
constructor()
```

Initializes the component with:
- Props storage
- Event listeners array
- Mounted state tracking
- Attribute change observer

## Properties

### Protected Properties

| Property | Type | Description |
|----------|------|-------------|
| `_props` | Object | Internal props storage |
| `_eventListeners` | Array | Tracked event listeners for cleanup |
| `_mounted` | Boolean | Component mount state |

## Methods

### Core Methods

#### `connectedCallback()`
Called when the element is added to the DOM. Handles:
- Initial render
- Lifecycle hook calls
- Mount state management

#### `disconnectedCallback()`
Called when the element is removed from the DOM. Handles:
- Event listener cleanup
- Unmount lifecycle hook

#### `attributeChangedCallback(name, oldValue, newValue)`
Called when an observed attribute changes.

**Parameters:**
- `name` (string): Attribute name
- `oldValue` (string): Previous value
- `newValue` (string): New value

### Props Management

#### `setProp(key, value)`
Sets a single prop value and triggers re-render.

**Parameters:**
- `key` (string): Prop name
- `value` (any): Prop value

#### `setProps(props)`
Sets multiple props at once.

**Parameters:**
- `props` (Object): Object with prop key-value pairs

#### `getProp(key)`
Gets a single prop value.

**Parameters:**
- `key` (string): Prop name

**Returns:** Prop value or undefined

### DOM Utilities

#### `$(selector)`
Query selector within component.

**Parameters:**
- `selector` (string): CSS selector

**Returns:** First matching element or null

#### `$$(selector)`
Query selector all within component.

**Parameters:**
- `selector` (string): CSS selector

**Returns:** NodeList of matching elements

### Event Management

#### `emit(eventName, detail)`
Emits a custom event.

**Parameters:**
- `eventName` (string): Event name
- `detail` (any): Event detail data

#### `addListener(element, event, handler, options)`
Adds an event listener with automatic cleanup.

**Parameters:**
- `element` (Element): Target element
- `event` (string): Event type
- `handler` (Function): Event handler
- `options` (Object): Event listener options

### Rendering

#### `render()`
Main render method. Calls template() and afterRender().

#### `template()`
Returns HTML string for component. Must be overridden by subclasses.

**Returns:** HTML string

### Lifecycle Hooks

#### `onMount()`
Called after component is mounted to DOM. Override in subclasses.

#### `onUnmount()`
Called before component is removed from DOM. Override in subclasses.

#### `afterRender()`
Called after each render. Override in subclasses.

#### `onAttributeChange(name, oldValue, newValue)`
Called when an observed attribute changes. Override in subclasses.

### Utility Methods

#### `debounce(func, wait)`
Creates a debounced function.

**Parameters:**
- `func` (Function): Function to debounce
- `wait` (number): Wait time in milliseconds

**Returns:** Debounced function

## Usage Example

```javascript
class MyComponent extends TerminalComponent {
  static get observedAttributes() {
    return ['title', 'disabled'];
  }

  constructor() {
    super();
    this.setProps({
      title: 'Default Title',
      disabled: false
    });
  }

  template() {
    const { title, disabled } = this._props;
    return `
      <div class="my-component ${disabled ? 'disabled' : ''}">
        <h2>${title}</h2>
        <button>Click Me</button>
      </div>
    `;
  }

  afterRender() {
    const button = this.$('button');
    if (button) {
      this.addListener(button, 'click', () => {
        this.emit('my-event', { clicked: true });
      });
    }
  }

  onAttributeChange(name, oldValue, newValue) {
    if (name === 'title') {
      this.setProp('title', newValue);
    } else if (name === 'disabled') {
      this.setProp('disabled', newValue !== null);
    }
  }
}

customElements.define('my-component', MyComponent);
```

## Best Practices

1. **Always call `super()` in constructor**
2. **Override `template()` for component HTML**
3. **Use `afterRender()` for DOM manipulation**
4. **Use `addListener()` for event handlers (auto-cleanup)**
5. **Define `observedAttributes` for reactive attributes**
6. **Use `emit()` for custom events**
7. **Initialize props in constructor**