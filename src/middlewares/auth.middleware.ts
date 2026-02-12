import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/core/errors';
import AuthTokenService from '@/services/auth.token.service';

class AuthMiddleware {
  autenticarTokenAPI = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = AuthTokenService.pegarTokenDoHeader(authHeader);
      const decoded = AuthTokenService.desencriptarAccessToken(token);

      req.usuarioIdentidade = {
        id: decoded.id,
        email: decoded.email,
        usuarioRole: decoded.usuarioRole,
        accessToken: token,
      };

      return next();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error instanceof Error) {
        console.error('[ERRO CRÍTICO]:', error.message);
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro interno no servidor' });
    }
  };

  desabilitarCache = (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  };
}

export default new AuthMiddleware();
