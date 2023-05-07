import { celebrate } from 'celebrate';
import { Router } from 'express';

import { TypesController, GenerationController, PokemonController } from './controllers';

export const routes = Router();

routes.get('/', (request, response) => response.send('Hello World!'));
routes.get('/generations', GenerationController.getAll);
routes.get('/pokemon/', celebrate(PokemonController.getAllSchema), PokemonController.getAll);
routes.get('/pokemon/:number', celebrate(PokemonController.getOneSchema), PokemonController.getOne);
routes.get('/types', TypesController.getAll);
