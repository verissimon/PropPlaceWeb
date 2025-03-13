import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router';
import { api } from '@/api';
import { Botao } from '@/components/Botao';
import { Campo, CampoIcones } from '@/components/Campo';
import { Modal } from '@/components/Modal';
import { trocaSenhaSchema, TTrocaSenhaSchema } from '@/utils/validationSchemas';
import { AxiosErrorResponse } from '@/utils/axiosErrorResponseType';

function NovaSenha() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [modalAberto, defineModalAberto] = useState(false);
  const [mensagem, defineMensagem] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TTrocaSenhaSchema>({
    resolver: zodResolver(trocaSenhaSchema),
    defaultValues: {
      senha: '',
      senhaRepetida: '',
    },
  });

  const enviar = async (data: TTrocaSenhaSchema) => {
    try {
      await api.post(`/users/resetSenha/${token}`, {
        senha: data.senha,
        senhaRepetida: data.senhaRepetida,
      });

      defineMensagem('Senha redefinida com sucesso. Prossiga com o login');

      reset();
    } catch (error) {
      const axiosError = error as AxiosErrorResponse;

      defineMensagem(
        `Falha ao redefinir senha: ${axiosError.response.data.message}`
      );
    } finally {
      defineModalAberto(true);
    }
  };

  function handleFechamentoModal() {
    defineModalAberto(false);
    navigate('/login');
  }

  return (
    <div className="flex-1 justify-center items-center md:p-8 gap-4 bg-paleta-fundo max-w-xl md:max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-paleta-secundaria text-xl md:text-2xl font-bold mb-6 text-center">
        Redefinir Senha
      </h2>
      <form onSubmit={handleSubmit(enviar)} className="space-y-4 w-full">
        <Campo
          labelFor="senha"
          id="senha"
          name="senha"
          titulo="Nova Senha"
          type="password"
          icone={CampoIcones.CADEADO}
          feedback={errors.senha}
          register={register('senha')}
        />
        <Campo
          labelFor="senhaRepetida"
          id="senhaRepetida"
          name="senhaRepetida"
          titulo="Confirmar Nova Senha"
          type="password"
          icone={CampoIcones.CADEADO}
          feedback={errors.senhaRepetida}
          register={register('senhaRepetida')}
        />
        <div className="w-full flex justify-center">
          <Botao variante="enviar" type="submit" isLoading={isSubmitting}>
            <Botao.Titulo>Redefinir</Botao.Titulo>
          </Botao>
        </div>
      </form>
      <Modal
        titulo={mensagem}
        onClose={handleFechamentoModal}
        visible={modalAberto}
      />
    </div>
  );
}

export { NovaSenha };
