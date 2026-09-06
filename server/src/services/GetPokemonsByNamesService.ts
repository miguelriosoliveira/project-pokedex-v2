import type { PokemonsRepository } from '../repositories';

export class GetPokemonsByNamesService {
	constructor(private pokemonsRepository: PokemonsRepository) {}

	public async execute(names: string[]) {
		const pokemons = await this.pokemonsRepository.findManyByNames(names);
		const byName = new Map(pokemons.map(pokemon => [pokemon.name, pokemon]));
		return names.flatMap(name => {
			const pokemon = byName.get(name);
			return pokemon ? [pokemon] : [];
		});
	}
}
