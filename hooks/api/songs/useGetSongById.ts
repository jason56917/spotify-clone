import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'

export const useGetSongById = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['songs', { id }],
    queryFn: async () => {
      const response = await client.api['songs'][':id']['$get']({
        param: { id },
      })
      // 這不是axios，不能用try catch來接住錯誤
      if (!response.ok) {
        throw new Error('Failed to fetch song')
      }

      const { data } = await response.json()
      if (!data) {
        throw new Error('No data found')
      }

      return {
        ...data,
        createdAt: new Date(data.createdAt),
      }
    },
  })

  return query
}