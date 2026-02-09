import type * as z from 'zod';
import type { NotificacaoSchema } from '@/schemas';

export type NotificacaoInput = z.infer<typeof NotificacaoSchema>;