import { NextRequest, NextResponse } from "next/server";

//ARRAY DE ROTAS QUE NECESSITAM DE TOKEN, PUBLICAS E ROTA DE AUTENTICAÇÃO
const routersToken = ["/home", "/articles", "/tags"];
const routersPublic = ["/login", "/"];
const routersAuth = ["/login/form"];

//FUNÇÃO DE MIDDLEWARE PARA VALIDAR O TOKEN E PERMISSÃO DE ROTAS
export async function middleware(request: NextRequest) {
  //VERIFICA A ROTA ATUAL
  const { pathname } = request.nextUrl;
  //VERIFICA SE A ROTA ATUAL É UMA ROTA QUE NECESSITA DE TOKEN
  const isRoutersToken = routersToken.some((route) =>
    pathname.startsWith(route)
  );
  //VERIFICA SE A ROTA ATUAL É UMA ROTA PUBLICA
  const isRoutersPublic = routersPublic.some((route) =>
    pathname.startsWith(route)
  );
  //VERIFICA SE A ROTA ATUAL É A ROTA DE AUTENTICAÇÃO
  const isRoutersAuth = routersAuth.some((route) => pathname.startsWith(route));

  //RECUPERA O TOKEN DO COOKIE DO NAVEGADOR
  const token = request.cookies.get("x-token-session")?.value;

  //VALIDAÇÃO SE A ROTA É PROTEGIDA E NÃO EXISTE O TOKEN - REDIRECIONA PARA LOGIN
  if (isRoutersToken && !token) {
    return NextResponse.redirect(new URL("/login/form", request.url));
  }

  //SE EXISTE TOKEN E USUÁRIO ESTÁ TENTANDO ACESSAR PÁGINA DE LOGIN, REDIRECIONA PARA HOME
  if (token && isRoutersAuth) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  //VALIDAÇÃO SE A ROTA É PUBLICA, CASO SIM RETORNA O NEXT
  if (isRoutersPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
