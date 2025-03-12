import { api, IMAGE_API_URL } from '@/api';
import { ImovelDTO, ImovelEnderecado } from '@/models/Imovel';
import { UsuarioDTO, UsuarioPerfil } from '@/models/Usuario';
import { enderecarImovel } from './enderecamento';

function formataImagemImovel(imovel: ImovelDTO): ImovelDTO {
  const imagens = imovel.imagens
    ?.filter(imagem => imagem?.nomeImagem)
    .map(imagem => ({
      ...imagem,
      nomeImagem: IMAGE_API_URL + imagem.nomeImagem,
    }));

  return { ...imovel, imagens };
}

async function organizaImoveis(imoveis: ImovelDTO[]) {
  const imoveisEnderecados: ImovelEnderecado[] = [];

  for (const imovel of imoveis) {
    const imovelEnderecado = await enderecarImovel(imovel);
    const imagens = formataImagemImovel(imovel).imagens;

    imoveisEnderecados.push({ ...imovelEnderecado, imagens });
  }

  return imoveisEnderecados;
}

async function construirModeloUsuarioPerfil(
  id: string
): Promise<UsuarioPerfil | null> {
  const token = localStorage.getItem('auth.token');
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  const usuario = (await api
    .get('/users/id/' + id)
    .then(resposta => resposta.data)
    .catch(() => ({}))) as UsuarioDTO;
  if (!usuario?.id) return null;

  if (usuario.imagem?.nomeImagem) {
    usuario.imagem.nomeImagem = IMAGE_API_URL + usuario.imagem.nomeImagem;
  }

  const imoveisEnderecados = await organizaImoveis(usuario.imoveis).then(
    resposta => resposta
  );

  return { ...usuario, imoveis: imoveisEnderecados };
}

function construirModeloImoveisMapa(imoveis: ImovelDTO[]): ImovelDTO[] {
  return imoveis.map(formataImagemImovel);
}

export { construirModeloUsuarioPerfil, construirModeloImoveisMapa };
