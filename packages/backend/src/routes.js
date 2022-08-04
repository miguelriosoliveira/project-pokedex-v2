const { celebrate } = require('celebrate');
const express = require('express');

const GenerationController = require('./controllers/GenerationController');
const PokemonController = require('./controllers/PokemonController');
const TypeController = require('./controllers/TypeController');

const routes = express.Router();

routes.use((request, response, next) => {
	const { method, url } = request;
	const requestLog = `[${method}] ${url}`;
	console.time(requestLog);
	next();
	console.timeEnd(requestLog);
});

routes.get('/', (request, response) => response.send('Hello Word!'));
routes.get('/generations', GenerationController.getAll);
routes.get('/pokemon/', celebrate(PokemonController.getAllSchema), PokemonController.getAll);
routes.get('/pokemon/:number', celebrate(PokemonController.getOneSchema), PokemonController.getOne);
routes.get('/types', TypeController.getAll);

module.exports = routes;
