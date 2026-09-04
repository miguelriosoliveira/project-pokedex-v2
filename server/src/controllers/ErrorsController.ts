import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors';

export const ErrorController = {
	handle(error: Error, _request: Request, response: Response, _next: NextFunction) {
		if (error instanceof AppError) {
			return response.status(error.code).json({ error: error.message });
		}
		return response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	},
};
