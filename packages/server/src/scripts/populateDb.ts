/* eslint-disable no-console */
import 'dotenv/config';
import { ChainLink, EvolutionChain, MainClient } from 'pokenode-ts';

import { db } from '../database';
import { Pokemon } from '../models';
import { getIdFromUrl } from '../utils';

const P = new MainClient();

interface PokemonToSave {
	forms: string[];
	types: string[];
	sprite: string;
	evolution_chain: string[];
	number: number;
	name: string;
	display_name: string;
	generation: string;
	description: string;
}

async function insertPokemons(pokemons: PokemonToSave[]) {
	console.log('Truncating Pokemon table...');

	await Pokemon.deleteMany();
	console.log('Saving pokemons...');

	await Pokemon.insertMany(pokemons);
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
	// console.log(speciesList);

	const species = await Promise.all(
		speciesList.map(sp => P.pokemon.getPokemonSpeciesByName(sp.name)),
	);
	// console.log(species);

	const speciesPartiallyMapped = species.map(
		({ id, name, names, generation, flavor_text_entries, evolution_chain }) => ({
			number: id,
			name,
			display_name: names.find(displayName => displayName.language.name === 'en')?.name,
			generation: generation.name,
			description: flavor_text_entries.find(description => description.language.name === 'en')
				?.flavor_text,
			evolution_chain_id: evolution_chain ? getIdFromUrl(evolution_chain.url) : null,
		}),
	);
	// console.log(speciesMappedToDb);

	const evolutionChains = await Promise.all<EvolutionChain>(
		speciesPartiallyMapped.map(sp =>
			sp.evolution_chain_id
				? P.evolution.getEvolutionChainById(sp.evolution_chain_id)
				: new Promise(resolve => {
						resolve({
							id: -1,
							baby_trigger_item: null,
							chain: {
								evolution_details: [],
								evolves_to: [],
								is_baby: false,
								species: {
									name: sp.name,
									url: `https://pokeapi.co/api/v2/pokemon-species/${sp.number}/`,
								},
							},
						});
				  }),
		),
	);
	// console.log(evolutionChains);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const speciesMappedToDb = speciesPartiallyMapped.map(({ evolution_chain_id, ...sp }, i) => ({
		...sp,
		evolution_chain: parseEvolutionChain(evolutionChains[i].chain),
	}));
	// console.log(speciesMappedToDb);

	const pokemons = await Promise.all(
		speciesMappedToDb.map(sp => P.pokemon.getPokemonById(sp.number)),
	);
	// console.log(pokemons);

	const pokemonsMappedToDb = pokemons.map(({ types, forms, sprites }) => ({
		forms: forms.map(form => form.name),
		types: types.map(type => type.type.name),
		sprite: sprites.other?.['official-artwork'].front_default,
	}));
	// console.log(pokemonsMappedToDb);

	const dataToSave = speciesMappedToDb.map((sp, i) => ({ ...sp, ...pokemonsMappedToDb[i] }));
	console.log(dataToSave);

	await insertPokemons(dataToSave);
}

db.connect()
	.then(() => getPokemons())
	.then(() => db.disconnect());
