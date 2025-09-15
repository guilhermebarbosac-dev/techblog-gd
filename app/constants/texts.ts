//VARIAVÉL GERAL DE TEXTOS STATICOS DO SISTEMA
const TEXTS = {
  //METADADOS DA PÁGINA PRINCIPAL
  appName: "TechBlog",
  description: "Blog para o time de desenvolvimento",
  //PÁGINA DE LOGIN
  pageLogin: {
    header:{
        button: {
            title: "Entrar"
        },
        title: "TechBlog",
    },
    //CONTEÚDO INICIAL PRIMEIRA PÁGINA [/login]
    main: {
        title: "Insights & Learning",
        subtitle: "Explorando tendências Tech, um post por vez",
        button: {
            title: "Começar a Ler",
        }
    },
    //CONTEÚDO DO FORMULÁRIO DE LOGIN [/login/form]
    formLogin: {
        title: "Bem-vindo de volta",
        form: {
            labelEmail: "Email",
            placeholderEmail: "Digite seu email",
            labelPassword: "Senha",
            placeholderPassword: "Digite sua senha",
        },
        button: {
            title: "Entrar",
        }

    }
  },
  //CONTEÚDO DA PÁGINA HOME [/home]
  pageHome: {
    pageTitle: "Todos os artigos",
    pageTitleButton: "Criar Artigo",
    searchPlaceholder: "Pesquisar ...",
    articlesTags: {
        tag1: "Frontend",
        tag2: "Backend",
        tag3: "Mobile",
        tag4: "DevOps",
        tag5: "AI",
    },
    noArticlesMessage: "Nenhum artigo encontrado.",
  },
  //CONTEÚDO DA PÁGINA DE DETALHES DO ARTIGO [/article/:id]
  ArticleDetail: {
    article: {
      notFound: "Artigo não encontrado",
      infoDatePublished: "Publicado por",
      comments: {
        title: "Comentários",
        button: "Comentar",
        buttonHideComments: "Ocultar Comentários",
        buttonShowComments: "Ver mais",
        buttonFinalComments: "comentário.",
      },
      reply: {
        buttons: {
          titleShowComments: "Ver mais",
          titleHideComments: "Ocultar",
          titleFinalReply: "respostas"
        }
      }
    }
  },
  //CONTEÚDO DA PÁGINA DE NOVO ARTIGO
  NewArticles: {
    pageTitle: "Novo artigo",
    form: {
        title: "Título do Artigo",
        placeholderTitle: "Título",
        imageArticlesTitle: "Imagem do Artigo",
        placeholderImageArticles: "URL da imagem",
        tags: "Tags",
        content: "Conteúdo do Artigo",
        placeholderContent: "Escreva aqui seu artigo...",
        button: {
            title: "Criar Artigo",
        }
    }
  },
  //CONTEÚDO DA PÁGINA DE EDITAR ARTIGO
  EditArticles: {
   pageTitle: "Editar artigo",
   form: {
      button: {
        title: "Salvar",
      }
   }
  },
  //CONTEÚDO DO MODAL DE CONFIRMAR EXCLUSÃO DE ARTIGO
  ConfimDeleteModal: {
    title: "Confirmar Exclusão",
    itemDescription: "Deseja realmente excluir o artigo",
    footerInfo: "Essa ação é Irreversível.",
    buttons: {
      confirm: "Delete",
      cancel: "Cancelar"
    }
  }
}

export default TEXTS