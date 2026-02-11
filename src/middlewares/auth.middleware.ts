import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthTokenService from '@/services/auth.token.service';
import type { UsuarioIdentidade } from '@/types/interfaces';


class AuthMiddleware {
  autenticarTokenAPI = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = AuthTokenService.pegarTokenDoHeader(authHeader);

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token não fornecido' });
      }

      const decoded = AuthTokenService.desencriptarAccessToken(token);

      const usuarioAuthData: UsuarioIdentidade = {
        id: decoded.id,
        email: decoded.email,
        usuarioRole: decoded.usuarioRole,
        accessToken: decoded.accessToken,
      };

      req.usuarioIdentidade = usuarioAuthData;
      return next();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Credenciais inválidas')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
      }
      if (error instanceof Error && error.message.includes('Token de acesso expirado')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
      }
      if (error instanceof Error && error.message.includes('Token de acesso não fornecido')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
      }
      if (error instanceof Error && error.message.includes('Formato de token inválido')) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      }
      console.error('Erro no login:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro no servidor ao processar login' });
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
