// pages/index.js
import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
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
        <h1 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
          GitBase
        </h1>
        <h2 className="text-base tracking-tighter sm:text-lg md:text-lg lg:text-lg">Open Source Dynamic Website CMS Without Database</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-base flex items-center justify-center gap-2">
          <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="url(#sparkle-gradient)" stroke="#FCD34D" stroke-width="1"/>
            <defs>
              <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#FDE68A"}} />
                <stop offset="50%" style={{stopColor: "#FCD34D"}} />
                <stop offset="100%" style={{stopColor: "#F59E0B"}} />
              </linearGradient>
            </defs>
          </svg>
          GitBase is a dynamic, database-free website built with Next.js.
          <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="url(#sparkle-gradient-2)" stroke="#FCD34D" stroke-width="1"/>
            <defs>
              <linearGradient id="sparkle-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#FDE68A"}} />
                <stop offset="50%" style={{stopColor: "#FCD34D"}} />
                <stop offset="100%" style={{stopColor: "#F59E0B"}} />
              </linearGradient>
            </defs>
          </svg>
        </p>
      </section>

      <ResourceList resources={resources} />
      <ArticleList articles={allPostsData} />
    </div>
  )
}