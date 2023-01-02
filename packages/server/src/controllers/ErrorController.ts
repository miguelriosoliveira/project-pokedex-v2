import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors';

export const ErrorController = {
	handle(error: Error, request: Request, response: Response) {
		if (error instanceof AppError) {
			return response.status(error.code).json({ error: error.message });
		}
		return response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	},
};
