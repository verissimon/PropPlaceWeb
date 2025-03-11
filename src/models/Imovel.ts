import { Imagem } from './Imagem';

type ImovelBase = {
  id: string;
  nome: string;
  userId: string;
  tipo: string;
  descricao: string;
  disponivel: boolean;
  preco: number;
  numInquilinos: number;
  imagens: Imagem[];
};

type Coordenadas = {
  latitude: number;
  longitude: number;
};
type ImovelDTO = ImovelBase & Coordenadas;
type ImovelEnderecado = ImovelDTO & { endereco: string };

export type { Coordenadas, ImovelDTO, ImovelEnderecado };
