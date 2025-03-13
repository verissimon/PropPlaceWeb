/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMAGE_API_URL } from '@/api';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Campo, CampoIcones } from '@/components/Campo';
import { Imovel } from '@/components/Imovel';
import { Modal } from '@/components/Modal';
import { Selecao } from '@/components/Selecao';
import { Switch } from '@/components/switch/Switch';
import { Usuario } from '@/components/Usuario';
import { cores } from '@/constants/cores';
import { DadosContext } from '@/context/dadosContext';
import { UsuarioDTO } from '@/models/Usuario';
import { icones } from '@/utils/Icones';
import { useContext, useEffect, useState } from 'react';

function Pesquisa() {
  const valorPadraoUser = 'Inquilino';
  const valorPadraoImovel = 'Apartamento';

  const [pressed, setPressed] = useState<number>(0);
  const [modalImovel, defineModalImovel] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [opcaoUser, setOpcaoUser] = useState<string>(valorPadraoUser);
  const [opcaoImovel, setOpcaoImovel] = useState<string>(valorPadraoImovel);
  const [modalUser, defineModalUser] = useState(false);
  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const { todosImoveis, todosUsuarios, carregandoImoveis, carregandoUsuarios } =
    useContext(DadosContext);

  function listaImoveis() {
    setLoading(carregandoImoveis);
    if (check) {
      setImoveis(todosImoveis);
    } else {
      setImoveis(todosImoveis.filter(imovel => imovel.disponivel === true));
    }
  }

  async function listaUsuarios() {
    setLoading(carregandoUsuarios);
    setUsuarios(todosUsuarios);
    setLoading(carregandoUsuarios);
  }

  async function buscaImoveis(nome: string) {
    const imoveisResultado = todosImoveis.filter(({ nome: nomeImovel }) =>
      nomeImovel.toLowerCase().includes(nome.toLowerCase())
    );
    setImoveis(imoveisResultado);
  }

  async function buscaUsuarios(nome: string) {
    const usuariosResultado = todosUsuarios.filter(
      ({ username: nomeUsuario }) =>
        nomeUsuario.toLowerCase().includes(nome.toLowerCase())
    );
    setUsuarios(usuariosResultado);
  }

  async function buscaImoveisTipo(tipo: string) {
    try {
      setLoading(true);
      if (tipo === 'República') {
        tipo = 'republica';
      } else if (tipo === 'Estúdio') {
        tipo = 'estudio';
      } else {
        tipo = tipo.toLowerCase();
      }
      if (tipo === 'todos') {
        listaImoveis();
        return;
      }
      if (check) {
        const imoveisTipoResultado = todosImoveis.filter(
          ({ tipo: tipoImovel }) => tipo === tipoImovel
        );
        setImoveis(imoveisTipoResultado);
      } else {
        const imoveisDisp = todosImoveis.filter(
          imovel => imovel.disponivel === true
        );
        const imoveisTipoResultado = imoveisDisp.filter(
          ({ tipo: tipoImovel }) => tipo === tipoImovel
        );
        setImoveis(imoveisTipoResultado);
      }
    } catch (error) {
      console.error('Erro ao buscar imóveis por tipo: ', error);
    } finally {
      setLoading(false);
    }
  }

  async function buscaUserTipo(tipo: string) {
    try {
      setLoading(true);
      const usuariosLista = todosUsuarios;
      const usuariosList: any[] = [];
      if (usuariosLista) {
        if (tipo === 'Todos') {
          setUsuarios(usuariosLista);
          return;
        }
        usuariosLista.map((usuario: UsuarioDTO) => {
          if (tipo === 'Inquilino') {
            if (usuario.imoveis.length === 0) {
              usuariosList.push(usuario);
            }
          } else if (tipo === 'Proprietário') {
            if (usuario.imoveis.length > 0) {
              usuariosList.push(usuario);
            }
          }
        });
        setUsuarios(usuariosList);
      } else {
        console.error('Dados de usuários não encontrados');
      }
    } catch (error) {
      console.error('Não foi possível filtrar usuários por tipo: ', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listaImoveis();
  }, [carregandoImoveis]);

  useEffect(() => {
    if (pressed === 1) {
      setCheck(false);
      listaUsuarios();
    }
  }, [pressed]);

  useEffect(() => {
    if (pressed === 0) {
      listaImoveis();
    }
  }, [pressed, check]);

  useEffect(() => {
    if (pesquisa.length > 0) {
      if (pressed === 0) {
        buscaImoveis(pesquisa);
      } else {
        buscaUsuarios(pesquisa);
      }
    } else {
      if (pressed === 0) {
        listaImoveis();
      } else {
        listaUsuarios();
      }
    }
  }, [pesquisa, pressed]);

  const buttonStyle = (buttonId: number) => ({
    borderColor: pressed === buttonId ? cores.secundaria : cores.fundo,
  });

  const handleOpenModal = () => {
    if (pressed === 0) {
      defineModalImovel(true);
    } else {
      defineModalUser(true);
    }
  };

  const confirmarSelecao = () => {
    if (pressed === 0) {
      buscaImoveisTipo(opcaoImovel);
      defineModalImovel(false);
    } else {
      buscaUserTipo(opcaoUser);
      defineModalUser(false);
    }
  };

  function aoSelecionarOpcao(indice: number, opcoes: string[]) {
    const opcaoSelecionada = opcoes[indice];

    if (pressed === 0) {
      setOpcaoImovel(opcaoSelecionada);
    } else {
      setOpcaoUser(opcaoSelecionada);
    }
  }

  return (
    <>
      <Cabecalho></Cabecalho>

      <div className="w-[95%] pt-32 justify-self-center">
        <div className="flex">
          <Campo
            className="placeholder-paleta-secundaria w-full text-paleta-secundaria bg-paleta-fundo"
            placeholder="Pesquisar..."
            icone={CampoIcones.LUPA}
            onChange={text => setPesquisa(text.target.value)}
          />
          <div
            className="bg-paleta-fundo relative group
           w-16 h-14 p-0 border-0"
            onClick={handleOpenModal}
          >
            {pressed === 0 ? (
              <Modal
                titulo="Filtrar imóveis por tipo:"
                visible={modalImovel}
                onClose={() => {
                  defineModalImovel(false);
                }}
              >
                <div className="w-full">
                  <Selecao
                    opcoes={[
                      'Apartamento',
                      'Casa',
                      'Kitnet',
                      'Estúdio',
                      'República',
                      'Todos',
                    ]}
                    aoMudar={indice =>
                      aoSelecionarOpcao(indice, [
                        'Apartamento',
                        'Casa',
                        'Kitnet',
                        'Estúdio',
                        'República',
                        'Todos',
                      ])
                    }
                  />
                </div>

                <Botao variante="enviar" onClick={confirmarSelecao}>
                  <Botao.Titulo>Confirmar</Botao.Titulo>
                </Botao>
              </Modal>
            ) : (
              <Modal
                titulo="Filtrar usuários:"
                visible={modalUser}
                onClose={() => {
                  defineModalUser(false);
                }}
              >
                <div className="w-full">
                  <Selecao
                    opcoes={['Inquilino', 'Proprietário', 'Todos']}
                    aoMudar={indice =>
                      aoSelecionarOpcao(indice, [
                        'Inquilino',
                        'Proprietário',
                        'Todos',
                      ])
                    }
                  />
                </div>

                <Botao variante="enviar" onClick={confirmarSelecao}>
                  <Botao.Titulo>Confirmar</Botao.Titulo>
                </Botao>
              </Modal>
            )}

            <img
              className="-mt-1 cursor-pointer absolute inset-0 transition-opacity duration-200 opacity-100 group-hover:opacity-0"
              src={icones.filtro}
            ></img>
            <img
              className="-mt-1 cursor-pointer absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              src={icones.filtro2}
            ></img>
          </div>
        </div>

        <div className="flex justify-center gap-20">
          <button
            className="text-t16 border-0
          border-b-2 border-transparent rounded-none focus:outline-none
          hover:none hover:border-b-2 text-paleta-secundaria
          hover:border-paleta-secundaria bg-paleta-fundo md:text-t20"
            style={buttonStyle(0)}
            onClick={() => {
              setPressed(0);
              listaImoveis();
            }}
          >
            Imóveis
          </button>

          <button
            className="text-t16 border-0 border-b-2
           border-transparent rounded-none focus:outline-none
           hover:none hover:border-b-2 text-paleta-secundaria
           hover:border-paleta-secundaria bg-paleta-fundo md:text-t20"
            style={buttonStyle(1)}
            onClick={() => {
              setPressed(1);
              listaUsuarios();
            }}
          >
            Usuários
          </button>
        </div>

        {pressed === 0 ? (
          <>
            <div className="flex my-4 items-center">
              <Switch
                aoMudar={() => {
                  setCheck(!check);
                  listaImoveis();
                }}
              />
              <p className="h-fit mt-1 ml-4 text-t20 text-paleta-secundaria font-medium">
                Incluir imóveis indisponíveis
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:gap-8">
              {loading ? (
                <p className="text-t20 text-paleta-secundaria col-span-full text-center">
                  Carregando imóveis...
                </p>
              ) : imoveis.length === 0 ? (
                <p className="text-t20 text-paleta-secundaria col-span-full text-center">
                  Não há imóveis no momento
                </p>
              ) : (
                <>
                  {imoveis.map((imovel, index) => {
                    return (
                      <Imovel
                        key={index}
                        id={imovel.id}
                        imagem={
                          imovel.imagens[0]
                            ? `${imovel.imagens[0]?.nomeImagem}`
                            : icones.imovelPadrao
                        }
                        nome={imovel.nome}
                        endereco={imovel.endereco}
                        preco={imovel.preco}
                        disponivel={imovel.disponivel}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:gap-8 pt-4">
            {loading ? (
              <p className="text-t20 text-paleta-secundaria col-span-full text-center">
                Carregando usuários...
              </p>
            ) : usuarios.length === 0 ? (
              <p className="text-t20 text-paleta-secundaria col-span-full text-center">
                Não há usuários no momento
              </p>
            ) : (
              <>
                {usuarios.map(usuario => {
                  return (
                    <Usuario
                      key={usuario.id}
                      id={usuario.id}
                      nome={usuario.nome}
                      imagem={
                        usuario.imagem
                          ? `${IMAGE_API_URL}${usuario.imagem.nomeImagem}`
                          : icones.usuarioPadrao
                      }
                    />
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export { Pesquisa };
