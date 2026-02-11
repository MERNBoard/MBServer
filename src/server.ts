import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { conectarMongo, config } from '@/config';

import { AuthController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares';


const app: Express = express();

await conectarMongo();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response): Response => {
  return res.json('Hello!');
});


app.post(
  '/auth/login',
  AuthMiddleware.desabilitarCache,
  AuthController.login
);

app.post(
  '/auth/registrar',
  AuthMiddleware.desabilitarCache,
  AuthController.registrar
);

app.listen(config.PORT, () => {
  console.log(`MBServer rodando em ==> http://localhost:${config.PORT}/`);
});
