import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { api } from '@/api';
import { Imovel } from './Imovel';
import { useGeolocalizacao } from '@/hooks/useGeolocalizacao';
import { icones } from '@/utils/Icones';
import { ImovelDTO } from '@/models/Imovel';
import { construirModeloImoveisMapa } from '@/utils/constroiModelos';

let temporizador = setTimeout(() => {}, 0);

interface MapaCoordenadas {
  latitude: number;
  longitude: number;
}

interface CentroPropriedades {
  centro: MapaCoordenadas;
}

interface MapaPropriedades {
  centro?: MapaCoordenadas;
  marcarCentro?: boolean;
  marcarToque?: boolean;
  realizarRequisicoes?: boolean;
  aoMudar?: (valor: MapaCoordenadas) => void;
}

function Mapa({
  centro,
  marcarCentro,
  marcarToque,
  realizarRequisicoes,
  aoMudar,
}: MapaPropriedades) {
  const navegar = useNavigate();
  const geolocalizacao = useGeolocalizacao();

  const [localizacao, definirLocalizacao] = useState<MapaCoordenadas>({
    latitude: 0,
    longitude: 0,
  });
  const [marcadorToque, definirMarcadorToque] = useState<MapaCoordenadas>();
  const [marcadorCentro, definirMarcadorCentro] = useState<MapaCoordenadas>();
  const [imoveis, definirImoveis] = useState<ImovelDTO[]>([]);

  useEffect(() => {
    (async () => {
      if (centro) {
        definirLocalizacao(centro);
        if (marcarCentro) definirMarcadorCentro(centro);
      } else {
        definirLocalizacao({
          latitude: geolocalizacao.latitude,
          longitude: geolocalizacao.longitude,
        });
      }
    })();
  }, [
    centro,
    geolocalizacao.latitude,
    geolocalizacao.longitude,
    marcarCentro,
    marcarToque,
  ]);

  useEffect(() => {
    (async () => {
      if (!realizarRequisicoes) return;

      const latitude = localizacao.latitude;
      const longitude = localizacao.longitude;

      if (latitude === 0 && longitude === 0) return;

      const token = localStorage.getItem('auth.token');
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const resposta = await api
        .get(`/imoveis/local/10?latitude=${latitude}&longitude=${longitude}`)
        .then(resposta => resposta.data as ImovelDTO[])
        .catch(() => []);

      const imoveisFormatados = construirModeloImoveisMapa(resposta);
      definirImoveis(imoveisFormatados);
    })();
  }, [localizacao, realizarRequisicoes]);

  function construirMarcadorImovel() {
    const larguraDaTela = screen.width;
    const responsivo = 768;

    return (
      <>
        {imoveis.map((imovel, indice) => {
          const pinImovel = imovel.disponivel
            ? icones.pinImovelDisponivel
            : icones.pinImovelIndisponivel;

          return (
            <Marker
              key={indice}
              position={[imovel.latitude, imovel.longitude]}
              icon={
                new L.Icon({
                  iconUrl: pinImovel,
                  iconSize: new L.Point(50, 50),
                })
              }
              title={imovel.nome}
            >
              <Popup minWidth={larguraDaTela < responsivo ? 280 : 480}>
                <div
                  className="cursor-pointer"
                  onClick={() => navegar('/imoveis/' + imovel.id)}
                >
                  <Imovel
                    id={imovel.id}
                    nome={imovel.nome}
                    imagem={imovel.imagens[0]?.nomeImagem}
                    preco={imovel.preco}
                    disponivel={imovel.disponivel}
                    detalhar={false}
                  />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  }

  function construirMarcadorCentro() {
    if (!marcadorCentro) return <></>;

    return (
      <Marker
        position={[marcadorCentro.latitude, marcadorCentro.longitude]}
        icon={
          new L.Icon({
            iconUrl: icones.pinImovelAtual,
            iconSize: new L.Point(50, 50),
          })
        }
      />
    );
  }

  function construirMarcadorToque() {
    if (!marcadorToque) return;

    return (
      <Marker
        position={[marcadorToque.latitude, marcadorToque.longitude]}
        icon={
          new L.Icon({
            iconUrl: icones.pinToque,
            iconSize: new L.Point(50, 50),
          })
        }
      />
    );
  }

  function mudancaDeRegiao(centro: LatLng) {
    const diferencaMinima = 0.005;

    if (
      Math.abs(centro.lat - localizacao.latitude) +
        Math.abs(centro.lng - localizacao.longitude) >
      diferencaMinima
    ) {
      definirLocalizacao({ latitude: centro.lat, longitude: centro.lng });
    }
  }

  function toqueNoMapa(centro: LatLng) {
    const coordenadas = { latitude: centro.lat, longitude: centro.lng };

    if (aoMudar) aoMudar(coordenadas);
    if (marcarToque) definirMarcadorToque(coordenadas);
  }

  function AtualizaMapa({ centro }: CentroPropriedades) {
    const mapa = useMap();
    mapa.setView({ lat: centro.latitude, lng: centro.longitude });
    return null;
  }

  function IdentificaAcao() {
    const mapa = useMap();
    mapa.on('click', evento => {
      toqueNoMapa(evento.latlng);
    });
    mapa.on('moveend', () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        mudancaDeRegiao(mapa.getCenter());
      }, 300);
    });
    return null;
  }

  return (
    <MapContainer
      center={[0, 0]}
      zoom={15}
      scrollWheelZoom
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AtualizaMapa centro={localizacao} />
      <IdentificaAcao />

      {realizarRequisicoes && construirMarcadorImovel()}
      {marcarCentro && construirMarcadorCentro()}
      {marcarToque && construirMarcadorToque()}
    </MapContainer>
  );
}

export { Mapa };
