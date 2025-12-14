import { getPostData } from '@/lib/posts'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import { i18n, addLocaleToPath } from '@/lib/i18n-config'
import CategoryBadge from '@/components/CategoryBadge'

export async function generateStaticParams() {
  // This would need to be populated with actual slugs
  return []
}

async function getCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/categories?type=article`, {
      cache: 'force-static'
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
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href={homePath} className="hover:text-blue-600">{dict.navigation.home}</Link>
        <ChevronRight className="mx-2" size={16} />
        <Link href={postsPath} className="hover:text-blue-600">{dict.navigation.posts}</Link>
        <ChevronRight className="mx-2" size={16} />
        <span className="text-gray-900">{postData.title}</span>
      </nav>

      {/* Article meta information below breadcrumb */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
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
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />

      {/* Back to articles link */}
      <div className="mt-12">
        <Link href={postsPath} className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          {dict.navigation.posts}
        </Link>
      </div>
    </article>
  )
}
