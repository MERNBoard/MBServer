import cors from 'cors';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { conectarMongo, config } from '@/config';

const app: Express = express();

await conectarMongo();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response): Response => {
  return res.json('Hello!');
});

app.listen(config.PORT, () => {
  console.log(`MBServer rodando em ==> http://localhost:${config.PORT}/`);
});
