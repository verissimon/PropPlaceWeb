import { z } from 'zod';

const registroSchema = z
  .object({
    nome: z.string().nonempty('Nome é obrigatório'),
    username: z.string().nonempty('Nome de usuário é obrigatório'),
    telefone: z.string().nonempty('Telefone é obrigatório'),
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
  })
  .refine(campos => campos.telefone.match(/\d+/g)?.join('').length === 11, {
    message: 'Número de telefone inválido',
  });

type TFormRegistroSchema = z.infer<typeof registroSchema>;

export { registroSchema };
export type { TFormRegistroSchema };
