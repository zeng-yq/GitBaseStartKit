import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { i18n, type Locale } from '@/lib/i18n-config'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
