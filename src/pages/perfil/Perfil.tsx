import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Imovel } from '@/components/Imovel';
import { SeletorImagem } from '@/components/SeletorImagem';
import { Separador } from '@/components/Separador';
import { ImovelDTO, ImovelEnderecado } from '@/models/Imovel';
import { UsuarioDTO } from '@/models/Usuario';
import { icones } from '@/utils/Icones';
import { perfilSchema, TFormPerfilSchema } from '@/utils/validationSchemas';

function Perfil() {
  const [usuario, definirUsuario] = useState<UsuarioDTO>();
  const [imoveis, definirImoveis] = useState<ImovelEnderecado[]>([]);
  const [imagem, definirImagem] = useState<string>();
  const [editar, definirEditar] = useState(false);

  const navegar = useNavigate();
  const { id: idPerfil } = useParams();
  // TODO: pegar id do usuário logado
  const idUsuario = '1';
  const eTitular = idPerfil === idUsuario;

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
      // TODO: adicionar requisição à API
      const respostaImoveis: ImovelDTO[] = [
        {
          descricao: '',
          disponivel: true,
          id: '1',
          imagens: [{ nomeImagem: icones.usuarioPadrao }],
          latitude: -6.9199,
          longitude: -68.5641,
          nome: 'Imóvel1',
          numInquilinos: 3,
          preco: 520,
          tipo: 'Casa',
          userId: '1',
        },
        {
          descricao: '',
          disponivel: false,
          id: '2',
          imagens: [{ nomeImagem: icones.alterarFoto }],
          latitude: -6.9189,
          longitude: -68.5651,
          nome: 'Imóvel2',
          numInquilinos: 4,
          preco: 620,
          tipo: 'Apartamento',
          userId: '1',
        },
        {
          descricao: '',
          disponivel: false,
          id: '3',
          imagens: [{ nomeImagem: icones.alterarFoto }],
          latitude: -6.9179,
          longitude: -68.5661,
          nome: 'Imóvel3',
          numInquilinos: 5,
          preco: 720,
          tipo: 'Kitnet',
          userId: '1',
        },
      ];
      const resposta: UsuarioDTO = {
        email: 'email@email.com',
        id: '1',
        imagem: { nomeImagem: icones.lupa },
        imoveis: respostaImoveis,
        nome: 'Pessoa',
        telefone: '99999999999',
        username: 'pessoa',
      };
      definirUsuario(resposta);
      resetar({ ...resposta, nomeUsuario: resposta.username });

      // TODO: adicionar requisição à API de mapa
      const imoveisEnderecados = respostaImoveis.map(imovel => ({
        ...imovel,
        endereco: 'Cajazeiras, PB',
      }));
      definirImoveis(imoveisEnderecados);
    })();
  }, [resetar, idPerfil]);

  async function enviar() {
    // TODO: adicionar requisição à API e atualizar usuário
    definirEditar(false);
  }

  function cancelar() {
    resetar({ ...usuario, nomeUsuario: usuario?.username });
    definirImagem('');
    definirEditar(false);
  }

  return (
    <div className="flex flex-col justify-center gap-10 w-full px-6 pt-8 pb-10 md:px-20 md:pb-20">
      <div className="flex flex-row justify-center items-center gap-10 overflow-hidden">
        <div className="relative flex-shrink-0">
          <img
            src={imagem || usuario?.imagem.nomeImagem || icones.usuarioPadrao}
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
            NOME DA PESSOA
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
              return (
                <Imovel
                  key={indice}
                  id={imovel.id}
                  imagem={imovel.imagens[0].nomeImagem}
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
    </div>
  );
}

export { Perfil };
