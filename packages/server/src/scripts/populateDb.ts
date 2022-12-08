/* eslint-disable no-console */
import 'dotenv/config';
import mongoose from 'mongoose';
import { MainClient } from 'pokenode-ts';

import { STARTERS_BY_GENERATION } from '../config/constants';
import { Generation, Pokemon, Type } from '../models';
import { getIdFromUrl } from '../utils';

const P = new MainClient();

mongoose.connect(process.env.MONGO_URL);

async function insertGenerations(genList) {
	console.log('Truncating Generation table...');
	await Generation.deleteMany();

	console.log('Saving generations...');
	await Generation.insertMany(
		genList.map(g => ({
			name: g.name,
			number: getIdFromUrl(g.url),
			starters: STARTERS_BY_GENERATION[g.name],
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
		generations = await P.game.listGenerations();
		generations = generations.results.sort((a, b) => getIdFromUrl(a.url) - getIdFromUrl(b.url));
	} catch (error) {
		console.error(error, 'Failed getting generations');
		throw error;
	}

	console.log('Getting types...');
	try {
		types = await P.pokemon.listTypes();
		types = types.results
			.filter(type => !['shadow', 'unknown'].includes(type.name))
			.map(type => type.name);
		types = await Promise.all(types.map(type => P.pokemon.getTypeByName(type)));
	} catch (error) {
		console.error(error, 'Failed getting types');
		throw error;
	}

	console.log('Getting pokemons of these generations...');
	try {
		const generationList = await Promise.all(
			generations.map(g => P.game.getGenerationByName(g.name)),
		);
		const pokemonIds = generationList.flatMap(gen =>
			gen.pokemon_species.map(species => getIdFromUrl(species.url)),
		);

		console.log('Getting each pokémon by ID...');
		const pokemonSpecies = await Promise.all(
			pokemonIds.map(pokemonId => P.pokemon.getPokemonById(pokemonId)),
		);

		console.log('Getting each pokémon by species...');
		pokemons = await Promise.all(
			pokemonSpecies.map(pokemon => P.pokemon.getPokemonSpeciesById(pokemon.id)),
		);

		console.log('Getting evolution chains...');
		const evolutionChainIds = pokemons
			.filter(pokemon => !!pokemon.evolution_chain)
			.map(pokemon => getIdFromUrl(pokemon.evolution_chain.url));
		const evolutionChains = await Promise.all(
			evolutionChainIds.map(evolutionChainId =>
				P.evolution.getEvolutionChainById(evolutionChainId),
			),
		);

		console.log('Updating each pokémon with its evolution chain...');
		pokemons = pokemons.map((pokemon, index) => ({
			...pokemon,
			types: pokemonSpecies[index].types,
			evolutionChain: evolutionChains[index]
				? getEvolutionChainList(evolutionChains[index].chain)
				: [],
		}));
	} catch (error) {
		console.error(error, 'Failed getting pokemons of each generation');
		throw error;
	}

	console.log('Updating pokémon data on database...');
	await insertGenerations(generations);
	await insertTypes(types);
	await insertPokemons(pokemons);
}

getPokemonsList().then(() => process.exit());
