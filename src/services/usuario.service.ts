import { StatusCodes } from 'http-status-codes';
import * as z from 'zod';
import { AppError } from '@/core/errors';
import Usuario from '@/models/usuario.model';
import {
  UsuarioOutputSchema,
  UsuarioRegisterInputSchema,
  UsuarioUpdateInputSchema,
} from '@/schemas/usuario.schema';

import type { UsuarioOutput, UsuarioRegisterInput, UsuarioUpdate } from '@/types/types';

class UsuarioService {
  async criarUsuario(dados: UsuarioRegisterInput): Promise<UsuarioOutput> {
    const validacao = UsuarioRegisterInputSchema.safeParse(dados);
    if (!validacao.success) {
      throw new AppError(`Erro de validação: ${validacao.error.message}`, StatusCodes.BAD_REQUEST);
    }

    const { email, nome, password: passwordHash } = validacao.data;

    const emailExistente = await Usuario.findOne({ email }).lean();
    if (emailExistente) {
      throw new AppError('Email já cadastrado', StatusCodes.CONFLICT);
    }

    const usuarioCriado = await Usuario.create({
      nome,
      email,
      passwordHash,
    });

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuarioCriado.toObject());
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao processar dados do usuário criado',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async buscarUsuarioPorId(id: string): Promise<UsuarioOutput> {
    const usuario = await Usuario.findById(id).lean();

    if (!usuario) {
      throw new AppError('Usuário não encontrado', StatusCodes.NOT_FOUND);
    }

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuario);
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno na estrutura do usuário encontrado',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async buscarUsuarioPorEmail(email: string): Promise<UsuarioOutput | null> {
    const usuario = await Usuario.findOne({ email }).lean();

    if (!usuario) return null;

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuario);
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno na estrutura do usuário por e-mail',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async atualizarUsuario(id: string, dados: UsuarioUpdate): Promise<UsuarioOutput> {
    const validacao = UsuarioUpdateInputSchema.safeParse(dados);
    if (!validacao.success) {
      throw new AppError(`Erro de validação: ${validacao.error.message}`, StatusCodes.BAD_REQUEST);
    }

    const updateData: Record<string, unknown> = {};
    if (validacao.data.nome) updateData.nome = validacao.data.nome;
    if (validacao.data.email) updateData.email = validacao.data.email;
    if (validacao.data.usuarioRole) updateData.usuarioRole = validacao.data.usuarioRole;
    if (validacao.data.password) updateData.passwordHash = validacao.data.password;

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).lean();

    if (!usuarioAtualizado) {
      throw new AppError('Usuário não encontrado para atualização', StatusCodes.NOT_FOUND);
    }

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuarioAtualizado);
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao validar dados atualizados do usuário',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async deletarUsuario(id: string): Promise<UsuarioOutput> {
    const usuarioDeletado = await Usuario.findByIdAndDelete(id).lean();

    if (!usuarioDeletado) {
      throw new AppError('Usuário não encontrado para exclusão', StatusCodes.NOT_FOUND);
    }

    const validacaoSaida = UsuarioOutputSchema.safeParse(usuarioDeletado);
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao processar exclusão do usuário',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async buscarTodosUsuarios(): Promise<UsuarioOutput[]> {
    const usuarios = await Usuario.find().lean();

    const validacaoSaida = z.array(UsuarioOutputSchema).safeParse(usuarios);
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao listar todos os usuários',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }
}

export default new UsuarioService();
