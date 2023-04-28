import { PokemonSchema } from '../../models';

export function createPokemon(data: Partial<PokemonSchema> = {}): PokemonSchema {
	return {
		number: -1,
		name: 'string',
		display_name: 'string',
		generation: 'string',
		description: 'string',
		sprite: 'string',
		evolution_chain: [['string[][]']],
		types: ['string[]'],
		forms: ['string[]'],
		...data,
	};
}
