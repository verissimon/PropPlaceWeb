import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import '@/index.css';
import App from '@/pages/App.tsx';
import { Registro } from '@/pages/autenticacao/Registro';
import AuthLayout from '@/pages/layouts/AuthLayout';
import { Perfil } from '@/pages/perfil/Perfil';
import { EditarImovel } from '@/pages/imovel/EditarImovel';

import { SessionProvider } from './context/authContext';
import { Login } from './pages/autenticacao/Login';
import NotFound from './pages/NotFound';
import { Pesquisa } from './pages/pesquisa/Pesquisa';
import { PaginaMapa } from './pages/mapa/PaginaMapa';
import { ImovelInfo } from './pages/imovel/ImovelInfo';
import { DadosProvider } from './context/dadosContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />

          <Route element={<AuthLayout />}>
            <Route path="registro" element={<Registro />} />
            <Route path="login" element={<Login />} />
          </Route>
          <DadosProvider>
            <Route path="/perfil/:id" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/pesquisa" element={<Pesquisa />} />
            <Route path="/mapa" element={<PaginaMapa />} />
            <Route path="/imovel/editar" element={<EditarImovel />} />
            <Route path="/imovel/:id" element={<ImovelInfo />} />
          </DadosProvider>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>
);
