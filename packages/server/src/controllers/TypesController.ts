import { Request, Response } from 'express';

import { TypesRepositoryMongoose } from '../repositories';
import { GetAllTypesService } from '../services';

export const TypesController = {
	async getAll(request: Request, response: Response) {
		const typesRepository = new TypesRepositoryMongoose();
		const getAllTypesService = new GetAllTypesService(typesRepository);
		const types = await getAllTypesService.execute();
		return response.json(types.map(t => t.name));
	},
};
