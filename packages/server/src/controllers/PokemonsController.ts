import { Joi, Segments } from 'celebrate';
import { Request, Response } from 'express';

import { DEFAULT_PAGE_SIZE, GENERATIONS, TOTAL_ITEMS_HEADER } from '../config/constants';
import { Pokemon, PokemonSchema } from '../models';
import { PokemonsRepositoryMongoose, TypesRepositoryMongoose } from '../repositories';
import {
	GetPokemonByNumberService,
	GetPokemonsByNamesService,
	GetTypesByNamesService,
} from '../services';

interface GetAllRequestQuery {
	generation: string;
	search: string;
	types: string[];
	page: number;
	page_size: number;
}

interface Query {
	generation?: string;
	name?: { $regex: string; $options: 'i' };
	number?: number;
	types?: { $in: string[] };
}

interface GetOneParams {
	number: number;
}

export const PokemonController = {
	getAllSchema: {
		[Segments.QUERY]: {
			generation: Joi.string().valid(...Object.values(GENERATIONS)),
			search: Joi.string().allow('').default(''),
			types: Joi.array().default([]),
			page: Joi.number().min(1).default(1),
			page_size: Joi.number().min(1).default(DEFAULT_PAGE_SIZE),
		},
	},

	async getAll(request: Request<null, null, null, GetAllRequestQuery>, response: Response) {
		const { generation, search, types, page, page_size } = request.query;
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
		// eslint-disable-next-line unicorn/no-array-callback-reference
		const totalItems = await Pokemon.find(query).countDocuments();
		// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
		const pokemons = await Pokemon.find(query, '-_id number display_name types sprite')
			.sort('number')
			.skip((page - 1) * page_size)
			.limit(page_size);

		return response.header(TOTAL_ITEMS_HEADER, String(totalItems)).json(pokemons);
	},

	getOneSchema: {
		[Segments.PARAMS]: {
			number: Joi.number().min(1).required(),
		},
	},

	async getOne(request: Request<GetOneParams>, response: Response) {
		const { number } = request.params;

		const pokemonsRepository = new PokemonsRepositoryMongoose();
		const getPokemonByNumberService = new GetPokemonByNumberService(pokemonsRepository);
		const getPokemonsByNamesService = new GetPokemonsByNamesService(pokemonsRepository);
		const pokemon = await getPokemonByNumberService.execute(number);

		const typesRepository = new TypesRepositoryMongoose();
		const getTypesByNamesService = new GetTypesByNamesService(typesRepository);
		const types = await getTypesByNamesService.execute(pokemon.types);

		let commonEvolutionChain: PokemonSchema[] = [];
		let variantEvolutionChain: PokemonSchema[] = [];

		if (pokemon.evolution_chain.length > 1) {
			const intersection = pokemon.evolution_chain.reduce(
				(intersec, chain) => intersec.filter(form => chain.includes(form)),
				[],
			);
			const difference = pokemon.evolution_chain.reduce(
				(diff, chain) => [...diff, ...chain.filter(form => !intersection.includes(form))],
				[],
			);

			// evolutionChain.common = await Pokemon.find(
			// 	{ name: { $in: intersection } },
			// 	'displayName number types',
			// ).sort('number');

			// evolutionChain.variant = await Pokemon.find(
			// 	{ name: { $in: difference } },
			// 	'displayName number types',
			// ).sort('number');
			[commonEvolutionChain, variantEvolutionChain] = await Promise.all([
				getPokemonsByNamesService.execute(intersection),
				getPokemonsByNamesService.execute(difference),
			]);
		} else {
			commonEvolutionChain = await getPokemonsByNamesService.execute(pokemon.evolution_chain[0]);
			// commonEvolutionChain = [...commonEvolutionChain, ...evolutionChainPokemons];
		}

		return response.json({
			number: pokemon.number,
			name: pokemon.display_name,
			types: pokemon.types,
			description: pokemon.description,
			sprite: pokemon.sprite,
			evolutionChain: {
				common: commonEvolutionChain,
				variant: variantEvolutionChain,
			},
			weaknesses: [
				...new Set(
					types.flatMap(type => [
						...type.double_damage_from,
						...type.half_damage_to,
						...type.no_damage_to,
					]),
				),
			].sort(),
		});
	},
};
