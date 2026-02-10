import bcrypt from 'bcrypt';
import type { UpdateQuery } from 'mongoose';
import { model, Schema } from 'mongoose';

import { UsuarioRole } from '@/types/enums';
import type { IUsuario } from '@/types/interfaces';

import type { UsuarioUpdate } from '@/types/types';

const usuarioSchema: Schema<IUsuario> = new Schema<IUsuario>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    passwordHash: { type: String, required: true },

    usuarioRole: {
      type: String,
      enum: Object.values(UsuarioRole),
      default: UsuarioRole.USUARIO,
    },
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm',
    },
  },
);

usuarioSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;

  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  this.atualizadoEm = new Date();
});

usuarioSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as UpdateQuery<Partial<UsuarioUpdate>>;

  if (!update) return;

  if (update.$set?.passwordHash) {
    update.$set.passwordHash = await bcrypt.hash(update.$set.passwordHash, 10);
  }

  if (!update.$set) update.$set = {};
  update.$set.atualizadoEm = new Date();
});

const Usuario = model<IUsuario>('Usuario', usuarioSchema);

export default Usuario;
