import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import '@/index.css';
import App from '@/pages/App.tsx';
import { Registro } from '@/pages/autenticacao/Registro';
import AuthLayout from '@/pages/layouts/AuthLayout';
import { SessionProvider } from './context/authContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />

          <Route element={<AuthLayout />}>
            <Route path="registro" element={<Registro />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </StrictMode>
);
