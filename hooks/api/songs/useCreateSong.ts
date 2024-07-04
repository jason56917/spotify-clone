import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'
import { toast } from 'sonner'

type ResponseType = InferResponseType<typeof client.api.songs['$post']>
type RequestType = InferRequestType<typeof client.api.songs['$post']>['json']

export const useCreateSong = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.songs['$post']({ json })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Song created')
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      queryClient.invalidateQueries({ queryKey: ['upload'] })
    },
    onError: () => {
      toast.error('Failed to create song')
    },
  })

  return mutation
}