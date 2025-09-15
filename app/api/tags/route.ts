import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

//ROTA DE BUSCA DE TODAS TAGS NO BANCO DE DADOS
export async function GET() {
  try {
    //BUSCA DE TODAS TAGS E ARMAZENAMENTO EM UMA VARIÁVEL
    const tags = await db.tag.findMany({

    });

    //RETORNO DOS DADOS BUSCADO PARA O FRONT-END
    return NextResponse.json(tags);
  } catch (error) {
    //TRATAMENTO DE ERRO RETORNO PARA O FRONTEND COM ERRO E STATUS E PARA O CONSOLE COM MENSAGEM E ERRO.
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}