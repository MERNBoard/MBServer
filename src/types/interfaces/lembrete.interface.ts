import type { Types } from "mongoose";

export interface ILembrete extends Document {
  usuarioID: Types.ObjectId;
  tarefaID: Types.ObjectId;

  relembradoEm: Date;
  enviado: boolean;
  enviadoEm?: Date;

  criadoEm: Date;
  atualizadoEm: Date;
}