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
import { RecuperaSenha } from './pages/autenticacao/RecuperaSenha';
import { NovaSenha } from './pages/autenticacao/NovaSenha';
import NotFound from './pages/NotFound';
import { Pesquisa } from './pages/pesquisa/Pesquisa';
import { PaginaMapa } from './pages/mapa/PaginaMapa';
import { ImovelInfo } from './pages/imovel/ImovelInfo';
import DadosLayout from './pages/layouts/DadosLayout';
import { AluguelImovel } from './pages/imovel/AluguelImovel';

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
          <Route path="*" element={<NotFound />} />
          <Route element={<DadosLayout />}>
            <Route path="/perfil/:id" element={<Perfil />} />
            <Route path="/pesquisa" element={<Pesquisa />} />
            <Route path="/mapa" element={<PaginaMapa />} />
            <Route path="/imovel/editar" element={<EditarImovel />} />
            <Route path="/imovel/:id" element={<ImovelInfo />} />
            <Route path="/imovel/alugar/:id" element={<AluguelImovel />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>
);
