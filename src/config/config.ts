import dotenv from 'dotenv';
import { EnvValue } from '@/types/enums';
import type { IConfig } from '@/types/interfaces';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Config Error: Variável de ambiente ${key} não definida!`);
  }
  return value;
};

const nodeEnv = (process.env.NODE_ENV as EnvValue) || EnvValue.DEVELOPMENT;

export const config: IConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: nodeEnv,

  JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET'),

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  MONGO_CONNECTION_STRING: nodeEnv === EnvValue.PRODUCTION
    ? getEnv('MONGO_CONNECTION_STRING')
    : 'mongodb://localhost:27017/mbserver'
};