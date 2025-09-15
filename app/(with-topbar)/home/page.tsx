"use client";

//IMPORTS DE HOOKS, UTILS, LIBS E COMPONENTS
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Edit, Loader2, LucideLoader2, Trash } from "lucide-react";
import TEXTS from "@/app/constants/texts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeInSection } from "@/components/ui/animated-components";
import ButtonPrimary from "@/app/components/buttonsGlobal/ButtonPrimary";
import ButtonSecondary from "@/app/components/buttonsGlobal/ButtonSecondary";
import InputForms from "@/app/components/inputsGlobal/InputForms";
import PaginationGlobal from "@/app/components/paginationGlobal/paginationGlobal";
import { ConfirmDeleteModal } from "@/app/components/confirmDeleteGlobal/confimDeleteModal";
import { Article, Tag } from "@/lib/types";
import { useAuth } from "@/app/contexts/AuthContext";

//VARIAVÉL DE QUANTIDADES DE PÁGINAS PARA PAGINAÇÃO
const ITEMS_PER_PAGE = 5;


export default function HomePage() {

  const router = useRouter();

  //HOOK BUSCA USUÁRIO EM CONTEXTO DA APLICAÇÃO
  const { user: currentUser } = useAuth()

  //VARIAVÉIS DE ESTADO QUE ARMAZENA OS DADOS PARA MANIPULAÇÃO
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined)
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  //FUNÇÃO PARA FILTRAR OS ARTIGOS POR TEXTO E TAGS
  const filteredSearch = useCallback((search: string, tagsFilter?: string) => {
    let filtered = articles;

    if(search) {
      filtered = filtered.filter((article: Article) => {
        const inTitle = article.title.toLowerCase().includes(search.toLowerCase());
        const inContent = article.content.toLowerCase().includes(search.toLowerCase());
        return inTitle || inContent;
      });
    }

    if(tagsFilter) {
      filtered = filtered.filter((article: Article) => {
        return article.tags.includes(tagsFilter);
      });
    }
    
    setFilteredArticles(filtered);
  },[articles])

  //FUNÇÃO ASSÍNCRONA PARA SELEÇÃO DE TAGS
  const handleTagClick = useCallback((tagName: string) => { 
    const newSelectedTag = selectedTag === tagName ? undefined : tagName;
    setSelectedTag(newSelectedTag);
    filteredSearch(search, newSelectedTag);
    setCurrentPage(1);
}, [selectedTag, search, filteredSearch])

  //FUNÇÃO ASSÍNCRONA PARA BUSCA DE ARTIGOS POR TEXTO
  const handleSearch = useCallback((search: string) => {
    setSearch(search);
    filteredSearch(search, selectedTag)
  },[filteredSearch, selectedTag])

  //FUNÇÃO ASSÍNCRONA PARA EXPIRAR SESSÃO DO USUÁRIO
  const expiredSession = async () => {
    const response = await  fetch('/api/login/session-expired', {
      method: 'DELETE'
    })
    if(response.ok) {
      toast.success("Sessão expirada");
      router.push("/login/form");
      router.refresh();
    }
  }

  //FUNÇÃO ASSÍNCRONA PARA BUSCAR ARTIGOS
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/articles');

      if (!response.ok) {
        if (response.status === 404) {
          setArticles([]);
          toast.success(TEXTS.pageHome.noArticlesMessage);
          return;
        }
        toast.error('Erro ao buscar artigos.');
        return;
      }
      
      const data = await response.json();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      toast.error('Erro ao buscar artigos.');
      console.error('Fetch Articles Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  //FUNÇÃO ASSÍNCRONA PARA EXCLUSÃO DE ARTIGOS
  const deleteArticle = async (articleId: string) => {
    try{
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if(!response.ok) {
        toast.error('Erro ao excluir artigo')
        return
      }

      toast.success('Artigo excluído com sucesso')

      setIsOpen(false)

      fetchArticles()

    }catch(error){
      console.error('Delete Article Error:', error)
      toast.error('Erro ao excluir artigo tente novamente mais tarde')
    }finally{ 
      setIsOpen(false)
    }
  }

  //FUNÇÃO ASSÍNCRONA PARA BUSCAR AS TAGS
  const fetchTags = async () => {
    try { 
      const response = await fetch('/api/tags')
      if(!response.ok) {
        toast.error('Erro ao carregar tags')
        return
      }

      const tags = await response.json()

      setTags(tags.map((tag: Tag) => tag.name))

    } catch (error) {
      console.error('Error fetching tags:', error)
      toast.error('Erro ao carregar tags')
    }
  }

  //FUNÇÃO PARA NAVEGAR PARA DETALHES DO ARTIGO
  const handleArticleClick = (articleId: string) => {
    try {
      router.push(`/article/${articleId}`)    
    } catch (error) {
      console.error(error);
    }
  };

  //FUNÇÃO PARA ALTERAR A PÁGINA ATUAL
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //FUNÇÃO QUE ABRE O MODAL DE CONFIRMAÇÃO PARA EXCLUSÃO DE UM ARTIGO  
  const handleArticleDelete = () => {
    setIsOpen(true)
  }

  //FUNÇÃO QUE EXCLUI UM ARTIGO
  const handleConfirmDelete = (articleId: string) => {
    deleteArticle(articleId)
  }

  //HOOK DE EFEITO PARA CARREGAMENTO INICIAL DAS TAGS E ARTIGOS
  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, []);

  //FUNÇÃO QUE VERIFICA SE O USUÁRIO É O AUTOR DO ARTIGO
  const isArticleAuthor = (article: Article) => {
    if(!currentUser || !article.author) return false
    return article.author.id === currentUser?.id
  }

  //VARIÁVEL QUE ARMAZENA O TOTAL DE PÁGINAS
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  //VARIÁVEL QUE ARMAZENA OS ARTIGOS PAGINADOS
  const currentArticles = filteredArticles?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  //VALIDAÇÃO DE USUÁRIO NÃO AUTENTICADO OU EXPIRADO
  if (!currentUser) {
    expiredSession()
    return null;
  }

  //VALIDAÇÃO DE CARREGAMENTO DE DADOS
  if(isLoading) {
    return (<Loader2 className="w-8 h-8 animate-spin"/>)
  } else if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 w-full">
        <p className="text-center w-full">{TEXTS.pageHome.noArticlesMessage}</p>
      </div>
    )
  }



  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full sm:w-[60rem] sm:h-[4.5rem] flex mt-26 flex-col">
        <FadeInSection>
          <div className="flex items-center justify-between py-4 px-2 sm-px-2">
            <h1 className="text-primary font-bold text-[32px] leading-10 tracking-normal">
              {TEXTS.pageHome.pageTitle}
            </h1>
            <ButtonPrimary 
              className="w-fit sm:w-[6.8125rem] sm:h-10 min-w-[5.25rem] max-w-[30rem] font-semibold"
              onClick={() => router.push('/article/new')}
            >
              {TEXTS.pageHome.pageTitleButton}
            </ButtonPrimary>
          </div>
          
          <div className="space-y-2 px-2 sm:px-2 pb-4">
            <div className="flex gap-2 overflow-scroll scroll-auto sm:overflow-hidden">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  className={`${selectedTag === tag 
                    ? 'bg-button-primary text-secondary-foreground text-[14px] font-medium leading-[1.3125rem] tracking-normal cursor-pointer px-4 w-fit h-8' 
                    : 'bg-button-primary text-primary text-[14px] font-medium leading-[1.3125rem] tracking-normal cursor-pointer px-4 w-fit h-8' 
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  <p className="px-1 mt-1">{tag}</p>
                </Badge>
              ))}
            </div>
            <InputForms
              className="w-full sm:w-full"
              valueInput= { search }
              onChangeInput={(e) => handleSearch(e.target.value)}
              placeholderInput={TEXTS.pageHome.searchPlaceholder}
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-96 w-full">
              <LucideLoader2 className="text-primary animate-spin w-10 h-10" />
            </div>
          ) : (
          <>
            <div className="grid grid-cols-1 px-2 gap-4 w-full">
              {filteredArticles.length === 0 ? (
                <p className="text-center w-full">
                  {TEXTS.pageHome.noArticlesMessage}
                </p>
              ) : (
                currentArticles.map((article: Article) => (
                  <div className="flex flex-2 p-1" key={article.id}>
                    <Card
                    className="flex flex-row w-full border-none shadow-none px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <CardHeader className="flex-col-1 flex items-center justify-center">
                      <Avatar className="flex items-center justify-center w-14 h-14 rounded-[4px]">
                        <AvatarImage src={article?.avatar} alt={article?.title} />
                        <AvatarFallback>
                          {article.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <h2 className="text-primary font-medium text-[16px] leading-6 tracking-normal">
                        {article.title}
                      </h2>
                      <p className="text-muted line-clamp-1 font-normal text-[14px] leading-3.5 tracking-normal">
                        {article.content}
                      </p>
                      {article.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-button-primary rounded-[0.75rem] h-[0.9375rem] px-2 gap-2 text-primary text-[10px] font-medium leading-[1.3125rem] tracking-normal mr-1"
                        >
                          <p className="mt-1">{tag}</p>
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                      {isArticleAuthor(article) && (
                        <div className="flex flex-col gap-1 items-top">
                            <ButtonSecondary
                              onClick={() => router.push(`/article/edit/${article.id}`)}
                            >
                              <Edit className="w-7 h-7" />
                            </ButtonSecondary>
                            <ButtonSecondary
                              onClick={() => handleArticleDelete()}
                            >
                              <Trash  className="w-7 h-7"/>
                            </ButtonSecondary>
                        </div>
                      )}
                      <ConfirmDeleteModal
                        isOpen= {isOpen}
                        onClose={() => setIsOpen(false)}
                        onConfirm={() => handleConfirmDelete(article.id)}
                        itemName={article.title}
                        itemDescription={ article.author.name}
                      />
                  </div>
                ))
              )}
            </div>
            {filteredArticles.length > 5 && (
                <PaginationGlobal
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
            )}
            </>
          )}
        </FadeInSection>
      </div>
    </main>
  );
}