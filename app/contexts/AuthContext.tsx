"use client";
//IMPORTS DE TYPES E HOOKS
import { AuthContextType, User } from '@/lib/types';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

//TIPAGEM DA VARIAVÉL DE CONTEXTO PARA AUTENTICAÇÃO
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//FUNÇÃO PARA PROVER O CONTEXTO DE AUTENTICAÇÃO
export function AuthProvider({ children }: { children: ReactNode }) {
  //VARIAVÉIS DE ESTADO PARA ARMAZENAR O USUÁRIO E O ESTADO DE CARREGAMENTO
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //FUNÇÃO AUXILIAR PARA LER COOKIES DE FORMA MAIS ROBUSTA
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      }
    }
    return null;
  };

  //FUNÇÃO PARA BUSCAR O USUÁRIO ATUAL
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      //TENTA BUSCAR O TOKEN DO USUÁRIO NO COOKIE USANDO A FUNÇÃO AUXILIAR
      const token = getCookie('x-token-session');
      const userId = getCookie('x-current-user');;

      //SE NÃO ENCONTRAR, TENTA VALIDAR VIA API
      if (!token || !userId) {
        try {
          const response = await fetch('/api/login/validate-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.validate && data.user) {
              setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.avatar
              });
              setLoading(false);
              return;
            } else {
              //SESSÃO INVALIDA OU EXPIRADA - LIMPA O ESTADO
              console.log('Sessão inválida ou expirada:', data.error);
              setUser(null);
              setLoading(false);
              return;
            }
          } else {
            //ERRO NA RESPOSTA - LIMPA O ESTADO
            console.log('Erro na validação da sessão');
            setUser(null);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('Erro na validação via API:', apiError);
          setUser(null);
          setLoading(false);
          return;
        }
      }

      //VALIDA VIA API O TOKEN PARA VER SE AINDA É VÁLIDO
      try {
        const response = await fetch('/api/login/validate-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.validate && data.user) {
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.avatar
            });
          } else {
            //TOKEN EXPIRADO OU INVÁLIDO - LIMPA O ESTADO
            console.log('Token expirado ou inválido:', data.error);
            setUser(null);
            //LIMPA OS COOKIES CASO INVÁLIDO
            if (typeof document !== 'undefined') {
              document.cookie = 'x-token-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
              document.cookie = 'x-current-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            }
          }
        } else {
          //ERRO NA VALIDAÇÃO - LIMPA O ESTADO
          console.log('Erro na validação do token');
          setUser(null);
          if (typeof document !== 'undefined') {
            document.cookie = 'x-token-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'x-current-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          }
        }
      } catch (validationError) {
        console.log('Erro na validação do token:', validationError);
        setUser(null);
        if (typeof document !== 'undefined') {
          document.cookie = 'x-token-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          document.cookie = 'x-current-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
      }
    } catch (error) {
      //TRATAMENTO DE ERRO E IMPRESSÃO NO CONSOLE.
      console.error('Erro ao obter usuário atual:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //FUNÇÃO QUE FAZ A REQUISIÇÃO PARA O SERVIDOR PARA ARMAZENAR O USUÁRIO QUE VAI SER LOGADO
  const login = (userData: User) => {
    setUser(userData);
  };

  //FUNÇÃO PARA FAZER LOGOUT
  const logout = async (): Promise<boolean> => {
    try {
      //CHAMA A API PARA EXPIRAR A SESSÃO
      const response = await fetch('/api/login/session-expired', {
        method: 'DELETE'
      });

      //LIMPA O ESTADO DO USUÁRIO
      setUser(null);

      //REMOVE OS COOKIES DO NAVEGADOR
      if (typeof document !== 'undefined') {
        document.cookie = 'x-token-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'x-current-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }

      return response.ok;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      //CASO A API FALHE LIMPA OS COOKIES DIRETAMENTE
      setUser(null);
      if (typeof document !== 'undefined') {
        document.cookie = 'x-token-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'x-current-user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
      return false;
    }
  };

  //HOOK DE EFEITO PARA BUSCAR O USUÁRIO ATUAL
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loading, fetchCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//EXPORTA A FUNÇÃO DE CONTEXTO PARA SER USADA EM OUTROS COMPONENTES RETORNANDO OS DADOS DO USUÁRIO PARA OS USE CLIENTS
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    //RETORNA ERRO COM MENSAGEM DE ALERTA PARA USO DE USEAUTH DENTRO DE UM AUTHPROVIDER NA MAIN
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  //RETORNA O CONTEXTO COM OS DADOS DO USUÁRIO
  return context;
}