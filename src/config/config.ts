import dotenv from 'dotenv';

import type { IConfig } from '@/types/interfaces';

dotenv.config();

export const config: IConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'DEV',
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/mbserver',
};

