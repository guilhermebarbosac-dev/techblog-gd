'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ArticlesNew from '@/app/components/articlesNewForm/ArticlesNew'
import { Loader2 } from 'lucide-react';
import { FadeInSection } from '@/components/ui/animated-components';
import toast from 'react-hot-toast';
import { EditArticleType } from '@/lib/types';

export default function EditArticles() {
  const params = useParams();

  //VARIÁVEL DE ESTADO PARA ARMAZENAR OS DADOS DO ARTIGO EDITADO
  const [article, setArticle] = useState<EditArticleType | null>(null);

  //FUNÇÃO PARA BUSCAR OS DADOS DO ARTIGO EDITADO
  const fetchArticle = async () => {
    if (!params.id) return;
    
    try {
      const response = await fetch(`/api/articles/${params.id}`);
      if (!response.ok) {
        toast.error('Erro ao carregar o artigo')
        throw new Error('Failed to fetch article');
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      toast.error('Erro inesperado, por favor tente novamente mais tarde')
      console.error('Fetch Article Error:', error);
    }
  }

  //HOOK DE CARREGAMENTO DA PÁGINA
  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  //VALIDAÇÃO DE CARREGAMENTO DA PÁGINA
  if (!article) {
    return (
      <div className='flex flex-col items-center justify-center w-full min-h-96'>
        <Loader2 className='w-8 h-8 text-primary animate-spin'/>
      </div>
    );
  }

  return (
    <FadeInSection className='flex flex-col items-center justify-center w-full '>
        <ArticlesNew
            article={article}
            isNewCreate={false}
        />
    </FadeInSection>
  )
}
