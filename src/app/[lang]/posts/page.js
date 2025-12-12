import ArticleList from '@/components/ArticleList'
import { getSortedPostsData } from '@/lib/posts'
import { getDictionary } from '@/lib/get-dictionary'
import { i18n } from '@/lib/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return {
    title: dict.articles.title,
    description: 'Read our latest articles on web development, GitHub tips, and best practices.',
  }
}

export default async function Articles({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const allPostsData = getSortedPostsData()

  return (
    <div className="container mx-auto py-12">
      <ArticleList articles={allPostsData} showMoreLink={false} />
    </div>
  )
}
