'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useGetLikedSong } from '@/hooks/api/likedSongs/useGetLikedSong'
import { useCreateLikedSong } from '@/hooks/api/likedSongs/useCreateLikedSong'
import { useDeleteLikedSong } from '@/hooks/api/likedSongs/useDeleteLikedSong'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

interface Props {
  songId: string
}

export const LikeButton = ({
  songId,
}: Props) => {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const likedSongQuery = useGetLikedSong(songId)
  const likeSongMutation = useCreateLikedSong(songId)
  const dislikeSongMutation = useDeleteLikedSong(songId)

  const isLiked = !!likedSongQuery.data?.id

  const isLoading = likedSongQuery.isLoading
  const isPending = likeSongMutation.isPending || dislikeSongMutation.isPending

  const handleLike = (songId: string) => {
    if (!isSignedIn) {
      router.push('sign-in')
    }

    // 如果是已經加入最愛的音樂，就取消
    if (isLiked) {
      dislikeSongMutation.mutate({
        songId,
      })
    } else {
      // 如果不存在，就加入最愛的音樂
      likeSongMutation.mutate({
        songId,
      })
    }
  }

  return (
    <Button
      disabled={isLoading || isPending}
      variant={'ghost'}
      onClick={() => handleLike(songId)}
      className={'hover:bg-transparent hover:opacity-75 transition'}
    >
      <Heart className={cn(isLiked && 'fill-green-500 text-green-500')} />
    </Button>
  )
}

export const LikeButtonSkeleton = () => {
  return (
    <div className={'flex items-center justify-center pr-1'}>
      <Skeleton className={'w-12 h-12'} />
    </div>
  )
}