'use client'

import { SongType } from '@/db/schema'
import { usePlayer } from '@/hooks/play/usePlayer'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'

interface Props {
  song: SongType
  songIds?: string[]
}

export const LibraryItem = ({
  song,
  songIds,
}: Props) => {
  const player = usePlayer()

  const handleClick = (songId: string) => {
    if (songIds) {
      player.setId(songId)
      player.setIds(songIds)
    }
  }

  return (
    <div
      onClick={() => handleClick(song.id)}
      className={cn(
        'flex items-center gap-x-3 cursor-pointer w-full p-2 rounded-md',
        songIds && 'hover:bg-neutral-500/50'
      )}
    >
      <div className={'relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden'}>
        <Image
          src={song.imageUrl || '/liked.png'}
          alt={song.title}
          fill
          sizes={'h-[48px] w-[48px]'}
          className={'object-cover'}
        />
      </div>
      <div className={'flex flex-col gap-y-1 overflow-hidden'}>
        <p className={'text-white truncate'}>
          {song.title}
        </p>
        <p className={'text-neutral-400 text-sm truncate'}>
          {song.album}
        </p>
      </div>
    </div>
  )
}

export const LibraryItemSkeleton = () => {
  return (
    <div className={'flex items-center gap-x-3 cursor-pointer w-full p-2 rounded-md'}>
      <div className={'relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden'}>
        <Skeleton className={'h-[48px] w-[48px]'} />
      </div>
      <div className={'flex flex-col gap-y-3 overflow-hidden'}>
        <Skeleton className={'h-4 w-32'} />
        <Skeleton className={'h-4 w-32'} />
      </div>
    </div >
  )
}