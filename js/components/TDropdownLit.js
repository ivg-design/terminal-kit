import { LitElement, html, css } from 'lit';

export class TDropdownLit extends LitElement {
  static styles = css`
/**
 * Dropdown Component - EXACT from original
 * Nested dropdown with terminal theme
 */

/* Nested Dropdown Container */
.nested-dropdown-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 300px;
}

/* Nested Dropdown Button */
.nested-dropdown-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  width: 100%;
  min-width: 200px;
  height: var(--control-height);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  color: var(--terminal-green);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.nested-dropdown-button:hover {
  border-color: var(--terminal-green);
  background-color: var(--terminal-gray-medium);
}

.nested-dropdown-button:focus {
  outline: none;
  border-color: var(--terminal-green);
  box-shadow: 0 0 10px var(--terminal-green-glow);
}

.nested-dropdown-button.active {
  border-color: var(--terminal-green);
  box-shadow: 0 0 10px var(--terminal-green-glow);
}

.nested-dropdown-button .dropdown-arrow {
  transition: transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--terminal-green-dim);
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.nested-dropdown-button .dropdown-arrow svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.nested-dropdown-button.active .dropdown-arrow svg {
  transform: rotate(180deg);
}

/* Dropdown Label with marquee support */
.dropdown-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  display: block;
  text-transform: none !important;
}

/* Marquee for button label when dropdown is closed */
.dropdown-label.marquee {
  text-overflow: initial;
  overflow: hidden;
  position: relative;
}

.dropdown-label.marquee > span {
  display: inline-block;
  white-space: nowrap;
  animation: button-marquee 10s linear infinite;
  animation-delay: 2s;
}

.dropdown-label.marquee .marquee-text {
  display: inline-block;
  padding-right: 100px;
  white-space: nowrap;
}

@keyframes button-marquee {
  0%, 20% {
    transform: translateX(0);  /* Pause for 2s (20% of 10s) */
  }
  100% {
    transform: translateX(-50%);  /* Move second span to first position */
  }
}

/* Nested Dropdown Panel */
.nested-dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  min-width: 100%;
  max-width: 400px;
  max-height: 400px;
  background-color: var(--terminal-black);
  border: 1px solid var(--terminal-green);
  box-shadow: 0 4px 12px rgba(0, 255, 65, 0.2);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nested-dropdown-panel.hidden {
  display: none;
}

/* Dropdown Search */
.dropdown-search-wrapper {
  position: relative;
  padding: var(--spacing-sm);
  background-color: var(--terminal-gray-darkest);
  border-bottom: 1px solid var(--terminal-gray-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.dropdown-search-wrapper .search-icon {
  color: var(--terminal-green-dim);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dropdown-search-wrapper .search-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.dropdown-search-wrapper .dropdown-search {
  flex: 1;
  padding: var(--spacing-xs);
  background-color: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  color: var(--terminal-green);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.dropdown-search-wrapper .dropdown-search:focus {
  outline: none;
  border-color: var(--terminal-green);
  box-shadow: 0 0 5px var(--terminal-green-glow);
}

/* Dropdown Tree */
.dropdown-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--spacing-xs);
}

/* Tree Items */
.tree-item {
  user-select: none;
}

/* Folder and File styles */
.tree-folder {
  margin: 2px 0;
}

.folder-header,
.tree-file {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 2px;
  font-size: var(--font-size-sm);
  color: var(--terminal-green);
  line-height: 1.2;
  min-height: 24px;
}

.folder-header:hover,
.tree-file:hover {
  background-color: var(--terminal-gray-dark);
}

.folder-header.selected,
.tree-file.selected {
  background-color: var(--terminal-gray-medium);
  color: var(--terminal-green-bright);
}

.folder-arrow,
.folder-icon,
.file-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.folder-arrow svg,
.folder-icon svg,
.file-icon svg,
.info-icon svg,
.search-icon svg,
.dropdown-arrow svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
  display: block;
}

.folder-arrow {
  color: var(--terminal-green-dim);
}

.folder-icon {
  color: var(--terminal-green);
}

.file-icon {
  color: var(--terminal-green-dim);
}

.folder-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.file-name-text {
  display: inline-block;
  white-space: nowrap;
  padding-right: 30px;
  vertical-align: middle;
  line-height: inherit;
}

/* Show ellipsis by default */
.file-name:not(:hover) .file-name-text {
  text-overflow: ellipsis;
  overflow: hidden;
  padding-right: 0;
}

/* Marquee animation on hover for long text */
.tree-file:hover .file-name.long-text .file-name-text {
  animation: marquee-scroll 12s linear infinite;
}

@keyframes marquee-scroll {
  0%, 30% {
    transform: translateX(0);
  }
  70%, 100% {
    transform: translateX(calc(-100% + 100px));
  }
}

.folder-count {
  font-size: var(--font-size-xs);
  color: var(--terminal-green-dim);
  margin-left: auto;
  padding: 0 var(--spacing-xs);
}

.folder-content {
  padding-left: var(--spacing-lg);
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: 500px;
}

.folder-content.collapsed {
  max-height: 0;
}

.info-icon {
  width: 14px;
  height: 14px;
  color: var(--terminal-green-dim);
  opacity: 0.6;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.info-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.tree-file:hover .info-icon {
  opacity: 1;
}

.tree-item-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;
}

.tree-item-header:hover {
  background-color: var(--terminal-gray-dark);
}

.tree-item-header.selected {
  background-color: var(--terminal-gray-medium);
  color: var(--terminal-green-bright);
}

.tree-item-header .tree-icon {
  width: 14px;
  height: 14px;
  color: var(--terminal-green-dim);
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.tree-item-header .tree-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.tree-item-header.folder .tree-icon {
  color: var(--terminal-green);
}

.tree-item-name {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--terminal-green);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-item-info {
  width: 14px;
  height: 14px;
  color: var(--terminal-green-dim);
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.tree-item-header:hover .tree-item-info {
  opacity: 1;
}

.tree-children {
  padding-left: var(--spacing-lg);
  display: none;
}

.tree-children.expanded {
  display: block;
}

/* Metadata Tooltip */
.tree-item[title] {
  position: relative;
}

.nested-dropdown-container.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nested-dropdown-container.disabled .nested-dropdown-button {
  cursor: not-allowed;
  background-color: var(--terminal-gray-darkest);
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  min-width: 200px;
  height: var(--control-height); /* 28px */
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--terminal-gray-dark); /* #242424 */
  border: 1px solid var(--terminal-gray-light); /* #333333 */
  color: var(--terminal-green); /* #00ff41 */
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-trigger:hover {
  border-color: var(--terminal-green);
  background-color: var(--terminal-gray);
}

.dropdown-trigger:focus {
  outline: none;
  border-color: var(--terminal-green);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
}

.dropdown-trigger::after {
  content: '▼';
  font-size: 10px;
  color: var(--terminal-green-dim);
  transition: transform 0.2s ease;
}

.dropdown.open .dropdown-trigger::after {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  min-width: 100%;
  max-height: 300px;
  background-color: var(--terminal-black); /* #0a0a0a */
  border: 1px solid var(--terminal-green);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: none;
  overflow-y: auto;
  overflow-x: hidden;
}

.dropdown.open .dropdown-menu {
  display: block;
}

.dropdown-search {
  position: sticky;
  top: 0;
  padding: var(--spacing-sm);
  background-color: var(--terminal-black-light); /* #1a1a1a */
  border-bottom: 1px solid var(--terminal-gray-light);
}

.dropdown-search input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--terminal-gray-dark);
  border: 1px solid var(--terminal-gray-light);
  color: var(--terminal-green);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.dropdown-search input:focus {
  outline: none;
  border-color: var(--terminal-green);
}

.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--terminal-green);
}

.dropdown-item:hover {
  background-color: var(--terminal-gray-dark);
  border-left-color: var(--terminal-green);
  color: var(--terminal-green-bright);
}

.dropdown-item.selected {
  background-color: var(--terminal-gray-dark);
  color: var(--terminal-green-bright);
  border-left-color: var(--terminal-green);
}

.dropdown-item.selected::before {
  content: '>';
  color: var(--terminal-green);
  margin-right: var(--spacing-xs);
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Nested Dropdown Items */
.dropdown-item.has-children {
  position: relative;
}

.dropdown-item.has-children::after {
  content: '▶';
  position: absolute;
  right: var(--spacing-md);
  font-size: 10px;
  color: var(--color-text-dim);
}

.dropdown-item.expanded::after {
  transform: rotate(90deg);
}

.dropdown-children {
  display: none;
  padding-left: var(--spacing-lg);
}

.dropdown-item.expanded + .dropdown-children {
  display: block;
}

.dropdown-children .dropdown-item {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
}

/* Dropdown Divider */
.dropdown-divider {
  height: 1px;
  background-color: var(--color-border-dim);
  margin: var(--spacing-xs) 0;
}

/* Dropdown Header */
.dropdown-header {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-dim);
  background-color: var(--color-bg-secondary);
}

/* Multi-select Dropdown */
.dropdown-item.multi-select {
  padding-left: var(--spacing-xl);
  position: relative;
}

.dropdown-item.multi-select::before {
  content: '☐';
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-text-dim);
}

.dropdown-item.multi-select.selected::before {
  content: '☑';
  color: var(--color-primary);
}

/* Dropdown Positions */
.dropdown-menu.dropdown-right {
  left: auto;
  right: 0;
}

.dropdown-menu.dropdown-top {
  bottom: calc(100% + 2px);
  top: auto;
}

/* Wide Dropdown */
.dropdown.dropdown-wide .dropdown-trigger {
  min-width: 300px;
}

.dropdown.dropdown-wide .dropdown-menu {
  min-width: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed;
    left: var(--spacing-md);
    right: var(--spacing-md);
    max-width: calc(100vw - var(--spacing-xl));
  }
}
  `;

  static properties = {
    placeholder: { type: String },
    size: { type: String }
  };

  constructor() {
    super();
    this.placeholder = '';
    this.size = '';
  }

  render() {
    return html`
      <select @change=${this._handleChange}>
        ${this.placeholder ? html`<option value="">${this.placeholder}</option>` : ''}
        <slot></slot>
      </select>
    `;
  }

  _handleChange(e) {
    this.dispatchEvent(new CustomEvent('dropdown-change', {
      detail: { value: e.target.value },
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('t-drp')) {
  customElements.define('t-drp', TDropdownLit);
}

export default TDropdownLit;
