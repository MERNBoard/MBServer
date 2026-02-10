import * as z from 'zod';
import { TokenTipo } from '@/types/enums';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const AuthTokenSistemaCreateSchema = z
  .object({
    usuarioID: objectIdSchema,
    tipo: z.enum(TokenTipo),
    tokenHash: z.string().trim().min(32, 'O hash do token deve ser válido'),
    expiraEm: z.date().refine((date) => date > new Date(), {
      message: 'A data de expiração deve ser no futuro',
    }),
    usado: z.boolean().optional().default(false),
    valido: z.boolean().optional().default(true),
    usadoEm: z.date().optional(),
    invalidadoEm: z.date().optional(),
  })
  .strict();

export const AuthTokenSistemaUpdateSchema = z
  .object({
    expiraEm: z.date().optional(),
    usado: z.boolean().optional(),
    valido: z.boolean().optional(),
    usadoEm: z.date().optional(),
    invalidadoEm: z.date().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const AuthTokenSistemaSafeOutputSchema = z
  .object({
    id: objectIdSchema,
    usuarioID: objectIdSchema,
    tipo: z.enum(TokenTipo),
    tokenHash: z.string(),
    expiraEm: z.iso.datetime(),
    usado: z.boolean(),
    valido: z.boolean(),
    usadoEm: z.iso.datetime().nullable().optional(),
    invalidadoEm: z.iso.datetime().nullable().optional(),
    criadoEm: z.iso.datetime(),
    atualizadoEm: z.iso.datetime(),
  })
  .strict();
