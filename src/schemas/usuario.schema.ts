import * as z from 'zod';

import { UsuarioRole } from '@/types/enums';

export const UsuarioCreateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().trim().email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
}).strict();

export const UsuarioAdminCreateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().trim().email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  usuarioRole: z.nativeEnum(UsuarioRole).default(UsuarioRole.USUARIO),
}).strict();


export const UsuarioUpdateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  email: z.string().trim().email('Email inválido').optional(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });


export const UsuarioAdminUpdateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  email: z.string().trim().email('Email inválido').optional(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').optional(),
  usuarioRole: z.nativeEnum(UsuarioRole).optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const UsuarioSafeOutputSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email('Email inválido'),
  usuarioRole: z.nativeEnum(UsuarioRole),
  criadoEm: z.string().datetime(),
  atualizadoEm: z.string().datetime(),
})
  .strict();
