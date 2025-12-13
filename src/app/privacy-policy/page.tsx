import { Metadata } from 'next'
import { getDictionary } from '@/lib/get-dictionary'
import Link from 'next/link'
import { Locale } from '@/lib/i18n-config'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary('en')

  return {
    title: dict.privacyPolicy?.title || 'Privacy Policy',
    description: dict.privacyPolicy?.description || 'GitBase Privacy Policy',
  }
}

export default async function PrivacyPolicy() {
  const dict = await getDictionary('en')

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold mb-8">
          {dict.privacyPolicy?.title || 'Privacy Policy'}
        </h1>

        <p className="text-gray-600 mb-8">
          {dict.privacyPolicy?.lastUpdated || 'Last updated:'} {new Date().toLocaleDateString('en-US')}
        </p>

        <div className="space-y-8">
          {dict.privacyPolicy?.sections && Object.entries(dict.privacyPolicy.sections).map(([key, section]) => (
            <section key={key}>
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}