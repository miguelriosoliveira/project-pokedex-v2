import axios, { HttpStatusCode } from 'axios';

import { logger } from '../utils';

const TYPES = [
	'bug',
	'dark',
	'dragon',
	'electric',
	'fairy',
	'fighting',
	'fire',
	'flying',
	'ghost',
	'grass',
	'ground',
	'ice',
	'normal',
	'poison',
	'psychic',
	'rock',
	'steel',
	'water',
] as const;

export type Type = (typeof TYPES)[number];
export interface Generation {
	name: string;
	region: string;
	display_name: string;
	starters: Array<{
		name: string;
		number: number;
		sprite: string;
	}>;
}

export interface Pokemon {
	display_name: string;
	sprite: string;
	number: number;
	types: Type[];
}

export interface PokemonDetails {
	name: string;
	number: number;
	types: Type[];
	description: string;
	sprite: string;
	weaknesses: Type[];
	evolution_chain: {
		common: Pokemon[];
		variant: Pokemon[];
	};
}

interface GetPokemonListParams {
	generation?: string;
	search?: string;
	types?: string[];
	page?: number;
}

const { VITE_BACKEND_URL: BACKEND_URL } = import.meta.env;

const apiBase = axios.create({ baseURL: BACKEND_URL });

function throwResponse(error: unknown, errorMessage: string) {
	logger.error(error, errorMessage);
	throw new Response('Our servers are in maintenance time, please check back later!', {
		status: HttpStatusCode.InternalServerError,
	});
}

interface RequestProps {
	route: string;
	params?: object;
	errorMessage: string;
}

async function request<T>({ route, errorMessage }: RequestProps) {
	try {
		const { data } = await apiBase.get<T>(route);
		return data;
	} catch (error) {
		throw throwResponse(error, errorMessage);
	}
}

async function requestPaginated<T>({ route, params, errorMessage }: RequestProps) {
	try {
		const { data, headers } = await apiBase.get<T>(route, { params });
		return { items: data, total: Number(headers['x-total-items']) };
	} catch (error) {
		throw throwResponse(error, errorMessage);
	}
}

export const api = {
	async getGenerations() {
		return request<Generation[]>({
			route: '/generations',
			errorMessage: 'Failed getting generations',
		});
	},

	async getTypes() {
		return request<Type[]>({
			route: '/types',
			errorMessage: 'Failed getting types',
		});
	},

	async getPokemonList({ generation, search, types, page = 1 }: GetPokemonListParams = {}) {
		return requestPaginated<Pokemon[]>({
			route: 'pokemon',
			params: { generation, search, types, page },
			errorMessage: 'Failed getting Pokémon list',
		});
	},

	async getPokemon(id: number) {
		return request<PokemonDetails>({
			route: `/pokemon/${id}`,
			errorMessage: `Failed getting Pokémon ${id} details`,
		});
	},
};
