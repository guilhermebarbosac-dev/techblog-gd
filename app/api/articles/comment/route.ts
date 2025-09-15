//IMPORTS DE UTILS, LIBS E ETC
import { db } from "@/lib/prisma";
import { validateRequestToken } from "@/lib/utils";
import { NextResponse } from "next/server";

//ROTA DE CRIAÇÃO DE COMENTÁRIO
export async function POST(request: Request) {
  try {
    //VALIDAÇÃO DO TOKEN
    const tokenValid = await validateRequestToken(request);

    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }
    //DESCONSTRUÇÃO DO CORPO DA REQUISIÇÃO
    const { commentText, articleId, authorId } = await request.json();

    //VERIFICA SE TODOS OS CAMPOS OBRIGATÓRIOS FORAM PREENCHIDOS
    if (!commentText || !articleId || !authorId) {
      return NextResponse.json(
        { error: "Dados faltantes: Comentário, Artigo e Autor." },
        { status: 400 }
      );
    }

    //BUSCANDO O ARTIGO MENCIONADO PELO ID
    const articleExists = await db.article.findUnique({
      where: {
        id: articleId,
      },
    });

    //VERIFICA SE O ARTIGO EXISTE
    if (!articleExists) {
      return NextResponse.json(
        { error: "Artigo não encontrado." },
        { status: 404 }
      );
    }
    //CRIAÇÃO DE COMENTÁRIO
    const createdComment = await db.comment.create({
      data: {
        content: commentText,
        articleId: articleId,
        authorId: authorId,
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

    //RETORNA O ARTIGO CRIADO COM SUCESSO COM MESSAGEM, ARRAY E STATUS DO MESMO PARA O FRONTEND
    return NextResponse.json(
      {
        message: "Comentário criado com sucesso!",
        comment: createdComment,
      },
      { status: 201 }
    );
  } catch (error) {
    //TRATAMENTO DE ERROS AO CRIAR O ARTIGO ENVIANDO PARA O CONSOLE E RETORNANDO PARA O FRONTEND COM MENSAGEM E STATUS
    console.error("Erro ao criar Comentário:", error);
    return NextResponse.json(
      {
        message: "Erro ao criar Comentário.",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
//ROTA DE ATUALIZAÇÃO DE UM COMENTÁRIO
export async function PUT(request: Request) {
  try {
    //VALIDAÇÃO DO TOKEN
    const tokenValid = await validateRequestToken(request);

    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }
    //DESCONTRUÇÃO DO CORPO DA REQUISIÇÃO
    const body = await request.json();
    const { commentId, content } = body;

    //VALIDAÇÃO DOS DADOS RECEBIDOS
    if (!commentId || !content) {
      return NextResponse.json(
        { error: "Dados faltantes: ID do comentário e conteúdo." },
        { status: 400 }
      );
    }
    //BUSCANDO O COMENTÃRIO MENCIONADO PELO ID
    const existingComment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    //VERIFICA SE O COMENTÃRIO EXISTE SENÃO RETORNA MENSAGEM E STATUS PARA O FRONTEND
    if (!existingComment) {
      return NextResponse.json(
        { error: "Comentário não encontrado." },
        { status: 404 }
      );
    }
    //ATUALIZA O COMENTÁRIO COM OS DADOS PASSADOS E ARMAZENA EM UMA VÁRIAVEL
    const updatedComment = await db.comment.update({
      where: {
        id: commentId,
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

    //RETORNA PARA O FRONTEND O COMENTÁRIO ATUALIZADO COM MESSAGEM, ARRAY E STATUS
    return NextResponse.json(
      {
        message: "Comentário atualizado com sucesso!",
        comment: updatedComment,
      },
      { status: 200 }
    );
  } catch (error) {
    //TRATAMENTO DE ERRO AO ATUALIZAR UM COMENTÁRIO ENVIANDO PARA O FRONTEND MESSAGEM E STATUS
    console.log(error);
    return NextResponse.json(
      {
        message: "Erro ao atualizar comentário.",
        error,
      },
      {
        status: 500,
      }
    );
  }
}

//ROTA DE DELETAR UM COMENTÁRIO
export async function DELETE(request: Request) {
  try {
    //VALIDAÇÃO DO TOKEN
    const tokenValid = await validateRequestToken(request);

    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }
    //DESCONSTRUÇÃO DOS DADOS DA REQUISIÇÃO
    const body = await request.json();
    const { commentId } = body;

    //RECUPERAÇÃO DO COMENTÁRIO PELO ID E ARMAZENAMENTO EM VARIAVÉL
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    //VALIDAÇÃO DE EXISTÊNCIA DO COMENTÁRIO E RETORNO PARA O FRONTEND COM MENSAGEM E STATUS CASO NÃO EXISTA
    if (!comment) {
      return NextResponse.json(
        { message: "Comentário não encontrado" },
        { status: 404 }
      );
    }

    //EXCLUSÃO DO COMENTÁRIO PAI E SUAS RESPOSTAS PELO ID
    if (comment.parentId) {
      await db.comment.delete({
        where: { id: commentId },
      });
    } else {
      await db.comment.deleteMany({
        where: { parentId: commentId },
      });

      await db.comment.delete({
        where: { id: commentId },
      });
    }

    //RETORNO PARA O FRONTEND COM MENSAGEM E STATUS
    return NextResponse.json(
      { message: "Comentário deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    //TRATAMENTO DE ERROS E RETORNO PARA O FRONTEND COM MENSAGEM E STATUS
    console.log(error);
    return NextResponse.json(
      {
        message: "Erro ao deletar comentário.",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
