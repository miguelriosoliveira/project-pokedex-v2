import { StatusCodes } from 'http-status-codes';
import type { ZodType } from 'zod';

import { AppError } from '../errors';

// Example URL: https://pokeapi.co/api/v2/evolution-chain/3/
export function getIdFromUrl(url: string) {
	return Number(url.split('/').at(-2));
}

export function parseRequest<T>(schema: ZodType<T>, data: unknown): T {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw new AppError({
			code: StatusCodes.BAD_REQUEST,
			message: result.error.issues.map(issue => issue.message).join('; '),
		});
	}
	return result.data;
}
