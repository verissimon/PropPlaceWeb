import { api } from '@/api';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Modal } from '@/components/Modal';
import { AxiosErrorResponse } from '@/utils/axiosErrorResponseType';
import { CampoIcones } from '@/utils/Icones';
import { registroSchema, TFormRegistroSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

function Registro() {
  const navegar = useNavigate();
  const [modalAberto, defineModalAberto] = useState(false);
  const [mensagem, defineMensagem] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormRegistroSchema>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nome: '',
      username: '',
      telefone: '',
      email: '',
      senha: '',
      senhaRepetida: '',
    },
  });

  const enviar = async ({
    nome,
    username,
    senha,
    telefone,
    email,
  }: TFormRegistroSchema) => {
    try {
      await api.post('/users', {
        nome,
        username,
        senha,
        telefone,
        email,
      });

      defineMensagem('Registro realizado com sucesso');

      reset();
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;
      console.error('Erro ao registrar');
      defineMensagem(
        `Falha ao processar registro: ${axiosError.response.data.message}`
      );
    } finally {
      defineModalAberto(true);
    }
  };
  function handleFechamentoModal() {
    if (mensagem && mensagem.includes('Falha')) {
      defineModalAberto(false);
      return;
    }
    if (mensagem && mensagem.includes('Registro realizado com sucesso')) {
      defineModalAberto(false);
      reset();
      navegar('/login');
    }
  }
  return (
    <div className="flex-1 justify-center items-center md:p-8 md:max-w-2xl gap-4 bg-paleta-fundo max-w-xl mx-auto p-6 my-4 rounded-lg shadow-md">
      <h2 className="text-paleta-secundaria text-xl md:text-2xl font-bold mb-6 text-center">
        Registre-se
      </h2>

      <form onSubmit={handleSubmit(enviar)} className="space-y-4 w-full">
        <Campo
          titulo="Nome completo"
          icone={CampoIcones.PESSOA}
          feedback={errors.nome}
          register={register('nome')}
        />
        <Campo
          titulo="Nome de usuário"
          icone={CampoIcones.PESSOA}
          feedback={errors.username}
          register={register('username')}
        />
        <Campo
          titulo="Telefone"
          icone={CampoIcones.TELEFONE}
          feedback={errors.telefone}
          register={register('telefone')}
          placeholder="(99) 99999-9999"
        />
        <Campo
          titulo="E-mail"
          type="email"
          icone={CampoIcones.EMAIL}
          feedback={errors.email}
          register={register('email')}
        />
        <Campo
          titulo="Senha"
          type="password"
          icone={CampoIcones.CADEADO}
          feedback={errors.senha}
          register={register('senha')}
        />
        <Campo
          titulo="Confirmar senha"
          type="password"
          icone={CampoIcones.CADEADO}
          feedback={errors.senhaRepetida}
          register={register('senhaRepetida')}
        />
        <div className="w-full flex justify-center">
          <Botao variante="enviar" type="submit" isLoading={isSubmitting}>
            <Botao.Titulo>Enviar</Botao.Titulo>
          </Botao>
        </div>
      </form>
      <div className="flex flex-row items-center pt-2 mt-2 justify-center gap-2">
        <p className="text-sm md:text-base text-paleta-secundaria">
          Já tem registro?
        </p>
        <Link to="/login" className="text-sm md:text-base text-blue-700">
          Faça log-in
        </Link>
      </div>
      <Modal
        titulo={mensagem}
        onClose={handleFechamentoModal}
        visible={modalAberto}
      />
    </div>
  );
}

export { Registro };
