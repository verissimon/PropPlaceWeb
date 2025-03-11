import { z } from 'zod';

const mensagemCampoVazio =
  'Essa informação é obrigatória e não pode estar vazia';

const registroSchema = z
  .object({
    nome: z.string().nonempty('Nome é obrigatório'),
    username: z.string().nonempty('Nome de usuário é obrigatório'),
    telefone: z
      .string()
      .nonempty('Telefone é obrigatório')
      .regex(/^\d{11}$/, 'Deve conter apenas 11 caracteres numéricos'),
    email: z
      .string()
      .email('Endereço de email inválido')
      .nonempty('Email é obrigatório'),
    senha: z
      .string()
      .min(8, 'Senha deve conter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
      .nonempty('Senha é obrigatória'),
    senhaRepetida: z.string().nonempty('Repetição da senha é obrigatória'),
  })
  .refine(campos => campos.senha === campos.senhaRepetida, {
    message: 'As senhas não coincidem',
    path: ['senhaRepetida'],
  });

type TFormRegistroSchema = z.infer<typeof registroSchema>;

const perfilSchema = z.object({
  nome: z.string().nonempty(mensagemCampoVazio),
  email: z
    .string()
    .nonempty(mensagemCampoVazio)
    .email('Endereço de e-mail inválido'),
  telefone: z
    .string()
    .nonempty(mensagemCampoVazio)
    .regex(/^\d{11}$/, 'Número de telefone inválido'),
  nomeUsuario: z.string().nonempty(mensagemCampoVazio),
});
type TFormPerfilSchema = z.infer<typeof perfilSchema>;

export { registroSchema, perfilSchema };
export type { TFormRegistroSchema, TFormPerfilSchema };
