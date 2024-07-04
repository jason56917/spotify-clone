import React from 'react'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { QueryProvider } from '@/providers/QueryProvider'
import { ClerkProvider } from '@clerk/nextjs'
import { DialogProvider } from '@/providers/DialogProvider'
import { EdgeStoreProvider } from '@/lib/edgestore'
import { Toaster } from '@/components/ui/sonner'
import { PlayerBar } from '@/components/player/PlayerBar'

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
