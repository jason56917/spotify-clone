import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'

export const useGetSongs = () => {
  const query = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const response = await client.api.songs['$get']()
      if (!response.ok) {
        throw new Error('Failed to fetch songs')
      }

      const { data } = await response.json()

      return data.map((song) => ({
        ...song,
        createdAt: new Date(song.createdAt),
      }))
    },
  })

  return query
}