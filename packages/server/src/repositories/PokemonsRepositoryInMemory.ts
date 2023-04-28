import { PokemonSchema } from '../models';
import { PokemonsRepository } from './PokemonsRepository';

export class PokemonsRepositoryInMemory implements PokemonsRepository {
	pokemons: PokemonSchema[] = [];

	async findByNumber(number: number) {
		return this.pokemons.find(pokemon => pokemon.number === number);
	}

	async findManyByNames(names: string[]) {
		return this.pokemons.filter(pokemon => names.includes(pokemon.name));
	}
}
