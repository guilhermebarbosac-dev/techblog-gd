'use client';
//IMPORTS LIBS, UTILS, COMPONENTS, HOOKS
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Loader2, Reply, Trash, Pencil } from 'lucide-react';
import { FadeInSection } from '@/components/ui/animated-components';
import { toast } from 'react-hot-toast';
import ButtonSecondary from '@/app/components/buttonsGlobal/ButtonSecondary';
import ButtonPrimary from '@/app/components/buttonsGlobal/ButtonPrimary';
import TextareaGlobal from '@/app/components/textareaGlobal/TextareaGlobal';
import { formatTimeAgo } from '@/lib/utils';
import TEXTS from '@/app/constants/texts';
import { ArticleDetailData } from '@/lib/types';
import { useAuth } from '@/app/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  //HOOK BUSCA USUÁRIO EM CONTEXTO DA APLICAÇÃO
  const { user: currentUser, loading } = useAuth()

  //VARIÁVEL DE ESTADO PARA ARMAZENAR OS DADOS DO ARTIGO, COMENTÁRIOS E RESPOSTAS
  const [articleData, setArticleData] = useState<ArticleDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<{[key: string]: boolean}>({});
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editReplyContent, setEditReplyContent] = useState('');

  //HOOK DE EFEITO PARA CARREGAR TODOS ARTIGOS
  useEffect(() => {
    if(params.id){
      fetchArticleDetail();
    }
  }, [params.id]);

  //FUNÇÃO ASSÍNCRONA DE CHAMADA PARA A ROTA DE DETALHE DO ARTIGO
  const fetchArticleDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/detail/${params.id}`);

      if(response.status === 404) {
        toast.error('Artigo não encontrado ou inexistente')
        return
      }
      if (!response.ok) {
        toast.error('Erro ao carregar artigo você precisa estar logado para acessar')
        router.push('/login/form')
        return
      }
      const data = await response.json();
      setArticleData(data);
    } catch (error) {
      console.error('Erro:', error);
      throw new Error('Erro ao carregar detalhes do artigo');
    } finally {
      setIsLoading(false);
    }
  };

  //FUNÇÃO ASSÍNCRONA PARA CRIAR UM NOVO COMENTÁRIO NO ARTIGO SELECIONADO
  const createComment = async (commentText: string) => { 
    try {
      const response = await fetch('/api/articles/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commentText,
          articleId: params.id,
          authorId: currentUser?.id
        }),
      })

      if(!response.ok) {
        toast.error('Erro ao criar comentário')
        return
      }

      toast.success('Comentário criado com sucesso!')
      setNewComment('')
      fetchArticleDetail()
    } catch (error) {
      toast.error('Erro ao criar comentário')
      console.error(error)
    }
  };

  //FUNÇÃO ASSÍNCRONA PARA CRIAR UMA RESPOSTA A UM COMENTÁRIO ESPECÍFICO DO ARTIGO
  const createReply = async (commentId: string, articleId: string) => { 
      try {
        const response = await fetch ('/api/articles/comment/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentId,
            content: newReply,
            authorId: currentUser?.id,
            articleId
          })
        })

        if(!response.ok) {
          toast.error('Erro ao criar a resposta')
          return
        }

        toast.success('Resposta criada com sucesso !')
        setNewReply('')
        fetchArticleDetail()
      } catch (error) {
        toast.error('Erro ao criar o comentário.')
        console.error(error)
      }
  };

  //FUNÇÃO ASSÍNCRONA PARA DELETAR UM COMENTÁRIO NO ARTIGO SELECIONADO
  const deleteComment = async (commentId: string) => { 
    try {
        const response = await fetch(`/api/articles/comment`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentId: commentId
          })
        })

        if (!response.ok) {
          console.log('Erro ao deletar o comentário')
          return
        }
        toast.success('Comentário deletado com sucesso !')
        fetchArticleDetail()
    } catch (error) {
        toast.error('Erro ao deletar o comentário')
        console.error(error)
    }
  };

  //FUNÇÃO ASSÍNCRONA PARA DELETAR UMA RESPOSTA DE UM COMENTÁRIO DE UM ARTIGO
  const deleteReply = async (replyId: string) => { 
    try {
        const response = await fetch(`/api/articles/comment/reply/${replyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          console.log('Erro ao deletar a resposta')
          return
        }
        toast.success('Resposta deletada com sucesso !')
        fetchArticleDetail()
    } catch (error) {
        toast.error('Erro ao deletar a resposta')
        console.error(error)
    }
  };

  //FUNÇÃO PARA INSERIR UM NOVO COMENTÁRIO EM UM ARTIGO
  const handleComment = () => {
    //VALIDAÇÃO DE CONTEÚDO DO COMENTÁRIO
    if (!newComment.trim()) {
      toast.error('Por favor, insira um comentário antes de enviar.');
      return;
    }
    //CHAMADA A FUNÇÃO DE CRIAR NOVO COMENTÁRIO
    createComment(newComment.trim());
  };

  //FUNÇÃO PARA DELETAR UM COMENTÁRIO
  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId)
  }

  //FUNÇÃO PARA EDIÇÃO DE UM COMENTÁRIO 
  const startEditingComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditCommentContent(content);
  };

  //FUNÇÃO PARA EDIÇÃO DE UMA RESPOSTA
  const startEditingReply = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditReplyContent(content);
  };

  //FUNÇÃO PARA CANCELAR A EDIÇÃO DE UM COMENTÁRIO
  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  //FUNÇÃO PARA CANCELAR A EDIÇÃO DE UMA RESPOSTA
  const cancelEditingReply = () => {
    setEditingReplyId(null);
    setEditReplyContent('');
  };

  //FUNÇÃO PARA ATUALIZAR OS DADOS DE UM COMENTÁRIO
  const updateComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/articles/comment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commentId: commentId,
          content: editCommentContent
        }),
      });

      if (!response.ok) {
        toast.error('Erro ao atualizar comentário');
        return;
      }

      toast.success('Comentário atualizado com sucesso!');
      setEditingCommentId(null);
      setEditCommentContent('');
      fetchArticleDetail();
    } catch (error) {
      toast.error('Erro ao atualizar comentário');
      console.error(error);
    }
  };

  //FUNÇÃO PARA ATUALIZAR OS DADOS DE UMA RESPOSTA
  const updateReply = async (replyId: string) => {
    try {
      const response = await fetch(`/api/articles/comment/reply/${replyId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editReplyContent
        }),
      });

      if (!response.ok) {
        toast.error('Erro ao atualizar resposta');
        return;
      }

      toast.success('Resposta atualizada com sucesso!');
      setEditingReplyId(null);
      setEditReplyContent('');
      fetchArticleDetail();
    } catch (error) {
      toast.error('Erro ao atualizar resposta');
      console.error(error);
    }
  };

  //FUNÇÃO DE CHAMADA DE CRIAÇÃO DE UMA RESPOSTA
  const handleReply = (commentId: string, articleId: string) => {
    createReply(commentId, articleId)
  }

  //FUNÇÃO DE EXIBIÇÃO DE RESPOSTAS(CASO HAJA MAIS DE 3 RESPOSTAS EM UM SÓ COMENTÁRIO)
  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  //FUNÇÃO DE EXIBIÇÃO DE TODOS OS COMENTÁRIOS (CASO HAJA MAIS DE 3 COMENTÁRIOS)
  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  //FUNÇÃO DE BUSCA DE RESPOSTAS PARA CADA COMENTÁRIO
  const getRepliesForComment = (parentId: string) => {
    return articleData?.comments.filter(comment => comment.parentId === parentId) || [];
  };

  //FUNÇÃO QUE FILTRA OS COMENTÁRIOS PRINCIPAIS
  const getTopLevelComments = () => {
    const comments = articleData?.comments.filter(comment => comment.parentId === null) || [];

    return showAllComments ? comments : comments.slice(0, 3);
  };
  
  //FUNÇÃO PARA CHECAR SE O USUÁRIO É AUTOR DO COMENTÁRIO
  const isAuthorComment = (comment: { author?: { id?: string }; authorId?: string }) => {
    if(!comment.author?.id || !currentUser?.id) return false
    const isAuthor = comment.author.id === currentUser.id;
    return isAuthor;
  };

  //VALIDAÇÃO DE CARREGAMENTO DA PÁGINA
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  //VALIDAÇÃO DE ARRAY VAZIO
  if (!articleData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted">
          {TEXTS.ArticleDetail.article.notFound}
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-[960px] mx-auto px-4 py-8">
      <FadeInSection className='mt-16'>
        <div className="mb-6">
          <ButtonSecondary
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </ButtonSecondary>
        </div>

        <div className="flex flex-col gap-3">
          <div className='grid grid-cols-2 justify-between'>
          <h1 className="text-[32px] font-bold leading-10 tracking-normal text-primary">
            {articleData.title}
          </h1>
          <div className="ml-auto flex gap-2">
            {articleData.tags.map((tagRelation) => (
              <Badge key={tagRelation.id} className="bg-button-primary px-4 rounded-[12px] h-8 leading-[21px] tracking-normal text-primary font-medium text-[14px]">
                {tagRelation.tag.name}
              </Badge>
            ))}
          </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-10 h-10 rounded-[20px]">
              <AvatarImage src={articleData.author.avatar} />
              <AvatarFallback>
                {articleData.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-primary">{articleData.author.name}</p>
              <p className="text-[14px] text-muted font-normal leading-[21px] tracking-normal">
                <span>
                  {TEXTS.ArticleDetail.article.infoDatePublished} {articleData.author.name} • {new Date(articleData.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-1 pb-3">
          <p className="text-[16px] leading-6 tracking-normal text-primary ">
            {articleData.content}
          </p>
        </div>

        <div>
          <Card className='border-none shadow-none px-0'>
            <CardHeader className='p-0'>
              <h3 className="text-[18px] font-bold leading-[23px] tracking-normal text-primary">
                {TEXTS.ArticleDetail.article.comments.title}
              </h3>
            </CardHeader>
            <CardContent className='p-0'>
              <TextareaGlobal
                isTitle={false}
                placeholderTextArea ='Escreva um comentário...'
                valueTextArea ={newComment}
                onChangeTextarea={(e) => setNewComment(e.target.value)}
              />

            </CardContent>
            <CardFooter className='p-0'>
              <ButtonPrimary className='w-[98px] max-w-[480px] min-w-[84px] font-medium' onClick={handleComment}>
                  {TEXTS.ArticleDetail.article.comments.button}
              </ButtonPrimary>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            {getTopLevelComments().map((comment) => {
              const replies = getRepliesForComment(comment.id);
              const isExpanded = expandedReplies[comment.id];
              
              return (
                <Card key={comment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback>
                          {comment.author?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-primary text-[14px] leading-[21px] tracking-normal">
                            {comment.author?.name}
                          </span>
                          <span className="text-[14px] text-muted font-normal leading-[21px] tracking-normal">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="flex flex-col gap-3">
                            <TextareaGlobal
                              isTitle={false}
                              placeholderTextArea="Editar comentário..."
                              valueTextArea={editCommentContent}
                              onChangeTextarea={(e) => setEditCommentContent(e.target.value)}
                            />
                          </div>
                        ) : (
                          <p className="font-normal text-[14px] leading-[21px] tracking-normal text-primary">
                            {comment.content}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <Accordion type="single" collapsible className='w-full'>
                            <AccordionItem value={`reply-${comment.id}`} className="border-b-0">
                              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>svg]:hidden [&[data-state=closed]>svg]:hidden">
                                <a className='flex items-center justify-center rounded-md bg-button-primary text-color-button-secondary w-10 h-10 hover:bg-button-primary/70 active:scale-95 cursor-pointer transition-all duration-200'>
                                  <Reply className="w-4 h-4" />
                                </a>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                  <TextareaGlobal
                                    isTitle={false}
                                    placeholderTextArea="Escreva sua resposta..."
                                    valueTextArea={newReply}
                                    onChangeTextarea={(e) => setNewReply( e.target.value)}
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <ButtonPrimary 
                                      className="w-[98px] max-w-[480px] min-w-[84px] font-medium"
                                      onClick={() => handleReply(comment.id, articleData?.id)}
                                    >
                                      Responder
                                    </ButtonPrimary>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          {isAuthorComment(comment) && (
                            <>
                              {editingCommentId === comment.id ? (
                                <div className="flex gap-2 ml-auto">
                                  <ButtonPrimary 
                                    className="w-[98px] max-w-[480px] min-w-[84px] font-medium"
                                    onClick={() => updateComment(comment.id)}
                                  >
                                    Salvar
                                  </ButtonPrimary>
                                  <ButtonPrimary
                                    className='bg-button-primary hover:bg-button-primary/80 text-primary'
                                    onClick={cancelEditingComment}
                                  >
                                    Cancelar
                                  </ButtonPrimary>
                                </div>
                              ) : (
                                <>
                                  <div className="ml-auto">
                                    <ButtonSecondary
                                      onClick={() => startEditingComment(comment.id, comment.content)}
                                    >
                                      <Pencil className='w-7 h-7'/>
                                    </ButtonSecondary>
                                  </div>
                                  <ButtonSecondary
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    <Trash className="w-4 h-4" />
                                  </ButtonSecondary>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {replies.length > 0 && (
                    <CardContent className="pt-0 pl-16">
                      <div className="space-y-3">
                        {replies
                          .slice(0, isExpanded ? replies.length : 2)
                          .map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback>
                                 {reply.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary text-[14px] leading-[21px] tracking-normal">
                                  {reply.author.name}
                                </span>
                                <span className="text-[14px] text-muted font-normal leading-[21px] tracking-normal">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              {editingReplyId === reply.id ? (
                                <div className="flex flex-col gap-2 mt-2 w-full">
                                  <TextareaGlobal
                                    isTitle={false}
                                    placeholderTextArea="Editar resposta..."
                                    valueTextArea={editReplyContent}
                                    onChangeTextarea={(e) => setEditReplyContent(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <ButtonPrimary 
                                      className="w-[98px] max-w-[480px] min-w-[84px] font-medium"
                                      onClick={() => updateReply(reply.id)}
                                    >
                                      Salvar
                                    </ButtonPrimary>
                                    <ButtonPrimary
                                      className='bg-button-primary hover:bg-button-primary/80 text-primary'
                                      onClick={cancelEditingReply}
                                    >
                                      Cancelar
                                    </ButtonPrimary>
                                  </div>
                                </div>
                              ) : (
                                <p className="font-normal text-[14px] leading-[21px] tracking-normal text-primary">
                                  {reply.content}
                                </p>
                              )}
                            </div>
                            {isAuthorComment(reply) && (
                              <>
                                {editingReplyId === reply.id ? null : (
                                  <>
                                    <ButtonSecondary
                                      onClick={() => startEditingReply(reply.id, reply.content)}
                                    >
                                      <Pencil className='w-7 h-7'/>
                                    </ButtonSecondary>
                                    <ButtonSecondary
                                      onClick={() => deleteReply(reply.id)}
                                    >
                                      <Trash className="w-4 h-4" />
                                    </ButtonSecondary>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        ))}

                        {replies.length > 3 && (
                          <div className="mt-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleReplies(comment.id)}
                              className="cursor-pointer text-button-secondary bg-transparent hover:text-button-secondary/80 hover:bg-transparent p-0 h-auto font-normal"
                            >
                              {isExpanded 
                                ? `${TEXTS.ArticleDetail.article.reply.buttons.titleHideComments} 
                                ${replies.length - 3} 
                                ${TEXTS.ArticleDetail.article.reply.buttons.titleFinalReply}` 
                                : `${TEXTS.ArticleDetail.article.reply.buttons.titleShowComments} 
                                ${replies.length - 3} 
                                ${TEXTS.ArticleDetail.article.reply.buttons.titleFinalReply}`
                              }
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
          {articleData && articleData.comments.filter(comment => comment.parentId === null).length > 3 && (
            <div className="text-center mt-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleComments}
                className="cursor-pointer text-button-secondary bg-transparent hover:text-button-secondary/80 hover:bg-transparent p-0 h-auto font-normal"
              >
                {showAllComments 
                  ? TEXTS.ArticleDetail.article.comments.buttonHideComments
                  : `${TEXTS.ArticleDetail.article.comments.buttonShowComments} 
                  ${articleData.comments.filter(comment => comment.parentId === null).length - 3}
                  ${TEXTS.ArticleDetail.article.comments.buttonFinalComments}`
                }
              </Button>
            </div>
          )}
        </div>
      </FadeInSection>
    </main>
  );
}