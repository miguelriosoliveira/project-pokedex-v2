/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
const Pokedex = require('pokedex-promise-v2');

const Generation = require('../models/Generation');
const Pokemon = require('../models/Pokemon');
const Type = require('../models/Type');
const { generations, getIdFromUrl } = require('../utils/Utils');

const P = new Pokedex();

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function insertGenerations(genList) {
	console.log('Truncating Generation table...');
	await Generation.deleteMany();
	console.log('Saving generations...');
	const startersByGeneration = {
		[generations.g1]: [1, 4, 7],
		[generations.g2]: [152, 155, 158],
		[generations.g3]: [252, 255, 258],
		[generations.g4]: [387, 390, 393],
		[generations.g5]: [495, 498, 501],
		[generations.g6]: [650, 653, 656],
		[generations.g7]: [722, 725, 728],
	};
	console.log(startersByGeneration);

	await Generation.insertMany(
		genList.map(g => ({
			name: g.name,
			number: getIdFromUrl(g.url),
			starters: startersByGeneration[g.name],
		})),
	);
	console.log('Generations saved!');
}

async function insertTypes(types) {
	console.log('Truncating Type table...');
	await Type.deleteMany();
	console.log('Saving types...');
	await Type.insertMany(
		types.map(type => ({
			name: type.name,

			doubleDamageFrom: type.damage_relations.double_damage_from.map(type => type.name),
			doubleDamageTo: type.damage_relations.double_damage_to.map(type => type.name),

			halfDamageFrom: type.damage_relations.half_damage_from.map(type => type.name),
			halfDamageTo: type.damage_relations.half_damage_to.map(type => type.name),

			noDamageFrom: type.damage_relations.no_damage_from.map(type => type.name),
			noDamageTo: type.damage_relations.no_damage_to.map(type => type.name),
		})),
	);
	console.log('Types saved!');
}

async function insertPokemons(pokemons) {
	console.log('Truncating Pokemon table...');
	await Pokemon.deleteMany();
	console.log('Saving pokemons...');
	await Pokemon.insertMany(
		pokemons.map(pokemon => ({
			name: pokemon.name,
			displayName: pokemon.names.find(name => name.language.name === 'en').name,
			number: pokemon.id,
			types: pokemon.types.map(type => type.type.name),
			generation: pokemon.generation.name,
			evolutionChain: pokemon.evolutionChain,
			description: pokemon.flavor_text_entries.find(fte => fte.language.name === 'en').flavor_text,
		})),
	);
	console.log('Pokemons saved!');
}

function getEvolutionChainList(chainData, resultChain = []) {
	const resultChainTmp = [...resultChain, chainData.species.name];
	const { evolves_to } = chainData;

	if (evolves_to.length === 0) {
		return resultChainTmp;
	}

	if (evolves_to.length === 1) {
		return getEvolutionChainList(evolves_to[0], resultChainTmp);
	}

	return evolves_to.map(et => getEvolutionChainList(et, resultChainTmp));
}

async function getPokemonsList() {
	let generations = [];
	let types = [];
	let pokemons = [];

	console.log('Getting generations...');
	try {
		generations = await P.getGenerationsList();
		generations = generations.results.sort((a, b) => getIdFromUrl(a.url) - getIdFromUrl(b.url));
	} catch (error) {
		console.error(error);
		process.exit();
	}

	console.log('Getting types...');
	try {
		types = await P.getTypesList();
		types = types.results
			.filter(type => !['shadow', 'unknown'].includes(type.name))
			.map(type => type.name);
		types = await P.getTypeByName(types);
	} catch (error) {
		console.error(error);
		process.exit();
	}

	console.log('Getting pokemons of these generations...');
	try {
		const pokemonList = await P.getGenerationByName(generations.map(g => g.name));
		const ids = pokemonList.flatMap(gen =>
			gen.pokemon_species.map(species => getIdFromUrl(species.url)),
		);
		console.log('Getting [ P.getPokemonByName(ids) ]...');
		const pokemons_ = await P.getPokemonByName(ids);
		console.log('Getting [ P.getPokemonSpeciesByName(ids) ]...');
		pokemons = await P.getPokemonSpeciesByName(ids);
		const evolutionChainIds = pokemons.map(pokemon => getIdFromUrl(pokemon.evolution_chain.url));
		console.log('Getting [ P.getEvolutionChainById(evolutionChainIds) ]...');
		const evolutionChains = await P.getEvolutionChainById(evolutionChainIds);
		pokemons = pokemons.map((pokemon, index) => ({
			...pokemon,
			types: pokemons_[index].types,
			evolutionChain: getEvolutionChainList(evolutionChains[index].chain),
		}));
	} catch (error) {
		console.error(error);
		process.exit();
	}

	await insertGenerations(generations);
	await insertTypes(types);
	await insertPokemons(pokemons);

	process.exit();
}

getPokemonsList();
