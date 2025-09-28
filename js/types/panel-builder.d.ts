/**
 * PanelBuilder Configuration Types
 *
 * Type-safe configuration objects for building panel layouts
 */

import { TemplateResult } from 'lit';

/**
 * Base configuration for any component
 */
export interface BaseComponentConfig {
  /** Component type (tag name) */
  type: string;

  /** Unique identifier */
  id?: string;

  /** CSS classes to apply */
  classes?: string[];

  /** Inline styles */
  style?: Partial<CSSStyleDeclaration> | string;

  /** Component-specific properties */
  props?: Record<string, unknown>;

  /** Event handlers */
  events?: Record<string, (event: Event) => void>;
}

/**
 * Panel-specific configuration
 */
export interface PanelConfig extends BaseComponentConfig {
  type: 't-pnl';

  /** Panel title */
  title?: string;

  /** Panel variant */
  variant?: 'standard' | 'headless';

  /** Can panel collapse */
  collapsible?: boolean;

  /** Initially collapsed */
  collapsed?: boolean;

  /** Compact size (20px header) */
  compact?: boolean;

  /** Large size (36px header) */
  large?: boolean;

  /** Show loading state */
  loading?: boolean;

  /** Enable resizing */
  resizable?: boolean;

  /** Enable dragging */
  draggable?: boolean;

  /** Icon SVG */
  icon?: string;

  /** Action buttons in header */
  actions?: ComponentConfig[];

  /** Panel body content */
  content?: (ComponentConfig | string | TemplateResult)[];

  /** Footer content */
  footer?: (ComponentConfig | string | TemplateResult)[];

  /** Is footer collapsed */
  footerCollapsed?: boolean;

  /** Nested panels */
  panels?: PanelConfig[];
}

/**
 * Button configuration
 */
export interface ButtonConfig extends BaseComponentConfig {
  type: 't-btn';

  /** Button text */
  label?: string;

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'toggle';

  /** Display type */
  buttonType?: 'text' | 'icon' | 'icon-text';

  /** Button size */
  size?: 'xs' | 'small' | 'sm' | '' | 'large' | 'lg';

  /** Disabled state */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Icon SVG */
  icon?: string;

  /** Toggle state */
  toggleState?: boolean;

  /** Icon when toggle on */
  iconOn?: string;

  /** Icon when toggle off */
  iconOff?: string;
}

/**
 * Input configuration
 */
export interface InputConfig extends BaseComponentConfig {
  type: 't-inp';

  /** Input type */
  inputType?: 'text' | 'password' | 'email' | 'number' | 'url' | 'tel';

  /** Placeholder text */
  placeholder?: string;

  /** Input value */
  value?: string | number;

  /** Disabled state */
  disabled?: boolean;

  /** Read-only state */
  readonly?: boolean;

  /** Required field */
  required?: boolean;

  /** Min value (for number) */
  min?: number;

  /** Max value (for number) */
  max?: number;

  /** Pattern regex */
  pattern?: string;
}

/**
 * Slider configuration
 */
export interface SliderConfig extends BaseComponentConfig {
  type: 't-sld';

  /** Slider label */
  label?: string;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Current value */
  value?: number;

  /** Step increment */
  step?: number;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Toggle configuration
 */
export interface ToggleConfig extends BaseComponentConfig {
  type: 't-tog';

  /** Toggle label */
  label?: string;

  /** Checked state */
  checked?: boolean;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Dropdown configuration
 */
export interface DropdownConfig extends BaseComponentConfig {
  type: 't-drp';

  /** Placeholder text */
  placeholder?: string;

  /** Selected value */
  value?: string | number;

  /** Dropdown options */
  options?: Array<{
    label: string;
    value: string | number;
    disabled?: boolean;
  }>;

  /** Enable search */
  searchable?: boolean;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Color picker configuration
 */
export interface ColorPickerConfig extends BaseComponentConfig {
  type: 't-clr';

  /** Current color */
  value?: string;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Textarea configuration
 */
export interface TextareaConfig extends BaseComponentConfig {
  type: 't-textarea';

  /** Placeholder text */
  placeholder?: string;

  /** Textarea value */
  value?: string;

  /** Number of rows */
  rows?: number;

  /** Disabled state */
  disabled?: boolean;

  /** Read-only state */
  readonly?: boolean;

  /** Required field */
  required?: boolean;
}

/**
 * Loader configuration
 */
export interface LoaderConfig extends BaseComponentConfig {
  type: 't-ldr';

  /** Loader type */
  loaderType?: 'spinner' | 'dots' | 'bars';

  /** Loader size */
  size?: 'small' | 'medium' | 'large';

  /** Custom color */
  color?: string;
}

/**
 * Union type of all component configs
 */
export type ComponentConfig =
  | PanelConfig
  | ButtonConfig
  | InputConfig
  | SliderConfig
  | ToggleConfig
  | DropdownConfig
  | ColorPickerConfig
  | TextareaConfig
  | LoaderConfig
  | BaseComponentConfig;

/**
 * PanelBuilder options
 */
export interface PanelBuilderOptions {
  /** Validate configs against manifests */
  validate?: boolean;

  /** Throw errors on validation failure */
  strict?: boolean;

  /** Enable debug logging */
  debug?: boolean;

  /** Custom component registry */
  registry?: Map<string, unknown>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
  warnings?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Hook registry for component lifecycle
 */
export interface HookRegistry {
  /** Called before component render */
  beforeRender?: (config: ComponentConfig) => void;

  /** Called after component render */
  afterRender?: (config: ComponentConfig, element: HTMLElement) => void;

  /** Called on config validation */
  onValidate?: (config: ComponentConfig, result: ValidationResult) => void;

  /** Called on error */
  onError?: (error: Error, config: ComponentConfig) => void;
}