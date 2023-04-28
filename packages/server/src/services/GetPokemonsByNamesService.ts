import { PokemonsRepository } from '../repositories';

export class GetPokemonsByNamesService {
	constructor(private pokemonsRepository: PokemonsRepository) {}

	public async execute(names: string[]) {
		return this.pokemonsRepository.findManyByNames(names);
	}
}
