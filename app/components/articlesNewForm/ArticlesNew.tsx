import TEXTS from '@/app/constants/texts'
import ButtonPrimary from '../buttonsGlobal/ButtonPrimary'
import InputForms from '../inputsGlobal/InputForms'
import TextareaGlobal from '../textareaGlobal/TextareaGlobal'
import { Badge } from '@/components/ui/badge'
import ButtonSecondary from '../buttonsGlobal/ButtonSecondary'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ArticlesNewProps, Tag } from '@/lib/types'
import { useAuth } from '@/app/contexts/AuthContext'


export default function ArticlesNew({ isNewCreate, article } : ArticlesNewProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [avatar, setAvatar] = useState('')
  const [content, setContentState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  
  const currentUser = user?.id

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags')
        if (response.ok) {
          const tags = await response.json()
          setAvailableTags(tags)
        } else {
          toast.error('Erro ao carregar tags')
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
        toast.error('Erro ao carregar tags')
      } finally {
        setIsLoadingTags(false)
      }
    }

    fetchTags()
  }, [])
  
  useEffect(() => {
    if (article) {
      setTitle(article.title || '')
      setAvatar(article.avatar || '')
      setContentState(article.content || '')
    }
  }, [article])
  
  useEffect(() => {
    if (article?.tags && availableTags.length > 0) {
      const tagIds = article.tags.map(tagName => {
        const foundTag = availableTags.find(tag => tag.name === tagName)
        return foundTag?.id || ''
      }).filter(id => id !== '')
      setSelectedTagIds(tagIds)
    }
  }, [article?.tags, availableTags])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    router.push('/login/form');
    return null;
  }

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId))
    } else {
      setSelectedTagIds([...selectedTagIds, tagId])
    }
  }

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast.error('Título é obrigatório')
      return false
    }
    if (!content.trim()) {
      toast.error('Conteúdo é obrigatório')
      return false
    }
    return true
  }

  const handleCreate = async () => {

    if(!validateForm()) return

    setIsLoading(true)
    console.log(currentUser)
    try { 
      const newArticle = {
        title: title.trim(),
        avatar: avatar.trim(),
        content: content.trim(),
        tagIds: selectedTagIds,
        authorId: currentUser
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArticle)
      })

      if (!response.ok) {
        throw new Error('Failed to create article')
      }

      toast.success('Artigo criado com sucesso !')

      router.push('/home')

    }catch(error) {
      toast.error('Erro ao criar o artigo' + error)
    }finally { 
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!validateForm() || !article?.id) return

    setIsLoading(true)

    try {
      const updatedArticle = {
        userId: currentUser,
        title: title.trim(),
        avatar: avatar.trim(),
        content: content.trim(),
        tagIds: selectedTagIds
      }
     const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedArticle)
      })

      if (!response.ok) {
        throw new Error('Failed to update article')
      }

      toast.success('Artigo atualizado com sucesso!')
      
      router.push('/home')
    } catch (error) {
      console.error('Error updating article:', error)
      toast.error('Erro ao atualizar o artigo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSumit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(isNewCreate) {
      await handleCreate()
    }else{
      await handleUpdate()
    }
  }

  return (
    <main className='w-full max-w-[960px] py-5 px-4'>
      <div className='flex justify-between mt-26'>
        <ButtonSecondary
          onClick={() => router.back()}
        >
            <ArrowLeft className="w-8 h-8"/>
        </ButtonSecondary>
        <h1 className='text-[32px] text-primary font-bold leading-10 tracking-normal'>
          {isNewCreate ? TEXTS.NewArticles.pageTitle : TEXTS.EditArticles.pageTitle}
        </h1>
        <ButtonPrimary 
          className={`w-fit sm:w-[6.8125rem] sm:h-10 sm:min-w-[5.25rem] sm:max-w-[30rem] font-semibold disabled:${isLoading}`}
          onClick={handleSumit}
        > 
          {isNewCreate ? TEXTS.NewArticles.form.button.title : TEXTS.EditArticles.form.button.title}
        </ButtonPrimary>
      </div>
      <form className='flex flex-col gap-4 py-3'>
          <InputForms 
            className='w-full sm:w-full h-10'
            valueInput={title}
            onChangeInput={(e) => setTitle(e.target.value)}
            classNameTitle='text-primary text-[16px] font-semibold leading-6 tracking-normal'
            titleInput= { TEXTS.NewArticles.form.title }
            placeholderInput={ TEXTS.NewArticles.form.placeholderTitle }
            isTitle={true}
          />
          <InputForms 
            className='w-full sm:w-full h-10'
            valueInput={avatar}
            onChangeInput={(e) => setAvatar(e.target.value)}
            classNameTitle='text-primary text-[16px] font-semibold leading-6 tracking-normal'
            titleInput= { TEXTS.NewArticles.form.imageArticlesTitle }
            placeholderInput={ TEXTS.NewArticles.form.placeholderImageArticles }
            isTitle={true}
          />
          <p className='text-primary text-[16px] font-semibold leading-6 tracking-normal'>
            { TEXTS.NewArticles.form.tags }
          </p>
          {isLoadingTags ? (
            <p className='text-gray-500'>Carregando tags...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <Badge 
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`${isSelected 
                      ? 'bg-button-primary text-placeholder-input text-[14px] font-medium leading-[1.3125rem] tracking-normal cursor-pointer px-4 w-fit h-8' 
                      : 'bg-button-primary/80 text-primary text-[14px] font-medium leading-[1.3125rem] tracking-normal cursor-pointer px-4 w-fit h-8'}`}
                  >
                    <p className='mt-1'>
                      {tag.name}
                    </p>
                  </Badge>
                )
              })}
            </div>
          )}
          <TextareaGlobal
            isTitle={ true }
            valueTextArea={ content }
            onChangeTextarea={ (e) => {
              setContentState(e.target.value)
            } }
            titleTextArea={ TEXTS.NewArticles.form.content }
            placeholderTextArea={ TEXTS.NewArticles.form.placeholderContent }
          />
      </form>
    </main>
  )
}