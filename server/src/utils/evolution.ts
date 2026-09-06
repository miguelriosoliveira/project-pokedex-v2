import type { EvolutionChain } from 'pokenode-ts';

export function splitEvolutionBranches(chains: string[][]): {
	common: string[];
	variants: string[];
} {
	if (chains.length === 0) {
		return { common: [], variants: [] };
	}

	if (chains.length === 1) {
		return { common: chains[0], variants: [] };
	}

	const common = chains.reduce((intersection, chain) =>
		intersection.filter(name => chain.includes(name)),
	);
	const variants = [
		...new Set(chains.flatMap(chain => chain.filter(name => !common.includes(name)))),
	];

	return { common, variants };
}

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
