import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hyve Codex',
  description: 'The AI productivity toolkit built for people who actually use it.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-[#4d4d4d] antialiased">
        {/* Global notification provider — added in later phases */}
        {children}
      </body>
    </html>
  )
}
