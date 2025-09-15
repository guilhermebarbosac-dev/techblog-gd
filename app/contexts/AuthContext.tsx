"use client";

import { AuthContextType, User } from '@/lib/types';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
//TIPAGEM DA VARIAVÉL DE CONTEXTO PARA AUTENTICAÇÃO
const AuthContext = createContext<AuthContextType | undefined>(undefined);
//FUNÇÃO PARA PROVER O CONTEXTO DE AUTENTICAÇÃO
export function AuthProvider({ children }: { children: ReactNode }) {
  //VARIAVÉIS DE ESTADO PARA ARMAZENAR O USUÁRIO E O ESTADO DE CARREGAMENTO
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //FUNÇÃO ASSÍNCRONA PARA BUSCAR O USUÁRIO ATUAL
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      //TENTA BUSCAR O TOKEN DO USUÁRIO NO COOKIE
      let token = null;
      if (typeof document !== 'undefined') {
        const cookieString = document.cookie;
        const tokenCookie = cookieString.split(';').find(cookie => cookie.trim().startsWith('x-token-session='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }

      //SE NÃO ENCONTRAR, DESLOGA O USUÁRIO E RETORNA
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      //SE ENCONTRAR, CHAMA A API PARA VALIDAR A SESSÃO E RECUPERAR OS DADOS DO USUÁRIO
      const response = await fetch('/api/login/validate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });
      //SE A RESPOSTA FOR CONTRÁRIA A OK O USUÁRIO É SETADO COMO NULO E O LOADING É SETADO COMO FALSE
      if (!response.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      //SE A RESPOSTA FOR OK, PUXA OS DADOS DO USUÁRIO E ARMAZENA EM DATA
      const data = await response.json();

      //VERIFICA SE O USUÁRIO É VÁLIDO
      if (!data.validate) {
        setUser(null);
        setLoading(false);
        return;
      }
      //SE O USUÁRIO É VÁLIDO ARMAZENA OS DADOS DELE NA VARIAVÉL USER
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar
      });

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
  
  //CARREGA O USUÁRIO ATUAL
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loading, fetchCurrentUser }}>
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