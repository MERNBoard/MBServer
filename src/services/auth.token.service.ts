import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET deve ser configurado no ambiente');
    }

    this.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
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
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new Error('Token de acesso expirado');
    }
    console.error('Ocorreu um erro no TokenService:', error instanceof Error ? error.message : error);
    throw error;
  }

  pegarTokenDoHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    return token;
  }

  desencriptarAccessToken(accessToken: string): UsuarioLogadoPayload {
    if (!accessToken) {
      throw new Error('Token de acesso não fornecido!');
    }

    try {
      const decoded = jwt.verify(accessToken, this.JWT_ACCESS_SECRET);

      if (typeof decoded === 'string') {
        throw new Error('Token inválido');
      }

      return decoded as UsuarioLogadoPayload;
    } catch (error) {
      this._tratarErro(error);
    }
  }

  async registrar(usuario: UsuarioRegisterInput): Promise<{ accessToken: string }> {
    const validacao = UsuarioRegisterInputSchema.safeParse(usuario);

    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const usuarioCriado = await UsuarioService.criarUsuario(validacao.data);
    const usuarioSafe = UsuarioOutputSchema.safeParse(usuarioCriado);

    if (!usuarioSafe.success) {
      throw new Error(`Erro de validação de saída: ${usuarioSafe.error.message}`);
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
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const usuario = await UsuarioService.buscarUsuarioPorEmail(validacao.data.email);

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(validacao.data.password, usuario.passwordHash);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
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