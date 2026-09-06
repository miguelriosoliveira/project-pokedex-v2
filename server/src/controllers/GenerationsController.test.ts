import { StatusCodes } from 'http-status-codes';
import type { Mongoose } from 'mongoose';
import supertest from 'supertest';

import { app } from '../app';
import { db } from '../config/database';
import { Generation, Pokemon } from '../models';
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

describe('GenerationsController', () => {
	describe('#getAll', () => {
		it('should return generations using display names stored in the catalog', async () => {
			await Generation.insertMany([
				{
					name: 'generation-x',
					number: 10,
					region: 'orre',
					display_name: 'Generation 10',
					starters: [1000, 1003, 1006],
				},
			]);
			await Pokemon.insertMany([
				{
					number: 1000,
					name: 'foo',
					display_name: 'Foo',
					sprite: 'path/to/foo/sprite.png',
				},
				{
					number: 1003,
					name: 'bar',
					display_name: 'Bar',
					sprite: 'path/to/bar/sprite.png',
				},
				{
					number: 1006,
					name: 'baz',
					display_name: 'Baz',
					sprite: 'path/to/baz/sprite.png',
				},
			]);

			const response = await request.get('/generations');

			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.body).toStrictEqual([
				{
					name: 'generation-x',
					region: 'orre',
					display_name: 'Generation 10',
					starters: [
						{
							name: 'foo',
							number: 1000,
							sprite: 'path/to/foo/sprite.png',
						},
						{
							name: 'bar',
							number: 1003,
							sprite: 'path/to/bar/sprite.png',
						},
						{
							name: 'baz',
							number: 1006,
							sprite: 'path/to/baz/sprite.png',
						},
					],
				},
			]);
		});
	});
});
