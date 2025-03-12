import { Coordenadas, ImovelDTO, ImovelEnderecado } from '@/models/Imovel';
import axios from 'axios';

const urlBase = 'https://api.mapbox.com/search/geocode/v6/';
const chave = import.meta.env.VITE_MAP_API_KEY;

type EnderecoGeolocalizacaoReversa = {
  completo: string;
  resumido: string;
};

async function geolocalizacao(endereco: string): Promise<Coordenadas | null> {
  const url = `${urlBase}forward?q=${endereco}&access_token=${chave}`;

  return axios
    .get(url)
    .then(resposta =>
      (resposta.data.features as []).length !== 0
        ? resposta.data.features[0].properties.coordinates
        : null
    )
    .catch(erro => {
      console.log(erro);
      return null;
    });
}

async function geolocalizacaoReversa({
  latitude,
  longitude,
}: Coordenadas): Promise<EnderecoGeolocalizacaoReversa | null> {
  const url = `${urlBase}reverse?latitude=${latitude}&longitude=${longitude}&access_token=${chave}`;

  return axios
    .get(url)
    .then(resposta => {
      if ((resposta.data.features as []).length === 0) return null;

      const partesNome =
        resposta.data.features[0].properties.place_formatted.split(',');
      return {
        completo: resposta.data.features[0].properties.full_address,
        resumido: `${partesNome[0]}, ${partesNome[2]}`,
      };
    })
    .catch(erro => {
      console.log(erro);
      return null;
    });
}

async function enderecarImovel(imovel: ImovelDTO): Promise<ImovelEnderecado> {
  const resposta = await geolocalizacaoReversa({
    latitude: imovel.latitude,
    longitude: imovel.longitude,
  });
  const endereco = resposta ? resposta.resumido : '';
  return { ...imovel, endereco };
}

export { geolocalizacao, geolocalizacaoReversa, enderecarImovel };
