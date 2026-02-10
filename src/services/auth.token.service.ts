import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { AuthToken, Usuario } from '@/models';

import { UsuarioInputSchema, UsuarioLoginInputSchema, UsuarioOutputSchema } from '@/schemas';
import { TokenTipo } from '@/types/enums';
import type {
  UsuarioAuthToken,
  UsuarioPayload,
} from '@/types/interfaces';
import type { UsuarioInput, UsuarioLoginInput } from '@/types/types';

import UsuarioService from './usuario.service';

class AuthService {
  private JWT_ACCESS_SECRET: string;
  private JWT_REFRESH_SECRET: string;
  private JWT_SALT_ROUNDS: number;

  constructor() {
    if (!process.env.JWT_SECRET_ACESS || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_SECRET_ACESS e JWT_REFRESH_SECRET devem ser configurados no ambiente');
    }

    this.JWT_ACCESS_SECRET = process.env.JWT_SECRET_ACESS;
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    this.JWT_SALT_ROUNDS = process.env.JWT_SALT_ROUNDS
      ? parseInt(String(process.env.JWT_SALT_ROUNDS), 10)
      : 10;
  }

  private _gerarAccessToken(payload: UsuarioPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        usuarioRole: payload.usuarioRole,
      },
      this.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );
  }

  private _gerarRefreshToken(payload: UsuarioPayload): string {
    return jwt.sign(
      {
        id: payload.id,
      },
      this.JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );
  }

  private _gerarTokens(payload: UsuarioPayload): UsuarioAuthToken {
    return {
      accessToken: this._gerarAccessToken(payload),
      refreshToken: this._gerarRefreshToken(payload),
    };
  }

  private async _hashToken(token: string): Promise<string> {
    return bcrypt.hashSync(token, this.JWT_SALT_ROUNDS);
  }

  private async _salvarRefreshTokenNoBanco(usuarioID: string, refreshToken: string): Promise<void> {
    const tokenHash = await this._hashToken(refreshToken);

    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    await AuthToken.create({
      usuarioID: new Types.ObjectId(usuarioID),
      tipo: TokenTipo.REFRESH,
      tokenHash,
      expiraEm,
      usado: false,
      valido: true,
    });
  }

  private async _invalidarRefreshTokensUsuario(usuarioID: string): Promise<void> {
    await AuthToken.updateMany(
      { usuarioID, tipo: TokenTipo.REFRESH, valido: true },
      { valido: false, invalidadoEm: new Date() },
    );
  }

  private _tratarErro(error: unknown): never {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expirado');
    }
    console.error('Ocorreu um erro:', error instanceof Error ? error.message : error);
    throw error;
  }


  pegarTokenDoHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }

  desencriptarAccessToken(accessToken: string): JwtPayload {
    if (!accessToken) {
      throw new Error('Token de acesso não fornecido!');
    }

    try {
      const decoded = jwt.verify(accessToken, this.JWT_ACCESS_SECRET);

      if (typeof decoded === 'string') {
        throw new Error('Token inválido');
      }

      return decoded;
    } catch (error) {
      this._tratarErro(error);
    }
  }

  desencriptarRefreshToken(refreshToken: string): JwtPayload {
    if (!refreshToken) {
      throw new Error('Refresh token não fornecido!');
    }

    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET);

      if (typeof decoded === 'string') {
        throw new Error('Token inválido');
      }

      return decoded;
    } catch (error) {
      this._tratarErro(error);
    }
  }

  async registrar(usuario: UsuarioInput): Promise<UsuarioAuthToken> {
    const validacao = UsuarioInputSchema.safeParse(usuario);

    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const usuarioCriado = await Usuario.create(validacao.data);

    const usuarioObj = usuarioCriado.toObject();

    const usuarioSafe = UsuarioOutputSchema.safeParse(usuarioObj);

    if (!usuarioSafe.success) {
      throw new Error(`Erro de validação de saída: ${usuarioSafe.error.message}`);
    }

    const payload: UsuarioPayload = {
      id: usuarioSafe.data.id,
      email: usuarioSafe.data.email,
      usuarioRole: usuarioSafe.data.usuarioRole,
    };

    const tokens = this._gerarTokens(payload);

    await this._salvarRefreshTokenNoBanco(payload.id, tokens.refreshToken);

    return tokens;
  }

  async login(data: UsuarioLoginInput): Promise<UsuarioAuthToken> {
    const validacao = UsuarioLoginInputSchema.safeParse(data);

    if (!validacao.success) {
      throw new Error(`Erro de validação: ${validacao.error.message}`);
    }

    const loginData = validacao.data;

    const usuario = await UsuarioService.buscarUsuarioPorEmail(loginData.email);

    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(loginData.password, usuario.passwordHash);

    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    const payload: UsuarioPayload = {
      id: usuario.id,
      email: usuario.email,
      usuarioRole: usuario.usuarioRole,
    };

    const tokens = this._gerarTokens(payload);


    await this._invalidarRefreshTokensUsuario(payload.id);


    await this._salvarRefreshTokenNoBanco(payload.id, tokens.refreshToken);

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    const decoded = this.desencriptarRefreshToken(refreshToken);

    const usuarioID = decoded.id as string;

    if (!usuarioID) {
      throw new Error('Refresh token inválido');
    }

    await this._invalidarRefreshTokensUsuario(usuarioID);
  }

  async refresh(refreshToken: string): Promise<UsuarioAuthToken> {
    const decoded = this.desencriptarRefreshToken(refreshToken);

    const usuarioID = decoded.id as string;

    if (!usuarioID) {
      throw new Error('Refresh token inválido');
    }

    const usuario = await UsuarioService.buscarUsuarioPorId(usuarioID);

    if (!usuario) {
      throw new Error('Usuário não existe');
    }

    const tokensBanco = await AuthToken.find({
      usuarioID,
      tipo: TokenTipo.REFRESH,
      valido: true,
      expiraEm: { $gt: new Date() },
    });

    if (!tokensBanco.length) {
      throw new Error('Refresh token inválido ou expirado');
    }

    let tokenValido = false;

    for (const tokenDoc of tokensBanco) {
      const match = await bcrypt.compare(refreshToken, tokenDoc.tokenHash);
      if (match) {
        tokenValido = true;
        break;
      }
    }

    if (!tokenValido) {
      await this._invalidarRefreshTokensUsuario(usuarioID);
      throw new Error('Refresh token inválido');
    }

    const payload: UsuarioPayload = {
      id: String(usuario.id),
      email: usuario.email,
      usuarioRole: usuario.usuarioRole,
    };

    const novosTokens = this._gerarTokens(payload);

    await this._invalidarRefreshTokensUsuario(usuarioID);
    await this._salvarRefreshTokenNoBanco(usuarioID, novosTokens.refreshToken);

    return novosTokens;
  }
}

export default new AuthService();
