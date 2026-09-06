import { Router } from 'express';

import { GenerationController, PokemonController, TypesController } from './controllers';

export const routes = Router();

routes.get('/', (_request, response) => response.send('Hello World!'));
routes.get('/generations', GenerationController.getAll);
routes.get('/pokemon', PokemonController.getAll);
routes.get('/pokemon/:number', PokemonController.getOne);
routes.get('/types', TypesController.getAll);
