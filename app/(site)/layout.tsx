import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { EdgeStoreProvider } from '@/lib/edgestore'

import { DialogProvider } from '@/providers/DialogProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { PlayerBar } from '@/components/player/PlayerBar'
import { Toaster } from '@/components/ui/sonner'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music',
  icons: {
    icon: [
      {
        url: '/logo.svg',
        href: '/logo.svg',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClerkProvider>
          <QueryProvider>
            <EdgeStoreProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster />
                <DialogProvider />
                <Sidebar>
                  {children}
                </Sidebar>
                <PlayerBar />
              </ThemeProvider>
            </EdgeStoreProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
