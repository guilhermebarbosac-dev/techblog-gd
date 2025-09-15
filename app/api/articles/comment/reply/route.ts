//IMPORTS DE UTILS, LIBS E OUTROS
import { db } from "@/lib/prisma"
import { validateRequestToken } from "@/lib/utils"
import { NextResponse } from "next/server"

//ROTA DE CRIAÇÃO DE UMA RESPOSTA
export async function POST(request: Request){
    try {
        //VALIDAÇÃO DO TOKEN
        const tokenValid = await validateRequestToken(request)
    
        if(!tokenValid.validate){
            return NextResponse.json(
            {message: tokenValid.error}, 
            { status: 401 },
        )
        }

        //DESCONSTRUÇÃO DO CORPO DA REQUISIÇÃO
        const body = await request.json()
        const {articleId, content, authorId, commentId} = body
        
        //VALIDAÇÃO DOS DADOS OBRIGATÓRIOS PARA A CRIAÇÃO
        if( !content || !authorId || !articleId || !commentId){
            return NextResponse.json (
                {error: 'Dados faltantes: Comentário, Artigo e Autor.'},
                {status: 400}
            )
        }
        
        //VERIFICA SE O ARTIGO EXISTE E ARMAZENA O RETORNO EM UMA VARIAVÉL
        const articleExists = await db.article.findUnique({
            where: {id: articleId}
        })

        //VALIDAÇÃO CASO O ARTIGO NÃO SEJA ENCONTRADO
        if (!articleExists) {
            return NextResponse.json(
                { error: 'Artigo não encontrado.' },
                { status: 404 }
            );
        }

        //VERIFICAÇÃO SE O COMENTÁRIO PAI EXISTE
        if (commentId) {
            const parentCommentExists = await db.comment.findUnique({
                where: {
                    id: commentId
                }
            });
            
            //VERIFICA SE O COMENTÁRIO PAI EXISTE
            if (!parentCommentExists) {
                return NextResponse.json(
                    { error: 'Comentário pai não encontrado.' },
                    { status: 404 }
                );
            }
        }

        //CRIAÇÃO DA RESPOSTA DO COMENTÁRIO E ARMAZENAMENTO EM VARIAVÉL
        const createReply = await db.comment.create({
            data: {
                content: content,
                articleId: articleId,
                authorId: authorId,
                parentId: commentId || null
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })
        
        //RETORNO DA RESPOSTA PARA O FRONTEND COM MENSAGEM, ARRAY E STATUS
        return NextResponse.json({
            message: 'Resposta criado com sucesso.',
            comment: createReply
        }, { status: 201 });

    } catch (error) {
        //TRATAMENTO DE ERRO E RETORNO PARAO FRONTEND COM MENSAGEM E STATUS E CONSOLE
        console.error('Erro ao criar Resposta:', error);
        return NextResponse.json({ 
            message: 'Erro ao criar Resposta.', error 
            }, { 
            status: 500 
        });
    }
}