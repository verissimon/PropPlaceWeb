import { ChangeEvent, useEffect, useState } from "react";

import aviso from "../assets/aviso.svg";
import cadeado from "../assets/cadeado.svg";
import email from "../assets/email.svg";
import lupa from "../assets/lupa.svg";
import pessoa from "../assets/pessoa.svg";
import telefone from "../assets/telefone.svg";

const icones = { cadeado, email, lupa, pessoa, telefone };

enum CampoIcones {
    CADEADO = "cadeado",
    EMAIL = "email",
    LUPA = "lupa",
    PESSOA = "pessoa",
    TELEFONE = "telefone",
}

interface CampoPropriedades {
    nome: string,
    aoMudar: (parametro:string) => void,
    titulo?: string,
    marcador?: string,
    valorInicial?: string,
    feedback?: string,
    tipo?: string,
    ativo?: boolean,
    icone?: CampoIcones
}

function Campo({nome, aoMudar, titulo, marcador, valorInicial, feedback, tipo="text", ativo, icone}:CampoPropriedades) {
    const [valor, definirValor] = useState("");

    useEffect(() => {
        definirValor(valorInicial || "");
    }, [valorInicial, ativo]);

    function mudancaValor(evento:ChangeEvent<HTMLInputElement>) {
        const novoValor = evento.currentTarget.value || "";
        definirValor(novoValor);
        aoMudar(novoValor);
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            { titulo &&
                <label className="text-t16 text-paleta-secundaria font-medium mb-1 md:text-t20 md:mb-2">{titulo}</label>
            }

            <div className={"flex justify-between items-center gap-3 w-full p-3 " + (ativo ? "border-2 border-paleta-primaria rounded-md" : "border-b-2 border-paleta-auxiliar")}>
                <input
                    className={"text-t14 grow placeholder-paleta-auxiliar bg-transparent outline-none md:text-t16 " + (ativo ? "text-paleta-secundaria" : "text-paleta-auxiliar")}
                    name={nome} type={tipo} onChange={mudancaValor} placeholder={marcador} value={valor} disabled={!ativo} key={nome}
                />

                { icone && 
                    <img className="w-4 aspect-square md:w-6" src={icones[icone]} alt={"Ícone de " + icone} />
                }
            </div>

            { feedback &&
                <div className="flex items-center gap-2 w-full">
                    <img className="w-4 h-4 md:w-5 md:h-5" src={aviso} alt="Ícone de aviso" />
                    <p className="text-t14 text-paleta-destrutiva w-full md:text-t16">{feedback}</p>
                </div>
            }
        </div>
    );
}

export { Campo, CampoIcones };
