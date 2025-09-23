import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['**/*.integration.test.js'],
		// No setupFiles - we want real localStorage, not mocked
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