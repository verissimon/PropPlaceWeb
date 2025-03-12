import { Imagem } from './Imagem';
import { ImovelDTO } from './Imovel';

type Usuario = {
  id: string;
  nome: string;
  username: string;
  telefone: string;
  email: string;
};

type UsuarioDTO = Usuario & {
  createdAt?: Date;
  updatedAt?: Date;
  imoveis: ImovelDTO[];
  imagem: Imagem;
};

export type { Usuario, UsuarioDTO };
