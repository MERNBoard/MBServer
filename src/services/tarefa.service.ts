import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import * as z from 'zod';
import { AppError } from '@/core/errors';
import Tarefa from '@/models/tarefa.model';
import {
  TarefaCreateInputSchema,
  TarefaOutputSchema,
  TarefaUpdateInputSchema,
} from '@/schemas/tarefa.schema';
import type {
  TarefaCreateInput,
  TarefaOutput,
  TarefaUpdateInput,
} from '@/types/types/tarefa.types';

class TarefaService {
  async criarTarefa(usuarioID: string, dados: TarefaCreateInput): Promise<TarefaOutput> {
    const validacao = TarefaCreateInputSchema.safeParse(dados);

    if (!validacao.success) {
      throw new AppError(`Erro de validação: ${validacao.error.message}`, StatusCodes.BAD_REQUEST);
    }

    const dadosParaSalvar = Object.fromEntries(
      Object.entries({
        ...validacao.data,
        usuarioID,
      }).filter(([_, v]) => v !== undefined)
    );

    const tarefa = await Tarefa.create(dadosParaSalvar);

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefa.toObject());

    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao processar formato da tarefa criada',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async buscarTarefaPorId(id: string, usuarioID: string): Promise<TarefaOutput> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('ID da tarefa em formato inválido', StatusCodes.BAD_REQUEST);
    }

    const tarefa = await Tarefa.findOne({ _id: id, usuarioID }).lean();

    if (!tarefa) {
      throw new AppError('Tarefa não encontrada', StatusCodes.NOT_FOUND);
    }

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefa);

    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno na estrutura da tarefa encontrada',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async buscarTarefasPorUsuario(usuarioID: string): Promise<TarefaOutput[]> {
    const tarefas = await Tarefa.find({ usuarioID }).lean();

    const validacaoSaida = z.array(TarefaOutputSchema).safeParse(tarefas);

    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao listar tarefas do usuário',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async atualizarTarefa(id: string, usuarioID: string, dados: TarefaUpdateInput): Promise<TarefaOutput> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('ID da tarefa em formato inválido', StatusCodes.BAD_REQUEST);
    }

    const validacao = TarefaUpdateInputSchema.safeParse(dados);
    if (!validacao.success) {
      throw new AppError(`Erro de validação: ${validacao.error.message}`, StatusCodes.BAD_REQUEST);
    }

    const dadosLimpos = Object.fromEntries(
      Object.entries(validacao.data).filter(([_, v]) => v !== undefined),
    );

    const tarefaAtualizada = await Tarefa.findOneAndUpdate(
      { _id: id, usuarioID },
      { $set: dadosLimpos },
      { new: true },
    ).lean();

    if (!tarefaAtualizada) {
      throw new AppError('Tarefa não encontrada ou permissão negada', StatusCodes.NOT_FOUND);
    }

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefaAtualizada);
    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao validar tarefa atualizada',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async deletarTarefa(id: string, usuarioID: string): Promise<TarefaOutput> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('ID da tarefa em formato inválido', StatusCodes.BAD_REQUEST);
    }

    const tarefaDeletada = await Tarefa.findOneAndDelete({ _id: id, usuarioID }).lean();

    if (!tarefaDeletada) {
      throw new AppError('Tarefa não encontrada ou permissão negada', StatusCodes.NOT_FOUND);
    }

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefaDeletada);

    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao validar tarefa deletada',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async buscarTodasTarefas(): Promise<TarefaOutput[]> {
    const tarefas = await Tarefa.find().lean();
    const validacaoSaida = z.array(TarefaOutputSchema).safeParse(tarefas);

    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro interno ao listar todas as tarefas',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }
}

export default new TarefaService();
