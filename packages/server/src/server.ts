import 'dotenv/config';
import { AddressInfo } from 'node:net';

import celebrate from 'celebrate';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { TOTAL_ITEMS_HEADER } from './config/constants';
import routes from './routes';
import { logger } from './utils';

const { MONGO_URL, PORT } = process.env;

mongoose.connect(MONGO_URL);

const server = express();

server.disable('x-powered-by');

server.use(cors({ exposedHeaders: TOTAL_ITEMS_HEADER }));
server.use(morgan('dev'));
server.use(routes);
server.use(celebrate.errors());

const listener = server.listen(PORT, () => {
	const { address, port } = listener.address() as AddressInfo;
	const addressFixed = address === '::' ? 'localhost' : address;
	logger.info(`🚀 Server running on http://${addressFixed}:${port}`);
});
