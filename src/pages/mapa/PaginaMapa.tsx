import { Botao } from '@/components/Botao';
import { Cabecalho } from '@/components/Cabecalho';
import { Campo, CampoIcones } from '@/components/Campo';
import { Mapa } from '@/components/Mapa';
import { Coordenadas } from '@/models/Imovel';
import { geolocalizacao } from '@/utils/enderecamento';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

let temporizador = setTimeout(() => {}, 0);

function PaginaMapa() {
  const [busca, definirBusca] = useState('');
  const [coordenadas, definirCoordenadas] = useState<Coordenadas>();
  const [centro, definirCentro] = useState<Coordenadas>();
  const navegar = useNavigate();

  useEffect(() => {
    async function buscar() {
      const resultado = await geolocalizacao(busca);
      if (resultado) definirCentro(resultado);
    }

    clearTimeout(temporizador);
    temporizador = setTimeout(async () => {
      if (busca) await buscar();
    }, 1000);
  }, [busca]);

  return (
    <div className="h-screen">
      <Cabecalho />

      <div className="flex flex-col items-center gap-10 w-full h-full px-6 pt-[112px] pb-10 md:px-20 md:pt-32 md:pb-20">
        <Campo
          labelFor="pesquisar"
          id="pesquisar"
          name="pesquisar"
          icone={CampoIcones.LUPA}
          placeholder="Pesquisar..."
          value={busca}
          onChange={evento => definirBusca(evento.target.value)}
        />

        <div className="grow rounded-md w-full min-h-[400px] overflow-hidden">
          <Mapa
            aoMudar={definirCoordenadas}
            centro={centro}
            marcarToque
            realizarRequisicoes
          />
        </div>

        <Botao
          onClick={() => navegar('/imovel/editar', { state: { coordenadas } })}
          className="w-full max-w-sm"
        >
          <Botao.Titulo>Adicionar imóvel</Botao.Titulo>
        </Botao>
      </div>
    </div>
  );
}

export { PaginaMapa };
