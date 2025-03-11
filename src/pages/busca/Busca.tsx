import { Cabecalho } from '@/components/Cabecalho';
import { Campo, CampoIcones } from '@/components/Campo';
import { Imovel } from '@/components/Imovel';
import { Switch } from '@/components/switch/Switch';
import { icones } from '@/utils/Icones';

function Busca() {
  return (
    <>
      <Cabecalho></Cabecalho>

      <div className="w-[95%] pt-32 justify-self-center">
        <div className="flex  cursor-pointer">
          <Campo
            className="placeholder-paleta-secundaria bg-paleta-fundo"
            placeholder="Pesquisar..."
            icone={CampoIcones.LUPA}
          />
          <button className="bg-paleta-fundo relative group w-16 h-14 p-0 border-0">
            <img
              className="-mt-1 absolute inset-0 transition-opacity duration-200 opacity-100 group-hover:opacity-0"
              src={icones.filtro}
            ></img>
            <img
              className="-mt-1 absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              src={icones.filtro2}
            ></img>
          </button>
        </div>

        <div className="flex justify-center gap-20">
          <button className="text-t20 border-0 border-b-2 border-transparent rounded-none focus:outline-none hover:none hover:border-b-2 text-paleta-secundaria hover:border-paleta-secundaria bg-paleta-fundo">
            Imóveis
          </button>
          <button className="text-t20 border-0 border-b-2 border-transparent rounded-none focus:outline-none hover:none hover:border-b-2 text-paleta-secundaria hover:border-paleta-secundaria bg-paleta-fundo">
            Usuários
          </button>
        </div>

        <div className="flex my-4">
          <Switch aoMudar={() => {}} />
          <p className="h-fit mt-1 ml-4 text-t24 text-paleta-secundaria font-medium">
            Incluir imóveis indisponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:gap-8">
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
          <Imovel
            id={'12'}
            imagem={''}
            nome={'Imovel'}
            endereco={'rua li'}
            preco={10}
          ></Imovel>
        </div>
      </div>
    </>
  );
}

export { Busca };
