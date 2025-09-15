//IMPORTS LIBS E OUTROS
import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

//ROTA DE VALIDAÇÃO DE SESSÃO DO USUÁRIO
export async function POST(request: Request) { 

    try {
        //DESCONSTRUÇÃO DE OBJETO DA REQUISIÇÃO
        const body = await request.json()
        const token = body.token

        //VALIDAÇÃO SE O TOKEN FOI PASSADO
        if(!token) {
            return NextResponse.json(
                {validate: false, error: "Token é obrigatório"}, 
                {status: 400}
            )
        }

        //VERIFICAÇÃO SE A SESSÃO EXISTE
        const session = await db.session.findUnique({
          where: {
            token
          },
          include: {
            user: true
          }
        })
        
        //VALIDAÇÃO SE A SESSÃO EXISTE CASO NÃO EXISTA ENVIA PARA O FRONTEND A VARIAVÉL ESPERADA E ERRO
        if(!session) {
          return NextResponse.json({validate: false, error: 'Token inválido'})
        }

        //VALIDAÇÃO SE O TOKEN ESTÁ VENCIDO, CASO ESTEJA DELETAMOS A SESSÃO E ENVIAMOS UMA MENSAGEM AO FRONTEND INFORMANDO QUE O TOKEN ESTÁ EXPIRADO
        if(session.expiresAt < new Date()) {
          //DELETAÇÃO DA SESSÃO EXPIRADA
          await db.session.delete({
            where: {
              id: session.id
            }  
          })
          return NextResponse.json(
            {validate: false, error: 'Token expirado'},
            {status: 401}
          )
        }
        
        //RETORNO PARA O FRONTEND COM SESSÃO VÁLIDA E OBJETO DE USUÁRIO
        return NextResponse.json({
          validate: true,
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.avatar
          },
          session
        })
      } catch (error) {
        //TRATAMENTO DE ERRO PARA O FRONTEND E CONSOLE ENVIANDO PARA O FRONT A VARIAVÉL VALIDATE, ERRO E STATUS
        console.error('Erro na validação do token:', error)
        return NextResponse.json(
            {validate: false,error: 'Erro na validação do token'},
            {status: 500}
        )
      }
}