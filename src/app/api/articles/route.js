import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const articlesJsonPath = 'data/json/articles.json';
const mdFolderPath = 'data/md';

// Local paths
const localArticlesJsonPath = path.join(process.cwd(), 'data', 'json', 'articles.json');
const localMdFolderPath = path.join(process.cwd(), 'data', 'md');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sync = searchParams.get('sync');
  const pathParam = searchParams.get('path');
  const category = searchParams.get('category');
  const includeDeleted = searchParams.get('includeDeleted') === 'true';

  try {
    if (pathParam) {
      // Fetch single article
      if (!owner || !repo) {
        // Use local file
        try {
          const fullPath = path.join(process.cwd(), decodeURIComponent(pathParam));
          const content = fs.readFileSync(fullPath, 'utf8');

          // Read metadata from articles.json
          let articles = [];
          try {
            const articlesContent = fs.readFileSync(localArticlesJsonPath, 'utf8');
            articles = JSON.parse(articlesContent);
          } catch (e) {
            console.error('Error reading articles.json:', e);
          }

          const article = articles.find(a => a.path === pathParam);

          return NextResponse.json({
            title: article?.title || '',
            description: article?.description || '',
            date: article?.date || '',
            category: article?.category || null,
            content: content,
            path: pathParam,
          });
        } catch (error) {
          console.error('Error fetching local article:', error);
          return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
        }
      }

      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: decodeURIComponent(pathParam),
        });

        const content = Buffer.from(data.content, 'base64').toString('utf8');

        // Read metadata from articles.json
        let articles = [];
        try {
          const { data: articlesFile } = await octokit.repos.getContent({
            owner,
            repo,
            path: articlesJsonPath,
          });
          const articlesContent = Buffer.from(articlesFile.content, 'base64').toString('utf8');
          articles = JSON.parse(articlesContent);
        } catch (e) {
          console.error('Error reading articles.json from GitHub:', e);
        }

        const article = articles.find(a => a.path === pathParam);

        return NextResponse.json({
          title: article?.title || '',
          description: article?.description || '',
          date: article?.date || '',
          category: article?.category || null,
          content: content,
          path: data.path,
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
      }
    } else if (sync === 'true') {
      if (owner && repo) {
        await syncArticles();
      } else {
        await syncLocalArticles();
      }
    }

    // Get articles
    let articles;
    if (!owner || !repo) {
      // Use local file
      try {
        const content = fs.readFileSync(localArticlesJsonPath, 'utf8');
        articles = JSON.parse(content);
      } catch (error) {
        console.error('Error reading local articles.json:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
      }
    } else {
      // Use GitHub
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
      });

      const content = Buffer.from(data.content, 'base64').toString('utf8');
      articles = JSON.parse(content);
    }

    // Filter out deleted articles unless explicitly requested
    if (!includeDeleted) {
      articles = articles.filter(article => !article.deleted);
    }

    // Filter by category if specified
    if (category) {
      articles = articles.filter(article => article.category === category);
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request) {
  // Double-check authentication (belt and suspenders approach)
  const { verifyRequestAuth } = await import('@/lib/auth');
  if (!verifyRequestAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { article } = await request.json();

  try {
    // Update the MD file with content only
    await updateMdFile(article);

    // Update metadata in articles.json
    if (!owner || !repo) {
      await updateArticleMetadataLocal(article);
    } else {
      await updateArticleMetadataGitHub(article);
    }

    return NextResponse.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

async function syncArticles() {
  try {
    // Fetch all MD files
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path: mdFolderPath,
    });

    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    // Get current articles.json to preserve metadata
    let existingArticles = [];
    try {
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
      });
      const content = Buffer.from(currentFile.content, 'base64').toString('utf8');
      existingArticles = JSON.parse(content);
    } catch (error) {
      console.log('No existing articles.json found, will create new one');
    }

    const articles = await Promise.all(mdFiles.map(async file => {
      // Fetch the last commit for this file
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        path: file.path,
        per_page: 1
      });

      const lastModified = commits[0]?.commit.committer.date;

      // Check if article already exists in index
      const existingArticle = existingArticles.find(a => a.path === file.path);

      if (existingArticle) {
        // Update lastModified time
        return {
          ...existingArticle,
          lastModified: lastModified || new Date().toISOString()
        };
      } else {
        // Create minimal entry for new files
        return {
          title: file.name.replace('.md', ''),
          description: '',
          date: lastModified ? new Date(lastModified).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: null,
          lastModified: lastModified || new Date().toISOString(),
          path: file.path,
        };
      }
    }));

    // Update articles.json
    try {
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
      });

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: articlesJsonPath,
        message: 'Sync articles',
        content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
        sha: currentFile.sha,
      });
    } catch (error) {
      if (error.status === 404) {
        // Create new file if it doesn't exist
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: articlesJsonPath,
          message: 'Create articles.json',
          content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
        });
      } else {
        throw error;
      }
    }

    // Also update local file
    fs.writeFileSync(localArticlesJsonPath, JSON.stringify(articles, null, 2));

  } catch (error) {
    console.error('Error syncing articles:', error);
    throw error;
  }
}

async function syncLocalArticles() {
  try {
    // Get all MD files from local directory
    const mdFiles = fs.readdirSync(localMdFolderPath).filter(file => file.endsWith('.md'));

    // Get current articles.json to preserve metadata
    let existingArticles = [];
    try {
      const content = fs.readFileSync(localArticlesJsonPath, 'utf8');
      existingArticles = JSON.parse(content);
    } catch (error) {
      console.error('Error reading existing articles.json:', error);
    }

    const articles = mdFiles.map(file => {
      const filePath = path.join(localMdFolderPath, file);
      const stats = fs.statSync(filePath);
      const articlePath = `data/md/${file}`;

      // Check if article already exists in index
      const existingArticle = existingArticles.find(a => a.path === articlePath);

      if (existingArticle) {
        // Update lastModified time
        return {
          ...existingArticle,
          lastModified: stats.mtime.toISOString()
        };
      } else {
        // Create minimal entry for new files
        return {
          title: file.replace('.md', ''),
          description: '',
          date: stats.mtime.toISOString().split('T')[0],
          category: null,
          lastModified: stats.mtime.toISOString(),
          path: articlePath,
        };
      }
    });

    // Update local articles.json
    fs.writeFileSync(localArticlesJsonPath, JSON.stringify(articles, null, 2));
    console.log('Local articles synced successfully');
  } catch (error) {
    console.error('Error syncing local articles:', error);
    throw error;
  }
}

// Soft delete (mark as deleted)
export async function DELETE(request) {
  const { verifyRequestAuth } = await import('@/lib/auth');
  if (!verifyRequestAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  try {
    // Get current articles.json
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    });

    const content = Buffer.from(currentFile.content, 'base64').toString('utf8');
    let articles = JSON.parse(content);

    // Find and mark article as deleted
    articles = articles.map(article =>
      article.path === path
        ? { ...article, deleted: true, deletedAt: new Date().toISOString() }
        : article
    );

    // Update articles.json
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: articlesJsonPath,
      message: `Soft delete article: ${path}`,
      content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
      sha: currentFile.sha,
    });

    return NextResponse.json({ message: 'Article moved to trash' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

// Restore or permanently delete
export async function PATCH(request) {
  const { verifyRequestAuth } = await import('@/lib/auth');
  if (!verifyRequestAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path, action } = await request.json();

  if (!path || !action) {
    return NextResponse.json({ error: 'Path and action are required' }, { status: 400 });
  }

  try {
    // Get current articles.json
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    });

    const content = Buffer.from(currentFile.content, 'base64').toString('utf8');
    let articles = JSON.parse(content);

    if (action === 'restore') {
      // Restore article
      articles = articles.map(article =>
        article.path === path
          ? { ...article, deleted: false, deletedAt: undefined }
          : article
      );

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: articlesJsonPath,
        message: `Restore article: ${path}`,
        content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
        sha: currentFile.sha,
      });

      return NextResponse.json({ message: 'Article restored' });

    } else if (action === 'permanentDelete') {
      // Permanently delete: remove from articles.json and delete MD file
      articles = articles.filter(article => article.path !== path);

      // Delete MD file
      const { data: mdFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: path,
      });

      await octokit.repos.deleteFile({
        owner,
        repo,
        path: path,
        message: `Permanently delete article: ${path}`,
        sha: mdFile.sha,
      });

      // Update articles.json
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: articlesJsonPath,
        message: `Remove article from index: ${path}`,
        content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
        sha: currentFile.sha,
      });

      return NextResponse.json({ message: 'Article permanently deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in PATCH:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}

async function updateMdFile(article) {
  try {
    // Update MD file with content only (no front matter)
    if (!owner || !repo) {
      // Update local file
      const fullPath = path.join(process.cwd(), article.path);
      fs.writeFileSync(fullPath, article.content);
      console.log(`Updated local article content: ${article.path}`);
    } else {
      // Update GitHub file
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: article.path,
      });

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: article.path,
        message: `Update article content: ${article.title}`,
        content: Buffer.from(article.content).toString('base64'),
        sha: currentFile.sha,
      });
    }

  } catch (error) {
    console.error('Error updating MD file:', error);
    throw error;
  }
}

async function updateArticleMetadataLocal(article) {
  try {
    let articles = [];
    try {
      const content = fs.readFileSync(localArticlesJsonPath, 'utf8');
      articles = JSON.parse(content);
    } catch (error) {
      console.error('Error reading local articles.json:', error);
      throw error;
    }

    const articleIndex = articles.findIndex(a => a.path === article.path);
    if (articleIndex >= 0) {
      articles[articleIndex] = {
        ...articles[articleIndex],
        title: article.title,
        description: article.description,
        category: article.category,
        lastModified: new Date().toISOString()
      };
    }

    fs.writeFileSync(localArticlesJsonPath, JSON.stringify(articles, null, 2));
    console.log(`Updated metadata for article: ${article.path}`);
  } catch (error) {
    console.error('Error updating local article metadata:', error);
    throw error;
  }
}

async function updateArticleMetadataGitHub(article) {
  try {
    // Get current articles.json from GitHub
    let articles = [];
    try {
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
      });
      const content = Buffer.from(currentFile.content, 'base64').toString('utf8');
      articles = JSON.parse(content);

      const articleIndex = articles.findIndex(a => a.path === article.path);
      if (articleIndex >= 0) {
        articles[articleIndex] = {
          ...articles[articleIndex],
          title: article.title,
          description: article.description,
          category: article.category,
          lastModified: new Date().toISOString()
        };
      }

      // Update articles.json on GitHub
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: articlesJsonPath,
        message: `Update metadata for article: ${article.title}`,
        content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
        sha: currentFile.sha,
      });
    } catch (error) {
      console.error('Error updating GitHub article metadata:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating GitHub article metadata:', error);
    throw error;
  }
}