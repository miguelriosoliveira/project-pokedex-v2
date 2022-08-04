const { Joi, Segments } = require('celebrate');

const Pokemon = require('../models/Pokemon');
const Type = require('../models/Type');
const { generations, totalItemsHeader } = require('../utils/Utils');

module.exports = {
	getAllSchema: {
		[Segments.QUERY]: {
			generation: Joi.string().valid(...Object.values(generations)),
			search: Joi.string().default(''),
			types: Joi.array().default([]),
			page: Joi.number().min(1).default(1),
		},
	},
	async getAll(request, response) {
		const { generation, search, types, page } = request.query;
		const query = {};

		// checks for query construction
		if (generation) {
			query.generation = generation;
		}
		if (search) {
			if (Number.isNaN(search)) {
				query.name = { $regex: search, $options: 'i' };
			} else {
				query.number = search;
			}
		}
		if (types.length) {
			query.types = { $in: types };
		}

		// do query
		const itemsPerPage = 20;
		const totalItems = await Pokemon.find(query).countDocuments();
		const pokemons = await Pokemon.find(query, 'displayName number types')
			.sort('number')
			.skip((page - 1) * itemsPerPage)
			.limit(itemsPerPage);

		return response.header(totalItemsHeader, totalItems).json(pokemons);
	},

	getOneSchema: {
		[Segments.PARAMS]: {
			number: Joi.number().min(1).required(),
		},
	},
	async getOne(request, response) {
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
			for (const evolution of pokemon.evolutionChain) {
				evolutionChain.common.push(
					await Pokemon.findOne({ name: evolution }, 'displayName number types'),
				);
			}
		}

		return response.json({
			number: pokemon.number,
			name: pokemon.displayName,
			types: pokemon.types,
			description: pokemon.description,
			weaknesses: Array.from(
				new Set(
					types.flatMap(type =>
						type.doubleDamageFrom.concat(type.halfDamageTo).concat(type.noDamageTo),
					),
				),
			).sort(),
			evolutionChain,
		});
	},
};
