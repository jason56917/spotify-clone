import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api['liked-songs'][':songId']['$delete']>
type RequestType = InferRequestType<typeof client.api['liked-songs'][':songId']['$delete']>['param']

export const useDeleteLikedSong = (songId: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api['liked-songs'][':songId']['$delete']({
        param: { songId },
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Music disliked')
      queryClient.invalidateQueries({ queryKey: ['likedSong', { songId }] })
      queryClient.invalidateQueries({ queryKey: ['likedSongs'] })
    },
    onError: () => {
      toast.error('Failed to dislike music')
    },
  })

  return mutation
}