'use client'

import { useGetSongs } from '@/hooks/api/songs/useGetSongs'
import { SongItem, SongItemSkeleton } from './SongItem'

export const SongsList = () => {
  const songsQuery = useGetSongs()

  const isLoading = songsQuery.isLoading

  // 讀取中
  if (isLoading) {
    return (
      <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4'}>
        <SongItemSkeleton />
        <SongItemSkeleton />
        <SongItemSkeleton />
      </div>
    )
  }

  // 如果沒有資料
  if (songsQuery.data?.length === 0) {
    return (
      <div className={'mt-4 text-neutral-400'}>
        No music available
      </div>
    )
  }

  return (
    <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4'}>
      {songsQuery.data?.map((song) => (
        <SongItem
          key={song.id}
          song={song}
          songIds={songsQuery.data.map((song) => song.id)}
        />
      ))}
    </div>
  )
}