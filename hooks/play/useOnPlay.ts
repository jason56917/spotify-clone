import { SongType } from '@/db/schema'
import { usePlayer } from './usePlayer'

export const useOnPlay = (songs: SongType[]) => {
  const player = usePlayer()

  const handlePlay = (songId: string) => {
    player.setId(songId)
    player.setIds(songs.map((song) => song.id))
  }

  return handlePlay
}