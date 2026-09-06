import { describe, expect, it } from 'vitest';

import { parseEnv } from './env';

describe('parseEnv', () => {
	it('accepts a valid backend URL and an optional Sentry DSN', () => {
		expect(
			parseEnv({
				VITE_BACKEND_URL: 'http://localhost:3000',
				VITE_SENTRY_DSN: '',
			}),
		).toEqual({
			VITE_BACKEND_URL: 'http://localhost:3000',
			VITE_SENTRY_DSN: '',
		});
	});

	it('rejects a missing backend URL', () => {
		expect(() => parseEnv({})).toThrow();
	});

	it('rejects an empty backend URL', () => {
		expect(() => parseEnv({ VITE_BACKEND_URL: '' })).toThrow();
	});
});
