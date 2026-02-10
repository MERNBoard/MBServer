import { model, Schema, Types } from 'mongoose';
import { TokenTipo } from '@/types/enums';
import type { IAuthToken } from '@/types/interfaces';

const authTokenSchema = new Schema<IAuthToken>(
  {
    usuarioID: { type: Types.ObjectId, ref: 'Usuario', required: true },

    tipo: { type: String, enum: Object.values(TokenTipo), required: true },

    tokenHash: { type: String, required: true },
    expiraEm: { type: Date, required: true },

    usado: { type: Boolean, required: true, default: false },
    valido: { type: Boolean, requiredPaths: true, default: true },

    usadoEm: { type: Date },
    invalidadoEm: { type: Date },
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm',
    },
  },
);

const AuthToken = model<IAuthToken>('AuthToken', authTokenSchema);

export default AuthToken;
