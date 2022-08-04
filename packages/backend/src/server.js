require('dotenv/config');
const { errors } = require('celebrate');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const Utils = require('./utils/Utils');

const { MONGO_URL, PORT } = process.env;

mongoose.connect(MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const server = express();

server.disable('x-powered-by');

server.use(cors({ exposedHeaders: Utils.totalItemsHeader }));
server.use(routes);
server.use(errors());

server.listen(PORT, () => console.log(`🚀 Server online on port ${PORT}`));
