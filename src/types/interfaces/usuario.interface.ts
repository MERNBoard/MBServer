import type { Document } from "mongoose";
import type { UsuarioRole } from "../enums";

export interface IUsuario extends Document {
  nome: string;
  email: string;
  passwordHash: string;
  usuarioRole?: UsuarioRole;

  criadoEm: Date;
  atualizadoEm: Date;
}