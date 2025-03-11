import { Outlet } from 'react-router';

function AuthLayout() {
  // lógica de redirecionamento aqui
  return (
    <div className="bg-paleta-primaria w-screen min-h-screen flex items-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
