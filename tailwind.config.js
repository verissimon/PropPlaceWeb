/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paleta: {
          primaria: '#99BFC6',
          secundaria: '#554348',
          terciaria: '#8C9A9E',
          auxiliar: '#747578',
          fundo: '#E6FFFF',
          construtiva: '#83AB63',
          destrutiva: '#D35252',
          branca: '#FFFFFF',
          preta: '#000000',
        },
      },
      fontSize: {
        t40: '40px',
        t36: '36px',
        t32: '32px',
        t28: '28px',
        t24: '24px',
        t20: '20px',
        t16: '16px',
        t14: '14px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
