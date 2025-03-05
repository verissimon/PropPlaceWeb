import { CampoIcones, icones } from '@/utils/Icones';
import { InputHTMLAttributes } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface CampoPropriedades extends InputHTMLAttributes<HTMLInputElement> {
  titulo?: string;
  valorInicial?: string;
  feedback?: FieldError;
  ativo?: boolean;
  icone?: CampoIcones;
  register?: UseFormRegisterReturn;
}

function Campo({
  titulo,
  register,
  feedback,
  ativo = true,
  icone,
  ...rest
}: CampoPropriedades) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {titulo && (
        <label className="text-t16 text-paleta-secundaria font-medium mb-1 md:text-t20 md:mb-2">
          {titulo}
        </label>
      )}

      <div
        className={
          'flex justify-between items-center gap-3 w-full p-3 ' +
          (ativo
            ? 'border-2 border-paleta-primaria rounded-md'
            : 'border-b-2 border-paleta-auxiliar')
        }
      >
        <input
          {...register}
          disabled={!ativo}
          className={
            'text-t14 grow placeholder-paleta-auxiliar bg-transparent outline-none md:text-t16 ' +
            (ativo ? 'text-paleta-secundaria' : 'text-paleta-auxiliar')
          }
          {...rest}
        />

        {icone && (
          <img
            className="w-4 aspect-square md:w-6"
            src={icones[icone]}
            alt={'Ícone de ' + icone}
          />
        )}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 w-full">
          <img
            className="w-4 h-4 md:w-5 md:h-5"
            src={icones.aviso}
            alt="Ícone de aviso"
          />
          <p className="text-t14 text-paleta-destrutiva w-full md:text-t16">
            {feedback?.message}
          </p>
        </div>
      )}
    </div>
  );
}

export { Campo, CampoIcones };
