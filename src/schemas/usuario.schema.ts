import * as z from 'zod';
import { UsuarioRole } from '@/types/enums';

const isoDateString = z.iso.datetime();


export const UsuarioInputSchema = z
  .object({
    nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.email('Email inválido').trim(),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
    usuarioRole: z.enum(UsuarioRole).optional().default(UsuarioRole.USUARIO),
  })
  .strict();


export const UsuarioLoginInputSchema = z
  .object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(6, 'Senha inválida, deve conter no mínimo 6 caracteres'),
  })
  .strict();

export const UsuarioRegisterInputSchema = z
  .object({
    nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.email('Email inválido').trim(),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  })
  .strict();


export const UsuarioUpdateInputSchema = z
  .object({
    nome: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres').optional(),
    email: z.email('Email inválido').trim().optional(),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').optional(),
    usuarioRole: z.enum(UsuarioRole).optional(),
  })
  .strict();


export const UsuarioOutputSchema = z
  .object({
    _id: z.string(),
    nome: z.string(),
    email: z.email(),
    passwordHash: z.string(),
    usuarioRole: z.enum(UsuarioRole),
    criadoEm: isoDateString,
    atualizadoEm: isoDateString,
  })
  .strict()
  .transform((data) => ({
    id: data._id,
    nome: data.nome,
    email: data.email,
    passwordHash: data.passwordHash,
    usuarioRole: data.usuarioRole,
    criadoEm: data.criadoEm,
    atualizadoEm: data.atualizadoEm,
  }))
