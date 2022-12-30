import 'dotenv/config';
import { AddressInfo } from 'node:net';

import celebrate from 'celebrate';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { TOTAL_ITEMS_HEADER } from './config/constants';
import { ENV } from './config/env';
import { db } from './database';
import { routes } from './routes';
import { logger } from './utils';

const app = express();
app.disable('x-powered-by');
app.use(cors({ exposedHeaders: TOTAL_ITEMS_HEADER }));
app.use(morgan('dev'));
app.use(routes);
app.use(celebrate.errors());

const server = app.listen(ENV.PORT, async () => {
	await db.connect();
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
