'use client'

import { Play } from 'lucide-react'
import { Button } from '../ui/button'

// 只是做一個icon而已沒有實際用處
// 但應該統一使用此icon
export const PlayButton = () => {
  return (
    <Button
      size={'sm'}
      variant={'ghost'}
      className={'rounded-full aspect-square p-0 bg-green-500 hover:bg-green-500 drop-shadow-md transition opacity-0 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110'}
    >
      <Play className={'fill-black text-black'} />
    </Button>
  )
}