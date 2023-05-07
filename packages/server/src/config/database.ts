import mongoose from 'mongoose';

import { logger } from '../utils';

export const db = {
	async connect(uri: string) {
		mongoose.set('strictQuery', true);
		const dbInstance = await mongoose.connect(uri);
		logger.info('🌱 Connected to MongoDB');
		return dbInstance;
	},

	async disconnect() {
		await mongoose.disconnect();
		logger.info('👋 Disconnected from MongoDB');
	},
};
