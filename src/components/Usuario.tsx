import { icones } from '@/utils/Icones';
import { useNavigate } from 'react-router';

interface UsuarioPropriedades {
  id: string;
  nome: string;
  imagem?: string;
  ocupacao?: string;
  reverso?: boolean;
}

function Usuario({ id, nome, imagem, ocupacao, reverso }: UsuarioPropriedades) {
  const navegar = useNavigate();

  return (
    <div
      className={
        'flex items-center gap-4 w-full overflow-hidden cursor-pointer flex-row' +
        (reverso ? '-reverse' : '')
      }
      onClick={() => navegar('/usuarios/' + id)}
    >
      <img
        src={imagem || icones.usuarioPadrao}
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
