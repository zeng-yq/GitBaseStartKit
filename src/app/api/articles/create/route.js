import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const articlesJsonPath = 'data/json/articles.json';
const mdFolderPath = 'data/md';

export async function POST(request) {
  // Double-check authentication (belt and suspenders approach)
  const { verifyRequestAuth } = await import('@/lib/auth');
  if (!verifyRequestAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, content, slug, category } = await request.json();

  // Validate slug
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  const path = `data/md/${slug}.md`;

  try {
    // Check if file already exists
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 400 });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create new file with content only (no front matter)
    const fileContent = content;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Create new article: ${title}`,
      content: Buffer.from(fileContent).toString('base64'),
    });

    // Add article metadata to articles.json
    await addArticleToIndex({
      title,
      description,
      date: new Date().toISOString(),
      category: category || null,
      path: `data/md/${slug}.md`
    });

    return NextResponse.json({ message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}


async function addArticleToIndex(articleData) {
  try {
    // Get current articles.json
    let articles = [];
    try {
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
      });
      const content = Buffer.from(currentFile.content, 'base64').toString('utf8');
      articles = JSON.parse(content);
    } catch (error) {
      // If file doesn't exist, start with empty array
      if (error.status !== 404) {
        throw error;
      }
    }

    // Add new article
    const newArticle = {
      ...articleData,
      lastModified: new Date().toISOString()
    };
    articles.push(newArticle);

    // Update articles.json
    const content = JSON.stringify(articles, null, 2);
    try {
      // Try to update existing file
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: articlesJsonPath,
      });

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: articlesJsonPath,
        message: `Add article: ${articleData.title}`,
        content: Buffer.from(content).toString('base64'),
        sha: currentFile.sha,
      });
    } catch (error) {
      // If file doesn't exist, create it
      if (error.status === 404) {
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: articlesJsonPath,
          message: `Create articles.json and add article: ${articleData.title}`,
          content: Buffer.from(content).toString('base64'),
        });
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('Error adding article to index:', error);
    throw error;
  }
}