import { useState } from 'react';
import { Selecao } from './Selecao';
import { Feedback } from './Feedback';
import { icones } from '@/utils/Icones';

interface ListaSuspensaPropriedades {
  opcoes: string[];
  aoMudar: (valor: number) => void;
  titulo?: string;
  valorInicial?: number;
}

function ListaSuspensa({
  opcoes,
  aoMudar,
  titulo,
  valorInicial,
}: ListaSuspensaPropriedades) {
  const [opcao, definirOpcao] = useState(
    valorInicial != null ? valorInicial : -1
  );
  const [opcoesVisiveis, definirOpcoesVisiveis] = useState(false);
  const [feedbackVisivel, definirFeedbackVisivel] = useState(false);

  function mudarOpcoesVisiveis() {
    if (opcao < 0 && opcoesVisiveis) {
      definirFeedbackVisivel(true);
    } else {
      definirFeedbackVisivel(false);
    }

    definirOpcoesVisiveis(!opcoesVisiveis);
  }

  function mudarOpcao(valor: number) {
    definirOpcao(valor);
    aoMudar(valor);

    definirOpcoesVisiveis(false);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {titulo && (
        <label className="text-t16 text-paleta-secundaria font-medium mb-1 md:text-t20 md:mb-2">
          {titulo}
        </label>
      )}

      <div className="relative">
        <div
          className="flex justify-between items-center gap-3 border-2 border-paleta-primaria w-full p-3 rounded-md cursor-pointer"
          onClick={() => mudarOpcoesVisiveis()}
        >
          <p
            className={
              'text-t14 grow md:text-t16 ' +
              (opcao >= 0 ? 'text-paleta-secundaria' : 'text-paleta-auxiliar')
            }
          >
            {opcao >= 0 ? opcoes[opcao] : 'Selecione uma opção'}
          </p>

          <img
            className="w-4 aspect-square md:w-6"
            src={icones.seta}
            alt={'Ícone de seta'}
          />
        </div>

        {opcoesVisiveis && (
          <div className="absolute end-0 bg-paleta-fundo border-[2px] border-paleta-auxiliar rounded-xl w-full z-2 p-6 md:p-8">
            <Selecao
              opcoes={opcoes}
              aoMudar={mudarOpcao}
              valorInicial={opcao != null ? opcao : valorInicial}
            />
          </div>
        )}
      </div>

      {feedbackVisivel && <Feedback>Por favor, selecione uma opção.</Feedback>}
    </div>
  );
}

export { ListaSuspensa };
