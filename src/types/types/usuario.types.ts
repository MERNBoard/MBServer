import type * as z from 'zod';
import type {
  UsuarioInputSchema,
  UsuarioLoginInputSchema,
  UsuarioOutputSchema,
  UsuarioRegisterInputSchema,
  UsuarioUpdateInputSchema,
} from '@/schemas';

export type UsuarioInput = z.infer<typeof UsuarioInputSchema>;
export type UsuarioUpdate = z.infer<typeof UsuarioUpdateInputSchema>;
export type UsuarioOutput = z.infer<typeof UsuarioOutputSchema>;
export type UsuarioLoginInput = z.infer<typeof UsuarioLoginInputSchema>;
export type UsuarioRegisterInput = z.infer<typeof UsuarioRegisterInputSchema>;
