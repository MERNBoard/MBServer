import * as z from 'zod';
import Tarefa from '@/models/tarefa.model';
import {
  TarefaCreateSchema,
  TarefaSafeOutputSchema,
  TarefaUpdateSchema,
} from '@/schemas/tarefa.schema';
import type { TarefaInput, TarefaSafeOutput, TarefaUpdate } from '@/types/types/tarefa.types';

class TarefaService {
  async criarTarefa(usuarioID: string, dados: TarefaInput): Promise<TarefaSafeOutput> {
    const validacao = TarefaCreateSchema.safeParse(dados);

    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const tarefa = await Tarefa.create({
      ...validacao.data,
      usuarioID: usuarioID,
    });

    const validacaoSaida = TarefaSafeOutputSchema.safeParse(tarefa.toObject());

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async buscarTarefaPorId(id: string): Promise<TarefaSafeOutput | null> {
    const tarefa = await Tarefa.findById(id).lean();

    if (!tarefa) return null;

    const validacaoSaida = TarefaSafeOutputSchema.safeParse(tarefa);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async buscarTarefasPorUsuario(usuarioID: string): Promise<TarefaSafeOutput[]> {
    const tarefas = await Tarefa.find({ usuarioID }).lean();

    const validacaoSaida = z.array(TarefaSafeOutputSchema).safeParse(tarefas);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async atualizarTarefa(id: string, dados: TarefaUpdate): Promise<TarefaSafeOutput | null> {
    const validacao = TarefaUpdateSchema.safeParse(dados);

    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(id, validacao.data, {
      new: true,
    }).lean();

    if (!tarefaAtualizada) return null;

    const validacaoSaida = TarefaSafeOutputSchema.safeParse(tarefaAtualizada);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async deletarTarefa(id: string): Promise<TarefaSafeOutput | null> {
    const tarefaDeletada = await Tarefa.findByIdAndDelete(id).lean();

    if (!tarefaDeletada) return null;

    const validacaoSaida = TarefaSafeOutputSchema.safeParse(tarefaDeletada);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }

  async buscarTodasTarefas(): Promise<TarefaSafeOutput[]> {
    const tarefas = await Tarefa.find().lean();
    const validacaoSaida = z.array(TarefaSafeOutputSchema).safeParse(tarefas);

    if (!validacaoSaida.success) {
      throw new Error(`Erro de validação de saída: ${validacaoSaida.error.message}`);
    }

    return validacaoSaida.data;
  }
}

export default new TarefaService();
