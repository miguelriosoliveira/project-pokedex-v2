import { EvolutionChain } from 'pokenode-ts';

interface Props {
	name: string;
	number: number;
}

export function createFakeEvolutionChain({ name, number }: Props): EvolutionChain {
	return {
		id: -1,
		baby_trigger_item: null,
		chain: {
			evolution_details: [],
			evolves_to: [],
			is_baby: false,
			species: {
				name,
				url: `https://pokeapi.co/api/v2/pokemon-species/${number}/`,
			},
		},
	};
}
