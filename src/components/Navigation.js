'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LanguageSuggestion from '@/components/LanguageSuggestion'
import { i18n, getLocaleFromPath, addLocaleToPath } from '@/lib/i18n-config'

const navigationText = {
  en: {
    home: 'Home',
    resources: 'Resources',
    articles: 'Articles',
    admin: 'Admin',
    logout: 'Logout'
  },
  zh: {
    home: '首页',
    resources: '资源',
    articles: '文章',
    admin: '管理',
    logout: '登出'
  },
  ja: {
    home: 'ホーム',
    resources: 'リソース',
    articles: '記事',
    admin: '管理',
    logout: 'ログアウト'
  }
}

const navItems = [
  { path: '/', key: 'home' },
  { path: '/resources', key: 'resources' },
  { path: '/posts', key: 'articles' },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Extract current locale from pathname
  const currentLocale = getLocaleFromPath(pathname) || i18n.defaultLocale

  // Get localized paths for nav items
  const getLocalizedPath = (path) => {
    return addLocaleToPath(path, currentLocale)
  }

  // Get navigation text for current locale
  const getText = () => {
    return navigationText[currentLocale] || navigationText[i18n.defaultLocale]
  }

  useEffect(() => {
    let isMounted = true;
    const checkLoginStatus = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        if (isMounted) setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkLoginStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsLoggedIn(false);
      router.push(getLocalizedPath('/'));
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const text = getText()

  return (
    <>
      <LanguageSuggestion currentLocale={currentLocale} currentPath={pathname} />
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href={getLocalizedPath('/')} className="flex items-center space-x-2">
            <img
              src="/favicon.svg"
              alt="GitBase Logo"
              className="h-8 w-8"
            />
            <span className="inline-block font-bold">GitBase</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const localizedPath = getLocalizedPath(item.path)
              return (
                <Link
                  key={item.path}
                  href={localizedPath}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    pathname === localizedPath && "text-foreground"
                  )}
                >
                  {text[item.key]}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={currentLocale} />
          {!isLoading && isLoggedIn && (
            <>
              <Link href={getLocalizedPath('/admin')}>
                <Button variant="ghost">{text.admin}</Button>
              </Link>
              <Button onClick={handleLogout} variant="outline">{text.logout}</Button>
            </>
          )}
        </div>
      </div>
    </header>
    </>
  )
}