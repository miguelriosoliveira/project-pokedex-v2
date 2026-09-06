import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { TOTAL_ITEMS_HEADER } from './config/constants';
import { ErrorController } from './controllers';
import { routes } from './routes';

export const app = express();
app.disable('x-powered-by');
app.set('query parser', 'extended');
app.use(cors({ exposedHeaders: TOTAL_ITEMS_HEADER }));
app.use(morgan('dev'));
app.use(routes);
app.use(ErrorController.handle);
