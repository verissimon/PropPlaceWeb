import { useState } from 'react';

import { Botao } from '@/components/Botao';
import { Campo, CampoIcones } from '@/components/Campo';
import { Modal } from '@/components/Modal';
import Loading from '@/components/Loading';

import { useAuthContext } from '@/hooks/useAuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TFormLoginSchema } from '@/utils/validationSchemas';
import { AxiosErrorResponse } from '@/utils/axiosErrorResponseType';
import { Link, useNavigate } from 'react-router';

function Login() {
  const navegar = useNavigate();
  const { logar, isLoading } = useAuthContext();
  const [modalAberto, defineModalAberto] = useState(false);
  const [mensagem, defineMensagem] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      senha: '',
    },
  });

  const enviar = async (data: TFormLoginSchema) => {
    try {
      await logar(data.login, data.senha);

      defineMensagem(`Bem vindo, ${data.login}!`);

      reset();
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;

      defineMensagem(`Falha ao logar: ${axiosError.response.data.message}`);
    } finally {
      defineModalAberto(true);
    }
  };

  function handleFechamentoModal() {
    if (mensagem && mensagem.includes('Falha')) {
      defineModalAberto(false);
      return;
    }
    if (mensagem && mensagem.includes('Bem vindo')) {
      defineModalAberto(false);
      reset();
      navegar('/');
    }
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex-1 justify-center items-center md:p-8 gap-4 bg-paleta-fundo max-w-xl md:max-w-2xl mx-auto p-6 rounded-lg shadow-md">
          <h2 className="text-paleta-secundaria text-xl md:text-2xl font-bold mb-6 text-center">
            Bem vindo.
            <br />
            Faça log-in para acessar sua conta
          </h2>
          <form onSubmit={handleSubmit(enviar)} className="space-y-4 w-full">
            <Campo
              titulo="Nome de usuário ou e-mail"
              icone={CampoIcones.PESSOA}
              feedback={errors.login}
              register={register('login')}
            />
            <Campo
              titulo="Senha"
              type="password"
              icone={CampoIcones.CADEADO}
              feedback={errors.senha}
              register={register('senha')}
            />
            <div className="w-full flex justify-center">
              <Botao variante="enviar" type="submit" isLoading={isSubmitting}>
                <Botao.Titulo>Entrar</Botao.Titulo>
              </Botao>
            </div>
          </form>
          <div className="flex flex-row items-center pt-2 mt-2 justify-center gap-2">
            <p className="text-sm md:text-base text-paleta-secundaria">
              Novo usuário?
            </p>
            <Link to="/registro" className="text-sm md:text-base text-blue-700">
              Registre-se
            </Link>
          </div>
          <Modal
            titulo={mensagem}
            onClose={handleFechamentoModal}
            visible={modalAberto}
          ></Modal>
        </div>
      )}
    </>
  );
}

export { Login };
