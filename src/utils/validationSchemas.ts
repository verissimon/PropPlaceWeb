import { z } from 'zod';

const mensagemCampoVazio =
  'Essa informação é obrigatória e não pode estar vazia';

const campos = {
  nome: z.string().nonempty(mensagemCampoVazio),
  username: z.string().nonempty(mensagemCampoVazio),
  telefone: z
    .string()
    .nonempty(mensagemCampoVazio)
    .regex(/^\d{11}$/, 'Deve conter apenas 11 caracteres numéricos'),
  email: z
    .string()
    .email('Endereço de email inválido')
    .nonempty(mensagemCampoVazio),
  senha: z
    .string()
    .min(8, 'Senha deve conter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .nonempty(mensagemCampoVazio),
  senhaRepetida: z.string().nonempty('Repetição da senha é obrigatória'),
};

const registroSchema = z
  .object({ ...campos })
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

const perfilSchema = z.object({
  nome: campos.nome,
  email: campos.email,
  telefone: campos.telefone,
  nomeUsuario: campos.nome,
});

const esqueceuSenhaSchema = z.object({
  email: campos.email,
});

const trocaSenhaSchema = z
  .object({
    senha: campos.senha,
    senhaRepetida: campos.senhaRepetida,
  })
  .refine(campos => campos.senha === campos.senhaRepetida, {
    message: 'As senhas não coincidem',
    path: ['senhaRepetida'],
  });

const imovelSchema = z.object({
  nome: z.string().nonempty(mensagemCampoVazio),
  descricao: z.string().nonempty(mensagemCampoVazio),
  numInquilinos: z
    .number({ coerce: true, message: 'Insira apenas números' })
    .min(1, 'Número máximo de pessoas inválido'),
  preco: z
    .number({ coerce: true, message: 'Insira apenas números' })
    .min(1, 'Preço inválido'),
});

type TFormLoginSchema = z.infer<typeof loginSchema>;
type TFormRegistroSchema = z.infer<typeof registroSchema>;
type TFormPerfilSchema = z.infer<typeof perfilSchema>;
type TEsqueceuSenhaSchema = z.infer<typeof esqueceuSenhaSchema>;
type TTrocaSenhaSchema = z.infer<typeof trocaSenhaSchema>;
type TFormImovelSchema = z.infer<typeof imovelSchema>;

export {
  registroSchema,
  loginSchema,
  perfilSchema,
  esqueceuSenhaSchema,
  trocaSenhaSchema,
  imovelSchema
};

export type {
  TFormRegistroSchema,
  TFormLoginSchema,
  TFormPerfilSchema,
  TEsqueceuSenhaSchema,
  TTrocaSenhaSchema,
  TFormImovelSchema,
};
