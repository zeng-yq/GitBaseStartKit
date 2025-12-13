import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const mdFolderPath = 'data/md';

// Local paths
const localMdFolderPath = path.join(process.cwd(), 'data', 'md');
const localJsonDir = path.join(process.cwd(), 'data', 'json');

// Helper function to get language from path or request
function getLanguageFromPath(filePath) {
  if (filePath.includes('/en/')) return 'en';
  if (filePath.includes('/zh/')) return 'zh';
  if (filePath.includes('/ja/')) return 'ja';
  return 'en'; // default
}

// Helper function to get articles json path for language
function getArticlesJsonPath(locale = 'en') {
  return path.join(localJsonDir, `articles-${locale}.json`);
}

// Helper function to read articles for a specific language
function readArticlesForLanguage(locale = 'en') {
  const articlesPath = getArticlesJsonPath(locale);
  try {
    const content = fs.readFileSync(articlesPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading articles-${locale}.json:`, error);
    return [];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sync = searchParams.get('sync');
  const pathParam = searchParams.get('path');
  const category = searchParams.get('category');
  const includeDeleted = searchParams.get('includeDeleted') === 'true';
  const locale = searchParams.get('locale') || 'en';

  try {
    if (pathParam) {
      // Fetch single article
      if (!owner || !repo) {
        // Use local file
        try {
          const fullPath = path.join(process.cwd(), decodeURIComponent(pathParam));
          const content = fs.readFileSync(fullPath, 'utf8');

          // Detect language from path or use provided locale
          const articleLocale = getLanguageFromPath(pathParam);

          // Read metadata from language-specific articles json
          let articles = [];
          try {
            articles = readArticlesForLanguage(articleLocale);
          } catch (e) {
            console.error(`Error reading articles-${articleLocale}.json:`, e);
          }

          const article = articles.find(a => a.path === pathParam);

          return NextResponse.json({
            title: article?.title || '',
            description: article?.description || '',
            date: article?.date || '',
            category: article?.category || null,
            content: content,
            path: pathParam,
            language: articleLocale
          });
        } catch (error) {
          console.error('Error reading local file:', error);
          return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
      }

      // GitHub implementation would go here for production
      return NextResponse.json({ error: 'GitHub sync not implemented' }, { status: 501 });
    }

    // Fetch all articles
    if (!owner || !repo) {
      // Use local files
      const allArticles = [];

      // Read articles from all language files
      const languages = ['en', 'zh', 'ja'];
      for (const lang of languages) {
        const articles = readArticlesForLanguage(lang);

        // Add language info and filter
        articles.forEach(article => {
          const fileName = path.basename(article.path);
          const fullPath = path.join(localMdFolderPath, lang, fileName);
          const fileExists = fs.existsSync(fullPath);

          if (fileExists && (!article.deleted || includeDeleted)) {
            if (!category || article.category === category) {
              allArticles.push({
                ...article,
                language: lang,
                fileExists
              });
            }
          }
        });
      }

      // Sort by date (newest first)
      allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

      return NextResponse.json(allArticles);
    }

    // GitHub implementation would go here for production
    return NextResponse.json({ error: 'GitHub sync not implemented' }, { status: 501 });

  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description, date, category, content, path: inputArticlePath, language = 'en' } = await request.json();

    if (!owner || !repo) {
      // Use local file system
      let fullPath;
      let articlePath;

      if (inputArticlePath) {
        // Update existing article
        articlePath = inputArticlePath;
        fullPath = path.join(process.cwd(), articlePath);
      } else {
        // Create new article
        const fileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
        const languageDir = path.join(localMdFolderPath, language);
        fullPath = path.join(languageDir, fileName);
        articlePath = `data/md/${language}/${fileName}`;
      }

      // Write MD file
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, content, 'utf8');

      // Update articles.json for the specific language
      const articlesPath = getArticlesJsonPath(language);
      let articles = readArticlesForLanguage(language);

      const existingIndex = articles.findIndex(a => a.path === articlePath);

      const articleData = {
        title,
        description,
        date,
        category: category || null,
        path: articlePath,
        deleted: false,
        lastModified: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        articles[existingIndex] = { ...articles[existingIndex], ...articleData };
      } else {
        articles.push(articleData);
      }

      fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));

      return NextResponse.json({
        message: 'Article saved successfully',
        path: articlePath,
        language
      });
    }

    // GitHub implementation would go here for production
    return NextResponse.json({ error: 'GitHub sync not implemented' }, { status: 501 });

  } catch (error) {
    console.error('Error in POST /api/articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pathParam = searchParams.get('path');
    const permanent = searchParams.get('permanent') === 'true';

    if (!pathParam) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

    const language = getLanguageFromPath(pathParam);

    if (!owner || !repo) {
      // Use local file system
      const articlesPath = getArticlesJsonPath(language);
      let articles = readArticlesForLanguage(language);

      const articleIndex = articles.findIndex(a => a.path === pathParam);

      if (articleIndex === -1) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }

      if (permanent) {
        // Permanently delete: remove from articles.json and delete MD file
        const fullPath = path.join(process.cwd(), pathParam);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        articles.splice(articleIndex, 1);
      } else {
        // Soft delete: mark as deleted
        articles[articleIndex].deleted = true;
        articles[articleIndex].lastModified = new Date().toISOString();
      }

      fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));

      return NextResponse.json({
        message: permanent ? 'Article permanently deleted' : 'Article marked as deleted',
        path: pathParam
      });
    }

    // GitHub implementation would go here for production
    return NextResponse.json({ error: 'GitHub sync not implemented' }, { status: 501 });

  } catch (error) {
    console.error('Error in DELETE /api/articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}