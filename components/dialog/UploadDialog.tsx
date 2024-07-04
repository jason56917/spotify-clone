'use client'

import { useUploadDialog } from '@/hooks/dialog/useUploadDialog'

import { UploadForm } from '../form/UploadForm'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useCreateSong } from '@/hooks/api/songs/useCreateSong'
import { insertSongSchema } from '@/db/schema'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useEdgeStore } from '@/lib/edgestore'

const formSchema = insertSongSchema.pick({
  title: true,
  album: true,
  songUrl: true,
  imageUrl: true,
})
type FormValues = z.input<typeof formSchema>

export const UploadDialog = () => {
  const uploadDialog = useUploadDialog()
  const songMutation = useCreateSong()
  const { edgestore } = useEdgeStore()

  // 在此設置useState來記錄上傳到edgestore後的url
  // 藉由將該狀態props到UploadFile來取得url
  const [songUrl, setSongUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = (values: FormValues) => {
    songMutation.mutate(
      values,
      {
        onSuccess: () => {
          uploadDialog.onClose()
          toast.success('音樂已建立')
        },
        onError: () => {
          toast.error('音樂建立失敗!')
        },
      }
    )
  }

  const handleCleanFile = async () => {
    try {
      if (songUrl) {
        await edgestore.publicFiles.delete({ url: songUrl })
      }
      if (imageUrl) {
        await edgestore.publicFiles.delete({ url: imageUrl })
      }
      if (songUrl || imageUrl) {
        toast.success('上傳檔案已刪除!')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = async () => {
    await handleCleanFile()
    uploadDialog.onClose()
  }

  return (
    <Dialog
      open={uploadDialog.isOpen}
      onOpenChange={handleChange}
    >
      <DialogContent className={'bg-neutral-900'}>
        <DialogHeader>
          <DialogTitle>
            Add a song
          </DialogTitle>
          <DialogDescription>
            Upload an mp3 file
          </DialogDescription>
        </DialogHeader>
        <UploadForm
          disabled={songMutation.isPaused}
          defaultValues={{
            title: '',
            album: '',
            songUrl: '',
            imageUrl: '',
          }}
          onSubmit={handleSubmit}
          setSongUrl={setSongUrl}
          songUrl={songUrl}
          setImageUrl={setImageUrl}
          imageUrl={imageUrl}
        />
        {/* <DialogFooter>
          <Button
            disabled={false}
            onSubmit={handleSubmit}
          >
            Submit
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}