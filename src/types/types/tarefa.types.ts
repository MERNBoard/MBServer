import type * as z from 'zod';
import type { TarefaCreateInputSchema, TarefaOutputSchema, TarefaUpdateInputSchema } from '@/schemas';

export type TarefaCreateInput = z.infer<typeof TarefaCreateInputSchema>;
export type TarefaUpdateInput = z.infer<typeof TarefaUpdateInputSchema>;
export type TarefaOutput = z.infer<typeof TarefaOutputSchema>;
