import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Separador } from '@/components/Separador';
import { Usuario } from '@/components/Usuario';
import imovelPadrao from '@/assets/imovelPadrao.svg';
import { Mapa } from '@/components/Mapa';
import { Modal } from '@/components/Modal';
import { useState } from 'react';

function ImovelInfo() {
  const [modal, setModal] = useState(false);

  const dono = {
    id: '1',
  };
  const imovel = {
    id: '2',
    imagem: imovelPadrao,
    nome: 'apt',
    endereco: 'rua',
    preco: 100.0,
    max: 4,
    descricao:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam ut aliquid suscipit non quibusdam dolorem iure eligendi magni beatae.',
  };

  return (
    <>
      <Cabecalho></Cabecalho>
      <div className="pt-32 w-[95%] grid justify-self-center">
        <span className="justify-self-end">
          <Usuario id={''} nome={'Mari'} reverso />
        </span>
      </div>

      <div className="w-[80%] my-8 justify-self-center items-center flex flex-col gap-14 md:flex-col lg:flex-row">
        <img
          className="w-[400px] aspect-square flex-shrink-0 border rounded-md border-paleta-secundaria"
          src={imovel.imagem}
        />
        <div className="flex flex-row flex-wrap items-center justify-center content-center gap-6">
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
          <img
            className="w-28 aspect-square border border-paleta-secundaria rounded-md"
            src={imovel.imagem}
          />
        </div>
      </div>

      <div
        className="w-[90%] flex flex-col gap-10 justify-self-center 
            text-paleta-secundaria p-0 m-0 pb-10 md:flex-row"
      >
        <div className="text-t30 shrink grow-2">
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
            <p className="h-fit">Max. pessoas: {imovel.max}</p>
          </div>

          <p>{imovel.descricao}</p>
        </div>

        <div className="min-w-80 grow-6 flex flex-col gap-10 min-h-0">
          <div className="w-full flex-1 relative min-h-[300px]">
            <div className="absolute inset-0">
              <Mapa />
            </div>
            <a className="absolute bottom-4 left-4 text-paleta-secundaria underline decoration-paleta-secundaria hover:text-paleta-secundaria hover:no-underline hover:cursor-pointer">
              Ver no mapa
            </a>
          </div>

          {dono.id !== imovel.id ? (
            <Botao
              className="w-full justify-center
                        h-fit hover:border-0 hover:shadow-inner"
              variante="enviar"
            >
              <Botao.Titulo>Alugar</Botao.Titulo>
            </Botao>
          ) : (
            <></>
          )}
        </div>
      </div>

      {dono.id !== imovel.id ? (
        <></>
      ) : (
        <div className="w-[95%] flex justify-around gap-2 pb-10">
          <Botao
            className="w-2/5 justify-center
                      hover:border-0 hover:shadow-inner"
            variante="generico"
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
          >
            Sim
          </Botao>

          <Botao
            className="justify-center border-0
                        h-fit hover:shadow-inner"
            variante="cancelar"
            onClick={() => setModal(false)}
          >
            Não
          </Botao>
        </div>
      </Modal>
    </>
  );
}

export { ImovelInfo };
