import { ImovelDTO } from '@/models/Imovel';

function formatarMoeda(valor: number | string) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function numerosAleatorios(
  valorMaximo: number,
  quantidadeDeNumeros: number
): number[] {
  const numeros: number[] = [];

  while (numeros.length < quantidadeDeNumeros) {
    const numero = Math.floor(Math.random() * valorMaximo);

    if (!numeros.includes(numero)) {
      numeros.push(numero);
    }
  }

  return numeros;
}

function calcularDisponibilidade(imoveis: ImovelDTO[]) {
  const total = imoveis.length;
  const imoveisDisponiveis = imoveis.filter(
    imoveis => imoveis.disponivel
  ).length;
  const imoveisAlugados = total - imoveisDisponiveis;
  const ocupacao = ((imoveisAlugados / total) * 100).toFixed(1);

  return { imoveis: total, imoveisDisponiveis, imoveisAlugados, ocupacao };
}

function calcularValores(valores: number[]) {
  let menor = 999999999;
  let maior = 0;
  let total = 0;

  valores.forEach(valor => {
    if (valor < menor) menor = valor;
    if (valor > maior) maior = valor;
    total += valor;
  });

  const media = total / valores.length;

  return {
    menor: formatarMoeda(menor),
    media: formatarMoeda(media),
    maior: formatarMoeda(maior),
  };
}

function calcularInformacoes(imoveis: ImovelDTO[]) {
  const disponibilidade = calcularDisponibilidade(imoveis);

  const valoresImoveisDisponiveis = imoveis
    .filter(imovel => imovel.disponivel)
    .map(imovel => imovel.preco);
  const {
    menor: menorValorDisponiveis,
    media: mediaValorDisponiveis,
    maior: maiorValorDisponiveis,
  } = calcularValores(valoresImoveisDisponiveis);

  const valoresImoveisAlugados = imoveis
    .filter(imovel => !imovel.disponivel)
    .map(imovel => imovel.preco);
  const {
    menor: menorValorAlugados,
    media: mediaValorAlugados,
    maior: maiorValorAlugados,
  } = calcularValores(valoresImoveisAlugados);

  return {
    ...disponibilidade,
    menorValorDisponiveis,
    mediaValorDisponiveis,
    maiorValorDisponiveis,
    menorValorAlugados,
    mediaValorAlugados,
    maiorValorAlugados,
  };
}

export { numerosAleatorios, calcularInformacoes };
