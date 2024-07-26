'use client'

import { Trash } from 'lucide-react'
import Image from 'next/image'

import { Input } from '../ui/input'

interface Props {
  type: 'file' | 'image'
  disabled: boolean
  setFile: (file?: File) => void
  file?: File
  setPreviewUrl: (previewUrl: string) => void
  previewUrl?: string
}

export const UploadFile = ({
  type,
  disabled,
  setFile,
  file,
  setPreviewUrl,
  previewUrl,
}: Props) => {
  const handleClearUrl = () => {
    setPreviewUrl('')
  }

  return (
    <div className={'space-y-2'}>
      <div className={'flex gap-x-2 justify-between'}>
        {/* 預覽選擇的音樂 */}
        {previewUrl && type === 'file' && (
          <div className={'relative mt-2 w-full'}>
            <p>
              {file?.name}
            </p>
            {!disabled && (
              <Trash
                onClick={handleClearUrl}
                className={'absolute top-2 right-2 bg-red-500 rounded-md p-1 cursor-pointer'}
              />
            )}
          </div>
        )}
        {/* 預覽選擇的照片 */}
        {previewUrl && type === 'image' && (
          <div className={'relative mt-2 h-48 w-48'}>
            <Image
              src={previewUrl}
              alt={'Preview'}
              fill
              className={'rounded-md object-cover'}
            />
            {!disabled && (
              <Trash
                onClick={handleClearUrl}
                className={'absolute top-2 right-2 bg-red-500 rounded-md p-1 cursor-pointer'}
              />
            )}
          </div>
        )}

        {/* 新建音樂 */}
        {!previewUrl && type === 'file' && (
          <div className={'flex flex-col'}>
            <Input
              type={'file'}
              accept={'.mp3'}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) {
                  const objectUrl = URL.createObjectURL(selectedFile)

                  setPreviewUrl(objectUrl)
                  setFile(selectedFile)
                }
                // 清空輸入欄位值
                e.target.value = ''
              }}
              className={'focus-visible:ring-0 focus-visible:ring-offset-0'}
            />
          </div>
        )}
        {/* 新建照片 */}
        {!previewUrl && type === 'image' && (
          <div className={'flex flex-col'}>
            <Input
              type={'file'}
              accept={'image/*'}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) {
                  const objectUrl = URL.createObjectURL(selectedFile)

                  setPreviewUrl(objectUrl)
                  setFile(selectedFile)
                }
                // 清空輸入欄位值
                e.target.value = ''
              }}
              className={'focus-visible:ring-0 focus-visible:ring-offset-0'}
            />
          </div>
        )}
      </div>
    </div>
  )
}