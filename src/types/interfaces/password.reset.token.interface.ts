import type { Types } from 'mongoose';

export interface IPasswordResetToken extends Document {
  usuarioID: Types.ObjectId;

  tokenHash: string;
  expiraEm: Date;

  usado: boolean;
  usadoEm?: Date;

  criadoEm: Date;
  atualizadoEm: Date;
}
