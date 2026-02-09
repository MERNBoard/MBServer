import * as z from 'zod';
import { TarefaPrioridade, TarefaStatus } from '@/types/enums';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const TarefaCreateSchema = z.object({
  titulo: z.string().trim().min(3),
  descricao: z.string().trim().optional(),
  status: z.nativeEnum(TarefaStatus).default(TarefaStatus.PENDENTE),
  prioridade: z.nativeEnum(TarefaPrioridade).default(TarefaPrioridade.MEDIA),
  categorias: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  deadline: z.coerce.date().optional(),
})
  .strict()
  .transform((data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
  });


export const TarefaUpdateSchema = z.object({
  titulo: z.string().trim().min(3).optional(),
  descricao: z.string().trim().optional(),
  status: z.nativeEnum(TarefaStatus).optional(),
  prioridade: z.nativeEnum(TarefaPrioridade).optional(),
  categorias: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  deadline: z.coerce.date().optional(),
  completadaEm: z.coerce.date().optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  })
  .transform((data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );
  });


export const TarefaSafeOutputSchema = z.object({
  id: objectIdSchema,
  usuarioID: objectIdSchema,
  titulo: z.string(),
  descricao: z.string().optional(),
  status: z.nativeEnum(TarefaStatus),
  prioridade: z.nativeEnum(TarefaPrioridade),
  categorias: z.string().optional(),
  tags: z.array(z.string()).optional(),
  deadline: z.string().datetime().nullable().optional(),
  completadaEm: z.string().datetime().nullable().optional(),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
})
  .strict();
