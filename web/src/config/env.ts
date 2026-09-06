import { z } from 'zod';

const envSchema = z.object({
	VITE_BACKEND_URL: z.url(),
	VITE_SENTRY_DSN: z.string().optional(),
});

export function parseEnv(env: unknown) {
	return envSchema.parse(env);
}

export const ENV = parseEnv(import.meta.env);
