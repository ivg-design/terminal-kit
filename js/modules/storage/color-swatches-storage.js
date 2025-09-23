/**
 * Color Swatches Storage Module
 * Manages custom color swatches in Supabase user metadata
 */

export class ColorSwatchesStorage {
	constructor(supabaseClient) {
		this.supabase = supabaseClient;
		this.swatches = [];
		this.userId = null;
	}

	/**
	 * Initialize storage and load user swatches
	 */
	async init() {
		try {
			const { data: { user } } = await this.supabase.auth.getUser();
			if (user) {
				this.userId = user.id;
				await this.loadSwatches();
			}
		} catch (error) {
			console.error('Error initializing color swatches storage:', error);
		}
	}

	/**
	 * Load swatches from user metadata
	 */
	async loadSwatches() {
		try {
			const { data: { user } } = await this.supabase.auth.getUser();
			if (user?.user_metadata?.color_swatches) {
				this.swatches = user.user_metadata.color_swatches;
				return this.swatches;
			}
			return [];
		} catch (error) {
			console.error('Error loading swatches:', error);
			return [];
		}
	}

	/**
	 * Save swatches to user metadata
	 */
	async saveSwatches(swatches) {
		try {
			if (!this.userId) {
				console.warn('No user logged in, cannot save swatches');
				return false;
			}

			// Update user metadata with new swatches
			const { data, error } = await this.supabase.auth.updateUser({
				data: { 
					color_swatches: swatches,
					color_swatches_updated_at: new Date().toISOString()
				}
			});

			if (error) throw error;

			this.swatches = swatches;
			return true;
		} catch (error) {
			console.error('Error saving swatches:', error);
			return false;
		}
	}

	/**
	 * Add a new color swatch
	 */
	async addSwatch(hexColor) {
		if (!this.swatches.includes(hexColor)) {
			const newSwatches = [hexColor, ...this.swatches].slice(0, 20); // Limit to 20
			return await this.saveSwatches(newSwatches);
		}
		return true;
	}

	/**
	 * Remove a color swatch
	 */
	async removeSwatch(hexColor) {
		const newSwatches = this.swatches.filter(color => color !== hexColor);
		return await this.saveSwatches(newSwatches);
	}

	/**
	 * Get current swatches
	 */
	getSwatches() {
		return this.swatches;
	}

	/**
	 * Sync swatches from localStorage to Supabase
	 */
	async syncFromLocalStorage(localSwatches) {
		// Merge local and remote swatches, removing duplicates
		const mergedSwatches = [...new Set([...localSwatches, ...this.swatches])].slice(0, 20);
		return await this.saveSwatches(mergedSwatches);
	}

	/**
	 * Listen for auth changes
	 */
	onAuthChange(callback) {
		return this.supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				this.init().then(() => callback(this.swatches));
			} else if (event === 'SIGNED_OUT') {
				this.userId = null;
				this.swatches = [];
				callback([]);
			}
		});
	}
}