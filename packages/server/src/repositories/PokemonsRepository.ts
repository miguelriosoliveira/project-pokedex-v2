import { PokemonSchema } from '../models';

export abstract class PokemonsRepository {
	abstract findByNumber(number: number): Promise<PokemonSchema | undefined>;
	abstract findManyByNames(names: string[]): Promise<PokemonSchema[]>;
}
