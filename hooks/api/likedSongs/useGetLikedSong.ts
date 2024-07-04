import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'

export const useGetLikedSong = (songId?: string) => {
  const query = useQuery({
    enabled: !!songId,
    queryKey: ['likedSong', { songId }],
    queryFn: async () => {
      const response = await client.api['liked-songs'][':songId']['$get']({
        param: { songId },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch song')
      }

      const { data } = await response.json()

      return data
    },
  })

  return query
}