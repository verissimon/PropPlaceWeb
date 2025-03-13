import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/api';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Campo } from '@/components/Campo';
import { Imovel } from '@/components/Imovel';
import { Modal } from '@/components/Modal';
import { SeletorImagem } from '@/components/SeletorImagem';
import { Separador } from '@/components/Separador';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ImovelEnderecado } from '@/models/Imovel';
import { UsuarioPerfil } from '@/models/Usuario';
import { icones } from '@/utils/Icones';
import { perfilSchema, TFormPerfilSchema } from '@/utils/validationSchemas';
import { construirModeloUsuarioPerfil } from '@/utils/constroiModelos';

function Perfil() {
  const [usuario, definirUsuario] = useState<UsuarioPerfil>();
  const [imoveis, definirImoveis] = useState<ImovelEnderecado[]>([]);
  const [imagem, definirImagem] = useState<File>();
  const [urlImagem, definirUrlImagem] = useState('');
  const [editar, definirEditar] = useState(false);
  const [modal, definirModal] = useState('');

  const navegar = useNavigate();
  const { id: idPerfil } = useParams();
  const usuarioLogado = useAuthContext();
  const idUsuarioLogado = usuarioLogado.userId;
  const eTitular = idPerfil === idUsuarioLogado;

  const {
    register: registrador,
    handleSubmit: aoEnviar,
    formState: { errors: erros, isSubmitting: estaEnviando },
    reset: resetar,
  } = useForm<TFormPerfilSchema>({
    resolver: zodResolver(perfilSchema),
    defaultValues: useMemo(
      () => ({
        nome: usuario?.nome,
        email: usuario?.email,
        telefone: usuario?.telefone,
        nomeUsuario: usuario?.username,
      }),
      [usuario]
    ),
  });

  useEffect(() => {
    (async () => {
      if (!idPerfil) return;

      const resposta = await construirModeloUsuarioPerfil(idPerfil);
      if (!resposta?.id) navegar('/404');

      definirUsuario(resposta || undefined);
      definirImoveis(resposta?.imoveis || []);
      resetar({ ...resposta, nomeUsuario: resposta?.username });
    })();
  }, [resetar, idPerfil, navegar]);

  useEffect(() => {
    if (imagem) definirUrlImagem(URL.createObjectURL(imagem));
  }, [imagem]);

  async function enviarImagem() {
    const dados = new FormData();
    dados.append('imagem', imagem!);
    const configuracao = {
      headers: {
        'content-type': 'multipart/form-data',
        user_id: usuarioLogado.username,
      },
    };

    await api.put('/imagem/user', dados, configuracao).catch(erro => {
      definirUrlImagem('');
      definirModal(erro.message || erro);
    });
  }

  async function enviar(formulario: TFormPerfilSchema) {
    const token = localStorage.getItem('auth.token');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    if (urlImagem) await enviarImagem();

    const dados = { ...formulario, username: formulario.nomeUsuario };
    await api
      .put('/users/' + idUsuarioLogado, dados)
      .then(() => {
        const usuarioAtualizado = {
          ...usuario,
          ...dados,
          imagem: { nomeImagem: urlImagem || usuario?.imagem.nomeImagem },
        } as UsuarioPerfil;
        definirUsuario(usuarioAtualizado);
        resetar(usuarioAtualizado);
        definirUrlImagem('');
        definirEditar(false);
      })
      .catch(erro => {
        definirModal(erro.message || erro);
      });
  }

  function cancelar() {
    resetar({ ...usuario, nomeUsuario: usuario?.username });
    definirUrlImagem('');
    definirEditar(false);
  }

  return (
    <>
      <Cabecalho />

      <div className="flex flex-col items-center gap-10 w-full px-6 pt-[112px] pb-10 md:px-20 md:pt-32 md:pb-20">
        <div className="flex flex-row justify-center items-center gap-10 overflow-hidden">
          <div className="relative flex-shrink-0">
            <img
              src={
                urlImagem || usuario?.imagem?.nomeImagem || icones.usuarioPadrao
              }
              alt="Foto de NOME DA PESSOA"
              className="border border-paleta-secundaria rounded-full w-20 aspect-square md:w-[120px]"
            />
            {editar && (
              <>
                <img
                  src={icones.alterarFoto}
                  alt="Alterar foto"
                  className="absolute top-0 left-0 rounded-full w-20 aspect-square md:w-[120px]"
                />
                <SeletorImagem aoMudar={definirImagem} />
              </>
            )}
          </div>
          {!editar && (
            <span className="text-t28 text-paleta-secundaria font-semibold truncate md:text-t40">
              {usuario?.nome}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6 w-full md:gap-8">
          <Separador texto="Informações pessoais">
            {!editar && eTitular && (
              <Separador.Texto aoApertar={() => definirEditar(true)}>
                Editar
              </Separador.Texto>
            )}
          </Separador>

          <form className="flex flex-col gap-10" onSubmit={aoEnviar(enviar)}>
            <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:gap-8">
              <Campo
                titulo="Nome completo"
                ativo={editar}
                register={registrador('nome')}
                feedback={erros.nome}
              />

              <Campo
                titulo="E-mail"
                ativo={editar}
                register={registrador('email')}
                feedback={erros.email}
              />

              <Campo
                titulo="Número para contato"
                ativo={editar}
                register={registrador('telefone')}
                feedback={erros.telefone}
              />

              {eTitular && (
                <Campo
                  titulo="Nome de usuário"
                  ativo={editar}
                  register={registrador('nomeUsuario')}
                  feedback={erros.nomeUsuario}
                />
              )}
            </div>

            {editar && (
              <div className="flex flex-row justify-center gap-6 w-full md:gap-10">
                <Botao
                  className="grow max-w-sm"
                  variante="cancelar"
                  onClick={cancelar}
                >
                  <Botao.Titulo>Cancelar</Botao.Titulo>
                </Botao>

                <Botao
                  className="grow max-w-sm"
                  variante="enviar"
                  isLoading={estaEnviando}
                  type="submit"
                >
                  <Botao.Titulo>Salvar</Botao.Titulo>
                </Botao>
              </div>
            )}
          </form>
        </div>

        {!editar && (
          <div className="flex flex-col gap-6 w-full md:gap-8">
            <Separador texto="Imóveis">
              {eTitular && (
                <Separador.Texto aoApertar={() => navegar('/imovel/editar')}>
                  Adicionar
                </Separador.Texto>
              )}
            </Separador>

            <div className="grid grid-cols-1 gap-6 w-full lg:grid-cols-2 md:gap-8">
              {imoveis.map((imovel, indice) => {
                const imagemImovel =
                  imovel.imagens.length > 0
                    ? imovel.imagens[0].nomeImagem
                    : icones.imovelPadrao;

                return (
                  <Imovel
                    key={indice}
                    id={imovel.id}
                    imagem={imagemImovel}
                    nome={imovel.nome}
                    endereco={imovel.endereco}
                    preco={imovel.preco}
                    disponivel={imovel.disponivel}
                  />
                );
              })}
            </div>
          </div>
        )}

        {modal && (
          <Modal
            titulo="Erro ao salvar"
            subtitulo={`Descrição do erro:\n ${modal}`}
            onClose={() => definirModal('')}
            visible={!!modal}
          />
        )}
      </div>
    </>
  );
}

export { Perfil };
