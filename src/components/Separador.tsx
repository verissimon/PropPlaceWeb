import { ReactNode, useState } from 'react';

import informacao from '../assets/informacao.svg';
import { Dica } from './Dica';

interface SeparadorPropriedades {
  texto: string;
  children?: ReactNode;
}

function Separador({ texto, children: complemento }: SeparadorPropriedades) {
  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex justify-between items-center w-full">
        <p className="text-t20 text-paleta-secundaria font-medium md:text-t24">
          {texto}
        </p>

        {!!complemento && complemento}
      </div>

      <div className="w-full h-1 rounded-full bg-paleta-secundaria"></div>
    </div>
  );
}

interface TextoPropriedades {
  aoApertar: () => void;
  children: string;
}

function Texto({ aoApertar, children: texto }: TextoPropriedades) {
  return (
    <div onClick={aoApertar}>
      <p className="text-t16 text-paleta-auxiliar underline decoration-paleta-auxiliar underline-offset-4 cursor-pointer md:text-t20">
        {texto}
      </p>
    </div>
  );
}

interface IconePropriedades {
  icone?: string;
  children: string;
}

function Icone({ icone, children: texto }: IconePropriedades) {
  const [dicaVisivel, definirDicaVisivel] = useState<boolean>(false);
  let temporizador = setTimeout(() => {}, 0);

  function aoApertar() {
    clearTimeout(temporizador);

    definirDicaVisivel(true);
    temporizador = setTimeout(() => definirDicaVisivel(false), 10000);
  }

  function aoPassar() {
    definirDicaVisivel(true);
  }

  function aoSair() {
    definirDicaVisivel(false);
  }

  return (
    <div
      className="relative"
      onClick={aoApertar}
      onMouseOver={aoPassar}
      onMouseLeave={aoSair}
    >
      <Dica
        visivel={dicaVisivel}
        posicionamento="right-0"
        estilo="w-[50vw] min-w-[16rem] max-w-lg"
      >
        <Dica.Texto>{texto}</Dica.Texto>
      </Dica>
      <img
        className="w-5 aspect-square md:w-6"
        src={icone || informacao}
        alt="Ícone de mais informações"
      />
    </div>
  );
}

Separador.Texto = Texto;
Separador.Icone = Icone;

export { Separador };
