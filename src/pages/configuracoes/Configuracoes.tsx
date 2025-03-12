import { Separador } from '@/components/Separador';
import { Switch } from '@/components/switch/Switch';
import { useEffect, useState } from 'react';

function Configuracoes() {
  // TODO: recuperar o estado dessas opções
  const [textoGrande, definirTextoGrande] = useState(false);
  const [altoContraste, definirAltoContraste] = useState(false);

  useEffect(() => {
    // TODO: salvar o estado da opção
  }, [textoGrande]);

  useEffect(() => {
    // TODO: salvar o estado da opção
  }, [altoContraste]);

  return (
    <div className="flex flex-col items-center gap-10 w-full h-full px-6 pt-8 pb-10 md:px-20 md:pb-20">
      <div className="flex flex-col items-center gap-10 w-full">
        <Separador texto="Acessibilidade" />

        <div className="flex flex-col items-center gap-10 text-t16 text-paleta-secundaria font-medium w-full max-w-[800px] md:text-t20">
          <div className="flex flex-row justify-between items-center w-full">
            <span>Texto grande</span>
            <Switch iniciarAtivo={textoGrande} aoMudar={definirTextoGrande} />
          </div>

          <div className="flex flex-row justify-between items-center w-full">
            <span>Texto em alto contraste</span>
            <Switch
              iniciarAtivo={altoContraste}
              aoMudar={definirAltoContraste}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Configuracoes };
