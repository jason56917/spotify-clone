'use client'

import { useEdgeStore } from '@/lib/edgestore'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  type: 'file' | 'image'
  setUrl: (url: string) => void
  error?: string
}

export const UploadFile = ({
  label,
  type,
  setUrl,
  error,
}: Props) => {
  const [file, setFile] = useState<File>()
  const [progress, setProgress] = useState<number>()
  const { edgestore } = useEdgeStore()

  return (
    <div className={'space-y-2'}>
      <Label
        className={cn(
          error && 'text-red-900'
        )}
      >
        {label}
      </Label>
      <div className={'flex gap-x-2 justify-between'}>
        {!file
          ? (
            <>
              {type === 'file' && (
                <div className={'flex flex-col'}>
                  <Input
                    type={'file'}
                    accept={'.mp3'}
                    onChange={(e) => {
                      setFile(e.target.files?.[0])
                    }}
                    className={'bg-neutral-700 placeholder:text-neutral-400 file:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0'}
                  />
                  {error && (
                    <p className={'text-sm text-red-900 mt-1'}>
                      {error}
                    </p>
                  )}
                </div>
              )}
              {type === 'image' && (
                <div className={'flex flex-col'}>
                  <Input
                    type={'file'}
                    accept={'image/*'}
                    onChange={(e) => {
                      setFile(e.target.files?.[0])
                    }}
                    className={'bg-neutral-700 placeholder:text-neutral-400 file:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0'}
                  />
                  {error && (
                    <p className={'text-sm text-red-900 mt-1'}>
                      {error}
                    </p>
                  )}
                </div>
              )}
            </>
          )
          : (
            <>
              {type === 'file' && (
                <p className={'flex items-center justify-center truncate'}>{file.name}</p>
              )}
              {type === 'image' && (
                <p className={'flex items-center justify-center truncate'}>{file.name}</p>
              )}
            </>
          )
        }
        {progress && progress !== 0 && progress !== 100 && (
          <p >{progress}%</p>
        )}
        {progress === 100 && (
          <div >
            <CheckCheck className={'text-green-400'} />
          </div>
        )}
        {!progress && progress !== 0 && (
          <Button
            type={'button'}
            disabled={!file}
            variant={'secondary'}
            onClick={async () => {
              if (file) {
                const res = await edgestore.publicFiles.upload({
                  file,
                  onProgressChange: (process) => {
                    // 可以顯示上傳進度
                    setProgress(process)
                  },
                })
                setUrl(res.url)
              }
            }}
          >
            點選上傳
          </Button>
        )}
      </div>
    </div>
  )
}