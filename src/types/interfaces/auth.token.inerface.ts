import type { Types } from 'mongoose';
import type { TokenTipo } from '../enums';

export interface IAuthToken {
  usuarioID: Types.ObjectId;

  tipo: TokenTipo;

  tokenHash: string;
  expiraEm: Date;

  valido: boolean;
  usado: boolean;

  usadoEm?: Date;
  invalidadoEm?: Date;

  criadoEm: Date;
  atualizadoEm: Date;
}
