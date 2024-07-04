'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
  icon: LucideIcon
  label: string
  active?: boolean
  href: string
}

export const SidebarItem = ({
  icon: Icon,
  label,
  active,
  href,
}: Props) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-row h-auto items-center w-full gap-x-4 font-medium cursor-pointer hover:text-white transition text-muted-foreground py-1',
        active && 'text-white'
      )}
    >
      <Icon className={'size-5'} />
      <p className={'truncate w-full'}>
        {label}
      </p>
    </Link>
  )
}