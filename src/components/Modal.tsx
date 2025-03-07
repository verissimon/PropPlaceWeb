import React, { useEffect, useState } from 'react';

type ModalProps = {
  titulo?: string;
  subtitulo?: string;
  onClose: () => void;
  visible: boolean;
  children?: React.ReactNode;
};

function Modal({ titulo, subtitulo, onClose, visible, children }: ModalProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 200);
    }
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-paleta-terciaria/30 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'} ${show ? 'block' : 'hidden'}`}
      onClick={onClose}
    >
      <div
        className={`bg-paleta-fundo rounded-lg p-4 md:p-6 w-full max-w-md transform transition-transform duration-200 ${visible ? 'scale-100' : 'scale-90'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-2 md:pb-4 md:mb-4">
          <h2 className="text-lg md:text-xl text-paleta-secundaria font-semibold">
            {titulo}
          </h2>
          <button
            onClick={onClose}
            className="bg-paleta-primaria text-paleta-secundaria hover:text-paleta-auxiliar text-sm md:text-base"
          >
            &times;
          </button>
        </div>
        <div className="mb-2 md:mb-4">
          {subtitulo && subtitulo.trim().length > 0 && (
            <h4 className="text-base md:text-lg text-paleta-secundaria font-medium">
              {subtitulo}
            </h4>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Modal };
