// pages/index.js
import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
import { Features } from '@/components/Features'
import FAQ from '@/components/FAQ'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GitBase - Open Source Dynamic Website CMS Without Database',
  description: 'A Next.js site with Tailwind & Shadcn/UI, using GitHub API for content management. No database needed for dynamic updates.',
}

export default function Home() {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  const allResources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  // Filter out deleted resources
  const resources = allResources.filter((resource: any) => !resource.deleted)
  const allPostsData = getSortedPostsData().slice(0, 6)

  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          GitBase
        </h1>
        <h2 className="text-base tracking-tighter sm:text-lg md:text-lg lg:text-lg">Open Source Dynamic Website CMS Without Database</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 text-base tracking-tighter sm:text-lg md:text-lg lg:text-lg flex items-center justify-center gap-2">
          <span className="text-yellow-400">✨︎</span>
          GitBase is a dynamic, database-free website built with Next.js.
          <span className="text-yellow-400">✨︎</span>
        </p>
      </section>

      <Features />
      <FAQ />
      <ResourceList resources={resources} />
      <ArticleList articles={allPostsData} />
    </div>
  )
}