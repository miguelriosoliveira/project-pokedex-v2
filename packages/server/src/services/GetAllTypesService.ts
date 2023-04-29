import { TypesRepository } from '../repositories';

export class GetAllTypesService {
	constructor(private typesRepository: TypesRepository) {}

	public async execute() {
		return this.typesRepository.findMany();
	}
}
