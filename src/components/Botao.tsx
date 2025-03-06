import {
  ButtonHTMLAttributes,
  createContext,
  HTMLAttributes,
  useContext,
} from 'react';
import clsx from 'clsx';
import Loading from './Loading';

type Variantes = 'generico' | 'inativo' | 'enviar' | 'cancelar';

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variantes;
  isLoading?: boolean;
};

const ThemeContext = createContext<{ variante?: Variantes }>({});

function Titulo({ children }: HTMLAttributes<HTMLParagraphElement>) {
  const { variante } = useContext(ThemeContext);

  return (
    <p
      className={clsx('text-g font-regular', {
        'text-paleta-secundaria': variante === 'inativo',
        'text-paleta-branca': variante !== 'inativo',
      })}
    >
      {children}
    </p>
  );
}

function Botao({
  variante = 'generico',
  children,
  isLoading,
  className,
  ...rest
}: BotaoProps) {
  return (
    <button
      className={clsx(
        'h-12 flex-row items-center justify-center rounded-lg gap-2 px-4 disabled:opacity-50',
        {
          'bg-paleta-secundaria': variante === 'generico',
          'bg-paleta-terciaria': variante === 'inativo',
          'bg-paleta-construtiva': variante === 'enviar',
          'bg-paleta-destrutiva': variante === 'cancelar',
        },
        className
      )}
      disabled={isLoading || variante === 'inativo'}
      {...rest}
    >
      <ThemeContext.Provider value={{ variante }}>
        {isLoading ? <Loading /> : children}
      </ThemeContext.Provider>
    </button>
  );
}

Botao.Titulo = Titulo;

export { Botao };
