'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Home, Search } from 'lucide-react'
import { ClerkLoaded, UserButton, useAuth } from '@clerk/nextjs'

interface Props {
  className?: string
  children: React.ReactNode
}

export const Header = ({
  className,
  children,
}: Props) => {
  const { isSignedIn } = useAuth()

  const router = useRouter()

  return (
    <div
      className={cn(
        'h-fit bg-gradient-to-b from-emerald-800 p-6',
        className
      )}
    >
      <div className={'w-full mb-4 flex items-center justify-between'}>
        <div className={'hidden md:flex gap-x-2 items-center'}>
          <Button
            onClick={() => router.back()}
            variant={'outline'}
            className={'relative rounded-full aspect-square text-muted-foreground hover:text-white hover:bg-transparent'}
          >
            <ChevronLeft className={'size-8 absolute'} />
          </Button>
          <Button
            onClick={() => router.forward()}
            variant={'outline'}
            className={'relative rounded-full aspect-square text-muted-foreground hover:text-white hover:bg-transparent'}
          >
            <ChevronRight className={'size-8 absolute'} />
          </Button>
        </div>
        <div className={'flex md:hidden gap-x-2 items-center'}>
          <Button
            onClick={() => router.push('/')}
            className={'rounded-full p-3'}
          >
            <Home className={'size-4'} />
          </Button>
          <Button
            onClick={() => router.push('/search')}
            className={'rounded-full p-3'}
          >
            <Search className={'size-4'} />
          </Button>
        </div>
        <div className={'flex justify-between items-center gap-x-4'}>
          <>
            {!isSignedIn && (
              <>
                <div>
                  <Button
                    onClick={() => router.push('/sign-up')}
                    variant={'ghost'}
                    className={' rounded-full border-transparent hover:opacity-75'}
                  >
                    Sign up
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => router.push('/sign-in')}
                    className={'bg-green-500 rounded-full border-transparent hover:opacity-75'}
                  >
                    Log in
                  </Button>
                </div>
              </>
            )}
            <ClerkLoaded>
              <UserButton
                afterSignOutUrl={'/'}
              />
            </ClerkLoaded>
          </>
        </div>
      </div>
      {children}
    </div>
  )
}