//IMPORTS DE LIBS E OUTROS
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "./prisma";

//FUNÇÃO PARA COMPONENTIZAÇÃO QUE PERMITE UTILIZAR CLASSNAMES CUSTOMIZADOS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//FUNÇÃO QUE REALIZA A FORMATAÇÃO DO TEMPO DE POSTAGEM PARA ARTIGOS, COMENTÁRIO E RESPOSTAS DO TIPO ASSOCIADO AO MOCKUP FORNECIDO
export function formatTimeAgo(date: string | Date): string {
  //VARIAVEL QUE ARMAZENA A DATA ATUAL, DATA FUTURA E DIFERENÇA ENTRE AS DATAS
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  //VARIAVEIS QUE ARMAZENA A DIFERENÇA EM SEGUNDOS, MINUTOS, HORAS, DIAS MESES E ANOS
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  //VALIDAÇÃO PARA RETORNAR O TEMPO FORMATADO CORRETAMENTE CONFORME POSTADO EM SEGUNDOS, MINUTOS, HORAS, DIAS, MESES E ANOS
  if (diffInYears > 0) {
    return `${diffInYears} ano${diffInYears > 1 ? "s" : ""} atrás`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} mês${diffInMonths > 1 ? "es" : ""} atrás`;
  } else if (diffInDays > 0) {
    return `${diffInDays} dia${diffInDays > 1 ? "s" : ""} atrás`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} atrás`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""} atrás`;
  } else {
    return "agora mesmo";
  }
}

//FUNÇÃO DE VALIDAÇÃO DO TOKEN PARA AS APIS
export async function validateRequestToken(request: Request) {
  //BUSCA TOKEN NO HEADER
  const cookieHeader = request.headers.get("cookie");
  let token = null;

  //PESQUISA PELO TOKEN NO BANCO DE DADOS
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith("x-token-session=")
    );
    if (tokenCookie) {
      token = tokenCookie.split("=")[1];
    }
  }

  //VALIDA SE EXISTE TOKEN NO Bearer HEADER
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  //VALIDA SE EXISTE TOKEN NO HEADER SENAO RETORNA
  if (!token) {
    return {
      validate: false,
      error: "Token de autenticação não encontrado",
    };
  }

  //VERIFICA NO BANCO DE DADOS O TOKEN E ARMAZENA EM UMA VARIAVEL
  const session = await db.session.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  //CASO NÃO ENCONTRE OU NÃO DE MATCH ELE RETORNA PASSANDO VALIDATE E ERRO
  if (!session) {
    return { validate: false, error: "Token inválido" };
  }

  //VERIFICA SE A SESSÃO EXPIROU
  if (session.expiresAt < new Date()) {
    await db.session.delete({
      where: {
        id: session.id,
      },
    });
    return {
      validate: false,
      error: "Token expirado",
    };
  }

  //RETORNA CASO TUDO ESTEJA OK
  return {
    validate: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      avatar: session.user.avatar,
    },
    session,
  };
}
