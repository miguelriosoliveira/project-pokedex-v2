import { Joi, Segments } from 'celebrate';
import { Request, Response } from 'express';

import { DEFAULT_PAGE_SIZE, GENERATIONS, TOTAL_ITEMS_HEADER } from '../config/constants';
import { Pokemon, Type } from '../models';

interface GetAllRequestQuery {
	generation: string;
	page: number;
	pageSize: number;
	search: string;
	types: string[];
}

interface Query {
	generation?: string;
	name?: { $regex: string; $options: 'i' };
	number?: number;
	types?: { $in: string[] };
}

export const PokemonController = {
	getAllSchema: {
		[Segments.QUERY]: {
			generation: Joi.string().valid(...Object.values(GENERATIONS)),
			search: Joi.string().allow('').default(''),
			types: Joi.array().default([]),
			page: Joi.number().min(1).default(1),
			pageSize: Joi.number().min(1).default(DEFAULT_PAGE_SIZE),
		},
	},

	async getAll(request: Request<null, null, null, GetAllRequestQuery>, response: Response) {
		const { generation, search, types, page, pageSize } = request.query;
		const query = {} as Query;

		// checks needed for query construction
		if (generation) {
			query.generation = generation;
		}
		if (search) {
			if (Number.isNaN(search)) {
				query.name = { $regex: search, $options: 'i' };
			} else {
				query.number = Number(search);
			}
		}
		if (types.length > 0) {
			query.types = { $in: types };
		}

		// do query
		// eslint-disable-next-line unicorn/no-array-callback-reference
		const totalItems = await Pokemon.find(query).countDocuments();
		// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-callback-reference
		const pokemons = await Pokemon.find(query, 'displayName number types')
			.sort('number')
			.skip((page - 1) * pageSize)
			.limit(pageSize);

		return response.header(TOTAL_ITEMS_HEADER, String(totalItems)).json(pokemons);
	},

	getOneSchema: {
		[Segments.PARAMS]: {
			number: Joi.number().min(1).required(),
		},
	},

	async getOne(request: Request, response: Response) {
		const { number } = request.params;

		let pokemon = null;
		let types = null;

		try {
			pokemon = await Pokemon.findOne({ number });
			types = await Type.find({ name: { $in: pokemon.types } });
		} catch (error) {
			let status = 500;
			if (error.response) {
				status = error.response.status;
			}
			return response.status(status).json(error);
		}

		const evolutionChain = { common: [], variant: [] };

		if (Array.isArray(pokemon.evolutionChain[0])) {
			const intersection = pokemon.evolutionChain.reduce((intersec, chain) =>
				intersec.filter(form => chain.includes(form)),
			);
			const difference = pokemon.evolutionChain.reduce(
				(diff, chain) => [...diff, ...chain.filter(form => !intersection.includes(form))],
				[],
			);

			evolutionChain.common = await Pokemon.find(
				{ name: { $in: intersection } },
				'displayName number types',
			).sort('number');

			evolutionChain.variant = await Pokemon.find(
				{ name: { $in: difference } },
				'displayName number types',
			).sort('number');
		} else {
			const evolutionChainPokemons = await Pokemon.find(
				{ name: { $in: pokemon.evolutionChain } },
				'displayName number types',
			);
			evolutionChain.common = [...evolutionChain.common, ...evolutionChainPokemons];
		}

		return response.json({
			number: pokemon.number,
			name: pokemon.displayName,
			types: pokemon.types,
			description: pokemon.description,
			weaknesses: [
				...new Set(
					types.flatMap(type => [
						...type.doubleDamageFrom,
						...type.halfDamageTo,
						...type.noDamageTo,
					]),
				),
			].sort(),
			evolutionChain,
		});
	},
};
