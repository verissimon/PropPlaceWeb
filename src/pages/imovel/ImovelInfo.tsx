/* eslint-disable react-hooks/exhaustive-deps */
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Separador } from '@/components/Separador';
import { Usuario } from '@/components/Usuario';
import { Mapa } from '@/components/Mapa';
import { Modal } from '@/components/Modal';
import { useContext, useEffect, useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Imagem } from '@/models/Imagem';
import { useNavigate, useParams } from 'react-router';
import { DadosContext } from '@/context/dadosContext';
import { ImovelEnderecado } from '@/models/Imovel';
import { UsuarioDTO } from '@/models/Usuario';

function ImovelInfo() {
  const navegar = useNavigate();

  const { id } = useParams();
  const { userId } = useAuthContext();
  const [usuario, setUsuario] = useState<UsuarioDTO | undefined>(undefined);
  const {
    todosImoveis,
    carregandoImoveis,
    excluirImovel,
    carregandoUsuarios,
    todosUsuarios,
  } = useContext(DadosContext);
  const [dono, setDono] = useState<boolean>(false);
  const [donoImovel, setDonoImovel] = useState<UsuarioDTO | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [imovel, setImovel] = useState<ImovelEnderecado>();
  const [imagens, defineImagens] = useState<Imagem[]>([]);
  const [modal, setModal] = useState(false);
  const [falhaModal, setFalhaModal] = useState(false);
  const [imagemMaior, setImagemMaior] = useState<string>('');

  function defineImovel() {
    setLoading(carregandoImoveis);
    setImovel(todosImoveis.find(imovel => imovel.id === id));
  }

  function defineUsuario() {
    setLoading(carregandoUsuarios);
    setUsuario(todosUsuarios.find(usuario => usuario.id === userId));
    setDono(
      usuario?.imoveis.map(imovelUser => imovelUser.id === imovel?.id)
        ? true
        : false
    );
    setDonoImovel(
      todosUsuarios.find(user =>
        user.imoveis.find(imovelUser => imovelUser.id === id)
      )
    );
  }

  async function excluiImovel(id: string) {
    setLoading(true);
    try {
      await excluirImovel(id);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao excluir imóvel: ', error);
      setFalhaModal(true);
      setLoading(false);
    }
  }

  function listaImagem() {
    if (imovel) {
      const novasImagens = imovel.imagens.map(
        (imagem: { nomeImagem: string }) => ({
          nomeImagem: imagem.nomeImagem,
        })
      );
      defineImagens(novasImagens);

      if (novasImagens.length > 0) {
        setImagemMaior(novasImagens[0].nomeImagem);
      }
    }
  }

  useEffect(() => {
    defineImovel();
    defineUsuario();
  }, [carregandoImoveis, carregandoUsuarios, todosUsuarios, todosImoveis, id]);

  useEffect(() => {
    if (usuario && imovel) {
      setDono(usuario?.imoveis.some(imovelUser => imovelUser.id === imovel.id));
    }
  }, [usuario, imovel]);

  useEffect(() => {
    listaImagem();
  }, [imovel]);

  if (loading || !imovel || !usuario || !donoImovel) {
    return (
      <div className="text-t20 text-paleta-secundaria col-span-full text-center">
        Carregando imóvel...
      </div>
    );
  }

  const atualizarImagemMaior = (imagem: string) => {
    setImagemMaior(imagem);
  };

  return (
    <>
      <Cabecalho></Cabecalho>
      <div className="pt-32 w-[95%] grid justify-self-center">
        <span className="justify-self-end">
          <Usuario
            id={donoImovel.id}
            nome={donoImovel.nome}
            ocupacao="Proprietário"
            reverso
          />
        </span>
      </div>

      <div className="w-[80%] my-8 justify-self-center items-center flex flex-col gap-14 md:flex-col lg:flex-row">
        {imovel.imagens.length === 0 ? (
          <div
            className="text-t20
           text-paleta-secundaria col-span-full
           text-center py-20"
          >
            Este imóvel não possui fotos no momento.
          </div>
        ) : (
          <img
            className="w-[400px] cursor-pointer aspect-square flex-shrink-0 border rounded-md border-paleta-secundaria"
            src={imagemMaior}
          />
        )}

        <div className="flex flex-row flex-wrap items-center justify-center content-center gap-6">
          {imagens.map((imagem, indice) => (
            <img
              key={indice}
              className="w-28 cursor-pointer aspect-square
            border border-paleta-secundaria rounded-md"
              src={imagem.nomeImagem}
              onClick={() => atualizarImagemMaior(imagem.nomeImagem)}
            />
          ))}
        </div>
      </div>

      <div
        className="w-[90%] flex flex-col gap-10 justify-self-center 
            text-paleta-secundaria p-0 m-0 pb-10 md:flex-row"
      >
        <div className="text-t30 shrink grow">
          <div>
            <p className="text-t40 font-extrabold">{imovel.nome}</p>
            <p className="text-t36 font-medium">{imovel.endereco}</p>
            <Separador texto={''}></Separador>
          </div>

          <div className="flex justify-between items-center my-4 md:flex-col lg:flex-row">
            <p className="text-t40">
              {imovel.preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
            <p className="h-fit">Max. pessoas: {imovel.numInquilinos}</p>
          </div>

          <p>{imovel.descricao}</p>
        </div>

        <div className="min-w-80 grow flex flex-col gap-10 min-h-0">
          <div className="w-full flex-1 relative min-h-[300px]">
            <div className="absolute inset-0">
              <Mapa />
            </div>
            <a
              className="absolute bottom-4 left-4
             text-paleta-secundaria underline decoration-paleta-secundaria
             hover:text-paleta-secundaria hover:no-underline hover:cursor-pointer"
              onClick={() => navegar('/mapa')}
            >
              Ver no mapa
            </a>
          </div>

          {dono ? (
            <></>
          ) : (
            <Botao
              className="w-full justify-center
                        h-fit hover:border-0 hover:shadow-inner"
              variante="enviar"
              onClick={() => navegar('/imovel/alugar')}
            >
              <Botao.Titulo>Alugar</Botao.Titulo>
            </Botao>
          )}
        </div>
      </div>

      {dono ? (
        <div className="w-[95%] flex justify-around gap-2 pb-10">
          <Botao
            className="w-2/5 justify-center
                    hover:border-0 hover:shadow-inner"
            variante="generico"
            onClick={() => navegar('/imovel/editar')}
          >
            <Botao.Titulo>Editar</Botao.Titulo>
          </Botao>

          <Botao
            className="w-2/5 justify-center
                    hover:border-0 hover:shadow-inner"
            variante="cancelar"
            onClick={() => setModal(true)}
          >
            <Botao.Titulo>Deletar</Botao.Titulo>
          </Botao>
        </div>
      ) : (
        <></>
      )}

      <Modal
        visible={modal}
        onClose={() => {
          setModal(false);
        }}
        titulo="Deseja deletar o imóvel?"
      >
        <div className="flex gap-6 justify-around">
          <Botao
            className="justify-center border-0
                        h-fit hover:shadow-inner"
            variante="enviar"
            onClick={() => {
              excluiImovel(imovel.id);
              navegar(-1);
            }}
          >
            <Botao.Titulo>Sim</Botao.Titulo>
          </Botao>

          <Botao
            className="justify-center border-0
                        h-fit hover:shadow-inner"
            variante="cancelar"
            onClick={() => setModal(false)}
          >
            <Botao.Titulo>Não</Botao.Titulo>
          </Botao>
        </div>
      </Modal>

      <Modal
        visible={falhaModal}
        onClose={() => {
          setFalhaModal(false);
          navegar('/imovel/' + imovel.id);
        }}
        titulo="Não foi possível deletar o imóvel."
      />
    </>
  );
}

export { ImovelInfo };
