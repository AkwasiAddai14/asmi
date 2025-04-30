import { type Metadata } from 'next'
import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { ClerkProvider } from '@clerk/nextjs'
import {  nlNL, } from '@clerk/localizations'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Junter',
    default:
      'Samen bouwen aan integratie via werk.',
  },
  description:
    'Junter helpt gemeenten met het verbinden van nieuwkomers aan werkgevers',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
        {/* <ClerkProvider 
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    localization={nlNL}
    > */}
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
          {/* </ClerkProvider> */}
        </Providers>
      </body>
    </html>
  )
}
