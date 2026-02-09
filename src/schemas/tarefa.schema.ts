import * as z from 'zod';

import { TarefaPrioridade, TarefaStatus } from '@/types/enums';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const TarefaSistemaCreateSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, 'O título deve ter no mínimo 3 caracteres'),
  descricao: z.string().trim().optional(),
  status: z.nativeEnum(TarefaStatus).default(TarefaStatus.PENDENTE),
  prioridade: z.nativeEnum(TarefaPrioridade).default(TarefaPrioridade.MEDIA),
})
  .strict();

export const TarefaUpdateSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .optional(),
  descricao: z.string().trim().optional(),
  status: z.nativeEnum(TarefaStatus).optional(),
  prioridade: z.nativeEnum(TarefaPrioridade).optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const TarefaSafeOutputSchema = z.object({
  id: objectIdSchema,
  titulo: z.string(),
  descricao: z.string().optional(),
  status: z.nativeEnum(TarefaStatus),
  prioridade: z.nativeEnum(TarefaPrioridade),
  usuarioID: objectIdSchema,
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
})
  .strict();
