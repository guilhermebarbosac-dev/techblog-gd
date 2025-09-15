//IMPORTS LIBS, UTILS E OUTROS
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//ROTA DE DELEÇÃO DE SESSÃO DO USUÁRIO
export async function DELETE() {
  try {
    //COOKIE COM O TOKEN DE SESSÃO
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get("x-token-session")?.value;

    //VERIFICAÇÃO SE HÁ ALGUMA SESSÃO ATIVA COM O TOKEN PASSADO
    if (!tokenCookie) {
      return NextResponse.json(
        { error: "Nenhuma sessão encontrada" },
        { status: 400 }
      );
    }

    const expired = await db.session.findUnique({
      where: { token: tokenCookie },
    });

    //SE NÃO HOUVER NENHUMA SESSÃO ENCONTRADA COM O TOKEN PASSADO, RETORNAMOS UMA MENSAGEM AO FRONTEND INFORMANDO QUE A SESSÃO JÁ ESTAVA EXPIRADA
    if (!expired) {
      const response = NextResponse.json(
        { error: "Sessão expirada" },
        { status: 200 }
      );
      //DELETA O COOKIE DO NAVEGADOR
      response.cookies.delete("x-token-session");
      response.cookies.delete("x-current-user");
      return response;
    }

    //CASO CONTRARIO, SE EXISTA UMA SESSÃO COM O TOKEN PASSADO, DELETAMOS Essa sessão no banco de dados
    await db.session.delete({
      where: { token: tokenCookie },
    });

    //RETORNO PARA O FRONTEND INFORMANDO QUE A SESSÃO FOI ENCERRADA COM SUCESSO COM MESSAGEM E STATUS
    const response = NextResponse.json(
      { message: "Sessão encerrada com sucesso" },
      { status: 200 }
    );
    //DELETAÇÃO DO COOKIE NO NAVEGADOR
    response.cookies.delete("x-token-session");
    response.cookies.delete("x-current-user");
    //RETORNA PARA O FRONTEND COM MENSAGEM E STATUS
    return response;
  } catch (error) {
    //TRATAMENTO DE ERRO PARA O FRONTEND E CONSOLE RETORNANDO ERRO E STATUS PARA O FRONT E CONSOLE
    console.error(error);
    return NextResponse.json({ error: "erro no logout" }, { status: 500 });
  }
}
