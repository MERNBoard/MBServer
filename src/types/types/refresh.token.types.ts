import type * as z from 'zod';
import type {
  RefreshTokenSistemaCreateSchema,
  RefreshTokenSistemaSafeOutputSchema,
  RefreshTokenSistemaUpdateSchema,
} from '@/schemas';

export type RefreshTokenInput = z.infer<typeof RefreshTokenSistemaCreateSchema>;
export type RefreshTokenUpdate = z.infer<typeof RefreshTokenSistemaUpdateSchema>;
export type RefreshTokenSafeOutput = z.infer<typeof RefreshTokenSistemaSafeOutputSchema>;
