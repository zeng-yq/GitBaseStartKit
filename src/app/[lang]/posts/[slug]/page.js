import { getPostData } from '@/lib/posts'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import { i18n, addLocaleToPath } from '@/lib/i18n-config'
import CategoryBadge from '@/components/CategoryBadge'
import TableOfContents from '@/components/TableOfContents'

export async function generateStaticParams() {
  // This would need to be populated with actual slugs
  return []
}

async function getCategories() {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${appUrl}/api/categories?type=article`, {
      cache: 'force-cache'
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return [];
}

export async function generateMetadata({ params }) {
  const { slug, lang } = await params
  const postData = await getPostData(slug, lang)
  return {
    title: `${postData.title}`,
    description: postData.description || `Read about ${postData.title} on GitBase`,
  }
}

export default async function Post({ params }) {
  const { slug, lang } = await params
  const dict = await getDictionary(lang)
  const postData = await getPostData(slug, lang)
  const categories = await getCategories()

  const homePath = addLocaleToPath('/', lang)
  const postsPath = addLocaleToPath('/posts', lang)

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex gap-8">
        {/* Main article content */}
        <article className="flex-1 max-w-3xl">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center text-sm text-gray-500 mb-6">
            <Link href={homePath} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.navigation.home}</Link>
            <ChevronRight className="mx-2" size={16} />
            <Link href={postsPath} className="hover:text-blue-600 dark:hover:text-blue-400">{dict.navigation.posts}</Link>
            <ChevronRight className="mx-2" size={16} />
            <span className="text-gray-900 dark:text-gray-100">{postData.title}</span>
          </nav>

          {/* Article meta information below breadcrumb */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
            {postData.date && (
              <time>{new Date(postData.date).toLocaleDateString()}</time>
            )}
            {postData.category && (
              <>
                <span>•</span>
                <CategoryBadge category={postData.category} categories={categories} />
              </>
            )}
          </div>

          {/* Article content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />

          {/* Back to articles link */}
          <div className="mt-12">
            <Link href={postsPath} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={20} />
              {dict.navigation.posts}
            </Link>
          </div>
        </article>

        {/* Table of Contents - Desktop only */}
        {postData.headings && postData.headings.length > 0 && (
          <aside
            className="hidden xl:block w-64 sticky top-24 h-fit"
            role="complementary"
            aria-label="文章目录"
          >
            <TableOfContents headings={postData.headings} />
          </aside>
        )}
      </div>
    </div>
  )
}
