import type { Types } from 'mongoose';
import type { TarefaPrioridade, TarefaStatus } from '../enums';

export interface ITarefa {
  _id: Types.ObjectId; // Interface do dado no banco
  usuarioID: Types.ObjectId;
  titulo: string;
  descricao?: string;
  status: TarefaStatus;
  prioridade: TarefaPrioridade;
  categoria?: string;
  tags?: string[];
  deadline?: Date;
  completadaEm?: Date;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface ITarefaInput {
  titulo: string;
  descricao?: string;
  status?: TarefaStatus;
  prioridade?: TarefaPrioridade;
  categoria?: string;
  tags?: string[];
  deadline?: Date;
}