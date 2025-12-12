// Multi-language home page
import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
import { Metadata } from 'next'
import { i18n, type Locale } from '@/lib/i18n-config'
import { getDictionary } from '@/lib/get-dictionary'

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return {
    title: dict.home.title + ' - ' + dict.home.subtitle,
    description: dict.home.description,
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  const allResources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  // Filter out deleted resources
  const resources = allResources.filter((resource: any) => !resource.deleted)
  const allPostsData = getSortedPostsData().slice(0, 6)

  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          {dict.home.title}
        </h1>
        <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">
          {dict.home.subtitle}
        </h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          {dict.home.description}
        </p>
      </section>

      <ResourceList resources={resources} />
      <ArticleList articles={allPostsData} />
    </div>
  )
}
