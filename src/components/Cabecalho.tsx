import { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import { icones } from '@/utils/Icones';

interface Item {
  nome?: string;
  pagina?: string;
  acao?: () => void;
}

interface MenuPropriedades {
  itens: Item[];
  navegacao: NavigateFunction;
}

function Menu({ itens, navegacao }: MenuPropriedades) {
  return (
    <div className="flex flex-col gap-4 absolute top-full right-0 bg-paleta-primaria border-2 border-paleta-auxiliar rounded-3xl p-6 mt-6 mr-6 md:mr-20">
      {itens.map((item, indice) => {
        function aoApertar() {
          if (item.acao) {
            item.acao();
          }

          if (item.pagina) {
            navegacao(item.pagina);
          }
        }

        return item.nome ? (
          <span
            key={indice}
            className={
              'text-t16 font-medium cursor-pointer md:text-t20 text-paleta-' +
              (item.nome === 'Sair' ? 'destrutiva' : 'secundaria')
            }
            onClick={aoApertar}
          >
            {item.nome}
          </span>
        ) : (
          <span
            key={indice}
            className="border border-paleta-secundaria rounded-full w-full"
          />
        );
      })}
    </div>
  );
}

function Cabecalho() {
  const [mostrarMenu, definirMostrarMenu] = useState(false);
  const navegacao = useNavigate();

  const menuDesktop: Item[] = [
    { nome: 'Meu perfil', pagina: '/perfil' },
    { nome: 'Configurações', pagina: '/configuracoes' },
    { nome: 'Alterar senha', pagina: '/' },
    { nome: 'Sair', pagina: '/entrar', acao: () => {} },
  ];

  const menuMovel: Item[] = [
    { nome: 'Home', pagina: '/' },
    { nome: 'Pesquisar', pagina: '/pesquisa' },
    { nome: 'Mapa', pagina: '/mapa' },
    {},
    ...menuDesktop,
  ];

  return (
    <header className="flex flex-row justify-between items-center fixed z-50 bg-paleta-primaria rounded-b-3xl w-full top-0 px-6 py-2 md:px-20">
      <div className="flex flex-row items-center gap-2 md:gap-4">
        <img
          src={icones.logo}
          alt="Logo do PropPlace"
          className="w-16 aspect-square flex-shrink-0 md:w-20"
        />
        <h2 className="text-t20 text-paleta-secundaria font-bold cursor-default md:text-t24">
          PropPlace
        </h2>
      </div>

      <menu className="md:hidden">
        <div
          className="flex flex-col gap-3 border-2 border-paleta-secundaria rounded-md p-3 cursor-pointer"
          onClick={() => definirMostrarMenu(!mostrarMenu)}
        >
          <span className="border border-paleta-secundaria rounded-full w-5" />
          <span className="border border-paleta-secundaria rounded-full w-5" />
          <span className="border border-paleta-secundaria rounded-full w-5" />
        </div>

        {mostrarMenu && <Menu itens={menuMovel} navegacao={navegacao} />}
      </menu>

      <div className="flex-row items-center gap-6 hidden text-t20 text-paleta-secundaria font-medium md:flex">
        <span className="cursor-pointer" onClick={() => navegacao('/')}>
          Home
        </span>
        <span className="cursor-pointer" onClick={() => navegacao('/pesquisa')}>
          Pesquisar
        </span>
        <span className="cursor-pointer" onClick={() => navegacao('/mapa')}>
          Mapa
        </span>

        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() => definirMostrarMenu(!mostrarMenu)}
        >
          {/* TODO: pegar a foto do usuário para usar aqui */}
          <img
            src={icones.usuarioPadrao}
            alt="Foto de perfil"
            className="border border-paleta-secundaria rounded-full w-20 aspect-square flex-shrink-0"
          />
          <img
            src={icones.seta}
            alt="Mostrar menu de usuário"
            className="w-6 h-3 flex-shrink-0"
          />
        </div>

        {mostrarMenu && <Menu itens={menuDesktop} navegacao={navegacao} />}
      </div>
    </header>
  );
}

export { Cabecalho };
