import { useEffect, useState } from 'react';
import axios from 'axios';

interface Coordenadas {
  lat: number;
  lon: number;
}

function useGeolocalizacao() {
  const [localizacao, definirLocalizacao] = useState<Coordenadas>({
    lat: 0,
    lon: 0,
  });

  useEffect(() => {
    buscarLocalizacao();
  }, []);

  async function buscarLocalizacao() {
    const resposta = await axios.get('http://ip-api.com/json');
    if (resposta.status === 200) {
      definirLocalizacao(resposta.data);
    }
  }

  return {
    latitude: localizacao?.lat,
    longitude: localizacao?.lon,
  };
}

export { useGeolocalizacao };
