import { Type } from '../models';

import { TypesRepository } from './TypesRepository';

export class TypesRepositoryMongoose implements TypesRepository {
	async findMany() {
		const types = await Type.find().sort('name');
		return types.map(t => t.toJSON());
	}

	async findManyByNames(types: string[]) {
		const typesFound = await Type.find({ name: { $in: types } });
		return typesFound.map(t => t.toJSON());
	}
}
