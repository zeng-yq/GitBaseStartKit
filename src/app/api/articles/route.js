import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
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
          const { data: frontMatter, content: articleContent } = matter(content);

          return NextResponse.json({
            ...frontMatter,
            content: articleContent,
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
        const { data: frontMatter, content: articleContent } = matter(content);

        return NextResponse.json({
          ...frontMatter,
          content: articleContent,
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
    // Update the MD file
    await updateMdFile(article);

    // Sync articles
    if (!owner || !repo) {
      await syncLocalArticles();
    } else {
      await syncArticles();
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

    const articles = await Promise.all(mdFiles.map(async file => {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const { data: frontMatter, content: articleContent } = matter(content);

      // Fetch the last commit for this file
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        path: file.path,
        per_page: 1
      });

      const lastModified = commits[0]?.commit.committer.date || data.sha;

      return {
        title: frontMatter.title,
        description: frontMatter.description,
        date: frontMatter.date,
        category: frontMatter.category || null,
        lastModified: lastModified,
        path: file.path,
      };
    }));

    // Update articles.json
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

    const articles = mdFiles.map(file => {
      const filePath = path.join(localMdFolderPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data: frontMatter } = matter(content);
      const stats = fs.statSync(filePath);

      return {
        title: frontMatter.title,
        description: frontMatter.description,
        date: frontMatter.date,
        category: frontMatter.category || null,
        lastModified: stats.mtime.toISOString(),
        path: `data/md/${file}`,
      };
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
    if (!owner || !repo) {
      // Update local file
      const fullPath = path.join(process.cwd(), article.path);
      const currentContent = fs.readFileSync(fullPath, 'utf8');
      const { data: frontMatter } = matter(currentContent);

      const updatedFrontMatter = {
        ...frontMatter,
        title: article.title,
        description: article.description,
        category: article.category !== undefined ? article.category : frontMatter.category,
        lastModified: new Date().toISOString(),
      };

      const updatedContent = matter.stringify(article.content, updatedFrontMatter);
      fs.writeFileSync(fullPath, updatedContent);
      console.log(`Updated local article: ${article.path}`);
    } else {
      // Update GitHub file
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: article.path,
      });

      const currentContent = Buffer.from(currentFile.content, 'base64').toString('utf8');
      const { data: frontMatter, content: articleContent } = matter(currentContent);

      const updatedFrontMatter = {
        ...frontMatter,
        title: article.title,
        description: article.description,
        category: article.category !== undefined ? article.category : frontMatter.category,
        lastModified: new Date().toISOString(),
      };

      const updatedContent = matter.stringify(article.content, updatedFrontMatter);

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: article.path,
        message: `Update article: ${article.title}`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: currentFile.sha,
      });
    }

  } catch (error) {
    console.error('Error updating MD file:', error);
    throw error;
  }
}