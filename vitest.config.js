import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './test/setup-mock.js',
		include: ['test/**/*.test.js', 'test/**/*.spec.js'],
		exclude: ['node_modules/**', '**/*.integration.test.js'], // Exclude node_modules and integration tests
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