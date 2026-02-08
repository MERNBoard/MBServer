import type { Types } from "mongoose";

export interface INotificacao extends Document {
  usuarioID: Types.ObjectId;

  titulo: string;
  mensagem: string;

  lida: boolean;
  lidaEm?: Date;

  criadoEm: Date;
  atualizadoEm: Date;
}