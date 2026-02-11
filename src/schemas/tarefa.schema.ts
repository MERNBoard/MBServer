import * as z from 'zod';
import { TarefaPrioridade, TarefaStatus } from '@/types/enums';

export const TarefaCreateInputSchema = z.object({
  titulo: z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres'),
  descricao: z.string().trim().optional(),
  status: z.enum(TarefaStatus).default(TarefaStatus.PENDENTE),
  prioridade: z.enum(TarefaPrioridade).default(TarefaPrioridade.MEDIA),
  categoria: z.string().trim().optional(),
  tags: z.array(z.string().trim()).default([]),
  deadline: z.coerce.date().optional(),
}).strict();

export const TarefaUpdateInputSchema = z.object({
  titulo: z.string().trim().min(3).optional(),
  descricao: z.string().trim().optional(),
  status: z.enum(TarefaStatus).optional(),
  prioridade: z.enum(TarefaPrioridade).optional(),
  categoria: z.string().trim().optional(),
  tags: z.array(z.string().trim()).optional(),
  deadline: z.coerce.date().optional(),
  completadaEm: z.coerce.date().optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: 'Envie ao menos um campo para atualizar',
});


export const TarefaOutputSchema = z.object({
  _id: z.coerce.string(),
  usuarioID: z.coerce.string(),
  titulo: z.string(),
  descricao: z.string().optional().nullable(),
  status: z.enum(TarefaStatus),
  prioridade: z.enum(TarefaPrioridade),
  categoria: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  criadoEm: z.coerce.date().transform((dt) => dt.toISOString()),
  atualizadoEm: z.coerce.date().transform((dt) => dt.toISOString()),
  deadline: z.coerce.date().nullable().optional().transform((dt) => dt?.toISOString() || null),

  completadaEm: z.preprocess(
    (val) => (val ? new Date(val as string | number | Date) : null),
    z.date().nullable()
  ).transform((dt) => dt?.toISOString() || null),

  __v: z.any().optional(),
})
  .transform((data) => ({
    id: data._id,
    usuarioID: data.usuarioID,
    titulo: data.titulo,
    descricao: data.descricao ?? '',
    status: data.status,
    prioridade: data.prioridade,
    categoria: data.categoria ?? 'Geral',
    tags: data.tags,
    deadline: data.deadline,
    completadaEm: data.completadaEm,
    criadoEm: data.criadoEm,
    atualizadoEm: data.atualizadoEm,
  }));
