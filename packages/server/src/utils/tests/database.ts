import { MongoMemoryServer } from 'mongodb-memory-server';

let db: MongoMemoryServer;

export async function createFakeDb() {
	db = await MongoMemoryServer.create();
	return db;
}

export async function dropFakeDb() {
	await db.stop();
}
