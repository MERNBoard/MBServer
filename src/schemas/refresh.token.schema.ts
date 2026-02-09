import * as z from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const RefreshTokenSistemaCreateSchema = z.object({
  usuarioID: objectIdSchema,
  tokenHash: z
    .string()
    .trim()
    .min(32, 'O hash do token é obrigatório e deve ser válido'),
  expiraEm: z.date().refine((date) => date > new Date(), {
    message: 'A data de expiração deve ser no futuro',
  }),
  invalidada: z.boolean().default(false),
  invalidadaEm: z.date().optional(),
})
  .strict();

export const RefreshTokenSistemaUpdateSchema = z.object({
  invalidada: z.boolean().optional(),
  invalidadaEm: z.date().optional(),
  expiraEm: z.date().optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const RefreshTokenSistemaSafeOutputSchema = z.object({
  id: objectIdSchema,
  usuarioID: objectIdSchema,
  tokenHash: z.string(),
  expiraEm: z.string().datetime(),
  invalidada: z.boolean(),
  invalidadaEm: z.string().datetime().nullable().optional(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
})
  .strict();
