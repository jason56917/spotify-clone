'use client'

import { useGetSongs } from '@/hooks/api/songs/useGetSongs'
import { LibraryItem, LibraryItemSkeleton } from '../sidebar/LibraryItem'
import { LikeButton, LikeButtonSkeleton } from '../like/LikeButton'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '../ui/skeleton'

export const SearchContent = () => {
  const songsQuery = useGetSongs()
  const isLoading = songsQuery.isLoading
  // 使用param取得查詢參數
  const param = useSearchParams()
  // 指定參數title
  const title = param.get('title')
    ?.toLowerCase() || ''

  // 部分符合即可
  const searchResult = songsQuery.data?.filter((song) => song.title.toLowerCase()
    .includes(title))

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

  if (searchResult?.length === 0) {
    return (
      <div className={'flex flex-col gap-y-2 w-full px-6 text-neutral-400'}>
        No music found.
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-y-2 w-full px-6'}>
      {searchResult?.map((song) => (
        <div
          key={song.id}
          className={'flex items-center gap-x-4 w-full'}
        >
          <div className={'flex-1'}>
            <LibraryItem
              song={song}
              songs={songsQuery.data}
            />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  )
}