import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';

import { app } from '../app';
import { db } from '../config/database';
import { Type } from '../models';
import { createFakeDb } from '../utils/tests';

const request = supertest(app);

beforeAll(async () => {
	const fakeDb = await createFakeDb();
	await db.connect(fakeDb.getUri());
	await Type.insertMany([{ name: 'water' }, { name: 'grass' }, { name: 'fire' }]);
});

describe('TypesController', () => {
	describe('#getAll', () => {
		it('should return all types sorted by name', async () => {
			const response = await request.get('/types');
			expect(response.statusCode).toBe(StatusCodes.OK);
			expect(response.body).toStrictEqual(['fire', 'grass', 'water']);
		});
	});
});
