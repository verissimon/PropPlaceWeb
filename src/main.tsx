import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import '@/index.css';
import App from '@/pages/App.tsx';
import { Registro } from '@/pages/autenticacao/Registro';
import AuthLayout from '@/pages/layouts/AuthLayout';
import { Perfil } from '@/pages/perfil/Perfil';

import { SessionProvider } from './context/authContext';
import { Login } from './pages/autenticacao/Login';
import { RecuperaSenha } from './pages/autenticacao/RecuperaSenha';
import { NovaSenha } from './pages/autenticacao/NovaSenha';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />

          <Route element={<AuthLayout />}>
            <Route path="registro" element={<Registro />} />
            <Route path="login" element={<Login />} />
            <Route path="recupera-senha" element={<RecuperaSenha />} />
            <Route path="nova-senha/:token" element={<NovaSenha />} />
          </Route>

          <Route path="/perfil/:id" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>
);
