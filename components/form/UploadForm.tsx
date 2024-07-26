'use client'

import { CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { UploadFile } from '../edgestore/UploadFile'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState, useTransition } from 'react'
import { useCreateSong } from '@/hooks/api/songs/useCreateSong'
import { useEdgeStore } from '@/lib/edgestore'
import { insertSongSchema } from '@/db/schema'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

// 在表單內選擇檔案後點擊上傳到Edgestore後，得到連結
// 在表單內選擇照片後點擊上傳到Edgestore後，得到連結
// 兩個連結都得到後才能提交

// 1. 提供schema給zod
const formSchema = insertSongSchema.pick({
  title: true,
  album: true,
  songUrl: true,
  imageUrl: true,
})

// 2. 表單屬性的型別
type FormValues = z.input<typeof formSchema>


interface Props {
  onClose: () => void
}

export const UploadForm = ({
  onClose,
}: Props) => {
  const songMutation = useCreateSong()
  const { edgestore } = useEdgeStore()

  const [isPending, startTransition] = useTransition()

  // 儲存檔案給edgestore上傳
  const [song, setSong] = useState<File>()
  // 紀錄上傳進度
  const [songProgress, setSongProgress] = useState<number>()
  // 儲存選擇的圖片產生的暫時連結或既有的圖片連結
  const [songPreviewUrl, setSongPreviewUrl] = useState<string>()

  // 儲存檔案給edgestore上傳
  const [image, setImage] = useState<File>()
  // 紀錄上傳進度
  const [imageProgress, setImageProgress] = useState<number>()
  // 儲存選擇的圖片產生的暫時連結或既有的圖片連結
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      album: '',
      songUrl: '',
      imageUrl: '',
    },
  })

  const handleUpload = async () => {
    if (song) {
      const uploadedSong = await edgestore.publicFiles.upload({
        file: song,
        onProgressChange: (process) => {
          setSongProgress(process)
        },
      })
      form.setValue('songUrl', uploadedSong.url)
    }
    if (image) {
      const uploadedImage = await edgestore.publicFiles.upload({
        file: image,
        onProgressChange: (process) => {
          setImageProgress(process)
        },
      })
      form.setValue('imageUrl', uploadedImage.url)
    }
  }

  const handleSubmit = (values: FormValues) => {
    startTransition(async () => {
      await handleUpload()

      const updatedValues = {
        ...values,
        songUrl: form.getValues('songUrl'),
        imageUrl: form.getValues('imageUrl'),
      }

      songMutation.mutate(
        updatedValues,
        {
          onSuccess: () => {
            onClose()
            toast.success('音樂已建立')
          },
          onError: () => {
            toast.error('音樂建立失敗!')
          },
        }
      )
    })
  }

  // const isPending = songMutation.isPending

  // 使用useEffect監聽當有變動時執行form.setValue
  // 表單的songUrl與imagePtah的input隱藏起來不需顯示
  useEffect(() => {
    if (songPreviewUrl !== undefined) {
      form.setValue('songUrl', songPreviewUrl)
    }
    if (imagePreviewUrl !== undefined) {
      console.log('hi')
      form.setValue('imageUrl', imagePreviewUrl)
    }
  }, [songPreviewUrl, imagePreviewUrl, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={'space-y-4'}
      >
        <FormField
          name={'title'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder={'樂曲名稱'}
                  className={'bg-neutral-700 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={'album'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Album
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder={'專輯'}
                  className={'bg-neutral-700 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 上傳音樂與照片 */}
        {/* 上傳成功之後會將連結紀錄給sonPath與imageUrl的input */}

        {/* 隱藏的input，提交songUrl與imageUrl */}
        <FormField
          name={'songUrl'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select a song song
              </FormLabel>
              <UploadFile
                type={'file'}
                disabled={isPending}
                setFile={setSong}
                file={song}
                setPreviewUrl={setSongPreviewUrl}
                previewUrl={songPreviewUrl}
              />
              <FormMessage />
              {songProgress !== undefined && songProgress !== 100 && (
                <div className={'flex justify-end'}>
                  上傳中... {songProgress}%
                </div>
              )}
              {songProgress === 100 && (
                <div className={'flex justify-end'}>
                  <CheckCheck className={'text-green-500'} />
                </div>
              )}
            </FormItem>
          )}
        />
        <FormField
          name={'imageUrl'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select a song image
              </FormLabel>
              <UploadFile
                type={'image'}
                disabled={isPending}
                setFile={setImage}
                file={image}
                setPreviewUrl={setImagePreviewUrl}
                previewUrl={imagePreviewUrl}
              />
              <FormMessage />
              {imageProgress !== undefined && imageProgress !== 100 && (
                <div className={'flex justify-end'}>
                  上傳中... {songProgress}%
                </div>
              )}
              {imageProgress === 100 && (
                <div className={'flex justify-end'}>
                  <CheckCheck className={'text-green-500'} />
                </div>
              )}
            </FormItem>
          )}
        />

        <Button
          disabled={isPending}
          className={'bg-green-400 w-full'}
        >
          Create
        </Button>
      </form>
    </Form >
  )
}