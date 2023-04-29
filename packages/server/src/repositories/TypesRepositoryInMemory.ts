import { TypeSchema } from '../models';

import { TypesRepository } from './TypesRepository';

export class TypesRepositoryInMemory implements TypesRepository {
	types: TypeSchema[] = [];

	async findManyByNames(types: string[]) {
		return this.types.filter(type => types.includes(type.name));
	}
}
