/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cabecalho } from '@/components/Cabecalho';
import { Campo } from '@/components/Campo';
import {
  formAluguelSchema,
  TFormAluguelSchema,
} from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Botao } from '@/components/Botao';
import { Modal } from '@/components/Modal';
import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { DadosContext } from '@/context/dadosContext';

function AluguelImovel() {
  const { id } = useParams();
  const { todosUsuarios, todosImoveis, enviaEmail } = useContext(DadosContext);
  const [modal, setModal] = useState<boolean>(false);
  const [modalErro, setModalErro] = useState<boolean>(false);
  const [imovel, setImovel] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const navegar = useNavigate();

  async function encontraImovelEDono() {
    setLoading(true);
    setImovel(todosImoveis.find(imovel => imovel.id === id));
    setLoading(false);
  }

  const {
    register: registrador,
    handleSubmit,
    formState: { errors: erros, isSubmitting },
  } = useForm<TFormAluguelSchema>({
    resolver: zodResolver(formAluguelSchema),
  });

  async function enviarEmail(data: TFormAluguelSchema) {
    const destinatario = todosUsuarios.find(user =>
      user.imoveis.find(imovelUser => imovelUser.id === imovel.id)
    );
    if (destinatario) {
      const resposta = await enviaEmail(destinatario.email, data);
      if (resposta.error) {
        setModalErro(true);
      } else {
        setModal(true);
      }
    } else {
      setModalErro(true);
    }
  }

  useEffect(() => {
    if (id && todosImoveis.length > 0) {
      const imovelEncontrado = todosImoveis.find(imovel => imovel.id === id);
      encontraImovelEDono();
      if (imovelEncontrado) {
        setImovel(imovelEncontrado);
      }
    }
  }, [id, todosImoveis]);
  return (
    <>
      <Cabecalho />

      {loading ? (
        <p className="w-full flex justify-center text-t24 text-paleta-secundaria">
          Carregando...
        </p>
      ) : (
        <form
          className="w-[60%] pt-32 flex flex-col justify-self-center gap-6"
          onSubmit={handleSubmit(enviarEmail)}
        >
          <Campo
            titulo="Nome completo"
            placeholder="Jose da Silva"
            register={registrador('nome')}
            feedback={erros.nome}
          />

          <Campo
            titulo="Número para contato"
            placeholder="(00) 9 1234-5678"
            register={registrador('telefone')}
            feedback={erros.telefone}
          />

          <Campo
            titulo="Quantidade de pessoas"
            placeholder="1"
            register={registrador('numInquilinos')}
            feedback={erros.numInquilinos}
          />

          <p className="text-t24 text-paleta-secundaria font-bold pt-4">
            Tempo de contrato
          </p>

          <Campo
            titulo="Data inicial"
            placeholder="01/12/0000"
            register={registrador('dataInicioContrato')}
            feedback={erros.dataInicioContrato}
            type="date"
          />

          <Campo
            titulo="Data final"
            placeholder="01/12/0000"
            register={registrador('dataFinalContrato')}
            feedback={erros.dataFinalContrato}
            type="date"
          />

          <div className="w-full flex justify-around pb-10 pt-4">
            <Botao className="w-2/6" variante="cancelar">
              <Botao.Titulo>Cancelar</Botao.Titulo>
            </Botao>

            <Botao
              className="w-2/6"
              variante="enviar"
              type="submit"
              isLoading={isSubmitting}
              onClick={handleSubmit(enviarEmail)}
            >
              <Botao.Titulo>Enviar</Botao.Titulo>
            </Botao>
          </div>
        </form>
      )}

      <div>
        <Modal
          visible={modal}
          onClose={() => {
            {
              setModal(false);
            }
            navegar(-1);
          }}
          titulo="Solicitação enviada. O proprietário avaliará a solicitação e retornará o contato."
        />
      </div>
      <div>
        <Modal
          visible={modalErro}
          onClose={() => {
            {
              setModalErro(false);
            }
            navegar(-1);
          }}
          titulo="Não foi possível enviar a solicitação, tente novamente mais tarde."
        />
      </div>
    </>
  );
}

export { AluguelImovel };
