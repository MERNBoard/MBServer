import type * as z from 'zod';
import type { TarefaCreateSchema, TarefaSafeOutputSchema, TarefaUpdateSchema } from '@/schemas';

export type TarefaInput = z.infer<typeof TarefaCreateSchema>;
export type TarefaUpdate = z.infer<typeof TarefaUpdateSchema>;
export type TarefaSafeOutput = z.infer<typeof TarefaSafeOutputSchema>;
