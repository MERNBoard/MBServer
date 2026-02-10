import { Notificacao } from '@/models';
import { NotificacaoCreateSchema, NotificacaoOutputSchema } from '@/schemas/';
import type { NotificacaoCreateInput, NotificacaoOutput } from '@/types/types';

class NotificacaoService {
  async criarNotificacao(NotificacaoInput: NotificacaoCreateInput): Promise<NotificacaoOutput> {
    const validacao = NotificacaoCreateSchema.safeParse(NotificacaoInput);


    if (!validacao.success) {
      throw new Error(
        `Erro de validação de entrada: ${validacao.error.message}`,
      );
    }

    const dadosCriacao = {
      usuarioID: validacao.data.usuarioID,
      titulo: validacao.data.titulo,
      mensagem: validacao.data.mensagem,
      lida: validacao.data.lida ?? false,
    };

    const notificacao = await Notificacao.create(dadosCriacao);

    const validacaoSaida = NotificacaoOutputSchema.safeParse(
      notificacao.toObject(),
    );

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }

  async marcarComoLida(notificacaoID: string): Promise<NotificacaoOutput | null> {
    const notificacao = await Notificacao.findById(notificacaoID);

    if (!notificacao) return null;

    notificacao.lida = true;
    notificacao.lidaEm = new Date();
    notificacao.atualizadoEm = new Date();

    await notificacao.save();

    const validacaoSaida = NotificacaoOutputSchema.safeParse(
      notificacao.toObject(),
    );

    if (!validacaoSaida.success) {
      throw new Error(
        `Erro de validação de saída: ${validacaoSaida.error.message}`,
      );
    }

    return validacaoSaida.data;
  }



}

export default new NotificacaoService();