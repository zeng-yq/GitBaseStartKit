'use client'

// components/Footer.js
import Link from 'next/link';
import { useLang } from '@/components/LangProvider';
import { addLocaleToPath } from '@/lib/i18n-config';
import { usePathname } from 'next/navigation';

const footerText = {
  en: {
    description: "GitBase is an open-source dynamic website solution without a traditional database, built with Next.js and powered by GitHub.",
    quickLinks: "Quick Links",
    connect: "Connect",
    home: "Home",
    resources: "Resources",
    articles: "Articles",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    copyright: "© {year} GitBase. All rights reserved."
  },
  zh: {
    description: "GitBase 是一个开源的动态网站解决方案，无需传统数据库，基于 Next.js 构建，由 GitHub 提供支持。",
    quickLinks: "快速链接",
    connect: "联系方式",
    home: "首页",
    resources: "资源",
    articles: "文章",
    privacy: "隐私政策",
    terms: "服务条款",
    copyright: "© {year} GitBase. 保留所有权利。"
  },
  ja: {
    description: "GitBaseは、従来のデータベースを使用しないオープンソースの動的Webサイトソリューションです。Next.jsで構築され、GitHubによって提供されます。",
    quickLinks: "クイックリンク",
    connect: "接続",
    home: "ホーム",
    resources: "リソース",
    articles: "記事",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    copyright: "© {year} GitBase. すべての権利を保有。"
  }
};

export function Footer() {
  const pathname = usePathname();

  // Initialize with English as default
  let lang = 'en';

  // Try to get language from context first
  try {
    const { lang: contextLang } = useLang();
    lang = contextLang;
  } catch (error) {
    // useLang hook not available, fallback to URL detection using pathname
    if (pathname) {
      const pathSegments = pathname.split('/');
      const potentialLocale = pathSegments[1];

      // Check if the first segment is a valid locale
      if (['en', 'zh', 'ja'].includes(potentialLocale)) {
        lang = potentialLocale;
      }
    }
  }

  // Final fallback to English
  if (!footerText[lang]) {
    lang = 'en';
  }

  const text = footerText[lang];

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <img src="/favicon.svg" alt="GitBase" className="h-8 w-8" />
              <span className="inline-block font-bold text-gray-600">GitBase</span>
            </div>
            <p className="mt-4 text-base text-gray-500">
              {text.description}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">{text.quickLinks}</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href={addLocaleToPath("/", lang)} className="text-base text-gray-500 hover:text-gray-900">
                  {text.home}
                </Link>
              </li>
              <li>
                <Link href={addLocaleToPath("/resources", lang)} className="text-base text-gray-500 hover:text-gray-900">
                  {text.resources}
                </Link>
              </li>
              <li>
                <Link href={addLocaleToPath("/posts", lang)} className="text-base text-gray-500 hover:text-gray-900">
                  {text.articles}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">{text.connect}</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://gitbase.app/" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  GitBase
                </a>
              </li>
              <li>
                <a href="https://github.com/qiayue/gitbase" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/gefei55" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-base text-gray-400 mb-4 sm:mb-0">
              {text.copyright.replace('{year}', new Date().getFullYear())}
            </p>
            <div className="flex space-x-6">
              <Link
                href={addLocaleToPath("/privacy-policy", lang)}
                className="text-base text-gray-400 hover:text-gray-600"
              >
                {text.privacy}
              </Link>
              <Link
                href={addLocaleToPath("/terms-of-service", lang)}
                className="text-base text-gray-400 hover:text-gray-600"
              >
                {text.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}