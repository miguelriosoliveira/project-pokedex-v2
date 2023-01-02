import { PokemonsRepository } from '../repositories';

export class GetPokemonsByNamesService {
	constructor(private pokemonsRepository: PokemonsRepository) {}

	public async execute(names: string[]) {
		const pokemon = await this.pokemonsRepository.findManyByNames(names);
		return pokemon.map(p => p.toJSON());
	}
}
