import { z } from 'zod';

const envSchema = z.object({
	PORT: z.string().transform(Number),
	MONGO_URL: z.string(),
});

export const ENV = envSchema.parse(process.env);
