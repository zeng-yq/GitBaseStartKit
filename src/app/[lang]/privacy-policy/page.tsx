import { Metadata } from 'next'
import { i18n, type Locale } from '@/lib/i18n-config'
import { getDictionary } from '@/lib/get-dictionary'
import Link from 'next/link'
import { addLocaleToPath } from '@/lib/i18n-config'

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return {
    title: dict.privacyPolicy?.title || '隐私政策',
    description: dict.privacyPolicy?.description || 'GitBase 隐私政策',
  }
}

export default async function PrivacyPolicy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold mb-8">
          {dict.privacyPolicy?.title || '隐私政策'}
        </h1>

        <p className="text-gray-600 mb-8">
          {dict.privacyPolicy?.lastUpdated || '最后更新：'} {new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en-US')}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">信息收集</h2>
            <p>
              我们致力于保护您的隐私。GitBase 作为一个开源项目，我们只收集必要的技术信息来改善服务体验。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">信息使用</h2>
            <p>
              收集的信息仅用于改善网站性能、用户体验和技术支持。我们不会将您的信息出售给第三方。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">数据安全</h2>
            <p>
              我们采用行业标准的安全措施来保护您的数据，确保信息的安全性和完整性。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookie 使用</h2>
            <p>
              我们可能使用 Cookie 来改善用户体验，您可以通过浏览器设置管理 Cookie 偏好。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
            <p>
              如有任何隐私相关问题，请通过我们的 GitHub 仓库联系我们。
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href={addLocaleToPath("/", lang as Locale)}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}