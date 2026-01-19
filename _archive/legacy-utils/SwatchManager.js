/**
 * SwatchManager - Handles color swatch data storage
 * Supports localStorage and Supabase backends
 */

export class SwatchManager {
	constructor(options = {}) {
		this.storageKey = options.storageKey || 'terminal-color-swatches';
		this.maxSwatches = options.maxSwatches || 20;
		this.backend = options.backend || 'localStorage'; // 'localStorage' or 'supabase'
		this.supabaseClient = options.supabaseClient || null;
		this.userId = options.userId || null;
		this.cache = [];
		this.listeners = new Set();
	}

	/**
	 * Initialize and load swatches
	 */
	async init() {
		if (this.backend === 'supabase' && this.supabaseClient && this.userId) {
			return this.loadFromSupabase();
		} else {
			return this.loadFromLocalStorage();
		}
	}

	/**
	 * Load swatches from localStorage
	 */
	loadFromLocalStorage() {
		try {
			const saved = localStorage.getItem(this.storageKey);
			if (saved) {
				const parsed = JSON.parse(saved);
				this.cache = Array.isArray(parsed) ? parsed : [];
			} else {
				this.cache = [];
			}
		} catch (e) {
			console.error('Error loading swatches from localStorage:', e);
			this.cache = [];
		}
		return this.cache;
	}

	/**
	 * Load swatches from Supabase
	 */
	async loadFromSupabase() {
		if (!this.supabaseClient || !this.userId) {
			return this.loadFromLocalStorage();
		}

		try {
			const { data, error } = await this.supabaseClient
				.from('color_swatches')
				.select('swatches')
				.eq('user_id', this.userId)
				.single();

			if (error) {
				if (error.code === 'PGRST116') {
					// No record found, return empty
					this.cache = [];
				} else {
					throw error;
				}
			} else {
				this.cache = data?.swatches || [];
			}
		} catch (e) {
			console.error('Error loading swatches from Supabase:', e);
			// Fallback to localStorage
			return this.loadFromLocalStorage();
		}

		return this.cache;
	}

	/**
	 * Save swatches to storage
	 */
	async save() {
		if (this.backend === 'supabase' && this.supabaseClient && this.userId) {
			await this.saveToSupabase();
		} else {
			this.saveToLocalStorage();
		}
		this.notifyListeners('save', this.cache);
	}

	/**
	 * Save to localStorage
	 */
	saveToLocalStorage() {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.cache));
		} catch (e) {
			console.error('Error saving swatches to localStorage:', e);
		}
	}

	/**
	 * Save to Supabase
	 */
	async saveToSupabase() {
		if (!this.supabaseClient || !this.userId) {
			return this.saveToLocalStorage();
		}

		try {
			const { error } = await this.supabaseClient
				.from('color_swatches')
				.upsert({
					user_id: this.userId,
					swatches: this.cache,
					updated_at: new Date().toISOString()
				}, {
					onConflict: 'user_id'
				});

			if (error) {
				throw error;
			}
		} catch (e) {
			console.error('Error saving swatches to Supabase:', e);
			// Fallback to localStorage
			this.saveToLocalStorage();
		}
	}

	/**
	 * Add a color to swatches
	 */
	async add(color) {
		if (!color || this.cache.includes(color)) {
			return false;
		}

		this.cache.unshift(color);

		// Limit to max swatches
		if (this.cache.length > this.maxSwatches) {
			this.cache = this.cache.slice(0, this.maxSwatches);
		}

		await this.save();
		this.notifyListeners('add', color);
		return true;
	}

	/**
	 * Remove a color from swatches
	 */
	async remove(color) {
		const index = this.cache.indexOf(color);
		if (index === -1) {
			return false;
		}

		this.cache.splice(index, 1);
		await this.save();
		this.notifyListeners('remove', color);
		return true;
	}

	/**
	 * Clear all swatches
	 */
	async clear() {
		this.cache = [];
		await this.save();
		this.notifyListeners('clear', null);
	}

	/**
	 * Get all swatches
	 */
	getAll() {
		return [...this.cache];
	}

	/**
	 * Check if a color exists
	 */
	has(color) {
		return this.cache.includes(color);
	}

	/**
	 * Get count
	 */
	count() {
		return this.cache.length;
	}

	/**
	 * Subscribe to changes
	 */
	subscribe(callback) {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}

	/**
	 * Notify all listeners
	 */
	notifyListeners(event, data) {
		this.listeners.forEach(callback => {
			try {
				callback(event, data, this.cache);
			} catch (e) {
				console.error('Error in swatch listener:', e);
			}
		});
	}

	/**
	 * Switch backend
	 */
	async switchBackend(backend, options = {}) {
		this.backend = backend;
		if (backend === 'supabase') {
			this.supabaseClient = options.supabaseClient || this.supabaseClient;
			this.userId = options.userId || this.userId;
		}
		await this.init();
		this.notifyListeners('backend-change', backend);
	}
}

// Export singleton instance for convenience
export const swatchManager = new SwatchManager();