//Arquivo centralizado de tipos e interfaces

//TIPO DE DADOS DO USUÁRIO AUTENTICADO
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
// TIPOS DE DADOS DO DATABASE
export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
}


//TIPO DE DADOS AUTHCONTEXT
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  fetchCurrentUser: () => Promise<void>;
}

// TIPOS DE DADOS DO ARTICLES
export interface Article {
    id: string;
    title: string;
    createdAt: Date;
    updateAt: Date;
    avatar: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    tags: string[];
  };

// TIPO DE DADOS DO ARTIGO DETALHADO
export interface ArticleDetailData {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    avatar: string;
    author: {
      id: string;
      email: string;
      name: string;
      avatar: string;
      createdAt: string;
      updatedAt: string;
    };
    comments: Array<{
        id: string;
        content: string;
        articleId: string;
        authorId: string;
        author: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            createdAt: string;
            updatedAt: string;
        };
        parentId: string | null;
        createdAt: string;
        updatedAt: string;
    }>;
    tags: Array<{
        id: string;
        articleId: string;
        tagId: string;
        tag: {
            id: string;
            name: string;
            createdAt: string;
        };
    }>;
}

//TIPOS DE COMPONENTES PROPS
export interface ButtonPrimaryProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
}

export interface ButtonSecondaryProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}

export interface InputFormsProps {
  className?: string;
  titleInput?: string;
  valueInput?: string;
  valueType?: "text" | "email" | "password" | "number";
  classNameTitle?: string;
  placeholderInput?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTitle?: boolean;
}

export interface TextareaGlobalProps {
  className?: string;
  titleTextArea?: string;
  valueTextArea?: string;
  classNameTitle?: string;
  placeholderTextArea?: string;
  onChangeTextarea?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isTitle?: boolean;
}

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemDescription?: string;
}

//TIPOS DE PROPS DE PÁGINAS
export interface ArticlesNewProps {
  article: CreateArticleType | null;
  isNewCreate: boolean;
  onCreate?: (article: CreateArticleType) => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

//TIPOS DE FORMULÁRIOS
export interface CreateArticleType {
  id: string;
  title: string;
  createdAt?: Date;
  avatar?: string;
  author: string;
  content: string;
  tags: string[];
}

export interface EditArticleType {
  id: string;
  title: string;
  createdAt?: Date;
  avatar?: string;
  author: string;
  content: string;
  tags: string[];
}

//TIPOS DE API
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}