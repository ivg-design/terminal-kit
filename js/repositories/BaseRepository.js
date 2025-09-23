import logger from '../utils/logger.js';

/**
 * Base Repository Class
 * Abstract base class for all data repositories
 */
export class BaseRepository {
	constructor(supabaseClient, tableName) {
		this.supabase = supabaseClient;
		this.tableName = tableName;
		this.cache = new Map();
		this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
	}

	/**
	 * Get cache key
	 */
	getCacheKey(params = {}) {
		return JSON.stringify({ table: this.tableName, ...params });
	}

	/**
	 * Get from cache
	 */
	getFromCache(key) {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
			return cached.data;
		}
		this.cache.delete(key);
		return null;
	}

	/**
	 * Set cache
	 */
	setCache(key, data) {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	/**
	 * Clear cache
	 */
	clearCache() {
		this.cache.clear();
	}

	/**
	 * Get all records
	 */
	async getAll(options = {}) {
		const cacheKey = this.getCacheKey({ method: 'getAll', options });
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		try {
			let query = this.supabase.from(this.tableName).select(options.select || '*');

			if (options.orderBy) {
				query = query.order(options.orderBy, { ascending: options.ascending !== false });
			}

			if (options.limit) {
				query = query.limit(options.limit);
			}

			if (options.offset) {
				query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
			}

			const { data, error } = await query;

			if (error) throw error;

			this.setCache(cacheKey, data);
			return data;
		} catch (error) {
			logger.error(`Error fetching all from ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Get by ID
	 */
	async getById(id, options = {}) {
		const cacheKey = this.getCacheKey({ method: 'getById', id });
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		try {
			const { data, error } = await this.supabase
				.from(this.tableName)
				.select(options.select || '*')
				.eq('id', id)
				.single();

			if (error) throw error;

			this.setCache(cacheKey, data);
			return data;
		} catch (error) {
			logger.error(`Error fetching ${this.tableName} by ID:`, error);
			throw error;
		}
	}

	/**
	 * Get by field
	 */
	async getByField(field, value, options = {}) {
		const cacheKey = this.getCacheKey({ method: 'getByField', field, value });
		const cached = this.getFromCache(cacheKey);
		if (cached) return cached;

		try {
			let query = this.supabase
				.from(this.tableName)
				.select(options.select || '*')
				.eq(field, value);

			if (options.single) {
				query = query.single();
			}

			const { data, error } = await query;

			if (error) throw error;

			this.setCache(cacheKey, data);
			return data;
		} catch (error) {
			logger.error(`Error fetching ${this.tableName} by field:`, error);
			throw error;
		}
	}

	/**
	 * Search records
	 */
	async search(searchTerm, fields = [], options = {}) {
		try {
			let query = this.supabase.from(this.tableName).select(options.select || '*');

			if (fields.length > 0) {
				const conditions = fields
					.map((field) => `${field}.ilike.%${searchTerm}%`)
					.join(',');
				query = query.or(conditions);
			} else {
				query = query.textSearch('fts', searchTerm);
			}

			if (options.orderBy) {
				query = query.order(options.orderBy, { ascending: options.ascending !== false });
			}

			if (options.limit) {
				query = query.limit(options.limit);
			}

			const { data, error } = await query;

			if (error) throw error;

			return data;
		} catch (error) {
			logger.error(`Error searching ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Create record
	 */
	async create(data) {
		try {
			const { data: created, error } = await this.supabase
				.from(this.tableName)
				.insert(data)
				.select()
				.single();

			if (error) throw error;

			this.clearCache(); // Clear cache after mutation
			return created;
		} catch (error) {
			logger.error(`Error creating ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Update record
	 */
	async update(id, data) {
		try {
			const { data: updated, error } = await this.supabase
				.from(this.tableName)
				.update(data)
				.eq('id', id)
				.select()
				.single();

			if (error) throw error;

			this.clearCache(); // Clear cache after mutation
			return updated;
		} catch (error) {
			logger.error(`Error updating ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Delete record
	 */
	async delete(id) {
		try {
			const { error } = await this.supabase.from(this.tableName).delete().eq('id', id);

			if (error) throw error;

			this.clearCache(); // Clear cache after mutation
			return true;
		} catch (error) {
			logger.error(`Error deleting ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Batch create
	 */
	async createMany(dataArray) {
		try {
			const { data: created, error } = await this.supabase
				.from(this.tableName)
				.insert(dataArray)
				.select();

			if (error) throw error;

			this.clearCache(); // Clear cache after mutation
			return created;
		} catch (error) {
			logger.error(`Error batch creating ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Batch update
	 */
	async updateMany(updates) {
		try {
			const promises = updates.map(({ id, data }) =>
				this.supabase.from(this.tableName).update(data).eq('id', id).select()
			);

			const results = await Promise.all(promises);
			const errors = results.filter((r) => r.error);

			if (errors.length > 0) {
				throw new Error(
					`Batch update failed: ${errors.map((e) => e.error.message).join(', ')}`
				);
			}

			this.clearCache(); // Clear cache after mutation
			return results.map((r) => r.data).flat();
		} catch (error) {
			logger.error(`Error batch updating ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Batch delete
	 */
	async deleteMany(ids) {
		try {
			const { error } = await this.supabase.from(this.tableName).delete().in('id', ids);

			if (error) throw error;

			this.clearCache(); // Clear cache after mutation
			return true;
		} catch (error) {
			logger.error(`Error batch deleting ${this.tableName}:`, error);
			throw error;
		}
	}

	/**
	 * Count records
	 */
	async count(filter = {}) {
		try {
			let query = this.supabase
				.from(this.tableName)
				.select('*', { count: 'exact', head: true });

			Object.entries(filter).forEach(([key, value]) => {
				query = query.eq(key, value);
			});

			const { count, error } = await query;

			if (error) throw error;

			return count;
		} catch (error) {
			logger.error(`Error counting ${this.tableName}:`, error);
			throw error;
		}
	}
}
