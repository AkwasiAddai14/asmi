import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import '@/styles/tailwind.css'
import {  nlNL, } from '@clerk/localizations'
import { Providers } from '../providers'


export const metadata = {
  title: 'Junter',
  description: 'Empowering progress, enabling growth.'
}

const inter = Inter({subsets: ["latin"]})

export default function AuthLayout({children} : {children : React.ReactNode}){
  return(
    <ClerkProvider 
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    localization={nlNL}
    >
      <html lang="en">
       <body className={`${inter.className} bg-dark-1`}>
        <Providers>
        {children}
        </Providers>
       </body>
      </html>
    </ClerkProvider>
  )
}