//IMPORTS DE LIBS, UTILS E OUTROS
import { db } from "@/lib/prisma";
import { validateRequestToken } from "@/lib/utils";
import { NextResponse } from "next/server";

//ROTA PARA ATUALIZAR UMA RESPOSTA DE UM COMENTÁRIO POR ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    //VALIDAÇÃO DO TOKEN
    const tokenValid = await validateRequestToken(request);

    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }
    //TRATANDO PROMISE OU RESULTADO NÃO RESOLVIDO
    const resolvedParams = params instanceof Promise ? await params : params;
    const replyId = resolvedParams.id;

    //DESCONSTRUÇÃO DO CORPO DA REQUISIÇÃO
    const body = await request.json();
    const { content } = body;

    //VALIDAÇÃO DE ID DA RESPOSTA E RETORNO DE ERRO E STATUS CASO NÃO EXISTENTE
    if (!replyId || !content) {
      return NextResponse.json(
        { error: "Dados faltantes: ID da resposta e conteúdo." },
        { status: 400 }
      );
    }

    //BUSCA A RESPOSTA E ARMAZENA EM UMA VARIAVÉL
    const existingReply = await db.comment.findUnique({
      where: {
        id: replyId,
      },
    });

    //VALIDAÇÃO DA EXISTÊNCIA DA RESPOSTA CASO NÃO EXISTA RETORNA PARA O FRONTEND COM ERRO E STATUS
    if (!existingReply) {
      return NextResponse.json(
        { error: "Resposta não encontrada." },
        { status: 404 }
      );
    }

    //VALIDAÇÃO DA EXISTÊNCIA DO COMENTÁRIO PAI CASO NÃO EXISTA RETORNA PARA O FRONTEND COM ERRO E STATUS
    if (!existingReply.parentId) {
      return NextResponse.json(
        { error: "Este não é uma resposta válida." },
        { status: 400 }
      );
    }

    //ATUALIZAÇÃO DA RESPOSTA NO BANCO DE DADOS E ARMAZENAMENTO DA VARIAVÉL
    const updatedReply = await db.comment.update({
      where: {
        id: replyId,
      },
      data: {
        content: content,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    //RETORNO PARA O FRONTEND COM MENSAGEM, ARRAY E STATUS
    return NextResponse.json(
      {
        message: "Resposta atualizada com sucesso!",
        comment: updatedReply,
      },
      { status: 200 }
    );
  } catch (error) {
    //TRATAMENTO DE ERROS E RETORNO PARA O FRONTEND COM MENSAGEM E STATUS E RETORNO PARA CONSOLE
    console.error("Erro ao atualizar resposta:", error);
    return NextResponse.json(
      {
        message: "Erro ao atualizar resposta.",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
