import { useNavigate } from 'react-router';

import imovelPadrao from '@/assets/imovelPadrao.svg';

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
        src={imagem || imovelPadrao}
        alt={'Imagem do imóvel ' + nome}
        className="border border-paleta-secundaria w-[120px] aspect-square flex-shrink-0 rounded-xl md:w-40"
      />

      <div className="flex flex-col justify-between overflow-hidden w-full h-full">
        <p className="text-t16 font-bold truncate md:text-t20">{nome}</p>
        <p className="text-t16 truncate md:text-t20">{endereco}</p>
        <p className="text-t16 font-medium md:text-t20">
          {preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>

        <div className="flex flex-row justify-between gap-2 w-full">
          <div className="flex flex-row items-center gap-2">
            <span
              className={
                'rounded-full w-4 h-4 bg-paleta-' +
                (disponivel ? 'construtiva' : 'destrutiva')
              }
            />

            <p className="text-t14 font-medium md:text-t16">
              {disponivel ? 'Disponível' : 'Indisponível'}
            </p>
          </div>

          <div
            className="cursor-pointer overflow-hidden"
            onClick={() => navegar('/imoveis/' + id)}
          >
            <p className="text-t14 text-paleta-auxiliar underline decoration-paleta-auxiliar truncate md:text-t16">
              Ver mais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Imovel };
