import type * as z from 'zod';
import type { TarefaSistemaCreateSchema, TarefaUpdateSchema, TarefaSafeOutputSchema } from '@/schemas';

export type TarefaInput = z.infer<typeof TarefaSistemaCreateSchema>;
export type TarefaUpdate = z.infer<typeof TarefaUpdateSchema>;
export type TarefaSafeOutput = z.infer<typeof TarefaSafeOutputSchema>;