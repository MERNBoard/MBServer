import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthTokenService } from '@/services';

class AuthController {
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      const tokens = await AuthTokenService.login({ email, password });
      return res.json(tokens);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Credenciais inválidas')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
      }
      console.error('Erro no login:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro no servidor ao processar login' });
    }
  };

  registrar = async (req: Request, res: Response) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    try {
      const tokens = await AuthTokenService.registrar({ nome, email, password });
      return res.status(StatusCodes.CREATED).json(tokens);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Erro de validação')) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
      }
      if (error instanceof Error && error.message.includes('Email já cadastrado')) {
        return res.status(StatusCodes.CONFLICT).json({ error: error.message });
      }
      console.error('Erro no registro:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro no servidor ao processar registro' });
    }
  };
}

export default new AuthController();
