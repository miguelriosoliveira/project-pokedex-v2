import { Request, Response } from 'express';

import { Type } from '../models';

export const TypeController = {
	async getAll(request: Request, response: Response) {
		const types = await Type.find({}, { _id: 0, name: 1 }).sort('name');
		return response.json(types.map(({ name }) => name));
	},
};
