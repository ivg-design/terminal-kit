/**
 * Component Manifest Registry
 *
 * Central registry for all component manifests.
 * Provides manifest lookup and validation.
 */

class ComponentRegistry {
	constructor() {
		/** @type {Map<string, import('../types/component-manifest').ComponentManifest>} */
		this.manifests = new Map();
	}

	/**
	 * Register a component manifest
	 * @param {import('../types/component-manifest').ComponentManifest} manifest
	 */
	register(manifest) {
		if (!manifest.tagName) {
			throw new Error('Manifest must have a tagName');
		}

		if (this.manifests.has(manifest.tagName)) {
			console.warn(`[ComponentRegistry] Overwriting manifest for ${manifest.tagName}`);
		}

		this.manifests.set(manifest.tagName, manifest);
		console.log(`[ComponentRegistry] Registered: ${manifest.tagName}`);
	}

	/**
	 * Get a component manifest
	 * @param {string} tagName
	 * @returns {import('../types/component-manifest').ComponentManifest | undefined}
	 */
	get(tagName) {
		return this.manifests.get(tagName);
	}

	/**
	 * Check if component is registered
	 * @param {string} tagName
	 * @returns {boolean}
	 */
	has(tagName) {
		return this.manifests.has(tagName);
	}

	/**
	 * Get all registered tag names
	 * @returns {string[]}
	 */
	getTagNames() {
		return Array.from(this.manifests.keys());
	}

	/**
	 * Validate a config object against its manifest
	 * @param {string} tagName
	 * @param {Record<string, unknown>} config
	 * @returns {{ valid: boolean; errors: string[] }}
	 */
	validate(tagName, config) {
		const manifest = this.get(tagName);
		if (!manifest) {
			return {
				valid: false,
				errors: [`No manifest found for component: ${tagName}`],
			};
		}

		const errors = [];

		// Validate properties
		for (const [propName, propValue] of Object.entries(config)) {
			const descriptor = manifest.properties[propName];

			if (!descriptor) {
				errors.push(`Unknown property: ${propName}`);
				continue;
			}

			// Type validation
			const actualType = typeof propValue;
			if (propValue !== null && propValue !== undefined && actualType !== descriptor.type) {
				errors.push(`Property '${propName}': expected ${descriptor.type}, got ${actualType}`);
			}

			// Enum validation
			if (descriptor.enum && !descriptor.enum.includes(propValue)) {
				errors.push(`Property '${propName}': value must be one of [${descriptor.enum.join(', ')}]`);
			}

			// Required validation
			if (descriptor.required && (propValue === null || propValue === undefined)) {
				errors.push(`Property '${propName}' is required`);
			}
		}

		// Check for missing required properties
		for (const [propName, descriptor] of Object.entries(manifest.properties)) {
			if (descriptor.required && !(propName in config)) {
				errors.push(`Missing required property: ${propName}`);
			}
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Get all properties for a component
	 * @param {string} tagName
	 * @returns {Record<string, import('../types/component-manifest').PropertyDescriptor> | null}
	 */
	getProperties(tagName) {
		const manifest = this.get(tagName);
		return manifest ? manifest.properties : null;
	}

	/**
	 * Get all methods for a component
	 * @param {string} tagName
	 * @returns {Record<string, import('../types/component-manifest').MethodDescriptor> | null}
	 */
	getMethods(tagName) {
		const manifest = this.get(tagName);
		return manifest?.methods || null;
	}

	/**
	 * Get all events for a component
	 * @param {string} tagName
	 * @returns {Record<string, import('../types/component-manifest').EventDescriptor> | null}
	 */
	getEvents(tagName) {
		const manifest = this.get(tagName);
		return manifest?.events || null;
	}

	/**
	 * Get all slots for a component
	 * @param {string} tagName
	 * @returns {Record<string, import('../types/component-manifest').SlotDescriptor> | null}
	 */
	getSlots(tagName) {
		const manifest = this.get(tagName);
		return manifest?.slots || null;
	}

	/**
	 * Clear all manifests
	 */
	clear() {
		this.manifests.clear();
	}
}

// Singleton instance
export const componentRegistry = new ComponentRegistry();

// Auto-register manifests when imported
if (typeof window !== 'undefined') {
	window.__TERMINAL_KIT_REGISTRY__ = componentRegistry;
}
