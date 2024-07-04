'use client'

import { SongType } from '@/db/schema'
import Image from 'next/image'
import { PlayButton } from './PlayButton'
import { usePlayer } from '@/hooks/play/usePlayer'
import { Skeleton } from '../ui/skeleton'

interface Props {
  song: SongType
  songIds: string[]
}

export const SongItem = ({
  song,
  songIds,
}: Props) => {
  const player = usePlayer()

  const handleClick = (songId: string) => {
    player.setId(songId)
    player.setIds(songIds)
  }

  return (
    <div
      onClick={() => handleClick(song.id)}
      className={'relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3'}
    >
      <div className={'relative aspect-square w-full h-full rounded-md overflow-hidden'}>
        <Image
          src={song.imageUrl || '/liked.png'}
          alt={song.title}
          fill
          className={'object-cover'}
        />
      </div>
      <div className={'flex flex-col items-start w-full pt-4 gap-y-1'}>
        <p className={'font-semibold truncate w-full'}>
          {song.title}
        </p>
        <p className={'text-neutral-400 text-sm w-full truncate'}>
          {song.album}
        </p>
      </div>
      <div className={'absolute bottom-8 right-3'}>
        <PlayButton />
      </div>
    </div>
  )
}

export const SongItemSkeleton = () => {
  return (
    <Skeleton className={'flex flex-col items-center p-3'}>
      <Skeleton className={'w-28 h-28 bg-neutral-900'} />
      <Skeleton className={'w-28 h-4 mt-4 bg-neutral-900'} />
      <Skeleton className={'w-28 h-4 mt-4 bg-neutral-900'} />
    </Skeleton>
  )
}