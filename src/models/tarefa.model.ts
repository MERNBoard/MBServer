import { model, Schema } from 'mongoose';
import { TarefaPrioridade, TarefaStatus } from '@/types';
import type { ITarefa } from '@/types/interfaces';

const tarefaSchema: Schema<ITarefa> = new Schema<ITarefa>(
  {
    usuarioID: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

    titulo: { type: String, required: true },
    descricao: { type: String, required: false },

    status: { type: String, enum: Object.values(TarefaStatus), required: true },
    prioridade: { type: String, enum: Object.values(TarefaPrioridade), required: true },

    categorias: { type: String, required: false },
    tags: { type: [String], required: false },

    deadline: { type: Date, required: false },
    completadaEm: { type: Date, required: false },
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm',
    },
  },
);

const Tarefa = model<ITarefa>('Tarefa', tarefaSchema);

export default Tarefa;
