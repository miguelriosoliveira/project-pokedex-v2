/* eslint-disable no-console */
import 'dotenv/config';
import { ChainLink, EvolutionChain, MainClient, Pokemon, PokemonSpecies } from 'pokenode-ts';

import { db } from '../database';
import {
	Generation,
	GenerationSchema,
	Type,
	TypeSchema,
	Pokemon as PokemonModel,
	PokemonSchema,
} from '../models';
import { createFakeEvolutionChain, getIdFromUrl } from '../utils';
import { Replace } from '../utils/types';

const P = new MainClient();

async function saveGenerations(generations: GenerationSchema[]) {
	console.log('Truncating Generation table...');
	await Generation.deleteMany();

	console.log('Saving generations...');
	await Generation.insertMany(generations);
	console.log('Generations saved!');
}

async function saveTypes(types: TypeSchema[]) {
	console.log('Truncating Type table...');
	await Type.deleteMany();

	console.log('Saving types...');
	await Type.insertMany(types);
	console.log('Types saved!');
}

async function savePokemons(pokemons: PokemonSchema[]) {
	console.log('Truncating Pokemon table...');
	await PokemonModel.deleteMany();

	console.log('Saving pokemons...');
	await PokemonModel.insertMany(pokemons);
	console.log('Pokemons saved!');
}

function parseEvolutionChain(chainData: ChainLink, resultChain: string[] = []): string[] {
	const resultChainTmp = [...resultChain, chainData.species.name];
	const { evolves_to } = chainData;

	if (evolves_to.length === 0) {
		return resultChainTmp;
	}

	if (evolves_to.length === 1) {
		return parseEvolutionChain(evolves_to[0], resultChainTmp);
	}

	return evolves_to.flatMap(et => parseEvolutionChain(et, resultChainTmp));
}

async function getPokemons() {
	const { results: speciesList } = await P.pokemon.listPokemonSpecies(890);

	const speciesMissingEvolutionChain = await Promise.all(
		speciesList.map(sp => P.pokemon.getPokemonSpeciesByName(sp.name)),
	);

	const evolutionChains = await Promise.all<EvolutionChain>(
		speciesMissingEvolutionChain.map(({ name, id, evolution_chain }) =>
			evolution_chain
				? P.evolution.getEvolutionChainById(getIdFromUrl(evolution_chain.url))
				: new Promise(resolve => resolve(createFakeEvolutionChain({ name, number: id }))),
		),
	);

	const species = speciesMissingEvolutionChain.map((sp, i) => ({
		...sp,
		evolution_chain: evolutionChains[i],
	}));

	const pokemons = await Promise.all(species.map(sp => P.pokemon.getPokemonById(sp.id)));

	return species.map((sp, i) => ({ ...sp, ...pokemons[i] }));
}

type ApiPokemonData = Pokemon & Replace<PokemonSpecies, { evolution_chain: EvolutionChain }>;

async function mapPokemonsToDb(apiPokemonData: ApiPokemonData[]) {
	return apiPokemonData.map(
		({
			id,
			name,
			names,
			generation,
			flavor_text_entries,
			evolution_chain,
			types,
			forms,
			sprites,
		}) => ({
			number: id,
			name,
			display_name: names.find(displayName => displayName.language.name === 'en')?.name || name,
			generation: generation.name,
			description:
				flavor_text_entries.find(description => description.language.name === 'en')?.flavor_text ||
				'',
			evolution_chain: parseEvolutionChain(evolution_chain.chain),
			forms: forms.map(form => form.name),
			types: types.map(type => type.type.name),
			sprite: sprites.other?.['official-artwork'].front_default || '',
		}),
	);
}

async function populateDb() {
	const apiPokemonData = await getPokemons();

	console.log(apiPokemonData);

	// const pokemons = await mapPokemonsToDb(apiPokemonData);
	// await savePokemons(pokemons);
}

db.connect()
	.then(() => populateDb())
	.then(() => db.disconnect());
