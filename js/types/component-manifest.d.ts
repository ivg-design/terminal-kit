/**
 * Component Manifest Type System
 *
 * Every Terminal Kit component exports a manifest describing its API.
 * This enables type-safe config generation and runtime validation.
 */

export type PropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'function';

export interface PropertyDescriptor {
  type: PropertyType;
  default?: unknown;
  required?: boolean;
  description?: string;
  /** For string/number types - valid values */
  enum?: ReadonlyArray<string | number>;
  /** For object types - nested schema */
  schema?: Record<string, PropertyDescriptor>;
  /** Attribute name if different from property */
  attribute?: string;
  /** If true, property reflects to attribute */
  reflect?: boolean;
}

export interface MethodDescriptor {
  description?: string;
  parameters: Array<{
    name: string;
    type: PropertyType;
    required?: boolean;
    default?: unknown;
  }>;
  returns?: {
    type: PropertyType;
    description?: string;
  };
}

export interface EventDescriptor {
  description?: string;
  detail?: Record<string, PropertyType>;
  bubbles?: boolean;
  composed?: boolean;
}

export interface SlotDescriptor {
  description?: string;
  /** If true, slot can contain multiple elements */
  multiple?: boolean;
  /** Suggested/expected element types */
  accepts?: string[];
}

/**
 * Complete component manifest
 */
export interface ComponentManifest {
  /** Component tag name */
  tagName: string;

  /** Human-readable component name */
  displayName: string;

  /** Brief description */
  description: string;

  /** Reactive properties */
  properties: Record<string, PropertyDescriptor>;

  /** Public methods */
  methods?: Record<string, MethodDescriptor>;

  /** Custom events emitted */
  events?: Record<string, EventDescriptor>;

  /** Named and default slots */
  slots?: Record<string, SlotDescriptor>;

  /** CSS parts exposed for external styling */
  parts?: Record<string, string>;

  /** CSS custom properties (variables) */
  cssProperties?: Record<string, {
    description?: string;
    syntax?: string;
    default?: string;
  }>;

  /** Component version (for manifest versioning) */
  version?: string;
}

/**
 * Registry of all component manifests
 */
export interface ManifestRegistry {
  [tagName: string]: ComponentManifest;
}

/**
 * Validate a property value against its descriptor
 */
export function validateProperty(
  value: unknown,
  descriptor: PropertyDescriptor
): { valid: boolean; error?: string } {
  // Type validation
  const actualType = typeof value;
  if (actualType !== descriptor.type && value !== null && value !== undefined) {
    return {
      valid: false,
      error: `Expected type ${descriptor.type}, got ${actualType}`
    };
  }

  // Enum validation
  if (descriptor.enum && !descriptor.enum.includes(value as string | number)) {
    return {
      valid: false,
      error: `Value must be one of: ${descriptor.enum.join(', ')}`
    };
  }

  // Required validation
  if (descriptor.required && (value === null || value === undefined)) {
    return {
      valid: false,
      error: 'Property is required'
    };
  }

  return { valid: true };
}