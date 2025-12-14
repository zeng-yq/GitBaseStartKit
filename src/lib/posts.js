import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { remarkHighlightText, rehypeHighlightToMark } from './remark-highlight-text'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkExtractHeadings } from './remark-extract-headings'

const postsDirectory = path.join(process.cwd(), 'data', 'md')

// 新增：获取指定语言的文章
export function getArticles(locale = 'en') {
  const articlesJsonPath = path.join(process.cwd(), 'data', 'json', `articles-${locale}.json`)

  let articles = []
  try {
    const articlesJson = fs.readFileSync(articlesJsonPath, 'utf8')
    articles = JSON.parse(articlesJson)
  } catch (error) {
    console.error(`Error reading articles-${locale}.json:`, error)
    // 回退到读取所有文章
    try {
      const allArticlesJson = fs.readFileSync(path.join(process.cwd(), 'data', 'json', 'articles.json'), 'utf8')
      const allArticles = JSON.parse(allArticlesJson)
      articles = allArticles.filter(article => article.language === locale)
    } catch (fallbackError) {
      console.error('Error reading fallback articles.json:', fallbackError)
      return []
    }
  }

  return articles
}

export function getSortedPostsData(locale = 'en') {
  // 首先尝试读取特定语言的文章
  let articles = getArticles(locale)

  // 如果没有找到特定语言的文章，返回空数组
  if (articles.length === 0) {
    console.log(`No articles found for locale: ${locale}`)
    return []
  }

  // Transform articles data and check if corresponding MD files exist
  const allPostsData = articles.map((article) => {
    // Extract id from path (e.g., "data/md/en/article-name.md" -> "article-name")
    const fileName = path.basename(article.path)
    const id = fileName.replace(/\.md$/, '')

    // Check if the file exists in the correct language directory
    const fullPath = path.join(postsDirectory, locale, fileName)
    const fileExists = fs.existsSync(fullPath)

    return {
      id,
      title: article.title,
      description: article.description,
      date: article.date,
      category: article.category,
      coverImage: article.coverImage || null,  // 添加 coverImage 字段
      deleted: article.deleted === true,
      fileExists,
      path: article.path,
      language: locale
    }
  })

  // Filter out deleted posts and posts without files, then sort by date
  return allPostsData
    .filter(post => !post.deleted && post.fileExists)
    .sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB - dateA
    })
}

export async function getPostData(slug, locale = 'en') {
  if (!slug) {
    throw new Error('Slug is required');
  }

  const mdFileName = `${slug}.md`;

  // 首先尝试从特定语言的文章索引中查找
  let article = null;
  let articleLanguage = locale;

  // 尝试从语言特定的文件中查找
  try {
    const langArticlesJsonPath = path.join(process.cwd(), 'data', 'json', `articles-${locale}.json`);
    const langArticlesJson = fs.readFileSync(langArticlesJsonPath, 'utf8');
    const langArticles = JSON.parse(langArticlesJson);

    article = langArticles.find(a => {
      const fileName = path.basename(a.path);
      return fileName === mdFileName;
    });

    if (article) {
      articleLanguage = locale;
    }
  } catch (error) {
    console.log(`Could not read articles-${locale}.json, trying fallback`);
  }

  // 如果在语言特定文件中没找到，尝试从其他语言文件中查找
  if (!article) {
    // 尝试从其他语言文件中查找
    const otherLanguages = ['en', 'zh', 'ja'].filter(lang => lang !== locale);

    for (const lang of otherLanguages) {
      try {
        const langArticlesJsonPath = path.join(process.cwd(), 'data', 'json', `articles-${lang}.json`);
        const langArticlesJson = fs.readFileSync(langArticlesJsonPath, 'utf8');
        const langArticles = JSON.parse(langArticlesJson);

        article = langArticles.find(a => {
          const fileName = path.basename(a.path);
          return fileName === mdFileName;
        });

        if (article) {
          articleLanguage = lang;
          break;
        }
      } catch (error) {
        console.log(`Could not read articles-${lang}.json`);
      }
    }

    if (!article) {
      throw new Error(`Article not found: ${slug}`);
    }
  }

  if (!article || article.deleted === true) {
    throw new Error(`Article not found or deleted: ${slug}`);
  }

  // 构建文件路径，考虑语言目录
  const languageDir = articleLanguage || 'en';
  const fullPath = path.join(postsDirectory, languageDir, mdFileName);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post file not found: ${mdFileName} at path ${fullPath}`);
  }

  // Read content (without front matter)
  let content = fs.readFileSync(fullPath, 'utf8');

  // If the file still has front matter, extract just the content
  const frontMatterRegex = /^---\n[\s\S]*?\n---\n/;
  if (frontMatterRegex.test(content)) {
    content = content.replace(frontMatterRegex, '');
  }

  // Use remark to convert markdown into HTML string with syntax highlighting
  const processedContent = await remark()
    .use(remarkExtractHeadings)
    .use(remarkHighlightText)
    .use(remarkRehype)
    .use(rehypeHighlightToMark)
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: false,
      grid: false,
    })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  // Extract headings from the processed content
  const headings = processedContent.data.headings || [];

  // Combine metadata from articles.json with content from MD file
  return {
    slug,
    contentHtml,
    headings,
    title: article.title,
    description: article.description,
    date: article.date,
    category: article.category,
    path: article.path,
    language: articleLanguage
  };
}


// Helper function to update article metadata in language-specific files
export async function updateArticleMetadata(slug, metadata, locale = 'en') {
  try {
    const articlesJsonPath = path.join(process.cwd(), 'data', 'json', `articles-${locale}.json`);
    const articlesJson = fs.readFileSync(articlesJsonPath, 'utf8');
    let articles = JSON.parse(articlesJson);

    const articlePath = `data/md/${locale}/${slug}.md`;
    const articleIndex = articles.findIndex(a => a.path === articlePath);

    if (articleIndex >= 0) {
      // Update existing article
      articles[articleIndex] = {
        ...articles[articleIndex],
        ...metadata,
        lastModified: new Date().toISOString()
      };
    } else {
      // Add new article
      articles.push({
        ...metadata,
        path: articlePath,
        lastModified: new Date().toISOString()
      });
    }

    fs.writeFileSync(articlesJsonPath, JSON.stringify(articles, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating article metadata:', error);
    return false;
  }
}