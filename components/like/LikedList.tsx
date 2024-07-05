'use client'

import { useGetLikedSongs } from '@/hooks/api/likedSongs/useGetLikedSongs'

import { LibraryItem, LibraryItemSkeleton } from '../sidebar/LibraryItem'
import { LikeButton, LikeButtonSkeleton } from './LikeButton'

export const LikedList = () => {
  const likedSongsQuery = useGetLikedSongs()

  if (likedSongsQuery.data?.length === 0) {
    return (
      <div className={'flex flex-col gap-y-2 w-full px-6 text-neutral-400'}>
        No liked music.
      </div>
    )
  }

  const isLoading = likedSongsQuery.isLoading

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-y-2 w-full px-6'}>
        <div className={'flex items-center'}>
          <LibraryItemSkeleton />
          <LikeButtonSkeleton />
        </div>
        <div className={'flex items-center'}>
          <LibraryItemSkeleton />
          <LikeButtonSkeleton />
        </div>
        <div className={'flex items-center'}>
          <LibraryItemSkeleton />
          <LikeButtonSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-y-2 w-full px-6'}>
      {likedSongsQuery.data?.map((song) => (
        <div
          key={song.id}
          className={'flex items-center gap-x-4 w-full'}
        >
          <div className={'flex-1'}>
            <LibraryItem
              song={song.song}
              songIds={likedSongsQuery.data.map((song) => song.songId)}
            />
          </div>
          <LikeButton songId={song.song.id} />
        </div>
      ))}
    </div>
  )
}