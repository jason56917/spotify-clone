'use client'

import { ListMusic, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useGetSongsByUserId } from '@/hooks/api/songs/useGetSongsByUserId'
import { useUploadDialog } from '@/hooks/dialog/useUploadDialog'

import { LibraryItem, LibraryItemSkeleton } from './LibraryItem'

export const Library = () => {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const uploadDialog = useUploadDialog()
  const songsByUserIdQuery = useGetSongsByUserId()

  const isLoading = songsByUserIdQuery.isLoading

  const handleClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
    } else {
      uploadDialog.onOpen()
    }
  }

  return (
    <div className={'flex flex-col'}>
      <div className={'flex items-center justify-between px-5 pt-4'}>
        <div className={'inline-flex items-center gap-x-2'}>
          <ListMusic className={'size-5 text-muted-foreground'} />
          <p className={'text-muted-foreground font-medium'}>
            Your uploaded songs
          </p>
        </div>
        <Plus
          onClick={handleClick}
          className={'size-4 text-muted-foreground cursor-pointer hover:text-white transition'}
        />
      </div>
      <div className={'flex flex-col gap-y-2 mt-4 px-3'}>
        {!isSignedIn && (
          <div>
            Not signed in
          </div>
        )}
        {isSignedIn && isLoading
          ? (
            <div>
              <LibraryItemSkeleton />
              <LibraryItemSkeleton />
              <LibraryItemSkeleton />
            </div>
          )
          : (
            <>
              {isSignedIn && songsByUserIdQuery.data?.length === 0 && (
                <div className={'mt-4 text-neutral-400'}>
                  Music not uploaded yet
                </div>
              )}
              {songsByUserIdQuery.data?.map((song) => (
                <LibraryItem
                  key={song.id}
                  song={song}
                  songIds={songsByUserIdQuery.data.map((song) => song.id)}
                />
              ))}
            </>
          )
        }
      </div>
    </div>
  )
}