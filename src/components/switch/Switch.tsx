import { useState } from 'react';
import './switch.css';

interface SwitchPropriedades {
  aoMudar: (valor: boolean) => void;
  iniciarAtivo?: boolean;
}

function Switch({ aoMudar, iniciarAtivo = false }: SwitchPropriedades) {
  const [ativo, definirAtivo] = useState(iniciarAtivo);
  const [animar, definirAnimar] = useState(false);
  const [intervaloAtivo, definirIntervaloAtivo] = useState(false);

  function alterarEstado() {
    definirAnimar(true);

    if (!intervaloAtivo) {
      definirIntervaloAtivo(true);

      setTimeout(() => {
        definirAtivo(!ativo);
        aoMudar(!ativo);
        definirAnimar(false);
        definirIntervaloAtivo(false);
      }, 300);
    }
  }

  return (
    <div
      className="flex flex-row justify-center items-center relative w-[100px] h-10"
      onClick={alterarEstado}
    >
      {ativo ? (
        <>
          <div
            className={
              'absolute bg-paleta-primaria w-10 h-10 rounded-full botao-ativo ' +
              (animar && 'animar-botao-ativo')
            }
          />
          <div
            className={
              'bg-paleta-construtiva w-20 h-8 rounded-full overflow-hidden barra-ativa ' +
              (animar && 'animar-barra-ativa')
            }
          >
            <div className="bg-paleta-auxiliar w-full h-full" />
          </div>
        </>
      ) : (
        <>
          <div
            className={
              'absolute bg-paleta-primaria w-10 h-10 rounded-full botao-inativo ' +
              (animar && 'animar-botao-inativo')
            }
          />
          <div
            className={
              'bg-paleta-auxiliar w-20 h-8 rounded-full overflow-hidden barra-inativa ' +
              (animar && 'animar-barra-inativa')
            }
          >
            <div className="bg-paleta-construtiva w-full h-full" />
          </div>
        </>
      )}
    </div>
  );
}

export { Switch };
