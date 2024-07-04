'use client'

import { SongType } from '@/db/schema'
import { LikeButton } from '../like/LikeButton'
import { LibraryItem } from '../sidebar/LibraryItem'
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/hooks/play/usePlayer'
import useSound from 'use-sound'
import { Slider } from '../ui/slider'

interface Props {
  song: SongType
}

export const PlayerContent = ({
  song,
}: Props) => {
  const player = usePlayer()

  const [volume, setVolume] = useState(100)
  const [isPlaying, setIsPlaying] = useState(false)

  const isPlay = isPlaying
  const isMuted = volume === 0

  const handlePlayNext = () => {
    if (player.ids.length === 0) {
      return
    }

    const currentSongIndex = player.ids.findIndex((id) => id === player.activeId)
    const nextSong = player.ids[currentSongIndex + 1]

    if (!nextSong) {
      return player.setId(player.ids[0])
    }

    player.setId(nextSong)
  }
  const handlePlayPrevious = () => {
    if (player.ids.length === 0) {
      return
    }

    const currentSongIndex = player.ids.findIndex((id) => id === player.activeId)
    const previousSong = player.ids[currentSongIndex - 1]

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1])
    }

    player.setId(previousSong)
  }

  const [play, { pause, sound }] = useSound(
    song.songUrl,
    {
      volume: volume / 100,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false)
        handlePlayNext()
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3'],
    }
  )

  const handlePlay = () => {
    if (!isPlaying) {
      play()
    } else {
      pause()
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(100)
    } else {
      setVolume(0)
    }
  }

  useEffect(() => {
    sound?.play()

    return () => {
      sound?.unload()
    }
  }, [sound])

  return (
    <>
      <div className={'flex sm:hidden h-full justify-around'}>
        <div className={'flex items-center justify-start'}>
          <div className={'w-40'}>
            <LibraryItem song={song} />
          </div>
          {song && (
            <LikeButton songId={song.id} />
          )}
        </div>

        <div className={'flex flex-col h-full w-full items-center justify-center mr-4'}>
          <div className={'flex gap-x-2 items-center justify-center mx-auto'}>
            <SkipBack
              size={20}
              onClick={handlePlayPrevious}
              className={'text-neutral-400 cursor-pointer hover:text-white transition'}
            />
            <div
              onClick={handlePlay}
              className={'flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'}
            >
              {isPlay
                ? (
                  <Pause
                    size={20}
                    className={'text-black fill-black'}
                  />
                )
                : (
                  <Play
                    size={20}
                    className={'text-black fill-black'}
                  />
                )
              }
            </div>
            <SkipForward
              size={20}
              onClick={handlePlayNext}
              className={'text-neutral-400 cursor-pointer hover:text-white transition'}
            />
          </div>

          <div className={'flex gap-x-2 items-center justify-center'}>
            <div
              onClick={toggleMute}
              className={'flex items-center pt-2'}
            >
              {isMuted
                ? (
                  <VolumeX
                    size={15}
                    className={'cursor-pointer'}
                  />
                )
                : (
                  <Volume2
                    size={15}
                    className={'cursor-pointer'}
                  />
                )
              }
            </div>
            <Slider
              value={[volume]}
              onValueChange={([value]) => setVolume(value)}
              className={'w-16 pt-2 cursor-pointer'}
            />
          </div>
        </div>
        <div
          onClick={player.reset}
          className={'relative w-5 h-5'}
        >
          <X
            size={20}
            className={'absolute top-0 right-0 cursor-pointer'}
          />
        </div>
      </div>

      <div className={'hidden sm:flex h-full justify-evenly'}>
        <div className={'flex items-center justify-start w-64'}>

          <LibraryItem song={song} />

          {song && (
            <LikeButton songId={song.id} />
          )}
        </div>

        <div className={'flex h-full w-full items-center'}>
          <div className={'flex flex-1 gap-x-2 items-center justify-center'}>
            <SkipBack
              size={25}
              onClick={handlePlayPrevious}
              className={'text-neutral-400 cursor-pointer hover:text-white transition'}
            />
            <div
              onClick={handlePlay}
              className={'flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'}
            >
              {isPlay
                ? (
                  <Pause
                    size={25}
                    className={'text-black fill-black'}
                  />
                )
                : (
                  <Play
                    size={25}
                    className={'text-black fill-black'}
                  />
                )
              }
            </div>
            <SkipForward
              size={25}
              onClick={handlePlayNext}
              className={'text-neutral-400 cursor-pointer hover:text-white transition'}
            />
          </div>
        </div>

        <div className={'flex gap-x-2 items-center justify-end mr-3'}>
          <div
            onClick={toggleMute}
            className={'flex items-center]'}
          >
            {isMuted
              ? (
                <VolumeX
                  size={25}
                  className={'cursor-pointer'}
                />
              )
              : (
                <Volume2
                  size={25}
                  className={'cursor-pointer'}
                />
              )
            }
          </div>
          <Slider
            value={[volume]}
            onValueChange={([value]) => setVolume(value)}
            className={'w-32 cursor-pointer'}
          />
          <div
            onClick={player.reset}
            className={'relative w-5 h-5'}
          >
            <X
              size={20}
              className={'absolute -top-5 -right-3 cursor-pointer'}
            />
          </div>
        </div>
      </div>
    </>
  )
}