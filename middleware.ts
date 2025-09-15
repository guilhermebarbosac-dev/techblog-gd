import { NextRequest, NextResponse } from 'next/server'

//ARRAY DE ROTAS QUE NECESSITAM DE TOKEN, PUBLICAS E ROTA DE AUTENTICAÇÃO
const routersToken = ['/home','/articles','/tags']
const routersPublic = ['/login', '/']
const routersAuth = ['/login/form']

//FUNÇÃO DE MIDDLEWARE PARA VALIDAR O TOKEN E PERMISSÃO DE ROTAS
export async function middleware(request: NextRequest) {
    //VERIFICA A ROTA ATUAL
    const {pathname} = request.nextUrl
    //VERIFICA SE A ROTA ATUAL É UMA ROTA QUE NECESSITA DE TOKEN
    const isRoutersToken = routersToken.some(route => 
        pathname.startsWith(route)
    )
    //VERIFICA SE A ROTA ATUAL É UMA ROTA PUBLICA
    const isRoutersPublic = routersPublic.some(route => 
        pathname.startsWith(route)
    )
    //VERIFICA SE A ROTA ATUAL É A ROta DE AUTENTICAÇÃO
    const isRoutersAuth = routersAuth.some(route => 
        pathname.startsWith(route)
    )

    //RECUPERA O TOKEN DO COOKIE DO NAVEGADOR
    const token = request.cookies.get('x-token-session')?.value

    //VALIDAÇÃO SE A ROTA É PUBLICA E NÃO EXISTE O TOKEN E DIRECIONA PARA A PÁGINA DE LOGIN
    if(isRoutersToken && !token) {
        return NextResponse.redirect(new URL('/login/form', request.url))
    }

    //VALIDAÇÃO SE O TOKEN EXISTE
    if(token) {
        try {
            
            const session = await fetch(`${process.env.NEXT_PUBLIC_APP_URL_API}/login/validation-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token
                })
            })

            const sessionValidate = await session.json()

            if(!sessionValidate.validate) {
                const response = NextResponse.redirect(new URL('/login/form', request.url))
                response.cookies.delete('x-token-session')
                return response
            }

            if(isRoutersAuth){
                return NextResponse.redirect(new URL('/home', request.url))
            }
        } catch (error) {
            console.error(error)
            const response = NextResponse.redirect(new URL('/login/form', request.url))
            response.cookies.delete('x-token-session')
            return response
        }
    }
    //VALIDAÇÃO SE A ROTA É PUBLICA, CASO SIM RETORNA O NEXT
    if(isRoutersPublic) {
        return NextResponse.next()
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}