export interface Dictionary {
  navigation: {
    home: string;
    posts: string;
    resources: string;
    admin: string;
    login: string;
    logout: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
    moreArticles: string;
    moreResources: string;
  };
  features: {
    title: string;
    customizable: string;
    secure: string;
    fast: string;
    collaborative: string;
  };
  articles: {
    title: string;
    noCategory: string;
  };
  resources: {
    title: string;
    noCategory: string;
  };
  admin: {
    dashboard: string;
    manageArticles: string;
    resourceManagement: string;
    name: string;
    description: string;
    url: string;
    category: string;
    actions: string;
    edit: string;
    save: string;
    addNew: string;
    createArticle: string;
    editArticle: string;
    articleTitle: string;
    articleDescription: string;
    articleSlug: string;
    articleContent: string;
    categoryOptional: string;
    creating: string;
    create: string;
    loading: string;
    savingArticle: string;
  };
  login: {
    title: string;
    username: string;
    password: string;
    enterUsername: string;
    enterPassword: string;
    signIn: string;
    signingIn: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      text: string;
      image: string;
      name: string;
      role: string;
    }>;
  };
  language: {
    select: string;
    suggestion: {
      message: string;
      switch: string;
      dismiss: string;
    };
  };
  privacyPolicy?: {
    title: string;
    description: string;
    lastUpdated: string;
    sections?: {
      [key: string]: {
        title: string;
        content: string;
      };
    };
  };
  termsOfService?: {
    title: string;
    description: string;
    lastUpdated: string;
    sections?: {
      [key: string]: {
        title: string;
        content: string;
      };
    };
  };
}