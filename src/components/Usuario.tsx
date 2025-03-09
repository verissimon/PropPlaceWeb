import { useNavigate } from 'react-router';

interface UsuarioPropriedades {
  id: string;
  nome: string;
  imagem: string;
  ocupacao?: string;
}

function Usuario({ id, nome, imagem, ocupacao }: UsuarioPropriedades) {
  const navegar = useNavigate();

  return (
    <div
      className="flex flex-row items-center gap-4 w-full overflow-hidden cursor-pointer"
      onClick={() => navegar('/usuarios/' + id)}
    >
      <img
        src={imagem}
        alt={'Foto de perfil de ' + nome}
        className="border border-paleta-secundaria w-20 aspect-square rounded-full flex-shrink-0 md:w-[100px]"
      />

      <div className="flex flex-col gap-4 text-paleta-secundaria text-t16 overflow-hidden md:text-t20">
        <p className="font-bold truncate">{nome}</p>
        {ocupacao && <p>{ocupacao}</p>}
      </div>
    </div>
  );
}

export { Usuario };
