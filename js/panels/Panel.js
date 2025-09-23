/**
 * Base Panel Class
 * Foundation for all UI panels with state management
 */
import { stateManager } from '../core/StateManager.js';

export class Panel {
	constructor(id, options = {}) {
		this.id = id;
		this.element = null;
		this.contentElement = null;
		this.isCollapsed = false;
		this.isVisible = true;
		this.isDragging = false;
		this.isResizing = false;

		// Default options
		this.options = {
			title: options.title || id,
			collapsible: options.collapsible !== false,
			closable: options.closable !== false,
			resizable: options.resizable !== false,
			draggable: options.draggable !== false,
			minWidth: options.minWidth || 200,
			minHeight: options.minHeight || 150,
			defaultWidth: options.defaultWidth || 300,
			defaultHeight: options.defaultHeight || 400,
			position: options.position || { x: 0, y: 0 },
			statePath: options.statePath || `ui.panels.${id}`,
			className: options.className || '',
			...options,
		};

		// Subscribe to state changes
		this.unsubscribe = stateManager.subscribe(this.options.statePath, (state) => {
			if (state) {
				this.syncWithState(state);
			}
		});

		// Initialize from state
		const savedState = stateManager.get(this.options.statePath);
		if (savedState instanceof Map) {
			this.isVisible = savedState.get('visible') !== false;
			this.isCollapsed = savedState.get('collapsed') === true;
		}
	}

	/**
	 * Create panel DOM element
	 */
	create() {
		if (this.element) return this.element;

		this.element = document.createElement('div');
		this.element.className = `panel ${this.options.className}`.trim();
		this.element.id = `panel-${this.id}`;
		this.element.dataset.panelId = this.id;

		// Set initial styles
		this.element.style.width = `${this.options.defaultWidth}px`;
		this.element.style.height = `${this.options.defaultHeight}px`;
		if (this.options.position) {
			this.element.style.left = `${this.options.position.x}px`;
			this.element.style.top = `${this.options.position.y}px`;
		}

		// Create header
		const header = this.createHeader();
		this.element.appendChild(header);

		// Create content area
		const content = document.createElement('div');
		content.className = 'panel-content';
		this.contentElement = content;
		this.element.appendChild(content);

		// Add resize handle if resizable
		if (this.options.resizable) {
			const resizeHandle = document.createElement('div');
			resizeHandle.className = 'panel-resize-handle';
			this.element.appendChild(resizeHandle);
			this.attachResizeHandlers(resizeHandle);
		}

		// Apply visibility
		if (!this.isVisible) {
			this.element.classList.add('hidden');
		}

		if (this.isCollapsed) {
			this.element.classList.add('collapsed');
		}

		// Add to DOM
		this.mount();

		// Lifecycle hook
		this.onCreate();

		return this.element;
	}

	/**
	 * Create panel header
	 */
	createHeader() {
		const header = document.createElement('div');
		header.className = 'panel-header';

		// Title
		const title = document.createElement('span');
		title.className = 'panel-title';
		title.textContent = this.options.title;
		header.appendChild(title);

		// Controls
		const controls = document.createElement('div');
		controls.className = 'panel-controls';

		if (this.options.collapsible) {
			const collapseBtn = document.createElement('button');
			collapseBtn.className = 'btn btn-icon panel-collapse';
			collapseBtn.innerHTML = this.isCollapsed ? '▶' : '▼';
			collapseBtn.onclick = () => this.toggleCollapse();
			controls.appendChild(collapseBtn);
		}

		if (this.options.closable) {
			const closeBtn = document.createElement('button');
			closeBtn.className = 'btn btn-icon panel-close';
			closeBtn.innerHTML = '×';
			closeBtn.onclick = () => this.close();
			controls.appendChild(closeBtn);
		}

		header.appendChild(controls);

		// Make header draggable
		if (this.options.draggable) {
			this.attachDragHandlers(header);
		}

		return header;
	}

	/**
	 * Attach drag handlers
	 */
	attachDragHandlers(header) {
		let startX, startY, startLeft, startTop;

		const handleMouseDown = (e) => {
			if (e.target.tagName === 'BUTTON') return;

			this.isDragging = true;
			startX = e.clientX;
			startY = e.clientY;
			startLeft = this.element.offsetLeft;
			startTop = this.element.offsetTop;

			this.element.classList.add('dragging');
			document.body.style.cursor = 'move';
			e.preventDefault();
		};

		const handleMouseMove = (e) => {
			if (!this.isDragging) return;

			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			this.element.style.left = `${startLeft + dx}px`;
			this.element.style.top = `${startTop + dy}px`;
		};

		const handleMouseUp = () => {
			if (!this.isDragging) return;

			this.isDragging = false;
			this.element.classList.remove('dragging');
			document.body.style.cursor = '';

			// Save position to state
			this.savePosition();
		};

		header.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		// Store handlers for cleanup
		this._dragHandlers = { handleMouseMove, handleMouseUp };
	}

	/**
	 * Attach resize handlers
	 */
	attachResizeHandlers(handle) {
		let startX, startY, startWidth, startHeight;

		const handleMouseDown = (e) => {
			this.isResizing = true;
			startX = e.clientX;
			startY = e.clientY;
			startWidth = this.element.offsetWidth;
			startHeight = this.element.offsetHeight;

			this.element.classList.add('resizing');
			e.preventDefault();
		};

		const handleMouseMove = (e) => {
			if (!this.isResizing) return;

			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			const newWidth = Math.max(this.options.minWidth, startWidth + dx);
			const newHeight = Math.max(this.options.minHeight, startHeight + dy);

			this.element.style.width = `${newWidth}px`;
			this.element.style.height = `${newHeight}px`;

			this.onResize();
		};

		const handleMouseUp = () => {
			if (!this.isResizing) return;

			this.isResizing = false;
			this.element.classList.remove('resizing');

			// Save size to state
			this.saveSize();
		};

		handle.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		// Store handlers for cleanup
		this._resizeHandlers = { handleMouseMove, handleMouseUp };
	}

	/**
	 * Toggle collapse state
	 */
	toggleCollapse() {
		this.isCollapsed = !this.isCollapsed;
		this.element.classList.toggle('collapsed');

		const collapseBtn = this.element.querySelector('.panel-collapse');
		if (collapseBtn) {
			collapseBtn.innerHTML = this.isCollapsed ? '▶' : '▼';
		}

		stateManager.set(`${this.options.statePath}.collapsed`, this.isCollapsed);
	}

	/**
	 * Show panel
	 */
	show() {
		this.isVisible = true;
		if (this.element) {
			this.element.classList.remove('hidden');
		}
		stateManager.set(`${this.options.statePath}.visible`, true);
		this.onShow();
	}

	/**
	 * Hide panel
	 */
	hide() {
		this.isVisible = false;
		if (this.element) {
			this.element.classList.add('hidden');
		}
		stateManager.set(`${this.options.statePath}.visible`, false);
		this.onHide();
	}

	/**
	 * Close panel
	 */
	close() {
		this.hide();
		this.onClose();
	}

	/**
	 * Save position to state
	 */
	savePosition() {
		const position = {
			x: this.element.offsetLeft,
			y: this.element.offsetTop,
		};
		stateManager.set(`${this.options.statePath}.position`, position);
	}

	/**
	 * Save size to state
	 */
	saveSize() {
		const size = {
			width: this.element.offsetWidth,
			height: this.element.offsetHeight,
		};
		stateManager.set(`${this.options.statePath}.size`, size);
	}

	/**
	 * Sync with state changes
	 */
	syncWithState(state) {
		if (!this.element) return;

		if (state instanceof Map) {
			const visible = state.get('visible');
			const collapsed = state.get('collapsed');

			if (visible !== undefined && visible !== this.isVisible) {
				if (visible) {
					this.show();
				} else {
					this.hide();
				}
			}

			if (collapsed !== undefined && collapsed !== this.isCollapsed) {
				this.toggleCollapse();
			}
		}
	}

	/**
	 * Set panel content
	 */
	setContent(content) {
		if (!this.contentElement) return;

		if (typeof content === 'string') {
			this.contentElement.innerHTML = content;
		} else if (content instanceof HTMLElement) {
			this.contentElement.innerHTML = '';
			this.contentElement.appendChild(content);
		}
	}

	/**
	 * Mount panel to DOM
	 */
	mount(parent = null) {
		const target = parent || this.options.parent || document.body;
		if (this.element && !this.element.parentNode) {
			target.appendChild(this.element);
			this.onMount();
		}
	}

	/**
	 * Unmount panel from DOM
	 */
	unmount() {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this.onUnmount();
		}
	}

	/**
	 * Lifecycle hooks
	 */
	onCreate() {}
	onShow() {}
	onHide() {}
	onClose() {}
	onResize() {}
	onMove() {}
	onMount() {}
	onUnmount() {}

	/**
	 * Destroy panel
	 */
	destroy() {
		// Unsubscribe from state
		if (this.unsubscribe) {
			this.unsubscribe();
		}

		// Remove event handlers
		if (this._dragHandlers) {
			document.removeEventListener('mousemove', this._dragHandlers.handleMouseMove);
			document.removeEventListener('mouseup', this._dragHandlers.handleMouseUp);
		}

		if (this._resizeHandlers) {
			document.removeEventListener('mousemove', this._resizeHandlers.handleMouseMove);
			document.removeEventListener('mouseup', this._resizeHandlers.handleMouseUp);
		}

		// Remove from DOM
		
		this.unmount();

		// Clear references
		this.element = null;
		this.contentElement = null;
	}
}
