import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { api } from '@/api';
import { Botao } from '@/components/Botao';
import { Campo, CampoIcones } from '@/components/Campo';
import { Modal } from '@/components/Modal';
import {
  esqueceuSenhaSchema,
  TEsqueceuSenhaSchema,
} from '@/utils/validationSchemas';
import { AxiosErrorResponse } from '@/utils/axiosErrorResponseType';

function RecuperaSenha() {
  const [modalAberto, defineModalAberto] = useState(false);
  const [mensagem, defineMensagem] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEsqueceuSenhaSchema>({
    resolver: zodResolver(esqueceuSenhaSchema),
    defaultValues: {
      email: '',
    },
  });

  const enviar = async (data: TEsqueceuSenhaSchema) => {
    try {
      await api.post('/users/recuperaSenha', { email: data.email });

      defineMensagem(
        'Um link para redefinir sua senha foi enviado para seu e-mail.'
      );

      reset();
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;

      defineMensagem(
        `Falha ao enviar e-mail: ${axiosError.response.data.message}`
      );
    } finally {
      defineModalAberto(true);
    }
  };

  function handleFechamentoModal() {
    defineModalAberto(false);
  }

  return (
    <div className="flex-1 justify-center items-center md:p-8 gap-4 bg-paleta-fundo max-w-xl md:max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-paleta-secundaria text-xl md:text-2xl font-bold mb-6 text-center">
        Recupere seu acesso. Insira o email cadastrado
      </h2>
      <form onSubmit={handleSubmit(enviar)} className="space-y-4 w-full">
        <Campo
          labelFor="email"
          id="email"
          name="email"
          titulo="E-mail"
          type="email"
          icone={CampoIcones.EMAIL}
          feedback={errors.email}
          register={register('email')}
        />
        <div className="w-full flex justify-center">
          <Botao variante="enviar" type="submit" isLoading={isSubmitting}>
            <Botao.Titulo>Enviar</Botao.Titulo>
          </Botao>
        </div>
      </form>
      <div className="flex flex-row items-center pt-2 mt-2 justify-center gap-2">
        <p className="text-sm md:text-base text-paleta-secundaria">
          Lembrou sua senha?
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

export { RecuperaSenha };
