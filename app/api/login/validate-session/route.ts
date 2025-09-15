//IMPORTS LIBS E OUTROS
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

//ROTA DE VALIDAÇÃO DE SESSÃO DO USUÁRIO
export async function POST(request: Request) {
  try {
    //TENTATIVA DE OBTER TOKEN DO BODY OU DOS COOKIES
    let token = null;

    try {
      const body = await request.json();
      token = body.token;
    } catch (error) {
      console.error(error);
    }

    //SE O TOKEN NÃO FOR ENCONTRADO NO BODY, TENTA PEGAR DOS COOKIES
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        const tokenCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("x-token-session=")
        );
        if (tokenCookie) {
          token = tokenCookie.split("=")[1];
        }
      }
      return NextResponse.json(
        { validate: false, error: "Token é obrigatório" },
        { status: 400 }
      );
    }

    //VERIFICAÇÃO SE A SESSÃO EXISTE BUSCANDO PELO TOKEN E ARMAZENA
    const session = await db.session.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    //VALIDAÇÃO SE A SESSÃO EXISTE CASO NÃO EXISTA ENVIA PARA O FRONTEND A VARIAVÉL ESPERADA E ERRO
    if (!session) {
      return NextResponse.json({ 
        validate: false, 
        error: "Token inválido" 
      },
      { status: 401 }
    );
    }

    //VALIDAÇÃO SE O TOKEN ESTÁ VENCIDO, CASO ESTEJA DELETAMOS A SESSÃO E ENVIAMOS UMA MENSAGEM AO FRONTEND INFORMANDO QUE O TOKEN ESTÁ EXPIRADO
    if (session.expiresAt < new Date()) {
      //DELETAÇÃO DA SESSÃO EXPIRADA
      await db.session.delete({
        where: {
          id: session.id,
        },
      });
      return NextResponse.json(
        { validate: false, error: "Token expirado" },
        { status: 401 }
      );
    }

    //RETORNO PARA O FRONTEND COM SESSÃO VÁLIDA E OBJETO DE USUÁRIO
    return NextResponse.json({
      validate: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.avatar,
      },
      session,
    });
  } catch (error) {
    //TRATAMENTO DE ERRO PARA O FRONTEND E CONSOLE ENVIANDO PARA O FRONT A VARIAVÉL VALIDATE, ERRO E STATUS
    console.error("Erro na validação do token:", error);
    return NextResponse.json(
      { validate: false, error: "Erro na validação do token" },
      { status: 500 }
    );
  }
}
