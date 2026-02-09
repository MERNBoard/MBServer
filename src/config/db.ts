import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';
import { config } from './config';

export const conectarMongo = async (): Promise<void> => {
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
      console.log('[DB] => Conectado ao MongoDB');
      return;
    } catch (err) {
      const error = err as Error;
      console.error(`[DB] => Tentativa ${i} falhou. Erro: ${error.message}`);
      if (i === maxRetries) throw error;
      await new Promise<void>((res) => setTimeout(res, 2000));
    }
  }
};
