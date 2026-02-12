import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/core/errors';
import { AuthTokenService } from '@/services';

class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const tokens = await AuthTokenService.login(req.body);

      return res.status(StatusCodes.OK).json(tokens);
    } catch (error: unknown) {
      this._tratarErro(res, error, 'Erro no login');
    }
  };

  registrar = async (req: Request, res: Response) => {
    try {
      await AuthTokenService.registrar(req.body);

      return res.status(StatusCodes.CREATED).json({
        message: 'Usuário registrado com sucesso! Realize o login para obter seu token de acesso.',
      });
    } catch (error: unknown) {
      this._tratarErro(res, error, 'Erro no registro');
    }
  };

  private _tratarErro(res: Response, error: unknown, context: string) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(`[${context.toUpperCase()}]:`, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Erro interno no servidor',
    });
  }
}

export default new AuthController();
