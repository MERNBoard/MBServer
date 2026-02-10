import { model, Schema, Types } from 'mongoose';
import type { ILembrete } from '@/types/interfaces';

const lembreteSchema: Schema<ILembrete> = new Schema<ILembrete>(
  {
    usuarioID: { type: Types.ObjectId, ref: 'Usuario', required: true },
    tarefaID: { type: Types.ObjectId, ref: 'Tarefa', required: true },

    relembradoEm: { type: Date, required: true },
    enviado: { type: Boolean, default: false },
    enciadoEm: { type: Date, required: false },
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm',
    },
  },
);

const Lembrete = model<ILembrete>('Lembrete', lembreteSchema);

export default Lembrete;