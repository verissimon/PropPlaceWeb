import { DadosProvider } from '@/context/dadosContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

function DadosLayout() {
  const navegar = useNavigate();
  const { userId: userLogadoId } = useAuthContext();

  useEffect(() => {
    if (!userLogadoId) {
      navegar('/login');
    }
  }, [userLogadoId, navegar]);

  return (
    <DadosProvider>
      <Outlet />
    </DadosProvider>
  );
}

export default DadosLayout;
