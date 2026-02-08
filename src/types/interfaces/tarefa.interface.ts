import type { Document, Types } from 'mongoose';
import type { TarefaPrioridade, TarefaStatus } from '../enums';

export interface ITarefa extends Document {
  usuarioID: Types.ObjectId;

  titulo: string;
  descricao?: string;

  status: TarefaStatus;
  prioridade: TarefaPrioridade;

  categorias?: string;
  tags?: string[];

  deadline?: Date;
  completadaEm: Date;

  criadoEm: Date;
  autalizadoEm: Date;
}
