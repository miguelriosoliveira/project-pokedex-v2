import { Pokemon } from '../models';

export class PokemonsRepository {
	async findByNumber(number: number) {
		return Pokemon.findOne({ number });
	}

	async findManyByNames(names: string[]) {
		return Pokemon.find({ name: { $in: names } });
	}
}
