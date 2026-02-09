import type * as z from 'zod';
import type { UsuarioSchema } from '@/schemas';

export type UsuarioInput = z.infer<typeof UsuarioSchema>;
