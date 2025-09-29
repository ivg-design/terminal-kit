/**
 * Manifest Generator
 *
 * Automatically generates component manifests from Lit component definitions.
 * Extracts properties from `static properties` and methods/events from JSDoc.
 */

/**
 * Generate manifest from Lit component class
 * @param {typeof import('lit').LitElement} componentClass
 * @param {Partial<import('../types/component-manifest').ComponentManifest>} manual
 * @returns {import('../types/component-manifest').ComponentManifest}
 */
export function generateManifest(componentClass, manual = {}) {
  const tagName = manual.tagName || componentClass.tagName || componentClass.is || '';

  // Extract properties from Lit's static properties
  const litProperties = componentClass.properties || {};
  const properties = {};

  for (const [propName, propConfig] of Object.entries(litProperties)) {
    properties[propName] = {
      type: getLitTypeAsString(propConfig.type),
      default: propConfig.default,
      reflect: propConfig.reflect || false,
      required: false,
      description: manual.properties?.[propName]?.description || ''
    };

    // Add enum if provided manually
    if (manual.properties?.[propName]?.enum) {
      properties[propName].enum = manual.properties[propName].enum;
    }
  }

  // Extract static metadata (if present)
  const version = componentClass.version || manual.version || '1.0.0';
  const category = componentClass.category || manual.category || '';

  // Merge auto-generated with manual overrides
  const manifest = {
    tagName,
    displayName: manual.displayName || tagName,
    description: manual.description || '',
    version,
    category,
    properties,
    methods: manual.methods || {},
    events: manual.events || {},
    slots: manual.slots || {},
    parts: manual.parts || {},
    cssProperties: manual.cssProperties || {}
  };

  return manifest;
}

/**
 * Convert Lit property type to string
 * @private
 */
function getLitTypeAsString(litType) {
  if (!litType) return 'string';

  switch (litType) {
    case String:
      return 'string';
    case Number:
      return 'number';
    case Boolean:
      return 'boolean';
    case Array:
      return 'array';
    case Object:
      return 'object';
    default:
      return 'string';
  }
}

/**
 * Register component with auto-generated manifest
 * @param {typeof import('lit').LitElement} componentClass
 * @param {Partial<import('../types/component-manifest').ComponentManifest>} manual
 */
export function registerComponentWithManifest(componentClass, manual) {
  const manifest = generateManifest(componentClass, manual);

  // Register with global registry if available
  if (typeof window !== 'undefined' && window.__TERMINAL_KIT_REGISTRY__) {
    window.__TERMINAL_KIT_REGISTRY__.register(manifest);
  }

  return manifest;
}