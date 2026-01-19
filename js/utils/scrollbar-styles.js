/**
 * Scrollbar Styles Utility
 *
 * Provides consistent scrollbar styling across all terminal-kit components.
 * Supports global CSS variables and per-component attribute overrides.
 *
 * Usage in components:
 * ```js
 * import { scrollbarStyles, getScrollbarClass } from '../utils/scrollbar-styles.js';
 *
 * static styles = css`
 *   ${scrollbarStyles}
 *   // ... other styles
 * `;
 * ```
 *
 * HTML attributes:
 * - scrollbar="thin|regular|wide" - Width variant
 * - scrollbar-style="bright|dim|default" - Color variant
 *
 * CSS Variables (can be set globally):
 * - --scrollbar-width: 8px
 * - --scrollbar-track: #1a1a1a
 * - --scrollbar-thumb: #333
 * - --scrollbar-thumb-hover: #00ff41
 * - --scrollbar-radius: 4px
 */

import { css } from 'lit';

/**
 * Base scrollbar CSS styles for terminal-kit components
 * Import and include in component's static styles
 */
export const scrollbarStyles = css`
	/* Base scrollbar variables (global defaults) */
	:host {
		--scrollbar-width: var(--t-scrollbar-width, 8px);
		--scrollbar-track: var(--t-scrollbar-track, var(--terminal-gray-darkest, #1a1a1a));
		--scrollbar-thumb: var(--t-scrollbar-thumb, var(--terminal-gray-dark, #333));
		--scrollbar-thumb-hover: var(--t-scrollbar-thumb-hover, var(--terminal-green, #00ff41));
		--scrollbar-radius: var(--t-scrollbar-radius, 4px);
	}

	/* Width variants */
	:host([scrollbar="thin"]) {
		--scrollbar-width: 4px;
		--scrollbar-radius: 2px;
	}

	:host([scrollbar="regular"]) {
		--scrollbar-width: 8px;
		--scrollbar-radius: 4px;
	}

	:host([scrollbar="wide"]) {
		--scrollbar-width: 12px;
		--scrollbar-radius: 6px;
	}

	/* Style variants */
	:host([scrollbar-style="bright"]) {
		--scrollbar-thumb: var(--terminal-green, #00ff41);
		--scrollbar-thumb-hover: var(--terminal-green-bright, #33ff66);
	}

	:host([scrollbar-style="dim"]) {
		--scrollbar-thumb: #222;
		--scrollbar-thumb-hover: #444;
	}

	:host([scrollbar-style="default"]) {
		--scrollbar-thumb: var(--terminal-gray-dark, #333);
		--scrollbar-thumb-hover: var(--terminal-green, #00ff41);
	}

	:host([scrollbar-style="amber"]) {
		--scrollbar-thumb: var(--terminal-amber, #ffb000);
		--scrollbar-thumb-hover: #ffcc33;
	}

	:host([scrollbar-style="cyan"]) {
		--scrollbar-thumb: var(--terminal-cyan, #00ffff);
		--scrollbar-thumb-hover: #33ffff;
	}

	/* Hidden scrollbar option */
	:host([scrollbar="hidden"]) {
		--scrollbar-width: 0px;
	}

	/* Apply to webkit scrollbars */
	::-webkit-scrollbar {
		width: var(--scrollbar-width);
		height: var(--scrollbar-width);
	}

	::-webkit-scrollbar-track {
		background: var(--scrollbar-track);
		border-radius: var(--scrollbar-radius);
	}

	::-webkit-scrollbar-thumb {
		background: var(--scrollbar-thumb);
		border-radius: var(--scrollbar-radius);
		border: 1px solid var(--scrollbar-track);
		transition: background 0.2s ease;
	}

	::-webkit-scrollbar-thumb:hover {
		background: var(--scrollbar-thumb-hover);
	}

	::-webkit-scrollbar-corner {
		background: var(--scrollbar-track);
	}

	/* Firefox scrollbar styling */
	* {
		scrollbar-width: thin;
		scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
	}

	:host([scrollbar="wide"]) * {
		scrollbar-width: auto;
	}

	:host([scrollbar="hidden"]) * {
		scrollbar-width: none;
	}
`;

/**
 * Scrollbar properties definition for components
 * Add to static properties to enable scrollbar attribute support
 */
export const scrollbarProperties = {
	/**
	 * Scrollbar width variant
	 * @property scrollbar
	 * @type {String}
	 * @default 'regular'
	 * @attribute scrollbar
	 * @reflects true
	 */
	scrollbar: {
		type: String,
		reflect: true
	},

	/**
	 * Scrollbar color style variant
	 * @property scrollbarStyle
	 * @type {String}
	 * @default 'default'
	 * @attribute scrollbar-style
	 * @reflects true
	 */
	scrollbarStyle: {
		type: String,
		attribute: 'scrollbar-style',
		reflect: true
	}
};

/**
 * Default scrollbar property values for constructor
 */
export const scrollbarDefaults = {
	scrollbar: 'regular',
	scrollbarStyle: 'default'
};

export default scrollbarStyles;
