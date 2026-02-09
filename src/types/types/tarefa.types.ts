import type * as z from 'zod';
import type { TarefaSchema } from '@/schemas';

export type TarefaInput = z.infer<typeof TarefaSchema>;