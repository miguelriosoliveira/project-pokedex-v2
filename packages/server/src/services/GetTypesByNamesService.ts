import { TypesRepository } from '../repositories';

export class GetTypesByNamesService {
	constructor(private typesRepository: TypesRepository) {}

	public async execute(typeNames: string[]) {
		const types = await this.typesRepository.findManyByNames(typeNames);
		return types.map(type => type.toJSON());
	}
}
