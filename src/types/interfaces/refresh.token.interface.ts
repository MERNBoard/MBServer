import type { Types } from 'mongoose';

export interface IRefreshToken extends Document {
  usuarioID: Types.ObjectId;

  tokenHash: string;
  expiraEm: Date;

  invalidada: boolean;
  invalidadaEm?: Date;

  criadoEm: Date;
  atualizadoEm: Date;
}