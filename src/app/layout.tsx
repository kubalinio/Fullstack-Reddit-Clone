import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/Navbar'

export const metadata = {
  title: 'Needit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const OpenSans = Open_Sans({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('light bg-white text-slate-900 antialiased', OpenSans)}>
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Navbar />

        <div className="container mx-auto h-full max-w-7xl pt-12">{children}</div>
      </body>
    </html>
  )
}
