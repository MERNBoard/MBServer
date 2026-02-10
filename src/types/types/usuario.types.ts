import type * as z from 'zod';
import type {
  UsuarioAdminInputSchema,
  UsuarioAdminUpdateInputSchema,
  UsuarioInputSchema,
  UsuarioOutputSchema,
  UsuarioUpdateInputSchema,
} from '@/schemas';

export type UsuarioInput = z.infer<typeof UsuarioInputSchema>;
export type UsuarioUpdate = z.infer<typeof UsuarioUpdateInputSchema>;
export type UsuarioAdminInput = z.infer<typeof UsuarioAdminInputSchema>;
export type UsuarioAdminUpdate = z.infer<typeof UsuarioAdminUpdateInputSchema>;
export type UsuarioOutput = z.infer<typeof UsuarioOutputSchema>;
