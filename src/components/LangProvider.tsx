'use client'

import { createContext, useContext } from 'react'
import { type Locale } from '@/lib/i18n-config'

interface LangContextType {
  lang: Locale
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LangProvider({
  children,
  lang
}: {
  children: React.ReactNode
  lang: Locale
}) {
  return (
    <LangContext.Provider value={{ lang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return context
}