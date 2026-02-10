import * as z from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const NotificacaoCreateSchema = z.object({
  usuarioID: objectIdSchema,
  titulo: z.string().trim().min(1, 'O título é obrigatório'),
  mensagem: z.string().trim().min(1, 'A mensagem é obrigatória'),
  lida: z.boolean().default(false),
  lidaEm: z.date().optional(),
})
  .strict();

export const NotificacaoUpdateSchema = z.object({
  titulo: z.string().trim().min(1, 'O título é obrigatório').optional(),
  mensagem: z.string().trim().min(1, 'A mensagem é obrigatória').optional(),
  lida: z.boolean().optional(),
  lidaEm: z.date().optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const NotificacaoSafeOutputSchema = z.object({
  id: objectIdSchema,
  usuarioID: objectIdSchema,
  titulo: z.string(),
  mensagem: z.string(),
  lida: z.boolean(),
  lidaEm: z.iso.datetime().nullable().optional(),
  criadoEm: z.iso.datetime(),
  atualizadoEm: z.iso.datetime(),
})
  .strict();
