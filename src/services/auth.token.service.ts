import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { AppError } from '@/core/errors';
import {
  UsuarioLoginInputSchema,
  UsuarioOutputSchema,
  UsuarioRegisterInputSchema,
} from '@/schemas';
import type { UsuarioLogadoPayload, UsuarioPayload } from '@/types/interfaces';
import type { UsuarioLoginInput, UsuarioRegisterInput } from '@/types/types';
import UsuarioService from './usuario.service';

class AuthTokenService {
  private JWT_ACCESS_SECRET: string;

  constructor() {
    if (!config.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET deve ser configurado no ambiente');
    }
    this.JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;
  }

  private _gerarAccessToken(payload: UsuarioPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        usuarioRole: payload.usuarioRole,
      },
      this.JWT_ACCESS_SECRET,
      { expiresIn: '7d' },
    );
  }

  private _tratarErro(error: unknown): never {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token de acesso expirado', StatusCodes.UNAUTHORIZED);
    }

    if (error instanceof jwt.JsonWebTokenError || error instanceof SyntaxError) {
      throw new AppError('Token de acesso inválido ou malformado', StatusCodes.UNAUTHORIZED);
    }

    if (error instanceof AppError) throw error;

    throw new AppError('Erro interno na verificação do token', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  pegarTokenDoHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new AppError('Token de acesso não fornecido', StatusCodes.UNAUTHORIZED);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError(
        "Formato de token inválido. O formato esperado é: 'Bearer <token>'",
        StatusCodes.BAD_REQUEST,
      );
    }

    return token;
  }

  desencriptarAccessToken(accessToken: string): UsuarioLogadoPayload {
    if (!accessToken) {
      throw new AppError('Token de acesso não fornecido!', StatusCodes.UNAUTHORIZED);
    }

    try {
      const decoded = jwt.verify(accessToken, this.JWT_ACCESS_SECRET);

      if (typeof decoded === 'string') {
        throw new AppError('Payload do token inválido', StatusCodes.UNAUTHORIZED);
      }

      return decoded as UsuarioLogadoPayload;
    } catch (error) {
      this._tratarErro(error);
    }
  }

  async registrar(usuario: UsuarioRegisterInput): Promise<{ accessToken: string }> {
    const validacao = UsuarioRegisterInputSchema.safeParse(usuario);

    if (!validacao.success) {
      throw new AppError(`Erro de validação: ${validacao.error.message}`, StatusCodes.BAD_REQUEST);
    }

    const usuarioCriado = await UsuarioService.criarUsuario(validacao.data);
    const usuarioSafe = UsuarioOutputSchema.safeParse(usuarioCriado);

    if (!usuarioSafe.success) {
      throw new AppError(
        'Erro interno ao processar dados do novo usuário',
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const payload: UsuarioPayload = {
      id: usuarioSafe.data.id,
      email: usuarioSafe.data.email,
      usuarioRole: usuarioSafe.data.usuarioRole,
    };

    return { accessToken: this._gerarAccessToken(payload) };
  }

  async login(data: UsuarioLoginInput): Promise<{ accessToken: string }> {
    const validacao = UsuarioLoginInputSchema.safeParse(data);

    if (!validacao.success) {
      throw new AppError('Dados de login malformados', StatusCodes.BAD_REQUEST);
    }

    const usuario = await UsuarioService.buscarUsuarioPorEmail(validacao.data.email);

    if (!usuario) {
      throw new AppError('Credenciais inválidas', StatusCodes.UNAUTHORIZED);
    }

    const senhaValida = await bcrypt.compare(validacao.data.password, usuario.passwordHash);

    if (!senhaValida) {
      throw new AppError('Credenciais inválidas', StatusCodes.UNAUTHORIZED);
    }

    const payload: UsuarioPayload = {
      id: usuario.id,
      email: usuario.email,
      usuarioRole: usuario.usuarioRole,
    };

    return { accessToken: this._gerarAccessToken(payload) };
  }

  async logout(): Promise<void> {
    return;
  }
}

export default new AuthTokenService();
