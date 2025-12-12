import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Layout } from '@/components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'GitBase',
    template: '%s | GitBase'
  },
  description: 'Open source dynamic website without database, built with Next.js and GitHub API',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}