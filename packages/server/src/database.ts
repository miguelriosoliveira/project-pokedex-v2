import mongoose from 'mongoose';

import { ENV } from './config/env';
import { logger } from './utils';

export const db = {
	async connect() {
		mongoose.set('strictQuery', true);
		await mongoose.connect(ENV.MONGO_URL);
		logger.info('🌱 Connected to MongoDB');
	},

	async disconnect() {
		await mongoose.disconnect();
		logger.info('👋 Disconnected from MongoDB');
	},
};
