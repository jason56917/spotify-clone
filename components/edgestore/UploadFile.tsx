'use client'

import { useEdgeStore } from '@/lib/edgestore'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { CheckCheck } from 'lucide-react'

interface Props {
  label: string
  type: 'file' | 'image'
  setUrl: (url: string) => void
  url: string
}

export const UploadFile = ({
  label,
  type,
  setUrl,
  url,
}: Props) => {
  const [file, setFile] = useState<File>()
  const [progress, setProgress] = useState<number>()
  const { edgestore } = useEdgeStore()

  return (
    <div className={'space-y-2'}>
      <Label>
        {label}
      </Label>
      <div className={'flex gap-x-2 justify-between'}>
        {!file
          ? (
            <>
              {type === 'file' && (
                <Input
                  type={'file'}
                  accept={'.mp3'}
                  onChange={(e) => {
                    setFile(e.target.files?.[0])
                  }}
                  className={'bg-neutral-700 placeholder:text-neutral-400 file:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0'}
                />
              )}
              {type === 'image' && (
                <Input
                  type={'file'}
                  accept={'image/*'}
                  onChange={(e) => {
                    setFile(e.target.files?.[0])
                  }}
                  className={'bg-neutral-700 placeholder:text-neutral-400 file:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0'}
                />
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