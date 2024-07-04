'use client'

import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { insertSongSchema } from '@/db/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import { UploadFile } from '../edgestore/UploadFile'
import { useEffect, useState } from 'react'

// 應該在表單內選擇檔案後點擊上傳到Edgestore後，得到連結
// 應該在表單內選擇照片後點擊上傳到Edgestore後，得到連結
// 兩個連結都得到後才提交

// 1. 提供schema規範給zod
const formSchema = insertSongSchema.pick({
  title: true,
  album: true,
  songUrl: true,
  imageUrl: true,
})

// 2. 表單屬性的型別
type FormValues = z.input<typeof formSchema>

interface Props {
  id?: string
  disabled?: boolean
  defaultValues?: FormValues
  onSubmit: (values: FormValues) => void
  setSongUrl: (url: string) => void
  songUrl: string
  setImageUrl: (url: string) => void
  imageUrl: string
}

// 可以上傳新的音樂，也可以編輯音樂
export const UploadForm = (
  {
    id,
    disabled,
    defaultValues,
    onSubmit,
    setSongUrl,
    songUrl,
    setImageUrl,
    imageUrl,
  }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values: FormValues) => {
    onSubmit(values)
  }

  // 使用useEffect監聽當有變動時執行form.setValue
  // 表單的songUrl與imagePtah的input隱藏起來不需顯示
  useEffect(() => {
    if (songUrl) {
      form.setValue('songUrl', songUrl)
    }
    if (imageUrl) {
      form.setValue('imageUrl', imageUrl)
    }
  }, [songUrl, imageUrl, form])

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
                  disabled={disabled}
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
                  disabled={disabled}
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
        <UploadFile
          label={'Select a song file'}
          type={'file'}
          setUrl={setSongUrl}
          error={form.formState.errors.songUrl?.message}
        />
        <UploadFile
          label={'Select a song image'}
          type={'image'}
          setUrl={setImageUrl}
          error={form.formState.errors.imageUrl?.message}
        />

        {/* 隱藏的input，提交songUrl與imageUrl */}
        <FormField
          name={'songUrl'}
          control={form.control}
          render={({ field }) => (
            <FormItem className={'sr-only'}>
              <FormLabel>
                Select a song file
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={'imageUrl'}
          control={form.control}
          render={({ field }) => (
            <FormItem className={'sr-only'}>
              <FormLabel>
                Select a song image
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className={'bg-green-400 w-full'}
        >
          Create
        </Button>
      </form>
    </Form >
  )
}