import { TypesRepository } from '../repositories';

export class GetTypesByNamesService {
	constructor(private typesRepository: TypesRepository) {}

	public async execute(typeNames: string[]) {
		return this.typesRepository.findManyByNames(typeNames);
	}
}
