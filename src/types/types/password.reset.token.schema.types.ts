import type * as z from 'zod';
import type { PasswordResetTokenSchema } from '@/schemas';

export type PasswordResetTokenInput = z.infer<typeof PasswordResetTokenSchema>;