import { Pokemon } from '../models';

import { PokemonsRepository } from './PokemonsRepository';

export class PokemonsRepositoryMongoose implements PokemonsRepository {
	async findByNumber(number: number) {
		const pokemon = await Pokemon.findOne({ number });
		return pokemon?.toJSON();
	}

	async findManyByNames(names: string[]) {
		const pokemons = await Pokemon.find({ name: { $in: names } });
		return pokemons.map(p => p.toJSON());
	}
}
