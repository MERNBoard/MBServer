import type * as z from 'zod';
import type {
  NotificacaoCreateSchema,
  NotificacaoOutputSchema,
  NotificacaoUpdateSchema,
} from '@/schemas';

export type NotificacaoCreateInput = z.infer<typeof NotificacaoCreateSchema>;
export type NotificacaoUpdateInput = z.infer<typeof NotificacaoUpdateSchema>;
export type NotificacaoOutput = z.infer<typeof NotificacaoOutputSchema>;
