import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Campo } from '@/components/Campo';
import { ListaSuspensa } from '@/components/ListaSuspensa';
import { Mapa } from '@/components/Mapa';
import { Modal } from '@/components/Modal';
import { SeletorImagem } from '@/components/SeletorImagem';
import { Separador } from '@/components/Separador';
import { Coordenadas, ImovelDTO, ImovelEnderecado } from '@/models/Imovel';
import { CampoIcones, icones } from '@/utils/Icones';
import { imovelSchema, TFormImovelSchema } from '@/utils/validationSchemas';
import { api } from '@/api';
import { geolocalizacao } from '@/utils/enderecamento';

const opcoesTipo = ['Apartamento', 'Casa', 'Estúdio', 'Kitnet', 'República'];
const opcoesDisponbilidade = ['Indisponível', 'Disponível'];
let temporizador = setTimeout(() => {}, 0);

interface LocalizacaoEstado {
  imovel?: ImovelEnderecado;
  coordenadas?: Coordenadas;
}

function EditarImovel() {
  const [imovel, definirImovel] = useState<ImovelDTO>();
  const [imagens, definirImagens] = useState<File[]>([]);
  const [urlImagens, definirUrlImagens] = useState<string[]>([]);
  const [tipo, definirTipo] = useState(0);
  const [disponibilidade, definirDisponibilidade] = useState(1);
  const [coordenadas, definirCoordenadas] = useState<Coordenadas>();
  const [endereco, definirEndereco] = useState('');
  const [marcarCentro, definirMarcarCentro] = useState(true);
  const [centroMapa, definirCentroMapa] = useState<Coordenadas>();
  const [modal, definirModal] = useState('');
  const navegar = useNavigate();
  const localizacao = useLocation();

  const {
    register: registrador,
    handleSubmit: aoEnviar,
    formState: { errors: erros, isSubmitting: estaEnviando },
    reset: resetar,
  } = useForm<TFormImovelSchema>({
    resolver: zodResolver(imovelSchema),
    defaultValues: useMemo(
      () => ({
        nome: imovel?.nome,
        descricao: imovel?.descricao,
        numInquilinos: imovel?.numInquilinos,
        preco: imovel?.preco,
      }),
      [imovel]
    ),
  });

  useEffect(() => {
    const estado = localizacao.state as LocalizacaoEstado;

    const imovelEstado = estado?.imovel;
    const coordenadasEstado = estado?.coordenadas;

    if (imovelEstado) {
      const coordenadasMapa = {
        latitude: imovelEstado.latitude,
        longitude: imovelEstado.longitude,
      };

      definirImovel(imovelEstado);
      definirUrlImagens(imovelEstado.imagens.map(imagem => imagem.nomeImagem));
      definirTipo(opcoesTipo.indexOf(imovelEstado.tipo) || 0);
      definirDisponibilidade(imovelEstado.disponivel ? 1 : 0);
      definirCoordenadas(coordenadasMapa);
      definirCentroMapa(coordenadasMapa);
      resetar(imovelEstado);
    } else {
      definirImovel(undefined);
      definirImagens([]);
      definirUrlImagens([]);
      definirTipo(0);
      definirDisponibilidade(1);
      definirCoordenadas(undefined);
      definirCentroMapa(undefined);
      resetar({});
    }

    if (coordenadasEstado) {
      definirCentroMapa(coordenadasEstado);
    }
  }, [localizacao.state, resetar]);

  useEffect(() => {
    const imagensImoveis =
      imovel?.imagens.map(imagemImovel => imagemImovel.nomeImagem) || [];
    const imagensAdicionadas = imagens.map(URL.createObjectURL);
    definirUrlImagens([...imagensImoveis, ...imagensAdicionadas]);
  }, [imagens, imovel?.imagens]);

  useEffect(() => {
    async function buscar() {
      const resultado = await geolocalizacao(endereco);
      if (resultado) {
        definirCentroMapa(resultado);
        definirMarcarCentro(false);
      }
    }

    clearTimeout(temporizador);
    temporizador = setTimeout(async () => {
      if (endereco) await buscar();
    }, 1000);
  }, [endereco]);

  function validarValores(): boolean {
    const temImagem = urlImagens.length > 0;
    const temCoordenadas = coordenadas !== undefined;
    let textoModal =
      'Por favor, verifique as informações inseridas no(s) seguinte(s) campo(s): ';

    if (!temImagem) {
      textoModal += `"imagens do imóvel" `;
    }
    if (!temCoordenadas) {
      textoModal += `"localização do imóvel"`;
    }

    if (!temImagem || !temCoordenadas) {
      definirModal(textoModal);
      return false;
    }
    return true;
  }

  function filtrarImagem(imagemRemovida: string) {
    // TODO: filtrar imagens salvas e adicionadas
    const indiceImagemremovida = urlImagens.indexOf(imagemRemovida);

    definirImagens(
      imagens.filter((_, indice) => indice !== indiceImagemremovida)
    );
  }

  async function atualizarImagens() {
    // TODO: adicoinar atualização de imagem na API
  }

  async function enviar(formulario: TFormImovelSchema) {
    if (!validarValores()) return;

    const token = localStorage.getItem('auth.token');
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    await atualizarImagens();

    try {
      const dados = {
        ...formulario,
        tipo: opcoesTipo[tipo],
        disponivel: !disponibilidade,
        latitude: coordenadas?.latitude,
        longitude: coordenadas?.longitude,
      };

      if (imovel?.id) {
        await api.put('/imoveis/' + imovel.id, dados);
        navegar('/imovel/' + imovel.id);
      } else {
        const idNovoImovel = await api
          .post('/imoveis', dados)
          .then(resposta => resposta.data.imovel.id);
        navegar('/imovel/' + idNovoImovel);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      definirModal(erro.message || erro);
    }
  }

  return (
    <>
      <Cabecalho />

      <form
        onSubmit={aoEnviar(enviar)}
        className="flex flex-col items-center gap-10 w-full px-6 pt-[112px] pb-10 md:px-20 md:pt-32 md:pb-20"
      >
        <div className="flex flex-col gap-6 w-full md:gap-8">
          <Separador texto="Imagens do imóvel" />

          <div className="flex flex-col items-center gap-6 w-full md:flex-row md:items-start md:gap-20">
            <div className="relative flex-shrink-0">
              <img
                src={icones.adicionarImagem}
                alt="Botão para adicionar imagem do imóvel"
                className="border border-paleta-secundaria w-40 aspect-square rounded-2xl md:w-[280px]"
              />
              <SeletorImagem
                aoMudar={novaImagem => definirImagens([...imagens, novaImagem])}
              />
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-x-10 gap-y-5 w-full md:justify-start">
              {urlImagens.map((imagem, indice) => (
                <div key={indice} className="relative flex-shrink-0">
                  <img
                    src={imagem}
                    alt="Imagem do imóvel"
                    className="border border-paleta-secundaria w-[90px] aspect-square rounded-xl md:w-[130px]"
                  />
                  <div
                    className="absolute top-0 right-0 bg-paleta-destrutiva rounded-full p-2 cursor-pointer"
                    onClick={() => filtrarImagem(imagem)}
                  >
                    <img
                      src={icones.lixeira}
                      alt="Botão para remover imagem do imóvel"
                      className="w-4 aspect-square"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full md:gap-8">
          <Separador texto="Informações gerais do imóvel" />

          <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:gap-8">
            <Campo
              titulo="Nome"
              placeholder="Apartamento no edifício XPTO"
              register={registrador('nome')}
              feedback={erros.nome}
            />

            <Campo
              titulo="Descrição"
              placeholder="100m²: 1 sala, 1 cozinha, 1 suíte, 1 quarto, 1 banheiro, 1 área externa"
              register={registrador('descricao')}
              feedback={erros.descricao}
            />

            <Campo
              titulo="Número máximo de pessoas"
              placeholder="4"
              register={registrador('numInquilinos')}
              feedback={erros.numInquilinos}
            />

            <Campo
              titulo="Preço"
              placeholder="750"
              register={registrador('preco')}
              feedback={erros.preco}
            />

            <ListaSuspensa
              titulo="Tipo"
              opcoes={opcoesTipo}
              valor={tipo}
              aoMudar={definirTipo}
            />

            <ListaSuspensa
              titulo="Disponibilidade"
              opcoes={opcoesDisponbilidade}
              valor={disponibilidade}
              aoMudar={definirDisponibilidade}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full md:gap-8">
          <Separador texto="Localização do imóvel">
            <Separador.Icone>
              Selecione a localização do imóvel no mapa abaixo. Caso queira,
              você pode escrever o endereço no campo abaixo para facilitar a
              busca no mapa.
            </Separador.Icone>
          </Separador>

          <Campo
            titulo="Endereço"
            placeholder="Rua, Bairro, Cidade, Estado, País"
            icone={CampoIcones.LUPA}
            value={endereco}
            onChange={evento => definirEndereco(evento.target.value)}
          />

          <div className="rounded-md w-full h-80 overflow-hidden md:h-100">
            <Mapa
              aoMudar={definirCoordenadas}
              centro={centroMapa}
              marcarCentro={marcarCentro}
              marcarToque
            />
          </div>
        </div>

        <div className="flex flex-row justify-center gap-6 w-full md:gap-10">
          <Botao
            className="grow max-w-sm"
            variante="cancelar"
            onClick={() => navegar(-1)}
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

        {!!modal && (
          <Modal
            titulo="Oops... algo deu errado"
            subtitulo={modal}
            visible={true}
            onClose={() => definirModal('')}
          />
        )}
      </form>
    </>
  );
}

export { EditarImovel };
