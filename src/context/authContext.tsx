import { createContext, useEffect, useState } from 'react';

import { api } from '../api';

interface AuthContexto {
  token: string | null;
  username?: string | null;
  userId?: string | null;
  logar: (username: string, senha: string) => Promise<string>;
  deslogar: () => Promise<void>;
  isLoading: boolean;
}

type TRespostaLogin = {
  token: string;
  username: string;
  userId: string;
};

const AuthContext = createContext<AuthContexto>({
  token: null,
  username: null,
  userId: null,
  logar: async () => 'erro',
  deslogar: async () => {},
  isLoading: false,
});

interface IProps {
  children: React.ReactNode;
}

function SessionProvider({ children }: IProps) {
  const [isLoading, defineIsLoading] = useState<boolean>(false);
  const [token, defineToken] = useState<string | null>(null);
  const [username, defineUsername] = useState<string | null>(null);
  const [userId, defineUserId] = useState<string | null>(null);

  async function logar(username: string, senha: string) {
    const dados = {
      username,
      senha,
    };
    try {
      defineIsLoading(true);
      const response = await api.post('users/login', dados);

      const { token, username, userId } = response.data as TRespostaLogin;

      // IMPORTANTE 👇👇👇
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('auth.token', token);
      localStorage.setItem('auth.username', username);
      localStorage.setItem('auth.userId', userId);

      defineToken(token);
      defineUsername(username);
      defineUserId(userId);
      return 'sucesso';
    } catch (error) {
      console.error('Falha ao logar', error);
      return 'erro';
    } finally {
      defineIsLoading(false);
    }
  }

  async function deslogar() {
    defineIsLoading(true);
    defineToken(null);
    defineUsername(null);
    defineUserId(null);

    localStorage.removeItem('auth.token');
    localStorage.removeItem('auth.username');
    localStorage.removeItem('auth.userId');

    defineIsLoading(false);
  }

  useEffect(() => {
    async function loadStorage() {
      defineIsLoading(true);
      const tokenStorage = localStorage.getItem('auth.token');
      const nameStorage = localStorage.getItem('auth.username');
      const idStorage = localStorage.getItem('auth.userId');
      defineIsLoading(false);

      if (tokenStorage) {
        api.defaults.headers.common.Authorization = `Bearer ${tokenStorage}`;
        defineToken(tokenStorage);
        defineUsername(nameStorage);
        defineUserId(idStorage);
      }
    }
    loadStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, username, userId, logar, deslogar, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, SessionProvider };
