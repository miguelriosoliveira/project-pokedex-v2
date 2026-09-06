import { IGNORED_TYPES } from '../config/constants';
import type { TypesRepository } from '../repositories';

export class GetAllTypesService {
	constructor(private typesRepository: TypesRepository) {}

	public async execute() {
		const types = await this.typesRepository.findMany();
		return types.filter(type => !IGNORED_TYPES.has(type.name));
	}
}
