// components/ArticleList.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import CategoryBadge from './CategoryBadge'
import { getLocaleFromPath, addLocaleToPath } from '@/lib/i18n-config'

export default function ArticleList({ articles, showMoreLink = true, locale }) {
  const [categories, setCategories] = useState([])
  const pathname = usePathname()
  const currentLocale = locale || getLocaleFromPath(pathname) || 'en'  // Use provided locale or get from path

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories?type=article')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  const getLocalizedPath = (path) => {
    return addLocaleToPath(path, currentLocale)
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tighter">Articles</h2>
        {showMoreLink && (
          <Link href={getLocalizedPath('/posts')} className="text-blue-600 hover:text-blue-800 transition-colors">
            More articles →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(({ id, title, description, category, date, coverImage }) => (
          <Link key={id} href={getLocalizedPath(`/posts/${id}`)} className="group">
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* 封面图区域 */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                  src={coverImage ? `/images/articles/${coverImage}` : '/images/default-article-cover.svg'}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // 自定义封面失败 → 直接使用占位图
                    if (coverImage) {
                      e.target.src = '/images/default-article-cover.svg';
                      e.target.onerror = null; // 防止无限循环
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* 内容区域 */}
              <div className="flex-1 p-6 flex flex-col">
                {/* 分类标签和发布日期 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {category && <CategoryBadge category={category} categories={categories} />}
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(date).toLocaleDateString(currentLocale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>

                {/* 标题 */}
                <CardTitle className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {title}
                </CardTitle>

                {/* 描述 */}
                <CardDescription className="line-clamp-3 flex-1">
                  {description}
                </CardDescription>

                {/* 阅读更多 */}
                <div className="flex items-center text-blue-600 text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  阅读更多
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
