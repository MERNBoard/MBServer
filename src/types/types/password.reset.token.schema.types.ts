import type * as z from 'zod';
import type {
  PasswordResetTokenCreateSchema,
  PasswordResetTokenSafeOutputSchema,
  PasswordResetTokenUpdateSchema,
} from '@/schemas';

export type PasswordResetTokenInput = z.infer<typeof PasswordResetTokenCreateSchema>;
export type PasswordResetTokenUpdate = z.infer<typeof PasswordResetTokenUpdateSchema>;
export type PasswordResetTokenSafeOutput = z.infer<typeof PasswordResetTokenSafeOutputSchema>;
