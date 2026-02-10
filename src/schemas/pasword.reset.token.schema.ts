import * as z from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const PasswordResetTokenCreateSchema = z.object({
  usuarioID: objectIdSchema,
  tokenHash: z
    .string()
    .trim()
    .min(32, 'O hash do token é obrigatório e deve ser válido'),
  expiraEm: z.date().refine((date) => date > new Date(), {
    message: 'A data de expiração deve ser no futuro',
  }),
  usado: z.boolean().default(false),
  usadoEm: z.date().optional(),
})
  .strict();

export const PasswordResetTokenUpdateSchema = z.object({
  usado: z.boolean().optional(),
  usadoEm: z.date().optional(),
  expiraEm: z.date().optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const PasswordResetTokenSafeOutputSchema = z.object({
  id: objectIdSchema,
  usuarioID: objectIdSchema,
  tokenHash: z.string(),
  expiraEm: z.iso.datetime(),
  usado: z.boolean(),
  usadoEm: z.iso.datetime().nullable().optional(),
  criadoEm: z.iso.datetime(),
  atualizadoEm: z.iso.datetime(),
})
  .strict();
