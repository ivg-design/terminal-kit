/**
 * DataManager - Centralized data management for Rive Animation Platform
 * Supports workspace separation and will integrate with Supabase in production
 */

export class DataManager {
	constructor(options = {}) {
		this.workspace = options.workspace || 'personal';
		this.backend = options.backend || 'localStorage';
		this.userId = options.userId || 'local-user';

		// Entity stores - in-memory with localStorage persistence
		this.stores = {
			animations: new Map(),
			folders: new Map(),
			tags: new Map(),
			swatches: new Map(),
			settings: new Map()
		};

		// Indexes for efficient queries
		this.indexes = {
			workspace: new Map(), // entity type -> workspace -> Set of IDs
			parent: new Map(),    // parent ID -> Set of child IDs
			tags: new Map(),      // tag ID -> Set of animation IDs
		};

		// Subscribers
		this.subscribers = {
			animations: new Set(),
			folders: new Set(),
			tags: new Set(),
			swatches: new Set(),
			settings: new Set(),
			workspace: new Set()
		};

		// Initialize from localStorage
		this.loadFromStorage();
	}

	// Core CRUD Operations

	async create(entityType, data) {
		this.validateEntityType(entityType);
		this.validateRequiredFields(entityType, data);

		const id = this.generateId(entityType);
		const timestamp = new Date().toISOString();

		const entity = {
			id,
			...data,
			workspace: this.workspace,
			createdAt: timestamp,
			updatedAt: timestamp
		};

		this.stores[entityType].set(id, entity);
		this.updateIndexes(entityType, entity);
		this.saveToStorage(entityType);
		this.notifySubscribers(entityType, 'create', entity);

		return entity;
	}

	async get(entityType, id) {
		this.validateEntityType(entityType);
		return this.stores[entityType].get(id) || null;
	}

	async update(entityType, id, updates) {
		this.validateEntityType(entityType);

		const entity = this.stores[entityType].get(id);
		if (!entity) {
			throw new Error(`${entityType} with id ${id} not found`);
		}

		const updated = {
			...entity,
			...updates,
			id: entity.id, // Prevent ID change
			workspace: entity.workspace, // Prevent workspace change
			createdAt: entity.createdAt, // Preserve creation time
			updatedAt: new Date().toISOString()
		};

		this.stores[entityType].set(id, updated);
		this.updateIndexes(entityType, updated, entity);
		this.saveToStorage(entityType);
		this.notifySubscribers(entityType, 'update', updated);

		return updated;
	}

	async delete(entityType, id) {
		this.validateEntityType(entityType);

		const entity = this.stores[entityType].get(id);
		if (!entity) {
			return false;
		}

		this.stores[entityType].delete(id);
		this.removeFromIndexes(entityType, entity);
		this.saveToStorage(entityType);
		this.notifySubscribers(entityType, 'delete', entity);

		return true;
	}

	// Batch Operations

	async createBatch(entityType, items) {
		const results = [];
		for (const item of items) {
			results.push(await this.create(entityType, item));
		}
		return results;
	}

	async deleteBatch(entityType, ids) {
		for (const id of ids) {
			await this.delete(entityType, id);
		}
		return true;
	}

	// Query System

	async query(entityType, options = {}) {
		this.validateEntityType(entityType);

		let results = Array.from(this.stores[entityType].values());

		// Filter by workspace
		results = results.filter(entity => entity.workspace === this.workspace);

		// Apply filters
		if (options.filter) {
			results = this.applyFilters(results, options.filter);
		}

		// Apply sorting
		if (options.sort) {
			results = this.applySorting(results, options.sort);
		}

		// Apply pagination
		if (options.limit !== undefined) {
			const offset = options.offset || 0;
			results = results.slice(offset, offset + options.limit);
		}

		return results;
	}

	// Workspace Management

	async switchWorkspace(workspace) {
		const oldWorkspace = this.workspace;
		this.workspace = workspace;

		// Notify workspace subscribers
		this.subscribers.workspace.forEach(callback => {
			try {
				callback(workspace, oldWorkspace);
			} catch (e) {
				console.error('Error in workspace subscriber:', e);
			}
		});
	}

	// Relationship Management

	async getChildren(entityType, parentId) {
		const parentIndex = this.indexes.parent.get(parentId);
		if (!parentIndex) return [];

		const children = [];
		for (const childId of parentIndex) {
			const child = this.stores[entityType].get(childId);
			if (child && child.workspace === this.workspace) {
				children.push(child);
			}
		}
		return children;
	}

	async addRelation(entityId, relationType, relatedIds) {
		// For now, handle tag relationships
		if (relationType === 'tags') {
			for (const tagId of relatedIds) {
				let tagIndex = this.indexes.tags.get(tagId);
				if (!tagIndex) {
					tagIndex = new Set();
					this.indexes.tags.set(tagId, tagIndex);
				}
				tagIndex.add(entityId);
			}
		}
		this.saveIndexesToStorage();
	}

	async getRelated(entityId, relationType) {
		if (relationType === 'tags') {
			const tags = [];
			for (const [tagId, animationIds] of this.indexes.tags) {
				if (animationIds.has(entityId)) {
					const tag = this.stores.tags.get(tagId);
					if (tag) tags.push(tag);
				}
			}
			return tags;
		}
		return [];
	}

	// Swatch Management

	async addSwatch(animationId, color) {
		const swatchKey = `${animationId}-swatches`;
		let swatches = this.stores.swatches.get(swatchKey) || [];

		if (!swatches.includes(color)) {
			swatches.push(color);
			this.stores.swatches.set(swatchKey, swatches);
			this.saveToStorage('swatches');
		}

		return swatches;
	}

	async removeSwatch(animationId, color) {
		const swatchKey = `${animationId}-swatches`;
		let swatches = this.stores.swatches.get(swatchKey) || [];

		const index = swatches.indexOf(color);
		if (index > -1) {
			swatches.splice(index, 1);
			this.stores.swatches.set(swatchKey, swatches);
			this.saveToStorage('swatches');
		}

		return swatches;
	}

	async getSwatches(animationId) {
		const swatchKey = `${animationId}-swatches`;
		return this.stores.swatches.get(swatchKey) || [];
	}

	async getWorkspaceSwatches() {
		const allSwatches = new Set();

		// Get all animations in current workspace
		const animations = await this.query('animations');

		// Collect all unique swatches
		for (const animation of animations) {
			const swatches = await this.getSwatches(animation.id);
			swatches.forEach(s => allSwatches.add(s));
		}

		return Array.from(allSwatches);
	}

	// Subscription System

	subscribe(entityType, callback) {
		if (!this.subscribers[entityType]) {
			this.subscribers[entityType] = new Set();
		}
		this.subscribers[entityType].add(callback);

		return () => {
			this.subscribers[entityType].delete(callback);
		};
	}

	subscribeWorkspace(callback) {
		this.subscribers.workspace.add(callback);
		return () => {
			this.subscribers.workspace.delete(callback);
		};
	}

	notifySubscribers(entityType, action, entity) {
		if (!this.subscribers[entityType]) return;

		this.subscribers[entityType].forEach(callback => {
			try {
				callback(action, entity);
			} catch (e) {
				console.error('Error in subscriber:', e);
			}
		});
	}

	// Storage Management

	loadFromStorage() {
		if (this.backend !== 'localStorage') return;

		for (const entityType of Object.keys(this.stores)) {
			const key = `dataManager_${this.userId}_${entityType}`;
			try {
				const data = localStorage.getItem(key);
				if (data) {
					const parsed = JSON.parse(data);
					this.stores[entityType] = new Map(parsed);
				}
			} catch (e) {
				console.error(`Error loading ${entityType}:`, e);
			}
		}

		// Load indexes
		this.loadIndexesFromStorage();
	}

	saveToStorage(entityType) {
		if (this.backend !== 'localStorage') return;

		const key = `dataManager_${this.userId}_${entityType}`;
		try {
			const data = Array.from(this.stores[entityType].entries());
			localStorage.setItem(key, JSON.stringify(data));
		} catch (e) {
			console.error(`Error saving ${entityType}:`, e);
		}
	}

	loadIndexesFromStorage() {
		const key = `dataManager_${this.userId}_indexes`;
		try {
			const data = localStorage.getItem(key);
			if (data) {
				const parsed = JSON.parse(data);
				// Rebuild indexes from saved data
				if (parsed.parent) {
					this.indexes.parent = new Map(
						parsed.parent.map(([k, v]) => [k, new Set(v)])
					);
				}
				if (parsed.tags) {
					this.indexes.tags = new Map(
						parsed.tags.map(([k, v]) => [k, new Set(v)])
					);
				}
			}
		} catch (e) {
			console.error('Error loading indexes:', e);
		}
	}

	saveIndexesToStorage() {
		if (this.backend !== 'localStorage') return;

		const key = `dataManager_${this.userId}_indexes`;
		try {
			const data = {
				parent: Array.from(this.indexes.parent.entries()).map(([k, v]) => [k, Array.from(v)]),
				tags: Array.from(this.indexes.tags.entries()).map(([k, v]) => [k, Array.from(v)])
			};
			localStorage.setItem(key, JSON.stringify(data));
		} catch (e) {
			console.error('Error saving indexes:', e);
		}
	}

	// Helper Methods

	validateEntityType(entityType) {
		if (!this.stores[entityType]) {
			throw new Error(`Invalid entity type: ${entityType}`);
		}
	}

	validateRequiredFields(entityType, data) {
		if (entityType === 'animations' || entityType === 'folders' || entityType === 'tags') {
			if (!data.name) {
				throw new Error('Name is required');
			}
		}
	}

	generateId(entityType) {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substr(2, 9);
		return `${entityType}-${timestamp}-${random}`;
	}

	updateIndexes(entityType, entity, oldEntity = null) {
		// Update workspace index
		if (!this.indexes.workspace.has(entityType)) {
			this.indexes.workspace.set(entityType, new Map());
		}
		const workspaceIndex = this.indexes.workspace.get(entityType);

		if (!workspaceIndex.has(entity.workspace)) {
			workspaceIndex.set(entity.workspace, new Set());
		}
		workspaceIndex.get(entity.workspace).add(entity.id);

		// Update parent index for folders
		if (entityType === 'folders' && entity.parentId) {
			if (!this.indexes.parent.has(entity.parentId)) {
				this.indexes.parent.set(entity.parentId, new Set());
			}
			this.indexes.parent.get(entity.parentId).add(entity.id);
		}

		this.saveIndexesToStorage();
	}

	removeFromIndexes(entityType, entity) {
		// Remove from workspace index
		const workspaceIndex = this.indexes.workspace.get(entityType);
		if (workspaceIndex && workspaceIndex.has(entity.workspace)) {
			workspaceIndex.get(entity.workspace).delete(entity.id);
		}

		// Remove from parent index
		if (entity.parentId) {
			const parentIndex = this.indexes.parent.get(entity.parentId);
			if (parentIndex) {
				parentIndex.delete(entity.id);
			}
		}

		this.saveIndexesToStorage();
	}

	applyFilters(results, filters) {
		return results.filter(entity => {
			for (const [key, value] of Object.entries(filters)) {
				if (Array.isArray(entity[key])) {
					if (!entity[key].includes(value)) return false;
				} else {
					if (entity[key] !== value) return false;
				}
			}
			return true;
		});
	}

	applySorting(results, sort) {
		const { field, order = 'asc' } = sort;
		return results.sort((a, b) => {
			const aVal = a[field];
			const bVal = b[field];

			if (aVal < bVal) return order === 'asc' ? -1 : 1;
			if (aVal > bVal) return order === 'asc' ? 1 : -1;
			return 0;
		});
	}

	// Future Supabase Integration Point
	async syncWithSupabase() {
		// This method will be implemented when Supabase is integrated
		// For now, it's a no-op to show the integration point
		if (this.backend === 'supabase' && this.supabaseClient) {
			// Future: Sync local changes with Supabase
			console.log('Supabase sync will be implemented in production');
		}
	}
}

// Export singleton instance for convenience
export const dataManager = new DataManager();