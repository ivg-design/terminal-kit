import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataManager } from '../js/data/DataManager.js';

// Mock localStorage for unit tests
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	length: 0,
	key: vi.fn()
};

// Apply mock
global.localStorage = localStorageMock;

describe('DataManager', () => {
	let dataManager;

	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.clear();
		dataManager = new DataManager();
	});

	describe('Initialization', () => {
		it('should initialize with default configuration', () => {
			expect(dataManager).toBeDefined();
			expect(dataManager.workspace).toBe('personal');
			expect(dataManager.stores).toBeDefined();
			expect(dataManager.indexes).toBeDefined();
		});

		it('should accept custom configuration', () => {
			const customDM = new DataManager({
				workspace: 'work',
				backend: 'supabase'
			});
			expect(customDM.workspace).toBe('work');
			expect(customDM.backend).toBe('supabase');
		});
	});

	describe('Entity Management', () => {
		it('should create an animation', async () => {
			const animation = await dataManager.create('animations', {
				name: 'Test Animation',
				duration: 1000
			});

			expect(animation).toBeDefined();
			expect(animation.id).toBeDefined();
			expect(animation.name).toBe('Test Animation');
			expect(animation.workspace).toBe('personal');
		});

		it('should get an entity by ID', async () => {
			const created = await dataManager.create('animations', {
				name: 'Test Animation'
			});

			const retrieved = await dataManager.get('animations', created.id);
			expect(retrieved).toEqual(created);
		});

		it('should update an entity', async () => {
			const animation = await dataManager.create('animations', {
				name: 'Original Name'
			});

			const updated = await dataManager.update('animations', animation.id, {
				name: 'Updated Name'
			});

			expect(updated.name).toBe('Updated Name');
			expect(updated.id).toBe(animation.id);
		});

		it('should delete an entity', async () => {
			const animation = await dataManager.create('animations', {
				name: 'To Delete'
			});

			const result = await dataManager.delete('animations', animation.id);
			expect(result).toBe(true);

			const retrieved = await dataManager.get('animations', animation.id);
			expect(retrieved).toBeNull();
		});
	});

	describe('Workspace Management', () => {
		it('should switch workspace', async () => {
			expect(dataManager.workspace).toBe('personal');

			await dataManager.switchWorkspace('work');
			expect(dataManager.workspace).toBe('work');
		});

		it('should filter entities by workspace', async () => {
			// Create in personal workspace
			await dataManager.create('animations', {
				name: 'Personal Animation'
			});

			// Switch to work workspace
			await dataManager.switchWorkspace('work');

			// Create in work workspace
			await dataManager.create('animations', {
				name: 'Work Animation'
			});

			// Query work animations
			const workAnimations = await dataManager.query('animations');
			expect(workAnimations).toHaveLength(1);
			expect(workAnimations[0].name).toBe('Work Animation');

			// Switch back and query personal
			await dataManager.switchWorkspace('personal');
			const personalAnimations = await dataManager.query('animations');
			expect(personalAnimations).toHaveLength(1);
			expect(personalAnimations[0].name).toBe('Personal Animation');
		});
	});

	describe('Relationship Management', () => {
		it('should handle folder hierarchy', async () => {
			const parentFolder = await dataManager.create('folders', {
				name: 'Parent',
				parentId: null
			});

			const childFolder = await dataManager.create('folders', {
				name: 'Child',
				parentId: parentFolder.id
			});

			const children = await dataManager.getChildren('folders', parentFolder.id);
			expect(children).toHaveLength(1);
			expect(children[0].id).toBe(childFolder.id);
		});

		it('should handle animation tags', async () => {
			const animation = await dataManager.create('animations', {
				name: 'Tagged Animation'
			});

			const tag1 = await dataManager.create('tags', { name: 'important' });
			const tag2 = await dataManager.create('tags', { name: 'featured' });

			await dataManager.addRelation(animation.id, 'tags', [tag1.id, tag2.id]);

			const tags = await dataManager.getRelated(animation.id, 'tags');
			expect(tags).toHaveLength(2);
		});
	});

	describe('Query System', () => {
		beforeEach(async () => {
			// Create test data
			await dataManager.create('animations', {
				name: 'Animation 1',
				duration: 1000,
				tags: ['red', 'fast']
			});
			await dataManager.create('animations', {
				name: 'Animation 2',
				duration: 2000,
				tags: ['blue', 'slow']
			});
			await dataManager.create('animations', {
				name: 'Animation 3',
				duration: 1500,
				tags: ['red', 'slow']
			});
		});

		it('should query with filters', async () => {
			const results = await dataManager.query('animations', {
				filter: { tags: 'red' }
			});

			expect(results).toHaveLength(2);
			expect(results[0].tags).toContain('red');
		});

		it('should query with sorting', async () => {
			const results = await dataManager.query('animations', {
				sort: { field: 'duration', order: 'asc' }
			});

			expect(results[0].duration).toBe(1000);
			expect(results[1].duration).toBe(1500);
			expect(results[2].duration).toBe(2000);
		});

		it('should query with pagination', async () => {
			const page1 = await dataManager.query('animations', {
				limit: 2,
				offset: 0
			});

			expect(page1).toHaveLength(2);

			const page2 = await dataManager.query('animations', {
				limit: 2,
				offset: 2
			});

			expect(page2).toHaveLength(1);
		});
	});

	describe('Subscription System', () => {
		it('should notify subscribers on create', async () => {
			const callback = vi.fn();
			const unsubscribe = dataManager.subscribe('animations', callback);

			await dataManager.create('animations', { name: 'New Animation' });

			expect(callback).toHaveBeenCalledWith(
				'create',
				expect.objectContaining({ name: 'New Animation' })
			);

			unsubscribe();
		});

		it('should notify subscribers on update', async () => {
			const callback = vi.fn();
			const animation = await dataManager.create('animations', {
				name: 'Original'
			});

			const unsubscribe = dataManager.subscribe('animations', callback);
			await dataManager.update('animations', animation.id, {
				name: 'Updated'
			});

			expect(callback).toHaveBeenCalledWith(
				'update',
				expect.objectContaining({ name: 'Updated' })
			);

			unsubscribe();
		});

		it('should notify on workspace change', async () => {
			const callback = vi.fn();
			const unsubscribe = dataManager.subscribeWorkspace(callback);

			await dataManager.switchWorkspace('work');

			expect(callback).toHaveBeenCalledWith('work', 'personal');

			unsubscribe();
		});
	});

	describe('Swatch Management', () => {
		it('should manage animation swatches', async () => {
			const animation = await dataManager.create('animations', {
				name: 'Colorful'
			});

			await dataManager.addSwatch(animation.id, '#FF0000');
			await dataManager.addSwatch(animation.id, '#00FF00');

			const swatches = await dataManager.getSwatches(animation.id);
			expect(swatches).toEqual(['#FF0000', '#00FF00']);

			await dataManager.removeSwatch(animation.id, '#FF0000');
			const updated = await dataManager.getSwatches(animation.id);
			expect(updated).toEqual(['#00FF00']);
		});

		it('should get workspace swatches', async () => {
			const anim1 = await dataManager.create('animations', { name: 'A1' });
			const anim2 = await dataManager.create('animations', { name: 'A2' });

			await dataManager.addSwatch(anim1.id, '#FF0000');
			await dataManager.addSwatch(anim2.id, '#00FF00');

			const workspaceSwatches = await dataManager.getWorkspaceSwatches();
			expect(workspaceSwatches).toContain('#FF0000');
			expect(workspaceSwatches).toContain('#00FF00');
		});
	});

	describe('Error Handling', () => {
		it('should handle invalid entity type', async () => {
			await expect(
				dataManager.create('invalid_type', {})
			).rejects.toThrow('Invalid entity type');
		});

		it('should handle non-existent entity', async () => {
			const result = await dataManager.get('animations', 'non-existent-id');
			expect(result).toBeNull();
		});

		it('should validate required fields', async () => {
			await expect(
				dataManager.create('animations', {})
			).rejects.toThrow('Name is required');
		});
	});

	describe('Batch Operations', () => {
		it('should create multiple entities', async () => {
			const animations = await dataManager.createBatch('animations', [
				{ name: 'Batch 1' },
				{ name: 'Batch 2' },
				{ name: 'Batch 3' }
			]);

			expect(animations).toHaveLength(3);
			expect(animations[0].name).toBe('Batch 1');
		});

		it('should delete multiple entities', async () => {
			const animations = await dataManager.createBatch('animations', [
				{ name: 'Delete 1' },
				{ name: 'Delete 2' }
			]);

			const ids = animations.map(a => a.id);
			const result = await dataManager.deleteBatch('animations', ids);

			expect(result).toBe(true);
			const remaining = await dataManager.query('animations');
			expect(remaining.filter(a => ids.includes(a.id))).toHaveLength(0);
		});
	});
});