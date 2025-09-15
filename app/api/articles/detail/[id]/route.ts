//IMPORTS UTILS, LIBS E OUTROS
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { validateRequestToken } from "@/lib/utils";

//ROTA DE BUSCA DE ARTIGO DETALHADO POR ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //VALIDAÇÃO DO TOKEN
    const tokenValid = await validateRequestToken(request);

    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }
    //DESCONSTRUÇÃO DO PARAMETRO ENVIADO
    const { id: articleId } = await params;

    //VALIDAÇÃO DE EXISTÊNCIA DO ID ARTIGO E RETORNO DE MENSAGEM E STATUS PARA O FRONTEND
    if (!articleId) {
      return NextResponse.json(
        {
          message: "ID do artigo deve ser informado.",
        },
        {
          status: 400,
        }
      );
    }

    //BUSCANDO ARTIGO PELO ID
    const articleDetail = await db.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    //VALIDAÇÃO DE EXISTÊNCIA DO ARTIGO NO BANCO E RETORNO DE MENSAGEM E STATUS PARA O FRONTEND
    if (!articleDetail) {
      return NextResponse.json(
        {
          message: "Detalhes do artigo não encontrados.",
        },
        {
          status: 404,
        }
      );
    }

    //RETORNO PARA O FRONTEND DO OBJETO COMO É ESPERADO COM OS DETALHES DO ARTIGO
    return NextResponse.json(articleDetail);
  } catch (error) {
    //TRATAMENTO DE ERRO PASSANDO PARA FRONTEND A MENSAGEM , ERRO E STATUS E PARA O CONSOLE
    console.log(error);
    return NextResponse.json(
      {
        message: "Erro ao ler o arquivo de detalhes do artigo.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      {
        status: 500,
      }
    );
  }
}
