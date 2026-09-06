import { StatusCodes } from 'http-status-codes';
import type { Mongoose } from 'mongoose';
import supertest from 'supertest';

import { app } from '../app';
import { db } from '../config/database';
import { Type } from '../models';
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

describe('TypesController', () => {
	describe('#getAll', () => {
		it('should return all types sorted by name', async () => {
			await Type.insertMany([{ name: 'water' }, { name: 'grass' }, { name: 'fire' }]);

			const response = await request.get('/types');
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.body).toStrictEqual(['fire', 'grass', 'water']);
		});

		it('should not return the stellar type', async () => {
			await Type.insertMany([
				{ name: 'water' },
				{ name: 'stellar' },
				{ name: 'fire' },
			]);

			const response = await request.get('/types');
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.body).toStrictEqual(['fire', 'water']);
		});
	});
});
