import { Types } from 'mongoose';
import * as z from 'zod';
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
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const dadosParaSalvar = JSON.parse(
      JSON.stringify({
        ...validacao.data,
        usuarioID,
      }),
    );

    const tarefa = await Tarefa.create(dadosParaSalvar);

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefa.toObject());

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async buscarTarefaPorId(id: string, usuarioID: string): Promise<TarefaOutput | null> {
    const tarefa = await Tarefa.findOne({ _id: id, usuarioID }).lean();

    if (!tarefa) return null;

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefa);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async buscarTarefasPorUsuario(usuarioID: string): Promise<TarefaOutput[]> {
    const tarefas = await Tarefa.find({ usuarioID }).lean();

    const validacaoSaida = z.array(TarefaOutputSchema).safeParse(tarefas);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async atualizarTarefa(id: string, usuarioID: string, dados: TarefaUpdateInput): Promise<TarefaOutput | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Erro de validação: ID da tarefa em formato inválido');
    }

    const validacao = TarefaUpdateInputSchema.safeParse(dados);
    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const dadosLimpos = Object.fromEntries(
      Object.entries(validacao.data).filter(([_, v]) => v !== undefined),
    );

    const tarefaAtualizada = await Tarefa.findOneAndUpdate(
      { _id: id, usuarioID },
      { $set: dadosLimpos },
      { new: true },
    ).lean();

    if (!tarefaAtualizada) return null;

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefaAtualizada);
    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async deletarTarefa(id: string, usuarioID: string): Promise<TarefaOutput | null> {
    const tarefaDeletada = await Tarefa.findOneAndDelete({ _id: id, usuarioID }).lean();

    if (!tarefaDeletada) return null;

    const validacaoSaida = TarefaOutputSchema.safeParse(tarefaDeletada);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async buscarTodasTarefas(): Promise<TarefaOutput[]> {
    const tarefas = await Tarefa.find().lean();
    const validacaoSaida = z.array(TarefaOutputSchema).safeParse(tarefas);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }
}

export default new TarefaService();
