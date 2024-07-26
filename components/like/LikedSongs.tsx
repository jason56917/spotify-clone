'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { PlayButton } from '../songs/PlayButton'

interface Props {
  image: string
  name: string
  href: string
}

export const LikedSongs = ({
  image,
  name,
  href,
}: Props) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <div
      onClick={handleClick}
      className={'relative w-52 h-12 group flex p-0 items-center justify-start rounded-md overflow-hidden gap-x-2 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4'}
    >
      <div className={'relative min-h-[64px] min-w-[64px]'}>
        <Image
          src={image}
          alt={'liked'}
          fill
          sizes={'h-[64px] w-[64px]'}
          className={'object-cover'}
        />
      </div>
      <p className={'font-medium truncate text-base text-white'}>
        {name}
      </p>
      <div className={'absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 drop-shadow-md right-1 group-hover:opacity-100 hover:scale-110'}>
        <PlayButton />
      </div>
    </div>
  )
}