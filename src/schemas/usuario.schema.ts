import * as z from 'zod';

import { UsuarioRole } from '@/types/enums';

export const UsuarioSchema = z.object({
  nome: z.string().min(3, 'O nome é obrigatório'),
  email: z.string().email({ pattern: z.regexes.email, message: 'Email inválido' }),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  usuarioRole: z.enum(UsuarioRole).optional(),
  criadoEm: z.date().optional(),
  atualizadoEm: z.date().optional(),
});

