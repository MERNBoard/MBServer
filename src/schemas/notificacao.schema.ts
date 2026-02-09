import * as z from 'zod';


export const NotificacaoSchema = z.object({
  usuarioID: z.string().refine((id) => /^[0-9a-fA-F]{24}$/.test(id), 'ID de usuário inválido'),
  titulo: z.string().min(1, 'O título é obrigatório'),
  mensagem: z.string().min(1, 'A mensagem é obrigatória'),
  lida: z.boolean().default(false),
  lidaEm: z.date().optional(),
  criadoEm: z.date().optional(),
  atualizadoEm: z.date().optional(),
});