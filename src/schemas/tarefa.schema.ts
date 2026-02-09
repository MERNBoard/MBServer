import * as z from 'zod';

import { TarefaPrioridade, TarefaStatus } from '@/types/enums';

export const TarefaSchema = z.object({
  titulo: z.string().min(3, 'O título é obrigatório'),
  descricao: z.string().optional(),
  status: z.enum(TarefaStatus).default(TarefaStatus.PENDENTE),
  prioridade: z.enum(TarefaPrioridade).default(TarefaPrioridade.MEDIA),
  usuarioID: z.string().refine((id) => /^[0-9a-fA-F]{24}$/.test(id), 'ID de usuário inválido'),
  criadoEm: z.date().optional(),
  atualizadoEm: z.date().optional(),
});
