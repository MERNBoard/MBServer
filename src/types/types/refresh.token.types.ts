import type * as z from 'zod';
import type { RefreshTokenSchema } from '@/schemas';

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;