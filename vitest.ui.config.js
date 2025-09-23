import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		include: [
			'test/**/*.test.js',
			'test/**/*.integration.test.js'
		],
		// No global setup - tests handle their own mocking
		coverage: {
			reporter: ['text', 'html'],
			exclude: [
				'node_modules/',
				'test/',
				'demos/',
				'public/',
				'scripts/'
			]
		}
	}
});