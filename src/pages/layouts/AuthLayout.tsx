import { Outlet } from 'react-router';

function AuthLayout() {
  // lógica de redirecionamento aqui
  return (
    <div className="bg-paleta-primaria">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
