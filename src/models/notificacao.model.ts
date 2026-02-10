import { model, Schema, Types } from 'mongoose';
import type { INotificacao } from '@/types/interfaces';

const notificacaoSchema: Schema<INotificacao> = new Schema(
  {
    usuarioID: { type: Types.ObjectId, ref: 'Usuario', required: true },
    titulo: { type: String, required: true },
    mensagem: { type: String, required: true },

    lida: { type: Boolean, required: true, default: false },
    lidaEm: { type: Date },
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm',
    },
  },
);

const Notificacao = model<INotificacao>('Notificacao', notificacaoSchema);

export default Notificacao;
