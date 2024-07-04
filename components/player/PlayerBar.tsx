'use client'

import { useGetSongById } from '@/hooks/api/songs/useGetSongById'
import { usePlayer } from '@/hooks/play/usePlayer'
import { PlayerContent } from './PlayerContent'

export const PlayerBar = () => {
  // 取出當前撥放的音樂id
  const player = usePlayer()
  // 隨著當前音樂id變動抓取音樂
  const songQuery = useGetSongById(player.activeId)

  if (!songQuery.data?.id || !player.activeId) {
    return null
  }

  return (
    <div className={'fixed bottom-0 bg-black w-full py-2 h-[120px] sm:h-[80px] px-4'}>
      <PlayerContent
        song={songQuery.data}
      />
    </div>
  )
}