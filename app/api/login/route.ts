//IMPORTS DE LIBS, UTILS E OUTROS
import { generateHashPassword, generateSessionToken } from "@/lib/crypto";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

//ROTA DE AUTENTICAÇÃO
export async function POST(request: Request) {
    try {
    //DESCONSTRUÇÃO DO CORPO DA REQUISIÇÃO
    const body = await  request.json()
    const {email, password} = body

    //BUSCANDO USUARIO NO BANCO PELO EMAIL
    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    })

    //VALIDAÇÃO DE EXISTÊNCIA DO USUÁRIO CASO NÃO EXISTA RETORNA PARA O FRONTEND O ERRO E STATUS
    if (!user) {
        return NextResponse.json({ 
            error: 'Usuário não encontrado' }, 
            { status: 404 
        });
    }

    //GERAÇÃO DE HASH DA SENHA E ARMAZENAMENTO EM VARIAVEL
    const hashedPassword = generateHashPassword(password)

    //COMPARAÇÃO DA SENHA ENVIADA PELO USUÁRIO DEPOIS DE TRANSFORMADA COM A HASHEADA DO BANCO CASO FALSO RETORNA PARA O FRONTEND ERRO E STATUS
    if(user.password !== hashedPassword) {
        console.log(user.password, hashedPassword)
        return NextResponse.json({ 
            error: 'Invalid password' }, 
            { status: 401 
        });
    }

    //GERAÇÃO DE TOKEN HASH E ARMAZENAMENTO EM VARIAVEL
    const token = generateSessionToken()

    //GERAÇÃO DE DATA DE EXPIRAÇÃO DO TOKEN PARA 7 DIAS
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    //ARMAZENAMENTO DA SESSÃO NO BANCO DE DADOS
    const session = await db.session.create({
        data: {
            token,
            expiresAt,
            userId: user.id
        }
    })
    
    //RETORNO PARA O FRONTEND COM MENSAGEM, TOKEN, ID DO USUÁRIO , OBJETO DO USUÁRIO, DATA DE EXPIRAÇÃO E STATUS
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        token: session.token,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        expiresAt: session.expiresAt
      },
      { status: 200 }
    );

    //ARMAZENAMENTO DO TOKEN EM UM COOKIE DO NAVEGADOR PELA FUNÇÃO SET COOKIE
    response.cookies.set('x-token-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/'
    });

    //RETORNO DE SESSÃO E USUÁRIO PARA O FRONTEND
    return response;
    } catch (error) {
        //TRATAMENTO DE ERRO ENVIO PARA O FRONTEND COM ERRO E STATUS E ENVIO PARA O CONSOLE.
        console.log(error)
        return NextResponse.json(
            { error: 'Failed to create user' + error },
            { status: 500 }
        );
    }
}