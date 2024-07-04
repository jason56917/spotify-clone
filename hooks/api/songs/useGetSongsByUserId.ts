import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'

export const useGetSongsByUserId = () => {
  const query = useQuery({
    queryKey: ['upload'],
    queryFn: async () => {
      const response = await client.api['songs']['upload']['$get']()
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