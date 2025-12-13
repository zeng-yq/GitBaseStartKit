import type { Locale } from '@/lib/i18n-config'

export interface Article {
  id: string
  title: string
  description: string
  date: string
  category?: string | null
  lastModified: string
  path: string
  language: Locale
  deleted?: boolean
  fileExists?: boolean  // 用于标记对应文件是否存在
}

export interface ArticleListItem {
  id: string
  title: string
  description: string
  date: string
  category?: string | null
  path: string
  language: Locale
  deleted?: boolean
  fileExists?: boolean
}

export interface ArticleDetail extends ArticleListItem {
  contentHtml: string
  slug: string
}