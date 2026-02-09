import type * as z from 'zod';
import type {
  NotificacaoCreateSchema,
  NotificacaoSafeOutputSchema,
  NotificacaoUpdateSchema,
} from '@/schemas';

export type NotificacaoInput = z.infer<typeof NotificacaoCreateSchema>;
export type NotificacaoUpdate = z.infer<typeof NotificacaoUpdateSchema>;
export type NotificacaoSafeOutput = z.infer<typeof NotificacaoSafeOutputSchema>;
