import { ReactNode } from "react";

interface DicaPropriedades {
    visivel: boolean,
    posicionamento?: string,
    estilo?: string,
    children: ReactNode
}

function Dica({visivel, posicionamento, estilo, children:conteudo}:DicaPropriedades) {
    return (
        <>
            {
                visivel ?
                    <div className={"absolute -translate-y-full pb-2 " + posicionamento}>
                        <div className={"bg-paleta-fundo border-2 border-paleta-auxiliar rounded-xl p-4 z-1 md:p-6 " + estilo}>
                            {conteudo}
                        </div>
                    </div>
                : <></>
                
            }
        </>
    );
}

interface TextoPropriedades {
    children: string
}

function Texto({children:texto}:TextoPropriedades) {
    return (
        <p className="text-t14 text-paleta-secundaria w-full md:text-t16">{texto}</p>
    );
}

Dica.Texto = Texto;

export { Dica };
