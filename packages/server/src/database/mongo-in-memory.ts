import { MongoMemoryServer } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
export const db = {
	async connect() {
		const mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
	},
};

// The Server can be stopped again with
await mongod.stop();
