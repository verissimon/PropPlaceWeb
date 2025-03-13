import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IMAGE_API_URL } from '@/api';
import { Cabecalho } from '@/components/Cabecalho';
import { Imovel } from '@/components/Imovel';
import { Separador } from '@/components/Separador';
import { Usuario } from '@/components/Usuario';
import { ImovelEnderecado } from '@/models/Imovel';
import { UsuarioDTO } from '@/models/Usuario';
import { icones } from '@/utils/Icones';
import { Mapa } from '@/components/Mapa';

function App() {
  const [imoveis, definirImoveis] = useState<ImovelEnderecado[]>();
  const [proprietarios, definirProprietarios] = useState<UsuarioDTO[]>();
  const [informacoes, definirInformacoes] = useState<{
    [key: string]: string;
  }>();
  const navegar = useNavigate();

  useState(() => {
    const imoveisMock = [
      {
        id: '1',
        descricao: '',
        disponivel: true,
        endereco: 'Cajazeiras - PB',
        imagens: [],
        latitude: 0,
        longitude: 0,
        nome: 'a',
        numInquilinos: 1,
        preco: 1,
        tipo: 'Casa',
        userId: '1',
      },
      {
        id: '2',
        descricao: '',
        disponivel: true,
        endereco: 'Cajazeiras - PB',
        imagens: [],
        latitude: 0,
        longitude: 0,
        nome: 'b',
        numInquilinos: 1,
        preco: 1,
        tipo: 'Casa',
        userId: '1',
      },
      {
        id: '3',
        descricao: '',
        disponivel: true,
        endereco: 'Cajazeiras - PB',
        imagens: [],
        latitude: 0,
        longitude: 0,
        nome: 'c',
        numInquilinos: 1,
        preco: 1,
        tipo: 'Casa',
        userId: '1',
      },
      {
        id: '4',
        descricao: '',
        disponivel: true,
        endereco: 'Cajazeiras - PB',
        imagens: [],
        latitude: 0,
        longitude: 0,
        nome: 'd',
        numInquilinos: 1,
        preco: 1,
        tipo: 'Casa',
        userId: '1',
      },
    ];
    definirImoveis(imoveisMock);

    const proprietariosMock = [
      {
        id: '1',
        email: '',
        imagem: { nomeImagem: '' },
        imoveis: [],
        nome: 'a',
        telefone: '',
        username: '',
      },
      {
        id: '2',
        email: '',
        imagem: { nomeImagem: '' },
        imoveis: [],
        nome: 'b',
        telefone: '',
        username: '',
      },
      {
        id: '3',
        email: '',
        imagem: { nomeImagem: '' },
        imoveis: [],
        nome: 'c',
        telefone: '',
        username: '',
      },
    ];
    definirProprietarios(proprietariosMock);

    const informacoesMock = {
      imoveis: '9',
      ocupacao: '66,6',
      imoveisDisponiveis: '4',
      menorValorDisponiveis: '100',
      mediaValorDisponiveis: '200',
      maiorValorDisponiveis: '300',
      imoveisAlugados: '6',
      menorValorAlugados: '150',
      mediaValorAlugados: '300',
      maiorValorAlugados: '450',
    };
    definirInformacoes(informacoesMock);
  });

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
                      <span>R$ {informacoes.menorValorDisponiveis}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Média de valores:</span>
                      <span>R$ {informacoes.mediaValorDisponiveis}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Maior valor</span>
                      <span>R$ {informacoes.maiorValorDisponiveis}</span>
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
                      <span>R$ {informacoes.menorValorAlugados}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Média de valores:</span>
                      <span>R$ {informacoes.mediaValorAlugados}</span>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full gap-2">
                      <span>Maior valor</span>
                      <span>R$ {informacoes.maiorValorAlugados}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-md w-full h-[400px] overflow-hidden">
          <Mapa />
        </div>
      </div>
    </>
  );
}

export default App;
