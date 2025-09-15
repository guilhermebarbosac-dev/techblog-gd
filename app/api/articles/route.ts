//IMPORTS DE UTILS, LIBS E OUTROS
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { validateRequestToken } from "@/lib/utils";

//ROTA DE BUSCA DE ARTIGO
export async function GET() {
  try {
    //BUSCA DE TODOS OS ARTIGOS E ARMAZENAMENTO EM UMA VARIÁVEL
    const articles = await db.article.findMany({
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

    //FUNÇÃO QUE TRANSFORMA O RESULTADO DA BUSCA EM UM OBJETO ESPERADO PELO FRONTEND
    const transformedArticles = articles.map((article) => ({
      ...article,
      author: {
        id: article.author.id,
        name: article.author.name,
        avatar: article.author.avatar,
      },
      tags: article.tags.map((tagRelation) => tagRelation.tag.name),
    }));

    //VERIFICA SE A BUSCA RETORNOU ALGUM RESULTADO SENAO ENVIA PARA O FRONTEND UM RETORNO COM MESSAGEM E STATUS
    if (articles.length === 0) {
      return NextResponse.json(
        {
          message: "Nenhum artigo encontrado.",
        },
        {
          status: 200,
        }
      );
    }
    //RETORNA PARA O FRONTEND TODOS OS ARTIGOS COM O OBJETO ESPERADO
    return NextResponse.json(transformedArticles);
  } catch (error) {
    //TRATAMENTO DE ERROS ENVIO PARA O FRONTEND COM MENSAGEM E STATUS E ENVIO PARA O CONSOLE
    console.log(error);
    return NextResponse.json(
      {
        message: "Erro ao buscar os artigos.",
        error,
      },
      {
        status: 500,
      }
    );
  }
}

//ROTA PARA CRIAR UM NOVO ARTIGO
export async function POST(request: NextRequest) {
  try {
    //VALIDAÇÃO DO TOKEN
    const tokenValid = await validateRequestToken(request);

    if (!tokenValid.validate) {
      return NextResponse.json({ message: tokenValid.error }, { status: 401 });
    }

    //DESCONSTRUÇÃO DO CORPO DA REQUISIÇÃO
    const body = await request.json();
    const { title, content, tagIds, avatar, authorId } = body;

    //VALIDAÇÃO DOS DADOS OBRIGATÓRIOS PARA A CRIAÇÃO
    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Título, conteúdo e autor são obrigatórios." },
        { status: 400 }
      );
    }

    //VERIFICA SE PELO MENOS UMA TAG FOI SELECIONADA SENÃO RETORNA PARA O FRONT ERRO E STATUS
    if (!tagIds || tagIds.length === 0) {
      return NextResponse.json(
        { error: "Pelo menos uma tag deve ser selecionada." },
        { status: 400 }
      );
    }

    //CONSTRUÇÃO DE OBJETO PARA CRIAÇÃO
    const createArticle = {
      title,
      content,
      avatar,
      authorId,
      tags: {
        create:
          tagIds?.map((tagId: string) => ({
            tagId: tagId,
          })) || [],
      },
    };

    //CRIAÇÃO DO ARTIGO E ARMAZENAMENTO EM VARIAVÉL
    const result = await db.article.create({
      data: createArticle,
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    //RETORNA O ARTIGO COMO O FRONTEND ESPERA PARA RENDERIZAÇÃO COM MESSAGEM E STATUS
    return NextResponse.json(
      { message: "Artigo criado com sucesso", result },
      { status: 201 }
    );
  } catch (error) {
    //TRATAMENTO DE ERRO E ENVIO PARA O FRONTEND COM ERRO E STATUS E PARA O CONSOLE
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
