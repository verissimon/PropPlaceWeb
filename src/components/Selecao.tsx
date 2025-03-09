import { useState } from 'react';

interface SelecaoPropriedades {
  opcoes: string[];
  aoMudar: (valor: number) => void;
  valorInicial?: number;
}

function Selecao({ opcoes, aoMudar, valorInicial }: SelecaoPropriedades) {
  const [opcaoSelecionada, definirOpcaoSelecionada] = useState(
    valorInicial != null ? valorInicial : -1
  );
  const quantidadeOpcoes = opcoes.length;

  function selecionarOpcao(opcao: number) {
    definirOpcaoSelecionada(opcao);
    aoMudar(opcao);
  }

  return (
    <div className="flex flex-col gap-4">
      {opcoes.map((opcao, indice) => (
        <div key={indice} className="flex flex-col gap-4">
          <div
            className="flex flex-row items-center gap-2 w-full cursor-pointer md:gap-4"
            onClick={() => selecionarOpcao(indice)}
          >
            <span
              className={
                'rounded-full border border-paleta-secundaria w-4 h-4 md:w-5 md:h-5 ' +
                (opcaoSelecionada === indice && 'bg-paleta-secundaria')
              }
            />

            <p className="text-t16 text-paleta-secundaria md:text-t20">
              {opcao}
            </p>
          </div>

          {indice + 1 != quantidadeOpcoes && (
            <span className="bg-paleta-secundaria w-full h-[2px] rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
}

export { Selecao };
