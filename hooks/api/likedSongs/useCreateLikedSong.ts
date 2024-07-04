import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api['liked-songs'][':songId']['$post']>
type RequestType = InferRequestType<typeof client.api['liked-songs'][':songId']['$post']>['param']

export const useCreateLikedSong = (songId: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api['liked-songs'][':songId']['$post']({
        param: { songId },
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Music liked')
      queryClient.invalidateQueries({ queryKey: ['likedSong', { songId }] })
      queryClient.invalidateQueries({ queryKey: ['likedSongs'] })
    },
    onError: () => {
      toast.error('Failed to like music')
    },
  })

  return mutation
}