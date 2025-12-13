const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(__dirname, '..', 'data', 'md');
const articlesJsonPath = path.join(__dirname, '..', 'data', 'json', 'articles.json');
const backupDirectory = path.join(__dirname, '..', 'data', 'md', 'backup');

console.log('Starting article migration...\n');

// 1. 创建备份目录
console.log('Step 1: Creating backup of original markdown files...');
if (!fs.existsSync(backupDirectory)) {
  fs.mkdirSync(backupDirectory, { recursive: true });
}

// 2. 读取并备份现有文件
const fileNames = fs.readdirSync(postsDirectory).filter(name => name.endsWith('.md'));
console.log(`Found ${fileNames.length} markdown files to migrate\n`);

// 3. 读取 articles.json 确保元数据是最新的
let articles = [];
try {
  const articlesJson = fs.readFileSync(articlesJsonPath, 'utf8');
  articles = JSON.parse(articlesJson);
  console.log(`Loaded ${articles.length} articles from articles.json\n`);
} catch (error) {
  console.error('Error reading articles.json:', error);
  process.exit(1);
}

// 4. 处理每个文件
fileNames.forEach((fileName) => {
  const filePath = path.join(postsDirectory, fileName);
  const backupPath = path.join(backupDirectory, fileName);

  console.log(`Processing: ${fileName}`);

  try {
    // 备份原文件
    fs.copyFileSync(filePath, backupPath);
    console.log(`  ✓ Backed up to backup/${fileName}`);

    // 读取文件内容
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontMatter, content: articleContent } = matter(fileContents);

    // 查找对应的文章元数据
    const articlePath = `data/md/${fileName}`;
    const articleIndex = articles.findIndex(a => a.path === articlePath);

    if (articleIndex === -1) {
      console.log(`  ⚠ Warning: No entry found in articles.json for ${fileName}`);

      // 创建新的文章条目
      const newArticle = {
        title: frontMatter.title || 'Untitled',
        description: frontMatter.description || '',
        date: frontMatter.date || new Date().toISOString().split('T')[0],
        category: frontMatter.category || null,
        lastModified: new Date().toISOString(),
        path: articlePath
      };

      articles.push(newArticle);
      console.log(`  ✓ Created new entry in articles.json`);
    } else {
      // 更新现有条目，确保元数据是最新的
      if (frontMatter.title) articles[articleIndex].title = frontMatter.title;
      if (frontMatter.description) articles[articleIndex].description = frontMatter.description;
      if (frontMatter.date) articles[articleIndex].date = frontMatter.date;
      if (frontMatter.category !== undefined) articles[articleIndex].category = frontMatter.category;

      articles[articleIndex].lastModified = new Date().toISOString();
      console.log(`  ✓ Updated metadata in articles.json`);
    }

    // 写入纯内容到原文件（移除 front matter）
    fs.writeFileSync(filePath, articleContent);
    console.log(`  ✓ Removed front matter from ${fileName}`);

  } catch (error) {
    console.error(`  ✗ Error processing ${fileName}:`, error);
  }

  console.log('');
});

// 5. 保存更新后的 articles.json
console.log('Step 5: Saving updated articles.json...');
try {
  fs.writeFileSync(articlesJsonPath, JSON.stringify(articles, null, 2));
  console.log(`  ✓ Saved ${articles.length} articles to articles.json`);
} catch (error) {
  console.error('  ✗ Error saving articles.json:', error);
}

console.log('\n✅ Migration completed successfully!');
console.log('\nSummary:');
console.log(`- Processed ${fileNames.length} markdown files`);
console.log('- Original files backed up to data/md/backup/');
console.log('- Front matter removed from markdown files');
console.log('- Metadata consolidated in articles.json');
console.log('\n⚠️  Please verify the migration worked correctly before deleting the backup folder.');