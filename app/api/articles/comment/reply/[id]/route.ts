//IMPORTS DE LIBS, UTILS E OUTROS
import { db } from "@/lib/prisma"
import { validateRequestToken } from "@/lib/utils"
import { NextResponse } from "next/server"


//ROTA PARA DELETAR UMA RESPOSTA POR ID
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        //VALIDAÇÃO DO TOKEN
        const tokenValid = await validateRequestToken(request)
    
        if(!tokenValid.validate){
            return NextResponse.json(
            {message: tokenValid.error}, 
            { status: 401 },
        )
        }

        //TRATANDO PROMISE OU RESULTADO NÃO RESOLVIDO
        const resolvedParams = params instanceof Promise ? await params : params;
        const replyId = resolvedParams.id;

        //BUSCANDO A RESPOSTA NO BANCO DE DADOS PELO ID
        const reply = await db.comment.findUnique({
            where: { id: replyId }
        });

        //VERIFICANDO SE A RESPOSTA EXISTE NO BANCO DE DADOS
        if (!reply) {
            return NextResponse.json({ 
                message: 'Resposta não encontrada' }, 
                { status: 404 }
            );
        }

        //VERIFICANDO SE É UMA RESPOSTA VÁLIDA  (SE É UMA RESPOSTA)
        if (!reply.parentId) {
            return NextResponse.json({ 
                message: 'Este não é uma resposta válida' }, 
                { status: 400 
                
            });
        }

        //DELETA A RESPOSTA NO BANCO DE DADOS
        await db.comment.delete({
            where: { id: replyId }
        });

        //RETORNA PARA O FRONTEND COM MENSAGEM E STATUS
        return NextResponse.json({ 
            message: 'Resposta deletada com sucesso' }, 
            { status: 200 
        });

    } catch(error) {
        return NextResponse.json({ 
            message: 'Erro ao deletar resposta.', error 
        }, { 
            status: 500 
        });
    }
}