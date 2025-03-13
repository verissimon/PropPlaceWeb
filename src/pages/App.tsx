import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api, IMAGE_API_URL } from '@/api';
import { Cabecalho } from '@/components/Cabecalho';
import { Imovel } from '@/components/Imovel';
import { Mapa } from '@/components/Mapa';
import { Separador } from '@/components/Separador';
import { Usuario } from '@/components/Usuario';
import { useGeolocalizacao } from '@/hooks/useGeolocalizacao';
import { ImovelDTO, ImovelEnderecado } from '@/models/Imovel';
import { UsuarioDTO } from '@/models/Usuario';
import { calcularInformacoes, numerosAleatorios } from '@/utils/calculosHome';
import { organizaImoveis } from '@/utils/constroiModelos';
import { icones } from '@/utils/Icones';
import { useAuthContext } from '@/hooks/useAuthContext';

function App() {
  const [imoveis, definirImoveis] = useState<ImovelEnderecado[]>();
  const [proprietarios, definirProprietarios] = useState<UsuarioDTO[]>();
  const [informacoes, definirInformacoes] = useState<{
    [key: string]: string | number;
  }>();
  const navegar = useNavigate();
  const geolocalizacao = useGeolocalizacao();
  const { userId: userLogadoId } = useAuthContext();

  useEffect(() => {
    if (!userLogadoId) {
      navegar('/login');
    }
  }, [userLogadoId, navegar]);

  useEffect(() => {
    const latitude = geolocalizacao.latitude;
    const longitude = geolocalizacao.longitude;
    if (latitude === 0 && longitude === 0) return;

    (async () => {
      const token = localStorage.getItem('auth.token');
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const resposta = await api
        .get(`/imoveis/local/5?latitude=${latitude}&longitude=${longitude}`)
        .then(resposta => resposta.data as ImovelDTO[])
        .catch(() => []);

      await selecionarImoveis(resposta);
      await selecionarProprietarios(resposta);
      selecionarInformacoes(resposta);
    })();
  }, [geolocalizacao.latitude, geolocalizacao.longitude]);

  async function selecionarImoveis(imoveisDTO: ImovelDTO[]) {
    const imoveisSelecionados: ImovelDTO[] = [];
    const imoveisDisponiveis = imoveisDTO.filter(imovel => imovel.disponivel);
    const indices = numerosAleatorios(
      imoveisDisponiveis.length,
      Math.min(imoveisDisponiveis.length, 4)
    );
    indices.forEach(indice =>
      imoveisSelecionados.push(imoveisDisponiveis[indice])
    );

    const imoveisEnderecados = await organizaImoveis(imoveisSelecionados);

    definirImoveis(imoveisEnderecados);
  }

  async function selecionarProprietarios(imoveisDTO: ImovelDTO[]) {
    const token = localStorage.getItem('auth.token');
    const proprietariosSelecionados: UsuarioDTO[] = [];
    const idsProprietariosSelecionados: string[] = [];
    const idsProprietarios = [
      ...new Set(imoveisDTO.map(imovel => imovel.userId)),
    ];
    const indices = numerosAleatorios(
      idsProprietarios.length,
      Math.min(idsProprietarios.length, 4)
    );
    indices.forEach(indice =>
      idsProprietariosSelecionados.push(idsProprietarios[indice])
    );

    for (const id of idsProprietariosSelecionados) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      await api
        .get('/users/id/' + id)
        .then(resposta =>
          proprietariosSelecionados.push(resposta.data as UsuarioDTO)
        );
    }

    definirProprietarios(proprietariosSelecionados);
  }

  function selecionarInformacoes(imoveisDTO: ImovelDTO[]) {
    const informacoesSelecionadas = calcularInformacoes(imoveisDTO);
    definirInformacoes(informacoesSelecionadas);
  }

  return (
    <>
      <Cabecalho />

      <div className="flex flex-col items-center gap-10 w-full px-6 pt-[112px] pb-10 md:px-20 md:pt-32 md:pb-20">
        {imoveis && (
          <div className="flex flex-col items-center gap-6 w-full md:gap-10">
            <Separador texto="Próximo a você">
              <Separador.Texto aoApertar={() => navegar('/mapa')}>
                Ver no mapa
              </Separador.Texto>
            </Separador>

            <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:gap-8">
              {imoveis.map((imovel, indice) => {
                const imagem =
                  imovel.imagens.length > 0
                    ? imovel.imagens[0].nomeImagem
                    : icones.imovelPadrao;

                return (
                  <Imovel
                    key={indice}
                    id={imovel.id}
                    imagem={imagem}
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

        <div className="flex flex-col gap-10 w-full lg:flex-row">
          {proprietarios && (
            <div className="flex flex-col gap-6 w-full md:gap-10 lg:grow-2 lg:w-auto lg:min-w-[288px]">
              <Separador texto="Proprietários na sua região" />

              <div className="flex flex-col gap-6">
                {proprietarios.map((proprietario, indice) => {
                  const imagem = proprietario.imagem?.nomeImagem
                    ? IMAGE_API_URL + proprietario.imagem.nomeImagem
                    : undefined;

                  return (
                    <Usuario
                      key={indice}
                      id={proprietario.id}
                      nome={proprietario.nome}
                      imagem={imagem}
                      ocupacao="Proprietário"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {informacoes && (
            <div className="flex flex-col gap-6 w-full max-w-[1000px] md:gap-10 lg:grow">
              <Separador texto="Informações da região" />

              <div className="flex flex-col justify-center items-center gap-10 text-t20 text-paleta-secundaria">
                <div className="flex flex-col justify-center items-center gap-3 md:flex-row md:gap-10">
                  <span>Total de imóveis: {informacoes.imoveis}</span>
                  <span>Taxa de ocupacao: {informacoes.ocupacao}%</span>
                </div>

                <div className="flex flex-col justify-center items-center gap-10 w-full md:flex-row md:gap-20">
                  <div className="flex flex-col gap-6 w-full">
                    <span className="text-center font-semibold w-full">
                      IMÓVEIS DISPONÍVEIS
                    </span>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Quantidade:</span>
                      <span>{informacoes.imoveisDisponiveis}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Menor valor:</span>
                      <span>{informacoes.menorValorDisponiveis}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Média de valores:</span>
                      <span>{informacoes.mediaValorDisponiveis}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Maior valor</span>
                      <span>{informacoes.maiorValorDisponiveis}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 w-full">
                    <span className="text-center font-semibold w-full">
                      IMÓVEIS ALUGADOS
                    </span>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Quantidade:</span>
                      <span>{informacoes.imoveisAlugados}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Menor valor:</span>
                      <span>{informacoes.menorValorAlugados}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Média de valores:</span>
                      <span>{informacoes.mediaValorAlugados}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Maior valor</span>
                      <span>{informacoes.maiorValorAlugados}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-md w-full h-[400px] overflow-hidden">
          <Mapa realizarRequisicoes />
        </div>
      </div>
    </>
  );
}

export default App;
