import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { conectarMongo, config } from '@/config';

import { AuthController, TarefaController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares';

import { EnvValue } from '@/types/enums';

await conectarMongo();

const app: Express = express();


app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response): Response => {
  return res.json('Hello!');
});

// Rotas públicas (sem autenticação)

// Rotas de autenticação:
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

// Rotas protegidas por autenticação

// Rotas de tarefas:
app.get(
  '/usuario/tarefas',
  AuthMiddleware.autenticarTokenAPI,
  TarefaController.listarMinhasTarefas
);

app.post(
  '/usuario/tarefas',
  AuthMiddleware.autenticarTokenAPI,
  TarefaController.criarTarefa
);

app.put(
  '/usuario/tarefas/:id',
  AuthMiddleware.autenticarTokenAPI,
  TarefaController.atualizarTarefa
);

app.patch(
  '/usuario/tarefas/:id',
  AuthMiddleware.autenticarTokenAPI,
  TarefaController.atualizarTarefa
);


app.delete(
  '/usuario/tarefas/:id',
  AuthMiddleware.autenticarTokenAPI,
  TarefaController.deletarTarefa
);


if (config.NODE_ENV !== EnvValue.PROD) {
  app.listen(config.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${config.PORT}`);
  });
}

export default app;