// pages/index.js
import { Features } from '@/components/Features'
import FAQ from '@/components/FAQ'
import Testimonials from '@/components/Testimonials'
import { getDictionary } from '@/lib/get-dictionary'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StartKit - Open Source Dynamic Website CMS Without Database',
  description: 'A Next.js site with Tailwind & Shadcn/UI, using GitHub API for content management. No database needed for dynamic updates.',
}

export default async function Home() {
  // Get English dictionary for testimonials
  const dict = await getDictionary('en');

  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          StartKit
        </h1>
        <h2 className="text-base tracking-tighter sm:text-lg md:text-lg lg:text-lg">Open Source Dynamic Website CMS Without Database</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 text-base tracking-tighter sm:text-lg md:text-lg lg:text-lg flex items-center justify-center gap-2">
          <span className="text-yellow-400">✨︎</span>
          StartKit is a dynamic, database-free website built with Next.js.
          <span className="text-yellow-400">✨︎</span>
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <span className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full">100% Free</span>
          <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">Powered by AI</span>
          <span className="px-3 py-1 text-sm font-medium text-white bg-purple-500 rounded-full">No Login Required</span>
          <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full">Privacy</span>
        </div>
      </section>

      <Features />
      <Testimonials dict={dict} />
      <FAQ />
    </div>
  )
}