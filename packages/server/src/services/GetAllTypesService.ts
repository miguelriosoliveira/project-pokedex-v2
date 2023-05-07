import { TypesRepository } from '../repositories';

export class GetAllTypesService {
	constructor(private typesRepository: TypesRepository) {}

	public async execute() {
		const types = await this.typesRepository.findMany();
		return types;
	}
}
