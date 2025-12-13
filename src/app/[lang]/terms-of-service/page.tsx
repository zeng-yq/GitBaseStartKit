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
    title: dict.termsOfService?.title || '服务条款',
    description: dict.termsOfService?.description || 'GitBase 服务条款',
  }
}

export default async function TermsOfService({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold mb-8">
          {dict.termsOfService?.title || '服务条款'}
        </h1>

        <p className="text-gray-600 mb-8">
          {dict.termsOfService?.lastUpdated || '最后更新：'} {new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en-US')}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">服务概述</h2>
            <p>
              GitBase 是一个开源的动态网站内容管理系统，无需传统数据库。使用本服务即表示您同意遵守以下条款。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">使用条件</h2>
            <p>
              您必须遵守所有适用法律法规，不得将本服务用于任何非法或未经授权的目的。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">内容责任</h2>
            <p>
              用户对其发布的内容承担全部责任。我们保留删除违规内容的权利。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">知识产权</h2>
            <p>
              GitBase 采用开源许可证发布。您在使用时需要遵守相应的开源协议条款。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">免责声明</h2>
            <p>
              本服务按"现状"提供，不提供任何明示或暗示的保证。我们不对服务的中断或数据丢失承担责任。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">服务变更</h2>
            <p>
              我们保留随时修改或终止服务的权利，重要变更将提前通知用户。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">联系方式</h2>
            <p>
              如有任何问题，请通过我们的 GitHub 仓库联系我们。
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