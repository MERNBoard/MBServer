import * as z from 'zod';

export const RefreshTokenSchema = z.object({
  usuarioID: z.string().refine((id) => /^[0-9a-fA-F]{24}$/.test(id), 'ID de usuário inválido'),
  tokenHash: z.string().min(5, 'O hash do token é obrigatório'),
  expiraEm: z.date().refine((date) => date > new Date(), 'A data de expiração deve ser no futuro'),
  invalidada: z.boolean().optional(),
  invalidadaEm: z.date().optional(),
  criadoEm: z.date().optional(),
  atualizadoEm: z.date().optional(),
});
