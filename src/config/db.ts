import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import { EnvValue } from '@/types/enums';
import { config } from './config';

let mongoConectado: boolean = false;

export const conectarMongo = async (): Promise<void> => {
  if (mongoConectado) return;
  mongoose.set('strictQuery', true);

  mongoose.connection.on('error', (err: Error) => {
    console.error('[DB] => Erro no MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] => MongoDB desconectado!');
  });

  const maxRetries: number = 3;

  const options: ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  };

  for (let i = 1; i <= maxRetries; i++) {
    try {
      await mongoose.connect(config.MONGO_CONNECTION_STRING, options);
      console.log('\n\n[DB] => Conectado ao MongoDB');
      mongoConectado = true;
      return;
    } catch (err) {
      const error = err as Error;
      console.error(`[DB] => Tentativa ${i} falhou. Erro: ${error.message}`);
      if (config.NODE_ENV !== EnvValue.PRODUCTION) {
        console.error(
          `[DB] => Erro de conexão: Você esta em ambiente ${config.NODE_ENV} tentando se conectar em ${config.MONGO_CONNECTION_STRING}, mas o banco de dados não está respondendo!`,
        );
      }
      if (i === maxRetries) throw error;
      await new Promise<void>((res) => setTimeout(res, 2000));
    }
  }
};
