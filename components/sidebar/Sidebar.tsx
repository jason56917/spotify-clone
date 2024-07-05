'use client'

import { Home, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { usePlayer } from '@/hooks/play/usePlayer'
import { cn } from '@/lib/utils'

import { SidebarItem } from './SidebarItem'
import { Library } from './Library'
import { Card } from '../ui/card'

interface Props {
  children: React.ReactNode
}

export const Sidebar = ({
  children,
}: Props) => {
  const pathname = usePathname()
  // 當在撥放音樂時，將子層空間下方減少音樂Bar的空度，避免遮擋住
  const player = usePlayer()

  const routes = useMemo(() => [
    {
      icon: Home,
      label: 'Home',
      active: pathname !== '/search',
      href: '/',
    },
    {
      icon: Search,
      label: 'Search',
      active: pathname === '/search',
      href: '/search',
    }

  ], [pathname])

  return (
    <div
      className={cn(
        'flex h-full',
        player.activeId && 'h-[calc(100%-120px)] sm:h-[calc(100%-80px)]'
      )}
    >
      <div className={'hidden md:flex flex-col gap-2 h-full w-[300px] p-2'}>
        <Card className={'bg-neutral-900 border-none'}>
          <div className={'flex flex-col gap-y-4 px-5 py-4'}>
            {routes.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
              />
            ))}
          </div>
        </Card>
        <Card className={'bg-neutral-900 overflow-y-auto h-full border-none'}>
          <Library />
        </Card>
      </div>
      <main className={'h-full flex-1 overflow-y-auto py-2 px-2 md:px-0 md:pr-2'}>
        {children}
      </main>
    </div>
  )
}