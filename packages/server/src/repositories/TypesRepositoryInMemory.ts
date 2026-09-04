import type { TypeSchema } from '../models';

import type { TypesRepository } from './TypesRepository';

export class TypesRepositoryInMemory implements TypesRepository {
	types: TypeSchema[] = [];

	async findMany() {
		return [...this.types].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
	}

	async findManyByNames(types: string[]) {
		return this.types.filter(type => types.includes(type.name));
	}
}
