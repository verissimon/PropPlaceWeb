import { useNavigate } from 'react-router';
import { icones } from '@/utils/Icones';

interface ImovelPropriedades {
  id: string;
  imagem: string;
  nome: string;
  endereco: string;
  preco: number;
  disponivel?: boolean;
}

function Imovel({
  id,
  imagem,
  nome,
  endereco,
  preco,
  disponivel,
}: ImovelPropriedades) {
  const navegar = useNavigate();

  return (
    <div className="flex flex-row gap-4 text-paleta-secundaria w-full md:min-w-sm">
      <img
        src={imagem || icones.imovelPadrao}
        alt={'Imagem do imóvel ' + nome}
        className="border border-paleta-secundaria w-[120px] aspect-square flex-shrink-0 rounded-xl md:w-40"
      />

      <div className="flex flex-col justify-between overflow-hidden w-full h-auto">
        <span className="text-t16 font-bold truncate md:text-t20">{nome}</span>
        <span className="text-t16 truncate md:text-t20">{endereco}</span>
        <span className="text-t16 font-medium md:text-t20">
          {preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>

        <div className="flex flex-row justify-between gap-2 w-full">
          <div className="flex flex-row items-center gap-2">
            <span
              className={
                'rounded-full w-4 h-4 bg-paleta-' +
                (disponivel ? 'construtiva' : 'destrutiva')
              }
            />

            <span className="text-t14 font-medium md:text-t16">
              {disponivel ? 'Disponível' : 'Indisponível'}
            </span>
          </div>

          <div
            className="cursor-pointer overflow-hidden"
            onClick={() => navegar('/imoveis/' + id)}
          >
            <span className="text-t14 text-paleta-auxiliar underline decoration-paleta-auxiliar truncate md:text-t16">
              Ver mais
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Imovel };
