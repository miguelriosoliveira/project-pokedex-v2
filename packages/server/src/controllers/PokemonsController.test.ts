import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';

import { app } from '../app';
import { db } from '../config/database';
import { Pokemon } from '../models';
import { createFakeDb } from '../utils/tests';
import { TOTAL_ITEMS_HEADER } from '../config/constants';
import { Mongoose } from 'mongoose';

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
	});

	describe('#getOne', () => {
		it.todo('should fail when number is invalid');
		it.todo('should return a pokemon details by its number');
	});
});
