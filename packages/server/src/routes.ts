import { celebrate } from 'celebrate';
import { Router } from 'express';

import { TypeController, GenerationController, PokemonController } from './controllers';

const routes = Router();

routes.get('/', (request, response) => response.send('Hello Word!'));
routes.get('/generations', GenerationController.getAll);
routes.get('/pokemon/', celebrate(PokemonController.getAllSchema), PokemonController.getAll);
routes.get('/pokemon/:number', celebrate(PokemonController.getOneSchema), PokemonController.getOne);
routes.get('/types', TypeController.getAll);

export default routes;
