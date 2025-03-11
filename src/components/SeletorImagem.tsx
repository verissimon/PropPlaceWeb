import React from 'react';

interface SeletorImagemPropriedades {
  aoMudar: (valor: string) => void;
}

function SeletorImagem({ aoMudar }: SeletorImagemPropriedades) {
  function receberImagem(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = evento.target.files;
    if (arquivos?.length !== 1) return;

    const arquivo = arquivos[0];
    const url = URL.createObjectURL(arquivo);

    aoMudar(url);
  }

  return (
    <>
      <label
        htmlFor="adicionar-imagem"
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
      />
      <input
        type="file"
        id="adicionar-imagem"
        className="hidden"
        accept="image/*"
        onChange={receberImagem}
      />
    </>
  );
}

export { SeletorImagem };
