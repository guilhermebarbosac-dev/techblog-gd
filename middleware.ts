import { NextRequest, NextResponse } from 'next/server'

const routersToken = ['/home','/articles','/tags']
const routersPublic = ['/login', '/']
const routersAuth = ['/login/form']

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl

    const isRoutersToken = routersToken.some(route => 
        pathname.startsWith(route)
    )
    const isRoutersPublic = routersPublic.some(route => 
        pathname.startsWith(route)
    )
    const isRoutersAuth = routersAuth.some(route => 
        pathname.startsWith(route)
    )

    const token = request.cookies.get('x-token-session')?.value

    if(isRoutersToken && !token) {
        return NextResponse.redirect(new URL('/login/form', request.url))
    }

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