import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { ListaSuspensa } from '@/components/ListaSuspensa';
import { Mapa } from '@/components/Mapa';
import { Modal } from '@/components/Modal';
import { SeletorImagem } from '@/components/SeletorImagem';
import { Separador } from '@/components/Separador';
import { Coordenadas, ImovelDTO, ImovelEnderecado } from '@/models/Imovel';
import { CampoIcones, icones } from '@/utils/Icones';
import { imovelSchema, TFormImovelSchema } from '@/utils/validationSchemas';

const opcoesTipo = ['Apartamento', 'Casa', 'Estúdio', 'Kitnet', 'República'];
const opcoesDisponbilidade = ['Disponível', 'Indisponível'];
let temporizador = setTimeout(() => {}, 0);

interface LocalizacaoEstado {
  imovel?: ImovelEnderecado;
  coordenadas?: Coordenadas;
}

function EditarImovel() {
  const [imovel, definirImovel] = useState<ImovelDTO>();
  const [imagens, definirImagens] = useState<string[]>([]);
  const [tipo, definirTipo] = useState(0);
  const [disponibilidade, definirDisponibilidade] = useState(0);
  const [coordenadas, definirCoordenadas] = useState<Coordenadas>();
  const [endereco, definirEndereco] = useState('');
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
      definirImagens(imovelEstado.imagens.map(imagem => imagem.nomeImagem));
      definirTipo(opcoesTipo.indexOf(imovelEstado.tipo));
      definirDisponibilidade(imovelEstado.disponivel ? 0 : 1);
      definirCoordenadas(coordenadasMapa);
      definirCentroMapa(coordenadasMapa);
      resetar(imovelEstado);
    } else {
      definirImovel(undefined);
      definirImagens([]);
      definirTipo(0);
      definirDisponibilidade(0);
      definirCoordenadas(undefined);
      definirCentroMapa(undefined);
      resetar({});
    }

    if (coordenadasEstado) {
      definirCentroMapa(coordenadasEstado);
    }
  }, [localizacao.state, resetar]);

  useEffect(() => {
    function buscarEndereco() {
      if (!endereco) return;

      // TODO: adicionar requisição à API de mapa e atualizar centroMapa
      definirCentroMapa(undefined);
    }

    clearTimeout(temporizador);
    temporizador = setTimeout(buscarEndereco, 500);
  }, [endereco]);

  function validarValores(): boolean {
    const temImagem = imagens.length > 0;
    const temCoordenadas = coordenadas !== undefined;
    let textoModal =
      'Por favor, verifique as informações no(s) seguinte(s) campo(s): ';

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

  function enviar() {
    if (!validarValores()) return;

    // TODO: adicionar requisição à API
    definirImovel(undefined);
  }

  return (
    <form
      onSubmit={aoEnviar(enviar)}
      className="flex flex-col justify-center gap-10 w-full px-6 pt-8 pb-10 md:px-20 md:pb-20"
    >
      <div className="flex flex-col gap-6 w-full md:gap-8">
        <Separador texto="Imagens do imóvel" />

        <div className="flex flex-col items-center gap-6 w-full md:flex-row md:items-start md:gap-20">
          <div className="relative flex-shrink-0">
            <img
              src={icones.adicionarImagem}
              alt="Botão para adicionar imagem do imóvel"
              className="w-40 aspect-square md:w-[280px]"
            />
            <SeletorImagem
              aoMudar={novaImagem => definirImagens([...imagens, novaImagem])}
            />
          </div>

          <div className="flex flex-row flex-wrap justify-center gap-x-10 gap-y-5 w-full md:justify-start">
            {imagens.map((imagem, indice) => (
              <div key={indice} className="relative flex-shrink-0">
                <img
                  src={imagem}
                  alt="Imagem do imóvel"
                  className="w-[90px] aspect-square rounded-xl md:w-[130px]"
                />
                <div
                  className="absolute top-0 right-0 bg-paleta-destrutiva rounded-full p-2 cursor-pointer"
                  onClick={() =>
                    definirImagens(
                      imagens.filter(imagemSalva => imagemSalva != imagem)
                    )
                  }
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
            labelFor="nome"
            id="nome"
            name="nome"
            titulo="Nome"
            placeholder="Apartamento no edifício XPTO"
            register={registrador('nome')}
            feedback={erros.nome}
          />

          <Campo
            labelFor="descricao"
            id="descricao"
            name="descricao"
            titulo="Descrição"
            placeholder="100m²: 1 sala, 1 cozinha, 1 suíte, 1 quarto, 1 banheiro, 1 área externa"
            register={registrador('descricao')}
            feedback={erros.descricao}
          />

          <Campo
            labelFor="numero-pessoas"
            id="numero-pessoas"
            name="numero-pessoas"
            titulo="Número máximo de pessoas"
            placeholder="4"
            register={registrador('numInquilinos')}
            feedback={erros.numInquilinos}
          />

          <Campo
            labelFor="preco"
            id="preco"
            name="preco"
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
            Selecione a localização do imóvel no mapa abaixo. Caso queira, você
            pode escrever o endereço no campo abaixo para facilitar a busca no
            mapa.
          </Separador.Icone>
        </Separador>

        <Campo
          labelFor="endereco"
          id="endereco"
          name="endereco"
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
            marcarCentro
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
          titulo="Informações incompletas"
          subtitulo={modal}
          visible={true}
          onClose={() => definirModal('')}
        />
      )}
    </form>
  );
}

export { EditarImovel };
