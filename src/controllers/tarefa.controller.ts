import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/core/errors';
import { TarefaService } from '@/services';

class TarefaController {
  private _getAuthUserID(req: Request): string {
    const id = req.usuarioIdentidade?.id;
    if (!id || typeof id !== 'string') {
      throw new AppError('Usuário não autenticado ou ID ausente', StatusCodes.UNAUTHORIZED);
    }
    return id;
  }

  private _getTarefaID(req: Request): string {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new AppError('O ID da tarefa fornecido é inválido', StatusCodes.BAD_REQUEST);
    }
    return id;
  }

  testar = async (req: Request, res: Response) => {
    try {
      const all = {
        usurioID: this._getAuthUserID(req),
        tarefaID: this._getTarefaID(req),
        body: req.body,
        params: req.params,
        query: req.query,
      };
      return res.status(StatusCodes.OK).json({
        message: 'Rota de teste funcionando!',
        seiDe: all,
      });
    } catch (error) {
      return this._tratarErro(res, error, 'testar rota');
    }
  };

  criarTarefa = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaCriada = await TarefaService.criarTarefa(usuarioID, req.body);
      return res.status(StatusCodes.CREATED).json(tarefaCriada);
    } catch (error) {
      return this._tratarErro(res, error, 'criar tarefa');
    }
  };

  listarMinhasTarefas = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefas = await TarefaService.buscarTarefasPorUsuario(usuarioID);
      return res.status(StatusCodes.OK).json(tarefas);
    } catch (error) {
      return this._tratarErro(res, error, 'listar tarefas');
    }
  };

  buscarTarefaPorId = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaID = this._getTarefaID(req);

      const tarefa = await TarefaService.buscarTarefaPorId(tarefaID, usuarioID);
      if (!tarefa) {
        throw new AppError('Tarefa não encontrada', StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.OK).json(tarefa);
    } catch (error) {
      return this._tratarErro(res, error, 'buscar tarefa');
    }
  };

  atualizarTarefa = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaID = this._getTarefaID(req);

      const tarefaAtualizada = await TarefaService.atualizarTarefa(tarefaID, usuarioID, req.body);

      if (!tarefaAtualizada) {
        throw new AppError('Tarefa não encontrada ou permissão negada', StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.ACCEPTED).json(tarefaAtualizada);
    } catch (error) {
      return this._tratarErro(res, error, 'atualizar tarefa');
    }
  };

  deletarTarefa = async (req: Request, res: Response) => {
    try {
      const usuarioID = this._getAuthUserID(req);
      const tarefaID = this._getTarefaID(req);

      const deletado = await TarefaService.deletarTarefa(tarefaID, usuarioID);
      if (!deletado) {
        throw new AppError('Tarefa não encontrada ou permissão negada', StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      return this._tratarErro(res, error, 'deletar tarefa');
    }
  };

  private _tratarErro(res: Response, error: unknown, acao: string) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    // Erros de contrato (validação de saída) ou erros inesperados
    console.error(`[ERRO AO ${acao.toUpperCase()}]:`, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: `Ocorreu um erro interno ao ${acao.toLowerCase()}`,
    });
  }
}

export default new TarefaController();
