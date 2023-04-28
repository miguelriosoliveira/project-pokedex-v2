// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		clearMocks: true,
		include: ['**/*.test.ts'],
		coverage: {
			reporter: ['text', 'json', 'html', 'lcov'],
		},
	},
});
