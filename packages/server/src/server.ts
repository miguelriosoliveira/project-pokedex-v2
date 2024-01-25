import { AddressInfo } from 'node:net';

import { app } from './app';
import { db } from './config/database';
import { ENV } from './config/env';
import { logger } from './utils';

const server = app.listen(ENV.PORT, async () => {
	await db.connect(ENV.MONGO_URL);
	const { address, port } = server.address() as AddressInfo;
	const addressFixed = address === '::' ? 'localhost' : address;
	logger.info(`🚀 Server running on http://${addressFixed}:${port}`);
});

async function shutdown() {
	await db.disconnect();
	server.close(() => logger.info('👋 Server closed'));
}

process
	.on('SIGINT', shutdown) // Ctrl+C
	.on('SIGTERM', shutdown); // App killed
