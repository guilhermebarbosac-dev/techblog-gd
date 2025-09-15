/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

//IMPORTS DE HOOKS, UTILS, COMPONENTS
import ArticlesNew from '@/app/components/articlesNewForm/ArticlesNew'
import { FadeInSection } from '@/components/ui/animated-components'
import { CreateArticleType } from '@/lib/types'
import React, { useState } from 'react'

export default function ArticleNewCreate() {

  //VARIAVEIS DE ESTADO PARA ARMAZENAMENTO DE DADOS PARA CRIAÇÃO DE UM NOVO ARTIGO
  const [article, setArticle] = useState<CreateArticleType | null>(null)

  return (
    <FadeInSection className='flex flex-col items-center justify-center w-full '>
        <ArticlesNew
            article={article}
            isNewCreate={true}
        />
    </FadeInSection>
  )
}
