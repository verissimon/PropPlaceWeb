import { z } from 'zod';

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

const loginSchema = z.object({
  login: z.union([
    z.string().email('Endereço de e-mail ou nome de usuário inválido'),
    z.string().nonempty('Nome de usuário ou endereço de e-mail é obrigatório'),
  ]),
  senha: z.string().nonempty('Senha é obrigatória'),
});

type TFormLoginSchema = z.infer<typeof loginSchema>;

type TFormRegistroSchema = z.infer<typeof registroSchema>;

export { registroSchema, loginSchema };
export type { TFormRegistroSchema, TFormLoginSchema };
