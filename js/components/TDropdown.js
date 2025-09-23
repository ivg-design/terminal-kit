/**
 * TerminalDropdown Web Component
 * A nested dropdown with folder structure and search
 * Uses existing dropdown.css styles
 */

import { TComponent } from './TComponent.js';
import {
	caretDownIcon,
	caretRightIcon,
	folderIcon,
	folderOpenIcon,
	fileIcon,
	infoIcon,
	magnifyingGlassIcon,
} from '../utils/phosphor-icons.js';

export class TDropdown extends TComponent {
	static openDropdowns = new Set();

	static get observedAttributes() {
		return ['placeholder', 'disabled', 'value', 'width', 'search', 'icons'];
	}

	constructor() {
		super();

		// Initialize props
		this.setProps({
			placeholder: 'Select animation...',
			disabled: false,
			value: '',
			width: '300px',
			data: null,
			metadata: {},
			search: true,
			icons: true,
		});

		// Internal state
		this.isOpen = false;
		this.folderStates = {};
		this.selectedValue = '';
		this.selectedMetadata = null;
		this.marqueeTimeout = null;

		// Bind methods
		this.toggle = this.toggle.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.handleSearch = this.debounce(this.handleSearch.bind(this), 200);
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'placeholder':
				this.setProp('placeholder', newValue || 'Select...');
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'value':
				this.setValue(newValue);
				break;
			case 'width':
				this.setProp('width', newValue || '300px');
				break;
			case 'search':
				this.setProp('search', newValue !== 'false');
				break;
			case 'icons':
				this.setProp('icons', newValue !== 'false');
				break;
		}
	}

	template() {
		const { placeholder, disabled, width, search } = this._props;
		const displayText = this.selectedValue
			? this.getDisplayName(this.selectedValue)
			: placeholder;

		return `
      <div class="nested-dropdown-container ${disabled ? 'disabled' : ''}" style="width: ${width}; max-width: ${width};">
        <button class="nested-dropdown-button ${this.isOpen ? 'active' : ''}" ${disabled ? 'disabled' : ''}>
          <span class="dropdown-label" title="${displayText}" style="text-transform: none;">
            <span>${displayText}</span>
          </span>
          <span class="dropdown-arrow">${caretDownIcon}</span>
        </button>

        <div class="nested-dropdown-panel ${this.isOpen ? '' : 'hidden'}">
          ${search ? `
          <div class="dropdown-search-wrapper">
            <span class="search-icon">${magnifyingGlassIcon}</span>
            <input
              type="text"
              class="dropdown-search"
              placeholder="Search..."
            />
          </div>` : ''}
          <div class="dropdown-tree"></div>
        </div>
      </div>
    `;
	}

	afterRender() {
		const button = this.$('.nested-dropdown-button');
		const searchInput = this.$('.dropdown-search');
		const panel = this.$('.nested-dropdown-panel');

		// Button click - use arrow function to preserve context
		if (button) {
			this.addListener(button, 'click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.toggle();
			});
		}

		// Search functionality
		if (searchInput) {
			this.addListener(searchInput, 'input', (e) => this.handleSearch(e.target.value));
			this.addListener(searchInput, 'click', (e) => e.stopPropagation());
		}

		// Prevent panel clicks from closing
		if (panel) {
			this.addListener(panel, 'click', (e) => e.stopPropagation());
		}

		// Render tree if data exists
		if (this.getProp('data')) {
			this.renderTree();
		}

		// Restore selected value
		if (this.selectedValue) {
			this.highlightSelected();
		}
	}

	onMount() {
		// Add global click listener
		this.addListener(document, 'click', this.handleOutsideClick);
	}

	handleOutsideClick(e) {
		if (!this.contains(e.target)) {
			this.close();
		}
	}

	toggle() {
		if (this.getProp('disabled')) return;
		this.isOpen ? this.close() : this.open();
	}

	open() {
		if (this.getProp('disabled')) return;

		// Clear any pending marquee timeout when opening
		if (this.marqueeTimeout) {
			clearTimeout(this.marqueeTimeout);
			this.marqueeTimeout = null;
		}

		// Close all other dropdowns
		TDropdown.openDropdowns.forEach(dropdown => {
			if (dropdown !== this) {
				dropdown.close();
			}
		});

		this.isOpen = true;
		TDropdown.openDropdowns.add(this);
		this.render();

		// Focus search if enabled
		if (this.getProp('search')) {
			const searchInput = this.$('.dropdown-search');
			if (searchInput) {
				setTimeout(() => searchInput.focus(), 0);
			}
		}
	}

	close() {
		this.isOpen = false;
		TDropdown.openDropdowns.delete(this);

		// Clear search if exists
		if (this.getProp('search')) {
			const searchInput = this.$('.dropdown-search');
			if (searchInput) {
				searchInput.value = '';
			}
		}

		this.render();

		// Clear any existing marquee timeout
		if (this.marqueeTimeout) {
			clearTimeout(this.marqueeTimeout);
			this.marqueeTimeout = null;
		}

		// After render, check if button label needs marquee with 2s delay
		this.marqueeTimeout = setTimeout(() => {
			const label = this.$('.dropdown-label');
			if (label && this.selectedValue) {
				// Check if text overflows
				const displayName = this.getDisplayName(this.selectedValue);
				if (displayName.length > 25) {
					// Use character count for consistency
					label.classList.add('marquee');
					// Create two spans for better control
					const span = label.querySelector('span');
					if (span) {
						span.innerHTML = `
              <span class="marquee-text">${displayName}</span>
              <span class="marquee-text">${displayName}</span>
            `;
					}
				}
			}
			this.marqueeTimeout = null;
		}, 2000); // 2 second delay before marquee starts
	}

	loadData(folderManifest) {
		this.setProp('data', folderManifest.structure || folderManifest);
		this.renderTree();
	}

	setMetadata(metadata) {
		this.setProp('metadata', metadata);
		this.renderTree();
	}

	renderTree(structure = this.getProp('data'), parentElement = null, path = '') {
		if (!structure) return;

		const container = parentElement || this.$('.dropdown-tree');
		if (!container) return;

		container.innerHTML = '';

		// Render folders first
		for (const [folderName, folderData] of Object.entries(structure.folders || {})) {
			const folderPath = path ? `${path}/${folderName}` : folderName;
			const folderElement = this.createFolderElement(folderName, folderData, folderPath);
			container.appendChild(folderElement);
		}

		// Render files
		for (const fileName of structure.files || []) {
			const filePath = path ? `${path}/${fileName}` : fileName;
			const fileElement = this.createFileElement(fileName, filePath);
			container.appendChild(fileElement);
		}
	}

	createFolderElement(name, data, path) {
		const folder = document.createElement('div');
		folder.className = 'tree-folder';

		const header = document.createElement('div');
		header.className = 'folder-header';

		const isExpanded = this.folderStates[path] === true;
		const count = this.countAnimations(data);
		const showIcons = this.getProp('icons');

		header.innerHTML = `
      <span class="folder-arrow">${isExpanded ? caretDownIcon : caretRightIcon}</span>
      ${showIcons ? `<span class="folder-icon">${isExpanded ? folderOpenIcon : folderIcon}</span>` : ''}
      <span class="folder-name">${name}</span>
      <span class="folder-count">${count}</span>
    `;

		const content = document.createElement('div');
		content.className = 'folder-content';
		if (!isExpanded) content.classList.add('collapsed');

		// Render children
		this.renderTree(data, content, path);

		// Click handler
		this.addListener(header, 'click', (e) => {
			e.stopPropagation();
			this.toggleFolder(path, header, content);
		});

		folder.appendChild(header);
		folder.appendChild(content);

		return folder;
	}

	createFileElement(name, path) {
		const file = document.createElement('div');
		file.className = 'tree-file';
		file.dataset.value = path;

		// Preserve original filename formatting
		const displayName = name.replace('.riv', '');

		// Check for metadata
		const metadata = this.getProp('metadata');
		const hasMetadata = metadata && metadata[name];

		// Check if text is long (more than 20 characters)
		const isLongText = displayName.length > 20;

		const showIcons = this.getProp('icons');

		file.innerHTML = `
      ${showIcons ? `<span class="file-icon">${fileIcon}</span>` : ''}
      <span class="file-name ${isLongText ? 'long-text' : ''}" title="${displayName}">
        <span class="file-name-text">${displayName}</span>
      </span>
      ${hasMetadata ? `<span class="info-icon" title="${metadata[name].description || 'Has metadata'}">${infoIcon}</span>` : ''}
    `;

		// Store metadata
		if (hasMetadata) {
			file.dataset.metadata = JSON.stringify(metadata[name]);
		}

		// Click handler
		this.addListener(file, 'click', () => {
			this.selectFile(path, displayName);
		});

		// Mark as selected if matches current value
		if (path === this.selectedValue) {
			file.classList.add('selected');
		}

		return file;
	}

	toggleFolder(path, header, content) {
		const isExpanded = !content.classList.contains('collapsed');
		this.folderStates[path] = !isExpanded;

		if (isExpanded) {
			content.classList.add('collapsed');
			header.querySelector('.folder-arrow').innerHTML = caretRightIcon;
			header.querySelector('.folder-icon').innerHTML = folderIcon;
		} else {
			content.classList.remove('collapsed');
			header.querySelector('.folder-arrow').innerHTML = caretDownIcon;
			header.querySelector('.folder-icon').innerHTML = folderOpenIcon;
		}
	}

	selectFile(value, displayName) {
		this.selectedValue = value;

		// Update button label - we'll handle marquee in close() method
		const label = this.$('.dropdown-label');
		if (label) {
			const span = label.querySelector('span');
			if (span) {
				span.textContent = displayName;
			}
			label.title = displayName;
			label.classList.remove('marquee'); // Remove marquee during selection
		}

		// Store metadata
		const fileElement = this.$(`[data-value="${value}"]`);
		if (fileElement && fileElement.dataset.metadata) {
			this.selectedMetadata = JSON.parse(fileElement.dataset.metadata);
		} else {
			this.selectedMetadata = null;
		}

		// Highlight selected
		this.highlightSelected();

		// Close dropdown
		this.close();

		// Emit change event
		this.emit('dropdown-change', {
			value,
			displayName,
			metadata: this.selectedMetadata,
		});
	}

	highlightSelected() {
		this.$$('.tree-file').forEach((el) => {
			el.classList.remove('selected');
			if (el.dataset.value === this.selectedValue) {
				el.classList.add('selected');
			}
		});
	}

	handleSearch(searchTerm) {
		const term = searchTerm.toLowerCase();

		if (!term) {
			// No search - restore tree
			this.renderTree();
			this.highlightSelected();
			return;
		}

		// Show flat list of matching files
		const container = this.$('.dropdown-tree');
		if (!container) return;

		container.innerHTML = '';

		// Collect matching files
		const matchingFiles = [];
		this.collectMatchingFiles(this.getProp('data'), '', term, matchingFiles);

		// Render matches
		if (matchingFiles.length === 0) {
			container.innerHTML = `
        <div class="no-results">No matching animations found</div>
      `;
		} else {
			matchingFiles.forEach(({ name, path }) => {
				const fileElement = this.createFileElement(name, path);
				container.appendChild(fileElement);
			});
		}
	}

	collectMatchingFiles(structure, parentPath, searchTerm, results) {
		if (!structure) return;

		// Search files
		for (const fileName of structure.files || []) {
			const displayName = fileName.replace('.riv', '').replace(/_/g, ' ').toLowerCase();
			if (displayName.includes(searchTerm)) {
				const filePath = parentPath ? `${parentPath}/${fileName}` : fileName;
				results.push({ name: fileName, path: filePath });
			}
		}

		// Recursively search folders
		for (const [folderName, folderData] of Object.entries(structure.folders || {})) {
			const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
			this.collectMatchingFiles(folderData, folderPath, searchTerm, results);
		}
	}

	countAnimations(structure) {
		let count = (structure.files || []).length;
		for (const folder of Object.values(structure.folders || {})) {
			count += this.countAnimations(folder);
		}
		return count;
	}

	getDisplayName(path) {
		if (!path) return '';
		const parts = path.split('/');
		const fileName = parts[parts.length - 1];
		// Preserve original filename formatting
		return fileName.replace('.riv', '');
	}

	// Public API
	getValue() {
		return this.selectedValue;
	}

	setValue(value) {
		if (!value) {
			this.selectedValue = '';
			this.selectedMetadata = null;
			this.render();
			return;
		}

		// Set the value directly
		this.selectedValue = value;
		const displayName = this.getDisplayName(value);

		// Update the UI
		this.render();

		// Clear any existing marquee timeout
		if (this.marqueeTimeout) {
			clearTimeout(this.marqueeTimeout);
			this.marqueeTimeout = null;
		}

		// Check for marquee if text is long with 2s delay
		this.marqueeTimeout = setTimeout(() => {
			const label = this.$('.dropdown-label');
			if (label && displayName.length > 25) {
				label.classList.add('marquee');
				const span = label.querySelector('span');
				if (span) {
					// Create two spans for better control
					span.innerHTML = `
            <span class="marquee-text">${displayName}</span>
            <span class="marquee-text">${displayName}</span>
          `;
				}
			}
			this.marqueeTimeout = null;
		}, 2000); // 2 second delay before marquee starts
	}

	getMetadata() {
		return this.selectedMetadata;
	}

	reset() {
		this.selectedValue = '';
		this.selectedMetadata = null;
		this.folderStates = {};
		this.render();
	}

	disable() {
		this.setProp('disabled', true);
		this.close();
	}

	enable() {
		this.setProp('disabled', false);
	}

	expandAll() {
		// Expand all folders
		const data = this.getProp('data');
		if (data) {
			this.setFolderStatesRecursive(data, '', true);
			this.renderTree();
		}
	}

	collapseAll() {
		this.folderStates = {};
		this.renderTree();
	}

	setFolderStatesRecursive(structure, parentPath, expanded) {
		for (const folderName of Object.keys(structure.folders || {})) {
			const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
			this.folderStates[folderPath] = expanded;
			this.setFolderStatesRecursive(structure.folders[folderName], folderPath, expanded);
		}
	}

	// Public API for width
	setWidth(width) {
		this.setProp('width', width);
	}

	// Simple API for setting options (converts to folder/file structure)
	setOptions(options) {
		// Convert simple options array to folder/file structure
		const data = {
			files: options.map(opt => {
				if (typeof opt === 'string') return opt;
				return opt.value || opt.label || opt;
			})
		};
		this.loadData(data);

		// Store metadata for display names if needed
		if (options.some(opt => typeof opt === 'object' && (opt.description || opt.icon))) {
			const metadata = {};
			options.forEach(opt => {
				if (typeof opt === 'object') {
					const key = opt.value || opt.label || opt;
					metadata[key] = {
						description: opt.description,
						icon: opt.icon
					};
				}
			});
			this.setMetadata(metadata);
		}
	}

	// API to control search visibility
	setSearch(enabled) {
		this.setProp('search', enabled);
		if (enabled) {
			this.setAttribute('search', 'true');
		} else {
			this.setAttribute('search', 'false');
		}
	}

	// API to control icon visibility
	setIcons(enabled) {
		this.setProp('icons', enabled);
		if (enabled) {
			this.setAttribute('icons', 'true');
		} else {
			this.setAttribute('icons', 'false');
		}
	}
}

// Register the component
customElements.define('t-drp', TDropdown);
