import type { Request, Response } from 'express';
import { z } from 'zod';

import { DEFAULT_PAGE_SIZE, TOTAL_ITEMS_HEADER } from '../config/constants';
import { Pokemon } from '../models';
import { PokemonsRepositoryMongoose, TypesRepositoryMongoose } from '../repositories';
import {
	GetPokemonByNumberService,
	GetPokemonsByNamesService,
	GetTypesByNamesService,
} from '../services';
import { getTypeMatchups, parseRequest, splitEvolutionBranches } from '../utils';

const queryStringList = z
	.union([z.string(), z.array(z.string())])
	.transform(value => (typeof value === 'string' ? [value] : value));

const getAllQuerySchema = z.object({
	generation: z.string().optional(),
	search: z.string().optional().default(''),
	types: queryStringList.optional().default([]),
	page: z.coerce.number().min(1).optional().default(1),
	page_size: z.coerce.number().min(1).optional().default(DEFAULT_PAGE_SIZE),
});

const getOneParamsSchema = z.object({
	number: z.coerce.number().min(1),
});

interface Query {
	generation?: string;
	name?: { $regex: string; $options: 'i' };
	number?: number;
	types?: { $in: string[] };
}

export const PokemonController = {
	async getAll(request: Request, response: Response) {
		const { generation, search, types, page, page_size } = parseRequest(
			getAllQuerySchema,
			request.query,
		);
		const query = {} as Query;

		// checks needed for query construction
		if (generation) {
			query.generation = generation;
		}
		if (search) {
			const isNumber = /^\d+$/.test(search);
			if (isNumber) {
				query.number = Number(search);
			} else {
				query.name = { $regex: search, $options: 'i' };
			}
		}
		if (types.length > 0) {
			query.types = { $in: types };
		}

		// do query
		const totalItems = await Pokemon.find(query).countDocuments();
		const pokemons = await Pokemon.find(query, '-_id number display_name types sprite')
			.sort('number')
			.skip((page - 1) * page_size)
			.limit(page_size);

		return response.header(TOTAL_ITEMS_HEADER, String(totalItems)).json(pokemons);
	},

	async getOne(request: Request, response: Response) {
		const { number } = parseRequest(getOneParamsSchema, request.params);

		const pokemonsRepository = new PokemonsRepositoryMongoose();
		const getPokemonByNumberService = new GetPokemonByNumberService(pokemonsRepository);
		const getPokemonsByNamesService = new GetPokemonsByNamesService(pokemonsRepository);
		const pokemon = await getPokemonByNumberService.execute(number);

		const typesRepository = new TypesRepositoryMongoose();
		const getTypesByNamesService = new GetTypesByNamesService(typesRepository);
		const types = await getTypesByNamesService.execute(pokemon.types);

		const { common, variants } = splitEvolutionBranches(pokemon.evolution_chain);
		const [commonEvolutionChain, ...variantEvolutionChain] = await Promise.all([
			getPokemonsByNamesService.execute(common),
			...variants.map(branch => getPokemonsByNamesService.execute(branch)),
		]);

		return response.json({
			number: pokemon.number,
			name: pokemon.display_name,
			types: pokemon.types,
			description: pokemon.description,
			sprite: pokemon.sprite,
			evolution_chain: {
				common: commonEvolutionChain,
				variant: variantEvolutionChain,
			},
			matchups: getTypeMatchups(types),
		});
	},
};
