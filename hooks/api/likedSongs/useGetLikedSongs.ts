import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'

export const useGetLikedSongs = () => {
  const query = useQuery({
    queryKey: ['likedSongs'],
    queryFn: async () => {
      const response = await client.api['liked-songs']['$get']()
      if (!response.ok) {
        throw new Error('Failed to fetch liked songs')
      }

      const { data } = await response.json()
      return data?.map((songs) => ({
        ...songs,
        song: {
          ...songs.song,
          createdAt: new Date(songs.song.createdAt),
        },
      }))
    },
  })

  return query
}