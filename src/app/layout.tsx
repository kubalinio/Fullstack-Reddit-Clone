import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import { Providers } from '@/components/Providers'

export const metadata = {
  title: 'Needdit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const OpenSans = Open_Sans({ subsets: ['latin'] })

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
  return (
    <html lang="en" className={cn('light bg-white text-slate-900 antialiased', OpenSans.className)}>
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Navbar />

          {authModal}

          <div className="container mx-auto h-full max-w-7xl pt-12">{children}</div>

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
