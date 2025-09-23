import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataManager } from '../js/data/DataManager.js';

describe('DataManager Integration Tests (Real localStorage)', () => {
	let dm;
	const testUserId = 'test-user-' + Date.now();

	beforeEach(() => {
		// Clear any test data
		const keys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.includes(testUserId)) {
				keys.push(key);
			}
		}
		keys.forEach(key => localStorage.removeItem(key));

		// Create fresh DataManager with real localStorage
		dm = new DataManager({
			userId: testUserId,
			backend: 'localStorage'
		});
	});

	afterEach(() => {
		// Clean up test data
		const keys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.includes(testUserId)) {
				keys.push(key);
			}
		}
		keys.forEach(key => localStorage.removeItem(key));
	});

	describe('Persistence Tests', () => {
		it('should persist data to real localStorage', async () => {
			// Create an animation
			const animation = await dm.create('animations', {
				name: 'Test Animation',
				duration: 1000
			});

			// Verify it's in localStorage
			const storageKey = `dataManager_${testUserId}_animations`;
			const stored = localStorage.getItem(storageKey);
			expect(stored).toBeTruthy();

			const parsed = JSON.parse(stored);
			expect(parsed).toBeDefined();
			expect(parsed.length).toBe(1);
			expect(parsed[0][1].name).toBe('Test Animation');
		});

		it('should load persisted data on new instance', async () => {
			// Create data with first instance
			const animation1 = await dm.create('animations', {
				name: 'Persisted Animation',
				duration: 2000
			});

			const folder1 = await dm.create('folders', {
				name: 'Persisted Folder'
			});

			// Create new DataManager instance (simulating page reload)
			const dm2 = new DataManager({
				userId: testUserId,
				backend: 'localStorage'
			});

			// Should load the persisted data
			const loadedAnimation = await dm2.get('animations', animation1.id);
			expect(loadedAnimation).toBeTruthy();
			expect(loadedAnimation.name).toBe('Persisted Animation');

			const loadedFolder = await dm2.get('folders', folder1.id);
			expect(loadedFolder).toBeTruthy();
			expect(loadedFolder.name).toBe('Persisted Folder');

			// Query should also work
			const animations = await dm2.query('animations');
			expect(animations.length).toBe(1);
			expect(animations[0].id).toBe(animation1.id);
		});

		it('should persist workspace data separately', async () => {
			// Create in personal workspace
			await dm.create('animations', {
				name: 'Personal Animation'
			});

			// Switch to work workspace
			await dm.switchWorkspace('work');

			// Create in work workspace
			await dm.create('animations', {
				name: 'Work Animation'
			});

			// Create new instance and verify both workspaces persisted
			const dm2 = new DataManager({
				userId: testUserId,
				workspace: 'personal'
			});

			const personalAnims = await dm2.query('animations');
			expect(personalAnims.length).toBe(1);
			expect(personalAnims[0].name).toBe('Personal Animation');

			await dm2.switchWorkspace('work');
			const workAnims = await dm2.query('animations');
			expect(workAnims.length).toBe(1);
			expect(workAnims[0].name).toBe('Work Animation');
		});

		it('should persist and restore indexes', async () => {
			// Create folder hierarchy
			const parent = await dm.create('folders', {
				name: 'Parent',
				parentId: null
			});

			const child = await dm.create('folders', {
				name: 'Child',
				parentId: parent.id
			});

			// Verify index is saved
			const indexKey = `dataManager_${testUserId}_indexes`;
			const indexData = localStorage.getItem(indexKey);
			expect(indexData).toBeTruthy();

			// Create new instance
			const dm2 = new DataManager({
				userId: testUserId
			});

			// Should restore parent-child relationship
			const children = await dm2.getChildren('folders', parent.id);
			expect(children.length).toBe(1);
			expect(children[0].id).toBe(child.id);
		});

		it('should persist swatches', async () => {
			const animation = await dm.create('animations', {
				name: 'Colorful'
			});

			await dm.addSwatch(animation.id, '#FF0000');
			await dm.addSwatch(animation.id, '#00FF00');

			// Verify swatches in localStorage
			const swatchKey = `dataManager_${testUserId}_swatches`;
			const swatchData = localStorage.getItem(swatchKey);
			expect(swatchData).toBeTruthy();

			// New instance should load swatches
			const dm2 = new DataManager({
				userId: testUserId
			});

			const swatches = await dm2.getSwatches(animation.id);
			expect(swatches).toEqual(['#FF0000', '#00FF00']);
		});

		it('should handle updates across instances', async () => {
			const animation = await dm.create('animations', {
				name: 'Original Name'
			});

			// Update with first instance
			await dm.update('animations', animation.id, {
				name: 'Updated Name'
			});

			// New instance should see the update
			const dm2 = new DataManager({
				userId: testUserId
			});

			const updated = await dm2.get('animations', animation.id);
			expect(updated.name).toBe('Updated Name');
		});

		it('should handle deletes across instances', async () => {
			const animation = await dm.create('animations', {
				name: 'To Delete'
			});

			await dm.delete('animations', animation.id);

			// New instance should not find deleted item
			const dm2 = new DataManager({
				userId: testUserId
			});

			const result = await dm2.get('animations', animation.id);
			expect(result).toBeNull();

			const animations = await dm2.query('animations');
			expect(animations.length).toBe(0);
		});
	});

	describe('Storage Size Tests', () => {
		it('should handle multiple entities efficiently', async () => {
			// Create multiple entities
			const animations = [];
			for (let i = 0; i < 10; i++) {
				animations.push(await dm.create('animations', {
					name: `Animation ${i}`,
					duration: 1000 + i * 100
				}));
			}

			// Check storage
			const storageKey = `dataManager_${testUserId}_animations`;
			const stored = localStorage.getItem(storageKey);
			const parsed = JSON.parse(stored);

			expect(parsed.length).toBe(10);

			// Verify all data is intact
			const dm2 = new DataManager({ userId: testUserId });
			const loaded = await dm2.query('animations');
			expect(loaded.length).toBe(10);
		});

		it('should calculate approximate storage usage', async () => {
			// Create some data first
			await dm.create('animations', { name: 'Size Test' });
			await dm.create('folders', { name: 'Size Folder' });

			// Helper to get storage size for this user
			let totalSize = 0;
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.includes(testUserId)) {
					const value = localStorage.getItem(key);
					totalSize += key.length + value.length;
				}
			}

			console.log(`Storage used by test user: ${totalSize} characters`);
			expect(totalSize).toBeGreaterThan(0);
		});
	});

	describe('Error Recovery Tests', () => {
		it('should handle corrupted localStorage data', async () => {
			// Manually corrupt data
			const storageKey = `dataManager_${testUserId}_animations`;
			localStorage.setItem(storageKey, 'corrupted-not-json');

			// Should handle gracefully
			const dm2 = new DataManager({ userId: testUserId });
			const animations = await dm2.query('animations');
			expect(animations).toEqual([]);

			// Should be able to create new data
			const animation = await dm2.create('animations', {
				name: 'After Corruption'
			});
			expect(animation).toBeTruthy();
		});

		it('should handle missing localStorage keys', async () => {
			// Create some data
			await dm.create('animations', { name: 'Test' });

			// Remove a key manually
			const indexKey = `dataManager_${testUserId}_indexes`;
			localStorage.removeItem(indexKey);

			// New instance should handle missing indexes
			const dm2 = new DataManager({ userId: testUserId });
			const animations = await dm2.query('animations');
			expect(animations.length).toBe(1);
		});
	});
});