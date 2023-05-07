import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors';

export const ErrorController = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	handle(error: Error, request: Request, response: Response, next: NextFunction) {
		if (error instanceof AppError) {
			return response.status(error.code).json({ error: error.message });
		}
		return response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	},
};
