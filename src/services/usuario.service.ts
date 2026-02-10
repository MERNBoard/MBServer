import * as z from 'zod';
import Usuario from '@/models/usuario.model';

import {
  UsuarioOutputSchema,
  UsuarioUpdateInputSchema,
  usuarioRegisterInputSchema
} from '@/schemas/usuario.schema';

import type { UsuarioOutput, UsuarioRegisterInput, UsuarioUpdate } from '@/types/types';

class UsuarioService {
  async criarUsuario(dados: UsuarioRegisterInput): Promise<UsuarioOutput> {
    const validacao = usuarioRegisterInputSchema.safeParse(dados);
    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const dadosCriacao = {
      nome: validacao.data.nome,
      email: validacao.data.email,
      passwordHash: validacao.data.password,
    }

    const usuarioCriado = await Usuario.create(dadosCriacao);

    const validacaoSaida = UsuarioOutputSchema.safeParse(
      usuarioCriado.toObject(),
    );

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }

  async buscarUsuarioPorId(id: string): Promise<UsuarioOutput | null> {
    const usuario = await Usuario.findById(id).lean();

    if (!usuario) return null;

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuario);

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }

  async buscarUsuarioPorEmail(email: string): Promise<UsuarioOutput | null> {
    const usuario = await Usuario.findOne({ email }).lean();

    if (!usuario) return null;

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuario);

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }

  async atualizarUsuario(id: string, dados: UsuarioUpdate): Promise<UsuarioOutput | null> {
    const validacao = UsuarioUpdateInputSchema.safeParse(dados);

    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const updateData: Record<string, unknown> = {};

    if (validacao.data.nome) updateData.nome = validacao.data.nome;
    if (validacao.data.email) updateData.email = validacao.data.email;
    if (validacao.data.usuarioRole)
      updateData.usuarioRole = validacao.data.usuarioRole;

    if (validacao.data.password) {
      updateData.passwordHash = validacao.data.password;
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!usuarioAtualizado) return null;

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuarioAtualizado);

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }

  async deletarUsuario(id: string): Promise<UsuarioOutput | null> {
    const usuarioDeletado = await Usuario.findByIdAndDelete(id).lean();

    if (!usuarioDeletado) return null;

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuarioDeletado);

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }

  async buscarTodosUsuarios(): Promise<UsuarioOutput[]> {
    const usuarios = await Usuario.find().lean();

    const validacaoSaida = z.array(UsuarioOutputSchema).safeParse(usuarios);

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }
}

export default new UsuarioService();
