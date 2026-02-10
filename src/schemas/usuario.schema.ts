import * as z from 'zod';

import { UsuarioRole } from '@/types/enums';

export const UsuarioInputSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.email('Email inválido').trim(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
}).strict();

export const UsuarioAdminInputSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.email('Email inválido').trim(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  usuarioRole: z.enum(UsuarioRole).default(UsuarioRole.USUARIO),
}).strict();


export const UsuarioUpdateInputSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  email: z.email('Email inválido').trim().optional(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });


export const UsuarioAdminUpdateInputSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
  email: z.email('Email inválido').trim().optional(),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').optional(),
  usuarioRole: z.enum(UsuarioRole).optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  });

export const UsuarioOutputSchema = z.object({
  _id: z.any(),
  nome: z.string(),
  email: z.email(),
  usuarioRole: z.enum(UsuarioRole),
  criadoEm: z.iso.datetime(),
  atualizadoEm: z.iso.datetime(),
}).transform((data) => ({
  id: String(data._id),
  nome: data.nome,
  email: data.email,
  usuarioRole: data.usuarioRole,
  criadoEm: data.criadoEm,
  atualizadoEm: data.atualizadoEm,
}));

