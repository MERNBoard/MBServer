import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TarefaService } from "@/services";

class TarefaController {
  private _getAuthUserID(req: Request): string {
    const id = req.usuarioIdentidade?.id;
    if (!id || typeof id !== 'string') throw new Error('AUTH_MISSING');
    return id;
  }

  private _getTarefaID(req: Request): string {
    const { id } = req.params;
    if (!id || typeof id !== 'string') throw new Error('INVALID_ID');
    return id;
  }

  testar = async (req: Request, res: Response) => {
    const all = {
      usurioID: this._getAuthUserID(req),
      tarefaID: this._getTarefaID(req),
      body: req.body,
      params: req.params,
      query: req.query,
    }
    return res.status(StatusCodes.OK).json({ message: 'Rota de teste de TarefaController funcionando!', seiDe: all });
  }

  criarTarefa = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaCriada = await TarefaService.criarTarefa(usuarioID, req.body);
      return res.status(StatusCodes.CREATED).json(tarefaCriada);
    } catch (error) {
      return this._tratarErro(res, error, 'Criar tarefa');
    }
  }

  listarMinhasTarefas = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefas = await TarefaService.buscarTarefasPorUsuario(usuarioID);
      return res.status(StatusCodes.OK).json(tarefas);
    } catch (error) {
      return this._tratarErro(res, error, 'Listar tarefas');
    }
  }

  buscarTarefaPorId = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaID = this._getTarefaID(req);

      const tarefa = await TarefaService.buscarTarefaPorId(tarefaID, usuarioID);
      if (!tarefa) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Tarefa não encontrada' });
      }

      return res.status(StatusCodes.OK).json(tarefa);
    } catch (error) {
      return this._tratarErro(res, error, 'Buscar tarefa');
    }
  }

  atualizarTarefa = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaID = this._getTarefaID(req);

      const tarefaAtualizada = await TarefaService.atualizarTarefa(tarefaID, usuarioID, req.body);

      if (!tarefaAtualizada) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Tarefa não encontrada ou permissão negada' });
      }

      return res.status(StatusCodes.ACCEPTED).json(tarefaAtualizada);
    } catch (error) {
      return this._tratarErro(res, error, 'Atualizar tarefa');
    }
  }

  deletarTarefa = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaID = this._getTarefaID(req);

      const deletado = await TarefaService.deletarTarefa(tarefaID, usuarioID);
      if (!deletado) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Tarefa não encontrada' });
      }

      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      return this._tratarErro(res, error, 'Deletar tarefa');
    }
  }

  private _tratarErro(res: Response, error: unknown, acao: string) {
    if (error instanceof Error) {
      if (error.message === 'AUTH_MISSING') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Usuário não autenticado!' });
      }

      if (error.message === 'INVALID_ID') {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'O ID fornecido é inválido!' });
      }

      if (error.message.includes('Erro de validação:')) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: error.message.replace('Erro de validação: ', '')
        });
      }

      if (error.message.includes('Erro de validação de saída:')) {
        console.error(`[CRÍTICO] Erro de contrato em ${acao}:`, error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: 'Erro interno de processamento de dados.'
        });
      }
    }

    console.error(`Erro ao ${acao}:`, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: `Ocorreu um erro ao ${acao.toLowerCase()}`
    });
  }
}

export default new TarefaController();