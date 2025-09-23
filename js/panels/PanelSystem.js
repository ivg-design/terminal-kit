/**
 * Panel System
 * Manages all panels and their interactions
 */
import { stateManager } from '../core/StateManager.js';
import logger from '../utils/logger.js';
import { Panel } from './Panel.js';

export class PanelSystem {
	constructor() {
		this.panels = new Map();
		this.activePanel = null;
		this.container = null;
		this.initialized = false;

		// Subscribe to panel state changes
		this.unsubscribe = stateManager.subscribe('ui.panels', (state) => {
			this.syncPanels(state);
		});
	}

	/**
	 * Initialize the panel system
	 */
	init(container = document.body) {
		if (this.initialized) return;

		this.container = container;

		// Create panels container
		const panelContainer = document.createElement('div');
		panelContainer.className = 'panels-container';
		panelContainer.id = 'panels-container';
		this.container.appendChild(panelContainer);
		this.panelContainer = panelContainer;

		this.initialized = true;
		logger.info('[PanelSystem] Initialized');
	}

	/**
	 * Register a panel
	 */
	register(panel) {
		if (!(panel instanceof Panel)) {
			throw new Error('Panel must be an instance of Panel class');
		}

		this.panels.set(panel.id, panel);
		logger.info(`[PanelSystem] Registered panel: ${panel.id}`);

		return panel;
	}

	/**
	 * Create and register a panel
	 */
	createPanel(id, options = {}) {
		const panel = new Panel(id, {
			...options,
			parent: this.panelContainer,
		});

		this.register(panel);
		panel.create();

		return panel;
	}

	/**
	 * Get a panel by ID
	 */
	getPanel(id) {
		return this.panels.get(id);
	}

	/**
	 * Show a panel
	 */
	showPanel(id) {
		const panel = this.panels.get(id);
		if (panel) {
			panel.show();
			this.setActivePanel(panel);
		}
	}

	/**
	 * Hide a panel
	 */
	hidePanel(id) {
		const panel = this.panels.get(id);
		if (panel) {
			panel.hide();
			if (this.activePanel === panel) {
				this.activePanel = null;
			}
		}
	}

	/**
	 * Toggle panel visibility
	 */
	togglePanel(id) {
		const panel = this.panels.get(id);
		if (panel) {
			if (panel.isVisible) {
				this.hidePanel(id);
			} else {
				this.showPanel(id);
			}
		}
	}

	/**
	 * Set active panel
	 */
	setActivePanel(panel) {
		// Remove active class from previous panel
		if (this.activePanel && this.activePanel.element) {
			this.activePanel.element.classList.remove('panel-active');
		}

		// Set new active panel
		this.activePanel = panel;
		if (panel && panel.element) {
			panel.element.classList.add('panel-active');

			// Bring to front
			this.bringToFront(panel);
		}
	}

	/**
	 * Bring panel to front
	 */
	bringToFront(panel) {
		if (!panel || !panel.element) return;

		// Get all panel elements
		const allPanels = Array.from(this.panels.values())
			.map((p) => p.element)
			.filter(Boolean);

		// Calculate max z-index
		const maxZIndex = Math.max(0, ...allPanels.map((el) => parseInt(el.style.zIndex || 0)));

		// Set new z-index
		panel.element.style.zIndex = maxZIndex + 1;
	}

	/**
	 * Arrange panels in grid
	 */
	arrangeGrid(columns = 2) {
		const visiblePanels = Array.from(this.panels.values()).filter(
			(p) => p.isVisible && p.element
		);

		if (visiblePanels.length === 0) return;

		const containerWidth = this.panelContainer.offsetWidth;
		const containerHeight = this.panelContainer.offsetHeight;

		const panelWidth = Math.floor(containerWidth / columns);
		const rows = Math.ceil(visiblePanels.length / columns);
		const panelHeight = Math.floor(containerHeight / rows);

		visiblePanels.forEach((panel, index) => {
			const col = index % columns;
			const row = Math.floor(index / columns);

			panel.element.style.left = `${col * panelWidth}px`;
			panel.element.style.top = `${row * panelHeight}px`;
			panel.element.style.width = `${panelWidth - 10}px`;
			panel.element.style.height = `${panelHeight - 10}px`;

			// Save new position and size
			panel.savePosition();
			panel.saveSize();
		});
	}

	/**
	 * Cascade panels
	 */
	cascade() {
		const visiblePanels = Array.from(this.panels.values()).filter(
			(p) => p.isVisible && p.element
		);

		if (visiblePanels.length === 0) return;

		const offset = 30;

		visiblePanels.forEach((panel, index) => {
			panel.element.style.left = `${index * offset}px`;
			panel.element.style.top = `${index * offset}px`;

			// Save new position
			panel.savePosition();
		});
	}

	/**
	 * Reset all panels to default positions
	 */
	resetPositions() {
		this.panels.forEach((panel) => {
			if (panel.element && panel.options.position) {
				panel.element.style.left = `${panel.options.position.x}px`;
				panel.element.style.top = `${panel.options.position.y}px`;
				panel.savePosition();
			}
		});
	}

	/**
	 * Show all panels
	 */
	showAll() {
		this.panels.forEach((panel) => panel.show());
	}

	/**
	 * Hide all panels
	 */
	hideAll() {
		this.panels.forEach((panel) => panel.hide());
	}

	/**
	 * Close all panels (alias for hideAll)
	 */
	closeAll() {
		this.hideAll();
	}

	/**
	 * Save current panel state
	 */
	saveState() {
		const state = {};
		this.panels.forEach((panel, id) => {
			state[id] = {
				visible: panel.isVisible,
				collapsed: panel.isCollapsed,
				position: panel.element ? {
					x: panel.element.offsetLeft,
					y: panel.element.offsetTop
				} : panel.options.position,
				size: panel.element ? {
					width: panel.element.offsetWidth,
					height: panel.element.offsetHeight
				} : { width: panel.options.defaultWidth, height: panel.options.defaultHeight }
			};
		});
		return state;
	}

	/**
	 * Restore panel state
	 */
	restoreState(state) {
		Object.entries(state).forEach(([id, panelState]) => {
			let panel = this.panels.get(id);
			
			// Create panel if it doesn't exist
			if (!panel && panelState) {
				panel = this.createPanel(id, {
					title: id,
					position: panelState.position,
					size: panelState.size
				});
			}
			
			if (panel) {
				// Restore position
				if (panelState.position && panel.element) {
					panel.element.style.left = `${panelState.position.x}px`;
					panel.element.style.top = `${panelState.position.y}px`;
				}
				
				// Restore size
				if (panelState.size && panel.element) {
					panel.element.style.width = `${panelState.size.width}px`;
					panel.element.style.height = `${panelState.size.height}px`;
				}
				
				// Restore visibility
				if (panelState.visible) {
					panel.show();
				} else {
					panel.hide();
				}
				
				// Restore collapsed state
				if (panelState.collapsed && !panel.isCollapsed) {
					panel.toggleCollapse();
				} else if (!panelState.collapsed && panel.isCollapsed) {
					panel.toggleCollapse();
				}
			}
		});
	}

	/**
	 * Sync panels with state
	 */
	syncPanels(state) {
		if (!(state instanceof Map)) return;

		state.forEach((panelState, panelId) => {
			const panel = this.panels.get(panelId);
			if (panel && panelState instanceof Map) {
				panel.syncWithState(panelState);
			}
		});
	}

	/**
	 * Get panel states
	 */
	getStates() {
		const states = {};
		this.panels.forEach((panel, id) => {
			states[id] = {
				visible: panel.isVisible,
				collapsed: panel.isCollapsed,
				position: panel.element
					? {
							x: panel.element.offsetLeft,
							y: panel.element.offsetTop,
						}
					: null,
				size: panel.element
					? {
							width: panel.element.offsetWidth,
							height: panel.element.offsetHeight,
						}
					: null,
			};
		});
		return states;
	}

	/**
	 * Save all panel states
	 */
	saveStates() {
		this.panels.forEach((panel) => {
			if (panel.element) {
				panel.savePosition();
				panel.saveSize();
			}
		});
	}

	/**
	 * Destroy a panel
	 */
	destroyPanel(id) {
		const panel = this.panels.get(id);
		if (panel) {
			panel.destroy();
			this.panels.delete(id);
			logger.info(`[PanelSystem] Destroyed panel: ${id}`);
		}
	}

	/**
	 * Destroy all panels
	 */
	destroyAll() {
		this.panels.forEach((panel) => panel.destroy());
		this.panels.clear();
		this.activePanel = null;
	}

	/**
	 * Destroy the panel system
	 */
	destroy() {
		// Unsubscribe from state
		if (this.unsubscribe) {
			this.unsubscribe();
		}

		// Destroy all panels
		this.destroyAll();

		// Remove container
		if (this.panelContainer && this.panelContainer.parentNode) {
			this.panelContainer.parentNode.removeChild(this.panelContainer);
		}

		this.initialized = false;
		logger.info('[PanelSystem] Destroyed');
	}
}

// Create singleton instance
export const panelSystem = new PanelSystem();
