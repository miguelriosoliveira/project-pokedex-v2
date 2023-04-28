import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errors';
import { PokemonsRepository } from '../repositories';

export class GetPokemonByNumberService {
	constructor(private pokemonsRepository: PokemonsRepository) {}

	public async execute(number: number) {
		const pokemon = await this.pokemonsRepository.findByNumber(number);
		if (!pokemon) {
			throw new AppError({
				code: StatusCodes.NOT_FOUND,
				message: `Pokémon #${number} not found!`,
			});
		}
		return pokemon;
	}
}
