import type { Mongoose } from 'mongoose';

import { db } from '../config/database';
import { Type } from '../models';
import { replaceDocuments } from './replaceDocuments';
import { createFakeDb, createType } from './tests';

let dbInstance: Mongoose;

beforeAll(async () => {
	const fakeDb = await createFakeDb();
	dbInstance = await db.connect(fakeDb.getUri());
});

beforeEach(async () => {
	await dbInstance.connection.dropDatabase();
});

describe('replaceDocuments', () => {
	it('inserts documents that are not in the collection yet', async () => {
		await replaceDocuments(Type, 'name', [
			createType({ name: 'fire', double_damage_from: ['water'] }),
			createType({ name: 'water', double_damage_from: ['grass'] }),
		]);

		const types = await Type.find().sort('name').lean();
		expect(types.map(type => type.name)).toEqual(['fire', 'water']);
		expect(types[0]?.double_damage_from).toEqual(['water']);
	});

	it('updates existing documents without wiping the collection first', async () => {
		await Type.insertMany([
			{ name: 'fire', double_damage_from: ['water'] },
			{ name: 'water', double_damage_from: ['electric'] },
		]);

		await replaceDocuments(Type, 'name', [
			createType({ name: 'fire', double_damage_from: ['water', 'rock'] }),
			createType({ name: 'water', double_damage_from: ['grass'] }),
		]);

		const types = await Type.find().sort('name').lean();
		expect(types).toHaveLength(2);
		expect(types[0]?.double_damage_from).toEqual(['water', 'rock']);
		expect(types[1]?.double_damage_from).toEqual(['grass']);
	});

	it('removes documents that are no longer in the catalog', async () => {
		await Type.insertMany([{ name: 'fire' }, { name: 'water' }, { name: 'stellar' }]);

		await replaceDocuments(Type, 'name', [
			createType({ name: 'fire' }),
			createType({ name: 'water' }),
		]);

		const types = await Type.find().sort('name').lean();
		expect(types.map(type => type.name)).toEqual(['fire', 'water']);
	});

	it('refuses an empty catalog so a failed fetch cannot wipe the database', async () => {
		await Type.insertMany([{ name: 'fire' }]);

		await expect(replaceDocuments(Type, 'name', [])).rejects.toThrow(
			'Refusing to replace Type with an empty catalog',
		);
		expect(await Type.countDocuments()).toBe(1);
	});
});
