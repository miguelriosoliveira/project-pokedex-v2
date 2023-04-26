/* eslint-disable no-console */
import 'dotenv/config';
import {
	ChainLink,
	EvolutionChain,
	Generation,
	MainClient,
	Pokemon,
	PokemonSpecies,
	Type,
} from 'pokenode-ts';

import { DEFAULT_PAGE_SIZE, STARTERS_BY_GENERATION } from '../config/constants';
import { db } from '../database';
import {
	Generation as GenerationModel,
	GenerationSchema,
	Pokemon as PokemonModel,
	PokemonSchema,
	Type as TypeModel,
	TypeSchema,
} from '../models';
import { createFakeEvolutionChain, createRange, getIdFromUrl, Replace } from '../utils';

const P = new MainClient();

// ======================================= GENERATIONS DATA =======================================

async function getGenerations() {
	const { results: generationsList } = await P.game.listGenerations();
	console.log(`Getting ${generationsList.length} generations from API...`);
	return Promise.all(generationsList.map(g => P.game.getGenerationByName(g.name)));
}

async function mapGenerationsToDb(apiGenerationsData: Generation[]): Promise<GenerationSchema[]> {
	return apiGenerationsData.map(({ name, id }) => ({
		name,
		number: id,
		starters: STARTERS_BY_GENERATION[name],
	}));
}

async function saveGenerations(generations: GenerationSchema[]) {
	console.log('Truncating Generation table...');
	await GenerationModel.deleteMany();

	console.log(`Saving ${generations.length} generations...`);
	await GenerationModel.insertMany(generations);
	console.log('Generations saved!');
}

// ========================================== TYPES DATA ==========================================

async function getTypes() {
	const { results: typesList } = await P.pokemon.listTypes();
	console.log(`Getting ${typesList.length} types from API...`);
	return Promise.all(
		typesList
			.filter(t => !['unknown', 'shadow'].includes(t.name))
			.map(t => P.pokemon.getTypeByName(t.name)),
	);
}

async function mapTypesToDb(apiTypesData: Type[]): Promise<TypeSchema[]> {
	return apiTypesData.map(({ name, damage_relations }) => ({
		name,

		double_damage_from: damage_relations.double_damage_from.map(type => type.name),
		double_damage_to: damage_relations.double_damage_to.map(type => type.name),

		half_damage_from: damage_relations.half_damage_from.map(type => type.name),
		half_damage_to: damage_relations.half_damage_to.map(type => type.name),

		no_damage_from: damage_relations.no_damage_from.map(type => type.name),
		no_damage_to: damage_relations.no_damage_to.map(type => type.name),
	}));
}

async function saveTypes(types: TypeSchema[]) {
	console.log('Truncating Type table...');
	await TypeModel.deleteMany();

	console.log(`Saving ${types.length} types...`);
	await TypeModel.insertMany(types);
	console.log('Types saved!');
}

// ========================================= POKÉMON DATA =========================================

function parseEvolutionChain(chainData: ChainLink, resultChain: string[] = []) {
	const resultChainTmp = [...resultChain, chainData.species.name];
	const { evolves_to } = chainData;

	if (evolves_to.length === 0) {
		return resultChainTmp;
	}

	if (evolves_to.length === 1) {
		return parseEvolutionChain(evolves_to[0], resultChainTmp);
	}

	return evolves_to.map(et => parseEvolutionChain(et, resultChainTmp));
}

type ApiPokemonData = Pokemon & Replace<PokemonSpecies, { evolution_chain: EvolutionChain }>;

async function getPokemonsPage(offset = 0): Promise<ApiPokemonData[]> {
	const { results: speciesList } = await P.pokemon.listPokemonSpecies(offset);

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

	return species.map((sp, i) => ({ ...pokemons[i], ...sp }));
}

async function getPokemons() {
	const { count: total } = await P.pokemon.listPokemonSpecies();
	console.log(`Getting ${total} Pokémon from API...`);
	const range = createRange(total, DEFAULT_PAGE_SIZE);
	const results = await Promise.all(range.map(offset => getPokemonsPage(offset)));
	return results.flat();
}

async function mapPokemonsToDb(apiPokemonData: ApiPokemonData[]): Promise<PokemonSchema[]> {
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

async function savePokemons(pokemons: PokemonSchema[]) {
	console.log('Truncating Pokemon table...');
	await PokemonModel.deleteMany();

	console.log(`Saving ${pokemons.length} pokemons...`);
	await PokemonModel.insertMany(pokemons);
	console.log('Pokemons saved!');
}

// ======================================== SAVING ALL DATA ========================================

async function populateDb() {
	const [apiGenerationsData, apiTypesData, apiPokemonData] = await Promise.all([
		getGenerations(),
		getTypes(),
		getPokemons(),
	]);
	const [generations, types, pokemons] = await Promise.all([
		mapGenerationsToDb(apiGenerationsData),
		mapTypesToDb(apiTypesData),
		mapPokemonsToDb(apiPokemonData),
	]);
	await Promise.all([saveGenerations(generations), saveTypes(types), savePokemons(pokemons)]);
}

db.connect()
	.then(() => populateDb())
	.then(() => db.disconnect());
