'use client'

import { useGetSongById } from '@/hooks/api/songs/useGetSongById'
import { usePlayer } from '@/hooks/play/usePlayer'
import { PlayerContent } from './PlayerContent'
import { SongType } from '@/db/schema'

export const PlayerBar = () => {
  // 取出當前撥放的音樂id
  const player = usePlayer()
  const songQuery = useGetSongById(player.activeId)

  if (!songQuery.data?.id || !player.activeId) {
    return null
  }

  return (
    <div className={'fixed bottom-0 bg-black w-full py-2 h-[80px] px-4'}>
      <PlayerContent
        // 似乎是給予key可以保持順序不會被破壞?
        // key={songQuery.data.id}
        song={songQuery.data}
      // songUrl={songQuery.data.songUrl}
      />
    </div>
  )
}