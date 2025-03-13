import { DadosProvider } from '@/context/dadosContext';
import { Outlet } from 'react-router';

function DadosLayout() {
  // lógica de redirecionamento aqui
  return (
    <DadosProvider>
      <Outlet />
    </DadosProvider>
  );
}

export default DadosLayout;
