/**
 * TerminalUserMenu Web Component
 * Dropdown menu triggered by user badge click
 */

import { TComponent } from './TComponent.js';
import { userCircleIcon, gearSixIcon, signOutIcon, folderUserIcon } from '../utils/phosphor-icons.js';

export class TUserMenu extends TComponent {
	static get observedAttributes() {
		return ['user-name', 'user-email', 'user-avatar', 'disabled', 'open'];
	}

	constructor() {
		super();

		// Default menu items - MUST be defined before setProps
		this._defaultMenuItems = [
			{ id: 'profile', label: 'Profile', icon: userCircleIcon },
			{ id: 'files', label: 'User Files', icon: folderUserIcon },
			{ id: 'settings', label: 'Settings', icon: gearSixIcon },
			{ type: 'separator' },
			{ id: 'logout', label: 'Sign Out', icon: signOutIcon }
		];

		// Initialize props
		this.setProps({
			userName: 'User',
			userEmail: '',
			userAvatar: '',
			disabled: false,
			open: false,
			menuItems: []
		});

		// Bind methods
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.handleEscape = this.handleEscape.bind(this);
	}

	onAttributeChange(name, oldValue, newValue) {
		switch (name) {
			case 'user-name':
				this.setProp('userName', newValue || 'User');
				break;
			case 'user-email':
				this.setProp('userEmail', newValue || '');
				break;
			case 'user-avatar':
				this.setProp('userAvatar', newValue || '');
				break;
			case 'disabled':
				this.setProp('disabled', newValue !== null);
				break;
			case 'open':
				this.setProp('open', newValue !== null);
				break;
		}
	}

	template() {
		const { userName, userAvatar, disabled, open } = this._props;
		const menuItems = (this._props.menuItems && this._props.menuItems.length > 0) ? this._props.menuItems : this._defaultMenuItems;

		// Generate initials if no avatar
		const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

		// Build menu items
		let menuContent = '';
		menuItems.forEach(item => {
			if (item.type === 'separator') {
				menuContent += '<div class="menu-separator"></div>';
			} else {
				menuContent += `
					<div class="menu-item" data-item-id="${item.id}">
						${item.icon ? `<span class="menu-item-icon">${item.icon}</span>` : ''}
						<span class="menu-item-label">${item.label}</span>
					</div>
				`;
			}
		});

		return `
			<div class="user-menu-container ${open ? 'open' : ''}">
				<button class="user-badge" ${disabled ? 'disabled' : ''}>
					${userAvatar ? 
						`<img src="${userAvatar}" alt="${userName}" class="user-avatar">` :
						`<div class="user-initials">${initials}</div>`
					}
					<div class="user-info">
						<span class="user-name user-name-full">${userName}</span>
						<span class="user-name user-name-initials">${initials}</span>
					</div>
					<svg class="chevron-icon" width="12" height="12" viewBox="0 0 12 12">
						<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" fill="none"/>
					</svg>
				</button>
				<div class="menu-dropdown ${open ? 'visible' : ''}">
					<div class="menu-header">
						<div class="menu-user-info">
							${userAvatar ? 
								`<img src="${userAvatar}" alt="${userName}" class="menu-avatar">` :
								`<div class="menu-initials">${initials}</div>`
							}
							<div>
								<div class="menu-user-name">${userName}</div>
							</div>
						</div>
					</div>
					<div class="menu-content">
						${menuContent}
					</div>
				</div>
			</div>
		`;
	}

	get componentClass() {
		return 'terminal-user-menu';
	}

	afterRender() {
		const badge = this.$('.user-badge');
		const dropdown = this.$('.menu-dropdown');
		const menuItems = this.$$('.menu-item');

		if (badge) {
			// Toggle menu on badge click
			this.addListener(badge, 'click', (e) => {
				e.stopPropagation();
				if (!this.getProp('disabled')) {
					this.toggle();
				}
			});
		}

		// Handle menu item clicks
		menuItems.forEach(item => {
			this.addListener(item, 'click', (e) => {
				e.stopPropagation();
				const itemId = item.dataset.itemId;
				this.emit('menu-select', { itemId });
				this.close();
			});
		});

		// Update document listeners based on open state
		if (this.getProp('open')) {
			document.addEventListener('click', this.handleClickOutside);
			document.addEventListener('keydown', this.handleEscape);
		}
	}

	handleClickOutside(e) {
		if (!this.contains(e.target)) {
			this.close();
		}
	}

	handleEscape(e) {
		if (e.key === 'Escape') {
			this.close();
		}
	}

	onUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleEscape);
	}

	// Public API
	open() {
		if (!this.getProp('disabled')) {
			this.setProp('open', true);
			this.setAttribute('open', '');
			document.addEventListener('click', this.handleClickOutside);
			document.addEventListener('keydown', this.handleEscape);
			this.emit('menu-open');
		}
	}

	close() {
		this.setProp('open', false);
		this.removeAttribute('open');
		document.removeEventListener('click', this.handleClickOutside);
		document.removeEventListener('keydown', this.handleEscape);
		this.emit('menu-close');
	}

	toggle() {
		if (this.getProp('open')) {
			this.close();
		} else {
			this.open();
		}
	}

	setMenuItems(items) {
		this.setProp('menuItems', items);
	}

	addMenuItem(item, index = -1) {
		const items = [...this._props.menuItems];
		if (index === -1) {
			items.push(item);
		} else {
			items.splice(index, 0, item);
		}
		this.setProp('menuItems', items);
	}

	removeMenuItem(itemId) {
		const items = this._props.menuItems.filter(item => item.id !== itemId);
		this.setProp('menuItems', items);
	}

	setUserInfo(info) {
		if (info.name) this.setProp('userName', info.name);
		if (info.email) this.setProp('userEmail', info.email);
		if (info.avatar) this.setProp('userAvatar', info.avatar);
	}
}

// Register the component
customElements.define('t-usr', TUserMenu);