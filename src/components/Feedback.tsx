import { icones } from '@/utils/Icones';

interface FeedbackPropriedades {
  children: string;
}

function Feedback({ children }: FeedbackPropriedades) {
  return (
    <div className="flex items-center gap-2 w-full">
      <img
        className="w-4 h-4 md:w-5 md:h-5"
        src={icones.aviso}
        alt="Ícone de aviso"
      />

      <p className="text-t14 text-paleta-destrutiva w-full md:text-t16">
        {children}
      </p>
    </div>
  );
}

export { Feedback };
