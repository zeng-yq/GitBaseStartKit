import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'data', 'md')
const articlesJsonPath = path.join(process.cwd(), 'data', 'json', 'articles.json')

export function getSortedPostsData() {
  // Read articles.json as the source of truth for metadata
  let articles = []
  try {
    const articlesJson = fs.readFileSync(articlesJsonPath, 'utf8')
    articles = JSON.parse(articlesJson)
  } catch (error) {
    console.error('Error reading articles.json:', error)
    return []
  }

  // Transform articles data and check if corresponding MD files exist
  const allPostsData = articles.map((article) => {
    // Extract id from path (e.g., "data/md/article-name.md" -> "article-name")
    const fileName = path.basename(article.path)
    const id = fileName.replace(/\.md$/, '')

    // Check if the file exists
    const fullPath = path.join(postsDirectory, fileName)
    const fileExists = fs.existsSync(fullPath)

    return {
      id,
      title: article.title,
      description: article.description,
      date: article.date,
      category: article.category,
      deleted: article.deleted === true,
      fileExists,
      path: article.path,
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

export async function getPostData(slug) {
  if (!slug) {
    throw new Error('Slug is required');
  }

  const mdFileName = `${slug}.md`;
  const articlePath = `data/md/${mdFileName}`;

  // First, get metadata from articles.json
  let articles = [];
  try {
    const articlesJson = fs.readFileSync(articlesJsonPath, 'utf8');
    articles = JSON.parse(articlesJson);
  } catch (error) {
    console.error('Error reading articles.json:', error);
    throw new Error('Failed to read articles index');
  }

  // Find the article in the index
  const article = articles.find(a => a.path === articlePath);
  if (!article || article.deleted === true) {
    throw new Error(`Article not found or deleted: ${slug}`);
  }

  // Read the markdown file for content only
  const fullPath = path.join(postsDirectory, mdFileName);
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

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  // Combine metadata from articles.json with content from MD file
  return {
    slug,
    contentHtml,
    title: article.title,
    description: article.description,
    date: article.date,
    category: article.category,
    path: article.path,
  };
}

// Helper function to update articles.json
export async function updateArticleMetadata(slug, metadata) {
  try {
    const articlesJson = fs.readFileSync(articlesJsonPath, 'utf8');
    let articles = JSON.parse(articlesJson);

    const articlePath = `data/md/${slug}.md`;
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