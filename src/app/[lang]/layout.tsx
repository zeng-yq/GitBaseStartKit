import { i18n, type Locale } from '@/lib/i18n-config'
import { LangProvider } from '@/components/LangProvider'

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
    <LangProvider lang={lang as Locale}>
      {children}
    </LangProvider>
  )
}
