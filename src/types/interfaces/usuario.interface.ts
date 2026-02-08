import type { Document } from "mongoose";

export interface IUsuario extends Document {
  nome: string;
  email: string;
  passwordHash: string;

  criadoEm: Date;
  atualizadoEm: Date;
}