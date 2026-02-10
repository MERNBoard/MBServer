import type { Types } from 'mongoose';
import type { TokenTipo, UsuarioRole } from '../enums';

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

export interface UsuarioPayload {
  id: string;
  email: string;
  usuarioRole: UsuarioRole;
}

export interface UsuarioAuthToken {
  accessToken: string;
  refreshToken: string;
}