import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/core/errors';
import { Notificacao } from '@/models';
import { NotificacaoCreateSchema, NotificacaoOutputSchema } from '@/schemas/';
import type { NotificacaoCreateInput, NotificacaoOutput } from '@/types/types';

class NotificacaoService {
  async criarNotificacao(NotificacaoInput: NotificacaoCreateInput): Promise<NotificacaoOutput> {
    const validacao = NotificacaoCreateSchema.safeParse(NotificacaoInput);

    if (!validacao.success) {
      throw new AppError(
        `Dados de notificação inválidos: ${validacao.error.message}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const dadosCriacao = {
      usuarioID: validacao.data.usuarioID,
      titulo: validacao.data.titulo,
      mensagem: validacao.data.mensagem,
      lida: validacao.data.lida ?? false,
    };

    const notificacao = await Notificacao.create(dadosCriacao);

    const validacaoSaida = NotificacaoOutputSchema.safeParse(notificacao.toObject());

    if (!validacaoSaida.success) {
      throw new AppError(
        'Falha interna ao processar formato da notificação criada',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }

  async marcarComoLida(notificacaoID: string): Promise<NotificacaoOutput> {
    const notificacao = await Notificacao.findById(notificacaoID);

    if (!notificacao) {
      throw new AppError('Notificação não encontrada', StatusCodes.NOT_FOUND);
    }

    notificacao.lida = true;
    notificacao.lidaEm = new Date();
    notificacao.atualizadoEm = new Date();

    await notificacao.save();

    const validacaoSaida = NotificacaoOutputSchema.safeParse(notificacao.toObject());

    if (!validacaoSaida.success) {
      throw new AppError(
        'Erro de integridade de dados ao atualizar notificação',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return validacaoSaida.data;
  }
}

export default new NotificacaoService();
