import { useAuthContext } from '@/hooks/useAuthContext';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

function AuthLayout() {
  const navegar = useNavigate();
  const { userId: userLogadoId } = useAuthContext();

  useEffect(() => {
    if (userLogadoId) {
      navegar('/');
    }
  }, [userLogadoId, navegar]);

  return (
    <div className="bg-paleta-primaria w-screen min-h-screen flex items-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
