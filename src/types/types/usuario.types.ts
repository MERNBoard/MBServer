import type * as z from 'zod';
import type {
  UsuarioAdminUpdateSchema,
  UsuarioCreateSchema,
  UsuarioSafeOutputSchema,
  UsuarioUpdateSchema,
} from '@/schemas';

export type UsuarioCreate = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdate = z.infer<typeof UsuarioUpdateSchema>;
export type UsuarioAdminUpdate = z.infer<typeof UsuarioAdminUpdateSchema>;
export type UsuarioSafeOutput = z.infer<typeof UsuarioSafeOutputSchema>;
