import { StatusCodes } from 'http-status-codes';
import type { Mongoose } from 'mongoose';
import supertest from 'supertest';

import { app } from '../app';
import { TOTAL_ITEMS_HEADER } from '../config/constants';
import { db } from '../config/database';
import { Pokemon } from '../models';
import { createFakeDb } from '../utils/tests';

const request = supertest(app);
let dbInstance: Mongoose;

beforeAll(async () => {
	const fakeDb = await createFakeDb();
	dbInstance = await db.connect(fakeDb.getUri());
});

beforeEach(async () => {
	await dbInstance.connection.dropDatabase();
});

describe('PokemonsController', () => {
	describe('#getAll', () => {
		it('should return a page of pokemons sorted by number', async () => {
			// Arrange
			await Pokemon.insertMany([
				{
					number: 4,
					name: 'charmander',
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					name: 'squirtle',
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
			]);

			// Act
			const response = await request.get('/pokemon');

			// Assert
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('3');
			expect(response.body).toStrictEqual([
				{
					number: 1,
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
				{
					number: 4,
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
			]);
		});

		it('should return a page of pokemons of a generation that is not in the hardcoded list', async () => {
			await Pokemon.insertMany([
				{
					number: 1000,
					name: 'foo',
					display_name: 'Foo',
					types: ['normal'],
					sprite: 'path/to/foo/sprite.png',
					generation: 'generation-x',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
					generation: 'generation-i',
				},
			]);

			const response = await request.get('/pokemon').query({ generation: 'generation-x' });

			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('1');
			expect(response.body).toStrictEqual([
				{
					number: 1000,
					display_name: 'Foo',
					types: ['normal'],
					sprite: 'path/to/foo/sprite.png',
				},
			]);
		});

		it('should return a page of pokemons of a generation', async () => {
			// Arrange
			await Pokemon.insertMany([
				{
					number: 252,
					name: 'treecko',
					display_name: 'Treecko',
					types: ['grass'],
					sprite: 'path/to/treecko/sprite.png',
					generation: 'generation-iii',
				},
				{
					number: 152,
					name: 'chikorita',
					display_name: 'Chikorita',
					types: ['grass'],
					sprite: 'path/to/chikorita/sprite.png',
					generation: 'generation-ii',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
					generation: 'generation-i',
				},
			]);

			// Act
			const response = await request.get('/pokemon').query({ generation: 'generation-ii' });

			// Assert
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('1');
			expect(response.body).toStrictEqual([
				{
					number: 152,
					display_name: 'Chikorita',
					types: ['grass'],
					sprite: 'path/to/chikorita/sprite.png',
				},
			]);
		});

		it('should return a page of pokemons of a type set', async () => {
			// Arrange
			await Pokemon.insertMany([
				{
					number: 4,
					name: 'charmander',
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					name: 'squirtle',
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
			]);

			// Act
			const response = await request.get('/pokemon').query({ 'types[]': ['water'] });

			// Assert
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('1');
			expect(response.body).toStrictEqual([
				{
					number: 7,
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
			]);
		});

		it('should return a page of pokemons containing a piece of the name', async () => {
			// Arrange
			await Pokemon.insertMany([
				{
					number: 4,
					name: 'charmander',
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					name: 'squirtle',
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
				{
					number: 2,
					name: 'ivysaur',
					display_name: 'Ivysaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/ivysaur/sprite.png',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
			]);

			// Act
			const response = await request.get('/pokemon').query({ search: 'saur' });

			// Assert
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('2');
			expect(response.body).toStrictEqual([
				{
					number: 1,
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
				{
					number: 2,
					display_name: 'Ivysaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/ivysaur/sprite.png',
				},
			]);
		});

		it('should return a page of a single pokemon by its number', async () => {
			// Arrange
			await Pokemon.insertMany([
				{
					number: 4,
					name: 'charmander',
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					name: 'squirtle',
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
				{
					number: 2,
					name: 'ivysaur',
					display_name: 'Ivysaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/ivysaur/sprite.png',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
			]);

			// Act
			const response = await request.get('/pokemon').query({ search: '2' });

			// Assert
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('1');
			expect(response.body).toStrictEqual([
				{
					number: 2,
					display_name: 'Ivysaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/ivysaur/sprite.png',
				},
			]);
		});

		it('should return the second page of pokemons', async () => {
			// Arrange
			await Pokemon.insertMany([
				{
					number: 4,
					name: 'charmander',
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					name: 'squirtle',
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
				{
					number: 2,
					name: 'ivysaur',
					display_name: 'Ivysaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/ivysaur/sprite.png',
				},
				{
					number: 1,
					name: 'bulbasaur',
					display_name: 'Bulbasaur',
					types: ['grass', 'poison'],
					sprite: 'path/to/bulbasaur/sprite.png',
				},
			]);

			// Act
			const response = await request.get('/pokemon').query({ page: 2, page_size: 2 });

			// Assert
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.headers[TOTAL_ITEMS_HEADER]).toBe('4');
			expect(response.body).toStrictEqual([
				{
					number: 4,
					display_name: 'Charmander',
					types: ['fire'],
					sprite: 'path/to/charmander/sprite.png',
				},
				{
					number: 7,
					display_name: 'Squirtle',
					types: ['water'],
					sprite: 'path/to/squirtle/sprite.png',
				},
			]);
		});

		it('should fail when page is invalid', async () => {
			const response = await request.get('/pokemon').query({ page: 0 });

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
		});
	});

	describe('#getOne', () => {
		it('should fail when number is invalid', async () => {
			const response = await request.get('/pokemon/0');

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
		});

		it('should return both branches of a split evolution chain', async () => {
			const evolutionChain = [
				['charcadet', 'armarouge'],
				['charcadet', 'ceruledge'],
			];
			await Pokemon.insertMany([
				{
					number: 935,
					name: 'charcadet',
					display_name: 'Charcadet',
					types: ['fire'],
					sprite: 'path/to/charcadet/sprite.png',
					evolution_chain: evolutionChain,
				},
				{
					number: 936,
					name: 'armarouge',
					display_name: 'Armarouge',
					types: ['fire', 'psychic'],
					sprite: 'path/to/armarouge/sprite.png',
					evolution_chain: evolutionChain,
				},
				{
					number: 937,
					name: 'ceruledge',
					display_name: 'Ceruledge',
					types: ['fire', 'ghost'],
					sprite: 'path/to/ceruledge/sprite.png',
					evolution_chain: evolutionChain,
				},
			]);

			const response = await request.get('/pokemon/935');

			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(
				response.body.evolution_chain.common.map((pokemon: { name: string }) => pokemon.name),
			).toEqual(['charcadet']);
			expect(
				response.body.evolution_chain.variant
					.map((pokemon: { name: string }) => pokemon.name)
					.sort(),
			).toEqual(['armarouge', 'ceruledge']);
		});
	});
});
