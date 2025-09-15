/* eslint-disable @typescript-eslint/no-explicit-any */

//IMPORTS DE LIBS, HOOKS, COMPONENTS E UTILS
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { validateRequestToken } from "@/lib/utils";

//ROTA GET DE BUSCA DE ARTIGOS POR ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    //VALIDAÇÃO TOKEN
    const tokenValid = await validateRequestToken(request);
    //VERIFICA SE O TOKEN É VÁLIDO
    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }
    //TRATANDO PROMISE OU RESULTADO JÁ RESOLVIDO
    const resolvedParams = params instanceof Promise ? await params : params;
    const articleId = resolvedParams.id;

    //VALIDAÇÃO DE ID DO ARTIGO CASO NÃO ENVIADO RETORNA MENSAGEM E STATUS
    if (!articleId) {
      return NextResponse.json(
        {
          message: "ID do artigo deve ser passado.",
        },
        {
          status: 400,
        }
      );
    }

    //VARIAVÉL QUE ARMAZENA SELEÇÃO DO ARTIGO PELO ID
    const article = await db.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        author: true,
        comments: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    //VERIFICAÇÃO CASO O ARTIGO NÃO SEJA ENCONTRATO RETORNA MENSAGEM E STATUS
    if (!article) {
      return NextResponse.json(
        {
          message: "Artigo não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    //VARIÁVEL QUE TRANSFORMA O ARTIGO PARA O FORMATO QUE SERÁ ENVIADO AO FRONTEND
    const transformedArticle = {
      ...article,
      tags: article.tags.map((tagRelation) => tagRelation.tag.name),
    };

    //RETORNA O ARTIGO TRANSFORMADO COMO O FRONTEND ESPERA PARA RENDERIZAÇÃO
    return NextResponse.json(transformedArticle);
  } catch (error) {
    //TRATA O ERRO E EXIBE O MENSAGEM DE ERRO NO CONSOLE TAMBÉM RETORNANDO O ERRO COM MENSAGEM E STATUS PARA O FRONTEND
    console.error("Erro ao buscar artigo:", error);
    return NextResponse.json(
      {
        message: "Erro interno do servidor ao buscar o artigo.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      {
        status: 500,
      }
    );
  }
}

//ROTA DE ATUALIZAÇÃO DE UM ARTIGO POR ID
export async function PUT(
  request: NextRequest,
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
    const articleId = resolvedParams.id;

    //RECUPERAÇÃO DE DADOS DO BODY NO FORMATO JSON
    const body = await request.json();
    //ARMAZENAMENTO DE TODOS OS DADOS DO BODY EM UM ARRAY DESESTRUTURADO
    const { title, content, tagIds, avatar, userId } = body;

    //VALIDAÇÃO DE ID DO ARTIGO E RETORNO DE ERRO E STATUS CASO NÃO EXISTENTE
    if (!articleId) {
      return NextResponse.json(
        { error: "Id do artigo não informado" },
        { status: 400 }
      );
    }

    //VALIDAÇÃO DE TITULO E CONTEUDO E RETORNO DE ERRO E STATUS CASO NÃO EXISTENTE
    if (!title || !content) {
      return NextResponse.json(
        { error: "Título do artigo ou conteúdo não informado" },
        { status: 400 }
      );
    }

    //VALIDAÇÃO DE USUÁRIO E RETORNO DE ERRO E STATUS CASO NÃO EXISTENTE
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado ou não informado" },
        { status: 401 }
      );
    }

    //ARMAZENAMENTO DOS DADOS DO ARTIGO CASO ELE SEJA ENCONTRADO NO BANCO DE DADOS
    const existingArticle = await db.article.findUnique({
      where: { id: articleId },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    //VALIDAÇÃO CASO O ARTIGO NÃO SEJA ENCONTRADO E RETORNO DE ERRO E STATUS
    if (!existingArticle) {
      return NextResponse.json(
        { error: "Artigo não encontrato." },
        { status: 404 }
      );
    }

    //VALIDAÇÃO CASO O USUÁRIO NÃO SEJA O AUTOR DO ARTIGO E RETORNO DE ERRO E STATUS
    if (existingArticle.authorId !== userId) {
      return NextResponse.json(
        {
          error:
            "Você não tem permissão para atualizar este artigo. Ou não é o autor do artigo.",
        },
        { status: 403 }
      );
    }

    //VARIAVÉL DE CONSTRUÇÃO DE DADOS PARA ATUALIZAÇÃO NO BANCO DE DADOS
    const updateData: any = {
      title,
      content,
      avatar,
      updatedAt: new Date(),
    };

    //CONDIÇÃO PARA ATUALIZAÇÃO DAS TAGS VINCULADAS AO ARTIGO
    if (tagIds && Array.isArray(tagIds)) {
      updateData.tags = {
        deleteMany: {},
        create: tagIds.map((tagId: string) => ({
          tagId: tagId,
        })),
      };
    }

    //VARIAVÉL CONSTRUIDA PARA ATUALIZAÇÃO DO ARTIGO E RETORNAR O MESMO
    const updatedArticle = await db.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    //RETORNO DO ARTIGO ATUALIZADO COM MESSAGEM, ARRAY E STATUS PARA O FRONTEND
    return NextResponse.json(
      {
        message: "Artigo atualizado com sucesso!",
        article: updatedArticle,
      },
      { status: 200 }
    );
  } catch (error) {
    //TRATA O ERRO E EXIBE O MENSAGEM DE ERRO NO CONSOLE TAMBÉM RETORNANDO O ERRO COM MENSAGEM E STATUS PARA O FRONTEND
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//ROTA PARA EXCLUIR UM ARTIGO
export async function DELETE(
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
    const articleId = resolvedParams.id;

    //VARIAVÉL DE ARMAZENAMENTO DE ARTIGO DELETADO
    const deleteArticle = await db.article.delete({
      where: {
        id: articleId,
      },
    });

    //RETORNO DE ARTIGO DELETADO, VARIAVÉL DE VALIDAÇÃO E STATUS
    return NextResponse.json(
      {
        message: "Artigo excluído com sucesso!",
        deleteArticle,
      },
      { status: 200 }
    );
  } catch (error) {
    //TRATA O ERRO E EXIBE O MENSAGEM DE ERRO NO CONSOLE TAMBÉM RETORNANDO O ERRO COM MENSAGEM E STATUS PARA O FRONTEND
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete article" + error },
      { status: 500 }
    );
  }
}
